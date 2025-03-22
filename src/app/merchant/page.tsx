"use client"

import { useState } from "react"
import {
  Check,
  CreditCard,
  Gift,
  Plus,
  QrCode,
  Settings,
  Zap,
  ArrowRight,
} from "lucide-react"
import QRScanner from "../components/QRScanner"
import PaymentConfirmation from "../components/PaymentConfirmation"
import PaymentSuccess from "../components/PaymentSuccess"

export default function MerchantPage() {
  const [tokenName, setTokenName] = useState("")
  const [storeCredit, setStoreCredit] = useState(false)
  const [exchangeRate, setExchangeRate] = useState("1")
  const [activeTab, setActiveTab] = useState("rewards")

  // Scanner state
  const [showScanner, setShowScanner] = useState(false)
  const [scannedData, setScannedData] = useState<string | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Payment details
  const [paymentAmount, setPaymentAmount] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [customerAddress, setCustomerAddress] = useState("")

  // Handle scanned QR data
  const handleScan = (data: string) => {
    // We’ve received the raw QR data (e.g. "0xABC123...?amount=10")
    console.log("Scanned data:", data)
    setScannedData(data)
    setShowConfirmation(true)

    try {
      // Example expected format: "0xYOURADDRESS?amount=XX.XX"
      const [addressPart, queryString] = data.split("?")

      // The part before '?' is the wallet address
      setCustomerAddress(addressPart || "")

      // Reset any old values
      setPaymentAmount("")
      setCustomerName("")

      // If there's a query string (e.g., "amount=10"), parse it
      if (queryString) {
        const params = new URLSearchParams(queryString)
        const scannedAmount = params.get("amount") || ""
        // If your QR code also has `username`, you can parse that similarly:
        // const scannedUsername = params.get("username") || ""

        setPaymentAmount(scannedAmount)
        // setCustomerName(scannedUsername)
      }
    } catch (error) {
      // If something unexpected happens, we’ll see the error here
      console.error("Error parsing QR data:", error)
    }
  }

  // Called when user confirms payment in PaymentConfirmation modal
  const handleConfirmPayment = () => {
    setShowConfirmation(false)
    setShowSuccess(true)
  }

  // Open/Close scanner
  const openScanner = () => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden"
    }
    setShowScanner(true)
  }

  const handleCloseScanner = () => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = ""
    }
    setShowScanner(false)
  }

  // Close confirmation modal
  const handleCloseConfirmation = () => {
    setShowConfirmation(false)
    setScannedData(null)
  }

  // Close success modal and log the transaction
  const handleCloseSuccess = () => {
    setShowSuccess(false)
    setScannedData(null)
    setActiveTab("scanner")

    // Example: "log" a transaction
    const newTransaction = {
      id: Date.now().toString(),
      // If "customerName" is "Alice Doe", we might shorten it to "Alice"
      name: customerName.split(" ")[0] || "Customer",
      address: customerAddress,
      amount: paymentAmount,
      points: Math.floor(Number.parseFloat(paymentAmount)),
      time: new Date().toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
    }

    console.log("New transaction:", newTransaction)

    // Reset payment data
    setPaymentAmount("")
    setCustomerName("")
    setCustomerAddress("")
  }

  return (
    <div className="page-container page-green">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Merchant Portal</h1>
          <p className="text-gray-500">Manage your rewards program</p>
        </div>
        <button className="btn btn-outline btn-icon bg-white">
          <Settings size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Tabs: Rewards / Scanner / Stats */}
      <div className="tabs">
        <div className="tabs-list">
          <button
            className={`tab-trigger ${activeTab === "rewards" ? "active" : ""}`}
            onClick={() => setActiveTab("rewards")}
          >
            Rewards
          </button>
          <button
            className={`tab-trigger ${activeTab === "scanner" ? "active" : ""}`}
            onClick={() => setActiveTab("scanner")}
          >
            Scanner
          </button>
          <button
            className={`tab-trigger ${activeTab === "stats" ? "active" : ""}`}
            onClick={() => setActiveTab("stats")}
          >
            Stats
          </button>
        </div>

        {/* REWARDS TAB */}
        <div className={`tab-content ${activeTab === "rewards" ? "active" : ""}`}>
          <div className="card mb-6">
            <div className="card-content">
              <h3 className="card-title mb-4">Create Reward Token</h3>

              <div className="space-y-4">
                <div className="input-container">
                  <label htmlFor="token-name" className="input-label">
                    Token Name
                  </label>
                  <input
                    id="token-name"
                    placeholder="e.g. Coffee Coins"
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                    className="input"
                  />
                </div>

                <div className="switch-container">
                  <div>
                    <label htmlFor="store-credit" className="input-label">
                      Enable as Store Credit
                    </label>
                    <p className="text-xs text-gray-500">
                      Allow customers to use as payment
                    </p>
                  </div>
                  <label className="switch">
                    <input
                      id="store-credit"
                      type="checkbox"
                      checked={storeCredit}
                      onChange={(e) => setStoreCredit(e.target.checked)}
                    />
                    <span className="switch-slider"></span>
                  </label>
                </div>

                {storeCredit && (
                  <div className="input-container">
                    <label htmlFor="exchange-rate" className="input-label">
                      Exchange Rate ($ per token)
                    </label>
                    <input
                      id="exchange-rate"
                      type="number"
                      placeholder="1.00"
                      value={exchangeRate}
                      onChange={(e) => setExchangeRate(e.target.value)}
                      className="input"
                    />
                  </div>
                )}

                <button className="btn btn-secondary btn-full py-6">
                  <Zap size={20} className="mr-2" />
                  Deploy Token
                </button>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-medium mb-4 text-gray-800">
            Bonus Redemptions
          </h3>
          <div className="space-y-4">
            <div className="card">
              <div className="card-content">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="icon-bg-purple p-2 rounded-xl mr-3">
                      <Gift size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Free Item</h4>
                      <p className="text-sm text-gray-500">100 points</p>
                    </div>
                  </div>
                  <button className="btn btn-outline btn-icon">
                    <Settings size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-content">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="icon-bg-blue p-2 rounded-xl mr-3">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">$5 Discount</h4>
                      <p className="text-sm text-gray-500">50 points</p>
                    </div>
                  </div>
                  <button className="btn btn-outline btn-icon">
                    <Settings size={16} />
                  </button>
                </div>
              </div>
            </div>

            <button className="btn btn-outline btn-full py-3 border-dashed">
              <Plus size={20} className="mr-2" />
              Add New Redemption
            </button>
          </div>
        </div>

        {/* SCANNER TAB */}
        <div className={`tab-content ${activeTab === "scanner" ? "active" : ""}`}>
          <div className="card mb-6">
            <div className="card-content flex flex-col items-center">
              <div className="icon-bg-green p-4 rounded-xl mb-4">
                <QrCode size={48} />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Scan Customer QR Code
              </h3>
              <p className="text-sm text-gray-500 text-center mb-4">
                Scan to issue rewards or collect payment
              </p>
              <button
                onClick={openScanner}
                className="btn btn-secondary btn-full py-6"
              >
                Open Scanner
              </button>
            </div>
          </div>

          <h3 className="text-lg font-medium mb-4 text-gray-800">
            Recent Transactions
          </h3>
          <div className="space-y-3">
            <div className="card">
              <div className="card-content p-3">
                <div className="flex items-center">
                  <div className="icon-bg-green p-2 rounded-full mr-3">
                    <Check size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium text-sm text-gray-800">
                        John D.
                      </p>
                      <div className="badge badge-green">+25 points</div>
                    </div>
                    <p className="text-xs text-gray-500">Today, 9:30 AM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-content p-3">
                <div className="flex items-center">
                  <div className="icon-bg-green p-2 rounded-full mr-3">
                    <Check size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium text-sm text-gray-800">
                        Sarah M.
                      </p>
                      <div className="flex items-center">
                        <div className="badge badge-blue mr-1">$12.50</div>
                        <div className="badge badge-green">+12 points</div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Today, 8:15 AM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STATS TAB */}
        <div className={`tab-content ${activeTab === "stats" ? "active" : ""}`}>
          <div className="card mb-6">
            <div className="card-content">
              <h3 className="card-title mb-4">Rewards Overview</h3>
              <div className="stats-grid mb-4">
                <div className="stat-card purple-bg">
                  <p className="stat-label">Total Points Issued</p>
                  <p className="stat-value purple-text">12,450</p>
                </div>
                <div className="stat-card blue-bg">
                  <p className="stat-label">Active Users</p>
                  <p className="stat-value blue-text">87</p>
                </div>
                <div className="stat-card green-bg">
                  <p className="stat-label">Points Redeemed</p>
                  <p className="stat-value green-text">4,320</p>
                </div>
                <div className="stat-card orange-bg">
                  <p className="stat-label">Redemption Rate</p>
                  <p className="stat-value orange-text">34.7%</p>
                </div>
              </div>
              <button className="btn btn-outline btn-full py-3">
                View Detailed Analytics
                <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-content">
              <h3 className="card-title mb-4">Popular Redemptions</h3>

              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="icon-bg-purple p-2 rounded-xl mr-3">
                    <Gift size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium text-gray-800">Free Item</p>
                      <p className="font-medium text-gray-800">42</p>
                    </div>
                    <div className="progress-container">
                      <div
                        className="progress-bar progress-purple"
                        style={{ width: "70%" }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="icon-bg-blue p-2 rounded-xl mr-3">
                    <CreditCard size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium text-gray-800">$5 Discount</p>
                      <p className="font-medium text-gray-800">28</p>
                    </div>
                    <div className="progress-container">
                      <div
                        className="progress-bar progress-blue"
                        style={{ width: "45%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner onScan={handleScan} onClose={handleCloseScanner} />
      )}

      {/* Payment Confirmation Modal */}
      {showConfirmation && scannedData && (
        <PaymentConfirmation
          qrData={scannedData}
          onConfirm={handleConfirmPayment}
          onCancel={handleCloseConfirmation}
        />
      )}

      {/* Payment Success Modal */}
      {showSuccess && (
        <PaymentSuccess
          amount={paymentAmount}
          username={customerName}
          onClose={handleCloseSuccess}
        />
      )}
    </div>
  )
}
