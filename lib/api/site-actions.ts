import { supabase, getCurrentUser } from '@/lib/supabase/client';

export interface SiteContent {
  content?: any; // Puck data
  is_published?: boolean;
  updated_at?: string;
}

export interface SaveSiteContentResult {
  success: boolean;
  error?: string;
}

/**
 * Slaat Puck data op in de Supabase database
 * Beveiligd: controleert of de gebruiker ingelogd is en of de site van de gebruiker is
 */
export async function saveSiteContent(
  siteId: string,
  puckData: any
): Promise<SaveSiteContentResult> {
  try {
    // 1. Check wie er ingelogd is
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Niet ingelogd' };
    }

    // 2. Check of de site al bestaat
    const { data: existingSite } = await supabase
      .from('sites')
      .select('id')
      .eq('id', siteId)
      .eq('user_id', user.id)
      .single();

    // 3. Sla de data op in de 'sites' tabel (upsert: update als bestaat, insert als nieuw)
    // We checken expliciet op 'user_id' zodat je niet de site van iemand anders kan overschrijven!
    const { error } = existingSite
      ? await supabase
          .from('sites')
          .update({
            content: puckData,
            updated_at: new Date().toISOString(),
            is_published: true,
          })
          .eq('id', siteId)
          .eq('user_id', user.id)
      : await supabase
          .from('sites')
          .insert({
            id: siteId,
            user_id: user.id,
            content: puckData,
            is_published: true,
          });

    if (error) {
      console.error('Save error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error saving site content:', error);
    return {
      success: false,
      error: error.message || 'Er ging iets mis bij het opslaan',
    };
  }
}

/**
 * Haalt de content van een site op
 */
export async function getSiteContent(siteId: string): Promise<any> {
  try {
    const { data, error } = await supabase
      .from('sites')
      .select('content, is_published')
      .eq('id', siteId)
      .single();

    if (error) {
      console.error('Error fetching site content:', error);
      return null;
    }

    return data?.content || null;
  } catch (error) {
    console.error('Error fetching site content:', error);
    return null;
  }
}

/**
 * Haalt een site op voor een specifieke gebruiker
 */
export async function getSite(siteId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('Niet ingelogd');
    }

    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .eq('id', siteId)
      .eq('user_id', user.id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error('Error fetching site:', error);
    throw error;
  }
}

