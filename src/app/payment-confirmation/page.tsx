'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PaymentConfirmation() {
  const router = useRouter();

  const handleConfirm = () => {
    // Implement your payment processing logic here.
    alert("Payment processed successfully!");
    router.push('/home');
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-md mt-16 text-center">
      <h2 className="text-2xl font-bold text-sage-green">Payment Confirmation</h2>
      <div className="mt-4 text-gray-700">
        <p>Merchant: <strong>Merchant XYZ</strong></p>
        <p>Amount: <strong>$25.00</strong></p>
      </div>
      <button
        onClick={handleConfirm}
        className="mt-6 w-full bg-sage-green text-white py-2 rounded hover:bg-sage-dark"
      >
        Confirm Payment
      </button>
      <Link href="/home" className="mt-4 inline-block text-sage-green underline">
        Back to Home
      </Link>
    </div>
  );
}
