import React from 'react';
import { ArrowRight, Home, CheckCircle, Hammer, Shield, Layers, Phone } from 'lucide-react';

const Gevelrenovatie: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-gradient-to-br from-brand-dark via-slate-800 to-brand-dark">
        <div className="absolute inset-0 bg-[url('/images/crepi-patterns.png')] opacity-10 bg-cover bg-center"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Gevelrenovatie
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed max-w-3xl mx-auto">
              Complete gevelrenovatie van ruwbouw tot afwerking. Wij transformeren uw gevel met garantie op alle uitgevoerde werken.
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
              Een gevelrenovatie is een complete transformatie van uw gevel, waarbij we alle aspecten aanpakken: 
              van de basisstructuur tot de uiteindelijke afwerking. Wij zijn uw enige aanspreekpunt voor het hele traject, 
              van planning tot oplevering.
            </p>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mt-4">
              Of uw gevel nu verouderd is, schade heeft opgelopen, of u gewoon een nieuwe uitstraling wilt, wij zorgen 
              ervoor dat uw gevel weer als nieuw wordt en jarenlang beschermd blijft.
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
                  src="https://www.yannovabouw.be/lovable-uploads/c042e299-3e07-4212-b6a2-5c6297e61d69.png"
                  alt="Complete gevelrenovatie van ruwbouw tot afwerking door Yannova"
                  className="w-full h-auto rounded-lg shadow-lg"
                  loading="lazy"
                />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-6">
                  Complete gevelrenovatie
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 text-lg leading-relaxed mb-4">
                    Van oude, verweerde gevel tot moderne, energiezuinige gevel met garantie. Ons team van experts 
                    coördineert het volledige traject met een heldere planning en één aanspreekpunt.
                  </p>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    Elke fase strak getimed en naadloos afgestemd op de vorige. Zo gaat het vooruit en geniet u binnen 
                    de afgesproken deadline van een afgewerkt project.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Onze aanpak Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-12 text-center">
              Onze aanpak bij gevelrenovatie
            </h2>
            <div className="space-y-6">
              {[
                {
                  step: "1",
                  title: "Inspectie en diagnose",
                  description: "We inspecteren uw gevel grondig en stellen een gedetailleerd plan op voor de renovatie."
                },
                {
                  step: "2",
                  title: "Voorbereiding en reiniging",
                  description: "Uw gevel wordt gereinigd en voorbereid. Eventuele schade wordt hersteld voordat we verder gaan."
                },
                {
                  step: "3",
                  title: "Isolatie en structuur",
                  description: "Indien nodig wordt isolatie aangebracht en de structuur versterkt voor optimale bescherming."
                },
                {
                  step: "4",
                  title: "Afwerking",
                  description: "De gevel wordt afgewerkt met crepi, steenstrips of andere gekozen materialen voor een perfect resultaat."
                },
                {
                  step: "5",
                  title: "Oplevering en garantie",
                  description: "We leveren alles netjes op en controleren samen met u het eindresultaat. U krijgt uitgebreide garantie."
                }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-brand-accent text-white rounded-full flex items-center justify-center text-2xl font-bold">
                      {item.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-brand-dark mb-2">{item.title}</h3>
                    <p className="text-gray-700 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Wat kunnen we doen Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-8">
              Wat kunnen we voor u doen?
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {[
                {
                  icon: Hammer,
                  title: "Herstel van schade",
                  description: "Reparatie van scheuren, loszittende stenen en andere structurele problemen."
                },
                {
                  icon: Shield,
                  title: "Isolatie toevoegen",
                  description: "Buitengevelisolatie voor maximale energiebesparing en comfort."
                },
                {
                  icon: Layers,
                  title: "Nieuwe afwerking",
                  description: "Crepi, steenstrips of andere moderne afwerkingsmaterialen."
                },
                {
                  icon: Home,
                  title: "Complete transformatie",
                  description: "Van oude, verweerde gevel tot moderne, energiezuinige gevel met garantie."
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <item.icon className="text-brand-accent" size={32} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-brand-dark mb-3">{item.title}</h3>
                      <p className="text-gray-700 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-brand-dark text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Gevelrenovatie met Yannova?
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

export default Gevelrenovatie;
