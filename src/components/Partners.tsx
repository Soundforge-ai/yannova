import React from 'react';
import { ArrowRight, Handshake, Users, Building2, Briefcase } from 'lucide-react';

const Partners: React.FC = () => {
    return (
        <div className="min-h-screen bg-white text-slate-900">
            {/* Hero Section */}
            <section className="relative py-24 md:py-32 bg-gray-50">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-dark mb-6">
                            Samenwerken met de juiste <span className="text-brand-accent">bouwpartners</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed max-w-3xl">
                            Yannova gelooft in sterke partnerships. In samenwerkingen met architecten, bouwpartners en leveranciers.
                            Want samen creëren we meer. Meer klantentevredenheid, meer kwaliteit, meer efficiëntie.
                            En vooral: een resultaat waar we samen fier op zijn.
                        </p>
                        <p className="text-xl font-medium text-brand-dark">
                            Ontdek de voordelen van een sterk partnership.
                        </p>
                    </div>
                </div>
            </section>

            {/* Architecten Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-6 flex items-center gap-3">
                                    <Building2 className="text-brand-accent" size={40} />
                                    Architecten & Architectenbureaus
                                </h2>
                                <div className="prose prose-lg max-w-none text-gray-600">
                                    <p className="mb-4">
                                        Als architect wil je ontwerpen, begeleiden en vooruitgaan. Yannova zorgt ervoor dat jij je kan
                                        <strong> focussen op je kerntaak</strong>, terwijl jouw <strong>werfopvolging vlotter en efficiënter verloopt</strong>.
                                    </p>
                                    <p className="mb-4">
                                        Je behoudt de creatieve leiding. Wij nemen de uitvoering in handen. Klinkt dit als een samenwerking die jij zoekt?
                                    </p>
                                    <ul className="space-y-3 mt-6 mb-8">
                                        <li className="flex items-center gap-2">
                                            <span className="w-2 h-2 bg-brand-accent rounded-full"></span>
                                            <span>Correcte uitvoering volgens plan en budget</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="w-2 h-2 bg-brand-accent rounded-full"></span>
                                            <span>Proactieve communicatie en technische ondersteuning</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="w-2 h-2 bg-brand-accent rounded-full"></span>
                                            <span>Strikte naleving van deadlines</span>
                                        </li>
                                    </ul>
                                    <a href="/#contact" className="inline-flex items-center text-brand-accent font-bold hover:underline group text-lg">
                                        Contacteer ons voor een samenwerking
                                        <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                </div>
                            </div>
                            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
                                <img
                                    src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=2000"
                                    alt="Samenwerking met architecten"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bouwpartners Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
                            <div className="md:order-2">
                                <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-6 flex items-center gap-3">
                                    <Handshake className="text-brand-accent" size={40} />
                                    Bouwpromotoren & Projectontwikkelaars
                                </h2>
                                <div className="prose prose-lg max-w-none text-gray-600">
                                    <p className="mb-4">
                                        Voor grotere projecten is een betrouwbare partner essentieel. Iemand die meedenkt, de planning bewaakt
                                        en kwaliteit levert op schaal. Yannova is uw ideale partner voor gevelwerken, isolatie en afwerking
                                        van nieuwbouwprojecten en totaalrenovaties.
                                    </p>
                                    <p className="mb-4">
                                        Wij begrijpen de dynamiek van grote werven en zorgen voor een naadloze integratie in uw planning.
                                    </p>
                                    <ul className="space-y-3 mt-6 mb-8">
                                        <li className="flex items-center gap-2">
                                            <span className="w-2 h-2 bg-brand-accent rounded-full"></span>
                                            <span>Capaciteit voor grotere volumes</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="w-2 h-2 bg-brand-accent rounded-full"></span>
                                            <span>Ervaring met strikte lastenboeken</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="w-2 h-2 bg-brand-accent rounded-full"></span>
                                            <span>Vaste contactpersoon voor werfleiders</span>
                                        </li>
                                    </ul>
                                    <a href="/#contact" className="inline-flex items-center text-brand-accent font-bold hover:underline group text-lg">
                                        Bekijk onze mogelijkheden
                                        <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                </div>
                            </div>
                            <div className="md:order-1 relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
                                <img
                                    src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=2000"
                                    alt="Samenwerking met bouwpromotoren"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-brand-dark text-white text-center">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Klaar om krachten te bundelen?</h2>
                        <p className="text-xl text-gray-300 mb-10">
                            Laten we samen bekijken hoe we een meerwaarde kunnen zijn voor uw volgende project.
                            Zullen we kennismaken bij een koffie?
                        </p>
                        <a
                            href="/#contact"
                            className="inline-block bg-brand-accent hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-lg transition-all transform hover:scale-105 shadow-xl"
                        >
                            Maak een afspraak
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Partners;
