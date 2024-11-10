import * as cheerio from 'cheerio';
import { NewsItem, NewsSource } from '../types';

export function parseWebsite(html: string, source: NewsSource): NewsItem[] {
  const $ = cheerio.load(html, { xmlMode: true });
  const news: NewsItem[] = [];
  const seen = new Set<string>();

  try {
    $('item').each((i, element) => {
      const title = $(element).find('title').text().trim();
      if (!title || seen.has(title)) return;
      seen.add(title);

      const description = $(element).find('description').text().trim();
      const dateText = $(element).find('pubDate').text().trim();
      const link = $(element).find('link').text().trim();
      
      // Extract image from media:content, enclosure, or description HTML
      let imageUrl = $(element).find('media\\:content, media\\:thumbnail').attr('url') ||
                    $(element).find('enclosure[type^="image"]').attr('url');

      if (!imageUrl) {
        // Try to extract image from description HTML
        const $desc = cheerio.load(description);
        imageUrl = $desc('img').first().attr('src');
      }

      // Fallback to a relevant AI-themed Unsplash image if no image is found
      if (!imageUrl) {
        imageUrl = getAIThemedImage(i);
      }

      if (title && description && link) {
        news.push({
          id: `${source.id}-${i}`,
          title: cleanText(title),
          description: cleanText(stripHtml(description)).substring(0, 300) + '...',
          source: source.name,
          date: parseDate(dateText),
          imageUrl: formatUrl(imageUrl, source.url),
          url: formatUrl(link, source.url),
          category: source.category
        });
      }
    });
  } catch (error) {
    console.error('Parsing error:', error);
    return [];
  }

  return news;
}

function cleanText(text: string): string {
  return text
    .replace(/[\n\r\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function parseDate(dateText: string): string {
  const date = new Date(dateText);
  return !isNaN(date.getTime()) ? date.toISOString() : new Date().toISOString();
}

function formatUrl(url: string | undefined, baseUrl: string): string {
  if (!url) return baseUrl;
  try {
    return url.startsWith('http') ? url : new URL(url, baseUrl).toString();
  } catch {
    return baseUrl;
  }
}

function getAIThemedImage(index: number): string {
  // Curated list of AI-themed Unsplash images that are guaranteed to exist
  const aiImages = [
    'https://images.unsplash.com/photo-1677442136019-21780ecad995',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485',
    'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144',
    'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74',
    'https://images.unsplash.com/photo-1591453089816-0fbb971b454c',
    'https://images.unsplash.com/photo-1589254065878-42c9da997008',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995',
    'https://images.unsplash.com/photo-1488229297570-58520851e868'
  ];
  
  return aiImages[index % aiImages.length];
}