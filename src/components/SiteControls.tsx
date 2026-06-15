import { useSite } from '../i18n';
import styles from './SiteControls.module.css';

/* fixed hand-drawn panel: flip the theme, flip the language.
   Stays in the top-right corner across every section. */
export default function SiteControls() {
  const { theme, lang, toggleTheme, toggleLang } = useSite();

  return (
    <div className={styles.panel}>
      <button
        type="button"
        className={styles.btn}
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        title={theme === 'dark' ? 'light' : 'dark'}
      >
        {theme === 'dark' ? '☀' : '☾'}
      </button>
      <button
        type="button"
        className={`${styles.btn} ${styles.lang}`}
        onClick={toggleLang}
        aria-label="Switch language"
        title={lang === 'en' ? 'Русский' : 'English'}
      >
        {lang === 'en' ? 'EN' : 'RU'}
      </button>
    </div>
  );
}
