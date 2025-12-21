import { Data } from '@measured/puck';
import { pageStorage } from '../pageStorage';

// Mock function to satisfy EditorPage logic without a real backend API
export const getSiteContent = async (siteId: string): Promise<Data | null> => {
  const page = await pageStorage.getPage(siteId);
  return page ? page.content : null;
};

export const saveSiteContent = async (siteId: string, data: Data): Promise<{ success: boolean; error?: string }> => {
  try {
    const page = await pageStorage.getPage(siteId);
    if (!page) {
      // Create new if not exists (though usually created via Admin first)
      await pageStorage.savePage({
        id: siteId,
        slug: siteId,
        title: 'Draft Page',
        content: data,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'draft',
      });
    } else {
      await pageStorage.savePage({ ...page, content: data });
    }
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
};
