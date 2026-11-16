import { motion } from 'framer-motion';
import { stats } from '../data';
import { Reveal } from './Section';

export default function About() {
  return (
    <section id="about" className="sec" aria-labelledby="about-title">
      <div className="wrap">
        <div className="about-grid">
          <div className="sec-k mono">
            <b>§01</b>
            <span>About</span>
          </div>
          <div className="about-body">
            <Reveal>
              <h2 id="about-title" className="pull">
                I like the layer <span className="dim">under</span> the demo — the part that has to keep working <em>after</em> the launch tweet.
              </h2>
              <figure className="portrait">
                <img
                  src={`${import.meta.env.BASE_URL}images/portrait.webp`}
                  srcSet={`${import.meta.env.BASE_URL}images/portrait-sm.webp 450w, ${import.meta.env.BASE_URL}images/portrait.webp 900w`}
                  sizes="(max-width: 900px) 70vw, 320px"
                  width={900}
                  height={900}
                  loading="lazy"
                  decoding="async"
                  alt="Portrait of Shailendra Kanshana"
                />
                <figcaption className="mono">
                  <span>India</span>
                  <span>open to relocation</span>
                </figcaption>
              </figure>
            </Reveal>
            <Reveal className="story" delay={0.1}>
              <p>
                I started out writing Android apps and grinding algorithm problems at GLA University, then mentored other students in data
                structures. An ML internship at iNeuron made me curious about models; my first full-time job, at <strong>Able</strong>, is where
                that curiosity met production. In 2023 I put a GPT-3 assistant inside a live support desk, and it took half the workload off the
                support team.
              </p>
              <p>
                After that I wanted to be closer to the foundations. As a <strong>founding engineer at WhatBytes</strong> I built the core
                backend: auth, search, microservices, deploy pipelines. Today I’m <strong>Lead Engineer at Enrichly HR</strong>, a US-based
                company, where I own the backend architecture. A lot of that job is sitting with stakeholders and deciding what’s worth building
                before anyone writes code.
              </p>
              <p>
                Outside work I’m building <strong>Auramiq</strong>, an AI research and prospecting platform. Its core doesn’t know whether it’s
                being called by a browser or an AI agent, and that’s deliberate. Systems that serve both people and agents well are what I want
                to spend the next decade building.
              </p>
            </Reveal>
            <div className="stats">
              {stats.map((s, i) => (
                <motion.div
                  className="stat"
                  key={s.label}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="stat-v">
                    {s.value}
                    <small>{s.unit}</small>
                  </div>
                  <p>{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
