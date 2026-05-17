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

  const searchBusiness = async (name: string, filter = 'cn') => {
    const trimmed = name.trim();
    if (!trimmed || trimmed.length < 2) {
      toast.error('Please enter a business name');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setHasSearched(true);

    // Show persistent warning toast to prompt patience for slow live scrapers
    toast.loading('Querying the live ORC registry... This will take a few seconds, please be patient.', {
      id: 'orc-search-toast'
    });

    const executeFetch = async (isRetry = false): Promise<boolean> => {
      try {
        const [response] = await Promise.all([
          fetch(`/api/search?name=${encodeURIComponent(trimmed)}&searchType=${filter}`),
          new Promise((resolve) => setTimeout(resolve, 700))
        ]);

        const data = await response.json();

        if (response.ok) {
          toast.success('Search completed successfully!', { id: 'orc-search-toast' });
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
          return true;
        } else {
          // Automatically retry search once after 2 seconds if the API returns a TIMEOUT
          if (data.code === 'TIMEOUT' && !isRetry) {
            toast.loading('ORC registry is slow right now — retrying...', { id: 'orc-search-toast' });
            await new Promise((resolve) => setTimeout(resolve, 2000));
            return await executeFetch(true);
          }

          if (data.code === 'UNREACHABLE') {
            toast.error('ORC registry appears to be down. Try again later.', { id: 'orc-search-toast' });
          } else {
            toast.error(data.error || 'Failed to search business', { id: 'orc-search-toast' });
          }

          setError(data.error || 'Failed to search business');
          return false;
        }
      } catch (err) {
        console.error('Business search failed:', err);
        setError('Network error — check your connection');
        toast.error('Network error — check your connection', { id: 'orc-search-toast' });
        return false;
      }
    };

    try {
      await executeFetch(false);
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
