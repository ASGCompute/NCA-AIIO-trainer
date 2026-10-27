// Shared builder for the AIIO Path figures. Every figure is an isometric object in the anatomy style
// (kit/ is vendored from github.com/wheresryan22/anatomy, MIT): solids painted back to front, keys settled
// from true geometry, one lit part, and a readout driven by the same data. Words stay out of the drawing.
import * as k from "./kit/iso-kit.mjs";
import * as A from "./kit/audit.mjs";
export { k, A };

export const SPRING = { stagger: 0.035, stiffness: 64, damping: 14.2, substeps: 4 };
const f1 = (n) => Math.round(n * 10) / 10;
const pt = (p) => p.map(f1).join(" ");

function context(spec, P, collect) {
  const moves = spec.moves || {};
  const stagger = spec.stagger || [];
  const R = A.recorder(P, { order: stagger, spring: SPRING });
  const back = [], wires = [];
  let routeN = 0;
  const tint = (svg, t) => (t ? `<g class="tn-${t}">${svg}</g>` : svg);
  const at = (p) => k.iso(p, P);
  const note = (shape) => {
    if (!collect) return shape;
    const b = A.boundsOf(shape);
    for (const m of [[0, 0, 0], moves[shape._piece] || [0, 0, 0]]) for (const x of [b.min[0], b.max[0]]) for (const y of [b.min[1], b.max[1]]) for (const z of [b.min[2], b.max[2]]) collect.push([x + m[0], y + m[1], z + m[2]]);
    return shape;
  };
  const F = {
    P, R, at, k, A,
    // painted background that never moves (halos, the bench); still recorded for depth and support
    back(svg, shapes = []) { back.push(svg); for (const s of shapes) { s._piece = "stand"; note(s); R.solid(s); } },
    put(piece, sel, centre, svg, shapes, bias = 0, name) {
      for (const s of shapes) { s._piece = piece; note(s); }
      R.put({ piece, at: centre, bias, svg, sel, ...(name ? { name: R.nameFor(name) } : {}), move: moves[piece] || [0, 0, 0], shapes: shapes.map((s) => R.solid(s)) });
    },
    box(plan, z, h, o = {}) {
      return tint(k.solidSvg(k.slabOf(plan, z, h, P, o.steps ?? 3, o.bevel ?? 0.4), { tone: o.tone || "mid", crease: o.crease, inner: o.inner, lit: o.lit, flat: o.flat }), o.tint);
    },
    slab: (plan, z, h, name = "part") => A.slab(plan, z, h, { name }),
    // one solid box as one item: the common case
    part(piece, sel, plan, z, h, o = {}, extra = "", bias = 0) {
      F.put(piece, sel, [plan.x + plan.w / 2, plan.y + plan.d / 2, z + h / 2], F.box(plan, z, h, o) + extra, [A.slab(plan, z, h, { name: o.name || piece })], bias);
    },
    cyl(piece, sel, cx, cy, r, z, h, o = {}, extra = "", bias = 0) {
      F.put(piece, sel, [cx, cy, z + h / 2], tint(k.solidSvg(k.cylinder(cx, cy, r, z, h, P, o.steps ?? 28, o.bevel ?? 0), { tone: o.tone || "mid", crease: o.crease, inner: o.inner }), o.tint) + extra, [A.cylinder(cx, cy, r, z, h, { name: o.name || piece })], bias);
    },
    // a cable or link: a polyline in 3D with a terminal dot on each end, recorded as a thin tube for depth
    wire(piece, sel, points, o = {}) {
      // one item per straight leg, so each leg sorts at its own depth (a cable runs in front of one part and behind the next)
      const ends = o.ends ?? "both", tone = o.tone || "lo", n = points.length - 1, rid = ++routeN;
      for (let i = 0; i < n; i++) {
        const a = points[i], b = points[i + 1];
        let svg = `<path class="iso-line" data-tone="${tone}" data-w="1" data-r="${rid}" data-li="${i}"${o.back ? ' data-back="1"' : ""} d="M${pt(at(a))}L${pt(at(b))}" style="stroke-width:${o.width || 0.9}"/>`;
        const dots = [];
        if (i === 0 && (ends === "both" || ends === "from")) dots.push(at(a));
        if (i === n - 1 && (ends === "both" || ends === "to")) dots.push(at(b));
        if (dots.length) svg += k.dotsSvg(dots, { size: 1.1, tone }).replace('<g class="iso-dots"', '<g class="iso-dots" data-w="1"');
        wires.push({ a, b, piece, name: o.name || "wire", first: i === 0, last: i === n - 1 });
        F.put(piece, sel, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2], svg, [A.tube([a, b], o.r || 0.5, { name: (o.name || "wire"), limp: true })], o.bias ?? 0.05, "w." + (o.name || "wire"));
      }
    },
    lineTop: (a, b, z) => k.lineOnTop(a, b, z, P),
    line: (d, o = {}) => k.lineSvg(d, { tone: o.tone || "lo", free: o.free }),
    dots: (points3, o = {}) => k.dotsSvg(points3.map(at), { size: o.size || 0.45, tone: o.tone }),
    // closed outlines on vertical faces: ports, slots, vents (no loose ends)
    rectX: (xf, y0, y1, z0, z1) => "M" + [[xf, y0, z0], [xf, y1, z0], [xf, y1, z1], [xf, y0, z1]].map((p) => pt(at(p))).join("L") + "Z",
    rectY: (yf, x0, x1, z0, z1) => "M" + [[x0, yf, z0], [x1, yf, z0], [x1, yf, z1], [x0, yf, z1]].map((p) => pt(at(p))).join("L") + "Z",
    ports(face, f, a0, a1, z0, z1, n, gap = 0.8) {
      const span = (a1 - a0) / n, out = [];
      for (let i = 0; i < n; i++) out.push(face === "x" ? F.rectX(f, a0 + i * span + gap / 2, a0 + (i + 1) * span - gap / 2, z0, z1) : F.rectY(f, a0 + i * span + gap / 2, a0 + (i + 1) * span - gap / 2, z0, z1));
      return `<path class="fg-port" d="${out.join("")}"/>`;
    },
    finsTop(plan, z, pitch, axis = "x") {
      const out = [];
      if (axis === "x") for (let y = plan.y + pitch; y < plan.y + plan.d - pitch / 2; y += pitch) out.push(k.lineOnTop([plan.x, y], [plan.x + plan.w, y], z, P));
      else for (let x = plan.x + pitch; x < plan.x + plan.w - pitch / 2; x += pitch) out.push(k.lineOnTop([x, plan.y], [x, plan.y + plan.d], z, P));
      return k.lineSvg(out.join(""), { tone: "lo" });
    },
    // edge-to-edge vertical lines on the +x or +y face (fins seen end-on, panel joints)
    faceLines(face, plan, z0, z1, pitch) {
      const out = [];
      if (face === "x") for (let y = plan.y + pitch; y < plan.y + plan.d - pitch / 2; y += pitch) out.push(k.segment([plan.x + plan.w, y, z0], [plan.x + plan.w, y, z1], P));
      else for (let x = plan.x + pitch; x < plan.x + plan.w - pitch / 2; x += pitch) out.push(k.segment([x, plan.y + plan.d, z0], [x, plan.y + plan.d, z1], P));
      return k.lineSvg(out.join(""), { tone: "faint" });
    },

    // a rack-mount box with its front on +x (face "x") or +y (face "y"): seams, a port row, status LEDs, vents on top
    unit(piece, sel, plan, z, h, o = {}) {
      const face = o.face || "x", n = o.ports ?? 0, f = face === "x" ? plan.x + plan.w : plan.y + plan.d;
      const a0 = face === "x" ? plan.y : plan.x, a1 = face === "x" ? plan.y + plan.d : plan.x + plan.w;
      let extra = "";
      if (n) { const pw = Math.min((a1 - a0) * 0.62, n * (o.pitch || 4)); const s0 = a1 - 3 - pw; extra += F.ports(face, f, s0, a1 - 3, z + h * 0.3, z + h * 0.3 + Math.min(h * 0.45, 3.4), n, 0.9); }
      if (o.bays) { const bw = (a1 - a0) * 0.3 / o.bays; let d = ""; for (let i = 0; i < o.bays; i++) { const b0 = a0 + 3 + i * bw; d += face === "x" ? F.rectX(f, b0 + 0.3, b0 + bw - 0.3, z + 1, z + h - 1) : F.rectY(f, b0 + 0.3, b0 + bw - 0.3, z + 1, z + h - 1); } extra += k.lineSvg(d, { tone: "lo" }); }
      const led = face === "x" ? [f, a0 + 2, z + h - 1.4] : [a0 + 2, f, z + h - 1.4];
      extra += F.dots([led], { size: 0.55, tone: o.led || "hi" });
      if (o.vents) extra += F.finsTop(k.insetPlan(plan, 3), z + h, o.vents, face === "x" ? "y" : "x");
      F.part(piece, sel, plan, z, h, { steps: 2, tone: o.tone, bevel: 0.4, lit: o.lit, tint: o.tint, name: o.name || piece }, extra, o.bias || 0);
    },
    // an open rack: plinth, four corner posts, a top cap; returns the usable inner plan
    rack(piece, sel, plan, h, o = {}) {
      // plinth, a back panel and a far side panel (what the boxes slide against), three posts and a cap
      const t = 2, n = o.name || "rack";
      F.part(piece, sel, plan, 0, 3, { steps: 2, tone: "lo", name: n + ".plinth" }, "", -1);
      F.part(piece, sel, { x: plan.x, y: plan.y, w: t, d: plan.d - t, r: 0.3 }, 3, h - 6, { steps: 1, bevel: 0, tone: "lo", name: n + ".back" }, "", -2);
      F.part(piece, sel, { x: plan.x + t, y: plan.y, w: plan.w - 2 * t, d: t, r: 0.3 }, 3, h - 6, { steps: 1, bevel: 0, tone: "lo", name: n + ".side" }, "", -2);
      for (const [x, y] of [[plan.x + plan.w - t, plan.y], [plan.x, plan.y + plan.d - t], [plan.x + plan.w - t, plan.y + plan.d - t]]) F.part(piece, sel, { x, y, w: t, d: t, r: 0.4 }, 3, h - 6, { steps: 1, bevel: 0, name: n + ".post" }, F.dots([0.25, 0.5, 0.75].map((q) => [x + t, y + t / 2, 3 + q * (h - 6)]), { size: 0.35 }));
      F.part(piece, sel, plan, h - 3, 3, { steps: 2, name: n + ".cap" }, "", 1);
      return { x: plan.x + t, y: plan.y + t, w: plan.w - 2 * t, d: plan.d - 2 * t, r: 0.3 };
    },

    // lines that carry data (NVLink traces, links): light up and flow when their part is picked
    traces: (d, tone = "faint") => `<path class="iso-line" data-tone="${tone}" data-w="1" d="${d}"/>`,

    // horizontal lines across the visible +x or +y face, edge to edge (server rows on a rack door, panel joints)
    faceRows(face, plan, zs, tone = "faint") {
      const d = zs.map((z) => face === "x" ? k.segment([plan.x + plan.w, plan.y, z], [plan.x + plan.w, plan.y + plan.d, z], P) : k.segment([plan.x, plan.y + plan.d, z], [plan.x + plan.w, plan.y + plan.d, z], P)).join("");
      return k.lineSvg(d, { tone });
    },
    grid: (plan, z, gap) => { const out = []; for (let x = plan.x + gap; x < plan.x + plan.w - gap / 2; x += gap) out.push(k.lineOnTop([x, plan.y], [x, plan.y + plan.d], z, P)); for (let y = plan.y + gap; y < plan.y + plan.d - gap / 2; y += gap) out.push(k.lineOnTop([plan.x, y], [plan.x + plan.w, y], z, P)); return k.lineSvg(out.join(""), { tone: "faint" }); },
    seam: (plan, z, steps = 3) => k.lineSvg(k.sideSeam(plan, z, P, steps), { tone: "faint" }),
    // the bench every figure stands on: plate on feet, groove, corner screws, label plate with rule lines
    base(plan, h = 8) {
      const out = [`<path class="iso-halo" d="${k.haloOf(plan, -h - 4, h, P)}"/>`];
      const feet = k.corners(plan, 14).sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
      for (const [x, y] of feet) {
        out.push(k.solidSvg(k.cylinder(x, y, 5.5, -h - 4, 1.4, P, 24), { tone: "lo" }));
        out.push(k.solidSvg(k.cylinder(x, y, 4.2, -h - 2.6, 2.6, P, 24), { tone: "mid" }));
      }
      out.push(k.solidSvg(k.slabOf(plan, -h, h, P, 8, 1.2), { tone: "mid" }));
      out.push(k.lineSvg(k.planOutline(k.insetPlan(plan, 4), 0, P), { tone: "lo" }));
      const sc = k.corners(plan, 8);
      out.push(k.lineSvg(sc.map(([x, y]) => k.ring(x, y, 1.8, 0, P, 14)).join(""), { tone: "lo" }));
      out.push(k.dotsSvg(sc.map(([x, y]) => at([x, y, 0])), { size: 0.45 }));
      const lp = { x: plan.x + plan.w - 52, y: plan.y + plan.d - 4 - 6.4, w: 40, d: 5, r: 0.8 };
      out.push(k.solidSvg(k.slabOf(lp, 0, 0.5, P, 2), { tone: "lo", crease: "none" }));
      out.push(k.lineSvg([30, 22, 14].map((len, i) => k.lineOnTop([lp.x + 4, lp.y + 1.3 + i * 1.2], [lp.x + 4 + len, lp.y + 1.3 + i * 1.2], 0.5, P)).join(""), { tone: "lo", free: true }));
      F.back(out.join(""), [A.slab(plan, -h, h, { name: "stand.base", ground: true })]);
    },
    finish() { return { R, back, P, wires }; },
  };
  return F;
}

