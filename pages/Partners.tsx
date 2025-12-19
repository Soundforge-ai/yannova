import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Handshake, Shield, CheckCircle } from 'lucide-react';

const Partners: React.FC = () => {
  const partners = [
    {
      name: 'Deceuninck',
      category: 'Ramen & Deuren',
      description: 'Toonaangevende fabrikant van PVC profielen voor ramen en deuren.',
      logo: '/images/partners/deceuninck.png',
    },
    {
      name: 'Knauf',
      category: 'Isolatie',
      description: 'Wereldleider in isolatiematerialen en bouwsystemen.',
      logo: '/images/partners/knauf.png',
    },
    {
      name: 'Weber',
      category: 'Gevelafwerking',
      description: 'Specialist in crepi, pleisterwerk en gevelafwerkingssystemen.',
      logo: '/images/partners/weber.png',
    },
    {
      name: 'Recticel',
      category: 'Isolatie',
      description: 'Belgische producent van hoogwaardige isolatieplaten.',
      logo: '/images/partners/recticel.png',
    },
    {
      name: 'Vandersanden',
      category: 'Steenstrips',
      description: 'Producent van bakstenen en steenstrips met Belgische kwaliteit.',
      logo: '/images/partners/vandersanden.png',
    },
    {
      name: 'Sto',
      category: 'Gevelisolatie',
      description: 'Innovatieve oplossingen voor buitengevelisolatie en afwerking.',
      logo: '/images/partners/sto.png',
    },
  ];

  const benefits = [
    {
      icon: Award,
      title: 'Kwaliteitsmaterialen',
      description: 'Wij werken uitsluitend met A-merken en gecertificeerde materialen.',
    },
    {
      icon: Shield,
      title: 'Uitgebreide garantie',
      description: 'Dankzij onze partners kunnen wij uitgebreide garanties bieden.',
    },
    {
      icon: Handshake,
      title: 'Directe lijnen',
      description: 'Korte communicatielijnen voor snelle levering en service.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-gradient-to-br from-brand-dark via-slate-800 to-brand-dark">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Onze Partners</h1>
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
              Wij werken samen met de beste leveranciers en fabrikanten om u topkwaliteit te garanderen.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-brand-light">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-16 h-16 bg-brand-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="text-brand-accent" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-brand-dark mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-12 text-center">
              Onze Leveranciers & Fabrikanten
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {partners.map((partner, idx) => (
                <div key={idx} className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-shadow">
                  <div className="h-20 flex items-center justify-center mb-6 bg-white rounded-lg p-4">
                    {/* Placeholder for logo - in production use actual logos */}
                    <div className="text-2xl font-bold text-brand-dark">{partner.name}</div>
                  </div>
                  <span className="inline-block px-3 py-1 bg-brand-accent/10 text-brand-accent text-sm font-medium rounded-full mb-3">
                    {partner.category}
                  </span>
                  <h3 className="text-xl font-bold text-brand-dark mb-2">{partner.name}</h3>
                  <p className="text-gray-600">{partner.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Partners Matter */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-6">
                  Waarom wij kiezen voor kwaliteitspartners
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  De kwaliteit van uw renovatie of nieuwbouwproject hangt niet alleen af van vakmanschap, maar ook van de
                  gebruikte materialen. Daarom werken wij uitsluitend samen met gerenommeerde fabrikanten en leveranciers.
                </p>
                <ul className="space-y-3">
                  {[
                    'Gecertificeerde en geteste materialen',
                    'Langdurige garanties van fabrikanten',
                    'Innovatieve en duurzame oplossingen',
                    'Snelle beschikbaarheid en levering',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle className="text-brand-accent flex-shrink-0" size={20} />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-brand-dark text-white p-8 rounded-xl">
                <h3 className="text-2xl font-bold mb-4">Word partner van Yannova</h3>
                <p className="text-gray-300 mb-6">
                  Bent u leverancier of fabrikant en wilt u samenwerken met Yannova? Neem contact met ons op om de
                  mogelijkheden te bespreken.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-brand-accent hover:bg-orange-700 text-white px-6 py-3 rounded-md font-semibold transition-colors"
                >
                  Neem contact op <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partners;
