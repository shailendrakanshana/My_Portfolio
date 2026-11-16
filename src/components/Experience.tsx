import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { roles } from '../data';
import { SecHead } from './Section';

const START = 2020.5;
const now = new Date();
const NOW = now.getFullYear() + now.getMonth() / 12 + now.getDate() / 365;
const END = Math.max(2027, Math.ceil(NOW * 2) / 2 + 0.25);
const pct = (y: number) => ((y - START) / (END - START)) * 100;
const years = Array.from({ length: Math.floor(END) - Math.ceil(START) + 1 }, (_, i) => Math.ceil(START) + i);

function dur(a: number, b: number | null) {
  const months = Math.max(1, Math.round(((b ?? NOW) - a) * 12));
  const y = Math.floor(months / 12), m = months % 12;
  return [y && `${y}y`, m && `${m}mo`].filter(Boolean).join(' ');
}

export default function Experience() {
  const [sel, setSel] = useState('enrichly');
  const role = useMemo(() => roles.find((r) => r.id === sel)!, [sel]);

  return (
    <section id="experience" className="sec" aria-labelledby="exp-title">
      <div className="wrap">
        <SecHead
          n="04"
          k="Experience"
          title={
            <span id="exp-title">
              A career, read like a <em>trace.</em>
            </span>
          }
          lede="Each span is a role on a shared timeline: overlaps, durations and what’s still running. Select one to inspect it."
        />

        <div className="trace">
          <div className="trace-bar mono">
            <span className="dots" aria-hidden="true"><i /><i /><i /></span>
            <span>trace · career · {roles.length} spans</span>
            <span>
              <span style={{ color: 'var(--ember)' }}>●</span> running · {dur(2023 + 5 / 12, null)} in industry
            </span>
          </div>

          <div className="trace-axis" aria-hidden="true">
            <div className="span-name mono" style={{ justifyContent: 'center', color: 'var(--dim)', fontSize: 11 }}>span</div>
            <div className="ticks">
              {years.filter((y) => pct(y) < 96).map((y) => (
                <span className="tick" key={y} style={{ left: `${pct(y)}%` }}>{y}</span>
              ))}
            </div>
          </div>

          <div role="listbox" aria-label="Roles" aria-activedescendant={`span-${sel}`}>
            {roles.map((r, i) => {
              const left = pct(r.start);
              const width = pct(r.end ?? NOW) - left;
              const live = r.end === null;
              return (
                <button
                  key={r.id}
                  id={`span-${r.id}`}
                  role="option"
                  aria-selected={sel === r.id}
                  className={`span-row ${sel === r.id ? 'sel' : ''}`}
                  onClick={() => setSel(r.id)}
                >
                  <span className="span-name">
                    <b>{r.title}</b>
                    <span>{r.org}</span>
                  </span>
                  <span className="span-track">
                    {years.map((y) => (
                      <span className="grid" key={y} style={{ left: `${pct(y)}%` }} />
                    ))}
                    <motion.span
                      className={`span-fill ${r.kind} ${r.approx ? 'approx' : ''} ${live ? 'live' : ''}`}
                      style={{ left: `${left}%`, width: `${width}%` }}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    />
                    <span
                      className="span-dur"
                      style={left + width > 84 ? { left: `${left}%`, transform: 'translate(-100%, -50%)', paddingLeft: 0, paddingRight: 12 } : { left: `${left + width}%` }}
                    >
                      {r.approx ? '~' : ''}{dur(r.start, r.end)}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="trace-detail" aria-live="polite">
            <motion.div key={`m-${role.id}`} className="td-meta" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <span className="mono muted">{role.label}</span>
              <span className="r">{role.title}</span>
              <span>{role.org}</span>
              <span className="muted" style={{ fontSize: 14 }}>{role.where}</span>
            </motion.div>
            <div className="td-body" key={`b-${role.id}`}>
              <ul>
                {role.points.map((p, i) => (
                  <motion.li key={p} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05, duration: 0.3 }}>
                    <span className="ts">evt.{String(i + 1).padStart(2, '0')}</span>
                    <span>{p}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
