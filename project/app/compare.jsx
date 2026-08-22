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
          {label:lv("Тендеры","Tenderlar","Tenders"), view:"tenders"},
          {label:lv("Новости","Yangiliklar","News"), view:"news"},
          {label:lv("О компании","Haqimizda","About"), view:"about"},
          {label:lv("Контакты","Kontaktlar","Contacts"), view:"contacts"},
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
        <span>{t.foot_catalog}</span>
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

/* CalcPage удалён: страницы нет в меню каталога. */
Object.assign(window, { MobileDrawer, MobileBottomNav, OnlineWidget, ViewCounter });
