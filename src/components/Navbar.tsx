import { useState, useEffect } from 'react';

interface NavbarProps {
  onAboutClick: () => void;
  onSupportClick: () => void;
}

export default function Navbar({ onAboutClick, onSupportClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0d0d0d]/95 border-b border-[#262626] backdrop-blur-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-content mx-auto px-6 lg:px-10 h-14 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <span className="material-icons text-[#0d0d0d] text-[18px]">search</span>
          </div>
          <span className="font-bold text-[15px] tracking-tight">
            <span className="text-text-primary">NameCheck</span>
            <span className="text-accent">Ghana</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          <button
            id="nav-about"
            onClick={onAboutClick}
            className="px-4 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all"
          >
            About
          </button>
          <button
            id="nav-support"
            onClick={onSupportClick}
            className="px-4 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all"
          >
            Support
          </button>
          <a
            href="https://www.orc.gov.gh/service/name-search/"
            target="_blank"
            rel="noopener noreferrer"
            id="nav-registry"
            className="ml-2 flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm border border-[#262626] text-text-secondary hover:text-accent hover:border-accent/40 transition-all"
          >
            <span className="material-icons text-[14px]">open_in_new</span>
            Official Registry
          </a>
        </div>

        {/* Hamburger */}
        <button
          id="nav-hamburger"
          className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className="material-icons text-text-secondary">
            {menuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0d0d0d]/98 border-b border-[#262626] px-6 pb-4 flex flex-col gap-1">
          <button
            onClick={() => { onAboutClick(); setMenuOpen(false); }}
            className="text-left px-3 py-3 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all"
          >
            About
          </button>
          <button
            onClick={() => { onSupportClick(); setMenuOpen(false); }}
            className="text-left px-3 py-3 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all"
          >
            Support
          </button>
          <a
            href="https://www.orc.gov.gh/service/name-search/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-3 rounded-lg text-sm text-text-secondary hover:text-accent transition-all"
          >
            <span className="material-icons text-[14px]">open_in_new</span>
            Official Registry
          </a>
        </div>
      )}
    </nav>
  );
}
