import React, { useState } from 'react';
import { generateComponent, V0ChatResponse } from '../../lib/v0';
import { Sparkles, Code, Eye, Copy, Loader } from 'lucide-react';

const V0Generator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<V0ChatResponse | null>(null);
    const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setIsGenerating(true);
        try {
            const chat = await generateComponent(prompt);
            setResult(chat);
        } catch (error) {
            console.error(error);
            alert('Er is een fout opgetreden bij het genereren.');
        } finally {
            setIsGenerating(false);
        }
    };

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        alert('Code gekopieerd naar klembord!');
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-black text-white rounded-lg">
                        <Sparkles size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">V0 Component Generator</h2>
                        <p className="text-gray-500 text-sm">Genereer React & Tailwind componenten met AI</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Beschrijf het component</label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Bijv: Een moderne pricing table met 3 kolommen, dark mode support en hover effecten..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none h-32"
                        />
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !prompt.trim()}
                        className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? (
                            <>
                                <Loader size={20} className="animate-spin" />
                                Genereren...
                            </>
                        ) : (
                            <>
                                <Sparkles size={20} />
                                Genereer Component
                            </>
                        )}
                    </button>
                </div>
            </div>

            {result && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between bg-gray-50">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveTab('preview')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'preview'
                                        ? 'bg-white text-black shadow-sm'
                                        : 'text-gray-600 hover:text-black'
                                    }`}
                            >
                                <Eye size={16} />
                                Preview
                            </button>
                            <button
                                onClick={() => setActiveTab('code')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'code'
                                        ? 'bg-white text-black shadow-sm'
                                        : 'text-gray-600 hover:text-black'
                                    }`}
                            >
                                <Code size={16} />
                                Code
                            </button>
                        </div>
                        {activeTab === 'code' && result.files && result.files.length > 0 && (
                            <button
                                onClick={() => copyCode(result.files![0].content)}
                                className="text-gray-500 hover:text-black transition-colors"
                                title="Kopieer code"
                            >
                                <Copy size={18} />
                            </button>
                        )}
                    </div>

                    <div className="p-0">
                        {activeTab === 'preview' && result.demo ? (
                            <iframe
                                src={result.demo}
                                className="w-full h-[600px] border-none"
                                title="V0 Preview"
                            />
                        ) : activeTab === 'code' && result.files ? (
                            <div className="max-h-[600px] overflow-auto bg-gray-900 text-gray-100 p-6 font-mono text-sm leading-relaxed">
                                {result.files.map((file, idx) => (
                                    <div key={idx} className="mb-8 last:mb-0">
                                        <div className="text-gray-400 mb-2">// {file.name}</div>
                                        <pre>{file.content}</pre>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center text-gray-500">
                                Geen preview beschikbaar.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default V0Generator;
