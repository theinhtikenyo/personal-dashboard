import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Newspaper, ChevronLeft, ChevronRight } from 'lucide-react';
import { NewsArticle } from '../types';

interface NewsProps {
  darkMode: boolean;
}

const News: React.FC<NewsProps> = ({ darkMode }) => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const categories = useMemo(() => [
    { value: "all", label: "All" },
    { value: "national", label: "National" },
    { value: "business", label: "Business" },
    { value: "sports", label: "Sports" },
    { value: "world", label: "World" },
    { value: "politics", label: "Politics" },
    { value: "technology", label: "Technology" },
    { value: "startup", label: "Startup" },
    { value: "entertainment", label: "Entertainment" },
    { value: "science", label: "Science" },
    { value: "automobile", label: "Automobile" }
  ], []);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://inshorts.deta.dev/news?category=${category === 'all' ? 'national' : category}`);
        
        if (response.data && response.data.data) {
          const articles = response.data.data.map((item: any) => ({
            title: item.title || '',
            description: item.content || '',
            url: '#',
            urlToImage: item.imageUrl || 'https://via.placeholder.com/80?text=News',
            source: { name: item.author || 'Inshorts' },
            publishedAt: item.date || new Date().toISOString()
          }));
          
          setNews(articles);
          setError(null);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        setNews(sampleNews);
        setError('Using sample news due to API limitations');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [category]);

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(news.length / itemsPerPage);
  const currentNews = news.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className={`${
        darkMode ? 'bg-slate-800 text-white' : 'bg-white'
      } rounded-lg shadow-lg p-6 transition-colors duration-200`}>
        <div className="flex items-center mb-4">
          <Newspaper className="h-6 w-6 text-purple-500 mr-2" />
          <h2 className="text-xl font-semibold">Today's Headlines</h2>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex space-x-4">
              <div className={`rounded-md ${
                darkMode ? 'bg-slate-700' : 'bg-slate-200'
              } h-24 w-24`}></div>
              <div className="flex-1 space-y-2 py-1">
                <div className={`h-4 ${
                  darkMode ? 'bg-slate-700' : 'bg-slate-200'
                } rounded w-3/4`}></div>
                <div className={`h-4 ${
                  darkMode ? 'bg-slate-700' : 'bg-slate-200'
                } rounded w-full`}></div>
                <div className={`h-4 ${
                  darkMode ? 'bg-slate-700' : 'bg-slate-200'
                } rounded w-1/2`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`${
      darkMode ? 'bg-slate-800 text-white' : 'bg-white'
    } rounded-lg shadow-lg p-6 transition-colors duration-200`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Newspaper className="h-6 w-6 text-purple-500 mr-2" />
          <h2 className="text-xl font-semibold">Today's Headlines</h2>
        </div>
        {error && <div className="text-xs text-slate-500 dark:text-slate-400">{error}</div>}
      </div>
      
      <div className="mb-4 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => handleCategoryChange(cat.value)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              category === cat.value
                ? 'bg-purple-500 text-white'
                : darkMode
                  ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
      
      <div className="space-y-4">
        {currentNews.map((article, index) => (
          <div 
            key={index}
            className={`block transition-colors rounded-md p-4 ${
              darkMode
                ? 'hover:bg-slate-700 bg-slate-800'
                : 'hover:bg-slate-50 bg-white'
            } border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}
          >
            <div className="flex space-x-4">
              {article.urlToImage && (
                <img 
                  src={article.urlToImage} 
                  alt={article.title}
                  className="h-24 w-24 object-cover rounded-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80?text=News';
                  }}
                />
              )}
              <div className="flex-1">
                <h3 className={`font-medium text-lg mb-2 ${
                  darkMode ? 'text-slate-100' : 'text-slate-900'
                }`}>
                  {article.title}
                </h3>
                <p className={`text-sm mb-2 ${
                  darkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  {article.description}
                </p>
                <div className={`flex items-center text-xs ${
                  darkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  <span>{article.source.name}</span>
                  <span className="mx-1">•</span>
                  <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`flex items-center px-4 py-2 rounded-md ${
              currentPage === 1
                ? 'opacity-50 cursor-not-allowed'
                : darkMode
                  ? 'bg-slate-700 hover:bg-slate-600'
                  : 'bg-slate-100 hover:bg-slate-200'
            } transition-colors duration-200`}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </button>
          <span className={`font-medium ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`flex items-center px-4 py-2 rounded-md ${
              currentPage === totalPages
                ? 'opacity-50 cursor-not-allowed'
                : darkMode
                  ? 'bg-slate-700 hover:bg-slate-600'
                  : 'bg-slate-100 hover:bg-slate-200'
            } transition-colors duration-200`}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      )}
    </div>
  );
};

// Fallback sample news in case the API fails
const sampleNews: NewsArticle[] = [
  {
    title: "Scientists Make Breakthrough in Renewable Energy Storage",
    description: "A team of researchers has developed a new type of battery that could revolutionize how we store renewable energy, making it more efficient and affordable.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    source: { name: "Science Daily" },
    publishedAt: new Date().toISOString()
  },
  {
    title: "Global Tech Conference Announces Virtual Format for 2025",
    description: "One of the world's largest technology conferences has announced it will maintain a virtual component in 2025, citing increased accessibility and environmental benefits.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    source: { name: "Tech Insider" },
    publishedAt: new Date().toISOString()
  },
  {
    title: "New Study Shows Benefits of Four-Day Work Week",
    description: "Companies that switched to a four-day work week reported higher productivity, improved employee satisfaction, and reduced burnout according to a new comprehensive study.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    source: { name: "Business Report" },
    publishedAt: new Date().toISOString()
  },
  {
    title: "Major Streaming Services Announce Price Increases",
    description: "Several major streaming platforms have announced price increases for their subscription services, citing rising production costs and expanded content libraries.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    source: { name: "Entertainment Weekly" },
    publishedAt: new Date().toISOString()
  },
  {
    title: "New AI Tool Helps Detect Early Signs of Climate Change",
    description: "Researchers have developed an AI system that can analyze satellite imagery to detect early warning signs of environmental changes related to climate change.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1593697972672-b1c1902219e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    source: { name: "Environmental Science" },
    publishedAt: new Date().toISOString()
  }
];

export default News;