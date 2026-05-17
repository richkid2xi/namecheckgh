import { useState, useRef, useEffect } from 'react';
import IllustrationCard from './IllustrationCard';
import TypingCursor from './TypingCursor';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
  recentSearches: string[];
  clearRecent: () => void;
}

export default function HeroSection({
  onSearch,
  isSearching,
  recentSearches,
  clearRecent,
}: HeroSectionProps) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = query.trim();
    if (name && !isSearching) {
      onSearch(name);
    }
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen pt-14 flex items-center overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-content mx-auto px-6 lg:px-10 py-16 md:py-20 lg:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

          {/* ── Left column ── */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/5 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-slow" />
              <span className="text-xs font-medium text-accent tracking-wide uppercase">
                Ghana Business Registry Search
              </span>
            </div>

            {/* H1 */}
            <h1 className="text-4xl md:text-5xl lg:text-[52px] font-bold leading-[1.15] tracking-tight text-text-primary">
              Check if your{' '}
              <span className="gradient-text">business name</span>
              <br />
              is available in Ghana
              <TypingCursor />
            </h1>

            {/* Subtitle */}
            <p className="text-text-secondary text-base md:text-lg leading-relaxed max-w-lg">
              Instantly search the Registrar General's Department registry before filing your business name. Save time and avoid costly rejections.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2 max-w-xl">
              {/* Inline Search Bar */}
              <div
                className={`relative flex items-center p-1.5 pl-4 rounded-xl border transition-all duration-200 ${
                  focused
                    ? 'border-accent bg-surface shadow-[0_0_0_3px_rgba(0,200,150,0.1)] scale-[1.01]'
                    : 'border-[#262626] bg-surface'
                }`}
              >
                <span className="material-icons text-text-muted text-[20px] mr-2">search</span>
                <input
                  id="search-input"
                  ref={inputRef}
                  type="text"
                  disabled={isSearching}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="Enter a business name to search…"
                  className="flex-1 min-w-0 bg-transparent outline-none text-text-primary text-base placeholder:text-text-muted py-1.5 disabled:opacity-50"
                  autoComplete="off"
                />
                
                {query && !isSearching && (
                  <button
                    type="button"
                    onClick={handleClear}
                    id="search-clear"
                    className="p-1.5 mr-2 rounded-full hover:bg-white/10 transition-colors text-text-muted hover:text-text-primary"
                    aria-label="Clear search"
                  >
                    <span className="material-icons text-[18px]">close</span>
                  </button>
                )}

                <button
                  id="search-submit"
                  type="submit"
                  disabled={!query.trim() || isSearching}
                  className="btn-primary py-2.5 px-5 rounded-lg flex items-center gap-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSearching ? (
                    <>
                      <span className="material-icons text-[16px] animate-spin">refresh</span>
                      Searching…
                    </>
                  ) : (
                    <>
                      <span>Search</span>
                      <span className="material-icons text-[16px]">arrow_forward</span>
                    </>
                  )}
                </button>
              </div>

              {/* Recent Searches chips */}
              {recentSearches && recentSearches.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center mt-1 animate-fade-in-up">
                  <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Recent:</span>
                  {recentSearches.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={isSearching}
                      onClick={() => {
                        setQuery(item);
                        onSearch(item);
                      }}
                      className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-white/3 border border-[#262626] text-text-secondary hover:bg-white/5 hover:border-[#363636] hover:text-text-primary transition-all flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="material-icons text-[12px] opacity-60">history</span>
                      {item}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={isSearching}
                    onClick={clearRecent}
                    className="text-text-muted hover:text-[#ef4444] transition-colors ml-auto text-[11px] font-bold flex items-center gap-1 disabled:opacity-50"
                  >
                    <span className="material-icons text-[12px]">clear_all</span>
                    Clear History
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* ── Right column ── */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Feature card */}
            <div className="relative card p-6 overflow-hidden min-h-[280px]">
              <IllustrationCard />
              <div className="relative z-10 flex flex-col gap-5">
                {/* Card header */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                    <span className="material-icons text-accent text-[18px]">verified</span>
                  </div>
                  <div>
                    <div className="text-xs text-text-muted uppercase tracking-wider font-medium">Registry Tool</div>
                    <div className="text-sm font-semibold text-text-primary">Name Availability Check</div>
                  </div>
                </div>

                {/* Feature list */}
                <ul className="flex flex-col gap-3">
                  {[
                    { icon: 'bolt', text: 'Real-time registry queries' },
                    { icon: 'filter_list', text: 'Multiple search filter modes' },
                    { icon: 'analytics', text: 'Status & registration details' },
                    { icon: 'lock', text: 'No account required' },
                  ].map((item) => (
                    <li key={item.icon} className="flex items-center gap-3 text-sm text-text-secondary">
                      <span className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <span className="material-icons text-accent text-[14px]">{item.icon}</span>
                      </span>
                      {item.text}
                    </li>
                  ))}
                </ul>

                {/* Disclaimer chip */}
                <div className="flex items-start gap-2 p-3 rounded-lg bg-warn/5 border border-warn/20">
                  <span className="material-icons text-warn text-[15px] mt-0.5">info</span>
                  <p className="text-xs text-warn/80 leading-relaxed">
                    Results are sourced from the RGD public database. Always verify officially before filing.
                  </p>
                </div>
              </div>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: '200K+', label: 'Records', icon: 'storage' },
                { value: '4', label: 'Filter Modes', icon: 'tune' },
                { value: 'Free', label: 'No Cost', icon: 'star' },
              ].map((stat) => (
                <div key={stat.label} className="card p-4 flex flex-col items-center gap-1 text-center">
                  <span className="material-icons text-accent text-[18px]">{stat.icon}</span>
                  <span className="text-lg font-bold text-text-primary">{stat.value}</span>
                  <span className="text-xxs text-text-muted uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
