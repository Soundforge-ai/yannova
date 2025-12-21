import React, { useState, useEffect, useRef } from 'react';
import {
  Wand2,
  Download,
  Loader2,
  Eye,
  RotateCcw,
  Trash2,
  Box,
  CheckCircle,
  Image as ImageIcon,
  Upload,
  Sparkles,
  Globe,
  Send,
} from 'lucide-react';
import { ModelViewer } from '../ui/ModelViewer';
import {
  generateTextTo3D,
  generateImageTo3D,
  getShowroomModels,
  saveShowroomModel,
  deleteShowroomModel,
  publishToShowroom,
  downloadModelAsFile,
  ShowroomModel,
} from '../../lib/ai/3d-api';

interface GeneratedModel {
  id: string;
  name: string;
  prompt: string;
  modelUrl: string;
  modelBlob?: Blob;
  createdAt: Date;
  status: 'generating' | 'completed' | 'failed';
}

const ThreeDBuilderFree: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentModel, setCurrentModel] = useState<string | null>(null);
  const [currentModelBlob, setCurrentModelBlob] = useState<Blob | null>(null);
  const [savedModels, setSavedModels] = useState<GeneratedModel[]>([]);
  const [showroomModels, setShowroomModels] = useState<ShowroomModel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<Blob | null>(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
  const [generationType, setGenerationType] = useState<'text' | 'image'>('text');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishingModel, setPublishingModel] = useState<GeneratedModel | null>(null);
  const [publishForm, setPublishForm] = useState({
    name: '',
    description: '',
    color: '#2d3436',
    features: '',
    price: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem('yannova_3d_models_free');
    if (saved) {
      setSavedModels(JSON.parse(saved));
    }
    setShowroomModels(getShowroomModels());
  }, []);

  const examplePrompts = [
    'a modern front door with glass panel',
    'a wooden entrance door with panels',
    'a minimalist white door',
    'a black door with metal handle',
    'an aluminum door with sidelights',
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Afbeelding is te groot (max 5MB)');
        return;
      }
      setSelectedImage(file);
      setSelectedImagePreview(URL.createObjectURL(file));
      setGenerationType('image');
    }
  };

  const handleGenerate = async () => {
    if (generationType === 'text' && !prompt.trim()) {
      setError('Voer een beschrijving in');
      return;
    }
    if (generationType === 'image' && !selectedImage) {
      setError('Upload eerst een afbeelding');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSuccess(null);

    try {
      let result;
      
      if (generationType === 'image' && selectedImage) {
        result = await generateImageTo3D(selectedImage);
      } else {
        result = await generateTextTo3D(prompt);
      }

      if (result.success && result.modelUrl) {
        setCurrentModel(result.modelUrl);
        setCurrentModelBlob(result.modelBlob || null);

        // Save to list
        const newModel: GeneratedModel = {
          id: Date.now().toString(),
          name: generationType === 'image' ? 'Image to 3D' : prompt.substring(0, 50),
          prompt: generationType === 'image' ? 'Generated from image' : prompt,
          modelUrl: result.modelUrl,
          modelBlob: result.modelBlob,
          createdAt: new Date(),
          status: 'completed',
        };

        const updated = [newModel, ...savedModels];
        setSavedModels(updated);
        localStorage.setItem('yannova_3d_models_free', JSON.stringify(
          updated.map(m => ({ ...m, modelBlob: undefined })) // Don't store blobs
        ));
        
        setSuccess('3D model succesvol gegenereerd!');
      } else {
        throw new Error(result.error || 'Onbekende fout');
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message || 'Er ging iets mis bij het genereren');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublishToShowroom = (model: GeneratedModel) => {
    setPublishingModel(model);
    setPublishForm({
      name: model.name,
      description: '',
      color: '#2d3436',
      features: '',
      price: '',
    });
    setShowPublishModal(true);
  };

  const confirmPublishToShowroom = async () => {
    if (!publishingModel) return;

    const newShowroomModel: ShowroomModel = {
      id: `showroom-${Date.now()}`,
      name: publishForm.name,
      description: publishForm.description,
      prompt: publishingModel.prompt,
      modelPath: `/models/showroom-${publishingModel.id}.glb`,
      color: publishForm.color,
      features: publishForm.features.split(',').map(f => f.trim()).filter(Boolean),
      price: publishForm.price || undefined,
      createdAt: new Date(),
      published: true,
    };

    saveShowroomModel(newShowroomModel);
    setShowroomModels(getShowroomModels());
    
    // Download the model file for the user to place in public/models
    if (publishingModel.modelUrl) {
      await downloadModelAsFile(
        publishingModel.modelUrl,
        `showroom-${publishingModel.id}.glb`
      );
    }

    setShowPublishModal(false);
    setPublishingModel(null);
    setSuccess(`Model "${publishForm.name}" toegevoegd aan Showroom! Plaats het gedownloade .glb bestand in public/models/`);
  };

  const handleDeleteModel = (id: string) => {
    const updated = savedModels.filter((m) => m.id !== id);
    setSavedModels(updated);
    localStorage.setItem('yannova_3d_models_free', JSON.stringify(updated));
  };

  const handleDeleteShowroomModel = (id: string) => {
    deleteShowroomModel(id);
    setShowroomModels(getShowroomModels());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Box size={28} />
          <h2 className="text-2xl font-bold">3D Model Builder</h2>
          <span className="ml-auto flex items-center gap-2 text-sm bg-green-500/20 px-3 py-1 rounded-full">
            <Sparkles size={16} />
            100% Gratis via HuggingFace
          </span>
        </div>
        <p className="text-purple-100">
          Genereer 3D modellen van voordeuren met AI. Geen server of account nodig!
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 flex items-center gap-2">
          <CheckCircle size={20} />
          {success}
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
            AI Generator
          </h3>

          {/* Generation Type Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setGenerationType('text')}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                generationType === 'text'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📝 Text → 3D
            </button>
            <button
              onClick={() => setGenerationType('image')}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                generationType === 'image'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📷 Image → 3D
            </button>
          </div>

          <div className="space-y-4">
            {generationType === 'image' ? (
              <>
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload een foto van een deur
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      ref={fileInputRef}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <Upload size={18} />
                      Kies foto
                    </button>
                    {selectedImagePreview && (
                      <img
                        src={selectedImagePreview}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Text Prompt */}
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
              </>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Genereren... (15-60 sec)
                </>
              ) : (
                <>
                  <Wand2 size={20} />
                  Genereer 3D Model
                </>
              )}
            </button>

            <p className="text-xs text-gray-400 text-center">
              Powered by OpenAI Shap-E via HuggingFace Spaces
            </p>
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
              <ModelViewer
                src={currentModel}
                alt="Generated 3D model"
                cameraControls
                autoRotate
                shadowIntensity="1"
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
                onClick={() => {
                  setCurrentModel(null);
                  setCurrentModelBlob(null);
                }}
                className="flex-1 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <RotateCcw size={18} />
                Reset
              </button>
              <button
                onClick={() => downloadModelAsFile(currentModel, 'voordeur.glb')}
                className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <Download size={18} />
                Download GLB
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Saved Models */}
      {savedModels.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Gegenereerde Modellen</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedModels.map((model) => (
              <div key={model.id} className="border border-gray-200 rounded-lg p-4">
                <div className="bg-gray-100 rounded-lg h-32 mb-3 overflow-hidden">
                  {model.modelUrl ? (
                    <ModelViewer
                      src={model.modelUrl}
                      alt={model.name}
                      cameraControls
                      autoRotate
                      style={{ width: '100%', height: '100%' }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Box size={32} className="text-gray-400" />
                    </div>
                  )}
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
                    onClick={() => handlePublishToShowroom(model)}
                    className="flex-1 py-1.5 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center justify-center gap-1"
                  >
                    <Globe size={14} />
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

      {/* Showroom Models */}
      {showroomModels.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Globe size={20} className="text-green-600" />
            Showroom Modellen ({showroomModels.filter(m => m.published).length} gepubliceerd)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">Naam</th>
                  <th className="text-left py-2 px-3">Beschrijving</th>
                  <th className="text-left py-2 px-3">Prijs</th>
                  <th className="text-left py-2 px-3">Status</th>
                  <th className="text-left py-2 px-3">Acties</th>
                </tr>
              </thead>
              <tbody>
                {showroomModels.map((model) => (
                  <tr key={model.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-3 font-medium">{model.name}</td>
                    <td className="py-2 px-3 text-gray-600">{model.description || '-'}</td>
                    <td className="py-2 px-3">{model.price || '-'}</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        model.published 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {model.published ? 'Gepubliceerd' : 'Concept'}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <button
                        onClick={() => handleDeleteShowroomModel(model.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Publish Modal */}
      {showPublishModal && publishingModel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">Publiceer naar Showroom</h3>
              <p className="text-gray-500 text-sm mt-1">Voeg dit model toe aan de publieke showroom</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Naam *</label>
                <input
                  type="text"
                  value={publishForm.name}
                  onChange={(e) => setPublishForm({ ...publishForm, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Bijv: Modern Antraciet"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Beschrijving</label>
                <textarea
                  value={publishForm.description}
                  onChange={(e) => setPublishForm({ ...publishForm, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Korte beschrijving van de deur"
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kleur</label>
                  <input
                    type="color"
                    value={publishForm.color}
                    onChange={(e) => setPublishForm({ ...publishForm, color: e.target.value })}
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prijs</label>
                  <input
                    type="text"
                    value={publishForm.price}
                    onChange={(e) => setPublishForm({ ...publishForm, price: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="€2.500 - €3.500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma-separated)</label>
                <input
                  type="text"
                  value={publishForm.features}
                  onChange={(e) => setPublishForm({ ...publishForm, features: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Drievoudig glas, RC3 inbraakwerend, Thermisch onderbroken"
                />
              </div>
            </div>
            
            <div className="p-6 border-t bg-gray-50 rounded-b-2xl flex gap-3">
              <button
                onClick={() => setShowPublishModal(false)}
                className="flex-1 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                Annuleren
              </button>
              <button
                onClick={confirmPublishToShowroom}
                disabled={!publishForm.name.trim()}
                className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send size={18} />
                Publiceren
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreeDBuilderFree;
