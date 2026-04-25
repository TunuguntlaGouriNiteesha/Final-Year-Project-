import os
import requests
from typing import Dict, List
import logging
from dotenv import load_dotenv
import random

load_dotenv()

logger = logging.getLogger(__name__)

class NewsVerifier:
    def __init__(self):
        self.news_api_key = os.getenv("NEWS_API_KEY")
        self.gnews_api_key = os.getenv("GNEWS_API_KEY")
        
    def fetch_news_from_api(self, query: str) -> List[Dict]:
        """Fetch news articles from APIs"""
        
        news_articles = []
        
        try:
            # Try NewsAPI first
            if self.news_api_key and self.news_api_key != "your_newsapi_key_here":
                url = "https://newsapi.org/v2/everything"
                params = {
                    'q': query,
                    'apiKey': self.news_api_key,
                    'pageSize': 5,
                    'sortBy': 'relevancy',
                    'language': 'en'
                }
                
                response = requests.get(url, params=params, timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    for article in data.get('articles', [])[:3]:
                        if article.get('title') and article.get('url'):
                            news_articles.append({
                                'title': article.get('title', ''),
                                'description': article.get('description', ''),
                                'url': article.get('url', ''),
                                'source': article.get('source', {}).get('name', 'Unknown'),
                                'published_at': article.get('publishedAt', ''),
                                'content': article.get('content', '')[:300] if article.get('content') else ''
                            })
            
            # If no articles, try GNews
            if not news_articles and self.gnews_api_key and self.gnews_api_key != "your_gnews_key_here":
                url = "https://gnews.io/api/v4/search"
                params = {
                    'q': query,
                    'token': self.gnews_api_key,
                    'lang': 'en',
                    'max': 3
                }
                
                response = requests.get(url, params=params, timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    for article in data.get('articles', [])[:3]:
                        if article.get('title'):
                            news_articles.append({
                                'title': article.get('title', ''),
                                'description': article.get('description', ''),
                                'url': article.get('url', ''),
                                'source': article.get('source', {}).get('name', 'Unknown'),
                                'published_at': article.get('publishedAt', ''),
                                'content': article.get('content', '')[:300] if article.get('content') else article.get('description', '')
                            })
            
            # Fallback: Use mock data if no API keys
            if not news_articles:
                news_articles = self.get_mock_news_articles(query)
        
        except Exception as e:
            logger.error(f"Error fetching news: {str(e)}")
            news_articles = self.get_mock_news_articles(query)
        
        return news_articles
    
    def get_mock_news_articles(self, query: str) -> List[Dict]:
        """Provide mock news articles for demonstration"""
        
        mock_articles = [
            {
                'title': f'New Study Shows {query} Making Significant Progress',
                'description': f'Recent research indicates major advancements in the field of {query}. Experts are optimistic about future developments.',
                'url': 'https://example.com/news/1',
                'source': 'Science Daily',
                'published_at': '2024-01-15T10:30:00Z',
                'content': f'The latest findings on {query} show promising results that could revolutionize the industry.'
            },
            {
                'title': f'{query.title()} Controversy Sparks Debate Among Experts',
                'description': f'Conflicting reports about {query} have led to heated discussions in academic circles.',
                'url': 'https://example.com/news/2',
                'source': 'Tech News',
                'published_at': '2024-01-14T14:20:00Z',
                'content': f'While some experts praise the developments in {query}, others express concerns about potential risks.'
            },
            {
                'title': f'Government Announces New Initiative for {query} Development',
                'description': f'Major funding has been allocated to support research and development in {query}.',
                'url': 'https://example.com/news/3',
                'source': 'Government Press',
                'published_at': '2024-01-13T09:15:00Z',
                'content': f'The new initiative aims to accelerate progress in {query} through public-private partnerships.'
            }
        ]
        
        return mock_articles
    
    def analyze_news_article(self, article: Dict) -> Dict:
        """Analyze a news article"""
        
        from app.predict import predict_text
        
        try:
            # Combine title and description for analysis
            text_to_analyze = f"{article['title']}. {article['description']}"
            
            # Use the ML model to predict
            prediction = predict_text(text_to_analyze)
            
            return {
                'article': {
                    'title': article['title'],
                    'source': article['source'],
                    'url': article['url'],
                    'published_at': article['published_at'],
                    'description': article['description']
                },
                'prediction': prediction,
                'verification_score': self.calculate_verification_score(article, prediction)
            }
            
        except Exception as e:
            logger.error(f"Error analyzing article: {str(e)}")
            return {
                'article': article,
                'prediction': {'label': 'UNKNOWN', 'confidence': 0.0},
                'error': str(e)
            }
    
    def calculate_verification_score(self, article: Dict, prediction: Dict) -> float:
        """Calculate a verification score"""
        
        score = 0.0
        
        # Factor 1: ML model confidence
        score += prediction.get('confidence', 0.0) * 0.4
        
        # Factor 2: Source credibility
        credible_sources = ['BBC', 'Reuters', 'AP', 'The Guardian', 'New York Times', 
                           'Washington Post', 'CNN', 'Science Daily', 'Nature']
        
        source = article.get('source', '').lower()
        for credible in credible_sources:
            if credible.lower() in source:
                score += 0.3
                break
        
        # Factor 3: Article completeness
        if article.get('description') and len(article['description']) > 20:
            score += 0.15
        
        if article.get('content') and len(article['content']) > 50:
            score += 0.15
        
        return min(score, 1.0)
    
    def get_random_news_topics(self) -> List[str]:
        """Return random news topics"""
        
        topics = [
            "artificial intelligence",
            "climate change",
            "medical research",
            "space exploration",
            "renewable energy",
            "cybersecurity",
            "quantum computing",
            "vaccine development",
            "electric vehicles",
            "5G technology"
        ]
        
        # Shuffle and return 3 topics
        shuffled = topics.copy()
        random.shuffle(shuffled)
        return shuffled[:3]
    
    def verify_news_topic(self, topic: str) -> Dict:
        """Main function to verify news on a given topic"""
        
        try:
            logger.info(f"Verifying news topic: {topic}")
            
            # Fetch news articles
            articles = self.fetch_news_from_api(topic)
            
            if not articles:
                return {
                    'topic': topic,
                    'status': 'error',
                    'message': 'No news articles found for this topic',
                    'articles': []
                }
            
            # Analyze each article
            analyzed_articles = []
            for article in articles[:3]:  # Limit to 3 articles
                analyzed = self.analyze_news_article(article)
                analyzed_articles.append(analyzed)
            
            # Calculate overall credibility
            overall_credibility = self.calculate_overall_credibility(analyzed_articles)
            
            return {
                'topic': topic,
                'status': 'success',
                'overall_credibility': overall_credibility,
                'articles_analyzed': len(analyzed_articles),
                'articles': analyzed_articles,
                'summary': self.generate_summary(analyzed_articles, overall_credibility)
            }
            
        except Exception as e:
            logger.error(f"Error verifying news topic: {str(e)}")
            return {
                'topic': topic,
                'status': 'error',
                'message': f'Verification failed: {str(e)}',
                'articles': []
            }
    
    def calculate_overall_credibility(self, articles: List[Dict]) -> Dict:
        """Calculate overall credibility score"""
        
        if not articles:
            return {'score': 0.0, 'label': 'NO_DATA'}
        
        total_score = 0
        real_count = 0
        fake_count = 0
        
        for article in articles:
            prediction = article.get('prediction', {})
            if prediction.get('label') == 'REAL':
                real_count += 1
            elif prediction.get('label') == 'FAKE':
                fake_count += 1
            
            total_score += prediction.get('confidence', 0.0)
        
        avg_score = total_score / len(articles) if articles else 0
        
        if real_count > fake_count:
            label = 'MOSTLY_REAL'
        elif fake_count > real_count:
            label = 'MOSTLY_FAKE'
        else:
            label = 'MIXED'
        
        return {
            'score': avg_score,
            'label': label,
            'real_articles': real_count,
            'fake_articles': fake_count,
            'total_articles': len(articles)
        }
    
    def generate_summary(self, articles: List[Dict], overall_credibility: Dict) -> str:
        """Generate a summary of the verification results"""
        
        total = overall_credibility.get('total_articles', 0)
        real = overall_credibility.get('real_articles', 0)
        fake = overall_credibility.get('fake_articles', 0)
        
        if total == 0:
            return "No articles found for analysis."
        
        percentage_real = (real / total) * 100 if total > 0 else 0
        
        summary = f"""
        News Verification Summary:
        
        • Analyzed {total} news articles on "{articles[0]['article']['title'].split()[0] if articles else 'this topic'}"
        • {real} articles ({percentage_real:.1f}%) appear to be credible/real
        • {fake} articles ({100 - percentage_real:.1f}%) show signs of misinformation
        
        Overall Credibility: {overall_credibility.get('label', 'UNKNOWN').replace('_', ' ').title()}
        Confidence Score: {overall_credibility.get('score', 0):.1%}
        
        {"✅ Most sources appear reliable" if percentage_real > 60 else 
          "⚠️ Mixed credibility across sources" if percentage_real > 40 else 
          "❌ High proportion of questionable sources"}
        """
        
        return summary.strip()

# Singleton instance
news_verifier = NewsVerifier()