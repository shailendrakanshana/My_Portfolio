import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Capabilities from './components/Capabilities';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Arsenal from './components/Arsenal';
import Console from './components/Console';
import Beyond from './components/Beyond';
import Contact from './components/Contact';
import CommandPalette from './components/CommandPalette';
import { ToastContext } from './lib/toast';

export default function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const toastTimer = useRef<number>();
  const notify = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 1800);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <ToastContext.Provider value={notify}>
        <a href="#main" className="skip">Skip to content</a>
        <div className="grain" aria-hidden="true" />
        <Nav onOpenPalette={() => setPaletteOpen(true)} />
        <main id="main">
          <Hero />
          <About />
          <Capabilities />
          <Projects />
          <Experience />
          <Arsenal />
          <Console />
          <Beyond />
        </main>
        <Contact />
        <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
        <AnimatePresence>
          {toast && (
            <motion.div
              className="toast"
              role="status"
              initial={{ opacity: 0, y: 12, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 12, x: '-50%' }}
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </ToastContext.Provider>
    </MotionConfig>
  );
}
