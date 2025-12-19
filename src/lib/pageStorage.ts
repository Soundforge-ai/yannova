import { Data } from '@measured/puck';

export interface PageData {
    id: string;
    slug: string;
    title: string;
    content: Data;
    createdAt: Date;
    updatedAt: Date;
    status: 'published' | 'draft';
    parentId?: string; // For subpages
    seo?: {
        title?: string;
        description?: string;
        keywords?: string;
    };
}

const PAGES_KEY = 'yannova_pages';

// Initial sample page (optional)
const defaultPage: PageData = {
    id: 'landing-demo',
    slug: 'landingspagina-voor-ramen',
    title: 'Actie Ramen & Deuren',
    content: { root: { title: 'Ramen Actie' }, content: [] },
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'published',
};

export const pageStorage = {
    getPages: (): PageData[] => {
        try {
            const stored = localStorage.getItem(PAGES_KEY);
            if (!stored) {
                // Return default set if empty
                return [];
            }

            const parsed = JSON.parse(stored);
            return parsed.map((p: any) => ({
                ...p,
                createdAt: new Date(p.createdAt),
                updatedAt: new Date(p.updatedAt),
            }));
        } catch (e) {
            console.error('Error loading pages', e);
            return [];
        }
    },

    getPage: (idOrSlug: string): PageData | null => {
        const pages = pageStorage.getPages();
        return pages.find(p => p.id === idOrSlug || p.slug === idOrSlug) || null;
    },

    savePage: (page: PageData) => {
        const pages = pageStorage.getPages();
        const index = pages.findIndex(p => p.id === page.id);

        if (index >= 0) {
            pages[index] = { ...page, updatedAt: new Date() };
        } else {
            pages.push({ ...page, createdAt: new Date(), updatedAt: new Date() });
        }

        localStorage.setItem(PAGES_KEY, JSON.stringify(pages));
        window.dispatchEvent(new Event('pages-updated'));
    },

    deletePage: (id: string) => {
        let pages = pageStorage.getPages();
        pages = pages.filter(p => p.id !== id);
        localStorage.setItem(PAGES_KEY, JSON.stringify(pages));
        window.dispatchEvent(new Event('pages-updated'));
    }
};
