import React from 'react';
import { ArrowRight } from 'lucide-react';
import { HERO_CONTENT } from '../constants';

const Hero: React.FC = () => {
  return (
    <section 
      id="hero" 
      className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden"
      aria-label="Welkom bij Yannova"
    >
      {/* Background Video with Overlay */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          aria-hidden="true"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
          {/* Fallback image if video doesn't load */}
          <img
            src={HERO_CONTENT.image}
            alt=""
            className="w-full h-full object-cover"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 z-10 relative pt-20">
        <div className="max-w-3xl">
          <div className="inline-block px-3 py-1 bg-brand-accent/20 border border-brand-accent/30 rounded-full mb-6 backdrop-blur-sm">
            <span className="text-orange-400 font-medium text-sm tracking-wide uppercase">Uw Partner in Bouw & Renovatie</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            {HERO_CONTENT.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-xl leading-relaxed">
            {HERO_CONTENT.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#contact"
              className="bg-brand-accent hover:bg-orange-700 text-white px-8 py-4 rounded-md font-bold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              {HERO_CONTENT.cta}
              <ArrowRight size={20} />
            </a>
            <a
              href="#services"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-md font-bold text-lg transition-all flex items-center justify-center"
            >
              Ontdek onze diensten
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;