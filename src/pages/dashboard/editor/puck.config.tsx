import React from 'react';
import { Config } from '@measured/puck';

// Basis Puck configuratie
// Dit is een eenvoudige config - pas aan naar jouw componenten
const config: Config = {
  components: {
    // Voorbeeld componenten - voeg je eigen componenten toe
    Heading: {
      fields: {
        text: {
          type: 'text',
          label: 'Titel',
        },
        level: {
          type: 'select',
          label: 'Niveau',
          options: [
            { label: 'H1', value: '1' },
            { label: 'H2', value: '2' },
            { label: 'H3', value: '3' },
          ],
        },
      },
      defaultProps: {
        text: 'Welkom',
        level: '1',
      },
      render: ({ text, level }) => {
        const Tag = `h${level}` as keyof JSX.IntrinsicElements;
        return <Tag>{text}</Tag>;
      },
    },
    Text: {
      fields: {
        content: {
          type: 'textarea',
          label: 'Tekst',
        },
      },
      defaultProps: {
        content: 'Voeg hier je tekst toe...',
      },
      render: ({ content }) => <p>{content}</p>,
    },
    Image: {
      fields: {
        src: { type: 'text', label: 'Afbeelding URL' },
        alt: { type: 'text', label: 'Alt tekst' },
      },
      defaultProps: {
        src: 'https://via.placeholder.com/600x400',
        alt: 'Afbeelding',
      },
      render: ({ src, alt }) => (
        <img src={src} alt={alt} className="max-w-full h-auto rounded-lg shadow-md" />
      ),
    },
    Hero: {
      fields: {
        title: { type: 'text', label: 'Titel' },
        description: { type: 'textarea', label: 'Beschrijving' },
        ctaText: { type: 'text', label: 'Knop Tekst' },
        ctaLink: { type: 'text', label: 'Knop Link' },
        bgImage: { type: 'text', label: 'Achtergrond URL' },
      },
      defaultProps: {
        title: 'Uw Pakkende Titel',
        description: 'Een korte beschrijving om bezoekers te overtuigen.',
        ctaText: 'Neem Contact Op',
        ctaLink: '/contact',
        bgImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80'
      },
      render: ({ title, description, ctaText, ctaLink, bgImage }) => (
        <div className="relative bg-gray-900 text-white py-24 px-6 md:px-12 rounded-xl overflow-hidden my-8">
          {/* Background Overlay */}
          <div
            className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/80 to-transparent" />

          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{title}</h2>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              {description}
            </p>
            <a
              href={ctaLink}
              className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              {ctaText}
            </a>
          </div>
        </div>
      )
    }
  },
};

export default config;

