/* Classical single-machine infinite-bus model. Angle is electrical radians;
   speed is electrical rad/s relative to synchronous speed. No damping. */
(function (root) {
  'use strict';
  const DEFAULTS = Object.freeze({ H: 5, pm: 0.8, pre: 2, post: 1.5, f: 60, clear: 0.15 });
  function parameters(input) {
    const p = { ...DEFAULTS, ...input };
    if (![p.H, p.pm, p.pre, p.post, p.f, p.clear].every(Number.isFinite) ||
        p.H <= 0 || p.pm <= 0 || p.pm >= p.pre || p.pm >= p.post || p.f <= 0 || p.clear < 0)
      throw new Error('Use positive inertia and frequency, 0 < input power < both transfer limits, and nonnegative clearing time.');
    return p;
  }
  function assess(input) {
    const p = parameters(input), ws = 2 * Math.PI * p.f;
    const initial = Math.asin(p.pm / p.pre), unstable = Math.PI - Math.asin(p.pm / p.post);
    const cosCritical = p.pm * (unstable - initial) / p.post + Math.cos(unstable);
    const criticalAngle = Math.acos(Math.max(-1, Math.min(1, cosCritical)));
    const criticalTime = Math.sqrt(Math.max(0, 4 * p.H * (criticalAngle - initial) / (ws * p.pm)));
    const clearingAngle = initial + ws * p.pm * p.clear * p.clear / (4 * p.H);
    const acceleratingArea = p.pm * (clearingAngle - initial);
    const netAvailableArea = p.post * (Math.cos(clearingAngle) - Math.cos(unstable)) - p.pm * (unstable - clearingAngle);
    const margin = netAvailableArea - acceleratingArea;
    const atBoundary = criticalTime > 0 && Math.abs(p.clear - criticalTime) < 1e-6;
    const stable = criticalTime > 0 && p.clear < criticalTime;
    return { ...p, ws, initial, unstable, criticalAngle, criticalTime, clearingAngle,
      acceleratingArea, netAvailableArea, margin, stable, atBoundary };
  }
  function simulate(input, options = {}) {
    const a = assess(input), dt = options.dt || 0.001, end = options.end || 8;
    if (dt <= 0 || end <= 0) throw new Error('Time step and horizon must be positive.');
    let t = 0, angle = a.initial, speed = 0;
    const points = [{ t, angle, speed }];
    function rhs(d, w) { return [w, a.ws / (2 * a.H) * (a.pm - a.post * Math.sin(d))]; }
    while (t < end - 1e-10) {
      const faultOn = t < a.clear - 1e-10;
      const h = Math.min(dt, end - t, faultOn ? a.clear - t : Infinity);
      if (faultOn) {
        const accel = a.ws * a.pm / (2 * a.H);
        angle += speed * h + 0.5 * accel * h * h;
        speed += accel * h;
      } else {
        const k1 = rhs(angle, speed);
        const k2 = rhs(angle + h * k1[0] / 2, speed + h * k1[1] / 2);
        const k3 = rhs(angle + h * k2[0] / 2, speed + h * k2[1] / 2);
        const k4 = rhs(angle + h * k3[0], speed + h * k3[1]);
        angle += h / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]);
        speed += h / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
      }
      t += h;
      points.push({ t, angle, speed });
      if (angle > 2 * Math.PI || angle < -2 * Math.PI) break;
    }
    return { assessment: a, points };
  }
  const api = { DEFAULTS, parameters, assess, simulate };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.StabilityModel = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
