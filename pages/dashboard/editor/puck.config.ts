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
        src: {
          type: 'text',
          label: 'Afbeelding URL',
        },
        alt: {
          type: 'text',
          label: 'Alt tekst',
        },
      },
      defaultProps: {
        src: '',
        alt: '',
      },
      render: ({ src, alt }) => (
        <img src={src} alt={alt} style={{ maxWidth: '100%', height: 'auto' }} />
      ),
    },
  },
};

export default config;

