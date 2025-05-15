'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../utils/auth-provider';
import { supabase } from '../utils/supabase';

interface UserProfile {
  username: string;
  avatar_url: string | null;
}

const Header = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }
        
        if (data) {
          setProfile(data);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    
    fetchProfile();
  }, [user]);
  
  return (
    <header className="bg-black px-4 py-2 flex items-center justify-between shadow-md sticky top-0 z-50">
    <div className="max-w-[1300px] mx-auto flex flex-1 justify-around">
    <div className="flex items-center">
      <Link href="/" className="text-2xl font-bold text-[#FF6B6B] mr-5">VibeWatch</Link>
      <button className="bg-transparent border-none text-white mr-5 flex items-center cursor-pointer">
        <span className="mr-2">☰</span> Menu
      </button>
      <select className="bg-[#121212] border border-[#333] text-white py-1.5 px-2.5 rounded mr-2.5 text-sm">
        <option>All</option>
        <option>Movies</option>
        <option>TV Shows</option>
        <option>Anime</option>
        <option>Documentaries</option>
      </select>
    </div>
    
    <div className="flex flex-1 max-w-xl mx-4">
      <input 
        type="text" 
        placeholder="Search for a movie, TV show, person..." 
        className="bg-white border-none py-1.5 px-2.5 w-full rounded-l-md text-black text-sm"
      />
      <button className="bg-white border-none py-1.5 px-3.5 rounded-r-md">
        🔍
      </button>
    </div>
    
    <div className="flex items-center">
      <Link href="/watchlist" className="text-white mx-5 text-sm">Watchlist</Link>
      <Link href="/watched" className="text-white mx-5 text-sm">Watched</Link>
      {user ? (
        <div className="text-white flex items-center text-sm group relative">
          <span className="mr-1.5">
            {profile?.username 
              ? profile.username.split('#')[0] 
              : user.email?.split('@')[0]}
          </span>
          {profile?.avatar_url ? (
            <div className="w-8 h-8 rounded-full overflow-hidden ml-1.5">
              <Image 
                src={profile.avatar_url} 
                alt={profile?.username || "User"} 
                width={32} 
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#FF6B6B] flex items-center justify-center ml-1.5">
              {user.email?.charAt(0).toUpperCase()}
            </div>
          )}
          
          <div className="absolute top-full right-0 mt-2 bg-[#1a1a1a] rounded-md shadow-lg p-2 hidden group-hover:block">
            <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-[#333] rounded">
              Profile
            </Link>
            <Link href="/settings" className="block px-4 py-2 text-sm hover:bg-[#333] rounded">
              Settings
            </Link>
            <button 
              onClick={() => signOut()}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-[#333] rounded text-red-400"
            >
              Sign Out
            </button>
          </div>
        </div>
      ) : (
        <Link href="/signin" className="text-white flex items-center text-sm">
          Sign In
          <div className="w-8 h-8 rounded-full bg-[#555] flex items-center justify-center ml-1.5">
            👤
          </div>
        </Link>
      )}
    </div>
    </div>
  </header>
  );
};

export default Header; 