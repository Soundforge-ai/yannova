import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-brand-accent mb-4">404</div>
        <h1 className="text-3xl font-bold text-brand-dark mb-4">
          Pagina niet gevonden
        </h1>
        <p className="text-gray-600 mb-8">
          De pagina die u zoekt bestaat niet of is verplaatst. 
          Ga terug naar de homepagina om verder te navigeren.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-accent text-white rounded-md hover:bg-orange-700 transition-colors font-medium"
          >
            <Home size={18} />
            Naar Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
          >
            <ArrowLeft size={18} />
            Ga terug
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
