import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { sections } from '../data';
import { useActiveSection } from '../lib/hooks';
import { Mark } from './Icons';

const ids = sections.map((s) => s.id);
const links = [
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'arsenal', label: 'Arsenal' },
  { id: 'console', label: 'Console' },
  { id: 'contact', label: 'Contact' },
];

export default function Nav({ onOpenPalette }: { onOpenPalette: () => void }) {
  const active = useActiveSection(ids);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });
  const [isMac, setIsMac] = useState(true);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  const label = sections.find((s) => s.id === active)?.label ?? '';

  return (
    <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="wrap nav-in">
        <a href="#top" className="brand" aria-label="Shailendra Kanshana — back to top">
          <Mark />
          <span className="brand-name">Shailendra Kanshana</span>
          <span className="crumb" aria-hidden="true">
            /
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={label}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
              >
                {label.toLowerCase()}
              </motion.span>
            </AnimatePresence>
          </span>
        </a>
        <nav className="nav-links" aria-label="Primary">
          {links.map((l) => (
            <a key={l.id} href={`#${l.id}`} aria-current={active === l.id ? 'true' : undefined}>
              {l.label}
            </a>
          ))}
        </nav>
        <button className="kbd-btn" onClick={onOpenPalette} aria-label="Open command menu">
          Menu <kbd className="hide-touch">{isMac ? '⌘' : 'Ctrl'}</kbd>
          <kbd className="hide-touch">K</kbd>
        </button>
      </div>
      {scrolled && <motion.div className="progress" style={{ scaleX }} aria-hidden="true" />}
    </header>
  );
}
