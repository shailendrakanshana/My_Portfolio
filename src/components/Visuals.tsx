import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMedia } from '../lib/hooks';

/* ─────────────────────────── Auramiq: animated architecture ─────────────────────────── */

type N = { id: string; label: string; sub: string; note: string; core?: boolean; d: [number, number, number, number]; m: [number, number, number, number] };

const NODES: N[] = [
  { id: 'agent', label: 'AI agent', sub: 'any MCP client', note: 'An agent connects over MCP and calls Auramiq’s capabilities as tools — no browser, no scraping.', d: [30, 70, 170, 58], m: [6, 40, 124, 54] },
  { id: 'dash', label: 'Next.js dashboard', sub: 'people', note: 'The human interface. Same operations, same results as the agent gets.', d: [30, 220, 170, 58], m: [138, 40, 124, 54] },
  { id: 'http', label: 'Integrations', sub: 'HTTP clients', note: 'Anything that speaks HTTP uses the REST API.', d: [30, 370, 170, 58], m: [270, 40, 124, 54] },
  { id: 'mcp', label: 'MCP server', sub: 'tools for agents', note: 'A thin adapter: it translates MCP tool calls into calls on the core service layer.', d: [280, 128, 160, 58], m: [30, 160, 160, 54] },
  { id: 'rest', label: 'REST API', sub: 'Django REST Framework', note: 'The other thin adapter. HTTP in, core service call, JSON out.', d: [280, 310, 160, 58], m: [210, 160, 160, 54] },
  { id: 'core', label: 'Core service layer', sub: 'framework-independent Python', note: 'The business logic. It doesn’t import a web framework, so it doesn’t care who is calling — which is why adding agent support was an adapter, not a rewrite.', core: true, d: [510, 200, 210, 98], m: [70, 276, 260, 74] },
  { id: 'research', label: 'Research engine', sub: 'search → verify → answer', note: 'Pulls results from multiple search engines, verifies them, then hands them to an LLM to write the answer.', d: [790, 110, 180, 58], m: [14, 410, 176, 54] },
  { id: 'scout', label: 'Scout', sub: 'lead discovery', note: 'Finds live leads, verifies decision-maker contacts, runs outreach. See 02.', d: [790, 330, 180, 58], m: [210, 410, 176, 54] },
  { id: 'search', label: 'Search engines', sub: 'multiple sources', note: 'More than one engine, so no single index decides what’s true.', d: [1030, 40, 150, 58], m: [6, 530, 124, 54] },
  { id: 'llm', label: 'LLM', sub: 'cited answer', note: 'Writes the answer from verified sources only, with citations back to each one (RAG).', d: [1030, 180, 150, 58], m: [138, 530, 124, 54] },
  { id: 'celery', label: 'Celery workers', sub: 'async pipelines', note: 'Long-running sourcing, verification and outreach jobs run in the background.', d: [1030, 330, 150, 58], m: [270, 530, 124, 54] },
];

const EDGES: [string, string, boolean?][] = [
  ['agent', 'mcp', true], ['dash', 'rest'], ['http', 'rest'], ['mcp', 'core', true], ['rest', 'core'],
  ['core', 'research'], ['core', 'scout'], ['research', 'search'], ['research', 'llm'], ['scout', 'celery'],
];

