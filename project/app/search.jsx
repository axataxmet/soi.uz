/* ИНДУСТРИЯ ЗДОРОВЬЯ — Medical Device Registration landing (per TZ §8) */
function RegistrationPage({ t, lang, go }) {
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  const [sent, setSent] = useState(false);
  const [faq, setFaq] = useState(-1);

  const who = [
    lv("Производителям медицинских изделий","Tibbiy buyumlar ishlab chiqaruvchilarga","Medical device manufacturers"),
    lv("Иностранным брендам","Xorijiy brendlarga","Foreign brands"),
    lv("Импортёрам","Importchilarga","Importers"),
    lv("Дистрибьюторам","Distribyutorlarga","Distributors"),
    lv("Поставщикам оборудования","Uskuna yetkazib beruvchilarga","Equipment suppliers"),
    lv("Компаниям, выводящим изделие на рынок Узбекистана","O'zbekiston bozoriga buyum chiqaruvchi kompaniyalarga","Companies bringing a device to the Uzbek market"),
  ];
  const included = [
    lv("Первичный анализ изделия и текущей документации","Buyum va joriy hujjatlarning dastlabki tahlili","Initial analysis of the device and current documentation"),
    lv("Консультация по требованиям к документам","Hujjat talablari bo'yicha maslahat","Consultation on document requirements"),
    lv("Предварительное определение категории / типа изделия","Buyum toifasi / turini dastlabki aniqlash","Preliminary determination of device category / type"),
    lv("Подготовка регистрационного досье","Ro'yxat dosyesini tayyorlash","Preparation of the registration dossier"),
    lv("Проверка инструкции, маркировки и технических материалов","Yo'riqnoma, markirovka va texnik materiallarni tekshirish","Review of instructions, labeling and technical materials"),
    lv("Сопровождение подачи документов","Hujjatlarni topshirishni qo'llab-quvvatlash","Support for document submission"),
    lv("Коммуникация по замечаниям","Izohlar bo'yicha aloqa","Communication on remarks"),
    lv("Сопровождение до результата рассмотрения заявки","Ariza ko'rib chiqilishi natijasigacha qo'llab-quvvatlash","Support until the application is decided"),
  ];
  const steps = [
    lv("Предварительная консультация","Dastlabki maslahat","Initial consultation"),
    lv("Анализ изделия и документов","Buyum va hujjatlar tahlili","Device and document analysis"),
    lv("Проверка требований","Talablarni tekshirish","Requirements check"),
    lv("Подготовка регистрационного досье","Ro'yxat dosyesini tayyorlash","Registration dossier preparation"),
    lv("Сопровождение подачи","Topshirishni qo'llab-quvvatlash","Submission support"),
    lv("Коммуникация по замечаниям","Izohlar bo'yicha aloqa","Handling of remarks"),
    lv("Сопровождение до результата по заявке","Ariza natijasigacha qo'llab-quvvatlash","Support until the application result"),
  ];
  const docs = [
    lv("Документы производителя и на изделие","Ishlab chiqaruvchi va buyum hujjatlari","Manufacturer and device documents"),
    lv("Техническая документация и инструкции","Texnik hujjatlar va yo'riqnomalar","Technical documentation and instructions"),
    lv("Маркировка и упаковка","Markirovka va qadoqlash","Labeling and packaging"),
    lv("Сертификаты и протоколы испытаний","Sertifikatlar va sinov bayonnomalari","Certificates and test reports"),
    lv("Документы о качестве и безопасности","Sifat va xavfsizlik hujjatlari","Quality and safety documents"),
  ];
  const why = [
    lv("Понимание требований к медицинским изделиям и документации","Tibbiy buyumlar va hujjatlarga talablarni tushunish","Understanding of requirements for medical devices and documentation"),
    lv("Опыт поставок и работы с оборудованием","Uskuna yetkazish va u bilan ishlash tajribasi","Experience in supply and work with equipment"),
    lv("Связь с собственной B2B-платформой","O'zining B2B platformasi bilan bog'liqlik","Connection with our own B2B platform"),
    lv("Юридически аккуратное сопровождение процедуры","Jarayonni huquqiy jihatdan to'g'ri qo'llab-quvvatlash","Legally accurate support of the procedure"),
  ];
  const faqs = [
    { q: lv("Гарантируете ли вы получение регистрационного удостоверения?","Ro'yxat guvohnomasini olishni kafolatlaysizmi?","Do you guarantee obtaining the registration certificate?"),
      a: lv("Мы оказываем консультационное сопровождение и подготовку документов. Результат рассмотрения заявки зависит от типа изделия, полноты документов и требований законодательства. Мы не обещаем гарантированный результат.","Biz maslahat va hujjat tayyorlash xizmatini ko'rsatamiz. Ariza natijasi buyum turiga, hujjatlar to'liqligiga va qonun talablariga bog'liq. Biz kafolatlangan natijani va'da qilmaymiz.","We provide consulting support and document preparation. The outcome depends on the device type, completeness of documents and legal requirements. We do not promise a guaranteed result."),
    },
    { q: lv("Сколько времени занимает регистрация?","Ro'yxatga olish qancha vaqt oladi?","How long does registration take?"),
      a: lv("Сроки зависят от типа изделия, его класса риска, полноты предоставленных материалов и действующих процедур. Точные сроки определяются после анализа изделия.","Muddatlar buyum turiga, xavf sinfiga, taqdim etilgan materiallarning to'liqligiga va amaldagi jarayonlarga bog'liq. Aniq muddatlar buyum tahlilidan keyin belgilanadi.","Timelines depend on the device type, risk class, completeness of materials and current procedures. Exact timelines are determined after analyzing the device."),
    },
    { q: lv("Какие изделия подлежат регистрации?","Qaysi buyumlar ro'yxatga olinadi?","Which devices are subject to registration?"),
      a: lv("Перечень и порядок зависят от классификации медицинского изделия и требований законодательства Республики Узбекистан. На этапе консультации мы помогаем определить применимые требования.","Ro'yxat va tartib tibbiy buyum tasnifiga va O'zbekiston Respublikasi qonun talablariga bog'liq. Maslahat bosqichida amal qiladigan talablarni aniqlashga yordam beramiz.","The list and procedure depend on the classification of the medical device and the requirements of Uzbek law. During consultation we help determine the applicable requirements."),
    },
    { q: lv("С чего начать?","Nimadan boshlash kerak?","Where to start?"),
      a: lv("Оставьте заявку — мы проведём предварительную консультацию, проанализируем изделие и текущую документацию и предложим дальнейшие шаги.","Ariza qoldiring — dastlabki maslahat o'tkazamiz, buyum va hujjatlarni tahlil qilamiz va keyingi qadamlarni taklif qilamiz.","Leave a request — we will hold an initial consultation, analyze the device and documentation, and propose next steps."),
    },
  ];

  return (
    <div>
      {/* HERO */}
      <section className="page-hero">
        <div className="pw"></div>
        <div className="wrap">
          <div className="crumb"><a onClick={() => go("home")}>{t.nav_home}</a> / {t.nav_registration}</div>
          <h1 style={{ maxWidth: 780 }}>{lv("Регистрация медицинских изделий в Узбекистане","O'zbekistonda tibbiy buyumlarni ro'yxatga olish","Medical device registration in Uzbekistan")}</h1>
          <p style={{ maxWidth: 680 }}>{lv("Сопровождаем производителей, импортёров и поставщиков при подготовке документов и прохождении процедуры государственной регистрации медицинских изделий.","Ishlab chiqaruvchilar, importchilar va yetkazib beruvchilarni hujjat tayyorlash va davlat ro'yxatidan o'tkazish jarayonida qo'llab-quvvatlaymiz.","We support manufacturers, importers and suppliers in preparing documents and going through the state registration procedure for medical devices.")}</p>
          <div className="hero-badges reveal" style={{ marginTop: 24 }}>
            {[lv("Анализ документов","Hujjatlar tahlili","Document analysis"), lv("Регистрационное досье","Ro'yxat dosyesi","Registration dossier"), lv("Сопровождение подачи","Topshirishni qo'llab-quvvatlash","Submission support"), lv("Коммуникация по замечаниям","Izohlar bo'yicha aloqa","Handling of remarks")].map((b, i) => (
              <span className="hbadge" key={i}><CoIcon name="check" size={15} />{b}</span>
            ))}
          </div>
          <div className="hero-actions" style={{ marginTop: 26 }}>
            <a className="btn btn-pri btn-lg" href="#reg-form">{lv("Получить консультацию","Maslahat olish","Get a consultation")}</a>
            <a className="btn btn-ghost btn-lg" href="#reg-steps">{lv("Узнать этапы регистрации","Ro'yxat bosqichlarini bilish","See registration steps")}</a>
          </div>
        </div>
      </section>

      {/* WHO NEEDS */}
      <section className="section">
        <div className="wrap">
          <div className="sec-head reveal"><span className="eyebrow line">{lv("Аудитория","Auditoriya","Audience")}</span><h2 className="h-sec" style={{ marginTop: 14 }}>{lv("Кому нужна услуга","Xizmat kimga kerak","Who needs this service")}</h2></div>
          <div className="grid-3">
            {who.map((w, i) => (
              <div className="scard reveal" key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "20px 22px" }}>
                <CoIcon name="check" size={20} style={{ color: "var(--blue-600)", flexShrink: 0 }} />
                <span style={{ fontSize: 15, fontWeight: 600, color: "var(--slate-700)" }}>{w}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="section alt">
        <div className="wrap">
          <div className="sec-head reveal"><span className="eyebrow line">{lv("Сопровождение","Qo'llab-quvvatlash","Support")}</span><h2 className="h-sec" style={{ marginTop: 14 }}>{lv("Что входит в сопровождение","Qo'llab-quvvatlashga nima kiradi","What the support includes")}</h2></div>
          <div className="grid-2" style={{ gap: "14px 32px" }}>
            {included.map((x, i) => (
              <div className="reveal" key={i} style={{ display: "flex", gap: 13, alignItems: "flex-start", padding: "13px 0", borderBottom: "1px solid var(--line)" }}>
                <span className="proc-n" style={{ marginTop: 1 }}>{i + 1}</span>
                <span style={{ fontSize: 15, color: "var(--slate-700)", lineHeight: 1.5 }}>{x}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="section" id="reg-steps">
        <div className="wrap">
          <div className="sec-head reveal"><span className="eyebrow line">{lv("Процесс","Jarayon","Process")}</span><h2 className="h-sec" style={{ marginTop: 14 }}>{lv("Этапы работы","Ish bosqichlari","Stages of work")}</h2></div>
          <div className="reg-steps">
            {steps.map((s, i) => (
              <div className="reg-step reveal" key={i}>
                <div className="reg-step-n">{String(i + 1).padStart(2, "0")}</div>
                <div className="reg-step-t">{s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOCUMENTS + LAW */}
      <section className="section alt">
        <div className="wrap">
          <div className="grid-2" style={{ gap: 40, alignItems: "flex-start" }}>
            <div className="reveal">
              <h2 className="h-sec" style={{ fontSize: 28 }}>{lv("Какие документы могут потребоваться","Qanday hujjatlar kerak bo'lishi mumkin","What documents may be required")}</h2>
              <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 12 }}>
                {docs.map((d, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <CoIcon name="doc" size={18} style={{ color: "var(--blue-600)", flexShrink: 0 }} />
                    <span style={{ fontSize: 14.5, color: "var(--slate-700)" }}>{d}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 13, color: "var(--slate-500)", marginTop: 18, lineHeight: 1.6 }}>{lv("Точный перечень зависит от типа изделия и требований законодательства.","Aniq ro'yxat buyum turiga va qonun talablariga bog'liq.","The exact list depends on the device type and legal requirements.")}</p>
            </div>
            <div className="reveal" style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-lg)", padding: "30px 32px" }}>
              <span className="eyebrow">{lv("Правовой контекст","Huquqiy kontekst","Legal context")}</span>
              <h3 style={{ fontSize: 19, fontWeight: 800, margin: "14px 0 10px" }}>{lv("Законодательство и ПКМ №738","Qonunchilik va VMQ №738","Legislation and CMR No. 738")}</h3>
              <p style={{ fontSize: 14.5, color: "var(--slate-600)", lineHeight: 1.65 }}>{lv("Процедура регистрации медицинских изделий регулируется действующими нормативными актами Республики Узбекистан, включая Постановление Кабинета Министров №738 от 24.11.2025.","Tibbiy buyumlarni ro'yxatga olish jarayoni O'zbekiston Respublikasining amaldagi normativ hujjatlari, jumladan 24.11.2025-yildagi Vazirlar Mahkamasining №738-sonli qarori bilan tartibga solinadi.","The medical device registration procedure is governed by the current regulations of Uzbekistan, including Cabinet of Ministers Resolution No. 738 of 24.11.2025.")}</p>
              <a className="lic-dl" href="https://lex.uz/ru/docs/7861694" target="_blank" rel="noopener" style={{ marginTop: 16, display: "inline-flex" }}>{lv("Открыть на lex.uz","lex.uz da ochish","Open on lex.uz")} <CoIcon name="arrow" size={14} /></a>
            </div>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="section">
        <div className="wrap">
          <div className="sec-head reveal"><span className="eyebrow line">{lv("Доверие","Ishonch","Trust")}</span><h2 className="h-sec" style={{ marginTop: 14 }}>{lv("Почему ИНДУСТРИЯ ЗДОРОВЬЯ","Nega SOG’LIQ INDUSTRIYASI","Why HEALTH INDUSTRY")}</h2></div>
          <div className="grid-4">
            {why.map((w, i) => (
              <div className="scard reveal" key={i}>
                <div className="ic"><CoIcon name="shield" size={22} /></div>
                <p style={{ fontSize: 14.5, color: "var(--slate-700)", fontWeight: 600, lineHeight: 1.5 }}>{w}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section alt">
        <div className="wrap" style={{ maxWidth: 820 }}>
          <div className="sec-head center reveal"><h2 className="h-sec">{lv("Частые вопросы","Ko'p so'raladigan savollar","FAQ")}</h2></div>
          <div className="faq-list">
            {faqs.map((f, i) => (
              <div className={"faq-it reveal" + (faq === i ? " open" : "")} key={i}>
                <button className="faq-q" onClick={() => setFaq(faq === i ? -1 : i)}>
                  <span>{f.q}</span>
                  <CoIcon name="chev" size={18} style={{ transform: faq === i ? "rotate(90deg)" : "none", transition: "transform .2s", flexShrink: 0 }} />
                </button>
                {faq === i && <div className="faq-a">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="section" id="reg-form">
        <div className="wrap" style={{ maxWidth: 720 }}>
          <div className="sec-head center reveal"><h2 className="h-sec">{lv("Заявка на консультацию","Maslahatga ariza","Consultation request")}</h2><p className="sub-sec">{lv("Опишите изделие — мы свяжемся и предложим дальнейшие шаги.","Buyumni tavsiflang — biz bog'lanamiz va keyingi qadamlarni taklif qilamiz.","Describe the device — we will contact you and propose next steps.")}</p></div>
          <div className="cform reveal">
            {sent ? (
              <div style={{ padding: "40px 20px", textAlign: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--success-bg)", color: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}><CoIcon name="check" size={28} /></div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{lv("Заявка отправлена!","Ariza yuborildi!","Request sent!")}</div>
                <p style={{ fontSize: 14, color: "var(--slate-500)", marginTop: 6 }}>{lv("Менеджер по регистрации МИ свяжется с вами в рабочее время.","TI ro'yxati menejeri ish vaqtida bog'lanadi.","Our MD registration manager will contact you during business hours.")}</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
                <div className="grid-2" style={{ gap: 0 }}>
                  <div style={{ paddingRight: 8 }}><label>{lv("Имя","Ism","Name")} *</label><input required placeholder={lv("Ваше имя","Ismingiz","Your name")} /></div>
                  <div style={{ paddingLeft: 8 }}><label>{lv("Телефон","Telefon","Phone")} *</label><input required type="tel" placeholder="+998 __ ___ __ __" /></div>
                </div>
                <label>Email *</label>
                <input required type="email" placeholder="email@company.uz" />
                <label>{lv("Тип изделия","Buyum turi","Device type")} *</label>
                <input required placeholder={lv("Например: анализатор, монитор пациента…","Masalan: analizator, bemor monitori…","E.g.: analyzer, patient monitor…")} />
                <label>{lv("Комментарий","Izoh","Comment")}</label>
                <textarea rows="3" placeholder={lv("Производитель, страна, наличие документов…","Ishlab chiqaruvchi, mamlakat, hujjatlar…","Manufacturer, country, available documents…")}></textarea>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 9, fontWeight: 500, fontSize: 13, color: "var(--slate-500)", cursor: "pointer" }}>
                  <input type="checkbox" required style={{ width: "auto", margin: "3px 0 0" }} />
                  <span>{lv("Согласен с политикой конфиденциальности и обработкой персональных данных.","Maxfiylik siyosati va shaxsiy ma'lumotlarni qayta ishlashga roziman.","I agree with the privacy policy and processing of personal data.")}</span>
                </label>
                <button className="btn btn-pri" style={{ width: "100%", justifyContent: "center", marginTop: 4 }} type="submit">{lv("Получить консультацию","Maslahat olish","Get a consultation")}</button>
              </form>
            )}
          </div>
          {/* DISCLAIMER */}
          <div className="reg-disclaimer reveal">
            {lv("Информация на странице носит справочный характер. Перечень документов, сроки и порядок процедуры зависят от типа медицинского изделия, производителя, страны происхождения, регистрационного статуса и действующих требований законодательства Республики Узбекистан.","Sahifadagi ma'lumot ma'lumot uchun beriladi. Hujjatlar ro'yxati, muddatlar va tartib tibbiy buyum turiga, ishlab chiqaruvchiga, kelib chiqish mamlakatiga, ro'yxat holatiga va O'zbekiston Respublikasi qonun talablariga bog'liq.","The information on this page is for reference only. The list of documents, timelines and procedure depend on the type of medical device, manufacturer, country of origin, registration status and current requirements of the legislation of the Republic of Uzbekistan.")}
          </div>
        </div>
      </section>
    </div>
  );
}
window.RegistrationPage = RegistrationPage;
