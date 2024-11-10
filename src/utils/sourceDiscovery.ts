import axios from 'axios';
import { NewsSource, NewsCategory } from '../types';
import { SEARCH_ENGINES, extractSourcesFromFeed, generateSourceSelectors } from './searchEngines';
import { NewsError } from './errors';

const PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://api.codetabs.com/v1/proxy?quest='
];

async function fetchWithProxy(url: string, retryCount = 0): Promise<string> {
  if (retryCount >= PROXIES.length) {
    throw new NewsError('All proxies failed');
  }

  const proxyUrl = `${PROXIES[retryCount]}${encodeURIComponent(url)}`;
  
  try {
    const response = await axios.get(proxyUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)',
        'Accept': 'text/html,application/xml,application/xhtml+xml,text/xml;q=0.9',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    });
    return response.data;
  } catch (error) {
    return fetchWithProxy(url, retryCount + 1);
  }
}

export async function discoverSources(): Promise<NewsSource[]> {
  const discoveredUrls = new Set<string>();
  const sources: NewsSource[] = [];
  const errors: Error[] = [];

  for (const engine of SEARCH_ENGINES) {
    try {
      const feed = await fetchWithProxy(engine.url);
      const urls = await extractSourcesFromFeed(feed, engine);
      
      for (const url of urls) {
        if (!discoveredUrls.has(url)) {
          discoveredUrls.add(url);
          
          const source: NewsSource = {
            id: `source-${Date.now()}-${discoveredUrls.size}`,
            name: formatSourceName(url),
            url,
            type: 'website',
            category: determineCategory(url),
            active: true,
            selectors: generateSourceSelectors(url)
          };
          
          sources.push(source);
        }
      }
    } catch (error) {
      errors.push(error as Error);
      console.error(`Error with ${engine.name}:`, error);
    }
  }

  if (sources.length === 0 && errors.length === SEARCH_ENGINES.length) {
    throw new NewsError('Failed to discover any sources', 
      errors.map(e => e.message).join(', '));
  }

  return sources;
}

function formatSourceName(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    return hostname
      .replace(/^www\./, '')
      .split('.')[0]
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ') + ' AI News';
  } catch {
    return 'AI News Source';
  }
}

function determineCategory(url: string): NewsCategory {
  const content = url.toLowerCase();
  
  if (content.includes('research') || content.includes('science') || content.includes('arxiv')) {
    return 'Research';
  }
  if (content.includes('ethics') || content.includes('policy') || content.includes('governance')) {
    return 'Ethics';
  }
  if (content.includes('application') || content.includes('implementation') || content.includes('solution')) {
    return 'Applications';
  }
  return 'Industry';
}