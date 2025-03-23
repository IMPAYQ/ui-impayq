"use client"

import { useState, useEffect } from "react"
import {
  CreditCard,
  Gift,
  Plus,
  QrCode,
  Settings,
  ArrowRight,
  Shield,
  Lock,
} from "lucide-react"
import { useRouter } from "next/navigation"

// Modals & Components
import QRScanner from "../components/QRScanner"
import PaymentConfirmation from "../components/PaymentConfirmation"
import PaymentSuccess from "../components/PaymentSuccess"

// Auth Context (includes merchant’s Aztec wallet)
import { useAuth } from "../context/AuthContext"

// AZTEC Imports
import { TokenContract } from "@aztec/noir-contracts.js/Token"
import { AztecAddress } from "@aztec/aztec.js"
import { mintTokensToPrivate } from "../context/useTransferToken"

export default function MerchantPage() {
  // -- Auth & Routing --
  const { accountType, isAuthenticated, aztecWallet } = useAuth()
  const router = useRouter()

  // -- UI State --
  const [activeTab, setActiveTab] = useState("rewards")
  const [showScanner, setShowScanner] = useState(false)
  const [scannedData, setScannedData] = useState<string | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // -- Payment Details --
  const [paymentAmount, setPaymentAmount] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [customerAddress, setCustomerAddress] = useState("")
  const [tokenName, setTokenName] = useState("")
  const [storeCredit, setStoreCredit] = useState(false)
  const [exchangeRate, setExchangeRate] = useState("1")

  // -- Redirect if not authenticated or not a merchant --
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    } else if (accountType !== "test1") {
      router.push("/") // e.g. only "test1" is a merchant type
    }
  }, [isAuthenticated, accountType, router])

  if (!isAuthenticated || accountType !== "test1") {
    // Don’t render the page if the user shouldn’t be here
    return null
  }

  // -----------------------------------------------------
  //  QR SCANNER HANDLERS
  // -----------------------------------------------------
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

  // Called when the user scans a QR. We parse out the address & amount from the string.
  const handleScan = (data: string) => {
    console.log("Scanned data:", data)
    setScannedData(data)
    setShowConfirmation(true)

    try {
      // Example format: "0xAztecAddressHere?amount=10"
      const [addressPart, queryString] = data.split("?")
      setCustomerAddress(addressPart || "")
      setPaymentAmount("")
      setCustomerName("")

      if (queryString) {
        const params = new URLSearchParams(queryString)
        const scannedAmount = params.get("amount") || ""
        setPaymentAmount(scannedAmount)
      }
    } catch (error) {
      console.error("Error parsing QR data:", error)
    }
  }

  // -----------------------------------------------------
  //  PAYMENT CONFIRMATION & AZTEC TRANSFER
  // -----------------------------------------------------
  const handleConfirmPayment = async () => {
    try {
      if (!aztecWallet) {
        throw new Error("No merchant Aztec wallet found.")
      }

      // Convert the strings to the correct types
      const userAztecAddress = AztecAddress.fromString(customerAddress)
      const amountBigInt = BigInt(paymentAmount)

      // Create a contract instance bound to the merchant’s wallet
      
      const TokenContractUsdc = await TokenContract.at(
        AztecAddress.fromString("0x2d55c209e94816dfe3bbfd6e0f5515738ddc96520dcb1ae1c8a34d6a22a950f4"),
        aztecWallet,
      )

      // Now call our helper to mint tokens
      await mintTokensToPrivate(
        TokenContractUsdc,
        aztecWallet,      // The merchant's wallet
        userAztecAddress, // The customer
        amountBigInt      // The amount to mint
      )

      alert("Tokens successfully minted!")
    } catch (error) {
      console.error("Error minting tokens:", error)
      alert("Payment failed; see console for details.")
    }
  }


  // Close confirmation modal (no transfer)
  const handleCloseConfirmation = () => {
    setShowConfirmation(false)
    setScannedData(null)
  }

  // Close success modal, reset states, log transaction
  const handleCloseSuccess = () => {
    setShowSuccess(false)
    setScannedData(null)
    setActiveTab("scanner")

    // Example “logging” of transaction
    const newTransaction = {
      id: Date.now().toString(),
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

  // -----------------------------------------------------
  //  RENDER UI
  // -----------------------------------------------------
  return (
    <div className="page-container page-green">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Business Portal</h1>
          <p className="text-gray-500">Manage your private payment system</p>
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
            Tokens
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
            Analytics
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
                    placeholder="e.g. Privacy Coins"
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
                      Allow customers to use as private payment
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
                  <Shield size={20} className="mr-2" />
                  Deploy Private Token
                </button>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-medium mb-4 text-gray-800">Redemption Options</h3>
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
                      <p className="text-sm text-gray-500">100 tokens</p>
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
                      <p className="text-sm text-gray-500">50 tokens</p>
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
                Scan Customer Private QR
              </h3>
              <p className="text-sm text-gray-500 text-center mb-4">
                Process zero-knowledge payments securely
              </p>
              <button onClick={openScanner} className="btn btn-secondary btn-full py-6">
                Open Scanner
              </button>
            </div>
          </div>

          <h3 className="text-lg font-medium mb-4 text-gray-800">
            Recent Private Transactions
          </h3>
          <div className="space-y-3">
            <div className="card">
              <div className="card-content p-3">
                <div className="flex items-center">
                  <div className="icon-bg-green p-2 rounded-full mr-3">
                    <Lock size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium text-sm text-gray-800">John D.</p>
                      <div className="badge badge-green">+25 tokens</div>
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
                    <Lock size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium text-sm text-gray-800">Sarah M.</p>
                      <div className="flex items-center">
                        <div className="badge badge-blue mr-1">$12.50</div>
                        <div className="badge badge-green">+12 tokens</div>
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
              <h3 className="card-title mb-4">Privacy Analytics</h3>
              <div className="stats-grid mb-4">
                <div className="stat-card purple-bg">
                  <p className="stat-label">Total Tokens Issued</p>
                  <p className="stat-value purple-text">12,450</p>
                </div>
                <div className="stat-card blue-bg">
                  <p className="stat-label">Active Users</p>
                  <p className="stat-value blue-text">87</p>
                </div>
                <div className="stat-card green-bg">
                  <p className="stat-label">Tokens Redeemed</p>
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
      {showScanner && <QRScanner onScan={handleScan} onClose={handleCloseScanner} />}

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
