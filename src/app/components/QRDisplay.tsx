'use client';

import { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

interface QRDisplayProps {
  amount: string;
}

export default function QRDisplay({ amount }: QRDisplayProps) {
  // Simulated wallet address; replace with your actual wallet logic.
  const [address] = useState("0x1234...ABCD");

  // Build the QR value; include amount if provided.
  const qrValue = amount ? `${address}?amount=${amount}` : address;

  return (
    <div style={{
      padding: '1rem',
      backgroundColor: '#e0e8d5',  /* Sage Light */
      borderRadius: '8px',
      display: 'inline-block'
    }}>
      <QRCodeCanvas value={qrValue} size={200} />
      <p style={{ textAlign: 'center', marginTop: '1rem', color: '#333' }}>
        Your Wallet: {address}
      </p>
    </div>
  );
}
