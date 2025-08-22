// App.js
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('general');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // News categories
  const categories = [
    'general', 'business', 'entertainment', 'health', 
    'science', 'sports', 'technology'
  ];

  useEffect(() => {
    fetchNews();
  }, [category]);

  const fetchNews = async (query = '') => {
    try {
      setLoading(true);
      // Using a proxy to avoid CORS issues
      const API_KEY = '6941dfe3e6be470089a35f7ccaa1c6de'; // This is a demo key - you may need to get your own
      const url = query 
        ? `https://newsapi.org/v2/everything?q=${query}&apiKey=${API_KEY}`
        : `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === 'ok') {
        setNews(data.articles.slice(0, 12)); // Limit to 12 articles
        setError(null);
      } else {
        setError(data.message || 'Failed to fetch news');
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch news. Please try again later.');
      setLoading(false);
      // Fallback data for demonstration
      setNews([
        {
          title: 'AI Breakthrough: New Model Outperforms Humans in Creative Tasks',
          description: 'Researchers have developed an AI model that demonstrates unprecedented creative capabilities.',
          urlToImage: 'https://images.unsplash.com/photo-1677442135135-416f8aa26a5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          publishedAt: '2023-04-15T10:00:00Z',
          source: { name: 'Tech News' },
          url: '#'
        },
        {
          title: 'Global Climate Summit Reaches Historic Agreement',
          description: 'World leaders have agreed on ambitious targets to reduce carbon emissions by 2030.',
          urlToImage: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          publishedAt: '2023-04-14T15:30:00Z',
          source: { name: 'World News' },
          url: '#'
        },
        {
          title: 'New Study Reveals Benefits of Mediterranean Diet',
          description: 'Research confirms significant health improvements for participants following Mediterranean eating patterns.',
          urlToImage: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          publishedAt: '2023-04-13T09:45:00Z',
          source: { name: 'Health Daily' },
          url: '#'
        },
        {
          title: 'Tech Giant Announces Revolutionary Foldable Smartphone',
          description: 'The new device features an innovative flexible display technology that promises enhanced durability.',
          urlToImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          publishedAt: '2023-04-12T14:20:00Z',
          source: { name: 'Tech Insider' },
          url: '#'
        },
        {
          title: 'Stock Markets Reach All-Time High Amid Economic Recovery',
          description: 'Global markets surge as economic indicators show strong post-pandemic recovery trends.',
          urlToImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          publishedAt: '2023-04-11T11:15:00Z',
          source: { name: 'Financial Times' },
          url: '#'
        },
        {
          title: 'Space Agency Releases Stunning Images of Distant Galaxy',
          description: 'New telescope captures unprecedented details of star formation in a galaxy 100 million light-years away.',
          urlToImage: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          publishedAt: '2023-04-10T16:40:00Z',
          source: { name: 'Space Exploration' },
          url: '#'
        },
        {
          title: 'Major Breakthrough in Renewable Energy Storage',
          description: 'Scientists develop new battery technology that could revolutionize renewable energy adoption.',
          urlToImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          publishedAt: '2023-04-09T13:25:00Z',
          source: { name: 'Science Daily' },
          url: '#'
        },
        {
          title: 'New Film Breaks Box Office Records in Opening Weekend',
          description: 'The latest installment in the popular franchise surpasses all expectations with record ticket sales.',
          urlToImage: 'https://images.unsplash.com/photo-1489599851395-2cbd7c643126?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          publishedAt: '2023-04-08T20:10:00Z',
          source: { name: 'Entertainment Weekly' },
          url: '#'
        }
      ]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchNews(searchQuery);
  };

  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
    setDropdownOpen(false);
  };

  return (
    <div className="App">
      <header className="header slide-in-top">
        <h1>Global News Network</h1>
        <p>Your trusted source for the latest news and updates</p>
      </header>
      
      <div className="controls">
        <form onSubmit={handleSearch} className="search-bar">
          <input
            type="text"
            placeholder="Search for news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
        
        <div className="category-selector">
          <button 
            className="dropdown-toggle"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)} ▾
          </button>
          
          <div className={`dropdown-menu ${dropdownOpen ? 'open' : ''}`}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={category === cat ? 'active' : ''}
                onClick={() => handleCategorySelect(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="news-container">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading latest news...</p>
          </div>
        ) : error ? (
          <div className="error">
            <p>{error}</p>
            <button onClick={() => fetchNews()}>Try Again</button>
          </div>
        ) : news.length === 0 ? (
          <div className="no-articles">
            <p>No articles found. Try a different search term.</p>
          </div>
        ) : (
          <div className="news-grid">
            {news.map((article, index) => (
              <NewsItem 
                key={index} 
                article={article} 
                index={index} 
              />
            ))}
          </div>
        )}
      </main>
      
      <footer className="footer slide-in-bottom">
        <p>© 2023 Global News Network. Powered by NewsAPI.</p>
      </footer>
    </div>
  );
}

const NewsItem = ({ article, index }) => {
  return (
    <div className={`news-item stagger-${index % 4}`}>
      <div className="news-image">
        <img src={article.urlToImage || 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'} alt={article.title} />
      </div>
      <div className="news-content">
        <h3>{article.title}</h3>
        <p>{article.description}</p>
        <div className="news-meta">
          <span>{article.source.name}</span>
          <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
        </div>
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-more">
          Read more
        </a>
      </div>
    </div>
  );
};

export default App;