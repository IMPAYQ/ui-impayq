"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Gift, Shield, Lock } from "lucide-react"

interface PaymentConfirmationProps {
  qrData: string
  onConfirm: () => void
  onCancel: () => void
}

export default function PaymentConfirmation({ qrData, onConfirm, onCancel }: PaymentConfirmationProps) {
  // We'll store each piece of parsed data separately
  const [walletAddress, setWalletAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [username, setUsername] = useState("")

  const [isProcessing, setIsProcessing] = useState(false)

  // Parse the QR data (e.g. "0xABC123...?amount=10.50&username=Alice")
  useEffect(() => {
    try {
      // Split on "?"
      // Example: "0xABC123...?amount=10.50" => ["0xABC123...", "amount=10.50"]
      const [addressPart, queryString] = qrData.split("?") // or `""` if missing

      // 1. Address is everything before '?'
      if (addressPart) {
        setWalletAddress(addressPart)
      }

      // 2. Parse the query string if present
      if (queryString) {
        const params = new URLSearchParams(queryString)
        const scannedAmount = params.get("amount") || ""
        const scannedUsername = params.get("username") || ""
        setAmount(scannedAmount)
        setUsername(scannedUsername)
      }
    } catch (error) {
      // If we fail for any reason, log it (you can show an error if needed)
      console.error("Error parsing QR data:", error)
    }
  }, [qrData])

  const handleConfirm = () => {
    setIsProcessing(true)

    // Simulate a 2-second "payment processing" delay
    setTimeout(() => {
      setIsProcessing(false)
      onConfirm()
    }, 2000)
  }

  // If no wallet address is found, show an error
  if (!walletAddress) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-6">
        <p>Invalid QR code data</p>
        <button onClick={onCancel} className="btn btn-primary mt-4">
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ maxWidth: "28rem", margin: "0 auto", borderRadius: "var(--radius-3xl)", overflow: "hidden" }}
    >
      <div className="bg-white w-full h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center">
          <button onClick={onCancel} className="btn btn-icon">
            <ArrowLeft size={20} />
          </button>
          <h3 className="text-lg font-medium ml-4">Private Payment</h3>
        </div>

        {/* Main content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Shield size={32} className="text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold">{username || "Customer"}</h3>
            <p className="text-gray-500 text-sm mt-1">
              {/* Truncate the wallet address */}
              {walletAddress.slice(0, 6)}...
              {walletAddress.slice(-4)}
            </p>
          </div>

          <div className="card mb-6">
            <div className="card-content">
              <h4 className="text-gray-500 text-sm mb-1">Amount</h4>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold">
                  {/* Show a $ prefix if you expect standard currency */}${amount}
                </p>
                <Lock size={24} className="text-purple-500" />
              </div>
            </div>
          </div>

          <div className="card mb-6">
            <div className="card-content">
              <h4 className="text-gray-500 text-sm mb-2">Transaction Details</h4>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <p className="text-gray-600">Transaction Type</p>
                  <p className="font-medium">Private Payment</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Date & Time</p>
                  <p className="font-medium">{new Date().toLocaleString()}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Tokens</p>
                  <div className="badge badge-purple">
                    <Gift size={12} className="mr-1" />+{Math.floor(Number.parseFloat(amount) || 0)} tokens
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4">
            <button onClick={onCancel} className="btn btn-outline">
              Cancel
            </button>
            <button onClick={handleConfirm} className="btn btn-primary" disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                "Confirm Payment"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

