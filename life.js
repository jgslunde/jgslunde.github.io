// Conway's Game of Life as a page background: a faint grid of dots where living cells swell.
// The page covers the middle of it, so only the margins show.
(() => {
  const CELL = 18, STEP = 5600, TICK = 125, DENSITY = 0.18, PEAK = 0.3, MIN_MARGIN = 60;
  const SMALL = 0.7, BIG = CELL * 0.2;
  const RPENTOMINO = [[1, 0], [2, 0], [0, 1], [1, 1], [1, 2]];

  // One canvas per margin, so the browser never has to composite the hidden middle.
  const sides = [0, 1].map(() => {
    const box = document.createElement("div");
    box.className = "life";
    box.setAttribute("aria-hidden", "true");
    const canvas = document.createElement("canvas");
    box.append(canvas);
    document.body.prepend(box);
    return { box, canvas, ctx: canvas.getContext("2d") };
  });
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const scheme = matchMedia("(prefers-color-scheme: dark)");
  const stepEvery = Math.round(STEP / TICK);
  let cols, rows, cells, next, level, from, ink, timer, ticks = 0, generation = 0;

  function colours() {
    ink = getComputedStyle(document.documentElement).getPropertyValue("--soft").trim();
  }

  function sizeCanvases() {
    const ratio = devicePixelRatio || 1;
    for (const { box, canvas, ctx, first, end } of sides) {
      const width = (end - first) * CELL, height = rows * CELL;
      box.style.left = first * CELL + "px"; box.style.width = width + "px"; box.style.height = height + "px";
      canvas.style.width = width + "px"; canvas.style.height = height + "px";
      canvas.width = width * ratio; canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
  }

  function layout() {
    clearInterval(timer);
    const page = document.querySelector(".page").getBoundingClientRect();
    const show = Math.min(page.left, innerWidth - page.right) >= MIN_MARGIN;
    sides.forEach(side => side.box.hidden = !show);
    if (!show) return;
    cols = Math.ceil(innerWidth / CELL); rows = Math.ceil(innerHeight / CELL);
    sides[0].first = 0; sides[0].end = Math.ceil(page.left / CELL);
    sides[1].first = Math.floor(page.right / CELL); sides[1].end = cols;
    sizeCanvases();
    cells = new Uint8Array(cols * rows); next = new Uint8Array(cols * rows);
    level = new Float32Array(cols * rows); from = new Float32Array(cols * rows);
    for (let i = 0; i < cells.length; i++) {
      cells[i] = Math.random() < DENSITY ? 1 : 0;
      level[i] = cells[i];
    }
    ticks = 0;
    draw();
    if (!still.matches) timer = setInterval(tick, TICK);
  }

  function step() {
    let alive = 0;
    for (let y = 0; y < rows; y++) {
      const u = (y + rows - 1) % rows, d = (y + 1) % rows;
      for (let x = 0; x < cols; x++) {
        const l = (x + cols - 1) % cols, r = (x + 1) % cols;
        const n = cells[u * cols + l] + cells[u * cols + x] + cells[u * cols + r]
                + cells[y * cols + l] + cells[y * cols + r]
                + cells[d * cols + l] + cells[d * cols + x] + cells[d * cols + r];
        const i = y * cols + x;
        next[i] = n === 3 || (n === 2 && cells[i]) ? 1 : 0;
        alive += next[i];
      }
    }
    [cells, next] = [next, cells];
    // Left alone the board settles into still lifes, so keep dropping in new chaos.
    if (++generation % 30 === 0 || alive < cells.length * 0.03) {
      const ox = Math.floor(Math.random() * cols), oy = Math.floor(Math.random() * rows);
      for (const [dx, dy] of RPENTOMINO) cells[((oy + dy) % rows) * cols + (ox + dx) % cols] = 1;
    }
  }

  function draw() {
    for (const { ctx, first, end } of sides) {
      ctx.clearRect(0, 0, (end - first) * CELL, rows * CELL);
      ctx.fillStyle = ink; ctx.globalAlpha = PEAK;
      ctx.beginPath();
      for (let y = 0; y < rows; y++) for (let x = first; x < end; x++) {
        const r = SMALL + level[y * cols + x] * BIG, cx = (x - first + 0.5) * CELL, cy = (y + 0.5) * CELL;
        ctx.moveTo(cx + r, cy); ctx.arc(cx, cy, r, 0, 6.3);
      }
      ctx.fill();
    }
  }

  function tick() {
    if (document.hidden || !document.hasFocus()) return;
    const k = ticks++ % stepEvery;
    if (k === 0) { from.set(level); step(); }
    const t = (k + 1) / stepEvery, s = t * t * (3 - 2 * t);
    for (let i = 0; i < level.length; i++) level[i] = from[i] + (cells[i] - from[i]) * s;
    draw();
  }

  colours(); layout();
  addEventListener("resize", layout);
  scheme.addEventListener("change", () => { colours(); if (!sides[0].box.hidden) draw(); });
  still.addEventListener("change", layout);
})();
