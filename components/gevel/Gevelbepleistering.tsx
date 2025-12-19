import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Palette, CheckCircle, Shield, Home, Phone } from 'lucide-react';

const Gevelbepleistering: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-gradient-to-br from-brand-dark via-slate-800 to-brand-dark">
        <div className="absolute inset-0 bg-[url('/images/crepi-patterns.png')] opacity-10 bg-cover bg-center"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Gevelbepleistering
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed max-w-3xl mx-auto">
              Moderne crepi en pleisterwerk voor een strakke, duurzame gevelafwerking. 
              Bescherming en esthetiek in één.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/#contact"
                className="bg-brand-accent hover:bg-orange-700 text-white px-8 py-4 rounded-md font-bold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                Bekijk onze realisaties
                <ArrowRight size={20} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              Gevelbepleistering, ook wel crepi genoemd, is een moderne techniek waarbij een beschermende en decoratieve 
              pleisterlaag wordt aangebracht op uw gevel. Deze laag beschermt uw woning tegen weersinvloeden, vocht en 
              temperatuurschommelingen, terwijl het tegelijkertijd een strakke en moderne uitstraling geeft.
            </p>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mt-4">
              Crepi is ideaal voor zowel nieuwbouw als renovatieprojecten en kan worden gecombineerd met isolatie voor 
              optimale energiebesparing.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content with Image */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <img
                  src="https://www.yannovabouw.be/lovable-uploads/003a3c82-53d0-4c81-8d96-4ae5ad333f15.png"
                  alt="Professionele gevelbepleistering met crepi afwerking door Yannova"
                  className="w-full h-auto rounded-lg shadow-lg"
                  loading="lazy"
                />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-6">
                  Wat is gevelbepleistering?
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 text-lg leading-relaxed mb-4">
                    Gevelbepleistering geeft uw woning niet alleen een moderne uitstraling, maar biedt ook uitstekende 
                    bescherming tegen de elementen. Onze vakmensen werken met hoogwaardige materialen en jarenlange 
                    ervaring om het perfecte resultaat te bereiken.
                  </p>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    Of u nu kiest voor traditionele crepi, gefactureerde pleister of crepi met ingebouwde patronen, 
                    wij zorgen voor een afwerking die jarenlang mooi blijft.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Voordelen Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-12 text-center">
              Voordelen van gevelbepleistering
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  icon: Shield,
                  title: "Weerbestendig en duurzaam",
                  description: "Uitstekende bescherming tegen regen, wind en temperatuurschommelingen. Voorkomt vochtproblemen en vorstschade."
                },
                {
                  icon: Palette,
                  title: "Esthetische meerwaarde",
                  description: "Geef uw gevel een moderne, strakke uitstraling. Kies uit verschillende texturen en kleuren."
                },
                {
                  icon: Home,
                  title: "Onderhoudsvriendelijk",
                  description: "Waterafstotende eigenschappen zorgen ervoor dat uw gevel jarenlang mooi blijft zonder veel onderhoud."
                },
                {
                  icon: CheckCircle,
                  title: "Combineerbaar met isolatie",
                  description: "Perfect te combineren met buitengevelisolatie voor maximale energiebesparing en comfort."
                }
              ].map((benefit, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <benefit.icon className="text-brand-accent mt-1" size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-brand-dark mb-3">{benefit.title}</h3>
                    <p className="text-gray-700 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Toepassingen Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-8">
              Toepassingen en mogelijkheden
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Gevelbepleistering kan op verschillende manieren worden toegepast, afhankelijk van uw wensen en de staat van uw gevel:
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Traditionele crepi met verschillende korrelgroottes",
                  "Crepi met ingebouwde patronen (baksteenmotief)",
                  "Gefactureerde pleister voor een unieke textuur",
                  "Kleurrijke pleister in uw favoriete tint",
                  "Combinatie met isolatie voor optimale energiebesparing"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="text-brand-accent flex-shrink-0 mt-1" size={20} />
                    <span className="text-gray-700 text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-brand-dark text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Gevelbepleistering met Yannova?
            </h2>
            <p className="text-xl text-gray-300 mb-2">
              Wij nemen binnen één werkdag contact met u op.
            </p>
            <p className="text-lg text-gray-400 mb-8">
              Contacteer ons om uw plannen te bespreken. Yannova volgt uw gevelproject op van A tot Z.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/#contact"
                className="bg-brand-accent hover:bg-orange-700 text-white px-8 py-4 rounded-md font-bold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                Contacteer ons
                <ArrowRight size={20} />
              </a>
              <a
                href="tel:+32489960001"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-md font-bold text-lg transition-all flex items-center justify-center"
              >
                <Phone size={20} className="mr-2" />
                Bel Ons Direct
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gevelbepleistering;
