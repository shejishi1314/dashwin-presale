'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { bsc } from 'wagmi/chains';
import { http } from 'wagmi';

const projectId = 'a8a1851341a63c0a5b872c66f4575a0e'; // 去 https://cloud.reown.com 免费注册获取

// 自定义快速可靠的 BSC Testnet 配置
const bscMainnet = {
  ...bsc,
  rpcUrls: {
    default: {
      http: [
        'https://bsc-dataseed.bnbchain.org',     // 主力：超级快、高可用
        'https://bsc-dataseed1.bnbchain.org',               // 备选1：负载均衡好
        'https://bsc-dataseed2.bnbchain.org',   
        'https://rpc.ankr.com/bsc',
        'https://bsc-rpc.publicnode.com',// 备选2：稳定免费
      ],
    },
    public: {
      http: [
        'https://bsc-dataseed.bnbchain.org',     // 主力：超级快、高可用
        'https://bsc-dataseed1.bnbchain.org',               // 备选1：负载均衡好
        'https://bsc-dataseed2.bnbchain.org',   
        'https://rpc.ankr.com/bsc',
        'https://bsc-rpc.publicnode.com',// 备选2：稳定免费
      ],
    },
  },
} as const;

export const wagmiConfig = getDefaultConfig({
  appName: 'DashWin Presale',
  projectId,
  chains: [bsc], // 测试时用这个自定义的，上主网时改成 [bsc]
  transports: {
    [bsc.id]: http(), // 自动使用上面定义的 rpcUrls，支持 fallback
  },
  ssr: true,
});