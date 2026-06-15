import type { CSSProperties, ReactNode } from 'react';
import { InkBlot, Scribble, Smudge } from './Doodles';
import styles from './HeroDoodles.module.css';

/*
 * Hand-drawn doodles covering the hero "desk" plane. The whole layer is
 * rendered INSIDE the tilting grid plane, so everything lies flat on the
 * desk: tilts at 45° on load, levels out and fades as the card lands.
 * Positions are % of the plane (which is larger than the viewport),
 * kept ~8% away from its borders and spread to cover all of it.
 */

const PENCIL = '#8a8a8a';

type P = { style?: CSSProperties };

function TicTacToe({ style }: P) {
  return (
    <svg viewBox="0 0 100 100" className={styles.doodle} style={style} aria-hidden="true">
      {/* wobbly grid */}
      <g stroke={PENCIL} strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.7">
        <path d="M36 8 C 35 36, 38 66, 36 94" />
        <path d="M66 6 C 67 38, 64 68, 66 95" />
        <path d="M6 37 C 36 36, 68 39, 95 37" />
        <path d="M8 67 C 38 68, 66 65, 94 67" />
      </g>
      {/* X — red pencil */}
      <g stroke="var(--pencil-red)" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.75">
        <path d="M12 12 C 17 18, 23 24, 28 29 M28 12 C 23 18, 17 24, 12 29" />
        <path d="M43 43 C 48 49, 54 55, 59 60 M59 43 C 54 49, 48 55, 43 60" />
        <path d="M74 74 C 79 80, 85 86, 90 91 M90 74 C 85 80, 79 86, 74 91" />
      </g>
      {/* O — blue pencil */}
      <g stroke="var(--pencil-blue)" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.75">
        <path d="M82 12 C 90 13, 92 26, 83 29 C 74 31, 70 18, 79 13" />
        <path d="M20 74 C 28 75, 30 88, 21 91 C 12 93, 8 80, 17 75" />
      </g>
      {/* winning strike */}
      <path
        d="M8 6 C 32 32, 64 62, 96 96"
        stroke="var(--pencil-red)"
        strokeWidth="3.4"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}

export function CoffeeStain({ style }: P) {
  return (
    <svg viewBox="0 0 120 110" className={styles.doodle} style={style} aria-hidden="true">
      <path
        d="M60 10 C 95 8, 112 32, 108 58 C 104 88, 76 102, 52 99 C 24 96, 8 74, 12 48 C 16 24, 34 12, 60 10 Z"
        fill="none"
        stroke="#b08968"
        strokeWidth="7"
        opacity="0.28"
      />
      <path
        d="M62 22 C 88 22, 99 40, 96 58 C 92 80, 72 91, 54 88 C 32 84, 22 66, 26 46"
        fill="none"
        stroke="#b08968"
        strokeWidth="3"
        opacity="0.18"
      />
      <circle cx="104" cy="86" r="4" fill="#b08968" opacity="0.2" />
    </svg>
  );
}

function PaperPlane({ style }: P) {
  return (
    <svg viewBox="0 0 160 110" className={styles.doodle} style={style} aria-hidden="true">
      {/* dashed looping flight path */}
      <path
        d="M6 96 C 40 104, 70 92, 74 74 C 78 58, 56 52, 52 66 C 48 80, 78 84, 100 68 C 112 59, 120 48, 126 38"
        fill="none"
        stroke={PENCIL}
        strokeWidth="2"
        strokeDasharray="6 7"
        strokeLinecap="round"
        opacity="0.55"
      />
      {/* the plane */}
      <g stroke="var(--pencil-blue)" strokeWidth="2.4" strokeLinejoin="round" fill="none" opacity="0.8">
        <path d="M128 34 L 154 14 L 140 44 Z" />
        <path d="M154 14 L 136 36 L 140 44" />
      </g>
    </svg>
  );
}

function Sun({ style }: P) {
  return (
    <svg viewBox="0 0 100 100" className={styles.doodle} style={style} aria-hidden="true">
      <path
        d="M50 30 C 62 30, 70 40, 68 51 C 66 63, 54 70, 43 66 C 33 62, 29 50, 35 40 C 39 33, 44 30, 52 31"
        fill="none"
        stroke="var(--pencil-orange)"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.7"
      />
      <g stroke="var(--pencil-orange)" strokeWidth="2.6" strokeLinecap="round" opacity="0.6">
        <path d="M50 14 C 50 18, 50 20, 50 23" />
        <path d="M76 24 C 73 27, 71 29, 69 31" />
        <path d="M86 50 C 82 50, 80 50, 77 50" />
        <path d="M75 76 C 72 73, 70 71, 68 69" />
        <path d="M50 86 C 50 82, 50 80, 50 77" />
        <path d="M25 75 C 28 72, 30 70, 32 68" />
        <path d="M14 50 C 18 50, 20 50, 23 50" />
        <path d="M25 25 C 28 28, 30 30, 32 32" />
      </g>
    </svg>
  );
}

function CssJoke({ style }: P) {
  return (
    <div className={styles.cssJoke} style={style} aria-hidden="true">
      <span className={styles.crossed}>float: left;</span>
      <span className={styles.fixed}>display: flex; ✓</span>
    </div>
  );
}

function ItsMe({ style }: P) {
  return (
    <div className={styles.itsMe} style={style} aria-hidden="true">
      <span>it's me!</span>
      <svg viewBox="0 0 60 70" className={styles.itsMeArrow}>
        <path
          d="M30 6 C 44 16, 46 34, 32 52 M32 52 l -2 -14 M32 52 l 13 -6"
          fill="none"
          stroke={PENCIL}
          strokeWidth="2.6"
          strokeLinecap="round"
          opacity="0.75"
        />
      </svg>
    </div>
  );
}

function Location({ style }: P) {
  return (
    <div className={styles.location} style={style} aria-hidden="true">
      <svg viewBox="0 0 30 40" className={styles.pin}>
        <path
          d="M15 36 C 8 26, 4 20, 4 13 C 4 6, 9 2, 15 2 C 21 2, 26 6, 26 13 C 26 20, 22 26, 15 36 Z"
          fill="none"
          stroke="var(--pencil-red)"
          strokeWidth="2.6"
          strokeLinejoin="round"
          opacity="0.75"
        />
        <circle cx="15" cy="13" r="4" fill="none" stroke="var(--pencil-red)" strokeWidth="2.4" opacity="0.75" />
      </svg>
      <span>Astana, KZ</span>
    </div>
  );
}

function Note({ style, children }: P & { children: ReactNode }) {
  return (
    <span className={styles.note} style={style} aria-hidden="true">
      {children}
    </span>
  );
}



export default function HeroDoodles() {
  return (
    <div className={styles.layer} aria-hidden="true">
      {/* top band of the desk */}
      <TicTacToe style={{ left: '35%', top: '30%', width: 'clamp(110px, 10vw, 170px)' }} />
      <Scribble style={{ left: '32%', top: '10%', width: 150, transform: 'rotate(6deg)' }} color="var(--pencil-orange)" />
      <ItsMe style={{ left: '60%', top: '48%' }} />
      <InkBlot style={{ left: '58%', top: '9%', width: 64, transform: 'rotate(40deg)' }} />
      <CoffeeStain style={{ right: '9%', top: '8%', width: 'clamp(120px, 11vw, 180px)' }} />
      <Sun style={{ right: '26%', top: '12%', width: 'clamp(80px, 7vw, 120px)' }} />

      {/* middle band */}
      <Note style={{ left: '10%', top: '38%', transform: 'rotate(-6deg)' }}>npm run dev ▸</Note>
      <Smudge style={{ left: '26%', top: '46%' }} />
      <Scribble style={{ left: '11%', top: '55%', transform: 'rotate(-10deg)' }} />
      <Note style={{ right: '10%', top: '42%', transform: 'rotate(3deg)' }}>☕ → code → ☕</Note>
      <InkBlot style={{ right: '24%', top: '52%', width: 48, transform: 'rotate(-15deg)' }} />
      <TicTacToe style={{ right: '9%', top: '56%', width: 'clamp(80px, 7.5vw, 130px)', transform: 'rotate(7deg)' }} />

      {/* bottom band */}
      <PaperPlane style={{ left: '35%', bottom: '30%', width: 'clamp(150px, 14vw, 230px)' }} />
      <CoffeeStain style={{ left: '34%', bottom: '14%', width: 'clamp(90px, 8vw, 140px)', opacity: 0.75, transform: 'rotate(25deg)' }} />
      <CssJoke style={{ left: '52%', bottom: '11%', transform: 'rotate(-2deg)' }} />
      <Note style={{ left: '68%', bottom: '18%', transform: 'rotate(-3deg)' }}>v2.0 ✓</Note>
      <Location style={{ right: '9%', bottom: '10%' }} />
      <Scribble style={{ right: '26%', bottom: '8%', transform: 'rotate(-6deg)' }} color="var(--pencil-blue)" />

    </div>
  );
}
