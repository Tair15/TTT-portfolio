import { useEffect, useRef, type RefObject } from 'react';
import styles from './ProjectsPlayer.module.css';

/* The hero from the libGDX game runs out of the Samsung card and slowly
   chases the cursor — but only once the reader has scrolled the Projects
   section into view, and never beyond the section's own bounds. */

const SPRITE = 64; // 32px frame shown at 2x
const RUN_ROW = 1; // row 1 of the sheet = side-view run cycle (faces left)
const RUN_FRAMES = 6; // frames 0..5 in that row
const FRAME_MS = 110; // time per run frame
const SPEED = 95; // px per second — fixed, unhurried jog (no easing)
const STOP_DIST = 3; // within this of the cursor he stops and stands still
const START_DELAY = 1100; // wait after the section appears before he sets off

type Props = {
  sectionRef: RefObject<HTMLElement | null>;
  cardRef: RefObject<HTMLElement | null>;
};

export default function ProjectsPlayer({ sectionRef, cardRef }: Props) {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elRef.current;
    const section = sectionRef.current;
    if (!el || !section) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    // position state, in section-local coordinates
    const pos = { x: 0, y: 0 };
    let placed = false; // has he been seeded at the card centre yet?
    let active = false; // is the section in view (loop running)?
    let facingRight = false;
    let frame = 0;
    let frameAcc = 0;
    let lastT = 0;
    let raf = 0;

    // latest cursor position in viewport coordinates
    const mouse = { x: 0, y: 0, seen: false };
    const onMouse = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.seen = true;
    };

    const seedAtCard = () => {
      const sRect = section.getBoundingClientRect();
      const card = cardRef.current;
      const cRect = card ? card.getBoundingClientRect() : sRect;
      pos.x = cRect.left - sRect.left + cRect.width / 2 - SPRITE / 2;
      pos.y = cRect.top - sRect.top + cRect.height / 2 - SPRITE / 2;
      placed = true;
      el.classList.add(styles.visible);
    };

    const draw = () => {
      const col = frame % RUN_FRAMES;
      el.style.backgroundPosition = `${-col * SPRITE}px ${-RUN_ROW * SPRITE}px`;
      el.style.transform = `translate(${pos.x}px, ${pos.y}px) scaleX(${facingRight ? -1 : 1})`;
    };

    const tick = (t: number) => {
      if (!active) return;
      const dt = lastT ? t - lastT : 16;
      lastT = t;

      const sRect = section.getBoundingClientRect();
      // target = cursor, clamped so he can never leave the section
      let tx = pos.x;
      let ty = pos.y;
      if (mouse.seen) {
        tx = mouse.x - sRect.left - SPRITE / 2;
        ty = mouse.y - sRect.top - SPRITE / 2;
      }
      tx = Math.max(0, Math.min(tx, sRect.width - SPRITE));
      ty = Math.max(0, Math.min(ty, sRect.height - SPRITE));

      // move at a constant speed toward the cursor, regardless of distance
      const toX = tx - pos.x;
      const toY = ty - pos.y;
      const dist = Math.hypot(toX, toY);
      const step = (SPEED * dt) / 1000;
      const moving = dist > STOP_DIST;
      if (moving) {
        if (step >= dist) {
          pos.x = tx;
          pos.y = ty;
        } else {
          pos.x += (toX / dist) * step;
          pos.y += (toY / dist) * step;
        }
        if (Math.abs(toX) > 0.5) facingRight = toX > 0;
        frameAcc += dt;
        while (frameAcc >= FRAME_MS) {
          frame = (frame + 1) % RUN_FRAMES;
          frameAcc -= FRAME_MS;
        }
      } else {
        frame = 0; // stand on the first frame when he's caught up
      }

      draw();
      raf = requestAnimationFrame(tick);
    };

    let startTimer = 0;
    const start = () => {
      if (active || startTimer) return;
      // hold for a beat after the section appears, then he sets off
      startTimer = window.setTimeout(() => {
        startTimer = 0;
        if (!placed) seedAtCard();
        draw();
        active = true;
        lastT = 0;
        raf = requestAnimationFrame(tick);
      }, START_DELAY);
    };
    const stop = () => {
      if (startTimer) {
        clearTimeout(startTimer);
        startTimer = 0;
      }
      active = false;
      cancelAnimationFrame(raf);
    };

    // only chase while the Projects section is actually on screen
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0.25 },
    );
    io.observe(section);
    window.addEventListener('mousemove', onMouse);

    return () => {
      io.disconnect();
      window.removeEventListener('mousemove', onMouse);
      stop();
    };
  }, [sectionRef, cardRef]);

  return <div ref={elRef} className={styles.player} aria-hidden="true" />;
}
