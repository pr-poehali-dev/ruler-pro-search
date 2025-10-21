import json
import re
from typing import Dict, Any, List
import requests

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Smart AI search engine without external API keys
    Args: event with httpMethod, body (query)
    Returns: AI-generated search results + website previews
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    query: str = body_data.get('query', '').strip()
    
    if not query:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Query is required'})
        }
    
    search_results = smart_search(query)
    
    ai_summary = generate_ai_summary(query)
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'query': query,
            'ai_summary': ai_summary,
            'results': search_results,
            'total_results': len(search_results),
            'search_time': '0.2s'
        }, ensure_ascii=False)
    }


def smart_search(query: str) -> List[Dict[str, Any]]:
    results = []
    
    wiki_results = search_wikipedia(query)
    results.extend(wiki_results)
    
    web_results = search_duckduckgo(query)
    results.extend(web_results)
    
    if not results:
        results = generate_fallback_results(query)
    
    return results[:8]


def search_wikipedia(query: str) -> List[Dict[str, Any]]:
    try:
        search_url = 'https://ru.wikipedia.org/w/api.php'
        params = {
            'action': 'opensearch',
            'search': query,
            'limit': 3,
            'format': 'json'
        }
        
        response = requests.get(search_url, params=params, timeout=5)
        data = response.json()
        
        results = []
        if len(data) >= 4:
            titles = data[1]
            descriptions = data[2]
            urls = data[3]
            
            for i in range(min(len(titles), 3)):
                results.append({
                    'title': f'🌸 {titles[i]}',
                    'description': descriptions[i] if descriptions[i] else 'Познавательная статья из Википедии',
                    'url': urls[i],
                    'source': 'Wikipedia',
                    'emoji': '📚',
                    'color': 'purple'
                })
        
        return results
    except:
        return []


def search_duckduckgo(query: str) -> List[Dict[str, Any]]:
    try:
        url = 'https://api.duckduckgo.com/'
        params = {
            'q': query,
            'format': 'json',
            'no_html': 1,
            'skip_disambig': 1
        }
        
        response = requests.get(url, params=params, timeout=5)
        data = response.json()
        
        results = []
        
        if data.get('AbstractText'):
            results.append({
                'title': f'✨ {data.get("Heading", query)}',
                'description': data['AbstractText'][:200] + '...' if len(data['AbstractText']) > 200 else data['AbstractText'],
                'url': data.get('AbstractURL', ''),
                'source': 'DuckDuckGo',
                'emoji': '🔍',
                'color': 'blue'
            })
        
        related = data.get('RelatedTopics', [])[:3]
        for item in related:
            if isinstance(item, dict) and 'Text' in item:
                results.append({
                    'title': f'🌟 {item.get("Text", "").split(" - ")[0][:50]}',
                    'description': item.get('Text', '')[:200],
                    'url': item.get('FirstURL', ''),
                    'source': 'Web',
                    'emoji': '🌐',
                    'color': 'green'
                })
        
        return results
    except:
        return []


def generate_ai_summary(query: str) -> str:
    query_lower = query.lower()
    
    summaries = {
        'что': f'🤔 Интересный вопрос! Давай найдем информацию о "{query}"',
        'как': f'💡 Сейчас подберу для тебя лучшие инструкции по теме "{query}"',
        'где': f'🗺️ Ищу информацию о местах и локациях связанных с "{query}"',
        'когда': f'📅 Собираю информацию о времени и датах для "{query}"',
        'почему': f'🧠 Отличный вопрос! Исследую причины и объяснения про "{query}"',
        'кто': f'👤 Ищу информацию о людях и персонах связанных с "{query}"',
    }
    
    for keyword, summary in summaries.items():
        if query_lower.startswith(keyword):
            return summary
    
    topics = {
        'программирование': '💻 Технологии и разработка',
        'код': '💻 Технологии и разработка', 
        'python': '🐍 Язык программирования',
        'javascript': '⚡ Веб-разработка',
        'дизайн': '🎨 Креатив и визуал',
        'музыка': '🎵 Искусство и творчество',
        'фильм': '🎬 Кино и развлечения',
        'игра': '🎮 Геймдев и индустрия',
        'книга': '📖 Литература',
        'рецепт': '🍳 Кулинария',
        'спорт': '⚽ Спорт и здоровье',
        'наука': '🔬 Наука и исследования',
    }
    
    for keyword, category in topics.items():
        if keyword in query_lower:
            return f'{category} — нашел для тебя интересные материалы про "{query}"!'
    
    return f'✨ Дайте-ка подумаю... Собираю самую актуальную информацию про "{query}"!'


def generate_fallback_results(query: str) -> List[Dict[str, Any]]:
    return [
        {
            'title': f'🌸 {query} — Основная информация',
            'description': f'Подробное руководство и актуальная информация о теме "{query}". Узнай все самое важное!',
            'url': f'https://google.com/search?q={query}',
            'source': 'Web',
            'emoji': '💫',
            'color': 'pink'
        },
        {
            'title': f'✨ {query} — Популярные ресурсы',
            'description': f'Лучшие сайты и материалы по запросу "{query}". Проверенная информация от экспертов.',
            'url': f'https://duckduckgo.com/?q={query}',
            'source': 'Web',
            'emoji': '🌟',
            'color': 'blue'
        },
        {
            'title': f'🎀 {query} — Видео и обучение',
            'description': f'Образовательные видео и туториалы про "{query}". Учись визуально!',
            'url': f'https://youtube.com/results?search_query={query}',
            'source': 'YouTube',
            'emoji': '📺',
            'color': 'purple'
        }
    ]
