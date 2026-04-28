import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { mainnet, sepolia, bsc } from 'wagmi/chains';

// IMPORTANT: Replace this with your own Project ID from https://cloud.reown.com/
// A 403 error on getWallets/Relayer means this ID is restricted or invalid for your domain.
export const projectId = 'c1781fc3ba2a35921bf75086dff1cc65'; 


const metadata = {
  name: 'Synox Banking',
  description: 'Synox International Banking',
  url: 'https://synox-banking.vercel.app', 
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

export const config = defaultWagmiConfig({
  chains: [mainnet, sepolia, bsc],
  projectId,
  metadata
});
