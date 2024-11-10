import { NewsItem } from '../types';

export const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'OpenAI Announces GPT-5 Development Progress',
    description: 'Latest developments in language model capabilities and improvements in context understanding.',
    source: 'Tech Chronicle',
    date: new Date().toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
    url: 'https://example.com/news/1',
    category: 'Research'
  },
  {
    id: '2',
    title: 'AI Ethics Board Establishes New Guidelines',
    description: 'Global AI ethics committee releases comprehensive guidelines for responsible AI development.',
    source: 'AI Weekly',
    date: new Date().toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485',
    url: 'https://example.com/news/2',
    category: 'Ethics'
  },
  {
    id: '3',
    title: "Google DeepMind's Latest Healthcare Innovation",
    description: 'Breakthrough in medical diagnosis using advanced machine learning algorithms.',
    source: 'Health Tech Today',
    date: new Date().toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144',
    url: 'https://example.com/news/3',
    category: 'Applications'
  },
  {
    id: '4',
    title: 'AI Startups Receive Record Investment in Q1 2024',
    description: 'Venture capital funding in AI sector reaches new heights with focus on sustainable solutions.',
    source: 'Business Insider',
    date: new Date().toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74',
    url: 'https://example.com/news/4',
    category: 'Industry'
  }
];