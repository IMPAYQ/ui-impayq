import { ArrowLeft, Coffee, Gift, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock data for a specific merchant's rewards
const merchantData = {
  id: "1",
  name: "Coffee House",
  points: 250,
  icon: Coffee,
  color: "icon-blue",
  bgColor: "badge-blue",
  rewards: [
    {
      id: "r1",
      name: "Free Coffee",
      description: "Any size, any flavor",
      points: 150,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "r2",
      name: "Pastry Discount",
      description: "50% off any pastry",
      points: 100,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "r3",
      name: "Coffee Bundle",
      description: "5 coffees for the price of 3",
      points: 400,
      image: "/placeholder.svg?height=60&width=60",
    },
  ],
}

export default function MerchantRewardsPage() {
  // In a real app, we would fetch the merchant data based on the ID
  // For this demo, we'll just use the mock data

  return (
    <div className="page-container page-blue">
      <div className="flex items-center mb-6">
        <Link href="/rewards">
          <button className="btn btn-outline btn-icon mr-2 bg-white">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
        </Link>
        <h1 className="page-title">{merchantData.name}</h1>
      </div>

      <div className="card mb-6">
        <div className="card-content">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className={`icon-container ${merchantData.color}`}>
                <merchantData.icon size={24} />
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-800">Your Balance</h2>
                <p className="text-sm text-gray-500">Available to redeem</p>
              </div>
            </div>
            <div className={`badge ${merchantData.bgColor} px-4 py-2`}>
              <span className="font-bold text-xl text-gray-800">{merchantData.points}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-medium mb-3 text-gray-800">Redeem Rewards</h3>
        <div className="space-y-4">
          {merchantData.rewards.map((reward) => (
            <div key={reward.id} className="card">
              <div className="card-content p-0">
                <div className="flex p-4">
                  <div className="icon-bg-blue p-2 rounded-xl mr-3">
                    <Image
                      src={reward.image || "/placeholder.svg"}
                      width={64}
                      height={64}
                      alt={reward.name}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-gray-800">{reward.name}</h4>
                      <div className="badge badge-blue">
                        <Star size={12} className="mr-1 fill-current" />
                        {reward.points}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{reward.description}</p>
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <button
                  className={`btn w-full ${
                    merchantData.points >= reward.points ? "btn-secondary" : "btn-outline btn-disabled"
                  }`}
                  disabled={merchantData.points < reward.points}
                >
                  <Gift size={16} className="mr-2" />
                  Redeem Reward
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <button className="btn btn-primary btn-full">Convert to Store Credit</button>
      </div>
    </div>
  )
}

