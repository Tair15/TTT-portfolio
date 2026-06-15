import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Contact from './components/Contact';
import SiteControls from './components/SiteControls';
import PencilLines from './components/decor/PencilLines';
import { useT } from './i18n';

export default function App() {
  const t = useT();
  return (
    <>
      <SiteControls />
      <Hero />
      <div className="notebook-body">
        {/* colored pencil lines run from About down to the footer */}
        <PencilLines />
        <About />
        <Experience />
        <Projects />
        <Contact />
        <footer className="site-footer">
          {t.footer} · {new Date().getFullYear()}
        </footer>
      </div>
    </>
  );
}
