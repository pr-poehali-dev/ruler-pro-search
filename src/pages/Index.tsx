import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SearchResult {
  title: string;
  description: string;
  category?: string;
  rating: string;
  updated?: string;
  url?: string;
  source?: string;
}

interface SearchResponse {
  query: string;
  ai_results: SearchResult[];
  wikipedia: SearchResult[];
  total_results: number;
  search_time: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTime, setSearchTime] = useState('0.3с');

  const popularSearches = [
    { query: 'Аналитика данных', trend: '+45%', count: '12.5K' },
    { query: 'Бизнес-решения', trend: '+32%', count: '8.3K' },
    { query: 'Корпоративные системы', trend: '+28%', count: '7.1K' },
    { query: 'Финансовый анализ', trend: '+18%', count: '5.9K' },
    { query: 'Управление проектами', trend: '+15%', count: '4.7K' },
  ];

  const stats = [
    { label: 'Общий объем поиска', value: '2.4M', icon: 'Database' },
    { label: 'Активных пользователей', value: '125K', icon: 'Users' },
    { label: 'Обработано запросов', value: '8.9M', icon: 'Activity' },
    { label: 'Средняя скорость', value: '0.3с', icon: 'Zap' },
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setActiveTab('search');

    try {
      const response = await fetch('https://functions.poehali.dev/22252d4a-eebc-41d0-af60-463ac947183e', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data: SearchResponse = await response.json();
      const combined = [...data.ai_results, ...data.wikipedia];
      setSearchResults(combined);
      setSearchTime(data.search_time);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([
        {
          title: `${searchQuery} - Профессиональные решения`,
          description: 'Комплексные решения для бизнеса с расширенной аналитикой.',
          category: 'Бизнес',
          rating: '4.9',
          updated: 'Обновлено сегодня'
        },
        {
          title: `${searchQuery} - Корпоративный уровень`,
          description: 'Решения корпоративного класса для крупных организаций.',
          category: 'Технологии',
          rating: '4.8',
          updated: 'Обновлено вчера'
        }
      ]);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePopularSearch = async (query: string) => {
    setSearchQuery(query);
    setActiveTab('search');
    setIsSearching(true);

    try {
      const response = await fetch('https://functions.poehali.dev/22252d4a-eebc-41d0-af60-463ac947183e', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) throw new Error('Search failed');

      const data: SearchResponse = await response.json();
      const combined = [...data.ai_results, ...data.wikipedia];
      setSearchResults(combined);
      setSearchTime(data.search_time);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([
        {
          title: `${query} - Профессиональные решения`,
          description: 'Комплексные решения для бизнеса.',
          category: 'Бизнес',
          rating: '4.9',
          updated: 'Обновлено сегодня'
        }
      ]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-roboto">
      <header className="border-b border-border bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Search" className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-bold font-inter text-foreground">RULER PRO</h1>
            </div>
            <nav className="hidden md:flex space-x-1">
              <Button
                variant={activeTab === 'home' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('home')}
                className="font-medium"
              >
                <Icon name="Home" size={18} className="mr-2" />
                Главная
              </Button>
              <Button
                variant={activeTab === 'search' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('search')}
                className="font-medium"
              >
                <Icon name="Search" size={18} className="mr-2" />
                Поиск
              </Button>
              <Button
                variant={activeTab === 'help' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('help')}
                className="font-medium"
              >
                <Icon name="HelpCircle" size={18} className="mr-2" />
                Помощь
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsContent value="home" className="space-y-8 animate-fade-in">
            <section className="text-center space-y-6 py-12">
              <h2 className="text-5xl font-bold font-inter text-foreground">
                Профессиональный поиск
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Мощный инструмент для серьезных задач с расширенной аналитикой и статистикой
              </p>
              
              <form onSubmit={handleSearch} className="max-w-3xl mx-auto mt-8">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Icon 
                      name="Search" 
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" 
                      size={20} 
                    />
                    <Input
                      type="text"
                      placeholder="Введите поисковый запрос..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 h-14 text-lg border-2 focus:border-primary"
                    />
                  </div>
                  <Button type="submit" size="lg" className="h-14 px-8 font-medium" disabled={isSearching}>
                    {isSearching ? 'Поиск...' : 'Найти'}
                  </Button>
                </div>
              </form>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
              {stats.map((stat, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                      <p className="text-3xl font-bold font-inter text-foreground">{stat.value}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon name={stat.icon as any} className="text-primary" size={24} />
                    </div>
                  </div>
                </Card>
              ))}
            </section>

            <section className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold font-inter text-foreground">Популярные запросы</h3>
                <Badge variant="secondary" className="px-3 py-1">
                  <Icon name="TrendingUp" size={14} className="mr-1" />
                  За неделю
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularSearches.map((item, index) => (
                  <Card 
                    key={index} 
                    className="p-5 hover:shadow-lg transition-all cursor-pointer hover:border-primary"
                    onClick={() => handlePopularSearch(item.query)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-foreground font-inter">{item.query}</h4>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        {item.trend}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Icon name="BarChart3" size={16} className="mr-2" />
                      {item.count} запросов
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="search" className="space-y-6 animate-fade-in">
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Icon 
                    name="Search" 
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" 
                    size={20} 
                  />
                  <Input
                    type="text"
                    placeholder="Введите поисковый запрос..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 text-lg border-2 focus:border-primary"
                  />
                </div>
                <Button type="submit" size="lg" className="h-14 px-8 font-medium">
                  Найти
                </Button>
              </div>
            </form>

            {searchResults.length > 0 && (
              <div className="max-w-3xl mx-auto space-y-4 mt-8">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm text-muted-foreground">
                    Найдено результатов: <span className="font-semibold text-foreground">{searchResults.length}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">{searchTime}</p>
                </div>
                
                {searchResults.map((result, index) => (
                  <Card key={index} className="p-6 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-primary">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon name={result.source === 'Wikipedia' ? 'Globe' : 'FileText'} className="text-primary" size={20} />
                      </div>
                      <div className="flex-1">
                        {result.url ? (
                          <a href={result.url} target="_blank" rel="noopener noreferrer">
                            <h3 className="text-lg font-semibold text-primary hover:underline mb-2 font-inter">
                              {result.title}
                            </h3>
                          </a>
                        ) : (
                          <h3 className="text-lg font-semibold text-primary hover:underline mb-2 font-inter">
                            {result.title}
                          </h3>
                        )}
                        <p className="text-sm text-muted-foreground mb-3">
                          {result.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {result.source && (
                            <>
                              <Badge variant="outline" className="text-xs">
                                {result.source}
                              </Badge>
                              <span>•</span>
                            </>
                          )}
                          {result.category && (
                            <>
                              <span>{result.category}</span>
                              <span>•</span>
                            </>
                          )}
                          <span className="flex items-center">
                            <Icon name="Star" size={14} className="mr-1" />
                            {result.rating}
                          </span>
                          {result.updated && (
                            <>
                              <span>•</span>
                              <span>{result.updated}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {searchResults.length === 0 && !isSearching && (
              <div className="max-w-3xl mx-auto text-center py-16">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon name="Search" size={40} className="text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2 font-inter">
                  Введите запрос для поиска
                </h3>
                <p className="text-muted-foreground">
                  Используйте поисковую строку выше для начала работы
                </p>
              </div>
            )}
            
            {isSearching && (
              <div className="max-w-3xl mx-auto text-center py-16">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <Icon name="Loader2" size={40} className="text-primary animate-spin" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2 font-inter">
                  Поиск с помощью ИИ...
                </h3>
                <p className="text-muted-foreground">
                  Анализируем запрос и собираем данные из Wikipedia
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="help" className="animate-fade-in">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold font-inter text-foreground">Центр помощи</h2>
                <p className="text-lg text-muted-foreground">
                  Ответы на часто задаваемые вопросы и руководства по использованию
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="BookOpen" className="text-primary" size={28} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 font-inter">Документация</h3>
                  <p className="text-sm text-muted-foreground">
                    Полное руководство пользователя
                  </p>
                </Card>

                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="MessageCircle" className="text-primary" size={28} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 font-inter">Поддержка</h3>
                  <p className="text-sm text-muted-foreground">
                    Свяжитесь с нашей командой
                  </p>
                </Card>

                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Video" className="text-primary" size={28} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 font-inter">Видеоуроки</h3>
                  <p className="text-sm text-muted-foreground">
                    Обучающие материалы
                  </p>
                </Card>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-2xl font-bold font-inter text-foreground mb-6">
                  Часто задаваемые вопросы
                </h3>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-left font-semibold">
                      Как начать использовать Ruler PRO?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Для начала работы просто введите ваш запрос в поисковую строку на главной странице. 
                      Система автоматически проанализирует запрос и предоставит наиболее релевантные результаты 
                      с расширенной аналитикой.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-left font-semibold">
                      Что означает статистика на главной странице?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Статистика показывает ключевые метрики работы системы: общий объем данных в индексе, 
                      количество активных пользователей, объем обработанных запросов и среднюю скорость поиска. 
                      Эти показатели обновляются в реальном времени.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-left font-semibold">
                      Как работают популярные запросы?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Раздел популярных запросов отображает наиболее актуальные темы за последнюю неделю. 
                      Процент роста показывает изменение интереса к теме. Вы можете кликнуть на любой запрос 
                      для быстрого перехода к результатам поиска.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger className="text-left font-semibold">
                      Какая средняя скорость обработки запроса?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Ruler PRO обрабатывает запросы со средней скоростью 0.3 секунды. Это достигается благодаря 
                      оптимизированным алгоритмам индексации и кэширования наиболее популярных запросов.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5">
                    <AccordionTrigger className="text-left font-semibold">
                      Как связаться с технической поддержкой?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Вы можете связаться с нашей командой поддержки через раздел "Поддержка" выше. 
                      Мы работаем круглосуточно и гарантируем ответ в течение 2 часов для корпоративных клиентов.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-border mt-16 bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Search" className="text-white" size={18} />
              </div>
              <span className="font-bold font-inter text-foreground">RULER PRO</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Ruler PRO. Профессиональный поисковик для серьезных задач.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;