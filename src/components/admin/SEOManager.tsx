import React, { useState, useEffect } from 'react';
import {
    CheckCircle,
    Circle,
    ExternalLink,
    BarChart2,
    Search,
    Smartphone,
    Zap,
    Link as LinkIcon,
    MapPin,
    PenTool,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

interface SEOItem {
    id: string;
    category: string;
    title: string;
    description: string;
    links?: { name: string; url: string }[];
    completed: boolean;
}

const initialChecklist: SEOItem[] = [
    // 1. Analyse & Inzicht
    {
        id: 'analytics',
        category: 'Analyse & Inzicht',
        title: 'Google Analytics 4 (GA4)',
        description: 'Meet verkeer (bezoekers, pagina’s, landingspagina’s) en krijg zicht op hoe mensen je site gebruiken.',
        links: [{ name: 'Google Analytics', url: 'https://analytics.google.com/' }],
        completed: false
    },
    {
        id: 'search-console',
        category: 'Analyse & Inzicht',
        title: 'Google Search Console',
        description: 'Zie hoe vaak je in Google verschijnt (impressies), op welke zoekwoorden, en los technische indexeringsfouten op.',
        links: [{ name: 'Search Console', url: 'https://search.google.com/search-console' }],
        completed: false
    },
    {
        id: 'bing-webmaster',
        category: 'Analyse & Inzicht',
        title: 'Bing Webmaster Tools',
        description: 'Zelfde idee als Search Console maar voor Microsoft/Bing. Geeft extra inzicht in zoekverkeer buiten Google.',
        links: [{ name: 'Bing Webmaster Tools', url: 'https://www.bing.com/webmasters' }],
        completed: false
    },

    // 2. Technische verbetering
    {
        id: 'pagespeed',
        category: 'Technisch',
        title: 'Snelheid Optimalisatie',
        description: 'Snelheid is een ranking-factor! Controleer compressie, caching en laadtijd.',
        links: [
            { name: 'Google PageSpeed Insights', url: 'https://pagespeed.web.dev/' },
            { name: 'GTmetrix', url: 'https://gtmetrix.com/' }
        ],
        completed: false
    },
    {
        id: 'mobile-friendly',
        category: 'Technisch',
        title: 'Mobielvriendelijkheid',
        description: 'Meer dan 50% van alle bezoekers komt via mobiel. Zorg dat je site perfect werkt op kleine schermen.',
        links: [{ name: 'Mobile-Friendly Test', url: 'https://search.google.com/test/mobile-friendly' }],
        completed: false
    },

    // 3. Content & Zoekwoorden
    {
        id: 'keyword-research',
        category: 'Content',
        title: 'Zoekwoordenonderzoek',
        description: 'Onderzoek wat mensen typen in Google. Verwerk deze woorden in titels, tekst en meta-beschrijvingen.',
        links: [
            { name: 'AnswerThePublic', url: 'https://answerthepublic.com/' },
            { name: 'Ubersuggest', url: 'https://neilpatel.com/ubersuggest/' },
            { name: 'Google Keyword Planner', url: 'https://ads.google.com/home/tools/keyword-planner/' }
        ],
        completed: false
    },
    {
        id: 'content-creation',
        category: 'Content',
        title: 'Maak waardevolle content',
        description: 'Schrijf langere content rond je zoekwoorden (blogs, landingspagina\'s). Zorg voor unieke titels en beschrijvingen.',
        completed: false
    },

    // 4. Linkbuilding
    {
        id: 'backlinks',
        category: 'Autoriteit',
        title: 'Linkbuilding',
        description: 'Vergroot je autoriteit door links vanaf andere relevante sites (gastblogs, directories, partners).',
        completed: false
    },

    // 5. Lokale Vindbaarheid
    {
        id: 'google-business',
        category: 'Lokaal',
        title: 'Google Business Profile',
        description: 'Zorg dat je bedrijf verschijnt in Google Maps met juiste openingstijden, reviews en foto\'s. Cruciaal voor lokale SEO.',
        links: [{ name: 'Google Business Profile', url: 'https://www.google.com/business/' }],
        completed: false
    },
    {
        id: 'local-reviews',
        category: 'Lokaal',
        title: 'Verzamel Reviews',
        description: 'Vraag tevreden klanten om een review achter te laten op je Google profiel.',
        completed: false
    }
];

export const SEOManager: React.FC = () => {
    const [checklist, setChecklist] = useState<SEOItem[]>([]);

    useEffect(() => {
        // Load saved state
        const saved = localStorage.getItem('yannova_seo_checklist');
        if (saved) {
            const savedState = JSON.parse(saved);
            // Merge saved completed status with current structure (in case we add new items later)
            const merged = initialChecklist.map(item => ({
                ...item,
                completed: savedState[item.id] || false
            }));
            setChecklist(merged);
        } else {
            setChecklist(initialChecklist);
        }
    }, []);

    const toggleItem = (id: string) => {
        const updated = checklist.map(item =>
            item.id === id ? { ...item, completed: !item.completed } : item
        );
        setChecklist(updated);

        // Save minimal state (just id -> boolean)
        const stateToSave = updated.reduce((acc, item) => ({
            ...acc,
            [item.id]: item.completed
        }), {});
        localStorage.setItem('yannova_seo_checklist', JSON.stringify(stateToSave));
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Analyse & Inzicht': return <BarChart2 size={20} className="text-blue-500" />;
            case 'Technisch': return <Zap size={20} className="text-yellow-500" />;
            case 'Content': return <PenTool size={20} className="text-purple-500" />;
            case 'Autoriteit': return <LinkIcon size={20} className="text-green-500" />;
            case 'Lokaal': return <MapPin size={20} className="text-red-500" />;
            default: return <Search size={20} />;
        }
    };

    // Group by category
    const categories = Array.from(new Set(checklist.map(i => i.category)));
    const progress = Math.round((checklist.filter(i => i.completed).length / checklist.length) * 100);

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header & Progress */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">SEO Optimalisatie Checklist</h2>
                    <p className="text-gray-500">Volg deze stappen om je vindbaarheid in Google te maximaliseren.</p>
                </div>

                <div className="flex items-center gap-4 bg-gray-50 px-6 py-4 rounded-xl border border-gray-200">
                    <div className="relative h-16 w-16 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path className="text-gray-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                            <path className="text-brand-accent transition-all duration-1000 ease-out" strokeDasharray={`${progress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                        </svg>
                        <span className="absolute text-sm font-bold text-gray-700">{progress}%</span>
                    </div>
                    <div>
                        <div className="font-semibold text-gray-900">Jouw SEO Score</div>
                        <div className="text-xs text-gray-500">{checklist.filter(i => i.completed).length} van {checklist.length} taken voltooid</div>
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="space-y-6">
                {categories.map(category => (
                    <div key={category} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex items-center gap-2">
                            {getCategoryIcon(category)}
                            <h3 className="font-semibold text-gray-800">{category}</h3>
                        </div>

                        <div className="divide-y divide-gray-50">
                            {checklist.filter(item => item.category === category).map(item => (
                                <div
                                    key={item.id}
                                    className={`p-6 transition-colors hover:bg-gray-50 flex gap-4 ${item.completed ? 'bg-green-50/30' : ''}`}
                                >
                                    <button
                                        onClick={() => toggleItem(item.id)}
                                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors mt-0.5
                      ${item.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 text-transparent hover:border-green-400'}`}
                                    >
                                        <CheckCircle size={14} fill="currentColor" />
                                    </button>

                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className={`font-medium ${item.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{item.title}</h4>
                                            {item.links && (
                                                <div className="flex gap-2">
                                                    {item.links.map(link => (
                                                        <a
                                                            key={link.url}
                                                            href={link.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded-md"
                                                        >
                                                            {link.name} <ExternalLink size={10} />
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <p className={`text-sm ${item.completed ? 'text-gray-400' : 'text-gray-600'}`}>{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
