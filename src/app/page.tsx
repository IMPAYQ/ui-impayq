/* eslint-disable react/no-unescaped-entities */
"use client"

import { Shield, Zap, Wallet, Share2 } from "lucide-react"
import { useEffect, useState } from "react"
import Image from "next/image"
import QRCode from "./components/Qrcode"
import { useLogin, useWallets, usePrivy } from "@privy-io/react-auth"

export default function Home() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [showPayment, setShowPayment] = useState(false)
  const [loading, setLoading] = useState(true)

  const { ready, authenticated } = usePrivy()
  const { wallets } = useWallets();
  const { login } = useLogin()
  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated)

  // Function to handle wallet connection
  const handleConnect = () => {
    console.log("Connecting wallet...")
    const newAddress = wallets[0].address

    // Store connection state in localStorage
    localStorage.setItem("walletConnected", "true")
    localStorage.setItem("walletAddress", newAddress)

    // Force a reload to ensure all components pick up the new connection state
    window.location.reload()
  }

  // Check if already connected on mount
  useEffect(() => {
    const connected = localStorage.getItem("walletConnected") === "true"
    const address = localStorage.getItem("walletAddress") || ""

    setIsConnected(connected)
    setWalletAddress(address)
    setLoading(false)
  }, [])

  // *Here's the new effect*:
  // If user is authenticated via Privy but not yet connected, auto‐trigger handleConnect()
  useEffect(() => {
    if (authenticated && !isConnected) {
      handleConnect()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, isConnected])

  // QR code value
  const qrValue = showPayment && paymentAmount ? `${walletAddress}?amount=${paymentAmount}` : walletAddress

  // If still loading, show nothing to prevent flash
  if (loading) {
    return null
  }

  // Show login screen if not connected
  if (!isConnected) {
    return (
      <div className="page-container page-purple flex flex-col items-center justify-center p-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">ImPayQ</h1>
          <p className="text-gray-600 mb-8">Blockchain-powered loyalty rewards</p>
        </div>

        <div className="card w-full mb-8">
          <div className="card-content text-center">
            <div className="icon-bg-purple p-4 rounded-full mx-auto mb-4">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 8V12L14 14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
            <p className="text-gray-500 mb-6">Connect your wallet to access rewards and payments</p>

            <button
              disabled={disableLogin}
              onClick={() =>
                login({
                  loginMethods: ["wallet"],
                  walletChainType: "ethereum-only",
                  disableSignup: false,
                })
              }
              style={{
                backgroundColor: "#fb923c",
                color: "white",
                padding: "16px",
                borderRadius: "9999px",
                width: "100%",
                fontWeight: "500",
                cursor: "pointer",
                border: "none",
              }}
            >
              Connect Wallet
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="card">
            <div className="card-content text-center">
              <div className="icon-bg-blue p-3 rounded-full mx-auto mb-3">
                <Shield size={24} />
              </div>
              <h3 className="font-medium mb-1">Secure</h3>
              <p className="text-xs text-gray-500">Blockchain-powered security</p>
            </div>
          </div>

          <div className="card">
            <div className="card-content text-center">
              <div className="icon-bg-green p-3 rounded-full mx-auto mb-3">
                <Zap size={24} />
              </div>
              <h3 className="font-medium mb-1">Rewards</h3>
              <p className="text-xs text-gray-500">Earn at every purchase</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show home dashboard for connected users
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
              <Image
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
              <Image
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
