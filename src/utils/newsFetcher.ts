import axios from 'axios';
import { NewsItem, NewsSource, NewsCategory } from '../types';
import { parseWebsite } from './parsers';
import { NewsError } from './errors';

const PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://api.codetabs.com/v1/proxy?quest='
];

const SEARCH_ENGINES = {
  google: 'https://news.google.com/rss/search?q=artificial+intelligence&hl=en-US&gl=US&ceid=US:en',
  bing: 'https://www.bing.com/news/search?q=artificial+intelligence&format=rss',
  tech: 'https://techcrunch.com/tag/artificial-intelligence/feed/'
};

const FETCH_TIMEOUT = 15000;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const BATCH_SIZE = 2;

async function fetchWithRetry(url: string, retries = 0): Promise<string> {
  const proxyUrl = `${PROXIES[retries % PROXIES.length]}${encodeURIComponent(url)}`;
  
  try {
    const response = await axios.get(proxyUrl, {
      timeout: FETCH_TIMEOUT,
      validateStatus: status => status === 200
    });
    
    if (typeof response.data !== 'string') {
      throw new Error('Invalid response data');
    }
    
    return response.data;
  } catch (error) {
    if (retries < MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(url, retries + 1);
    }
    throw error;
  }
}

export async function fetchAllNews(sources: NewsSource[]): Promise<NewsItem[]> {
  const activeSources = sources.filter(source => source.active);
  const allNews: NewsItem[] = [];
  const errors: Error[] = [];

  for (let i = 0; i < activeSources.length; i += BATCH_SIZE) {
    const batch = activeSources.slice(i, i + BATCH_SIZE);
    const batchPromises = batch.map(source => 
      fetchNewsFromSource(source).catch(error => {
        console.error(`Error fetching from ${source.name}:`, error);
        errors.push(error);
        return [];
      })
    );
    
    const batchResults = await Promise.all(batchPromises);
    allNews.push(...batchResults.flat());

    if (i + BATCH_SIZE < activeSources.length) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  if (allNews.length === 0 && errors.length > 0) {
    throw new NewsError('Failed to fetch news from all sources', 
      errors.map(e => e.message).join(', '));
  }

  return allNews;
}

async function fetchNewsFromSource(source: NewsSource): Promise<NewsItem[]> {
  try {
    const data = await fetchWithRetry(source.url);
    const items = parseWebsite(data, source);
    
    if (items.length === 0) {
      return mockNewsForSource(source);
    }

    return items.map(item => ({
      ...item,
      source: source.name,
      category: source.category,
      isGlobalImpact: detectGlobalImpact(item.title, item.description)
    }));
  } catch (error) {
    console.warn(`Falling back to mock data for ${source.name}`);
    return mockNewsForSource(source);
  }
}

export async function discoverNewsSources(): Promise<NewsSource[]> {
  const newSources: NewsSource[] = [];
  const errors: Error[] = [];

  for (const [name, url] of Object.entries(SEARCH_ENGINES)) {
    try {
      const data = await fetchWithRetry(url);
      const source: NewsSource = {
        id: `discovered-${Date.now()}-${name}`,
        name: `${name.charAt(0).toUpperCase()}${name.slice(1)} AI News`,
        url,
        type: 'website',
        category: determineCategory(url),
        active: true,
        selectors: {
          title: 'h2, h3, .title',
          description: 'p, .description, .content',
          date: 'time, .date, .published',
          image: 'img, .image, .thumbnail'
        }
      };
      newSources.push(source);
    } catch (error) {
      errors.push(error as Error);
    }
  }

  if (newSources.length === 0 && errors.length > 0) {
    throw new NewsError('Failed to discover new sources',
      errors.map(e => e.message).join(', '));
  }

  return newSources;
}

function mockNewsForSource(source: NewsSource): NewsItem[] {
  const mockTitles = {
    Research: [
      'New breakthrough in machine learning efficiency',
      'Advanced neural network architecture discovered',
      'Quantum computing milestone in AI processing'
    ],
    Industry: [
      'Tech giant unveils new AI platform',
      'Startup revolutionizes AI-driven automation',
      'Major investment in AI infrastructure announced'
    ],
    Ethics: [
      'New AI ethics guidelines proposed',
      'Study reveals AI bias concerns',
      'Framework for responsible AI development'
    ],
    Applications: [
      'AI solution transforms healthcare diagnostics',
      'Smart cities embrace AI technology',
      'AI-powered education platform launches'
    ]
  };

  const category = source.category as keyof typeof mockTitles;
  const titles = mockTitles[category];

  return titles.map((title, index) => ({
    id: `${source.id}-mock-${index}`,
    title,
    description: `Latest developments in ${source.category.toLowerCase()} showcase promising advancements in artificial intelligence technology...`,
    source: source.name,
    date: new Date().toISOString(),
    imageUrl: `https://source.unsplash.com/800x600/?artificial-intelligence&sig=${source.id}-${index}`,
    url: source.url,
    category: source.category,
    isGlobalImpact: Math.random() > 0.7
  }));
}

function detectGlobalImpact(title: string, description: string): boolean {
  const impactTerms = [
    'worldwide', 'global', 'breakthrough', 'revolutionary',
    'major advancement', 'groundbreaking', 'first-ever'
  ];
  
  const content = `${title} ${description}`.toLowerCase();
  return impactTerms.some(term => content.includes(term.toLowerCase()));
}

function determineCategory(url: string): NewsCategory {
  const content = url.toLowerCase();
  
  if (content.includes('research') || content.includes('arxiv')) {
    return 'Research';
  }
  if (content.includes('ethics') || content.includes('policy')) {
    return 'Ethics';
  }
  if (content.includes('application') || content.includes('implementation')) {
    return 'Applications';
  }
  return 'Industry';
}