"use client"

import { useState } from "react"
import { Wallet, Share2 } from "lucide-react"
import QRCode from "../app/components/Qrcode"

export default function Home() {
  const [paymentAmount, setPaymentAmount] = useState("")
  const [showPayment, setShowPayment] = useState(false)

  // This would be the user's wallet address in a real implementation
  const userAddress = "0x1a2b3c4d5e6f7g8h9i0j"

  // In a real implementation, this would generate a QR code with payment info
  const qrValue = showPayment && paymentAmount ? `${userAddress}?amount=${paymentAmount}` : userAddress

  return (
    <div className="page-container page-purple">
      <div className="page-header">
        <div>
          <h2 className="page-subtitle">Hello, Antonio!</h2>
          <h1 className="page-title">Let's get rewarded!</h1>
        </div>
        <div className="icon-bg-purple p-2 rounded-full">
          <Wallet size={24} />
        </div>
      </div>

      <div className="qr-container">
        <div className="qr-blur"></div>
        <div className="qr-card">
          <div className="qr-gradient"></div>
          <div className="qr-content">
            <div className="qr-header">
              <div className="qr-label">Your QR Code</div>
              {showPayment && <div className="qr-amount">${paymentAmount}</div>}
            </div>
            <QRCode value={qrValue} size={220} />
            <div className="qr-footer">
              <div className="qr-hint">Scan to pay or earn rewards</div>
            </div>
          </div>
        </div>
      </div>

      <div className="input-group mb-4">
        <input
          type="number"
          placeholder="Enter amount to pay"
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(e.target.value)}
          className="input flex-1"
        />
        <button
          onClick={() => setShowPayment(!showPayment)}
          className={`btn ${showPayment ? "btn-secondary" : "btn-outline"}`}
        >
          {showPayment ? "Update" : "Add Payment"}
        </button>
      </div>

      <button className="btn btn-primary btn-full">
        <Share2 size={16} className="mr-2" />
        Send to Friends
      </button>

      <div className="activity-container">
        <h3 className="font-medium mb-3 text-gray-700">Recent Activity</h3>
        <div className="space-y-3">
          <div className="activity-item">
            <div className="activity-icon">
              <img
                src="/placeholder.svg?height=32&width=32"
                width={32}
                height={32}
                alt="Coffee Shop"
                className="rounded-full"
              />
            </div>
            <div className="activity-content">
              <div className="activity-header">
                <p className="activity-merchant">Coffee Shop</p>
                <p className="activity-points">+25 points</p>
              </div>
              <p className="activity-time">Today, 9:30 AM</p>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">
              <img
                src="/placeholder.svg?height=32&width=32"
                width={32}
                height={32}
                alt="Grocery Store"
                className="rounded-full"
              />
            </div>
            <div className="activity-content">
              <div className="activity-header">
                <p className="activity-merchant">Grocery Store</p>
                <p className="activity-points">+50 points</p>
              </div>
              <p className="activity-time">Yesterday, 2:15 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

