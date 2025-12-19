import { useState, useEffect } from 'react';
import { getCookiePreferences, CookiePreferences } from '../components/CookieConsent';

export function useCookieConsent() {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null);

  useEffect(() => {
    // Get initial preferences
    setPreferences(getCookiePreferences());

    // Listen for changes
    const handleChange = (event: CustomEvent<CookiePreferences>) => {
      setPreferences(event.detail);
    };

    window.addEventListener('cookieConsentChanged', handleChange as EventListener);
    return () => {
      window.removeEventListener('cookieConsentChanged', handleChange as EventListener);
    };
  }, []);

  const canLoadAnalytics = preferences?.analytics ?? false;
  const canLoadMarketing = preferences?.marketing ?? false;

  return {
    preferences,
    canLoadAnalytics,
    canLoadMarketing,
    hasConsented: preferences !== null,
  };
}

// Hook to conditionally load analytics scripts
export function useAnalytics() {
  const { canLoadAnalytics } = useCookieConsent();

  useEffect(() => {
    if (canLoadAnalytics) {
      // Load Google Analytics or other analytics scripts here
      // Example: loadGoogleAnalytics();
      console.log('Analytics enabled - would load tracking scripts');
    }
  }, [canLoadAnalytics]);

  return { isEnabled: canLoadAnalytics };
}
