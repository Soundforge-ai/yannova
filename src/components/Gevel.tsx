import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Palette, Shield, ThermometerSun, Layers, Home, CheckCircle } from 'lucide-react';

const Gevel: React.FC = () => {
  const gevelServices = [
    {
      id: 'gevelbepleistering',
      title: 'Gevelbepleistering',
      description: 'Moderne crepi en pleisterwerk voor een strakke, duurzame gevelafwerking die uw woning beschermt en verfraait.',
      icon: Palette,
      href: '/gevel/gevelbepleistering',
      image: 'https://www.yannovabouw.be/lovable-uploads/003a3c82-53d0-4c81-8d96-4ae5ad333f15.png',
      subcategories: ['Crepi', 'Pleisterwerk', 'Gefactureerde pleister', 'Kleurrijke pleister']
    },
    {
      id: 'gevelbescherming',
      title: 'Gevelbescherming',
      description: 'Bescherm uw gevel tegen weersinvloeden, vocht en schade met onze professionele beschermingsbehandelingen.',
      icon: Shield,
      href: '/gevel/gevelbescherming',
      image: 'https://www.yannovabouw.be/lovable-uploads/c67c2ffe-a42b-477f-a67d-10100999c4f0.png',
      subcategories: ['Hydrofoberende behandeling', 'Impregnatie', 'Reiniging en behandeling', 'Onderhoudsbehandelingen']
    },
    {
      id: 'gevelisolatie',
      title: 'Gevelisolatie',
      description: 'Isolatie langs buiten of binnen voor maximale energiebesparing en comfort. Verlaag uw energiekosten aanzienlijk.',
      icon: ThermometerSun,
      href: '/gevel/gevelisolatie',
      image: 'https://www.yannovabouw.be/lovable-uploads/9678ebf6-952f-45fd-a507-50b06b6a2a06.png',
      subcategories: ['Isolatie langs buiten', 'Isolatie langs binnen', 'Voorzetwanden', 'Isolatieplaten']
    },
    {
      id: 'steenstrips',
      title: 'Steenstrips',
      description: 'Authentieke baksteenlook met uitstekende isolatie-eigenschappen. Perfect voor renovatie en nieuwbouw.',
      icon: Layers,
      href: '/gevel/steenstrips',
      image: 'https://www.yannovabouw.be/lovable-uploads/16676485-bd4d-49a4-a5a6-89e07254fa23.png',
      subcategories: ['Renovatie gevels', 'Nieuwbouw', 'Combinatie met isolatie', 'Verschillende steensoorten']
    },
    {
      id: 'gevelrenovatie',
      title: 'Gevelrenovatie',
      description: 'Complete gevelrenovatie van ruwbouw tot afwerking. Uw gevel wordt weer als nieuw met garantie.',
      icon: Home,
      href: '/gevel/gevelrenovatie',
      image: 'https://www.yannovabouw.be/lovable-uploads/c042e299-3e07-4212-b6a2-5c6297e61d69.png',
      subcategories: ['Herstel van schade', 'Isolatie toevoegen', 'Nieuwe afwerking', 'Complete transformatie']
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-gradient-to-br from-brand-dark via-slate-800 to-brand-dark">
        <div className="absolute inset-0 bg-[url('/images/crepi-patterns.png')] opacity-10 bg-cover bg-center"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Van kleine gevelwerken tot totaalrenovatie
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed max-w-3xl mx-auto">
              Kleine gevelaanpassing of grondige gevelrenovatie? Hoe eenvoudig of complex uw gevelvraag ook is, 
              Yannova heeft voor alles een oplossing. Bovendien duiken we met evenveel passie in elk project.
            </p>
            <p className="text-base md:text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Reken op onze ervaring en expertise. Ontdek wat we voor u kunnen doen.
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
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              <strong>Kleine gevelaanpassing of grondige verbouwing?</strong> Hoe eenvoudig of complex uw gevelvraag ook is, 
              Yannova heeft voor alles een oplossing. Bovendien duiken we met evenveel passie in elk project.
            </p>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mt-4">
              Reken op onze ervaring en expertise. Ontdek wat we voor u kunnen doen.
            </p>
          </div>
        </div>
      </section>

      {/* Geveloplossingen Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-12 text-center">
              Geveloplossingen
            </h2>
            
            <div className="space-y-8">
              {gevelServices.map((service, index) => (
                <div
                  key={service.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="grid md:grid-cols-2 gap-0">
                    {/* Image Side */}
                    <div className="relative h-64 md:h-auto min-h-[300px]">
                      <img
                        src={service.image}
                        alt={`${service.title} - ${service.description.substring(0, 60)}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    </div>
                    
                    {/* Content Side */}
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                      <div className="mb-6">
                        <service.icon className="text-brand-accent mb-4" size={40} />
                        <h3 className="text-2xl md:text-3xl font-bold text-brand-dark mb-4">
                          {service.title}
                        </h3>
                        <p className="text-gray-700 text-lg leading-relaxed mb-6">
                          {service.description}
                        </p>
                      </div>
                      
                      {/* Subcategories */}
                      {service.subcategories && service.subcategories.length > 0 && (
                        <div className="mb-6">
                          <div className="flex flex-wrap gap-2">
                            {service.subcategories.map((sub, idx) => (
                              <span
                                key={idx}
                                className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md"
                              >
                                {sub}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* CTA */}
                      <Link
                        to={service.href}
                        className="inline-flex items-center text-brand-accent font-semibold text-base hover:underline group"
                      >
                        Lees meer
                        <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">
                Snel en efficiënt, met oog voor kwaliteit
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Voor welk type gevelwerk u ook kiest, klein of groot, u weet op voorhand precies waar u aan toe bent. 
                Onze aanpak? Eerst aandachtig luisteren: wat zijn uw wensen, uw dromen, uw budget?
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: "Jarenlange ervaring", description: "Ons team heeft decennia aan ervaring in gevelrenovatie en bepleistering." },
                { title: "Eerlijk en oprecht", description: "Transparante communicatie en eerlijke adviezen zonder verborgen kosten." },
                { title: "Garantie op uitgevoerde werken", description: "Wij staan achter ons werk met uitgebreide garantie op alle uitgevoerde werken." },
                { title: "Duurzame oplossingen", description: "We gebruiken alleen hoogwaardige, duurzame materialen voor langdurige resultaten." },
                { title: "Dienst na verkoop", description: "Ook na oplevering staan we klaar voor onderhoud en advies." },
                { title: "Actief in heel België", description: "Wij werken doorheen heel België voor al uw gevelprojecten." }
              ].map((benefit, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="text-brand-accent mt-1" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-brand-dark mb-2">{benefit.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
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
              Gevelwerken met Yannova?
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
                Bel Ons Direct
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gevel;
