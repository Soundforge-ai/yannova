import React from 'react';
import { CheckCircle, Users, Award, Clock, Target, Heart } from 'lucide-react';

const OverOns: React.FC = () => {
  const teamValues = [
    {
      icon: Target,
      title: 'Onze Missie',
      description:
        'Wij streven ernaar om elke klant een zorgeloze renovatie-ervaring te bieden met kwaliteit en vakmanschap als kern.',
    },
    {
      icon: Heart,
      title: 'Onze Visie',
      description:
        'Een toekomst waarin elk huis energiezuinig, comfortabel en esthetisch verantwoord is afgewerkt.',
    },
    {
      icon: Award,
      title: 'Onze Waarden',
      description:
        'Eerlijkheid, transparantie en respect vormen de basis van elke samenwerking met onze klanten.',
    },
  ];

  const stats = [
    { number: '15+', label: 'Jaren ervaring' },
    { number: '500+', label: 'Tevreden klanten' },
    { number: '1000+', label: 'Projecten voltooid' },
    { number: '100%', label: 'Klanttevredenheid' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-gradient-to-br from-brand-dark via-slate-800 to-brand-dark">
        <div className="absolute inset-0 opacity-10 bg-[url('/images/yannova-team.jpg')] bg-cover bg-center" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Over Yannova</h1>
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
              Al meer dan 15 jaar uw betrouwbare partner voor bouw, renovatie en gevelwerken in België.
            </p>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <img
                src="/images/yannova-team.jpg"
                alt="Het Yannova team"
                className="rounded-xl shadow-2xl w-full"
                loading="lazy"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-6">
                Vakmanschap en vertrouwen in elk project
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Bij Yannova geloven we dat bouwen en renoveren meer is dan alleen stenen stapelen. Het gaat om het
                creëren van een thuis. Met jarenlange ervaring in de Belgische bouwsector staan wij garant voor een
                persoonlijke aanpak, correcte planning en glasheldere communicatie.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Of het nu gaat om het plaatsen van nieuwe ramen, gevelisolatie of een totaalrenovatie: wij werken elk
                detail af met de grootste zorg.
              </p>
              <ul className="space-y-3">
                {['Persoonlijke begeleiding van A tot Z', 'Eén aanspreekpunt voor uw project', 'Focus op energiezuinige oplossingen'].map(
                  (item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle className="text-brand-accent flex-shrink-0" size={20} />
                      <span className="text-brand-primary font-medium">{item}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-brand-dark">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-brand-accent mb-2">{stat.number}</p>
                <p className="text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-12 text-center">
              Waar wij voor staan
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {teamValues.map((value, idx) => (
                <div key={idx} className="bg-white p-8 rounded-xl shadow-md text-center">
                  <div className="w-16 h-16 bg-brand-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <value.icon className="text-brand-accent" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-brand-dark mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-6">Ons Team</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-12">
              Ons team bestaat uit ervaren vakmensen die met passie en precisie werken aan elk project. Van projectleiders
              tot uitvoerders, iedereen deelt dezelfde toewijding aan kwaliteit.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Users className="text-brand-accent" size={48} />
              <div className="text-left">
                <p className="text-2xl font-bold text-brand-dark">20+ Vakmensen</p>
                <p className="text-gray-500">Klaar om uw project te realiseren</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-20 bg-brand-light">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-12 text-center">
              Waarom kiezen voor Yannova?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: Clock, title: 'Stipte planning', desc: 'Wij houden ons aan afspraken en deadlines.' },
                { icon: Award, title: 'Kwaliteitsgarantie', desc: 'Garantie op alle uitgevoerde werken.' },
                { icon: Users, title: 'Persoonlijk contact', desc: 'Eén vast aanspreekpunt voor uw project.' },
                { icon: CheckCircle, title: 'Transparante prijzen', desc: 'Geen verrassingen, heldere offertes.' },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 bg-white p-6 rounded-xl">
                  <div className="flex-shrink-0">
                    <item.icon className="text-brand-accent" size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-dark mb-1">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OverOns;
