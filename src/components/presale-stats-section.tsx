"use client"

import { BarChart3, Coins, TrendingUp, Building, Flame, PiggyBank } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useReadContract } from "wagmi"
import { PRESALE_ADDRESS, PRESALE_ABI } from "@/constants/contracts"
import { formatEther, formatUnits } from "viem"
import { useLanguage } from "@/lib/language-context"

export function PresaleStatsSection() {
  const { t } = useLanguage()

  // 实时读取合约数据
  const { data: totalRaisedRaw, isLoading: loadingRaised } = useReadContract({
    address: PRESALE_ADDRESS,
    abi: PRESALE_ABI,
    functionName: "totalRaisedBNB",
  })

  const { data: totalSoldRaw, isLoading: loadingSold } = useReadContract({
    address: PRESALE_ADDRESS,
    abi: PRESALE_ABI,
    functionName: "totalTokensSold",
  })

  // 转换为可读格式
  const totalRaised = totalRaisedRaw ? Number(formatEther(totalRaisedRaw)) : 0
  const totalTokensSold = totalSoldRaw ? Number(totalSoldRaw) / 1e18 : 0

  // 目标金额（你的页面是 500 BNB）
  const targetRaised = 1000
  const progress = totalRaised > 0 ? Math.min((totalRaised / targetRaised) * 100, 100) : 0

  // 格式化大数字（带千分位）
  const formatNumber = (num: number) => {
    return num.toLocaleString(undefined, { maximumFractionDigits: 0 })
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="h-5 w-5 text-primary" />
          {t("stats.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t("stats.progress")}</span>
            <span className="font-medium">
              {progress.toFixed(1)}% {t("stats.raised")}
            </span>
          </div>
          <Progress value={progress} className="h-3" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {loadingRaised ? "Loading..." : `${totalRaised.toFixed(2)} BNB`}
            </span>
            <span>
              {targetRaised} BNB {t("stats.target")}
            </span>
          </div>
        </div>

        {/* Stats Grid (2 columns) */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-secondary p-3">
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">{t("stats.totalRaised")}</span>
            </div>
            <p className="mt-1 text-lg font-semibold">
              {loadingRaised ? "..." : `${totalRaised.toFixed(2)} BNB`}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-secondary p-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">{t("stats.tokensSold")}</span>
            </div>
            <p className="mt-1 text-lg font-semibold">
              {loadingSold ? "..." : totalTokensSold.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>

        {/* Slippage Distribution */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{t("stats.slippage")}</p>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary p-2">
              <Building className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">{t("stats.treasury")}</p>
                <p className="text-sm font-semibold">2%</p>
              </div>
            </div><div className="flex items-center gap-2 rounded-lg border border-border bg-secondary p-2">
              <Flame className="h-4 w-4 text-destructive" />
              <div>
                <p className="text-xs text-muted-foreground">{t("stats.burn")}</p>
                <p className="text-sm font-semibold">0.5%</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary p-2">
              <PiggyBank className="h-4 w-4 text-success" />
              <div>
                <p className="text-xs text-muted-foreground">{t("stats.fund")}</p>
                <p className="text-sm font-semibold">0.5%</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}