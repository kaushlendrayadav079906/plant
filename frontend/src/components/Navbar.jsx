import { History, Leaf, Menu, Moon, Sun, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar({ isDark, setIsDark, setShowSplash }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleNavClick = (linkName) => {
    setIsOpen(false);
    if (linkName === "Home") {
      setShowSplash(true);
    }
  };

  const navLinks = [
    { name: "Home", path: "/", icon: <Leaf size={20} /> },
    { name: "History", path: "/history", icon: <History size={20} /> },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <NavLink 
            to="/" 
            className="flex items-center gap-2 group"
            onClick={() => setShowSplash(true)}
          >
            <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
              <Leaf className="text-green-600 dark:text-green-400 w-6 h-6" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-emerald-600 dark:from-green-400 dark:to-emerald-300">
              PlantAI
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => handleNavClick(link.name)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-green-600 dark:hover:text-green-300"
                  }`
                }
              >
                {link.icon}
                {link.name}
              </NavLink>
            ))}

            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2"></div>

            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500/50"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
            </button>
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`md:hidden absolute w-full bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 shadow-lg transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-64 opacity-100 block" : "max-h-0 opacity-0 hidden"
        }`}
      >
        <div className="px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => handleNavClick(link.name)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  isActive
                    ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`
              }
            >
              {link.icon}
              {link.name}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
