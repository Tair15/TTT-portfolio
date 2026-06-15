import { motion } from 'framer-motion';
import { InkBlot, ScribbleUnderline, EraserWord, Smudge } from './decor/Doodles';
import SelfWriting from './decor/SelfWriting';
import { useT } from '../i18n';
import styles from './About.module.css';

export default function About() {
  const t = useT();
  return (
    <section className={styles.section} id="about">
      <motion.div
        className={styles.text}
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <h2 className={styles.title} data-pencil="about">
          {t.about.title}
          <ScribbleUnderline />
        </h2>
        <p className={styles.paragraph}>
          <SelfWriting text={t.about.paragraph} tailWords={10} />
        </p>
        <p className={styles.note}>
          {t.about.notePre}
          <EraserWord>{t.about.noteErase}</EraserWord>
          {t.about.notePost}
        </p>
      </motion.div>

      <motion.div
        className={styles.illustration}
        initial={{ opacity: 0, rotate: -6 }}
        whileInView={{ opacity: 1, rotate: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
      >
        <img
          src="./pencil-shavings.png"
          alt="pencil shavings"
          className={styles.shavings}
        />
      </motion.div>

      <InkBlot style={{ right: '12%', top: '8%', transform: 'rotate(24deg)' }} />
      <Smudge style={{ left: '18%', bottom: '6%' }} />
    </section>
  );
}
