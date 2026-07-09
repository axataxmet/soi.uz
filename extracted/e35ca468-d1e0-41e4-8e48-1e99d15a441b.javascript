/* Sog'liq Industriyasi — Tenders / Госзакупки page */

const TENDER_STEPS = [
  { n:"01", icon:"search",    ru:"Подбираем оборудование", uz:"Uskunani tanlaymiz", en:"Equipment selection",
    d_ru:"Анализируем техническое задание, подбираем оборудование и готовим полный перечень позиций.", d_uz:"Texnik topshiriqni tahlil qilamiz va uskunalar ro'yxatini tayyorlaymiz.", d_en:"We analyse the specification, select equipment and prepare the full item list." },
  { n:"02", icon:"doc",       ru:"Документация", uz:"Hujjatlar", en:"Documentation",
    d_ru:"Формируем тендерную документацию: коммерческое предложение, сертификаты, регистрационные удостоверения.", d_uz:"Tender hujjatlarini tayyorlaymiz: KP, sertifikatlar, ro'yxatga olish guvohnomalar.", d_en:"We prepare tender documentation: quote, certificates, registration certificates." },
  { n:"03", icon:"award",     ru:"Победа в тендере", uz:"Tender g'alabasi", en:"Winning the tender",
    d_ru:"Сопровождаем заявку через портал zakupki.uz, отвечаем на запросы комиссии.", d_uz:"Arizani zakupki.uz portali orqali qo'llab-quvvatlaymiz.", d_en:"We support the application through zakupki.uz, respond to commission queries." },
  { n:"04", icon:"truck",     ru:"Поставка и монтаж", uz:"Yetkazish va montaj", en:"Delivery & installation",
    d_ru:"Выполняем поставку в указанный срок, монтаж, пусконаладку и обучение персонала.", d_uz:"Belgilangan muddatda yetkazamiz, montaj va ishga tushirishni amalga oshiramiz.", d_en:"We deliver on schedule, install, commission and train the staff." },
];

const TENDER_DOCS = [
  { ru:"Форма КП для тендера (DOCX)", uz:"Tender uchun KP shakli (DOCX)", en:"Tender quote form (DOCX)", icon:"doc" },
  { ru:"Образец технического задания", uz:"Texnik topshiriq namunasi", en:"Technical specification template", icon:"doc" },
  { ru:"Реестр сертификатов (PDF)", uz:"Sertifikatlar reestri (PDF)", en:"Certificate registry (PDF)", icon:"doc" },
  { ru:"Портал tender.soi.uz", uz:"tender.soi.uz portali", en:"tender.soi.uz portal", icon:"globe" },
];

const RECENT_TENDERS = [
  { id:"T-2026-018", date:"2026-05-28", org:"Ташкентская городская клиническая больница №1", cat_ru:"Диагностика и мониторинг", sum:480000000, status:"won" },
  { id:"T-2026-015", date:"2026-04-14", org:"Самаркандский государственный медицинский университет", cat_ru:"Хирургия и анестезиология", sum:860000000, status:"won" },
  { id:"T-2026-009", date:"2026-03-02", org:"МЗ РУз — Республиканский онкологический центр", cat_ru:"Комплексное оснащение отделения", sum:2140000000, status:"won" },
  { id:"T-2025-102", date:"2025-12-10", org:"Ферганская областная больница", cat_ru:"Стерилизация и дезинфекция", sum:320000000, status:"won" },
];

