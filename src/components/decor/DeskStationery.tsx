import type { CSSProperties } from 'react';
import { motion, type MotionValue } from 'framer-motion';
import { CoffeeStain } from './HeroDoodles';
import styles from './DeskStationery.module.css';

/*
 * Stationery lying on the desk that the business card lands on. The layer
 * fades in on the last stretch of the hero scroll — exactly while the tilted
 * grid plane fades out — so the card ends up on a real, lived-in desk.
 * The card rests right-of-center, lower half; everything here keeps to the
 * left side and the top so nothing hides under it.
 */

const PENCIL = '#8a8a8a';

type P = { style?: CSSProperties };

/* a wooden pencil lying flat, sharpened end to the left */
function Pencil({ style }: P) {
  return (
    <svg viewBox="0 0 240 56" className={styles.item} style={style} aria-hidden="true">
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* hexagonal body, slightly wobbly */}
        <g stroke="var(--pencil-orange)" strokeWidth="2.6" opacity="0.75">
          <path d="M52 16 C 100 14, 150 15, 198 16" />
          <path d="M52 40 C 102 42, 152 41, 198 40" />
          <path d="M54 28 C 102 27, 150 28, 197 28" opacity="0.5" />
        </g>
        {/* sharpened wooden tip with graphite */}
        <g stroke={PENCIL} strokeWidth="2.4" opacity="0.7">
          <path d="M52 16 C 38 20, 26 25, 14 28 C 26 31, 38 36, 52 40" />
        </g>
        <path d="M23 25.5 C 18 27, 15 27.6, 14 28 C 15 28.4, 18 29.2, 23 30.5" stroke="#444" strokeWidth="2.6" opacity="0.8" />
        {/* ferrule and eraser end */}
        <g stroke={PENCIL} strokeWidth="2.2" opacity="0.6">
          <path d="M198 16 C 197 24, 197 32, 198 40" />
          <path d="M206 15.5 C 205 24, 205 32, 206 40.5" />
        </g>
        <path
          d="M206 16 C 222 15, 230 20, 230 28 C 230 36, 222 41, 206 40"
          stroke="#d98a96"
          strokeWidth="2.6"
          opacity="0.7"
        />
      </g>
    </svg>
  );
}

function Paperclip({ style }: P) {
  return (
    <svg viewBox="0 0 40 90" className={styles.item} style={style} aria-hidden="true">
      <path
        d="M12 70 C 12 80, 27 81, 27.5 69 L 28 18 C 28 7, 13 7, 13.5 17 L 13 58 C 13 65, 21.5 66, 21.5 59 L 22 22"
        fill="none"
        stroke="var(--pencil-blue)"
        strokeWidth="2.8"
        strokeLinecap="round"
        opacity="0.65"
      />
    </svg>
  );
}

/* a well-used eraser with a few crumbs around it */
function Eraser({ style }: P) {
  return (
    <svg viewBox="0 0 110 72" className={styles.item} style={style} aria-hidden="true">
      <g fill="none" stroke={PENCIL} strokeLinecap="round">
        <path
          d="M14 26 C 38 18, 70 12, 96 18 C 99 30, 99 38, 96 46 C 68 52, 38 56, 12 50 C 10 42, 11 34, 14 26 Z"
          strokeWidth="2.6"
          opacity="0.7"
        />
        <path d="M16 38 C 40 34, 68 30, 94 32" strokeWidth="2" opacity="0.35" />
        {/* crumbs */}
        <g strokeWidth="2.4" opacity="0.45">
          <path d="M22 62 C 24 61.5, 25 61.5, 27 62" />
          <path d="M44 66 C 45 65.6, 46 65.6, 47 66" />
          <path d="M70 62 C 72 61.5, 73 61.5, 74 62" />
        </g>
      </g>
    </svg>
  );
}

export default function DeskStationery({ opacity, y }: { opacity: MotionValue<number>; y: MotionValue<number> }) {
  return (
    <motion.div className={styles.layer} style={{ opacity, y }} aria-hidden="true">
      <CoffeeStain style={{ right: '10%', top: '9%', width: 'clamp(110px, 10vw, 170px)' }} />
      <Pencil style={{ left: '7%', top: '26%', width: 'clamp(180px, 19vw, 290px)', transform: 'rotate(-16deg)' }} />
      <img
        src="./pencil-shavings.png"
        alt=""
        className={styles.shavings}
        style={{ left: '8%', top: '38%', width: 'clamp(56px, 5.5vw, 84px)', transform: 'rotate(-28deg)' }}
      />
      <Paperclip style={{ left: '32%', top: '11%', width: 'clamp(22px, 2.4vw, 34px)', transform: 'rotate(26deg)' }} />
      <Paperclip style={{ left: '42%', bottom: '14%', width: 'clamp(20px, 2.2vw, 30px)', transform: 'rotate(-58deg)' }} />
      <Eraser style={{ left: '14%', bottom: '16%', width: 'clamp(70px, 7vw, 105px)', transform: 'rotate(7deg)' }} />
    </motion.div>
  );
}
