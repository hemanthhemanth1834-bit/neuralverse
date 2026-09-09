import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import { assistantStages, demoAnswer } from '../data/universe';
import { Send, Cpu, ShieldCheck } from 'lucide-react';
import { announce } from '../utils/device';

type Stage = 'IDLE' | 'QUESTION' | 'UNDERSTANDING' | 'KNOWLEDGE' | 'REASONING' | 'RESPONSE';

const SUGGESTIONS = [
  'Who are you?',
  'What are your skills?',
  'Show me your projects',
  'How do I contact Hemanth?',
  'Explain the AI brain',
];

export default function Assistant() {
  const [question, setQuestion] = useState('');
  const [stage, setStage] = useState<Stage>('IDLE');
  const [answer, setAnswer] = useState('');
  const [lastQ, setLastQ] = useState('');
  const timers = useRef<number[]>([]);

  useEffect(() => () => { timers.current.forEach(clearTimeout); }, []);

  const ask = (q: string) => {
    const query = q.trim();
    if (!query || stage === 'QUESTION' || stage === 'UNDERSTANDING' || stage === 'KNOWLEDGE' || stage === 'REASONING') return;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setLastQ(query);
    setAnswer('');
    setStage('QUESTION');
    announce('Question received. Reasoning.');
    const seq: Stage[] = ['UNDERSTANDING', 'KNOWLEDGE', 'REASONING', 'RESPONSE'];
    seq.forEach((s, i) => {
      timers.current.push(window.setTimeout(() => {
        setStage(s);
        if (s === 'RESPONSE') {
          // safe demo path — never calls external APIs directly; optional proxy via env
          const proxy = (import.meta as any).env?.VITE_AI_PROXY_URL as string | undefined;
          void proxy;
          setAnswer(demoAnswer(query));
          announce('Response ready.');
        }
      }, 650 * (i + 1)));
    });
  };

  const stageIndex = (s: Stage) => {
    if (s === 'IDLE' || s === 'QUESTION') return -1;
    if (s === 'RESPONSE') return 99;
    return assistantStages.indexOf(s as (typeof assistantStages)[number]);
  };

  return (
    <section id="ask" aria-label="Ask the neural core" className="relative overflow-hidden py-28 sm:py-36">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <SectionHeading
          align="center"
          scene="SCENE 07 — THE ASSISTANT"
          title={<>Ask the <span className="holo-text">Neural Core.</span></>}
          lede="A cinematic inference ritual — question, understanding, knowledge, reasoning, response. Demo intelligence runs locally; wire VITE_AI_PROXY_URL later for live models."
        />

        <div className="glass glow-border scanlines relative overflow-hidden rounded-3xl p-6 sm:p-10">
          <div className="tech-grid absolute inset-0 opacity-40" aria-hidden="true" />
          <div className="relative z-10">
            {/* pipeline */}
            <ol className="mb-8 flex items-center justify-between gap-1 sm:gap-2" aria-label="Inference pipeline">
              {['QUESTION', ...assistantStages].map((s, i) => {
                const active = stage === s || (stage === 'RESPONSE' && i <= 4);
                const done = stageIndex(stage) > i - 1 && stage !== 'IDLE' && stage !== 'QUESTION' ? true : stage === 'RESPONSE';
                const current = stage === s;
                return (
                  <li key={s} className="flex flex-1 items-center gap-1 sm:gap-2">
                    <div className="flex flex-col items-center gap-2">
                      <span
                        className={`grid h-9 w-9 place-items-center rounded-full border text-[10px] transition-all duration-500 sm:h-10 sm:w-10 ${current ? 'border-cyan-300 bg-cyan-400/20 text-white shadow-[0_0_20px_rgba(34,211,238,.4)]' : done || active ? 'border-cyan-300/40 bg-cyan-400/10 text-cyan-200' : 'border-white/10 text-slate-500'}`}
                        aria-current={current ? 'step' : undefined}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className={`mono-font hidden text-[9px] tracking-[0.25em] sm:block ${current ? 'text-white' : 'text-slate-500'}`}>{s}</span>
                    </div>
                    {i < 4 && <span className={`h-px flex-1 ${done || active ? 'bg-cyan-300/50' : 'bg-white/10'}`} aria-hidden="true" />}
                  </li>
                );
              })}
            </ol>

            <form
              onSubmit={(e) => { e.preventDefault(); ask(question); setQuestion(''); }}
              className="flex flex-col gap-3 sm:flex-row"
              role="search"
              aria-label="Ask the neural core"
            >
              <label htmlFor="neural-query" className="sr-only">What do you want to know?</label>
              <input
                id="neural-query"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What do you want to know?"
                autoComplete="off"
                className="flex-1 rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-[15px] text-white placeholder:text-slate-500 focus:border-cyan-300/60 focus:outline-none"
              />
              <button
                type="submit"
                data-cursor="OPEN"
                className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-7 py-4 text-[12px] font-bold tracking-[0.25em] text-[#02040c] transition hover:brightness-110 disabled:opacity-50"
                disabled={!question.trim()}
              >
                <Send className="h-3 w-3" aria-hidden="true" /> TRANSMIT
              </button>
            </form>

            <div className="mt-4 flex flex-wrap gap-2" aria-label="Suggested questions">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => { setQuestion(s); ask(s); setQuestion(''); }}
                  className="mono-font rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[11px] tracking-[0.1em] text-slate-400 transition hover:border-cyan-300/40 hover:text-cyan-100"
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="mt-8 min-h-[140px]" aria-live="polite">
              <AnimatePresence mode="wait">
                {stage !== 'IDLE' && (
                  <motion.div
                    key={stage + lastQ}
                    initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
                    transition={{ duration: 0.45 }}
                    className="rounded-2xl border border-white/8 bg-black/30 p-5 sm:p-6"
                  >
                    {lastQ && (
                      <p className="mono-font text-[11px] tracking-[0.2em] text-cyan-200/80">◈ QUERY — “{lastQ}”</p>
                    )}
                    {stage !== 'RESPONSE' ? (
                      <div className="mt-4 flex items-center gap-3">
                        <Cpu className="h-3.5 w-3.5 animate-pulse text-cyan-300" aria-hidden="true" />
                        <p className="mono-font text-sm tracking-[0.25em] text-slate-300">
                          {stage} <span className="animate-pulse">▮</span>
                        </p>
                      </div>
                    ) : (
                      <p className="mt-3 text-[15px] leading-relaxed text-slate-200">{answer}</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              {stage === 'IDLE' && (
                <p className="mono-font text-center text-[11px] tracking-[0.3em] text-slate-600">AWAITING QUERY — SYSTEM IDLE</p>
              )}
            </div>

            <p className="mono-font mt-6 flex items-center justify-center gap-2 text-center text-[10px] tracking-[0.2em] text-slate-500">
              <ShieldCheck className="h-3 w-3" aria-hidden="true" />
              DEMO MODE · NO API KEYS IN BROWSER · SAFE TO DEPLOY
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
