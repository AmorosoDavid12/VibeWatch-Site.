'use client';

import React from 'react';
import Header from '../components/Header';
import Link from 'next/link';

const DeleteAccountPage = () => {
  const appName = "VibeWatch"; // Or dynamically get app name if available

  return (
    <div className="bg-[#121212] text-white min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-20">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Delete Your {appName} Account</h1>
            <Link 
              href="/"
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-netflix-red dark:hover:text-netflix-red"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              Back
            </Link>
          </div>
          
          <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
            <p className="mb-4">We&apos;re committed to your privacy. This page allows you to request the deletion of your {appName} account and associated data.</p>

            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">What Happens When You Delete Your Account</h2>
            <p className="mb-2">Deleting your account will:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Remove your personal information (e.g., name, email).</li>
              <li>Erase your activity history and preferences.</li>
              <li>Delete any uploaded content (e.g., images, posts).</li>
              <li>Revoke access to the app&apos;s features.</li>
            </ul>
            <p className="mb-4"><em>Note: Some data may be retained for legal or security reasons, as detailed in our Privacy Policy.</em></p>

            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">How to Request Account Deletion</h2>
            <p className="mb-2">To delete your account:</p>
            <ol className="list-decimal pl-6 mb-4">
              <li>Email us at <a href="mailto:system@vibewatch.app" className="text-netflix-red hover:underline">system@vibewatch.app</a> with the subject line &quot;Account Deletion Request.&quot;</li>
              <li>Include your registered email address and username in the message.</li>
              <li>We&apos;ll process your request within 7 days and confirm via email.</li>
            </ol>
            <p className="mb-2">Alternatively, if your app supports in-app deletion:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Navigate to Settings &gt; Account &gt; Delete Account within the app.</li>
              <li>Follow the on-screen instructions to complete the process.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">Data Retention Policy</h2>
            <p className="mb-2">Upon account deletion:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>All user data is permanently removed from our servers within 30 days.</li>
              <li>Data required for legal obligations may be retained as specified in our Privacy Policy.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">Contact Us</h2>
            <p className="mb-4">For questions or concerns, contact our support team at <a href="mailto:system@vibewatch.app" className="text-netflix-red hover:underline">system@vibewatch.app</a>.</p>
          </div>
        </div>
      </div>
    </div>  
  );
};

export default DeleteAccountPage;
