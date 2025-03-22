// Helper function to check if the user is connected
export function isUserConnected() {
    if (typeof window === "undefined") {
      return false
    }
  
    return localStorage.getItem("walletConnected") === "true"
  }
  
  // Helper function to get the user's wallet address
  export function getUserWalletAddress() {
    if (typeof window === "undefined") {
      return null
    }
  
    return localStorage.getItem("walletAddress") || null
  }
  
  // Helper function to connect the wallet
  export function connectWallet() {
    const newAddress = "0x" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  
    localStorage.setItem("walletConnected", "true")
    localStorage.setItem("walletAddress", newAddress)
  
    return newAddress
  }
  
  // Helper function to disconnect the wallet
  export function disconnectWallet() {
    localStorage.removeItem("walletConnected")
    localStorage.removeItem("walletAddress")
  }
  
  