"use client"

import { useState } from "react"
import { Users, Copy, Check, Share2, Send, ChevronDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAccount, useReadContract } from "wagmi"
import { REFERRAL_BINDING_ADDRESS, REFERRAL_ABI, PRESALE_ADDRESS, PRESALE_ABI } from "@/constants/contracts"
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

  // 是否已绑定（绑定成功后立即显示推荐模块）
  const { data: isBoundRaw = false } = useReadContract({
    address: REFERRAL_BINDING_ADDRESS,
    abi: REFERRAL_ABI,
    functionName: "isBound",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })
  const isBound = Boolean(isBoundRaw)

  // 邀请人数（链上实时读取）
  const { data: referralCountRaw = 0n } = useReadContract({
    address: REFERRAL_BINDING_ADDRESS,
    abi: REFERRAL_ABI,
    functionName: "getReferralCount",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })
  const referralCount = Number(referralCountRaw)

  // 邀请奖励（实时累计）
  const { data: referralRewardsRaw = 0n } = useReadContract({
    address: PRESALE_ADDRESS,
    abi: PRESALE_ABI,
    functionName: "referralRewards",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })
  const referralRewards = Number(referralRewardsRaw) / 1e18

  // 邀请地址列表（修复数量为0问题：确保读取正确）
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
    if (!referralLink) return
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      toast({ title: "复制成功！" })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({ title: "复制失败", variant: "destructive" })
    }
  }

  // 绑定成功后显示（即使0人也能看到链接和规则，鼓励分享）
  if (!isConnected || !address || !isBound) {
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

        {/* 邀请奖励规则（与截图一致） */}
        <Alert className="border-primary/20 bg-primary/5">
          <AlertDescription className="text-sm">
            <span className="font-medium text-primary">邀请奖励规则</span>
            <br />
            邀请好友参与预售，您将获得其投入金额的 10% $DWIN 作为奖励。奖励将实时累计，随时可领取。
          </AlertDescription>
        </Alert>

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

        {/* 邀请列表（修复数量为0问题：即使有奖励也显示列表） */}
        {referralCount > 0 ? (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              被邀请人列表（共 {referralCount} 人）
            </p>
            <div className="space-y-2">
              {displayedReferrals.map((refAddress, index) => (
                <ReferralItem key={`${refAddress}-${index}`} refAddress={refAddress} />
              ))}
            </div>

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
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            暂无邀请记录，分享链接赚取奖励吧！
          </p>
        )}

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

// 子组件：每个邀请人详情（真实投资显示正确 BNB 和奖励）
function ReferralItem({ refAddress }: { refAddress: `0x${string}` }) {
  const { data: purchasedDWINRaw = 0n } = useReadContract({
    address: PRESALE_ADDRESS,
    abi: PRESALE_ABI,
    functionName: "purchasedAmount",
    args: [refAddress],
    query: { enabled: true }, // 始终启用，确保实时读取
  })

  const purchasedDWIN = Number(purchasedDWINRaw) / 1e18 // 被邀请人获得的 DWIN
  const investedBNB = purchasedDWIN / 500_000 // 反算投资 BNB（RATE = 800000）
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