export function AuramiqArch() {
  const mobile = useMedia('(max-width: 760px)');
  const [hot, setHot] = useState<string | null>(null);
  const box = (n: N) => (mobile ? n.m : n.d);
  const byId = useMemo(() => Object.fromEntries(NODES.map((n) => [n.id, n])), []);

  const path = (a: N, b: N) => {
    const [ax, ay, aw, ah] = box(a);
    const [bx, by, bw, bh] = box(b);
    if (mobile) {
      const x1 = ax + aw / 2, y1 = ay + ah, x2 = bx + bw / 2, y2 = by;
      const my = (y1 + y2) / 2;
      return `M${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`;
    }
    const x1 = ax + aw, y1 = ay + ah / 2, x2 = bx, y2 = by + bh / 2;
    const mx = (x1 + x2) / 2;
    return `M${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
  };

  const linked = (e: [string, string, boolean?]) => hot && (e[0] === hot || e[1] === hot);
  const note = hot ? byId[hot].note : 'Hover or tab through the nodes. Two adapters, one core: an agent and a browser run the same code path.';

  return (
    <div className="arch-wrap">
      <svg viewBox={mobile ? '0 0 400 600' : '0 0 1200 470'} role="img" aria-label="Auramiq architecture: AI agents reach a core service layer through an MCP server, people and integrations through a REST API; the core drives a research engine and the Scout pipeline.">
        <defs>
          {EDGES.map((e, i) => (
            <path key={i} id={`ae-${i}`} d={path(byId[e[0]], byId[e[1]])} />
          ))}
        </defs>
        {EDGES.map((e, i) => (
          <use key={i} href={`#ae-${i}`} className={`edge ${linked(e) ? 'hot' : ''}`} />
        ))}
        {EDGES.map((e, i) => (
          <circle key={`p${i}`} r={e[2] ? 3.2 : 2.4} className={`packet ${e[2] ? '' : 'cool'}`} opacity={hot && !linked(e) ? 0.15 : 0.95}>
            <animateMotion dur={`${2.2 + (i % 4) * 0.5}s`} begin={`${(i * 0.37) % 2}s`} repeatCount="indefinite" rotate="auto">
              <mpath href={`#ae-${i}`} />
            </animateMotion>
          </circle>
        ))}
        {NODES.map((n) => {
          const [x, y, w, h] = box(n);
          return (
            <g
              key={n.id}
              className={`node ${n.core ? 'core' : ''} ${hot === n.id ? 'hot' : ''}`}
              tabIndex={0}
              role="button"
              aria-label={`${n.label}: ${n.note}`}
              onMouseEnter={() => setHot(n.id)}
              onMouseLeave={() => setHot(null)}
              onFocus={() => setHot(n.id)}
              onBlur={() => setHot(null)}
              onClick={() => setHot(n.id)}
            >
              <rect x={x} y={y} width={w} height={h} rx={10} />
              {n.core && !mobile && (
                <text x={x + 14} y={y + 22} className="sub" style={{ fill: '#ff6b35' }}>
                  ◆ core
                </text>
              )}
              <text x={x + 14} y={y + h / 2 + (n.core && !mobile ? 6 : 0)} style={{ fontSize: mobile ? 12 : n.core ? 16 : 13.5 }}>
                {n.label}
              </text>
              <text x={x + 14} y={y + h / 2 + (n.core && !mobile ? 26 : 17)} className="sub" style={{ fontSize: mobile ? 9 : 10 }}>
                {n.sub}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="arch-note" aria-live="polite">
        <span className="t mono">{hot ? `› ${hot}` : '› hint'}</span>
        <p>{note}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────── Scout: pipeline with verification gate ─────────────────────────── */

export function ScoutPipeline() {
  const stages = [
    { x: 40, t: 'Source', s: 'Google Maps' },
    { x: 235, t: 'Verify', s: 'email check' },
    { x: 430, t: 'Reach out', s: 'SMTP' },
  ];
  const main = 'M20 190 L580 190';
  const reject = 'M20 190 L300 190 C 318 190, 322 210, 322 240 L322 300';
  return (
    <svg viewBox="0 0 600 380" role="img" aria-label="Scout pipeline: leads are sourced from Google Maps, unverifiable contacts are dropped at the verification step, and verified leads continue to SMTP outreach. Celery workers run each stage.">
      <defs>
        <path id="sc-main" d={main} />
        <path id="sc-rej" d={reject} />
      </defs>
      <rect x="20" y="40" width="560" height="44" rx="8" fill="none" stroke="rgba(237,234,227,.14)" />
      <text x="36" y="67" fill="#b9b5ac" fontSize="14" fontFamily="Geist Variable">Next.js dashboard</text>
      <text x="566" y="67" fill="#55534e" fontSize="12" fontFamily="JetBrains Mono Variable" textAnchor="end">DRF API</text>
      <path d="M300 84 V150" stroke="rgba(237,234,227,.14)" strokeDasharray="3 4" />
      <use href="#sc-main" stroke="rgba(237,234,227,.14)" fill="none" />
      <use href="#sc-rej" stroke="rgba(237,234,227,.08)" fill="none" strokeDasharray="2 4" />
      {stages.map((s, i) => (
        <g key={s.t}>
          <rect x={s.x} y="152" width="130" height="76" rx="10" fill="#141417" stroke={i === 1 ? 'rgba(255,107,53,.5)' : 'rgba(237,234,227,.14)'} />
          <text x={s.x + 14} y="184" fill="#edeae3" fontSize="17" fontFamily="Geist Variable">{s.t}</text>
          <text x={s.x + 14} y="206" fill="#85827b" fontSize="12" fontFamily="JetBrains Mono Variable">{s.s}</text>
        </g>
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} width="10" height="10" x="-5" y="-5" rx="2" fill="#edeae3">
          <animateMotion dur="4.8s" begin={`${i * 0.8}s`} repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
            <mpath href="#sc-main" />
          </animateMotion>
        </rect>
      ))}
      {[0, 1].map((i) => (
        <rect key={`r${i}`} width="10" height="10" x="-5" y="-5" rx="2" fill="#ff6b35" opacity=".8">
          <animateMotion dur="3.6s" begin={`${0.4 + i * 2.4}s`} repeatCount="indefinite">
            <mpath href="#sc-rej" />
          </animateMotion>
          <animate attributeName="opacity" values=".9;.9;0" keyTimes="0;.7;1" dur="3.6s" begin={`${0.4 + i * 2.4}s`} repeatCount="indefinite" />
        </rect>
      ))}
      <text x="336" y="296" fill="#ff6b35" fontSize="12" fontFamily="JetBrains Mono Variable">unverifiable → dropped</text>
      <rect x="20" y="318" width="560" height="40" rx="8" fill="none" stroke="rgba(237,234,227,.1)" />
      <text x="36" y="343" fill="#85827b" fontSize="13" fontFamily="JetBrains Mono Variable">celery workers</text>
      {Array.from({ length: 14 }).map((_, i) => (
        <rect key={i} x={200 + i * 26} y="331" width="16" height="14" rx="2" fill="#edeae3" opacity=".12">
          <animate attributeName="opacity" values=".1;.6;.1" dur="2.4s" begin={`${(i * 0.17) % 2.4}s`} repeatCount="indefinite" />
        </rect>
      ))}
    </svg>
  );
}

/* ─────────────────────────── Enrichly: before / after ─────────────────────────── */

export function EnrichlyBeforeAfter() {
  const [after, setAfter] = useState(true);
  const [touched, setTouched] = useState(false);
  useEffect(() => {
    if (touched) return;
    const id = window.setInterval(() => setAfter((a) => !a), 4200);
    return () => window.clearInterval(id);
  }, [touched]);

  const fe = 'rgba(237,234,227,.14)';
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, padding: '12px 14px 0' }} role="group" aria-label="Toggle architecture view">
        {(['before', 'after'] as const).map((k) => (
          <button
            key={k}
            className="chip mono"
            style={{ fontSize: 11.5, padding: '3px 10px' }}
            aria-pressed={after === (k === 'after')}
            onClick={() => { setTouched(true); setAfter(k === 'after'); }}
          >
            {k}
          </button>
        ))}
      </div>
      <svg viewBox="0 0 600 340" style={{ flex: 1 }} role="img" aria-label={after ? 'After: the client calls one structured REST API with validation at each layer, which talks to a redesigned Azure SQL schema.' : 'Before: business logic in the frontend, with duplicate client calls going straight to the data layer and producing 500 errors.'}>
        <rect x="150" y="24" width="300" height="60" rx="10" fill="#141417" stroke={fe} />
        <text x="168" y="52" fill="#edeae3" fontSize="16" fontFamily="Geist Variable">Frontend</text>
        <text x="168" y="72" fill="#85827b" fontSize="11.5" fontFamily="JetBrains Mono Variable">
          {after ? 'UI only' : 'UI + business logic'}
        </text>
        <rect x="150" y="262" width="300" height="56" rx="10" fill="#141417" stroke={fe} />
        <text x="168" y="290" fill="#edeae3" fontSize="16" fontFamily="Geist Variable">Azure SQL</text>
        <text x="168" y="308" fill="#85827b" fontSize="11.5" fontFamily="JetBrains Mono Variable">{after ? 'redesigned schema' : 'integrity depends on the UI'}</text>
        <AnimatePresence mode="wait">
          {after ? (
            <motion.g key="after" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }}>
              <path d="M300 84 V140" stroke="#ff6b35" strokeOpacity=".6" />
              <path d="M300 204 V262" stroke="#ff6b35" strokeOpacity=".6" />
              <rect x="170" y="140" width="260" height="64" rx="10" fill="#1d1714" stroke="rgba(255,107,53,.55)" />
              <text x="188" y="168" fill="#edeae3" fontSize="16" fontFamily="Geist Variable">Structured REST API</text>
              <text x="188" y="190" fill="#7ad69a" fontSize="11.5" fontFamily="JetBrains Mono Variable">✓ validation at each layer</text>
              <circle r="4" fill="#ff6b35">
                <animateMotion dur="1.8s" repeatCount="indefinite" path="M300 84 V262" />
              </circle>
            </motion.g>
          ) : (
            <motion.g key="before" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }}>
              {[180, 215, 250, 285, 320, 355, 390, 420].map((x, i) => (
                <path key={x} d={`M${x} 84 C ${x + (i % 2 ? 30 : -30)} 160, ${x + (i % 2 ? -20 : 20)} 200, ${x + (i % 3) * 6} 262`} stroke="rgba(237,234,227,.22)" fill="none" />
              ))}
              {[[96, 150], [470, 178], [84, 214]].map(([x, y], i) => (
                <g key={i}>
                  <rect x={x} y={y} width="48" height="22" rx="4" fill="rgba(255,90,90,.12)" stroke="rgba(255,120,120,.5)" />
                  <text x={x + 24} y={y + 15} textAnchor="middle" fill="#ff8f8f" fontSize="12" fontFamily="JetBrains Mono Variable">500</text>
                  <animate attributeName="opacity" values="1;.25;1" dur={`${1.4 + i * 0.4}s`} repeatCount="indefinite" />
                </g>
              ))}
              <text x="300" y="232" textAnchor="middle" fill="#85827b" fontSize="11.5" fontFamily="JetBrains Mono Variable">duplicate client-side calls</text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
}

