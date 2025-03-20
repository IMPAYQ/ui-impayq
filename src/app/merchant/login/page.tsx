'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function MerchantLogin() {
  const router = useRouter();

  const handleMerchantLogin = () => {
    // Replace with your merchant authentication logic.
    router.push('/merchant/dashboard');
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-md mt-16 text-center">
      <h2 className="text-2xl font-bold text-sage-green">Merchant Login</h2>
      <input
        type="text"
        placeholder="Email or Phone"
        className="mt-4 w-full border border-gray-300 rounded p-2"
      />
      <input
        type="password"
        placeholder="Password"
        className="mt-4 w-full border border-gray-300 rounded p-2"
      />
      <button
        onClick={handleMerchantLogin}
        className="mt-6 w-full bg-sage-green text-white py-2 rounded hover:bg-sage-dark"
      >
        Login
      </button>
      <Link href="/" className="mt-4 inline-block text-sage-green underline">
        Back to Splash
      </Link>
    </div>
  );
}
