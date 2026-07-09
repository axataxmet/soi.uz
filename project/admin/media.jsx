/* ИНДУСТРИЯ ЗДОРОВЬЯ Admin — Media library */
function AdminMedia() {
  const { useState, useRef } = React;
  const toast = useToast();
  const [images, setImages] = useSettings("media_library", []);
  const ref = useRef();
  const addImages = (e) => {
    const files = [...e.target.files];
    files.forEach(f => {
      const reader = new FileReader();
      reader.onload = ev => setImages(imgs => [...(imgs||[]), { id: Date.now()+"_"+Math.random().toString(36).slice(2), src: ev.target.result, name: f.name, size: f.size, date: new Date().toISOString().slice(0,10) }]);
      reader.readAsDataURL(f);
    });
    toast(`Загружено ${files.length} файлов`);
  };
  const del = (id) => setImages(imgs => (imgs||[]).filter(i => i.id !== id));
  return (
    <div>
      <div className="adm-page-head">
        <div className="adm-page-title">Медиатека</div>
        <button className="btn btn-primary" onClick={() => ref.current.click()}><AdminIcon name="plus" size={15} /> Загрузить</button>
      </div>
      <input ref={ref} type="file" accept="image/*" multiple style={{display:"none"}} onChange={addImages} />
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:12}}>
        {(images||[]).map(img => (
          <div key={img.id} className="adm-card" style={{overflow:"hidden",cursor:"pointer",position:"relative",group:true}}>
            <img src={img.src} alt={img.name} style={{width:"100%",height:100,objectFit:"cover",display:"block"}} />
            <div style={{padding:"6px 8px",fontSize:11,color:"var(--c-muted)"}} className="truncate">{img.name}</div>
            <button style={{position:"absolute",top:4,right:4}} className="btn btn-danger btn-icon btn-sm" onClick={() => del(img.id)}><AdminIcon name="x" size={12} /></button>
          </div>
        ))}
        <div className="adm-card adm-upload-zone" style={{height:140,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:6}} onClick={() => ref.current.click()}>
          <AdminIcon name="plus" size={24} color="var(--c-faint)" />
          <span style={{fontSize:12,color:"var(--c-faint)"}}>Добавить</span>
        </div>
      </div>
    </div>
  );
}
window.AdminMedia = AdminMedia;
