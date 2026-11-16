import { beyond, certifications } from '../data';
import { Reveal, SecHead } from './Section';

export default function Beyond() {
  const base = import.meta.env.BASE_URL;
  return (
    <section id="beyond" className="sec" aria-labelledby="beyond-title">
      <div className="wrap">
        <SecHead
          n="07"
          k="Beyond engineering"
          title={
            <span id="beyond-title">
              The person <em>behind the commits.</em>
            </span>
          }
        />
        <div className="beyond-grid">
          <Reveal>
            <figure className="photo" style={{ margin: 0 }}>
              <img
                src={`${base}images/speaking.webp`}
                srcSet={`${base}images/speaking-sm.webp 380w, ${base}images/speaking.webp 760w`}
                sizes="(max-width: 900px) 90vw, 36vw"
                width={760}
                height={853}
                loading="lazy"
                decoding="async"
                alt="Shailendra speaking at a podium during a talk"
              />
              <figcaption className="mono">on the mic, not the keyboard</figcaption>
            </figure>
          </Reveal>
          <div>
            <div className="beyond-list">
              {beyond.map((b, i) => (
                <Reveal key={b.k} delay={i * 0.06} className="bcard">
                  <span className="k mono">{b.k}</span>
                  <h3>{b.title}</h3>
                  <p>{b.body}</p>
                </Reveal>
              ))}
            </div>
            <Reveal className="certs">
              <div className="mono muted" style={{ padding: '18px 0 6px' }}>Certifications</div>
              {certifications.map((c) => (
                <div className="cert" key={c.name}>
                  <span>{c.name} <span className="muted">· {c.by}</span></span>
                  <span className="mono">{c.year}</span>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
