import React, { useState, useEffect } from 'react';
import Clock from './components/Clock';
import Weather from './components/Weather';
import Quote from './components/Quote';
import SearchBar from './components/SearchBar';
import News from './components/News';
import { LayoutGrid, Sun, Moon } from 'lucide-react';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark:bg-slate-900' : 'bg-slate-50'} transition-colors duration-200`}>
      <header className={`${
        darkMode 
          ? 'bg-gradient-to-r from-purple-900 to-indigo-900' 
          : 'bg-gradient-to-r from-purple-500 to-indigo-600'
      } text-white p-4 shadow-lg transition-colors duration-200`}>
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <LayoutGrid className="h-8 w-8 mr-3" />
            <h1 className="text-2xl font-bold">Personal Dashboard</h1>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </button>
        </div>
      </header>
      
      <main className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Clock darkMode={darkMode} />
          <Weather darkMode={darkMode} />
        </div>
        
        <div className="mb-6">
          <Quote darkMode={darkMode} />
        </div>
        
        <div className="mb-6">
          <SearchBar darkMode={darkMode} />
        </div>
        
        <div>
          <News darkMode={darkMode} />
        </div>
      </main>
      
      <footer className={`${darkMode ? 'bg-slate-800' : 'bg-slate-800'} text-white text-center py-4 mt-8`}>
        <p className="text-sm">© {new Date().getFullYear()} Personal Dashboard | All data from public APIs</p>
      </footer>
    </div>
  );
}

export default App;