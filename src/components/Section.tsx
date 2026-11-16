import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export function Reveal({ children, delay = 0, y = 24, className }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SecHead({ n, k, title, lede }: { n: string; k: string; title: ReactNode; lede?: ReactNode }) {
  return (
    <div className="sec-head">
      <div className="sec-k mono">
        <b>§{n}</b>
        <span>{k}</span>
      </div>
      <Reveal>
        <h2 className="sec-title">{title}</h2>
        {lede && <p className="sec-lede">{lede}</p>}
      </Reveal>
    </div>
  );
}
