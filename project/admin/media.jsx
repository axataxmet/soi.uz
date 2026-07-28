/* ИНДУСТРИЯ ЗДОРОВЬЯ Admin — Media library (server-backed: MinIO/S3 via /api/media) */
const MEDIA_ACCEPT = ".png,.jpg,.jpeg,.webp,.pdf,.mp4,.m4v,.mov,.webm";

function mediaKind(mime) {
  if (!mime) return "file";
  if (mime.indexOf("image/") === 0) return "image";
  if (mime.indexOf("video/") === 0) return "video";
  if (mime === "application/pdf") return "pdf";
  return "file";
}

function humanSize(bytes) {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024) return bytes + " Б";
  if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + " КБ";
  return (bytes / 1024 / 1024).toFixed(1) + " МБ";
}

function AdminMedia() {
  const { useState, useEffect, useRef, useCallback } = React;
  const toast = useToast();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const ref = useRef();

  const load = useCallback(() => {
    setLoading(true);
    return window.api.list("media")
      .then((res) => {
        setFiles(Array.isArray(res) ? res : (res && res.data) || []);
        setError("");
      })
      .catch((e) => setError(e && e.message ? e.message : "Не удалось загрузить медиатеку"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const addFiles = async (e) => {
    const picked = [...e.target.files];
    e.target.value = ""; // let the same file be re-picked after a failure
    if (!picked.length) return;
    setBusy(true);
    let ok = 0;
    const failed = [];
    for (const f of picked) {
      try {
        await window.api.uploadBlob(f, f.name);
        ok++;
      } catch (err) {
        failed.push(f.name + " — " + (err && err.message ? err.message : "ошибка загрузки"));
      }
    }
    setBusy(false);
    await load();
    if (ok) toast(`Загружено файлов: ${ok}`);
    failed.forEach((m) => toast(m, "error"));
  };

  const del = async (file) => {
    const prev = files;
    setFiles((list) => list.filter((f) => f.id !== file.id)); // optimistic
    try {
      await window.api.remove("media", file.id);
      toast("Файл удалён");
    } catch (err) {
      setFiles(prev);
      toast(err && err.message ? err.message : "Не удалось удалить файл", "error");
    }
  };

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url).then(
      () => toast("Ссылка скопирована"),
      () => toast("Не удалось скопировать ссылку", "error"),
    );
  };

  return (
    <div>
      <div className="adm-page-head">
        <div className="adm-page-title">Медиатека</div>
        <button className="btn btn-primary" disabled={busy} onClick={() => ref.current.click()}>
          <AdminIcon name="plus" size={15} /> {busy ? "Загрузка…" : "Загрузить"}
        </button>
      </div>

      <input ref={ref} type="file" accept={MEDIA_ACCEPT} multiple style={{ display: "none" }} onChange={addFiles} />

      {error && (
        <div className="adm-card" style={{ marginBottom: 12 }}>
          <div className="adm-card-body" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <AdminIcon name="warning" size={18} color="var(--c-danger)" />
            <span style={{ flex: 1 }}>{error}</span>
            <button className="btn btn-sm" onClick={load}><AdminIcon name="refresh" size={13} /> Повторить</button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ padding: "48px 0", textAlign: "center", color: "var(--c-muted)" }}>Загрузка…</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 12 }}>
          {files.map((f) => {
            const kind = mediaKind(f.mimeType);
            return (
              <div key={f.id} className="adm-card" style={{ overflow: "hidden", position: "relative" }}>
                <div
                  style={{ height: 100, cursor: "pointer", background: "var(--c-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}
                  title="Скопировать ссылку"
                  onClick={() => copyUrl(f.url)}
                >
                  {kind === "image"
                    ? <img src={f.url} alt={f.originalName} style={{ width: "100%", height: 100, objectFit: "cover", display: "block" }} />
                    : kind === "video"
                      ? <video src={f.url} style={{ width: "100%", height: 100, objectFit: "cover", display: "block" }} muted />
                      : <AdminIcon name="filetext" size={28} color="var(--c-faint)" />}
                </div>
                <div style={{ padding: "6px 8px", fontSize: 11, color: "var(--c-muted)" }}>
                  <div className="truncate" title={f.originalName}>{f.originalName}</div>
                  <div style={{ fontSize: 10, color: "var(--c-faint)" }}>{humanSize(f.size)}</div>
                </div>
                <button
                  style={{ position: "absolute", top: 4, right: 4 }}
                  className="btn btn-danger btn-icon btn-sm"
                  title="Удалить"
                  onClick={() => del(f)}
                >
                  <AdminIcon name="x" size={12} />
                </button>
              </div>
            );
          })}

          <div
            className="adm-card adm-upload-zone"
            style={{ height: 140, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 6 }}
            onClick={() => !busy && ref.current.click()}
          >
            <AdminIcon name="plus" size={24} color="var(--c-faint)" />
            <span style={{ fontSize: 12, color: "var(--c-faint)" }}>Добавить</span>
            <span style={{ fontSize: 10, color: "var(--c-faint)" }}>PNG, JPG, WebP, PDF, MP4</span>
          </div>
        </div>
      )}
    </div>
  );
}
window.AdminMedia = AdminMedia;
