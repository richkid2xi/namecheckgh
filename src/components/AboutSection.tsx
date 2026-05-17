import { useScrollReveal } from '../hooks/useScrollReveal';

interface AboutSectionProps {
  sectionRef: React.RefObject<HTMLElement | null>;
}

const FAQ = [
  {
    q: 'What is NameCheckGhana?',
    a: 'NameCheckGhana is a free utility tool that lets you search the Registrar General\'s Department (RGD) public business registry to check if a company or business name is already taken in Ghana — before you file your formal application.',
  },
  {
    q: 'Is this an official government tool?',
    a: 'No. NameCheckGhana is an independent tool that queries the RGD\'s public database. It is not affiliated with or endorsed by the Registrar General\'s Department. Always verify results on the official RGD website before taking any legal action.',
  },
  {
    q: 'How accurate are the results?',
    a: 'Results reflect the publicly accessible RGD database at the time of the query. There may be a lag between new registrations and when they appear in search results. A "not found" result does not guarantee legal availability of a name.',
  },
  {
    q: 'What do the filter modes mean?',
    a: '"Contains" finds any name with your term anywhere inside it. "Exact Match" finds only names that match 100%. "Starts With" finds names beginning with your term, and "Ends With" finds names ending with it.',
  },
  {
    q: 'Can I register my business name here?',
    a: 'No — NameCheckGhana is a search tool only. To register a business name in Ghana, you must apply through the official online portal at orc.gov.gh/services/.',
  },
];

export default function AboutSection({ sectionRef }: AboutSectionProps) {
  const revealRef = useScrollReveal();

  return (
    <section
      id="about"
      ref={(el) => {
        (sectionRef as React.MutableRefObject<HTMLElement | null>).current = el;
        (revealRef as React.MutableRefObject<HTMLElement | null>).current = el;
      }}
      className="py-16 border-t border-[#1a1a1a]"
    >
      <div className="max-w-content mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

          {/* ── Left — Sticky Intro ── */}
          <div className="lg:col-span-4 reveal-left">
            <div className="lg:sticky lg:top-24 flex flex-col gap-6">
              {/* Section label */}
              <div className="flex items-center gap-2">
                <span className="w-1 h-5 bg-accent rounded-full" />
                <span className="text-xs font-semibold text-accent uppercase tracking-widest">About</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-text-primary leading-tight">
                How it <span className="gradient-text">works</span>
              </h2>

              <p className="text-text-secondary text-sm leading-relaxed">
                NameCheckGhana queries the RGD public database in real time, returning a list of registered businesses matching your search term. Use it as a first step before engaging a lawyer or filing officer.
              </p>
              <p className="text-text-secondary text-sm leading-relaxed">
                Our tool supports four search modes so you can narrow down results precisely — whether you want an exact name, names that start or end with a term, or any name containing it.
              </p>

              {/* Disclaimer box */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-warn/5 border border-warn/20">
                <span className="material-icons text-warn text-[20px] mt-0.5">warning</span>
                <p className="text-xs text-warn/80 leading-relaxed">
                  <strong className="text-warn">Disclaimer:</strong> This tool is for informational use only. Results do not constitute legal advice. Always consult the official RGD registry before making business registration decisions.
                </p>
              </div>

              {/* Step icons */}
              <div className="grid grid-cols-3 gap-3 mt-2">
                {[
                  { icon: 'search', label: 'Search', step: '1' },
                  { icon: 'fact_check', label: 'Review', step: '2' },
                  { icon: 'how_to_reg', label: 'Register', step: '3' },
                ].map((s) => (
                  <div key={s.step} className="card p-3 flex flex-col items-center gap-2 text-center">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                        <span className="material-icons text-accent text-[16px]">{s.icon}</span>
                      </div>
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent text-[#0d0d0d] text-[9px] font-bold flex items-center justify-center">
                        {s.step}
                      </span>
                    </div>
                    <span className="text-xxs text-text-muted uppercase tracking-wider font-medium">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right — FAQ ── */}
          <div className="lg:col-span-8 reveal-right">
            <div className="flex flex-col">
              {FAQ.map((item, i) => (
                <div
                  key={i}
                  className={`py-6 flex flex-col gap-3 ${i !== 0 ? 'border-t border-[#1e1e1e]' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="material-icons text-accent text-[12px]">help</span>
                    </span>
                    <h3 className="text-base font-semibold text-text-primary leading-snug">{item.q}</h3>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed pl-9">{item.a}</p>
                </div>
              ))}
            </div>

            {/* CTA at bottom */}
            <div className="mt-6 p-5 card flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-sm font-semibold text-text-primary">Ready to check your business name?</p>
                <p className="text-xs text-text-muted mt-0.5">Scroll back up and search the registry for free.</p>
              </div>
              <a href="#hero" className="btn-primary">
                <span className="material-icons text-[18px]">arrow_upward</span>
                Search Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
