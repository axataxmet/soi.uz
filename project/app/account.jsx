/* ИНДУСТРИЯ ЗДОРОВЬЯ — Personal account page */
const { useState: useStateAcc, useEffect: useEffectAcc } = React;

const ACC_KEY = "uzmedex_account_v1";

function getAcc() { try { return JSON.parse(localStorage.getItem(ACC_KEY)); } catch(e) { return null; } }
function setAcc(v) { localStorage.setItem(ACC_KEY, JSON.stringify(v)); }
function clearAcc() { localStorage.removeItem(ACC_KEY); }

function AccountPage({ t, lang, store, go }) {
  const lv = (ru, uz, en) => lang==="uz"?uz:lang==="en"?en:ru;
  const [acc, setAccState] = useStateAcc(() => getAcc());
  const [tab, setTab] = useStateAcc("orders");
  const [regMode, setRegMode] = useStateAcc(false);

  const login = (data) => { setAcc(data); setAccState(data); };
  const logout = () => { clearAcc(); setAccState(null); };

  if (!acc) return <LoginForm lang={lang} lv={lv} t={t} go={go} onLogin={login} regMode={regMode} setRegMode={setRegMode} />;

  const TABS = [
    { id:"orders",  icon:"orders",  label:lv("Мои заявки","Arizalarim","My orders") },
    { id:"kp",      icon:"doc",     label:lv("Сохранённые КП","Saqlangan KP","Saved quotes") },
    { id:"org",     icon:"award",   label:lv("Организация","Tashkilot","Organization") },
    { id:"profile", icon:"user",    label:lv("Профиль","Profil","Profile") },
  ];

  const mockOrders = (window.ADMIN_DATA?.ORDERS||[]).filter(o=>o.clientId==="c02").slice(0,5);

  return (
    <div className="wrap" style={{padding:"8px 0 60px"}}>
      <div className="crumb">
        <a onClick={()=>go("home")}>{t.breadcrumb_home}</a>
        <Icon name="chevronRight" size={14}/>
        <span className="cur">{lv("Личный кабинет","Shaxsiy kabinet","My account")}</span>
      </div>

      <div className="acc-layout">
        {/* sidebar */}
        <aside className="acc-side">
          <div className="acc-who">
            <div className="acc-avatar">{acc.name.slice(0,2).toUpperCase()}</div>
            <div>
              <div className="acc-name">{acc.name}</div>
              <div className="acc-email">{acc.email}</div>
              {acc.org && <div className="acc-org">{acc.org}</div>}
            </div>
          </div>
          <nav className="acc-nav">
            {TABS.map(tb=>(
              <button key={tb.id} className={"acc-navitem "+(tab===tb.id?"on":"")} onClick={()=>setTab(tb.id)}>
                <Icon name={tb.icon} size={18}/>
                <span>{tb.label}</span>
              </button>
            ))}
          </nav>
          <button className="acc-logout" onClick={logout}>
            <Icon name="logout" size={16}/>{lv("Выйти","Chiqish","Sign out")}
          </button>
        </aside>

        {/* content */}
        <main className="acc-main">
          {tab==="orders" && <AccOrders lv={lv} orders={mockOrders} t={t} go={go} store={store} lang={lang}/>}
          {tab==="kp" && <AccKP lv={lv} t={t} go={go} lang={lang}/>}
          {tab==="org" && <AccOrg lv={lv} acc={acc} onSave={d=>{const n={...acc,...d};setAcc(n);setAccState(n);}}/>}
          {tab==="profile" && <AccProfile lv={lv} acc={acc} onSave={d=>{const n={...acc,...d};setAcc(n);setAccState(n);}}/>}
        </main>
      </div>
    </div>
  );
}

