import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { SearchResult } from '../hooks/useBusinessSearch';

interface ResultsSectionProps {
  result: SearchResult | null;
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
  onSearch: (name: string, filter?: string) => void;
  lastSearched: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' as any } }
};

export default function ResultsSection({
  result,
  loading,
  error,
  hasSearched,
  onSearch,
  lastSearched,
}: ResultsSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState('ALL');

  // Extract all unique business types from results for dynamic filtering
  const uniqueTypes = result
    ? ['ALL', ...Array.from(new Set(result.results.map(r => r.businessType.toUpperCase())))]
    : ['ALL'];

  // Automatically reset states back to defaults whenever a new search result is loaded
  useEffect(() => {
    setCurrentPage(1);
    setSelectedType('ALL');
  }, [result]);

  // Automatically reset page back to 1 if the business type filter shifts
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedType]);

  if (!hasSearched) return null;

  // Filter results by selected business type
  const filteredResults = result
    ? result.results.filter(
        r => selectedType === 'ALL' || r.businessType.toUpperCase() === selectedType
      )
    : [];

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResults = filteredResults.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  return (
    <section id="results" className="max-w-content mx-auto px-6 lg:px-10 py-12 scroll-mt-24">
      {/* Divider */}
      <div className="h-px bg-[#1e1e1e] mb-10" />

      {/* 2. LOADING State */}
      {loading && (
        <div className="flex flex-col gap-6 items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-[#161616] border border-[#262626] rounded-xl p-6 flex flex-col gap-4 animate-pulse"
              >
                {/* Wide shimmer bar */}
                <div className="h-5 w-3/4 rounded-md shimmer-bar bg-white/5" />
                {/* Narrow shimmer bar */}
                <div className="h-4 w-1/3 rounded-md shimmer-bar bg-white/5" />
              </div>
            ))}
          </div>
          <span className="text-sm text-[#737373] animate-pulse-slow flex items-center gap-2">
            <span className="material-icons text-[16px] animate-spin">refresh</span>
            Scanning ORC Registry...
          </span>
        </div>
      )}

      {/* 3. ERROR State */}
      {!loading && error && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="max-w-xl mx-auto bg-[#161616] border border-[#262626] border-l-[3px] border-l-[#ef4444] rounded-xl p-6 flex flex-col gap-4"
        >
          <div className="flex items-start gap-3">
            <span className="material-icons text-[#ef4444] text-[24px]">error_outline</span>
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              <h4 className="font-bold text-[#f0f0f0] text-[15px]">Search Failed</h4>
              <p className="text-sm text-[#a0a0a0] leading-relaxed">
                {error}
              </p>
            </div>
          </div>

          {/* Secondary fallback link for network issues */}
          {(error.toLowerCase().includes('unreachable') ||
            error.toLowerCase().includes('time out') ||
            error.toLowerCase().includes('timed out') ||
            error.toLowerCase().includes('connect')) && (
            <a
              href="https://rgdonline.gegov.gov.gh/orc-app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-accent hover:underline flex items-center gap-1 font-semibold pl-9"
            >
              Check ORC directly <span className="material-icons text-[13px] leading-none">arrow_forward</span>
            </a>
          )}

          {/* Try Again Button */}
          <div className="pl-9 mt-1">
            <button
              onClick={() => onSearch(lastSearched)}
              className="btn-ghost text-xs px-3.5 py-2 font-bold text-[#f0f0f0] flex items-center gap-1.5"
            >
              <span className="material-icons text-[14px]">refresh</span>
              Try Again
            </button>
          </div>
        </motion.div>
      )}

      {/* 4. AVAILABLE State */}
      {!loading && !error && result && result.status === 'available' && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="max-w-xl mx-auto bg-[#161616] border border-[#262626] border-l-[3px] border-l-[#22c55e] rounded-xl p-6 flex flex-col gap-5"
        >
          <div className="flex gap-3">
            <span className="material-icons text-[#22c55e] text-[24px] flex-shrink-0">check_circle</span>
            <div className="flex flex-col gap-1">
              <h4 className="font-bold text-[#f0f0f0] text-[16px]">Name Available</h4>
              <p className="text-xs text-[#737373] leading-relaxed">
                No registered business found matching this name in the ORC Ghana registry.
              </p>
            </div>
          </div>

          <div className="pl-9 py-4 border-y border-[#262626]/55 flex flex-col gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              SEARCHED NAME
            </span>
            <span className="text-lg font-bold text-[#f0f0f0] tracking-tight">
              {result.searched}
            </span>
          </div>

          <div className="pl-9 flex flex-col gap-3">
            <p className="text-xs text-[#737373] leading-relaxed">
              Availability does not guarantee approval. Verify officially at ORC Ghana before proceeding.
            </p>
            <a
              href="https://rgdonline.gegov.gov.gh/orc-app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-accent hover:underline font-semibold flex items-center gap-1 w-fit"
            >
              Search on ORC Ghana <span className="material-icons text-[13px] leading-none">open_in_new</span>
            </a>
          </div>
        </motion.div>
      )}

      {/* 5. TAKEN State */}
      {!loading && !error && result && result.status === 'taken' && (
        <div className="w-full flex flex-col gap-6 animate-fade-in-up">
          {/* Header card */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="bg-[#161616] border border-[#262626] border-l-[3px] border-l-[#ef4444] rounded-xl p-6 flex items-start gap-3"
          >
            <span className="material-icons text-[#ef4444] text-[24px] flex-shrink-0">cancel</span>
            <div className="flex flex-col gap-1">
              <h4 className="font-bold text-[#f0f0f0] text-[16px]">Name Already Registered</h4>
              <p className="text-xs text-[#737373] leading-relaxed">
                {result.count} matching business{result.count !== 1 ? 'es' : ''} found
              </p>
            </div>
          </motion.div>

          {/* Business Type Filter Selector */}
          {uniqueTypes.length > 2 && (
            <div className="flex flex-wrap gap-2 items-center bg-[#111111] border border-[#1e1e1e] p-3 rounded-xl">
              <span className="text-[10px] text-[#737373] font-bold uppercase tracking-wider mr-1 pl-1">
                Filter by Type:
              </span>
              {uniqueTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 ${
                    selectedType === type
                      ? 'border-accent bg-accent/10 text-accent font-bold shadow-[0_0_0_2px_rgba(0,200,150,0.1)]'
                      : 'border-[#262626] bg-[#161616] text-[#737373] hover:border-[#3a3a3a] hover:text-[#f0f0f0]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          )}

          {/* Result cards (Listed two inline - grid system aligned horizontally) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedResults.map((record, i) => (
              <motion.div
                key={i}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                className="bg-[#161616] border border-[#262626] rounded-xl p-5 flex flex-row items-center justify-between gap-4 hover:border-accent/40 transition-colors"
              >
                <span className="font-semibold text-[#f0f0f0] text-[14px] leading-snug tracking-tight">
                  {record.businessName}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold bg-[#1e1e1e] border border-[#262626] text-[#737373] uppercase tracking-wider flex-shrink-0">
                  {record.businessType}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Pagination control bar */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-[#1e1e1e]">
              <p className="text-xs text-[#737373] font-medium">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredResults.length)} of {filteredResults.length} results
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                  className="p-2 rounded-lg border border-[#262626] bg-[#161616] text-[#737373] hover:text-[#f0f0f0] hover:border-accent disabled:opacity-30 disabled:hover:border-[#262626] disabled:hover:text-[#737373] transition-all flex items-center justify-center"
                >
                  <span className="material-icons text-[18px]">chevron_left</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-9 h-9 rounded-lg border font-bold text-xs transition-all flex items-center justify-center ${
                      currentPage === page
                        ? 'border-accent bg-accent/10 text-accent font-bold shadow-[0_0_0_2px_rgba(0,200,150,0.15)]'
                        : 'border-[#262626] bg-[#161616] text-[#737373] hover:text-[#f0f0f0] hover:border-accent'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                  className="p-2 rounded-lg border border-[#262626] bg-[#161616] text-[#737373] hover:text-[#f0f0f0] hover:border-accent disabled:opacity-30 disabled:hover:border-[#262626] disabled:hover:text-[#737373] transition-all flex items-center justify-center"
                >
                  <span className="material-icons text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          )}

          {/* Bottom helper text */}
          <p className="text-xs text-[#737373] text-center italic mt-2">
            Consider a different name or add a unique identifier to distinguish your business.
          </p>
        </div>
      )}
    </section>
  );
}
