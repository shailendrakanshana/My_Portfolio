import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { arsenal, beyond, certifications, profile, projects, roles } from '../data';
import { SecHead } from './Section';

// A simulated tool interface over the same data module that renders this page.
// One data layer, two interfaces — the idea behind Auramiq's MCP server, in miniature.

type Handler = (arg?: string) => unknown;

const TOOLS: Record<string, { desc: string; arg?: string; run: Handler }> = {
  whoami: {
    desc: 'Who is this, in one object',
    run: () => ({
      name: profile.name,
      role: profile.role,
      statement: profile.statement,
      now: profile.now.map((n) => `${n.label} @ ${n.at}`),
      based_in: profile.location,
      relocation: profile.relocation,
    }),
  },
  list_projects: {
    desc: 'Selected work, ranked',
    run: () => projects.map((p) => ({ id: p.id, name: p.name, role: p.role, period: p.period, summary: p.summary })),
  },
  get_project: {
    desc: 'One project in detail',
    arg: 'id',
    run: (id) => {
      const p = projects.find((x) => x.id === (id || '').toLowerCase());
      if (!p) throw { code: -32602, message: `Unknown project id. Try one of: ${projects.map((x) => x.id).join(', ')}` };
      return { id: p.id, name: p.name, problem: p.problem, built: p.built, why_interesting: p.interesting, stack: p.stack, link: p.link?.href ?? null };
    },
  },
  get_experience: {
    desc: 'Roles, newest first',
    run: () =>
      roles.filter((r) => r.kind !== 'edu').map((r) => ({ title: r.title, org: r.org, when: r.label, highlights: r.points.slice(0, 2) })),
  },
  get_stack: {
    desc: 'The stack by layer',
    arg: 'layer?',
    run: (layer) => {
      const l = layer?.toLowerCase();
      const pick = l ? arsenal.filter((x) => x.id === l || x.title.toLowerCase().includes(l)) : arsenal;
      if (!pick.length) throw { code: -32602, message: `Unknown layer. Try: ${arsenal.map((x) => x.id).join(', ')}` };
      return Object.fromEntries(pick.map((x) => [x.title, x.tools.map((t) => t.name)]));
    },
  },
  get_education: {
    desc: 'Degree & certifications',
    run: () => ({ degree: 'B.Tech, Computer Science — GLA University, Mathura (2020–2024)', gpa: '8.51/10', certifications: certifications.map((c) => `${c.name} — ${c.by} (${c.year})`) }),
  },
  beyond_code: {
    desc: 'The human part',
    run: () => beyond.map((b) => ({ [b.k.toLowerCase()]: b.title })),
  },
  contact: {
    desc: 'How to reach me',
    run: () => ({ email: profile.email, linkedin: profile.linkedin, github: profile.github, resume_pdf: new URL(profile.resume, location.href).href }),
  },
};

type Line = { id: number; kind: 'sys' | 'req' | 'res' | 'err' | 'echo'; text: string };

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function highlight(json: string) {
  return esc(json).replace(/("(?:[^"\\]|\\.)*")(\s*:)?|\b(-?\d+(?:\.\d+)?|true|false|null)\b/g, (m, str, colon, lit) => {
    if (str) return colon ? `<span class="k">${str}</span>${colon}` : `<span class="s">${str}</span>`;
    if (lit) return `<span class="n">${m}</span>`;
    return m;
  });
}

let uid = 0;

