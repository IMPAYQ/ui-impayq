"use client"

import { ShoppingBag, Coffee, Utensils, Ticket, ChevronRight, Shield } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

// Mock data for rewards
const rewards = [
  {
    id: "1",
    merchant: "Coffee House",
    points: 250,
    icon: Coffee,
    color: "icon-blue",
    bgColor: "badge-blue",
  },
  {
    id: "2",
    merchant: "Local Diner",
    points: 520,
    icon: Utensils,
    color: "icon-pink",
    bgColor: "badge-pink",
  },
  {
    id: "3",
    merchant: "Movie Theater",
    points: 1200,
    icon: Ticket,
    color: "icon-purple",
    bgColor: "badge-purple",
  },
  {
    id: "4",
    merchant: "Grocery Store",
    points: 780,
    icon: ShoppingBag,
    color: "icon-green",
    bgColor: "badge-green",
  },
]

export default function RewardsPage() {
  const router = useRouter()
  const [isConnected, setIsConnected] = useState(false)

  // Check wallet connection status
  useEffect(() => {
    const connected = localStorage.getItem("walletConnected") === "true"
    setIsConnected(connected)

    // Redirect to home if not connected
    if (!connected) {
      router.push("/")
    }
  }, [router])

  // Don't render content if not connected
  if (!isConnected) {
    return null
  }

  return (
    <div className="page-container page-blue">
      <div className="page-header">
        <h1 className="page-title">Private Tokens</h1>
        <div className="badge badge-blue">
          <Shield size={16} className="mr-1" />
          <span className="font-semibold">2,750 total</span>
        </div>
      </div>

      <div className="space-y-4">
        {rewards.map((reward) => (
          <Link key={reward.id} href={`/rewards/${reward.id}`}>
            <div className="card">
              <div className="card-content flex items-center">
                <div className={`icon-container ${reward.color}`}>
                  <reward.icon size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{reward.merchant}</h3>
                  <p className="text-sm text-gray-500">Available tokens</p>
                </div>
                <div className="flex items-center">
                  <div className={`badge ${reward.bgColor} mr-2`}>
                    <span className="font-bold text-gray-700">{reward.points}</span>
                  </div>
                  <ChevronRight size={20} className="text-gray-400" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="activity-container mt-8">
        <h3 className="font-medium mb-4 text-gray-700">Zero-Knowledge Features</h3>
        <div className="scroll-container">
          {[
            { title: "Private Payments", desc: "100% confidential" },
            { title: "No On-Chain Footprint", desc: "Complete privacy" },
            { title: "Dual Token System", desc: "Rewards & payments" },
          ].map((item, i) => (
            <div key={i} className="scroll-item">
              <div className="icon-bg-purple p-2 rounded-full mb-2">
                <Shield size={20} />
              </div>
              <p className="text-sm font-medium text-center">{item.title}</p>
              <p className="text-xs text-gray-500 text-center mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

