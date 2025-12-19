
export interface MediaItem {
    id: string;
    name: string;
    url: string; // Base64 or external URL
    type: 'image' | 'document';
    uploadDate: Date;
    size: number;
}

const MEDIA_KEY = 'yannova_media';

export const mediaStorage = {
    getMedia: (): MediaItem[] => {
        try {
            const stored = localStorage.getItem(MEDIA_KEY);
            if (!stored) return [];

            const parsed = JSON.parse(stored);
            return parsed.map((m: any) => ({
                ...m,
                uploadDate: new Date(m.uploadDate)
            }));
        } catch (e) {
            console.error('Error reading media', e);
            return [];
        }
    },

    saveMedia: (item: MediaItem) => {
        try {
            const current = mediaStorage.getMedia();
            const updated = [item, ...current];

            // Check for quota exceed risk (simple check)
            const stringified = JSON.stringify(updated);
            if (stringified.length > 4000000) { // ~4MB safeguard
                throw new Error('Opslag vol! Verwijder oude afbeeldingen of gebruik externe URL\'s.');
            }

            localStorage.setItem(MEDIA_KEY, stringified);
            window.dispatchEvent(new Event('media-updated'));
        } catch (e) {
            console.error('Error saving media', e);
            throw e;
        }
    },

    deleteMedia: (id: string) => {
        const current = mediaStorage.getMedia();
        const updated = current.filter(m => m.id !== id);
        localStorage.setItem(MEDIA_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event('media-updated'));
    }
};
