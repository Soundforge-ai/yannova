import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Render, Data } from '@measured/puck';
import { getSiteContent } from '@/lib/api/site-actions';
import config from '@/pages/dashboard/editor/puck.config';
import { PageData } from '@/lib/pageStorage';

const DynamicPageRenderer: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [data, setData] = useState<Data | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadPage = async () => {
            if (!slug) return;

            try {
                // Here we ideally search by slug, but our dummy API uses ID mainly.
                // Let's assume siteId matches slug or we look it up.
                // In our pageStorage implementation, we can look up by slug.
                // Since getSiteContent takes a string ID/slug, we pass the slug.
                const content = await getSiteContent(slug); // Needs to handle slug lookup

                if (content) {
                    setData(content);
                } else {
                    setError('Pagina niet gevonden');
                }
            } catch (err) {
                console.error('Error rendering page:', err);
                setError('Er ging iets mis bij het laden van de pagina');
            } finally {
                setLoading(false);
            }
        };

        loadPage();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-8">{error || 'Pagina niet gevonden'}</p>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                    Terug naar Home
                </button>
            </div>
        );
    }

    return (
        <div className="page-content">
            <Render config={config} data={data} />
        </div>
    );
};

export default DynamicPageRenderer;
