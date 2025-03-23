"use client"

import type React from "react"
import { createContext, useContext, useState, type ReactNode, useEffect } from "react"
import { OauthClient } from "@zk-email/oauth-sdk"
import { type Address, createPublicClient, http } from "viem"
import { baseSepolia } from "viem/chains"
import { getDeployedTestAccountsWallets } from '@aztec/accounts/testing';
import { AccountWalletWithSecretKey, createPXEClient } from "@aztec/aztec.js"


export type StateContextType = {
  userEmailAddr: string
  setUserEmailAddr: (userEmailAddr: string) => void
  username: string
  setUsername: (username: string) => void
  pageState: PageState
  setPageState: (pageState: PageState) => void
  isAuthenticated: boolean
  logout: () => void
  accountType: "test0" | "test1" | null
  aztecWallet?: AccountWalletWithSecretKey | null
  setAccountType: (type: "test0" | "test1" | null) => void
  Activation: (tab: string | null) => void
  clientCache: ClientCache | null
  // phase 2
  // oauthClient?: OauthClient<typeof baseSepolia>
  // setOauthClient?: (oauthClient: OauthClient<typeof baseSepolia>) => void
  // requestId?: number | null
  // setRequestId?: (requestId: number | null) => void
}

export type ClientCache = {
  userEmailAddr: string
  username: string
  walletAddress: string
  accountType: "test0" | "test1"
  aztecWallet: AccountWalletWithSecretKey
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
  const PXE_URL = process.env.PXE_URL || 'http://35.228.247.23:8080';
  const pxe = createPXEClient(PXE_URL);


  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http("https://sepolia.base.org"),
  })

  // Initialize state from localStorage if available
  const [clientCache, setClientCache] = useState<ClientCache | null>(null)

  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== "undefined") {
      const cachedStoragestr = localStorage.getItem("clientCache")
      const cached = cachedStoragestr ? (JSON.parse(cachedStoragestr) as ClientCache) : null
      console.log(cached, "CLIENT CACHE")
      setClientCache(cached)
    }
  }, [])

  const [userEmailAddr, setUserEmailAddr] = useState<string>("")
  const [username, setUsername] = useState<string>("")

  const [pageState, setPageState] = useState<PageState>(PageState.landing)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [accountType, setAccountType] = useState<"test0" | "test1" | null>(null)
  const [aztecWallet, setAztecWallet ] = useState<AccountWalletWithSecretKey | null>(null)

  //Phase 2
  // const [oauthClient, setOauthClient] = useState<OauthClient<typeof baseSepolia>>(
  //   new OauthClient(publicClient, coreAddress as Address, oauthAddress as Address, relayerHost),
  // )
  // const [requestId, setRequestId] = useState<number | null>(null)

  // PHASE 2 Initialize from cache when it's loaded
  // useEffect(() => {
  //   if (cachedOauthClient) {
  //     setUserEmailAddr(cachedOauthClient.userEmailAddr)
  //     setUsername(cachedOauthClient.username)
  //     setPageState(PageState.send)
  //     setIsAuthenticated(true)

  //     // Initialize OAuth client with cached values
  //     const initializedClient = new OauthClient(
  //       publicClient,
  //       coreAddress as Address,
  //       oauthAddress as Address,
  //       relayerHost,
  //       cachedOauthClient.userEmailAddr,
  //       cachedOauthClient.userWalletAddr,
  //       cachedOauthClient.ephePrivateKey,
  //       cachedOauthClient.epheAddrNonce,
  //     )

  //     setOauthClient(initializedClient)
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [cachedOauthClient])



    // PHASE 2 Initialize from cache when it's loaded
  useEffect(() => {
    if (clientCache) {
      setUserEmailAddr(clientCache.userEmailAddr)
      setUsername(clientCache.username)
      setAztecWallet(clientCache.aztecWallet)
      setAccountType(clientCache.accountType)
      setPageState(PageState.send)
      setIsAuthenticated(true)

    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientCache])


  const Activation = async (tab: string | null) => {
    try {

      console.log("ACTIVATION")
      const wallet = (await getDeployedTestAccountsWallets(pxe))[tab === "userTab" ? 0 : 1];


      localStorage.setItem("clientCache", JSON.stringify({userEmailAddr, username, accountType: tab === "userTab" ? "test0" : "test1", aztecWallet: wallet}))
      localStorage.setItem("walletConnected", "true")
      localStorage.setItem("walletAddress", wallet.getAddress().toString())

      setAccountType(tab === "userTab" ? "test0" : "test1")
      setAztecWallet(wallet)

      setPageState(PageState.send)
      setIsAuthenticated(true)

      // phase 2
      // setRequestId(null)

      // Force a reload to ensure all components pick up the new connection state
      window.location.reload()
    } catch (error) {
      console.log(error, "ERROR ACTIVATION")
      console.error("Error waiting for activation:", error)
    }
  }

  // async function aztecTest() {
  //   const wallet = (await getDeployedTestAccountsWallets(pxe))[0];

  //   console.log(wallet.getAddress().toString(), "WALLET AZTEC")
  // }


  // useEffect(( ) => {
  //   aztecTest()
  // }, [])
  

  const logout = () => {
    localStorage.removeItem("walletConnected")
    localStorage.removeItem("walletAddress")

    setAccountType(null)
    setAztecWallet(null)
    setUserEmailAddr("")
    setUsername("")
    setPageState(PageState.landing)
    setIsAuthenticated(false)

    // phase 2
    // setOauthClient(new OauthClient(publicClient, coreAddress as Address, oauthAddress as Address, relayerHost))
    // localStorage.removeItem("oauthClient")
  }

  return (
    <AuthContext.Provider
      value={{
        userEmailAddr,
        setUserEmailAddr,
        username,
        setUsername,
        aztecWallet,
        pageState,
        setPageState,
        isAuthenticated,
        logout,
        accountType,
        setAccountType,
        Activation,
        clientCache
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

