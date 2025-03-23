/* eslint-disable react/no-unescaped-entities */
"use client"

import { Shield, Zap, Wallet, Share2, Lock } from "lucide-react"
import { useEffect, useState } from "react"
import Image from "next/image"
import QRCode from "./components/Qrcode"
import { useAuth } from "./context/AuthContext"
import AuthForm from "./components/AuthForm"
import { TokenContract } from "@aztec/noir-contracts.js/Token";
import { AztecAddress, createPXEClient } from "@aztec/aztec.js"
import { getDeployedTestAccountsWallets } from "@aztec/accounts/testing"

// Placeholder images
const COFFEE_SHOP_IMG = "/placeholder.svg?height=32&width=32"
const GROCERY_STORE_IMG = "/placeholder.svg?height=32&width=32"

export default function Home() {
  const [walletAddress, setWalletAddress] = useState("")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [showPayment, setShowPayment] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showZkInfo, setShowZkInfo] = useState(false)
  // const [userBalance, setUserBalance] = useState(0)

    // const PXE_URL = process.env.PXE_URL || 'http://35.228.247.23:8080';
    // const pxe = createPXEClient(PXE_URL);

  const { isAuthenticated, username , clientCache, aztecWallet} = useAuth()

  // Check if already connected on mount
  useEffect(() => {
    // const connected = localStorage.getItem("walletConnected") === "true"
    const address = localStorage.getItem("walletAddress") || ""

    setWalletAddress(address)
    setLoading(false)
  }, [])

  useEffect(() => {
    console.log("EFFECT")
    if (aztecWallet) {
      readContract()
    }
<<<<<<< HEAD
  }, [aztecWallet])
=======
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientCache])
>>>>>>> 13513a5dea575ee965e393921e1d327aee126d44

    const readContract = async () => {
      if (aztecWallet) {
          try{            
          const TokenContractUsdc = await TokenContract.at(AztecAddress.fromString("0x2d55c209e94816dfe3bbfd6e0f5515738ddc96520dcb1ae1c8a34d6a22a950f4"), aztecWallet)  
  
<<<<<<< HEAD
          let balance = await TokenContractUsdc.methods.balance_of_private(aztecWallet.getAddress()).simulate()
=======
  
          const balance = await TokenContractUsdc.methods.balance_of_private(clientCache.aztecWallet.getAddress()).simulate()
>>>>>>> 13513a5dea575ee965e393921e1d327aee126d44
          
          setUserBalance(balance)
          } catch(err){
            console.log(err, "ERROR ")
          }
      }
    }

  // QR code value
  const qrValue = showPayment && paymentAmount ? `${walletAddress}?amount=${paymentAmount}` : walletAddress

  // If still loading, show nothing to prevent flash
  if (loading) {
    return null
  }

  // Show login screen if not connected
  if (!isAuthenticated) {
    return (
      <div className="page-container page-purple flex flex-col items-center justify-center p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">ImPayQ</h1>
          <p className="text-gray-600 mb-4">Blockchain-powered loyalty rewards</p>
        </div>

        <div className="w-full max-w-md mx-auto mb-8">
          <AuthForm />
        </div>

        <div className="grid grid-cols-3 gap-4 w-full max-w-md mx-auto">
          <div className="card">
            <div className="card-content text-center">
              <div className="icon-bg-blue p-3 rounded-full mx-auto mb-3 w-12 h-12 flex items-center justify-center">
                <Shield size={24} />
              </div>
              <h3 className="font-medium mb-1">Secure</h3>
              <p className="text-xs text-gray-500">Blockchain-powered security</p>
            </div>
          </div>

          <div className="card">
            <div className="card-content text-center">
              <div className="icon-bg-green p-3 rounded-full mx-auto mb-3 w-12 h-12 flex items-center justify-center">
                <Zap size={24} />
              </div>
              <h3 className="font-medium mb-1">Rewards</h3>
              <p className="text-xs text-gray-500">Earn at every purchase</p>
            </div>
          </div>

          <div className="card" onClick={() => setShowZkInfo(!showZkInfo)}>
            <div className="card-content text-center">
              <div className="icon-bg-purple p-3 rounded-full mx-auto mb-3 w-12 h-12 flex items-center justify-center">
                <Lock size={24} />
              </div>
              <h3 className="font-medium mb-1">ZK Email</h3>
              <p className="text-xs text-gray-500">Zero-knowledge security</p>
            </div>
          </div>
        </div>

        {showZkInfo && (
          <div className="card w-full max-w-md mx-auto mt-4">
            <div className="card-content">
              <h3 className="font-medium text-purple-700 mb-2">What is ZK Email?</h3>
              <p className="text-sm text-gray-600 mb-3">
                ZK Email is a powerful system that verifies emails using zero-knowledge proofs, based on the DKIM
                protocol.
              </p>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="icon-bg-purple p-1 rounded-full mr-2 mt-0.5">
                    <Shield size={12} className="text-white" />
                  </div>
                  <p className="text-sm text-gray-600">Your email is verified without revealing its contents</p>
                </div>
                <div className="flex items-start">
                  <div className="icon-bg-purple p-1 rounded-full mr-2 mt-0.5">
                    <Shield size={12} className="text-white" />
                  </div>
                  <p className="text-sm text-gray-600">Authentication happens through cryptographic proofs</p>
                </div>
                <div className="flex items-start">
                  <div className="icon-bg-purple p-1 rounded-full mr-2 mt-0.5">
                    <Shield size={12} className="text-white" />
                  </div>
                  <p className="text-sm text-gray-600">Your privacy is protected through zero-knowledge technology</p>
                </div>
                <div className="flex items-start">
                  <div className="icon-bg-purple p-1 rounded-full mr-2 mt-0.5">
                    <Shield size={12} className="text-white" />
                  </div>
                  <p className="text-sm text-gray-600">No passwords needed - just access to your email</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Show home dashboard for connected users
  return (
    <div className="page-container page-purple">
      <div className="page-header">
        <div>
          <h2 className="page-subtitle">Hello, {username || "User"}!</h2>
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

      <div className="balance-display">
        <div className="balance-amount">
          <span className="balance-currency">$</span>
          <span className="balance-value">{userBalance}</span>
        </div>
        <div className="balance-label">Available Balance</div>
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
                src={COFFEE_SHOP_IMG || "/placeholder.svg"}
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
                src={GROCERY_STORE_IMG || "/placeholder.svg"}
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