/* ─────────────────────────── Able: AI-assisted support desk ─────────────────────────── */

const SCRIPT = [
  { who: 'user', text: 'Hi — I can’t find the booking link for my session.' },
  { who: 'ai', text: 'Suggested reply: “You can rebook from your dashboard under Sessions → Book. I’ve also sent the link to your email.”' },
  { who: 'agent', text: 'You can rebook from your dashboard under Sessions → Book. I’ve also sent the link to your email.' },
];

export function AbleDesk() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setStep((s) => (s + 1) % (SCRIPT.length + 2)), 1700);
    return () => window.clearInterval(id);
  }, []);
  const shown = SCRIPT.slice(0, Math.min(step, SCRIPT.length));
  return (
    <div style={{ position: 'absolute', inset: '44px 18px 18px', display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'flex-end' }} aria-hidden="true">
      <AnimatePresence initial={false}>
        {shown.map((m) => (
          <motion.div
            key={m.who}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              alignSelf: m.who === 'user' ? 'flex-start' : 'flex-end',
              maxWidth: '82%',
              padding: '10px 14px',
              borderRadius: 12,
              fontSize: 14,
              lineHeight: 1.45,
              background: m.who === 'user' ? '#1b1b1f' : m.who === 'ai' ? 'rgba(255,107,53,.08)' : '#edeae3',
              color: m.who === 'agent' ? '#0a0a0b' : '#edeae3',
              border: m.who === 'ai' ? '1px dashed rgba(255,107,53,.6)' : '1px solid transparent',
            }}
          >
            <div className="mono" style={{ fontSize: 10.5, opacity: 0.65, marginBottom: 3 }}>
              {m.who === 'user' ? 'customer' : m.who === 'ai' ? 'gpt-3 · draft for agent' : 'support agent · sent'}
            </div>
            {m.text}
          </motion.div>
        ))}
      </AnimatePresence>
      <div className="mono" style={{ display: 'flex', justifyContent: 'space-between', color: '#55534e', fontSize: 11, borderTop: '1px solid rgba(237,234,227,.08)', paddingTop: 10 }}>
        <span>● websocket · live</span>
        <span>model drafts → human decides</span>
      </div>
    </div>
  );
}

