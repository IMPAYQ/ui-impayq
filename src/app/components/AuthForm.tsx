"use client"

import { useState, useEffect } from "react"
import { useAuth, PageState } from "../context/AuthContext"
import { Wallet, Lock } from 'lucide-react'
import EmailVerificationLoader from "./EmailVerificationLoader"

const emailRegex: RegExp = /^[A-Za-z0-9!#$%&'*+=?\\-\\^_`{|}~./@]+@[A-Za-z0-9.\\-]+$/;

export default function AuthForm() {
  const [activeTab, setActiveTab] = useState<"userTab" | "merchantTab">("userTab")
  const [isFormValid, setIsFormValid] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const {
    userEmailAddr,
    setUserEmailAddr,
    username,
    setUsername,
    pageState,
    setPageState,
    setAccountType,
    Activation
  } = useAuth()

  // Validate form
  useEffect(() => {
    if(activeTab === "userTab") {
      setUserEmailAddr("test0@example.com")
      setUsername("test0UserAccount")
    }else{
      setUserEmailAddr("test1@example.com")
      setUsername("test1MerchantAccount")
    }
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
        <div className="icon-bg-purple p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
          <Wallet size={28} />
        </div>
        <h2 className="text-xl font-semibold mb-2">
          {pageState === PageState.waiting 
            ? "Verifying Your Email" 
            : "Connect With Email"}
        </h2>
        
        {pageState === PageState.waiting ? (
          <EmailVerificationLoader />
        ) : (
          <>
            <p className="text-gray-500 mb-6">
              {activeTab === "userTab" 
                ? "Create an account with your email" 
                : "Sign in with your existing account"}
            </p>
            
            <div className="tabs-list mb-6 grid grid-cols-2 bg-white rounded-full p-1">
              <button
                className={`tab-trigger ${activeTab === "userTab" ? "active" : ""}`}
                onClick={() => setActiveTab("userTab")}
              >
                User Login
              </button>
              <button
                className={`tab-trigger ${activeTab === "merchantTab" ? "active" : ""}`}
                onClick={() => setActiveTab("merchantTab")}
              >
                Merchant Login
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
                className={`btn btn-primary btn-full ${(isLoading) ? "btn-disabled" : ""}`}
              >
                {isLoading ? "Processing..." : "Continue"}
              </button>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-center">
                <Lock size={16} className="text-purple-500 mr-2" />
                <p className="text-sm font-medium text-gray-700">Secured by ZK Email</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
