"use client"

import { useState } from "react"
import { FileText, Copy, Check, ExternalLink, ChevronDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useWeb3 } from "@/lib/web3-context"
import { useLanguage } from "@/lib/language-context"
import { cn } from "@/lib/utils"

export function ContractInfoSection() {
  const { copyToClipboard } = useWeb3()
  const { t } = useLanguage()
  const [expanded, setExpanded] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const CONTRACTS = [
    { name: t("contract.referral"), address: "0x2877C05cFe4eAfEa191c339Aa574d3A15f9C309A" },
    { name: t("contract.presale"), address: "0x2BA81219eb9fbff448231688E1354ac96c373109" },
    { name: t("contract.token"), address: "00xcf998D5e65eCC44EA6c41883EB89A06fE769068A" },
  ]

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 10)}...${address.slice(-8)}`
  }

  const handleCopy = async (address: string, index: number) => {
    await copyToClipboard(address)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-0">
        <button onClick={() => setExpanded(!expanded)} className="flex w-full items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-primary" />
            {t("contract.title")}
          </CardTitle>
          <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", expanded && "rotate-180")} />
        </button>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-4">
          <div className="space-y-2">
            {CONTRACTS.map((contract, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-xl border border-border bg-secondary p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{contract.name}</p>
                  <p className="truncate font-mono text-xs text-muted-foreground">
                    {truncateAddress(contract.address)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleCopy(contract.address, index)}
                  >
                    {copiedIndex === index ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                    <a
                      href={`https://bscscan.com/address/${contract.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
