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

// Function to get a specific watched item for a user
export const getWatchedItem = async (userId: string, mediaId: number): Promise<unknown | null> => {
  if (!userId) return null;

  try {
    const itemKey = `watched_${mediaId}`;
    const { data, error } = await supabase
      .from('user_items')
      .select('value')
      .eq('user_id', userId)
      .eq('type', 'watched')
      .eq('item_key', itemKey)
      .maybeSingle(); // Use maybeSingle() to get a single record or null

    if (error) {
      console.error('Error fetching watched item:', error);
      return null;
    }

    if (data && data.value) {
      return JSON.parse(data.value as string);
    }

    return null;
  } catch (error) {
    console.error('Error processing watched item:', error);
    return null;
  }
};

/**
 * Add a media item to the user's watched list in Supabase
 */
export const addToWatchedList = async (
  userId: string,
  media: TMDBMedia, // Reusing TMDBMedia type for broader compatibility
  userRating: number
): Promise<boolean> => {
  if (!userId) {
    console.error('User ID is required to add to watched list');
    return false;
  }

  // Type assertion to handle additional properties that may be present
  const mediaDetail = media as TMDBMedia & {
    genres?: { id: number; name: string }[];
    genre_ids?: number[];
    credits?: { cast?: unknown[]; crew?: unknown[] };
  };

  // Normalize the media object and add user_rating
  const normalizedMedia = {
    id: mediaDetail.id,
    title: mediaDetail.title || mediaDetail.name || 'Untitled',
    poster_path: mediaDetail.poster_path,
    media_type: mediaDetail.media_type || (mediaDetail.first_air_date ? 'tv' : 'movie'),
    release_date: mediaDetail.release_date || mediaDetail.first_air_date || '',
    vote_average: mediaDetail.vote_average || 0,
    user_rating: userRating, // Add the user's rating
    genres: mediaDetail.genres || [], // Ensure genres is an array
    genre_ids: mediaDetail.genre_ids || mediaDetail.genres?.map((g: { id: number }) => g.id) || [],
    overview: mediaDetail.overview || '',
    cast: mediaDetail.credits?.cast || [], // Attempt to get cast if available
    crew: mediaDetail.credits?.crew || [], // Attempt to get crew if available
  };

  try {
    const itemKey = `watched_${media.id}`;
    const { error } = await supabase
      .from('user_items')
      .upsert({
        user_id: userId,
        item_key: itemKey,
        type: 'watched',
        value: JSON.stringify(normalizedMedia),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id, item_key',
      });

    if (error) {
      console.error('Error adding to watched list:', error);
      return false;
    }
    console.log(`${normalizedMedia.title} added/updated in watched list with rating ${userRating}`);
    return true;
  } catch (error) {
    console.error('Error adding to watched list:', error);
    return false;
  }
};

/**
 * Remove a media item from the user's watched list in Supabase
 */
export const removeFromWatchedList = async (userId: string, mediaId: number, mediaType?: string, dbId?: number): Promise<boolean> => {
  if (!userId) {
    console.error('User ID is required to remove from watched list');
    return false;
  }

  try {
    let query = supabase.from('user_items').delete();
    if (dbId) {
      query = query.eq('id', dbId);
    } else if (mediaId && !mediaType) {
      // Mobile app style: delete by just the TMDB id using watched_[id] format
      query = query
        .eq('user_id', userId)
        .eq('type', 'watched')
        .or(`item_key.eq.watched_${mediaId},value.ilike.\"id\":${mediaId}%`); // Try both key formats
    } else {
      // Web app style with mediaType provided: try all possible formats
      query = query
        .eq('user_id', userId)
        .eq('type', 'watched')
        .or(`item_key.eq.watched_${mediaId},item_key.eq.${mediaType}_${mediaId},value.ilike.\"id\":${mediaId}%`);
    }
    const { error } = await query;
    if (error) {
      console.error('Error removing from watched list:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error removing from watched list:', error);
    return false;
  }
};