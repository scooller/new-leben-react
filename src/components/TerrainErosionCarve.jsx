import { useEffect, useRef } from "react";

// Deterministic 2D PRNG hash
function hash(x, y, seed = 1337) {
  let h = seed ^ (x * 374761393) ^ (y * 668265263);
  h = (h ^ (h >> 13)) * 1274126177;
  return ((h ^ (h >> 16)) >>> 0) / 4294967296;
}

function smoothNoise(x, y, seed = 1337) {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = x0 + 1;
  const y1 = y0 + 1;

  const sx = x - x0;
  const sy = y - y0;
  const u = sx * sx * (3 - 2 * sx);
  const v = sy * sy * (3 - 2 * sy);

  const n00 = hash(x0, y0, seed);
  const n10 = hash(x1, y0, seed);
  const n01 = hash(x0, y1, seed);
  const n11 = hash(x1, y1, seed);

  const nx0 = n00 * (1 - u) + n10 * u;
  const nx1 = n01 * (1 - u) + n11 * u;
  return nx0 * (1 - v) + nx1 * v;
}

function fbm(x, y, seed = 1337) {
  let value = 0;
  let amp = 0.6;
  let freq = 1.0;
  for (let i = 0; i < 3; i++) {
    value += smoothNoise(x * freq, y * freq, seed + i * 101) * amp;
    freq *= 2.0;
    amp *= 0.5;
  }
  return value;
}

