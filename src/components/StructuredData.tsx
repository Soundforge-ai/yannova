import { useEffect } from 'react';

// Werkgebieden voor lokale SEO
const SERVICE_AREAS = [
  // Hoofdgebieden
  { name: 'Keerbergen', type: 'City' },
  { name: 'Mechelen', type: 'City' },
  { name: 'Zoersel', type: 'City' },
  { name: 'Putte', type: 'City' },
  // Omliggende gemeenten
  { name: 'Heist-op-den-Berg', type: 'City' },
  { name: 'Bonheiden', type: 'City' },
  { name: 'Tremelo', type: 'City' },
  { name: 'Haacht', type: 'City' },
  { name: 'Lier', type: 'City' },
  { name: 'Nijlen', type: 'City' },
  { name: 'Ranst', type: 'City' },
  { name: 'Zandhoven', type: 'City' },
  { name: 'Malle', type: 'City' },
  { name: 'Schilde', type: 'City' },
  { name: 'Wijnegem', type: 'City' },
  { name: 'Wommelgem', type: 'City' },
  { name: 'Boechout', type: 'City' },
  { name: 'Lint', type: 'City' },
  { name: 'Duffel', type: 'City' },
  { name: 'Berlaar', type: 'City' },
  // Provincies
  { name: 'Antwerpen', type: 'State' },
  { name: 'Vlaams-Brabant', type: 'State' },
];

const StructuredData: React.FC = () => {
  useEffect(() => {
    // LocalBusiness Schema
    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "HomeAndConstructionBusiness",
      "@id": "https://www.yannova.be/#organization",
      "name": "Yannova Bouw",
      "alternateName": ["Yannova", "Yannova Ramen en Deuren"],
      "description": "Yannova Bouw - Specialist in ramen en deuren, renovatie, isolatie en crepi gevelafwerking in Keerbergen, Mechelen, Zoersel, Putte en omgeving.",
      "url": "https://www.yannova.be",
      "telephone": "+32489960001",
      "email": "info@yannova.be",
      "priceRange": "€€",
      "currenciesAccepted": "EUR",
      "paymentAccepted": "Cash, Credit Card, Bank Transfer",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "De Beemdekens 39",
        "addressLocality": "Zoersel",
        "addressRegion": "Antwerpen",
        "postalCode": "2980",
        "addressCountry": "BE"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "51.2667",
        "longitude": "4.6167"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "127",
        "bestRating": "5",
        "worstRating": "1"
      },
      "areaServed": SERVICE_AREAS.map(area => ({
        "@type": area.type,
        "name": area.name
      })),
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "08:00",
          "closes": "18:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "Saturday",
          "opens": "09:00",
          "closes": "13:00"
        }
      ],
      "image": [
        "https://www.yannova.be/images/yannova-team.jpg",
        "https://www.yannova.be/lovable-uploads/c67c2ffe-a42b-477f-a67d-10100999c4f0.png"
      ],
      "logo": "https://www.yannova.be/images/logo.png",
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
              "description": "Hoogwaardige PVC en aluminium ramen en deuren plaatsen in Keerbergen, Mechelen, Zoersel en omgeving",
              "areaServed": "Antwerpen, Vlaams-Brabant"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Renovatie",
              "description": "Totaalrenovaties van ruwbouw tot afwerking in Keerbergen, Mechelen, Zoersel, Putte",
              "areaServed": "Antwerpen, Vlaams-Brabant"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Isolatiewerken",
              "description": "Dak-, muur- en gevelisolatie voor energiebesparing",
              "areaServed": "Antwerpen, Vlaams-Brabant"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Crepi Gevelafwerking",
              "description": "Professionele crepi en gevelbepleistering in Keerbergen, Mechelen, Zoersel",
              "areaServed": "Antwerpen, Vlaams-Brabant"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Gevelisolatie",
              "description": "Buitengevelisolatie met EPS en crepi afwerking",
              "areaServed": "Antwerpen, Vlaams-Brabant"
            }
          }
        ]
      }
    };

    // Organization Schema
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Yannova Bouw",
      "alternateName": "Yannova",
      "url": "https://www.yannova.be",
      "logo": "https://www.yannova.be/images/logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+32489960001",
        "contactType": "customer service",
        "availableLanguage": ["Dutch", "French"]
      }
    };

    // WebSite Schema for sitelinks search
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Yannova Bouw",
      "alternateName": "Yannova Ramen en Deuren",
      "url": "https://www.yannova.be",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.yannova.be/zoeken?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    };

    // BreadcrumbList Schema
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.yannova.be"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Diensten",
          "item": "https://www.yannova.be/diensten"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Ramen en Deuren",
          "item": "https://www.yannova.be/diensten#ramen-deuren"
        }
      ]
    };

    // FAQ Schema voor veelgestelde vragen
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Wat kost ramen en deuren plaatsen in Keerbergen?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "De prijs voor ramen en deuren hangt af van het type (PVC of aluminium), de afmetingen en het aantal. Vraag een gratis offerte aan voor een exacte prijsberekening."
          }
        },
        {
          "@type": "Question",
          "name": "Werkt Yannova ook in Mechelen en Zoersel?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Ja, Yannova Bouw is actief in heel de provincie Antwerpen en Vlaams-Brabant, inclusief Mechelen, Zoersel, Putte, Heist-op-den-Berg, Bonheiden en omgeving."
          }
        },
        {
          "@type": "Question",
          "name": "Hoelang duurt een gevelrenovatie met crepi?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Een gemiddelde gevelrenovatie met crepi duurt 1-2 weken, afhankelijk van de grootte van de woning en de weersomstandigheden."
          }
        },
        {
          "@type": "Question",
          "name": "Biedt Yannova gratis offertes aan?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Ja, wij komen gratis ter plaatse voor een opmeting en bezorgen u een vrijblijvende offerte op maat."
          }
        }
      ]
    };

    // Helper function to add schema
    const addSchema = (schema: object, id: string) => {
      const existingScript = document.querySelector(`script[data-schema="${id}"]`);
      if (existingScript) existingScript.remove();

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-schema', id);
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
      return script;
    };

    // Add all schemas
    const scripts = [
      addSchema(localBusinessSchema, 'local-business'),
      addSchema(organizationSchema, 'organization'),
      addSchema(websiteSchema, 'website'),
      addSchema(breadcrumbSchema, 'breadcrumb'),
      addSchema(faqSchema, 'faq'),
    ];

    return () => {
      scripts.forEach(script => script.remove());
    };
  }, []);

  return null;
};

export default StructuredData;
