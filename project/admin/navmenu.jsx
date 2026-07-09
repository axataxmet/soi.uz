/* ИНДУСТРИЯ ЗДОРОВЬЯ Admin — Nav menu editor */
function AdminNavmenu() {
  const toast = useToast();
  const [menu, setMenu] = useSettings("nav_menu_custom", null);
  return (
    <div>
      <div className="adm-page-head"><div className="adm-page-title">Навигационное меню</div></div>
      <div className="adm-card"><div className="adm-card-body">
        <p style={{color:"var(--c-muted)",marginBottom:16,fontSize:13}}>Меню сайта генерируется автоматически из структуры каталога и разделов. Для кастомизации используйте настройки страниц.</p>
        <div style={{background:"var(--c-bg)",padding:16,borderRadius:8,fontSize:13}}>
          <div style={{fontWeight:700,marginBottom:8}}>Текущие пункты меню</div>
          {["О компании","Направления","Регистрация МИ","Тендеры","Документы","Кейсы","Новости","Контакты"].map(m => (
            <div key={m} style={{padding:"6px 0",borderBottom:"1px solid var(--c-border-light)",display:"flex",alignItems:"center",gap:8}}>
              <AdminIcon name="chevright" size={14} color="var(--c-faint)"/>{m}
            </div>
          ))}
        </div>
      </div></div>
    </div>
  );
}
window.AdminNavmenu = AdminNavmenu;