function TendersPage({ t, lang, go }) {
  const lv = (ru, uz, en) => lang==="uz"?uz:lang==="en"?en:ru;
  const [sent, setSent] = React.useState(false);

  return (
    <div style={{ paddingBottom: 64 }}>
      {/* hero */}
      <div className="tnd-hero">
        <div className="wrap">
          <div className="tnd-hero-inner">
            <div>
              <div className="hero-kicker" style={{color:"#bfe3f3",marginBottom:18,background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)"}}>
                <Icon name="award" size={15}/>{lv("Госзакупки медицинского оборудования","Tibbiy uskunalar davlat xaridlari","Medical equipment public procurement")}
              </div>
              <h1 style={{fontSize:46,fontWeight:800,lineHeight:1.06,letterSpacing:"-.02em",color:"#fff",margin:"0 0 18px"}} dangerouslySetInnerHTML={{__html: lv(
                "Поставки для государственных<br/><span style=\"color:#18b4e0\">медучреждений</span>",
                "Davlat tibbiyot muassasalariga<br/><span style=\"color:#18b4e0\">yetkazib berish</span>",
                "Supplies to public<br/><span style=\"color:#18b4e0\">healthcare institutions</span>"
              )}} />
              <p style={{fontSize:17,color:"#c2d4ea",maxWidth:520,lineHeight:1.6,marginBottom:28}}>
                {lv("Сопровождаем весь цикл тендерных закупок медицинского оборудования через портал tender.soi.uz. Более 60 государственных контрактов за 2025–2026 гг.",
                  "tender.soi.uz portali orqali tibbiy uskunalar tender xaridlarining to'liq tsiklini qo'llaymiz.",
                  "We support the full cycle of medical equipment tender procurement via tender.soi.uz. Over 60 public contracts in 2025–2026.")}
              </p>
              <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                <button className="btn btn-cyan btn-lg" onClick={()=>window.__openQuote&&window.__openQuote()}>
                  <Icon name="doc" size={18}/>{lv("Получить тендерное КП","Tender KP olish","Get tender quote")}
                </button>
                <a href="https://tender.soi.uz" target="_blank" rel="noopener" className="btn btn-light btn-lg">
                  <Icon name="globe" size={18}/>tender.soi.uz
                </a>
              </div>
            </div>
            <div className="tnd-hero-stats">
              {[
                {n:"60+",l:lv("контрактов","shartnoma","contracts")},
                {n:"4.2 млрд",l:lv("сум поставок","soʻm yetkazib berish","UZS delivered")},
                {n:"14",l:lv("регионов","hududlar","regions")},
                {n:"98%",l:lv("выполнено в срок","muddatida bajarilib","on-time delivery")},
              ].map((s,i)=>(
                <div key={i} className="tnd-stat">
                  <div className="ts-n">{s.n}</div>
                  <div className="ts-l">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="wrap" style={{marginTop:48}}>
        {/* how it works */}
        <div className="sec-head" style={{marginBottom:24}}><h2>{lv("Как мы работаем","Biz qanday ishlaymiz","How we work")}</h2></div>
        <div className="grid-4" style={{marginBottom:48}}>
          {TENDER_STEPS.map(s=>(
            <div key={s.n} style={{background:"#fff",border:"1px solid var(--line)",borderRadius:16,padding:24,position:"relative",overflow:"hidden"}}>
              <div style={{fontSize:56,fontWeight:900,letterSpacing:"-.04em",color:"var(--bg-2)",position:"absolute",top:8,right:16,lineHeight:1,userSelect:"none"}}>{s.n}</div>
              <div style={{width:44,height:44,borderRadius:12,background:"var(--bg-2)",color:"var(--blue-600)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16,position:"relative"}}>
                <Icon name={s.icon} size={22}/>
              </div>
              <h3 style={{fontSize:15,fontWeight:800,marginBottom:8}}>{lv(s.ru,s.uz,s.en)}</h3>
              <p style={{fontSize:13.5,color:"var(--slate-600)",lineHeight:1.55}}>{lv(s.d_ru,s.d_uz,s.d_en)}</p>
            </div>
          ))}
        </div>

        {/* recent tenders + docs side by side */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 360px",gap:28,marginBottom:48}}>
          <div>
            <div className="sec-head" style={{marginBottom:18}}><h2>{lv("Выигранные тендеры","G'alaba qozonilgan tenderlar","Successful tenders")}</h2></div>
            <div style={{background:"#fff",border:"1px solid var(--line)",borderRadius:16,overflow:"hidden"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:13.5}}>
                <thead>
                  <tr style={{background:"var(--bg)"}}>
                    <th style={{padding:"10px 14px",textAlign:"left",fontWeight:800,fontSize:11.5,color:"var(--slate-500)",letterSpacing:".04em",textTransform:"uppercase"}}>{lv("Организация","Tashkilot","Organization")}</th>
                    <th style={{padding:"10px 14px",textAlign:"right",fontWeight:800,fontSize:11.5,color:"var(--slate-500)",letterSpacing:".04em",textTransform:"uppercase"}}>{lv("Сумма","Summa","Amount")}</th>
                    <th style={{padding:"10px 14px",fontWeight:800,fontSize:11.5,color:"var(--slate-500)",letterSpacing:".04em",textTransform:"uppercase"}}>{lv("Дата","Sana","Date")}</th>
                  </tr>
                </thead>
                <tbody>
                  {RECENT_TENDERS.map(r=>(
                    <tr key={r.id} style={{borderTop:"1px solid var(--line)"}}>
                      <td style={{padding:"13px 14px"}}>
                        <div style={{fontWeight:700}}>{r.org}</div>
                        <div style={{fontSize:12,color:"var(--slate-400)",marginTop:2}}>{r.cat_ru}</div>
                      </td>
                      <td style={{padding:"13px 14px",textAlign:"right",fontWeight:800,fontFamily:"var(--mono)",fontSize:13}}>{fmtPrice(r.sum)}</td>
                      <td style={{padding:"13px 14px",fontFamily:"var(--mono)",fontSize:12,color:"var(--slate-400)"}}>{r.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <div className="sec-head" style={{marginBottom:18}}><h2>{lv("Документы","Hujjatlar","Documents")}</h2></div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {TENDER_DOCS.map((d,i)=>(
                <div key={i} style={{background:"#fff",border:"1px solid var(--line)",borderRadius:12,padding:"14px 16px",display:"flex",alignItems:"center",gap:13,cursor:"pointer"}} className="hover-card">
                  <span style={{color:"var(--blue-600)"}}><Icon name={d.icon} size={22}/></span>
                  <span style={{fontWeight:600,fontSize:14,flex:1}}>{lv(d.ru,d.uz,d.en)}</span>
                  <Icon name="chevronRight" size={16} style={{color:"var(--slate-400)"}}/>
                </div>
              ))}
            </div>

            <div style={{background:"linear-gradient(135deg,#eaf3fc,#dbeafb)",border:"1px solid var(--line)",borderRadius:14,padding:20,marginTop:18}}>
              <h4 style={{fontWeight:800,marginBottom:8}}>{lv("Нужна помощь с тендером?","Tender bo'yicha yordam kerakmi?","Need tender assistance?")}</h4>
              <p style={{fontSize:13.5,color:"var(--slate-600)",marginBottom:14,lineHeight:1.5}}>
                {lv("Наш тендерный отдел ответит в течение 2 часов.","Tender bo'limiz 2 soat ichida javob beradi.","Our tender team will respond within 2 hours.")}
              </p>
              <a href="tel:+998772250001" style={{display:"flex",alignItems:"center",gap:8,fontWeight:800,fontSize:16,color:"var(--blue-700)"}}>
                <Icon name="phone" size={18} style={{color:"var(--blue-600)"}}/> +998 (77) 225-00-01
              </a>
            </div>
          </div>
        </div>

        {/* CTA form */}
        <div className="ctaband">
          <div className="cb-grid"/>
          <div className="cb-l" style={{position:"relative"}}>
            <h2>{lv("Участвуем в тендере вместе","Birgalikda tenderde qatnashamiz","Let's win the tender together")}</h2>
            <p>{lv("Оставьте заявку — тендерный менеджер свяжется за 2 часа и разберёт ваше ТЗ.","Ariza qoldiring — tender menejer 2 soat ichida bog'lanadi.","Submit a request — tender manager will contact you within 2 hours.")}</p>
          </div>
          <div className="cb-r" style={{position:"relative"}}>
            {!sent
              ? <button className="btn btn-cyan btn-lg" onClick={()=>{ window.__openQuote&&window.__openQuote(); }}>
                  {lv("Подать заявку","Ariza yuborish","Submit request")}<Icon name="arrowRight" size={18}/>
                </button>
              : <div style={{color:"#fff",fontWeight:700}}><Icon name="check" size={22} style={{verticalAlign:"middle",marginRight:8}}/>{lv("Заявка принята!","Ariza qabul qilindi!","Request received!")}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TendersPage });
