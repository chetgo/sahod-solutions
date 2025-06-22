// src/app/page.tsx - Test Firebase connection
'use client';

import { useEffect, useState } from 'react';
import { db, auth, isProduction, isStaging } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function Home() {
  const [firebaseStatus, setFirebaseStatus] = useState<string>('Testing...');
  const [connectionTest, setConnectionTest] = useState<string>('Not tested');

  useEffect(() => {
    // Test Firebase environment variables
    console.log('🔧 Environment Tests:');
    console.log('Firebase Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
    console.log('Environment:', process.env.NEXT_PUBLIC_ENVIRONMENT);
    console.log('Is Production:', isProduction);
    console.log('Is Staging:', isStaging);
    console.log('Firebase API Key:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 10) + '...');
    console.log('Firebase Auth Domain:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);

    // Test Firebase initialization
    if (db && auth) {
      setFirebaseStatus('✅ Firebase initialized successfully');
      console.log('✅ Firebase Services:', { db, auth });
      
      // Test Firestore connection (basic read attempt)
      testFirestoreConnection();
    } else {
      setFirebaseStatus('❌ Firebase initialization failed');
      console.error('❌ Firebase initialization failed');
    }
  }, []);

  const testFirestoreConnection = async () => {
    try {
      // Try to read from a test collection (this should work even with security rules)
      console.log('🔍 Testing Firestore connection...');
      
      // This will test the connection but might fail due to security rules (which is expected)
      const testCollection = collection(db, 'connection-test');
      await getDocs(testCollection);
      
      setConnectionTest('✅ Firestore connection successful');
      console.log('✅ Firestore connection successful');
    } catch (error: unknown) {
      const err = error as { code?: string };
      if (err.code === 'permission-denied') {
        setConnectionTest('✅ Firestore connected (permission denied expected)');
        console.log('✅ Firestore connected - Permission denied is expected with security rules');
      } else if (err.code === 'unavailable') {
        setConnectionTest('❌ Firestore unavailable - Check internet connection');
        console.error('❌ Firestore unavailable:', error);
      } else {
        setConnectionTest(`⚠️ Firestore error: ${err.code || 'unknown'}`);
        console.error('⚠️ Firestore error:', error);
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          🇵🇭 Sahod.solutions - Firebase Connection Test
        </p>
      </div>

      <div className="relative flex place-items-center flex-col space-y-8">
        <h1 className="text-4xl font-bold text-center">
          🇵🇭 Sahod.solutions
        </h1>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border">
          <h2 className="text-xl font-semibold mb-4">🔧 System Status</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Environment:</span>
              <span className={`px-2 py-1 rounded text-sm ${
                isProduction ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {process.env.NEXT_PUBLIC_ENVIRONMENT}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Project:</span>
              <span className="font-mono text-sm">
                {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Firebase Status:</span>
              <span className="text-sm">{firebaseStatus}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Firestore Test:</span>
              <span className="text-sm">{connectionTest}</span>
            </div>
          </div>
        </div>

        <div className="text-center bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800">
            📱 <strong>Check browser console</strong> for detailed Firebase connection logs
          </p>
        </div>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">
            Multi-Tenant Security{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              🔒
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Complete data isolation between companies
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">
            Philippine Compliance{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              🇵🇭
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            SSS, PhilHealth, Pag-IBIG, BIR ready
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">
            Kiosk Optimized{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              🏭
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Manufacturing plant time tracking
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">
            Bank Ready{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              🏦
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            BPI, BDO, Metrobank CSV export
          </p>
        </div>
      </div>
    </main>
  );
}