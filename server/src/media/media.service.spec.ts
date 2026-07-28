import { BadRequestException } from '@nestjs/common';
import { MediaService } from './media.service';
import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from './s3.service';

/* Upload validation is the app's only guard against a file whose declared type
   lies about its contents — it is worth pinning precisely. */
const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
const JPEG = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0, 0, 0, 0]);
const PDF = Buffer.from('%PDF-1.7 rest of the document');
const MP4 = Buffer.concat([Buffer.from([0, 0, 0, 0x18]), Buffer.from('ftypisom'), Buffer.alloc(8)]);

function file(over: Partial<Express.Multer.File> = {}): Express.Multer.File {
  return {
    originalname: 'photo.png',
    mimetype: 'image/png',
    buffer: PNG,
    size: PNG.length,
    ...over,
  } as Express.Multer.File;
}

describe('MediaService.upload', () => {
  const s3 = { upload: jest.fn() };
  const create = jest.fn();
  const service = new MediaService(
    { mediaFile: { create } } as unknown as PrismaService,
    s3 as unknown as S3Service,
  );

  beforeEach(() => {
    s3.upload.mockReset().mockResolvedValue({ key: 'k', url: 'http://media/k' });
    create.mockReset().mockImplementation(({ data }) => Promise.resolve({ id: 'm1', ...data }));
  });

  it('stores an accepted file and records it', async () => {
    const result = await service.upload(file(), 'user-1');

    expect(s3.upload).toHaveBeenCalledWith(PNG, 'photo.png', 'image/png');
    expect(result).toMatchObject({ id: 'm1', url: 'http://media/k', uploadedById: 'user-1' });
  });

  it.each([
    ['jpeg', { originalname: 'p.jpg', mimetype: 'image/jpeg', buffer: JPEG }],
    ['pdf', { originalname: 'd.pdf', mimetype: 'application/pdf', buffer: PDF }],
    ['mp4', { originalname: 'v.mp4', mimetype: 'video/mp4', buffer: MP4 }],
  ])('accepts %s', async (_name, over) => {
    await expect(service.upload(file({ ...over, size: 1024 }))).resolves.toBeDefined();
  });

  it('rejects a type that is not allowed at all', async () => {
    const svg = file({ originalname: 'x.svg', mimetype: 'image/svg+xml', buffer: Buffer.from('<svg/>') });

    await expect(service.upload(svg)).rejects.toBeInstanceOf(BadRequestException);
    expect(s3.upload).not.toHaveBeenCalled();
  });

  it('rejects an extension that contradicts the declared type', async () => {
    await expect(service.upload(file({ originalname: 'photo.jpg' }))).rejects.toThrow(
      /Расширение файла не соответствует/,
    );
  });

  it('rejects contents that do not match the declared type', async () => {
    // A script renamed to .png and announced as an image.
    const disguised = file({ buffer: Buffer.from('<?php echo 1; ?>') });

    await expect(service.upload(disguised)).rejects.toThrow(/Содержимое файла не соответствует/);
    expect(s3.upload).not.toHaveBeenCalled();
  });

  it('rejects an image over the 15 MB limit', async () => {
    await expect(service.upload(file({ size: 16 * 1024 * 1024 }))).rejects.toThrow(/слишком большой/);
  });

  it('allows video past the image limit but not past its own', async () => {
    const video = { originalname: 'v.mp4', mimetype: 'video/mp4', buffer: MP4 };

    await expect(service.upload(file({ ...video, size: 40 * 1024 * 1024 }))).resolves.toBeDefined();
    await expect(service.upload(file({ ...video, size: 120 * 1024 * 1024 }))).rejects.toThrow(/слишком большой/);
  });

  it('rejects a request with no file attached', async () => {
    await expect(service.upload(undefined as unknown as Express.Multer.File)).rejects.toThrow(/Файл не передан/);
  });
});
