/* HeroInlineForm — inline request form in hero */
function HeroInlineForm({ t, lang }) {
  const lv = (ru, uz, en) => lang==="uz"?uz:lang==="en"?en:ru;
  const { useState: useFX } = React;
  const [sent, setSent] = useFX(false);
  return (
    <div className="hero-form">
      <h4>{lv("Оставьте заявку — ответим за 15 минут","Ariza qoldiring — 15 daqiqada javob beramiz","Submit request — we'll reply in 15 min")}</h4>
      {!sent ? (
        <form onSubmit={e=>{e.preventDefault();setSent(true);}}>
          <div className="hero-form-row">
            <input className="hf-input" required placeholder={lv("Ваше имя","Ismingiz","Your name")} />
            <input className="hf-input" required placeholder="+998 __ ___-__-__" />
          </div>
          <input className="hf-input" placeholder={lv("Клиника / организация (необязательно)","Klinika (ixtiyoriy)","Clinic / org (optional)")} style={{marginBottom:8,width:"100%",display:"block"}} />
          <button type="submit" className="btn btn-primary" style={{width:"100%",justifyContent:"center",height:44,marginTop:4}}>
            <Icon name="arrowRight" size={17}/>{lv("Отправить заявку","Ariza yuborish","Send request")}
          </button>
        </form>
      ) : (
        <div className="hf-ok">
          <Icon name="check" size={18} sw={2.5}/>{lv("Заявка принята! Перезвоним в ближайшее время.","Ariza qabul qilindi! Tez orada qo'ng'iramiz.","Request received! We'll call you shortly.")}
        </div>
      )}
    </div>
  );
}
Object.assign(window, { HeroInlineForm });
