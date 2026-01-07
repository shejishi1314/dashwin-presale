"use client"

import { useState, useCallback, useEffect } from "react"
import { Web3Provider } from "@/lib/web3-context"
import { LanguageProvider } from "@/lib/language-context"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { PresaleStatsSection } from "@/components/presale-stats-section"
import { PresaleInvestmentCard } from "@/components/presale-investment-card"
import { TokenClaimCard } from "@/components/token-claim-card"
import { ReferralSection } from "@/components/referral-section"
import { TransactionHistory } from "@/components/transaction-history"
import { ContractInfoSection } from "@/components/contract-info-section"
import { WhyBuyDwin } from "@/components/why-buy-dwin"
import { BindingModal } from "@/components/binding-modal"
import { Toaster } from "@/components/ui/toaster"

export default function HomePage() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }, [])

  useEffect(() => {
    let startY = 0
    let currentY = 0

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      currentY = e.touches[0].clientY
    }

    const handleTouchEnd = () => {
      if (currentY - startY > 100 && window.scrollY === 0) {
        handleRefresh()
      }
    }

    window.addEventListener("touchstart", handleTouchStart)
    window.addEventListener("touchmove", handleTouchMove)
    window.addEventListener("touchend", handleTouchEnd)

    return () => {
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [handleRefresh])

  return (
    <LanguageProvider>
      <Web3Provider>
        <div className="flex min-h-screen flex-col bg-background">
          <Header />

          <BindingModal />

          {/* Pull to refresh indicator */}
          {isRefreshing && (
            <div className="flex items-center justify-center py-4">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}

          <main className="container flex-1 px-4 py-6">
            <div className="mx-auto max-w-lg space-y-6">
              {/* A. Hero/Banner Section */}
              <HeroSection />

              {/* B. Presale Statistics Section */}
              <PresaleStatsSection />

              {/* C. Presale Investment Section */}
              <PresaleInvestmentCard />

              {/* D. Token Claim Section */}
              <TokenClaimCard />

              {/* E. Referral Section */}
              <ReferralSection />

              {/* F. Recent Activity Section */}
              <TransactionHistory />

              {/* G. Contract Info Section */}
              <ContractInfoSection />

              {/* H. Why Buy DWIN Section */}
              <WhyBuyDwin />
            </div>
          </main>

          <Toaster />
        </div>
      </Web3Provider>
    </LanguageProvider>
  )
}
