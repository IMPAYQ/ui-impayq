"use client"

import { Bell, ChevronRight, Copy, HelpCircle, Lock, LogOut, Shield } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { TokenContract } from "@aztec/noir-contracts.js/Token"
import { AztecAddress } from "@aztec/aztec.js"

// Placeholder image
const USER_AVATAR = "/placeholder.svg?height=64&width=64"

export default function SettingsPage() {
  const router = useRouter()
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const { logout, username, userEmailAddr, clientCache } = useAuth()

  // Get wallet address from localStorage on component mount
  useEffect(() => {
    console.log("EFFECT")
    if (clientCache) {
      console.log("MASUK EFFECT")
      setWalletAddress(clientCache?.walletAddress)
      readContract()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Format wallet address for display
  const formattedAddress = walletAddress
    ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
    : "0x1a2...9i0j"

  // Handle logout
  const handleLogout = async () => {
    logout()
    router.push("/")
  }

  const readContract = async () => {
    if (clientCache) {
      console.log("READ CONTRACT EXECUTE")
      const TokenContractUsdc = await TokenContract.at(
        AztecAddress.fromString("0x05c0e2a52deed36664b854fa86f6cd9b733d7b4c157bfaf1ce893d108b10ed63"),
        clientCache.aztecWallet,
      )

      const balance = await TokenContractUsdc.methods.balance_of_private(clientCache.aztecWallet.getAddress())

      console.log(balance, "BALANCE CHECK")
    }
  }

  return (
    <div className="page-container page-purple">
      <h1 className="page-title mb-6">Privacy Settings</h1>

      <div className="space-y-6">
        {/* User Profile Card */}
        <div className="card">
          <div className="card-content">
            <div className="flex items-center gap-4">
              <div className="avatar">
                <Image src={USER_AVATAR || "/placeholder.svg"} height={64} width={64} alt="User" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">{username || "User"}</h3>
                <p className="text-sm text-gray-500">{userEmailAddr || "user@example.com"}</p>
                <button className="btn btn-link p-0 h-auto text-purple-500 text-sm">Edit Profile</button>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Card */}
        <div className="card">
          <div className="card-content p-0">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-medium text-gray-800 mb-1">Zero-Knowledge Wallet</h3>
              <p className="text-sm text-gray-500">Your private blockchain wallet is securely managed</p>
            </div>

            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-medium text-gray-700">Private Address</div>
                <div className="flex items-center">
                  <code className="code mr-2">{formattedAddress}</code>
                  <button
                    className="btn btn-outline btn-icon rounded-full"
                    onClick={() => {
                      if (navigator.clipboard && walletAddress) {
                        navigator.clipboard.writeText(walletAddress)
                      }
                    }}
                  >
                    <Copy size={16} className="text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center">
                  <Lock size={20} className="mr-3 text-purple-500" />
                  <span className="text-gray-700">Privacy Controls</span>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </div>

              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <Shield size={20} className="mr-3 text-purple-500" />
                  <span className="text-gray-700">Zero-Knowledge Settings</span>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Card */}
        <div className="card">
          <div className="card-content p-0">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-medium text-gray-800">Privacy Notifications</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="switch-container">
                <div className="flex items-center gap-3">
                  <Bell size={20} className="text-purple-500" />
                  <label htmlFor="rewards-notifications" className="text-gray-700">
                    Token Updates
                  </label>
                </div>
                <label className="switch">
                  <input id="rewards-notifications" type="checkbox" defaultChecked />
                  <span className="switch-slider"></span>
                </label>
              </div>

              <div className="switch-container">
                <div className="flex items-center gap-3">
                  <Bell size={20} className="text-purple-500" />
                  <label htmlFor="payment-notifications" className="text-gray-700">
                    Private Payment Confirmations
                  </label>
                </div>
                <label className="switch">
                  <input id="payment-notifications" type="checkbox" defaultChecked />
                  <span className="switch-slider"></span>
                </label>
              </div>

              <div className="switch-container">
                <div className="flex items-center gap-3">
                  <Bell size={20} className="text-purple-500" />
                  <label htmlFor="marketing-notifications" className="text-gray-700">
                    Marketing & Promotions
                  </label>
                </div>
                <label className="switch">
                  <input id="marketing-notifications" type="checkbox" />
                  <span className="switch-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid gap-4 mt-6">
          <button className="btn btn-outline bg-white rounded-full py-3 shadow-sm">
            <HelpCircle size={20} className="mr-2 text-purple-500" />
            Privacy Support
          </button>

          <button
            onClick={handleLogout}
            className="btn btn-primary rounded-full py-3"
            style={{ backgroundColor: "var(--color-red-500)" }}
          >
            <LogOut size={20} className="mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}