export default function Console() {
  const [lines, setLines] = useState<Line[]>([
    { id: uid++, kind: 'sys', text: '# session open · transport: in-page · server: sk-portfolio (simulated)' },
    { id: uid++, kind: 'sys', text: `# ${Object.keys(TOOLS).length} tools available — type "help" or click one above` },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const history = useRef<string[]>([]);
  const hIdx = useRef(-1);
  const outRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const termRef = useRef<HTMLDivElement>(null);
  const inView = useInView(termRef, { once: true, margin: '0px 0px -30% 0px' });
  const reqId = useRef(1);

  const push = (l: Omit<Line, 'id'>) => setLines((ls) => [...ls, { ...l, id: uid++ }]);

  useEffect(() => {
    const el = outRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const stream = useCallback((kind: Line['kind'], text: string) => {
    return new Promise<void>((resolve) => {
      const id = uid++;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) {
        setLines((ls) => [...ls, { id, kind, text }]);
        return resolve();
      }
      setLines((ls) => [...ls, { id, kind, text: '' }]);
      let i = 0;
      const step = Math.max(6, Math.ceil(text.length / 70));
      const tick = () => {
        i = Math.min(text.length, i + step);
        setLines((ls) => ls.map((l) => (l.id === id ? { ...l, text: text.slice(0, i) } : l)));
        if (i < text.length) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    });
  }, []);

  const run = useCallback(
    async (raw: string) => {
      const cmd = raw.trim();
      if (!cmd || busy) return;
      history.current.unshift(cmd);
      hIdx.current = -1;
      const [name, ...rest] = cmd.replace(/^tools\/call\s+/, '').split(/\s+/);
      const arg = rest.join(' ').replace(/[{}"']/g, '').replace(/^\s*(id|layer)\s*:\s*/, '').trim() || undefined;

      if (name === 'clear') return setLines([]);
      push({ kind: 'echo', text: `› ${cmd}` });

      if (name === 'help' || name === 'tools/list') {
        const list = Object.entries(TOOLS).map(([n, t]) => `  ${n}${t.arg ? ` <${t.arg}>` : ''}`.padEnd(30) + `${t.desc}`);
        push({ kind: 'sys', text: ['tools:', ...list, '  clear'.padEnd(30) + 'Clear the screen', '', 'e.g.  get_project auramiq   ·   get_stack ai'].join('\n') });
        return;
      }

      setBusy(true);
      const id = reqId.current++;
      const tool = TOOLS[name];
      push({ kind: 'req', text: JSON.stringify({ jsonrpc: '2.0', id, method: 'tools/call', params: { name, arguments: arg ? { id: arg } : {} } }) });
      await new Promise((r) => setTimeout(r, 260));
      try {
        if (!tool) throw { code: -32601, message: `Method not found: ${name}. Type "help".` };
        const result = tool.run(arg);
        await stream('res', JSON.stringify({ jsonrpc: '2.0', id, result }, null, 2));
      } catch (e) {
        const err = e as { code: number; message: string };
        await stream('err', JSON.stringify({ jsonrpc: '2.0', id, error: err }, null, 2));
      } finally {
        setBusy(false);
      }
    },
    [busy, stream],
  );

  const ran = useRef(false);
  useEffect(() => {
    if (inView && !ran.current) {
      ran.current = true;
      run('whoami');
    }
  }, [inView, run]);

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      run(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const n = Math.min(history.current.length - 1, hIdx.current + 1);
      if (n >= 0) { hIdx.current = n; setInput(history.current[n]); }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const n = hIdx.current - 1;
      hIdx.current = Math.max(-1, n);
      setInput(n >= 0 ? history.current[n] : '');
    }
  };

  return (
    <section id="console" className="sec" aria-labelledby="console-title">
      <div className="wrap">
        <SecHead
          n="06"
          k="Console"
          title={
            <span id="console-title">
              This page has an <em>agent interface,</em> too.
            </span>
          }
        />
        <div className="console-grid">
          <div className="console-side">
            <p>
              Auramiq’s core serves two kinds of clients: people through a dashboard, and AI agents through an MCP server. This site does the
              same thing on a smaller scale.
            </p>
            <p>
              Everything you’ve scrolled past comes from one data module. This console reads that same module through a tool
              interface, with JSON-RPC requests and responses shaped like the ones an agent would send.
            </p>
            <p className="note">
              It runs in your browser and is simulated: no model and no network calls. The data is the same data the page uses. Agents can also
              read <a href={`${import.meta.env.BASE_URL}llms.txt`} className="ember">/llms.txt</a>.
            </p>
          </div>

          <div className="term" ref={termRef} onClick={() => inputRef.current?.focus({ preventScroll: true })}>
            <div className="term-bar mono">
              <span className="dots" aria-hidden="true"><i /><i /><i /></span>
              <span>sk-portfolio — tools</span>
              <span className="conn"><i className="pulse" aria-hidden="true" /> connected</span>
            </div>
            <div className="term-tools" role="toolbar" aria-label="Available tools">
              {Object.keys(TOOLS).map((t) => (
                <button key={t} onClick={(e) => { e.stopPropagation(); run(t === 'get_project' ? 'get_project auramiq' : t); }} disabled={busy}>
                  {t}
                </button>
              ))}
            </div>
            <div className="term-out" ref={outRef} role="log" aria-live="polite" aria-label="Console output" tabIndex={0}>
              {lines.map((l) =>
                l.kind === 'res' || l.kind === 'err' ? (
                  <pre key={l.id} className={l.kind === 'err' ? 'err' : undefined} dangerouslySetInnerHTML={{ __html: highlight(l.text) }} />
                ) : (
                  <pre key={l.id} className={l.kind === 'req' ? 'req' : l.kind === 'sys' ? 'sys' : undefined}>
                    {l.kind === 'req' ? `→ ${l.text}` : l.text}
                  </pre>
                ),
              )}
              {busy && <span className="caret" aria-hidden="true" />}
            </div>
            <div className="term-in">
              <label htmlFor="term-input">›</label>
              <input
                id="term-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                placeholder="try: get_project scout"
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                aria-label="Console command"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
