import React from 'react';
import { Check } from 'lucide-react';
import { WHY_US_BENEFITS } from '../constants';

const WhyUs: React.FC = () => {
  return (
    <section className="py-20 bg-brand-dark text-white relative overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:items-center">
            <div className="lg:w-1/3">
                <h2 className="text-brand-accent font-semibold tracking-wider uppercase text-sm mb-3">Waarom Yannova?</h2>
                <h3 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                    Kies voor zekerheid en kwaliteit.
                </h3>
                <p className="text-gray-400 text-lg mb-8">
                    Wij streven naar perfectie in elk detail. Onze klanten waarderen onze transparante communicatie en de duurzaamheid van ons werk.
                </p>
                <div className="hidden lg:block">
                    <img 
                        src="/images/16676485-bd4d-49a4-a5a6-89e07254fa23.png" 
                        alt="Detail afwerking" 
                        className="rounded-lg shadow-lg border border-gray-700 opacity-80"
                    />
                </div>
            </div>

            <div className="lg:w-2/3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {WHY_US_BENEFITS.map((benefit) => (
                        <div key={benefit.id} className="flex items-start gap-4 p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                            <div className="mt-1 bg-brand-accent/20 p-2 rounded-full text-brand-accent">
                                <Check size={20} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-lg text-gray-100">{benefit.text}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;