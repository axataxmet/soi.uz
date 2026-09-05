var{useState,useEffect,useRef}=React;function useHomeSetting(key,def){var[val,setVal]=useState(()=>window.CMS?window.CMS.getSetting(key,def):def);useEffect(()=>{if(!window.CMS)return;setVal(window.CMS.getSetting(key,def));return window.CMS.on?window.CMS.on("settings",()=>setVal(window.CMS.getSetting(key,def))):undefined},[key]);return val}function trTx(obj,field,lang){var v=obj&&obj[field];if(typeof v==="string")return v;return v&&(v[lang]||v.ru)||""}var HERO_DEFAULTS={badge:{ru:"Технологический партнёр здравоохранения",uz:"Sog'liqni saqlash texnologik hamkori",en:"Technology partner for healthcare"},title1:{ru:"Поставщик и интегратор",uz:"Zamonaviy tibbiyotni",en:"An ecosystem for"},title2:{ru:"медицинского оборудования",uz:"jihozlash ekotizimi",en:"equipping modern medicine"},subtitle:{ru:"ИНДУСТРИЯ ЗДОРОВЬЯ объединяет поставку оборудования, регистрацию медизделий, тендерное сопровождение, сервис и цифровые инструменты — единый партнёр для клиник, бизнеса и государства.",uz:"SOG'LIQ INDUSTRIYASI uskunalar yetkazib berish, tibbiy buyumlarni ro'yxatga olish, tender ko'magi, servis va raqamli vositalarni birlashtiradi — klinikalar, biznes va davlat uchun yagona hamkor.",en:"HEALTH INDUSTRY unites equipment supply, medical-device registration, tender support, service and digital tools — a single partner for clinics, business and government."},ctaPrimary:{ru:"О компании",uz:"Kompaniya haqida",en:"About us"},ctaSecondary:{ru:"Электронный каталог",uz:"Elektron katalog",en:"E-catalog"},trust1:{ru:"5+ лет опыта",uz:"5+ yil tajriba",en:"5+ years"},trust2:{ru:"120+ мировых брендов",uz:"120+ jahon brendi",en:"120+ global brands"},trust3:{ru:"14 регионов Узбекистана",uz:"O'zbekistonning 14 hududi",en:"14 regions"}};var SITE_FIGURES_DEFAULTS={founded:2021,catalog:"",brands:"",trained:"1000",service:"50",regions:"14"};function siteFigures(){var cms=window.CMS&&window.CMS.getSetting?window.CMS.getSetting("site_figures",null):null;var f=Object.assign({},SITE_FIGURES_DEFAULTS,cms||{});f.years=String(Math.max(1,new Date().getFullYear()-parseInt(f.founded,10)));return f}window.siteFigures=siteFigures;window.SITE_FIGURES_DEFAULTS=SITE_FIGURES_DEFAULTS;var IMPACT_DEFAULTS={eyebrow:{ru:"Масштаб платформы",uz:"Platforma miqyosi",en:"Platform scale"},title:{ru:"Инфраструктура, которой доверяют клиники и государственные учреждения",uz:"Klinikalar va davlat muassasalari ishonadigan infratuzilma",en:"Infrastructure trusted by clinics and public institutions"},stat1_val:SITE_FIGURES_DEFAULTS.catalog,stat1_unit:"+",stat1_label:{ru:"позиций в каталоге",uz:"katalog pozitsiyasi",en:"items in catalog"},stat2_val:SITE_FIGURES_DEFAULTS.brands,stat2_unit:"+",stat2_label:{ru:"мировых брендов",uz:"jahon brendi",en:"global brands"},stat3_val:SITE_FIGURES_DEFAULTS.regions,stat3_unit:"",stat3_label:{ru:"регионов доставки",uz:"yetkazish hududi",en:"delivery regions"},stat4_val:String(new Date().getFullYear()-SITE_FIGURES_DEFAULTS.founded),stat4_unit:"+",stat4_label:{ru:"лет на рынке Узбекистана",uz:"O'zbekiston bozorida yil",en:"years in Uzbekistan"}};var CTA_DEFAULTS={title:{ru:"Готовы оснастить вашу клинику?",uz:"Klinikangizni jihozlashga tayyormisiz?",en:"Ready to equip your clinic?"},subtitle:{ru:"Расскажите о задаче — подберём оборудование, подготовим КП и сопроводим до запуска.",uz:"Vazifani ayting — uskunani tanlaymiz, taklif tayyorlaymiz va ishga tushirishgacha hamroh bo'lamiz.",en:"Tell us your task — we'll select equipment, prepare a quote and support you to launch."},btn1:{ru:"Получить консультацию",uz:"Maslahat olish",en:"Get a consultation"},btn2:{ru:"Перейти в каталог",uz:"Katalogga o'tish",en:"Browse catalog"}};var SITE_CONTACTS_DEFAULTS={phone:"+998 (77) 225-00-01",phone2:"+998 (77) 224-00-01",email:"info@soi.uz",address:"100069, Ташкент, Узбекистан, ул. МКАД, д. 16",mapUrl:"https://maps.google.com/?q=100069,+Ташкент,+ул.+МКАД,+16",telegram:window.SOC_TELEGRAM,instagram:"https://instagram.com/soi",facebook:"https://facebook.com/soi",youtube:"https://youtube.com/@soi"};function useSiteContacts(){var[contacts,setContacts]=useState(()=>window.CMS?window.CMS.getSetting("site_contacts",SITE_CONTACTS_DEFAULTS):SITE_CONTACTS_DEFAULTS);useEffect(()=>{if(!window.CMS)return;setContacts(window.CMS.getSetting("site_contacts",SITE_CONTACTS_DEFAULTS));return window.CMS.on?window.CMS.on("settings",()=>setContacts(window.CMS.getSetting("site_contacts",SITE_CONTACTS_DEFAULTS))):undefined},[]);return{...SITE_CONTACTS_DEFAULTS,...contacts}}function telHref(phone){return"tel:+"+String(phone||"").replace(/[^0-9]/g,"")}var _VDB="uzmedex_vdb",_VST="vblobs",_VK="hero";function _openVDB(){return new Promise((res,rej)=>{var r=indexedDB.open(_VDB,1);r.onupgradeneeded=()=>{try{r.result.createObjectStore(_VST)}catch(e){}};r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}async function _saveVid(blob){try{var db=await _openVDB();return new Promise((res,rej)=>{var tx=db.transaction(_VST,"readwrite");tx.objectStore(_VST).put(blob,_VK);tx.oncomplete=res;tx.onerror=rej})}catch(e){console.warn("video save:",e)}}async function _loadVid(){try{var db=await _openVDB();return new Promise(res=>{var r=db.transaction(_VST).objectStore(_VST).get(_VK);r.onsuccess=()=>res(r.result?URL.createObjectURL(r.result):null);r.onerror=()=>res(null)})}catch(e){return null}}function HeroVideoSlot({t,lang}){var[src,setSrc]=useState(null);var[playing,setPlaying]=useState(true);var[drag,setDrag]=useState(false);var[ready,setReady]=useState(false);var vidRef=useRef(null);var blobUrl=useRef(null);useEffect(()=>{_loadVid().then(url=>{if(url){setSrc(url);blobUrl.current=url}setReady(true)});return()=>{if(blobUrl.current)URL.revokeObjectURL(blobUrl.current)}},[]);var loadFile=async file=>{if(!file||!file.type.startsWith("video/"))return;if(blobUrl.current)URL.revokeObjectURL(blobUrl.current);var url=URL.createObjectURL(file);blobUrl.current=url;setSrc(url);setPlaying(true);_saveVid(file)};var onDrop=e=>{e.preventDefault();setDrag(false);loadFile(e.dataTransfer.files[0])};var toggle=()=>{if(!vidRef.current)return;if(vidRef.current.paused){vidRef.current.play();setPlaying(true)}else{vidRef.current.pause();setPlaying(false)}};var lv=(ru,uz,en)=>lang==="uz"?uz:lang==="en"?en:ru;return React.createElement("div",{className:"hero-video-slot"+(drag?" drag":""),onDragOver:e=>{e.preventDefault();setDrag(true)},onDragLeave:()=>setDrag(false),onDrop:onDrop},src?React.createElement(React.Fragment,null,React.createElement("video",{ref:vidRef,src:src,autoPlay:true,muted:true,loop:true,playsInline:true,className:"hero-vid",onPlay:()=>setPlaying(true),onPause:()=>setPlaying(false)}),React.createElement("div",{className:"hvs-overlay",onClick:toggle},!playing&&React.createElement("div",{className:"hvs-play-btn"},React.createElement(Icon,{name:"play",size:30}))),React.createElement("label",{className:"hvs-change",title:lv("Сменить видео","Videoni almashtirish","Change video")},React.createElement(Icon,{name:"upload",size:15}),React.createElement("input",{type:"file",accept:"video/*",onChange:e=>loadFile(e.target.files[0])}))):ready?React.createElement("div",{className:"hvs-fallback"},React.createElement("div",{className:"hvs-stats"},[{n:"2 800+",l:"наименований",ic:"grid",c:"var(--blue-600)"},{n:"120+",l:"брендов",ic:"award",c:"var(--accent)"},{n:"14",l:"регионов",ic:"pin",c:"var(--danger)"},{n:new Date().getFullYear()-parseInt(localStorage.getItem("soi_founded_year")||"2021",10)+"+",l:"лет на рынке",ic:"star",c:"#7c5cbf"}].map((s,i)=>React.createElement("div",{key:i,className:"hvs-stat-card",style:{animationDelay:i*0.1+"s"}},React.createElement("div",{className:"hvs-stat-ic",style:{background:s.c+"18",color:s.c}},React.createElement(Icon,{name:s.ic,size:20})),React.createElement("div",{className:"hvs-stat-n"},s.n),React.createElement("div",{className:"hvs-stat-l"},s.l)))),React.createElement("div",{className:"hvs-cats"},(window.DATA?.CATEGORIES||[]).slice(0,6).map((c,i)=>React.createElement("div",{key:c.id,className:"hvs-cat-pill",style:{animationDelay:0.3+i*0.07+"s"}},React.createElement(Icon,{name:c.icon,size:15}),React.createElement("span",null,c.ru)))),React.createElement("label",{className:"hvs-upload-hint"},React.createElement(Icon,{name:"video",size:15}),React.createElement("span",null,lv("Загрузить видео компании","Kompaniya videosi","Upload company video")),React.createElement("input",{type:"file",accept:"video/*",style:{display:"none"},onChange:e=>loadFile(e.target.files[0])}))):React.createElement("div",{className:"hvs-empty"}),React.createElement("div",{className:"hero-float f1"},React.createElement("span",{className:"hf-ic",style:{background:"var(--success)"}},React.createElement(Icon,{name:"check",size:17})),React.createElement("div",null,React.createElement("div",null,t.in_stock),React.createElement("div",{className:"hf-s"},lv("Склад в Ташкенте","Toshkent ombori","Tashkent warehouse")))),React.createElement("div",{className:"hero-float f2"},React.createElement("span",{className:"hf-ic",style:{background:"var(--blue-600)"}},React.createElement(Icon,{name:"shield",size:17})),React.createElement("div",null,React.createElement("div",null,t.g_warranty),React.createElement("div",{className:"hf-s"},t.g_cert))))}var HERO_SLIDES=[{id:"slide-equip",theme:"dark",video:"assets/hero-equipment.mp4",bg:"linear-gradient(120deg, #050a14 0%, var(--navy-800) 55%, var(--blue-600) 100%)",badge:{ru:"ИНДУСТРИЯ ЗДОРОВЬЯ",uz:"SOGʻLIQ INDUSTRIYASI",en:"HEALTH INDUSTRY"},title:{ru:"Медицинские изделия и оснащение",uz:"Tibbiy buyumlar va jihozlash",en:"Medical devices and equipping"},subtitle:{ru:"Широкий ассортимент медицинских изделий от ведущих производителей. Помогаем выбрать, зарегистрировать, закупить, поставить, внедрить и обеспечить сервисное сопровождение.",uz:"Yetakchi ishlab chiqaruvchilardan tibbiy buyumlarning keng assortimenti. Tanlash, roʻyxatdan oʻtkazish, sotib olish, yetkazib berish, joriy etish va servis qoʻllab-quvvatlashda yordam beramiz.",en:"A wide range of medical devices from leading manufacturers. We help you select, register, procure, deliver, deploy and maintain them."},ctas:[{label:{ru:"Перейти в каталог",uz:"Katalogga o'tish",en:"Browse catalog"},action:"catalog",style:"primary"},{label:{ru:"Связаться с нами",uz:"Bog'lanish",en:"Contact us"},action:"contacts",style:"ghost"}]},{id:"slide-registration",theme:"light",video:"assets/hero-lab.mp4",bg:"linear-gradient(135deg, #FFFFFF 0%, var(--blue-50) 55%, var(--line-soft) 100%)",badge:{ru:"Услуга",uz:"Xizmat",en:"Service"},title:{ru:"Регистрация медицинских изделий в Узбекистане",uz:"O'zbekistonda tibbiy buyumlarni ro'yxatdan o'tkazish",en:"Medical device registration in Uzbekistan"},subtitle:{ru:"Полное сопровождение: досье, экспертиза, взаимодействие с регулятором — под ключ.",uz:"To'liq hamrohlik: hujjatlar, ekspertiza, regulyator bilan ishlash — kalit topshirish sharti bilan.",en:"Full support: dossier, expertise, regulator liaison — turnkey."},ctas:[{label:{ru:"Подробнее об услуге",uz:"Xizmat haqida batafsil",en:"Learn more"},action:"registration",style:"primary"}]},{id:"slide-service",theme:"dark",video:"assets/hero-service.mp4",bg:"linear-gradient(120deg, #040c18 0%, var(--blue-700) 70%, var(--blue-500) 100%)",badge:{ru:"Сервис",uz:"Servis",en:"Service"},title:{ru:"Сервис и обучение персонала",uz:"Servis va xodimlarni o'qitish",en:"Maintenance and staff training"},subtitle:{ru:"Пусконаладка, гарантийное и постгарантийное обслуживание, обучение работе с оборудованием.",uz:"Ishga tushirish, kafolatli va kafolatdan keyingi xizmat, uskunalar bilan ishlashga o'qitish.",en:"Commissioning, warranty and post-warranty service, equipment operation training."},ctas:[{label:{ru:"Сервисное обслуживание",uz:"Servis xizmati",en:"Maintenance"},action:"services",style:"primary"},{label:{ru:"Обучение персонала",uz:"Xodimlarni o'qitish",en:"Staff training"},action:"services",style:"ghost"}]}];function Hero({t,lang,go}){var lv=(ru,uz,en)=>lang==="uz"?uz:lang==="en"?en:ru;var SLIDE_MS=7000;var[slideIdx,setSlideIdx]=useState(0);var[paused,setPaused]=useState(false);var parallaxRef=useRef(null);var reduced=typeof matchMedia==="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches;useEffect(()=>{if(paused||reduced)return;var id=setTimeout(()=>setSlideIdx(i=>(i+1)%HERO_SLIDES.length),SLIDE_MS);return()=>clearTimeout(id)},[slideIdx,paused,reduced]);useEffect(()=>{if(reduced)return;var el=parallaxRef.current;if(!el)return;var raf=0;var onScroll=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{var y=Math.min(window.scrollY,el.offsetHeight);el.querySelectorAll("[data-hero-bg]").forEach(bg=>{bg.style.transform=`translateY(${y*0.35}px)`})})};onScroll();window.addEventListener("scroll",onScroll,{passive:true});return()=>{window.removeEventListener("scroll",onScroll);cancelAnimationFrame(raf)}},[reduced]);var slide=HERO_SLIDES[slideIdx];var sv=obj=>obj[lang]||obj.ru||"";useEffect(()=>{var id="soi-chero-css";if(document.getElementById(id))return;var s=document.createElement("style");s.id=id;s.textContent=`
/* ── ИНДУСТРИЯ ЗДОРОВЬЯ Hero v4 — full-bleed slider (ported from CLAUDE HP) ── */
/* pull the hero up under the floating header so 100dvh fills exactly one screen */
.soi-chero { position:relative; overflow:hidden; margin-top:calc(-1 * var(--soi-head-h, 0px)); }
.soi-chero-stage { position:relative; min-height:100dvh; }

/* each slide is stacked and crossfaded */
.soi-chero-slide { position:absolute; inset:0; opacity:0; z-index:0;
  transition:opacity .9s cubic-bezier(.16,1,.3,1); }
.soi-chero-slide.on { opacity:1; z-index:1; }

/* background layer sits taller than the stage so parallax never bares the top */
.soi-chero-bg { position:absolute; inset:0; overflow:hidden; pointer-events:none; }
.soi-chero-bg-inner { position:absolute; left:0; right:0; top:-33%; bottom:0; will-change:transform; }
.soi-chero-vid { width:100%; height:100%; object-fit:cover; display:block; }
.soi-chero-fill { width:100%; height:100%; }

/* scrim: opaque under the text column, transparent to the right */
.soi-chero-scrim { position:absolute; inset:0; }
.soi-chero-slide.t-dark  .soi-chero-scrim { background:linear-gradient(90deg, rgba(0,0,0,.72) 0%, rgba(0,0,0,.45) 38%, rgba(0,0,0,0) 68%); }
.soi-chero-slide.t-light .soi-chero-scrim { background:linear-gradient(90deg, rgba(255,255,255,.85) 0%, rgba(255,255,255,.55) 38%, rgba(255,255,255,0) 68%); }
@media (max-width:640px){
  .soi-chero-slide.t-dark  .soi-chero-scrim { background:rgba(0,0,0,.55); }
  .soi-chero-slide.t-light .soi-chero-scrim { background:rgba(255,255,255,.72); }
}

/* text column, left-aligned like NVIDIA */
.soi-chero-wrap { position:relative; z-index:1; min-height:100dvh; max-width:var(--maxw); margin:0 auto;
  padding:0 24px; display:flex; align-items:center; }
.soi-chero-col { max-width:640px; padding:112px 0 96px; }
.soi-chero-slide.t-dark  .soi-chero-col { color:#fff; }
.soi-chero-slide.t-light .soi-chero-col { color:var(--blue-600); }

.soi-chero-badge { font-size:var(--fs-4); font-weight:700; text-transform:uppercase; letter-spacing:.08em; margin:0 0 12px; }
.soi-chero-slide.t-dark  .soi-chero-badge { color:#A8C4F6; }
.soi-chero-slide.t-light .soi-chero-badge { color:var(--blue-600); }

.soi-chero-h1 { font-size:clamp(30px,5vw,54px); font-weight:800; line-height:1.1; letter-spacing:-.03em; margin:0; }
.soi-chero-sub { font-size:clamp(16px,1.6vw,20px); line-height:1.6; margin:16px 0 0; }
.soi-chero-slide.t-dark  .soi-chero-sub { color:rgba(255,255,255,.9); }
.soi-chero-slide.t-light .soi-chero-sub { color:#374151; }

/* pill CTAs — сплошной фирменный синий с белой подписью (лайм снят) */
.soi-chero-cta { display:flex; flex-wrap:wrap; gap:12px; margin-top:32px; }
.soi-chero-btn { display:inline-flex; align-items:center; justify-content:center; gap:9px;
  padding:14px 26px; border-radius:var(--r-pill); font-family:inherit; font-size:var(--fs-5); font-weight:700;
  cursor:pointer; border:1px solid transparent; transition:background .2s, color .2s, border-color .2s, transform .18s; }
.soi-chero-btn:hover { transform:translateY(-2px); }
.soi-chero-btn.primary { background:var(--blue-600); color:#fff; }
.soi-chero-btn.primary:hover { background:var(--blue-700); }
.soi-chero-btn .arr { display:inline-flex; transition:transform .2s; }
.soi-chero-btn.primary:hover .arr { transform:translateX(4px); }
.soi-chero-slide.t-dark  .soi-chero-btn.ghost { background:transparent; color:#fff; border-color:rgba(255,255,255,.6); }
.soi-chero-slide.t-dark  .soi-chero-btn.ghost:hover { border-color:#fff; color:#fff; background:rgba(255,255,255,.12); }
.soi-chero-slide.t-light .soi-chero-btn.ghost { background:transparent; color:var(--navy-900); border-color:rgba(17,24,39,.4); }
.soi-chero-slide.t-light .soi-chero-btn.ghost:hover { border-color:var(--blue-600); color:var(--blue-600); }
.soi-chero-btn:focus-visible { outline:2px solid var(--blue-500); outline-offset:3px; }

/* staggered reveal, replayed per slide */
.soi-chero-anim { opacity:0; transform:translateY(16px);
  transition:opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1); }
.soi-chero-slide.on .soi-chero-anim { opacity:1; transform:none; }

/* segmented progress bars with timer fill */
.soi-chero-bars { position:absolute; bottom:32px; left:50%; transform:translateX(-50%); z-index:20;
  display:flex; gap:12px; width:100%; max-width:var(--maxw); padding:0 32px; }
/* Индикатор слайдера — самая мелкая цель на странице: полоска 16px по высоте,
   попасть пальцем почти нельзя. Сама полоска остаётся тонкой (она показывает
   время до переключения), а зона нажатия расширена псевдоэлементом до 44px. */
.soi-chero-bar::after { content:""; position:absolute; left:0; right:0; top:50%;
  transform:translateY(-50%); height:44px; }
.soi-chero-bar { position:relative; height:16px; width:96px; max-width:20%; padding:0;
  background:none; border:none; cursor:pointer; }
.soi-chero-bar-track { position:absolute; left:0; top:50%; transform:translateY(-50%);
  height:3px; width:100%; border-radius:var(--r-pill); overflow:hidden; transition:background .2s; }
.soi-chero-stage.t-dark  .soi-chero-bar-track { background:rgba(255,255,255,.25); }
.soi-chero-stage.t-light .soi-chero-bar-track { background:rgba(17,24,39,.2); }
.soi-chero-bar:hover .soi-chero-bar-track { background:rgba(255,255,255,.55); }
.soi-chero-stage.t-light .soi-chero-bar:hover .soi-chero-bar-track { background:rgba(14,74,198,.45); }
.soi-chero-bar:focus-visible .soi-chero-bar-track { outline:2px solid var(--blue-500); outline-offset:2px; }
.soi-chero-bar-fill { position:absolute; inset:0 auto 0 0; display:block; background:#fff;
  animation:soiCheroBar linear forwards; }
.soi-chero-stage.t-light .soi-chero-bar-fill { background:var(--blue-600); }
@keyframes soiCheroBar { from{width:0;} to{width:100%;} }

@media (max-width:520px){
  .soi-chero-btn { width:100%; }
}
@media (prefers-reduced-motion: reduce){
  .soi-chero-slide { transition:none; }
  .soi-chero-anim { opacity:1; transform:none; transition:none; }
  .soi-chero-bar-fill { animation:none; width:100%; }
}
}
    `;document.head.appendChild(s)},[]);var Svg=({children,s=20})=>React.createElement("svg",{width:s,height:s,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},children);var stageTheme=slide.theme==="dark"?" t-dark":" t-light";return React.createElement("section",{className:"soi-chero",role:"region","aria-roledescription":"carousel","aria-label":"Hero",onMouseEnter:()=>setPaused(true),onMouseLeave:()=>setPaused(false),onKeyDown:e=>{if(e.key==="ArrowLeft")setSlideIdx(i=>(i-1+HERO_SLIDES.length)%HERO_SLIDES.length);if(e.key==="ArrowRight")setSlideIdx(i=>(i+1)%HERO_SLIDES.length)}},React.createElement("div",{className:"soi-chero-stage"+stageTheme,ref:parallaxRef},HERO_SLIDES.map((s,i)=>{var on=i===slideIdx;return React.createElement("article",{key:s.id,className:"soi-chero-slide "+(s.theme==="dark"?"t-dark":"t-light")+(on?" on":""),role:"group","aria-roledescription":"slide","aria-label":`${i+1} / ${HERO_SLIDES.length}`,"aria-hidden":!on},React.createElement("div",{className:"soi-chero-bg"},React.createElement("div",{className:"soi-chero-bg-inner","data-hero-bg":true},s.video?React.createElement("video",{className:"soi-chero-vid",src:window.__asset(s.video),autoPlay:true,muted:true,loop:true,playsInline:true,preload:i===0?"auto":"none"}):React.createElement("div",{className:"soi-chero-fill",style:{background:s.bg}})),React.createElement("div",{className:"soi-chero-scrim"})),React.createElement("div",{className:"soi-chero-wrap"},React.createElement("div",{className:"soi-chero-col"},React.createElement("p",{className:"soi-chero-badge soi-chero-anim",style:{transitionDelay:on?"150ms":"0ms"}},sv(s.badge)),React.createElement(i===0?"h1":"h2",{className:"soi-chero-h1 soi-chero-anim",style:{transitionDelay:on?"300ms":"0ms"}},sv(s.title)),React.createElement("p",{className:"soi-chero-sub soi-chero-anim",style:{transitionDelay:on?"420ms":"0ms"}},sv(s.subtitle)),React.createElement("div",{className:"soi-chero-cta soi-chero-anim",style:{transitionDelay:on?"650ms":"0ms"}},s.ctas.map((cta,ci)=>React.createElement("button",{key:ci,className:"soi-chero-btn "+cta.style,onClick:()=>go(cta.action),tabIndex:on?0:-1},sv(cta.label),cta.style==="primary"&&React.createElement("span",{className:"arr"},React.createElement(Svg,{s:18},React.createElement("path",{d:"M5 12h14"}),React.createElement("path",{d:"m12 5 7 7-7 7"})))))))))}),React.createElement("div",{className:"soi-chero-bars",role:"tablist","aria-label":lv("Перейти к слайду","Slaydga o'tish","Go to slide")},HERO_SLIDES.map((s,i)=>React.createElement("button",{key:s.id,role:"tab","aria-selected":i===slideIdx,"aria-label":`${lv("Слайд","Slayd","Slide")} ${i+1}`,className:"soi-chero-bar",onClick:()=>setSlideIdx(i)},React.createElement("span",{className:"soi-chero-bar-track"},i===slideIdx&&React.createElement("span",{key:slideIdx,className:"soi-chero-bar-fill",style:{animationDuration:`${SLIDE_MS}ms`,animationPlayState:paused?"paused":"running"}})))))))}function HeroSignals({lang,go}){var lv=(ru,uz,en)=>lang==="uz"?uz:lang==="en"?en:ru;var sigs=[{ic:"grid",cls:"s1",bg:"var(--blue-50)",c:"var(--blue-600)",t:lv("2 800+ позиций","2 800+ pozitsiya","2,800+ items"),d:lv("в наличии и под заказ","mavjud va buyurtmaga","in stock & to order"),act:()=>go("catalog",{})},{ic:"check",cls:"s2",bg:"var(--line-2)",c:"var(--accent)",t:lv("120+ брендов","120+ brend","120+ brands"),d:lv("официальные поставки","rasmiy yetkazib berish","official supply"),act:()=>go("brands",{})},{ic:"truck",cls:"s3",bg:"var(--bg-2)",c:"var(--blue-600)",t:lv("Доставка в 14 регионов","14 hududga yetkazish","Delivery to 14 regions"),d:lv("монтаж и пусконаладка","montaj va ishga tushirish","installation & setup"),act:()=>go("info",{p:"shipping"})},{ic:"doc",cls:"s4",bg:"var(--blue-50)",c:"var(--accent)",t:lv("Тендеры и госзакупки","Tender va davlat xaridlari","Tenders & procurement"),d:lv("полный пакет документов","to'liq hujjatlar to'plami","full document package"),act:()=>go("info",{p:"gov"})}];return React.createElement("div",{className:"hero-signals"},sigs.map((s,i)=>React.createElement("button",{key:i,className:"hsig "+s.cls,style:{"--d":i*0.12+0.15+"s"},onClick:s.act},React.createElement("span",{className:"hsig-ic",style:{background:s.bg,color:s.c}},React.createElement(Icon,{name:s.ic,size:22})),React.createElement("span",{className:"hsig-tx"},React.createElement("span",{className:"hsig-t"},s.t),React.createElement("span",{className:"hsig-d"},s.d)))))}function CategoryGrid({t,lang,go}){var DD=window.DIRECTIONS_DATA;if(!DD)return null;var{DIRECTION_GROUPS,getDirsForGroup,getProductsForDir}=DD;var P=window.DATA.PRODUCTS;var lv=(ru,uz,en)=>lang==="uz"?uz:lang==="en"?en:ru;return React.createElement("section",{className:"section"},React.createElement("div",{className:"wrap"},React.createElement("div",{className:"sec-head"},React.createElement("div",null,React.createElement("h2",null,t.sec_directions),React.createElement("div",{className:"sub"},lv("Подберите медицинское оборудование по профилю учреждения, отделению или направлению работы","Muassasa yoki boʻlinma profili boʻyicha tibbiy uskunani tanlang","Find equipment by institution profile, department or clinical specialty")))),React.createElement("div",{className:"dir-groups-grid"},DIRECTION_GROUPS.map(g=>{var dirs=getDirsForGroup(g.id);var prodIds=new Set(dirs.flatMap(d=>getProductsForDir(d.id,P).map(p=>p.id)));return React.createElement("div",{key:g.id,className:"dir-group-tile"},React.createElement("div",{className:"dgt-head",style:{borderLeftColor:g.color},onClick:()=>go("catalog",{dir:dirs[0]?.id})},React.createElement("div",{className:"dgt-ic",style:{background:g.color+"18",color:g.color}},React.createElement(Icon,{name:g.icon,size:26})),React.createElement("div",{className:"dgt-title-wrap"},React.createElement("h3",{className:"dgt-title"},lv(g.ru,g.uz,g.en)),prodIds.size>0&&React.createElement("span",{className:"dgt-count"},prodIds.size," ",t.items_count))),React.createElement("div",{className:"dgt-dirs"},dirs.map(d=>React.createElement("a",{key:d.id,className:"dgt-dir",onClick:e=>{e.stopPropagation();go("catalog",{dir:d.id})}},lv(d.ru,d.uz,d.en)))))}))))}function FeaturedRow({t,lang,store,go,title,sub,items,link}){return React.createElement("section",{className:"section",style:{paddingTop:8}},React.createElement("div",{className:"wrap"},React.createElement("div",{className:"sec-head"},React.createElement("div",null,React.createElement("h2",null,title),React.createElement("div",{className:"sub"},sub)),React.createElement("a",{className:"sec-link",onClick:link},t.view_all,React.createElement(Icon,{name:"arrowRight",size:17}))),React.createElement("div",{className:"grid-4"},items.map(p=>React.createElement(ProductCard,{key:p.id,product:p,t:t,lang:lang,store:store,onOpen:pr=>go("product",{id:pr.id})})))))}function TrustBand({t}){var items=[{ic:"truck",k:"trust_1"},{ic:"award",k:"trust_2"},{ic:"wrench",k:"trust_3"},{ic:"pin",k:"trust_4"}];return React.createElement("section",{className:"trust"},React.createElement("div",{className:"wrap"},React.createElement("div",{className:"trust-grid"},items.map(it=>React.createElement("div",{key:it.k,className:"trust-it"},React.createElement("div",{className:"ti-ic"},React.createElement(Icon,{name:it.ic,size:24})),React.createElement("h4",null,t[it.k+"_t"]),React.createElement("p",null,t[it.k+"_d"]))))))}function BrandStrip({t,lang,go}){var brands=window.DATA.BRANDS;var flagByCountry=ru=>({"Китай":"🇨🇳","Германия":"🇩🇪","Индия":"🇮🇳","Израиль":"🇮🇱","Россия":"🇷🇺","Чехия":"🇨🇿","США":"🇺🇸","Швейцария":"🇨🇭","Италия":"🇮🇹","Япония":"🇯🇵","Корея":"🇰🇷"})[ru]||"🌐";var mono=name=>name.replace(/[^A-Za-zА-Яа-я0-9]/g,"").slice(0,2).toUpperCase();var Card=({b})=>React.createElement("button",{className:"brand-card",title:b.name,onClick:()=>go("brand",{id:b.id})},React.createElement("span",{className:"bc-logo"},mono(b.name)),React.createElement("span",{className:"bc-info"},React.createElement("span",{className:"bc-name"},b.name),React.createElement("span",{className:"bc-cat"},flagByCountry(b.country_ru)," ",tri(lang,b.country_ru,b.country_uz,b.country_en))));return React.createElement("section",{className:"section"},React.createElement("div",{className:"wrap"},React.createElement("div",{className:"brand-head"},React.createElement("h2",{className:"brand-h2",onClick:()=>go("brands")},t.sec_brands,React.createElement(Icon,{name:"chevronRight",size:22})),React.createElement("p",{className:"brand-sub"},t.sec_brands_sub)),React.createElement("div",{className:"brand-pills"},brands.slice(0,14).map(b=>React.createElement("button",{className:"brand-pill",key:b.id,title:b.name,onClick:()=>go("brand",{id:b.id})},React.createElement("span",{className:"bp-mono"},mono(b.name)),React.createElement("span",{className:"bp-name"},b.name),React.createElement("span",{className:"bp-flag"},flagByCountry(b.country_ru)))))))}function CtaBand({t}){return React.createElement("section",{className:"section",style:{paddingTop:8}},React.createElement("div",{className:"wrap"},React.createElement("div",{className:"ctaband"},React.createElement("div",{className:"cb-grid"}),React.createElement("div",{className:"cb-l"},React.createElement("h2",null,t.cta_title),React.createElement("p",null,t.cta_sub)),React.createElement("div",{className:"cb-r"},React.createElement("a",{className:"cb-phone",href:"tel:+998772250001"},t.cta_phone),React.createElement("button",{className:"btn btn-cyan btn-lg",onClick:()=>window.__openQuote&&window.__openQuote()},t.cta_btn,React.createElement(Icon,{name:"arrowRight",size:18}))))))}var SITE_MAIL="info@sogliqindustriyasi.uz";function EquipScenarios({t,lang,go}){var lv=(ru,uz,en)=>lang==="uz"?uz:lang==="en"?en:ru;var items=[{ic:"cross-pulse",t:lv("Частная клиника","Xususiy klinika","Private clinic"),act:()=>go("catalog",{})},{ic:"scalpel",t:lv("Стоматологический кабинет","Stomatologiya xonasi","Dental office"),act:()=>go("catalog",{})},{ic:"shield-cross",t:lv("Процедурный кабинет","Muolaja xonasi","Treatment room"),act:()=>go("catalog",{})},{ic:"pulse",t:lv("Диагностика","Diagnostika","Diagnostics"),act:()=>go("catalog",{cat:"diagnostics"})},{ic:"bed",t:lv("Реанимация","Reanimatsiya","Intensive care"),act:()=>go("catalog",{})},{ic:"eye",t:lv("Лаборатория","Laboratoriya","Laboratory"),act:()=>go("catalog",{})},{ic:"shield",t:lv("Стерилизационная","Sterilizatsiya","Sterilization"),act:()=>go("catalog",{})},{ic:"doc",t:lv("Тендер / госзакупка","Tender / davlat xaridi","Tender / procurement"),act:()=>window.__openQuote&&window.__openQuote()}];return React.createElement("section",{className:"section equip-sec"},React.createElement("div",{className:"wrap"},React.createElement("div",{className:"sec-head"},React.createElement("div",null,React.createElement("h2",{className:"sec-title"},lv("Что нужно оснастить?","Nimani jihozlash kerak?","What do you need to equip?")),React.createElement("p",{className:"sec-sub"},lv("Выберите задачу — подберём оборудование и подготовим коммерческое предложение.","Vazifani tanlang — uskuna tanlaymiz va tijorat taklifini tayyorlaymiz.","Pick a task — we'll select equipment and prepare a quote.")))),React.createElement("div",{className:"equip-grid"},items.map((s,i)=>React.createElement("button",{className:"equip-card",key:i,onClick:s.act},React.createElement("span",{className:"equip-ic"},React.createElement(Icon,{name:s.ic,size:26})),React.createElement("span",{className:"equip-t"},s.t),React.createElement(Icon,{name:"arrowRight",size:16,className:"equip-arr"}))))))}function TenderBand({t,lang,go}){var lv=(ru,uz,en)=>lang==="uz"?uz:lang==="en"?en:ru;return React.createElement("section",{className:"section",style:{paddingTop:8}},React.createElement("div",{className:"wrap"},React.createElement("div",{className:"tender-band"},React.createElement("div",{className:"tb-tx"},React.createElement("span",{className:"tb-badge"},"B2B / G"),React.createElement("h3",null,lv("Соберите КП для тендера или закупки","Tender yoki xarid uchun taklif yig'ing","Build a quote for a tender or procurement")),React.createElement("p",null,lv("Добавьте товары в корзину, отправьте техническое задание или запросите подбор — менеджер подготовит коммерческое предложение, спецификацию и документы.","Mahsulotlarni savatga qo'shing, texnik topshiriq yuboring yoki tanlovni so'rang — menejer taklif, spetsifikatsiya va hujjatlarni tayyorlaydi.","Add products to the cart, send a spec or request a selection — a manager will prepare a quote, specification and documents."))),React.createElement("div",{className:"tb-actions"},React.createElement("button",{className:"btn btn-primary btn-lg",onClick:()=>window.__openQuote&&window.__openQuote()},React.createElement(Icon,{name:"doc",size:19}),lv("Получить КП для тендера","Tender uchun taklif olish","Get a tender quote")),React.createElement("button",{className:"btn btn-ghost-d",onClick:()=>window.__openQuote&&window.__openQuote()},lv("Отправить ТЗ","TT yuborish","Send a spec")),React.createElement("a",{className:"tb-dl",href:window.__asset("assets/company-card.pdf"),target:"_blank",rel:"noopener"},React.createElement(Icon,{name:"download",size:16}),lv("Скачать карточку компании","Kompaniya kartasini yuklab olish","Download company card"))))))}function ServiceBand({t,lang,go}){var lv=(ru,uz,en)=>lang==="uz"?uz:lang==="en"?en:ru;var items=[{ic:"shield",t:lv("Гарантийное сопровождение","Kafolat qo'llab-quvvatlash","Warranty support")},{ic:"wrench",t:lv("Монтаж оборудования","Uskuna montaji","Equipment installation")},{ic:"award",t:lv("Обучение персонала","Xodimlarni o'qitish","Staff training")},{ic:"pulse",t:lv("Сервисное обслуживание","Servis xizmati","Maintenance service")}];return React.createElement("section",{className:"section"},React.createElement("div",{className:"wrap"},React.createElement("div",{className:"service-band"},React.createElement("div",{className:"sb-l"},React.createElement("h2",{className:"sec-title",style:{marginBottom:8}},lv("Сервис и гарантия","Servis va kafolat","Service & warranty")),React.createElement("p",{className:"sec-sub",style:{marginBottom:22}},lv("Полное сопровождение оборудования после поставки — от монтажа до планового ТО.","Yetkazib berilgandan keyin uskunani to'liq qo'llab-quvvatlash — montajdan rejali TXgacha.","Full equipment support after delivery — from installation to scheduled maintenance.")),React.createElement("div",{className:"service-items"},items.map((s,i)=>React.createElement("div",{className:"service-it",key:i},React.createElement("span",{className:"service-ic"},React.createElement(Icon,{name:s.ic,size:20})),React.createElement("span",null,s.t))))),React.createElement("div",{className:"sb-r"},React.createElement("div",{className:"sb-card"},React.createElement("h3",null,lv("Нужен сервис или монтаж?","Servis yoki montaj kerakmi?","Need service or installation?")),React.createElement("p",null,lv("Оставьте заявку — сервисный инженер свяжется с вами.","Ariza qoldiring — servis muhandisi siz bilan bog'lanadi.","Leave a request — a service engineer will contact you.")),React.createElement("button",{className:"btn btn-primary btn-block",onClick:()=>window.__openQuote&&window.__openQuote()},React.createElement(Icon,{name:"wrench",size:18}),lv("Заявка на сервис","Servisga ariza","Service request")))))))}function useSoiReveal(){useEffect(()=>{var els=document.querySelectorAll(".sx-rv:not(.sx-in)");if(!("IntersectionObserver"in window)){els.forEach(e=>e.classList.add("sx-in"));return}var io=new IntersectionObserver(ents=>{ents.forEach(e=>{if(e.isIntersecting){e.target.classList.add("sx-in");io.unobserve(e.target)}})},{threshold:0.12,rootMargin:"0px 0px -7% 0px"});els.forEach(e=>io.observe(e));return()=>io.disconnect()})}function SoiPlatformCSS(){useEffect(()=>{var id="soi-platform-css";if(document.getElementById(id))return;var s=document.createElement("style");s.id=id;s.textContent=`
/* ── tokens ─────────────────────────────────────────────────────────────
   Фирменный стиль главной: белое поле, синий #0E4AC6 как единственный
   акцент, нейтральный тёмный текст. Лайма здесь нет — сигнальную роль
   на главных действиях принял на себя синий с белой подписью.

   Палитра берётся из глобальных токенов (:root в index.html), а не задаётся
   здесь литералами. Так было до 07.08.2026: главную перекрасили одну, и её
   значения (#17212B / #667085) пришлось прописать на месте, чтобы не задеть
   остальные страницы. Теперь единый стиль заказан для всего сайта, глобальная
   шкала уже сине-серая — и локальная копия стала лишней: она бы тихо
   разъезжалась с остальными шестнадцатью страницами при каждой правке :root.

   Имена --sx-blue и прочие остаются псевдонимами, чтобы шестнадцать мест
   вызова не пришлось править по одному. --sx-lime тоже сохранён как имя:
   на него ссылаются восемь правил, и все они теперь дают синий. Стена
   плиток «Экосистемы» пока держит собственные оттенки (--eco-h/--eco-a) —
   её пересборка отдельной задачей. */
.sx { --sx-ink:var(--ink); --sx-ink-soft:var(--ink-2); --sx-mute:var(--mute);
  --sx-line:var(--line); --sx-line-2:var(--line-2); --sx-card:#FFFFFF; --sx-bg:#FFFFFF; --sx-bg-soft:var(--bg-2);
  --sx-accent:var(--blue-600); --sx-lime:var(--blue-600); --sx-lime-ink:#FFFFFF;
  /* фирменный синий в слабых долях — заливки, рамки, подложки паттерна */
  --sx-tint-08:rgba(14,74,198,.08); --sx-tint-12:rgba(14,74,198,.12); --sx-tint-20:rgba(14,74,198,.20);
  /* aliases — old names, new restraint */
  --sx-blue:var(--blue-600); --sx-blue-2:var(--blue-700); --sx-cyan:var(--blue-600); --sx-violet:var(--blue-600); --sx-green:var(--blue-600); --sx-amber:#b87213;
  --sx-shadow:0 1px 2px rgba(14,74,198,.05);
  --sx-shadow-lg:0 1px 2px rgba(14,74,198,.06), 0 12px 32px rgba(14,74,198,.08);
  /* 18px, not global --r-lg (16px): референс readdy.cc держит более крупный
     радиус на всех карточках второй половины страницы (rounded-2xl). */
  --sx-r:18px; --sx-r-sm:10px;
  font-family:'Montserrat',Helvetica,Arial,sans-serif; }
[data-theme="dark"] .sx { --sx-ink:#E8EFFB; --sx-ink-soft:#B9C9E4; --sx-mute:#8FA2BE;
  --sx-line:var(--navy-800); --sx-line-2:var(--navy-850); --sx-card:var(--navy-900); --sx-bg:var(--navy-900); --sx-bg-soft:var(--navy-900);
  --sx-accent:#7FA8F0; --sx-lime:#2b72e3; --sx-lime-ink:#FFFFFF;
  --sx-blue:#7FA8F0; --sx-blue-2:#A8C4F6; --sx-cyan:#7FA8F0;
  --sx-tint-08:rgba(127,168,240,.10); --sx-tint-12:rgba(127,168,240,.16); --sx-tint-20:rgba(127,168,240,.24);
  --sx-shadow:0 1px 2px rgba(0,0,0,.4);
  --sx-shadow-lg:0 1px 2px rgba(0,0,0,.4), 0 16px 40px rgba(0,0,0,.5); }

.sx { background:var(--sx-bg); color:var(--sx-ink); }
.sx *, .sx *::before, .sx *::after { box-sizing:border-box; }

/* Исключения по заголовкам: блоки со своей подложкой (герой, плитки
   «Экосистемы», ctaband) держат собственный цвет, иначе они почернели бы
   под общим правилом «.z-corp h1,h2,h3».

   Само общее правило здесь больше не дублируется: в index.html оно теперь
   читает var(--ink), тот же токен, что и .sx, — повторять нечего. Раньше там
   стоял литерал #0B2D25, и эта копия существовала только чтобы его перебить
   на главной. */
.z-corp .sx .soi-chero-stage h1, .z-corp .sx .soi-chero-stage h2, .z-corp .sx .soi-chero-stage h3,
.z-corp .sx .eco-t h1, .z-corp .sx .eco-t h2, .z-corp .sx .eco-t h3,
.z-corp .sx .ctaband h1, .z-corp .sx .ctaband h2, .z-corp .sx .ctaband h3,
.z-corp .sx [class*="-ctaband"] h1, .z-corp .sx [class*="-ctaband"] h2, .z-corp .sx [class*="-ctaband"] h3,
.z-corp .sx .sxp-card.feat h1, .z-corp .sx .sxp-card.feat h2, .z-corp .sx .sxp-card.feat h3 { color:inherit; }

/* Фон главной оставлен чистым: решение заказчика от 06.08.2026 — никаких
   декоративных слоёв поверх подложек. Присланный из Figma паттерн («линзы»)
   был подключён и снят по этому же решению; вместе с ним удалён ассет
   assets/soi-pattern.svg. Прочая декорация — .sxp-glow, .sx-cp-aurora,
   .sx-cta-aurora — была выключена
   (display:none) ещё раньше; разметку под них не трогаем, чтобы не
   переписывать шесть компонентов ради снятия уже невидимого.

   Фирменный цвет остаётся присутствовать заливками (--sx-tint-*), а не
   рисунком: это и есть заказанные «10-20%». */
/* .sx впереди — базовый «.sx-cta» объявлен ниже по этому же файлу и при
   равной специфичности выиграл бы порядком. */
.sx .sx-cta { background:var(--sx-tint-08); border-color:var(--sx-tint-20); }
.sx-wrap { max-width:var(--maxw); margin:0 auto; padding:0 32px; }
.sx-section { padding:clamp(64px,8vw,108px) 0; position:relative; }
/* Светлые секции выключены: фон страниц — только белый. Правило оставлено
   пустым, чтобы разметка с классом soft не требовала правки. */
.sx-section.soft { background:var(--sx-bg); }

/* reveal */
.sx-rv { opacity:0; transform:translateY(26px); transition:opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1); transition-delay:calc(var(--i,0) * 70ms); }
.sx-in { opacity:1; transform:none; }
@media (prefers-reduced-motion: reduce){ .sx-rv{ transition:none; opacity:1; transform:none; } }

/* heads */
/* The eyebrow was a coloured label with a gradient dash. Quietened to a small
   grey caption — the heading under it is doing the work now. */
/* Надзаголовок секции. Один вид на все секции главной: два правила были
   побайтово одинаковыми и жили в разных концах файла. */
.sx-h2 { font-size:clamp(32px,4.4vw,54px); font-weight:800; line-height:1.04; letter-spacing:-.035em; color:var(--sx-ink); margin:14px 0 0; text-wrap:balance; }
.sx-sub { font-size:clamp(16px,1.5vw,18px); line-height:1.6; color:var(--sx-mute); margin-top:14px; max-width:600px; }
.sx-head { margin-bottom:44px; }
.sx-head.center { text-align:center; }
.sx-head.center .sx-sub { margin-left:auto; margin-right:auto; }

/* link */
.sx-link { display:inline-flex; align-items:center; gap:6px; font-size:var(--fs-4); font-weight:700; color:var(--sx-blue); cursor:pointer; transition:gap .2s, color .2s; }
.sx-link:hover { gap:11px; color:var(--sx-blue-2); }

/* ── ecosystem bento ────────────────────────────────────
   Deep-ground tiles reading as one island on the light page. Each tile carries a
   hue of its own (--eco-h/--eco-a); everything inside is built from white alphas
   over that ground, so a tile stays coherent whatever its colour. */
/* The section's own air is cut back too — with the standard 108px band the two
   rows still overflow a 900px screen by the height of a tile's heading. */
.eco-section { padding-top:64px; padding-bottom:64px; }
/* Two rows, not three: the block has to fit one screen. Twelve columns because
   the second row carries four tiles — six could not divide into four. */
.eco-grid { display:grid; grid-template-columns:repeat(12,1fr); gap:14px;
  grid-template-areas:
    "catalog  catalog  catalog  catalog  tender tender tender tender tender  tender   tender   tender"
    "training training training brands   brands brands service service service delivery delivery delivery"; }
/* One recipe for every tile: the section's own hue in --eco-h, its accent in
   --eco-a, and identical depth on top — same radius, same diagonal, same inner
   glow, same shadow. The hues are the brand values; the gradient darkens them
   so a tile reads as a deep field rather than a flat swatch of colour. */
.eco-t { --eco-h:#0B4EDB; --eco-a:#5C9DFF;
  position:relative; grid-area:var(--eco-area); isolation:isolate; display:flex; flex-direction:column;
  /* 24px/18px — не глобальный --r-lg (16px): формы карточек на главной сведены
     к масштабу readdy.cc (rounded-2xl, p-6), локально для этой плитки. */
  padding:24px; border-radius:18px; overflow:hidden; color:#fff;
  background:
    radial-gradient(115% 115% at 100% 0%, color-mix(in srgb, var(--eco-a) 22%, transparent), transparent 60%),
    linear-gradient(150deg,
      color-mix(in srgb, var(--eco-h) 60%, #05070F) 0%,
      color-mix(in srgb, var(--eco-h) 82%, #05070F) 52%,
      color-mix(in srgb, var(--eco-h) 44%, #05070F) 100%);
  box-shadow:
    0 1px 0 0 rgba(255,255,255,.10) inset,
    0 0 0 1px color-mix(in srgb, var(--eco-a) 14%, transparent) inset,
    0 20px 44px -24px color-mix(in srgb, var(--eco-h) 70%, #000); }
/* Подложка плитки — два мягких пятна её же акцента, статично.

   Прежде пятна ползали по плитке (ecoDrift, 19 с) и поверх раз в девять секунд
   пробегала светлая полоса (ecoSheen) — шесть плиток мерцали вразнобой, чтобы
   не вспыхивать разом. Снято по решению заказчика 08.08.2026: движение ничего
   не сообщало о содержимом и на деловой странице читалось дешёвым эффектом.

   Градиенты оставлены — они дают плитке объём. Ушла только анимация, вместе с
   ней will-change:transform: шесть слоёв постоянно висели в отдельных слоях
   композитора без всякой пользы. */
.eco-t::before { content:""; position:absolute; z-index:-1; pointer-events:none;
  inset:0;
  background:
    radial-gradient(38% 44% at 24% 28%, color-mix(in srgb, var(--eco-a) 30%, transparent), transparent 68%),
    radial-gradient(34% 40% at 76% 74%, color-mix(in srgb, var(--eco-a) 20%, transparent), transparent 70%); }

/* Плитки были раскрашены в шесть разных цветов — зелёный, фиолетовый,
   оранжевый, бирюзовый; на главной с одним фирменным цветом это читалось
   радугой. Теперь все шесть — тот же #0E4AC6, различаются только глубиной:
   стена остаётся читаемой (соседние плитки не сливаются), но не спорит с
   палитрой. Рецепт плитки не тронут — правятся ровно две переменные на класс. */
.eco-t.catalog  { --eco-area:catalog;  --eco-h:#0E4AC6; --eco-a:#8CB4F5; }
.eco-t.brands   { --eco-area:brands;   --eco-h:#0D46B8; --eco-a:#86AFF3; }
.eco-t.training { --eco-area:training; --eco-h:#0B3EA8; --eco-a:#7FA8F0; }
.eco-t.service  { --eco-area:service;  --eco-h:#0A3796; --eco-a:#789FEC; }
.eco-t.delivery { --eco-area:delivery; --eco-h:#082E7E; --eco-a:#6E9BEA; }
.eco-t.tender   { --eco-area:tender;   --eco-h:#06265F; --eco-a:#6593E6; }

/* ── shared across tiles — keep OUT of any per-section block ──────────────
   These belong to no single tile: .eco-live is the tenders badge, .eco-brand
   dresses the brand wall. Twice now they were deleted by a wholesale rewrite of
   the tenders CSS because they happened to sit inside it. */
/* Отметка обновления — просто строка с пульсирующей точкой, без пилюли
   (решение заказчика 08.08.2026). Подложка и рамка делали из служебной
   пометки ещё один элемент управления, хотя нажимать её не на что. */
.eco-live { display:inline-flex; align-items:center; gap:8px; font-size:var(--fs-1); font-weight:700;
  color:rgba(255,255,255,.82); white-space:nowrap; }
.eco-live::before { content:""; width:7px; height:7px; border-radius:50%; background:var(--blue-400); box-shadow:var(--sh-sm); animation:ecoPulse 2.4s ease-out infinite; }
@keyframes ecoPulse { 70% { box-shadow:0 0 0 7px rgba(77,142,238,0); } 100% { box-shadow:0 0 0 0 rgba(77,142,238,0); } }
/* One line, clipped: the wall is a proof of breadth, not a list. Wrapping it
   cost the block three rows of height it does not have. */
.eco-brands { display:flex; flex-wrap:nowrap; gap:7px; margin-top:12px; overflow:hidden; mask-image:linear-gradient(90deg,#000 78%,transparent); }
.eco-brand { display:inline-flex; align-items:center; justify-content:center; height:30px; padding:0 11px; border-radius:var(--r-sm); flex:0 0 auto;
  background:rgba(255,255,255,.92); color:var(--navy-850); font-size:var(--fs-1); font-weight:800; letter-spacing:.01em; white-space:nowrap; }
.eco-brand img { max-height:17px; max-width:66px; object-fit:contain; }

/* Optional photo behind a tile: the scrim keeps text legible whatever the shot,
   and the tile looks deliberate when no photo is set at all. */
.eco-photo { position:absolute; inset:0; z-index:-1; background-size:cover; background-position:center; opacity:.42; }
.eco-photo::after { content:""; position:absolute; inset:0;
  background:linear-gradient(180deg, color-mix(in srgb, var(--eco-h) 55%, transparent) 0%, color-mix(in srgb, var(--eco-h) 88%, #05070F) 82%); }

/* head: icon + optional corner badge */
/* Content starts at the top in every tile, so icon, figure and heading line up
   across a row; the slack falls to the bottom, where the CTA holds the baseline. */
.eco-head { display:flex; align-items:flex-start; justify-content:space-between; gap:14px; }
.eco-ic { width:38px; height:38px; border-radius:var(--r); display:flex; align-items:center; justify-content:center; flex:0 0 auto;
  background:color-mix(in srgb, var(--eco-a) 22%, transparent); color:var(--eco-a); border:1px solid color-mix(in srgb, var(--eco-a) 26%, transparent); }
.eco-badge { display:inline-flex; align-items:center; gap:7px; padding:7px 11px; border-radius:var(--r); font-size:var(--fs-2); font-weight:700;
  background:rgba(255,255,255,.09); border:1px solid rgba(255,255,255,.14); color:rgba(255,255,255,.86); }
.eco-badge b { font-size:var(--fs-4); font-weight:800; font-variant-numeric:tabular-nums; color:#fff; }

/* numbers + copy */
.eco-num { margin-top:12px; font-size:clamp(32px,3.1vw,40px); font-weight:800; line-height:.95; letter-spacing:-.035em;
  font-variant-numeric:tabular-nums; color:#fff; }
.eco-num span { color:var(--eco-a); }
.eco-t h3 { margin:8px 0 0; font-size:var(--fs-5); font-weight:800; letter-spacing:-.012em; line-height:1.25; color:#fff; text-wrap:balance; }
.eco-t.catalog h3 { font-size:var(--fs-6); }
.eco-t p { margin:7px 0 0; font-size:var(--fs-3); line-height:1.5; color:rgba(255,255,255,.72); max-width:44ch; }

/* metric strip — hidden entirely when the editor leaves it blank */
.eco-metrics { display:flex; flex-wrap:wrap; gap:9px; margin-top:20px; }
.eco-m { flex:1 1 96px; min-width:96px; padding:11px 13px; border-radius:var(--r);
  background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.11); }
.eco-m-v { font-size:var(--fs-6); font-weight:800; letter-spacing:-.02em; font-variant-numeric:tabular-nums; color:#fff; }
/* "закрываются" is wider than a third of a phone screen — let it break rather
   than spill out of its card. */
.eco-m-l { margin-top:3px; font-size:var(--fs-1); line-height:1.35; color:rgba(255,255,255,.62); overflow-wrap:anywhere; }

/* actions */
.eco-foot { margin-top:auto; padding-top:14px; display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
/* min-height до нормы 44px: кнопка была 36px по высоте. Ширины хватало,
   поэтому подняли только высоту — padding оставлен прежним, вид почти не
   изменился. */
.eco-cta { min-height:44px; display:inline-flex; align-items:center; gap:9px; padding:9px 14px; border-radius:var(--r); border:1px solid rgba(255,255,255,.16);
  background:rgba(255,255,255,.10); color:#fff; font-size:var(--fs-3); font-weight:700; cursor:pointer; text-align:left;
  transition:background .2s, border-color .2s, gap .2s; }
.eco-cta:hover { background:rgba(255,255,255,.17); border-color:rgba(255,255,255,.3); gap:13px; }
.eco-cta.solid { background:var(--eco-a); border-color:transparent; color:#08182F; }
.eco-cta.solid:hover { background:color-mix(in srgb, var(--eco-a) 84%, #fff); }
.eco-t :is(a,button):focus-visible { outline:2px solid #fff; outline-offset:3px; border-radius:var(--r); }

/* The catalog tile had a search field and category chips; both were dropped when
   the block was cut to one screen, and the tile now leads straight to the CTA. */

/* ── tenders: one monitoring panel, not cards inside cards ────────────────
   Four counters, then two lists separated by a hairline. Everything sits on the
   tile's own ground — the only boxes are the KPI cells, because a figure needs
   an edge to read as a figure. */
.eco-t.tender { padding:20px; }
.tnd-top { display:grid; grid-template-columns:auto 1fr auto; align-items:start; gap:14px; }
.tnd-titles { min-width:0; }
/* Promoted from caption to headline. Set in caps at heading size, it needs the
   opposite treatment to a small eyebrow: tracking pulled back in (wide letter
   spacing at 21px reads as a logotype, not a title) and a tighter line height,
   because a fifty-character line will take two rows on any tile width. */
/* Кегль плавающий: плитка сузилась до шести колонок, и на фиксированном --fs-7
   заголовок из пятидесяти прописных занимал четыре строки — больше, чем сами
   цифры под ним. clamp даёт ему ужаться на узкой плитке, не мельча на широкой. */
.eco-t.tender h3.tnd-eyebrow { display:block; margin:0; font-size:clamp(15px,1.5vw,20px); font-weight:800;
  letter-spacing:.015em; line-height:1.18; text-transform:uppercase; color:#fff; text-wrap:balance; }
.eco-t.tender > p { margin-top:8px; max-width:62ch; }

/* The counters lost their boxes: four cells with borders inside a bordered tile
   inside a bordered grid was three frames deep and read as clutter. What ranks
   them now is size — the lead figure is nearly twice the others — and a hairline
   between columns, which is what a dashboard uses. */
/* Bento-раскладка по макету заказчика (08.08.2026): каждая величина в своей
   карточке, размеры карточек разные.

     колонка 1 — «активных закупок» и под ней категории;
     колонка 2 — «новых» и «закрываются», одна под другой;
     колонка 3 — площадки, во всю высоту блока.

   Прежде четыре цифры стояли в ряд, разделённые вертикальными линиями, а
   списки лежали сплошной полосой под ними: главное число ничем не отличалось
   от справочных, кроме кегля. Карточки задают вес явно. */
/* Две колонки: слева «активных закупок» и под ней категории, справа площадки.
   Средняя колонка ушла вместе с цифрами «новых» и «закрываются за неделю».
   Левая шире — под ведущей цифрой стоят категории, а их названия
   («Медицинское оборудование») длиннее всего в блоке и при равных долях
   обрезались многоточием. */
/* stretch, а не start: карточки должны кончаться на одной линии, хотя списки
   в них разной длины — пять категорий против четырёх площадок. */
.tnd-kpis { display:grid; grid-template-columns:1.5fr 1fr; grid-auto-rows:auto;
  gap:10px; margin-top:12px; align-items:stretch; }
.tnd-kpi { position:relative; padding:12px 16px; border-radius:var(--r);
  background:rgba(255,255,255,.05); }
/* Ведущая цифра занимает свою колонку целиком, остальные встают по порядку. */
.tnd-kpi.lead { grid-column:1; grid-row:1; }
/* Цифры укрупнены (решение заказчика 08.08.2026): ради них плитку и смотрят,
   а прежде они соперничали по весу со списками под ними. Заданы в rem, а не
   через --fs-*: шкала обрывается на --fs-9, следующего шага в ней нет.

   Один размер на обе карточки: прежде левая шла 2.6rem, правая 2.2rem, и
   рядом это читалось как разные по важности величины, хотя карточки
   равноправны (решение заказчика 09.08.2026 — унифицировать). */
.tnd-kpi-v { font-size:2.6rem; font-weight:800; line-height:1; letter-spacing:-.035em; font-variant-numeric:tabular-nums; color:#fff; }
/* Цифра и подпись — в одну строку. Выравнивание по базовой линии, а не по
   центру: у кегля 2.6rem и 15px центры не совпадают, и подпись «плавала» бы
   относительно числа. Перенос разрешён — на узкой плитке длинная подпись
   уходит под цифру, а не выдавливает её из карточки. */
.tnd-kpi-head { display:flex; align-items:baseline; gap:10px; flex-wrap:wrap; }
/* Подписи одинаковы в обеих карточках: слева стояли вес 600 и прозрачность
   .8, справа — 400 и .58, из-за чего левая читалась заметно плотнее. */
.tnd-kpi-l { font-size:var(--fs-4); font-weight:600; line-height:1.25; color:rgba(255,255,255,.8); }

/* Сворачивание снято (решение заказчика 08.08.2026): списки показаны всегда,
   и органов управления у них нет. Отсюда убраны курсор, шевронки, состояния
   наведения и фокуса — карточка снова просто карточка, а не кнопка.
   Разметка вернулась с <details>/<summary> на обычные блоки. */
/* Разделитель над списком одинаков в обеих карточках — см. .tnd-sec ниже.
   Собственных отступов у строк здесь больше нет: они шли 4px/6px против
   5px/8px в категориях, и списки стояли с разным шагом. */
.tnd-kpi-list { margin-top:12px; padding-top:10px; border-top:1px solid rgba(255,255,255,.12); }
/* Площадки — правая колонка. Обе карточки тянутся на высоту ряда, поэтому
   стоят вровень независимо от того, в какой из них список длиннее. */
.tnd-kpi-src { grid-column:2; }
.tnd-kpi { align-self:stretch; }

/* Категории живут внутри карточки «активных закупок», а не рядом с ней:
   они раскладывают на части то же самое число. Отделены от цифры линией —
   своей подложки не имеют, иначе получилась бы карточка внутри карточки. */
.tnd-sec { min-width:0; margin-top:12px; padding-top:10px;
  border-top:1px solid rgba(255,255,255,.12); }
/* Заголовок стоит в строке с цифрой и прижат к правому краю карточки:
   margin-left:auto отталкивает его от подписи, а перенос строки в .tnd-kpi-head
   уводит его вниз на узкой плитке, где втроём они не помещаются. */
.tnd-sec-h { margin-left:auto; padding-bottom:0;
  font-size:var(--fs-1); font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:rgba(255,255,255,.5)}


/* rows — platforms and categories share one shape */
.tnd-row { display:grid; grid-template-columns:auto minmax(0,1fr) auto; align-items:center; gap:10px;
  width:100%; padding:5px 8px; margin:0 -8px; border:0; background:transparent; color:inherit; font:inherit; text-align:left;
  border-radius:var(--r-sm); text-decoration:none; transition:background .18s ease, color .18s ease, transform .18s ease; }
/* Категории снова несут сумму: полоска, название, сумма, количество. Сумма
   возвращена в строку по решению заказчика 08.08.2026 — из подсказки её было
   не видно без наведения. */
.tnd-row.cat { grid-template-columns:3px minmax(0,1fr) auto auto; gap:0 9px; align-items:baseline; }
a.tnd-row, button.tnd-row { cursor:pointer; }
.tnd-row + .tnd-row { box-shadow:var(--sh-sm); }
/* Поочерёдная подсветка: активная строка в полную силу, остальные приглушены.
   Гасим только непрозрачность и фон — не цвет текста: так строка не меняет
   размеров и соседи не дёргаются.

   .62, а не .3-.4: приглушённые строки остаются читаемыми. Список — не
   декорация, в нём цифры по категориям, и пользователь должен видеть их все
   разом, а подсветка лишь ведёт взгляд. */
.tnd-sec .tnd-row, .tnd-kpi-list .tnd-row { opacity:.62; transition:opacity .45s ease, background .45s ease, transform .18s ease; }
.tnd-sec .tnd-row.is-lit, .tnd-kpi-list .tnd-row.is-lit { opacity:1; background:rgba(255,255,255,.08); }
/* Наведение и фокус всегда сильнее автоподсветки: пользователь ведёт сам. */
.tnd-sec .tnd-row:hover, .tnd-kpi-list .tnd-row:hover,
.tnd-sec .tnd-row:focus-visible, .tnd-kpi-list .tnd-row:focus-visible { opacity:1; }
@media (prefers-reduced-motion: reduce){
  /* Таймер не заводится (см. useRowCycle), но правило нужно и здесь: без него
     строки остались бы приглушёнными навсегда. */
  .tnd-sec .tnd-row, .tnd-kpi-list .tnd-row { opacity:1; transition:none; }
}

/* Nudged, not scaled: scaling a row inside a dense list shoves its neighbours
   around, and transform keeps the work off the layout thread either way. */
.tnd-row:hover { background:rgba(255,255,255,.09); transform:translateX(3px); }
.tnd-row:focus-visible { outline:2px solid #fff; outline-offset:-2px; }
/* Названия переносятся, а не обрезаются многоточием (решение заказчика
   08.08.2026): «Медицинские инструменты» в узкой колонке превращалось в
   «Медицинские инструм…», и строку нельзя было прочитать не наводя курсор. */
.tnd-row-n { font-size:var(--fs-3); font-weight:600; color:rgba(255,255,255,.9);
  min-width:0; overflow-wrap:anywhere; }
.tnd-row-v { font-size:var(--fs-3); font-weight:700; font-variant-numeric:tabular-nums; color:#fff; min-width:18px; text-align:right; }
/* Сумма — справочная величина рядом с названием: мельче и тусклее счётчика,
   иначе две цифры в строке читаются как равные по значимости. */
.tnd-row-sum { font-size:var(--fs-1); font-variant-numeric:tabular-nums; color:rgba(255,255,255,.55); white-space:nowrap; }
.tnd-row.zero .tnd-row-n, .tnd-row.zero .tnd-row-v, .tnd-row.zero .tnd-row-sum { color:rgba(255,255,255,.45); }
.tnd-dot { width:7px; height:7px; border-radius:50%; background:var(--blue-400); }
.tnd-dot.off { background:rgba(255,255,255,.28); }
/* The accent bar: one hue, five weights of it, so the list is ranked without
   turning five rows into five different colours. */
.tnd-bar { width:3px; height:16px; border-radius:2px; background:var(--eco-a); opacity:var(--bar,1);
  transform-origin:center; transition:transform .18s ease; }
.tnd-row.cat:hover .tnd-bar { transform:scaleY(1.35); }
.tnd-row.cat.zero .tnd-bar { background:rgba(255,255,255,.25); }

@media (max-width:1080px) {
  /* Узкая плитка — карточки в один столбец, каждая своей строкой. Прежние
     правила рисовали здесь сетку из тонких линий между четырьмя ячейками;
     ни линий, ни четырёх ячеек больше нет — карточки разделяет зазор. */
  .tnd-kpis { grid-template-columns:1fr; }
  .tnd-kpi.lead, .tnd-kpi-src, .tnd-kpi-src[open] {
    grid-column:1; grid-row:auto; align-self:auto; }
}
@media (max-width:680px) {
  .tnd-top { grid-template-columns:auto 1fr; }
  .tnd-top .eco-live { grid-column:1 / -1; justify-self:start; }
  /* Fifty characters of caps need a step down before they take four lines. */
  .eco-t.tender h3.tnd-eyebrow { font-size:var(--fs-5); }
  /* Кегль сбавлен, но остаётся общим для обеих карточек: раздельные размеры
     (--fs-8 слева и --fs-7 справа) здесь и ломали унификацию на телефоне. */
  .tnd-kpi-v { font-size:var(--fs-8); }
  /* Сумма — первое, что уходит, когда строке не хватает ширины: читатель
     ищет название и количество. Без display:none сумма оставалась в разметке
     и попадала в неявную колонку — счётчик срывался на следующую строку, и
     список рассыпался.

     На широких экранах сумма на месте: она возвращена туда по решению
     заказчика 08.08.2026. */
  .tnd-row.cat { grid-template-columns:3px minmax(0,1fr) auto; }
  .tnd-row-sum { display:none; }

  /* Строки списков и ссылки направлений — до нормы 44px. Это цели для пальца,
     а не для курсора: на десктопе они остаются плотными (32 и 30px), потому
     что там курсор точный и высота блоков важнее. */
  .tnd-row { min-height:44px; }
  .sx-dir-links a { min-height:44px; display:flex; align-items:center; }
}

/* The map no longer claims a block of its own height: it sits behind the copy,
   bled to the tile's bottom-right corner, and the text keeps the foreground. */
.eco-map { position:absolute; right:-8%; bottom:-6%; width:78%; height:auto; display:block; overflow:visible; z-index:-1; opacity:.55; }
.eco-map-land { fill:color-mix(in srgb, var(--eco-a) 13%, transparent); stroke:color-mix(in srgb, var(--eco-a) 72%, transparent);
  stroke-width:1.3; stroke-linejoin:round; }
/* Two strokes per route: a faint permanent corridor, and a short dash running
   along it from Tashkent outward — a delivery leaving, not decoration. */
.eco-map-route { fill:none; stroke:color-mix(in srgb, var(--eco-a) 26%, transparent); stroke-width:.9; }
/* pathLength="1" normalises every route, so a short hop to Sirdaryo and a long
   run to Karakalpakstan take the same time instead of the dash racing. */
.eco-map-flow { fill:none; stroke:color-mix(in srgb, var(--eco-a) 92%, transparent); stroke-width:1.5; stroke-linecap:round;
  stroke-dasharray:.06 .94; stroke-dashoffset:1; animation:ecoFlow 3.6s linear infinite; }
.eco-map-dot { fill:var(--eco-a); opacity:.55; animation:ecoLand 3.6s ease-in-out infinite; }
.eco-map-hub { fill:#fff; }
.eco-map-ping { fill:none; stroke:#fff; stroke-width:1.2; opacity:0; animation:ecoPing 3.6s ease-out infinite; }
@keyframes ecoFlow { to { stroke-dashoffset:0; } }
@keyframes ecoLand { 0%,62% { opacity:.55; r:2.6; } 78% { opacity:1; r:3.6; } 100% { opacity:.55; r:2.6; } }
@keyframes ecoPing { 0% { r:4.4; opacity:.7; } 55%,100% { r:15; opacity:0; } }
@media (prefers-reduced-motion: reduce) {
  .eco-map-flow { animation:none; stroke-dasharray:none; stroke-dashoffset:0; stroke-width:.9; opacity:.5; }
  .eco-map-dot { animation:none; opacity:.85; }
  .eco-map-ping { display:none; }
  /* Подложка плиток больше не анимируется ни при каких настройках — гасить
     нечего, правила для .eco-t::before/::after убраны вместе с анимацией. */
}

@media (max-width:1080px) {
  .eco-grid { grid-template-columns:repeat(2,1fr);
    grid-template-areas:"catalog catalog" "training training" "tender tender" "brands service" "delivery delivery"; }
  .eco-tender-cols { grid-template-columns:1fr; }
}
@media (max-width:680px) {
  .eco-grid { grid-template-columns:1fr;
    grid-template-areas:"catalog" "training" "tender" "brands" "service" "delivery"; gap:14px; }
  .eco-t, .eco-t.tender { padding:22px; border-radius:var(--r-lg); }
  .eco-m { flex:1 1 100%; }
  /* KPIs stay three-up on a phone — stacking them would undo the height the
     block just gained — so they shed padding and a couple of type steps. */
  .eco-kpis { gap:8px; }
  .eco-kpis .eco-m { padding:10px; }
  .eco-kpis .eco-m-v { font-size:var(--fs-7); }
  .eco-kpis .eco-m-l { font-size:var(--fs-1); }
}

/* ── directions ─────────────────────────────────────── */
/* Воздуха между карточками и внутри них добавлено (решение заказчика
   08.08.2026): 18 → 30px в сетке, 26/24 → 34/30px внутри. Раньше четыре
   карточки читались сплошным массивом — белого поля между ними почти не
   оставалось. */
.sx-dir-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:30px; }
/* Внутренний отступ вернули к 24px (решение от 09.08.2026, поверх записи
   выше от 08.08.2026) — карточки сведены к масштабу readdy.cc. Сетка между
   карточками (gap:30px) не тронута: пользователь просил про отступ внутри
   карточки, не про воздух между ними. */
.sx-dir { position:relative; border:1px solid var(--sx-line); border-radius:var(--sx-r); background:var(--sx-card); padding:24px; transition:transform .3s cubic-bezier(.16,1,.3,1), border-color .3s; }
/* Тень на hover заменена подсветкой рамки — readdy.cc держит карточки
   полностью плоскими (box-shadow:none) во всех состояниях, глубину даёт
   только смена цвета рамки и сдвиг по Y. */
.sx-dir:hover { transform:translateY(-4px); border-color:var(--sx-accent); }
/* Заголовок — единственная ссылка карточки; её зона нажатия растянута на всю
   карточку. cursor:pointer держится на этом слое, а не на самом блоке: иначе
   палец-курсор появлялся бы и там, где нажимать нечего. */
.sx-dir-t { color:inherit; text-decoration:none; }
.sx-dir-t::after { content:""; position:absolute; inset:0; border-radius:inherit; cursor:pointer; }
/* Ссылки на отдельные направления лежат над растянутой зоной, иначе она
   перехватывала бы клики по ним. */
.sx-dir-links { position:relative; z-index:1; }
/* Фокус с клавиатуры показываем на всей карточке, а не на строке заголовка —
   нажатие всё равно относится к ней целиком. */
.sx-dir:focus-within { outline:2px solid var(--sx-accent); outline-offset:3px; }
.sx-dir-t:focus-visible { outline:none; }
/* Иконка: один фирменный тон на все группы, подложка — он же в 10%.
   Контейнер вырос с 50 до 72px следом за глифом (26 → 39px), чтобы вокруг
   знака остался тот же воздух, а не впритык к краям. */
.sx-dir-ic { width:72px; height:72px; border-radius:var(--r); display:flex; align-items:center; justify-content:center; margin-bottom:22px;
  background:rgba(14,74,198,.10); color:var(--sx-accent); }
.sx-dir h3 { font-size:var(--fs-5); font-weight:800; color:var(--sx-ink); letter-spacing:-.01em; line-height:1.25; }
.sx-dir-links { margin-top:14px; display:flex; flex-direction:column; gap:2px; }
.sx-dir-links a { display:block; font-size:var(--fs-3); color:var(--sx-mute); text-decoration:none; padding:5px 0; transition:color .18s, padding-left .18s; }
.sx-dir-links a:hover { color:var(--sx-blue); padding-left:5px; }

/* ── impact band (dark interlude) ───────────────────── */
/* Three navy slabs — impact, catalog portal, closing CTA — were the page's
   other dark moments. They are now paper: a hairline card on the canvas, with
   the aurora and the blueprint grid switched off. Contrast comes from the
   ecosystem tiles and the hero photograph, and from nothing else. */

/* ── brands pill list (2 rows, clipped) ───────────────── */
.sx-brands-title { display:inline-flex; align-items:center; gap:8px; }

/* ── partners marquee ────────────────────────────────────────────────────
   A wall of names read as a dump of text; it now drifts. The track holds the
   list twice and slides exactly one copy to the left, so the seam lands where
   the first copy ends and the loop is invisible. Duration is set per render
   from the number of names (--mq-dur), which keeps the speed constant however
   many partners the admin adds — a fixed duration would make forty names race
   and six names crawl. */
.sx-mq-sec {background:var(--sx-card);
  padding:clamp(34px,4.5vw,54px) 0}
.sx-mq-head { max-width:var(--maxw); margin:0 auto clamp(22px,2.6vw,32px); padding:0 32px; }
/* Two belts running against each other. Opposite directions are what keep the
   pair from reading as one tall band sliding past, and each row carries its own
   half of the list — the same names twice over would just look like a mistake. */
.sx-mq-vp { position:relative; display:flex; flex-direction:column; gap:clamp(14px,1.8vw,22px); }
.sx-mq-row { overflow:hidden; }
.sx-mq-track { --mq-gap:clamp(38px,5vw,72px);
  display:flex; width:max-content; align-items:center;
  animation:sxMarquee var(--mq-dur,42s) linear infinite; will-change:transform; }
/* Проход несёт и внутренние зазоры, и замыкающий — тогда ширина дорожки ровно
   вдвое больше прохода, и −50 % попадают точно в стык. */
.sx-mq-pass { display:flex; align-items:center; gap:var(--mq-gap); padding-right:var(--mq-gap); flex:0 0 auto; }
@keyframes sxMarquee { from { transform:translate3d(0,0,0); } to { transform:translate3d(-50%,0,0); } }
/* The right-bound row plays the same keyframes backwards, so the seam maths
   stay in one place instead of being written twice with opposite signs. */
.sx-mq-track.rev { animation-direction:reverse; }
/* Hovering stops the belt you are aiming at — and only that one. Freezing both
   rows under a single cursor looks like the page hung. */
.sx-mq-row:hover .sx-mq-track, .sx-mq-row:focus-within .sx-mq-track { animation-play-state:paused; }

/* Monochrome by default, ink on hover — the row stays quiet until you aim at it. */
.sx-mq-item { flex:0 0 auto; display:inline-flex; align-items:center; gap:10px; border:0; background:none; padding:0; cursor:pointer;
  font-family:inherit; font-size:clamp(17px,1.9vw,22px); font-weight:700; letter-spacing:-.015em; white-space:nowrap;
  color:var(--sx-mute); transition:color .25s ease, opacity .25s ease, filter .25s ease; }
.sx-mq-item:hover, .sx-mq-item:focus-visible { color:var(--sx-ink); }
.sx-mq-item:focus-visible { outline:2px solid var(--sx-ink); outline-offset:6px; border-radius:var(--r-sm); }
.sx-mq-item img { height:30px; max-width:120px; object-fit:contain; filter:grayscale(1); opacity:.5; transition:inherit; }
.sx-mq-item:hover img, .sx-mq-item:focus-visible img { filter:grayscale(0); opacity:1; }
.sx-mq-flag { font-size:var(--fs-4); filter:grayscale(1); opacity:.55; transition:inherit; }
.sx-mq-item:hover .sx-mq-flag { filter:grayscale(0); opacity:1; }

/* The fade at both edges: an overlay, never a hit target, so the names it
   covers stay clickable. Painted with the section's own surface colour rather
   than a literal white, or the dark theme would get two white smears. */
.sx-mq-fade { position:absolute; inset:0; pointer-events:none; z-index:1;
  background:linear-gradient(90deg, var(--sx-card) 0%, transparent 12%, transparent 88%, var(--sx-card) 100%); }

@media (prefers-reduced-motion: reduce) {
  /* Standing still, each row becomes an ordinary horizontal scroller. */
  .sx-mq-track { animation:none; }
  .sx-mq-row { overflow-x:auto; scrollbar-width:none; }
  .sx-mq-row::-webkit-scrollbar { display:none; }
}

/* ── proof / cases ──────────────────────────────────── */
/* Колонки сетки проектов заданы не здесь, а рядом с брейкпоинтами .sxc-grid
   (см. «сетки на три колонки» ниже): там они идут после одноклассовых правил
   .sxc-grid и выигрывают порядком при равной специфичности.
   Флексовые flex/max-width/min-width с карточки убраны: в grid они не работали
   как задумано, а max-width:33.333% зажимал карточку внутри и без того более
   узкой колонки, оставляя пустоту справа. */
.sx-case { border:1px solid var(--sx-line); border-radius:var(--sx-r); background:var(--sx-card); overflow:hidden; cursor:pointer; transition:transform .3s cubic-bezier(.16,1,.3,1), border-color .3s; display:flex; flex-direction:column; }
.sx-case:hover { transform:translateY(-5px); border-color:var(--sx-accent); }
/* Два класса в селекторе — чтобы победить .sxc-media (3/4), который лежит
   ниже по файлу и достался обложке заодно: этот же элемент носит оба класса,
   и при равной специфичности выигрывал более поздний. Портретная пропорция
   каталога здесь неуместна — у проекта в кадре здание, а не витрина. */
.sxc-media.sx-case-cover { aspect-ratio:16/10; background:linear-gradient(135deg,var(--sx-bg-soft),var(--sx-line-2)); display:flex; align-items:center; justify-content:center; color:var(--sx-mute); overflow:hidden; }
.sx-case-cover img { width:100%; height:100%; object-fit:cover; }
.sx-case-body { padding:20px 22px; flex:1; display:flex; flex-direction:column; }
/* Бейдж типа проекта: нейтральная серая пилюля, не синяя плашка (09.08.2026,
   по образцу readdy.cc). Синий на ней конкурировал с синими заголовками
   и кнопками секции — тип проекта это ярлык, а не действие. */
/* nowrap + многоточие, а не перенос: «КОМПЛЕКСНОЕ ОСНАЩЕНИЕ» с разрядкой
   требует ~235px, а колонка карточки при трёх в ряд даёт 234 — пилюля
   ломалась на две строки и вырастала до 48px. Теги приходят из CMS и могут
   быть любой длины, поэтому обрезаем, а не подгоняем кегль под один тег. */
/* display:block + width:fit-content, а не inline-flex: на inline-flex
   text-overflow:ellipsis не действует, и длинный тег из CMS обрезался
   «в обрыв», без многоточия. */
.sx-case-tag { display:block; width:fit-content; align-self:flex-start; max-width:100%; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  font-size:var(--fs-1); font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:var(--sx-ink-soft); background:var(--sx-bg-soft); padding:6px 12px; border-radius:var(--r-pill); margin-bottom:13px; }
.sx-case h3 { font-size:var(--fs-5); font-weight:800; color:var(--sx-ink); line-height:1.25; letter-spacing:-.01em; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
.sx-case p { font-size:var(--fs-4); color:var(--sx-mute); line-height:1.55; margin:8px 0 0; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
/* Мета отбита волосяной линией и держится на иконках вместо подписей
   «Год:»/«Регион:» — булавка и календарь читаются быстрее слова. */
.sx-case-meta {display:flex; flex-wrap:wrap; gap:8px 18px; margin-top:auto; padding-top:14px; border-top:1px solid var(--sx-line); font-size:var(--fs-3); color:var(--sx-mute)}
.sx-case-meta > span { display:inline-flex; align-items:center; gap:7px; }
.sx-case-meta svg { flex-shrink:0; color:var(--sx-mute); }

/* ── news ───────────────────────────────────────────── */
/* Колонки — там же, где у проектов (см. «сетки на три колонки»). Раньше здесь
   стоял одноклассовый .sx-news с тремя колонками, и он был мёртв дважды: класс
   не был проставлен в разметке вовсе, а по специфичности он всё равно проиграл
   бы четырём колонкам .sxc-grid. Новости из-за этого шли по четыре в ряд —
   вернее, три занимали три колонки из четырёх, оставляя пустоту справа. */
.sx-ncard { border:1px solid var(--sx-line); border-radius:var(--sx-r); background:var(--sx-card); overflow:hidden; cursor:pointer; transition:transform .3s, border-color .3s; }
.sx-ncard:hover { transform:translateY(-4px); border-color:var(--sx-accent); }
/* Два класса — по той же причине, что и у обложки проекта: перебиваем
   портретный 3/4 из .sxc-media. */
.sxc-media.sx-ncard-cover { aspect-ratio:16/9; background:linear-gradient(135deg,var(--sx-bg-soft),var(--sx-line-2)); display:flex; align-items:center; justify-content:center; color:var(--sx-mute); overflow:hidden; }
.sx-ncard-cover img { width:100%; height:100%; object-fit:cover; }
.sx-ncard-body { padding:20px; }
/* Дата в разрядку заглавными (09.08.2026, по образцу readdy.cc): так она
   читается как рубрика-надзаголовок, а не как часть заголовка новости. */
.sx-ncard-date { font-size:var(--fs-1); color:var(--sx-mute); font-weight:700; text-transform:uppercase; letter-spacing:.1em; }
.sx-ncard h3 { font-size:var(--fs-5); font-weight:700; color:var(--sx-ink); line-height:1.35; margin-top:10px; }
/* Явное приглашение открыть статью: раньше карточка была кликабельна целиком,
   но ничем об этом не сообщала. */
.sx-ncard-more { display:inline-flex; align-items:center; gap:8px; margin-top:14px;
  font-size:var(--fs-1); font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:var(--sx-accent); }
.sx-ncard-more svg { transition:transform .2s; }
.sx-ncard:hover .sx-ncard-more svg { transform:translateX(4px); }

/* ── catalog portal ──────────────────────────────────── */
.sx-cp { position:relative; background:var(--sx-card); border:1px solid var(--sx-line); border-radius:var(--r-xl); padding:clamp(36px,5vw,64px); overflow:hidden; }
.sx-cp-aurora { position:absolute; inset:0; background:
  radial-gradient(ellipse 65% 90% at 5% 50%, rgba(14,74,198,.42), transparent 68%),
  radial-gradient(ellipse 55% 70% at 95% 25%, rgba(20,184,224,.28), transparent 63%),
  radial-gradient(ellipse 45% 65% at 55% 85%, rgba(100,84,212,.22), transparent 58%); pointer-events:none; }
.sx-cp-ov { position:absolute; inset:0; background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px); background-size:44px 44px; -webkit-mask-image:radial-gradient(ellipse 90% 90% at 50% 0%,#000 30%,transparent 80%); mask-image:radial-gradient(ellipse 90% 90% at 50% 0%,#000 30%,transparent 80%); pointer-events:none; }
.sx-cp-inner { position:relative; z-index:1; display:grid; grid-template-columns:1.1fr 1fr; gap:clamp(28px,4vw,56px); align-items:center; }
.sx-cp-aurora, .sx-cp-ov { display:none; }
.sx-cp-eyebrow::before { content:""; width:16px; height:1px; background:var(--sx-line); }
.sx-cp-h2 { font-size:clamp(26px,3.4vw,42px); font-weight:800; letter-spacing:-.032em; color:var(--sx-ink); margin:14px 0 0; line-height:1.08; }
.sx-cp-sub { font-size:clamp(14px,1.3vw,16px); color:var(--sx-mute); margin:14px 0 28px; line-height:1.65; }
.sx-cp-btn { display:inline-flex; align-items:center; gap:10px; height:48px; padding:0 26px; border-radius:var(--r-pill); background:var(--sx-lime); color:var(--sx-lime-ink); font-size:var(--fs-4); font-weight:700; border:none; cursor:pointer; transition:background .2s, gap .2s; font-family:inherit; }
.sx-cp-btn:hover { background:color-mix(in srgb, var(--sx-lime) 82%, #fff); gap:14px; }
.sx-cp-tiles { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.sx-cp-tile { display:flex; align-items:center; gap:13px; padding:15px 17px; border-radius:var(--r); background:var(--sx-bg-soft); border:1px solid var(--sx-line); cursor:pointer; text-align:left; transition:background .2s,border-color .2s; }
.sx-cp-tile:hover { background:var(--sx-card); border-color:var(--sx-ink-soft); }
.sx-cp-tile-ic { width:36px; height:36px; border-radius:var(--r-sm); display:flex; align-items:center; justify-content:center; background:var(--sx-card); border:1px solid var(--sx-line); color:var(--sx-accent); flex-shrink:0; }
.sx-cp-tile-t { flex:1; font-size:var(--fs-3); font-weight:700; color:var(--sx-ink); line-height:1.3; }
.sx-cp-tile-arr { color:var(--sx-mute); transition:transform .2s,color .2s; flex-shrink:0; }
.sx-cp-tile:hover .sx-cp-tile-arr { transform:translate(3px,-2px); color:var(--sx-ink); }
@media(max-width:820px){ .sx-cp-inner{ grid-template-columns:1fr; } }
@media(max-width:480px){ .sx-cp-tiles{ grid-template-columns:1fr; } }

/* ── final CTA ──────────────────────────────────────── */
.sx-cta { position:relative; background:var(--sx-bg); border:1px solid var(--sx-line); border-radius:var(--r-xl); padding:clamp(48px,6vw,80px); overflow:hidden; text-align:center; }
.sx-cta-aurora { position:absolute; inset:0; background:
  radial-gradient(ellipse 70% 90% at 30% 20%, rgba(14,74,198,.4),transparent 70%),
  radial-gradient(ellipse 60% 80% at 80% 90%, rgba(20,184,224,.28),transparent 65%); }
.sx-cta-inner { position:relative; z-index:1; }
.sx-cta-aurora { display:none; }
.sx-cta h2 { font-size:clamp(32px,4.4vw,56px); font-weight:800; letter-spacing:-.035em; color:var(--sx-ink); line-height:1.04; max-width:740px; margin:0 auto; }
.sx-cta p { font-size:var(--fs-5); color:var(--sx-mute); margin:18px auto 0; max-width:520px; line-height:1.6; }
.sx-cta-actions { display:flex; gap:14px; justify-content:center; flex-wrap:wrap; margin-top:36px; }
/* One button shape for the whole page — the pill the header and hero already
   use. Before this, a section could put a lime pill next to a blue rectangle
   offering the same thing, which is what made the page read as assembled from
   parts. Primary carries the lime; everything else is a hairline. */
.sx-btn { display:inline-flex; align-items:center; gap:9px; height:48px; padding:0 26px; border-radius:var(--r-pill); font-size:var(--fs-4); font-weight:700; cursor:pointer; border:1px solid transparent; font-family:inherit; letter-spacing:-.005em; transition:background .2s, border-color .2s, color .2s, gap .2s; }
.sx-btn-primary { background:var(--sx-lime); color:var(--sx-lime-ink); }
.sx-btn-primary:hover { background:color-mix(in srgb, var(--sx-lime) 82%, #fff); gap:13px; }
.sx-btn-ghost { background:transparent; color:var(--sx-ink); border-color:var(--sx-line); }
.sx-btn-ghost:hover { background:var(--sx-bg-soft); border-color:var(--sx-ink-soft); gap:13px; }
/* On the dark panels that survive (the hero photo, the tiles) the ghost has to
   invert or it disappears into the ground. */
.sx-on-dark .sx-btn-ghost, .sx-btn-ghost.on-dark { color:#fff; border-color:rgba(255,255,255,.28); }
.sx-on-dark .sx-btn-ghost:hover, .sx-btn-ghost.on-dark:hover { background:rgba(255,255,255,.12); border-color:rgba(255,255,255,.5); }

/* ── reviews ─────────────────────────────────────────── */
.sx-rev-head { display:flex; align-items:flex-start; justify-content:space-between; gap:20px; flex-wrap:wrap; margin-bottom:40px; }
.sx-rev-head-left h2 { display:flex; align-items:center; gap:8px; cursor:pointer; }
.sx-rev-head-left h2:hover { color:var(--sx-blue); }
/* Сегментированный переключатель-пилюля (09.08.2026, по образцу readdy.cc):
   раньше вкладки подчёркивались снизу тонкой линией. Пилюля показывает,
   что это выбор одного из двух, а не две отдельные ссылки. */
.sx-rev-tabs {display:inline-flex; gap:2px; align-items:center; flex-shrink:0;
  margin-top:16px; padding:4px; background:var(--sx-bg-soft); border:1px solid var(--sx-line); border-radius:var(--r-pill)}
.sx-rev-tab { min-height:38px; padding:9px 20px; font-size:var(--fs-4); font-weight:600; color:var(--sx-mute); background:transparent; border:none; border-radius:var(--r-pill); cursor:pointer; font-family:inherit; position:relative; transition:color .18s, background .18s; white-space:nowrap; }
.sx-rev-tab.on { color:#fff; background:var(--sx-accent); }
.sx-rev-tab:not(.on):hover { color:var(--sx-ink); }
.sx-rev-tab:focus-visible { outline:2px solid var(--sx-blue); outline-offset:2px; }
/* Карусель выровнена по остальным блокам: раньше стрелки стояли в потоке и
   вдавливали ленту карточек на 58 px внутрь, из-за чего письма не совпадали
   по левому краю ни с заголовком блока, ни с карточками соседних секций.
   Теперь стрелки вынесены из потока и висят над краями ленты. */
.sx-rev-outer { position:relative; display:block; }
.sx-rev-arr { position:absolute; top:50%; transform:translateY(-50%); z-index:2;
  flex-shrink:0; width:44px; height:44px; border-radius:50%; border:1.5px solid var(--sx-line); background:var(--sx-card); color:var(--sx-ink); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .18s,border-color .18s,opacity .18s; }
.sx-rev-arr:hover:not(:disabled) { background:var(--sx-bg-soft); border-color:var(--sx-blue); color:var(--sx-blue); }
.sx-rev-arr:disabled { opacity:.3; cursor:default; }
.sx-rev-arr:focus-visible { outline:2px solid var(--sx-blue); outline-offset:2px; }
.sx-rev-overflow { overflow:hidden; }
.sx-rev-outer > .sx-rev-arr:first-of-type { left:-22px; }
.sx-rev-outer > .sx-rev-arr:last-of-type { right:-22px; }
.sx-rev-arr { box-shadow:var(--sh-sm); }
@media(max-width:900px){
  /* На узких экранах вынос за край упирается в поля страницы — возвращаем
     стрелки внутрь ленты. */
  .sx-rev-outer > .sx-rev-arr:first-of-type { left:4px; }
  .sx-rev-outer > .sx-rev-arr:last-of-type { right:4px; }
}
.sx-rev-track { display:flex; gap:20px; transition:transform .45s cubic-bezier(.16,1,.3,1); }
.sx-rev-card { flex:0 0 calc(50% - 10px); display:flex; gap:22px; align-items:flex-start; background:var(--sx-card); border:1px solid var(--sx-line); border-radius:var(--sx-r); padding:24px 26px; }
.sx-rev-doc { flex-shrink:0; width:134px; aspect-ratio:210/297; border-radius:var(--r-sm); overflow:hidden; box-shadow:var(--sh-lg); background:#fff; cursor:pointer; transition:transform .2s,box-shadow .2s; }
.sx-rev-doc:hover { transform:translateY(-2px); box-shadow:var(--sh-sm); }
.sx-rev-doc:focus-visible { outline:2px solid var(--sx-blue); outline-offset:2px; }
.sx-rev-doc > img, .sx-rev-doc > svg { width:100%; height:100%; display:block; }
.sx-rev-doc > img { object-fit:cover; object-position:top; }
.sx-rev-body { flex:1; min-width:0; display:flex; flex-direction:column; }
.sx-rev-badges { display:flex; flex-wrap:wrap; gap:7px; margin-bottom:12px; }
/* Серая пилюля вместо синей рамки (09.08.2026, по образцу readdy.cc): роль и
   город — это ярлык, а не действие, и синим они конкурировали с заголовком. */
.sx-rev-badge { display:inline-flex; align-items:center; gap:6px; max-width:100%; min-width:0; white-space:nowrap; overflow:hidden;
  font-size:var(--fs-1); font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:var(--sx-ink-soft); background:var(--sx-bg-soft); border:none; border-radius:var(--r-pill); padding:6px 12px; line-height:1.3; }
/* Обрезаем подпись, а не саму пилюлю: иначе булавка уехала бы под обрез. */
.sx-rev-badge > span { overflow:hidden; text-overflow:ellipsis; }
.sx-rev-badge svg { color:var(--sx-accent); }
.sx-rev-org { font-size:var(--fs-5); font-weight:800; color:var(--sx-ink); line-height:1.25; letter-spacing:-.015em; margin:0 0 10px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.sx-rev-quote { font-size:var(--fs-4); line-height:1.65; color:var(--sx-mute); flex:1; margin:0; display:-webkit-box; -webkit-line-clamp:5; -webkit-box-orient:vertical; overflow:hidden; }
/* Футер карточки: «Читать полностью» слева, круглая стрелка справа. Раньше у
   карточки не было явного приглашения открыть письмо — кликабельной была
   только миниатюра, и об этом никто не догадывался. */
.sx-rev-more { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-top:14px;
  width:100%; padding:0; background:none; border:none; cursor:pointer; font-family:inherit; text-align:left; }
.sx-rev-more:focus-visible { outline:2px solid var(--sx-accent); outline-offset:3px; border-radius:var(--r-sm); }
.sx-rev-more-t { font-size:var(--fs-3); color:var(--sx-mute); }
.sx-rev-more-arr { display:flex; align-items:center; justify-content:center; flex-shrink:0; width:38px; height:38px;
  border-radius:50%; border:1px solid var(--sx-line); color:var(--sx-ink); background:var(--sx-card);
  transition:background .2s, border-color .2s, color .2s; }
.sx-rev-card:hover .sx-rev-more-arr { background:var(--sx-accent); border-color:var(--sx-accent); color:#fff; }
@media(max-width:820px){
  .sx-rev-card { flex:0 0 calc(100% - 10px); }
  .sx-rev-doc { width:88px; }
}
@media(max-width:500px){
  .sx-rev-doc { display:none; }
  .sx-rev-card { padding:18px; }
  .sx-rev-head { flex-direction:column; }
}
@media(prefers-reduced-motion:reduce){
  .sx-rev-track { transition:none; }
}

/* ── focus & accessibility (WCAG 2.4.7) ─────────────── */
.sx-cp-btn:focus-visible,
.sx-btn:focus-visible { outline:3px solid var(--sx-ink); outline-offset:3px; }
.sx-cp-tile:focus-visible,
.sx-dir:focus-visible,
.sx-case:focus-visible,
.sx-ncard:focus-visible { outline:2px solid var(--sx-blue); outline-offset:2px; border-radius:inherit; }
.soi-search-input:focus-visible { outline:2px solid var(--sx-blue); outline-offset:0; }
@media (prefers-reduced-motion: reduce) {
  .sx-cp-btn, .sx-cp-tile, .eco-t, .eco-cta, .sx-dir, .sx-case, .sx-ncard,
  .sx-mq-item,
  .sx-btn { transition:none !important; transform:none !important; }
  .eco-live::before { animation:none !important; }
}

/* ── responsive ─────────────────────────────────────── */
@media (max-width:980px){
  .sx-bento { grid-template-columns:repeat(2,1fr); grid-template-areas:
    "catalog catalog" "reg reg" "tender service" "brands equip"; }
  .sx-dir-grid { grid-template-columns:repeat(2,1fr); }
  /* Колонки проектов и новостей на узких экранах — в блоке «сетки на три
     колонки» ниже, вместе с остальными их брейкпоинтами. */
}
@media (max-width:560px){
  .sx-bento { grid-template-columns:1fr; grid-template-areas:"catalog" "reg" "tender" "service" "brands" "equip"; }
  .sx-dir-grid { grid-template-columns:1fr; }
  .sx-cta { border-radius:var(--r-lg); }
}
    `;document.head.appendChild(s);return()=>{}},[]);return null}function _lv(lang,ru,uz,en){return lang==="uz"?uz:lang==="en"?en:ru}var ECO_DEFAULTS={catalog_num:SITE_FIGURES_DEFAULTS.catalog,catalog_unit:"+",training_num:SITE_FIGURES_DEFAULTS.trained,training_unit:"+",service_num:SITE_FIGURES_DEFAULTS.service,service_unit:"+",training_photo:"",service_photo:"",brands_num:SITE_FIGURES_DEFAULTS.brands,brands_unit:"+",delivery_num:SITE_FIGURES_DEFAULTS.regions,delivery_unit:""};function useEcoPulse(){var[pulse,setPulse]=useState({stats:null,platforms:[],cats:[],brands:[],products:null});useEffect(()=>{var api=window.api;if(!api||!api.listPublic)return;var alive=true;var put=patch=>{if(alive)setPulse(p=>({...p,...patch}))};var ok=(p,fn)=>p.then(fn).catch(()=>{});ok(api.listPublic("etender/stats"),r=>put({stats:r}));ok(api.listPublic("etender/platforms"),r=>put({platforms:Array.isArray(r)?r:[]}));ok(api.listPublic("etender/categories"),r=>put({cats:Array.isArray(r)?r:[]}));ok(api.listPublic("brands",{limit:6,page:1}),r=>put({brands:r&&r.data||(Array.isArray(r)?r:[])}));ok(api.listPublic("products",{limit:1,page:1}),r=>put({products:r&&r.total||0}));return()=>{alive=false}},[]);return pulse}function ecoShortSum(value,lang){var v=Number(value);if(!isFinite(v)||v<=0)return"—";var cut=n=>n.toFixed(1).replace(/\.0$/,"").replace(".",_lv(lang,",",",","."));if(v>=1e9)return cut(v/1e9)+" "+_lv(lang,"млрд","mlrd","bn");if(v>=1e6)return Math.round(v/1e6)+" "+_lv(lang,"млн","mln","mn");return Math.round(v).toLocaleString("ru-RU")}function ecoAgo(iso,lang){if(!iso)return"";var min=Math.floor((Date.now()-new Date(iso).getTime())/60000);if(!isFinite(min)||min<0)return"";if(min<1)return _lv(lang,"только что","hozirgina","just now");if(min<60)return _lv(lang,`${min} мин назад`,`${min} daqiqa oldin`,`${min} min ago`);var h=Math.floor(min/60);if(h<24)return _lv(lang,`${h} ч назад`,`${h} soat oldin`,`${h} h ago`);var d=Math.floor(h/24);return _lv(lang,`${d} дн назад`,`${d} kun oldin`,`${d} d ago`)}function EcoCount({value}){var ref=useRef(null);var shownRef=useRef(0);var raw=value==null?"":String(value);var[out,setOut]=useState(raw);React.useLayoutEffect(()=>{var el=ref.current;var digits=raw.replace(/\D/g,"");var reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;if(!el||!digits||reduce){setOut(raw);return}var target=parseInt(digits,10);var from=shownRef.current;var grouped=/\d[\s ]\d/.test(raw);var fmt=n=>grouped?n.toLocaleString("ru-RU"):String(n);var[,head="",tail=""]=raw.match(/^(\D*)[\d\s ]*(\D*)$/)||[];var frame=0;var done=false;var run=()=>{var t0=performance.now();var step=now=>{var p=Math.min(1,(now-t0)/1100);var eased=1-Math.pow(1-p,3);var n=Math.round(from+(target-from)*eased);shownRef.current=n;setOut(head+fmt(n)+tail);if(p<1)frame=requestAnimationFrame(step)};frame=requestAnimationFrame(step)};setOut(head+fmt(from)+tail);var io=new IntersectionObserver(entries=>{if(!done&&entries.some(e=>e.isIntersecting)){done=true;io.disconnect();run()}},{threshold:.35});io.observe(el);return()=>{io.disconnect();cancelAnimationFrame(frame)}},[raw]);return React.createElement("span",{ref:ref},out)}function tndStamp(iso){var d=new Date(iso);if(!iso||isNaN(d))return"";var p=new Intl.DateTimeFormat("ru-RU",{timeZone:"Asia/Tashkent",day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",hour12:false}).formatToParts(d).reduce((a,x)=>(a[x.type]=x.value,a),{});return`${p.day}.${p.month}.${p.year} · ${p.hour}:${p.minute}`}function tndMoney(sum,lang){var n=Number(sum)||0;if(n<1e6)return"";var cur=_lv(lang,"сум","so'm","UZS");if(n>=1e9)return`${(n/1e9).toLocaleString("ru-RU",{maximumFractionDigits:1})} ${_lv(lang,"млрд","mlrd","bn")} ${cur}`;return`${Math.round(n/1e6).toLocaleString("ru-RU")} ${_lv(lang,"млн","mln","m")} ${cur}`}function EcoMetrics({items,className}){var shown=items.filter(m=>m.v!==""&&m.v!=null);if(!shown.length)return null;return React.createElement("div",{className:"eco-metrics"+(className?" "+className:"")},shown.map((m,i)=>React.createElement("div",{className:"eco-m",key:i},React.createElement("div",{className:"eco-m-v"},m.v),React.createElement("div",{className:"eco-m-l"},m.l))))}var ECO_MAP_PATH="M185.5 191.9 L186 177.7 L162.7 167.7 L144.4 156.2 L132.9 145.3 L112.9 129.1 L104.3 105.1 L98.4 100.8 L79.5 101.9 L72.8 97.1 L70.9 78.5 L47.3 66.2 L32.5 79.7 L17.6 87.8 L20.5 99.5 L0.7 99.9 L0 13.8 L45.1 0 L48.4 2 L75.5 18.7 L89.9 27.6 L106.6 48.6 L127.1 45.2 L157.2 43.4 L178.1 60.4 L176.8 83.8 L185.4 84 L188.9 103.1 L211.2 103.9 L216 114.9 L222.5 114.8 L230.2 98.1 L253.3 81.8 L263.3 77.5 L268.5 79.8 L253.8 94.9 L266.8 103.7 L279.2 97.9 L300 110.2 L277.6 127 L264.2 124.7 L257 125.3 L254.5 118.8 L258.2 108 L234.7 113.4 L229.2 128.4 L220.8 141.3 L206.2 140.2 L201.7 150.5 L214.5 156 L218.3 173.4 L208.5 197 L195.3 192.1 Z";var ECO_MAP_NODES=[[64.5,73],[82.3,94.2],[77.6,98.2],[148.7,135.8],[165.6,128.5],[172.7,157],[198.8,195.3],[193.2,138.6],[208.6,127.6],[225.1,119],[233.2,99.8],[275.7,107.3],[287.5,112.2],[277.7,121.3]];var ECO_HUB=10;function EcoUzMap({lang}){var hub=ECO_MAP_NODES[ECO_HUB];return React.createElement("svg",{className:"eco-map",viewBox:"-4 -4 308 205",role:"img",focusable:"false"},React.createElement("title",null,_lv(lang,"Карта Узбекистана: 14 регионов доставки","O'zbekiston xaritasi: 14 ta yetkazish hududi","Map of Uzbekistan: 14 delivery regions")),React.createElement("path",{className:"eco-map-land",d:ECO_MAP_PATH}),ECO_MAP_NODES.map((n,i)=>{if(i===ECO_HUB)return null;var d=`M${hub[0]} ${hub[1]} Q ${(hub[0]+n[0])/2} ${(hub[1]+n[1])/2-14} ${n[0]} ${n[1]}`;var delay=`${(i*0.24).toFixed(2)}s`;return React.createElement("g",{key:"r"+i},React.createElement("path",{className:"eco-map-route",d:d}),React.createElement("path",{className:"eco-map-flow",d:d,pathLength:"1",style:{animationDelay:delay}}))}),React.createElement("circle",{className:"eco-map-ping",cx:hub[0],cy:hub[1],r:"4.4"}),ECO_MAP_NODES.map((n,i)=>i===ECO_HUB?null:React.createElement("circle",{key:"n"+i,className:"eco-map-dot",cx:n[0],cy:n[1],r:"2.6",style:{animationDelay:`${(i*0.24).toFixed(2)}s`}})),React.createElement("circle",{className:"eco-map-hub",cx:hub[0],cy:hub[1],r:"4.4"}))}function useRowCycle(count,ms){var[i,setI]=useState(0);useEffect(()=>{if(!count)return;var mq=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)");if(mq&&mq.matches)return;var id=setInterval(()=>setI(p=>(p+1)%count),ms);return()=>clearInterval(id)},[count,ms]);if(!count)return-1;var mq=typeof window!=="undefined"&&window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)");if(mq&&mq.matches)return-1;return i%count}function SoiEcosystem({lang,go}){var eco=useHomeSetting("homepage_ecosystem",ECO_DEFAULTS);var pulse=useEcoPulse();var val=f=>eco&&Object.prototype.hasOwnProperty.call(eco,f)?eco[f]:ECO_DEFAULTS[f];var st=pulse.stats;var srcs=pulse.platforms;var TND_CATS=[{id:"equipment",icon:"wave",ru:"Медицинское оборудование",uz:"Tibbiy uskunalar",en:"Medical equipment"},{id:"furniture",icon:"bed",ru:"Медицинская мебель",uz:"Tibbiy mebel",en:"Medical furniture"},{id:"instruments",icon:"scalpel",ru:"Медицинские инструменты",uz:"Tibbiy asboblar",en:"Medical instruments"},{id:"consumables",icon:"box",ru:"Расходные материалы",uz:"Sarf materiallari",en:"Consumables"},{id:"other",icon:"doc",ru:"Прочее",uz:"Boshqa",en:"Other"}];var tndCats=(()=>{var by=new Map(pulse.cats.map(c=>[c.category,c]));var own=TND_CATS.slice(0,4).map(c=>({...c,label:_lv(lang,c.ru,c.uz,c.en),count:(by.get(c.id)||{}).count||0,sum:(by.get(c.id)||{}).sum||0}));var ownIds=new Set(own.map(c=>c.id));var rest=pulse.cats.filter(c=>!ownIds.has(c.category));var other=TND_CATS[4];return[...own,{...other,id:rest.map(c=>c.category).join(",")||other.id,label:_lv(lang,other.ru,other.uz,other.en),count:rest.reduce((a,c)=>a+(c.count||0),0),sum:rest.reduce((a,c)=>a+(c.sum||0),0)}]})();var liveProducts=pulse.products!=null&&pulse.products>=100?pulse.products:null;var brandWall=pulse.brands.filter(b=>b&&b.name).slice(0,5);var showWall=brandWall.length>=3;var catLit=useRowCycle(tndCats.length,2400);var srcLit=useRowCycle(srcs.length,3100);return React.createElement("section",{className:"sx-section eco-section"},React.createElement("div",{className:"sx-wrap"},React.createElement("div",{className:"eco-grid"},React.createElement("article",{className:"eco-t catalog sx-rv"},React.createElement("div",{className:"eco-head"},React.createElement("div",{className:"eco-ic"},React.createElement(Icon,{name:"grid",size:22})),liveProducts&&React.createElement("div",{className:"eco-badge"},React.createElement("b",null,liveProducts.toLocaleString("ru-RU")),_lv(lang,"товаров","mahsulot","items"))),React.createElement("div",{className:"eco-num"},React.createElement(EcoCount,{value:val("catalog_num")}),React.createElement("span",null,val("catalog_unit"))),React.createElement("h3",null,_lv(lang,"Электронный каталог оборудования","Elektron uskunalar katalogi","Electronic equipment catalog")),React.createElement("p",null,_lv(lang,"Медтехника, мебель, инструменты и расходные материалы от ведущих мировых производителей.","Tibbiy texnika, mebel, asboblar va sarf materiallari — yetakchi jahon ishlab chiqaruvchilaridan.","Equipment, furniture, instruments and consumables from leading global manufacturers.")),React.createElement("div",{className:"eco-foot"},React.createElement("button",{className:"eco-cta solid",onClick:()=>go("catalog")},_lv(lang,"Перейти в каталог","Katalogga o'tish","Open the catalog"),React.createElement(Icon,{name:"arrowRight",size:15})))),React.createElement("article",{className:"eco-t training sx-rv"},val("training_photo")?React.createElement("div",{className:"eco-photo",style:{backgroundImage:`url(${val("training_photo")})`}}):null,React.createElement("div",{className:"eco-head"},React.createElement("div",{className:"eco-ic"},React.createElement(Icon,{name:"user",size:22}))),React.createElement("div",{className:"eco-num"},React.createElement(EcoCount,{value:val("training_num")}),React.createElement("span",null,val("training_unit"))),React.createElement("h3",null,_lv(lang,"Обученных специалистов","O'qitilgan mutaxassislar","Trained specialists")),React.createElement("p",null,_lv(lang,"Обучаем персонал клиник работе с поставленным оборудованием — очно и онлайн.","Klinika xodimlarini yetkazib berilgan uskunalar bilan ishlashga o'rgatamiz — joyida va onlayn.","We train clinic staff to operate the delivered equipment — on-site and online.")),React.createElement("div",{className:"eco-foot"},React.createElement("button",{className:"eco-cta",onClick:()=>go("staffTraining")},_lv(lang,"Обучение персонала","Xodimlarni o'qitish","Staff training"),React.createElement(Icon,{name:"arrowRight",size:15})))),React.createElement("article",{className:"eco-t tender sx-rv"},React.createElement("div",{className:"tnd-top"},React.createElement("div",{className:"eco-ic"},React.createElement(Icon,{name:"pulse",size:22})),React.createElement("div",{className:"tnd-titles"},React.createElement("h3",{className:"tnd-eyebrow"},_lv(lang,"Мониторинг государственных и корпоративных закупок","Davlat va korporativ xaridlar monitoringi","Public & corporate procurement monitoring"))),st&&st.lastSyncAt&&React.createElement("div",{className:"eco-live",title:_lv(lang,"Время последней синхронизации","Oxirgi sinxronizatsiya vaqti","Last sync time")},_lv(lang,"Обновлено","Yangilandi","Updated")," ",tndStamp(st.lastSyncAt))),React.createElement("div",{className:"tnd-kpis"},React.createElement("div",{className:"tnd-kpi lead"},React.createElement("div",{className:"tnd-kpi-head"},React.createElement("div",{className:"tnd-kpi-v"},React.createElement(EcoCount,{value:st?st.active:"—"})),React.createElement("div",{className:"tnd-kpi-l"},_lv(lang,"активных закупок","faol xarid","active lots")),React.createElement("div",{className:"tnd-sec-h"},_lv(lang,"Категории закупок","Xarid kategoriyalari","Procurement categories"))),React.createElement("div",{className:"tnd-sec"},tndCats.map((c,i)=>React.createElement("button",{className:"tnd-row cat"+(c.count?"":" zero")+(i===catLit?" is-lit":""),key:c.id,style:{"--bar":(1-i*0.15).toFixed(2)},onClick:()=>go("tenders",{cat:c.id}),title:_lv(lang,"Открыть тендеры: ","Tenderlarni ochish: ","Open tenders: ")+c.label},React.createElement("span",{className:"tnd-bar"}),React.createElement("span",{className:"tnd-row-n"},c.label),React.createElement("span",{className:"tnd-row-sum"},tndMoney(c.sum,lang)),React.createElement("span",{className:"tnd-row-v"},c.count))))),React.createElement("div",{className:"tnd-kpi tnd-kpi-src"},React.createElement("div",{className:"tnd-kpi-head"},React.createElement("div",{className:"tnd-kpi-v"},React.createElement(EcoCount,{value:srcs.length||"—"})),React.createElement("div",{className:"tnd-kpi-l"},_lv(lang,"площадок мониторинга","kuzatilayotgan maydoncha","platforms watched"))),React.createElement("div",{className:"tnd-kpi-list"},srcs.map((s,si)=>React.createElement("a",{className:"tnd-row"+(s.count?"":" zero")+(si===srcLit?" is-lit":""),key:s.id,href:s.site,target:"_blank",rel:"noopener noreferrer",title:(s.description?_lv(lang,s.description.ru,s.description.uz,s.description.en)+" · ":"")+s.site},React.createElement("span",{className:"tnd-dot"+(s.count?"":" off")}),React.createElement("span",{className:"tnd-row-n"},s.name),React.createElement("span",{className:"tnd-row-v"},s.count||"—")))))),React.createElement("div",{className:"eco-foot",style:{paddingTop:12}},React.createElement("button",{className:"eco-cta solid",onClick:()=>go("tenders")},_lv(lang,"Все тендеры","Barcha tenderlar","All tenders"),React.createElement(Icon,{name:"arrowRight",size:15})))),React.createElement("article",{className:"eco-t brands sx-rv"},React.createElement("div",{className:"eco-head"},React.createElement("div",{className:"eco-ic"},React.createElement(Icon,{name:"award",size:22}))),React.createElement("div",{className:"eco-num"},React.createElement(EcoCount,{value:val("brands_num")}),React.createElement("span",null,val("brands_unit"))),React.createElement("h3",null,_lv(lang,"Мировые бренды","Jahon brendlari","Global brands")),React.createElement("p",null,_lv(lang,"Официальные поставки от производителей из 12 стран.","12 mamlakat ishlab chiqaruvchilaridan rasmiy yetkazib berish.","Official supply from manufacturers across 12 countries.")),showWall&&React.createElement("div",{className:"eco-brands"},brandWall.map(b=>React.createElement("span",{className:"eco-brand",key:b.id||b.name},b.logoUrl?React.createElement("img",{src:b.logoUrl,alt:b.name,loading:"lazy",onError:e=>{e.currentTarget.replaceWith(document.createTextNode(b.name))}}):b.name))),React.createElement("div",{className:"eco-foot"},React.createElement("button",{className:"eco-cta",onClick:()=>go("partners")},_lv(lang,"Все бренды","Barcha brendlar","All brands"),React.createElement(Icon,{name:"arrowRight",size:15})))),React.createElement("article",{className:"eco-t service sx-rv"},val("service_photo")?React.createElement("div",{className:"eco-photo",style:{backgroundImage:`url(${val("service_photo")})`}}):null,React.createElement("div",{className:"eco-head"},React.createElement("div",{className:"eco-ic"},React.createElement(Icon,{name:"wrench",size:22}))),React.createElement("div",{className:"eco-num"},React.createElement(EcoCount,{value:val("service_num")}),React.createElement("span",null,val("service_unit"))),React.createElement("h3",null,_lv(lang,"Успешно выполненных сервисных работ","Muvaffaqiyatli bajarilgan servis ishlari","Completed service jobs")),React.createElement("p",null,_lv(lang,"Пусконаладка, плановое обслуживание и ремонт оборудования по всей стране.","Ishga tushirish, rejali xizmat va ta'mirlash butun mamlakat bo'ylab.","Commissioning, maintenance and repair across the country.")),React.createElement("div",{className:"eco-foot"},React.createElement("button",{className:"eco-cta",onClick:()=>go("serviceSupport")},_lv(lang,"Сервис и поддержка","Servis va qo'llab-quvvatlash","Service & support"),React.createElement(Icon,{name:"arrowRight",size:15})))),React.createElement("article",{className:"eco-t delivery sx-rv"},React.createElement("div",{className:"eco-head"},React.createElement("div",{className:"eco-ic"},React.createElement(Icon,{name:"pin",size:22}))),React.createElement("div",{className:"eco-num"},React.createElement(EcoCount,{value:val("delivery_num")}),React.createElement("span",null,val("delivery_unit"))),React.createElement("h3",null,_lv(lang,"Доставка по всей стране","Butun mamlakat bo'ylab yetkazish","Nationwide delivery")),React.createElement("p",null,_lv(lang,"Поставка, логистика и сопровождение в 14 регионах Узбекистана.","14 hududda yetkazib berish, logistika va qo'llab-quvvatlash.","Delivery, logistics and support across 14 regions of Uzbekistan.")),React.createElement(EcoUzMap,{lang:lang})))))}var EXPERTISE_ITEMS=[{nav:"registration",t:{ru:"Регистрация медицинских изделий",uz:"Tibbiy buyumlarni ro'yxatdan o'tkazish",en:"Medical device registration"},d:{ru:"Досье, экспертиза и взаимодействие с регулятором — выводим изделие на рынок под ключ.",uz:"Hujjatlar, ekspertiza va regulyator bilan ishlash — buyumni bozorga kalit topshirish sharti bilan chiqaramiz.",en:"Dossier, expert review and regulator liaison — we bring your device to market turnkey."},proof:{ru:"Сопровождение в соответствии с ПКМ №738",uz:"PKM №738 talablariga muvofiq hamrohlik",en:"Handled per Resolution No. 738"},list:{ru:["Анализ изделия и документов","Подготовка регистрационного досье","Испытания и получение РУ"],uz:["Buyum va hujjatlarni tahlil qilish","Ro'yxatga olish dosyesini tayyorlash","Sinovlar va RU olish"],en:["Device and document review","Preparing the registration dossier","Testing and obtaining the certificate"]}},{nav:"tenders",t:{ru:"Тендеры и государственные закупки",uz:"Tenderlar va davlat xaridlari",en:"Tenders and public procurement"},d:{ru:"Готовим документацию и сопровождаем закупку на всех этапах — от лота до поставки.",uz:"Hujjatlarni tayyorlaymiz va xaridni barcha bosqichlarda kuzatib boramiz — lotdan yetkazib berishgacha.",en:"We prepare documentation and support the procurement at every stage — from lot to delivery."},proof:{ru:"От технического задания до договора",uz:"Texnik topshiriqdan shartnomagacha",en:"From technical brief to signed contract"},list:{ru:["Проверка требований закупки","Подготовка технической части","Сопровождение подачи заявки"],uz:["Xarid talablarini tekshirish","Texnik qismni tayyorlash","Ariza topshirishga hamrohlik"],en:["Reviewing procurement requirements","Preparing the technical section","Supporting the bid submission"]}},{nav:"staffTraining",t:{ru:"Обучение персонала",uz:"Xodimlarni o'qitish",en:"Staff training"},d:{ru:"Обучаем персонал работе с оборудованием — очно, на вашей площадке или онлайн.",uz:"Xodimlarni uskunalar bilan ishlashga o'qitamiz — joyingizda yoki onlayn.",en:"We train your staff to operate the equipment — on-site at your facility or online."},proof:{ru:"Индивидуальная программа под ваше оборудование",uz:"Sizning uskunangizga moslashtirilgan dastur",en:"A program tailored to your equipment"},list:{ru:["Разработка программы обучения","Практические занятия на оборудовании","Аттестация персонала"],uz:["O'quv dasturini ishlab chiqish","Uskunada amaliy mashg'ulotlar","Xodimlarni attestatsiyadan o'tkazish"],en:["Designing the training program","Hands-on sessions on the equipment","Staff certification"]}},{nav:"serviceSupport",t:{ru:"Сервисное обслуживание",uz:"Servis xizmati",en:"Maintenance service"},d:{ru:"Пусконаладка, гарантийный и постгарантийный сервис с выездом в регионы.",uz:"Ishga tushirish, kafolatli va kafolatdan keyingi servis, viloyatlarga chiqish bilan.",en:"Commissioning, warranty and post-warranty service with visits across the regions."},proof:{ru:"Гарантийная и постгарантийная поддержка",uz:"Kafolatli va kafolatdan keyingi qo'llab-quvvatlash",en:"Warranty and post-warranty support"},list:{ru:["Пусконаладочные работы","Плановое сервисное обслуживание","Выезд инженера по заявке"],uz:["Ishga tushirish ishlari","Rejali servis xizmati","So'rov bo'yicha muhandis chiqishi"],en:["Commissioning works","Scheduled maintenance service","On-request engineer visits"]}}];function SoiExpertise({lang,go}){useEffect(()=>{var id="soi-expertise-css";if(document.getElementById(id))return;var s=document.createElement("style");s.id=id;s.textContent=`
/* Services used to be a dark-green slab with a lime glow — one of four dark
   panels the light page kept running into. It is now the same accordion of
   cards on the page's own canvas: white cards, hairline borders, and a single
   lime card carrying the featured service. */
.sxp { position:relative; overflow:hidden; background:var(--sx-bg); padding:clamp(64px,8vw,112px) 0; }
.sxp-glow { display:none; }
.sxp-inner { position:relative; max-width:var(--maxw); margin:0 auto; padding:0 32px; }

.sxp-head { display:grid; gap:32px; margin-bottom:clamp(40px,5vw,64px); }
@media(min-width:1024px){ .sxp-head { grid-template-columns:1.15fr .85fr; align-items:end; gap:64px; } }
.sxp-kicker { margin:0 0 16px; font-size:var(--fs-1); font-weight:700; text-transform:uppercase;
  letter-spacing:.16em; color:var(--sx-mute); }
.sxp-h2 { margin:0; font-size:clamp(34px,5vw,60px); font-weight:800; line-height:.95;
  letter-spacing:-.035em; color:var(--sx-ink); }
.sxp-sub { margin:0; max-width:28rem; font-size:var(--fs-4); line-height:1.65; color:var(--sx-mute); }

.sxp-grid { display:grid; gap:14px; }
@media(min-width:640px){ .sxp-grid { grid-template-columns:1fr 1fr; } }
@media(min-width:1024px){ .sxp-grid { display:flex; flex-wrap:nowrap; align-items:stretch; } }

.sxp-card { position:relative; display:flex; flex-direction:column; overflow:hidden; text-align:left;
  min-height:460px; padding:28px; border-radius:var(--sx-r); cursor:pointer; font-family:inherit;
  border:1px solid var(--sx-line); background:var(--sx-card); color:var(--sx-ink);
  transition:flex-grow .5s ease, background .35s, border-color .35s, transform .35s; }
@media(min-width:1024px){ .sxp-card { flex:1 1 0; } .sxp-card:hover { flex-grow:1.35; } }
.sxp-card:hover { border-color:var(--sx-ink-soft); background:var(--sx-card); }
.sxp-card.feat { background:var(--sx-lime); border-color:transparent; color:var(--sx-lime-ink); }
.sxp-card.feat:hover { background:color-mix(in srgb, var(--sx-lime) 88%, #fff); }
.sxp-card:focus-visible { outline:2px solid var(--sx-ink); outline-offset:3px; }

.sxp-bignum { position:absolute; right:12px; bottom:-48px; font-size:9rem; font-weight:800; line-height:1;
  user-select:none; pointer-events:none; color:rgba(16,21,18,.04); }
.sxp-card.feat .sxp-bignum { color:rgba(255,255,255,.14); }

.sxp-top { position:relative; z-index:1; display:flex; align-items:center; justify-content:space-between; gap:12px; }
.sxp-no { font-size:var(--fs-2); font-weight:700; color:var(--sx-mute); }
.sxp-card.feat .sxp-no { color:rgba(255,255,255,.72); }
.sxp-arrow { display:flex; align-items:center; justify-content:center; width:44px; height:44px; flex-shrink:0;
  border-radius:50%; border:1px solid var(--sx-line); font-size:var(--fs-6); color:var(--sx-ink);
  transition:transform .3s, background .3s, border-color .3s, color .3s; }
.sxp-card:hover .sxp-arrow { transform:rotate(45deg); background:var(--sx-lime); border-color:var(--sx-lime); color:var(--sx-lime-ink); }
.sxp-card.feat .sxp-arrow { border-color:rgba(255,255,255,.35); color:var(--sx-lime-ink); }
.sxp-card.feat:hover .sxp-arrow { background:transparent; }

.sxp-t { position:relative; z-index:1; margin:40px 0 0; max-width:16rem; font-size:var(--fs-7); font-weight:700;
  line-height:1.2; letter-spacing:-.02em; }
.sxp-d { position:relative; z-index:1; margin:12px 0 0; max-width:20rem; font-size:var(--fs-4); line-height:1.6;
  color:var(--sx-mute); }
.sxp-card.feat .sxp-d { color:rgba(255,255,255,.82); }

/* grid-rows 0fr→1fr: высота подстраивается ровно под контент */
.sxp-expand { position:relative; z-index:1; display:grid; grid-template-rows:0fr;
  transition:grid-template-rows .4s ease; }
.sxp-card:hover .sxp-expand, .sxp-card:focus-visible .sxp-expand { grid-template-rows:1fr; }
.sxp-expand-outer { overflow:hidden; }
.sxp-expand-in { padding-top:16px; opacity:0; transition:opacity .3s ease .1s; }
.sxp-card:hover .sxp-expand-in, .sxp-card:focus-visible .sxp-expand-in { opacity:1; }
.sxp-comp { margin:0; font-size:var(--fs-1); font-weight:700; text-transform:uppercase; letter-spacing:.08em;
  color:var(--sx-mute); }
.sxp-card.feat .sxp-comp { color:rgba(255,255,255,.68); }
.sxp-proof { margin:4px 0 0; font-size:var(--fs-3); font-weight:500; color:var(--sx-ink); }
.sxp-card.feat .sxp-proof { color:var(--sx-lime-ink); }
.sxp-list { list-style:none; margin:12px 0 0; padding:0; display:flex; flex-direction:column; gap:6px; }
.sxp-list li { display:flex; align-items:flex-start; gap:8px; font-size:var(--fs-2); line-height:1.4;
  color:var(--sx-mute); }
.sxp-card.feat .sxp-list li { color:rgba(255,255,255,.82); }
.sxp-dot { flex-shrink:0; width:6px; height:6px; margin-top:5px; border-radius:50%; background:var(--sx-accent); }
.sxp-card.feat .sxp-dot { background:var(--sx-lime-ink); }

.sxp-more {position:relative; z-index:1; display:flex; align-items:center; justify-content:space-between;
  gap:8px; margin-top:auto; padding-top:16px;
  font-size:var(--fs-1); font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--sx-ink)}
.sxp-card.feat .sxp-more {border-top-color:rgba(255,255,255,.24); color:var(--sx-lime-ink)}
.sxp-more-arr { font-size:var(--fs-5); transition:transform .3s; }
.sxp-card:hover .sxp-more-arr { transform:translateX(4px); }

@media (prefers-reduced-motion: reduce){
  .sxp-card, .sxp-arrow, .sxp-expand, .sxp-expand-in, .sxp-more-arr { transition:none; }
}
    `;document.head.appendChild(s)},[]);var L=o=>o&&(o[lang]||o.ru)||"";return React.createElement("section",{className:"sxp"},React.createElement("div",{className:"sxp-glow"}),React.createElement("div",{className:"sxp-inner"},React.createElement("div",{className:"sxp-head sx-rv"},React.createElement("div",null,React.createElement("p",{className:"sxp-kicker"},_lv(lang,"Экспертиза","Ekspertiza","Expertise")),React.createElement("h2",{className:"sxp-h2"},_lv(lang,"Компетенции полного цикла работы","Toʻliq siklli kompetensiyalar","Full-lifecycle capabilities"))),React.createElement("p",{className:"sxp-sub"},_lv(lang,"Закрываем регуляторные, закупочные, технические и сервисные задачи в едином контуре ответственности.","Tartibga solish, xarid, texnik va servis vazifalarini yagona javobgarlik konturi doirasida hal qilamiz.","We cover regulatory, procurement, technical and service tasks within a single line of accountability."))),React.createElement("div",{className:"sxp-grid"},EXPERTISE_ITEMS.map((it,i)=>{var no=String(i+1).padStart(2,"0");return(React.createElement("a",{key:i,className:"sxp-card sx-rv"+(i===0?" feat":""),style:{"--i":i},href:window.corpViewToPath&&window.corpViewToPath(it.nav)||"/"+it.nav,onClick:e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button!==0)return;e.preventDefault();go(it.nav)}},React.createElement("span",{className:"sxp-bignum","aria-hidden":true},no),React.createElement("div",{className:"sxp-top"},React.createElement("span",{className:"sxp-no"},no),React.createElement("span",{className:"sxp-arrow","aria-hidden":true},"↗")),React.createElement("h3",{className:"sxp-t"},L(it.t)),React.createElement("p",{className:"sxp-d"},L(it.d)),React.createElement("div",{className:"sxp-expand"},React.createElement("div",{className:"sxp-expand-outer"},React.createElement("div",{className:"sxp-expand-in"},React.createElement("p",{className:"sxp-comp"},_lv(lang,"Компетенция","Kompetensiya","Competence")),React.createElement("p",{className:"sxp-proof"},L(it.proof)),React.createElement("ul",{className:"sxp-list"},L(it.list).map((d,di)=>React.createElement("li",{key:di},React.createElement("span",{className:"sxp-dot","aria-hidden":true}),d)))))),React.createElement("div",{className:"sxp-more"},_lv(lang,"Подробнее","Batafsil","Read more"),React.createElement("span",{className:"sxp-more-arr","aria-hidden":true},"→"))))}))))}var CATALOG_CARDS=[{slug:"equipment",catKey:"equipment",t:{ru:"Медицинское оборудование",uz:"Tibbiy uskunalar",en:"Medical equipment"}},{slug:"furniture",catKey:"furniture",t:{ru:"Медицинская мебель",uz:"Tibbiy mebel",en:"Medical furniture"}},{slug:"instruments",catKey:"instruments",t:{ru:"Медицинские инструменты",uz:"Tibbiy asboblar",en:"Medical instruments"}},{slug:"consumables",catKey:"consumables",t:{ru:"Расходные материалы",uz:"Sarflanadigan materiallar",en:"Consumables"}}];function SoiCatalogCards({lang,go}){var cats=window.DATA&&window.DATA.CATEGORIES||[];useEffect(()=>{var id="soi-catcards-css";if(document.getElementById(id))return;var s=document.createElement("style");s.id=id;s.textContent=`
.sxc { background:var(--sx-bg); padding:clamp(64px,8vw,112px) 0; }
[data-theme="dark"] .sxc { background:var(--sx-bg-soft); }
.sxc-inner { max-width:var(--maxw); margin:0 auto; padding:0 32px; }

.sxc-head { display:grid; gap:32px; margin-bottom:clamp(40px,5vw,64px); }
/* Колонки шапки выровнены по верху, а правая опущена на высоту надзаголовка —
   так описание встаёт вровень с первой строкой заголовка, а не с надзаголовком
   и не с нижним краем блока. */
@media(min-width:1024px){
  .sxc-head { grid-template-columns:1.3fr .7fr; align-items:start; gap:64px; }
  .sxc-head > *:last-child { padding-top:calc(var(--fs-2) * 1.5 + 16px); }
}
.sxc-kicker { margin:0 0 16px; font-size:var(--fs-2); font-weight:700; text-transform:uppercase;
  letter-spacing:.16em; color:var(--sx-mute); }
.sxc-h2 { margin:0; font-size:clamp(30px,4.2vw,48px); font-weight:800; line-height:1.02;
  letter-spacing:-.035em; color:var(--sx-ink); }
[data-theme="dark"] .sxc-h2 { color:var(--sx-ink); }
/* Заголовки секций, ведущие на свою страницу. Подсветка по наведению без
   подчёркивания — на крупном кегле оно смотрелось грубо. */
.sx-h2-link { cursor:pointer; transition:color .15s ease; }
.sx-h2-link:hover { color:var(--blue-600); }
.sxc-sub { margin:0 0 24px; font-size:var(--fs-4); line-height:1.65; color:var(--sx-mute); }
[data-theme="dark"] .sxc-sub { color:var(--sx-mute); }

.sxc-grid { display:grid; gap:20px; grid-template-columns:1fr; }
@media(min-width:640px){ .sxc-grid { grid-template-columns:1fr 1fr; } }
@media(min-width:1024px){ .sxc-grid { grid-template-columns:repeat(4,1fr); } }

/* ── сетки на три колонки: проекты и новости ──────────────────────────────
   Каталог идёт по четыре в ряд, проекты и новости — по три (как в readdy.cc).
   Селекторы двухклассовые и стоят сразу после брейкпоинтов .sxc-grid: только
   так они перебивают его четыре колонки — при равной специфичности решает
   порядок, а одноклассовый .sx-cases/.sx-news из прежней версии проигрывал
   вовсе. Порядок mobile-first: одна колонка, с 640 — две, с 1024 — три. */
.sxc-grid.sx-cases, .sxc-grid.sx-news { grid-template-columns:1fr; }
@media(min-width:640px){ .sxc-grid.sx-cases, .sxc-grid.sx-news { grid-template-columns:1fr 1fr; } }
@media(min-width:1024px){ .sxc-grid.sx-cases, .sxc-grid.sx-news { grid-template-columns:repeat(3,1fr); } }

/* Карточка — <a>, поэтому гасим наследие ссылки: подчёркивание и синий цвет
   текста. Цвет заголовка задаёт .sxc-t, но color:inherit нужен, чтобы номер
   и стрелка не позеленели от пользовательских стилей ссылок. */
.sxc-card { overflow:hidden; border-radius:var(--sx-r); border:1px solid var(--sx-line); background:var(--sx-card);
  cursor:pointer; text-align:left; padding:0; font-family:inherit; display:flex; flex-direction:column;
  text-decoration:none; color:inherit;
  transition:box-shadow .3s, border-color .3s; }
.sxc-card:hover { text-decoration:none; }
[data-theme="dark"] .sxc-card { background:var(--sx-card); border-color:var(--sx-line); }
.sxc-card:hover { border-color:var(--sx-ink-soft); }
.sxc-card:focus-visible { outline:2px solid var(--sx-ink); outline-offset:3px; }
.sxc-media { aspect-ratio:3/4; overflow:hidden; }
.sxc-media img { display:block; width:100%; height:100%; object-fit:cover;
  transition:transform .5s cubic-bezier(.16,1,.3,1); }
.sxc-card:hover .sxc-media img { transform:scale(1.06); }

.sxc-foot { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:20px; }
.sxc-no { font-size:var(--fs-2); font-weight:700; color:var(--sx-mute); }
.sxc-t { margin:4px 0 0; font-size:var(--fs-6); font-weight:700; line-height:1.3; color:var(--sx-ink); }
[data-theme="dark"] .sxc-t { color:var(--sx-ink); }
.sxc-arr { display:flex; align-items:center; justify-content:center; flex-shrink:0; width:44px; height:44px;
  border-radius:50%; border:1px solid var(--sx-line); color:var(--sx-ink);
  transition:transform .3s, background .3s, border-color .3s, color .3s; }
/* Наведение на карточку: круг заливается фирменным синим, стрелка белеет.
   Поворот на 45° убран — стрелка ведёт в раздел, то есть вправо, а повёрнутая
   указывала по диагонали «наружу», как ссылка на другой сайт. */
.sxc-card:hover .sxc-arr,
.sxc-card:focus-visible .sxc-arr { background:var(--sx-accent); border-color:var(--sx-accent); color:#fff; }

/* ── Каталог: подпись на фото (модификатор .ov) ─────────────────────────
   Решение 09.08.2026, по образцу readdy.cc: номер, заголовок и стрелка легли
   прямо на снимок поверх тёмного градиента, вместо белой плашки под ним.

   Всё через модификатор, а НЕ правкой базовых .sxc-card/.sxc-media: те же
   два класса носят карточки «Реализованных проектов» (.sx-case) и «Новостей»
   (.sx-ncard) — там подпись остаётся под фотографией, и правка базы сломала
   бы обе секции разом. */
.sxc-card.ov { position:relative; display:block; aspect-ratio:3/4; }
.sxc-card.ov .sxc-media { position:absolute; inset:0; aspect-ratio:auto; }
/* Градиент — псевдоэлемент подложки, а не слой в разметке: подпись должна
   читаться на любом снимке, что бы на нём ни было. */
.sxc-card.ov .sxc-media::after { content:""; position:absolute; inset:0;
  background:linear-gradient(180deg, transparent 42%, rgba(4,10,20,.74) 100%); pointer-events:none; }
.sxc-card.ov .sxc-no { position:absolute; z-index:1; top:16px; left:20px; color:rgba(255,255,255,.82); }
.sxc-card.ov .sxc-foot { position:absolute; z-index:1; inset:auto 16px 18px 20px; padding:0;
  align-items:flex-end; }
.sxc-card.ov .sxc-t { margin:0; color:#fff; }
.sxc-card.ov .sxc-arr { border:none; background:rgba(255,255,255,.96); color:var(--sx-ink); }
.sxc-card.ov:hover .sxc-arr,
.sxc-card.ov:focus-visible .sxc-arr { background:var(--sx-accent); color:#fff; }

@media (prefers-reduced-motion: reduce){
  .sxc-card, .sxc-media img, .sxc-arr,   .sxc-card:hover .sxc-media img { transform:none; }
}
    `;document.head.appendChild(s)},[]);var goCard=card=>{var found=cats.find(c=>c.slug===card.catKey||c.id===card.catKey);go("catalog",found?{cat:found.id}:{})};return React.createElement("section",{className:"sxc"},React.createElement("div",{className:"sxc-inner"},React.createElement("div",{className:"sxc-head sx-rv"},React.createElement("div",null,React.createElement("p",{className:"sxc-kicker"},_lv(lang,"Электронный каталог","Elektron katalog","Digital catalog")),React.createElement("h2",{className:"sxc-h2 sx-h2-link",onClick:()=>go("catalog")},_lv(lang,"Оборудование для современной медицины","Zamonaviy tibbiyot uchun uskunalar","Equipment for modern medicine"))),React.createElement("div",null,React.createElement("p",{className:"sxc-sub"},_lv(lang,"Структурированный каталог решений для диагностики, лечения, реанимации и ежедневной работы медицинских учреждений.","Tibbiyot muassasalarining diagnostika, davolash, reanimatsiya va kundalik ish uchun yechimlar katalogi.","A structured catalog of solutions for diagnostics, treatment, intensive care and the daily work of medical institutions.")))),React.createElement("div",{className:"sxc-grid"},CATALOG_CARDS.map((card,i)=>React.createElement("a",{key:card.slug,className:"sxc-card ov sx-rv",style:{"--i":i},href:"/catalog/"+card.slug,onClick:e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button!==0)return;e.preventDefault();goCard(card)}},React.createElement("div",{className:"sxc-media"},React.createElement("img",{src:window.__asset("assets/catalog/"+card.slug+".jpg"),alt:"",loading:"lazy"})),React.createElement("span",{className:"sxc-no"},String(i+1).padStart(2,"0")),React.createElement("div",{className:"sxc-foot"},React.createElement("h3",{className:"sxc-t"},_lv(lang,card.t.ru,card.t.uz,card.t.en)),React.createElement("span",{className:"sxc-arr","aria-hidden":true},React.createElement(Icon,{name:"arrowRight",size:18}))))))))}function SoiDirections({lang,go}){var DD=window.DIRECTIONS_DATA;if(!DD)return null;var{DIRECTION_GROUPS,getDirsForGroup}=DD;return React.createElement("section",{className:"sxc"},React.createElement("div",{className:"sxc-inner"},React.createElement("div",{className:"sxc-head sx-rv"},React.createElement("div",null,React.createElement("p",{className:"sxc-kicker"},_lv(lang,"Навигация по направлениям","Yo'nalishlar bo'yicha","By specialty")),React.createElement("h2",{className:"sxc-h2"},_lv(lang,"Подбор по направлению медицины","Tibbiyot yo'nalishi bo'yicha tanlov","Find by medical specialty"))),React.createElement("div",null,React.createElement("p",{className:"sxc-sub"},_lv(lang,"Откройте каталог по профилю учреждения, отделению или клинической задаче.","Muassasa profili yoki klinik vazifa bo'yicha katalogni oching.","Open the catalog by institution profile, department or clinical task.")))),React.createElement("div",{className:"sx-dir-grid"},DIRECTION_GROUPS.map((g,i)=>{var dirs=getDirsForGroup(g.id).slice(0,4);return(React.createElement("div",{className:"sx-dir sx-rv",key:g.id,style:{"--i":i}},React.createElement("div",{className:"sx-dir-ic"},React.createElement(Icon,{name:g.icon,size:39})),React.createElement("h3",null,React.createElement("a",{className:"sx-dir-t",href:"/catalog",onClick:e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button!==0)return;e.preventDefault();go("catalog",{dir:dirs[0]&&dirs[0].id})}},_lv(lang,g.ru,g.uz,g.en))),React.createElement("div",{className:"sx-dir-links"},dirs.map(d=>React.createElement("a",{key:d.id,href:"/catalog",onClick:e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button!==0)return;e.preventDefault();go("catalog",{dir:d.id})}},_lv(lang,d.ru,d.uz,d.en))))))}))))}function SoiCountUp({value}){var ref=useRef(null);var[disp,setDisp]=useState("0");useEffect(()=>{var target=parseInt(String(value).replace(/\s/g,""),10);if(isNaN(target)){setDisp(value);return}var fmt=n=>n.toLocaleString("ru-RU").replace(/,/g," ");var done=false;var run=()=>{var start=performance.now(),DUR=1500;var step=now=>{var p=Math.min((now-start)/DUR,1);var e=1-Math.pow(1-p,3);setDisp(fmt(Math.round(e*target)));if(p<1)requestAnimationFrame(step)};requestAnimationFrame(step)};var io=new IntersectionObserver(([en])=>{if(en.isIntersecting&&!done){done=true;run()}},{threshold:0.4});if(ref.current)io.observe(ref.current);return()=>io.disconnect()},[value]);return React.createElement("span",{ref:ref},disp)}var PARTNERS_MIN=4;var PARTNERS_FALLBACK=[{id:"ph",name:"Philips"},{id:"am",name:"Армед"},{id:"kpz",name:"Касимовский ПЗ"},{id:"md",name:"Midmark"},{id:"ns",name:"Нейрософт"},{id:"dr",name:"Dräger"},{id:"mn",name:"Mindray"},{id:"el",name:"Елатомский ПЗ"}];function SoiBrands({lang,go}){var brands=(window.DATA&&window.DATA.BRANDS||[]).filter(b=>b&&b.name);var items=brands.length>=PARTNERS_MIN?brands:PARTNERS_FALLBACK;var half=Math.ceil(items.length/2);var rows=items.length>1?[items.slice(0,half),items.slice(half)]:[items,items];var item=(b,row,dup)=>React.createElement("button",{className:"sx-mq-item",key:row+(dup?"b-":"a-")+b.id,onClick:()=>go("partners"),tabIndex:dup?-1:0,title:_lv(lang,"Все партнёры","Barcha hamkorlar","All partners")},b.logo?React.createElement("img",{src:b.logo,alt:b.name,loading:"lazy",onError:e=>{e.currentTarget.replaceWith(document.createTextNode(b.name))}}):b.name,b.flag?React.createElement("span",{className:"sx-mq-flag"},b.flag):null);var belt=(list,row)=>React.createElement("div",{className:"sx-mq-row",key:row},React.createElement("div",{className:"sx-mq-track"+(row?" rev":""),style:{"--mq-dur":Math.max(22,list.length*5.5)+"s"}},React.createElement("div",{className:"sx-mq-pass"},list.map(b=>item(b,row,false))),React.createElement("div",{className:"sx-mq-pass","aria-hidden":"true"},list.map(b=>item(b,row,true)))));return React.createElement("section",{className:"sx-mq-sec"},React.createElement("div",{className:"sx-mq-head"},React.createElement("h2",{className:"sx-h2 sx-brands-title sx-rv sx-h2-link",onClick:()=>go("partners"),style:{margin:0}},_lv(lang,"Партнёры","Hamkorlar","Partners"))),React.createElement("div",{className:"sx-mq-vp"},React.createElement("div",{className:"sx-mq-fade"}),rows.map((list,i)=>belt(list,i))))}function ensureCaseModalCss(){if(document.getElementById("sx-cmod-css"))return;var s=document.createElement("style");s.id="sx-cmod-css";s.textContent=`
.sx-cmod-ov { position:fixed; inset:0; background:rgba(8,14,24,.8); z-index:9100; display:flex; align-items:center; justify-content:center; padding:24px; animation:sxCmodFade .18s ease; }
@keyframes sxCmodFade { from{opacity:0} to{opacity:1} }
.sx-cmod { background:#fff; border-radius:var(--r-lg); width:min(680px,94vw); max-height:90vh; overflow:auto; box-shadow:var(--sh-xl); animation:sxCmodUp .22s cubic-bezier(.16,1,.3,1); }
@keyframes sxCmodUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
.sx-cmod-cover { aspect-ratio:16/9; background:var(--sx-bg-soft); display:flex; align-items:center; justify-content:center; color:var(--slate-300); overflow:hidden; }
.sx-cmod-cover img { width:100%; height:100%; object-fit:cover; display:block; }
.sx-cmod-body { padding:26px 30px 30px; }
.sx-cmod-tag { display:inline-flex; font-size:var(--fs-1); font-weight:700; letter-spacing:.04em; text-transform:uppercase; color:var(--sx-accent); background:var(--sx-bg-soft); border:1px solid var(--sx-line); padding:5px 12px; border-radius:var(--r-sm); margin-bottom:14px; }
.sx-cmod-body h2 { font-size:var(--fs-7); font-weight:800; color:var(--sx-ink); line-height:1.25; letter-spacing:-.015em; margin:0 0 14px; }
.sx-cmod-body p { font-size:var(--fs-4); line-height:1.7; color:var(--sx-ink-soft); margin:0; white-space:pre-line; }
/* Размеченное тело публикации в модалке. Отдельный блок, а не .sx-cmod-body p:
   у того white-space:pre-line, и в размеченном тексте переносы из исходника
   превращались бы в лишние пустые строки между абзацами. */
.sx-cmod-html { font-size:var(--fs-4); line-height:1.7; color:var(--sx-ink-soft); }
.sx-cmod-html p { font-size:inherit; line-height:inherit; color:inherit; margin:0 0 14px; white-space:normal; }
.sx-cmod-html p:last-child { margin-bottom:0; }
.sx-cmod-html h3 { font-size:var(--fs-5); font-weight:700; color:var(--sx-ink); line-height:1.35; margin:22px 0 10px; }
.sx-cmod-html ul, .sx-cmod-html ol { margin:0 0 14px; padding-left:20px; }
.sx-cmod-html li { margin-bottom:6px; }
.sx-cmod-html a { color:var(--blue-600); text-decoration:underline; }
[data-theme="dark"] .sx-cmod-html { color:#a9b8cc; }
[data-theme="dark"] .sx-cmod-html h3 { color:#eaf1fb; }
.sx-cmod-meta {display:flex; flex-wrap:wrap; gap:22px; margin-top:22px; padding-top:18px; font-size:var(--fs-3); color:var(--sx-mute)}
.sx-cmod-meta b { color:var(--navy-900); }
.sx-cmod-x { position:fixed; top:22px; right:26px; width:42px; height:42px; border-radius:50%; border:none; background:rgba(255,255,255,.14); color:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .18s; z-index:9110; }
.sx-cmod-x:hover { background:rgba(255,255,255,.28); }
.sx-cmod-x:focus-visible { outline:2px solid #fff; outline-offset:2px; }
[data-theme="dark"] .sx-cmod { background:#0c1726; }
[data-theme="dark"] .sx-cmod-body h2 { color:#eaf1fb; }
[data-theme="dark"] .sx-cmod-body p { color:#a9b8cc; }
[data-theme="dark"] .sx-cmod-meta { border-color:#22344e; color:#94a7bf; }
[data-theme="dark"] .sx-cmod-meta b { color:#eaf1fb; }
@media(max-width:500px){ .sx-cmod-body { padding:20px; } .sx-cmod-body h2 { font-size:var(--fs-6); } }
@media(prefers-reduced-motion:reduce){ .sx-cmod-ov,.sx-cmod { animation:none; } }
  `;document.head.appendChild(s)}function CaseModal({c,lang,tx,img,onClose}){ensureCaseModalCss();useEffect(()=>{var onKey=e=>{if(e.key==="Escape")onClose()};document.addEventListener("keydown",onKey);var prev=document.body.style.overflow;document.body.style.overflow="hidden";return()=>{document.removeEventListener("keydown",onKey);document.body.style.overflow=prev}},[]);var cover=img(c.image);return React.createElement("div",{className:"sx-cmod-ov",onClick:onClose,role:"dialog","aria-modal":"true","aria-label":tx(c.title)},React.createElement("button",{className:"sx-cmod-x",onClick:onClose,"aria-label":_lv(lang,"Закрыть","Yopish","Close")},React.createElement("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round"},React.createElement("path",{d:"M18 6L6 18M6 6l12 12"}))),React.createElement("div",{className:"sx-cmod",onClick:e=>e.stopPropagation()},React.createElement("div",{className:"sx-cmod-cover"},cover?React.createElement("img",{src:cover,alt:tx(c.title)}):React.createElement(Icon,{name:"pin",size:40})),React.createElement("div",{className:"sx-cmod-body"},c.tag&&React.createElement("span",{className:"sx-cmod-tag"},tx(c.tag)),React.createElement("h2",null,tx(c.title)),tx(c.desc)&&React.createElement("p",null,tx(c.desc)),(c.year||c.region)&&React.createElement("div",{className:"sx-cmod-meta"},c.year&&React.createElement("span",null,_lv(lang,"Год","Yil","Year"),": ",React.createElement("b",null,c.year)),c.region&&React.createElement("span",null,_lv(lang,"Регион","Hudud","Region"),": ",React.createElement("b",null,tx(c.region)))))))}function SoiCases({lang,go}){var tx=o=>o&&(typeof o==="string"?o:o[lang]||o.ru)||"";var img=im=>!im?"":typeof im==="string"?im:im.data||im.url||im.src||"";var[viewer,setViewer]=React.useState(null);var[cmsCases,setCmsCases]=React.useState(()=>window.CMS?window.CMS.list("cases"):[]);React.useEffect(()=>{if(!window.CMS)return;setCmsCases(window.CMS.list("cases"));return window.CMS.on("cases",()=>setCmsCases(window.CMS.list("cases")))},[]);var cases=cmsCases.filter(c=>(c.status||"published")==="published");if(!cases.length&&window.SOI_CORE&&window.SOI_CORE.CASES_DEFAULT)cases=window.SOI_CORE.CASES_DEFAULT;cases=cases.slice(0,3);if(!cases.length)return null;return(React.createElement("section",{className:"sxc"},React.createElement("div",{className:"sxc-inner"},React.createElement("div",{className:"sxc-head sx-rv"},React.createElement("div",null,React.createElement("p",{className:"sxc-kicker"},_lv(lang,"Реализованные проекты","Amalga oshirilgan loyihalar","Delivered projects")),React.createElement("h2",{className:"sxc-h2 sx-h2-link",onClick:()=>go("projects")},_lv(lang,"Как мы оснащаем медицину Узбекистана","O'zbekiston tibbiyotini qanday jihozlaymiz","How we equip Uzbekistan's healthcare"))),React.createElement("div",null,React.createElement("p",{className:"sxc-sub"},_lv(lang,"Оснащение больниц, диагностических центров и частных клиник — от поставки до пусконаладки и обучения персонала.","Kasalxonalar, diagnostika markazlari va xususiy klinikalarni jihozlash — yetkazib berishdan ishga tushirish va o'qitishgacha.","Equipping hospitals, diagnostic centres and private clinics — from delivery to commissioning and staff training.")))),React.createElement("div",{className:"sxc-grid sx-cases"},cases.map((c,i)=>React.createElement("div",{className:"sxc-card sx-case sx-rv",key:c.id||i,style:{"--i":i},role:"button",tabIndex:0,onClick:()=>setViewer(c),onKeyDown:e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();setViewer(c)}},"aria-label":_lv(lang,"Открыть кейс","Keysni ochish","Open case")+": "+tx(c.title)},React.createElement("div",{className:"sxc-media sx-case-cover"},img(c.image)?React.createElement("img",{src:img(c.image),alt:tx(c.title),loading:"lazy"}):React.createElement(Icon,{name:"pin",size:34})),React.createElement("div",{className:"sx-case-body"},c.tag&&React.createElement("span",{className:"sx-case-tag"},tx(c.tag)),React.createElement("h3",null,tx(c.title)),React.createElement("p",null,tx(c.desc)),React.createElement("div",{className:"sx-case-meta"},c.region&&React.createElement("span",null,React.createElement(Icon,{name:"pin",size:15}),tx(c.region)),c.year&&React.createElement("span",null,React.createElement(Icon,{name:"calendar",size:15}),c.year))))))),viewer&&React.createElement(CaseModal,{c:viewer,lang:lang,tx:tx,img:img,onClose:()=>setViewer(null)})))}function RevPdfThumb({url,alt,fallback}){var[src,setSrc]=React.useState(null);var[err,setErr]=React.useState(false);React.useEffect(()=>{var on=true;setSrc(null);setErr(false);if(!url||!window.rvpRenderPdfPage){setErr(true);return}window.rvpRenderPdfPage(url,260).then(d=>on&&setSrc(d.src)).catch(()=>on&&setErr(true));return()=>{on=false}},[url]);if(src&&!err)return React.createElement("img",{src:src,alt:alt,loading:"lazy"});return fallback}function SoiReviews({lang,go}){var lv=(ru,uz,en)=>lang==="uz"?uz:lang==="en"?en:ru;var[tab,setTab]=React.useState("buyers");var[idx,setIdx]=React.useState(0);var[viewer,setViewer]=React.useState(null);var ovRef=React.useRef(null);var GAP=20;var COLORS=["var(--accent)","var(--blue-500)","var(--blue-400)","var(--accent-2)","var(--blue-700)","var(--blue-600)"];var tx=o=>!o?"":typeof o==="string"?o:o[lang]||o.ru||"";var rtype=r=>{var v=r.type||r.group||"";if(v==="suppliers")return"supplier";if(v==="buyers")return"buyer";return v||"buyer"};var[cmsAll,setCmsAll]=React.useState(()=>window.CMS?window.CMS.list("reviews"):[]);React.useEffect(()=>{if(!window.CMS)return;setCmsAll(window.CMS.list("reviews"));return window.CMS.on("reviews",()=>setCmsAll(window.CMS.list("reviews")))},[]);var published=cmsAll.filter(r=>!r.status||r.status==="published");var cmsBuyers=published.filter(r=>rtype(r)==="buyer");var cmsSuppliers=published.filter(r=>rtype(r)==="supplier");var items=tab==="buyers"?cmsBuyers:cmsSuppliers;if(!published.length)return null;var perView=2;var maxIdx=Math.max(0,items.length-perView);React.useEffect(()=>{setIdx(0);if(ovRef.current){ovRef.current.style.transform="translateX(0)"}},[tab]);var shift=dir=>{if(!ovRef.current)return;var next=Math.max(0,Math.min(maxIdx,idx+dir));setIdx(next);var cardW=(ovRef.current.parentElement.offsetWidth-GAP)/perView;ovRef.current.style.transform=`translateX(calc(-${next} * (${cardW}px + ${GAP}px)))`};var DocThumb=({color})=>React.createElement("svg",{viewBox:"0 0 160 212",fill:"none",preserveAspectRatio:"xMidYMid slice",xmlns:"http://www.w3.org/2000/svg",style:{display:"block"}},React.createElement("rect",{width:"160",height:"212",rx:"6",fill:"white"}),React.createElement("rect",{width:"160",height:"38",rx:"6",fill:color}),React.createElement("rect",{y:"26",width:"160",height:"12",fill:color}),React.createElement("rect",{x:"14",y:"52",width:"68",height:"7",rx:"3.5",fill:"var(--line-soft)"}),React.createElement("rect",{x:"14",y:"65",width:"132",height:"5",rx:"2.5",fill:"var(--bg-2)"}),React.createElement("rect",{x:"14",y:"75",width:"126",height:"5",rx:"2.5",fill:"var(--bg-2)"}),React.createElement("rect",{x:"14",y:"85",width:"116",height:"5",rx:"2.5",fill:"var(--bg-2)"}),React.createElement("rect",{x:"14",y:"100",width:"132",height:"5",rx:"2.5",fill:"var(--bg-2)"}),React.createElement("rect",{x:"14",y:"110",width:"120",height:"5",rx:"2.5",fill:"var(--bg-2)"}),React.createElement("rect",{x:"14",y:"120",width:"128",height:"5",rx:"2.5",fill:"var(--bg-2)"}),React.createElement("rect",{x:"14",y:"130",width:"100",height:"5",rx:"2.5",fill:"var(--bg-2)"}),React.createElement("rect",{x:"14",y:"148",width:"60",height:"5",rx:"2.5",fill:"var(--bg-2)"}),React.createElement("rect",{x:"14",y:"158",width:"72",height:"5",rx:"2.5",fill:"var(--bg-2)"}),React.createElement("circle",{cx:"36",cy:"188",r:"17",stroke:color,strokeWidth:"1.5",opacity:".75"}),React.createElement("circle",{cx:"36",cy:"188",r:"10",fill:color,opacity:".15"}),React.createElement("rect",{x:"64",y:"181",width:"54",height:"5",rx:"2.5",fill:"var(--line-soft)"}),React.createElement("rect",{x:"64",y:"191",width:"42",height:"5",rx:"2.5",fill:"var(--line-soft)"}));return(React.createElement("section",{className:"sxc"},React.createElement("div",{className:"sxc-inner"},React.createElement("div",{className:"sxc-head sx-rev-head sx-rv"},React.createElement("div",{className:"sx-rev-head-left"},React.createElement("p",{className:"sxc-kicker"},lv("Отзывы","Sharhlar","Reviews")),React.createElement("h2",{className:"sxc-h2 sx-h2-link",onClick:()=>go("reviews")},lv("Благодарственные письма клиник и партнёров","Klinikalar va hamkorlarning minnatdorchilik xatlari","Letters of appreciation from clinics and partners"))),React.createElement("div",null,React.createElement("p",{className:"sxc-sub"},lv("Письма от медицинских учреждений Узбекистана и производителей оборудования, с которыми мы работаем.","O'zbekiston tibbiyot muassasalari va biz ishlaydigan uskuna ishlab chiqaruvchilarining xatlari.","Letters from medical institutions in Uzbekistan and the equipment manufacturers we work with.")),React.createElement("div",{className:"sx-rev-tabs"},React.createElement("button",{className:"sx-rev-tab"+(tab==="buyers"?" on":""),onClick:()=>setTab("buyers")},lv("Покупатели","Xaridorlar","Buyers")),React.createElement("button",{className:"sx-rev-tab"+(tab==="suppliers"?" on":""),onClick:()=>setTab("suppliers")},lv("Поставщики","Ta'minotchilar","Suppliers"))))),React.createElement("div",{className:"sx-rev-outer sx-rv"},React.createElement("button",{className:"sx-rev-arr",disabled:idx===0,onClick:()=>shift(-1),"aria-label":lv("Назад","Orqaga","Previous")},React.createElement(Icon,{name:"arrowLeft",size:18})),React.createElement("div",{className:"sx-rev-overflow"},React.createElement("div",{className:"sx-rev-track",ref:ovRef},items.map((r,i)=>{var isCms=!r.org;var org=isCms?tx(r.company):r.org;var region=isCms?tx(r.region):r.city?r.city+(r.type?" · "+r.type:""):"";var text=isCms?tx(r.desc):r.text;var color=r.color||COLORS[i%COLORS.length];var letterUrl=isCms?r.letter?.data||"":"";var isImg=isCms&&r.letter?.type?.startsWith("image/");var isPdf=!!letterUrl&&!isImg;var openable=!!letterUrl;var typeLabel=rtype(r)==="supplier"?lv("Поставщик","Ta'minotchi","Supplier"):lv("Покупатель","Xaridor","Buyer");var open=()=>openable?setViewer(r):go("reviews");return React.createElement("div",{className:"sx-rev-card",key:r.id},React.createElement("div",{className:"sx-rev-doc",role:"button",tabIndex:0,onClick:open,onKeyDown:e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();open()}},"aria-label":lv("Открыть письмо","Xatni ochish","Open letter")+": "+org},isImg?React.createElement("img",{src:letterUrl,alt:org}):isPdf?React.createElement(RevPdfThumb,{url:letterUrl,alt:org,fallback:React.createElement(DocThumb,{color:color})}):React.createElement(DocThumb,{color:color})),React.createElement("div",{className:"sx-rev-body"},React.createElement("div",{className:"sx-rev-badges"},React.createElement("span",{className:"sx-rev-badge"},React.createElement(Icon,{name:"pin",size:12}),React.createElement("span",null,typeLabel,region?" · "+region:""))),React.createElement("h3",{className:"sx-rev-org"},org),text&&React.createElement("p",{className:"sx-rev-quote"},text),React.createElement("button",{className:"sx-rev-more",type:"button",onClick:open,"aria-label":lv("Открыть письмо","Xatni ochish","Open letter")+": "+org},React.createElement("span",{className:"sx-rev-more-t"},lv("Читать полностью","To'liq o'qish","Read in full")),React.createElement("span",{className:"sx-rev-more-arr","aria-hidden":true},React.createElement(Icon,{name:"arrowRight",size:16})))))}))),React.createElement("button",{className:"sx-rev-arr",disabled:idx>=maxIdx,onClick:()=>shift(1),"aria-label":lv("Вперёд","Oldinga","Next")},React.createElement(Icon,{name:"arrowRight",size:18})))),viewer&&(()=>{var Viewer=window.RvpSheetViewer;return Viewer?React.createElement(Viewer,{r:viewer,tx:tx,lv:lv,onClose:()=>setViewer(null)}):null})()))}function SoiNews({lang,go}){var tx=o=>o&&(o[lang]||o.ru)||"";var cov=c=>!c?null:typeof c==="string"?c:c.data||c.src||null;var[viewer,setViewer]=React.useState(null);var[cmsNews,setCmsNews]=React.useState(()=>window.CMS?window.CMS.list("news"):[]);React.useEffect(()=>{if(!window.CMS)return;setCmsNews(window.CMS.list("news"));return window.CMS.on("news",()=>setCmsNews(window.CMS.list("news")))},[]);var news=cmsNews.filter(n=>n.published!==false).sort((a,b)=>(b.date||"").localeCompare(a.date||"")).slice(0,3);if(!news.length)return null;var fmt=d=>{if(!d)return"";var x=new Date(d);return isNaN(x)?d:x.toLocaleDateString(lang==="ru"?"ru-RU":lang==="uz"?"uz-UZ":"en-US",{day:"2-digit",month:"long",year:"numeric"})};return(React.createElement("section",{className:"sxc"},React.createElement("div",{className:"sxc-inner"},React.createElement("div",{className:"sxc-head sx-rv"},React.createElement("div",null,React.createElement("p",{className:"sxc-kicker"},_lv(lang,"Новости","Yangiliklar","News")),React.createElement("h2",{className:"sxc-h2 sx-h2-link",onClick:()=>go("news")},_lv(lang,"Что нового в индустрии","Sohada nima yangilik","What's new in the industry"))),React.createElement("div",null,React.createElement("p",{className:"sxc-sub"},_lv(lang,"Поставки и проекты компании, изменения в регулировании медицинских изделий и новинки оборудования.","Kompaniyaning yetkazib berishlari va loyihalari, tibbiy buyumlarni tartibga solishdagi o'zgarishlar va yangi uskunalar.","Company deliveries and projects, changes in medical device regulation and new equipment.")))),React.createElement("div",{className:"sxc-grid sx-news"},news.map((n,i)=>React.createElement("button",{type:"button",key:n.id||i,className:"sxc-card sx-ncard sx-rv",style:{"--i":i},onClick:()=>setViewer(n),"aria-label":_lv(lang,"Открыть новость","Yangilikni ochish","Open news item")+": "+tx(n.title)},React.createElement("div",{className:"sxc-media sx-ncard-cover"},cov(n.cover)?React.createElement("img",{src:cov(n.cover),alt:tx(n.title),loading:"lazy"}):React.createElement(Icon,{name:"doc",size:28})),React.createElement("div",{className:"sx-ncard-body"},React.createElement("div",{className:"sx-ncard-date"},fmt(n.date)),React.createElement("h3",null,tx(n.title)),React.createElement("span",{className:"sx-ncard-more"},_lv(lang,"Читать статью","Maqolani o'qish","Read article"),React.createElement(Icon,{name:"arrowRight",size:14}))))))),viewer&&React.createElement(NewsModal,{n:viewer,lang:lang,tx:tx,cov:cov,fmt:fmt,onClose:()=>setViewer(null)})))}function NewsModal({n,lang,tx,cov,fmt,onClose}){ensureCaseModalCss();useEffect(()=>{var onKey=e=>{if(e.key==="Escape")onClose()};document.addEventListener("keydown",onKey);var prev=document.body.style.overflow;document.body.style.overflow="hidden";return()=>{document.removeEventListener("keydown",onKey);document.body.style.overflow=prev}},[]);var cover=cov(n.cover);var body=tx(n.body)||tx(n.text)||tx(n.desc)||tx(n.excerpt)||"";var bodyHtml=/<[a-z][\s\S]*>/i.test(body)?typeof cleanArticleHtml==="function"?cleanArticleHtml(body):body.replace(/<!--[\s\S]*?-->/g,"").replace(/\s(style|class|lang)="[^"]*"/gi,""):null;return React.createElement("div",{className:"sx-cmod-ov",onClick:onClose,role:"dialog","aria-modal":"true","aria-label":tx(n.title)},React.createElement("button",{className:"sx-cmod-x",onClick:onClose,"aria-label":_lv(lang,"Закрыть","Yopish","Close")},React.createElement("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round"},React.createElement("path",{d:"M18 6L6 18M6 6l12 12"}))),React.createElement("div",{className:"sx-cmod",onClick:e=>e.stopPropagation()},React.createElement("div",{className:"sx-cmod-cover"},cover?React.createElement("img",{src:cover,alt:tx(n.title)}):React.createElement(Icon,{name:"doc",size:40})),React.createElement("div",{className:"sx-cmod-body"},n.date&&React.createElement("span",{className:"sx-cmod-tag"},fmt(n.date)),React.createElement("h2",null,tx(n.title)),bodyHtml?React.createElement("div",{className:"sx-cmod-html",dangerouslySetInnerHTML:{__html:bodyHtml}}):body&&React.createElement("p",{style:{whiteSpace:"pre-line"}},body))))}function SoiCatalogPortal({lang,go}){var lv=(ru,uz,en)=>_lv(lang,ru,uz,en);var cats=window.DATA&&window.DATA.CATEGORIES||[];var tiles=[{key:"equip",ru:"Медицинское оборудование",uz:"Tibbiy uskunalar",en:"Medical equipment",ic:"pulse",accent:"var(--blue-500)",catKey:"equipment"},{key:"furn",ru:"Медицинская мебель",uz:"Tibbiy mebel",en:"Medical furniture",ic:"bed",accent:"var(--accent)",catKey:"furniture"},{key:"inst",ru:"Инструменты",uz:"Asboblar",en:"Instruments",ic:"scalpel",accent:"var(--accent)",catKey:"instruments"},{key:"cons",ru:"Расходные материалы",uz:"Sarf materiallari",en:"Consumables",ic:"box",accent:"var(--accent)",catKey:"consumables"}];var goTile=t=>{var found=cats.find(c=>c.slug===t.catKey||c.id===t.catKey);go("catalog",found?{cat:found.id}:{})};return React.createElement("section",{className:"sx-section"},React.createElement("div",{className:"sx-wrap"},React.createElement("div",{className:"sx-cp sx-rv"},React.createElement("div",{className:"sx-cp-aurora"}),React.createElement("div",{className:"sx-cp-ov"}),React.createElement("div",{className:"sx-cp-inner"},React.createElement("div",null,React.createElement("span",{className:"sx-cp-eyebrow"},lv("Электронный каталог","Elektron katalog","Electronic catalog")),React.createElement("h2",{className:"sx-cp-h2"},lv("2 800+ единиц оборудования для медицины","Tibbiyot uchun 2 800+ birlik uskunalar","2,800+ units of medical equipment")),React.createElement("p",{className:"sx-cp-sub"},lv("Медтехника, мебель, инструменты и расходные материалы. Поиск по бренду, направлению и наличию на складе.","Tibbiy texnika, mebel, asboblar va sarf materiallari. Brend va yo'nalish bo'yicha qidiruv.","Equipment, furniture, instruments and consumables. Search by brand, specialty and stock.")),React.createElement("button",{className:"sx-cp-btn",onClick:()=>go("catalog",{})},React.createElement(Icon,{name:"grid",size:19}),lv("Открыть каталог","Katalogni ochish","Open catalog"),React.createElement(Icon,{name:"arrowRight",size:18}))),React.createElement("div",{className:"sx-cp-tiles"},tiles.map(tile=>React.createElement("button",{key:tile.key,className:"sx-cp-tile",style:{"--ta":tile.accent},onClick:()=>goTile(tile)},React.createElement("span",{className:"sx-cp-tile-ic"},React.createElement(Icon,{name:tile.ic,size:20})),React.createElement("span",{className:"sx-cp-tile-t"},lv(tile.ru,tile.uz,tile.en)),React.createElement(Icon,{name:"arrowRight",size:14,className:"sx-cp-tile-arr"}))))))))}function SoiFinalCTA({lang,go}){var cta=useHomeSetting("homepage_cta",CTA_DEFAULTS);var ctx=field=>trTx(cta,field,lang);return React.createElement("section",{className:"sx-section"},React.createElement("div",{className:"sx-wrap"},React.createElement("div",{className:"sx-cta sx-rv"},React.createElement("div",{className:"sx-cta-aurora"}),React.createElement("div",{className:"sx-cta-inner"},React.createElement("h2",null,ctx("title")),React.createElement("p",null,ctx("subtitle")),React.createElement("div",{className:"sx-cta-actions"},React.createElement("button",{className:"sx-btn sx-btn-primary",onClick:()=>{if(window.__openQuote)window.__openQuote();else go("contacts")}},React.createElement(Icon,{name:"doc",size:19}),ctx("btn1")),React.createElement("button",{className:"sx-btn sx-btn-ghost",onClick:()=>go("catalog",{})},React.createElement(Icon,{name:"grid",size:18}),ctx("btn2")))))))}function HomePage({t,lang,store,go}){useSoiReveal();return React.createElement("div",{className:"sx"},React.createElement(SoiPlatformCSS,null),React.createElement(Hero,{t:t,lang:lang,go:go}),React.createElement(SoiEcosystem,{lang:lang,go:go}),React.createElement(SoiExpertise,{lang:lang,go:go}),React.createElement(SoiCatalogCards,{lang:lang,go:go}),React.createElement(SoiDirections,{lang:lang,go:go}),React.createElement(SoiCatalogPortal,{lang:lang,go:go}),React.createElement(SoiBrands,{lang:lang,go:go}),React.createElement(SoiCases,{lang:lang,go:go}),React.createElement(SoiNews,{lang:lang,go:go}),React.createElement(SoiFinalCTA,{lang:lang,go:go}))}Object.assign(window,{HomePage,Hero,CategoryGrid,FeaturedRow,TrustBand,BrandStrip,CtaBand,HeroVideoSlot});Object.assign(window,{SoiPlatformCSS,useSoiReveal,SoiHero:Hero,SoiEcosystem,SoiExpertise,SoiCatalogCards,SoiDirections,SoiCatalogPortal,SoiBrands,SoiCases,SoiReviews,SoiNews,SoiFinalCTA,SoiCaseModal:CaseModal});