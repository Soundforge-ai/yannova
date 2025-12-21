import React from 'react';
import { Link } from 'react-router-dom';
import { COMPANY_NAME } from '../constants';
import { Lock, Facebook, Instagram, Linkedin } from 'lucide-react';

interface FooterProps {
  onAdminClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-dark text-slate-300 py-12 border-t border-slate-800">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="text-2xl font-bold text-white mb-4 inline-block">
              {COMPANY_NAME}<span className="text-brand-accent">.</span>
            </Link>
            <p className="text-sm leading-relaxed mb-4">
              Uw lokale bouwpartner in België. Gespecialiseerd in ramen en deuren, totaalrenovaties, isolatiewerken en crepi gevelafwerking.
            </p>
            <div className="flex gap-3 mt-6">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Volg ons op Facebook"
                className="w-10 h-10 bg-slate-700 rounded-full hover:bg-brand-accent transition-colors flex items-center justify-center"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Volg ons op Instagram"
                className="w-10 h-10 bg-slate-700 rounded-full hover:bg-brand-accent transition-colors flex items-center justify-center"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Volg ons op LinkedIn"
                className="w-10 h-10 bg-slate-700 rounded-full hover:bg-brand-accent transition-colors flex items-center justify-center"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Pagina's */}
          <div>
            <h4 className="text-white font-semibold mb-4">Pagina's</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/over-ons" className="hover:text-brand-accent transition-colors">Over Ons</Link></li>
              <li><Link to="/diensten" className="hover:text-brand-accent transition-colors">Diensten</Link></li>
              <li><Link to="/crepi-info" className="hover:text-brand-accent transition-colors">Crepi Info</Link></li>
              <li><Link to="/aanpak" className="hover:text-brand-accent transition-colors">Aanpak</Link></li>
              <li><Link to="/partners" className="hover:text-brand-accent transition-colors">Partners</Link></li>
              <li><Link to="/contact" className="hover:text-brand-accent transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Column 3: Gevelwerken */}
          <div>
            <h4 className="text-white font-semibold mb-4">Gevelwerken</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/gevel/gevelbepleistering" className="hover:text-brand-accent transition-colors">Gevelbepleistering</Link></li>
              <li><Link to="/gevel/gevelbescherming" className="hover:text-brand-accent transition-colors">Gevelbescherming</Link></li>
              <li><Link to="/gevel/gevelisolatie" className="hover:text-brand-accent transition-colors">Gevelisolatie</Link></li>
              <li><Link to="/gevel/steenstrips" className="hover:text-brand-accent transition-colors">Steenstrips</Link></li>
              <li><Link to="/gevel/gevelrenovatie" className="hover:text-brand-accent transition-colors">Gevelrenovatie</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact & Regio */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="tel:+32489960001" className="hover:text-brand-accent transition-colors">+32 489 96 00 01</a></li>
              <li><a href="mailto:info@yannova.be" className="hover:text-brand-accent transition-colors">info@yannova.be</a></li>
            </ul>
            <h4 className="text-white font-semibold mb-2 mt-6">Dienstenregio</h4>
            <p className="text-sm">Actief in heel Vlaanderen en Brussel.</p>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>&copy; {currentYear} {COMPANY_NAME}. Alle rechten voorbehouden.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <a href="/privacy" className="hover:text-brand-accent transition-colors">Privacybeleid</a>
            <a href="/cookies" className="hover:text-brand-accent transition-colors">Cookiebeleid</a>
            <button 
              onClick={onAdminClick}
              className="flex items-center gap-1 opacity-50 hover:opacity-100 hover:text-brand-accent transition-all"
              aria-label="Admin login"
            >
              <Lock size={12} />
              Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
