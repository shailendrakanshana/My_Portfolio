import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { profile, sections } from '../data';
import { copyText, useToast } from '../lib/toast';

type Item = { id: string; group: string; label: string; hint: string; run: () => void };

export default function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastFocus = useRef<Element | null>(null);
  const notify = useToast();

  const items = useMemo<Item[]>(() => {
    const go = (id: string) => () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    const open = (href: string) => () => window.open(href, '_blank', 'noopener');
    return [
      ...sections.map((s) => ({ id: `go-${s.id}`, group: 'Navigate', label: s.label, hint: `#${s.id}`, run: go(s.id) })),
      {
        id: 'copy', group: 'Actions', label: 'Copy email address', hint: profile.email,
        run: () => copyText(profile.email).then((ok) => notify(ok ? 'Email copied' : 'Copy failed')),
      },
      { id: 'mail', group: 'Actions', label: 'Write an email', hint: 'mailto', run: () => (window.location.href = `mailto:${profile.email}`) },
      { id: 'cv', group: 'Actions', label: 'Download résumé (PDF)', hint: 'pdf', run: open(profile.resume) },
      { id: 'li', group: 'Links', label: 'LinkedIn', hint: profile.linkedinHandle, run: open(profile.linkedin) },
      { id: 'gh', group: 'Links', label: 'GitHub', hint: profile.githubHandle, run: open(profile.github) },
      { id: 'au', group: 'Links', label: 'Auramiq', hint: 'auramiq.com', run: open(profile.auramiq) },
    ];
  }, [notify]);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return items;
    return items.filter((i) => `${i.group} ${i.label} ${i.hint}`.toLowerCase().includes(t));
  }, [q, items]);

  useEffect(() => setSel(0), [q]);

  useEffect(() => {
    if (open) {
      lastFocus.current = document.activeElement;
      setQ('');
      requestAnimationFrame(() => inputRef.current?.focus());
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      (lastFocus.current as HTMLElement | null)?.focus?.();
    }
  }, [open]);

  const runItem = (i: Item) => {
    onClose();
    // let the overlay unmount & scroll lock release before navigating
    setTimeout(i.run, 30);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); onClose(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(filtered.length - 1, s + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
    else if (e.key === 'Enter' && filtered[sel]) { e.preventDefault(); runItem(filtered[sel]); }
    else if (e.key === 'Tab') { e.preventDefault(); }
  };

  let lastGroup = '';
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="cmdk-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            className="cmdk"
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onKeyDown={onKey}
          >
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Jump to a section, copy email, open links…"
              role="combobox"
              aria-expanded="true"
              aria-controls="cmdk-list"
              aria-activedescendant={filtered[sel] ? `cmdk-${filtered[sel].id}` : undefined}
            />
            <ul id="cmdk-list" role="listbox">
              {filtered.length === 0 && <li className="grp">No results for “{q}”</li>}
              {filtered.map((i, idx) => {
                const head = i.group !== lastGroup ? (lastGroup = i.group) : null;
                return (
                  <FragmentRow key={i.id} head={head}>
                    <li
                      id={`cmdk-${i.id}`}
                      role="option"
                      aria-selected={idx === sel}
                      onMouseMove={() => setSel(idx)}
                      onClick={() => runItem(i)}
                    >
                      <span>{i.label}</span>
                      <span className="hint">{i.hint}</span>
                    </li>
                  </FragmentRow>
                );
              })}
            </ul>
            <div className="foot-hint">
              <span>↑↓ navigate</span>
              <span>↵ select</span>
              <span>esc close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FragmentRow({ head, children }: { head: string | null; children: React.ReactNode }) {
  return (
    <>
      {head && <li className="grp" role="presentation">{head}</li>}
      {children}
    </>
  );
}
