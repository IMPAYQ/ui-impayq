import { Bell, ChevronRight, Copy, HelpCircle, Lock, LogOut, Shield } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="page-container page-purple">
      <h1 className="page-title mb-6">Profile</h1>

      <div className="space-y-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center gap-4">
              <div className="avatar">
                <img src="/placeholder.svg?height=64&width=64" alt="User" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">John Doe</h3>
                <p className="text-sm text-gray-500">john.doe@example.com</p>
                <button className="btn btn-link p-0 h-auto text-purple-500 text-sm">Edit Profile</button>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content p-0">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-medium text-gray-800 mb-1">Wallet</h3>
              <p className="text-sm text-gray-500">Your blockchain wallet is securely managed</p>
            </div>

            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-medium text-gray-700">Wallet Address</div>
                <div className="flex items-center">
                  <code className="code mr-2">0x1a2...9i0j</code>
                  <button className="btn btn-outline btn-icon rounded-full">
                    <Copy size={16} className="text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center">
                  <Lock size={20} className="mr-3 text-purple-500" />
                  <span className="text-gray-700">Security Settings</span>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </div>

              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <Shield size={20} className="mr-3 text-purple-500" />
                  <span className="text-gray-700">Privacy</span>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content p-0">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-medium text-gray-800">Notifications</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="switch-container">
                <div className="flex items-center gap-3">
                  <Bell size={20} className="text-purple-500" />
                  <label htmlFor="rewards-notifications" className="text-gray-700">
                    Rewards Updates
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
                    Payment Confirmations
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

        <div className="grid gap-4 mt-6">
          <button className="btn btn-outline bg-white rounded-full py-3 shadow-sm">
            <HelpCircle size={20} className="mr-2 text-purple-500" />
            Help & Support
          </button>

          <button className="btn btn-primary rounded-full py-3" style={{ backgroundColor: "var(--color-red-500)" }}>
            <LogOut size={20} className="mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}

