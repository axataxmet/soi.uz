/* UzMedEx — Hero light ribbon (Stripe-style localized light graphic, medical blue palette) */
const { useRef: useWaveRef, useEffect: useWaveEffect } = React;

function HeroLightWave() {
  const canvasRef = useWaveRef(null);
  const mouseRef = useWaveRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 });
  const rafRef = useWaveRef(0);

  useWaveEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    function resize() {
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // medical palette: deep navy → brand blue → cyan → soft lavender → white spark
    // each ribbon is a FILLED translucent flowing band (source-over, no additive blow-out)
    const ribbons = [
      { amp: 0.14, freq: 1.0, speed: 0.16, phase: 0.0, y: 0.50, thick: 0.085, col: "23,87,200",   alpha: 0.34 },
      { amp: 0.18, freq: 0.8, speed: 0.21, phase: 1.7, y: 0.52, thick: 0.070, col: "21,174,216",  alpha: 0.30 },
      { amp: 0.11, freq: 1.3, speed: 0.13, phase: 3.4, y: 0.47, thick: 0.055, col: "130,140,240", alpha: 0.28 },
      { amp: 0.21, freq: 0.6, speed: 0.10, phase: 5.0, y: 0.55, thick: 0.110, col: "45,114,227",  alpha: 0.18 },
      { amp: 0.08, freq: 1.7, speed: 0.26, phase: 2.2, y: 0.49, thick: 0.020, col: "230,248,255", alpha: 0.55 },
    ];

    function edgeY(b, px, t, off, my) {
      const env = Math.sin(px * Math.PI);
      const mouse = (my - 0.5) * 0.10 * env;
      return (
        b.y +
        Math.sin(px * Math.PI * 2 * b.freq + t * b.speed + b.phase) * b.amp * env +
        Math.sin(px * Math.PI * 4 * b.freq - t * b.speed * 0.7 + b.phase) * b.amp * 0.3 * env +
        mouse + off
      );
    }

    function drawRibbon(b, t, my) {
      const steps = 70;
      ctx.beginPath();
      // top edge L→R
      for (let i = 0; i <= steps; i++) {
        const px = i / steps;
        const env = Math.sin(px * Math.PI);
        const y = edgeY(b, px, t, -b.thick * env, my) * H;
        const x = px * W;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      // bottom edge R→L
      for (let i = steps; i >= 0; i--) {
        const px = i / steps;
        const env = Math.sin(px * Math.PI);
        const y = edgeY(b, px, t, b.thick * env, my) * H;
        const x = px * W;
        ctx.lineTo(x, y);
      }
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, 0, W, 0);
      grad.addColorStop(0.0, `rgba(${b.col},0)`);
      grad.addColorStop(0.30, `rgba(${b.col},0)`);
      grad.addColorStop(0.64, `rgba(${b.col},${b.alpha})`);
      grad.addColorStop(1.0, `rgba(${b.col},0)`);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    let t = 0;
    function frame() {
      const m = mouseRef.current;
      m.x += (m.tx - m.x) * 0.05;
      m.y += (m.ty - m.y) * 0.05;

      ctx.clearRect(0, 0, W, H);

      // soft ambient glow (source-over, transparent gradients — safe, won't saturate)
      const glows = [
        { x: 0.40 + Math.sin(t * 0.12) * 0.04, y: 0.46, r: 0.5, c: "23,87,200",  a: 0.10 },
        { x: 0.62 + Math.cos(t * 0.10) * 0.04, y: 0.55, r: 0.46, c: "21,174,216", a: 0.10 },
        { x: 0.52 + Math.sin(t * 0.08) * 0.03, y: 0.50, r: 0.34, c: "130,140,240",a: 0.08 },
      ];
      glows.forEach((g) => {
        const rg = ctx.createRadialGradient(g.x * W, g.y * H, 0, g.x * W, g.y * H, g.r * Math.max(W, H));
        rg.addColorStop(0, `rgba(${g.c},${g.a})`);
        rg.addColorStop(1, `rgba(${g.c},0)`);
        ctx.fillStyle = rg;
        ctx.fillRect(0, 0, W, H);
      });

      // ribbons with subtle blur via shadow for bloom
      ribbons.forEach((b) => {
        ctx.save();
        ctx.shadowColor = `rgba(${b.col},${b.alpha})`;
        ctx.shadowBlur = 18;
        drawRibbon(b, t, m.y);
        ctx.restore();
      });

      if (!reduce) t += 0.016;
      rafRef.current = requestAnimationFrame(frame);
    }
    frame();

    function onMove(e) {
      const r = canvas.getBoundingClientRect();
      mouseRef.current.tx = (e.clientX - r.left) / r.width;
      mouseRef.current.ty = (e.clientY - r.top) / r.height;
    }
    const host = canvas.parentElement;
    host && host.addEventListener("pointermove", onMove);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      host && host.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-wave-canvas" />;
}

Object.assign(window, { HeroLightWave });
