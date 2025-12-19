import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
}

const DEFAULT_TITLE = 'Yannova | Ramen, Deuren, Renovatie & Crepi België';
const DEFAULT_DESCRIPTION = 'Yannova is uw expert in België voor PVC & aluminium ramen en deuren, totaalrenovaties, isolatiewerken en crepi gevelafwerking. Vraag nu uw gratis offerte aan.';
const DEFAULT_KEYWORDS = 'Yannova, ramen en deuren, PVC ramen, aluminium ramen, totaalrenovatie, isolatiewerken, gevelisolatie, crepi gevel, gevelbepleistering, renovatie, nieuwbouw, bouwbedrijf België';

const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonicalUrl,
  ogImage = '/images/yannova-team.jpg'
}) => {
  const fullTitle = title ? `${title} | Yannova` : DEFAULT_TITLE;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update meta tags
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

    updateMeta('description', description);
    updateMeta('keywords', keywords);
    
    // Open Graph tags
    updateMeta('og:title', fullTitle, true);
    updateMeta('og:description', description, true);
    updateMeta('og:type', 'website', true);
    updateMeta('og:image', ogImage, true);
    
    // Twitter Card tags
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', fullTitle);
    updateMeta('twitter:description', description);

    // Canonical URL
    if (canonicalUrl) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = canonicalUrl;
    }
  }, [fullTitle, description, keywords, canonicalUrl, ogImage]);

  return null;
};

export default SEO;