// Build a figure twice: once to measure everything (with explode moves), once to draw it fitted to the card.
export function makeFig(spec, build) {
  const W = spec.width || 600, H = spec.height || 400;
  const probe = { origin: [0, 0], scale: 1, azimuth: spec.azimuth ?? 45, elevation: spec.elevation ?? 30 };
  const pts = [];
  build(context(spec, probe, pts));
  const P = k.fitProjection(pts, W, H, { pad: spec.pad ?? 22, azimuth: spec.azimuth ?? 45, elevation: spec.elevation ?? 30 });
  const F = context(spec, P, null);
  build(F);
  const { R, back, wires } = F.finish();
  const t0 = Date.now();
  const lines = (x) => x && x.name && x.name.startsWith("w.");
  A.settle(R, P, { skip: (a, b) => (lines(a) && lines(b)) || A.sameRun(a, b) });
  R.items.sort((a, b) => a.key - b.key);
  const audit = process.argv.includes("--audit");
  let report = "";
  if (audit) {
    const res = A.audit(R, P, { crowd: [], allow: [["w.*", "w.*"]] });
    report = A.report(res);
    res.failed = A.failures(res);
    // wires are drawn as lines, so the kit's tube checks don't see them: make sure none passes through a solid
    const solids = R.solids.filter((sh) => sh.kind !== "tube");
    const through = [];
    for (const w of wires) {
      const L = Math.hypot(w.b[0] - w.a[0], w.b[1] - w.a[1], w.b[2] - w.a[2]);
      for (let t = 0; t <= 1.0001; t += Math.min(0.05, 1 / Math.max(L, 1))) {
        const p = [0, 1, 2].map((i) => w.a[i] + (w.b[i] - w.a[i]) * t);
        if ((w.first && t * L < 1.5) || (w.last && (1 - t) * L < 1.5)) continue;
        const hit = solids.find((sh) => A.sdf(sh, p) < -0.05);
        if (hit) { through.push(`${w.name} through ${hit.name} at ${p.map((v) => v.toFixed(1)).join(",")}`); break; }
      }
    }
    report += `\nwires through solids: ${through.length}${through.length ? "\n  " + through.join("\n  ") : ""}`;
    res.failed += through.length;
    report += `\n${spec.id}: ${res.failed} failing\n`;
  }
  const { V } = A.cameraBasis(P);
  const EX = k.axisVector(P, [1, 0, 0]), EY = k.axisVector(P, [0, 1, 0]), EZ = k.axisVector(P, [0, 0, 1]);
  const items = R.items.map((it) => {
    const m = it.move || [0, 0, 0];
    const lift = m[0] * V[0] + m[1] * V[1] + m[2] * V[2];
    const tx = EX[0] * m[0] + EY[0] * m[1] + EZ[0] * m[2], ty = EX[1] * m[0] + EY[1] * m[1] + EZ[1] * m[2];
    const moving = m.some((v) => v !== 0);
    return `<g class="it"${it.sel ? ` data-s="${it.sel}"` : ""}${moving ? ` data-p="${it.piece}" data-l="${lift.toFixed(2)}" data-t="${tx.toFixed(2)},${ty.toFixed(2)}"` : ""} data-k="${it.key.toFixed(3)}">${it.svg}</g>`;
  });
  const tidy = (x) => x.replace(/ d="([^"]*)"/g, (m, v) => ` d="${v.replace(/(\.\d)\d+/g, "$1")}"`);
  const svg = tidy(`<svg xmlns="http://www.w3.org/2000/svg" class="iso-svg" viewBox="0 0 ${W} ${H}" role="img"><g class="fg-back">${back.join("")}</g><g class="fg-items">${items.join("")}</g></svg>`);
  return { id: spec.id, svg, w: W, h: H, stagger: spec.stagger || [], items: R.items.length, ms: Date.now() - t0, report };
}
