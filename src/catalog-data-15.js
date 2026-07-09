/* Sog'liq Industriyasi — Прайс-лист (упрощённый) */
const { useState: usePL } = React;

function PricePage({ t, lang, go }) {
  const lv = (ru, uz, en) => lang==="uz"?uz:lang==="en"?en:ru;
  const prods  = window.DATA?.PRODUCTS  || [];
  const brands = window.DATA?.BRANDS    || [];
  const cats   = window.DATA?.CATEGORIES|| [];
  const [dlMsg, setDlMsg] = usePL("");

  const bname = id => (brands.find(b=>b.id===id)||{name:id}).name;
  const cname = id => { const c=cats.find(x=>x.id===id); return c?lv(c.ru,c.uz,c.en):id; };
  const pname = p => lv(p.ru, p.uz, p.en||p.ru);
  const STOCK = { in:lv("В наличии","Mavjud","In stock"), order:lv("Под заказ","Buyurtma","On order"), preorder:lv("Ожидается","Kutilmoqda","Pre-order") };

  const downloadCSV = () => {
    const header = ["№","SKU","Наименование","Бренд","Категория","Наличие","Цена (сум)"].join(";");
    const rows = prods.map((p,i) => [
      i+1, p.sku, pname(p).replace(/;/g," "), bname(p.brand), cname(p.cat), STOCK[p.stock]||p.stock, p.price
    ].join(";"));
    const csv = "\uFEFF" + [header,...rows].join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = "Sog'liq Industriyasi_Прайс-лист_" + new Date().toISOString().slice(0,10) + ".csv";
    a.click();
    setDlMsg(lv("Файл загружен","Fayl yuklandi","Downloaded"));
    setTimeout(()=>setDlMsg(""),3000);
  };

  const downloadPDF = () => {
    const rows = prods.map((p,i)=>`<tr><td>${i+1}</td><td class="mono">${p.sku}</td><td>${pname(p)}</td><td>${bname(p.brand)}</td><td>${cname(p.cat)}</td><td>${STOCK[p.stock]||p.stock}</td><td class="mono r">${p.price.toLocaleString("ru-RU")} сум</td></tr>`).join("");
    const html=`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Sog'liq Industriyasi — Прайс-лист</title><style>body{font-family:Arial,sans-serif;font-size:11px;margin:20px}h1{font-size:18px;margin-bottom:4px}p{color:#666;font-size:11px;margin-bottom:12px}table{width:100%;border-collapse:collapse}th{background:#0c2244;color:#fff;padding:6px 8px;text-align:left;font-size:10px}td{padding:5px 8px;border-bottom:1px solid #eee}.mono{font-family:monospace}.r{text-align:right}tr:nth-child(even) td{background:#f8f9fc}@media print{@page{size:A4 landscape;margin:10mm}}</style></head><body><h1>Sog'liq Industriyasi — Прайс-лист</h1><p>Дата: ${new Date().toLocaleDateString("ru-RU")} · Позиций: ${prods.length}</p><table><thead><tr><th>№</th><th>Арт.</th><th>Наименование</th><th>Бренд</th><th>Категория</th><th>Наличие</th><th>Цена</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
    const w = window.open("","_blank","width=900,height=700");
    if(w){w.document.write(html);w.document.close();setTimeout(()=>w.print(),400);}
    setDlMsg(lv("Открыт для печати","Chop etish uchun ochildi","Opened for print"));
    setTimeout(()=>setDlMsg(""),3000);
  };

  return (
    <div className="wrap" style={{padding:"40px 0 80px",maxWidth:600,margin:"0 auto",textAlign:"center"}}>
      <div className="crumb" style={{textAlign:"left",marginBottom:32}}>
        <a onClick={()=>go("home")}>{t.breadcrumb_home}</a>
        <Icon name="chevronRight" size={14}/>
        <span className="cur">{lv("Прайс-лист","Narxlar ro'yxati","Price list")}</span>
      </div>

      <div style={{width:72,height:72,borderRadius:20,background:"linear-gradient(135deg,#1a5fd0,#18b4e0)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px",boxShadow:"0 8px 24px rgba(26,95,208,.25)"}}>
        <Icon name="doc" size={34} style={{color:"#fff"}} sw={1.5}/>
      </div>

      <h1 style={{fontSize:32,fontWeight:800,letterSpacing:"-.02em",marginBottom:8}}>
        {lv("Прайс-лист Sog'liq Industriyasi","Sog'liq Industriyasi narxlar ro'yxati","Sog'liq Industriyasi Price List")}
      </h1>
      <p style={{fontSize:15,color:"var(--slate-500)",marginBottom:10}}>
        {lv("Актуально на","Yangilangan","Updated")} {new Date().toLocaleDateString(lang==="en"?"en-GB":"ru-RU")}
      </p>
      <p style={{fontSize:14,color:"var(--slate-400)",marginBottom:36}}>
        {lv("Цены в сумах, включая НДС 12%","Narxlar so'mda, QQS 12% bilan","Prices in UZS, incl. 12% VAT")}
      </p>

      <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
        <button className="pl-dl-btn excel" onClick={downloadCSV} style={{height:52,fontSize:15,padding:"0 28px"}}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13l2 4 2-4 2 4"/></svg>
          Excel
        </button>
        <button className="pl-dl-btn pdf" onClick={downloadPDF} style={{height:52,fontSize:15,padding:"0 28px"}}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
          PDF
        </button>
      </div>

      {dlMsg && (
        <div style={{marginTop:20,display:"inline-flex",alignItems:"center",gap:8,background:"#e7f6ef",color:"var(--success)",borderRadius:10,padding:"10px 18px",fontWeight:700,fontSize:14,animation:"fade .2s"}}>
          <Icon name="check" size={16} sw={2.5}/>{dlMsg}
        </div>
      )}

      {/* Каталоги продукции */}
      <div style={{marginTop:52,textAlign:"left"}}>
        <h2 style={{fontSize:20,fontWeight:800,letterSpacing:"-.01em",marginBottom:16}}>
          {lv("Каталоги продукции","Mahsulot kataloglari","Product catalogs")}
        </h2>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {[
            { title_ru:"Измерительные приборы 2026", title_uz:"O'lchov asboblari 2026", title_en:"Measuring instruments 2026", size:"4.2 MB", pages:48, icon:"pulse", cat:"diagnostics" },
            { title_ru:"Хирургия и анестезиология 2026", title_uz:"Jarrohlik va anesteziologiya 2026", title_en:"Surgery & anaesthesiology 2026", size:"6.1 MB", pages:64, icon:"scalpel", cat:"surgery" },
            { title_ru:"Стерилизационное оборудование 2026", title_uz:"Sterilizatsiya uskunalari 2026", title_en:"Sterilization equipment 2026", size:"3.8 MB", pages:32, icon:"shield-cross", cat:"sterilization" },
            { title_ru:"Медицинская мебель 2026", title_uz:"Tibbiy mebel 2026", title_en:"Medical furniture 2026", size:"5.0 MB", pages:40, icon:"bed", cat:"furniture" },
          ].map((c,i) => (
            <div key={i}
              style={{display:"flex",alignItems:"center",gap:16,background:"#fff",border:"1px solid var(--line)",borderRadius:14,padding:"16px 20px",cursor:"pointer",transition:".13s"}}
              onClick={()=>{
                const catProds = prods.filter(p=>p.cat===c.cat);
                const rows = catProds.map((p,j)=>`<tr><td>${j+1}</td><td>${pname(p)}</td><td>${bname(p.brand)}</td><td>${STOCK[p.stock]||p.stock}</td><td class="r mono">${p.price.toLocaleString("ru-RU")} сум</td></tr>`).join("");
                const html=`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${lv(c.title_ru,c.title_uz,c.title_en)} — Sog'liq Industriyasi</title><style>body{font-family:Arial,sans-serif;font-size:11px;margin:20px}h1{font-size:20px;font-weight:900;color:#0c2244;margin-bottom:4px}.sub{color:#666;font-size:11px;margin-bottom:16px}table{width:100%;border-collapse:collapse}th{background:#0c2244;color:#fff;padding:7px 10px;text-align:left;font-size:10px;letter-spacing:.04em}td{padding:6px 10px;border-bottom:1px solid #eee}.mono{font-family:monospace}.r{text-align:right}tr:nth-child(even) td{background:#f8f9fc}.foot{margin-top:20px;font-size:10px;color:#999;text-align:center}@media print{@page{size:A4;margin:12mm}}</style></head><body><h1>${lv(c.title_ru,c.title_uz,c.title_en)}</h1><div class="sub">Sog'liq Industriyasi · ${new Date().toLocaleDateString("ru-RU")} · ${catProds.length} наименований</div><table><thead><tr><th>№</th><th>Наименование</th><th>Производитель</th><th>Наличие</th><th>Цена</th></tr></thead><tbody>${rows}</tbody></table><div class="foot">Sog'liq Industriyasi · +998 (77) 225-00-01 · info@sogliqindustriyasi.uz · uzmedex.uz</div></body></html>`;
                const w=window.open("","_blank","width=800,height=700");
                if(w){w.document.write(html);w.document.close();setTimeout(()=>w.print(),400);}
              }}
            >
              <div style={{width:48,height:48,borderRadius:13,background:"var(--bg-2)",color:"var(--blue-600)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <Icon name={c.icon} size={24}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:800,fontSize:15}}>{lv(c.title_ru,c.title_uz,c.title_en)}</div>
                <div style={{fontSize:12.5,color:"var(--slate-400)",marginTop:3}}>PDF · {c.pages} {lv("стр.","bet","pages")} · {c.size}</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:7,color:"var(--blue-600)",fontWeight:700,fontSize:13.5,flexShrink:0}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                {lv("Скачать","Yuklash","Download")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PricePage });
