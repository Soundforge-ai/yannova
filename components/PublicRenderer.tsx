import React from 'react';
import { Render } from '@measured/puck';
import config from '@/pages/dashboard/editor/puck.config';

interface PublicRendererProps {
  content: any;
}

/**
 * Component die Puck content rendert voor publieke bezoekers
 * Zonder editor functionaliteit - alleen de statische versie
 */
export default function PublicRenderer({ content }: PublicRendererProps) {
  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Nog geen content beschikbaar...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {/* De Render component van Puck toont de site precies zoals in de editor, maar dan statisch */}
      <Render config={config} data={content} />
      
      {/* HIER injecteren we later jouw Chatbot Widget automatisch! */}
      {/* <ChatbotWidget /> */}
    </main>
  );
}

