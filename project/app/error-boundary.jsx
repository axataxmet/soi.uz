/* ИНДУСТРИЯ ЗДОРОВЬЯ — root error boundary.

   Both the site and the admin panel render one big <App>. Without a boundary any
   render-time throw unmounts the whole tree and leaves a blank page with nothing
   but a console trace — which is exactly how a single null CMS setting once took
   the entire site down. This keeps the failure visible and recoverable instead. */

const EB_TEXT = {
  ru: {
    title: "Что-то пошло не так",
    body: "Страница не смогла отобразиться. Попробуйте обновить — если ошибка повторяется, сообщите нам.",
    reload: "Обновить страницу",
    details: "Подробности ошибки",
  },
  uz: {
    title: "Nimadir noto'g'ri ketdi",
    body: "Sahifani ko'rsatib bo'lmadi. Yangilab ko'ring — xato takrorlansa, bizga xabar bering.",
    reload: "Sahifani yangilash",
    details: "Xato tafsilotlari",
  },
  en: {
    title: "Something went wrong",
    body: "This page failed to render. Try reloading — if the error persists, let us know.",
    reload: "Reload page",
    details: "Error details",
  },
};

function ebText() {
  let lang = "ru";
  try {
    lang = localStorage.getItem("si_lang") || "ru";
  } catch (e) {
    // private mode / storage disabled — fall back to ru
  }
  return EB_TEXT[lang] || EB_TEXT.ru;
}

// Details are for whoever is debugging, not for visitors: show them on localhost
// (and in the admin panel, which is staff-only anyway).
function ebShowDetails() {
  return /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) || location.pathname.indexOf("/admin") === 0;
}

class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Keep the component stack reachable — React only logs the raw error itself.
    console.error("[root-error-boundary]", error, info && info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    const t = ebText();
    const err = this.state.error;
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 20px" }}>
        <div style={{ maxWidth: 560, textAlign: "center", fontFamily: "Manrope, system-ui, sans-serif" }}>
          <div style={{ fontSize: 40, lineHeight: 1, marginBottom: 16 }}>⚠️</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 10px", color: "#0c2244" }}>{t.title}</h1>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: "#5b6b85", margin: "0 0 24px" }}>{t.body}</p>
          <button
            onClick={() => location.reload()}
            style={{ padding: "12px 24px", fontSize: 15, fontWeight: 700, color: "#fff", background: "#0E4AC6", border: 0, borderRadius: 10, cursor: "pointer" }}
          >
            {t.reload}
          </button>
          {ebShowDetails() && (
            <details style={{ marginTop: 28, textAlign: "left" }}>
              <summary style={{ cursor: "pointer", fontSize: 13, color: "#5b6b85" }}>{t.details}</summary>
              <pre style={{ marginTop: 10, padding: 12, overflow: "auto", maxHeight: 260, fontSize: 12, lineHeight: 1.5, background: "#f5f7fa", borderRadius: 8, color: "#33415c" }}>
                {String((err && err.stack) || err)}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }
}

window.RootErrorBoundary = RootErrorBoundary;
