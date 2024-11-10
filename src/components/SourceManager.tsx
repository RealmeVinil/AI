import React, { useState } from 'react';
import { Plus, X, Settings } from 'lucide-react';
import { NewsSource, NewsCategory } from '../types';

interface SourceManagerProps {
  sources: NewsSource[];
  onSourcesChange: (sources: NewsSource[]) => void;
}

export function SourceManager({ sources, onSourcesChange }: SourceManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newSource, setNewSource] = useState<Partial<NewsSource>>({
    type: 'website',
    active: true,
    category: 'Research'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSource.name || !newSource.url) return;

    const source: NewsSource = {
      id: `source-${Date.now()}`,
      name: newSource.name,
      url: newSource.url,
      type: newSource.type || 'website',
      category: newSource.category || 'Research',
      active: true,
      selectors: {
        title: 'article h2, .article-title, .post-title, h1.title',
        description: 'article p:first-of-type, .article-excerpt, .post-excerpt',
        date: 'time, .date, .published-date',
        image: 'article img, .featured-image img'
      }
    };

    onSourcesChange([...sources, source]);
    setNewSource({ type: 'website', active: true, category: 'Research' });
  };

  const toggleSource = (id: string) => {
    onSourcesChange(
      sources.map(source =>
        source.id === id ? { ...source, active: !source.active } : source
      )
    );
  };

  const removeSource = (id: string) => {
    onSourcesChange(sources.filter(source => source.id !== id));
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
      >
        <Settings className="w-4 h-4" />
        Manage Sources
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Manage News Sources</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto">
              <form onSubmit={handleSubmit} className="mb-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Source Name"
                    value={newSource.name || ''}
                    onChange={e => setNewSource(prev => ({ ...prev, name: e.target.value }))}
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="url"
                    placeholder="Source URL"
                    value={newSource.url || ''}
                    onChange={e => setNewSource(prev => ({ ...prev, url: e.target.value }))}
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <select
                    value={newSource.category || 'Research'}
                    onChange={e => setNewSource(prev => ({ ...prev, category: e.target.value as NewsCategory }))}
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Research">Research</option>
                    <option value="Industry">Industry</option>
                    <option value="Ethics">Ethics</option>
                    <option value="Applications">Applications</option>
                  </select>
                  <select
                    value={newSource.type || 'website'}
                    onChange={e => setNewSource(prev => ({ ...prev, type: e.target.value as 'website' | 'rss' }))}
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="website">Website</option>
                    <option value="rss">RSS Feed</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Source
                </button>
              </form>

              <div className="space-y-3">
                {sources.map(source => (
                  <div
                    key={source.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{source.name}</h3>
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                          {source.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{source.url}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleSource(source.id)}
                        className={`px-3 py-1 text-sm rounded ${
                          source.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {source.active ? 'Active' : 'Inactive'}
                      </button>
                      <button
                        onClick={() => removeSource(source.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}