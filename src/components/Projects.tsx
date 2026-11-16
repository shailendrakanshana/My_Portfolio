import { archive, projects, type Project } from '../data';
import { ArrowUR } from './Icons';
import { Reveal, SecHead } from './Section';
import { AbleDesk, AuramiqArch, EnrichlyBeforeAfter, ScoutPipeline, WhatBytesMap } from './Visuals';

const visualMeta: Record<Project['visual'], { label: string; hint?: string }> = {
  auramiq: { label: 'fig. 02 — auramiq / request path', hint: 'interactive' },
  scout: { label: 'fig. 03 — scout / pipeline' },
  enrichly: { label: 'fig. 04 — enrichly / data path' },
  able: { label: 'fig. 05 — support desk / illustration' },
  whatbytes: { label: 'fig. 06 — whatbytes / platform' },
};

function Visual({ p }: { p: Project }) {
  const meta = visualMeta[p.visual];
  return (
    <div className={`proj-visual dotbg ${p.visual === 'auramiq' ? 'arch-box' : ''}`}>
      <span className="vlabel mono">{meta.label}</span>
      {meta.hint && <span className="vhint mono">{meta.hint}</span>}
      {p.visual === 'auramiq' && <AuramiqArch />}
      {p.visual === 'scout' && <div className="vfill"><ScoutPipeline /></div>}
      {p.visual === 'enrichly' && <EnrichlyBeforeAfter />}
      {p.visual === 'able' && <AbleDesk />}
      {p.visual === 'whatbytes' && <div className="vfill"><WhatBytesMap /></div>}
    </div>
  );
}

function Body({ p, feature }: { p: Project; feature?: boolean }) {
  return (
    <>
      <div className="proj-cols">
        <div className="blk">
          <h4>Problem</h4>
          <p>{p.problem}</p>
        </div>
        <div className="blk">
          <h4>What I built</h4>
          <ul>
            {p.built.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>
        <div className="blk">
          <h4>Why it’s interesting</h4>
          <p>{p.interesting}</p>
        </div>
      </div>
      <div className="stack-line" aria-label="Stack">
        {p.stack.map((s) => (
          <span key={s}>{s}</span>
        ))}
      </div>
      {p.link && (
        <a className="proj-link" href={p.link.href} target="_blank" rel="noopener noreferrer">
          {p.link.label} <ArrowUR />
        </a>
      )}
      {feature && null}
    </>
  );
}

export default function Projects() {
  const [feature, ...rest] = projects;
  return (
    <section id="work" className="sec" aria-labelledby="work-title">
      <div className="wrap">
        <SecHead
          n="03"
          k="Selected work"
          title={
            <span id="work-title">
              Systems I’ve <em>designed, shipped</em> and kept alive.
            </span>
          }
          lede="Ordered by what they say about how I build, not by date. Diagrams are drawn from the real architecture; the chat in fig. 05 is an illustration."
        />

        <article className="proj feature" aria-labelledby={`p-${feature.id}`}>
          <Reveal className="feature-head">
            <div>
            <div className="proj-head mono">
              <span className="idx">{feature.index}</span>
              <span>{feature.role}</span>
              <span>·</span>
              <span>{feature.period}</span>
            </div>
            <h3 className="proj-name" id={`p-${feature.id}`}>{feature.name}</h3>
            <p className="proj-kicker">{feature.kicker}</p>
            </div>
            <p className="proj-summary">{feature.summary}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <Visual p={feature} />
          </Reveal>
          <Reveal>
            <Body p={feature} feature />
          </Reveal>
        </article>

        {rest.map((p, i) => (
          <article className={`proj ${i % 2 ? 'flip' : ''}`} key={p.id} aria-labelledby={`p-${p.id}`}>
            <Reveal>
              <div className="proj-head mono">
                <span className="idx">{p.index}</span>
                <span>{p.role}</span>
                <span>·</span>
                <span>{p.period}</span>
              </div>
              <h3 className="proj-name" id={`p-${p.id}`}>{p.name}</h3>
              <p className="proj-kicker">{p.kicker}</p>
              <p className="proj-summary">{p.summary}</p>
              <Body p={p} />
            </Reveal>
            <Reveal delay={0.1} className="proj-visual-wrap">
              <Visual p={p} />
            </Reveal>
          </article>
        ))}

        <div className="archive" aria-label="Earlier projects">
          <div className="archive-row mono" style={{ color: 'var(--muted)' }}>
            <span>Archive</span>
            <span>University-era projects — where it started</span>
            <a href="https://github.com/shailendrakanshana" target="_blank" rel="noopener noreferrer" className="k" style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
              GitHub <ArrowUR size={12} />
            </a>
          </div>
          {archive.map((a) => (
            <div className="archive-row" key={a.name}>
              <span className="mono k">{a.year}</span>
              <span>{a.name}</span>
              <span className="mono k">{a.kind}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