export default function TerrainErosionCarve({
  className = "",
  style = {},
  gridCols = 80,
  gridRows = 60,
  contourLevels = 16,
  healSpeed = 0.55,
  carveRadius = 3.5,
  carveDepth = 0.45,
  lineColor = "rgba(56, 71, 60, 0.20)",
  accentColor = "rgba(158, 110, 67, 0.70)",
  bgColor = "transparent",
  sedimentCount = 40,
  ambientSpeed = 0.08,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId;
    let width = 0;
    let height = 0;

    const totalCells = gridCols * gridRows;
    const baseHeight = new Float32Array(totalCells);
    const liveHeight = new Float32Array(totalCells);
    const carveIntensity = new Float32Array(totalCells);

    // Initialize base terrain
    const seed = Math.floor(Math.random() * 10000);
    for (let j = 0; j < gridRows; j++) {
      for (let i = 0; i < gridCols; i++) {
        const idx = j * gridCols + i;
        const nx = (i / gridCols) * 4;
        const ny = (j / gridRows) * 4;
        const h = fbm(nx, ny, seed);
        baseHeight[idx] = h;
        liveHeight[idx] = h;
        carveIntensity[idx] = 0;
      }
    }

    // Sediment particles
    const particles = Array.from({ length: sedimentCount }, () => ({
      x: Math.random() * gridCols,
      y: Math.random() * gridRows,
      vx: 0,
      vy: 0,
      life: Math.random() * 100,
    }));

    // Mouse / Pointer carve tracking
    let isCarving = false;
    let lastGridPos = null;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(canvas);
    resize();

    function getGridCoords(e) {
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.x;
      const py = e.clientY - rect.y;
      return {
        gx: (px / rect.width) * gridCols,
        gy: (py / rect.height) * gridRows,
      };
    }

    function carveAt(gx, gy) {
      const r = carveRadius;
      const r2 = r * r;
      const minX = Math.max(0, Math.floor(gx - r));
      const maxX = Math.min(gridCols - 1, Math.ceil(gx + r));
      const minY = Math.max(0, Math.floor(gy - r));
      const maxY = Math.min(gridRows - 1, Math.ceil(gy + r));

      for (let j = minY; j <= maxY; j++) {
        for (let i = minX; i <= maxX; i++) {
          const dx = i - gx;
          const dy = j - gy;
          const distSq = dx * dx + dy * dy;
          if (distSq < r2) {
            const factor = Math.cos((Math.sqrt(distSq) / r) * (Math.PI / 2));
            const idx = j * gridCols + i;
            carveIntensity[idx] = Math.min(1.2, carveIntensity[idx] + factor * carveDepth);
            liveHeight[idx] = Math.max(0, liveHeight[idx] - factor * carveDepth * 0.5);
          }
        }
      }
    }

    function interpolateCarve(p1, p2) {
      if (!p1 || !p2) return;
      const dist = Math.hypot(p2.gx - p1.gx, p2.gy - p1.gy);
      const steps = Math.max(1, Math.ceil(dist * 2));
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        carveAt(p1.gx + (p2.gx - p1.gx) * t, p1.gy + (p2.gy - p1.gy) * t);
      }
    }

    function onPointerDown(e) {
      if (e.pointerType === "touch") return;
      if (e.button !== undefined && e.button !== 0) return;
      if (
        e.target &&
        e.target.closest &&
        e.target.closest("a, button, input, select, textarea, [role='button'], .btn, .card, .lb-cert, .lb-search-card, .lb-search-pill, .modal")
      ) {
        return;
      }
      isCarving = true;
      const pos = getGridCoords(e);
      carveAt(pos.gx, pos.gy);
      lastGridPos = pos;
    }

    function onPointerMove(e) {
      if (!isCarving) return;
      const pos = getGridCoords(e);
      interpolateCarve(lastGridPos, pos);
      lastGridPos = pos;
    }

    function onPointerUp() {
      isCarving = false;
      lastGridPos = null;
    }

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    // Marching squares isoline interpolation
    function getIsoPoint(v1, v2, p1, p2, iso) {
      if (Math.abs(v2 - v1) < 0.0001) return (p1 + p2) * 0.5;
      const t = (iso - v1) / (v2 - v1);
      return p1 + t * (p2 - p1);
    }

    let lastTime = performance.now();
    let ambientTime = 0;

    function render(time) {
      const dt = Math.min(0.064, (time - lastTime) / 1000);
      lastTime = time;
      ambientTime += dt * ambientSpeed;

      // Update healing & ambient wave
      const healFactor = Math.exp(-dt * healSpeed);
      for (let j = 0; j < gridRows; j++) {
        for (let i = 0; i < gridCols; i++) {
          const idx = j * gridCols + i;
          // Decay carve
          carveIntensity[idx] *= healFactor;
          // Ambient soft undulating ripple
          const ripple = Math.sin(ambientTime * 3 + i * 0.15 + j * 0.15) * 0.02;
          // Blend back to base + ripple
          const target = baseHeight[idx] + ripple - carveIntensity[idx] * 0.4;
          liveHeight[idx] += (target - liveHeight[idx]) * (1 - healFactor);
        }
      }

      // Clear frame
      if (bgColor === "transparent") {
        ctx.clearRect(0, 0, width, height);
      } else {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
      }

      const cellW = width / (gridCols - 1);
      const cellH = height / (gridRows - 1);

      // Draw contour isolines via marching squares
      ctx.lineWidth = 1;
      for (let l = 1; l <= contourLevels; l++) {
        const iso = l / (contourLevels + 1);

        ctx.beginPath();
        for (let j = 0; j < gridRows - 1; j++) {
          for (let i = 0; i < gridCols - 1; i++) {
            const idx0 = j * gridCols + i;
            const idx1 = idx0 + 1;
            const idx2 = (j + 1) * gridCols + (i + 1);
            const idx3 = (j + 1) * gridCols + i;

            const v0 = liveHeight[idx0];
            const v1 = liveHeight[idx1];
            const v2 = liveHeight[idx2];
            const v3 = liveHeight[idx3];

            const x = i * cellW;
            const y = j * cellH;

            // 4-bit marching squares index
            let mask = 0;
            if (v0 >= iso) mask |= 1;
            if (v1 >= iso) mask |= 2;
            if (v2 >= iso) mask |= 4;
            if (v3 >= iso) mask |= 8;

            if (mask === 0 || mask === 15) continue;

            const topX = getIsoPoint(v0, v1, x, x + cellW, iso);
            const topY = y;
            const rightX = x + cellW;
            const rightY = getIsoPoint(v1, v2, y, y + cellH, iso);
            const botX = getIsoPoint(v3, v2, x, x + cellW, iso);
            const botY = y + cellH;
            const leftX = x;
            const leftY = getIsoPoint(v0, v3, y, y + cellH, iso);

            switch (mask) {
              case 1:
              case 14:
                ctx.moveTo(leftX, leftY);
                ctx.lineTo(topX, topY);
                break;
              case 2:
              case 13:
                ctx.moveTo(topX, topY);
                ctx.lineTo(rightX, rightY);
                break;
              case 3:
              case 12:
                ctx.moveTo(leftX, leftY);
                ctx.lineTo(rightX, rightY);
                break;
              case 4:
              case 11:
                ctx.moveTo(rightX, rightY);
                ctx.lineTo(botX, botY);
                break;
              case 5:
                ctx.moveTo(leftX, leftY);
                ctx.lineTo(topX, topY);
                ctx.moveTo(rightX, rightY);
                ctx.lineTo(botX, botY);
                break;
              case 6:
              case 9:
                ctx.moveTo(topX, topY);
                ctx.lineTo(botX, botY);
                break;
              case 7:
              case 8:
                ctx.moveTo(leftX, leftY);
                ctx.lineTo(botX, botY);
                break;
              case 10:
                ctx.moveTo(topX, topY);
                ctx.lineTo(rightX, rightY);
                ctx.moveTo(leftX, leftY);
                ctx.lineTo(botX, botY);
                break;
              default:
                break;
            }
          }
        }
        ctx.strokeStyle = lineColor;
        ctx.stroke();
      }

      // Draw river/erosion channels with glowing tint
      for (let j = 0; j < gridRows - 1; j++) {
        for (let i = 0; i < gridCols - 1; i++) {
          const idx = j * gridCols + i;
          const c = carveIntensity[idx];
          if (c > 0.05) {
            const x = i * cellW;
            const y = j * cellH;
            ctx.fillStyle = accentColor.replace(
              /rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/,
              `rgba($1,$2,$3,${Math.min(0.7, c * 0.6)})`
            );
            ctx.beginPath();
            ctx.arc(x + cellW * 0.5, y + cellH * 0.5, cellW * (0.4 + c * 0.6), 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Update & render sediment drift
      ctx.fillStyle = accentColor;
      for (let p of particles) {
        const gi = Math.max(0, Math.min(gridCols - 2, Math.floor(p.x)));
        const gj = Math.max(0, Math.min(gridRows - 2, Math.floor(p.y)));
        const idx = gj * gridCols + gi;

        // Downhill gradient
        const dhx = liveHeight[idx + 1] - liveHeight[idx];
        const dhy = liveHeight[idx + gridCols] - liveHeight[idx];

        p.vx = p.vx * 0.85 - dhx * 1.8;
        p.vy = p.vy * 0.85 - dhy * 1.8;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= dt * 15;

        if (p.x < 0 || p.x >= gridCols - 1 || p.y < 0 || p.y >= gridRows - 1 || p.life <= 0) {
          p.x = Math.random() * (gridCols - 1);
          p.y = Math.random() * (gridRows - 1);
          p.vx = 0;
          p.vy = 0;
          p.life = 60 + Math.random() * 40;
        }

        const px = p.x * cellW;
        const py = p.y * cellH;
        ctx.beginPath();
        ctx.arc(px, py, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [
    gridCols,
    gridRows,
    contourLevels,
    healSpeed,
    carveRadius,
    carveDepth,
    lineColor,
    accentColor,
    bgColor,
    sedimentCount,
    ambientSpeed,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        touchAction: "none",
        userSelect: "none",
        ...style,
      }}
    />
  );
}
