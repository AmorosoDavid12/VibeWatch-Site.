import { supabase } from './supabase';
import { TMDBMedia } from './tmdb-api';

/**
 * Add a media item to the user's watchlist in Supabase
 */
export const addToWatchlist = async (userId: string, media: TMDBMedia): Promise<boolean> => {
  if (!userId) {
    console.error('User ID is required to add to watchlist');
    return false;
  }

  // Normalize the media object to match the mobile app's expected structure
  const normalizedMedia = {
    id: media.id,
    title: media.title || media.name || 'Untitled',
    poster_path: media.poster_path,
    media_type: media.media_type || (media.first_air_date ? 'tv' : 'movie'),
    release_date: media.release_date || media.first_air_date || '',
    vote_average: media.vote_average || 0,
    genres: [],
    genre_ids: ('genre_ids' in media ? media.genre_ids : []) as number[],
    overview: media.overview || '',
    cast: [],
    crew: [],
    position: 0, // The mobile app expects position for ordering
    added_at: Date.now() // Timestamp when added
  };

  try {
    // Store the normalized media item in the user_items table with mobile app compatible key format
    const { error } = await supabase
      .from('user_items')
      .insert({
        user_id: userId,
        item_key: `watchlist_${normalizedMedia.id}`, // Match mobile app format: watchlist_[id]
        type: 'watchlist',
        value: JSON.stringify(normalizedMedia)
      });

    if (error) {
      console.error('Error adding to watchlist:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    return false;
  }
};

/**
 * Remove a media item from the user's watchlist in Supabase
 */
export const removeFromWatchlist = async (userId: string, mediaId: number, mediaType?: string, dbId?: number): Promise<boolean> => {
  if (!userId) {
    console.error('User ID is required to remove from watchlist');
    return false;
  }

  try {
    let query = supabase.from('user_items').delete();
    if (dbId) {
      // If we have the database ID, use that for most precise deletion
      query = query.eq('id', dbId);
    } else if (mediaId && !mediaType) {
      // Mobile app style: delete by just the TMDB id using watchlist_[id] format
      query = query
        .eq('user_id', userId)
        .eq('type', 'watchlist')
        .or(`item_key.eq.watchlist_${mediaId},value.ilike.%"id":${mediaId}%`); // Try both key formats
    } else {
      // Web app style with mediaType provided: try all possible formats
      query = query
        .eq('user_id', userId)
        .eq('type', 'watchlist')
        .or(`item_key.eq.watchlist_${mediaId},item_key.eq.${mediaType}_${mediaId},value.ilike.%"id":${mediaId}%`);
    }
    const { error } = await query;
    if (error) {
      console.error('Error removing from watchlist:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return false;
  }
};

/**
 * Check if a media item is in the user's watchlist
 */
export const isInWatchlist = async (userId: string, mediaId: number, mediaType: string): Promise<boolean> => {
  if (!userId) return false;

  try {
    // Check for either the mobile format (watchlist_[id]) or web format ([media_type]_[id])
    const { data, error } = await supabase
      .from('user_items')
      .select('id')
      .eq('user_id', userId)
      .eq('type', 'watchlist')
      .or(`item_key.eq.watchlist_${mediaId},item_key.eq.${mediaType}_${mediaId}`);

    if (error) {
      console.error('Error checking watchlist:', error);
      return false;
    }

    return data && data.length > 0;
  } catch (error) {
    console.error('Error checking watchlist:', error);
    return false;
  }
};

// Add a type for the DB row
interface UserItemRow {
  id: number;
  user_id: string;
  item_key: string;
  value: string;
  type: string;
  updated_at: string;
}

/**
 * Get all items in the user's watchlist
 */
export const getWatchlist = async (userId: string) => {
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from('user_items')
      .select('*')
      .eq('user_id', userId)
      .eq('type', 'watchlist')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching watchlist:', error);
      return [];
    }

    // Transform the data to extract the information from the value JSON
    return (data as UserItemRow[]).map((item) => {
      const value = JSON.parse(item.value);
      return {
        id: value.id,
        title: value.title || value.name,
        imageUrl: value.poster_path ? `https://image.tmdb.org/t/p/w500${value.poster_path}` : '/placeholder.jpg',
        rating: value.vote_average,
        year: value.release_date ? new Date(value.release_date).getFullYear() : 
              value.first_air_date ? new Date(value.first_air_date).getFullYear() : 'Unknown',
        userRating: value.user_rating,
        mediaType: value.media_type,
        dbId: item.id // Original database ID for removal operations
      };
    });
  } catch (error) {
    console.error('Error processing watchlist:', error);
    return [];
  }
};