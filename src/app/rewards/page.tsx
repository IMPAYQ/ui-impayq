export default function Rewards() {
    const dummyRewards = [
      { id: 1, store: "Merchant ABC", points: "50" },
      { id: 2, store: "Merchant XYZ", points: "30" }
    ];
  
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-md mt-16">
        <h2 className="text-2xl font-bold text-sage-green text-center">My Rewards</h2>
        <ul className="mt-6 space-y-4">
          {dummyRewards.map((reward) => (
            <li key={reward.id} className="p-4 border border-gray-200 rounded">
              <p>{reward.store}: {reward.points} points</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  