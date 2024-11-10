export type NewsCategory = 'Research' | 'Industry' | 'Ethics' | 'Applications';

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  source: string;
  date: string;
  imageUrl: string;
  url: string;
  category: NewsCategory;
  isGlobalImpact?: boolean;
}

export interface NewsSource {
  id: string;
  name: string;
  url: string;
  type: 'rss' | 'website';
  category: NewsCategory;
  active: boolean;
  selectors: {
    title: string;
    description: string;
    date: string;
    image: string;
  };
}