/* ─────────────────────────── WhatBytes: identity + services + delivery ─────────────────────────── */

export function WhatBytesMap() {
  const svcs = [
    { x: 40, t: 'Django', s: 'service' },
    { x: 225, t: '.NET Core', s: 'service' },
    { x: 410, t: 'Next.js', s: 'service' },
  ];
  return (
    <svg viewBox="0 0 600 380" role="img" aria-label="WhatBytes platform: Azure AD B2C issues JWTs used across Django, .NET Core and Next.js services; search runs on Elasticsearch; CI/CD deploys Docker and Kubernetes workloads to Azure App Services and AWS Elastic Beanstalk.">
      <rect x="180" y="24" width="240" height="56" rx="10" fill="#1d1714" stroke="rgba(255,107,53,.5)" />
      <text x="198" y="50" fill="#edeae3" fontSize="16" fontFamily="Geist Variable">Azure AD B2C</text>
      <text x="198" y="68" fill="#85827b" fontSize="11.5" fontFamily="JetBrains Mono Variable">OAuth2 · issues JWT</text>
      {svcs.map((s, i) => {
        const d = `M300 80 C 300 110, ${s.x + 65} 100, ${s.x + 65} 134`;
        return (
          <g key={s.t}>
            <path id={`wb-${i}`} d={d} stroke="rgba(237,234,227,.14)" fill="none" />
            <g>
              <rect width="26" height="13" x="-13" y="-6.5" rx="3" fill="#ff6b35" />
              <text x="0" y="3.5" textAnchor="middle" fontSize="8" fontFamily="JetBrains Mono Variable" fill="#0a0a0b">jwt</text>
              <animateMotion dur="2.4s" begin={`${i * 0.6}s`} repeatCount="indefinite">
                <mpath href={`#wb-${i}`} />
              </animateMotion>
            </g>
            <rect x={s.x} y="134" width="130" height="58" rx="10" fill="#141417" stroke="rgba(237,234,227,.14)" />
            <text x={s.x + 14} y="160" fill="#edeae3" fontSize="15" fontFamily="Geist Variable">{s.t}</text>
            <text x={s.x + 14} y="178" fill="#85827b" fontSize="11" fontFamily="JetBrains Mono Variable">{s.s}</text>
            <path d={`M${s.x + 65} 192 V222`} stroke="rgba(237,234,227,.14)" />
          </g>
        );
      })}
      <rect x="40" y="222" width="500" height="44" rx="10" fill="#141417" stroke="rgba(158,197,255,.35)" />
      <text x="58" y="249" fill="#edeae3" fontSize="15" fontFamily="Geist Variable">Elasticsearch</text>
      <text x="522" y="249" fill="#9ec5ff" fontSize="11.5" fontFamily="JetBrains Mono Variable" textAnchor="end">high-volume search · lower latency</text>
      <path d="M40 300 H540" stroke="rgba(237,234,227,.14)" strokeDasharray="4 5" />
      <circle r="4" fill="#9ec5ff">
        <animateMotion dur="3s" repeatCount="indefinite" path="M40 300 H540" />
      </circle>
      <text x="40" y="330" fill="#85827b" fontSize="12" fontFamily="JetBrains Mono Variable">CI/CD · Docker · Kubernetes</text>
      <text x="40" y="352" fill="#b9b5ac" fontSize="12" fontFamily="JetBrains Mono Variable">→ Azure App Services · AWS Elastic Beanstalk</text>
    </svg>
  );
}
