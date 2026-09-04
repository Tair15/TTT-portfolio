/* eslint-disable react-refresh/only-export-components --
   a context module deliberately exports its provider alongside the
   hooks and translation data that belong with it */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

/* ------------------------------------------------------------------ *
 * Theme + language live in one tiny context. No deps — just React,
 * localStorage and a `data-theme` attribute on <html>. The text that
 * differs per language lives in `translations`; structural data
 * (logos, colours, links) stays in the components and is merged by
 * index with the matching translation array.
 * ------------------------------------------------------------------ */

export type Lang = 'en' | 'ru';
export type Theme = 'light' | 'dark';

export const translations = {
  en: {
    hero: { role: 'frontend developer', scroll: 'scroll' },
    about: {
      title: 'About me',
      paragraph:
        "My name is Taiyr, a frontend developer based in Kazakhstan. I've been " +
        "working since I was 16 and building software since 18, and through all " +
        'those years and projects I always came back to one thing — a notebook. ' +
        'Notes, planning, sketches, ideas: everything started on squared paper ' +
        'first. This site is that habit, turned into an portfolio.',
      notePre: '(yes, the whole site is one big squared notebook ',
      noteErase: 'page',
      notePost: ')',
    },
    projects: {
      title: 'Projects',
      screenshot: 'screenshot — TODO',
      morePre: 'more coming ',
      moreErase: 'son',
      morePost: ' soon…',
      items: [
        {
          title: 'Android game — Samsung Innovation Campus',
          description:
            'A mobile game in Java (libGDX, ECS architecture) that took 1st place among 100+ participants across Kazakhstan in 2024.',
        },
        {
          title: 'Blockchain messenger',
          description:
            'A secure messaging web app built on a blockchain network (React, JavaScript, Solana, smart contracts), using Solana as the backbone for tamper-proof messaging.',
        },
      ],
    },
    experience: {
      work: 'Work experience',  
      education: 'Education',
      logo: 'logo',
      workItems: [
        {
          title: 'Astana International Exchange',
          position: 'Frontend Developer · Angular, TypeScript',
          dates: '03.2026 — present',
          bullets: [
            'real-time market-data dashboards for the Astana International Exchange',
            'refactored the legacy frontend — fewer critical bugs, easier upkeep',
          ],
        },
        {
          title: 'Nitec',
          position: 'Frontend Developer · React, JavaScript, FastAPI',
          dates: '08.2023 — 03.2026',
          bullets: [
            'CRM & WFM modules + integration with the AITU superapp',
            'automated reporting: from 4 hours of manual work to one click',
            'real-time analytics dashboard for contract KPI tracking',
            'split a legacy monolith into microservices',
          ],
        },
        {
          title: 'Bilim Media Group UpSkill',
          position: 'Analyst-Developer · internship',
          dates: '03.2024 — 07.2024',
          bullets: [
            'automated article data extraction & analysis pipelines in Python',
            'uncovered critical dataset inconsistencies and reported them to stakeholders',
          ],
        },
      ],
      eduItems: [
        {
          title: 'AITU',
          position: 'BSc Software Engineering · minor in Finance',
          dates: '2022 — 2025',
          bullets: [
            'GPA 3.6 / 4.0 · graduated with honors',
            'Astana IT University — the leading tech university of Kazakhstan',
          ],
        },
        {
          title: 'Eurasian National University',
          position: 'MSc Artificial Intelligence Technologies',
          dates: '2025 — 2027 (expected)',
          bullets: ['GPA 3.8 / 4.0'],
        },
      ] as Array<{
        title: string;
        position: string;
        dates: string;
        bullets?: string[];
      }>,
    },
    contact: {
      skills: 'Skills',
      contacts: 'Contacts',
      cv: 'Download CV (pdf)',
      cvOther: 'in Russian',
      skillLabels: ['Frontend', 'Animation', 'Tools'],
      contactLabels: ['email', 'telegram', 'phone'],
    },
    footer: 'drawn in a notebook · taiyr taishanov',
  },
  ru: {
    hero: { role: 'фронтенд-разработчик', scroll: 'листай' },
    about: {
      title: 'Обо мне',
      paragraph:
        'Меня зовут Тайыр, я фронтенд-разработчик из Казахстана. Работаю с 16 лет, ' +
        'а разработкой занимаюсь с 18, и все эти годы, какой бы ни была задача, ' +
        'я всегда возвращался к одному — к тетрадке. Заметки, планирование, ' +
        'наброски, идеи: всё сначала появлялось на странице в клетку. Этот сайт — ' +
        'та самая привычка, превращённая в портфолио.',
      notePre: '(да, весь сайт — одна большая страница в клетку ',
      noteErase: 'лист',
      notePost: ')',
    },
    projects: {
      title: 'Проекты',
      screenshot: 'скриншот — скоро',
      morePre: 'скоро ',
      moreErase: 'бдует',
      morePost: ' будет…',
      items: [
        {
          title: 'Android-игра — Samsung Innovation Campus',
          description:
            'Мобильная игра на Java (libGDX, ECS-архитектура), занявшая 1-е место среди 100+ участников по всему Казахстану в 2024 году.',
        },
        {
          title: 'Блокчейн-мессенджер',
          description:
            'Безопасный веб-мессенджер на блокчейне (React, JavaScript, Solana, смарт-контракты) — в качестве основной сети использовал Solana.',
        },
        {
          title: 'Третий проект',
          description: 'TODO: короткое описание проекта будет здесь.',
        },
      ],
    },
    experience: {
      work: 'Опыт работы',
      education: 'Образование',
      logo: 'лого',
      workItems: [
        {
          title: 'Astana International Exchange',
          position: 'Фронтенд-разработчик · Angular, TypeScript',
          dates: '01.2026 — наст. время',
          bullets: [
            'дашборды рыночных данных в реальном времени для Astana International Exchange',
            'рефакторинг легаси-фронтенда — меньше критических багов, проще поддержка',
          ],
        },
        {
          title: 'Nitec',
          position: 'Фронтенд-разработчик · React, JavaScript, FastAPI',
          dates: '08.2023 — 03.2026',
          bullets: [
            'модули CRM и WFM + интеграция с суперприложением AITU',
            'автоматизация отчётности: с 4 часов ручной работы до одного клика',
            'аналитический дашборд в реальном времени для отслеживания KPI по контрактам',
            'разбил легаси-монолит на микросервисы',
          ],
        },
        {
          title: 'Bilim Media Group UpSkill',
          position: 'Аналитик-разработчик · стажировка',
          dates: '03.2024 — 07.2024',
          bullets: [
            'автоматизация пайплайнов извлечения и анализа данных статей на Python',
            'выявил критические несоответствия в датасете и сообщил о них стейкхолдерам',
          ],
        },
      ],
      eduItems: [
        {
          title: 'AITU',
          position: 'Бакалавр Software Engineering · минор по финансам',
          dates: '2022 — 2025',
          bullets: [
            'GPA 3.6 / 4.0 · с отличием',
            'Astana IT University — ведущий технический университет Казахстана',
          ],
        },
        {
          title: 'Евразийский национальный университет',
          position: 'Магистратура: технологии искусственного интеллекта',
          dates: '2025 — 2027 (ожид.)',
          bullets: ['GPA 3.8 / 4.0'],
        },
        {
          title: 'Языки',
          position: 'Английский — C1 · русский и казахский — родные',
          dates: 'учусь постоянно',
        },
      ],
    },
    contact: {
      skills: 'Навыки',
      contacts: 'Контакты',
      cv: 'Скачать резюме (pdf)',
      cvOther: 'на английском',
      skillLabels: ['Фронтенд', 'Анимация', 'Инструменты'],
      contactLabels: ['почта', 'telegram', 'телефон'],
    },
    footer: 'нарисовано в тетради · тайыр таишанов',
  },
};

export type Translation = (typeof translations)['en'];

/* compile-time guard: every language must have the same shape as `en` */
const _shapeCheck: Record<Lang, Translation> = translations;
void _shapeCheck;

type SiteState = {
  lang: Lang;
  theme: Theme;
  toggleLang: () => void;
  toggleTheme: () => void;
};

const SiteContext = createContext<SiteState | null>(null);

function readStored<T extends string>(key: string, fallback: T): T {
  if (typeof localStorage === 'undefined') return fallback;
  return (localStorage.getItem(key) as T) || fallback;
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => readStored<Lang>('lang', 'en'));
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('lang', lang);
  }, [lang]);

  const value = useMemo<SiteState>(
    () => ({
      lang,
      theme,
      toggleLang: () => setLang((l) => (l === 'en' ? 'ru' : 'en')),
      toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    }),
    [lang, theme],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite(): SiteState {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used within <SiteProvider>');
  return ctx;
}

/* the translated strings for the current language */
export function useT(): Translation {
  return translations[useSite().lang];
}
