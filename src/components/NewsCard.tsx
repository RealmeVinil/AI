import React, { useState } from 'react';
import { ExternalLink, Calendar, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { NewsItem } from '../types';

interface NewsCardProps {
  news: NewsItem;
}

export function NewsCard({ news }: NewsCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {!imageError ? (
          <>
            <div className={`absolute inset-0 bg-gray-200 animate-pulse ${imageLoaded ? 'hidden' : ''}`} />
            <img
              src={news.imageUrl}
              alt={news.title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onError={handleImageError}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
              crossOrigin="anonymous"
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
        )}
        <span className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          {news.category}
        </span>
      </div>
      <div className="p-6">
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <Calendar className="w-4 h-4 mr-2" />
          {format(new Date(news.date), 'MMM dd, yyyy')}
        </div>
        <h3 className="text-xl font-bold mb-2 text-gray-800 line-clamp-2">{news.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{news.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Source: {news.source}</span>
          <a
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            Read More
            <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
}