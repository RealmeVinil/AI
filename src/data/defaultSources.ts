import { NewsSource } from '../types';

export const defaultSources: NewsSource[] = [
  {
    id: 'ai-news',
    name: 'AI News Daily',
    url: 'https://news.google.com/rss/search?q=artificial+intelligence+when:7d&hl=en-US&gl=US&ceid=US:en',
    type: 'website',
    category: 'Industry',
    active: true,
    selectors: {
      title: 'h3.article-title',
      description: '.article-description',
      date: '.article-date',
      image: '.article-image'
    }
  },
  {
    id: 'ai-research',
    name: 'AI Research Updates',
    url: 'https://arxiv.org/list/cs.AI/recent',
    type: 'website',
    category: 'Research',
    active: true,
    selectors: {
      title: '.list-title',
      description: '.abstract',
      date: '.list-date',
      image: '.paper-image'
    }
  },
  {
    id: 'ai-ethics',
    name: 'AI Ethics Forum',
    url: 'https://news.google.com/rss/search?q=artificial+intelligence+ethics+when:7d&hl=en-US&gl=US&ceid=US:en',
    type: 'website',
    category: 'Ethics',
    active: true,
    selectors: {
      title: '.title',
      description: '.description',
      date: '.date',
      image: '.image'
    }
  }
];