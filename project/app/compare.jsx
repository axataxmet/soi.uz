/* UzMedEx — Mobile nav drawer + bottom nav + online widget + view counter + calculator */
const { useState: useMX, useEffect: useEX, useRef: useRX } = React;

/* ============================================================
   ONLINE WIDGET — «N менеджеров онлайн»
   ============================================================ */
function OnlineWidget({ lang }) {
  const lv = (ru, uz, en) => lang==="uz"?uz:lang==="en"?en:ru;
  return (
    <div className="online-widget">
      <span className="ow-dot" />
      <span>{lv("Менеджеры на связи · ответ за 15 минут","Menejerlar aloqada · 15 daqiqada javob","Managers online · reply in 15 min")}</span>
    </div>
  );
}

/* ============================================================
   VIEW COUNTER — «Смотрят N человек»
   ============================================================ */
function ViewCounter({ lang, productId }) {
  const lv = (ru, uz, en) => lang==="uz"?uz:lang==="en"?en:ru;
  const [count] = useMX(() => {
    const key = "uzmedex_views_" + productId;
    const stored = sessionStorage.getItem(key);
    if (stored) return [Number(stored)];
    const n = 2 + Math.floor(Math.random() * 6);
    sessionStorage.setItem(key, n);
    return [n];
  });
  return (
    <div className="view-counter">
      <Icon name="eye" size={15} style={{color:"var(--amber-600,#c87f15)"}}/>
      <span>{lv(`Смотрят ${count} человека`,`${count} kishi ko'rmoqda`,`${count} people viewing`)}</span>
    </div>
  );
}

/* ============================================================
   MOBILE DRAWER MENU
   ============================================================ */
