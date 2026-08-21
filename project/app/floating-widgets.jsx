/* ИНДУСТРИЯ ЗДОРОВЬЯ — Floating widgets: FAB + chat channels + callback modal */
const { useState: useStateW, useEffect: useEffectW, useRef: useRefW } = React;

/* ── scroll progress bar ─────────────────────────────────────────────────
   Fixed hairline under the header; width tracks how much of the document has
   scrolled past. rAF-throttled so it doesn't add a scroll-jank source of its
   own — the one thing a progress bar must never do. */
function ScrollProgress() {
  const [pct, setPct] = useStateW(0);
  useEffectW(() => {
    let ticking = false;
    const compute = () => {
      ticking = false;
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setPct(max > 0 ? Math.min(100, (h.scrollTop / max) * 100) : 0);
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(compute); } };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, []);
  return <div className="scroll-progress" style={{ transform: "scaleX(" + (pct / 100) + ")" }} />;
}

/* ── back to top ──────────────────────────────────────────────────────── */
function BackToTop() {
  const [show, setShow] = useStateW(false);
  useEffectW(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      className={"back-to-top" + (show ? " show" : "")}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      tabIndex={show ? 0 : -1}
    >
      <Icon name="chevronUp" size={20} sw={2.4} />
    </button>
  );
}

/* ── page loader ──────────────────────────────────────────────────────── */
/* Shown once per hard load (not on client-side route changes — those are the
   SPA's job, not the boot screen's). 1.8s fixed floor rather than tied to any
   real readiness signal: the page has no single "everything is here" event
   (fonts, catalog data and the CMS overlay all resolve independently), and a
   floor that occasionally outlasts the content is a far smaller sin than a
   loader that flashes for 40ms on a fast connection. */
