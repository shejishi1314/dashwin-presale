"use client"

import { useState, useEffect } from "react"
import { Gift, Loader2, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { PRESALE_ADDRESS, PRESALE_ABI } from "@/constants/contracts"
import { useLanguage } from "@/lib/language-context"

export function TokenClaimCard() {
  const { address, isConnected } = useAccount()
  const { t } = useLanguage()
  const [success, setSuccess] = useState(false)

  // 读取总待领取代币（购买 + 邀请奖励）
  const { data: pendingTokensRaw = 0n, refetch: refetchPending } = useReadContract({
    address: PRESALE_ADDRESS,
    abi: PRESALE_ABI,
    functionName: "getPendingTokens",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  // 单独读取购买数量
  const { data: purchasedRaw = 0n } = useReadContract({
    address: PRESALE_ADDRESS,
    abi: PRESALE_ABI,
    functionName: "purchasedAmount",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  // 单独读取邀请奖励数量
  const { data: referralRewardsRaw = 0n } = useReadContract({
    address: PRESALE_ADDRESS,
    abi: PRESALE_ABI,
    functionName: "referralRewards",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  // Claim 交易
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isSuccess: claimSuccess } = useWaitForTransactionReceipt({ hash })

  // 格式化函数（18位小数）
const formatToken = (raw: bigint) => {
  return (Number(raw) / 1e18).toLocaleString(undefined, { maximumFractionDigits: 0 })
}

const pendingTokens = Number(pendingTokensRaw) / 1e18
const purchasedTokens = Number(purchasedRaw) / 1e18
const referralRewards = Number(referralRewardsRaw) / 1e18

const hasClaimableTokens = pendingTokens > 0

  const handleClaim = () => {
    setSuccess(false)
    writeContract({
      address: PRESALE_ADDRESS,
      abi: PRESALE_ABI,
      functionName: "claim",
      gas: 300000n, // 领取代币gas
    })
  }

  // 领取成功后提示 + 刷新数据
  useEffect(() => {
    if (claimSuccess) {
      setSuccess(true)
      refetchPending()
    }
  }, [claimSuccess, refetchPending])

  if (!isConnected || !hasClaimableTokens) {
    return null
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Gift className="h-5 w-5 text-primary" />
          {t("claim.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Claimable Tokens */}
        <div className="rounded-xl border border-border bg-secondary p-4 text-center">
          <p className="text-sm text-muted-foreground">{t("claim.totalClaimable")}</p>
          <p className="mt-1 text-3xl font-bold text-primary">{formatToken(pendingTokensRaw)} DWIN</p>
          <p className="text-sm text-muted-foreground"></p>
        </div>

        {/* Breakdown */}
        <div className="space-y-2 rounded-xl border border-border bg-secondary p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t("claim.purchased") || "购买数量"}</span>
            <span>{formatToken(purchasedRaw)} DWIN</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t("claim.referralRewards") || "邀请奖励"}</span>
            <span className="text-success">+{formatToken(referralRewardsRaw)} DWIN</span>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 p-3 text-success">
            <Check className="h-4 w-4" />
            <span className="text-sm">{t("claim.success") || "领取成功！请检查钱包"}</span>
          </div>
        )}

        {/* Claim Button */}
        <Button
          onClick={handleClaim}
          disabled={isPending || !hasClaimableTokens}
          className="min-h-[52px] w-full text-base font-semibold"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {t("claim.claiming") || "领取中..."}
            </>
          ) : (
            t("claim.claimAll") || "全部领取"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}