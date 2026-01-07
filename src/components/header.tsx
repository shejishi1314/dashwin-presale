"use client"

import { useState } from "react"
import { Menu, X, Globe, Smartphone, ExternalLink } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ConnectButton } from "@rainbow-me/rainbowkit"  // 新增：RainbowKit 连接按钮
import { useLanguage } from "@/lib/language-context"

export function Header() {
  const [open, setOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "zh" : "en")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <Image src="/images/logo.png" alt="DashWin Logo" width={36} height={36} className="h-9 w-9 object-contain" />
          <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-xl font-black tracking-tight text-transparent">
            DashWin
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Wallet Connection Button - 使用 RainbowKit 标准组件 */}
          <ConnectButton 
            showBalance={false}  // 可选：不显示余额（因为我们是预售页面）
            chainStatus="icon"    // 只显示链图标
            accountStatus="address" // 显示完整地址或截断
          />

          {/* Hamburger Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] border-border bg-card p-0">
              <SheetHeader className="border-b border-border p-4">
                <SheetTitle className="text-left text-foreground">Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 p-4">
                {/* Language Switch */}
                <button
                  onClick={toggleLanguage}
                  className="flex items-center justify-between rounded-xl border border-border bg-secondary p-3 transition-colors hover:bg-secondary/80"
                >
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Language</span>
                  </div>
                  <div className="flex items-center gap-1 rounded-full border border-border bg-background px-2 py-1">
                    <span className={language === "en" ? "text-primary" : "text-muted-foreground"}>EN</span>
                    <span className="text-muted-foreground">/</span>
                    <span className={language === "zh" ? "text-primary" : "text-muted-foreground"}>中</span>
                  </div>
                </button>

                {/* Open APP Button */}
                <a
                  href="https://dashwin.org/perp/PERP_ETH_USDC"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-blue-400 p-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <Smartphone className="h-5 w-5" />
                  <span>{t("header.openApp")}</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}