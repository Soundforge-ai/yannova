import React from 'react';
import { ArrowRight, CheckCircle, Shield, Home, Palette } from 'lucide-react';

const CrepiInfo: React.FC = () => {
  return (
    <section id="crepi-info" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-dark mb-6">
            Crepi met ingebouwde patronen: alles wat u moet weten
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Ontdek hoe u uw gevel een unieke uitstraling geeft met crepi en ingebouwde patronen. 
            Een moderne oplossing die esthetiek combineert met duurzaamheid.
          </p>
        </div>

        {/* Hero Image */}
        <div className="mb-16">
          <div className="relative rounded-xl overflow-hidden shadow-2xl">
            <img
              src="/images/crepi-patterns.png"
              alt="Crepi gevel met ingebouwde patronen"
              className="w-full h-full object-cover max-h-[500px]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://www.yannovabouw.be/lovable-uploads/003a3c82-53d0-4c81-8d96-4ae5ad333f15.png";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Wat is crepi met ingebouwde patronen */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-6">
              Wat is crepi met ingebouwde patronen?
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                <strong>Crepi met ingebouwde patronen is een innovatieve techniek waarbij tijdens het aanbrengen 
                van de pleisterlaag een specifiek motief wordt gecreëerd, meestal in de vorm van een baksteenpatroon.</strong>
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Het resultaat is een gevel die de authentieke uitstraling heeft van traditioneel metselwerk, 
                maar geniet van alle technische voordelen van moderne gevelbepleistering. U krijgt het beste 
                van beide werelden: de warme uitstraling van baksteen gecombineerd met de superieure isolatie 
                en bescherming van crepi.
              </p>
            </div>
          </div>

          {/* Technieken */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-6">
              Technieken voor het aanbrengen van patronen
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-brand-light p-8 rounded-xl">
                <h3 className="text-2xl font-bold text-brand-dark mb-4">1. Inkrassen van voegen</h3>
                <p className="text-gray-700 leading-relaxed">
                  Bij deze vakmanschappelijke techniek wordt na het aanbrengen van de pleisterlaag handmatig 
                  een metselpatroon ingekrast voordat de pleister volledig is uitgehard. Deze methode vereist 
                  precisie en ervaring, maar levert uitzonderlijk realistische resultaten op. Uw gevel ziet 
                  eruit alsof deze gemaakt is van gerenoveerde, geverfde bakstenen.
                </p>
              </div>
              <div className="bg-brand-light p-8 rounded-xl">
                <h3 className="text-2xl font-bold text-brand-dark mb-4">2. Gebruik van mallen</h3>
                <p className="text-gray-700 leading-relaxed">
                  Een alternatieve methode maakt gebruik van speciaal ontworpen mallen die in de nog natte 
                  pleister worden gedrukt. Deze techniek zorgt voor een nauwkeurig en uniform baksteenmotief 
                  over de hele gevel. Perfect voor projecten waar consistentie en snelheid belangrijk zijn.
                </p>
              </div>
            </div>
          </div>

          {/* Voordelen */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-8">
              Voordelen van crepi met ingebouwde patronen
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Palette className="text-brand-accent" size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-brand-dark mb-3">Esthetische meerwaarde</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Geef uw gevel een unieke, authentieke uitstraling zonder daadwerkelijk nieuwe bakstenen 
                    te hoeven metsen. Combineer de charme van traditionele bouwstijlen met moderne 
                    pleistertechnieken.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Home className="text-brand-accent" size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-brand-dark mb-3">Superieure isolatie</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Combineer crepi met buitengevelisolatie voor optimale energiebesparing. Onze isolatieplaten 
                    onder de crepilaag vormen een extra thermische barrière, waardoor u tot wel 30% minder 
                    energieverbruik realiseert.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Shield className="text-brand-accent" size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-brand-dark mb-3">Weerbestendig en duurzaam</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Crepi biedt uitstekende bescherming tegen regen, wind en temperatuurschommelingen. 
                    De waterafstotende eigenschappen voorkomen vochtproblemen, schimmelvorming en vorstschade.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="text-brand-accent" size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-brand-dark mb-3">Onderhoudsvriendelijk</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Door het waterafstotende karakter blijft uw gevel jarenlang mooi zonder zorgen over 
                    algen- of mosgroei. Periodieke reiniging met zachte borstel of lage druk waterstraal 
                    volstaat meestal.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Ontwerpvrijheid */}
          <div className="mb-16 bg-brand-light p-8 rounded-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-6">
              Onbeperkte ontwerpvrijheid
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Naast het klassieke baksteenmotief kunt u spelen met verschillende voegbreedtes, reliëfs en 
              kleurnuances om het perfecte effect te bereiken. Kies uit een breed scala aan kleuren, van 
              warme wittinten tot moderne grijstinten en zelfs opvallende kleuraccenten.
            </p>
            <ul className="space-y-3 mt-6">
              {[
                "Kies uw favoriete korreldikte voor de gewenste textuur",
                "Verschillende voegbreedtes voor subtiel of opvallend effect",
                "Reliëfpatronen voor extra dimensie en karakter",
                "Kleuren op maat die perfect aansluiten bij uw woning"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle className="text-brand-accent flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Toepasbaarheid */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-6">
              Geschikt voor elke gevel?
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Crepi met ingebouwde patronen is geschikt voor zowel nieuwbouwprojecten als renovaties. 
              <strong> De gevel moet zich wel in goede staat bevinden om diepe, gelijkmatige voegen over 
              de hele muur te kunnen aanbrengen.</strong>
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Onze specialisten komen graag bij u langs om uw gevel te inspecteren en de mogelijkheden 
              samen met u door te nemen. We geven eerlijk advies over wat haalbaar is en wat het beste 
              resultaat oplevert voor uw specifieke situatie.
            </p>
          </div>

          {/* CTA */}
          <div className="bg-brand-dark text-white p-12 rounded-xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Klaar voor een nieuwe gevel met crepi?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Laat onze experts u adviseren over de mogelijkheden voor uw project. 
              Vraag vandaag nog uw gratis offerte aan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#contact"
                className="bg-brand-accent hover:bg-orange-700 text-white px-8 py-4 rounded-md font-bold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                Gratis Offerte Aanvragen
                <ArrowRight size={20} />
              </a>
              <a
                href="tel:+32489960001"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-md font-bold text-lg transition-all flex items-center justify-center"
              >
                Bel Ons Direct
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CrepiInfo;

