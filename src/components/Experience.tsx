import { useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AituLogo from './AituLogo';
import { Scribble, InkBlot, ScribbleUnderline } from './decor/Doodles';
import SelfWriting from './decor/SelfWriting';
import { useT } from '../i18n';
import styles from './Experience.module.css';

/* the translated text (title, position, dates, bullets) lives in i18n;
   these structural bits are merged with it by index */
type EntryMeta = {
  logo?: string; // public/ path
  spinLogo?: boolean; // logo slowly spins all the time
  customLogo?: 'aitu';
  photo?: string; // public/ path — image glued into the polaroid
};

type Entry = EntryMeta & {
  title: string;
  position: string;
  dates: string;
  bullets?: readonly string[];
};

/* real data from the CV (Таишанов_Тайыр_CV_RU_v3.pdf) */
const WORK_META: EntryMeta[] = [
  { logo: './aix-logo.svg', photo: './aix.jpg' },
  { logo: './nitec-logo.svg', photo: './nit.jpg', spinLogo: true },
  { logo: './upskill-logo.webp' },
];

const EDU_META: EntryMeta[] = [
  { customLogo: 'aitu', photo: './aitu.jpg' },
  { logo: './enu-logo.gif', photo: './enu.jpg'},
];

/* dates circled with a sketched pencil ellipse */
function SketchEllipse({ children, color }: { children: ReactNode; color: string }) {
  return (
    <span className={styles.ellipseWrap}>
      <svg className={styles.ellipseSvg} viewBox="5 10 90 20" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M12 20 C 10 9, 32 4, 52 5 C 76 6, 92 11, 91 20 C 90 30, 70 36, 47 35 C 26 34, 8 31, 11 17"
          fill="none"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.65"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {children}
    </span>
  );
}

/* squiggly hand-drawn timeline that the entries hang off */
function Timeline({ color }: { color: string }) {
  return (
    <motion.svg
      className={styles.timeline}
      viewBox="0 0 12 300"
      preserveAspectRatio="none"
      aria-hidden="true"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      {/* no pathLength draw here: dash animation glitches in Chromium when the
          viewBox is stretched non-uniformly (preserveAspectRatio="none") */}
      <path
        d="M 6 0 C 7.5 30, 4 65, 6 95 S 7.5 160, 5 195 S 7.5 260, 6 300"
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.5"
        vectorEffect="non-scaling-stroke"
      />
    </motion.svg>
  );
}

/* sketched knot pinning an entry to the timeline */
function Knot({ color }: { color: string }) {
  return (
    <svg className={styles.knot} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="7" fill="var(--paper)" />
      <path
        d="M12 5 C 17 5, 20 9, 19 13 C 18 18, 13 20, 9 18 C 5 16, 4 10, 8 7 C 9.5 5.8, 11 5, 13 5.4"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.75"
      />
    </svg>
  );
}

type TapeSide = 'left' | 'right';

/* where a dropped polaroid starts its fall (viewport coords) */
type FallStart = {
  left: number;
  top: number;
  height: number;
  rotate: number;
  photo?: string;
};

type FallenPhoto = FallStart & {
  id: number;
  drift: number;
  finalRotate: number;
  rest: number;
};

/* empty polaroid (photo to be glued in later) taped to the page;
   peel one tape — it dangles and wobbles, peel both — it drops off */
function PhotoTab({
  index,
  photo,
  onFall,
}: {
  index: number;
  photo?: string;
  onFall: (start: FallStart) => void;
}) {
  const baseRot = index % 2 === 0 ? 3.2 : -2.6;
  const frameRef = useRef<HTMLDivElement>(null);
  const [peeled, setPeeled] = useState<TapeSide[]>([]);

  const fallen = peeled.length === 2;
  const dangling = peeled.length === 1;
  /* hanging off the remaining tape, the photo tilts away from it */
  const hangRot = dangling ? (peeled[0] === 'left' ? baseRot - 8 : baseRot + 8) : baseRot;
  const origin = dangling ? (peeled[0] === 'left' ? '88% 0%' : '12% 0%') : '50% 50%';

  const peel = (side: TapeSide) => {
    if (peeled.includes(side) || fallen) return;
    if (peeled.length === 1) {
      const rect = frameRef.current?.getBoundingClientRect();
      if (rect) onFall({ left: rect.left, top: rect.top, height: rect.height, rotate: hangRot, photo });
    }
    setPeeled([...peeled, side]);
  };

  return (
    <motion.div
      ref={frameRef}
      className={styles.photo}
      style={{ transformOrigin: origin, pointerEvents: fallen ? 'none' : undefined }}
      initial={{ rotate: baseRot }}
      animate={
        fallen
          ? { opacity: 0 }
          : dangling
            ? { rotate: [baseRot, hangRot + 7, hangRot - 5, hangRot + 3, hangRot - 2, hangRot] }
            : { rotate: baseRot }
      }
      transition={
        fallen ? { duration: 0 } : dangling ? { duration: 1.4, ease: 'easeInOut' } : undefined
      }
    >
      <AnimatePresence>
        {!peeled.includes('left') && (
          <motion.button
            key="tape-left"
            type="button"
            className={`${styles.tape} ${styles.tapeLeft}`}
            aria-label="оторвать скотч"
            onClick={() => peel('left')}
            initial={{ rotate: -38 }}
            whileHover={{ rotate: -30, scale: 1.15 }}
            exit={{ opacity: 0, x: -14, y: -20, rotate: -80, transition: { duration: 0.3 } }}
          />
        )}
        {!peeled.includes('right') && (
          <motion.button
            key="tape-right"
            type="button"
            className={`${styles.tape} ${styles.tapeRight}`}
            aria-label="оторвать скотч"
            onClick={() => peel('right')}
            initial={{ rotate: 38 }}
            whileHover={{ rotate: 30, scale: 1.15 }}
            exit={{ opacity: 0, x: 14, y: -20, rotate: 80, transition: { duration: 0.3 } }}
          />
        )}
      </AnimatePresence>
      <div className={styles.photoArea} style={photoAreaStyle(photo)} />
    </motion.div>
  );
}

/* fill the polaroid with the entry photo (cover-cropped), or leave it blank */
function photoAreaStyle(photo?: string) {
  return photo
    ? { backgroundImage: `url(${photo})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : undefined;
}

/* a dropped polaroid: falls from where it was taped, bounces once,
   stays lying at the bottom of the screen and can be dragged around */
function FallingPhoto({ photo }: { photo: FallenPhoto }) {
  const floorTop = window.innerHeight - photo.height - photo.rest;
  const dropY = Math.max(floorTop - photo.top, 0);
  return (
    <motion.div
      className={`${styles.photo} ${styles.fallenPhoto}`}
      style={{ left: photo.left, bottom: photo.rest }}
      initial={{ y: -dropY, x: 0, rotate: photo.rotate }}
      animate={{ y: [-dropY, 0, -24, 0], x: photo.drift, rotate: photo.finalRotate }}
      transition={{
        y: { duration: 1.15, times: [0, 0.6, 0.78, 1], ease: ['easeIn', 'easeOut', 'easeIn'] },
        x: { duration: 1.15, ease: 'easeOut' },
        rotate: { duration: 1.15, ease: 'easeOut' },
      }}
      drag
      dragTransition={{ power: 0.15, timeConstant: 180 }}
      whileDrag={{ scale: 1.07 }}
    >
      <div className={styles.photoArea} style={photoAreaStyle(photo.photo)} />
    </motion.div>
  );
}

function ExperienceItem({
  entry,
  index,
  color,
  onPhotoFall,
}: {
  entry: Entry;
  index: number;
  color: string;
  onPhotoFall?: (start: FallStart) => void;
}) {
  const logoLabel = useT().experience.logo;
  return (
    <motion.div
      className={styles.item}
      style={{ rotate: index % 2 === 0 ? -0.7 : 0.6 }}
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.15 }}
      whileHover={{ x: 5, rotate: 0 }}
    >
      <Knot color={color} />
      <div className={styles.itemBody}>
        <div className={styles.itemHeader}>
          {entry.customLogo === 'aitu' ? (
            <div className={styles.aituWrap}>
              <AituLogo />
            </div>
          ) : entry.logo ? (
            <motion.img
              src={entry.logo}
              alt={entry.title}
              className={styles.logo}
              animate={entry.spinLogo ? { rotate: 360 } : undefined}
              transition={entry.spinLogo ? { repeat: Infinity, ease: 'linear', duration: 6 } : undefined}
              whileHover={
                entry.spinLogo ? undefined : { rotate: [0, -8, 8, -4, 0], transition: { duration: 0.5 } }
              }
            />
          ) : (
            <div className={styles.logoPlaceholder}>{logoLabel}</div>
          )}
          {entry.title && (
            <h3 className={styles.itemTitle}>
              <span className={styles.highlight}>{entry.title}</span>
            </h3>
          )}
        </div>
        <p className={styles.itemPosition}>{entry.position}</p>
        {entry.bullets && (
          <ul className={styles.bullets}>
            {entry.bullets.map((bullet) => (
              <li key={bullet}>
                <SelfWriting text={bullet} />
              </li>
            ))}
          </ul>
        )}
        <p className={styles.itemDates}>
          <SketchEllipse color={color}>{entry.dates}</SketchEllipse>
        </p>
      </div>
      {onPhotoFall && <PhotoTab index={index} photo={entry.photo} onFall={onPhotoFall} />}
    </motion.div>
  );
}

export default function Experience() {
  const t = useT();
  const [fallen, setFallen] = useState<FallenPhoto[]>([]);

  const work: Entry[] = WORK_META.map((m, i) => ({ ...m, ...t.experience.workItems[i] }));
  const education: Entry[] = EDU_META.map((m, i) => ({ ...m, ...t.experience.eduItems[i] }));

  const dropPhoto = (start: FallStart) =>
    setFallen((prev) => [
      ...prev,
      {
        ...start,
        id: prev.length,
        /* tossed aside: lands somewhere random across the bottom of the screen */
        drift: 30 + Math.random() * Math.max(window.innerWidth - 200, 0) - start.left,
        finalRotate: start.rotate + (Math.random() - 0.5) * 160,
        rest: Math.random() * 28,
      },
    ]);

  return (
    <section className={styles.section} id="experience">
      <div className={styles.column}>
        <h2 className={styles.columnTitle} data-pencil="work">
          {t.experience.work}
          <ScribbleUnderline color="var(--pencil-blue)" />
        </h2>
        <div className={styles.list}>
          <Timeline color="var(--pencil-blue)" />
          {work.map((entry, i) => (
            <ExperienceItem
              key={entry.title}
              entry={entry}
              index={i}
              color="var(--pencil-blue)"
              onPhotoFall={dropPhoto}
            />
          ))}
        </div>
      </div>

      <div className={styles.column}>
        <h2 className={styles.columnTitle} data-pencil="education">
          {t.experience.education}
          <ScribbleUnderline color="var(--pencil-green)" />
        </h2>
        <div className={styles.list}>
          <Timeline color="var(--pencil-green)" />
          {education.map((entry, i) => (
            <ExperienceItem
              key={entry.title}
              entry={entry}
              index={i}
              color="var(--pencil-green)"
              onPhotoFall={dropPhoto}
            />
          ))}
        </div>
      </div>

      <Scribble style={{ right: '8%', bottom: '10%', transform: 'rotate(-12deg)' }} />
      <InkBlot style={{ left: '46%', top: '4%', width: 44, transform: 'rotate(80deg)' }} />

      {/* polaroids that were peeled off lie around at the bottom of the screen */}
      {fallen.map((photo) => (
        <FallingPhoto key={photo.id} photo={photo} />
      ))}
    </section>
  );
}
