import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  PieChart,
  Search,
  Bell,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Trash2,
  FileText,
  Loader2,
  Maximize2,
  Minimize2,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Filter,
  Download,
  MoreVertical,
  Calendar,
  Sparkles,
  Save,
  Upload,
  Plus,
  Key,
  FileJson,
  FilePlus,
  Edit,
  ExternalLink,
  Server,
  Cpu,
  Image as ImageIcon,
  FolderOpen,
  Rocket,
  Clock,
  Eye,
  Mail,
  Phone,
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  MessageCircle,
  Bot,
  User,
  Box
} from 'lucide-react';
import { chatStorage, ChatSession } from '../lib/chatStorage';
import { settingsStorage, AppSettings, defaultSettings, KnowledgeDocument, AIProvider } from '../lib/settingsStorage';
import { pageStorage, PageData } from '../lib/pageStorage';
import { mediaStorage, MediaItem } from '../lib/mediaStorage';
import { analyzeConversation, generateSEO, generateAdCopy } from '../lib/ai';
import { chatService } from '../lib/chatService';
import { ThreeDBuilder } from './admin/ThreeDBuilder';
import { SEOManager } from './admin/SEOManager';
import { Lead } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { COMPANY_NAME } from '../constants';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import ThreeDBuilder from './admin/ThreeDBuilder';

const GOOGLE_CLIENT_ID = (import.meta as any).env.VITE_GOOGLE_CLIENT_ID;

// VOEG HIER JOUW EMAILADRES TOE OM IN TE KUNNEN LOGGEN
const ALLOWED_ADMIN_EMAILS = [
  'innovar.labs7@gmail.com',
  'windowpro.be@gmail.com',
  'info@yannova.be',
  'roustamyandiev00@gmail.com'
];

interface AdminDashboardProps {
  leads: Lead[];
  onUpdateStatus: (id: string, status: Lead['status']) => void;
  onLogout: () => void;
}

type TabType = 'dashboard' | 'leads' | 'settings' | 'chats' | 'pages' | 'media' | 'marketing' | '3dbuilder' | 'seo';
type FilterStatus = 'all' | Lead['status'];

