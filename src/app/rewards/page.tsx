import { Gift, ShoppingBag, Coffee, Utensils, Ticket, ChevronRight } from "lucide-react"
import Link from "next/link"

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
  return (
    <div className="page-container page-blue">
      <div className="page-header">
        <h1 className="page-title">Your Rewards</h1>
        <div className="badge badge-blue">
          <Gift size={16} className="mr-1" />
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
                  <p className="text-sm text-gray-500">Available rewards</p>
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
        <h3 className="font-medium mb-4 text-gray-700">Recommended for You</h3>
        <div className="scroll-container">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="scroll-item">
              <div className="icon-bg-purple p-2 rounded-full mb-2">
                <Gift size={20} />
              </div>
              <p className="text-sm font-medium text-center">New Store Bonus</p>
              <p className="text-xs text-gray-500 text-center mt-1">Get 2x points</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

