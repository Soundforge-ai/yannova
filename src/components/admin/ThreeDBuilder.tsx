import React, { useState, useEffect } from 'react';
import {
  Wand2,
  Download,
  Loader2,
  Eye,
  RotateCcw,
  Trash2,
  Box,
  Server,
  CheckCircle,
  XCircle,
  ExternalLink,
  Image as ImageIcon,
  Upload,
} from 'lucide-react';
import { settingsStorage } from '../../lib/settingsStorage';
import { generate3DModel } from '../../lib/ai';
import '@google/model-viewer';

// TypeScript declaration for model-viewer
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          ar?: boolean | string;
          'ar-modes'?: string;
          'camera-controls'?: boolean | string;
          'auto-rotate'?: boolean | string;
          'shadow-intensity'?: string;
          exposure?: string;
          poster?: string;
          loading?: string;
          style?: React.CSSProperties;
        },
        HTMLElement
      >;
    }
  }
}

interface GeneratedModel {
  id: string;
  name: string;
  prompt: string;
  modelUrl: string;
  createdAt: Date;
  status: 'generating' | 'completed' | 'failed';
}

const ThreeDBuilder: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentModel, setCurrentModel] = useState<string | null>(null);
  const [savedModels, setSavedModels] = useState<GeneratedModel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [serverUrl, setServerUrl] = useState('');
  const [serverStatus, setServerStatus] = useState<'unknown' | 'online' | 'offline'>('unknown');
  const [showSetup, setShowSetup] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Load saved data from localStorage and settings
  useEffect(() => {
    const saved = localStorage.getItem('yannova_3d_models');
    if (saved) {
      setSavedModels(JSON.parse(saved));
    }

    const loadSettings = async () => {
      const settings = await settingsStorage.getSettings();
      if (settings.threeDApiUrl) {
        setServerUrl(settings.threeDApiUrl);
        checkServerStatus(settings.threeDApiUrl);
        setShowSetup(false);
      }
    };
    loadSettings();
  }, []);

  // Check server status
  const checkServerStatus = async (url: string) => {
    try {
      const response = await fetch(`${url}/health`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
        }
      });
      if (response.ok) {
        // Verify it's JSON and not the ngrok warning HTML page
        const data = await response.json();
        if (data.status === 'ok') {
          setServerStatus('online');
          return true;
        }
      }
    } catch (e) {
      console.error('Server check failed:', e);
      setServerStatus('offline');
    }
    return false;
  };

  // Example prompts for doors
  const examplePrompts = [
    'a modern front door with glass window',
    'a wooden entrance door with panels',
    'a minimalist white door',
    'a black door with metal handle',
    'a rustic wooden door',
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Afbeelding is te groot (max 5MB)');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Keep the prefix (data:image/...) for display, but logic might need stripping if backend expects raw base64. 
        // For now, let's keep it standard and let backend handle stripping if needed or frontend does it.
        // Actually, Python base64 decode usually wants just the data unless we parse it.
        // Let's store full string for display, and strip when sending.
        setSelectedImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() && !selectedImage) {
      setError('Voer een beschrijving in of upload een foto');
      return;
    }

    if (!serverUrl || serverStatus !== 'online') {
      setError('Colab server is niet verbonden. Start de Colab notebook eerst.');
      setShowSetup(true);
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Use centralized function which handles headers and settings
      // Strip header from base64 if it exists for the API
      const imageToSend = selectedImage ? selectedImage.split(',')[1] : undefined;

      const data = await generate3DModel(prompt, imageToSend);

      if (data.success && data.model) {
        // Convert base64 to blob URL
        const binaryString = atob(data.model);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'model/gltf-binary' });
        const modelUrl = URL.createObjectURL(blob);

        setCurrentModel(modelUrl);

        // Save to list
        const newModel: GeneratedModel = {
          id: Date.now().toString(),
          name: prompt.substring(0, 50),
          prompt: prompt,
          modelUrl: modelUrl,
          createdAt: new Date(),
          status: 'completed',
        };

        const updated = [newModel, ...savedModels];
        setSavedModels(updated);
        localStorage.setItem('yannova_3d_models', JSON.stringify(updated));
      } else {
        throw new Error(data.error || 'Onbekende fout');
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message || 'Er ging iets mis bij het genereren');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToShowroom = async (model: GeneratedModel) => {
    try {
      const response = await fetch(model.modelUrl);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `deur-${model.id}.glb`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      alert(
        'Model gedownload! Plaats het bestand in public/models/ en update de Showroom component.'
      );
    } catch {
      setError('Kon model niet downloaden');
    }
  };

  const handleDeleteModel = (id: string) => {
    const updated = savedModels.filter((m) => m.id !== id);
    setSavedModels(updated);
    localStorage.setItem('yannova_3d_models', JSON.stringify(updated));
  };

  const saveServerUrl = async () => {
    if (!serverUrl.trim()) return;

    // Smart extraction: find the ngrok URL even if user pasted extra text
    const urlMatch = serverUrl.match(/https:\/\/[a-zA-Z0-9-]+\.(ngrok-free\.app|ngrok\.io)/);
    const url = urlMatch ? urlMatch[0] : serverUrl.trim().replace(/\/$/, '');

    // Update input field to show cleaned URL
    if (url !== serverUrl) {
      setServerUrl(url);
    }

    const isOnline = await checkServerStatus(url);

    if (isOnline) {
      const settings = await settingsStorage.getSettings();
      await settingsStorage.saveSettings({ ...settings, threeDApiUrl: url });
      setShowSetup(false);
      setError(null);
    } else {
      setError('Kan geen verbinding maken met de server. Controleer de URL en of Colab draait.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Box size={28} />
          <h2 className="text-2xl font-bold">3D Model Builder</h2>
          <span className="ml-auto flex items-center gap-2 text-sm">
            {serverStatus === 'online' ? (
              <>
                <CheckCircle size={16} className="text-green-300" />
                Server Online
              </>
            ) : serverStatus === 'offline' ? (
              <>
                <XCircle size={16} className="text-red-300" />
                Server Offline
              </>
            ) : (
              <>
                <Server size={16} className="text-gray-300" />
                Niet verbonden
              </>
            )}
          </span>
        </div>
        <p className="text-purple-100">
          Genereer 3D voordeuren met AI via Google Colab (gratis GPU).
        </p>
      </div>

      {/* Colab Setup */}
      {showSetup && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <Server size={20} />
            Google Colab Server Setup (Gratis)
          </h3>

          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-medium text-gray-800 mb-2">Stap 1: Start Colab Notebook</h4>
              <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                <li>
                  Open{' '}
                  <a
                    href="https://colab.research.google.com/gist/Soundforge-ai/0795f18362a3c2a531cec430a07603ad/yannova_3d.ipynb"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline font-bold"
                  >
                    Directe Colab Link (Klik Hier)
                  </a>
                  {' '}- of upload <code>scripts/colab_3d_server.ipynb</code>
                </li>
                <li>Klik Runtime → Change runtime type → <strong>T4 GPU</strong></li>
                <li>Run alle cellen (Ctrl+F9)</li>
                <li>Kopieer de ngrok URL (bijv: https://xxxx.ngrok.io)</li>
              </ol>
            </div>

            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-medium text-gray-800 mb-2">Stap 2: Verbind met Server</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={serverUrl}
                  onChange={(e) => setServerUrl(e.target.value)}
                  placeholder="https://xxxx-xx-xxx-xxx-xxx.ngrok-free.app"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={saveServerUrl}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Verbinden
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-blue-700">
              <ExternalLink size={16} />
              <span>
                Geen ngrok account?{' '}
                <a
                  href="https://ngrok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Maak gratis aan
                </a>
              </span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">{error}</div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Generator Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Wand2 size={20} className="text-purple-600" />
            Text-to-3D Generator
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Referentie Foto (Optioneel)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Upload size={18} />
                  Kies Foto
                </button>
                {selectedImage && (
                  <div className="relative group">
                    <img src={selectedImage} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-gray-200" />
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <XCircle size={14} />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                De AI zal proberen de vorm en stijl van de foto over te nemen.
              </p>
            </div>

            <div className="border-t border-gray-100 my-4"></div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beschrijf je 3D model (Engels)
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Bijv: a modern front door with vertical glass window and steel handle"
                className="w-full h-32 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">Voorbeelden:</p>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.map((example, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(example)}
                    className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-purple-100 text-gray-600 hover:text-purple-700 rounded-full transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim() || serverStatus !== 'online'}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Genereren... (30-90 sec)
                </>
              ) : (
                <>
                  <Wand2 size={20} />
                  Genereer 3D Model
                </>
              )}
            </button>

            <button
              onClick={() => setShowSetup(!showSetup)}
              className="w-full py-2 text-sm text-gray-500 hover:text-gray-700"
            >
              ⚙️ Server instellingen
            </button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Eye size={20} className="text-purple-600" />
            3D Preview
          </h3>

          <div className="bg-gray-100 rounded-xl overflow-hidden" style={{ height: '400px' }}>
            {currentModel ? (
              <model-viewer
                src={currentModel}
                alt="Generated 3D model"
                camera-controls
                auto-rotate
                shadow-intensity="1"
                exposure="0.8"
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Box size={48} className="mx-auto mb-3 opacity-50" />
                  <p>Genereer een model om preview te zien</p>
                </div>
              </div>
            )}
          </div>

          {currentModel && (
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setCurrentModel(null)}
                className="flex-1 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <RotateCcw size={18} />
                Reset
              </button>
              <a
                href={currentModel}
                download="voordeur.glb"
                className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <Download size={18} />
                Download GLB
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Saved Models */}
      {savedModels.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Opgeslagen Modellen</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedModels.map((model) => (
              <div key={model.id} className="border border-gray-200 rounded-lg p-4">
                <div className="bg-gray-100 rounded-lg h-32 mb-3 overflow-hidden">
                  <model-viewer
                    src={model.modelUrl}
                    alt={model.name}
                    camera-controls
                    auto-rotate
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
                <h4 className="font-medium text-gray-800 truncate">{model.name}</h4>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(model.createdAt).toLocaleDateString('nl-NL')}
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => setCurrentModel(model.modelUrl)}
                    className="flex-1 py-1.5 text-sm border border-gray-200 rounded text-gray-600 hover:bg-gray-50"
                  >
                    Bekijk
                  </button>
                  <button
                    onClick={() => handleSaveToShowroom(model)}
                    className="flex-1 py-1.5 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
                  >
                    Showroom
                  </button>
                  <button
                    onClick={() => handleDeleteModel(model.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreeDBuilder;