function LoginForm({ lang, lv, t, go, onLogin, regMode, setRegMode }) {
  return (
    <div className="wrap" style={{padding:"40px 0 80px",maxWidth:480,margin:"0 auto"}}>
      <div className="crumb"><a onClick={()=>go("home")}>{t.breadcrumb_home}</a><Icon name="chevronRight" size={14}/><span className="cur">{lv("Личный кабинет","Shaxsiy kabinet","My account")}</span></div>
      <div className="acc-login-card">
        <h1 style={{fontSize:26,fontWeight:800,marginBottom:6}}>{regMode?lv("Регистрация","Ro'yxatdan o'tish","Register"):lv("Вход в кабинет","Kirish","Sign in")}</h1>
        <p style={{color:"var(--slate-500)",fontSize:14,marginBottom:24}}>{regMode?lv("Создайте аккаунт для управления заявками","Arizalarni boshqarish uchun hisob yarating","Create an account to manage your requests"):lv("Войдите, чтобы управлять заявками и КП","Ariza va KP boshqarish uchun kiring","Sign in to manage your requests and quotes")}</p>
        <form onSubmit={e=>{e.preventDefault();const fd=new FormData(e.target);onLogin({email:fd.get("email"),name:fd.get("name")||fd.get("email").split("@")[0],org:fd.get("org")||""});}}>
          {regMode && <div className="field"><label>{lv("Имя и фамилия","Ism va familiya","Full name")}</label><input name="name" required /></div>}
          <div className="field"><label>{lv("E-mail","E-mail","E-mail")}</label><input name="email" type="email" required placeholder="mail@clinic.uz"/></div>
          {regMode && <div className="field"><label>{lv("Организация","Tashkilot","Organization")}</label><input name="org" placeholder={lv("Название клиники","Klinika nomi","Clinic name")}/></div>}
          <button type="submit" className="btn btn-primary btn-block btn-lg" style={{marginTop:8}}>{regMode?lv("Зарегистрироваться","Ro'yxatdan o'tish","Register"):lv("Войти","Kirish","Sign in")}</button>
        </form>
        <div style={{textAlign:"center",marginTop:16,fontSize:14,color:"var(--slate-500)"}}>
          {regMode?lv("Уже есть аккаунт?","Hisobingiz bormi?","Already have an account?"):lv("Нет аккаунта?","Hisobingiz yo'qmi?","No account?")}{" "}
          <button onClick={()=>setRegMode(!regMode)} style={{color:"var(--blue-600)",fontWeight:700,background:"none",border:"none",cursor:"pointer"}}>{regMode?lv("Войти","Kirish","Sign in"):lv("Зарегистрироваться","Ro'yxatdan o'tish","Register")}</button>
        </div>
      </div>
    </div>
  );
}

function AccOrders({ lv, orders, t, go }) {
  const STATUS = { new:lv("Новая","Yangi","New"), processing:lv("В работе","Ishda","Processing"), shipped:lv("Отгружено","Jo'natildi","Shipped"), completed:lv("Выполнено","Bajarildi","Completed"), cancelled:lv("Отменена","Bekor","Cancelled") };
  const STATUS_CLS = { new:"new", processing:"processing", shipped:"shipped", completed:"completed", cancelled:"cancelled" };
  return (
    <div>
      <h2 className="acc-sec-title">{lv("Мои заявки","Mening arizalarim","My requests")}</h2>
      {orders.length===0
        ? <div className="empty"><div className="e-ic"><Icon name="orders" size={28}/></div><h3>{lv("Заявок пока нет","Hali ariza yo'q","No requests yet")}</h3><button className="btn btn-primary" style={{marginTop:18}} onClick={()=>go("catalog",{})}><Icon name="grid" size={18}/>{t.cart_to_catalog}</button></div>
        : <div className="acc-orders">
            {orders.map(o=>(
              <div key={o.id} className="acc-order-card">
                <div className="aoc-head">
                  <div className="aoc-num mono">{o.id}</div>
                  <span className={"adm-badge dot "+STATUS_CLS[o.status]}>{STATUS[o.status]||o.status}</span>
                  <div className="aoc-date mono">{o.date}</div>
                </div>
                <div className="aoc-body">
                  <div className="aoc-items">{o.items.length} {lv("позиций","ta","items")}</div>
                  <div className="aoc-total">{fmtPrice(o.total)} {t.currency}</div>
                </div>
              </div>
            ))}
          </div>}
    </div>
  );
}

