import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { I18nProvider } from './contexts/I18nContext';
import { AuthProvider } from './contexts/AuthContext';
import { Lead } from './types';
import { TESTIMONIALS } from './constants';
import { getLeads, createLead, updateLeadStatus, deleteLead } from './lib/supabase/leads';

// Lazy load components
const Hero = lazy(() => import('./components/Hero'));
const About = lazy(() => import('./components/About'));
const Services = lazy(() => import('./components/Services'));
const Approach = lazy(() => import('./components/Approach'));
const WhyUs = lazy(() => import('./components/WhyUs'));
const TestimonialsCarousel = lazy(() => import('./components/TestimonialsCarousel'));
const QuoteCalculator = lazy(() => import('./components/QuoteCalculator'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const NotFound = lazy(() => import('./components/NotFound'));

// Lazy load pages
const OverOns = lazy(() => import('./pages/OverOns'));
const Diensten = lazy(() => import('./pages/Diensten'));
const CrepiInfoPage = lazy(() => import('./pages/CrepiInfo'));
const Aanpak = lazy(() => import('./pages/Aanpak'));
const Partners = lazy(() => import('./pages/Partners'));
const Contact = lazy(() => import('./pages/Contact'));
const Posts = lazy(() => import('./pages/Posts'));
const Post = lazy(() => import('./pages/Post'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Showroom = lazy(() => import('./components/Showroom'));

// Lazy load gevel pages
const Gevel = lazy(() => import('./components/Gevel'));
const Gevelbepleistering = lazy(() => import('./components/gevel/Gevelbepleistering'));
const Gevelbescherming = lazy(() => import('./components/gevel/Gevelbescherming'));
const Gevelisolatie = lazy(() => import('./components/gevel/Gevelisolatie'));
const Steenstrips = lazy(() => import('./components/gevel/Steenstrips'));
const Gevelrenovatie = lazy(() => import('./components/gevel/Gevelrenovatie'));

// Nieuwe hoofdpagina's
const RamenDeuren = lazy(() => import('./pages/RamenDeuren'));
const Tuinaanleg = lazy(() => import('./pages/Tuinaanleg'));
const Renovatie = lazy(() => import('./pages/Renovatie'));

// Lazy load dashboard pages
const EditorPage = lazy(() => import('./pages/dashboard/editor/EditorPageWrapper'));
const SiteView = lazy(() => import('./pages/SiteView'));
const JulesAssistantPage = lazy(() => import('./pages/JulesAssistant'));
const DynamicPageRenderer = lazy(() => import('./components/DynamicPageRenderer'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const SEODashboardPage = lazy(() => import('./pages/SEODashboard'));
const PageManagerPage = lazy(() => import('./pages/admin/PageManagerPage'));

const PageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-brand-light">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-gray-600">Laden...</p>
    </div>
  </div>
);

const App: React.FC = () => {
  const [view, setView] = useState<'public' | 'admin'>('public');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);

  // Haal leads op bij het laden van de app
  useEffect(() => {
    const loadLeads = async () => {
      try {
        setIsLoadingLeads(true);
        const fetchedLeads = await getLeads();
        setLeads(fetchedLeads);
      } catch (error) {
        console.error('Error loading leads:', error);
        // Fallback naar lege array bij fout
        setLeads([]);
      } finally {
        setIsLoadingLeads(false);
      }
    };

    loadLeads();
  }, []);

  const handleAddLead = async (newLeadData: Omit<Lead, 'id' | 'date' | 'status'>) => {
    try {
      const newLead = await createLead(newLeadData);
      setLeads([newLead, ...leads]);
    } catch (error) {
      console.error('Error creating lead:', error);
      // Toon foutmelding aan gebruiker (kan later worden toegevoegd)
      alert('Er is een fout opgetreden bij het opslaan van de lead. Probeer het opnieuw.');
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: Lead['status']) => {
    try {
      const updatedLead = await updateLeadStatus(id, newStatus);
      setLeads(leads.map((lead) => (lead.id === id ? updatedLead : lead)));
    } catch (error) {
      console.error('Error updating lead status:', error);
      alert('Er is een fout opgetreden bij het updaten van de lead. Probeer het opnieuw.');
    }
  };

  const handleDeleteLead = async (id: string) => {
    try {
      await deleteLead(id);
      setLeads(leads.filter((lead) => lead.id !== id));
    } catch (error) {
      console.error('Error deleting lead:', error);
      alert('Er is een fout opgetreden bij het verwijderen van de lead. Probeer het opnieuw.');
    }
  };

  // Admin route component wrapper
  const AdminRoute: React.FC = () => (
    <AdminDashboard leads={leads} onUpdateStatus={handleUpdateStatus} onDeleteLead={handleDeleteLead} onLogout={() => window.location.href = '/'} />
  );

  if (view === 'admin') {
    return (
      <Suspense fallback={<PageLoader />}>
        <AdminDashboard leads={leads} onUpdateStatus={handleUpdateStatus} onDeleteLead={handleDeleteLead} onLogout={() => setView('public')} />
      </Suspense>
    );
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <I18nProvider>
          <Router>
            <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-orange-200 selection:text-orange-900">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Admin Route - Direct URL access */}
                  <Route
                    path="/admin"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <AdminRoute />
                      </Suspense>
                    }
                  />

                  {/* Admin Pages Route */}
                  <Route
                    path="/admin/pages"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <PageManagerPage />
                      </Suspense>
                    }
                  />

                  {/* Home */}
                  <Route
                    path="/"
                    element={
                      <Layout onSubmitLead={handleAddLead} onAdminClick={() => window.location.href = '/admin'}>
                        <Hero />
                        <About />
                        <Services />
                        <QuoteCalculator />
                        <Approach />
                        <WhyUs />
                        <TestimonialsCarousel testimonials={TESTIMONIALS} />
                      </Layout>
                    }
                  />

                  {/* Main Pages */}
                  <Route
                    path="/over-ons"
                    element={
                      <Layout
                        onSubmitLead={handleAddLead}
                        onAdminClick={() => window.location.href = '/admin'}
                        seo={{
                          title: 'Over Ons - Bouwbedrijf Keerbergen, Mechelen, Zoersel',
                          description: 'Leer meer over Yannova Bouw, uw betrouwbare partner voor ramen en deuren, renovatie en crepi in Keerbergen, Mechelen, Zoersel en omgeving. 15+ jaar ervaring.',
                          keywords: 'Yannova Bouw, bouwbedrijf Keerbergen, aannemer Mechelen, renovatie Zoersel, over ons'
                        }}
                      >
                        <OverOns />
                      </Layout>
                    }
                  />
                  <Route
                    path="/diensten"
                    element={
                      <Layout
                        onSubmitLead={handleAddLead}
                        onAdminClick={() => window.location.href = '/admin'}
                        seo={{
                          title: 'Diensten - Ramen en Deuren, Renovatie, Isolatie, Crepi',
                          description: 'Ontdek onze diensten: ramen en deuren plaatsen, totaalrenovatie, isolatiewerken en crepi gevelafwerking in Keerbergen, Mechelen, Zoersel, Putte en omgeving.',
                          keywords: 'ramen en deuren Keerbergen, renovatie Mechelen, isolatie Zoersel, crepi Putte, diensten bouwbedrijf'
                        }}
                      >
                        <Diensten />
                      </Layout>
                    }
                  />
                  <Route
                    path="/crepi-info"
                    element={
                      <Layout
                        onSubmitLead={handleAddLead}
                        onAdminClick={() => window.location.href = '/admin'}
                        seo={{
                          title: 'Crepi Info - Gevelbepleistering Keerbergen, Mechelen',
                          description: 'Alles over crepi en gevelbepleistering. Professionele crepi afwerking in Keerbergen, Mechelen, Zoersel en omgeving. Vraag gratis advies aan.',
                          keywords: 'crepi Keerbergen, crepi Mechelen, gevelbepleistering Zoersel, crepi info, crepi patronen'
                        }}
                      >
                        <CrepiInfoPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/aanpak"
                    element={
                      <Layout
                        onSubmitLead={handleAddLead}
                        onAdminClick={() => window.location.href = '/admin'}
                        seo={{
                          title: 'Onze Aanpak - Van Offerte tot Oplevering',
                          description: 'Van eerste contact tot oplevering: ontdek de werkwijze van Yannova Bouw. Transparante communicatie en vakkundige uitvoering in Keerbergen en omgeving.',
                          keywords: 'werkwijze bouwbedrijf, aanpak renovatie, offerte aanvragen, Yannova aanpak'
                        }}
                      >
                        <Aanpak />
                      </Layout>
                    }
                  />
                  <Route
                    path="/partners"
                    element={
                      <Layout
                        onSubmitLead={handleAddLead}
                        onAdminClick={() => window.location.href = '/admin'}
                        seo={{
                          title: 'Partners - Kwaliteitsleveranciers Ramen en Materialen',
                          description: 'Onze partners en leveranciers voor hoogwaardige ramen, deuren en bouwmaterialen. Yannova werkt alleen met de beste merken.',
                          keywords: 'partners bouwbedrijf, leveranciers ramen, kwaliteitsmaterialen, Yannova partners'
                        }}
                      >
                        <Partners />
                      </Layout>
                    }
                  />
                  <Route
                    path="/contact"
                    element={
                      <Layout
                        onSubmitLead={handleAddLead}
                        onAdminClick={() => window.location.href = '/admin'}
                        showContactCTA={false}
                        seo={{
                          title: 'Contact - Gratis Offerte Aanvragen Keerbergen, Mechelen',
                          description: 'Neem contact op met Yannova Bouw voor een gratis offerte. Actief in Keerbergen, Mechelen, Zoersel, Putte en heel de provincie Antwerpen. Bel of mail ons!',
                          keywords: 'contact Yannova, gratis offerte, offerte ramen en deuren, contact bouwbedrijf Keerbergen'
                        }}
                      >
                        <Contact />
                      </Layout>
                    }
                  />

                  {/* Portfolio */}
                  <Route
                    path="/portfolio"
                    element={
                      <Layout
                        onSubmitLead={handleAddLead}
                        onAdminClick={() => window.location.href = '/admin'}
                        seo={{
                          title: 'Portfolio - Projecten Ramen, Renovatie, Crepi',
                          description: 'Bekijk onze afgeronde projecten: ramen en deuren, renovaties en crepi gevelwerken in Keerbergen, Mechelen, Zoersel en omgeving.',
                          keywords: 'portfolio bouwbedrijf, projecten ramen en deuren, renovatie projecten, crepi voorbeelden'
                        }}
                      >
                        <Portfolio />
                      </Layout>
                    }
                  />

                  {/* Showroom - 3D Voordeuren */}
                  <Route
                    path="/showroom"
                    element={
                      <Layout
                        onSubmitLead={handleAddLead}
                        onAdminClick={() => window.location.href = '/admin'}
                        seo={{
                          title: 'Showroom - Bekijk Voordeuren in 3D met AR',
                          description: 'Virtuele showroom met 3D voordeuren. Draai, zoom en bekijk elke deur vanuit alle hoeken. Gebruik AR om de deur in uw woning te projecteren.',
                          keywords: 'voordeuren 3D, virtuele showroom, AR deuren bekijken, aluminium voordeur'
                        }}
                      >
                        <Showroom />
                      </Layout>
                    }
                  />

                  {/* Auth Callback */}
                  <Route
                    path="/auth/callback"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <AuthCallback />
                      </Suspense>
                    }
                  />

                  {/* Jules Assistant */}
                  <Route
                    path="/jules"
                    element={
                      <Layout
                        onSubmitLead={handleAddLead}
                        onAdminClick={() => window.location.href = '/admin'}
                        seo={{ title: 'Jules AI Assistant', description: 'AI-powered code generatie en automatisering met Jules.' }}
                      >
                        <JulesAssistantPage />
                      </Layout>
                    }
                  />

                  {/* SEO Dashboard */}
                  <Route
                    path="/seo"
                    element={
                      <Layout
                        onSubmitLead={handleAddLead}
                        onAdminClick={() => window.location.href = '/admin'}
                        seo={{ title: 'SEO Dashboard', description: 'AI-powered SEO optimalisatie voor uw website.' }}
                      >
                        <SEODashboardPage />
                      </Layout>
                    }
                  />

                  {/* Posts */}
                  <Route
                    path="/posts"
                    element={
                      <Layout
                        onSubmitLead={handleAddLead}
                        onAdminClick={() => window.location.href = '/admin'}
                        seo={{ title: 'Posts', description: 'Blog posts and articles.' }}
                      >
                        <Posts />
                      </Layout>
                    }
                  />
                  <Route
                    path="/posts/:slug"
                    element={
                      <Layout
                        onSubmitLead={handleAddLead}
                        onAdminClick={() => window.location.href = '/admin'}
                        seo={{ title: 'Post', description: 'Blog post.' }}
                      >
                        <Post />
                      </Layout>
                    }
                  />

                  {/* Gevel Pages */}
                  <Route
                    path="/gevel"
                    element={
                      <Layout
                        onSubmitLead={handleAddLead}
                        onAdminClick={() => window.location.href = '/admin'}
                        seo={{
                          title: 'Gevelwerken Keerbergen, Mechelen, Zoersel',
                          description: 'Professionele gevelwerken in Keerbergen, Mechelen, Zoersel en omgeving. Gevelbepleistering, gevelisolatie, crepi en steenstrips. Gratis offerte!',
                          keywords: 'gevelwerken Keerbergen, gevel Mechelen, gevelrenovatie Zoersel, crepi gevel, gevelisolatie'
                        }}
                      >
                        <Gevel />
                      </Layout>
                    }
                  />
                  <Route
                    path="/gevel/gevelbepleistering"
                    element={
                      <Layout
                        onSubmitLead={handleAddLead}
                        onAdminClick={() => window.location.href = '/admin'}
                        seo={{
                          title: 'Gevelbepleistering Keerbergen, Mechelen - Crepi Specialist',
                          description: 'Professionele gevelbepleistering en crepi afwerking in Keerbergen, Mechelen, Zoersel en omgeving. Diverse structuren en kleuren. Vraag gratis offerte aan.',
                          keywords: 'gevelbepleistering Keerbergen, crepi Mechelen, gevelpleister Zoersel, crepi afwerking, gevelbepleistering prijs'
                        }}
                      >
                        <Gevelbepleistering />
                      </Layout>
                    }
                  />
                  <Route
                    path="/gevel/gevelbescherming"
                    element={
                      <Layout
                        onSubmitLead={handleAddLead}
                        onAdminClick={() => window.location.href = '/admin'}
                        seo={{
                          title: 'Gevelbescherming Keerbergen, Mechelen - Vochtwerend',
                          description: 'Bescherm uw gevel tegen vocht en weersinvloeden. Gevelbescherming in Keerbergen, Mechelen, Zoersel. Hydrofuge behandeling en coating.',
                          keywords: 'gevelbescherming Keerbergen, gevel impregneren Mechelen, vochtbestrijding gevel, hydrofuge behandeling'
                        }}
                      >
                        <Gevelbescherming />
                      </Layout>
                    }
                  />
                  <Route
                    path="/gevel/gevelisolatie"
                    element={
                      <Layout
                        onSubmitLead={handleAddLead}
                        onAdminClick={() => window.location.href = '/admin'}
                        seo={{
                          title: 'Gevelisolatie Keerbergen, Mechelen - Bespaar Energie',
                          description: 'Bespaar energie met professionele gevelisolatie in Keerbergen, Mechelen, Zoersel. Buitengevelisolatie met EPS en crepi afwerking. Tot 30% energiebesparing.',
                          keywords: 'gevelisolatie Keerbergen, buitenisolatie Mechelen, EPS isolatie gevel, gevelisolatie prijs, energiebesparing'
                        }}
                      >
                        <Gevelisolatie />
                      </Layout>
                    }
                  />
                  <Route
                    path="/gevel/steenstrips"
                    element={
                      <Layout
                        onSubmitLead={handleAddLead}
                        onAdminClick={() => window.location.href = '/admin'}
                        seo={{
                          title: 'Steenstrips Keerbergen, Mechelen - Baksteenlook Gevel',
                          description: 'Authentieke baksteenlook met steenstrips in Keerbergen, Mechelen, Zoersel. Diverse kleuren en structuren. Duurzaam en onderhoudsvriendelijk.',
                          keywords: 'steenstrips Keerbergen, steenstrips gevel Mechelen, baksteenstrips, gevelbekleden steenstrips'
                        }}
                      >
                        <Steenstrips />
                      </Layout>
                    }
                  />
                  <Route
                    path="/gevel/gevelrenovatie"
                    element={
                      <Layout
                        onSubmitLead={handleAddLead}
                        onAdminClick={() => window.location.href = '/admin'}
                        seo={{
                          title: 'Gevelrenovatie Keerbergen, Mechelen - Complete Renovatie',
                          description: 'Complete gevelrenovatie van A tot Z in Keerbergen, Mechelen, Zoersel en omgeving. Van vochtbehandeling tot nieuwe crepi afwerking.',
                          keywords: 'gevelrenovatie Keerbergen, gevel renoveren Mechelen, gevel opknappen, gevelrenovatie prijs'
                        }}
                      >
                        <Gevelrenovatie />
                      </Layout>
                    }
                  />

                  {/* Nieuwe Hoofdcategorieën */}
                  <Route
                    path="/ramen-deuren"
                    element={
                      <Layout
                        onSubmitLead={handleAddLead}
                        onAdminClick={() => window.location.href = '/admin'}
                        seo={{
                          title: 'Ramen en Deuren Keerbergen - PVC & Aluminium',
                          description: 'Topkwaliteit ramen en deuren in PVC en Aluminium. Plaatsing door eigen vakmensen in Keerbergen, Mechelen, Zoersel. 10 jaar garantie.',
                          keywords: 'ramen en deuren Keerbergen, PVC ramen, aluminium ramen, voordeuren, schuiframen'
                        }}
                      >
                        <RamenDeuren />
                      </Layout>
                    }
                  />
                  <Route
                    path="/tuinaanleg"
                    element={
                      <Layout
                        onSubmitLead={handleAddLead}
                        onAdminClick={() => window.location.href = '/admin'}
                        seo={{
                          title: 'Tuinaanleg & Opritten Keerbergen, Mechelen',
                          description: 'Professioneel tuinontwerp en tuinaanleg. Opritten, terrassen, afsluitingen en totaalprojecten in regio Keerbergen en Mechelen.',
                          keywords: 'tuinaanleg Keerbergen, opritten, klinkers leggen, terras aanleggen, tuinarchitect'
                        }}
                      >
                        <Tuinaanleg />
                      </Layout>
                    }
                  />
                  <Route
                    path="/renovatie"
                    element={
                      <Layout
                        onSubmitLead={handleAddLead}
                        onAdminClick={() => window.location.href = '/admin'}
                        seo={{
                          title: 'Totaalrenovatie & Badkamers Keerbergen',
                          description: 'Uw partner voor totaalrenovatie, badkamerrenovatie en gyprocwerken in Keerbergen, Mechelen en omgeving. Eén aanspreekpunt voor uw verbouwing.',
                          keywords: 'totaalrenovatie Keerbergen, badkamer renovatie, gyprocwerken, zolderinrichting, aannemer renovatie'
                        }}
                      >
                        <Renovatie />
                      </Layout>
                    }
                  />

                  {/* Dashboard & Editor Routes */}
                  <Route
                    path="/dashboard/editor/:siteId"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <EditorPage />
                      </Suspense>
                    }
                  />

                  {/* Public Site View */}
                  <Route
                    path="/site/:siteId"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <SiteView />
                      </Suspense>
                    }
                  />

                  {/* Dynamic Pages */}
                  <Route
                    path="/p/:slug"
                    element={
                      <Layout
                        onSubmitLead={handleAddLead}
                        onAdminClick={() => window.location.href = '/admin'}
                      >
                        <DynamicPageRenderer />
                      </Layout>
                    }
                  />

                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </div>
          </Router>
        </I18nProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;