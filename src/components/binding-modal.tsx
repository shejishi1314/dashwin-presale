"use client"

import { useState, useEffect } from "react"
import { Link2, X, Loader2 } from "lucide-react"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { REFERRAL_BINDING_ADDRESS, REFERRAL_ABI } from "@/constants/contracts"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/lib/language-context"

export function BindingModal() {
  const { address, isConnected } = useAccount()
  const { t } = useLanguage()
  const { toast } = useToast()

  const [isOpen, setIsOpen] = useState(false)
  const [inviterAddress, setInviterAddress] = useState("")
  const [hasShownSuccess, setHasShownSuccess] = useState(false) // 防止重复提示

  // 读取绑定状态
  const { data: isBound, refetch: refetchBound } = useReadContract({
    address: REFERRAL_BINDING_ADDRESS,
    abi: REFERRAL_ABI,
    functionName: "isBound",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  // 绑定交易
  const { writeContract, data: hash, isPending: isBinding } = useWriteContract()
  const { isSuccess: bindSuccess, error: bindError } = useWaitForTransactionReceipt({ hash })

  // 自动检查 + URL 参数填充
  useEffect(() => {
    if (isConnected && address) {
      refetchBound() // 强制刷新

      if (isBound === false) {
        setIsOpen(true)

        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search)
          const inviter = params.get("inviter") || params.get("ref")
          if (inviter && inviter.match(/^0x[a-fA-F0-9]{40}$/i)) {
            setInviterAddress(inviter)
          }
        }
      } else {
        setIsOpen(false)
      }
    } else {
      setIsOpen(false)
    }
  }, [isConnected, address, isBound, refetchBound])

  // 绑定成功处理
  useEffect(() => {
    if (bindSuccess && !hasShownSuccess) {
      toast({
        title: t("binding.successMessage") || "绑定成功！",
        duration: 4000,
      })
      setHasShownSuccess(true)
      setIsOpen(false)
      refetchBound()
    }
  }, [bindSuccess, hasShownSuccess, refetchBound, t])

  // 绑定失败处理（显示具体原因）
  useEffect(() => {
    if (bindError) {
      toast({
        title: "绑定失败",
        description: bindError.message || "未知错误，请检查 gas 或网络",
        variant: "destructive",
        duration: 6000,
      })
    }
  }, [bindError, toast])

  const handleBind = () => {
    if (!inviterAddress) {
      toast({
        title: t("binding.errorEmpty") || "请输入邀请人地址",
        variant: "destructive",
        duration: 4000,
      })
      return
    }

    if (!inviterAddress.match(/^0x[a-fA-F0-9]{40}$/i)) {
      toast({
        title: t("binding.errorInvalid") || "地址格式错误",
        variant: "destructive",
        duration: 4000,
      })
      return
    }

    if (inviterAddress.toLowerCase() === address?.toLowerCase()) {
      toast({
        title: t("binding.errorSelf") || "不能绑定自己",
        variant: "destructive",
        duration: 4000,
      })
      return
    }

    writeContract({
      address: REFERRAL_BINDING_ADDRESS,
      abi: REFERRAL_ABI,
      functionName: "bind",
      args: [inviterAddress as `0x${string}`],gas: 300000n, // 手动指定 200k gas，足够绑定
    }, {
      onError: (error) => {
        toast({
          title: "绑定失败",
          description: error.message || "未知错误",
          variant: "destructive",
          duration: 6000,
        })
      },
    })
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-sm rounded-2xl bg-card border border-border p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Link2 className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">{t("binding.title") || "绑定邀请人"}</h2>
        </div>

        {/* Input */}
        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={inviterAddress}
              onChange={(e) => setInviterAddress(e.target.value)}
              placeholder={t("binding.placeholder") || "输入邀请人钱包地址"}
              className="w-full rounded-xl bg-muted/50 border border-border px-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-base"
              disabled={isBinding}
            />
          </div>

          {/* Bind button */}
          <button
            onClick={handleBind}
            disabled={isBinding || !inviterAddress}
            className="w-full rounded-xl bg-primary py-3.5 font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 min-h-[48px]"
          >
            {isBinding ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {t("binding.binding") || "绑定中..."}
              </>
            ) : (
              t("binding.bindNow") || "立即绑定"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}