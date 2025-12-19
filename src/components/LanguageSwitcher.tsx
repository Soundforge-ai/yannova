import React from 'react';
import { useI18n, Locale } from '../hooks/useI18n';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'default' | 'compact';
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ variant = 'default' }) => {
  const { locale, setLocale } = useI18n();

  const languages: { code: Locale; label: string; flag: string }[] = [
    { code: 'nl', label: 'Nederlands', flag: '🇧🇪' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
  ];

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-1">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLocale(lang.code)}
            className={`px-2 py-1 text-sm font-medium rounded transition-colors ${
              locale === lang.code
                ? 'bg-brand-accent text-white'
                : 'text-gray-600 hover:text-brand-accent hover:bg-gray-100'
            }`}
            aria-label={`Switch to ${lang.label}`}
            aria-current={locale === lang.code ? 'true' : undefined}
          >
            {lang.code.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="relative group">
      <button
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-brand-accent transition-colors"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <Globe size={18} />
        <span>{locale.toUpperCase()}</span>
      </button>
      
      <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-[140px]">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLocale(lang.code)}
            className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
              locale === lang.code ? 'text-brand-accent font-medium' : 'text-gray-700'
            }`}
          >
            <span>{lang.flag}</span>
            <span>{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;
