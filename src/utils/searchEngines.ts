import { NewsSource } from '../types';
import { NewsError } from './errors';
import * as cheerio from 'cheerio';

interface SearchEngine {
  name: string;
  url: string;
  selectors: {
    results: string;
    link: string;
    title?: string;
  };
}

const SEARCH_ENGINES: SearchEngine[] = [
  {
    name: 'Google News',
    url: 'https://news.google.com/rss/search?q=artificial+intelligence&hl=en-US&gl=US&ceid=US:en',
    selectors: {
      results: 'item',
      link: 'link',
      title: 'title'
    }
  },
  {
    name: 'Bing News',
    url: 'https://www.bing.com/news/search?q=artificial+intelligence+news+source&format=rss',
    selectors: {
      results: 'item',
      link: 'link',
      title: 'title'
    }
  },
  {
    name: 'Tech News',
    url: 'https://news.google.com/rss/search?q=artificial+intelligence+technology+news&hl=en-US&gl=US&ceid=US:en',
    selectors: {
      results: 'item',
      link: 'link',
      title: 'title'
    }
  }
];

export async function extractSourcesFromFeed(html: string, engine: SearchEngine): Promise<string[]> {
  const $ = cheerio.load(html, { xmlMode: true });
  const urls = new Set<string>();

  $(engine.selectors.results).each((_, element) => {
    const link = $(element).find(engine.selectors.link).text().trim();
    if (isValidNewsSource(link)) {
      urls.add(new URL(link).origin);
    }
  });

  return Array.from(urls);
}

export function isValidNewsSource(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname.toLowerCase();
    
    // Exclude common non-news domains
    const excludedDomains = [
      'facebook.com',
      'twitter.com',
      'instagram.com',
      'youtube.com',
      'linkedin.com',
      'google.com',
      'bing.com',
      'reddit.com'
    ];

    if (excludedDomains.some(excluded => domain.includes(excluded))) {
      return false;
    }

    // Check for valid TLDs
    const validTLDs = ['.com', '.org', '.net', '.edu', '.gov', '.io'];
    if (!validTLDs.some(tld => domain.endsWith(tld))) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export function generateSourceSelectors(url: string): Record<string, string> {
  // Common selectors patterns for different types of news sites
  return {
    title: [
      'h1.article-title',
      'h1.entry-title',
      'h1.post-title',
      'article h1',
      '.article-header h1',
      '.post-header h1'
    ].join(', '),
    description: [
      '.article-content p:first-of-type',
      '.entry-content p:first-of-type',
      '.post-content p:first-of-type',
      'article p:first-of-type',
      '.article-description',
      '.article-summary'
    ].join(', '),
    date: [
      'time',
      '.article-date',
      '.post-date',
      '.entry-date',
      'meta[property="article:published_time"]',
      '.published-date'
    ].join(', '),
    image: [
      '.article-image img',
      '.post-image img',
      '.featured-image img',
      'article img:first-of-type',
      'meta[property="og:image"]',
      '.entry-content img:first-of-type'
    ].join(', ')
  };
}

export { SEARCH_ENGINES };