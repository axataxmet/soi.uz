/* Regression tests for CMS.getSetting (project/app/cms-remote.js).

   Both bugs covered here have already taken the site down or come close:
   - an absent setting arrives as {value: null}; returning that null instead of the
     caller's default threw in App and blanked the whole page;
   - a failed fetch was never cached, so every render that read a setting issued a
     new request (~36 calls over a few navigations). */
const fs = require('fs');
const path = require('path');

const SOURCE = fs.readFileSync(path.join(__dirname, '../project/app/cms-remote.js'), 'utf8');
const DEFAULTS = { title: 'ИНДУСТРИЯ ЗДОРОВЬЯ', description: 'Каталог' };

function loadOverlay({ getSetting }) {
  // Minimal stand-ins for the two globals the overlay builds on.
  const listeners = {};
  window.CMS = {
    list: () => [],
    get: () => undefined,
    put: () => ({ ok: true }),
    remove: () => ({ ok: true }),
    on: (evt, fn) => {
      (listeners[evt] = listeners[evt] || []).push(fn);
      return () => {};
    },
    emit: (evt) => (listeners[evt] || []).forEach((fn) => fn()),
    getSetting: (_k, d) => d,
    setSetting: () => {},
    refreshRemote: () => {},
  };
  window.api = { list: () => Promise.resolve([]), getSetting, setSetting: () => Promise.resolve() };
  window.SOI_ADMIN = false; // public visitor → per-key fetches, not the admin bulk load

  // eslint-disable-next-line no-new-func -- the file is an IIFE meant for a <script> tag
  new Function(SOURCE)();
  return window.CMS;
}

const flush = () => new Promise((r) => setTimeout(r, 0));

describe('CMS.getSetting', () => {
  afterEach(() => jest.useRealTimers());

  it('falls back to the default when the API reports the setting as unset', async () => {
    const CMS = loadOverlay({ getSetting: () => Promise.resolve({ key: 'site_seo', value: null }) });

    expect(CMS.getSetting('site_seo', DEFAULTS)).toEqual(DEFAULTS); // before the fetch lands
    await flush();
    expect(CMS.getSetting('site_seo', DEFAULTS)).toEqual(DEFAULTS); // and after
  });

  it('returns the stored value once it arrives', async () => {
    const stored = { title: 'Из админки' };
    const CMS = loadOverlay({ getSetting: () => Promise.resolve({ key: 'site_seo', value: stored }) });

    CMS.getSetting('site_seo', DEFAULTS);
    await flush();

    expect(CMS.getSetting('site_seo', DEFAULTS)).toEqual(stored);
  });

  it('fetches an unset key only once no matter how often it is read', async () => {
    const getSetting = jest.fn().mockResolvedValue({ key: 'site_seo', value: null });
    const CMS = loadOverlay({ getSetting });

    for (let i = 0; i < 20; i++) CMS.getSetting('site_seo', DEFAULTS);
    await flush();
    for (let i = 0; i < 20; i++) CMS.getSetting('site_seo', DEFAULTS);

    expect(getSetting).toHaveBeenCalledTimes(1);
  });

  it('does not re-request on every read after the fetch fails', async () => {
    const getSetting = jest.fn().mockRejectedValue(new Error('network down'));
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    const CMS = loadOverlay({ getSetting });

    for (let i = 0; i < 20; i++) {
      CMS.getSetting('site_seo', DEFAULTS);
      await flush();
    }

    expect(getSetting).toHaveBeenCalledTimes(1);
    expect(CMS.getSetting('site_seo', DEFAULTS)).toEqual(DEFAULTS);
  });

  it('retries a failed key once the cooldown has passed', async () => {
    const getSetting = jest.fn().mockRejectedValue(new Error('network down'));
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    const nowSpy = jest.spyOn(Date, 'now');
    nowSpy.mockReturnValue(1_000_000);

    const CMS = loadOverlay({ getSetting });
    CMS.getSetting('site_seo', DEFAULTS);
    await flush();
    CMS.getSetting('site_seo', DEFAULTS);
    expect(getSetting).toHaveBeenCalledTimes(1);

    nowSpy.mockReturnValue(1_000_000 + 31_000); // past the 30s cooldown
    CMS.getSetting('site_seo', DEFAULTS);
    await flush();

    expect(getSetting).toHaveBeenCalledTimes(2);
    nowSpy.mockRestore();
  });

  it('leaves settings outside the remote whitelist to the local store', () => {
    const getSetting = jest.fn();
    const CMS = loadOverlay({ getSetting });

    expect(CMS.getSetting('media_library_local_only', 'локальное')).toBe('локальное');
    expect(getSetting).not.toHaveBeenCalled();
  });
});
