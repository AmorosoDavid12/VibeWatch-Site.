import React from 'react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-20">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-20">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Privacy Policy</h1>
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
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-sm text-gray-500 mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
            
            <p className="mb-4">
              Thank you for using our app. This Privacy Policy explains how we collect, use, and share your information when you use our application.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">Information We Collect</h2>
            
            <p className="mb-2">
              <span className="font-bold">Personal Information:</span> When you create an account, we collect your email address, username, and password.
            </p>
            
            <p className="mb-2">
              <span className="font-bold">Profile Information:</span> Any profile information you provide, including profile pictures and other account details.
            </p>
            
            <p className="mb-2">
              <span className="font-bold">Usage Information:</span> We collect information about how you interact with our app, including the content you view and features you use.
            </p>
            
            <p className="mb-4">
              <span className="font-bold">Device Information:</span> We collect information about your device, including device model, operating system, unique device identifiers, and mobile network information.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">Advertising</h2>
            
            <p className="mb-2">
              Our app uses Google AdMob to serve advertisements. AdMob may collect and process information about you, including:
            </p>
            
            <ul className="list-disc pl-6 mb-4">
              <li>Advertising ID or similar identifiers</li>
              <li>IP address</li>
              <li>Device information</li>
              <li>Geographic location</li>
            </ul>
            
            <p className="mb-4">
              Google uses this information to provide personalized advertisements. You can opt out of personalized advertising by visiting Google&apos;s Ads Settings.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">Data Sharing and Disclosure</h2>
            
            <p className="mb-2">
              We may share your information with:
            </p>
            
            <ul className="list-disc pl-6 mb-4">
              <li>Service providers who help us operate our app</li>
              <li>Advertising partners, including Google AdMob</li>
              <li>Legal authorities when required by law</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3">Your Choices</h2>
            
            <p className="mb-2">
              You can:
            </p>
            
            <ul className="list-disc pl-6 mb-4">
              <li>Update or delete your account information</li>
              <li>Opt out of marketing communications</li>
              <li>Adjust your device&apos;s privacy settings to limit ad tracking</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3">Data Security</h2>
            
            <p className="mb-4">
              We implement reasonable security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">Children&apos;s Privacy</h2>
            
            <p className="mb-4">
              Our app is not directed to children under 13. We do not knowingly collect information from children under 13. If you are a parent or guardian and believe we have collected information from your child, please contact us.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">Changes to This Privacy Policy</h2>
            
            <p className="mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">Contact Us</h2>
            
            <p className="mb-4">
              If you have any questions about this Privacy Policy, please contact us at support@vibewatchapp.com.
            </p>
          </div>
        </div>
      </div>
      
      <Navigation />
    </main>
  );
} 