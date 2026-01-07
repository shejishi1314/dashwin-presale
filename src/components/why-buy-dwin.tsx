"use client"

import { Coins, Zap, Users, Flame, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"

export function WhyBuyDwin() {
  const { t } = useLanguage()

  const benefits = [
    {
      icon: Coins,
      title: t("why.buyback.title"),
      description: t("why.buyback.desc"),
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Zap,
      title: t("why.boost.title"),
      description: t("why.boost.desc"),
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      icon: Users,
      title: t("why.shareholder.title"),
      description: t("why.shareholder.desc"),
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      icon: Flame,
      title: t("why.deflation.title"),
      description: t("why.deflation.desc"),
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      icon: Shield,
      title: t("why.fund.title"),
      description: t("why.fund.desc"),
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ]

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-center text-lg">{t("why.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {benefits.map((benefit, index) => (
          <div key={index} className="rounded-xl border border-border bg-secondary p-4">
            <div className="mb-2 flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${benefit.bgColor}`}>
                <benefit.icon className={`h-5 w-5 ${benefit.color}`} />
              </div>
              <h3 className="font-semibold text-foreground">{benefit.title}</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{benefit.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
