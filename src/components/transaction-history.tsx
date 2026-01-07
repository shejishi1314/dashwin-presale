"use client"

import { useState } from "react"
import { History, ExternalLink, ArrowUpRight, ArrowDownLeft, Gift, Link2, ChevronDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useWeb3 } from "@/lib/web3-context"
import { useLanguage } from "@/lib/language-context"
import { cn } from "@/lib/utils"

export function TransactionHistory() {
  const { wallet, transactions } = useWeb3()
  const { t, language } = useLanguage()
  const [activeFilter, setActiveFilter] = useState<string>("All")
  const [showAll, setShowAll] = useState(false)

  const FILTER_OPTIONS = [
    { key: "All", label: t("history.all") },
    { key: "Investments", label: t("history.investments") },
    { key: "Claims", label: t("history.claims") },
    { key: "Rewards", label: t("history.rewards") },
  ]

  const formatNumber = (num: string) => {
    return Number.parseFloat(num).toLocaleString()
  }

  const getFilteredTransactions = (filter: string) => {
    if (filter === "All") return transactions
    const typeMap: Record<string, string> = {
      Investments: "investment",
      Claims: "claim",
      Rewards: "reward",
    }
    return transactions.filter((tx) => tx.type === typeMap[filter])
  }

  const filteredTransactions = getFilteredTransactions(activeFilter)
  const displayedTransactions = showAll ? filteredTransactions : filteredTransactions.slice(0, 5)

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "investment":
        return <ArrowUpRight className="h-4 w-4 text-primary" />
      case "claim":
        return <ArrowDownLeft className="h-4 w-4 text-success" />
      case "reward":
        return <Gift className="h-4 w-4 text-warning" />
      case "bind":
        return <Link2 className="h-4 w-4 text-primary" />
      default:
        return <History className="h-4 w-4" />
    }
  }

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case "investment":
        return t("history.investment")
      case "claim":
        return t("history.claim")
      case "reward":
        return t("history.reward")
      case "bind":
        return t("history.bind")
      default:
        return type
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success/20 text-success text-xs">{t("history.done")}</Badge>
      case "pending":
        return <Badge className="bg-warning/20 text-warning text-xs">{t("history.pending")}</Badge>
      case "failed":
        return (
          <Badge variant="destructive" className="text-xs">
            {t("history.failed")}
          </Badge>
        )
      default:
        return null
    }
  }

  if (!wallet.isConnected) {
    return null
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <History className="h-5 w-5 text-primary" />
          {t("history.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2">
          {FILTER_OPTIONS.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                activeFilter === filter.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Transaction List */}
        <div className="space-y-2">
          {displayedTransactions.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <History className="mx-auto mb-2 h-8 w-8 opacity-50" />
              <p>{t("history.noTransactions")}</p>
            </div>
          ) : (
            displayedTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between rounded-xl border border-border bg-secondary p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-background">
                    {getTransactionIcon(tx.type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{getTransactionLabel(tx.type)}</p>
                    <p className="text-xs text-muted-foreground">
                      {tx.date.toLocaleDateString(language === "zh" ? "zh-CN" : "en-US")}{" "}
                      {tx.date.toLocaleTimeString(language === "zh" ? "zh-CN" : "en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {tx.type === "investment"
                        ? `${tx.amount} BNB`
                        : `${formatNumber(tx.amount)} ${tx.token || "DWIN"}`}
                    </p>
                    {getStatusBadge(tx.status)}
                  </div>
                  <a
                    href={`https://bscscan.com/tx/${tx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-background hover:text-primary"
                    aria-label="View on BscScan"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* View All Button */}
        {filteredTransactions.length > 5 && (
          <Button variant="ghost" className="w-full gap-2" onClick={() => setShowAll(!showAll)}>
            {showAll ? t("history.showLess") : t("history.viewAll")}
            <ChevronDown className={cn("h-4 w-4 transition-transform", showAll && "rotate-180")} />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
