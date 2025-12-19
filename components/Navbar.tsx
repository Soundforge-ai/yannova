import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';
import { NAV_ITEMS, COMPANY_NAME } from '../constants';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isGevelOpen, setIsGevelOpen] = useState(false);
  const location = useLocation();
  const navRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Throttle function implementation
  const throttle = <T extends (...args: any[]) => any>(func: T, delay: number): T => {
    let timeoutId: NodeJS.Timeout | null = null;
    let lastExecTime = 0;
    
    return ((...args: Parameters<T>) => {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        func(...args);
        lastExecTime = currentTime;
      } else {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func(...args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    }) as T;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // Throttle scroll events for better performance
    const throttledScroll = throttle(handleScroll, 100);
    window.addEventListener('scroll', throttledScroll);
    
    return () => window.removeEventListener('scroll', throttledScroll);
  }, []);

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsGevelOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isHomePage = location.pathname === '/';
  const textColor = isScrolled || !isHomePage ? 'text-gray-700' : 'text-gray-200';

  return (	
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled || !isHomePage ? 'bg-white shadow-md py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className={`text-2xl font-bold tracking-tight ${isScrolled || !isHomePage ? 'text-brand-dark' : 'text-white'}`}>
          {COMPANY_NAME}<span className="text-brand-accent">.</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.href || (item.href.startsWith('/#') && location.pathname === '/');

            // Special handling for Gevel dropdown
            if (item.label === 'Gevel') {
              const isGevelActive = location.pathname.startsWith('/gevel');
              return (
                <div
                  key={item.label}
                  className="relative"
                  ref={navRef}
                  onMouseEnter={() => {
                    if (timeoutRef.current) {
                      clearTimeout(timeoutRef.current);
                    }
                    setIsGevelOpen(true);
                  }}
                  onMouseLeave={() => {
                    timeoutRef.current = setTimeout(() => {
                      setIsGevelOpen(false);
                    }, 300); // Small delay to allow moving to dropdown
                  }}
                >
                  <Link
                    to={item.href}
                    className={`text-sm font-medium hover:text-brand-accent transition-colors flex items-center gap-1 ${isScrolled || !isHomePage ? 'text-gray-700' : 'text-gray-200'} ${isGevelActive ? 'text-brand-accent' : ''}`}
                    onClick={() => setIsGevelOpen(!isGevelOpen)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsGevelOpen(!isGevelOpen);
                      }
                    }}
                    aria-expanded={isGevelOpen}
                    aria-haspopup="true"
                  >
                    {item.label}
                    <ChevronDown 
                      size={16} 
                      className={`transition-transform duration-200 ${isGevelOpen ? 'rotate-180' : ''}`} 
                      aria-hidden="true"
                    />
                  </Link>

                  {/* Dropdown Menu */}
                  <div
                    className={`absolute top-full left-0 pt-2 w-56 transition-all duration-200 ease-out ${isGevelOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible pointer-events-none -translate-y-2'}`}
                    onMouseEnter={() => {
                      if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                      }
                    }}
                    onMouseLeave={() => setIsGevelOpen(false)}
                    role="menu"
                    aria-label="Gevel submenu"
                  >
                    <div className="bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-[100]">
                      <Link
                        to="/gevel/gevelbepleistering"
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-accent transition-colors"
                        onClick={() => setIsGevelOpen(false)}
                        role="menuitem"
                      >
                        Gevelbepleistering
                      </Link>
                      <Link
                        to="/gevel/gevelbescherming"
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-accent transition-colors"
                        onClick={() => setIsGevelOpen(false)}
                        role="menuitem"
                      >
                        Gevelbescherming
                      </Link>
                      <Link
                        to="/gevel/gevelisolatie"
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-accent transition-colors"
                        onClick={() => setIsGevelOpen(false)}
                        role="menuitem"
                      >
                        Gevelisolatie
                      </Link>
                      <Link
                        to="/gevel/steenstrips"
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-accent transition-colors"
                        onClick={() => setIsGevelOpen(false)}
                        role="menuitem"
                      >
                        Steenstrips
                      </Link>
                      <Link
                        to="/gevel/gevelrenovatie"
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-accent transition-colors"
                        onClick={() => setIsGevelOpen(false)}
                        role="menuitem"
                      >
                        Gevelrenovatie
                      </Link>
                      <Link
                        to="/crepi-info"
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-accent transition-colors rounded-b-lg"
                        onClick={() => setIsGevelOpen(false)}
                        role="menuitem"
                      >
                        Crepi Info
                      </Link>
                    </div>
                  </div>
                </div>
              );
            }

            // Handle Hash links
            if (item.href.startsWith('/#')) {
              // If we are on home page, render as normal anchor to #id for smooth scroll (handled by browser or css)
              if (isHomePage) {
                const anchorId = item.href.replace(/^\//, ''); // Remove leading /
                return (
                  <a
                    key={item.label}
                    href={anchorId}
                    className={`text-sm font-medium hover:text-brand-accent transition-colors ${textColor}`}
                  >
                    {item.label}
                  </a>
                );
              } else {
                // If not on home page, use Link to go to /#id
                return (
                    <Link
                      to={item.href}
                      className="px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-brand-accent font-medium block transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                );
              }
            }

            // Normal links
            return (
              <Link
                key={item.label}
                to={item.href}
                className={`text-sm font-medium hover:text-brand-accent transition-colors ${textColor} ${isActive ? 'text-brand-accent' : ''}`}
              >
                {item.label}
              </Link>
            );
          })}
          <LanguageSwitcher />
          <a
            href={isHomePage ? "#contact" : "/#contact"}
            className="bg-brand-accent hover:bg-orange-700 text-white px-5 py-2.5 rounded-md text-sm font-semibold transition-colors flex items-center gap-2"
          >
            <Phone size={16} />
            Offerte Aanvragen
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none focus:ring-2 focus:ring-brand-accent rounded-md p-1"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? 'Menu sluiten' : 'Menu openen'}
        >
          {isOpen ? (
            <X className={isScrolled || !isHomePage ? 'text-gray-900' : 'text-white'} />
          ) : (
            <Menu className={isScrolled || !isHomePage ? 'text-gray-900' : 'text-white'} />
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div 
          id="mobile-menu"
          className="md:hidden bg-white absolute top-full left-0 w-full shadow-lg border-t border-gray-100 max-h-[80vh] overflow-y-auto"
          role="navigation"
          aria-label="Mobiel menu"
        >
          <div className="flex flex-col py-4">
            {NAV_ITEMS.map((item) => {
              if (item.label === 'Gevel') {
                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between px-6 py-3">
                      <Link
                        to={item.href}
                        className="font-medium text-gray-700 hover:text-brand-accent"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </Link>
                      <button
                        onClick={() => setIsGevelOpen(!isGevelOpen)}
                        className="p-2 focus:outline-none"
                        aria-label="Gevel submenu"
                      >
                        <ChevronDown size={16} className={`transition-transform ${isGevelOpen ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                    {isGevelOpen && (
                      <div className="bg-gray-50 py-2">
                        <Link to="/gevel/gevelbepleistering" className="block px-10 py-2 text-sm text-gray-600 hover:text-brand-accent" onClick={() => { setIsOpen(false); setIsGevelOpen(false); }}>Gevelbepleistering</Link>
                        <Link to="/gevel/gevelbescherming" className="block px-10 py-2 text-sm text-gray-600 hover:text-brand-accent" onClick={() => { setIsOpen(false); setIsGevelOpen(false); }}>Gevelbescherming</Link>
                        <Link to="/gevel/gevelisolatie" className="block px-10 py-2 text-sm text-gray-600 hover:text-brand-accent" onClick={() => { setIsOpen(false); setIsGevelOpen(false); }}>Gevelisolatie</Link>
                        <Link to="/gevel/steenstrips" className="block px-10 py-2 text-sm text-gray-600 hover:text-brand-accent" onClick={() => { setIsOpen(false); setIsGevelOpen(false); }}>Steenstrips</Link>
                        <Link to="/gevel/gevelrenovatie" className="block px-10 py-2 text-sm text-gray-600 hover:text-brand-accent" onClick={() => { setIsOpen(false); setIsGevelOpen(false); }}>Gevelrenovatie</Link>
                        <Link to="/crepi-info" className="block px-10 py-2 text-sm text-gray-600 hover:text-brand-accent" onClick={() => { setIsOpen(false); setIsGevelOpen(false); }}>Crepi Info</Link>
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className="px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-brand-accent font-medium block transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              to="/contact"
              className="mx-6 mt-4 bg-brand-accent hover:bg-orange-700 text-white px-6 py-3 rounded-md font-semibold text-center block transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Offerte Aanvragen
            </Link>
            <div className="px-6 pt-4 border-t border-gray-100 mt-4">
              <LanguageSwitcher variant="compact" />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
