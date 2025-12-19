import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Locale = 'nl' | 'fr';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Import translations
import nlTranslations from '../i18n/nl.json';
import frTranslations from '../i18n/fr.json';

const translations: Record<Locale, Record<string, string>> = {
  nl: nlTranslations,
  fr: frTranslations,
};

const STORAGE_KEY = 'yannova_locale';

function detectBrowserLocale(): Locale {
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('fr')) {
    return 'fr';
  }
  return 'nl';
}

function getStoredLocale(): Locale | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'nl' || stored === 'fr') {
      return stored;
    }
  } catch {
    // localStorage not available
  }
  return null;
}

function storeLocale(locale: Locale): void {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // localStorage not available
  }
}

interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    return getStoredLocale() || detectBrowserLocale();
  });

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    storeLocale(newLocale);
  };

  const t = (key: string): string => {
    const translation = translations[locale][key];
    if (!translation) {
      console.warn(`Missing translation for key: ${key} in locale: ${locale}`);
      return key;
    }
    return translation;
  };

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

export default I18nContext;