function MobileDrawer({ t, lang, go, store, open, onClose }) {
  const lv = (ru, uz, en) => lang==="uz"?uz:lang==="en"?en:ru;
  const cats = window.DATA?.CATEGORIES || [];
  const dirs = (window.CMS ? window.CMS.list("cat_directions") : []).filter(d => d.active !== false).sort((a,b)=>(a.order||0)-(b.order||0));
  const [openId, setOpenId] = useMX(null);
  const toggleAcc = (id) => setOpenId((cur) => cur === id ? null : id);
  useEX(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;
  return (
    <>
      <div className="mob-ov" onClick={onClose} />
      <aside className="mob-drawer">
        <div className="mob-drawer-head">
          <img src={window.__asset("assets/soi-mark-white.svg")} alt="ИНДУСТРИЯ ЗДОРОВЬЯ" style={{height:34,width:34}} />
          <button className="mob-close" onClick={onClose}><Icon name="x" size={22}/></button>
        </div>

        {/* search */}
        <div className="mob-search">
          <Icon name="search" size={16} style={{color:"var(--slate-400)"}}/>
          <input placeholder={t.search_ph} onKeyDown={e=>{ if(e.key==="Enter"){ onClose(); go("catalog",{q:e.target.value}); } }}/>
        </div>

        {/* catalog bar menu — accordion */}
        <div className="mob-section-title">{lv("Каталог","Katalog","Catalog")}</div>

        {/* 1. Каталог по направлениям медицины */}
        {dirs.length > 0 && (
          <div className={"mob-acc" + (openId === "__dirs" ? " open" : "")}>
            <button className="mob-acc-head" onClick={() => toggleAcc("__dirs")}>
              <span className="mob-cat-ic"><Icon name="pulse" size={18}/></span>
              <span>{lv("Каталог по направлениям медицины","Tibbiyot yo'nalishlari katalogi","Catalog by medical specialty")}</span>
              <Icon name="chevronDown" size={16} className="mob-acc-chev"/>
            </button>
            {openId === "__dirs" && (
              <div className="mob-acc-body">
                {dirs.map(d => (
                  <a key={d.id} className="mob-acc-sub" onClick={() => { go("catalog",{dir:d.id}); onClose(); }}>{d.name}</a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2–5. Категории с подкатегориями */}
        {cats.map(c => {
          const subs = c.subs || [];
          const isOpen = openId === c.id;
          return (
            <div key={c.id} className={"mob-acc" + (isOpen ? " open" : "")}>
              <button className="mob-acc-head" onClick={() => subs.length ? toggleAcc(c.id) : (go("catalog",{cat:c.id}), onClose())}>
                <span className="mob-cat-ic"><Icon name={c.icon} size={18}/></span>
                <span>{lv(c.ru, c.uz, c.en)}</span>
                {subs.length > 0 && <Icon name="chevronDown" size={16} className="mob-acc-chev"/>}
              </button>
              {isOpen && subs.length > 0 && (
                <div className="mob-acc-body">
                  <a className="mob-acc-sub mob-acc-all" onClick={() => { go("catalog",{cat:c.id}); onClose(); }}>{lv("Все товары","Barchasi","All items")}</a>
                  {subs.map((s, i) => (
                    <a key={i} className="mob-acc-sub" onClick={() => { go("catalog",{cat:c.id, sub:i}); onClose(); }}>{lv(s.ru, s.uz, s.en)}</a>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* nav links */}
        <div className="mob-section-title" style={{marginTop:16}}>{lv("Разделы","Bo'limlar","Sections")}</div>
        {[
          {label:lv("Прайс-лист","Narxlar","Price list"), view:"price"},
          {label:lv("Комплекты","Komplektlar","Kits"), view:"kits"},
          {label:lv("Тендеры","Tenderlar","Tenders"), view:"tenders"},
          {label:lv("Новости","Yangiliklar","News"), view:"news"},
          {label:lv("О компании","Haqimizda","About"), view:"info", params:{p:"about"}},
          {label:lv("Контакты","Kontaktlar","Contacts"), view:"info", params:{p:"contacts"}},
        ].map((item,i) => (
          <div key={i} className="mob-nav-item" onClick={()=>{ go(item.view, item.params||{}); onClose(); }}>
            {item.label}
          </div>
        ))}

        {/* phone */}
        <a href="tel:+998772250001" className="mob-phone">
          <Icon name="phone" size={18}/>+998 (77) 225-00-01
        </a>
      </aside>
    </>
  );
}

/* ============================================================
   MOBILE BOTTOM NAV
   ============================================================ */
function MobileBottomNav({ t, lang, store, go }) {
  const lv = (ru, uz, en) => lang==="uz"?uz:lang==="en"?en:ru;
  return (
    <nav className="mob-bottom-nav">
      <button className="mbn-item" onClick={() => go("home",{})}>
        <Icon name="home" size={22}/>
        <span>{lv("Главная","Bosh","Home")}</span>
      </button>
      <button className="mbn-item" onClick={() => go("catalog",{})}>
        <Icon name="grid" size={22}/>
        <span>{t.catalog}</span>
      </button>
      <button className="mbn-item fab" onClick={() => window.__openQuote&&window.__openQuote()}>
        <Icon name="phone" size={24} sw={2}/>
      </button>
      <button className="mbn-item" onClick={() => go("wishlist",{})}>
        <Icon name="heart" size={22}/>
        {store.wishlist.length > 0 && <span className="mbn-cnt">{store.wishlist.length}</span>}
        <span>{t.wishlist}</span>
      </button>
      <button className="mbn-item" onClick={() => go("cart",{})}>
        <Icon name="cart" size={22}/>
        {store.cartCount > 0 && <span className="mbn-cnt">{store.cartCount}</span>}
        <span>{t.cart}</span>
      </button>
    </nav>
  );
}

/* ============================================================
   EQUIPMENT COST CALCULATOR
   ============================================================ */
const CALC_PRESETS = {
  clinic:     { ru:"Поликлиника", uz:"Poliklinika", en:"Outpatient clinic",
    cats:{ diagnostics:0.45, physio:0.2, furniture:0.2, sterilization:0.1, surgery:0.05 } },
  hospital:   { ru:"Стационар (отделение)", uz:"Statsionar bo'limi", en:"Hospital ward",
    cats:{ surgery:0.35, diagnostics:0.25, sterilization:0.2, emergency:0.1, furniture:0.1 } },
  dental:     { ru:"Стоматологический кабинет", uz:"Stomatologiya kabineti", en:"Dental office",
    cats:{ sterilization:0.4, furniture:0.35, diagnostics:0.15, physio:0.1 } },
  emergency:  { ru:"Скорая помощь / реанимобиль", uz:"Tez yordam", en:"Ambulance / emergency",
    cats:{ emergency:0.5, diagnostics:0.3, sterilization:0.1, furniture:0.1 } },
  rehab:      { ru:"Реабилитационный центр", uz:"Reabilitatsiya markazi", en:"Rehabilitation centre",
    cats:{ physio:0.55, furniture:0.25, diagnostics:0.15, sterilization:0.05 } },
};

const BASE_PRICES = { diagnostics:28000000, surgery:62000000, sterilization:18000000, physio:14000000, emergency:32000000, furniture:9000000 };
const SCALE = [1,2,3,4,5,6,7,8,10,12,15,20];

function CalcPage({ t, lang, go }) {
  const lv = (ru, uz, en) => lang==="uz"?uz:lang==="en"?en:ru;
  const [type,  setType]  = useMX("clinic");
  const [rooms, setRooms] = useMX(3);
  const [level, setLevel] = useMX("standard"); // economy / standard / premium
  const [sent,  setSent]  = useMX(false);

  const LEVELS = {
    economy:  { label:lv("Базовый","Bazaviy","Economy"),  mult:0.65 },
    standard: { label:lv("Стандарт","Standart","Standard"), mult:1.0 },
    premium:  { label:lv("Премиум","Premium","Premium"),    mult:1.6 },
  };

  const preset = CALC_PRESETS[type];
  const mult   = LEVELS[level].mult;

  const total = useMX(() => {
    let sum = 0;
    for (const [cat, share] of Object.entries(preset.cats)) {
      sum += (BASE_PRICES[cat] || 20000000) * share * rooms * mult;
    }
    return Math.round(sum / 100000) * 100000;
  }, [type, rooms, level])[0];

  const breakdown = Object.entries(preset.cats).map(([cat, share]) => {
    const catData = (window.DATA?.CATEGORIES||[]).find(c=>c.id===cat);
    return {
      name:  catData ? lv(catData.ru, catData.uz, catData.en) : cat,
      val:   Math.round(BASE_PRICES[cat] * share * rooms * mult / 100000) * 100000,
      share: Math.round(share * 100),
    };
  }).sort((a,b)=>b.val-a.val);

  const fmtM = n => (n/1000000).toFixed(1) + " M";

  return (
    <div className="wrap" style={{padding:"8px 0 64px"}}>
      <div className="crumb">
        <a onClick={()=>go("home")}>{t.breadcrumb_home}</a>
        <Icon name="chevronRight" size={14}/>
        <span className="cur">{lv("Калькулятор оснащения","Jihozlash kalkulyatori","Equipment cost calculator")}</span>
      </div>
      <div className="calc-layout">
        <div>
          <h1 className="info-title" style={{marginBottom:6}}>{lv("Калькулятор стоимости оснащения","Jihozlash narxi kalkulyatori","Equipment cost estimator")}</h1>
          <p style={{color:"var(--slate-500)",fontSize:15,marginBottom:32}}>{lv("Оценка бюджета — ориентировочная. Точный расчёт — в КП от нашего менеджера.","Taxminiy hisob. Aniq narx uchun menejerimizdan KP so'rang.","Estimate only. Request a quote from our manager for exact pricing.")}</p>

          {/* type */}
          <div className="calc-section">
            <label className="calc-label">{lv("Тип учреждения","Muassasa turi","Facility type")}</label>
            <div className="calc-type-grid">
              {Object.entries(CALC_PRESETS).map(([k,v])=>(
                <button key={k} className={"calc-type-btn "+(type===k?"on":"")} onClick={()=>setType(k)}>
                  {lv(v.ru, v.uz, v.en)}
                </button>
              ))}
            </div>
          </div>

          {/* rooms */}
          <div className="calc-section">
            <label className="calc-label">{lv("Количество кабинетов / палат","Kabinetlar / palatalar soni","Number of rooms / wards")}: <b>{rooms}</b></label>
            <input type="range" min={1} max={20} step={1} value={rooms}
              onChange={e=>setRooms(Number(e.target.value))}
              className="calc-slider" style={{width:"100%",marginTop:8}}/>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"var(--slate-400)",fontWeight:600,marginTop:4}}>
              <span>1</span><span>5</span><span>10</span><span>15</span><span>20</span>
            </div>
          </div>

          {/* level */}
          <div className="calc-section">
            <label className="calc-label">{lv("Уровень оснащения","Jihozlash darajasi","Equipment tier")}</label>
            <div style={{display:"flex",gap:10}}>
              {Object.entries(LEVELS).map(([k,v])=>(
                <button key={k} className={"calc-level-btn "+(level===k?"on":"")} onClick={()=>setLevel(k)}>
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* result */}
          <div className="calc-result">
            <div className="cr-label">{lv("Ориентировочный бюджет","Taxminiy byudjet","Estimated budget")}</div>
            <div className="cr-val">{total.toLocaleString("ru-RU")} <span className="cr-cur">{t.currency}</span></div>
            <div className="cr-range">{lv("от","dan","from")} {(total*0.85).toLocaleString("ru-RU")} {lv("до","gacha","to")} {(total*1.15).toLocaleString("ru-RU")} {t.currency}</div>
          </div>

          {/* breakdown */}
          <div style={{marginTop:24}}>
            <div style={{fontWeight:800,fontSize:14,color:"var(--slate-500)",textTransform:"uppercase",letterSpacing:".05em",marginBottom:12}}>{lv("Распределение по разделам","Bo'limlar bo'yicha taqsimot","Breakdown by section")}</div>
            {breakdown.map((b,i)=>(
              <div key={i} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:14,fontWeight:600,marginBottom:4}}>
                  <span>{b.name}</span>
                  <span className="mono">{fmtM(b.val)} ({b.share}%)</span>
                </div>
                <div style={{height:6,background:"var(--bg-2)",borderRadius:99,overflow:"hidden"}}>
                  <div style={{height:"100%",background:"var(--grad-brand)",width:b.share+"%",transition:".4s"}}/>
                </div>
              </div>
            ))}
          </div>

          <div style={{display:"flex",gap:12,marginTop:28,flexWrap:"wrap"}}>
            <button className="btn btn-primary btn-lg" onClick={()=>window.__openQuote&&window.__openQuote()}>
              <Icon name="doc" size={18}/>{lv("Получить точный расчёт","Aniq hisob olish","Get exact quote")}
            </button>
            <button className="btn btn-ghost btn-lg" onClick={()=>go("kits",{})}>
              <Icon name="grid" size={18}/>{lv("Готовые комплекты","Tayyor to'plamlar","Ready kits")}
            </button>
          </div>
        </div>

        {/* side */}
        <aside className="info-side">
          <div className="info-side-card">
            <h4>{lv("Как пользоваться","Qanday foydalanish","How to use")}</h4>
            <ol style={{paddingLeft:18,lineHeight:1.7,fontSize:13.5,color:"var(--slate-600)"}}>
              <li>{lv("Выберите тип учреждения","Muassasa turini tanlang","Select facility type")}</li>
              <li>{lv("Укажите количество кабинетов","Kabinetlar sonini kiriting","Enter room count")}</li>
              <li>{lv("Выберите уровень оснащения","Jihozlash darajasini tanlang","Choose equipment tier")}</li>
              <li>{lv("Получите КП с точными ценами","Aniq narxli KP oling","Get a quote with exact prices")}</li>
            </ol>
          </div>
          <div className="info-side-card" style={{marginTop:16,background:"linear-gradient(135deg,#eaf3fc,#dbeafb)"}}>
            <h4>{lv("Нужна помощь?","Yordam kerakmi?","Need help?")}</h4>
            <p style={{fontSize:13.5,color:"var(--slate-600)",marginBottom:14}}>{lv("Менеджер бесплатно составит смету под ваше ТЗ.","Menejer texnik topshiriq bo'yicha smeta tuzadi.","Manager will prepare a free estimate for your specs.")}</p>
            <a href="tel:+998772250001" style={{display:"flex",alignItems:"center",gap:8,fontWeight:800,color:"var(--blue-700)"}}>
              <Icon name="phone" size={16} style={{color:"var(--blue-600)"}}/>+998 (77) 225-00-01
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}

Object.assign(window, { MobileDrawer, MobileBottomNav, OnlineWidget, ViewCounter, CalcPage });
