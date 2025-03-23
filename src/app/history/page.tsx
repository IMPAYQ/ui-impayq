import { ArrowDownLeft, ArrowUpRight, Coffee, ShoppingBag, Utensils, Lock } from "lucide-react"

// Mock data for transaction history
const transactions = [
  {
    id: "t1",
    merchant: "Coffee House",
    icon: Coffee,
    color: "icon-blue",
    bgColor: "badge-blue",
    type: "earned",
    amount: 50,
    points: 50,
    date: "Today, 9:30 AM",
  },
  {
    id: "t2",
    merchant: "Local Diner",
    icon: Utensils,
    color: "icon-pink",
    bgColor: "badge-pink",
    type: "payment",
    amount: 24.99,
    points: 25,
    date: "Yesterday, 7:15 PM",
  },
  {
    id: "t3",
    merchant: "Grocery Store",
    icon: ShoppingBag,
    color: "icon-green",
    bgColor: "badge-green",
    type: "redeemed",
    amount: 0,
    points: -200,
    date: "Mar 19, 2:45 PM",
  },
  {
    id: "t4",
    merchant: "Coffee House",
    icon: Coffee,
    color: "icon-blue",
    bgColor: "badge-blue",
    type: "payment",
    amount: 5.75,
    points: 6,
    date: "Mar 18, 10:20 AM",
  },
]

export default function HistoryPage() {
  return (
    <div className="page-container page-green">
      <h1 className="page-title mb-6">Private Transactions</h1>

      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="card">
            <div className="card-content">
              <div className="flex items-center">
                <div className={`icon-container ${transaction.color}`}>
                  <Lock size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-gray-800">{transaction.merchant}</h3>
                    <div className="text-right">
                      {transaction.type === "payment" && (
                        <p className="font-semibold text-gray-800">${transaction.amount.toFixed(2)}</p>
                      )}
                      <div className={`badge ${transaction.type === "redeemed" ? "badge-red" : "badge-green"}`}>
                        {transaction.type !== "redeemed" ? (
                          <ArrowDownLeft size={12} className="mr-1" />
                        ) : (
                          <ArrowUpRight size={12} className="mr-1" />
                        )}
                        {transaction.points > 0 ? "+" : ""}
                        {transaction.points} tokens
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <p className="text-sm text-gray-500">
                      {transaction.type === "earned" && "Tokens earned"}
                      {transaction.type === "payment" && "Private payment"}
                      {transaction.type === "redeemed" && "Tokens redeemed"}
                    </p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="activity-container mt-8">
          <h3 className="font-medium mb-3 text-gray-700">Privacy Summary</h3>
          <div className="stats-grid">
            <div className="stat-card purple-bg">
              <p className="stat-label">Tokens Earned</p>
              <p className="stat-value purple-text">1,250</p>
            </div>
            <div className="stat-card green-bg">
              <p className="stat-label">Tokens Redeemed</p>
              <p className="stat-value green-text">450</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

