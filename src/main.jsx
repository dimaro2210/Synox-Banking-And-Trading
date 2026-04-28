import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import './styles/legacy/bootstrap-css.css'
import './styles/legacy/animate-css.css'
import './styles/legacy/swiper-css.css'
import './styles/legacy/magnific-popup-css.css'
import './styles/legacy/odometer-css.css'
import './styles/legacy/main-style-css.css'
import './styles/legacy/header-css.css'
import './styles/legacy/dashboard.css'
import './styles/legacy/login-page-css.css'
import './styles/legacy/register.css'
import './styles/legacy/style_9.css'
import './styles/legacy/crypto-hub.css'
import './styles/legacy/admin-control-panel.css'

import { createWeb3Modal } from '@web3modal/wagmi/react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config, projectId } from './lib/web3Config.jsx'

const queryClient = new QueryClient()

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: false,
  themeMode: 'light',
  themeVariables: {
    '--w3m-accent': '#002D72',
    '--w3m-border-radius-master': '1px'
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)
