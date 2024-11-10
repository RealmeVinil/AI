import { useState, useEffect, useCallback } from 'react';
import { NewsItem, NewsSource } from '../types';
import { fetchAllNews } from '../utils/newsFetcher';
import { discoverSources } from '../utils/sourceDiscovery';
import { mockNews } from '../data/mockNews';
import { defaultSources } from '../data/defaultSources';

const FETCH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function useNews() {
  const [news, setNews] = useState<NewsItem[]>(mockNews);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sources, setSources] = useState<NewsSource[]>(defaultSources);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isDiscovering, setIsDiscovering] = useState(false);

  const fetchNews = useCallback(async () => {
    if (sources.length === 0) return;

    try {
      setLoading(true);
      setError(null);
      const items = await fetchAllNews(sources);
      
      if (items.length > 0) {
        setNews(prev => {
          const combined = [...items, ...prev];
          const unique = Array.from(
            new Map(combined.map(item => [item.id, item])).values()
          );
          return unique.sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
        });
        setLastUpdate(new Date());
      }
    } catch (err) {
      setError('Unable to fetch news. Please try again later.');
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  }, [sources]);

  const discoverNewSources = async () => {
    if (isDiscovering) return;

    try {
      setIsDiscovering(true);
      const newSources = await discoverSources();
      setSources(prev => {
        const combined = [...prev, ...newSources];
        return Array.from(
          new Map(combined.map(source => [source.url, source])).values()
        );
      });
    } catch (err) {
      console.error('Error discovering sources:', err);
    } finally {
      setIsDiscovering(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const initFetch = async () => {
      await fetchNews();
      if (mounted) {
        const interval = setInterval(fetchNews, FETCH_INTERVAL);
        return () => clearInterval(interval);
      }
    };

    initFetch();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [fetchNews]);

  return { 
    news, 
    loading, 
    error, 
    sources, 
    setSources,
    lastUpdate,
    discoverSources: discoverNewSources,
    isDiscovering
  };
}