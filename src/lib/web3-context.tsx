"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"

interface WalletState {
  address: string | null
  isConnected: boolean
  chainId: number | null
  balance: string
}

interface UserStats {
  isBound: boolean
  inviterAddress: string | null
  totalInvested: string
  pendingTokens: string
  purchasedTokens: string
  referralRewards: string
  totalReferrals: number
}

interface PresaleStats {
  isLive: boolean
  totalRaised: string
  totalTokensSold: string
  tokenPrice: number
  minInvestment: string
  maxInvestment: string
}

interface Transaction {
  id: string
  type: "investment" | "claim" | "reward" | "bind"
  amount: string
  token?: string
  date: Date
  status: "pending" | "completed" | "failed"
  hash: string
}

interface Web3ContextType {
  wallet: WalletState
  userStats: UserStats
  presaleStats: PresaleStats
  transactions: Transaction[]
  isOwner: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  bindInviter: (address: string) => Promise<boolean>
  invest: (amount: string) => Promise<boolean>
  claimTokens: () => Promise<boolean>
  copyToClipboard: (text: string) => Promise<boolean>
  isLoading: boolean
  error: string | null
}

const Web3Context = createContext<Web3ContextType | null>(null)

// Mock data for demonstration
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    type: "investment",
    amount: "0.5",
    date: new Date(Date.now() - 86400000),
    status: "completed",
    hash: "0x1234...5678",
  },
  {
    id: "2",
    type: "reward",
    amount: "50000",
    token: "DWIN",
    date: new Date(Date.now() - 172800000),
    status: "completed",
    hash: "0x2345...6789",
  },
  {
    id: "3",
    type: "claim",
    amount: "100000",
    token: "DWIN",
    date: new Date(Date.now() - 259200000),
    status: "completed",
    hash: "0x3456...7890",
  },
]

export function Web3Provider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    chainId: null,
    balance: "0",
  })

  const [userStats, setUserStats] = useState<UserStats>({
    isBound: false,
    inviterAddress: null,
    totalInvested: "0",
    pendingTokens: "0",
    purchasedTokens: "0",
    referralRewards: "0",
    totalReferrals: 0,
  })

  const [presaleStats] = useState<PresaleStats>({
    isLive: true,
    totalRaised: "125.5",
    totalTokensSold: "12550000",
    tokenPrice: 0.0001,
    minInvestment: "0.1",
    maxInvestment: "10",
  })

  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS)
  const [isOwner] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connectWallet = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Simulate wallet connection
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setWallet({
        address: "0x742d35Cc6634C0532925a3b844Bc9e7595f8f8e8",
        isConnected: true,
        chainId: 56,
        balance: "2.5",
      })
      setUserStats({
        isBound: true,
        inviterAddress: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
        totalInvested: "1.5",
        pendingTokens: "175000",
        purchasedTokens: "150000",
        referralRewards: "25000",
        totalReferrals: 5,
      })
    } catch {
      setError("Failed to connect wallet")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const disconnectWallet = useCallback(() => {
    setWallet({
      address: null,
      isConnected: false,
      chainId: null,
      balance: "0",
    })
    setUserStats({
      isBound: false,
      inviterAddress: null,
      totalInvested: "0",
      pendingTokens: "0",
      purchasedTokens: "0",
      referralRewards: "0",
      totalReferrals: 0,
    })
  }, [])

  const bindInviter = useCallback(async (address: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setUserStats((prev) => ({
        ...prev,
        isBound: true,
        inviterAddress: address,
      }))
      setTransactions((prev) => [
        {
          id: Date.now().toString(),
          type: "bind",
          amount: "0",
          date: new Date(),
          status: "completed",
          hash: "0x" + Math.random().toString(16).slice(2, 10) + "...",
        },
        ...prev,
      ])
      return true
    } catch {
      setError("Failed to bind inviter")
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const invest = useCallback(
    async (amount: string): Promise<boolean> => {
      setIsLoading(true)
      setError(null)
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        const tokens = Number.parseFloat(amount) / presaleStats.tokenPrice
        setUserStats((prev) => ({
          ...prev,
          totalInvested: (Number.parseFloat(prev.totalInvested) + Number.parseFloat(amount)).toFixed(2),
          pendingTokens: (Number.parseFloat(prev.pendingTokens) + tokens).toFixed(0),
          purchasedTokens: (Number.parseFloat(prev.purchasedTokens) + tokens).toFixed(0),
        }))
        setTransactions((prev) => [
          {
            id: Date.now().toString(),
            type: "investment",
            amount,
            date: new Date(),
            status: "completed",
            hash: "0x" + Math.random().toString(16).slice(2, 10) + "...",
          },
          ...prev,
        ])
        return true
      } catch {
        setError("Investment failed")
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [presaleStats.tokenPrice],
  )

  const claimTokens = useCallback(async (): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      const claimedAmount = userStats.pendingTokens
      setUserStats((prev) => ({
        ...prev,
        pendingTokens: "0",
      }))
      setTransactions((prev) => [
        {
          id: Date.now().toString(),
          type: "claim",
          amount: claimedAmount,
          token: "DWIN",
          date: new Date(),
          status: "completed",
          hash: "0x" + Math.random().toString(16).slice(2, 10) + "...",
        },
        ...prev,
      ])
      return true
    } catch {
      setError("Claim failed")
      return false
    } finally {
      setIsLoading(false)
    }
  }, [userStats.pendingTokens])

  const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      return false
    }
  }, [])

  // Check URL params for inviter address on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const ref = params.get("ref")
      if (ref && !userStats.isBound && wallet.isConnected) {
        // Auto-fill inviter from URL
        console.log("Found referral:", ref)
      }
    }
  }, [wallet.isConnected, userStats.isBound])

  return (
    <Web3Context.Provider
      value={{
        wallet,
        userStats,
        presaleStats,
        transactions,
        isOwner,
        connectWallet,
        disconnectWallet,
        bindInviter,
        invest,
        claimTokens,
        copyToClipboard,
        isLoading,
        error,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

export function useWeb3() {
  const context = useContext(Web3Context)
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider")
  }
  return context
}
