import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Puck } from '@measured/puck';
import '@measured/puck/puck.css';
import config from './puck.config';
import { saveSiteContent, getSiteContent } from '@/lib/api/site-actions';

export default function EditorPage() {
  const params = useParams();
  const navigate = useNavigate();
  const siteId = (params.siteId as string) || '';
  
  const [initialData, setInitialData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Laad bestaande content bij mount
  useEffect(() => {
    async function loadContent() {
      if (!siteId) {
        setError('Geen site ID gevonden');
        setIsLoading(false);
        return;
      }

      try {
        const content = await getSiteContent(siteId);
        // Als er geen content is, start met lege data
        setInitialData(
          content || {
            root: {},
            content: [],
          }
        );
      } catch (err: any) {
        console.error('Error loading content:', err);
        setError(err.message || 'Fout bij het laden van de content');
        // Start met lege data als fallback
        setInitialData({
          root: {},
          content: [],
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadContent();
  }, [siteId]);

  const handlePublish = async (data: any) => {
    if (!siteId) {
      setSaveMessage('Geen site ID gevonden');
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const result = await saveSiteContent(siteId, data);

      if (result.success) {
        setSaveMessage('✓ Succes! Je website is bijgewerkt.');
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        throw new Error(result.error || 'Onbekende fout');
      }
    } catch (e: any) {
      console.error('Error saving:', e);
      setSaveMessage(`✗ Fout: ${e.message}`);
      setTimeout(() => setSaveMessage(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Editor laden...</p>
        </div>
      </div>
    );
  }

  if (error && !initialData) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Fout</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Terug naar Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full relative">
      {/* Save status indicator */}
      {(isSaving || saveMessage) && (
        <div className="absolute top-4 right-4 z-50 bg-white shadow-lg rounded-lg px-4 py-2 border">
          {isSaving ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-700">Opslaan...</span>
            </div>
          ) : saveMessage ? (
            <div className={`text-sm ${saveMessage.startsWith('✓') ? 'text-green-600' : 'text-red-600'}`}>
              {saveMessage}
            </div>
          ) : null}
        </div>
      )}
      
      <Puck
        config={config}
        data={initialData || { root: {}, content: [] }}
        onPublish={handlePublish}
        headerPath="/dashboard"
        headerTitle="WebOnyx Editor"
      />
    </div>
  );
}

