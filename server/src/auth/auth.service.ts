import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

// Parses durations like "15m", "30d", "24h", "3600s" into milliseconds.
function durationToMs(ttl: string): number {
  const m = /^(\d+)([smhd])$/.exec(ttl.trim());
  if (!m) return 15 * 60 * 1000;
  const n = parseInt(m[1], 10);
  return n * { s: 1000, m: 60000, h: 3600000, d: 86400000 }[m[2] as 's' | 'm' | 'h' | 'd'];
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) throw new UnauthorizedException('Неверный логин или пароль');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Неверный логин или пароль');
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    return this.issueTokens(user);
  }

  async refresh(refreshToken: string) {
    let payload: { sub: string };
    try {
      payload = await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Недействительный refresh-токен');
    }

    // Find a matching, non-revoked, non-expired stored token.
    const tokens = await this.prisma.refreshToken.findMany({
      where: { userId: payload.sub, revokedAt: null, expiresAt: { gt: new Date() } },
    });
    const match = await this.firstMatching(tokens, refreshToken);
    if (!match) throw new UnauthorizedException('Сессия недействительна');

    // Rotate: revoke the used token, issue a fresh pair.
    await this.prisma.refreshToken.update({ where: { id: match.id }, data: { revokedAt: new Date() } });
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || !user.isActive) throw new UnauthorizedException('Пользователь недоступен');
    return this.issueTokens(user);
  }

  async logout(userId: string, refreshToken: string) {
    const tokens = await this.prisma.refreshToken.findMany({
      where: { userId, revokedAt: null },
    });
    const match = await this.firstMatching(tokens, refreshToken);
    if (match) {
      await this.prisma.refreshToken.update({ where: { id: match.id }, data: { revokedAt: new Date() } });
    }
    return { success: true };
  }

  private async firstMatching(tokens: { id: string; tokenHash: string }[], raw: string) {
    for (const t of tokens) {
      if (await bcrypt.compare(raw, t.tokenHash)) return t;
    }
    return null;
  }

  private async issueTokens(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessTtl = this.config.get<string>('JWT_ACCESS_TTL') || '15m';
    const refreshTtl = this.config.get<string>('JWT_REFRESH_TTL') || '30d';

    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.config.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: accessTtl,
    });
    const refreshToken = await this.jwt.signAsync(
      { sub: user.id },
      { secret: this.config.get<string>('JWT_REFRESH_SECRET'), expiresIn: refreshTtl },
    );

    // Store only a hash of the refresh token.
    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: await bcrypt.hash(refreshToken, 10),
        expiresAt: new Date(Date.now() + durationToMs(refreshTtl)),
      },
    });

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  }
}
