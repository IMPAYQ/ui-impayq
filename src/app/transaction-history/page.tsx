export default function TransactionHistory() {
    const dummyTransactions = [
      { id: 1, type: "Reward Earned", merchant: "Merchant ABC", amount: "10", date: "2025-03-15" },
      { id: 2, type: "Payment Sent", merchant: "Merchant XYZ", amount: "25", date: "2025-03-16" }
    ];
  
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-md mt-16">
        <h2 className="text-2xl font-bold text-sage-green text-center">Transaction History</h2>
        <ul className="mt-6 space-y-4">
          {dummyTransactions.map((tx) => (
            <li key={tx.id} className="p-4 border border-gray-200 rounded">
              <p className="font-semibold">{tx.type} with {tx.merchant}</p>
              <p>Amount: {tx.amount}</p>
              <p>Date: {tx.date}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  