import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { capabilities } from '../data';
import { SecHead } from './Section';

function Glyph({ id }: { id: string }) {
  const s = { stroke: 'currentColor', fill: 'none', strokeWidth: 1 };
  const common = { className: 'glyph', viewBox: '0 0 200 64', 'aria-hidden': true } as const;
  switch (id) {
    case 'agents':
      return (
        <svg {...common}>
          <circle cx="30" cy="32" r="6" fill="#ff6b35" />
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <path d={`M36 32 C 80 32, 90 ${10 + i * 15}, 130 ${10 + i * 15}`} {...s} opacity=".4" />
              <rect x="132" y={4 + i * 15} width="56" height="12" rx="3" {...s} opacity=".6" />
            </g>
          ))}
        </svg>
      );
    case 'llm':
      return (
        <svg {...common}>
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x="10" y={8 + i * 13} width={[150, 120, 170, 90][i]} height="5" rx="2" fill="currentColor" opacity={0.25 + i * 0.12} />
          ))}
          <text x="170" y="55" fontFamily="JetBrains Mono Variable" fontSize="10" fill="#ff6b35">[1][2]</text>
        </svg>
      );
    case 'research':
      return (
        <svg {...common}>
          <path d="M10 8 H190 L130 32 V56 H70 V32 Z" {...s} opacity=".55" />
          {[30, 60, 90, 120, 150, 170].map((x, i) => (
            <circle key={x} cx={x} cy="16" r="2.5" fill="currentColor" opacity={i % 2 ? 0.3 : 0.7} />
          ))}
          <circle cx="100" cy="46" r="3.5" fill="#ff6b35" />
        </svg>
      );
    case 'product':
      return (
        <svg {...common}>
          <rect x="10" y="6" width="180" height="14" rx="3" {...s} opacity=".7" />
          <rect x="10" y="25" width="180" height="14" rx="3" {...s} opacity=".45" />
          <rect x="10" y="44" width="180" height="14" rx="3" stroke="#ff6b35" fill="none" />
        </svg>
      );
    case 'backend':
      return (
        <svg {...common}>
          {[0, 1, 2].map((i) => (
            <g key={i} opacity={0.4 + i * 0.25}>
              <ellipse cx={50 + i * 50} cy="16" rx="18" ry="5" {...s} />
              <path d={`M${32 + i * 50} 16 V48 A18 5 0 0 0 ${68 + i * 50} 48 V16`} {...s} />
            </g>
          ))}
        </svg>
      );
    default:
      return (
        <svg {...common}>
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <rect x={8 + i * 48} y="22" width="36" height="20" rx="4" {...s} opacity=".55" />
              {i < 3 && <path d={`M${44 + i * 48} 32 h12`} {...s} />}
            </g>
          ))}
          <rect x="152" y="22" width="36" height="20" rx="4" stroke="#ff6b35" fill="none" />
        </svg>
      );
  }
}

export default function Capabilities() {
  const [open, setOpen] = useState<string | null>('agents');
  return (
    <section id="build" className="sec" aria-labelledby="build-title" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <SecHead
          n="02"
          k="What I build"
          title={
            <span id="build-title">
              Six things I <em>obsess over</em> — and ship.
            </span>
          }
          lede="Each one comes with a receipt: the place I actually did it."
        />
        <div className="caps">
          {capabilities.map((c, i) => {
            const isOpen = open === c.id;
            return (
              <div className={`cap ${isOpen ? 'open' : ''}`} key={c.id}>
                <button
                  className="cap-btn"
                  aria-expanded={isOpen}
                  aria-controls={`cap-${c.id}`}
                  onClick={() => setOpen(isOpen ? null : c.id)}
                >
                  <span className="n mono">0{i + 1}</span>
                  <span className="cap-title">{c.title}</span>
                  <span className="cap-short">
                    <span className="t">{c.short}</span>
                    <span className="cap-plus" aria-hidden="true">+</span>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`cap-${c.id}`}
                      className="cap-panel"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="cap-inner">
                        <div className="glyph-wrap muted">
                          <Glyph id={c.id} />
                        </div>
                        <p>{c.body}</p>
                        <div className="cap-meta">
                          <span className="mono muted">
                            where → <span className="proof">{c.proof}</span>
                          </span>
                          <div className="tags">
                            {c.tags.map((t) => (
                              <span className="tag" key={t}>{t}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
