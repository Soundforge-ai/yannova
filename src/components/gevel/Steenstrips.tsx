import React from 'react';
import { ArrowRight, Layers, CheckCircle, Home, Palette, Shield, Phone } from 'lucide-react';

const Steenstrips: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-gradient-to-br from-brand-dark via-slate-800 to-brand-dark">
        <div className="absolute inset-0 bg-[url('/images/crepi-patterns.png')] opacity-10 bg-cover bg-center"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Steenstrips
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed max-w-3xl mx-auto">
              Authentieke baksteenlook met uitstekende isolatie-eigenschappen. Perfect voor renovatie en nieuwbouw 
              met een warme, traditionele uitstraling.
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
              Steenstrips zijn dunne, natuurlijke steenplaten die worden aangebracht op uw gevel om een authentieke 
              baksteen- of natuursteenlook te creëren. Ze worden vaak gebruikt in combinatie met isolatie en bieden 
              een perfecte balans tussen esthetiek en functionaliteit.
            </p>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mt-4">
              Steenstrips zijn ideaal voor renovatieprojecten waar u de uitstraling van traditioneel metselwerk wilt 
              behouden of creëren, zonder de kosten en complexiteit van volledig nieuw metselwerk.
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
                  src="https://www.yannovabouw.be/lovable-uploads/16676485-bd4d-49a4-a5a6-89e07254fa23.png"
                  alt="Steenstrips gevelafwerking met authentieke baksteenlook door Yannova"
                  className="w-full h-auto rounded-lg shadow-lg"
                  loading="lazy"
                />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-6">
                  Wat zijn steenstrips?
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 text-lg leading-relaxed mb-4">
                    Steenstrips geven uw gevel de warme, authentieke uitstraling van traditioneel metselwerk, maar 
                    met alle voordelen van moderne bouwtechnieken. Ze zijn perfect te combineren met isolatie voor 
                    optimale energiebesparing.
                  </p>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    Kies uit verschillende steensoorten, kleuren en formaten om het perfecte uiterlijk voor uw woning te creëren.
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
              Voordelen van steenstrips
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  icon: Home,
                  title: "Authentieke uitstraling",
                  description: "Krijg de warme, authentieke look van traditioneel metselwerk zonder de hoge kosten van volledig nieuw metselwerk."
                },
                {
                  icon: Shield,
                  title: "Uitstekende isolatie",
                  description: "Steenstrips worden vaak gecombineerd met isolatiemateriaal voor optimale energiebesparing en comfort."
                },
                {
                  icon: Palette,
                  title: "Verschillende stijlen",
                  description: "Kies uit verschillende steensoorten, kleuren en formaten om het perfecte uiterlijk voor uw woning te creëren."
                },
                {
                  icon: CheckCircle,
                  title: "Duurzaam en onderhoudsvriendelijk",
                  description: "Natuurlijke steen is extreem duurzaam en vereist minimaal onderhoud, waardoor uw gevel jarenlang mooi blijft."
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
                Steenstrips kunnen op verschillende manieren worden toegepast:
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Renovatie van bestaande gevels voor een nieuwe, moderne uitstraling",
                  "Nieuwbouwprojecten waar u een klassieke baksteenlook wilt",
                  "Combinatie met buitengevelisolatie voor optimale energiebesparing",
                  "Gedeeltelijke toepassing voor accentwanden of geveldelen",
                  "Verschillende voegkleuren en -stijlen voor een uniek resultaat"
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
              Steenstrips met Yannova?
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

export default Steenstrips;