const ITEMS_PER_PAGE = 10;

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  leads,
  onUpdateStatus,
  onLogout,
}) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [loginError, setLoginError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Nieuwe aanvraag van Jan Peeters', time: '5 min geleden', read: false },
    { id: 2, message: 'Offerte verzonden naar Sofie Dubois', time: '1 uur geleden', read: true },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Chat state
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Settings state
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pages state
  const [pages, setPages] = useState<PageData[]>([]);
  const [isCreatingPage, setIsCreatingPage] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');
  const [newPageParentId, setNewPageParentId] = useState<string>('');

  // Statische pagina's van de website
  const staticPages = [
    { id: 'home', title: 'Home', slug: '', path: '/', type: 'static' as const },
    { id: 'over-ons', title: 'Over Ons', slug: 'over-ons', path: '/over-ons', type: 'static' as const },
    { id: 'diensten', title: 'Diensten', slug: 'diensten', path: '/diensten', type: 'static' as const },
    { id: 'crepi-info', title: 'Crepi Info', slug: 'crepi-info', path: '/crepi-info', type: 'static' as const },
    { id: 'aanpak', title: 'Aanpak', slug: 'aanpak', path: '/aanpak', type: 'static' as const },
    { id: 'partners', title: 'Partners', slug: 'partners', path: '/partners', type: 'static' as const },
    { id: 'contact', title: 'Contact', slug: 'contact', path: '/contact', type: 'static' as const },
    { id: 'jules', title: 'Jules Assistant', slug: 'jules', path: '/jules', type: 'static' as const },
    { id: 'posts', title: 'Posts', slug: 'posts', path: '/posts', type: 'static' as const },
    { id: 'gevel', title: 'Gevel', slug: 'gevel', path: '/gevel', type: 'static' as const },
    { id: 'gevelbepleistering', title: 'Gevelbepleistering', slug: 'gevel/gevelbepleistering', path: '/gevel/gevelbepleistering', type: 'static' as const },
    { id: 'gevelbescherming', title: 'Gevelbescherming', slug: 'gevel/gevelbescherming', path: '/gevel/gevelbescherming', type: 'static' as const },
    { id: 'gevelisolatie', title: 'Gevelisolatie', slug: 'gevel/gevelisolatie', path: '/gevel/gevelisolatie', type: 'static' as const },
    { id: 'steenstrips', title: 'Steenstrips', slug: 'gevel/steenstrips', path: '/gevel/steenstrips', type: 'static' as const },
    { id: 'gevelrenovatie', title: 'Gevelrenovatie', slug: 'gevel/gevelrenovatie', path: '/gevel/gevelrenovatie', type: 'static' as const },
    { id: 'ramen-deuren', title: 'Ramen & Deuren', slug: 'ramen-deuren', path: '/ramen-deuren', type: 'static' as const },
    { id: 'tuinaanleg', title: 'Tuinaanleg', slug: 'tuinaanleg', path: '/tuinaanleg', type: 'static' as const },
    { id: 'renovatie', title: 'Renovatie', slug: 'renovatie', path: '/renovatie', type: 'static' as const },
  ];

  // Media state
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  // SEO & Marketing state
  const [editingSEOPageId, setEditingSEOPageId] = useState<string | null>(null);
  const [seoData, setSeoData] = useState({ title: '', description: '', keywords: '' });
  const [isGeneratingSEO, setIsGeneratingSEO] = useState(false);

  const [marketingTopic, setMarketingTopic] = useState('');
  const [generatedAd, setGeneratedAd] = useState<{ headline: string, body: string, cta: string } | null>(null);
  const [isGeneratingAd, setIsGeneratingAd] = useState(false);

  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImagePrompt, setGeneratedImagePrompt] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [sessions, settingsData, pagesData, mediaData] = await Promise.all([
          chatStorage.getSessions(),
          settingsStorage.getSettings(),
          pageStorage.getPages(),
          mediaStorage.getMedia()
        ]);
        setChatSessions(sessions);
        setSettings(settingsData);
        setPages(pagesData);
        setMediaItems(mediaData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
    const handleStorageUpdate = () => loadData();
    window.addEventListener('chat-storage-updated', handleStorageUpdate);
    window.addEventListener('settings-updated', handleStorageUpdate);
    window.addEventListener('pages-updated', handleStorageUpdate);
    window.addEventListener('media-updated', handleStorageUpdate);

    return () => {
      window.removeEventListener('chat-storage-updated', handleStorageUpdate);
      window.removeEventListener('settings-updated', handleStorageUpdate);
      window.removeEventListener('pages-updated', handleStorageUpdate);
      window.removeEventListener('media-updated', handleStorageUpdate);
    };
  }, []);

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      await settingsStorage.saveSettings(settings); // This saves API key, name and knowledge base
      setIsSavingSettings(false);
      // Show success notification logic could go here
    } catch (error) {
      console.error('Error saving settings:', error);
      setIsSavingSettings(false);
      alert('Er is een fout opgetreden bij het opslaan van de instellingen.');
    }
  };

  // Initialize PDF.js worker
  useEffect(() => {
    import('pdfjs-dist').then(pdfjsLib => {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    });
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    let content = '';

    try {
      if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdfjsLib = await import('pdfjs-dist');
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          fullText += pageText + '\n\n';
        }
        content = fullText;
      } else {
        content = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target?.result as string);
          reader.readAsText(file);
        });
      }

      const newDoc: KnowledgeDocument = {
        id: Date.now().toString(),
        name: file.name,
        content: content,
        type: file.type,
        uploadDate: new Date()
      };

      const updatedSettings = {
        ...settings,
        knowledgeBase: [...settings.knowledgeBase, newDoc]
      };

      setSettings(updatedSettings);
      await settingsStorage.saveSettings(updatedSettings);
    } catch (error) {
      console.error('Error reading file:', error);
      alert('Fout bij het lezen van bestand. Probeer opnieuw.');
    }

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteDocument = async (id: string) => {
    const updatedSettings = {
      ...settings,
      knowledgeBase: settings.knowledgeBase.filter(doc => doc.id !== id)
    };
    setSettings(updatedSettings);
    await settingsStorage.saveSettings(updatedSettings);
  };

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageTitle || !newPageSlug) return;

    // Normalize slug
    const cleanSlug = newPageSlug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // If parent is selected, maybe prepend parent slug? Or just keep it relative.
    // For simplicity, let's keep slugs absolute but store hierarchy.

    const newPage: PageData = {
      id: Date.now().toString(),
      title: newPageTitle,
      slug: cleanSlug,
      content: { root: { title: newPageTitle }, content: [] }, // Empty puck data
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'draft',
      parentId: newPageParentId || undefined
    };

    await pageStorage.savePage(newPage);
    setIsCreatingPage(false);
    setNewPageTitle('');
    setNewPageSlug('');
    setNewPageParentId('');

    // Redirect to editor? Maybe just show list.
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingMedia(true);
    const file = files[0];

    // Check size (max 4MB)
    if (file.size > 4 * 1024 * 1024) {
      alert('Bestand is te groot (max 4MB ivm browser opslag)');
      setIsUploadingMedia(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;

      try {
        mediaStorage.saveMedia({
          id: Date.now().toString(),
          name: file.name,
          url: base64,
          type: file.type.startsWith('image/') ? 'image' : 'document',
          uploadDate: new Date(),
          size: file.size
        });
      } catch (err: any) {
        alert(err.message);
      }
      setIsUploadingMedia(false);
    };
    reader.readAsDataURL(file);
    if (mediaInputRef.current) mediaInputRef.current.value = '';
  };

  const handleDeleteMedia = (id: string) => {
    if (confirm('Verwijderen?')) {
      mediaStorage.deleteMedia(id);
      setMediaItems(mediaStorage.getMedia());
    }
  };

  const handleImportGCSPhotos = async () => {
    try {
      // Laad upload results van het script (uit public folder)
      const response = await fetch('/upload-results.json');
      if (!response.ok) {
        throw new Error('Upload results niet gevonden. Run eerst: npm run upload-photos');
      }

      const results = await response.json();
      const successfulUploads = results.filter((r: any) => r.success && r.url);

      if (successfulUploads.length === 0) {
        alert('Geen succesvolle uploads gevonden in upload-results.json');
        return;
      }

      // Importeer elke foto in de media library
      let imported = 0;
      for (const upload of successfulUploads) {
        try {
          mediaStorage.addGCSMedia(
            upload.url,
            upload.fileName,
            upload.size || 0
          );
          imported++;
        } catch (error) {
          console.error(`Error importing ${upload.fileName}:`, error);
        }
      }

      // Refresh media items
      setMediaItems(mediaStorage.getMedia());
      alert(`✅ ${imported} foto's geïmporteerd uit Google Cloud Storage!`);
    } catch (error: any) {
      console.error('Error importing GCS photos:', error);
      alert(`Fout bij importeren: ${error.message}\n\nZorg dat je eerst het upload script hebt gedraaid: npm run upload-photos`);
    }
  };

  const handleImportGCSFromURLs = () => {
    const urls = prompt('Plak hier de Google Cloud Storage URLs (één per regel):');
    if (!urls) return;

    const urlList = urls.split('\n').filter(url => url.trim());
    let imported = 0;

    for (const url of urlList) {
      try {
        const fileName = url.split('/').pop() || `image-${Date.now()}.png`;
        mediaStorage.addGCSMedia(url.trim(), fileName, 0);
        imported++;
      } catch (error) {
        console.error(`Error importing ${url}:`, error);
      }
    }

    setMediaItems(mediaStorage.getMedia());
    alert(`✅ ${imported} foto's geïmporteerd!`);
  };

  const handleDeletePage = async (id: string) => {
    if (confirm('Weet u zeker dat u deze pagina wilt verwijderen?')) {
      await pageStorage.deletePage(id);
    }
  };

  const handleEditSEO = (page: PageData) => {
    setEditingSEOPageId(page.id);
    setSeoData({
      title: page.seo?.title || '',
      description: page.seo?.description || '',
      keywords: page.seo?.keywords || ''
    });
  };

  const handleSaveSEO = async () => {
    if (!editingSEOPageId) return;
    const page = pages.find(p => p.id === editingSEOPageId);
    if (!page) return;

    await pageStorage.savePage({
      ...page,
      seo: seoData
    });
    setEditingSEOPageId(null);
  };

  const handleGenerateSEO = async () => {
    setIsGeneratingSEO(true);
    // Find page content
    // In a real app we would parse the Puck data. Here we might just use the title as context?
    // Or if we had content, pass it.
    const page = pages.find(p => p.id === editingSEOPageId);
    const contentContext = `Pagina titel: ${page?.title}. Slug: ${page?.slug}. Dit is een pagina voor een bouwbedrijf.`;

    const result = await generateSEO(contentContext);
    setSeoData(result);
    setIsGeneratingSEO(false);
  };

  const handleGenerateAd = async () => {
    if (!marketingTopic) return;
    setIsGeneratingAd(true);
    const result = await generateAdCopy(marketingTopic);
    setGeneratedAd(result);
    setIsGeneratingAd(false);
  };

  const handleGenerateImagePrompt = async () => {
    if (!imagePrompt) return;
    setIsGeneratingImage(true);
    try {
      // Since we don't have DALL-E, we ask the Chat AI to generate a detailed DALL-E/Midjourney prompt
      const response = await chatService.sendMessage([
        { role: 'system', content: 'Je bent een expert in het schrijven van prompts voor AI image generators zoals Midjourney en DALL-E.' },
        { role: 'user', content: `Schrijf een gedetailleerde, engelse prompt om een fotorealistische afbeelding te genereren voor: "${imagePrompt}". Focus op belichting, compositie en stijl.` }
      ]);
      setGeneratedImagePrompt(response);
    } catch (e) {
      setGeneratedImagePrompt('Fout bij genereren.');
    }
    setIsGeneratingImage(false);
  };

  const handleCreatePageFromAd = async () => {
    if (!generatedAd) return;

    const title = prompt('Naam voor de nieuwe pagina:', marketingTopic || 'Nieuwe Campagne');
    if (!title) return;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newId = Date.now().toString();

    const newPage: PageData = {
      id: newId,
      title: title,
      slug: slug,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'draft',
      content: {
        root: { title: title },
        content: [
          {
            type: 'Hero', // Must match component name in puck.config.tsx
            props: {
              title: generatedAd.headline,
              description: generatedAd.body,
              ctaText: generatedAd.cta,
              ctaLink: '/contact',
              bgImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80',
              id: 'Hero-' + Date.now()
            }
          }
        ]
      }
    };

    await pageStorage.savePage(newPage);

    // Navigate to editor
    navigate(`/dashboard/editor/${newId}`);
  };

  const handleAnalyzeChat = async (session: ChatSession) => {
    setIsAnalyzing(true);
    setAnalysisResult('');
    const result = await analyzeConversation(session.messages);
    setIsAnalyzing(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Trim whitespace and check credentials
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (trimmedUsername === 'admin' && trimmedPassword === 'admin123') {
      setIsAuthenticated(true);
      setLoginError('');
      // Store authentication in sessionStorage to persist across page refreshes
      sessionStorage.setItem('admin_authenticated', 'true');
    } else {
      setLoginError('Ongeldige gebruikersnaam of wachtwoord');
    }
  };

  // Check if already authenticated on mount
  useEffect(() => {
    const isAuth = sessionStorage.getItem('admin_authenticated');
    if (isAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, [setIsAuthenticated]);

  // Handle logout with sessionStorage cleanup
  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
    onLogout();
  };

  // Filtered and searched leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.project.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'all' || lead.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [leads, searchQuery, filterStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE);
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Stats
  const stats = useMemo(() => {
    const newLeads = leads.filter((l) => l.status === 'Nieuw').length;
    const processing = leads.filter((l) =>
      ['Contact Gehad', 'Offerte Verzonden'].includes(l.status)
    ).length;
    const completed = leads.filter((l) => l.status === 'Afgerond').length;
    const total = leads.length;
    const conversionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { newLeads, processing, completed, total, conversionRate };
  }, [leads]);

  const exportToCSV = () => {
    const headers = ['Naam', 'Email', 'Telefoon', 'Project', 'Datum', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredLeads.map((lead) =>
        [lead.name, lead.email, lead.phone, lead.project, lead.date, lead.status].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `yannova-leads-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'Nieuw': return 'bg-blue-100 text-blue-700';
      case 'Contact Gehad': return 'bg-yellow-100 text-yellow-700';
      case 'Offerte Verzonden': return 'bg-purple-100 text-purple-700';
      case 'Afgerond': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-dark to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-brand-dark">
              {COMPANY_NAME}<span className="text-brand-accent">.</span>
            </h1>
            <p className="text-gray-500 mt-2">Admin Panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Gebruikersnaam
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-brand-accent outline-none transition-all"
                placeholder="Voer gebruikersnaam in"
                autoComplete="username"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Wachtwoord
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-brand-accent outline-none transition-all"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {loginError && (
              <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                <AlertCircle size={16} />
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-brand-accent hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition-colors"
            >
              Inloggen
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-brand-accent transition-colors"
              >
                ← Terug naar website
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-500">
            <p className="font-medium text-gray-700 mb-1">Demo credentials:</p>
            <p>Gebruiker: admin | Wachtwoord: admin123</p>
          </div>
        </div>
      </div>
    );
  }

  // Lead Detail Modal
  const LeadDetailModal = () => {
    if (!selectedLead) return null;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-auto">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-xl font-bold text-brand-dark">Lead Details</h3>
            <button
              onClick={() => setSelectedLead(null)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent text-2xl font-bold">
                {selectedLead.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-xl font-bold text-brand-dark">{selectedLead.name}</h4>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(selectedLead.status)}`}>
                  {selectedLead.status}
                </span>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="text-gray-400" size={20} />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <a href={`mailto:${selectedLead.email}`} className="text-brand-dark hover:text-brand-accent">
                    {selectedLead.email}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="text-gray-400" size={20} />
                <div>
                  <p className="text-xs text-gray-500">Telefoon</p>
                  <a href={`tel:${selectedLead.phone}`} className="text-brand-dark hover:text-brand-accent">
                    {selectedLead.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-400" size={20} />
                <div>
                  <p className="text-xs text-gray-500">Aanvraagdatum</p>
                  <p className="text-brand-dark">{selectedLead.date}</p>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Project</p>
                <p className="text-brand-dark">{selectedLead.project}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status wijzigen</label>
              <select
                value={selectedLead.status}
                onChange={(e) => {
                  onUpdateStatus(selectedLead.id, e.target.value as Lead['status']);
                  setSelectedLead({ ...selectedLead, status: e.target.value as Lead['status'] });
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent outline-none"
              >
                <option value="Nieuw">Nieuw</option>
                <option value="Contact Gehad">Contact Gehad</option>
                <option value="Offerte Verzonden">Offerte Verzonden</option>
                <option value="Afgerond">Afgerond</option>
              </select>
            </div>

            <div className="flex gap-3">
              <a
                href={`mailto:${selectedLead.email}`}
                className="flex-1 flex items-center justify-center gap-2 bg-brand-accent hover:bg-orange-700 text-white py-3 rounded-lg font-medium transition-colors"
              >
                <Mail size={18} /> Email sturen
              </a>
              <a
                href={`tel:${selectedLead.phone}`}
                className="flex-1 flex items-center justify-center gap-2 bg-brand-dark hover:bg-slate-800 text-white py-3 rounded-lg font-medium transition-colors"
              >
                <Phone size={18} /> Bellen
              </a>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Of ga verder met</span>
              </div>
            </div>

            <div className="flex justify-center">
              <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <GoogleLogin
                  onSuccess={credentialResponse => {
                    try {
                      if (credentialResponse.credential) {
                        const decoded: any = jwtDecode(credentialResponse.credential);

                        if (ALLOWED_ADMIN_EMAILS.includes(decoded.email)) {
                          setIsAuthenticated(true);
                          setUsername(decoded.name || decoded.email);
                        } else {
                          alert(`Toegang geweigerd. Het emailadres ${decoded.email} heeft geen admin rechten.`);
                          console.warn('Unauthorized login attempt:', decoded.email);
                        }
                      }
                    } catch (e) {
                      console.error('Google login error', e);
                    }
                  }}
                  onError={() => {
                    console.log('Login Failed');
                    alert('Google login mislukt.');
                  }}
                  useOneTap
                />
              </GoogleOAuthProvider>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-dark text-white fixed h-full z-10 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold">{COMPANY_NAME}<span className="text-brand-accent">.</span></h2>
          <p className="text-xs text-gray-500 mt-1">Admin Dashboard</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-brand-accent text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'leads' ? 'bg-brand-accent text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
          >
            <Users size={20} />
            Leads
            {stats.newLeads > 0 && <span className="ml-auto bg-brand-accent text-white hover:bg-brand-accent/80 text-xs px-2 py-0.5 rounded-full">{stats.newLeads}</span>}
          </button>
          <button
            onClick={() => setActiveTab('chats')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'chats' ? 'bg-brand-accent text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
          >
            <MessageCircle size={20} />
            Chats
            <span className="ml-auto bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded-full">{chatSessions.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('pages')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'pages' ? 'bg-brand-accent text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
          >
            <FileText size={20} />
            Pagina's
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'media' ? 'bg-brand-accent text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
          >
            <ImageIcon size={20} />
            Media & Foto's
          </button>
          <button
            onClick={() => setActiveTab('marketing')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'marketing' ? 'bg-brand-accent text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
          >
            <Rocket size={20} />
            AI Marketing
          </button>
          <button
            onClick={() => setActiveTab('3dbuilder')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === '3dbuilder' ? 'bg-brand-accent text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
          >
            <Box size={20} />
            3D Builder
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-brand-accent text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
          >
            <Settings size={20} />
            Instellingen
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-900/20 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
            Uitloggen
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8">
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-brand-dark">{COMPANY_NAME}<span className="text-brand-accent">.</span></h2>
          <button onClick={handleLogout} className="p-2 text-gray-600">
            <LogOut size={24} />
          </button>
        </div>

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-brand-dark">
              {activeTab === 'dashboard' ? 'Dashboard Overzicht' :
                activeTab === 'leads' ? 'Leads Beheer' :
                  activeTab === 'chats' ? 'Chat Gesprekken' :
                    activeTab === 'pages' ? 'Paginabeheer' :
                      activeTab === 'media' ? 'Media Bibliotheek' :
                        activeTab === 'marketing' ? 'AI Marketing Tools' :
                          activeTab === '3dbuilder' ? '3D Model Builder' : 'Instellingen'}
            </h1>
            <p className="text-gray-500">Welkom terug, Admin</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow relative"
              >
                <Bell size={20} className="text-gray-600" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 z-50">
                  <div className="p-4 border-b border-gray-100 font-semibold">Notificaties</div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 ${!n.read ? 'bg-blue-50/50' : ''}`}>
                        <p className="text-sm text-gray-800">{n.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{n.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="w-10 h-10 bg-brand-dark rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm">Totaal Leads</p>
                    <h3 className="text-2xl font-bold text-brand-dark mt-1">{stats.total}</h3>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                    <Users size={20} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <TrendingUp size={16} className="mr-1" />
                  <span>+12%</span>
                  <span className="text-gray-400 ml-1">vs vorige maand</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm">Nieuwe Aanvragen</p>
                    <h3 className="text-2xl font-bold text-brand-dark mt-1">{stats.newLeads}</h3>
                  </div>
                  <div className="p-3 bg-brand-accent/10 rounded-lg text-brand-accent">
                    <AlertCircle size={20} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <Clock size={16} className="mr-1" />
                  <span>Actie vereist</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm">Conversie Rate</p>
                    <h3 className="text-2xl font-bold text-brand-dark mt-1">{stats.conversionRate}%</h3>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg text-green-600">
                    <CheckCircle size={20} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <ArrowUpRight size={16} className="mr-1" />
                  <span>+2.4%</span>
                  <span className="text-gray-400 ml-1">kwartaal</span>
                </div>
              </div>
            </div>

            {/* Recent Activity / Simplified List for Dash */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-brand-dark">Recente Leads</h3>
                <button onClick={() => setActiveTab('leads')} className="text-brand-accent text-sm hover:underline">Bekijk alles</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                    <tr>
                      <th className="px-6 py-4 font-medium">Naam</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Datum</th>
                      <th className="px-6 py-4 font-medium text-right">Actie</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredLeads.slice(0, 5).map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-brand-dark">{lead.name}</div>
                          <div className="text-sm text-gray-500">{lead.project}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{lead.date}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => setSelectedLead(lead)} className="text-gray-400 hover:text-brand-accent">
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Zoeken naar naam, email of project..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                />
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                  className="px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-accent bg-white"
                >
                  <option value="all">Alle Status</option>
                  <option value="Nieuw">Nieuw</option>
                  <option value="Contact Gehad">Contact Gehad</option>
                  <option value="Offerte Verzonden">Offerte Verzonden</option>
                  <option value="Afgerond">Afgerond</option>
                </select>
                <button
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700"
                >
                  <Download size={20} />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                    <tr>
                      <th className="px-6 py-4 font-medium">Naam / Contact</th>
                      <th className="px-6 py-4 font-medium">Project</th>
                      <th className="px-6 py-4 font-medium">Status & Datum</th>
                      <th className="px-6 py-4 font-medium text-right">Acties</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-brand-dark">{lead.name}</div>
                          <div className="flex flex-col text-sm text-gray-500 mt-1 gap-1">
                            <span className="flex items-center gap-1"><Mail size={12} /> {lead.email}</span>
                            <span className="flex items-center gap-1"><Phone size={12} /> {lead.phone}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                          {lead.project}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                          <div className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                            <Clock size={12} /> {lead.date}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => setSelectedLead(lead)} className="p-2 text-gray-400 hover:text-brand-accent hover:bg-brand-accent/10 rounded-lg transition-colors">
                              <Eye size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50">
                  <span className="text-sm text-gray-500">
                    Pagina {currentPage} van {totalPages}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-white"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-white"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'chats' && (
          <div className="flex h-[calc(100vh-140px)] gap-6">
            {/* List */}
            <div className="w-1/3 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-100 font-bold text-gray-700">Recente gesprekken</div>
              <div className="flex-1 overflow-y-auto">
                {chatSessions.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">Geen gesprekken gevonden</div>
                ) : (
                  chatSessions.map(session => (
                    <button
                      key={session.id}
                      onClick={() => { setSelectedSession(session); setAnalysisResult(''); }}
                      className={`w-full text-left p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${selectedSession?.id === session.id ? 'bg-orange-50 border-l-4 border-l-brand-accent' : ''}`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-brand-dark">Bezoeker</span>
                        <span className="text-xs text-gray-400">{session.lastMessageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{session.preview}</p>
                      <div className="mt-2 flex gap-1">
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px]">{session.messages.length} berichten</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Detail */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              {selectedSession ? (
                <>
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div>
                      <h3 className="font-bold text-brand-dark">Gesprek details</h3>
                      <p className="text-xs text-gray-500">ID: {selectedSession.id} • {selectedSession.startTime.toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => handleAnalyzeChat(selectedSession)}
                      disabled={isAnalyzing}
                      className="flex items-center gap-2 bg-brand-accent hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
                    >
                      {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                      Analyseer met AI
                    </button>
                  </div>

                  <div className="flex-1 overflow-hidden flex">
                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
                      {selectedSession.messages.map(msg => (
                        <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-brand-accent text-white' : 'bg-gray-200 text-gray-600'}`}>
                            {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                          </div>
                          <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${msg.role === 'user' ? 'bg-brand-accent text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'}`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            <p className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                              {msg.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Analysis Panel (if result exists) */}
                    {analysisResult && (
                      <div className="w-80 border-l border-gray-200 bg-white overflow-y-auto p-6 shadow-xl">
                        <h4 className="font-bold text-brand-dark mb-4 flex items-center gap-2">
                          <Sparkles size={16} className="text-brand-accent" />
                          AI Analyse
                        </h4>
                        <div className="prose prose-sm prose-orange">
                          <div className="whitespace-pre-wrap text-gray-700 text-sm">{analysisResult}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                  <MessageCircle size={48} className="mb-4 opacity-20" />
                  <p>Selecteer een gesprek uit de lijst</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'pages' && (
          <div className="space-y-6">
            {/* Header & Create Action */}
            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Pagina Overzicht</h3>
                <p className="text-gray-500 text-sm">Beheer dynamische pagina's van uw website</p>
              </div>
              <button
                onClick={() => setIsCreatingPage(true)}
                className="flex items-center gap-2 px-4 py-2 bg-brand-accent hover:bg-orange-700 text-white rounded-lg transition-colors"
              >
                <FilePlus size={18} /> Nieuwe Pagina
              </button>
            </div>

            {/* Create Modal (Inline for simplicity) */}
            {isCreatingPage && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-brand-accent/30 bg-orange-50/10">
                <h4 className="font-bold text-gray-800 mb-4">Nieuwe Pagina Maken</h4>
                <form onSubmit={handleCreatePage} className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hoofdpagina (Optioneel - maak subpagina van...)</label>
                    <select
                      value={newPageParentId}
                      onChange={(e) => setNewPageParentId(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent outline-none"
                    >
                      <option value="">(Geen - dit is een hoofdpagina)</option>
                      {pages.filter(p => !p.parentId).map(p => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Titel</label>
                    <input
                      type="text"
                      value={newPageTitle}
                      onChange={(e) => {
                        setNewPageTitle(e.target.value);
                        // Auto-slug
                        setNewPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                      }}
                      placeholder="Bv. Zomeractie 2024"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Slug (URL)</label>
                    <div className="flex items-center">
                      <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-500 text-sm">/p/</span>
                      <input
                        type="text"
                        value={newPageSlug}
                        onChange={(e) => setNewPageSlug(e.target.value)}
                        placeholder="zomeractie-2024"
                        className="w-full px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-brand-accent outline-none"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => { setIsCreatingPage(false); setNewPageParentId(''); }}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      Annuleren
                    </button>
                    <button
                      type="submit"
                      disabled={!newPageTitle || !newPageSlug}
                      className="px-4 py-2 bg-brand-accent text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
                    >
                      Aanmaken
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {pages.length === 0 && staticPages.length === 0 ? (
                <div className="text-center py-12">
                  <FileText size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">Nog geen pagina's aangemaakt</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                      <tr>
                        <th className="px-6 py-4 font-medium">Pagina Naam</th>
                        <th className="px-6 py-4 font-medium">Type</th>
                        <th className="px-6 py-4 font-medium">URL</th>
                        <th className="px-6 py-4 font-medium">SEO Status</th>
                        <th className="px-6 py-4 font-medium text-right">Acties</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {/* Statische pagina's */}
                      {staticPages.map(staticPage => (
                        <tr key={staticPage.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div>
                                <div className="font-bold text-gray-800">{staticPage.title}</div>
                                <div className="text-xs text-gray-500">Statische pagina</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                              Statisch
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            <a href={staticPage.path} target="_blank" className="hover:text-brand-accent flex items-center gap-1 group">
                              {staticPage.path} <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span className="text-gray-400">Niet bewerkbaar</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <a
                                href={staticPage.path}
                                target="_blank"
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Bekijk pagina"
                              >
                                <Eye size={18} />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {/* Dynamische pagina's */}
                      {pages.map(page => {
                        const parent = pages.find(p => p.id === page.parentId);
                        return (
                          <tr key={page.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                {page.parentId && <div className="w-4 h-4 border-l border-b border-gray-300 rounded-bl-lg"></div>}
                                <div>
                                  <div className="font-bold text-gray-800">{page.title}</div>
                                  <div className="text-xs text-brand-accent uppercase font-bold tracking-wider">{page.status}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                                Dynamisch
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              <a href={`/p/${page.slug}`} target="_blank" className="hover:text-brand-accent flex items-center gap-1 group">
                                /p/{page.slug} <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                              </a>
                            </td>
                            <td className="px-6 py-4 text-sm">
                              {page.seo?.title ?
                                <span className="text-green-600 flex items-center gap-1"><Sparkles size={14} /> Geoptimaliseerd</span> :
                                <span className="text-gray-400">Niet ingesteld</span>
                              }
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleEditSEO(page)}
                                  className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                  title="SEO Instellingen"
                                >
                                  <Search size={18} />
                                </button>
                                <Link
                                  to={`/dashboard/editor/${page.id}`}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Bewerk in Editor"
                                >
                                  <Edit size={18} />
                                </Link>
                                <button
                                  onClick={() => handleDeletePage(page.id)}
                                  className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* SEO Modal */}
            {editingSEOPageId && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in duration-200">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <Search size={24} className="text-purple-600" />
                      SEO Optimalisatie
                    </h3>
                    <button onClick={() => setEditingSEOPageId(null)} className="text-gray-400 hover:text-gray-600">
                      <X size={24} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Meta Titel</label>
                      <input
                        type="text"
                        value={seoData.title}
                        onChange={(e) => setSeoData({ ...seoData, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent outline-none"
                        placeholder="Titel voor Google (max 60 tekens)"
                      />
                      <div className="text-xs text-right text-gray-400 mt-1">{seoData.title.length}/60</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Meta Beschrijving</label>
                      <textarea
                        value={seoData.description}
                        onChange={(e) => setSeoData({ ...seoData, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent outline-none h-24"
                        placeholder="Korte samenvatting voor in de zoekresultaten..."
                      />
                      <div className="text-xs text-right text-gray-400 mt-1">{seoData.description.length}/160</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
                      <input
                        type="text"
                        value={seoData.keywords}
                        onChange={(e) => setSeoData({ ...seoData, keywords: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent outline-none"
                        placeholder="renovatie, ramen, deuren..."
                      />
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg flex items-center justify-between">
                      <span className="text-sm text-purple-800 font-medium">Laat AI een voorstel doen</span>
                      <button
                        onClick={handleGenerateSEO}
                        disabled={isGeneratingSEO}
                        className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm disabled:opacity-50"
                      >
                        {isGeneratingSEO ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                        Auto-Generate
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-8">
                    <button onClick={() => setEditingSEOPageId(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                      Annuleren
                    </button>
                    <button onClick={handleSaveSEO} className="px-4 py-2 bg-brand-accent text-white rounded-lg hover:bg-orange-700">
                      Opslaan
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'media' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Media Bibliotheek</h3>
                <p className="text-gray-500 text-sm">Upload en beheer afbeeldingen voor uw website</p>
              </div>
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={mediaInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleMediaUpload}
                />
                <button
                  onClick={() => mediaInputRef.current?.click()}
                  disabled={isUploadingMedia}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-accent hover:bg-orange-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {isUploadingMedia ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />}
                  Foto Uploaden
                </button>
                <button
                  onClick={handleImportGCSPhotos}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  title="Importeer foto's van Google Cloud Storage"
                >
                  <Server size={18} />
                  Importeer GCS
                </button>
                <button
                  onClick={handleImportGCSFromURLs}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  title="Importeer foto's via URLs"
                >
                  <ExternalLink size={18} />
                  Importeer URLs
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {mediaItems.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">Nog geen media geupload</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {mediaItems.map(item => (
                    <div key={item.id} className="relative group border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                      <div className="aspect-square relative flex items-center justify-center overflow-hidden">
                        <img src={item.url} alt={item.name} className="object-cover w-full h-full" />
                      </div>
                      <div className="p-2 bg-white text-xs truncate font-medium border-t border-gray-100">
                        {item.name}
                      </div>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(item.url);
                            alert('URL gekopieerd!');
                          }}
                          className="p-1.5 bg-white text-gray-800 rounded hover:bg-gray-100"
                          title="Kopieer URL"
                        >
                          <ExternalLink size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteMedia(item.id)}
                          className="p-1.5 bg-white text-red-600 rounded hover:bg-red-50"
                          title="Verwijderen"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex gap-3 text-sm text-blue-800">
              <div className="shrink-0 pt-0.5"><FolderOpen size={18} /></div>
              <div>
                <strong>Tip:</strong> Klik op het kopieer-icoon (🔗) bij een foto om de link te kopiëren.
                Gebruik deze link vervolgens in de Pagina Editor bij het toevoegen van een afbeeldingsblok.
              </div>
            </div>
          </div>
        )}

        {activeTab === 'marketing' && (
          <div className="space-y-8">
            {/* Ad Gen */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
                  <Rocket size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Advertentie Generator</h3>
                  <p className="text-gray-500 text-sm">Genereer wervende teksten voor social media of Google Ads</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Waar gaat de advertentie over?</label>
                  <textarea
                    value={marketingTopic}
                    onChange={(e) => setMarketingTopic(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent outline-none h-32"
                    placeholder="Bijv. promotie voor isolatiewerken in de winter..."
                  />
                  <button
                    onClick={handleGenerateAd}
                    disabled={isGeneratingAd || !marketingTopic}
                    className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 bg-brand-dark text-white rounded-lg hover:bg-brand-accent transition-colors disabled:opacity-50"
                  >
                    {isGeneratingAd ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                    Genereer Tekst
                  </button>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h4 className="font-bold text-gray-800 mb-4">Resultaat</h4>
                  {generatedAd ? (
                    <div className="space-y-4">
                      <div>
                        <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Kop</div>
                        <div className="font-bold text-lg">{generatedAd.headline}</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Tekst</div>
                        <p className="text-gray-700">{generatedAd.body}</p>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Call to Action</div>
                        <div className="inline-block px-3 py-1 bg-brand-accent text-white rounded text-sm font-medium">
                          {generatedAd.cta}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-100">
                        <button
                          onClick={handleCreatePageFromAd}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
                        >
                          <FileText size={18} />
                          Pagina Maken met deze Content
                        </button>
                        <p className="text-xs text-center text-gray-400 mt-2">Maakt een nieuwe pagina met een Hero-sectie gevuld met deze tekst.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400 text-center py-8 italic">
                      Nog geen resultaat gegenereerd...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Image Prompt Gen */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                  <ImageIcon size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">AI Afbeelding Generator Help</h3>
                  <p className="text-gray-500 text-sm">Hulp bij het maken van de perfecte afbeelding met AI (bijv. Midjourney, DALL-E)</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Wat wil je zien op de afbeelding?</label>
                  <input
                    type="text"
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent outline-none"
                    placeholder="Bijv. een modern gerenoveerd huis in België met zonnepanelen"
                  />
                </div>
                <button
                  onClick={handleGenerateImagePrompt}
                  disabled={isGeneratingImage || !imagePrompt}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {isGeneratingImage ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                  Genereer Prompts
                </button>

                {generatedImagePrompt && (
                  <div className="mt-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-2">Jouw AI Prompt</h4>
                    <p className="text-gray-600 text-sm mb-4">Kopieer deze tekst en plak hem in een tool zoals Midjourney, DALL-E of Bing Image Creator.</p>
                    <div className="bg-white p-4 rounded border border-gray-300 font-mono text-sm text-gray-700 relative group">
                      {generatedImagePrompt}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(generatedImagePrompt);
                          alert('Gekopieerd!');
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Kopieer"
                      >
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === '3dbuilder' && (
          <ThreeDBuilder />
        )}

        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto space-y-8">

            {/* API Configuratie */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                  <Server size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">AI Model Provider</h3>
                  <p className="text-gray-500 text-sm">Kies welk AI model de chatbot aanstuurt</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Provider Selector */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { id: 'naga', label: 'Naga (GLM-4)', icon: '🐲' },
                    { id: 'huggingface', label: 'Hugging Face', icon: '🤗' },
                    { id: 'cloudflare', label: 'Cloudflare', icon: '☁️' },
                    { id: 'gemini', label: 'Gemini', icon: '✨' },
                    { id: 'siliconflow', label: 'SiliconFlow', icon: '🧠' },
                    { id: 'custom', label: 'Custom', icon: '⚙️' },
                  ].map((provider) => (
                    <button
                      key={provider.id}
                      onClick={() => setSettings({ ...settings, activeProvider: provider.id as AIProvider })}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${settings.activeProvider === provider.id
                        ? 'border-brand-accent bg-orange-50/50 ring-1 ring-brand-accent'
                        : 'border-gray-100 bg-gray-50/50 hover:border-gray-300'
                        }`}
                    >
                      <span className="text-2xl mb-2 block">{provider.icon}</span>
                      <span className={`font-bold block ${settings.activeProvider === provider.id ? 'text-brand-dark' : 'text-gray-600'}`}>
                        {provider.label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Dynamic Inputs based on Provider */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Cpu size={18} />
                    Configuratie: {settings.activeProvider.charAt(0).toUpperCase() + settings.activeProvider.slice(1)}
                  </h4>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                      <input
                        type="password"
                        value={settings.providers[settings.activeProvider]?.apiKey || ''}
                        onChange={(e) => {
                          const newProviders = { ...settings.providers };
                          newProviders[settings.activeProvider].apiKey = e.target.value;
                          setSettings({ ...settings, providers: newProviders });
                        }}
                        placeholder="sk-..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent outline-none bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Model ID</label>
                      {settings.activeProvider === 'siliconflow' ? (
                        <select
                          value={settings.providers.siliconflow.model}
                          onChange={(e) => {
                            const newProviders = { ...settings.providers };
                            newProviders.siliconflow.model = e.target.value;
                            setSettings({ ...settings, providers: newProviders });
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent outline-none bg-white"
                        >
                          <option value="nex-agi/DeepSeek-V3.1-Nex-N1">nex-agi/DeepSeek-V3.1-Nex-N1</option>
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={settings.providers[settings.activeProvider]?.model || ''}
                          onChange={(e) => {
                            const newProviders = { ...settings.providers };
                            newProviders[settings.activeProvider].model = e.target.value;
                            setSettings({ ...settings, providers: newProviders });
                          }}
                          placeholder="Model ID (bv. gpt-4, meta-llama/...)"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent outline-none bg-white"
                        />
                      )}
                    </div>

                    {settings.activeProvider === 'cloudflare' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Account ID</label>
                        <input
                          type="text"
                          value={settings.providers.cloudflare.accountId || ''}
                          onChange={(e) => {
                            const newProviders = { ...settings.providers };
                            newProviders.cloudflare.accountId = e.target.value;
                            setSettings({ ...settings, providers: newProviders });
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent outline-none bg-white"
                        />
                      </div>
                    )}

                    {(settings.activeProvider === 'custom' || settings.activeProvider === 'gemini') && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Base URL</label>
                        <input
                          type="text"
                          value={settings.providers[settings.activeProvider]?.baseUrl || ''}
                          onChange={(e) => {
                            const newProviders = { ...settings.providers };
                            newProviders[settings.activeProvider].baseUrl = e.target.value;
                            setSettings({ ...settings, providers: newProviders });
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent outline-none bg-white"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Chatbot Identiteit */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-brand-accent/10 text-brand-accent rounded-lg">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Chatbot Instellingen</h3>
                  <p className="text-gray-500 text-sm">Pas het uiterlijk en gedrag van de assistent aan</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Naam van de Assistent</label>
                  <input
                    type="text"
                    value={settings.botName}
                    onChange={(e) => setSettings({ ...settings, botName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-brand-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Model (Read-only)</label>
                  <input
                    type="text"
                    value={settings.providers[settings.activeProvider]?.model || 'Default'}
                    disabled
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Systeem Instructies (Prompt)</label>
                  <textarea
                    value={settings.systemPrompt}
                    onChange={(e) => setSettings({ ...settings, systemPrompt: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-brand-accent outline-none font-mono text-sm"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Kennisbank (RAG) */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                    <FileJson size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Kennisbank</h3>
                    <p className="text-gray-500 text-sm">Upload bestanden om de AI slimmer te maken</p>
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".txt,.md,.json,.csv,.js,.ts,.tsx,.pdf"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  <Plus size={18} />
                  Bestand toevoegen
                </button>
              </div>

              <div className="space-y-3">
                {settings.knowledgeBase.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                    <FileText size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">Nog geen bestanden in de kennisbank</p>
                    <p className="text-gray-400 text-sm mt-1">Upload tekstbestanden (.txt, .md) met bedrijfsinformatie</p>
                  </div>
                ) : (
                  settings.knowledgeBase.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-gray-100 rounded text-gray-600">
                          <FileText size={20} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{doc.name}</h4>
                          <p className="text-xs text-gray-500">
                            {doc.type} • {Math.round(doc.content.length / 1024 * 10) / 10} KB • {doc.uploadDate.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Save Button */}
            <div className="fixed bottom-8 right-8">
              <button
                onClick={handleSaveSettings}
                disabled={isSavingSettings}
                className="flex items-center gap-2 px-6 py-4 bg-brand-accent hover:bg-orange-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 font-bold text-lg disabled:opacity-70 disabled:scale-100"
              >
                {isSavingSettings ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  <Save size={24} />
                )}
                {isSavingSettings ? 'Opslaan...' : 'Wijzigingen Opslaan'}
              </button>
            </div>

          </div>
        )}
      </main>

      <LeadDetailModal />
    </div>
  );
};

export default AdminDashboard;
