import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Trees, Flower2, Construction, Waves, CheckCircle } from 'lucide-react';

const Tuinaanleg: React.FC = () => {
    const services = [
        {
            id: 'ontwerp',
            title: 'Tuinontwerp & Aanleg',
            description: 'Van droom naar realiteit. Wij ontwerpen tuinen die perfect aansluiten bij uw levensstijl en woning. Van strak modern tot weelderig landelijk.',
            icon: Trees,
            image: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80',
            subcategories: ['3D Tuinontwerp', 'Beplantingsplan', 'Totaalconcept', 'Onderhoudsvriendelijk']
        },
        {
            id: 'opritten',
            title: 'Opritten & Terrassen',
            description: 'Een oprit die gezien mag worden en een terras om op te leven. Wij plaatsen klinkers, tegels, keramiek en natuursteen met perfecte afwatering.',
            icon: Construction,
            image: 'https://images.unsplash.com/photo-1621251336069-7977ba2add63?auto=format&fit=crop&q=80',
            subcategories: ['Keramische tegels', 'Klinkers', 'Natuursteen', 'Waterpasserende verharding']
        },
        {
            id: 'afsluitingen',
            title: 'Afsluitingen & Poorten',
            description: 'Creëer privacy en veiligheid met onze stijlvolle tuinafsluitingen en poorten. Hout, composite, draad of beton.',
            icon: Shield, // Note: Shield needs import if used, using Construction as fallback if Shield not preferred icon here? No, Shield is good for security.
            image: 'https://images.unsplash.com/photo-1599818826508-32c0287dfb34?auto=format&fit=crop&q=80',
            subcategories: ['Houten schermen', 'Draadpanelen', 'Steenkorven', 'Geautomatiseerde poorten']
        },
        {
            id: 'zwemvijvers',
            title: 'Waterpartijen',
            description: 'Breng rust in uw tuin met een vijver, waterornament of zwemvijver. Wij zorgen voor de techniek en de afwerking.',
            icon: Waves,
            image: 'https://images.unsplash.com/photo-1543884877-c990d0b06b02?auto=format&fit=crop&q=80',
            subcategories: ['Zwemvijvers', 'Siervijvers', 'Fonteinen', 'Biologische filtering']
        }
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900">
            {/* Hero Section */}
            <section className="relative py-24 md:py-32 bg-green-900">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80')] opacity-30 bg-cover bg-center mix-blend-overlay"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                            Uw Droomtuin, Onze Passie
                        </h1>
                        <p className="text-lg md:text-xl text-green-50 mb-8 leading-relaxed max-w-3xl mx-auto">
                            Van het eerste ontwerp tot de laatste plant. Yannova transformeert uw buitenruimte in een oase van rust en beleving.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/portfolio"
                                className="bg-brand-accent hover:bg-orange-700 text-white px-8 py-4 rounded-md font-bold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                            >
                                Bekijk onze Projecten
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
                            Een tuin is meer dan wat planten. Het is een verlengstuk van uw woning.
                            Of u nu houdt van een strakke, onderhoudsvriendelijke tuin of een weelderige groene oase,
                            wij realiseren uw visie met vakmanschap en oog voor detail.
                        </p>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-20 bg-green-50/50">
                <div className="container mx-auto px-6">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-12 text-center">
                            Tuin & Buitenomgeving
                        </h2>

                        <div className="grid md:grid-cols-2 gap-8">
                            {services.map((service) => (
                                <div
                                    key={service.id}
                                    className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                                >
                                    <div className="relative h-64 overflow-hidden">
                                        <img
                                            src={service.image}
                                            alt={service.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 to-transparent"></div>
                                        <div className="absolute bottom-6 left-6 text-white">
                                            <service.icon className="text-green-300 mb-3" size={32} />
                                            <h3 className="text-2xl font-bold">{service.title}</h3>
                                        </div>
                                    </div>

                                    <div className="p-8">
                                        <p className="text-gray-700 text-lg leading-relaxed mb-6">
                                            {service.description}
                                        </p>

                                        {/* Subcategories */}
                                        <div className="flex flex-wrap gap-2 mb-8">
                                            {service.subcategories.map((sub, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1 bg-green-50 text-green-800 text-sm rounded-full font-medium"
                                                >
                                                    {sub}
                                                </span>
                                            ))}
                                        </div>

                                        <Link
                                            to="/contact"
                                            className="inline-flex items-center text-green-700 font-bold hover:text-green-900 transition-colors"
                                        >
                                            Offerte aanvragen
                                            <ArrowRight size={18} className="ml-2" />
                                        </Link>
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
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
                            Meer dan alleen tuinieren
                        </h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            {[
                                { title: "Totaalprojecten", description: "Wij coördineren alles: van grondwerken en verharding tot beplanting en verlichting." },
                                { title: "Modern Machinepark", description: "Met onze eigen graafmachines en apparatuur werken we snel en efficiënt." },
                                { title: "Duurzame Materialen", description: "Wij kiezen voor kwaliteit die jarenlang meegaat, ongeacht het weer." },
                                { title: "Creatief Ontwerp", description: "Onze tuinarchitecten denken mee en komen met verrassende oplossingen." }
                            ].map((benefit, idx) => (
                                <div key={idx} className="flex gap-4 p-4 rounded-lg hover:bg-green-50/50 transition-colors">
                                    <div className="flex-shrink-0">
                                        <CheckCircle className="text-green-600 mt-1" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                                        <p className="text-gray-600">{benefit.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-green-900 text-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Is uw tuin klaar voor een make-over?
                    </h2>
                    <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
                        Laat ons weten wat uw wensen zijn. Wij komen graag langs voor een vrijblijvend gesprek.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/contact"
                            className="bg-brand-accent hover:bg-orange-700 text-white px-8 py-4 rounded-md font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            Contacteer ons
                            <ArrowRight size={20} />
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

// Add explicit import for Shield since it was used in services array
import { Shield } from 'lucide-react';

export default Tuinaanleg;
