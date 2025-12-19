import React from 'react';
import JulesAssistant from '@/components/JulesAssistant';

/**
 * Jules Assistant Page
 * 
 * Deze pagina bevat de Jules AI Assistant component voor code generatie en automatisering.
 */
const JulesAssistantPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <JulesAssistant />
      </div>
    </div>
  );
};

export default JulesAssistantPage;

