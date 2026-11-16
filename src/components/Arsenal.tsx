import { useState } from 'react';
import { arsenal, contexts, type ContextId, type Tool } from '../data';
import { SecHead } from './Section';

const ctxLabel = (id: ContextId) => contexts.find((c) => c.id === id)!.label;

export default function Arsenal() {
  const [ctx, setCtx] = useState<ContextId | null>(null);
  const [tool, setTool] = useState<Tool | null>(null);

  return (
    <section id="arsenal" className="sec" aria-labelledby="arsenal-title">
      <div className="wrap">
        <SecHead
          n="05"
          k="Technical arsenal"
          title={
            <span id="arsenal-title">
              The stack, <em>with provenance.</em>
            </span>
          }
          lede="No skill bars. Pick a place to see what I used there, or point at a tool to trace where it shipped. Marked ◆ = used most."
        />

        <div className="ctx-bar" role="group" aria-label="Filter by where it was used">
          <span className="lbl mono">filter by context →</span>
          <button className="chip" aria-pressed={ctx === null} onClick={() => setCtx(null)}>
            Everything
          </button>
          {contexts.map((c) => (
            <button key={c.id} className="chip" aria-pressed={ctx === c.id} onClick={() => setCtx(ctx === c.id ? null : c.id)}>
              {c.label}
            </button>
          ))}
        </div>

        <div className="strata">
          {arsenal.map((layer) => (
            <div className="stratum" key={layer.id}>
              <div className="stratum-h mono">
                <b>{layer.code}</b>
                <span>{layer.title}</span>
              </div>
              <div className={`tools ${ctx ? 'dim' : ''}`}>
                {layer.tools.map((t) => {
                  const lit = ctx !== null && t.ctx.includes(ctx);
                  return (
                    <button
                      key={t.name}
                      className={`tool ${t.core ? 'core' : ''} ${lit ? 'lit' : ''}`}
                      onMouseEnter={() => setTool(t)}
                      onMouseLeave={() => setTool(null)}
                      onFocus={() => setTool(t)}
                      onBlur={() => setTool(null)}
                      onClick={() => setTool(t)}
                      aria-label={`${t.name}: used in ${t.ctx.map(ctxLabel).join(', ')}`}
                    >
                      {t.name}
                      {t.core && <sup aria-hidden="true">◆</sup>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="trace-out mono" aria-live="polite">
          {tool ? (
            <>
              <span className="who">{tool.name}</span>
              <span>→ used in</span>
              {tool.ctx.map((c) => (
                <span key={c} className="tag">{ctxLabel(c)}</span>
              ))}
            </>
          ) : ctx ? (
            <span>
              Showing what I used at <span className="who">{ctxLabel(ctx)}</span>.
            </span>
          ) : (
            <span>Point at any tool to trace it.</span>
          )}
        </div>
      </div>
    </section>
  );
}
