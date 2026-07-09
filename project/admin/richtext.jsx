/* ИНДУСТРИЯ ЗДОРОВЬЯ Admin — simple rich text editor */
function RichTextEditor({ value, onChange, placeholder = "Введите текст…", minHeight = 140 }) {
  const { useRef, useEffect, useCallback } = React;
  const ref = useRef();
  const lastHtml = useRef(value || "");

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== (value || "")) {
      ref.current.innerHTML = value || "";
      lastHtml.current = value || "";
    }
  }, []);

  const exec = useCallback((cmd, val) => {
    ref.current.focus();
    document.execCommand(cmd, false, val || null);
    const html = ref.current.innerHTML;
    lastHtml.current = html;
    onChange(html);
  }, [onChange]);

  const onInput = useCallback(() => {
    const html = ref.current.innerHTML;
    if (html !== lastHtml.current) {
      lastHtml.current = html;
      onChange(html);
    }
  }, [onChange]);

  // Paste as plain text — pasting from Word/Google Docs otherwise drags in
  // MsoNormal classes, inline fonts and other markup that leaks into the public page.
  const onPaste = useCallback((e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData("text/plain");
    document.execCommand("insertText", false, text);
  }, []);

  const tools = [
    { icon: "B",  cmd: "bold",          style: { fontWeight: 800 } },
    { icon: "I",  cmd: "italic",        style: { fontStyle: "italic" } },
    { icon: "U",  cmd: "underline",     style: { textDecoration: "underline" } },
    { sep: true },
    { icon: "H2", cmd: "formatBlock",   arg: "h2", style: { fontWeight: 700 } },
    { icon: "H3", cmd: "formatBlock",   arg: "h3", style: { fontWeight: 700 } },
    { icon: "P",  cmd: "formatBlock",   arg: "p" },
    { sep: true },
    { icon: "•—", cmd: "insertUnorderedList" },
    { icon: "1—", cmd: "insertOrderedList" },
    { sep: true },
    { icon: "—", cmd: "insertHorizontalRule" },
    { icon: "⌫", cmd: "removeFormat" },
  ];

  return (
    <div className="adm-rte">
      <div className="adm-rte-toolbar">
        {tools.map((t, i) => t.sep
          ? <div key={i} style={{ width: 1, height: 20, background: "var(--c-border)", margin: "0 2px" }} />
          : <button key={i} type="button" className="adm-rte-btn" title={t.cmd} style={t.style}
              onMouseDown={e => { e.preventDefault(); exec(t.cmd, t.arg); }}>
              {t.icon}
            </button>
        )}
      </div>
      <div
        ref={ref}
        className="adm-rte-body"
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        style={{ minHeight }}
        onInput={onInput}
        onPaste={onPaste}
        dangerouslySetInnerHTML={undefined}
      />
    </div>
  );
}
window.RichTextEditor = RichTextEditor;
