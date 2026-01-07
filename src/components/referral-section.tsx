"use client"

import { useState } from "react"
import { Users, Copy, Check, Share2, Send, Gift, ChevronDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAccount, useReadContract } from "wagmi"
import { REFERRAL_BINDING_ADDRESS, REFERRAL_ABI, PRESALE_ADDRESS, PRESALE_ABI } from "@/constants/contracts"
import { formatEther } from "viem"
import { useLanguage } from "@/lib/language-context"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

export function ReferralSection() {
  const { address, isConnected } = useAccount()
  const { t } = useLanguage()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const [showAll, setShowAll] = useState(false)

  const referralLink = address
    ? `${typeof window !== "undefined" ? window.location.origin : ""}?inviter=${address}`
    : ""

  // 邀请人数
  const { data: referralCountRaw = 0n } = useReadContract({
    address: REFERRAL_BINDING_ADDRESS,
    abi: REFERRAL_ABI,
    functionName: "getReferralCount",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })
  const referralCount = Number(referralCountRaw)

  // 邀请奖励
  const { data: referralRewardsRaw = 0n } = useReadContract({
    address: PRESALE_ADDRESS,
    abi: PRESALE_ABI,
    functionName: "referralRewards",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })
  const referralRewards = Number(referralRewardsRaw) / 1e18

  // 邀请地址列表
  const { data: referralsRaw } = useReadContract({
    address: REFERRAL_BINDING_ADDRESS,
    abi: REFERRAL_ABI,
    functionName: "getDirectReferrals",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })
  const referrals = (referralsRaw ?? []) as readonly `0x${string}`[]

  const displayedReferrals = showAll ? referrals : referrals.slice(0, 10)

  const handleCopyLink = async () => {
  if (!referralLink) {
    toast({
      title: "链接为空",
      description: "请先连接钱包",
      variant: "destructive",
      duration: 4000,
    })
    return
  }

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(referralLink)
    } else {
      // fallback for old browsers or non-HTTPS
      const textArea = document.createElement("textarea")
      textArea.value = referralLink
      textArea.style.position = "fixed"
      textArea.style.opacity = "0"
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
    }

    setCopied(true)
    toast({
      title: "复制成功！",
      duration: 3000,
    })
    setTimeout(() => setCopied(false), 2000)
  } catch (err) {
    console.error("复制失败", err)
    toast({
      title: "复制失败",
      description: "请手动复制链接",
      variant: "destructive",
      duration: 5000,
    })
  }
  }

  if (!isConnected || !address || referralCount === 0) {
    return null
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-primary" />
          {t("referral.title") || "我的邀请"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 邀请链接 */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{t("referral.yourLink") || "邀请链接"}</p>
          <div className="flex items-center gap-2">
            <Input value={referralLink} readOnly className="flex-1 truncate font-mono text-xs" />
            <Button variant="outline" size="icon" onClick={handleCopyLink}>
              {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* 统计 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-border bg-secondary p-4 text-center">
            <p className="text-sm text-muted-foreground">邀请人数</p>
            <p className="text-2xl font-bold text-primary mt-1">{referralCount}</p>
          </div>
          <div className="rounded-xl border border-border bg-secondary p-4 text-center">
            <p className="text-sm text-muted-foreground">邀请奖励</p>
            <p className="text-2xl font-bold text-success mt-1">
              {referralRewards.toLocaleString(undefined, { maximumFractionDigits: 0 })} DWIN
            </p>
          </div>
        </div>

        {/* 邀请列表 */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            被邀请人列表（共 {referralCount} 人）
          </p>
          <div className="space-y-2">
            {displayedReferrals.map((refAddress, index) => (
              <ReferralItem key={`${refAddress}-${index}`} refAddress={refAddress} />
            ))}
          </div>

          {/* 查看更多按钮 */}
          {referrals.length > 10 && (
            <Button
              variant="ghost"
              className="w-full gap-2"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "收起" : "查看更多"}
              <ChevronDown className={cn("h-4 w-4 transition-transform", showAll && "rotate-180")} />
            </Button>
          )}
        </div>

        {/* 分享按钮 */}
        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 bg-transparent" asChild>
            <a
              href={`https://twitter.com/intent/tweet?text=Join%20the%20DashWin%20presale!&url=${encodeURIComponent(referralLink)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Share2 className="h-3.5 w-3.5" />
              Twitter
            </a>
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 bg-transparent" asChild>
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=Join%20the%20DashWin%20presale!`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Send className="h-3.5 w-3.5" />
              Telegram
            </a>
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 bg-transparent" onClick={handleCopyLink}>
            <Copy className="h-3.5 w-3.5" />
            {t("referral.copy") || "复制"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// 子组件：每个邀请人详情
function ReferralItem({ refAddress }: { refAddress: `0x${string}` }) {
  const { data: purchasedDWINRaw = 0n } = useReadContract({
    address: PRESALE_ADDRESS,
    abi: PRESALE_ABI,
    functionName: "purchasedAmount",
    args: [refAddress],
  })

  const purchasedDWIN = Number(purchasedDWINRaw) / 1e18 // DWIN 数量
  const investedBNB = purchasedDWIN / 800_000 // 反算投资 BNB
  const rewardDWIN = purchasedDWIN * 0.1 // 10% 奖励

  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-secondary p-3">
      <span className="font-mono text-sm truncate max-w-[180px]">{refAddress}</span>
      <div className="flex items-center gap-4 text-right text-xs">
        <div>
          <p className="text-muted-foreground">投资</p>
          <p>{investedBNB.toFixed(4)} BNB</p>
        </div>
        <div className="text-success">
          <p className="text-muted-foreground">奖励</p>
          <p>+{rewardDWIN.toFixed(0)} DWIN</p>
        </div>
      </div>
    </div>
  )
}