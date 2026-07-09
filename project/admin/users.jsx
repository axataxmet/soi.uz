/* ИНДУСТРИЯ ЗДОРОВЬЯ Admin — Users & roles (REST-backed) */
const ADMIN_ROLES = [
  { v: "SUPERADMIN", l: "Суперадмин", c: "#0E4AC6" },
  { v: "ADMIN", l: "Администратор", c: "#1d7ed8" },
  { v: "EDITOR", l: "Редактор", c: "#15A06A" },
  { v: "CONTENT_MANAGER", l: "Контент-менеджер", c: "#6454D4" },
  { v: "SUBMISSIONS_MANAGER", l: "Менеджер заявок", c: "#E0492F" },
];
const roleInfo = (v) => ADMIN_ROLES.find(r => r.v === v) || { l: v, c: "#64748B" };

function AdminUsers() {
  const { useState, useEffect } = React;
  const toast = useToast();
  const [users] = useCMS("users");
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [me, setMe] = useState(null);

  useEffect(() => { if (window.api) window.api.me().then(setMe).catch(() => {}); }, []);
  const isSuper = !!me && me.role === "SUPERADMIN";

  const save = (u) => {
    if (!u.email || !u.name) { toast("Укажите имя и e-mail", "error"); return; }
    if (u._isNew && (!u.password || u.password.length < 6)) { toast("Пароль — минимум 6 символов", "error"); return; }
    cmsOp(() => window.CMS.put("users", { ...u }), toast, u._isNew ? "Пользователь создан" : "Сохранено", () => setEditing(null));
  };
  const toggleActive = (u) => cmsOp(() => window.CMS.put("users", { ...u, active: !u.active }), toast, u.active ? "Заблокирован" : "Разблокирован");
  const del = (id) => cmsOp(() => window.CMS.remove("users", id), toast, "Пользователь удалён", () => setConfirm(null));
  const newItem = () => setEditing({ _isNew: true, email: "", name: "", password: "", role: "EDITOR", active: true });

  const fmt = (ts) => ts ? new Date(ts).toLocaleDateString("ru", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  return (
    <div>
      <div className="adm-page-head">
        <div>
          <div className="adm-page-title">Пользователи и роли</div>
          <div className="adm-page-sub">{(users || []).length} пользователей</div>
        </div>
        {isSuper && <button className="btn btn-primary" onClick={newItem}><AdminIcon name="plus" size={15} /> Добавить</button>}
      </div>

      <div className="adm-card">
        <div className="adm-table-wrap"><table className="adm-table">
          <thead><tr><th>Пользователь</th><th>E-mail</th><th>Роль</th><th>Статус</th><th>Вход</th><th className="actions"></th></tr></thead>
          <tbody>{(users || []).map(u => {
            const ri = roleInfo(u.role);
            const self = me && me.userId === u.id;
            return (
              <tr key={u.id}>
                <td><div className="adm-cell-main">{u.name}{self && <span style={{ color: "var(--c-muted)", fontWeight: 500 }}> (вы)</span>}</div></td>
                <td>{u.email}</td>
                <td><span style={{ fontSize: 12, fontWeight: 700, color: ri.c, background: ri.c + "1A", border: "1px solid " + ri.c + "55", borderRadius: 7, padding: "3px 9px" }}>{ri.l}</span></td>
                <td>{u.active
                  ? <span style={{ fontSize: 12, fontWeight: 700, color: "#15A06A" }}>● Активен</span>
                  : <span style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8" }}>● Заблокирован</span>}</td>
                <td style={{ color: "var(--c-muted)", fontSize: 13 }}>{fmt(u.lastLoginAt)}</td>
                <td className="actions"><div className="adm-flex">
                  <button className="btn btn-ghost btn-icon" title="Изменить" onClick={() => setEditing({ ...u })}><AdminIcon name="edit" size={15} /></button>
                  {!self && <button className="btn btn-ghost btn-sm" onClick={() => toggleActive(u)}>{u.active ? "Блок" : "Разблок."}</button>}
                  {isSuper && !self && <button className="btn btn-ghost btn-icon" title="Удалить" onClick={() => setConfirm(u.id)}><AdminIcon name="trash" size={15} /></button>}
                </div></td>
              </tr>
            );
          })}</tbody>
        </table></div>
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?._isNew ? "Новый пользователь" : "Пользователь"}
        footer={<><button className="btn btn-secondary" onClick={() => setEditing(null)}>Отмена</button><button className="btn btn-primary" onClick={() => save(editing)}>Сохранить</button></>}>
        {editing && <div className="adm-form">
          <Field label="Имя"><input className="adm-input" value={editing.name || ""} onChange={e => setEditing(u => ({ ...u, name: e.target.value }))} /></Field>
          <Field label="E-mail">
            <input className="adm-input" type="email" value={editing.email || ""} disabled={!editing._isNew}
              onChange={e => setEditing(u => ({ ...u, email: e.target.value }))} />
          </Field>
          {editing._isNew && <Field label="Пароль" hint="минимум 6 символов">
            <input className="adm-input" type="text" value={editing.password || ""} onChange={e => setEditing(u => ({ ...u, password: e.target.value }))} />
          </Field>}
          <Field label="Роль" hint={isSuper ? "" : "Смена роли — только суперадмин"}>
            <select className="adm-select" value={editing.role || "EDITOR"} disabled={!isSuper}
              onChange={e => setEditing(u => ({ ...u, role: e.target.value }))}>
              {ADMIN_ROLES.map(r => <option key={r.v} value={r.v}>{r.l}</option>)}
            </select>
          </Field>
          {!editing._isNew && <Field label="Статус">
            <select className="adm-select" value={editing.active ? "1" : "0"} onChange={e => setEditing(u => ({ ...u, active: e.target.value === "1" }))}>
              <option value="1">Активен</option><option value="0">Заблокирован</option>
            </select>
          </Field>}
        </div>}
      </Modal>

      <Confirm open={!!confirm} danger message="Удалить пользователя безвозвратно?" onConfirm={() => del(confirm)} onCancel={() => setConfirm(null)} />
    </div>
  );
}
window.AdminUsers = AdminUsers;
