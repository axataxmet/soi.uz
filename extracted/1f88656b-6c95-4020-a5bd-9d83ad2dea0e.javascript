/* Sog'liq Industriyasi — skeleton loaders shown during route / language transitions */

function SkCard() {
  return (
    <div className="sk-card">
      <div className="sk sk-media" />
      <div className="sk-card-body">
        <div className="sk sk-line w40" />
        <div className="sk sk-line w90" />
        <div className="sk sk-line w70" />
        <div className="sk-card-foot">
          <div className="sk sk-line w50" />
          <div className="sk sk-btn" />
        </div>
      </div>
    </div>
  );
}

function SkGrid({ n = 8 }) {
  return (
    <div className="sk-grid">
      {Array.from({ length: n }).map((_, i) => <SkCard key={i} />)}
    </div>
  );
}

function CatalogSkeleton() {
  return (
    <div className="wrap sk-wrap">
      <div className="sk sk-line w30" style={{ height: 14, margin: "4px 0 18px" }} />
      <div className="sk-catalog">
        <aside className="sk-filters">
          {[0, 1, 2].map((g) => (
            <div key={g} className="sk-filter-grp">
              <div className="sk sk-line w50" style={{ height: 13 }} />
              {[0, 1, 2, 3].map((r) => <div key={r} className="sk sk-line w80" style={{ height: 11 }} />)}
            </div>
          ))}
        </aside>
        <div>
          <div className="sk-toolbar">
            <div className="sk sk-line w40" style={{ height: 24 }} />
            <div className="sk sk-pill" />
          </div>
          <SkGrid n={6} />
        </div>
      </div>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="wrap sk-wrap">
      <div className="sk sk-line w40" style={{ height: 12, margin: "4px 0 18px" }} />
      <div className="sk-product">
        <div className="sk-pgallery">
          <div className="sk sk-pmain" />
          <div className="sk-pthumbs">
            {[0, 1, 2].map((i) => <div key={i} className="sk sk-pthumb" />)}
          </div>
        </div>
        <div className="sk-pinfo">
          <div className="sk-prow">
            <div className="sk sk-pill" /><div className="sk sk-pill" />
          </div>
          <div className="sk sk-line w90" style={{ height: 26 }} />
          <div className="sk sk-line w60" style={{ height: 26, marginBottom: 14 }} />
          <div className="sk-prow">
            <div className="sk sk-chip" /><div className="sk sk-chip" />
          </div>
          <div className="sk sk-pbox" />
          <div className="sk sk-pbox" style={{ height: 64 }} />
          <div className="sk-prow" style={{ marginTop: 6 }}>
            <div className="sk sk-btn-lg" /><div className="sk sk-btn-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

function HomeSkeleton() {
  return (
    <div>
      <div className="sk-hero">
        <div className="wrap sk-hero-inner">
          <div className="sk-hero-l">
            <div className="sk sk-pill" style={{ width: 200 }} />
            <div className="sk sk-line w80" style={{ height: 40, marginTop: 16 }} />
            <div className="sk sk-line w60" style={{ height: 40 }} />
            <div className="sk sk-line w90" style={{ height: 14, marginTop: 16 }} />
            <div className="sk sk-line w70" style={{ height: 14 }} />
            <div className="sk-prow" style={{ marginTop: 22 }}>
              <div className="sk sk-btn-lg" /><div className="sk sk-btn-lg" />
            </div>
          </div>
          <div className="sk sk-hero-r" />
        </div>
      </div>
      <div className="wrap sk-wrap">
        <div className="sk sk-line w40" style={{ height: 22, margin: "8px 0 18px" }} />
        <SkGrid n={4} />
      </div>
    </div>
  );
}

function PageSkeleton({ view }) {
  if (view === "catalog" || view === "wishlist" || view === "compare" || view === "price") return <CatalogSkeleton />;
  if (view === "product") return <ProductSkeleton />;
  if (view === "home") return <HomeSkeleton />;
  // generic fallback
  return (
    <div className="wrap sk-wrap">
      <div className="sk sk-line w30" style={{ height: 28, margin: "8px 0 20px" }} />
      <div className="sk sk-pbox" style={{ height: 120 }} />
      <SkGrid n={4} />
    </div>
  );
}

Object.assign(window, { PageSkeleton });
