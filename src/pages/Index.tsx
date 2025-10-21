import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface SearchResult {
  title: string;
  description: string;
  url: string;
  source: string;
  emoji: string;
  color: string;
}

interface SearchResponse {
  query: string;
  ai_summary: string;
  results: SearchResult[];
  total_results: number;
  search_time: string;
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [aiSummary, setAiSummary] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchTime, setSearchTime] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);

  const trendingSearches = [
    { query: '🌸 Милые котики', emoji: '🐱', gradient: 'from-pink-200 to-purple-200' },
    { query: '✨ Рецепты десертов', emoji: '🍰', gradient: 'from-yellow-200 to-pink-200' },
    { query: '🎨 Уроки рисования', emoji: '🖌️', gradient: 'from-blue-200 to-cyan-200' },
    { query: '🌈 Красивые места', emoji: '🏞️', gradient: 'from-green-200 to-teal-200' },
    { query: '💫 Мотивация', emoji: '⭐', gradient: 'from-purple-200 to-pink-200' },
    { query: '🎵 Плейлисты', emoji: '🎶', gradient: 'from-indigo-200 to-purple-200' },
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);

    try {
      const response = await fetch('https://functions.poehali.dev/2542bb8e-8c18-40d0-bff5-11ee82f707bd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) throw new Error('Search failed');

      const data: SearchResponse = await response.json();
      setSearchResults(data.results);
      setAiSummary(data.ai_summary);
      setSearchTime(data.search_time);
    } catch (error) {
      console.error('Search error:', error);
      setAiSummary(`✨ Упс! Что-то пошло не так, но я все равно нашел кое-что для "${searchQuery}"!`);
      setSearchResults([
        {
          title: `🌸 ${searchQuery}`,
          description: 'Интересная информация ждет тебя по этой ссылке!',
          url: `https://google.com/search?q=${searchQuery}`,
          source: 'Web',
          emoji: '💫',
          color: 'pink'
        }
      ]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleTrendingSearch = (query: string) => {
    const cleanQuery = query.replace(/[🌸✨🎨🌈💫🎵]/g, '').trim();
    setSearchQuery(cleanQuery);
    const form = document.querySelector('form');
    if (form) {
      form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  const openPreview = (url: string) => {
    setPreviewUrl(url);
    setIsGeneratingPreview(true);
    setTimeout(() => setIsGeneratingPreview(false), 1500);
  };

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      pink: 'border-pink-300 bg-pink-50',
      purple: 'border-purple-300 bg-purple-50',
      blue: 'border-blue-300 bg-blue-50',
      green: 'border-green-300 bg-green-50',
    };
    return colors[color] || 'border-pink-300 bg-pink-50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 font-quicksand">
      <header className="bg-white/80 backdrop-blur-md border-b-4 border-pink-200 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="text-4xl animate-bounce">🍡</div>
              <h1 className="text-3xl font-bold font-comfortaa bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                Dango Search
              </h1>
              <div className="text-2xl">✨</div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {searchResults.length === 0 && !isSearching && (
          <div className="text-center space-y-8 py-12 animate-fade-in">
            <div className="space-y-4">
              <h2 className="text-5xl font-bold font-comfortaa bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Найди все что хочешь! 🌸
              </h2>
              <p className="text-xl text-purple-600">
                Умный поиск с милым ИИ-помощником
              </p>
            </div>

            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl">
                  🔍
                </div>
                <Input
                  type="text"
                  placeholder="Введи что ищешь..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-16 pr-4 h-16 text-lg border-4 border-pink-300 rounded-full focus:border-purple-400 bg-white/90 font-comfortaa shadow-xl"
                />
              </div>
            </form>

            <div className="space-y-4">
              <p className="text-sm font-semibold text-purple-600 font-comfortaa">💫 Популярные запросы</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {trendingSearches.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleTrendingSearch(item.query)}
                    className={`p-4 rounded-2xl bg-gradient-to-br ${item.gradient} hover:scale-105 transition-transform shadow-lg border-2 border-white/50`}
                  >
                    <div className="text-2xl mb-2">{item.emoji}</div>
                    <p className="text-sm font-semibold text-gray-700 font-comfortaa">
                      {item.query}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl mb-2">🎀</div>
                <p className="text-sm text-purple-600 font-semibold">Без рекламы</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🌟</div>
                <p className="text-sm text-purple-600 font-semibold">Свой ИИ</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">💝</div>
                <p className="text-sm text-purple-600 font-semibold">Быстро</p>
              </div>
            </div>
          </div>
        )}

        {(searchResults.length > 0 || isSearching) && (
          <div className="space-y-6 animate-fade-in">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl">
                  🔍
                </div>
                <Input
                  type="text"
                  placeholder="Введи что ищешь..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-16 pr-4 h-14 text-lg border-4 border-pink-300 rounded-full focus:border-purple-400 bg-white/90 font-comfortaa shadow-lg"
                />
              </div>
            </form>

            {isSearching && (
              <div className="text-center py-16">
                <div className="inline-block text-6xl animate-bounce mb-4">🍡</div>
                <h3 className="text-2xl font-bold text-purple-600 mb-2 font-comfortaa">
                  Ищу для тебя...
                </h3>
                <p className="text-purple-400">
                  ИИ анализирует запрос ✨
                </p>
              </div>
            )}

            {!isSearching && aiSummary && (
              <Card className="p-6 bg-gradient-to-r from-pink-50 to-purple-50 border-4 border-pink-200 rounded-3xl shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">🤖</div>
                  <div>
                    <p className="text-lg font-semibold text-purple-700 mb-2 font-comfortaa">
                      Ответ ИИ-помощника
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      {aiSummary}
                    </p>
                    {searchTime && (
                      <p className="text-sm text-purple-400 mt-3">
                        ⚡ Найдено за {searchTime}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {!isSearching && searchResults.length > 0 && (
              <div className="space-y-4">
                <p className="text-sm text-purple-600 font-semibold font-comfortaa">
                  💫 Нашлось результатов: {searchResults.length}
                </p>
                
                {searchResults.map((result, index) => (
                  <Card 
                    key={index} 
                    className={`p-6 ${getColorClass(result.color)} border-4 rounded-3xl hover:shadow-2xl transition-all hover:scale-[1.02] cursor-pointer`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{result.emoji}</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-bold text-gray-800 font-comfortaa">
                            {result.title}
                          </h3>
                          <Badge className="bg-white/80 text-purple-600 border-2 border-purple-200">
                            {result.source}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                          {result.description}
                        </p>
                        <div className="flex gap-2">
                          <a 
                            href={result.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-block"
                          >
                            <Button className="rounded-full bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-comfortaa shadow-lg">
                              <Icon name="ExternalLink" size={16} className="mr-2" />
                              Открыть сайт
                            </Button>
                          </a>
                          <Button 
                            onClick={() => openPreview(result.url)}
                            variant="outline"
                            className="rounded-full border-2 border-purple-300 hover:bg-purple-50 font-comfortaa"
                          >
                            <Icon name="Eye" size={16} className="mr-2" />
                            Превью
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <Dialog open={previewUrl !== null} onOpenChange={() => setPreviewUrl(null)}>
        <DialogContent className="max-w-4xl h-[80vh] p-0 bg-white rounded-3xl border-4 border-pink-300">
          {isGeneratingPreview ? (
            <div className="flex flex-col items-center justify-center h-full space-y-6 bg-gradient-to-br from-pink-50 to-purple-50">
              <div className="text-6xl animate-bounce">🎨</div>
              <h3 className="text-2xl font-bold text-purple-600 font-comfortaa">
                Генерирую интерфейс...
              </h3>
              <p className="text-purple-400">ИИ создает превью сайта ✨</p>
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          ) : (
            <iframe
              src={previewUrl || ''}
              className="w-full h-full rounded-3xl"
              title="Website Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          )}
        </DialogContent>
      </Dialog>

      <footer className="border-t-4 border-pink-200 mt-16 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-2xl">🍡</span>
            <span className="font-bold font-comfortaa text-purple-600">Dango Search</span>
            <span className="text-2xl">✨</span>
          </div>
          <p className="text-sm text-purple-400">
            Создано с любовью 💝 • Работает на собственном ИИ 🤖
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
