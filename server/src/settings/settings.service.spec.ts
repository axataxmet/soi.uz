import { SettingsService } from './settings.service';
import { PrismaService } from '../prisma/prisma.service';

/* The "missing setting" shape is load-bearing: the frontend reads it on every
   render and a null once took the whole site down when it was treated as a value.
   Pin the contract so it can't drift into a 404 (which would also defeat the
   client's negative caching). */
describe('SettingsService.get', () => {
  const findUnique = jest.fn();
  const service = new SettingsService({ setting: { findUnique } } as unknown as PrismaService);

  beforeEach(() => findUnique.mockReset());

  it('returns the stored setting when it exists', async () => {
    const stored = { key: 'site_seo', value: { title: 'ИНДУСТРИЯ ЗДОРОВЬЯ' } };
    findUnique.mockResolvedValue(stored);

    await expect(service.get('site_seo')).resolves.toEqual(stored);
  });

  it('answers with a null value — not 404 — when the setting is absent', async () => {
    findUnique.mockResolvedValue(null);

    await expect(service.get('site_seo')).resolves.toEqual({ key: 'site_seo', value: null });
  });

  it('echoes back the requested key so callers can match responses', async () => {
    findUnique.mockResolvedValue(null);

    await expect(service.get('homepage_hero')).resolves.toEqual({ key: 'homepage_hero', value: null });
  });

  it('preserves a falsy-but-real stored value instead of reporting it as absent', async () => {
    // `?? ` must not swallow legitimately falsy JSON values like false or "".
    findUnique.mockResolvedValue({ key: 'feature_flag', value: false });

    await expect(service.get('feature_flag')).resolves.toEqual({ key: 'feature_flag', value: false });
  });
});
