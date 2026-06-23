import { motion } from 'framer-motion';
import { InkBlot, ScribbleUnderline, Smudge } from './decor/Doodles';
import { useSite, useT } from '../i18n';
import styles from './Contact.module.css';

/* CV pdfs live in public/; the one matching the current language is offered
   first, the other stays one click away */
const CV = { en: './cv-en.pdf', ru: './cv-ru.pdf' } as const;

/*
 * Open-slot section: skills as sticky notes + how to reach me.
 * Chosen over a contact form because the site has no backend —
 * direct links (mailto / telegram / phone) always work on GitHub Pages.
 * Labels come from the translations; tech names, links and colours stay here.
 */

const SKILL_NOTES = [
  { items: ['Angular','React', 'TypeScript', 'JavaScript', 'HTML / CSS'], color: '#fff8b8', rotate: -2.5 },
  { items: ['Framer Motion', 'CSS keyframes', 'scroll-driven UI'], color: '#d2f1e4', rotate: 1.8 },
  { items: ['Git', 'GitLab', 'VS Code'], color: '#fde2e4', rotate: -1.2 },
];

const CONTACTS = [
  { value: 'taishanovt@gmail.com', href: 'mailto:taishanovt@gmail.com' },
  { value: '@TaishanovT', href: 'https://t.me/TaishanovT' },
  { value: '+7 775 8343360', href: 'tel:+77758343360' },
];

export default function Contact() {
  const t = useT();
  const { lang } = useSite();
  const otherLang = lang === 'en' ? 'ru' : 'en';
  return (
    <section className={styles.section} id="contact">
      <div className={styles.skills}>
        <h2 className={styles.title}>
          {t.contact.skills}
          <ScribbleUnderline color="var(--pencil-green)" />
        </h2>
        <div className={styles.notes}>
          {SKILL_NOTES.map((note, i) => (
            <motion.div
              key={i}
              className={styles.note}
              style={{ backgroundColor: note.color, rotate: note.rotate }}
              initial={{ opacity: 0, y: 30, rotate: note.rotate - 6 }}
              whileInView={{ opacity: 1, y: 0, rotate: note.rotate }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, ease: 'easeOut', delay: i * 0.12 }}
              whileHover={{ rotate: 0, scale: 1.04 }}
            >
              <h3 className={styles.noteTitle}>{t.contact.skillLabels[i]}</h3>
              <ul className={styles.noteList}>
                {note.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      <div className={styles.reach}>
        <h2 className={styles.title} data-pencil="contact">
          {t.contact.contacts}
          <ScribbleUnderline />
        </h2>
        <ul className={styles.contactList}>
          {CONTACTS.map((contact, i) => (
            <li key={contact.value} className={styles.contactItem}>
              <span className={styles.contactLabel}>{t.contact.contactLabels[i]}:</span>
              <a
                href={contact.href}
                className={styles.contactLink}
                target={contact.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
              >
                {contact.value}
              </a>
            </li>
          ))}
        </ul>
        <p className={styles.cvLinks}>
          <a
            href={CV[lang]}
            className={styles.cvButton}
            target="_blank"
            rel="noreferrer"
            download
          >
            {t.contact.cv}
          </a>
          <a
            href={CV[otherLang]}
            className={styles.cvOther}
            target="_blank"
            rel="noreferrer"
            download
          >
            {t.contact.cvOther}
          </a>
        </p>
      </div>

      <InkBlot style={{ right: '6%', bottom: '12%', transform: 'rotate(140deg)' }} />
      <Smudge style={{ left: '40%', top: '4%', transform: 'rotate(-4deg)' }} />
    </section>
  );
}
