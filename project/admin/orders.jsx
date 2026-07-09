/* ИНДУСТРИЯ ЗДОРОВЬЯ Admin — Orders (redirect to submissions) */
function AdminOrders() {
  return (
    <div>
      <div className="adm-page-head"><div className="adm-page-title">Заказы и запросы КП</div></div>
      <div className="adm-card"><div className="adm-card-body" style={{textAlign:"center",padding:"48px 24px"}}>
        <AdminIcon name="briefcase" size={48} color="var(--c-faint)" /><br/><br/>
        <p style={{color:"var(--c-muted)",marginBottom:16}}>Запросы КП и заявки находятся в разделе «Заявки»</p>
        <a className="btn btn-primary" href="#" onClick={e=>{e.preventDefault();window._admGo?.("submissions")}}>Перейти к заявкам</a>
      </div></div>
    </div>
  );
}
window.AdminOrders = AdminOrders;
