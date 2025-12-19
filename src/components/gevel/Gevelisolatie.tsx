import React from 'react';
import { ArrowRight, ThermometerSun, Home, Shield, CheckCircle, Phone } from 'lucide-react';

const Gevelisolatie: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-brand-dark via-slate-800 to-brand-dark">
        <div className="absolute inset-0 bg-[url('/images/crepi-patterns.png')] opacity-10 bg-cover bg-center"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Gevelisolatie laten plaatsen: mogelijkheden en voordelen
            </h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              Bespaar aanzienlijk op uw energierekening en verhoog het comfort van uw woning met professionele gevelisolatie.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/#contact"
                className="bg-brand-accent hover:bg-orange-700 text-white px-8 py-4 rounded-md font-bold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                Gratis Offerte Aanvragen
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

      {/* Section 1: Voordelen van gevelisolatie */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-8">
              1. De voordelen van gevelisolatie
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Allereerst kunt u dankzij het isoleren van uw gevel een flinke duit op uw jaarlijkse energierekening besparen, 
                omdat gevelisolatie er voor zorgt dat er <strong>aanzienlijk minder warmte- en energieverlies</strong> via uw gevel optreedt. 
                Warmte kan op velerlei manieren van binnen naar buiten ontsnappen. Veel mensen denken dat een woning met bijvoorbeeld 
                dubbel glas hermetisch afgesloten is. Helaas is niets minder waar.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Uw gevel kan aanleiding geven tot warmteverlies, omdat <strong>gevels poreus van aard</strong> zijn. 
                Zelfs de kleinste spleetjes kunnen warme lucht toegang bieden tot buiten. Het isoleren van uw gevel zet dit proces 
                een halt toe, waardoor er nagenoeg geen energieverlies meer optreedt. Idem geldt voor <strong>binnentredend vocht</strong>. 
                Ook dit fenomeen komt met gevelisolatie veel minder vaak voor.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                Daarnaast zal een geïsoleerde gevel <strong>de EPC-waarde van uw woning verhogen</strong>, en dit komt de waarde van 
                uw pand alleen maar ten goede.
              </p>
            </div>

            <div className="bg-brand-light p-8 rounded-xl mb-12">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <ThermometerSun className="text-brand-accent" size={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-brand-dark mb-4">Belangrijkste voordelen op een rij:</h3>
                  <ul className="space-y-3">
                    {[
                      "Aanzienlijke besparing op uw jaarlijkse energierekening",
                      "Minder warmte- en energieverlies via de gevel",
                      "Bescherming tegen binnentredend vocht",
                      "Verhoging van de EPC-waarde van uw woning",
                      "Verhoogde waarde van uw pand",
                      "Verbeterd wooncomfort het hele jaar door"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="text-brand-accent flex-shrink-0 mt-1" size={20} />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Gevelisolatie langs buiten */}
      <section className="py-20 bg-brand-light">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-8">
              2. Gevelisolatie langs buiten
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Gevelisolatie langs buiten plaatsen is eigenlijk een <strong>dubbele winst</strong>. Naast het feit dat uw gevel 
                na de werkzaamheden uitstekend geïsoleerd zal zijn, krijgt uw huis ook meteen een flinke opknapbeurt en zal het 
                er weer als nieuw uitzien.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Langs buiten uw gevel isoleren kan op bijzonder veel verschillende manieren, zoals:
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-brand-dark mb-3 flex items-center gap-3">
                  <Home className="text-brand-accent" size={24} />
                  Crepi of pleisterwerk
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Het aanbrengen van crepi of pleisterwerk op uw gevel. Dit combineert isolatie met een moderne, strakke afwerking.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-brand-dark mb-3 flex items-center gap-3">
                  <Home className="text-brand-accent" size={24} />
                  Nieuwe bakstenen buitenmuur
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Een geheel nieuwe bakstenen buitenmuur aanbrengen voor een klassieke uitstraling met optimale isolatie.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-brand-dark mb-3 flex items-center gap-3">
                  <Home className="text-brand-accent" size={24} />
                  Steenstrips
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Het aanbrengen van steenstrips voor een authentieke baksteenlook met uitstekende isolatie-eigenschappen.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-brand-dark mb-3 flex items-center gap-3">
                  <Home className="text-brand-accent" size={24} />
                  Speciale materialen
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Houten gevelbekleding, aluminium gevelpanelen, kunststof platen of zogeheten sidings voor een moderne uitstraling.
                </p>
              </div>
            </div>

            <div className="bg-brand-dark text-white p-8 rounded-xl">
              <p className="text-lg leading-relaxed">
                U kunt door langs buiten te isoleren uw woning een compleet andere look geven. De mogelijkheden zijn erg breed. 
                Alle methodieken voorzien hoe dan ook in een <strong>solide isolatielaag</strong> die uw huis direct een 
                <strong> stuk energiezuiniger</strong> maakt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Gevelisolatie langs binnen */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-8">
              3. Gevelisolatie langs binnen
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Wilt u liever niet het uitzicht van uw gevel veranderen, of is gevelisolatie langs buiten om technische redenen 
                niet mogelijk, dan kunt u ook opteren om gevelisolatie langs binnen te plaatsen. In dit geval zullen uw 
                <strong> binnenmuren voorzien worden van isolatiematerialen</strong>.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Dit kan door middel van <strong>voorzetwanden</strong>, die worden aangebracht op houten of metalen roosters. 
                In de ruimte tussen uw muren en de voorzetwanden wordt vervolgens isolatiemateriaal geplaatst, zoals minerale wol.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                Ook kunt u gebruik maken van <strong>speciale isolatieplaten</strong>. Deze platen hebben een 
                <strong> hoge isolatiewaarde en zijn damp-open</strong>, waardoor vocht goed en snel kan uitdrogen indien dit 
                op één of andere wijze in uw binnenmuren terecht komt.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-brand-light p-6 rounded-xl">
                <h3 className="text-xl font-bold text-brand-dark mb-3">Voorzetwanden</h3>
                <p className="text-gray-700 leading-relaxed">
                  Voorzetwanden op houten of metalen roosters met isolatiemateriaal zoals minerale wol in de tussenruimte.
                </p>
              </div>
              <div className="bg-brand-light p-6 rounded-xl">
                <h3 className="text-xl font-bold text-brand-dark mb-3">Isolatieplaten</h3>
                <p className="text-gray-700 leading-relaxed">
                  Speciale isolatieplaten met hoge isolatiewaarde en damp-open eigenschappen voor optimale vochthuishouding.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Hoe kiest u de beste gevelisolatiemethode */}
      <section className="py-20 bg-brand-light">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-8">
              4. Hoe kiest u de beste gevelisolatiemethode?
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Wilt u ook graag weten of u voordeel kunt behalen op uw jaarlijkse energiefactuur? Neem dan snel contact op met Yannova. 
                Dankzij onze <strong>jarenlange ervaring en expertise op het gebied van gevelisolatie</strong> kunnen wij u voorzien van 
                <strong> deskundig en efficiënt advies</strong>, waarmee u <strong>op jaarbasis heel wat kunt besparen</strong>.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Voor elk huis hebben wij een gepaste oplossing, die het beste aansluit bij de bouwkundige constructie van uw woning 
                en uw persoonlijke mogelijkheden. Bel ons nu, en ontdek wat we voor u kunnen betekenen.
              </p>
              <div className="bg-white p-6 rounded-xl border-l-4 border-brand-accent mb-8">
                <p className="text-gray-700 text-lg leading-relaxed">
                  <strong>Wist u dat u ook heel wat kan besparen</strong> dankzij premies voor gevelisolatie? Wij vertellen u graag 
                  welke premies er zijn en zetten u op weg om ze aan te vragen.
                </p>
              </div>
            </div>

            <div className="bg-brand-dark text-white p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4">Echt en juist advies over gevelisolatie nodig?</h3>
              <p className="text-lg text-gray-300 mb-6">
                Onze specialisten staan klaar om u te adviseren over de beste isolatieoplossing voor uw woning.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/#contact"
                  className="bg-brand-accent hover:bg-orange-700 text-white px-6 py-3 rounded-md font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  Gratis Geveldiagnose
                  <ArrowRight size={20} />
                </a>
                <a
                  href="tel:+32489960001"
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-6 py-3 rounded-md font-bold transition-all flex items-center justify-center"
                >
                  <Phone size={20} className="mr-2" />
                  Bel Ons Direct
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-brand-dark text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Vraag uw gratis geveldiagnose aan
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Een gevel terug als nieuw op mét garantie! Ontdek wat gevelisolatie voor uw woning kan betekenen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/#contact"
                className="bg-brand-accent hover:bg-orange-700 text-white px-8 py-4 rounded-md font-bold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                Gratis Diagnose Aanvragen
                <ArrowRight size={20} />
              </a>
              <a
                href="tel:+32489960001"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-md font-bold text-lg transition-all flex items-center justify-center"
              >
                <Phone size={20} className="mr-2" />
                Bel Gratis 0800/61.160
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gevelisolatie;

