import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import styles from "./PencilLines.module.css";

/*
 * Colored pencil lines that start on the hero's last frame — among the desk
 * stationery (the wrap extends 100vh above the notebook body, see the CSS) —
 * and circle the main section headings on the way down:
 *   red  — from the pencil's graphite tip, loops around "About me",
 *          "Work experience", "Projects" and finally "Say hi!"
 *   blue — from under the coffee ring, down the right edge, swings in to
 *          loop around "Education"
 *
 * Nothing is hand-authored per resolution: heading positions are measured
 * from the DOM (elements tagged with data-pencil="...") and the paths are
 * regenerated whenever the page resizes, so the loops land on the headings
 * at any viewport size.
 *
 * Geometry lives in a 100-wide user space (x = % of page width, y in the
 * same scale) and the viewBox aspect ratio matches the real page, so the
 * SVG scale stays uniform. A non-uniform scale (preserveAspectRatio="none"
 * over a stretched viewBox) breaks Chromium's dash rendering, which the
 * pathLength draw animation relies on.
 */

type Rect = { x: number; y: number; w: number; h: number };
type Pt = { x: number; y: number };
type Loop = { entry: Pt; d: string; exit: Pt };
/* startY/endY: page coords of the line's first and last point, used to keep
   the pen tip riding along with the viewport while scrolling */
type Line = { color: string; d: string; startY: number; endY: number };

/* cubic-bezier quarter-circle constant */
const K = 0.5523;

/* fixed wobble sequence: sketchy but stable across re-renders/resizes */
const JITTER = [0.9, -0.7, 0.5, -1, 0.8, -0.4, 0.6, -0.85];

const pt = (p: Pt) => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
const cub = (c1: Pt, c2: Pt, end: Pt) => `C ${pt(c1)}, ${pt(c2)}, ${pt(end)}`;

/* a quick hand-drawn ellipse around a heading: enters on one side, runs
   under the text first, all the way around, and overshoots past the start */
function loopAround(r: Rect, u: number, j0: number, side: "left" | "right"): Loop {
  const cx = r.x + r.w / 2;
  const cy = r.y + r.h / 2;
  const rx = r.w / 2 + u * 1.7;
  const ry = Math.max(r.h / 2 + u * 1.1, u * 2.2);
  const jit = (i: number) => JITTER[(j0 + i) % JITTER.length] * u * 0.5;
  /* mirror x around the center for the right-side variant */
  const mx = (dx: number) => (side === "left" ? cx + dx : cx - dx);

  const entry = { x: mx(-rx), y: cy + jit(0) };
  const exit = { x: mx(-rx), y: cy + ry * 0.3 };
  const d = [
    cub(
      { x: mx(-rx) + jit(1), y: cy + K * ry },
      { x: mx(-K * rx), y: cy + ry + jit(2) },
      { x: cx, y: cy + ry },
    ),
    cub(
      { x: mx(K * rx), y: cy + ry + jit(3) },
      { x: mx(rx) + jit(4), y: cy + K * ry },
      { x: mx(rx), y: cy },
    ),
    cub(
      { x: mx(rx) + jit(5), y: cy - K * ry },
      { x: mx(K * rx), y: cy - ry + jit(6) },
      { x: cx, y: cy - ry },
    ),
    cub(
      { x: mx(-K * rx), y: cy - ry + jit(7) },
      { x: mx(-rx) + jit(0), y: cy - K * ry },
      exit,
    ),
  ].join(" ");
  return { entry, d, exit };
}

/* smooth descent between two waypoints; vertical tangents at both ends so
   chained segments and loop entries/exits join without kinks */
function flow(p: Pt, e: Pt): string {
  const dy = e.y - p.y;
  return cub({ x: p.x, y: p.y + dy * 0.45 }, { x: e.x, y: e.y - dy * 0.4 }, e);
}

/* wavy descent: like flow, but weaves through 1–2 swaying midpoints so the
   connectors between sections never look ruler-straight */
function meander(p: Pt, e: Pt, u: number, j0: number): string {
  const dy = e.y - p.y;
  if (dy < u * 8) return flow(p, e);
  const n = dy > u * 26 ? 3 : 2;
  const parts: string[] = [];
  let prev = p;
  for (let i = 1; i < n; i++) {
    const t = i / n;
    const sway = JITTER[(j0 + i) % JITTER.length] * u * 2.4;
    const mid = { x: p.x + (e.x - p.x) * t + sway, y: p.y + dy * t };
    parts.push(flow(prev, mid));
    prev = mid;
  }
  parts.push(flow(prev, e));
  return parts.join(" ");
}

function redPath(
  start: Pt,
  about: Rect,
  work: Rect,
  projects: Rect,
  contact: Rect,
  u: number,
): Omit<Line, "color"> {
  const a = loopAround(about, u, 0, "left");
  const w = loopAround(work, u, 3, "left");
  const p = loopAround(projects, u, 6, "left");
  const c = loopAround(contact, u, 5, "left");
  /* hug the left margin past the project cards, then swing right to "Say hi!"
     and stop there — the circled heading is the line's destination */
  const margin = { x: p.exit.x - u * 0.5, y: c.entry.y - u * 14 };
  const d = [
    `M ${pt(start)}`,
    meander(start, a.entry, u, 7),
    a.d,
    meander(a.exit, w.entry, u, 1),
    w.d,
    meander(w.exit, p.entry, u, 4),
    p.d,
    meander(p.exit, margin, u, 2),
    flow(margin, c.entry),
    c.d,
  ].join(" ");
  return { d, startY: start.y, endY: c.exit.y };
}

