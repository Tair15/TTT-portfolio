import { useRef } from 'react';
import { motion } from 'framer-motion';
import { InkBlot, Scribble, ScribbleUnderline, EraserWord } from './decor/Doodles';
import SelfWriting from './decor/SelfWriting';
import ProjectsPlayer from './decor/ProjectsPlayer';
import { useT } from '../i18n';
import styles from './Projects.module.css';

/* structural data — title & description come from the translations,
   merged with these by index */
type ProjectMeta = {
  tags: string[];
  link?: string;
  image?: string;
  game?: boolean; // the Samsung card the hero runs out of
};

const PROJECT_META: ProjectMeta[] = [
  { tags: ['Java', 'libGDX', 'game'], image: './wokaks-journey.jpg', game: true },
  { tags: ['React', 'Solana', 'Smart contracts'] },
];

export default function Projects() {
  const t = useT();
  const sectionRef = useRef<HTMLElement>(null);
  const gameCardRef = useRef<HTMLElement>(null);

  return (
    <section className={styles.section} id="projects" ref={sectionRef}>
      <ProjectsPlayer sectionRef={sectionRef} cardRef={gameCardRef} />

      <h2 className={styles.title} data-pencil="projects">
        {t.projects.title}
        <ScribbleUnderline color="var(--pencil-orange)" />
      </h2>

      <div className={styles.grid}>
        {PROJECT_META.map((meta, i) => {
          const project = t.projects.items[i];
          return (
            <motion.article
              key={i}
              ref={meta.game ? gameCardRef : undefined}
              className={styles.card}
              style={{ rotate: i % 2 === 0 ? -1.4 : 1.2 }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.1 }}
              whileHover={{ rotate: 0, scale: 1.03 }}
            >
              <span className={styles.tape} aria-hidden="true" />
              {meta.image ? (
                <img
                  className={styles.screenshot}
                  src={meta.image}
                  alt={project.title}
                  loading="lazy"
                />
              ) : (
                // no placeholder images by design — labeled blank frame instead
                <div className={styles.screenshot}>{t.projects.screenshot}</div>
              )}
              <h3 className={styles.cardTitle}>{project.title}</h3>
              <p className={styles.cardText}>
                <SelfWriting text={project.description} />
              </p>
              <div className={styles.tags}>
                {meta.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </motion.article>
          );
        })}
      </div>

      <p className={styles.margin}>
        {t.projects.morePre}
        <EraserWord>{t.projects.moreErase}</EraserWord>
        {t.projects.morePost}
      </p>

      <InkBlot style={{ left: '6%', top: '10%', width: 50, transform: 'rotate(-30deg)' }} />
      <Scribble style={{ right: '10%', top: '6%', transform: 'rotate(8deg)' }} color="var(--pencil-blue)" />
    </section>
  );
}
