import { motion } from 'framer-motion';
import { profile } from '../data';
import { useClock } from '../lib/hooks';
import AttentionField from './AttentionField';
import { ArrowR, GitHubIcon, LinkedInIcon, MailIcon } from './Icons';

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const time = useClock(profile.timezone);
  return (
    <section className="hero" id="top" aria-label="Introduction">
      <div className="hero-glow" aria-hidden="true" />
      <AttentionField />
      <div className="wrap hero-top mono">
        <span className="hide-sm">Portfolio — index / 2026</span>
        <span className="status">
          <i className="pulse" aria-hidden="true" />
          Lead Engineer at Enrichly HR · building Auramiq
        </span>
        <span className="hide-sm">
          {profile.location} · {time} IST
        </span>
      </div>

      <div className="wrap hero-main">
        <h1 className="hero-name">
          <span className="sr">{profile.name} — {profile.role}</span>
          {[profile.first, profile.last].map((word, i) => (
            <span className="line" aria-hidden="true" key={word}>
              <motion.span
                className={i === 1 ? 'it' : undefined}
                style={i === 1 ? { paddingLeft: '0.9em', fontStyle: 'italic' } : undefined}
                initial={{ y: '105%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1, delay: 0.15 + i * 0.12, ease }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className="hero-grid">
          <motion.p
            className="statement"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55, ease }}
          >
            I build <em>intelligent systems</em>, engineer scalable products, and turn ambitious ideas into reality.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.7, ease }}>
            <p className="intro">{profile.intro}</p>
            <div className="ctas">
              <a href="#work" className="btn btn-primary">
                Explore my work <span className="arr"><ArrowR /></span>
              </a>
              <a href="#contact" className="btn btn-ghost">Let’s connect</a>
              <div className="socials">
                <a className="icon-link" href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <GitHubIcon />
                </a>
                <a className="icon-link" href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <LinkedInIcon />
                </a>
                <a className="icon-link" href={`mailto:${profile.email}`} aria-label={`Email ${profile.email}`}>
                  <MailIcon />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <span className="fig mono" aria-hidden="true">fig. 01 — your cursor is the query · attention over keys from my work</span>

      <div className="wrap">
        <div className="hero-foot mono">
          <div className="roles">
            {profile.roles.map((r) => (
              <span key={r}>{r}</span>
            ))}
          </div>
          <span>scroll ↓</span>
        </div>
      </div>
    </section>
  );
}
