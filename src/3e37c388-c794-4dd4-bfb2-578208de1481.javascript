/* UzMedEx — Tweaks panel: palette · card style · density */
const { useEffect: _ue } = React;

// ---- HSL lightness shift ----
function _shiftHex(hex, dl) {
  const r=parseInt(hex.slice(1,3),16)/255, g=parseInt(hex.slice(3,5),16)/255, b=parseInt(hex.slice(5,7),16)/255;
  const mx=Math.max(r,g,b), mn=Math.min(r,g,b);
  let h=0, s=0, l=(mx+mn)/2;
  if (mx!==mn) {
    const d=mx-mn; s=l>.5?d/(2-mx-mn):d/(mx+mn);
    if(mx===r) h=((g-b)/d+(g<b?6:0))/6;
    else if(mx===g) h=((b-r)/d+2)/6;
    else h=((r-g)/d+4)/6;
  }
  l=Math.min(1,Math.max(0,l+dl/100));
  if(s===0){const v=Math.round(l*255).toString(16).padStart(2,"0");return"#"+v+v+v;}
  const q=l<.5?l*(1+s):l+s-l*s, p=2*l-q;
  const h2r=(p,q,t)=>{if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)return p+(q-p)*6*t;if(t<.5)return q;if(t<2/3)return p+(q-p)*(2/3-t)*6;return p;};
  const x2=(v)=>Math.round(v*255).toString(16).padStart(2,"0");
  return"#"+x2(h2r(p,q,h+1/3))+x2(h2r(p,q,h))+x2(h2r(p,q,h-1/3));
}

function _applyPalette(pal) {
  if (!pal || pal.length < 4) return;
  const [primary, accent, bg, dark] = pal;
  const r = document.documentElement.style;
  // brand/accent colors — applied in any theme
  r.setProperty("--blue-700", _shiftHex(primary, -12));
  r.setProperty("--blue-600", primary);
  r.setProperty("--blue-500", _shiftHex(primary, 10));
  r.setProperty("--cyan-600", _shiftHex(accent, -10));
  r.setProperty("--cyan-500", accent);
  r.setProperty("--cyan-400", _shiftHex(accent, 12));
  r.setProperty("--navy-900", dark);
  r.setProperty("--navy-850", _shiftHex(dark, 6));
  r.setProperty("--navy-700", _shiftHex(dark, 18));
  r.setProperty("--grad-brand", `linear-gradient(120deg,${primary},${accent})`);
  // neutral page backgrounds — only in light theme; in dark theme let the
  // [data-theme="dark"] CSS control them (inline would override and break it)
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  if (isDark) {
    r.removeProperty("--bg");
    r.removeProperty("--bg-2");
    r.removeProperty("--line");
    r.removeProperty("--line-soft");
  } else {
    r.setProperty("--bg", bg);
    r.setProperty("--bg-2", _shiftHex(bg, -3));
    r.setProperty("--line", _shiftHex(bg, -8));
    r.setProperty("--line-soft", _shiftHex(bg, -4));
  }
}

// 4 curated palettes: [primary, accent, page-bg, dark-bg]
const PALETTE_OPTS = [
  ["#1a5fd0","#18b4e0","#f4f7fb","#0c2244"],  // Medical Blue  (default)
  ["#0b8f7a","#15c9ae","#f0faf8","#092820"],  // Clinical Teal
  ["#5246d5","#7c70f0","#f4f3ff","#1e1b48"],  // Trust Indigo
  ["#1a7a40","#22c55e","#f3fdf5","#0a2a18"],  // Wellness Green
];

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": ["#1a5fd0","#18b4e0","#f4f7fb","#0c2244"],
  "cards": "elevated",
  "density": "normal"
}/*EDITMODE-END*/;

function UzTweaks({ lang }) {
  const [tw, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // apply palette on change
  _ue(() => { _applyPalette(tw.palette); }, [JSON.stringify(tw.palette)]);

  // re-apply palette whenever the theme toggles (so neutrals follow the theme)
  _ue(() => {
    const obs = new MutationObserver(() => _applyPalette(tw.palette));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, [JSON.stringify(tw.palette)]);

  // apply card style via data attribute
  _ue(() => {
    document.documentElement.setAttribute("data-cards", tw.cards);
  }, [tw.cards]);

  // apply density via data attribute
  _ue(() => {
    document.documentElement.setAttribute("data-density", tw.density);
  }, [tw.density]);

  const lbl = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;

  return (
    <TweaksPanel>
      <TweakSection label={lbl("Цветовая схема", "Rang sxemasi", "Color scheme")} />
      <TweakColor
        label={lbl("Акцент платформы", "Platforma rangi", "Brand palette")}
        value={tw.palette}
        options={PALETTE_OPTS}
        onChange={(v) => setTweak("palette", v)}
      />

      <TweakSection label={lbl("Карточки товаров", "Mahsulot kartalari", "Product cards")} />
      <TweakRadio
        label={lbl("Стиль", "Uslub", "Style")}
        value={tw.cards}
        options={["elevated", "flat", "glass"]}
        onChange={(v) => setTweak("cards", v)}
      />

      <TweakSection label={lbl("Плотность", "Zichlik", "Density")} />
      <TweakRadio
        label={lbl("Интерфейс", "Interfeys", "Layout")}
        value={tw.density}
        options={["compact", "normal", "spacious"]}
        onChange={(v) => setTweak("density", v)}
      />
    </TweaksPanel>
  );
}

Object.assign(window, { UzTweaks });
