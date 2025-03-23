"use client"

import { useState, useEffect } from "react"
import { useAuth, PageState } from "../context/AuthContext"
import { Lock, Shield } from "lucide-react"
import EmailVerificationLoader from "./EmailVerificationLoader"

export default function AuthForm() {
  const [activeTab, setActiveTab] = useState<"userTab" | "merchantTab">("userTab")
  const [isLoading, setIsLoading] = useState(false)

  const { userEmailAddr, setUserEmailAddr, username, setUsername, pageState, setPageState, Activation } = useAuth()

  // Validate form
  useEffect(() => {
    if (activeTab === "userTab") {
      setUserEmailAddr("test0@example.com")
      setUsername("test0UserAccount")
    } else {
      setUserEmailAddr("test1@example.com")
      setUsername("test1MerchantAccount")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  const handleSubmit = async () => {
    console.log("HANDLE SUBTIT")

    setIsLoading(true)
    setPageState(PageState.waiting)

    try {
      // Setup aztec account
      await Activation(activeTab)
    } catch (error) {
      console.log(error, "ERROR SETTING UP AZTEC ACCOUNT")
      console.error("Error setting up aztec account:", error)
      setPageState(PageState.landing)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="card w-full max-w-md mx-auto">
      <div className="card-content text-center p-6">
          <Shield size={28} />
        <h2 className="text-xl font-semibold mb-2">
          {pageState === PageState.waiting ? "Verifying Your Email" : "Privacy-First Payments"}
        </h2>

        {pageState === PageState.waiting ? (
          <EmailVerificationLoader />
        ) : (
          <>
            <p className="text-gray-500 mb-6">
              {activeTab === "userTab"
                ? "Experience zero-knowledge security with your email"
                : "Manage your business with complete privacy"}
            </p>

            <div className="tabs-list mb-6 grid grid-cols-2 bg-white rounded-full p-1">
              <button
                className={`tab-trigger ${activeTab === "userTab" ? "active" : ""}`}
                onClick={() => setActiveTab("userTab")}
              >
                Personal Account
              </button>
              <button
                className={`tab-trigger ${activeTab === "merchantTab" ? "active" : ""}`}
                onClick={() => setActiveTab("merchantTab")}
              >
                Business Account
              </button>
            </div>

            <div className="space-y-4">
              <div className="input-container">
                <input
                  type="email"
                  placeholder={activeTab === "userTab" ? "test0@example.com" : "test1@example.com"}
                  value={userEmailAddr}
                  onChange={(e) => setUserEmailAddr(e.target.value)}
                  className="input"
                  disabled
                />
              </div>

              {activeTab === "userTab" && (
                <div className="input-container">
                  <input
                    type="text"
                    placeholder="test0 user account"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input"
                    disabled
                  />
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`btn btn-primary btn-full py-4 ${isLoading ? "btn-disabled" : ""}`}
                style={{ backgroundColor: "#f8963e" }}
              >
                {isLoading ? "Processing..." : "Continue with Privacy"}
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-center">
                <Lock size={16} className="text-purple-500 mr-2" />
                <p className="text-sm font-medium text-gray-700">Secured by Zero-Knowledge Proofs</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

