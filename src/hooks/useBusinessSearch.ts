import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export interface SearchResult {
  searched: string;
  status: 'available' | 'taken';
  count: number;
  results: Array<{
    businessName: string;
    businessType: string;
  }>;
  source: string;
}

export function useBusinessSearch() {
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load initial recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('namecheckgh_recent');
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse recent searches', e);
    }
  }, []);

  const searchBusiness = async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed || trimmed.length < 2) {
      toast.error('Please enter a business name');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setHasSearched(true);

    try {
      const [response] = await Promise.all([
        fetch(`/api/search?name=${encodeURIComponent(trimmed)}`),
        new Promise((resolve) => setTimeout(resolve, 700))
      ]);

      const data = await response.json();

      if (response.ok) {
        setResult(data);

        // Update recent searches in state and localStorage
        setRecentSearches((prev) => {
          // Deduplicate case-insensitively
          const filtered = prev.filter(
            (item) => item.toLowerCase() !== trimmed.toLowerCase()
          );
          const updated = [trimmed, ...filtered].slice(0, 5);
          localStorage.setItem('namecheckgh_recent', JSON.stringify(updated));
          return updated;
        });
      } else {
        setError(data.error || 'Failed to search business');
        toast.error(data.error || 'Failed to search business');
      }
    } catch (err) {
      console.error('Business search failed:', err);
      setError('Network error — check your connection');
      toast.error('Network error — check your connection');
    } finally {
      setLoading(false);
    }
  };

  const clearRecent = () => {
    localStorage.removeItem('namecheckgh_recent');
    setRecentSearches([]);
    toast.success('Recent searches cleared');
  };

  return {
    result,
    loading,
    error,
    hasSearched,
    searchBusiness,
    recentSearches,
    clearRecent
  };
}
