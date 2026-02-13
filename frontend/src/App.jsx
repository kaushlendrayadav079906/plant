import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import History from './pages/History';
import Home from './pages/Home';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transaction-colors duration-300">
        {!showSplash && <Navbar isDark={isDark} setIsDark={setIsDark} setShowSplash={setShowSplash} />}
        <Routes>
          <Route path="/" element={<Home showSplash={showSplash} setShowSplash={setShowSplash} />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </div>
  );
}
