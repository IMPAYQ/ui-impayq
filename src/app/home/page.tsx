'use client';

import { useState } from 'react';
import Link from 'next/link';
import QRDisplay from '../../app/components/QRDisplay';

export default function HomePage() {
  const [amount, setAmount] = useState("");

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-md mt-16 text-center">
      <h2 className="text-2xl font-bold text-sage-green">Welcome to IMPayQ</h2>
      <div className="my-8">
        <QRDisplay amount={amount} />
        <input
          type="number"
          placeholder="Enter amount (optional)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-4 w-4/5 border border-gray-300 rounded p-2"
        />
      </div>
      <Link
        href="/home/send"
        className="inline-block bg-sage-green text-white py-2 px-4 rounded hover:bg-sage-dark"
      >
        Send Rewards to Friends
      </Link>
      <div className="mt-6 space-x-4">
        <Link href="/rewards" className="text-sage-green underline">
          View My Rewards
        </Link>
        <Link href="/transactionHistory" className="text-sage-green underline">
          Transaction History
        </Link>
      </div>
    </div>
  );
}