function AccKP({ lv, t, go }) {
  const cart = window.ADMIN_DATA?.getLiveCart?.() || [];
  const contacts = useSiteContacts();
  function exportKP(){
    const date = new Date().toLocaleDateString("ru-RU");
    const num = "КП-" + Date.now().toString().slice(-6);
    const cur = t.currency || "сум";
    const rows = cart.map((c,i)=>{
      const name=(c.product.ru||"").split(",")[0];
      return `<tr><td style="text-align:center">${i+1}</td><td>${name}</td><td style="text-align:center">${c.q}</td><td style="text-align:right">${(c.product.price||0).toLocaleString("ru-RU")} ${cur}</td><td style="text-align:right;font-weight:700">${((c.product.price||0)*c.q).toLocaleString("ru-RU")} ${cur}</td></tr>`;
    }).join("");
    const total = cart.reduce((s,c)=>s+(c.product.price||0)*c.q,0);
    const html = `<!DOCTYPE html><html lang="ru"><head><meta charset="UTF-8"/><title>${num} — ИНДУСТРИЯ ЗДОРОВЬЯ</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;font-size:var(--fs-3);color:#111;padding:40px}.logo{font-size:var(--fs-7);font-weight:900;color:var(--blue-600);letter-spacing:-1px}.logo span{color:var(--blue-600)}.header{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:16px;margin-bottom:24px}.meta{text-align:right;font-size:var(--fs-2);color:#555;line-height:1.6}h2{font-size:var(--fs-5);font-weight:700;margin-bottom:16px;color:var(--blue-600)}table{width:100%;border-collapse:collapse;margin-bottom:18px}th{background:var(--bg-2);padding:8px 10px;text-align:left;font-size:var(--fs-2);color:var(--blue-600);border:1px solid var(--line-soft)}td{padding:8px 10px;border:1px solid var(--line-soft)}.total-row td{font-size:var(--fs-4);font-weight:800;color:var(--blue-600);background:var(--bg-2)}.footer-note{font-size:var(--fs-1);color:#777;padding-top:12px;margin-top:12px}@media print{body{padding:20px}}</style></head><body>
<div class="header"><div><div class="logo">ИНДУСТРИЯ ЗДОРОВЬЯ</div><div style="font-size:var(--fs-1);color:#555;margin-top:4px">${contacts.address}<br>${contacts.phone} · ${contacts.email}</div></div><div class="meta"><strong style="font-size:var(--fs-4)">${num}</strong><br>Дата: ${date}<br>Действителен: 14 дней</div></div>
<h2>Коммерческое предложение</h2>
<table><tr><th style="width:36px;text-align:center">№</th><th>Наименование</th><th style="text-align:center">Кол-во</th><th style="text-align:right">Цена</th><th style="text-align:right">Сумма</th></tr>${rows}<tr class="total-row"><td colspan="4" style="text-align:right">Итого</td><td style="text-align:right">${total.toLocaleString("ru-RU")} ${cur}</td></tr></table>
<div class="footer-note">Цены без НДС, справочные. Менеджер ИНДУСТРИЯ ЗДОРОВЬЯ свяжется в течение одного рабочего дня.</div></body></html>`;
    const w = window.open("", "_blank", "width=800,height=900");
    if(!w){ alert(lv("Браузер заблокировал всплывающее окно","Brauzer pop-up oynani bloklab qoʻydi","Browser blocked the popup")); return; }
    w.document.write(html); w.document.close(); w.focus();
    setTimeout(()=>{ w.print(); }, 400);
  }
  return (
    <div>
      <h2 className="acc-sec-title">{lv("Сохранённые КП","Saqlangan KP","Saved quotes")}</h2>
      {cart.length > 0 ? (
        <div className="acc-kp-card">
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
            <div>
              <div style={{fontWeight:800,fontSize:16}}>{lv("Текущая корзина","Joriy savat","Current cart")} · {cart.length} {lv("позиций","ta","items")}</div>
              <div style={{fontSize:13,color:"var(--slate-500)",marginTop:3}}>{lv("Создано","Yaratildi","Created")} {new Date().toLocaleDateString("ru-RU")}</div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button className="btn btn-ghost" style={{height:40}} onClick={()=>go("cart",{})}>
                <Icon name="cart" size={16}/>{lv("В корзину","Savatga","View cart")}
              </button>
              <button className="btn btn-primary" style={{height:40}} onClick={exportKP}>
                <Icon name="doc" size={16}/>{lv("Скачать КП","KP yuklash","Export PDF")}
              </button>
            </div>
          </div>
          {cart.slice(0,3).map((c,i)=>(
            <div key={i} style={{display:"flex",gap:12,padding:"11px 0",borderTop:"1px solid var(--line)",fontSize:14}}>
              <span style={{flex:1,fontWeight:600}}>{(lang==="uz"?c.product.uz:c.product.ru).split(",")[0]}</span>
              <span className="mono">{c.q} × {fmtPrice(c.product.price)}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty"><div className="e-ic"><Icon name="doc" size={28}/></div><h3>{lv("Нет сохранённых КП","Saqlangan KP yo'q","No saved quotes")}</h3><button className="btn btn-primary" style={{marginTop:18}} onClick={()=>go("catalog",{})}><Icon name="grid" size={18}/>{t.cart_to_catalog}</button></div>
      )}
    </div>
  );
}

function AccOrg({ lv, acc, onSave }) {
  return (
    <div>
      <h2 className="acc-sec-title">{lv("Организация","Tashkilot","Organization")}</h2>
      <form className="acc-form" onSubmit={e=>{e.preventDefault();const fd=new FormData(e.target);onSave({org:fd.get("org"),inn:fd.get("inn"),addr:fd.get("addr"),phone:fd.get("phone")});}}>
        <div className="field"><label>{lv("Название организации","Tashkilot nomi","Organization name")}</label><input name="org" defaultValue={acc.org||""}/></div>
        <div className="field-row">
          <div className="field"><label>{lv("ИНН","STIR","Tax ID")}</label><input name="inn" className="mono" placeholder="______________"/></div>
          <div className="field"><label>{lv("Телефон организации","Tashkilot telefoni","Org phone")}</label><input name="phone" placeholder="+998 __ ___-__-__"/></div>
        </div>
        <div className="field"><label>{lv("Адрес","Manzil","Address")}</label><input name="addr" placeholder={lv("г. Ташкент, ул...","Toshkent, ko'cha...","Tashkent, street...")}/></div>
        <button type="submit" className="btn btn-primary">{lv("Сохранить","Saqlash","Save")}</button>
      </form>
    </div>
  );
}

function AccProfile({ lv, acc, onSave }) {
  return (
    <div>
      <h2 className="acc-sec-title">{lv("Профиль","Profil","Profile")}</h2>
      <form className="acc-form" onSubmit={e=>{e.preventDefault();const fd=new FormData(e.target);onSave({name:fd.get("name"),phone:fd.get("phone")});}}>
        <div className="field-row">
          <div className="field"><label>{lv("Имя","Ism","Name")}</label><input name="name" defaultValue={acc.name||""} required /></div>
          <div className="field"><label>{lv("E-mail","E-mail","E-mail")}</label><input type="email" defaultValue={acc.email||""} disabled style={{opacity:.6}}/></div>
        </div>
        <div className="field"><label>{lv("Телефон","Telefon","Phone")}</label><input name="phone" defaultValue={acc.phone||""} placeholder="+998 __ ___-__-__"/></div>
        <button type="submit" className="btn btn-primary">{lv("Сохранить","Saqlash","Save")}</button>
      </form>
    </div>
  );
}

Object.assign(window, { AccountPage });
