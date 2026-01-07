"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "en" | "zh"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations: Record<string, Record<Language, string>> = {
  // Header
  "header.connect": { en: "Connect", zh: "连接钱包" },
  "header.connecting": { en: "Connecting...", zh: "连接中..." },
  "header.copyAddress": { en: "Copy Address", zh: "复制地址" },
  "header.copied": { en: "Copied!", zh: "已复制!" },
  "header.viewBscscan": { en: "View on BscScan", zh: "在BscScan查看" },
  "header.disconnect": { en: "Disconnect", zh: "断开连接" },
  "header.bscMainnet": { en: "BSC Mainnet", zh: "BSC主网" },
  "header.bscTestnet": { en: "BSC Testnet", zh: "BSC测试网" },
  "header.unknown": { en: "Unknown", zh: "未知网络" },
  "header.bound": { en: "Bound", zh: "已绑定" },
  "header.notBound": { en: "Not Bound", zh: "未绑定" },
  "header.help": { en: "Help", zh: "帮助" },
  "header.openApp": { en: "LAUNCH APP", zh: "打开APP" },

  // Hero Section
  "hero.title": { en: "One-Stop Decentralized Exchange", zh: "一站式去中心化交易所" },
  "hero.subtitle": {
    en: "Spot swap, perpetual contracts, AI quant, prediction and GameFi all in one. Supporting 11 chains.",
    zh: "集现货swap、永续合约、AI量化、预测和Gamefi于一体。支持11条公链。",
  },
  "hero.tagline": { en: "Transparent, Borderless, Truly Free", zh: "透明的、无国界的、真正自由" },

  // Stats Section
  "stats.title": { en: "Presale Statistics", zh: "预售统计" },
  "stats.progress": { en: "Progress", zh: "进度" },
  "stats.raised": { en: "raised", zh: "已筹集" },
  "stats.target": { en: "target", zh: "目标" },
  "stats.totalRaised": { en: "Total Raised", zh: "总筹集" },
  "stats.tokensSold": { en: "Tokens Sold", zh: "已售代币" },
  "stats.yourInvestment": { en: "Your Investment", zh: "您的投资" },
  "stats.yourTokens": { en: "Your Tokens", zh: "您的代币" },
  "stats.slippage": { en: "Slippage Distribution", zh: "滑点分配明细" },
  "stats.treasury": { en: "Treasury", zh: "金库" },
  "stats.burn": { en: "Burn", zh: "销毁" },
  "stats.fund": { en: "Fund", zh: "基金" },

  // Investment Section
  "invest.title": { en: "Presale Investment", zh: "预售投资" },
  "invest.live": { en: "LIVE", zh: "进行中" },
  "invest.ended": { en: "ENDED", zh: "已结束" },
  "invest.bnbAmount": { en: "BNB Amount", zh: "BNB数量" },
  "invest.youWillReceive": { en: "You will receive", zh: "您将获得" },
  "invest.minimum": { en: "Minimum:", zh: "最低:" },
  "invest.investNow": { en: "Invest Now", zh: "立即投资" },
  "invest.processing": { en: "Processing...", zh: "处理中..." },
  "invest.connectFirst": { en: "Connect Wallet First", zh: "请先连接钱包" },
  "invest.bindFirst": { en: "Bind Inviter First", zh: "请先绑定邀请人" },
  "invest.presaleEnded": { en: "Presale Ended", zh: "预售已结束" },
  "invest.success": {
    en: "Investment successful! Tokens will be available for claim.",
    zh: "投资成功！代币可供领取。",
  },
  "invest.errorAmount": { en: "Please enter a valid amount", zh: "请输入有效金额" },
  "invest.errorMin": { en: "Minimum investment is", zh: "最低投资额为" },
  "invest.errorMax": { en: "Maximum investment is", zh: "最高投资额为" },
  "invest.errorBalance": { en: "Insufficient BNB balance", zh: "BNB余额不足" },
  "invest.errorFailed": { en: "Investment failed. Please try again.", zh: "投资失败，请重试。" },

  // Claim Section
  "claim.title": { en: "Claim Tokens", zh: "领取代币" },
  "claim.totalClaimable": { en: "Total Claimable", zh: "可领取总量" },
  "claim.purchased": { en: "Purchased", zh: "购买所得" },
  "claim.referralRewards": { en: "Referral rewards", zh: "邀请奖励" },
  "claim.claimAll": { en: "Claim All Tokens", zh: "领取全部代币" },
  "claim.claiming": { en: "Claiming...", zh: "领取中..." },
  "claim.noTokens": { en: "No Tokens to Claim", zh: "暂无可领取代币" },
  "claim.success": { en: "Tokens claimed successfully!", zh: "代币领取成功!" },

  // Referral Section
  "referral.title": { en: "Invite & Earn", zh: "邀请赚取" },
  "referral.yourLink": { en: "Your Referral Link", zh: "个人邀请链接" },
  "referral.rewardRuleTitle": { en: "Invitation Reward Rules", zh: "邀请奖励规则" },
  "referral.rewardRuleDesc": {
    en: "Invite friends to participate in the presale and earn 10% of their investment amount in $DWIN as rewards. Rewards accumulate in real-time and can be claimed anytime.",
    zh: "邀请好友参与预售，您将获得其投入金额的 10% $DWIN 作为奖励。奖励将实时累计，随时可领取。",
  },
  "referral.myInvites": { en: "My Invites", zh: "我的邀请" },
  "referral.noInvites": { en: "No invites yet", zh: "暂无邀请" },
  "referral.invested": { en: "Invested", zh: "投资" },
  "referral.earned": { en: "Earned", zh: "获得" },
  "referral.copy": { en: "Copy", zh: "复制" },

  // Transaction History
  "history.title": { en: "Recent Activity", zh: "最近活动" },
  "history.all": { en: "All", zh: "全部" },
  "history.investments": { en: "Investments", zh: "投资" },
  "history.claims": { en: "Claims", zh: "领取" },
  "history.rewards": { en: "Rewards", zh: "奖励" },
  "history.noTransactions": { en: "No transactions yet", zh: "暂无交易记录" },
  "history.viewAll": { en: "View All", zh: "查看全部" },
  "history.showLess": { en: "Show Less", zh: "收起" },
  "history.investment": { en: "Investment", zh: "投资" },
  "history.claim": { en: "Claim", zh: "领取" },
  "history.reward": { en: "Reward", zh: "奖励" },
  "history.bind": { en: "Bind", zh: "绑定" },
  "history.done": { en: "Done", zh: "完成" },
  "history.pending": { en: "Pending", zh: "处理中" },
  "history.failed": { en: "Failed", zh: "失败" },

  // Contract Info
  "contract.title": { en: "Contract Addresses", zh: "合约地址" },
  "contract.referral": { en: "Referral Binding Contract", zh: "推荐绑定合约" },
  "contract.presale": { en: "Presale Contract", zh: "预售合约" },
  "contract.token": { en: "DWIN Token Contract", zh: "DWIN代币合约" },

  // Binding Section
  "binding.title": { en: "Bind Invitation", zh: "绑定邀请" },
  "binding.placeholder": { en: "Enter inviter address 0x...", zh: "请输入邀请人地址 0x..." },
  "binding.bindNow": { en: "Bind Now", zh: "立即绑定" },
  "binding.binding": { en: "Binding...", zh: "绑定中..." },
  "binding.success": { en: "Successfully Bound", zh: "绑定成功" },
  "binding.inviter": { en: "Inviter:", zh: "邀请人:" },
  "binding.successMessage": { en: "Successfully bound to inviter!", zh: "成功绑定邀请人!" },
  "binding.errorEmpty": { en: "Please enter an inviter address", zh: "请输入邀请人地址" },
  "binding.errorInvalid": { en: "Invalid wallet address format", zh: "钱包地址格式无效" },
  "binding.errorSelf": { en: "You cannot use your own address as inviter", zh: "不能使用自己的地址作为邀请人" },
  "binding.errorFailed": { en: "Failed to bind inviter. Please try again.", zh: "绑定失败，请重试。" },

  // Why Buy DWIN
  "why.title": { en: "Why Buy DWIN?", zh: "为什么购买DWIN？" },
  "why.buyback.title": { en: "Buyback & Stake", zh: "回购与股份" },
  "why.buyback.desc": {
    en: "Stake DWIN tokens to earn platform revenue dividends and grow your capital. Rewards are distributed in BNB. Platform revenue also buys back tokens for burning, driving DWIN's steady growth.",
    zh: "质押DWIN代币，即可获得平台收益分红，助您的资本增长。奖励以BNB形式发放。平台收益也会回购代币销毁，推动DWIN稳步增长。",
  },
  "why.boost.title": { en: "Boost Rewards", zh: "Boost奖励" },
  "why.boost.desc": {
    en: "Trade DWIN tokens to earn 2x slippage rewards, paid in DWIN. Also earn OKX Boost points for OKX wallet airdrop rewards.",
    zh: "交易DWIN代币，获得滑点2倍收益，奖励以DWIN形式发放。同时获得OKX Boost积分，获得OKX钱包空投奖励。",
  },
  "why.shareholder.title": { en: "Shareholder Benefits", zh: "股东权益" },
  "why.shareholder.desc": {
    en: "Add LP to earn 3x rewards. Meet requirements to become an exchange shareholder with dividend rights. Also receive quant fund revenue dividends.",
    zh: "添加LP即可获得3倍奖励，达到要求获得交易所股东身份，享受股东分红。同时获量化基金收益分红。",
  },
  "why.deflation.title": { en: "Burn & Deflation", zh: "销毁通缩" },
  "why.deflation.desc": {
    en: "0.5% trading slippage automatically executes buyback and burn, reducing circulating supply, increasing token value, creating a deflationary economic model.",
    zh: "交易滑点0.5%自动执行回购销毁，减少流通供应，提升代币价值，打造通缩经济模型。",
  },
  "why.fund.title": { en: "Fund Support", zh: "基金托底" },
  "why.fund.desc": {
    en: "Quant fund revenue continuously buys back DWIN for the treasury, forming a value loop. Dual protection mechanism ensures long-term healthy project development.",
    zh: "量化基金收益不断回购DWIN转入金库，形成价值闭环。双重保障机制，确保项目长期健康发展。",
  },
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("zh")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("language") as Language
      if (saved && (saved === "en" || saved === "zh")) {
        setLanguageState(saved)
      }
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang)
    }
  }

  const t = (key: string): string => {
    return translations[key]?.[language] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
