import { motion } from 'framer-motion';
import { profile } from '../data';
import { useClock } from '../lib/hooks';
import { copyText, useToast } from '../lib/toast';
import { ArrowUR } from './Icons';

export default function Contact() {
  const notify = useToast();
  const time = useClock(profile.timezone);
  const links = [
    { k: 'LinkedIn', v: profile.linkedinHandle, href: profile.linkedin },
    { k: 'GitHub', v: `@${profile.githubHandle}`, href: profile.github },
    { k: 'Résumé', v: 'PDF, 1 page', href: profile.resume },
    { k: 'Auramiq', v: 'auramiq.com', href: profile.auramiq },
  ];
  return (
    <footer id="contact" className="contact" aria-labelledby="contact-title">
      <div className="contact-glow" aria-hidden="true" />
      <div className="wrap" style={{ position: 'relative' }}>
        <div className="sec-k mono" style={{ marginBottom: 28 }}>
          <b>§08</b>
          <span>Contact</span>
        </div>
        <motion.h2
          id="contact-title"
          className="contact-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          Have an ambitious idea? Let’s build something <em>that matters.</em>
        </motion.h2>
        <div className="mail">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <button className="copy" onClick={() => copyText(profile.email).then((ok) => notify(ok ? 'Email copied' : 'Copy failed'))}>
            copy
          </button>
        </div>
        <p className="muted" style={{ marginTop: 18, maxWidth: '56ch' }}>
          Founding-engineer roles, AI products that need to work in production, or a hard backend problem. Based in {profile.location} and{' '}
          {profile.relocation.toLowerCase()}.
        </p>

        <div className="contact-links">
          {links.map((l) => (
            <a key={l.k} className="clink" href={l.href} target="_blank" rel="noopener noreferrer">
              <span className="mono">{l.k}</span>
              <b>
                {l.v} <ArrowUR />
              </b>
            </a>
          ))}
        </div>

        <div className="foot mono">
          <span>© {new Date().getFullYear()} Shailendra Kanshana · {profile.location} · {time} IST</span>
          <span>
            <a href={`${import.meta.env.BASE_URL}llms.txt`}>llms.txt</a> · <a href="#top">back to top ↑</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
