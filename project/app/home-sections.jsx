/* ИНДУСТРИЯ ЗДОРОВЬЯ — Home page */
const tr = (lang, o) => !o ? "" : typeof o === "string" ? o : o[lang] || o.ru;

/* ---- animated count-up ---- */
function CountUp({ value }) {
  const ref = React.useRef(null);
  const [display, setDisplay] = React.useState("0");
  React.useEffect(() => {
    // parse "350+" → num=350, suffix="+"
    const match = String(value).match(/^(\d+)(.*)/);
    if (!match) {setDisplay(value);return;}
    const target = parseInt(match[1], 10);
    const suffix = match[2] || "";
    let started = false;
    const DURATION = 1400; // ms
    const run = () => {
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / DURATION, 1);
        const ease = 1 - Math.pow(1 - p, 3); // ease-out-cubic
        setDisplay(Math.round(ease * target) + suffix);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) {started = true;run();}
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value]);
  return <b ref={ref}>{display}</b>;
}

function CoHomePage({ t, lang, go }) {
  // Seed default cases into CMS so the proof section has content on first load.
  React.useEffect(() => {
    if (!window.CMS) return;
    const have = window.CMS.list("cases");
    const seeded = window.CMS.getSetting && window.CMS.getSetting("cases_seeded");
    const remote = window.CMS.isRemote && window.CMS.isRemote("cases");
    if (!remote && have.length === 0 && !seeded && window.SOI_CORE && window.SOI_CORE.CASES_DEFAULT) {
      window.SOI_CORE.CASES_DEFAULT.forEach((cs) => window.CMS.put("cases", Object.assign({}, cs)));
      if (window.CMS.setSetting) window.CMS.setSetting("cases_seeded", true);
    }
  }, []);
  // Stripe/Vercel-grade platform homepage — components are shared globals defined in home-page.jsx
  // (loaded before this file), so the corp shell and catalog shell render the identical design.
  window.useSoiReveal();
  const SoiPlatformCSS = window.SoiPlatformCSS, SoiHero = window.SoiHero,
    SoiEcosystem = window.SoiEcosystem, SoiExpertise = window.SoiExpertise,
    SoiCatalogCards = window.SoiCatalogCards,
    SoiDirections = window.SoiDirections, SoiCatalogPortal = window.SoiCatalogPortal,
    SoiImpact = window.SoiImpact, SoiBrands = window.SoiBrands,
    SoiCases = window.SoiCases, SoiReviews = window.SoiReviews, SoiNews = window.SoiNews, SoiFinalCTA = window.SoiFinalCTA;
  return (
    <div className="sx">
      <SoiPlatformCSS />
      <SoiHero t={t} lang={lang} go={go} />
      <SoiEcosystem lang={lang} go={go} />
      <SoiExpertise lang={lang} go={go} />
      <SoiCatalogCards lang={lang} go={go} />
      <SoiDirections lang={lang} go={go} />
      <SoiImpact lang={lang} />
      <SoiCases lang={lang} go={go} />
      <SoiReviews lang={lang} go={go} />
      <SoiBrands lang={lang} go={go} />
      <SoiCatalogPortal lang={lang} go={go} />
      <SoiNews lang={lang} go={go} />
      <SoiFinalCTA lang={lang} go={go} />
    </div>
  );
}
window.CoHomePage = CoHomePage;
window.tr = tr;