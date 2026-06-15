import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import logo from '../assets/logo2.svg';
import HeroDoodles from './decor/HeroDoodles';
import DeskStationery from './decor/DeskStationery';
import { useT } from '../i18n';
import styles from './Hero.module.css';

function BusinessCard({ role }: { role: string }) {
  return (
    <>
      <div className={styles.cardFront}>
        <div className={styles.cardTop}>
          <p className={styles.phone}>+7 775 8343360</p>
          <img src={logo} alt="Taiyr Taishanov logo" className={styles.cornerLogo} />
        </div>
        <div className={styles.cardCenter}>
          <h1 className={styles.name}>Taiyr Taishanov</h1>
          <p className={styles.role}>{role}</p>
        </div>
        <div className={styles.cardBottom}>
          <p>taishanovt@gmail.com</p>
          <p>Telegram: @TaishanovT</p>
        </div>
      </div>
      <div className={styles.cardBack}>
        <img src={logo} alt="" className={styles.backLogo} />
      </div>
    </>
  );
}

export default function Hero() {
  const t = useT();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // spring-smoothed progress: wheel steps, trackpad and touch all feel the same
  const progress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 22,
    mass: 0.5,
    restDelta: 0.0005,
  });

  // ease-out so the landing feels physical, not linear
  const eased = useTransform(progress, (p) => 1 - (1 - p) * (1 - p));

  // desk plane: camera tilts from 45° down to 0° while zooming in.
  // The zoom is a real scale of the whole surface (grid cells 30px -> 80px),
  // so the doodles painted on it grow and leave the frame together with
  // the cells instead of looking like a separate layer.
  const gridRotateX = useTransform(eased, [0, 1], [45, 0]);
  const surfaceScale = useTransform(eased, (p) => (30 + 50 * p) / 30);
  const surfaceY = useTransform(eased, (p) => `${-10 + 10 * p}%`);
  // crossfade into the real notebook paper at the end of the fall
  const gridOpacity = useTransform(progress, [0.8, 1], [1, 0]);
  // ...and the desk stationery settles in as the grid plane dissolves
  const deskOpacity = useTransform(progress, [0.82, 1], [0, 1]);
  const deskY = useTransform(progress, [0.82, 1], [14, 0]);

  // the card falls, flips once and lands face-up on the right;
  // the landing offset keeps the bigger card fully on screen
  const scale = useTransform(eased, [0, 1], [1, 0.52]);
  const x = useTransform(eased, (p) => `${p * 25}vw`);
  const y = useTransform(eased, (p) => `${p * 20}vh`);
  const rotateX = useTransform(eased, (p) => Math.sin(p * Math.PI) * 55);
  const rotateY = useTransform(eased, (p) => Math.sin(p * Math.PI) * 180);
  const rotateZ = useTransform(eased, (p) => Math.sin(p * Math.PI) * 22);

  const hintOpacity = useTransform(progress, [0, 0.12], [1, 0]);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.sticky}>
        <motion.div
          className={styles.gridPlane}
          style={{
            transformPerspective: 1200,
            rotateX: gridRotateX,
            opacity: gridOpacity,
          }}
        >
          {/* the desk surface: fixed 30px cells + doodles, zoomed as one piece */}
          <motion.div className={styles.surface} style={{ scale: surfaceScale, y: surfaceY }}>
            <HeroDoodles />
          </motion.div>
        </motion.div>
        <DeskStationery opacity={deskOpacity} y={deskY} />
        <div className={styles.cardViewport}>
          <motion.div
            className={styles.card}
            style={{ x, y, scale, rotateX, rotateY, rotateZ }}
          >
            <BusinessCard role={t.hero.role} />
          </motion.div>
        </div>
        <motion.div className={styles.scrollHint} style={{ opacity: hintOpacity }}>
          <span>{t.hero.scroll}</span>
          <svg viewBox="0 0 40 60" className={styles.hintArrow} aria-hidden="true">
            <path
              d="M20 4 C 17 18, 23 28, 19 44 M19 44 l -7 -9 M19 44 l 9 -7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
