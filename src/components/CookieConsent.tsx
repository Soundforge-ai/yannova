import React, { useState, useEffect } from 'react';
import { X, Cookie, Settings } from 'lucide-react';

export interface CookiePreferences {
  necessary: boolean; // Always true
  analytics: boolean;
  marketing: boolean;
}

const COOKIE_CONSENT_KEY = 'yannova_cookie_preferences';
const COOKIE_CONSENT_VERSION = '1.0';

interface StoredCookieConsent {
  preferences: CookiePreferences;
  timestamp: number;
  version: string;
}

export function getCookiePreferences(): CookiePreferences | null {
  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (stored) {
      const parsed: StoredCookieConsent = JSON.parse(stored);
      if (parsed.version === COOKIE_CONSENT_VERSION) {
        return parsed.preferences;
      }
    }
  } catch {
    // Invalid stored data
  }
  return null;
}

export function saveCookiePreferences(preferences: CookiePreferences): void {
  const data: StoredCookieConsent = {
    preferences,
    timestamp: Date.now(),
    version: COOKIE_CONSENT_VERSION,
  };
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(data));
}

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const stored = getCookiePreferences();
    if (!stored) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    saveCookiePreferences(allAccepted);
    setIsVisible(false);
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: allAccepted }));
  };

  const handleDeclineAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    saveCookiePreferences(onlyNecessary);
    setIsVisible(false);
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: onlyNecessary }));
  };

  const handleSavePreferences = () => {
    saveCookiePreferences(preferences);
    setIsVisible(false);
    setShowSettings(false);
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: preferences }));
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-white border-t border-gray-200 shadow-2xl"
      role="dialog"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-description"
    >
      <div className="container mx-auto max-w-6xl">
        {!showSettings ? (
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex-shrink-0 hidden md:block">
              <div className="w-12 h-12 bg-brand-accent/10 rounded-full flex items-center justify-center">
                <Cookie className="text-brand-accent" size={24} />
              </div>
            </div>
            
            <div className="flex-grow">
              <h3 id="cookie-title" className="font-semibold text-brand-dark mb-1">
                Wij gebruiken cookies 🍪
              </h3>
              <p id="cookie-description" className="text-sm text-gray-600">
                We gebruiken cookies om uw ervaring te verbeteren en onze website te analyseren. 
                U kunt uw voorkeuren aanpassen of alle cookies accepteren.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Settings size={16} />
                Voorkeuren
              </button>
              <button
                onClick={handleDeclineAll}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Weigeren
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-6 py-2 text-sm font-medium text-white bg-brand-accent hover:bg-orange-700 rounded-md transition-colors"
              >
                Accepteren
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-brand-dark">Cookie voorkeuren</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
                aria-label="Sluiten"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium text-brand-dark">Noodzakelijk</span>
                  <p className="text-xs text-gray-500">Vereist voor de werking van de website</p>
                </div>
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="w-5 h-5 text-brand-accent rounded"
                />
              </label>
              
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <div>
                  <span className="font-medium text-brand-dark">Analytics</span>
                  <p className="text-xs text-gray-500">Helpt ons de website te verbeteren</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  className="w-5 h-5 text-brand-accent rounded cursor-pointer"
                />
              </label>
              
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <div>
                  <span className="font-medium text-brand-dark">Marketing</span>
                  <p className="text-xs text-gray-500">Voor gepersonaliseerde advertenties</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                  className="w-5 h-5 text-brand-accent rounded cursor-pointer"
                />
              </label>
            </div>
            
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={handleDeclineAll}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Alleen noodzakelijk
              </button>
              <button
                onClick={handleSavePreferences}
                className="px-6 py-2 text-sm font-medium text-white bg-brand-accent hover:bg-orange-700 rounded-md transition-colors"
              >
                Voorkeuren opslaan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookieConsent;
