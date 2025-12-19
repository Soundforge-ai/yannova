import React from 'react';
import { ArrowRight, Shield, CheckCircle, Droplets, Sun, Wind, Phone } from 'lucide-react';

const Gevelbescherming: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-gradient-to-br from-brand-dark via-slate-800 to-brand-dark">
        <div className="absolute inset-0 bg-[url('/images/crepi-patterns.png')] opacity-10 bg-cover bg-center"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Gevelbescherming
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed max-w-3xl mx-auto">
              Bescherm uw gevel tegen weersinvloeden, vocht en schade met onze professionele beschermingsbehandelingen. 
              Verleng de levensduur van uw gevel aanzienlijk.
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
              Uw gevel wordt dagelijks blootgesteld aan verschillende weersomstandigheden: regen, wind, UV-straling, 
              temperatuurschommelingen en vervuiling. Zonder adequate bescherming kan dit leiden tot schade, vochtproblemen 
              en een snellere veroudering van uw gevel.
            </p>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mt-4">
              Gevelbescherming zorgt ervoor dat uw gevel optimaal beschermd blijft tegen deze invloeden, waardoor de 
              levensduur aanzienlijk wordt verlengd en onderhoudskosten worden geminimaliseerd.
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
                  src="https://www.yannovabouw.be/lovable-uploads/c67c2ffe-a42b-477f-a67d-10100999c4f0.png"
                  alt="Professionele gevelbescherming tegen weersinvloeden door Yannova"
                  className="w-full h-auto rounded-lg shadow-lg"
                  loading="lazy"
                />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-6">
                  Waarom gevelbescherming?
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 text-lg leading-relaxed mb-4">
                    Een goed beschermde gevel is een investering in de toekomst van uw woning. Onze behandelingen zorgen 
                    ervoor dat uw gevel jarenlang in perfecte staat blijft, zonder dat u zich zorgen hoeft te maken over 
                    schade of veroudering.
                  </p>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    Wij bieden verschillende gevelbeschermingsbehandelingen, afgestemd op uw specifieke geveltype en behoeften.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bescherming tegen Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-12 text-center">
              Bescherming tegen verschillende invloeden
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  icon: Droplets,
                  title: "Vocht en water",
                  description: "Waterafstotende behandelingen voorkomen doordringing van vocht, wat schimmelvorming en vorstschade voorkomt."
                },
                {
                  icon: Sun,
                  title: "UV-straling",
                  description: "Bescherming tegen schadelijke UV-stralen die verkleuring en veroudering van materialen veroorzaken."
                },
                {
                  icon: Wind,
                  title: "Weersinvloeden",
                  description: "Bescherming tegen regen, wind, hagel en andere weersomstandigheden die uw gevel kunnen beschadigen."
                },
                {
                  icon: Shield,
                  title: "Vervuiling en algen",
                  description: "Behandelingen die de groei van algen, mossen en schimmels voorkomen en uw gevel langer schoon houden."
                }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <item.icon className="text-brand-accent mt-1" size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-brand-dark mb-3">{item.title}</h3>
                    <p className="text-gray-700 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Behandelingsmethoden Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-8">
              Onze behandelingsmethoden
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Wij bieden verschillende gevelbeschermingsbehandelingen, afgestemd op uw specifieke geveltype en behoeften:
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Hydrofoberende behandeling: maakt uw gevel waterafstotend",
                  "Impregnatie: diep doordringende bescherming tegen vocht",
                  "Reiniging en behandeling: verwijdering van algen, mossen en vervuiling",
                  "Onderhoudsbehandelingen: periodieke controle en behandeling voor langdurige bescherming",
                  "Speciale behandelingen voor historische gevels"
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
              Gevelbescherming met Yannova?
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

export default Gevelbescherming;
