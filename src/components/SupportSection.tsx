import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import confetti from 'canvas-confetti';

interface SupportSectionProps {
  sectionRef: React.RefObject<HTMLElement | null>;
}

type Step = 'idle' | 'details' | 'success';

const AMOUNTS = [5, 10, 15, 20];

const RESOURCES = [
  { icon: 'language', label: 'Official ORC Portal', desc: 'orc.gov.gh', href: 'https://www.orc.gov.gh/' },
  { icon: 'description', label: 'ORC Services Overview', desc: 'Services & registration', href: 'https://www.orc.gov.gh/services/' },
  { icon: 'gavel', label: 'Companies Act 2019', desc: 'Act 992 — Genuine legal text', href: 'https://www.ecolex.org/details/legislation/companies-act-2019-act-992-lex-faoc191398/' },
  { icon: 'support_agent', label: 'ORC Contact & Support', desc: 'Official helpdesk', href: 'https://www.orc.gov.gh/' },
];

export default function SupportSection({ sectionRef }: SupportSectionProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<Step>('idle');
  const [loading, setLoading] = useState(false);
  const revealRef = useScrollReveal();

  const handleAmountClick = (amount: number) => {
    setSelectedAmount(amount);
    setStep('details');
  };

  const handlePay = () => {
    if (!selectedAmount) return;
    setLoading(true);

    const handler = window.PaystackPop?.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_353e6b21665a3ee5bdc4b4a11f261c4ba22c0e7b',
      email: email || 'richardelikem31@gmail.com',
      amount: selectedAmount * 100,
      currency: 'GHS',
      ref: `NCG-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      callback: (_response: { reference: string }) => {
        setLoading(false);
        setStep('success');
        
        // Trigger celebratory confetti on payment success
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      },
      onClose: () => {
        setLoading(false);
      },
    });

    handler?.openIframe();
  };

  const handleReset = () => {
    setStep('idle');
    setSelectedAmount(null);
    setName('');
    setEmail('');
  };

  return (
    <section
      id="support"
      ref={(el) => {
        (sectionRef as React.MutableRefObject<HTMLElement | null>).current = el;
        (revealRef as React.MutableRefObject<HTMLElement | null>).current = el;
      }}
      className="py-16 border-t border-[#1a1a1a]"
    >
      <div className="max-w-content mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

          {/* ── Left — Payment Widget & Creator Card ── */}
          <div className="lg:col-span-7 reveal-left flex flex-col gap-6">
            <div className="card p-6 md:p-7 flex flex-col gap-6">
              {/* Header */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <span className="material-icons text-accent text-[24px]">coffee</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text-primary">Buy me a coffee</h2>
                  <p className="text-sm text-text-muted">Support NameCheckGhana</p>
                </div>
              </div>

              <p className="text-sm text-text-secondary leading-relaxed">
                NameCheckGhana is free to use and always will be. If this tool saved you time before registering your business, consider buying me a coffee to keep the servers running and the search fast.
              </p>

              {/* Success state */}
              {step === 'success' ? (
                <div className="flex flex-col items-center gap-5 py-6 animate-fade-in-up">
                  <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                    <span className="material-icons text-accent text-[32px]">favorite</span>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-text-primary mb-1">Thank you so much!</h3>
                    <p className="text-sm text-text-secondary">
                      Your support of <span className="text-accent font-semibold">GH₵ {selectedAmount}</span> means the world.
                      NameCheckGhana stays free because of supporters like you.
                    </p>
                  </div>
                  <button id="support-again" onClick={handleReset} className="btn-ghost">
                    <span className="material-icons text-[16px]">refresh</span>
                    Support Again
                  </button>
                </div>
              ) : (
                <>
                  {/* Amount selector */}
                  <div className="flex flex-col gap-3">
                    <p className="text-xs text-text-muted font-medium uppercase tracking-wider">Choose an amount (GH₵)</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {AMOUNTS.map((amt) => (
                        <button
                          key={amt}
                          id={`amount-${amt}`}
                          onClick={() => handleAmountClick(amt)}
                          className={`p-4 rounded-xl border font-bold text-lg transition-all duration-200 ${
                            selectedAmount === amt
                              ? 'border-accent bg-accent/10 text-accent shadow-[0_0_0_2px_rgba(0,200,150,0.2)]'
                              : 'border-[#262626] bg-[#0d0d0d] text-text-primary hover:border-[#363636] hover:bg-white/3'
                          }`}
                        >
                          {amt}
                          <span className="text-xs font-normal text-text-muted block">GH₵</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Details panel - slide down */}
                  {step === 'details' && (
                    <div className="flex flex-col gap-4 animate-slide-down overflow-hidden">
                      <div className="h-px bg-[#1e1e1e]" />
                      <p className="text-xs text-text-muted uppercase tracking-wider font-medium">Your details (optional)</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                          <label htmlFor="supporter-name" className="text-xs text-text-muted">Name</label>
                          <input
                            id="supporter-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            className="input-base px-4 py-2.5 text-sm"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label htmlFor="supporter-email" className="text-xs text-text-muted">Email</label>
                          <input
                            id="supporter-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="input-base px-4 py-2.5 text-sm"
                          />
                        </div>
                      </div>
                      <button
                        id="pay-button"
                        onClick={handlePay}
                        disabled={loading}
                        className="btn-primary w-full py-3"
                      >
                        {loading ? (
                          <>
                            <span className="material-icons text-[18px] animate-spin">refresh</span>
                            Processing…
                          </>
                        ) : (
                          <>
                            <span className="material-icons text-[18px]">payments</span>
                            Pay GH₵ {selectedAmount} via Paystack
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Security note */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="material-icons text-text-muted text-[15px]">lock</span>
                    <p className="text-xs text-text-muted">
                      Secured by Paystack — your payment details are never stored.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Creator Card */}
            <div className="card p-6 md:p-7 flex flex-col sm:flex-row items-center sm:items-start gap-6 border-[#262626] bg-[#161616]/40 backdrop-blur-sm animate-fade-in-up">
              {/* Profile image frame */}
              <div className="relative group w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-[#0d0d0d] border border-accent/20 flex-shrink-0 flex items-center justify-center shadow-lg transition-transform hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-tr from-accent/15 to-transparent opacity-50" />
                {/* Visual Image Tag with fallback to styled initial symbol */}
                <img
                  src="/Eli_eli.jpeg"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                    const fallback = (e.target as HTMLElement).nextElementSibling;
                    if (fallback) (fallback as HTMLElement).style.display = 'flex';
                  }}
                  alt="Richard Elikem Amenorpe"
                  className="absolute inset-0 w-full h-full object-cover object-top z-10"
                />
                <div className="hidden absolute inset-0 z-20 flex-col items-center justify-center bg-gradient-to-tr from-[#161616] to-[#262626]">
                  <span className="text-lg font-bold text-accent tracking-wider">RE</span>
                </div>
                <span className="material-icons text-[36px] text-accent/80 group-hover:scale-110 transition-transform">person</span>
                <div className="absolute bottom-1.5 right-1.5 w-3 h-3 rounded-full bg-accent border-2 border-[#0d0d0d] animate-pulse z-30" />
              </div>

              {/* Creator details */}
              <div className="flex-1 text-center sm:text-left flex flex-col gap-2">
                <div className="flex flex-col">
                  <span className="text-xxs font-bold text-accent uppercase tracking-widest">Lead Architect</span>
                  <h3 className="text-lg font-bold text-text-primary mt-0.5">Richard Elikem Amenorpe</h3>
                  <p className="text-xs text-text-secondary">Founder at <span className="text-accent font-semibold">EliTech CreaTives</span></p>
                </div>
                <p className="text-xs text-text-muted leading-relaxed max-w-sm">
                  A software engineer and creative designer dedicated to crafting elegant web solutions and robust open-source tools for the Ghanaian developer ecosystem.
                </p>

                {/* Professional links */}
                <div className="flex items-center justify-center sm:justify-start gap-3 mt-2 flex-wrap">
                  <a
                    href="https://www.linkedin.com/in/richard-elikem-292107309/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#262626] hover:border-accent/40 bg-[#0d0d0d] text-text-secondary hover:text-accent transition-all"
                  >
                    <span className="material-icons text-[14px]">link</span>
                    LinkedIn
                  </a>
                  <a
                    href="mailto:richardelikem31@gmail.com"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#262626] hover:border-accent/40 bg-[#0d0d0d] text-text-secondary hover:text-accent transition-all"
                  >
                    <span className="material-icons text-[14px]">mail</span>
                    Email
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right — Resources + Feedback ── */}
          <div className="lg:col-span-5 reveal-right flex flex-col gap-6">
            {/* Resource links */}
            <div className="card p-6 flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span className="w-1 h-5 bg-accent rounded-full" />
                <h3 className="text-sm font-semibold text-text-primary">Official Resources</h3>
              </div>
              <div className="flex flex-col gap-2">
                {RESOURCES.map((res) => (
                  <a
                    key={res.label}
                    href={res.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/4 border border-transparent hover:border-[#262626] transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#0d0d0d] border border-[#262626] flex items-center justify-center flex-shrink-0">
                      <span className="material-icons text-text-muted text-[16px] group-hover:text-accent transition-colors">{res.icon}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors truncate">{res.label}</p>
                      <p className="text-xs text-text-muted truncate">{res.desc}</p>
                    </div>
                    <span className="material-icons text-text-muted text-[16px] flex-shrink-0">arrow_forward</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Feedback box */}
            <div className="card p-6 flex flex-col gap-4 bg-accent/3 border-accent/15">
              <div className="flex items-center gap-3">
                <span className="material-icons text-accent text-[22px]">rate_review</span>
                <h3 className="text-sm font-semibold text-text-primary">Got feedback?</h3>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Help improve NameCheckGhana. Found a bug, missing a feature, or have a suggestion? We'd love to hear from you.
              </p>
              <a
                href="mailto:richardelikem31@gmail.com"
                id="feedback-email"
                className="btn-ghost w-fit"
              >
                <span className="material-icons text-[16px]">mail</span>
                Send Feedback
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
