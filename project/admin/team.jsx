/* ИНДУСТРИЯ ЗДОРОВЬЯ Admin — Team */
function AdminTeam() {
  const { useState } = React;
  const [items] = useCMS("team");
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const toast = useToast();
  const save = (item) => { if (!item.name) { toast("Введите имя","error"); return; } cmsOp(() => window.CMS.put("team", {...item,_updated:Date.now()}), toast, "Сохранено", () => setEditing(null)); };
  const del = (id) => cmsOp(() => window.CMS.remove("team", id), toast, "Удалено", () => setConfirm(null));
  // Новая карточка: _isNew:true. Без id — cms-remote вызовет POST /api/team (create),
  // а не PATCH /api/team/<localId> (который отвечал «Запись не найдена»).
  const newItem = () => setEditing({ _isNew: true, name: "", role: { ru: "" }, photo: "" });
  return (
    <div>
      <div className="adm-page-head"><div className="adm-page-title">Команда</div><button className="btn btn-primary" onClick={newItem}><AdminIcon name="plus" size={15}/> Добавить</button></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:16}}>
        {(items||[]).map(m => (
          <div key={m.id} className="adm-card" style={{padding:20,textAlign:"center"}}>
            <div style={{width:64,height:64,borderRadius:"50%",background:"var(--c-primary-light)",margin:"0 auto 12px",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>
              {m.photo ? <img src={m.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} /> : <AdminIcon name="users" size={28} color="var(--c-primary)" />}
            </div>
            <div style={{fontWeight:700,marginBottom:2}}>{m.name}</div>
            <div style={{fontSize:12,color:"var(--c-muted)",marginBottom:12}}>{m.role?.ru || m.role || ""}</div>
            <div className="adm-flex" style={{justifyContent:"center"}}>
              <button className="btn btn-ghost btn-icon" onClick={() => setEditing({...m,role:typeof m.role==="string"?{ru:m.role}:(m.role||{ru:""})})}><AdminIcon name="edit" size={14}/></button>
              <button className="btn btn-ghost btn-icon" onClick={() => setConfirm(m.id)}><AdminIcon name="trash" size={14}/></button>
            </div>
          </div>
        ))}
      </div>
      <Modal open={!!editing} onClose={()=>setEditing(null)} title="Сотрудник"
        footer={<><button className="btn btn-secondary" onClick={()=>setEditing(null)}>Отмена</button><button className="btn btn-primary" onClick={()=>save(editing)}>Сохранить</button></>}>
        {editing && <div className="adm-form">
          <Field label="Имя"><input className="adm-input" value={editing.name||""} onChange={e=>setEditing(i=>({...i,name:e.target.value}))}/></Field>
          <Field label="Должность (рус)"><input className="adm-input" value={editing.role?.ru||""} onChange={e=>setEditing(i=>({...i,role:{...(i.role||{}),ru:e.target.value}}))}/></Field>
          <ImageUpload label="Фото" value={editing.photo||""} onChange={v=>setEditing(i=>({...i,photo:v}))}/>
        </div>}
      </Modal>
      <Confirm open={!!confirm} danger message="Удалить сотрудника?" onConfirm={()=>del(confirm)} onCancel={()=>setConfirm(null)}/>
    </div>
  );
}
window.AdminTeam = AdminTeam;
