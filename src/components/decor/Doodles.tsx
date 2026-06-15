import type { CSSProperties } from 'react';

/*
 * Small hand-drawn decorations scattered around the notebook:
 * ink blots, pencil scribbles, and half-erased words.
 * All purely decorative — positioned by the caller via `style`.
 */

type DoodleProps = {
  style?: CSSProperties;
  className?: string;
};

export function InkBlot({ style, className }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      style={{ position: 'absolute', width: 70, pointerEvents: 'none', ...style }}
      className={className}
      aria-hidden="true"
    >
      <path
        d="M48 22 C 64 14, 80 26, 76 42 C 88 46, 88 62, 74 66 C 76 80, 58 88, 48 78 C 36 90, 18 80, 24 66 C 10 62, 12 44, 26 42 C 22 28, 36 18, 48 22 Z"
        fill="#1c1c1c"
        opacity="0.45"
      />
      <circle cx="84" cy="30" r="4" fill="#1c1c1c" opacity="0.4" />
      <circle cx="90" cy="44" r="2.4" fill="#1c1c1c" opacity="0.35" />
      <circle cx="16" cy="76" r="3" fill="#1c1c1c" opacity="0.3" />
    </svg>
  );
}

export function Smudge({ style, className }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 120 40"
      style={{ position: 'absolute', width: 110, pointerEvents: 'none', ...style }}
      className={className}
      aria-hidden="true"
    >
      <path
        d="M8 22 C 30 12, 50 30, 70 18 C 88 8, 104 24, 114 16"
        fill="none"
        stroke="#1c1c1c"
        strokeWidth="9"
        strokeLinecap="round"
        opacity="0.08"
      />
      <path
        d="M14 28 C 34 20, 56 34, 78 24 C 92 18, 102 28, 110 24"
        fill="none"
        stroke="#1c1c1c"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.06"
      />
    </svg>
  );
}

export function Scribble({ style, className, color = '#8a8a8a' }: DoodleProps & { color?: string }) {
  return (
    <svg
      viewBox="0 0 140 60"
      style={{ position: 'absolute', width: 120, pointerEvents: 'none', ...style }}
      className={className}
      aria-hidden="true"
    >
      <path
        d="M6 40 C 20 10, 30 50, 44 24 C 56 2, 64 46, 80 26 C 94 10, 100 44, 116 30 C 124 23, 130 28, 134 22"
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}

/* wobbly hand-drawn underline for headings */
export function ScribbleUnderline({ style, className, color = 'var(--pencil-red)' }: DoodleProps & { color?: string }) {
  return (
    <svg
      viewBox="0 0 200 14"
      preserveAspectRatio="none"
      style={{ display: 'block', width: '100%', height: 12, ...style }}
      className={className}
      aria-hidden="true"
    >
      <path
        d="M4 8 C 40 3, 80 11, 120 6 S 180 9, 196 5"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path
        d="M10 11 C 50 7, 95 13, 140 9 S 184 12, 194 9"
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );
}

/* a word that was written and (mostly) erased — smeared remains */
export function EraserWord({ children, style, className }: DoodleProps & { children: string }) {
  return (
    <span className={`eraser-mark ${className ?? ''}`} style={style}>
      {children}
    </span>
  );
}
