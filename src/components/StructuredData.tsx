import { useEffect } from 'react';

const StructuredData: React.FC = () => {
  useEffect(() => {
    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Yannova",
      "description": "Uw expert in België voor PVC & aluminium ramen en deuren, totaalrenovaties, isolatiewerken en crepi gevelafwerking.",
      "url": "https://www.yannova.be",
      "telephone": "+32412345678",
      "email": "info@yannova.be",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Bouwstraat 123",
        "addressLocality": "Brussel",
        "postalCode": "1000",
        "addressCountry": "BE"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "50.8503",
        "longitude": "4.3517"
      },
      "areaServed": [
        {
          "@type": "State",
          "name": "Vlaanderen"
        },
        {
          "@type": "City",
          "name": "Brussel"
        }
      ],
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "08:00",
          "closes": "18:00"
        }
      ],
      "priceRange": "€€",
      "image": "/images/yannova-team.jpg",
      "sameAs": [
        "https://www.facebook.com/yannova",
        "https://www.instagram.com/yannova",
        "https://www.linkedin.com/company/yannova"
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Bouw- en Renovatiediensten",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Ramen en Deuren",
              "description": "Hoogwaardige PVC en aluminium profielen"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Renovatie",
              "description": "Totaalrenovaties van ruwbouw tot afwerking"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Isolatiewerken",
              "description": "Dak-, muur- en gevelisolatie"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Crepi Gevelafwerking",
              "description": "Strakke en duurzame gevelafwerking"
            }
          }
        ]
      }
    };

    // Remove existing script if present
    const existingScript = document.querySelector('script[data-schema="local-business"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new script
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema', 'local-business');
    script.textContent = JSON.stringify(localBusinessSchema);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return null;
};

export default StructuredData;
