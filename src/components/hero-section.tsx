"use client"

import { useLanguage } from "@/lib/language-context"

export function HeroSection() {
  const { t } = useLanguage()

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-primary/10 p-6">
      {/* Background decoration */}
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />

      <div className="relative space-y-4 text-center">
        <h1 className="text-2xl font-bold leading-tight text-foreground">{t("hero.title")}</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">{t("hero.subtitle")}</p>
        <p className="inline-block rounded-full bg-primary/20 px-4 py-2 text-sm font-semibold text-primary">
          {t("hero.tagline")}
        </p>
      </div>
    </section>
  )
}
