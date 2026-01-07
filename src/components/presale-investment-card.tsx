"use client"

import { useState, useEffect } from "react"
import { Coins, AlertCircle, Loader2, TrendingUp, Plus, Minus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { REFERRAL_BINDING_ADDRESS, REFERRAL_ABI, PRESALE_ADDRESS, PRESALE_ABI } from "@/constants/contracts"
import { parseEther, formatEther } from "viem"
import { useLanguage } from "@/lib/language-context"

export function PresaleInvestmentCard() {
  const { address, isConnected } = useAccount()
  const { t } = useLanguage()

  const [amount, setAmount] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // 读取绑定状态
  const { data: isBound, refetch: refetchBound } = useReadContract({
    address: REFERRAL_BINDING_ADDRESS,
    abi: REFERRAL_ABI,
    functionName: "isBound",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  // 读取预售是否活跃
  const { data: saleActive } = useReadContract({
    address: PRESALE_ADDRESS,
    abi: PRESALE_ABI,
    functionName: "saleActive",
  })

  // 购买交易
  const { writeContract, data: hash, isPending: isInvesting } = useWriteContract()
  const { isSuccess: txSuccess, isLoading: txLoading } = useWaitForTransactionReceipt({ hash })

  // 合约汇率：1 BNB = 800,000 DWIN
  const RATE = 500_000
  const MIN_INVEST = 0.1

  const calculateTokens = (bnbAmount: string): string => {
  const bnb = Number.parseFloat(bnbAmount) || 0
  const tokens = bnb * RATE
  const formatted = tokens.toLocaleString(undefined, { maximumFractionDigits: 0 })
  return formatted + " DWIN"  // 直接拼接，确保永远是 string
}

  const adjustAmount = (delta: number) => {
    const current = Number.parseFloat(amount) || 0
    const newAmount = Math.max(0, current + delta)
    setAmount(newAmount % 1 === 0 ? newAmount.toString() : newAmount.toFixed(1))
  }

  // MAX 功能：这里暂时设一个合理上限（如 100 BNB），或你后续可加读取余额
  const setMaxAmount = () => {
    setAmount("10") // 可后续优化为读取钱包 BNB 余额
  }

  const handleInvest = () => {
    setError("")
    setSuccess(false)

    const bnbAmount = Number.parseFloat(amount)

    if (!amount || isNaN(bnbAmount) || bnbAmount < MIN_INVEST) {
      setError(`最低投资 ${MIN_INVEST} BNB`)
      return
    }

    writeContract({
      address: PRESALE_ADDRESS,
      abi: PRESALE_ABI,
      functionName: "invest",
      value: parseEther(amount),
      gas: 300000n, // 购买需要更多 gas（有转账和计算）
    })
  }

  // 交易成功处理
 useEffect(() => {
  if (txSuccess) {
    setSuccess(true)
    setAmount("")
    refetchBound?.() // 刷新绑定状态（可选）

    // 新增：购买成功后强制刷新整个页面，确保所有数据实时更新
    window.location.reload()
  }
 }, [txSuccess, refetchBound])

  const canInvest = isConnected && isBound && saleActive

  const isLoading = isInvesting || txLoading

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
            {t("invest.title")}
          </CardTitle>
          <Badge
            variant={saleActive ? "default" : "secondary"}
            className={saleActive ? "animate-pulse-glow bg-success text-success-foreground" : ""}
          >
            {saleActive ? t("invest.live") : t("invest.ended")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Investment Input */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">{t("invest.bnbAmount")}</label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 shrink-0 bg-transparent"
              onClick={() => adjustAmount(-0.1)}
              disabled={!amount || Number.parseFloat(amount) <= 0}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="relative flex-1">
              <Input
                type="number"
                inputMode="decimal"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-12 pr-16 text-center text-lg"
                step="0.1"
                min={MIN_INVEST}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                BNB
              </span>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 shrink-0 bg-transparent"
              onClick={() => adjustAmount(0.1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="secondary" size="sm" className="w-full" onClick={setMaxAmount}>
            MAX
          </Button>
        </div>

        {/* Token Calculation */}
        {amount && Number.parseFloat(amount) >= MIN_INVEST && (
          <div className="rounded-xl border border-primary/30 bg-primary/10 p-4 text-center">
            <p className="text-sm text-muted-foreground">{t("invest.youWillReceive")}</p>
            <p className="text-2xl font-bold text-primary">{calculateTokens(amount)} </p>
          </div>
        )}

        {/* Min Requirement */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <AlertCircle className="h-3 w-3" />
          <span>
            {t("invest.minimum")} {MIN_INVEST} BNB
          </span>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-success/30 bg-success/10 text-success">
            <Coins className="h-4 w-4" />
            <AlertDescription>{t("invest.success")}</AlertDescription>
          </Alert>
        )}

        {/* Invest Button */}
        <Button
          onClick={handleInvest}
          disabled={!canInvest || isLoading || !amount || Number.parseFloat(amount) < MIN_INVEST}
          className="min-h-[52px] w-full text-base font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {t("invest.processing")}
            </>
          ) : !isConnected ? (
            t("invest.connectFirst")
          ) : !isBound ? (
            t("invest.bindFirst")
          ) : !saleActive ? (
            t("invest.presaleEnded")
          ) : (
            t("invest.investNow")
          )}
        </Button>
      </CardContent>
    </Card>
  )
}