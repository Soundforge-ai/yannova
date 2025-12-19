import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ContactCTA from './ContactCTA';
import WhatsAppButton from './WhatsAppButton';
import CookieConsent from './CookieConsent';
import Chatbot from './Chatbot';
import StructuredData from './StructuredData';
import SEO from './SEO';
import { Lead } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  onSubmitLead: (lead: Omit<Lead, 'id' | 'date' | 'status'>) => void;
  onAdminClick: () => void;
  showContactCTA?: boolean;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
}

// Scroll to top on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  onSubmitLead, 
  onAdminClick,
  showContactCTA = true,
  seo
}) => {
  return (
    <>
      <SEO {...seo} />
      <StructuredData />
      <ScrollToTop />
      {/* Skip to content link for accessibility */}
      <a 
        href="#main-content" 
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-brand-accent focus:text-white focus:px-4 focus:py-2 focus:rounded-md"
      >
        Ga naar hoofdinhoud
      </a>
      <Navbar />
      <main role="main" id="main-content">{children}</main>
      {showContactCTA && <ContactCTA onSubmitLead={onSubmitLead} />}
      <Footer onAdminClick={onAdminClick} />
      <Chatbot />
      <CookieConsent />
    </>
  );
};

export default Layout;
