/* ИНДУСТРИЯ ЗДОРОВЬЯ Admin — Form Submissions / Leads */
const SUB_STATUSES = [
  { v: "new", l: "Новая", c: "#1d7ed8" },
  { v: "in_progress", l: "В работе", c: "#E0492F" },
  { v: "done", l: "Завершена", c: "#15A06A" },
  { v: "rejected", l: "Отклонена", c: "#94a3b8" },
];
function SubBadge({ status }) {
  const o = SUB_STATUSES.find(x => x.v === status) || SUB_STATUSES[0];
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: o.c, background: o.c + "1A", border: "1px solid " + o.c + "55", borderRadius: 7, padding: "3px 9px" }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: o.c }} />{o.l}</span>;
}
/* Человекочитаемые подписи для полей meta трёх форм («Регистрация МИ»,
   «Обучение персонала», «Сервисная заявка») — раньше meta вообще не
   рендерилась в карточке заявки (данные писались в БД, уходили в
   Telegram/amoCRM обрывочно, а в самой админке менеджер видел только имя,
   телефон, email и комментарий — детали по оборудованию/изделию исчезали).
   Ключ не найден в словаре — просто разбиваем camelCase на слова, чтобы
   любая будущая форма тоже не терялась молча. */
const META_LABELS = {
  org: "Организация", position: "Должность", country: "Страна", role: "Роль",
  city: "Город", orgType: "Тип учреждения",
  device: "Изделие / оборудование", name: "Наименование", maker: "Производитель",
  makerCountry: "Страна производителя", purpose: "Назначение", category: "Категория",
  riskClass: "Класс риска", models: "Модели", sterile: "Стерильное", invasive: "Инвазивное",
  measuring: "С функцией измерения", software: "Со встроенным ПО", ai: "С ИИ/автоинтерпретацией",
  consumables: "Расходные материалы", model: "Модель", qty: "Количество",
  registration: "Регистрация", inCountry: "Зарегистрировано в РУз", inOthers: "Зарегистрировано в др. странах",
  ceFda: "Есть CE/FDA", uzBefore: "Ранее регистрировалось в РУз", needed: "Нужная процедура",
  documents: "Приложенные документы", urgency: "Срочно", devStatus: "Статус поставки",
  format: "Формат обучения", participants: "Число участников", date: "Желаемая дата",
  equipment: "Оборудование", type: "Тип", serial: "Серийный номер",
  productName: "Товар", services: "Услуги", inn: "ИНН",
};
const metaLabel = (k) => META_LABELS[k] || k.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (c) => c.toUpperCase());
const YN = { yes: "Да", no: "Нет", unknown: "Не знаю", true: "Да", false: "Нет" };
function metaRows(meta, prefix = "") {
  if (!meta || typeof meta !== "object") return [];
  let rows = [];
  for (const [k, v] of Object.entries(meta)) {
    if (v === undefined || v === null || v === "") continue;
    if (k === "attachments") { rows.push([prefix + metaLabel(k), { attachments: v }]); continue; }
    if (Array.isArray(v)) { if (v.length) rows.push([prefix + metaLabel(k), v.join(", ")]); continue; }
    if (typeof v === "object") { rows = rows.concat(metaRows(v, prefix + metaLabel(k) + " — ")); continue; }
    rows.push([prefix + metaLabel(k), YN[v] || String(v)]);
  }
  return rows;
}

