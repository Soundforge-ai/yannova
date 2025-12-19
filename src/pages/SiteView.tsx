import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PublicRenderer from '@/components/PublicRenderer';
import { getSiteContent } from '@/lib/api/site-actions';

export default function SiteView() {
  const params = useParams();
  const siteId = params.siteId as string;
  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSite() {
      if (!siteId) {
        setError('Geen site ID gevonden');
        setIsLoading(false);
        return;
      }

      try {
        const siteContent = await getSiteContent(siteId);
        if (!siteContent) {
          setError('Site niet gevonden');
        } else {
          setContent(siteContent);
        }
      } catch (err: any) {
        console.error('Error loading site:', err);
        setError(err.message || 'Fout bij het laden van de site');
      } finally {
        setIsLoading(false);
      }
    }

    loadSite();
  }, [siteId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Site laden...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Fout</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return <PublicRenderer content={content} />;
}

