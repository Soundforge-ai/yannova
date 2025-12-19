import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { I18nProvider } from './contexts/I18nContext';
import { Lead } from './types';

// Lazy load components
const Hero = lazy(() => import('./components/Hero'));
const About = lazy(() => import('./components/About'));
const Services = lazy(() => import('./components/Services'));
const Approach = lazy(() => import('./components/Approach'));
const WhyUs = lazy(() => import('./components/WhyUs'));
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

// Lazy load gevel pages
const Gevel = lazy(() => import('./components/Gevel'));
const Gevelbepleistering = lazy(() => import('./components/gevel/Gevelbepleistering'));
const Gevelbescherming = lazy(() => import('./components/gevel/Gevelbescherming'));
const Gevelisolatie = lazy(() => import('./components/gevel/Gevelisolatie'));
const Steenstrips = lazy(() => import('./components/gevel/Steenstrips'));
const Gevelrenovatie = lazy(() => import('./components/gevel/Gevelrenovatie'));

// Lazy load dashboard pages
const EditorPage = lazy(() => import('./pages/dashboard/editor/EditorPageWrapper'));
const SiteView = lazy(() => import('./pages/SiteView'));
const JulesAssistantPage = lazy(() => import('./pages/JulesAssistant'));
const DynamicPageRenderer = lazy(() => import('./components/DynamicPageRenderer'));

const PageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-brand-light">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-gray-600">Laden...</p>
    </div>
  </div>
);

const INITIAL_LEADS: Lead[] = [
  { id: '1', name: 'Jan Peeters', email: 'jan.p@example.be', phone: '0478 12 34 56', project: 'Ramen vervangen', date: '2023-10-25', status: 'Nieuw' },
  { id: '2', name: 'Sofie Dubois', email: 's.dubois@example.com', phone: '0486 98 76 54', project: 'Gevelrenovatie Crepi', date: '2023-10-24', status: 'Offerte Verzonden' },
  { id: '3', name: 'Marc Vermeer', email: 'marc.vermeer@example.com', phone: '0495 55 66 77', project: 'Totaalrenovatie', date: '2023-10-22', status: 'Contact Gehad' },
];

const App: React.FC = () => {
  const [view, setView] = useState<'public' | 'admin'>('public');
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);

  const handleAddLead = (newLeadData: Omit<Lead, 'id' | 'date' | 'status'>) => {
    const newLead: Lead = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleDateString('nl-BE'),
      status: 'Nieuw',
      ...newLeadData,
    };
    setLeads([newLead, ...leads]);
  };

  const handleUpdateStatus = (id: string, newStatus: Lead['status']) => {
    setLeads(leads.map((lead) => (lead.id === id ? { ...lead, status: newStatus } : lead)));
  };

  // Admin route component wrapper
  const AdminRoute: React.FC = () => (
    <AdminDashboard leads={leads} onUpdateStatus={handleUpdateStatus} onLogout={() => window.location.href = '/'} />
  );

  if (view === 'admin') {
    return (
      <Suspense fallback={<PageLoader />}>
        <AdminDashboard leads={leads} onUpdateStatus={handleUpdateStatus} onLogout={() => setView('public')} />
      </Suspense>
    );
  }

  return (
    <ErrorBoundary>
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

                {/* Home */}
                <Route
                  path="/"
                  element={
                    <Layout onSubmitLead={handleAddLead} onAdminClick={() => window.location.href = '/admin'}>
                      <Hero />
                      <About />
                      <Services />
                      <Approach />
                      <WhyUs />
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
                      seo={{ title: 'Over Ons', description: 'Leer meer over Yannova, uw betrouwbare partner voor bouw en renovatie in België.' }}
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
                      seo={{ title: 'Diensten', description: 'Ontdek onze diensten: ramen en deuren, renovatie, isolatie en gevelwerken.' }}
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
                      seo={{ title: 'Crepi Info', description: 'Alles over crepi met ingebouwde patronen voor uw gevel.' }}
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
                      seo={{ title: 'Onze Aanpak', description: 'Van eerste contact tot oplevering: ontdek onze werkwijze.' }}
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
                      seo={{ title: 'Partners', description: 'Onze partners en leveranciers voor kwaliteitsmaterialen.' }}
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
                      seo={{ title: 'Contact', description: 'Neem contact op met Yannova voor een gratis offerte.' }}
                    >
                      <Contact />
                    </Layout>
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
                      seo={{ title: 'Gevelwerken', description: 'Professionele gevelwerken in België.' }}
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
                      seo={{ title: 'Gevelbepleistering', description: 'Professionele gevelbepleistering en crepi afwerking.' }}
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
                      seo={{ title: 'Gevelbescherming', description: 'Bescherm uw gevel tegen weersinvloeden.' }}
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
                      seo={{ title: 'Gevelisolatie', description: 'Bespaar energie met professionele gevelisolatie.' }}
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
                      seo={{ title: 'Steenstrips', description: 'Authentieke baksteenlook met steenstrips.' }}
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
                      seo={{ title: 'Gevelrenovatie', description: 'Complete gevelrenovatie van A tot Z.' }}
                    >
                      <Gevelrenovatie />
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
    </ErrorBoundary>
  );
};

export default App;
