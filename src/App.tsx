import React from 'react';
import { Header } from './components/Header';
import { NewsCard } from './components/NewsCard';
import { NewsFilter } from './components/NewsFilter';
import { SourceManager } from './components/SourceManager';
import { useNews } from './hooks/useNews';
import { Loader2 } from 'lucide-react';
import { SourcesTab } from './components/SourcesTab';

export default function App() {
  const [activeCategory, setActiveCategory] = React.useState('All');
  const [activeTab, setActiveTab] = React.useState('home');
  const { news, loading, error, sources, setSources, discoverSources } = useNews();

  const filteredNews = news
    .filter((item) => activeCategory === 'All' || item.category === activeCategory)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const trendingNews = React.useMemo(() => {
    return news
      .filter(item => item.isGlobalImpact)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
  }, [news]);

  const handleSourceDiscovery = async () => {
    await discoverSources();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'home' && (
          <>
            <section id="home" className="mb-16">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">AI News Feed</h2>
                  <p className="text-gray-600">Comprehensive coverage of artificial intelligence news</p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleSourceDiscovery}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Discover Sources
                  </button>
                  <SourceManager sources={sources} onSourcesChange={setSources} />
                </div>
              </div>

              <NewsFilter
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-600">{error}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredNews.map((news) => (
                    <NewsCard key={news.id} news={news} />
                  ))}
                </div>
              )}

              {!loading && !error && filteredNews.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600">No news found for this category.</p>
                </div>
              )}
            </section>

            <section id="trending" className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Global Impact Stories</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {trendingNews.map((news) => (
                  <NewsCard key={news.id} news={news} />
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === 'sources' && (
          <SourcesTab sources={sources} onSourcesChange={setSources} />
        )}

        <section id="about" className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About AI News Hub</h2>
          <p className="text-gray-600 mb-4">
            AI News Hub aggregates the latest artificial intelligence news from trusted sources across the web.
            Stay informed about breakthroughs in AI research, industry developments, ethical considerations,
            and practical applications of artificial intelligence.
          </p>
          <p className="text-gray-600">
            Our platform uses advanced filtering and categorization to help you focus on the AI topics
            that matter most to you, whether you're a researcher, industry professional, or AI enthusiast.
          </p>
        </section>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500">
            © {new Date().getFullYear()} AI News Hub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}