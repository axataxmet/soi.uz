/* ИНДУСТРИЯ ЗДОРОВЬЯ Admin — Products list (A3). Loads from /products/manage/all via window.CatalogAPI. */
function AdminProducts({ go }) {
  const { useState, useEffect, useMemo } = React;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [confirm, setConfirm] = useState(null);
  const toast = useToast();

  const load = () => {
    setLoading(true);
    window.CatalogAPI.listProducts({ limit: 100 })
      .then(res => { setItems((res && res.data) || res || []); setLoading(false); })
      .catch(e => { toast(e.message || "Ошибка загрузки", "error"); setLoading(false); });
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    if (!q) return items;
    const ql = q.toLowerCase();
    return items.filter(p =>
      ((p.name && p.name.ru) || "").toLowerCase().includes(ql) ||
      (p.sku || "").toLowerCase().includes(ql) ||
      ((p.manufacturer && p.manufacturer.name) || "").toLowerCase().includes(ql));
  }, [items, q]);

  const del = (id) => {
    window.CatalogAPI.deleteProduct(id)
      .then(() => { toast("Товар удалён"); setConfirm(null); load(); })
      .catch(e => { toast(e.message || "Ошибка удаления", "error"); setConfirm(null); });
  };

  const priceOf = (p) => {
    const pr = (p.prices && p.prices[0]) || null;
    if (!pr) return "—";
    if (pr.priceOnRequest) return "По запросу";
    return pr.price != null ? Number(pr.price).toLocaleString("ru") + " " + (pr.currency || "UZS") : "—";
  };
  const statusMap = {
    ACTIVE: { txt: "Опубликован", cls: "adm-badge-ok" },
    DRAFT: { txt: "Черновик", cls: "" },
    ARCHIVED: { txt: "Архив", cls: "" },
  };

  return (
    <div>
      <div className="adm-page-head">
        <div>
          <div className="adm-page-title">Каталог товаров</div>
          <div className="adm-page-sub">{filtered.length} позиций</div>
        </div>
        <button className="btn btn-primary" onClick={() => go("product-new")}><AdminIcon name="plus" size={15} /> Добавить товар</button>
      </div>

      <div className="adm-card">
        <div className="adm-card-head"><SearchInput value={q} onChange={setQ} placeholder="Поиск по названию, SKU, производителю…" /></div>

        {loading
          ? <div style={{ padding: 40, textAlign: "center" }} className="adm-text-muted">Загрузка…</div>
          : !filtered.length
            ? <EmptyState title="Товаров нет" sub="Добавьте товар через новую форму" action={<button className="btn btn-primary" onClick={() => go("product-new")}><AdminIcon name="plus" size={14} /> Добавить</button>} />
            : <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead><tr><th>Товар</th><th>SKU</th><th>Производитель</th><th>Группы</th><th>Цена</th><th>Статус</th><th className="actions"></th></tr></thead>
                  <tbody>
                    {filtered.map(p => {
                      const name = (p.name && p.name.ru) || p.sku || p.id;
                      const main = (p.media || [])[0];
                      const st = statusMap[p.status] || statusMap.DRAFT;
                      return (
                        <tr key={p.id}>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div className="adm-thumb-placeholder">{main ? <img src={main.url} alt="" style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6 }} /> : <AdminIcon name="image" size={16} />}</div>
                              <div className="adm-cell-main truncate" style={{ maxWidth: 260 }}>{name}</div>
                            </div>
                          </td>
                          <td><code style={{ fontSize: 12 }}>{p.sku || "—"}</code></td>
                          <td>{(p.manufacturer && p.manufacturer.name) || "—"}</td>
                          <td className="adm-cell-sub">{(p.groups || []).map(g => g.group && g.group.name && g.group.name.ru).filter(Boolean).join(", ") || "—"}</td>
                          <td>{priceOf(p)}</td>
                          <td><span className={"adm-badge " + st.cls}>{st.txt}</span></td>
                          <td className="actions">
                            <div className="adm-flex">
                              <button className="btn btn-ghost btn-icon" title="Редактировать" onClick={() => go("product-edit", { id: p.id })}><AdminIcon name="edit" size={15} /></button>
                              <button className="btn btn-ghost btn-icon" title="Удалить" onClick={() => setConfirm(p.id)}><AdminIcon name="trash" size={15} /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
        }
      </div>

      <Confirm open={!!confirm} danger message="Удалить товар?" onConfirm={() => del(confirm)} onCancel={() => setConfirm(null)} />
    </div>
  );
}
window.AdminProducts = AdminProducts;
