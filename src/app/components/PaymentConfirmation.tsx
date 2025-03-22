"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, CreditCard, Gift, User } from "lucide-react"

interface PaymentConfirmationProps {
  qrData: string
  onConfirm: () => void
  onCancel: () => void
}

export default function PaymentConfirmation({ qrData, onConfirm, onCancel }: PaymentConfirmationProps) {
  const [parsedData, setParsedData] = useState<{
    walletAddress: string
    amount: string
    username: string
    timestamp: string
  } | null>(null)

  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    try {
      const data = JSON.parse(qrData)
      setParsedData(data)
    } catch (error) {
      console.error("Error parsing QR data:", error)
    }
  }, [qrData])

  const handleConfirm = () => {
    setIsProcessing(true)

    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false)
      onConfirm()
    }, 2000)
  }

  if (!parsedData) {
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
        <div className="p-4 border-b border-gray-100 flex items-center">
          <button onClick={onCancel} className="btn btn-icon">
            <ArrowLeft size={20} />
          </button>
          <h3 className="text-lg font-medium ml-4">Payment Confirmation</h3>
        </div>

        <div className="flex-1 p-6 overflow-auto">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <User size={32} className="text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold">{parsedData.username}</h3>
            <p className="text-gray-500 text-sm mt-1">
              {parsedData.walletAddress.substring(0, 6)}...
              {parsedData.walletAddress.substring(parsedData.walletAddress.length - 4)}
            </p>
          </div>

          <div className="card mb-6">
            <div className="card-content">
              <h4 className="text-gray-500 text-sm mb-1">Amount</h4>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold">${parsedData.amount}</p>
                <CreditCard size={24} className="text-purple-500" />
              </div>
            </div>
          </div>

          <div className="card mb-6">
            <div className="card-content">
              <h4 className="text-gray-500 text-sm mb-2">Transaction Details</h4>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <p className="text-gray-600">Transaction Type</p>
                  <p className="font-medium">Payment</p>
                </div>

                <div className="flex justify-between">
                  <p className="text-gray-600">Date & Time</p>
                  <p className="font-medium">{new Date().toLocaleString()}</p>
                </div>

                <div className="flex justify-between">
                  <p className="text-gray-600">Rewards</p>
                  <div className="badge badge-purple">
                    <Gift size={12} className="mr-1" />+{Math.floor(Number.parseFloat(parsedData.amount))} points
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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

