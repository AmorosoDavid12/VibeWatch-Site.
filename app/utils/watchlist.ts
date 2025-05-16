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

  try {
    // Store the media item in the user_items table
    const { error } = await supabase
      .from('user_items')
      .insert({
        user_id: userId,
        item_key: `${media.media_type}_${media.id}`, // Create a unique key for the item
        type: 'watchlist',
        value: JSON.stringify(media) // Store the entire media object
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
export const removeFromWatchlist = async (userId: string, mediaId: number, mediaType: string, dbId?: number): Promise<boolean> => {
  if (!userId) {
    console.error('User ID is required to remove from watchlist');
    return false;
  }

  try {
    let query = supabase.from('user_items').delete();
    if (dbId) {
      query = query.eq('id', dbId);
    } else {
      query = query
        .eq('user_id', userId)
        .eq('item_key', `${mediaType}_${mediaId}`)
        .eq('type', 'watchlist');
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
    const { data, error } = await supabase
      .from('user_items')
      .select('id')
      .eq('user_id', userId)
      .eq('item_key', `${mediaType}_${mediaId}`)
      .eq('type', 'watchlist')
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
      console.error('Error checking watchlist:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking watchlist:', error);
    return false;
  }
};

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
    return data.map((item: any) => {
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