function PageLoader() {
  const [hide, setHide] = useStateW(false);
  const [gone, setGone] = useStateW(false);
  useEffectW(() => {
    const t1 = setTimeout(() => setHide(true), 1800);
    const t2 = setTimeout(() => setGone(true), 2100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  if (gone) return null;
  return (
    <div className={"page-loader" + (hide ? " hide" : "")} aria-hidden={hide}>
      <div className="pl-ring" />
      <img className="pl-mark" src={window.__asset("assets/soi-mark.svg")} alt="" />
      <div className="pl-bar"><div className="pl-bar-in" /></div>
    </div>
  );
}

/* ── quick quote modal ────────────────────────────────────────────────── */
/* Same visual family as CallbackModal but a different lead shape (name/phone/
   email/message vs name/phone/time-slot) and a real submit: POST /submissions
   is public (SubmissionsController @Public()) and already exists for exactly
   this — no new backend needed. A honeypot field catches simple bots: it's
   visually hidden but present in the DOM, so a human never fills it and a
   scripted submit that fills every field trips it. */
function QuickQuoteModal({ lang, onClose }) {
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  const [sent, setSentQ] = useStateW(false);
  const [busy, setBusy] = useStateW(false);
  const [err, setErr] = useStateW("");
  const [msg, setMsg] = useStateW("");
  const MSG_MAX = 500;

  const submit = async (e) => {
    e.preventDefault();
    const form = e.target;
    if (form.elements.company.value) return; // honeypot tripped — drop silently, no error shown to the bot
    setErr(""); setBusy(true);
    try {
      await window.api.create("submissions", {
        name: form.elements.name.value,
        phone: form.elements.phone.value,
        email: form.elements.email.value || undefined,
        message: form.elements.message.value || undefined,
        source: "consultation_modal",
      });
      setSentQ(true);
    } catch (e2) {
      setErr(lv("Не удалось отправить. Попробуйте ещё раз или позвоните нам.", "Yuborilmadi. Qayta urinib koʻring yoki bizga qoʻngʻiring.", "Couldn't send. Please try again or call us."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-ov" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 440 }} onClick={(e) => e.stopPropagation()}>
        {!sent ? (
          <>
            <div className="modal-head">
              <button className="modal-close" onClick={onClose}><Icon name="x" size={20} /></button>
              <h3>{lv("Заказать консультацию", "Konsultatsiya buyurtma qilish", "Request a consultation")}</h3>
              <p>{lv("Оставьте заявку — мы свяжемся с вами в течение рабочего дня", "Ariza qoldiring — ish kuni davomida bogʻanamiz", "Leave a request — we'll reach out within one business day")}</p>
            </div>
            <div className="modal-body">
              <form onSubmit={submit}>
                <input type="text" name="company" tabIndex={-1} autoComplete="off" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} aria-hidden="true" />
                <div className="field"><label>{lv("Имя", "Ismingiz", "Name")}</label><input name="name" required placeholder={lv("Ваше имя", "Ismingiz", "Your name")} /></div>
                <div className="field"><label>{lv("Телефон", "Telefon", "Phone")}</label><input name="phone" required placeholder="+998 (__) ___-__-__" /></div>
                <div className="field"><label>Email</label><input name="email" type="email" placeholder="email@example.com" /></div>
                <div className="field">
                  <label>{lv("Сообщение", "Xabar", "Message")}</label>
                  <textarea name="message" rows={3} maxLength={MSG_MAX} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder={lv("Что вас интересует?", "Sizni nima qiziqtiradi?", "What are you interested in?")} />
                  <div style={{ textAlign: "right", fontSize: 12, color: "var(--slate-500)", marginTop: 4 }}>{msg.length}/{MSG_MAX}</div>
                </div>
                {err && <p style={{ color: "var(--danger, #d13c3c)", fontSize: 13, margin: "0 0 10px" }}>{err}</p>}
                <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={busy} style={{ marginTop: 4 }}>
                  {busy ? lv("Отправка…", "Yuborilmoqda…", "Sending…") : lv("Отправить заявку", "Arizani yuborish", "Send request")}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="modal-body">
            <div className="modal-ok">
              <div className="ok-ic"><Icon name="check" size={34} sw={2.4} /></div>
              <h3>{lv("Заявка отправлена!", "Ariza yuborildi!", "Request sent!")}</h3>
              <p>{lv("Мы свяжемся с вами в течение рабочего дня.", "Ish kuni davomida siz bilan bogʻanamiz.", "We'll get back to you within one business day.")}</p>
              <button className="btn btn-primary btn-lg" onClick={onClose}>{lv("Готово", "Tayyor", "Done")}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CallbackModal({ lang, onClose }) {
  const lv = (ru, uz, en) => lang==="uz"?uz:lang==="en"?en:ru;
  const [sent, setSent] = useStateW(false);
  const [time, setTime] = useStateW("now");
  return (
    <div className="modal-ov" onClick={onClose}>
      <div className="modal" style={{maxWidth:420}} onClick={e=>e.stopPropagation()}>
        {!sent ? (
          <>
            <div className="modal-head">
              <button className="modal-close" onClick={onClose}><Icon name="x" size={20}/></button>
              <h3>{lv("Перезвоните мне","Qayta qo\u02bbng\u02bbiring","Call me back")}</h3>
              <p>{lv("Менеджер свяжется с вами в течение 15 минут","Menejer 15 daqiqa ichida bog\u02bbanadi","Manager will call within 15 minutes")}</p>
            </div>
            <div className="modal-body">
              <form onSubmit={e=>{e.preventDefault();setSent(true);}}>
                <div className="field"><label>{lv("Ваше имя","Ismingiz","Your name")}</label><input required placeholder={lv("Иванов Иван","Ismingiz","Your name")} /></div>
                <div className="field"><label>{lv("Номер телефона","Telefon raqami","Phone number")}</label><input required placeholder="+998 __ ___-__-__" /></div>
                <div className="field">
                  <label>{lv("Удобное время","Qulay vaqt","Preferred time")}</label>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:6}}>
                    {[[lv("Сейчас","Hozir","Now"),"now"],[lv("Утром 9–12","Ertalab 9–12","Morning 9–12"),"morning"],[lv("После обеда 12–18","Tushdan keyin 12–18","Afternoon 12–18"),"afternoon"]].map(([l,v])=>(
                      <button type="button" key={v}
                        style={{padding:"8px 14px",borderRadius:9,fontWeight:700,fontSize:13,border:"1.5px solid",cursor:"pointer",background:time===v?"var(--blue-600)":"#fff",color:time===v?"#fff":"var(--slate-700)",borderColor:time===v?"var(--blue-600)":"var(--line)"}}
                        onClick={()=>setTime(v)}>{l}</button>
                    ))}
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-block btn-lg" style={{marginTop:8}}>
                  <Icon name="phone" size={18}/>{lv("Жду звонка","Qo\u02bbng\u02bbiriqni kutaman","Request call")}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="modal-body">
            <div className="modal-ok">
              <div className="ok-ic"><Icon name="check" size={34} sw={2.4}/></div>
              <h3>{lv("Заявка принята!","Ariza qabul qilindi!","Request received!")}</h3>
              <p>{lv("Менеджер позвонит вам в ближайшее время.","Menejer tez orada qo\u02bbng\u02bbiradi.","Manager will call you shortly.")}</p>
              <button className="btn btn-primary btn-lg" onClick={onClose}>{lv("Готово","Tayyor","Done")}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FloatingWidgets({ lang, go }) {
  const lv = (ru, uz, en) => lang==="uz"?uz:lang==="en"?en:ru;
  const [open, setOpen] = useStateW(false);
  const [cbOpen, setCbOpen] = useStateW(false);
  const [pulse, setPulse] = useStateW(true);

  // stop pulse after first open
  const handleOpen = () => { setOpen(!open); setPulse(false); };

  const CHANNELS = [
    { icon:"tg", label:"Telegram",    color:"var(--blue-500)", bg:"var(--blue-50)", href:"https://t.me/UzMedEx_bot" },
    { icon:"wa", label:"WhatsApp",    color:"#25D366", bg:"var(--bg-2)", href:"https://wa.me/998773870001?text=Здравствуйте!%20Пишу%20с%20ИНДУСТРИЯ%20ЗДОРОВЬЯ." },
    { icon:"phone", label:lv("Перезвоните мне","Qayta qo\u02bbng\u02bbiring","Call me back"), color:"var(--blue-600)", bg:"var(--bg-2)", cb:true },
  ];

  return (
    <>
      <div className="fab-wrap">
        {open && (
          <div className="fab-channels">
            {CHANNELS.map((ch,i)=>(
              ch.cb
                ? <button key={i} className="fab-ch" style={{"--ch-color":ch.color,"--ch-bg":ch.bg}} onClick={()=>{setCbOpen(true);setOpen(false);}}>
                    <span className="fab-ch-ic"><Icon name="phone" size={18}/></span>
                    <span className="fab-ch-label">{ch.label}</span>
                  </button>
                : <a key={i} className="fab-ch" style={{"--ch-color":ch.color,"--ch-bg":ch.bg}} href={ch.href} target="_blank" rel="noopener">
                    <span className="fab-ch-ic">
                      {ch.icon==="tg"
                        ? <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.94 8.19-2.07 9.74c-.15.68-.55.84-1.12.52l-3.1-2.29-1.5 1.44c-.17.17-.31.31-.63.31l.22-3.17 5.74-5.18c.25-.22-.05-.34-.39-.12L7.18 14.6l-3.04-.95c-.66-.21-.67-.66.14-.97L17.06 7.2c.55-.2 1.03.13.88.99z"/></svg>
                        : <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.52 3.48A11.9 11.9 0 0 0 12 0C5.37 0 0 5.37 0 12a11.9 11.9 0 0 0 1.6 6l-1.7 6.18 6.33-1.66A11.9 11.9 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.22-3.48-8.52zM12 21.9c-1.74 0-3.43-.47-4.92-1.35l-.35-.21-3.76.98.99-3.66-.23-.37A9.88 9.88 0 0 1 2.1 12c0-5.47 4.43-9.9 9.9-9.9a9.86 9.86 0 0 1 9.9 9.9c0 5.47-4.43 9.9-9.9 9.9zm5.42-7.41c-.3-.15-1.76-.87-2.03-.97s-.47-.15-.67.15-.77.97-.94 1.17-.35.22-.65.07a8.14 8.14 0 0 1-2.4-1.48 9.05 9.05 0 0 1-1.66-2.07c-.17-.3 0-.46.13-.61.12-.13.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52s-.67-1.6-.91-2.2c-.24-.58-.48-.5-.67-.5h-.57a1.1 1.1 0 0 0-.79.37c-.27.3-1.03 1-1.03 2.45s1.06 2.84 1.2 3.04c.15.2 2.07 3.16 5.02 4.44.7.3 1.25.48 1.67.62.7.22 1.34.19 1.84.11.56-.08 1.76-.72 2-1.42.25-.7.25-1.3.17-1.42s-.27-.2-.57-.35z"/></svg>
                      }
                    </span>
                    <span className="fab-ch-label">{ch.label}</span>
                  </a>
            ))}
          </div>
        )}
        {/* Пузырь реплики, не трубка: виджет открывает Telegram/WhatsApp, то
            есть переписку, а звонок — лишь один из трёх каналов внутри. */}
        <button className={"fab-main "+(pulse?"pulse":"")} onClick={handleOpen} aria-label="Contact">
          <Icon name={open?"x":"chat"} size={22} sw={2} />
        </button>
      </div>
      {cbOpen && <CallbackModal lang={lang} onClose={()=>setCbOpen(false)} />}
    </>
  );
}

Object.assign(window, { FloatingWidgets, CallbackModal, QuickQuoteModal, ScrollProgress, BackToTop, PageLoader });
