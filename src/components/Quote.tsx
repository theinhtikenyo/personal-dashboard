import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Quote as QuoteIcon, RefreshCw } from 'lucide-react';
import { Quote as QuoteType } from '../types';

interface QuoteProps {
  darkMode: boolean;
}

const Quote: React.FC<QuoteProps> = ({ darkMode }) => {
  const [quote, setQuote] = useState<QuoteType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://zenquotes.io/api/random', {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        const data = response.data[0];
        setQuote({
          content: data.q || '',
          author: data.a || 'Unknown'
        });
        setError(null);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      // Use a random quote from fallback quotes instead of logging to console
      const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
      setQuote(randomQuote);
      setError('Using offline quotes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div className={`${
      darkMode ? 'bg-slate-800 text-white' : 'bg-white'
    } rounded-lg shadow-lg p-6 transition-colors duration-200`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <QuoteIcon className="h-6 w-6 text-purple-500 mr-2" />
          <h2 className="text-xl font-semibold">Daily Inspiration</h2>
        </div>
        <button 
          onClick={fetchQuote} 
          className="text-purple-500 hover:text-purple-700 transition-colors"
          aria-label="Get new quote"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>
      
      {loading ? (
        <div className={`animate-pulse text-center py-4 ${
          darkMode ? 'text-slate-400' : 'text-slate-500'
        }`}>
          Loading quote...
        </div>
      ) : quote ? (
        <div className="text-center">
          <blockquote className={`text-lg italic mb-2 ${
            darkMode ? 'text-slate-200' : 'text-slate-700'
          }`}>
            "{quote.content}"
          </blockquote>
          <cite className={`text-sm block ${
            darkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            — {quote.author}
          </cite>
        </div>
      ) : (
        <div className={`text-center ${
          darkMode ? 'text-slate-400' : 'text-slate-500'
        }`}>
          Unable to load quote
        </div>
      )}
      
      {error && (
        <div className={`text-xs text-center mt-2 ${
          darkMode ? 'text-slate-500' : 'text-slate-400'
        }`}>
          {error}
        </div>
      )}
    </div>
  );
};

// Fallback quotes in case the API fails
const fallbackQuotes: QuoteType[] = [
  {
    content: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    content: "Life is what happens when you're busy making other plans.",
    author: "John Lennon"
  },
  {
    content: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt"
  },
  {
    content: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    content: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb"
  }
];

export default Quote;