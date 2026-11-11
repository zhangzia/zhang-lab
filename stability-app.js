'use strict';
(function () {
  const el = id => document.getElementById(id), model = window.StabilityModel;
  const ids = ['clear', 'H', 'pm', 'post'];
  const deg = r => r * 180 / Math.PI;
  let state = { ...model.DEFAULTS };
  function fmt(v, n = 1) { return Number(v).toFixed(n); }
  function path(points, x, y) { return points.map((p, i) => `${i ? 'L' : 'M'}${x(p[0]).toFixed(2)},${y(p[1]).toFixed(2)}`).join(' '); }
  function polygon(points, x, y, color) { return `<path d="${path(points, x, y)} Z" fill="${color}" fill-opacity="0.23" stroke="none"/>`; }
  function plotSize(id, height) {
    const w = Math.max(280, el(id).getBoundingClientRect().width), h = w < 500 ? height - 30 : height;
    return { w, h, l: 50, r: 20, top: 28, bottom: 43 };
  }
  function axes(s, xmin, xmax, ymin, ymax, xticks, yticks, xlabel, ylabel) {
    const x = v => s.l + (v - xmin) / (xmax - xmin) * (s.w - s.l - s.r);
    const y = v => s.h - s.bottom - (v - ymin) / (ymax - ymin) * (s.h - s.top - s.bottom);
    let svg = '';
    xticks.forEach(v => { svg += `<line class="grid" x1="${x(v)}" x2="${x(v)}" y1="${s.top}" y2="${y(ymin)}"/><text x="${x(v)}" y="${s.h - 23}" text-anchor="middle">${v}</text>`; });
    yticks.forEach(v => { svg += `<line class="grid" x1="${s.l}" x2="${s.w - s.r}" y1="${y(v)}" y2="${y(v)}"/><text x="${s.l - 9}" y="${y(v) + 4}" text-anchor="end">${v}</text>`; });
    svg += `<text x="${s.l}" y="13">${ylabel}</text><text x="${s.w - s.r}" y="${s.h - 3}" text-anchor="end">${xlabel}</text>`;
    return { x, y, svg };
  }
  function renderTime(sim) {
    const a = sim.assessment, s = plotSize('time-chart', 300);
    const maximum = Math.max(deg(a.unstable) + 15, ...sim.points.map(p => deg(p.angle)));
    const step = maximum > 210 ? 90 : 45, ymax = Math.ceil(maximum / step) * step;
    const ymin = Math.min(0, Math.floor(Math.min(...sim.points.map(p => deg(p.angle))) / 45) * 45);
    const ticks = []; for (let v = ymin; v <= ymax; v += step) ticks.push(v);
    const xy = axes(s, 0, 8, ymin, ymax, s.w < 500 ? [0, 2, 4, 6, 8] : [0, 1, 2, 3, 4, 5, 6, 7, 8], ticks, 'Time (s)', 'Rotor angle (°)');
    const { x, y } = xy, samples = sim.points.filter((p, i) => i % 8 === 0 || i === sim.points.length - 1);
    el('time-chart').innerHTML = `<svg width="${s.w}" height="${s.h}" role="img" aria-label="Rotor angle over eight seconds. ${a.stable ? 'Bounded first swing' : 'Loss of synchronism predicted'}. Clearing occurs at ${fmt(a.clear * 1000, 0)} milliseconds."><title>Rotor angle after a fault</title><rect x="${x(0)}" y="${s.top}" width="${x(a.clear) - x(0)}" height="${s.h - s.top - s.bottom}" fill="var(--fault)" opacity=".45"/>${xy.svg}<line class="boundary" x1="${s.l}" x2="${s.w - s.r}" y1="${y(deg(a.unstable))}" y2="${y(deg(a.unstable))}"/><line class="clear-line" x1="${x(a.clear)}" x2="${x(a.clear)}" y1="${s.top}" y2="${s.h - s.bottom}"/><path class="trace" d="${path(samples.map(p => [p.t, deg(p.angle)]), x, y)}"/></svg>`;
  }
  function renderPower(a) {
    const s = plotSize('power-chart', 270), ticks = s.w < 500 ? [0, 60, 120, 180] : [0, 30, 60, 90, 120, 150, 180];
    const xy = axes(s, 0, 180, 0, 2.2, ticks, [0, 0.5, 1, 1.5, 2], 'Rotor angle (°)', 'Power (pu)'), { x, y } = xy;
    const dc = Math.min(a.clearingAngle, Math.PI), ds = Math.asin(a.pm / a.post);
    function area(lo, hi, curve, color) {
      if (hi <= lo) return '';
      const points = [[deg(lo), a.pm]];
      for (let i = 0; i <= 80; i++) { const d = lo + (hi - lo) * i / 80; points.push([deg(d), curve(d)]); }
      points.push([deg(hi), a.pm]);
      return polygon(points, x, y, color);
    }
    const pre = [], post = []; for (let i = 0; i <= 180; i++) { pre.push([i, a.pre * Math.sin(i * Math.PI / 180)]); post.push([i, a.post * Math.sin(i * Math.PI / 180)]); }
    let shapes = area(a.initial, dc, () => 0, 'var(--orange)');
    if (dc < ds) shapes += area(dc, ds, d => a.post * Math.sin(d), 'var(--orange)');
    shapes += area(Math.max(dc, ds), a.unstable, d => a.post * Math.sin(d), 'var(--green)');
    el('power-chart').innerHTML = `<svg width="${s.w}" height="${s.h}" role="img" aria-label="Power angle diagram with accelerating and available decelerating areas. Solid line: post-fault electrical power. Dotted line: pre-fault power."><title>Power-angle curves and equal-area comparison</title>${xy.svg}${shapes}<path class="prefault" d="${path(pre, x, y)}"/><path class="trace" d="${path(post, x, y)}"/><line class="boundary" x1="${s.l}" x2="${s.w - s.r}" y1="${y(a.pm)}" y2="${y(a.pm)}"/><line class="clear-line" x1="${x(deg(dc))}" x2="${x(deg(dc))}" y1="${s.top}" y2="${s.h - s.bottom}"/></svg>`;
    el('area-note').textContent = `Solid curve: post-fault transfer. Dotted curve: pre-fault transfer. Clearing angle: ${fmt(deg(a.clearingAngle))}°. Lime shading includes fault-on acceleration and any further post-fault acceleration before electrical output exceeds input. Green is the decelerating area available before the unstable equilibrium.${a.clearingAngle > Math.PI ? ' The clearing angle is beyond this diagram’s 180° range.' : ''}`;
  }
  function render() {
    ids.forEach(id => { el(id).value = state[id]; });
    const sim = model.simulate(state), a = sim.assessment;
    el('clear-value').textContent = `${fmt(state.clear * 1000, 0)} ms`;
    el('H-value').textContent = `${fmt(state.H)} s`;
    el('pm-value').textContent = `${fmt(state.pm, 2)} pu`;
    el('post-value').textContent = `${fmt(state.post, 2)} pu`;
    el('critical').textContent = a.criticalTime > 0 ? `${fmt(a.criticalTime * 1000, 0)} ms` : '0 ms';
    el('initial').textContent = `Initial angle: ${fmt(deg(a.initial))}°`;
    el('outcome').textContent = a.atBoundary ? 'At the critical boundary' : a.stable ? 'Bounded first swing' : 'Loss of synchronism predicted';
    el('explanation').textContent = a.criticalTime <= 0 ? 'The selected post-fault network cannot absorb the transient energy even with immediate clearing. Increase its transfer limit or reduce loading.' : a.atBoundary ? 'This ideal case sits at the equal-area boundary. Move the clearing time slightly to either side to compare.' : a.stable ? `Clearing at ${fmt(a.clear * 1000, 0)} ms is below the ${fmt(a.criticalTime * 1000, 0)} ms limit. The undamped rotor continues to oscillate; stable does not mean settled.` : `Clearing at ${fmt(a.clear * 1000, 0)} ms exceeds the ${fmt(a.criticalTime * 1000, 0)} ms limit. Accelerating energy is too large for the post-fault network to absorb on the first swing.`;
    document.querySelector('.result').classList.toggle('loss', !a.stable && !a.atBoundary);
    renderTime(sim); renderPower(a);
    window.stabilityExplorer = { state: { ...state }, assessment: a };
  }
  ids.forEach(id => el(id).addEventListener('input', () => { state[id] = Number(el(id).value); document.querySelectorAll('[data-preset]').forEach(b => b.setAttribute('aria-pressed', 'false')); render(); }));
  document.querySelectorAll('[data-preset]').forEach(button => button.addEventListener('click', () => {
    state = { ...model.DEFAULTS };
    const c = model.assess(state).criticalTime;
    state.clear = Math.round((button.dataset.preset === 'fast' ? 0.1 : button.dataset.preset === 'near' ? c * 0.98 : c * 1.15) / 0.005) * 0.005;
    document.querySelectorAll('[data-preset]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    render();
  }));
  el('reset').addEventListener('click', () => { state = { ...model.DEFAULTS }; document.querySelectorAll('[data-preset]').forEach(b => b.setAttribute('aria-pressed', 'false')); render(); });
  window.addEventListener('resize', render);
  window.addEventListener('stability-layout-change', render);
  new ResizeObserver(() => render()).observe(el('time-chart'));
  render();
})();
