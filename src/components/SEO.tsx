import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  noindex?: boolean;
}

const BASE_URL = 'https://www.yannova.be';
const DEFAULT_TITLE = 'Yannova Bouw | Ramen en Deuren, Renovatie & Crepi | Keerbergen, Mechelen, Zoersel';
const DEFAULT_DESCRIPTION = 'Yannova Bouw - Specialist in ramen en deuren, renovatie, isolatie en crepi gevelafwerking in Keerbergen, Mechelen, Zoersel, Putte en omgeving. ✓ Gratis offerte ✓ 15+ jaar ervaring ✓ Vakkundige plaatsing';
const DEFAULT_KEYWORDS = 'Yannova, Yannova Bouw, yannova ramen en deuren, ramen en deuren, ramen en deuren Keerbergen, ramen en deuren Mechelen, ramen en deuren Zoersel, ramen en deuren Putte, PVC ramen, aluminium ramen, renovatie Keerbergen, renovatie Mechelen, renovatie Zoersel, bouwbedrijf Keerbergen, bouwbedrijf Mechelen, crepi gevel, gevelisolatie, gevelbepleistering, isolatiewerken, ramen plaatsen Antwerpen, deuren plaatsen, gevelrenovatie, energiezuinige ramen, ramen Heist-op-den-Berg, ramen Bonheiden, ramen Lier, ramen Nijlen, renovatie Putte, renovatie Heist-op-den-Berg, bouwbedrijf Antwerpen provincie, ramen Tremelo, ramen Haacht, renovatie Bonheiden, crepi Keerbergen, crepi Mechelen, gevel Zoersel';

const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonicalUrl,
  ogImage = `${BASE_URL}/images/yannova-team.jpg`,
  noindex = false
}) => {
  const location = useLocation();
  const fullTitle = title ? `${title} | Yannova` : DEFAULT_TITLE;
  const currentUrl = canonicalUrl || `${BASE_URL}${location.pathname}`;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update meta tags helper
    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Remove meta tag helper
    const removeMeta = (name: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      const element = document.querySelector(`meta[${attr}="${name}"]`);
      if (element) element.remove();
    };

    // Robots meta tag
    if (noindex) {
      updateMeta('robots', 'noindex, nofollow');
    } else {
      updateMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    }

    // Basic meta tags
    updateMeta('description', description);
    updateMeta('keywords', keywords);
    updateMeta('author', 'Yannova Bouw');
    updateMeta('language', 'Dutch');
    updateMeta('geo.region', 'BE-VAN');
    updateMeta('geo.placename', 'Zoersel, Antwerpen, België');
    updateMeta('geo.position', '51.2667;4.6167');
    updateMeta('ICBM', '51.2667, 4.6167');
    
    // Open Graph tags
    updateMeta('og:title', fullTitle, true);
    updateMeta('og:description', description, true);
    updateMeta('og:type', 'website', true);
    updateMeta('og:url', currentUrl, true);
    updateMeta('og:image', fullOgImage, true);
    updateMeta('og:image:width', '1200', true);
    updateMeta('og:image:height', '630', true);
    updateMeta('og:image:alt', fullTitle, true);
    updateMeta('og:locale', 'nl_BE', true);
    updateMeta('og:site_name', 'Yannova', true);
    
    // Twitter Card tags
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', fullTitle);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', fullOgImage);

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = currentUrl;

    // Alternate language links (if needed in future)
    // updateMeta('alternate', 'fr', true, 'hreflang');
    
  }, [fullTitle, description, keywords, currentUrl, fullOgImage, noindex]);

  return null;
};

export default SEO;
