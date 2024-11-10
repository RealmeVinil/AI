import React, { useState } from 'react';
import { Plus, Trash2, Power, Settings } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { FeedSource, SourceType, WebsiteSelectors } from '../../types';

const defaultSelectors: WebsiteSelectors = {
  article: 'article',
  title: 'h2',
  description: 'p',
  date: 'time',
  link: 'a',
  image: 'img',
};

export function AdminPanel() {
  const { state, addFeedSource, removeFeedSource, toggleFeedSource, logout } = useAdmin();
  const [showSelectors, setShowSelectors] = useState(false);
  const [newSource, setNewSource] = useState({
    name: '',
    url: '',
    category: 'Research',
    active: true,
    type: 'rss' as SourceType,
    selectors: { ...defaultSelectors },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addFeedSource(newSource);
    setNewSource({
      name: '',
      url: '',
      category: 'Research',
      active: true,
      type: 'rss',
      selectors: { ...defaultSelectors },
    });
    setShowSelectors(false);
  };

  const updateSelector = (key: keyof WebsiteSelectors, value: string) => {
    setNewSource(prev => ({
      ...prev,
      selectors: {
        ...prev.selectors!,
        [key]: value,
      },
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
        <button
          onClick={logout}
          className="flex items-center text-red-600 hover:text-red-800"
        >
          <Power className="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Source Name"
            value={newSource.name}
            onChange={e => setNewSource(prev => ({ ...prev, name: e.target.value }))}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="url"
            placeholder="Source URL"
            value={newSource.url}
            onChange={e => setNewSource(prev => ({ ...prev, url: e.target.value }))}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
          <select
            value={newSource.category}
            onChange={e => setNewSource(prev => ({ ...prev, category: e.target.value }))}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="Research">Research</option>
            <option value="Industry">Industry</option>
            <option value="Ethics">Ethics</option>
            <option value="Applications">Applications</option>
          </select>
          <select
            value={newSource.type}
            onChange={e => {
              const type = e.target.value as SourceType;
              setNewSource(prev => ({ ...prev, type }));
              setShowSelectors(type === 'website');
            }}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="rss">RSS Feed</option>
            <option value="website">Website</option>
          </select>
        </div>

        {showSelectors && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">CSS Selectors</h3>
              <button
                type="button"
                onClick={() => setNewSource(prev => ({ ...prev, selectors: defaultSelectors }))}
                className="text-blue-600 hover:text-blue-800"
              >
                Reset to Defaults
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(newSource.selectors!).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {key.charAt(0).toUpperCase() + key.slice(1)} Selector
                  </label>
                  <input
                    type="text"
                    value={value}
                    onChange={e => updateSelector(key as keyof WebsiteSelectors, e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder={`e.g., ${defaultSelectors[key as keyof WebsiteSelectors]}`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Source
        </button>
      </form>

      <div className="space-y-4">
        {state.feedSources.map((source: FeedSource) => (
          <div
            key={source.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-800">{source.name}</h3>
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                  {source.type}
                </span>
              </div>
              <p className="text-sm text-gray-600">{source.url}</p>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {source.category}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => toggleFeedSource(source.id)}
                className={`px-3 py-1 rounded ${
                  source.active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {source.active ? 'Active' : 'Inactive'}
              </button>
              <button
                onClick={() => removeFeedSource(source.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}