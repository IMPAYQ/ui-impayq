"use client"

import type React from "react"
import { createContext, useContext, useState, type ReactNode, useEffect } from "react"
import { OauthClient } from "@zk-email/oauth-sdk"
import { type Address, createPublicClient, http } from "viem"
import { baseSepolia } from "viem/chains"

export type StateContextType = {
  userEmailAddr: string
  setUserEmailAddr: (userEmailAddr: string) => void
  username: string
  setUsername: (username: string) => void
  oauthClient: OauthClient<typeof baseSepolia>
  setOauthClient: (oauthClient: OauthClient<typeof baseSepolia>) => void
  requestId: number | null
  setRequestId: (requestId: number | null) => void
  pageState: PageState
  setPageState: (pageState: PageState) => void
  isAuthenticated: boolean
  logout: () => void
}

export type OauthClientCache = {
  userEmailAddr: string
  username: string
  userWalletAddr: Address
  ephePrivateKey: `0x${string}`
  epheAddrNonce: string
}

export enum PageState {
  landing = 0,
  waiting = 1,
  send = 2,
}

const AuthContext = createContext<StateContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const coreAddress = process.env.NEXT_PUBLIC_CORE_ADDRESS || ""
  const oauthAddress = process.env.NEXT_PUBLIC_OAUTH_ADDRESS || ""
  const relayerHost = process.env.NEXT_PUBLIC_RELAYER_HOST || ""

  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http("https://sepolia.base.org"),
  })

  // Initialize state from localStorage if available
  const [cachedOauthClient, setCachedOauthClient] = useState<OauthClientCache | null>(null)

  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== "undefined") {
      const cachedOauthClientStr = localStorage.getItem("oauthClient")
      const cached = cachedOauthClientStr ? (JSON.parse(cachedOauthClientStr) as OauthClientCache) : null
      setCachedOauthClient(cached)
    }
  }, [])

  const [userEmailAddr, setUserEmailAddr] = useState<string>("")
  const [username, setUsername] = useState<string>("")
  const [oauthClient, setOauthClient] = useState<OauthClient<typeof baseSepolia>>(
    new OauthClient(publicClient, coreAddress as Address, oauthAddress as Address, relayerHost),
  )
  const [requestId, setRequestId] = useState<number | null>(null)
  const [pageState, setPageState] = useState<PageState>(PageState.landing)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  // Initialize from cache when it's loaded
  useEffect(() => {
    if (cachedOauthClient) {
      setUserEmailAddr(cachedOauthClient.userEmailAddr)
      setUsername(cachedOauthClient.username)
      setPageState(PageState.send)
      setIsAuthenticated(true)

      // Initialize OAuth client with cached values
      const initializedClient = new OauthClient(
        publicClient,
        coreAddress as Address,
        oauthAddress as Address,
        relayerHost,
        cachedOauthClient.userEmailAddr,
        cachedOauthClient.userWalletAddr,
        cachedOauthClient.ephePrivateKey,
        cachedOauthClient.epheAddrNonce,
      )

      setOauthClient(initializedClient)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cachedOauthClient])

  // Monitor request ID for activation
  useEffect(() => {
    const waitForActivation = async () => {
      if (requestId !== null) {
        try {
          await oauthClient?.waitEpheAddrActivated(requestId)

          // Save to cache
          const newCache: OauthClientCache = {
            userEmailAddr,
            username,
            userWalletAddr: oauthClient.getWalletAddress() as Address,
            ephePrivateKey: oauthClient.getEphePrivateKey(),
            epheAddrNonce: oauthClient.getEpheAddrNonce() as string,
          }

          localStorage.setItem("oauthClient", JSON.stringify(newCache))
          localStorage.setItem("walletConnected", "true")
          localStorage.setItem("walletAddress", oauthClient.getWalletAddress() as string)

          setRequestId(null)
          setPageState(PageState.send)
          setIsAuthenticated(true)

          // Force a reload to ensure all components pick up the new connection state
          window.location.reload()
        } catch (error) {
          console.error("Error waiting for activation:", error)
        }
      }
    }

    waitForActivation()
  }, [requestId, oauthClient, userEmailAddr, username])

  const logout = () => {
    localStorage.removeItem("oauthClient")
    localStorage.removeItem("walletConnected")
    localStorage.removeItem("walletAddress")

    setUserEmailAddr("")
    setUsername("")
    setPageState(PageState.landing)
    setIsAuthenticated(false)
    setOauthClient(new OauthClient(publicClient, coreAddress as Address, oauthAddress as Address, relayerHost))
  }

  return (
    <AuthContext.Provider
      value={{
        userEmailAddr,
        setUserEmailAddr,
        username,
        setUsername,
        oauthClient,
        setOauthClient,
        requestId,
        setRequestId,
        pageState,
        setPageState,
        isAuthenticated,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

