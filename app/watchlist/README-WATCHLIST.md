# VibeWatch Watchlist Functionality

This document explains the watchlist functionality implemented in the VibeWatch application.

## Overview

The watchlist feature allows users to save movies and TV shows they want to watch later. The implementation uses Supabase as the backend database to store user watchlist items.

## Database Schema

The watchlist data is stored in the `user_items` table with the following structure:

```sql
CREATE TABLE public.user_items (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_key TEXT NOT NULL, -- Format: media_type_id (e.g., movie_123, tv_456)
  type TEXT NOT NULL, -- 'watchlist', 'watched', etc.
  value JSONB NOT NULL, -- Stores the complete media item data
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, item_key, type)
);
```

## Setup Instructions

1. Make sure you have a Supabase project set up and connected to your application.
2. Run the SQL migration script located at `supabase/migrations/20240101000000_create_watchlist_tables.sql` in your Supabase SQL editor.
3. Ensure your application has the proper authentication set up to identify users.

## Implementation Details

### Utility Functions

The watchlist functionality is implemented through utility functions in `app/utils/watchlist.ts`:

- `addToWatchlist`: Adds a media item to the user's watchlist
- `removeFromWatchlist`: Removes a media item from the user's watchlist
- `isInWatchlist`: Checks if a media item is in the user's watchlist
- `getWatchlist`: Retrieves all items in the user's watchlist

### Integration Points

1. **Home Page**: Users can add/remove items from their watchlist directly from the home page.
2. **Watchlist Page**: Users can view all items in their watchlist and remove items.

## Security

The implementation includes Row Level Security (RLS) policies to ensure users can only access their own watchlist items:

- Users can only view their own items
- Users can only insert their own items
- Users can only update their own items
- Users can only delete their own items

## Usage Example

```typescript
// Add an item to watchlist
const success = await addToWatchlist(userId, mediaItem);

// Remove an item from watchlist
const success = await removeFromWatchlist(userId, mediaId, mediaType);

// Check if an item is in the watchlist
const isInList = await isInWatchlist(userId, mediaId, mediaType);

// Get all watchlist items
const watchlistItems = await getWatchlist(userId);
```