/* down the right edge, swings in to circle "Education" and stops there */
function bluePath(start: Pt, edu: Rect, u: number): Omit<Line, "color"> {
  const e = loopAround(edu, u, 2, "right");
  const xr = 100 - u * 5;
  const approach = { x: xr - u, y: e.entry.y - u * 12 };
  const d = [
    `M ${pt(start)}`,
    meander(start, approach, u, 5),
    flow(approach, e.entry),
    e.d,
  ].join(" ");
  return { d, startY: start.y, endY: e.exit.y };
}

/* one pencil line with its ghost twin stroke. The pen tip rides along with
   the viewport: scroll progress is converted to the page coordinate of the
   bottom edge, and the line is drawn up to a point slightly above it — each
   line at its own pace between its own start and end, so neither the short
   blue line trails behind nor anything races ahead of the scroll */
function PencilPath({
  line,
  spring,
  viewH,
  vpH,
  strokeWidth,
  full,
}: {
  line: Line;
  spring: MotionValue<number>;
  viewH: number;
  vpH: number; // viewport height in user units
  strokeWidth: number;
  full: boolean;
}) {
  const span = Math.max(line.endY - line.startY, 1);
  const drawn = useTransform(spring, (v) => {
    /* useScroll offset is ["start 0.8", "end end"], hence the 0.2 term */
    const bottomEdge = v * (viewH - 0.2 * vpH) + 0.2 * vpH;
    const penTip = bottomEdge - 0.45 * vpH;
    return Math.min(Math.max((penTip - line.startY) / span, 0), 1);
  });
  return (
    <g>
      {/* faint twin stroke for a layered colored-pencil texture */}
      <motion.path
        d={line.d}
        stroke={line.color}
        strokeWidth={strokeWidth * 0.55}
        style={{ pathLength: full ? 1 : drawn }}
        className={styles.lineGhost}
        transform="translate(0.35 0.3)"
      />
      <motion.path
        d={line.d}
        stroke={line.color}
        strokeWidth={strokeWidth}
        style={{ pathLength: full ? 1 : drawn }}
        className={styles.line}
      />
    </g>
  );
}

/* position of el relative to `stop`, via the offsetParent chain — unlike
   getBoundingClientRect this ignores transforms, so framer-motion entrance
   offsets (initial x/y) can't skew the measurement */
function offsetRect(el: HTMLElement, stop: HTMLElement, s: number): Rect {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== stop) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x: x * s, y: y * s, w: el.offsetWidth * s, h: el.offsetHeight * s };
}

export default function PencilLines() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);
  const [paths, setPaths] = useState<Line[]>([]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setDims({ w: width, h: height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* re-measure the headings and rebuild the paths on any size change
     (window resize, fonts loading, content growing — all change dims) */
  useEffect(() => {
    const wrap = wrapRef.current;
    const stop = wrap?.parentElement;
    if (!wrap || !stop || !dims) return;
    const s = 100 / dims.w;
    /* base wobble/padding unit: ~1.1% of page width, clamped in px */
    const u = Math.min(Math.max(dims.w * 0.011, 8), 18) * s;
    /* the wrap sticks 100vh above the notebook body (negative offsetTop),
       so everything measured against the body shifts down by that much */
    const shift = -wrap.offsetTop * s;
    const find = (key: string) => {
      const target = stop.querySelector<HTMLElement>(`[data-pencil="${key}"]`);
      if (!target) return null;
      const r = offsetRect(target, stop, s);
      return { ...r, y: r.y + shift };
    };
    const about = find("about");
    const work = find("work");
    const projects = find("projects");
    const education = find("education");
    const contact = find("contact");

    /* line starts pinned to the desk stationery, which is laid out in
       viewport % of the hero's parked last frame (= the wrap's first 100vh):
       red at the pencil's graphite tip, blue just under the coffee ring */
    const vh = window.innerHeight * s;
    const redStart = { x: 8, y: vh * 0.33 };
    const blueStart = { x: 85, y: vh * 0.09 + u * 7 };

    const next: Line[] = [];
    if (about && work && projects && contact) {
      next.push({
        color: "var(--pencil-red)",
        ...redPath(redStart, about, work, projects, contact, u),
      });
    }
    if (education) {
      next.push({ color: "var(--pencil-blue)", ...bluePath(blueStart, education, u) });
    }
    setPaths(next);
  }, [dims]);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start 0.8", "end end"],
  });

  // drawing follows the scroll both ways: down draws, up erases
  const spring = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 22,
    restDelta: 0.001,
  });
  /* ?plines skips the scroll-linked drawing — full lines right away, used to
     eyeball loop placement on any viewport without scrolling */
  const full = new URLSearchParams(window.location.search).has("plines");

  const viewH = dims ? (100 * dims.h) / dims.w : 0;
  const vpH = dims ? (100 * window.innerHeight) / dims.w : 0; // viewport height in user units
  const strokeWidth = dims ? (3 * 100) / dims.w : 0; // ~3px on screen, in user units

  /*
   * Perf note: the scroll-linked pathLength drawing repaints this page-tall
   * SVG layer while the lines are being drawn — it's the most expensive
   * paint on the site, kept deliberately because the effect is worth it.
   */
  return (
    <div ref={wrapRef} className={styles.wrap} aria-hidden="true">
      {dims && paths.length > 0 && (
        <svg
          className={styles.svg}
          viewBox={`0 0 100 ${viewH.toFixed(1)}`}
          preserveAspectRatio="none"
        >
          {paths.map((line) => (
            <PencilPath
              key={line.color}
              line={line}
              spring={spring}
              viewH={viewH}
              vpH={vpH}
              strokeWidth={strokeWidth}
              full={full}
            />
          ))}
        </svg>
      )}
    </div>
  );
}
