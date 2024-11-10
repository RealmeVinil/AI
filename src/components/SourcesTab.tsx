import React from 'react';
import { Globe, Rss, Check, X } from 'lucide-react';
import { NewsSource } from '../types';

interface SourcesTabProps {
  sources: NewsSource[];
  onSourcesChange: (sources: NewsSource[]) => void;
}

export function SourcesTab({ sources, onSourcesChange }: SourcesTabProps) {
  const websiteSources = sources.filter(source => source.type === 'website');
  const rssSources = sources.filter(source => source.type === 'rss');

  const toggleSource = (sourceId: string) => {
    onSourcesChange(
      sources.map(source =>
        source.id === sourceId ? { ...source, active: !source.active } : source
      )
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Globe className="w-6 h-6" />
          Website Sources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {websiteSources.map(source => (
            <div
              key={source.id}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{source.name}</h3>
                <button
                  onClick={() => toggleSource(source.id)}
                  className={`p-1 rounded-full ${
                    source.active
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {source.active ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-2">{source.url}</p>
              <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                {source.category}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Rss className="w-6 h-6" />
          RSS Feeds
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rssSources.map(source => (
            <div
              key={source.id}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{source.name}</h3>
                <button
                  onClick={() => toggleSource(source.id)}
                  className={`p-1 rounded-full ${
                    source.active
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {source.active ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-2">{source.url}</p>
              <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                {source.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}