function AdminSubmissions() {
  const { useState, useMemo } = React;
  const [items] = useCMS("submissions");
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [viewing, setViewing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [page, setPage] = useState(1);
  const toast = useToast();
  const PER = 20;

  const filtered = useMemo(() => {
    let list = [...(items || [])].reverse();
    if (filter !== "all") list = list.filter(s => s.status === filter);
    if (q) { const ql = q.toLowerCase(); list = list.filter(s => (s.name || "").toLowerCase().includes(ql) || (s.phone || "").includes(q) || (s.org || "").toLowerCase().includes(ql)); }
    return list;
  }, [items, q, filter]);

  const paged = filtered.slice((page - 1) * PER, page * PER);

  const setStatus = (id, status) => {
    const item = window.CMS.get("submissions", id);
    if (item) cmsOp(() => window.CMS.put("submissions", { ...item, status, _updated: Date.now() }), toast, "Статус обновлён");
  };
  const del = (id) => cmsOp(() => window.CMS.remove("submissions", id), toast, "Заявка удалена",
    () => { setConfirm(null); if (viewing?.id === id) setViewing(null); });

  const newCount = (items || []).filter(s => !s.status || s.status === "new").length;

  const fmtDate = (ts) => ts ? new Date(ts).toLocaleString("ru", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "—";

  return (
    <div>
      <div className="adm-page-head">
        <div>
          <div className="adm-page-title">Заявки <span style={{ fontSize: 15, color: "var(--c-danger)", fontWeight: 700 }}>{newCount > 0 ? `+${newCount} новых` : ""}</span></div>
          <div className="adm-page-sub">{filtered.length} заявок</div>
        </div>
      </div>

      <div className="adm-card">
        <div className="adm-card-head">
          <SearchInput value={q} onChange={v => { setQ(v); setPage(1); }} placeholder="Поиск по имени, телефону…" />
          <div className="adm-toolbar-right">
            <select className="adm-select" style={{ width: "auto" }} value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}>
              <option value="all">Все</option>
              <option value="new">Новые</option>
              <option value="in_progress">В работе</option>
              <option value="done">Завершённые</option>
              <option value="rejected">Отклонённые</option>
            </select>
          </div>
        </div>

        {!paged.length
          ? <EmptyState title="Заявок нет" sub="Заявки появятся после заполнения форм на сайте" />
          : <>
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead><tr><th>Контакт</th><th>Организация</th><th>Тип</th><th>Дата</th><th>Статус</th><th className="actions"></th></tr></thead>
                <tbody>
                  {paged.map(s => (
                    <tr key={s.id} style={{ cursor: "pointer" }} onClick={() => setViewing(s)}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--c-primary-light)", color: "var(--c-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flexShrink: 0 }}>
                            {(s.name || "?")[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="adm-cell-main">{s.name || "—"}</div>
                            <div className="adm-cell-sub">{s.phone || s.email || ""}</div>
                          </div>
                        </div>
                      </td>
                      <td className="truncate" style={{ maxWidth: 160 }}>{s.org || "—"}</td>
                      <td><span className="badge badge-blue">{s.type || s._type || "КП"}</span></td>
                      <td>{fmtDate(s._created || s.date)}</td>
                      <td><SubBadge status={s.status} /></td>
                      <td className="actions" onClick={e => e.stopPropagation()}>
                        <div className="adm-flex">
                          <select className="adm-select" style={{ width: "auto", padding: "4px 8px", fontSize: 13 }} value={s.status || "new"} onChange={e => setStatus(s.id, e.target.value)}>
                            {SUB_STATUSES.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                          </select>
                          <button className="btn btn-ghost btn-icon" onClick={() => setConfirm(s.id)}><AdminIcon name="trash" size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={page} total={filtered.length} perPage={PER} onChange={setPage} />
          </>
        }
      </div>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Детали заявки" size="md"
        footer={<>
          <button className="btn btn-secondary" onClick={() => { setStatus(viewing.id, "done"); setViewing(null); }}>Завершить заявку</button>
          <button className="btn btn-primary" onClick={() => setViewing(null)}>OK</button>
        </>}>
        {viewing && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              ["Имя", viewing.name],
              ["Телефон", viewing.phone],
              ["Email", viewing.email],
              ["Организация", viewing.org],
              ["Товар / услуга", viewing.product || viewing.services?.join(", ")],
              ["Комментарий", viewing.comment || viewing.message],
              ["Дата", fmtDate(viewing._created || viewing.date)],
              ["Тип заявки", viewing.type || viewing._type || "КП"],
            ].filter(r => r[1]).map(([k, v]) => (
              <div key={k} style={{ display: "flex", gap: 12 }}>
                <div style={{ width: 150, flexShrink: 0, fontWeight: 600, fontSize: 13, color: "var(--c-muted)" }}>{k}</div>
                <div style={{ fontSize: 14, flex: 1 }}>{v}</div>
              </div>
            ))}
            {/* Всё остальное, что форма записала в meta (устройство, регистрация,
                оборудование, вложения и т.д.) — раньше терялось молча, хотя
                менеджеру для обработки заявки нужны именно эти детали. */}
            {metaRows(viewing.meta).map(([k, v], i) => (
              <div key={"m" + i} style={{ display: "flex", gap: 12 }}>
                <div style={{ width: 150, flexShrink: 0, fontWeight: 600, fontSize: 13, color: "var(--c-muted)" }}>{k}</div>
                <div style={{ fontSize: 14, flex: 1 }}>
                  {v && v.attachments
                    ? <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {v.attachments.map((a, j) => (
                          <a key={j} href={a.url} target="_blank" rel="noopener" style={{ color: "var(--c-primary)" }}>
                            {a.name || a.url}{a.size ? ` (${Math.round(a.size / 1024)} КБ)` : ""}
                          </a>
                        ))}
                      </div>
                    : v}
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <Confirm open={!!confirm} danger message="Удалить заявку?" onConfirm={() => del(confirm)} onCancel={() => setConfirm(null)} />
    </div>
  );
}
window.AdminSubmissions = AdminSubmissions;
