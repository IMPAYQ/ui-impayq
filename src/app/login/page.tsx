'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();

  const handleLogin = () => {
    // Integrate your wallet connection logic here (e.g., using Privy)
    // For now, simulate login by redirecting to the home page.
    router.push('/home');
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-md mt-16 text-center">
      <h2 className="text-2xl font-bold text-sage-green">Login</h2>
      <p className="mt-2 text-gray-600">Connect your wallet to continue</p>
      <button
        onClick={handleLogin}
        className="mt-4 w-full bg-sage-green text-white py-2 rounded hover:bg-sage-dark"
      >
        Connect Wallet
      </button>
      <p className="mt-4">
        or{' '}
        <Link href="/" className="text-sage-green underline">
          Back to Splash
        </Link>
      </p>
    </div>
  );
}
