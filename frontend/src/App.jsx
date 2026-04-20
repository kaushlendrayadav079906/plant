import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Graphf from './pages/Graphf';
import History from './pages/History';
import Home from './pages/Home';
import Auth from './pages/Auth';
import { useEffect } from 'react';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transaction-colors duration-300">
        {!showSplash && <Navbar isDark={isDark} setIsDark={setIsDark} setShowSplash={setShowSplash} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
        <Routes>
          <Route path="/" element={<Home showSplash={showSplash} setShowSplash={setShowSplash} />} />
          <Route path="/history" element={<History />} />
          <Route path="/analysis" element={<Graphf />} />
          <Route path="/auth" element={<Auth setIsLoggedIn={setIsLoggedIn} />} />
        </Routes>
      </div>
    </div>
  );
}
