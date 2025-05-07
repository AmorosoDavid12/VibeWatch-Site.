'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would typically send a password reset request to your backend
    setIsSubmitted(true);
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 py-8 bg-black text-white">
      {/* Header */}
      <Link href="/" className="flex flex-col items-center mb-10">
        <div className="w-20 h-20 relative mb-4">
          <Image 
            src="/icon/adaptive-icon.png" 
            alt="VibeWatch Logo" 
            width={80} 
            height={80} 
            className="object-contain"
            priority
          />
        </div>
        <h1 className="text-3xl font-bold text-red-600">VibeWatch</h1>
      </Link>
      
      {/* Form Container */}
      <div className="w-full max-w-md bg-gray-900 rounded-lg overflow-hidden p-6">
        <h2 className="text-2xl font-semibold mb-6">Reset Password</h2>
        
        {!isSubmitted ? (
          <>
            <p className="text-gray-400 mb-6">
              Enter your email address and we&apos;ll send you instructions to reset your password.
            </p>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-white text-lg mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="your@email.com"
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <button 
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-md transition-colors"
              >
                Send Reset Link
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-medium mb-2">Check your email</h3>
            <p className="text-gray-400 mb-6">
              We&apos;ve sent password reset instructions to:<br />
              <span className="font-medium text-white">{email}</span>
            </p>
            <button 
              onClick={() => router.push('/')} 
              className="text-red-600 hover:text-red-500 font-medium"
            >
              Return to login
            </button>
          </div>
        )}
        
        <div className="mt-8 text-center">
          <Link href="/" className="text-red-600 hover:text-red-500">
            ← Back to login
          </Link>
        </div>
      </div>
    </div>
  );
} 