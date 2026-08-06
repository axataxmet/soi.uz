import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
  PutBucketPolicyCommand,
} from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { mkdir, unlink, writeFile } from 'fs/promises';
import { extname, join } from 'path';

function publicReadPolicy(bucket: string): string {
  return JSON.stringify({
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: '*',
        Action: ['s3:GetObject'],
        Resource: [`arn:aws:s3:::${bucket}/*`],
      },
    ],
  });
}

// Thin S3 wrapper — works with MinIO and any S3-compatible storage (forcePathStyle).
@Injectable()
export class S3Service implements OnModuleInit {
  private readonly logger = new Logger('S3');
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;
  private readonly endpoint?: string;
  private readonly localFallback: boolean;
  private readonly localUploadDir: string;
  private readonly localPublicUrl: string;

  constructor(config: ConfigService) {
    this.bucket = config.get<string>('S3_BUCKET') || 'soi-media';
    this.publicUrl = (config.get<string>('S3_PUBLIC_URL') || '').replace(/\/$/, '');
    this.endpoint = config.get<string>('S3_ENDPOINT') || undefined;
    this.localUploadDir = config.get<string>('MEDIA_UPLOAD_DIR') || join(process.cwd(), 'uploads');
    /* Относительный по умолчанию. Абсолютный «http://localhost:4000/uploads»
       записывался прямо в базу и уезжал вместе с ней куда угодно: на проде и
       через туннель такая ссылка ведёт на машину посетителя, а не на сервер.
       Файлы раздаёт тот же origin, что и сайт — nginx в проде, dev-server
       локально, — поэтому базы в ссылке быть не должно. */
    this.localPublicUrl = (config.get<string>('MEDIA_PUBLIC_URL') || '/uploads').replace(/\/$/, '');
    this.localFallback =
      (config.get<string>('NODE_ENV') || 'development') !== 'production' &&
      config.get<string>('MEDIA_LOCAL_FALLBACK') !== 'false';
    this.client = new S3Client({
      endpoint: this.endpoint,
      region: config.get<string>('S3_REGION') || 'us-east-1',
      forcePathStyle: true,
      credentials: {
        accessKeyId: config.get<string>('S3_ACCESS_KEY') || '',
        secretAccessKey: config.get<string>('S3_SECRET_KEY') || '',
      },
    });
  }

  // Ensure the bucket exists + is publicly readable. Non-fatal if storage is down at boot.
  async onModuleInit() {
    if (!this.endpoint) return;
    try {
      try {
        await this.client.send(new HeadBucketCommand({ Bucket: this.bucket }));
      } catch {
        await this.client.send(new CreateBucketCommand({ Bucket: this.bucket }));
        this.logger.log(`Bucket "${this.bucket}" created`);
      }
      // Applied on every boot, not just on create: a bucket provisioned by hand
      // (MinIO console, mc, ops script) otherwise stays private and every media
      // URL the API hands out answers 403.
      await this.client.send(
        new PutBucketPolicyCommand({ Bucket: this.bucket, Policy: publicReadPolicy(this.bucket) }),
      );
    } catch (e) {
      this.logger.warn(`Media storage not ready (bucket init skipped): ${(e as Error).message}`);
    }
  }

  async upload(buffer: Buffer, originalName: string, mime: string) {
    const ext = extname(originalName || '') || this.extFromMime(mime);
    const key = `${new Date().toISOString().slice(0, 10)}/${randomUUID()}${ext}`;
    if (this.endpoint) {
      try {
        await this.client.send(
          new PutObjectCommand({ Bucket: this.bucket, Key: key, Body: buffer, ContentType: mime }),
        );
        return { key, url: `${this.publicUrl}/${this.bucket}/${key}` };
      } catch (e) {
        if (!this.localFallback) throw e;
        this.logger.warn(`S3 upload failed, saved locally instead: ${(e as Error).message}`);
      }
    }

    if (!this.localFallback) {
      throw new Error('Media storage is not configured');
    }

    const localKey = `local/${key}`;
    const target = join(this.localUploadDir, key);
    await mkdir(join(this.localUploadDir, key.split('/')[0]), { recursive: true });
    await writeFile(target, buffer);
    return { key: localKey, url: `${this.localPublicUrl}/${key}` };
  }

  async remove(key: string) {
    if (key.startsWith('local/')) {
      const rel = key.slice('local/'.length);
      try {
        await unlink(join(this.localUploadDir, rel));
      } catch {
        // local file may already be gone
      }
      return;
    }
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }

  private extFromMime(mime: string) {
    if (mime === 'image/png') return '.png';
    if (mime === 'image/jpeg') return '.jpg';
    if (mime === 'image/webp') return '.webp';
    if (mime === 'application/pdf') return '.pdf';
    return '';
  }
}
