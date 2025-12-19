import React from 'react';
import { SERVICES } from '../constants';
import { ArrowRight } from 'lucide-react';

const Services: React.FC = () => {
  return (
    <section id="services" className="py-20 bg-brand-light">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-brand-accent font-semibold tracking-wider uppercase text-sm mb-3">Onze Diensten</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">
            Alles voor uw woning onder één dak
          </h3>
          <p className="text-gray-600">
            Van kleine aanpassingen tot grote renovaties. Wij leveren kwaliteit in elk aspect van uw bouwproject.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {SERVICES.map((service) => (
            <div key={service.id} className="bg-white rounded-xl overflow-hidden shadow-lg group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="h-48 overflow-hidden relative">
                <img
                  src={service.image}
                  alt={`${service.title} - ${service.description.substring(0, 50)}...`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                <div className="absolute bottom-4 left-4 bg-brand-accent text-white p-2 rounded-lg">
                  <service.icon size={24} />
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold text-brand-dark mb-3">{service.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {service.description}
                </p>
                <a href="#contact" className="inline-flex items-center text-brand-accent font-semibold text-sm hover:underline">
                  Offerte aanvragen <ArrowRight size={16} className="ml-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;