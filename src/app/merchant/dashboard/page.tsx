import Link from 'next/link';

export default function MerchantDashboard() {
  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-md mt-16 text-center">
      <h2 className="text-2xl font-bold text-sage-green">Merchant Dashboard</h2>
      <div className="mt-4 text-gray-700">
        <p>Total Rewards Issued: <strong>1200</strong></p>
        <p>Current Balance: <strong>$500</strong></p>
      </div>
      <div className="mt-6 flex flex-col gap-3">
        <button className="bg-sage-green text-white py-2 px-4 rounded hover:bg-sage-dark">
          Scan QR Code
        </button>
        <button className="bg-sage-green text-white py-2 px-4 rounded hover:bg-sage-dark">
          Create Reward Token
        </button>
        <button className="bg-sage-green text-white py-2 px-4 rounded hover:bg-sage-dark">
          Set Bonus Offers
        </button>
      </div>
      <Link href="/merchant/login" className="mt-6 inline-block text-sage-green underline">
        Logout
      </Link>
    </div>
  );
}
