'use client';

import { useState } from 'react';
import Link from 'next/link';
import QRDisplay from '../app/components/QRDisplay';
import styles from './homepage.module.css';

export default function HomePage() {
  const [amount, setAmount] = useState("");

  return (
    <div className={styles.container}>
      <h2>Welcome to IMPayQ</h2>
      <div className={styles.qrSection}>
        <QRDisplay amount={amount} />
        <input
          type="number"
          placeholder="Enter amount (optional)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={styles.amountInput}
        />
      </div>
      <Link href="/home/send">
        Send Rewards to Friends
      </Link>
      <div className={styles.links}>
        <Link href="/rewards">
          View My Rewards
        </Link>
        <Link href="/transactionHistory">
          Transaction History
        </Link>
      </div>
    </div>
  );
}
