import { useRef, useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useBusinessSearch } from './hooks/useBusinessSearch';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ResultsSection from './components/ResultsSection';
import AboutSection from './components/AboutSection';
import SupportSection from './components/SupportSection';
import DisclaimerBanner from './components/DisclaimerBanner';
import Footer from './components/Footer';

export default function App() {
  const {
    result,
    loading,
    error,
    hasSearched,
    searchBusiness,
    recentSearches,
    clearRecent
  } = useBusinessSearch();

  const [lastSearched, setLastSearched] = useState('');

  const aboutRef = useRef<HTMLElement | null>(null);
  const supportRef = useRef<HTMLElement | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  const handleSearch = async (name: string) => {
    setLastSearched(name);
    await searchBusiness(name);
  };

  // Scroll to results automatically when a search is in progress or completed
  useEffect(() => {
    if (loading || result || error) {
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [loading, result, error]);

  const scrollTo = (ref: React.RefObject<HTMLElement | HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col">
      {/* react-hot-toast Notification Container */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#161616',
            color: '#f0f0f0',
            border: '1px solid #262626',
            borderRadius: '8px',
            fontSize: '14px',
          },
        }}
      />

      <Navbar
        onAboutClick={() => scrollTo(aboutRef)}
        onSupportClick={() => scrollTo(supportRef)}
      />

      <main className="flex-1">
        <HeroSection
          onSearch={handleSearch}
          isSearching={loading}
          recentSearches={recentSearches}
          clearRecent={clearRecent}
        />

        {/* Results section */}
        <div ref={resultsRef}>
          <ResultsSection
            result={result}
            loading={loading}
            error={error}
            hasSearched={hasSearched}
            onSearch={handleSearch}
            lastSearched={lastSearched}
          />
        </div>

        <AboutSection sectionRef={aboutRef} />
        <SupportSection sectionRef={supportRef} />

        {/* Quiet Footnote Banners */}
        <DisclaimerBanner />
      </main>

      <Footer />
    </div>
  );
}
