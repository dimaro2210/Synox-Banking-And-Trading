import{a as e,s as t,t as n,u as r}from"./lit-element-CQVoGdEF.js";import{n as i,o as a,s as o,t as s}from"./if-defined-Ba-nknRI.js";import"./index.es-CLLT_Pjb.js";import{A as ee,C as c,E as te,G as ne,I as re,J as l,K as u,L as ie,N as ae,O as oe,R as se,S as ce,T as d,W as f,a as le,c as p,d as ue,f as de,g as m,h as fe,i as pe,j as h,k as g,m as _,n as v,o as me,p as he,s as ge,t as _e,v as y,w as ve,y as b}from"./ApiController-B3bxi-lB.js";import{a as ye,d as be,f as xe,i as Se,o as Ce,r as x,s as S,t as C,u as w}from"./HelpersUtil-h-cNqWRo.js";import{t as we}from"./wui-list-item-BKdcUCOj.js";import{n as Te,t as Ee}from"./AlertController-CQYMdn9h.js";var De={getGasPriceInEther(e,t){let n=t*e;return Number(n)/0xde0b6b3a7640000},getGasPriceInUSD(e,t,n){let r=De.getGasPriceInEther(t,n);return u.bigNumber(e).times(r).toNumber()},getPriceImpact({sourceTokenAmount:e,sourceTokenPriceInUSD:t,toTokenPriceInUSD:n,toTokenAmount:r}){let i=u.bigNumber(e).times(t),a=u.bigNumber(r).times(n);return i.minus(a).div(i).times(100).toNumber()},getMaxSlippage(e,t){let n=u.bigNumber(e).div(100);return u.multiply(t,n).toNumber()},getProviderFee(e,t=.0085){return u.bigNumber(e).times(t).toString()},isInsufficientNetworkTokenForGas(e,t){let n=t||`0`;return u.bigNumber(e).eq(0)?!0:u.bigNumber(u.bigNumber(n)).gt(e)},isInsufficientSourceTokenForSwap(e,t,n){let r=n?.find(e=>e.address===t)?.quantity?.numeric;return u.bigNumber(r||`0`).lt(e)}},Oe=15e4,T={initializing:!1,initialized:!1,loadingPrices:!1,loadingQuote:!1,loadingApprovalTransaction:!1,loadingBuildTransaction:!1,loadingTransaction:!1,switchingTokens:!1,fetchError:!1,approvalTransaction:void 0,swapTransaction:void 0,transactionError:void 0,sourceToken:void 0,sourceTokenAmount:``,sourceTokenPriceInUSD:0,toToken:void 0,toTokenAmount:``,toTokenPriceInUSD:0,networkPrice:`0`,networkBalanceInUSD:`0`,networkTokenSymbol:``,inputError:void 0,slippage:ae.CONVERT_SLIPPAGE_TOLERANCE,tokens:void 0,popularTokens:void 0,suggestedTokens:void 0,foundTokens:void 0,myTokensWithBalance:void 0,tokensPriceMap:{},gasFee:`0`,gasPriceInUSD:0,priceImpact:void 0,maxSlippage:void 0,providerFee:void 0},E=ie({...T}),ke={state:E,subscribe(e){return se(E,()=>e(E))},subscribeKey(e,t){return re(E,e,t)},getParams(){let e=v.state.activeChain,t=v.getAccountData(e)?.caipAddress??v.state.activeCaipAddress,n=h.getPlainAddress(t),r=ue(),i=_.getConnectorId(v.state.activeChain);if(!n)throw Error(`No address found to swap the tokens from.`);let a=!E.toToken?.address||!E.toToken?.decimals,o=!E.sourceToken?.address||!E.sourceToken?.decimals||!u.bigNumber(E.sourceTokenAmount).gt(0),s=!E.sourceTokenAmount;return{networkAddress:r,fromAddress:n,fromCaipAddress:t,sourceTokenAddress:E.sourceToken?.address,toTokenAddress:E.toToken?.address,toTokenAmount:E.toTokenAmount,toTokenDecimals:E.toToken?.decimals,sourceTokenAmount:E.sourceTokenAmount,sourceTokenDecimals:E.sourceToken?.decimals,invalidToToken:a,invalidSourceToken:o,invalidSourceTokenAmount:s,availableToSwap:t&&!a&&!o&&!s,isAuthConnector:i===l.CONNECTOR_ID.AUTH}},async setSourceToken(e){if(!e){E.sourceToken=e,E.sourceTokenAmount=``,E.sourceTokenPriceInUSD=0;return}E.sourceToken=e,await D.setTokenPrice(e.address,`sourceToken`)},setSourceTokenAmount(e){E.sourceTokenAmount=e},async setToToken(e){if(!e){E.toToken=e,E.toTokenAmount=``,E.toTokenPriceInUSD=0;return}E.toToken=e,await D.setTokenPrice(e.address,`toToken`)},setToTokenAmount(e){E.toTokenAmount=e?u.toFixed(e,6):``},async setTokenPrice(e,t){let n=E.tokensPriceMap[e]||0;n||=(E.loadingPrices=!0,await D.getAddressPrice(e)),t===`sourceToken`?E.sourceTokenPriceInUSD=n:t===`toToken`&&(E.toTokenPriceInUSD=n),E.loadingPrices&&=!1,D.getParams().availableToSwap&&!E.switchingTokens&&D.swapTokens()},async switchTokens(){if(!(E.initializing||!E.initialized||E.switchingTokens)){E.switchingTokens=!0;try{let e=E.toToken?{...E.toToken}:void 0,t=E.sourceToken?{...E.sourceToken}:void 0,n=e&&E.toTokenAmount===``?`1`:E.toTokenAmount;D.setSourceTokenAmount(n),D.setToTokenAmount(``),await D.setSourceToken(e),await D.setToToken(t),E.switchingTokens=!1,D.swapTokens()}catch(e){throw E.switchingTokens=!1,e}}},resetState(){E.myTokensWithBalance=T.myTokensWithBalance,E.tokensPriceMap=T.tokensPriceMap,E.initialized=T.initialized,E.initializing=T.initializing,E.switchingTokens=T.switchingTokens,E.sourceToken=T.sourceToken,E.sourceTokenAmount=T.sourceTokenAmount,E.sourceTokenPriceInUSD=T.sourceTokenPriceInUSD,E.toToken=T.toToken,E.toTokenAmount=T.toTokenAmount,E.toTokenPriceInUSD=T.toTokenPriceInUSD,E.networkPrice=T.networkPrice,E.networkTokenSymbol=T.networkTokenSymbol,E.networkBalanceInUSD=T.networkBalanceInUSD,E.inputError=T.inputError},resetValues(){let{networkAddress:e}=D.getParams(),t=E.tokens?.find(t=>t.address===e);D.setSourceToken(t),D.setToToken(void 0)},getApprovalLoadingState(){return E.loadingApprovalTransaction},clearError(){E.transactionError=void 0},async initializeState(){if(!E.initializing){if(E.initializing=!0,!E.initialized)try{await D.fetchTokens(),E.initialized=!0}catch{E.initialized=!1,c.showError(`Failed to initialize swap`),b.goBack()}E.initializing=!1}},async fetchTokens(){let{networkAddress:e}=D.getParams();await D.getNetworkTokenPrice(),await D.getMyTokensWithBalance();let t=E.myTokensWithBalance?.find(t=>t.address===e);t&&(E.networkTokenSymbol=t.symbol,D.setSourceToken(t),D.setSourceTokenAmount(`0`))},async getTokenList(){let e=v.state.activeCaipNetwork?.caipNetworkId;if(!(E.caipNetworkId===e&&E.tokens))try{E.tokensLoading=!0;let t=await pe.getTokenList(e);E.tokens=t,E.caipNetworkId=e,E.popularTokens=t.sort((e,t)=>e.symbol<t.symbol?-1:e.symbol>t.symbol?1:0);let n=(e&&ae.SUGGESTED_TOKENS_BY_CHAIN?.[e]||[]).map(e=>t.find(t=>t.symbol===e)).filter(e=>!!e),r=(ae.SWAP_SUGGESTED_TOKENS||[]).map(e=>t.find(t=>t.symbol===e)).filter(e=>!!e).filter(e=>!n.some(t=>t.address===e.address));E.suggestedTokens=[...n,...r]}catch{E.tokens=[],E.popularTokens=[],E.suggestedTokens=[]}finally{E.tokensLoading=!1}},async getAddressPrice(e){let t=E.tokensPriceMap[e];if(t)return t;let n=(await ce.fetchTokenPrice({addresses:[e]}))?.fungibles||[],r=[...E.tokens||[],...E.myTokensWithBalance||[]]?.find(t=>t.address===e)?.symbol,i=n.find(e=>e.symbol.toLowerCase()===r?.toLowerCase())?.price||0,a=parseFloat(i.toString());return E.tokensPriceMap[e]=a,a},async getNetworkTokenPrice(){let{networkAddress:e}=D.getParams(),t=(await ce.fetchTokenPrice({addresses:[e]}).catch(()=>(c.showError(`Failed to fetch network token price`),{fungibles:[]}))).fungibles?.[0],n=t?.price.toString()||`0`;E.tokensPriceMap[e]=parseFloat(n),E.networkTokenSymbol=t?.symbol||``,E.networkPrice=n},async getMyTokensWithBalance(e){let t=await ge.getMyTokensWithBalance({forceUpdate:e,caipNetwork:v.state.activeCaipNetwork,address:v.getAccountData()?.address}),n=pe.mapBalancesToSwapTokens(t);n&&(await D.getInitialGasPrice(),D.setBalances(n))},setBalances(e){let{networkAddress:t}=D.getParams(),n=v.state.activeCaipNetwork;if(!n)return;let r=e.find(e=>e.address===t);e.forEach(e=>{E.tokensPriceMap[e.address]=e.price||0}),E.myTokensWithBalance=e.filter(e=>e.address.startsWith(n.caipNetworkId)),E.networkBalanceInUSD=r?u.multiply(r.quantity.numeric,r.price).toString():`0`},async getInitialGasPrice(){let e=await pe.fetchGasPrice();if(!e)return{gasPrice:null,gasPriceInUSD:null};switch(v.state?.activeCaipNetwork?.chainNamespace){case l.CHAIN.SOLANA:return E.gasFee=e.standard??`0`,E.gasPriceInUSD=u.multiply(e.standard,E.networkPrice).div(1e9).toNumber(),{gasPrice:BigInt(E.gasFee),gasPriceInUSD:Number(E.gasPriceInUSD)};case l.CHAIN.EVM:default:let t=e.standard??`0`,n=BigInt(t),r=BigInt(Oe),i=De.getGasPriceInUSD(E.networkPrice,r,n);return E.gasFee=t,E.gasPriceInUSD=i,{gasPrice:n,gasPriceInUSD:i}}},async swapTokens(){let e=v.getAccountData()?.address,t=E.sourceToken,n=E.toToken,r=u.bigNumber(E.sourceTokenAmount).gt(0);if(r||D.setToTokenAmount(``),!n||!t||E.loadingPrices||!r||!e)return;E.loadingQuote=!0;let i=u.bigNumber(E.sourceTokenAmount).times(10**t.decimals).round(0).toFixed(0);try{let r=await ce.fetchSwapQuote({userAddress:e,from:t.address,to:n.address,gasPrice:E.gasFee,amount:i.toString()});E.loadingQuote=!1;let a=r?.quotes?.[0]?.toAmount;if(!a){Ee.open({displayMessage:`Incorrect amount`,debugMessage:`Please enter a valid amount`},`error`);return}let o=u.bigNumber(a).div(10**n.decimals).toString();D.setToTokenAmount(o),D.hasInsufficientToken(E.sourceTokenAmount,t.address)?E.inputError=`Insufficient balance`:(E.inputError=void 0,D.setTransactionDetails())}catch(e){let t=await pe.handleSwapError(e);E.loadingQuote=!1,E.inputError=t||`Insufficient balance`}},async getTransaction(){let{fromCaipAddress:e,availableToSwap:t}=D.getParams(),n=E.sourceToken,r=E.toToken;if(!(!e||!t||!n||!r||E.loadingQuote))try{E.loadingBuildTransaction=!0;let t=await pe.fetchSwapAllowance({userAddress:e,tokenAddress:n.address,sourceTokenAmount:E.sourceTokenAmount,sourceTokenDecimals:n.decimals}),r;return r=t?await D.createSwapTransaction():await D.createAllowanceTransaction(),E.loadingBuildTransaction=!1,E.fetchError=!1,r}catch{b.goBack(),c.showError(`Failed to check allowance`),E.loadingBuildTransaction=!1,E.approvalTransaction=void 0,E.swapTransaction=void 0,E.fetchError=!0;return}},async createAllowanceTransaction(){let{fromCaipAddress:e,sourceTokenAddress:t,toTokenAddress:n}=D.getParams();if(!(!e||!n)){if(!t)throw Error(`createAllowanceTransaction - No source token address found.`);try{let r=await ce.generateApproveCalldata({from:t,to:n,userAddress:e}),i=h.getPlainAddress(r.tx.from);if(!i)throw Error(`SwapController:createAllowanceTransaction - address is required`);let a={data:r.tx.data,to:i,gasPrice:BigInt(r.tx.eip155.gasPrice),value:BigInt(r.tx.value),toAmount:E.toTokenAmount};return E.swapTransaction=void 0,E.approvalTransaction={data:a.data,to:a.to,gasPrice:a.gasPrice,value:a.value,toAmount:a.toAmount},{data:a.data,to:a.to,gasPrice:a.gasPrice,value:a.value,toAmount:a.toAmount}}catch{b.goBack(),c.showError(`Failed to create approval transaction`),E.approvalTransaction=void 0,E.swapTransaction=void 0,E.fetchError=!0;return}}},async createSwapTransaction(){let{networkAddress:e,fromCaipAddress:t,sourceTokenAmount:n}=D.getParams(),r=E.sourceToken,i=E.toToken;if(!t||!n||!r||!i)return;let a=p.parseUnits(n,r.decimals)?.toString();try{let n=await ce.generateSwapCalldata({userAddress:t,from:r.address,to:i.address,amount:a,disableEstimate:!0}),o=r.address===e,s=BigInt(n.tx.eip155.gas),ee=BigInt(n.tx.eip155.gasPrice),c=h.getPlainAddress(n.tx.to);if(!c)throw Error(`SwapController:createSwapTransaction - address is required`);let te={data:n.tx.data,to:c,gas:s,gasPrice:ee,value:BigInt(o?a??`0`:`0`),toAmount:E.toTokenAmount};return E.gasPriceInUSD=De.getGasPriceInUSD(E.networkPrice,s,ee),E.approvalTransaction=void 0,E.swapTransaction=te,te}catch{b.goBack(),c.showError(`Failed to create transaction`),E.approvalTransaction=void 0,E.swapTransaction=void 0,E.fetchError=!0;return}},onEmbeddedWalletApprovalSuccess(){c.showLoading(`Approve limit increase in your wallet`),b.replace(`SwapPreview`)},async sendTransactionForApproval(e){let{fromAddress:t,isAuthConnector:n}=D.getParams();E.loadingApprovalTransaction=!0,n?b.pushTransactionStack({onSuccess:D.onEmbeddedWalletApprovalSuccess}):c.showLoading(`Approve limit increase in your wallet`);try{await p.sendTransaction({address:t,to:e.to,data:e.data,value:e.value,chainNamespace:l.CHAIN.EVM}),await D.swapTokens(),await D.getTransaction(),E.approvalTransaction=void 0,E.loadingApprovalTransaction=!1}catch(e){let t=e;E.transactionError=t?.displayMessage,E.loadingApprovalTransaction=!1,c.showError(t?.displayMessage||`Transaction error`),y.sendEvent({type:`track`,event:`SWAP_APPROVAL_ERROR`,properties:{message:t?.displayMessage||t?.message||`Unknown`,network:v.state.activeCaipNetwork?.caipNetworkId||``,swapFromToken:D.state.sourceToken?.symbol||``,swapToToken:D.state.toToken?.symbol||``,swapFromAmount:D.state.sourceTokenAmount||``,swapToAmount:D.state.toTokenAmount||``,isSmartAccount:he(l.CHAIN.EVM)===ve.ACCOUNT_TYPES.SMART_ACCOUNT}})}},async sendTransactionForSwap(e){if(!e)return;let{fromAddress:t,toTokenAmount:n,isAuthConnector:r}=D.getParams();E.loadingTransaction=!0;let i=`Swapping ${E.sourceToken?.symbol} to ${u.formatNumberToLocalString(n,3)} ${E.toToken?.symbol}`,a=`Swapped ${E.sourceToken?.symbol} to ${u.formatNumberToLocalString(n,3)} ${E.toToken?.symbol}`;r?b.pushTransactionStack({onSuccess(){b.replace(`Account`),c.showLoading(i),ke.resetState()}}):c.showLoading(`Confirm transaction in your wallet`);try{let n=[E.sourceToken?.address,E.toToken?.address].join(`,`),i=await p.sendTransaction({address:t,to:e.to,data:e.data,value:e.value,chainNamespace:l.CHAIN.EVM});return E.loadingTransaction=!1,c.showSuccess(a),y.sendEvent({type:`track`,event:`SWAP_SUCCESS`,properties:{network:v.state.activeCaipNetwork?.caipNetworkId||``,swapFromToken:D.state.sourceToken?.symbol||``,swapToToken:D.state.toToken?.symbol||``,swapFromAmount:D.state.sourceTokenAmount||``,swapToAmount:D.state.toTokenAmount||``,isSmartAccount:he(l.CHAIN.EVM)===ve.ACCOUNT_TYPES.SMART_ACCOUNT}}),ke.resetState(),r||b.replace(`Account`),ke.getMyTokensWithBalance(n),i}catch(e){let t=e;E.transactionError=t?.displayMessage,E.loadingTransaction=!1,c.showError(t?.displayMessage||`Transaction error`),y.sendEvent({type:`track`,event:`SWAP_ERROR`,properties:{message:t?.displayMessage||t?.message||`Unknown`,network:v.state.activeCaipNetwork?.caipNetworkId||``,swapFromToken:D.state.sourceToken?.symbol||``,swapToToken:D.state.toToken?.symbol||``,swapFromAmount:D.state.sourceTokenAmount||``,swapToAmount:D.state.toTokenAmount||``,isSmartAccount:he(l.CHAIN.EVM)===ve.ACCOUNT_TYPES.SMART_ACCOUNT}});return}},hasInsufficientToken(e,t){return De.isInsufficientSourceTokenForSwap(e,t,E.myTokensWithBalance)},setTransactionDetails(){let{toTokenAddress:e,toTokenDecimals:t}=D.getParams();!e||!t||(E.gasPriceInUSD=De.getGasPriceInUSD(E.networkPrice,BigInt(E.gasFee),BigInt(Oe)),E.priceImpact=De.getPriceImpact({sourceTokenAmount:E.sourceTokenAmount,sourceTokenPriceInUSD:E.sourceTokenPriceInUSD,toTokenPriceInUSD:E.toTokenPriceInUSD,toTokenAmount:E.toTokenAmount}),E.maxSlippage=De.getMaxSlippage(E.slippage,E.toTokenAmount),E.providerFee=De.getProviderFee(E.sourceTokenAmount))}},D=oe(ke),O=ie({message:``,open:!1,triggerRect:{width:0,height:0,top:0,left:0},variant:`shade`}),k=oe({state:O,subscribe(e){return se(O,()=>e(O))},subscribeKey(e,t){return re(O,e,t)},showTooltip({message:e,triggerRect:t,variant:n}){O.open=!0,O.message=e,O.triggerRect=t,O.variant=n},hide(){O.open=!1,O.message=``,O.triggerRect={width:0,height:0,top:0,left:0}}}),Ae={isUnsupportedChainView(){return b.state.view===`UnsupportedChain`||b.state.view===`SwitchNetwork`&&b.state.history.includes(`UnsupportedChain`)},async safeClose(){if(this.isUnsupportedChainView()){m.shake();return}if(await Te.isSIWXCloseDisabled()){m.shake();return}(b.state.view===`DataCapture`||b.state.view===`DataCaptureOtpConfirm`)&&p.disconnect(),m.close()}},je=w`
  :host {
    display: block;
    border-radius: clamp(0px, ${({borderRadius:e})=>e[8]}, 44px);
    box-shadow: 0 0 0 1px ${({tokens:e})=>e.theme.foregroundPrimary};
    overflow: hidden;
  }
`,Me=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Ne=class extends n{render(){return e`<slot></slot>`}};Ne.styles=[S,je],Ne=Me([x(`wui-card`)],Ne);var Pe=w`
  :host {
    width: 100%;
  }

  :host > wui-flex {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${({spacing:e})=>e[2]};
    padding: ${({spacing:e})=>e[3]};
    border-radius: ${({borderRadius:e})=>e[6]};
    border: 1px solid ${({tokens:e})=>e.theme.borderPrimary};
    box-sizing: border-box;
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.25);
    color: ${({tokens:e})=>e.theme.textPrimary};
  }

  :host > wui-flex[data-type='info'] {
    .icon-box {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};

      wui-icon {
        color: ${({tokens:e})=>e.theme.iconDefault};
      }
    }
  }
  :host > wui-flex[data-type='success'] {
    .icon-box {
      background-color: ${({tokens:e})=>e.core.backgroundSuccess};

      wui-icon {
        color: ${({tokens:e})=>e.core.borderSuccess};
      }
    }
  }
  :host > wui-flex[data-type='warning'] {
    .icon-box {
      background-color: ${({tokens:e})=>e.core.backgroundWarning};

      wui-icon {
        color: ${({tokens:e})=>e.core.borderWarning};
      }
    }
  }
  :host > wui-flex[data-type='error'] {
    .icon-box {
      background-color: ${({tokens:e})=>e.core.backgroundError};

      wui-icon {
        color: ${({tokens:e})=>e.core.borderError};
      }
    }
  }

  wui-flex {
    width: 100%;
  }

  wui-text {
    word-break: break-word;
    flex: 1;
  }

  .close {
    cursor: pointer;
    color: ${({tokens:e})=>e.theme.iconDefault};
  }

  .icon-box {
    height: 40px;
    width: 40px;
    border-radius: ${({borderRadius:e})=>e[2]};
    background-color: var(--local-icon-bg-value);
  }
`,Fe=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Ie={info:`info`,success:`checkmark`,warning:`warningCircle`,error:`warning`},Le=class extends n{constructor(){super(...arguments),this.message=``,this.type=`info`}render(){return e`
      <wui-flex
        data-type=${s(this.type)}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        gap="2"
      >
        <wui-flex columnGap="2" flexDirection="row" alignItems="center">
          <wui-flex
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            class="icon-box"
          >
            <wui-icon color="inherit" size="md" name=${Ie[this.type]}></wui-icon>
          </wui-flex>
          <wui-text variant="md-medium" color="inherit" data-testid="wui-alertbar-text"
            >${this.message}</wui-text
          >
        </wui-flex>
        <wui-icon
          class="close"
          color="inherit"
          size="sm"
          name="close"
          @click=${this.onClose}
        ></wui-icon>
      </wui-flex>
    `}onClose(){Ee.close()}};Le.styles=[S,Pe],Fe([o()],Le.prototype,`message`,void 0),Fe([o()],Le.prototype,`type`,void 0),Le=Fe([x(`wui-alertbar`)],Le);var Re=w`
  :host {
    display: block;
    position: absolute;
    top: ${({spacing:e})=>e[3]};
    left: ${({spacing:e})=>e[4]};
    right: ${({spacing:e})=>e[4]};
    opacity: 0;
    pointer-events: none;
  }
`,ze=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Be={info:{backgroundColor:`fg-350`,iconColor:`fg-325`,icon:`info`},success:{backgroundColor:`success-glass-reown-020`,iconColor:`success-125`,icon:`checkmark`},warning:{backgroundColor:`warning-glass-reown-020`,iconColor:`warning-100`,icon:`warningCircle`},error:{backgroundColor:`error-glass-reown-020`,iconColor:`error-125`,icon:`warning`}},Ve=class extends n{constructor(){super(),this.unsubscribe=[],this.open=Ee.state.open,this.onOpen(!0),this.unsubscribe.push(Ee.subscribeKey(`open`,e=>{this.open=e,this.onOpen(!1)}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{message:t,variant:n}=Ee.state,r=Be[n];return e`
      <wui-alertbar
        message=${t}
        backgroundColor=${r?.backgroundColor}
        iconColor=${r?.iconColor}
        icon=${r?.icon}
        type=${n}
      ></wui-alertbar>
    `}onOpen(e){this.open?(this.animate([{opacity:0,transform:`scale(0.85)`},{opacity:1,transform:`scale(1)`}],{duration:150,fill:`forwards`,easing:`ease`}),this.style.cssText=`pointer-events: auto`):e||(this.animate([{opacity:1,transform:`scale(1)`},{opacity:0,transform:`scale(0.85)`}],{duration:150,fill:`forwards`,easing:`ease`}),this.style.cssText=`pointer-events: none`)}};Ve.styles=Re,ze([a()],Ve.prototype,`open`,void 0),Ve=ze([x(`w3m-alertbar`)],Ve);var He=w`
  :host {
    position: relative;
  }

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    padding: ${({spacing:e})=>e[1]};
  }

  /* -- Colors --------------------------------------------------- */
  button[data-type='accent'] wui-icon {
    color: ${({tokens:e})=>e.core.iconAccentPrimary};
  }

  button[data-type='neutral'][data-variant='primary'] wui-icon {
    color: ${({tokens:e})=>e.theme.iconInverse};
  }

  button[data-type='neutral'][data-variant='secondary'] wui-icon {
    color: ${({tokens:e})=>e.theme.iconDefault};
  }

  button[data-type='success'] wui-icon {
    color: ${({tokens:e})=>e.core.iconSuccess};
  }

  button[data-type='error'] wui-icon {
    color: ${({tokens:e})=>e.core.iconError};
  }

  /* -- Sizes --------------------------------------------------- */
  button[data-size='xs'] {
    width: 16px;
    height: 16px;

    border-radius: ${({borderRadius:e})=>e[1]};
  }

  button[data-size='sm'] {
    width: 20px;
    height: 20px;
    border-radius: ${({borderRadius:e})=>e[1]};
  }

  button[data-size='md'] {
    width: 24px;
    height: 24px;
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  button[data-size='lg'] {
    width: 28px;
    height: 28px;
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  button[data-size='xs'] wui-icon {
    width: 8px;
    height: 8px;
  }

  button[data-size='sm'] wui-icon {
    width: 12px;
    height: 12px;
  }

  button[data-size='md'] wui-icon {
    width: 16px;
    height: 16px;
  }

  button[data-size='lg'] wui-icon {
    width: 20px;
    height: 20px;
  }

  /* -- Hover --------------------------------------------------- */
  @media (hover: hover) {
    button[data-type='accent']:hover:enabled {
      background-color: ${({tokens:e})=>e.core.foregroundAccent010};
    }

    button[data-variant='primary'][data-type='neutral']:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }

    button[data-variant='secondary'][data-type='neutral']:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }

    button[data-type='success']:hover:enabled {
      background-color: ${({tokens:e})=>e.core.backgroundSuccess};
    }

    button[data-type='error']:hover:enabled {
      background-color: ${({tokens:e})=>e.core.backgroundError};
    }
  }

  /* -- Focus --------------------------------------------------- */
  button:focus-visible {
    box-shadow: 0 0 0 4px ${({tokens:e})=>e.core.foregroundAccent020};
  }

  /* -- Properties --------------------------------------------------- */
  button[data-full-width='true'] {
    width: 100%;
  }

  :host([fullWidth]) {
    width: 100%;
  }

  button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,Ue=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},A=class extends n{constructor(){super(...arguments),this.icon=`card`,this.variant=`primary`,this.type=`accent`,this.size=`md`,this.iconSize=void 0,this.fullWidth=!1,this.disabled=!1}render(){return e`<button
      data-variant=${this.variant}
      data-type=${this.type}
      data-size=${this.size}
      data-full-width=${this.fullWidth}
      ?disabled=${this.disabled}
    >
      <wui-icon color="inherit" name=${this.icon} size=${s(this.iconSize)}></wui-icon>
    </button>`}};A.styles=[S,ye,He],Ue([o()],A.prototype,`icon`,void 0),Ue([o()],A.prototype,`variant`,void 0),Ue([o()],A.prototype,`type`,void 0),Ue([o()],A.prototype,`size`,void 0),Ue([o()],A.prototype,`iconSize`,void 0),Ue([o({type:Boolean})],A.prototype,`fullWidth`,void 0),Ue([o({type:Boolean})],A.prototype,`disabled`,void 0),A=Ue([x(`wui-icon-button`)],A);var We=w`
  button {
    display: block;
    display: flex;
    align-items: center;
    padding: ${({spacing:e})=>e[1]};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e[`ease-out-power-2`]};
    will-change: background-color;
    border-radius: ${({borderRadius:e})=>e[32]};
  }

  wui-image {
    border-radius: 100%;
  }

  wui-text {
    padding-left: ${({spacing:e})=>e[1]};
  }

  .left-icon-container,
  .right-icon-container {
    width: 24px;
    height: 24px;
    justify-content: center;
    align-items: center;
  }

  wui-icon {
    color: ${({tokens:e})=>e.theme.iconDefault};
  }

  /* -- Sizes --------------------------------------------------- */
  button[data-size='lg'] {
    height: 32px;
  }

  button[data-size='md'] {
    height: 28px;
  }

  button[data-size='sm'] {
    height: 24px;
  }

  button[data-size='lg'] wui-image {
    width: 24px;
    height: 24px;
  }

  button[data-size='md'] wui-image {
    width: 20px;
    height: 20px;
  }

  button[data-size='sm'] wui-image {
    width: 16px;
    height: 16px;
  }

  button[data-size='lg'] .left-icon-container {
    width: 24px;
    height: 24px;
  }

  button[data-size='md'] .left-icon-container {
    width: 20px;
    height: 20px;
  }

  button[data-size='sm'] .left-icon-container {
    width: 16px;
    height: 16px;
  }

  /* -- Variants --------------------------------------------------------- */
  button[data-type='filled-dropdown'] {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  button[data-type='text-dropdown'] {
    background-color: transparent;
  }

  /* -- Focus states --------------------------------------------------- */
  button:focus-visible:enabled {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    box-shadow: 0 0 0 4px ${({tokens:e})=>e.core.foregroundAccent040};
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  @media (hover: hover) and (pointer: fine) {
    button:hover:enabled,
    button:active:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }
  }

  /* -- Disabled states --------------------------------------------------- */
  button:disabled {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    opacity: 0.5;
  }
`,Ge=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Ke={lg:`lg-regular`,md:`md-regular`,sm:`sm-regular`},qe={lg:`lg`,md:`md`,sm:`sm`},j=class extends n{constructor(){super(...arguments),this.imageSrc=``,this.text=``,this.size=`lg`,this.type=`text-dropdown`,this.disabled=!1}render(){return e`<button ?disabled=${this.disabled} data-size=${this.size} data-type=${this.type}>
      ${this.imageTemplate()} ${this.textTemplate()}
      <wui-flex class="right-icon-container">
        <wui-icon name="chevronBottom"></wui-icon>
      </wui-flex>
    </button>`}textTemplate(){let t=Ke[this.size];return this.text?e`<wui-text color="primary" variant=${t}>${this.text}</wui-text>`:null}imageTemplate(){return this.imageSrc?e`<wui-image src=${this.imageSrc} alt="select visual"></wui-image>`:e` <wui-flex class="left-icon-container">
      <wui-icon size=${qe[this.size]} name="networkPlaceholder"></wui-icon>
    </wui-flex>`}};j.styles=[S,ye,We],Ge([o()],j.prototype,`imageSrc`,void 0),Ge([o()],j.prototype,`text`,void 0),Ge([o()],j.prototype,`size`,void 0),Ge([o()],j.prototype,`type`,void 0),Ge([o({type:Boolean})],j.prototype,`disabled`,void 0),j=Ge([x(`wui-select`)],j);var Je={ACCOUNT_TABS:[{label:`Tokens`},{label:`Activity`}],SECURE_SITE_ORIGIN:(typeof process<`u`?{}.NEXT_PUBLIC_SECURE_SITE_ORIGIN:void 0)||`https://secure.walletconnect.org`,VIEW_DIRECTION:{Next:`next`,Prev:`prev`},ANIMATION_DURATIONS:{HeaderText:120,ModalHeight:150,ViewTransition:150},VIEWS_WITH_LEGAL_FOOTER:[`Connect`,`ConnectWallets`,`OnRampTokenSelect`,`OnRampFiatSelect`,`OnRampProviders`],VIEWS_WITH_DEFAULT_FOOTER:[`Networks`]},Ye=w`
  button {
    background-color: transparent;
    padding: ${({spacing:e})=>e[1]};
  }

  button:focus-visible {
    box-shadow: 0 0 0 4px ${({tokens:e})=>e.core.foregroundAccent020};
  }

  button[data-variant='accent']:hover:enabled,
  button[data-variant='accent']:focus-visible {
    background-color: ${({tokens:e})=>e.core.foregroundAccent010};
  }

  button[data-variant='primary']:hover:enabled,
  button[data-variant='primary']:focus-visible,
  button[data-variant='secondary']:hover:enabled,
  button[data-variant='secondary']:focus-visible {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  button[data-size='xs'] > wui-icon {
    width: 8px;
    height: 8px;
  }

  button[data-size='sm'] > wui-icon {
    width: 12px;
    height: 12px;
  }

  button[data-size='xs'],
  button[data-size='sm'] {
    border-radius: ${({borderRadius:e})=>e[1]};
  }

  button[data-size='md'],
  button[data-size='lg'] {
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  button[data-size='md'] > wui-icon {
    width: 16px;
    height: 16px;
  }

  button[data-size='lg'] > wui-icon {
    width: 20px;
    height: 20px;
  }

  button:disabled {
    background-color: transparent;
    cursor: not-allowed;
    opacity: 0.5;
  }

  button:hover:not(:disabled) {
    background-color: var(--wui-color-accent-glass-015);
  }

  button:focus-visible:not(:disabled) {
    background-color: var(--wui-color-accent-glass-015);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-accent-100),
      0 0 0 4px var(--wui-color-accent-glass-020);
  }
`,Xe=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},M=class extends n{constructor(){super(...arguments),this.size=`md`,this.disabled=!1,this.icon=`copy`,this.iconColor=`default`,this.variant=`accent`}render(){return e`
      <button data-variant=${this.variant} ?disabled=${this.disabled} data-size=${this.size}>
        <wui-icon
          color=${{accent:`accent-primary`,primary:`inverse`,secondary:`default`}[this.variant]||this.iconColor}
          size=${this.size}
          name=${this.icon}
        ></wui-icon>
      </button>
    `}};M.styles=[S,ye,Ye],Xe([o()],M.prototype,`size`,void 0),Xe([o({type:Boolean})],M.prototype,`disabled`,void 0),Xe([o()],M.prototype,`icon`,void 0),Xe([o()],M.prototype,`iconColor`,void 0),Xe([o()],M.prototype,`variant`,void 0),M=Xe([x(`wui-icon-link`)],M);var Ze=t`<svg width="86" height="96" fill="none">
  <path
    d="M78.3244 18.926L50.1808 2.45078C45.7376 -0.150261 40.2624 -0.150262 35.8192 2.45078L7.6756 18.926C3.23322 21.5266 0.5 26.3301 0.5 31.5248V64.4752C0.5 69.6699 3.23322 74.4734 7.6756 77.074L35.8192 93.5492C40.2624 96.1503 45.7376 96.1503 50.1808 93.5492L78.3244 77.074C82.7668 74.4734 85.5 69.6699 85.5 64.4752V31.5248C85.5 26.3301 82.7668 21.5266 78.3244 18.926Z"
  />
</svg>`,Qe=t`
  <svg fill="none" viewBox="0 0 36 40">
    <path
      d="M15.4 2.1a5.21 5.21 0 0 1 5.2 0l11.61 6.7a5.21 5.21 0 0 1 2.61 4.52v13.4c0 1.87-1 3.59-2.6 4.52l-11.61 6.7c-1.62.93-3.6.93-5.22 0l-11.6-6.7a5.21 5.21 0 0 1-2.61-4.51v-13.4c0-1.87 1-3.6 2.6-4.52L15.4 2.1Z"
    />
  </svg>
`,$e=w`
  :host {
    position: relative;
    border-radius: inherit;
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--local-width);
    height: var(--local-height);
  }

  :host([data-round='true']) {
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: 100%;
    outline: 1px solid ${({tokens:e})=>e.core.glass010};
  }

  svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  svg > path {
    stroke: var(--local-stroke);
  }

  wui-image {
    width: 100%;
    height: 100%;
    -webkit-clip-path: var(--local-path);
    clip-path: var(--local-path);
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  wui-icon {
    transform: translateY(-5%);
    width: var(--local-icon-size);
    height: var(--local-icon-size);
  }
`,et=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},N=class extends n{constructor(){super(...arguments),this.size=`md`,this.name=`uknown`,this.networkImagesBySize={sm:Qe,md:we,lg:Ze},this.selected=!1,this.round=!1}render(){let t={sm:`4`,md:`6`,lg:`10`};return this.round?(this.dataset.round=`true`,this.style.cssText=`
      --local-width: var(--apkt-spacing-10);
      --local-height: var(--apkt-spacing-10);
      --local-icon-size: var(--apkt-spacing-4);
    `):this.style.cssText=`

      --local-path: var(--apkt-path-network-${this.size});
      --local-width:  var(--apkt-width-network-${this.size});
      --local-height:  var(--apkt-height-network-${this.size});
      --local-icon-size:  var(--apkt-spacing-${t[this.size]});
    `,e`${this.templateVisual()} ${this.svgTemplate()} `}svgTemplate(){return this.round?null:this.networkImagesBySize[this.size]}templateVisual(){return this.imageSrc?e`<wui-image src=${this.imageSrc} alt=${this.name}></wui-image>`:e`<wui-icon size="inherit" color="default" name="networkPlaceholder"></wui-icon>`}};N.styles=[S,$e],et([o()],N.prototype,`size`,void 0),et([o()],N.prototype,`name`,void 0),et([o({type:Object})],N.prototype,`networkImagesBySize`,void 0),et([o()],N.prototype,`imageSrc`,void 0),et([o({type:Boolean})],N.prototype,`selected`,void 0),et([o({type:Boolean})],N.prototype,`round`,void 0),N=et([x(`wui-network-image`)],N);var tt=w`
  :host {
    position: relative;
    display: flex;
    width: 100%;
    height: 1px;
    background-color: ${({tokens:e})=>e.theme.borderPrimary};
    justify-content: center;
    align-items: center;
  }

  :host > wui-text {
    position: absolute;
    padding: 0px 8px;
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e[`ease-out-power-2`]};
    will-change: background-color;
  }

  :host([data-bg-color='primary']) > wui-text {
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
  }

  :host([data-bg-color='secondary']) > wui-text {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }
`,nt=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},rt=class extends n{constructor(){super(...arguments),this.text=``,this.bgColor=`primary`}render(){return this.dataset.bgColor=this.bgColor,e`${this.template()}`}template(){return this.text?e`<wui-text variant="md-regular" color="secondary">${this.text}</wui-text>`:null}};rt.styles=[S,tt],nt([o()],rt.prototype,`text`,void 0),nt([o()],rt.prototype,`bgColor`,void 0),rt=nt([x(`wui-separator`)],rt);var P={INVALID_PAYMENT_CONFIG:`INVALID_PAYMENT_CONFIG`,INVALID_RECIPIENT:`INVALID_RECIPIENT`,INVALID_ASSET:`INVALID_ASSET`,INVALID_AMOUNT:`INVALID_AMOUNT`,UNKNOWN_ERROR:`UNKNOWN_ERROR`,UNABLE_TO_INITIATE_PAYMENT:`UNABLE_TO_INITIATE_PAYMENT`,INVALID_CHAIN_NAMESPACE:`INVALID_CHAIN_NAMESPACE`,GENERIC_PAYMENT_ERROR:`GENERIC_PAYMENT_ERROR`,UNABLE_TO_GET_EXCHANGES:`UNABLE_TO_GET_EXCHANGES`,ASSET_NOT_SUPPORTED:`ASSET_NOT_SUPPORTED`,UNABLE_TO_GET_PAY_URL:`UNABLE_TO_GET_PAY_URL`,UNABLE_TO_GET_BUY_STATUS:`UNABLE_TO_GET_BUY_STATUS`,UNABLE_TO_GET_TOKEN_BALANCES:`UNABLE_TO_GET_TOKEN_BALANCES`,UNABLE_TO_GET_QUOTE:`UNABLE_TO_GET_QUOTE`,UNABLE_TO_GET_QUOTE_STATUS:`UNABLE_TO_GET_QUOTE_STATUS`,INVALID_RECIPIENT_ADDRESS_FOR_ASSET:`INVALID_RECIPIENT_ADDRESS_FOR_ASSET`},it={[P.INVALID_PAYMENT_CONFIG]:`Invalid payment configuration`,[P.INVALID_RECIPIENT]:`Invalid recipient address`,[P.INVALID_ASSET]:`Invalid asset specified`,[P.INVALID_AMOUNT]:`Invalid payment amount`,[P.INVALID_RECIPIENT_ADDRESS_FOR_ASSET]:`Invalid recipient address for the asset selected`,[P.UNKNOWN_ERROR]:`Unknown payment error occurred`,[P.UNABLE_TO_INITIATE_PAYMENT]:`Unable to initiate payment`,[P.INVALID_CHAIN_NAMESPACE]:`Invalid chain namespace`,[P.GENERIC_PAYMENT_ERROR]:`Unable to process payment`,[P.UNABLE_TO_GET_EXCHANGES]:`Unable to get exchanges`,[P.ASSET_NOT_SUPPORTED]:`Asset not supported by the selected exchange`,[P.UNABLE_TO_GET_PAY_URL]:`Unable to get payment URL`,[P.UNABLE_TO_GET_BUY_STATUS]:`Unable to get buy status`,[P.UNABLE_TO_GET_TOKEN_BALANCES]:`Unable to get token balances`,[P.UNABLE_TO_GET_QUOTE]:`Unable to get quote. Please choose a different token`,[P.UNABLE_TO_GET_QUOTE_STATUS]:`Unable to get quote status`},F=class e extends Error{get message(){return it[this.code]}constructor(t,n){super(it[t]),this.name=`AppKitPayError`,this.code=t,this.details=n,Error.captureStackTrace&&Error.captureStackTrace(this,e)}},at=`https://rpc.walletconnect.org/v1/json-rpc`,ot=`reown_test`;function st(){let{chainNamespace:e}=f.parseCaipNetworkId(L.state.paymentAsset.network);if(!h.isAddress(L.state.recipient,e))throw new F(P.INVALID_RECIPIENT_ADDRESS_FOR_ASSET,`Provide valid recipient address for namespace "${e}"`)}async function ct(e,t,n){if(t!==l.CHAIN.EVM)throw new F(P.INVALID_CHAIN_NAMESPACE);if(!n.fromAddress)throw new F(P.INVALID_PAYMENT_CONFIG,`fromAddress is required for native EVM payments.`);let r=typeof n.amount==`string`?parseFloat(n.amount):n.amount;if(isNaN(r))throw new F(P.INVALID_PAYMENT_CONFIG);let i=e.metadata?.decimals??18,a=p.parseUnits(r.toString(),i);if(typeof a!=`bigint`)throw new F(P.GENERIC_PAYMENT_ERROR);return await p.sendTransaction({chainNamespace:t,to:n.recipient,address:n.fromAddress,value:a,data:`0x`})??void 0}async function lt(e,t){if(!t.fromAddress)throw new F(P.INVALID_PAYMENT_CONFIG,`fromAddress is required for ERC20 EVM payments.`);let n=e.asset,r=t.recipient,i=Number(e.metadata.decimals),a=p.parseUnits(t.amount.toString(),i);if(a===void 0)throw new F(P.GENERIC_PAYMENT_ERROR);return await p.writeContract({fromAddress:t.fromAddress,tokenAddress:n,args:[r,a],method:`transfer`,abi:ne.getERC20Abi(n),chainNamespace:l.CHAIN.EVM})??void 0}async function ut(e,t){if(e!==l.CHAIN.SOLANA)throw new F(P.INVALID_CHAIN_NAMESPACE);if(!t.fromAddress)throw new F(P.INVALID_PAYMENT_CONFIG,`fromAddress is required for Solana payments.`);let n=typeof t.amount==`string`?parseFloat(t.amount):t.amount;if(isNaN(n)||n<=0)throw new F(P.INVALID_PAYMENT_CONFIG,`Invalid payment amount.`);try{if(!le.getProvider(e))throw new F(P.GENERIC_PAYMENT_ERROR,`No Solana provider available.`);let r=await p.sendTransaction({chainNamespace:l.CHAIN.SOLANA,to:t.recipient,value:n,tokenMint:t.tokenMint});if(!r)throw new F(P.GENERIC_PAYMENT_ERROR,`Transaction failed.`);return r}catch(e){throw e instanceof F?e:new F(P.GENERIC_PAYMENT_ERROR,`Solana payment failed: ${e}`)}}async function dt({sourceToken:e,toToken:t,amount:n,recipient:r}){let i=p.parseUnits(n,e.metadata.decimals),a=p.parseUnits(n,t.metadata.decimals);return Promise.resolve({type:It,origin:{amount:i?.toString()??`0`,currency:e},destination:{amount:a?.toString()??`0`,currency:t},fees:[{id:`service`,label:`Service Fee`,amount:`0`,currency:t}],steps:[{requestId:It,type:`deposit`,deposit:{amount:i?.toString()??`0`,currency:e.asset,receiver:r}}],timeInSeconds:6})}function ft(e){if(!e)return null;let t=e.steps[0];return!t||t.type!==`deposit`?null:t}function pt(e,t=0){if(!e)return[];let n=e.steps.filter(e=>e.type===Lt),r=n.filter((e,n)=>n+1>t);return n.length>0&&n.length<3?r:[]}var mt=new ee({baseUrl:h.getApiUrl(),clientId:null}),ht=class extends Error{};function gt(){return`${at}?projectId=${g.getSnapshot().projectId}`}function _t(){let{projectId:e,sdkType:t,sdkVersion:n}=g.state;return{projectId:e,st:t||`appkit`,sv:n||`html-wagmi-4.2.2`}}async function vt(e,t){let n=gt(),{sdkType:r,sdkVersion:i,projectId:a}=g.getSnapshot(),o={jsonrpc:`2.0`,id:1,method:e,params:{...t||{},st:r,sv:i,projectId:a}},s=await(await fetch(n,{method:`POST`,body:JSON.stringify(o),headers:{"Content-Type":`application/json`}})).json();if(s.error)throw new ht(s.error.message);return s}async function yt(e){return(await vt(`reown_getExchanges`,e)).result}async function bt(e){return(await vt(`reown_getExchangePayUrl`,e)).result}async function xt(e){return(await vt(`reown_getExchangeBuyStatus`,e)).result}async function St(e){let t=u.bigNumber(e.amount).times(10**e.toToken.metadata.decimals).toString(),{chainId:n,chainNamespace:r}=f.parseCaipNetworkId(e.sourceToken.network),{chainId:i,chainNamespace:a}=f.parseCaipNetworkId(e.toToken.network),o=e.sourceToken.asset===`native`?de(r):e.sourceToken.asset,s=e.toToken.asset===`native`?de(a):e.toToken.asset;return await mt.post({path:`/appkit/v1/transfers/quote`,body:{user:e.address,originChainId:n.toString(),originCurrency:o,destinationChainId:i.toString(),destinationCurrency:s,recipient:e.recipient,amount:t},params:_t()})}async function Ct(e){let t=C.isLowerCaseMatch(e.sourceToken.network,e.toToken.network),n=C.isLowerCaseMatch(e.sourceToken.asset,e.toToken.asset);return t&&n?dt(e):St(e)}async function wt(e){return await mt.get({path:`/appkit/v1/transfers/status`,params:{requestId:e.requestId,..._t()}})}async function Tt(e){return await mt.get({path:`/appkit/v1/transfers/assets/exchanges/${e}`,params:_t()})}var Et=[`eip155`,`solana`],Dt={eip155:{native:{assetNamespace:`slip44`,assetReference:`60`},defaultTokenNamespace:`erc20`},solana:{native:{assetNamespace:`slip44`,assetReference:`501`},defaultTokenNamespace:`token`}};function Ot(e,t){let{chainNamespace:n,chainId:r}=f.parseCaipNetworkId(e),i=Dt[n];if(!i)throw Error(`Unsupported chain namespace for CAIP-19 formatting: ${n}`);let a=i.native.assetNamespace,o=i.native.assetReference;return t!==`native`&&(a=i.defaultTokenNamespace,o=t),`${`${n}:${r}`}/${a}:${o}`}function kt(e){let{chainNamespace:t}=f.parseCaipNetworkId(e);return Et.includes(t)}function At(e){let t=v.getAllRequestedCaipNetworks().find(t=>t.caipNetworkId===e.chainId),n=e.address;if(!t)throw Error(`Target network not found for balance chainId "${e.chainId}"`);if(C.isLowerCaseMatch(e.symbol,t.nativeCurrency.symbol))n=`native`;else if(h.isCaipAddress(n)){let{address:e}=f.parseCaipAddress(n);n=e}else if(!n)throw Error(`Balance address not found for balance symbol "${e.symbol}"`);return{network:t.caipNetworkId,asset:n,metadata:{name:e.name,symbol:e.symbol,decimals:Number(e.quantity.decimals),logoURI:e.iconUrl},amount:e.quantity.numeric}}function jt(e){return{chainId:e.network,address:`${e.network}:${e.asset}`,symbol:e.metadata.symbol,name:e.metadata.name,iconUrl:e.metadata.logoURI||``,price:0,quantity:{numeric:`0`,decimals:e.metadata.decimals.toString()}}}function Mt(e){let t=u.bigNumber(e,{safe:!0});return t.lt(.001)?`<0.001`:t.round(4).toString()}function Nt(e){let t=v.getAllRequestedCaipNetworks().find(t=>t.caipNetworkId===e.network);return t?!!t.testnet:!1}var Pt=0,Ft=`unknown`,It=`direct-transfer`,Lt=`transaction`,I=ie({paymentAsset:{network:`eip155:1`,asset:`0x0`,metadata:{name:`0x0`,symbol:`0x0`,decimals:0}},recipient:`0x0`,amount:0,isConfigured:!1,error:null,isPaymentInProgress:!1,exchanges:[],isLoading:!1,openInNewTab:!0,redirectUrl:void 0,payWithExchange:void 0,currentPayment:void 0,analyticsSet:!1,paymentId:void 0,choice:`pay`,tokenBalances:{[l.CHAIN.EVM]:[],[l.CHAIN.SOLANA]:[]},isFetchingTokenBalances:!1,selectedPaymentAsset:null,quote:void 0,quoteStatus:`waiting`,quoteError:null,isFetchingQuote:!1,selectedExchange:void 0,exchangeUrlForQuote:void 0,requestId:void 0}),L={state:I,subscribe(e){return se(I,()=>e(I))},subscribeKey(e,t){return re(I,e,t)},async handleOpenPay(e){this.resetState(),this.setPaymentConfig(e),this.initializeAnalytics(),st(),await this.prepareTokenLogo(),I.isConfigured=!0,y.sendEvent({type:`track`,event:`PAY_MODAL_OPEN`,properties:{exchanges:I.exchanges,configuration:{network:I.paymentAsset.network,asset:I.paymentAsset.asset,recipient:I.recipient,amount:I.amount}}}),await m.open({view:`Pay`})},resetState(){I.paymentAsset={network:`eip155:1`,asset:`0x0`,metadata:{name:`0x0`,symbol:`0x0`,decimals:0}},I.recipient=`0x0`,I.amount=0,I.isConfigured=!1,I.error=null,I.isPaymentInProgress=!1,I.isLoading=!1,I.currentPayment=void 0,I.selectedExchange=void 0,I.exchangeUrlForQuote=void 0,I.requestId=void 0},resetQuoteState(){I.quote=void 0,I.quoteStatus=`waiting`,I.quoteError=null,I.isFetchingQuote=!1,I.requestId=void 0},setPaymentConfig(e){if(!e.paymentAsset)throw new F(P.INVALID_PAYMENT_CONFIG);try{I.choice=e.choice??`pay`,I.paymentAsset=e.paymentAsset,I.recipient=e.recipient,I.amount=e.amount,I.openInNewTab=e.openInNewTab??!0,I.redirectUrl=e.redirectUrl,I.payWithExchange=e.payWithExchange,I.error=null}catch(e){throw new F(P.INVALID_PAYMENT_CONFIG,e.message)}},setSelectedPaymentAsset(e){I.selectedPaymentAsset=e},setSelectedExchange(e){I.selectedExchange=e},setRequestId(e){I.requestId=e},setPaymentInProgress(e){I.isPaymentInProgress=e},getPaymentAsset(){return I.paymentAsset},getExchanges(){return I.exchanges},async fetchExchanges(){try{I.isLoading=!0,I.exchanges=(await yt({page:Pt})).exchanges.slice(0,2)}catch{throw c.showError(it.UNABLE_TO_GET_EXCHANGES),new F(P.UNABLE_TO_GET_EXCHANGES)}finally{I.isLoading=!1}},async getAvailableExchanges(e){try{let t=e?.asset&&e?.network?Ot(e.network,e.asset):void 0;return await yt({page:e?.page??Pt,asset:t,amount:e?.amount?.toString()})}catch{throw new F(P.UNABLE_TO_GET_EXCHANGES)}},async getPayUrl(e,t,n=!1){try{let r=Number(t.amount),i=await bt({exchangeId:e,asset:Ot(t.network,t.asset),amount:r.toString(),recipient:`${t.network}:${t.recipient}`});return y.sendEvent({type:`track`,event:`PAY_EXCHANGE_SELECTED`,properties:{source:`pay`,exchange:{id:e},configuration:{network:t.network,asset:t.asset,recipient:t.recipient,amount:r},currentPayment:{type:`exchange`,exchangeId:e},headless:n}}),n&&(this.initiatePayment(),y.sendEvent({type:`track`,event:`PAY_INITIATED`,properties:{source:`pay`,paymentId:I.paymentId||Ft,configuration:{network:t.network,asset:t.asset,recipient:t.recipient,amount:r},currentPayment:{type:`exchange`,exchangeId:e}}})),i}catch(e){throw e instanceof Error&&e.message.includes(`is not supported`)?new F(P.ASSET_NOT_SUPPORTED):Error(e.message)}},async generateExchangeUrlForQuote({exchangeId:e,paymentAsset:t,amount:n,recipient:r}){let i=await bt({exchangeId:e,asset:Ot(t.network,t.asset),amount:n.toString(),recipient:r});I.exchangeSessionId=i.sessionId,I.exchangeUrlForQuote=i.url},async openPayUrl(e,t,n=!1){try{let r=await this.getPayUrl(e.exchangeId,t,n);if(!r)throw new F(P.UNABLE_TO_GET_PAY_URL);let i=e.openInNewTab??!0?`_blank`:`_self`;return h.openHref(r.url,i),r}catch(e){throw e instanceof F?I.error=e.message:I.error=it.GENERIC_PAYMENT_ERROR,new F(P.UNABLE_TO_GET_PAY_URL)}},async onTransfer({chainNamespace:e,fromAddress:t,toAddress:n,amount:r,paymentAsset:i}){if(I.currentPayment={type:`wallet`,status:`IN_PROGRESS`},!I.isPaymentInProgress)try{this.initiatePayment();let a=v.getAllRequestedCaipNetworks().find(e=>e.caipNetworkId===i.network);if(!a)throw Error(`Target network not found`);let o=v.state.activeCaipNetwork;switch(C.isLowerCaseMatch(o?.caipNetworkId,a.caipNetworkId)||await v.switchActiveNetwork(a),e){case l.CHAIN.EVM:i.asset===`native`&&(I.currentPayment.result=await ct(i,e,{recipient:n,amount:r,fromAddress:t})),i.asset.startsWith(`0x`)&&(I.currentPayment.result=await lt(i,{recipient:n,amount:r,fromAddress:t})),I.currentPayment.status=`SUCCESS`;break;case l.CHAIN.SOLANA:I.currentPayment.result=await ut(e,{recipient:n,amount:r,fromAddress:t,tokenMint:i.asset===`native`?void 0:i.asset}),I.currentPayment.status=`SUCCESS`;break;default:throw new F(P.INVALID_CHAIN_NAMESPACE)}}catch(e){throw e instanceof F?I.error=e.message:I.error=it.GENERIC_PAYMENT_ERROR,I.currentPayment.status=`FAILED`,c.showError(I.error),e}finally{I.isPaymentInProgress=!1}},async onSendTransaction(e){try{let{namespace:t,transactionStep:n}=e;L.initiatePayment();let r=v.getAllRequestedCaipNetworks().find(e=>e.caipNetworkId===I.paymentAsset?.network);if(!r)throw Error(`Target network not found`);let i=v.state.activeCaipNetwork;if(C.isLowerCaseMatch(i?.caipNetworkId,r.caipNetworkId)||await v.switchActiveNetwork(r),t===l.CHAIN.EVM){let{from:e,to:r,data:i,value:a}=n.transaction;await p.sendTransaction({address:e,to:r,data:i,value:BigInt(a),chainNamespace:t})}else if(t===l.CHAIN.SOLANA){let{instructions:e}=n.transaction;await p.writeSolanaTransaction({instructions:e})}}catch(e){throw e instanceof F?I.error=e.message:I.error=it.GENERIC_PAYMENT_ERROR,c.showError(I.error),e}finally{I.isPaymentInProgress=!1}},getExchangeById(e){return I.exchanges.find(t=>t.id===e)},validatePayConfig(e){let{paymentAsset:t,recipient:n,amount:r}=e;if(!t)throw new F(P.INVALID_PAYMENT_CONFIG);if(!n)throw new F(P.INVALID_RECIPIENT);if(!t.asset)throw new F(P.INVALID_ASSET);if(r==null||r<=0)throw new F(P.INVALID_AMOUNT)},async handlePayWithExchange(e){try{I.currentPayment={type:`exchange`,exchangeId:e};let{network:t,asset:n}=I.paymentAsset,r={network:t,asset:n,amount:I.amount,recipient:I.recipient},i=await this.getPayUrl(e,r);if(!i)throw new F(P.UNABLE_TO_INITIATE_PAYMENT);return I.currentPayment.sessionId=i.sessionId,I.currentPayment.status=`IN_PROGRESS`,I.currentPayment.exchangeId=e,this.initiatePayment(),{url:i.url,openInNewTab:I.openInNewTab}}catch(e){return e instanceof F?I.error=e.message:I.error=it.GENERIC_PAYMENT_ERROR,I.isPaymentInProgress=!1,c.showError(I.error),null}},async getBuyStatus(e,t){try{let n=await xt({sessionId:t,exchangeId:e});return(n.status===`SUCCESS`||n.status===`FAILED`)&&y.sendEvent({type:`track`,event:n.status===`SUCCESS`?`PAY_SUCCESS`:`PAY_ERROR`,properties:{message:n.status===`FAILED`?h.parseError(I.error):void 0,source:`pay`,paymentId:I.paymentId||Ft,configuration:{network:I.paymentAsset.network,asset:I.paymentAsset.asset,recipient:I.recipient,amount:I.amount},currentPayment:{type:`exchange`,exchangeId:I.currentPayment?.exchangeId,sessionId:I.currentPayment?.sessionId,result:n.txHash}}}),n}catch{throw new F(P.UNABLE_TO_GET_BUY_STATUS)}},async fetchTokensFromEOA({caipAddress:e,caipNetwork:t,namespace:n}){if(!e)return[];let{address:r}=f.parseCaipAddress(e),i=t;return n===l.CHAIN.EVM&&(i=void 0),await ge.getMyTokensWithBalance({address:r,caipNetwork:i})},async fetchTokensFromExchange(){if(!I.selectedExchange)return[];let e=await Tt(I.selectedExchange.id),t=Object.values(e.assets).flat();return await Promise.all(t.map(async e=>{let t=jt(e),{chainNamespace:n}=f.parseCaipNetworkId(t.chainId),r=t.address;if(h.isCaipAddress(r)){let{address:e}=f.parseCaipAddress(r);r=e}return t.iconUrl=await d.getImageByToken(r??``,n).catch(()=>void 0)??``,t}))},async fetchTokens({caipAddress:e,caipNetwork:t,namespace:n}){try{I.isFetchingTokenBalances=!0;let r=await(I.selectedExchange?this.fetchTokensFromExchange():this.fetchTokensFromEOA({caipAddress:e,caipNetwork:t,namespace:n}));I.tokenBalances={...I.tokenBalances,[n]:r}}catch(e){let t=e instanceof Error?e.message:`Unable to get token balances`;c.showError(t)}finally{I.isFetchingTokenBalances=!1}},async fetchQuote({amount:e,address:t,sourceToken:n,toToken:r,recipient:i}){try{L.resetQuoteState(),I.isFetchingQuote=!0;let a=await Ct({amount:e,address:I.selectedExchange?void 0:t,sourceToken:n,toToken:r,recipient:i});if(I.selectedExchange){let e=ft(a);if(e){let t=`${n.network}:${e.deposit.receiver}`,r=u.formatNumber(e.deposit.amount,{decimals:n.metadata.decimals??0,round:8});await L.generateExchangeUrlForQuote({exchangeId:I.selectedExchange.id,paymentAsset:n,amount:r.toString(),recipient:t})}}I.quote=a}catch(e){let t=it.UNABLE_TO_GET_QUOTE;if(e instanceof Error&&e.cause&&e.cause instanceof Response)try{let n=await e.cause.json();n.error&&typeof n.error==`string`&&(t=n.error)}catch{}throw I.quoteError=t,c.showError(t),new F(P.UNABLE_TO_GET_QUOTE)}finally{I.isFetchingQuote=!1}},async fetchQuoteStatus({requestId:e}){try{if(e===`direct-transfer`){let e=I.selectedExchange,t=I.exchangeSessionId;if(e&&t){switch((await this.getBuyStatus(e.id,t)).status){case`IN_PROGRESS`:I.quoteStatus=`waiting`;break;case`SUCCESS`:I.quoteStatus=`success`,I.isPaymentInProgress=!1;break;case`FAILED`:I.quoteStatus=`failure`,I.isPaymentInProgress=!1;break;case`UNKNOWN`:I.quoteStatus=`waiting`;break;default:I.quoteStatus=`waiting`;break}return}I.quoteStatus=`success`;return}let{status:t}=await wt({requestId:e});I.quoteStatus=t}catch{throw I.quoteStatus=`failure`,new F(P.UNABLE_TO_GET_QUOTE_STATUS)}},initiatePayment(){I.isPaymentInProgress=!0,I.paymentId=crypto.randomUUID()},initializeAnalytics(){I.analyticsSet||(I.analyticsSet=!0,this.subscribeKey(`isPaymentInProgress`,e=>{if(I.currentPayment?.status&&I.currentPayment.status!==`UNKNOWN`){let e={IN_PROGRESS:`PAY_INITIATED`,SUCCESS:`PAY_SUCCESS`,FAILED:`PAY_ERROR`}[I.currentPayment.status];y.sendEvent({type:`track`,event:e,properties:{message:I.currentPayment.status===`FAILED`?h.parseError(I.error):void 0,source:`pay`,paymentId:I.paymentId||Ft,configuration:{network:I.paymentAsset.network,asset:I.paymentAsset.asset,recipient:I.recipient,amount:I.amount},currentPayment:{type:I.currentPayment.type,exchangeId:I.currentPayment.exchangeId,sessionId:I.currentPayment.sessionId,result:I.currentPayment.result}}})}}))},async prepareTokenLogo(){if(!I.paymentAsset.metadata.logoURI)try{let{chainNamespace:e}=f.parseCaipNetworkId(I.paymentAsset.network),t=await d.getImageByToken(I.paymentAsset.asset,e);I.paymentAsset.metadata.logoURI=t}catch{}}},Rt=w`
  wui-separator {
    margin: var(--apkt-spacing-3) calc(var(--apkt-spacing-3) * -1) var(--apkt-spacing-2)
      calc(var(--apkt-spacing-3) * -1);
    width: calc(100% + var(--apkt-spacing-3) * 2);
  }

  .token-display {
    padding: var(--apkt-spacing-3) var(--apkt-spacing-3);
    border-radius: var(--apkt-borderRadius-5);
    background-color: var(--apkt-tokens-theme-backgroundPrimary);
    margin-top: var(--apkt-spacing-3);
    margin-bottom: var(--apkt-spacing-3);
  }

  .token-display wui-text {
    text-transform: none;
  }

  wui-loading-spinner {
    padding: var(--apkt-spacing-2);
  }

  .left-image-container {
    position: relative;
    justify-content: center;
    align-items: center;
  }

  .token-image {
    border-radius: ${({borderRadius:e})=>e.round};
    width: 40px;
    height: 40px;
  }

  .chain-image {
    position: absolute;
    width: 20px;
    height: 20px;
    bottom: -3px;
    right: -5px;
    border-radius: ${({borderRadius:e})=>e.round};
    border: 2px solid ${({tokens:e})=>e.theme.backgroundPrimary};
  }

  .payment-methods-container {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-top-right-radius: ${({borderRadius:e})=>e[8]};
    border-top-left-radius: ${({borderRadius:e})=>e[8]};
  }
`,R=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},z=class extends n{constructor(){super(),this.unsubscribe=[],this.amount=L.state.amount,this.namespace=void 0,this.paymentAsset=L.state.paymentAsset,this.activeConnectorIds=_.state.activeConnectorIds,this.caipAddress=void 0,this.exchanges=L.state.exchanges,this.isLoading=L.state.isLoading,this.initializeNamespace(),this.unsubscribe.push(L.subscribeKey(`amount`,e=>this.amount=e)),this.unsubscribe.push(_.subscribeKey(`activeConnectorIds`,e=>this.activeConnectorIds=e)),this.unsubscribe.push(L.subscribeKey(`exchanges`,e=>this.exchanges=e)),this.unsubscribe.push(L.subscribeKey(`isLoading`,e=>this.isLoading=e)),L.fetchExchanges(),L.setSelectedExchange(void 0)}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return e`
      <wui-flex flexDirection="column">
        ${this.paymentDetailsTemplate()} ${this.paymentMethodsTemplate()}
      </wui-flex>
    `}paymentMethodsTemplate(){return e`
      <wui-flex flexDirection="column" padding="3" gap="2" class="payment-methods-container">
        ${this.payWithWalletTemplate()} ${this.templateSeparator()}
        ${this.templateExchangeOptions()}
      </wui-flex>
    `}initializeNamespace(){let e=v.state.activeChain;this.namespace=e,this.caipAddress=v.getAccountData(e)?.caipAddress,this.unsubscribe.push(v.subscribeChainProp(`accountState`,e=>{this.caipAddress=e?.caipAddress},e))}paymentDetailsTemplate(){let t=v.getAllRequestedCaipNetworks().find(e=>e.caipNetworkId===this.paymentAsset.network);return e`
      <wui-flex
        alignItems="center"
        justifyContent="space-between"
        .padding=${[`6`,`8`,`6`,`8`]}
        gap="2"
      >
        <wui-flex alignItems="center" gap="1">
          <wui-text variant="h1-regular" color="primary">
            ${Mt(this.amount||`0`)}
          </wui-text>

          <wui-flex flexDirection="column">
            <wui-text variant="h6-regular" color="secondary">
              ${this.paymentAsset.metadata.symbol||`Unknown`}
            </wui-text>
            <wui-text variant="md-medium" color="secondary"
              >on ${t?.name||`Unknown`}</wui-text
            >
          </wui-flex>
        </wui-flex>

        <wui-flex class="left-image-container">
          <wui-image
            src=${s(this.paymentAsset.metadata.logoURI)}
            class="token-image"
          ></wui-image>
          <wui-image
            src=${s(d.getNetworkImage(t))}
            class="chain-image"
          ></wui-image>
        </wui-flex>
      </wui-flex>
    `}payWithWalletTemplate(){return kt(this.paymentAsset.network)?this.caipAddress?this.connectedWalletTemplate():this.disconnectedWalletTemplate():e``}connectedWalletTemplate(){let{name:t,image:n}=this.getWalletProperties({namespace:this.namespace});return e`
      <wui-flex flexDirection="column" gap="3">
        <wui-list-item
          type="secondary"
          boxColor="foregroundSecondary"
          @click=${this.onWalletPayment}
          .boxed=${!1}
          ?chevron=${!0}
          ?fullSize=${!1}
          ?rounded=${!0}
          data-testid="wallet-payment-option"
          imageSrc=${s(n)}
          imageSize="3xl"
        >
          <wui-text variant="lg-regular" color="primary">Pay with ${t}</wui-text>
        </wui-list-item>

        <wui-list-item
          type="secondary"
          icon="power"
          iconColor="error"
          @click=${this.onDisconnect}
          data-testid="disconnect-button"
          ?chevron=${!1}
          boxColor="foregroundSecondary"
        >
          <wui-text variant="lg-regular" color="secondary">Disconnect</wui-text>
        </wui-list-item>
      </wui-flex>
    `}disconnectedWalletTemplate(){return e`<wui-list-item
      type="secondary"
      boxColor="foregroundSecondary"
      variant="icon"
      iconColor="default"
      iconVariant="overlay"
      icon="wallet"
      @click=${this.onWalletPayment}
      ?chevron=${!0}
      data-testid="wallet-payment-option"
    >
      <wui-text variant="lg-regular" color="primary">Pay with wallet</wui-text>
    </wui-list-item>`}templateExchangeOptions(){if(this.isLoading)return e`<wui-flex justifyContent="center" alignItems="center">
        <wui-loading-spinner size="md"></wui-loading-spinner>
      </wui-flex>`;let t=this.exchanges.filter(e=>Nt(this.paymentAsset)?e.id===ot:e.id!==ot);return t.length===0?e`<wui-flex justifyContent="center" alignItems="center">
        <wui-text variant="md-medium" color="primary">No exchanges available</wui-text>
      </wui-flex>`:t.map(t=>e`
        <wui-list-item
          type="secondary"
          boxColor="foregroundSecondary"
          @click=${()=>this.onExchangePayment(t)}
          data-testid="exchange-option-${t.id}"
          ?chevron=${!0}
          imageSrc=${s(t.imageUrl)}
        >
          <wui-text flexGrow="1" variant="lg-regular" color="primary">
            Pay with ${t.name}
          </wui-text>
        </wui-list-item>
      `)}templateSeparator(){return e`<wui-separator text="or" bgColor="secondary"></wui-separator>`}async onWalletPayment(){if(!this.namespace)throw Error(`Namespace not found`);this.caipAddress?b.push(`PayQuote`):(await _.connect(),await m.open({view:`PayQuote`}))}onExchangePayment(e){L.setSelectedExchange(e),b.push(`PayQuote`)}async onDisconnect(){try{await p.disconnect(),await m.open({view:`Pay`})}catch{console.error(`Failed to disconnect`),c.showError(`Failed to disconnect`)}}getWalletProperties({namespace:e}){if(!e)return{name:void 0,image:void 0};let t=this.activeConnectorIds[e];if(!t)return{name:void 0,image:void 0};let n=_.getConnector({id:t,namespace:e});if(!n)return{name:void 0,image:void 0};let r=d.getConnectorImage(n);return{name:n.name,image:r}}};z.styles=Rt,R([a()],z.prototype,`amount`,void 0),R([a()],z.prototype,`namespace`,void 0),R([a()],z.prototype,`paymentAsset`,void 0),R([a()],z.prototype,`activeConnectorIds`,void 0),R([a()],z.prototype,`caipAddress`,void 0),R([a()],z.prototype,`exchanges`,void 0),R([a()],z.prototype,`isLoading`,void 0),z=R([x(`w3m-pay-view`)],z);var zt=w`
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .pulse-container {
    position: relative;
    width: var(--pulse-size);
    height: var(--pulse-size);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pulse-rings {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .pulse-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 2px solid var(--pulse-color);
    opacity: 0;
    animation: pulse var(--pulse-duration, 2s) ease-out infinite;
  }

  .pulse-content {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @keyframes pulse {
    0% {
      transform: scale(0.5);
      opacity: var(--pulse-opacity, 0.3);
    }
    50% {
      opacity: calc(var(--pulse-opacity, 0.3) * 0.5);
    }
    100% {
      transform: scale(1.2);
      opacity: 0;
    }
  }
`,Bt=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Vt=3,Ht=2,Ut=.3,Wt=`200px`,Gt={"accent-primary":be.tokens.core.backgroundAccentPrimary},B=class extends n{constructor(){super(...arguments),this.rings=Vt,this.duration=Ht,this.opacity=Ut,this.size=Wt,this.variant=`accent-primary`}render(){let t=Gt[this.variant];return this.style.cssText=`
      --pulse-size: ${this.size};
      --pulse-duration: ${this.duration}s;
      --pulse-color: ${t};
      --pulse-opacity: ${this.opacity};
    `,e`
      <div class="pulse-container">
        <div class="pulse-rings">${Array.from({length:this.rings},(e,t)=>this.renderRing(t,this.rings))}</div>
        <div class="pulse-content">
          <slot></slot>
        </div>
      </div>
    `}renderRing(t,n){return e`<div class="pulse-ring" style=${`animation-delay: ${t/n*this.duration}s;`}></div>`}};B.styles=[S,zt],Bt([o({type:Number})],B.prototype,`rings`,void 0),Bt([o({type:Number})],B.prototype,`duration`,void 0),Bt([o({type:Number})],B.prototype,`opacity`,void 0),Bt([o()],B.prototype,`size`,void 0),Bt([o()],B.prototype,`variant`,void 0),B=Bt([x(`wui-pulse`)],B);var Kt=[{id:`received`,title:`Receiving funds`,icon:`dollar`},{id:`processing`,title:`Swapping asset`,icon:`recycleHorizontal`},{id:`sending`,title:`Sending asset to the recipient address`,icon:`send`}],qt=[`success`,`submitted`,`failure`,`timeout`,`refund`],Jt=w`
  :host {
    display: block;
    height: 100%;
    width: 100%;
  }

  wui-image {
    border-radius: ${({borderRadius:e})=>e.round};
  }

  .token-badge-container {
    position: absolute;
    bottom: 6px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: ${({borderRadius:e})=>e[4]};
    z-index: 3;
    min-width: 105px;
  }

  .token-badge-container.loading {
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    border: 3px solid ${({tokens:e})=>e.theme.backgroundPrimary};
  }

  .token-badge-container.success {
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    border: 3px solid ${({tokens:e})=>e.theme.backgroundPrimary};
  }

  .token-image-container {
    position: relative;
  }

  .token-image {
    border-radius: ${({borderRadius:e})=>e.round};
    width: 64px;
    height: 64px;
  }

  .token-image.success {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  .token-image.error {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  .token-image.loading {
    background: ${({colors:e})=>e.accent010};
  }

  .token-image wui-icon {
    width: 32px;
    height: 32px;
  }

  .token-badge {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border: 1px solid ${({tokens:e})=>e.theme.foregroundSecondary};
    border-radius: ${({borderRadius:e})=>e[4]};
  }

  .token-badge wui-text {
    white-space: nowrap;
  }

  .payment-lifecycle-container {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-top-right-radius: ${({borderRadius:e})=>e[6]};
    border-top-left-radius: ${({borderRadius:e})=>e[6]};
  }

  .payment-step-badge {
    padding: ${({spacing:e})=>e[1]} ${({spacing:e})=>e[2]};
    border-radius: ${({borderRadius:e})=>e[1]};
  }

  .payment-step-badge.loading {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  .payment-step-badge.error {
    background-color: ${({tokens:e})=>e.core.backgroundError};
  }

  .payment-step-badge.success {
    background-color: ${({tokens:e})=>e.core.backgroundSuccess};
  }

  .step-icon-container {
    position: relative;
    height: 40px;
    width: 40px;
    border-radius: ${({borderRadius:e})=>e.round};
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  .step-icon-box {
    position: absolute;
    right: -4px;
    bottom: -1px;
    padding: 2px;
    border-radius: ${({borderRadius:e})=>e.round};
    border: 2px solid ${({tokens:e})=>e.theme.backgroundPrimary};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  .step-icon-box.success {
    background-color: ${({tokens:e})=>e.core.backgroundSuccess};
  }
`,V=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Yt={received:[`pending`,`success`,`submitted`],processing:[`success`,`submitted`],sending:[`success`,`submitted`]},Xt=3e3,H=class extends n{constructor(){super(),this.unsubscribe=[],this.pollingInterval=null,this.paymentAsset=L.state.paymentAsset,this.quoteStatus=L.state.quoteStatus,this.quote=L.state.quote,this.amount=L.state.amount,this.namespace=void 0,this.caipAddress=void 0,this.profileName=null,this.activeConnectorIds=_.state.activeConnectorIds,this.selectedExchange=L.state.selectedExchange,this.initializeNamespace(),this.unsubscribe.push(L.subscribeKey(`quoteStatus`,e=>this.quoteStatus=e),L.subscribeKey(`quote`,e=>this.quote=e),_.subscribeKey(`activeConnectorIds`,e=>this.activeConnectorIds=e),L.subscribeKey(`selectedExchange`,e=>this.selectedExchange=e))}connectedCallback(){super.connectedCallback(),this.startPolling()}disconnectedCallback(){super.disconnectedCallback(),this.stopPolling(),this.unsubscribe.forEach(e=>e())}render(){return e`
      <wui-flex flexDirection="column" .padding=${[`3`,`0`,`0`,`0`]} gap="2">
        ${this.tokenTemplate()} ${this.paymentTemplate()} ${this.paymentLifecycleTemplate()}
      </wui-flex>
    `}tokenTemplate(){let t=Mt(this.amount||`0`),n=this.paymentAsset.metadata.symbol??`Unknown`,r=v.getAllRequestedCaipNetworks().find(e=>e.caipNetworkId===this.paymentAsset.network),i=this.quoteStatus===`failure`||this.quoteStatus===`timeout`||this.quoteStatus===`refund`;return this.quoteStatus===`success`||this.quoteStatus===`submitted`?e`<wui-flex alignItems="center" justifyContent="center">
        <wui-flex justifyContent="center" alignItems="center" class="token-image success">
          <wui-icon name="checkmark" color="success" size="inherit"></wui-icon>
        </wui-flex>
      </wui-flex>`:i?e`<wui-flex alignItems="center" justifyContent="center">
        <wui-flex justifyContent="center" alignItems="center" class="token-image error">
          <wui-icon name="close" color="error" size="inherit"></wui-icon>
        </wui-flex>
      </wui-flex>`:e`
      <wui-flex alignItems="center" justifyContent="center">
        <wui-flex class="token-image-container">
          <wui-pulse size="125px" rings="3" duration="4" opacity="0.5" variant="accent-primary">
            <wui-flex justifyContent="center" alignItems="center" class="token-image loading">
              <wui-icon name="paperPlaneTitle" color="accent-primary" size="inherit"></wui-icon>
            </wui-flex>
          </wui-pulse>

          <wui-flex
            justifyContent="center"
            alignItems="center"
            class="token-badge-container loading"
          >
            <wui-flex
              alignItems="center"
              justifyContent="center"
              gap="01"
              padding="1"
              class="token-badge"
            >
              <wui-image
                src=${s(d.getNetworkImage(r))}
                class="chain-image"
                size="mdl"
              ></wui-image>

              <wui-text variant="lg-regular" color="primary">${t} ${n}</wui-text>
            </wui-flex>
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}paymentTemplate(){return e`
      <wui-flex flexDirection="column" gap="2" .padding=${[`0`,`6`,`0`,`6`]}>
        ${this.renderPayment()}
        <wui-separator></wui-separator>
        ${this.renderWallet()}
      </wui-flex>
    `}paymentLifecycleTemplate(){let t=this.getStepsWithStatus();return e`
      <wui-flex flexDirection="column" padding="4" gap="2" class="payment-lifecycle-container">
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">PAYMENT CYCLE</wui-text>

          ${this.renderPaymentCycleBadge()}
        </wui-flex>

        <wui-flex flexDirection="column" gap="5" .padding=${[`2`,`0`,`2`,`0`]}>
          ${t.map(e=>this.renderStep(e))}
        </wui-flex>
      </wui-flex>
    `}renderPaymentCycleBadge(){let t=this.quoteStatus===`failure`||this.quoteStatus===`timeout`||this.quoteStatus===`refund`,n=this.quoteStatus===`success`||this.quoteStatus===`submitted`;return t?e`
        <wui-flex
          justifyContent="center"
          alignItems="center"
          class="payment-step-badge error"
          gap="1"
        >
          <wui-icon name="close" color="error" size="xs"></wui-icon>
          <wui-text variant="sm-regular" color="error">Failed</wui-text>
        </wui-flex>
      `:n?e`
        <wui-flex
          justifyContent="center"
          alignItems="center"
          class="payment-step-badge success"
          gap="1"
        >
          <wui-icon name="checkmark" color="success" size="xs"></wui-icon>
          <wui-text variant="sm-regular" color="success">Completed</wui-text>
        </wui-flex>
      `:e`
      <wui-flex alignItems="center" justifyContent="space-between" gap="3">
        <wui-flex
          justifyContent="center"
          alignItems="center"
          class="payment-step-badge loading"
          gap="1"
        >
          <wui-icon name="clock" color="default" size="xs"></wui-icon>
          <wui-text variant="sm-regular" color="primary">Est. ${this.quote?.timeInSeconds??0} sec</wui-text>
        </wui-flex>

        <wui-icon name="chevronBottom" color="default" size="xxs"></wui-icon>
      </wui-flex>
    `}renderPayment(){let t=v.getAllRequestedCaipNetworks().find(e=>{let t=this.quote?.origin.currency.network;if(!t)return!1;let{chainId:n}=f.parseCaipNetworkId(t);return C.isLowerCaseMatch(e.id.toString(),n.toString())});return e`
      <wui-flex
        alignItems="flex-start"
        justifyContent="space-between"
        .padding=${[`3`,`0`,`3`,`0`]}
      >
        <wui-text variant="lg-regular" color="secondary">Payment Method</wui-text>

        <wui-flex flexDirection="column" alignItems="flex-end" gap="1">
          <wui-flex alignItems="center" gap="01">
            <wui-text variant="lg-regular" color="primary">${Mt(u.formatNumber(this.quote?.origin.amount||`0`,{decimals:this.quote?.origin.currency.metadata.decimals??0}).toString())}</wui-text>
            <wui-text variant="lg-regular" color="secondary">${this.quote?.origin.currency.metadata.symbol??`Unknown`}</wui-text>
          </wui-flex>

          <wui-flex alignItems="center" gap="1">
            <wui-text variant="md-regular" color="secondary">on</wui-text>
            <wui-image
              src=${s(d.getNetworkImage(t))}
              size="xs"
            ></wui-image>
            <wui-text variant="md-regular" color="secondary">${t?.name}</wui-text>
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}renderWallet(){return e`
      <wui-flex
        alignItems="flex-start"
        justifyContent="space-between"
        .padding=${[`3`,`0`,`3`,`0`]}
      >
        <wui-text variant="lg-regular" color="secondary">Wallet</wui-text>

        ${this.renderWalletText()}
      </wui-flex>
    `}renderWalletText(){let{image:t}=this.getWalletProperties({namespace:this.namespace}),{address:n}=this.caipAddress?f.parseCaipAddress(this.caipAddress):{},r=this.selectedExchange?.name;return this.selectedExchange?e`
        <wui-flex alignItems="center" justifyContent="flex-end" gap="1">
          <wui-text variant="lg-regular" color="primary">${r}</wui-text>
          <wui-image src=${s(this.selectedExchange.imageUrl)} size="mdl"></wui-image>
        </wui-flex>
      `:e`
      <wui-flex alignItems="center" justifyContent="flex-end" gap="1">
        <wui-text variant="lg-regular" color="primary">
          ${Se.getTruncateString({string:this.profileName||n||r||``,charsStart:this.profileName?16:4,charsEnd:this.profileName?0:6,truncate:this.profileName?`end`:`middle`})}
        </wui-text>

        <wui-image src=${s(t)} size="mdl"></wui-image>
      </wui-flex>
    `}getStepsWithStatus(){return this.quoteStatus===`failure`||this.quoteStatus===`timeout`||this.quoteStatus===`refund`?Kt.map(e=>({...e,status:`failed`})):Kt.map(e=>{let t=(Yt[e.id]??[]).includes(this.quoteStatus)?`completed`:`pending`;return{...e,status:t}})}renderStep({title:t,icon:n,status:r}){return e`
      <wui-flex alignItems="center" gap="3">
        <wui-flex justifyContent="center" alignItems="center" class="step-icon-container">
          <wui-icon name=${n} color="default" size="mdl"></wui-icon>

          <wui-flex alignItems="center" justifyContent="center" class=${i({"step-icon-box":!0,success:r===`completed`})}>
            ${this.renderStatusIndicator(r)}
          </wui-flex>
        </wui-flex>

        <wui-text variant="md-regular" color="primary">${t}</wui-text>
      </wui-flex>
    `}renderStatusIndicator(t){return t===`completed`?e`<wui-icon size="sm" color="success" name="checkmark"></wui-icon>`:t===`failed`?e`<wui-icon size="sm" color="error" name="close"></wui-icon>`:t===`pending`?e`<wui-loading-spinner color="accent-primary" size="sm"></wui-loading-spinner>`:null}startPolling(){this.pollingInterval||=(this.fetchQuoteStatus(),setInterval(()=>{this.fetchQuoteStatus()},Xt))}stopPolling(){this.pollingInterval&&=(clearInterval(this.pollingInterval),null)}async fetchQuoteStatus(){let e=L.state.requestId;if(!e||qt.includes(this.quoteStatus))this.stopPolling();else try{await L.fetchQuoteStatus({requestId:e}),qt.includes(this.quoteStatus)&&this.stopPolling()}catch{this.stopPolling()}}initializeNamespace(){let e=v.state.activeChain;this.namespace=e,this.caipAddress=v.getAccountData(e)?.caipAddress,this.profileName=v.getAccountData(e)?.profileName??null,this.unsubscribe.push(v.subscribeChainProp(`accountState`,e=>{this.caipAddress=e?.caipAddress,this.profileName=e?.profileName??null},e))}getWalletProperties({namespace:e}){if(!e)return{name:void 0,image:void 0};let t=this.activeConnectorIds[e];if(!t)return{name:void 0,image:void 0};let n=_.getConnector({id:t,namespace:e});if(!n)return{name:void 0,image:void 0};let r=d.getConnectorImage(n);return{name:n.name,image:r}}};H.styles=Jt,V([a()],H.prototype,`paymentAsset`,void 0),V([a()],H.prototype,`quoteStatus`,void 0),V([a()],H.prototype,`quote`,void 0),V([a()],H.prototype,`amount`,void 0),V([a()],H.prototype,`namespace`,void 0),V([a()],H.prototype,`caipAddress`,void 0),V([a()],H.prototype,`profileName`,void 0),V([a()],H.prototype,`activeConnectorIds`,void 0),V([a()],H.prototype,`selectedExchange`,void 0),H=V([x(`w3m-pay-loading-view`)],H);var Zt=w`
  button {
    display: flex;
    align-items: center;
    height: 40px;
    padding: ${({spacing:e})=>e[2]};
    border-radius: ${({borderRadius:e})=>e[4]};
    column-gap: ${({spacing:e})=>e[1]};
    background-color: transparent;
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e[`ease-out-power-2`]};
    will-change: background-color;
  }

  wui-image,
  .icon-box {
    width: ${({spacing:e})=>e[6]};
    height: ${({spacing:e})=>e[6]};
    border-radius: ${({borderRadius:e})=>e[4]};
  }

  wui-text {
    flex: 1;
  }

  .icon-box {
    position: relative;
  }

  .icon-box[data-active='true'] {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  .circle {
    position: absolute;
    left: 16px;
    top: 15px;
    width: 8px;
    height: 8px;
    background-color: ${({tokens:e})=>e.core.textSuccess};
    box-shadow: 0 0 0 2px ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: 50%;
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  @media (hover: hover) {
    button:hover:enabled,
    button:active:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    }
  }
`,U=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},W=class extends n{constructor(){super(...arguments),this.address=``,this.profileName=``,this.alt=``,this.imageSrc=``,this.icon=void 0,this.iconSize=`md`,this.enableGreenCircle=!0,this.loading=!1,this.charsStart=4,this.charsEnd=6}render(){return e`
      <button>
        ${this.leftImageTemplate()} ${this.textTemplate()} ${this.rightImageTemplate()}
      </button>
    `}leftImageTemplate(){let t=this.icon?e`<wui-icon
          size=${s(this.iconSize)}
          color="default"
          name=${this.icon}
          class="icon"
        ></wui-icon>`:e`<wui-image src=${this.imageSrc} alt=${this.alt}></wui-image>`;return e`
      <wui-flex
        alignItems="center"
        justifyContent="center"
        class="icon-box"
        data-active=${!!this.icon}
      >
        ${t}
        ${this.enableGreenCircle?e`<wui-flex class="circle"></wui-flex>`:null}
      </wui-flex>
    `}textTemplate(){return e`
      <wui-text variant="lg-regular" color="primary">
        ${Se.getTruncateString({string:this.profileName||this.address,charsStart:this.profileName?16:this.charsStart,charsEnd:this.profileName?0:this.charsEnd,truncate:this.profileName?`end`:`middle`})}
      </wui-text>
    `}rightImageTemplate(){return e`<wui-icon name="chevronBottom" size="sm" color="default"></wui-icon>`}};W.styles=[S,ye,Zt],U([o()],W.prototype,`address`,void 0),U([o()],W.prototype,`profileName`,void 0),U([o()],W.prototype,`alt`,void 0),U([o()],W.prototype,`imageSrc`,void 0),U([o()],W.prototype,`icon`,void 0),U([o()],W.prototype,`iconSize`,void 0),U([o({type:Boolean})],W.prototype,`enableGreenCircle`,void 0),U([o({type:Boolean})],W.prototype,`loading`,void 0),U([o({type:Number})],W.prototype,`charsStart`,void 0),U([o({type:Number})],W.prototype,`charsEnd`,void 0),W=U([x(`wui-wallet-switch`)],W);var Qt=r`
  :host {
    display: block;
  }
`,$t=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},en=class extends n{render(){return e`
      <wui-flex flexDirection="column" gap="4">
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">Pay</wui-text>
          <wui-shimmer width="60px" height="16px" borderRadius="4xs" variant="light"></wui-shimmer>
        </wui-flex>

        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">Network Fee</wui-text>

          <wui-flex flexDirection="column" alignItems="flex-end" gap="2">
            <wui-shimmer
              width="75px"
              height="16px"
              borderRadius="4xs"
              variant="light"
            ></wui-shimmer>

            <wui-flex alignItems="center" gap="01">
              <wui-shimmer width="14px" height="14px" rounded variant="light"></wui-shimmer>
              <wui-shimmer
                width="49px"
                height="14px"
                borderRadius="4xs"
                variant="light"
              ></wui-shimmer>
            </wui-flex>
          </wui-flex>
        </wui-flex>

        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">Service Fee</wui-text>
          <wui-shimmer width="75px" height="16px" borderRadius="4xs" variant="light"></wui-shimmer>
        </wui-flex>
      </wui-flex>
    `}};en.styles=[Qt],en=$t([x(`w3m-pay-fees-skeleton`)],en);var tn=w`
  :host {
    display: block;
  }

  wui-image {
    border-radius: ${({borderRadius:e})=>e.round};
  }
`,nn=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},rn=class extends n{constructor(){super(),this.unsubscribe=[],this.quote=L.state.quote,this.unsubscribe.push(L.subscribeKey(`quote`,e=>this.quote=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return e`
      <wui-flex flexDirection="column" gap="4">
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">Pay</wui-text>
          <wui-text variant="md-regular" color="primary">
            ${u.formatNumber(this.quote?.origin.amount||`0`,{decimals:this.quote?.origin.currency.metadata.decimals??0,round:6}).toString()} ${this.quote?.origin.currency.metadata.symbol||`Unknown`}
          </wui-text>
        </wui-flex>

        ${this.quote&&this.quote.fees.length>0?this.quote.fees.map(e=>this.renderFee(e)):null}
      </wui-flex>
    `}renderFee(t){let n=t.id===`network`,r=u.formatNumber(t.amount||`0`,{decimals:t.currency.metadata.decimals??0,round:6}).toString();if(n){let n=v.getAllRequestedCaipNetworks().find(e=>C.isLowerCaseMatch(e.caipNetworkId,t.currency.network));return e`
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">${t.label}</wui-text>

          <wui-flex flexDirection="column" alignItems="flex-end" gap="2">
            <wui-text variant="md-regular" color="primary">
              ${r} ${t.currency.metadata.symbol||`Unknown`}
            </wui-text>

            <wui-flex alignItems="center" gap="01">
              <wui-image
                src=${s(d.getNetworkImage(n))}
                size="xs"
              ></wui-image>
              <wui-text variant="sm-regular" color="secondary">
                ${n?.name||`Unknown`}
              </wui-text>
            </wui-flex>
          </wui-flex>
        </wui-flex>
      `}return e`
      <wui-flex alignItems="center" justifyContent="space-between">
        <wui-text variant="md-regular" color="secondary">${t.label}</wui-text>
        <wui-text variant="md-regular" color="primary">
          ${r} ${t.currency.metadata.symbol||`Unknown`}
        </wui-text>
      </wui-flex>
    `}};rn.styles=[tn],nn([a()],rn.prototype,`quote`,void 0),rn=nn([x(`w3m-pay-fees`)],rn);var an=w`
  :host {
    display: block;
    width: 100%;
  }

  .disabled-container {
    padding: ${({spacing:e})=>e[2]};
    min-height: 168px;
  }

  wui-icon {
    width: ${({spacing:e})=>e[8]};
    height: ${({spacing:e})=>e[8]};
  }

  wui-flex > wui-text {
    max-width: 273px;
  }
`,on=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},sn=class extends n{constructor(){super(),this.unsubscribe=[],this.selectedExchange=L.state.selectedExchange,this.unsubscribe.push(L.subscribeKey(`selectedExchange`,e=>this.selectedExchange=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return e`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap="3"
        class="disabled-container"
      >
        <wui-icon name="coins" color="default" size="inherit"></wui-icon>

        <wui-text variant="md-regular" color="primary" align="center">
          You don't have enough funds to complete this transaction
        </wui-text>

        ${this.selectedExchange?null:e`<wui-button
              size="md"
              variant="neutral-secondary"
              @click=${this.dispatchConnectOtherWalletEvent.bind(this)}
              >Connect other wallet</wui-button
            >`}
      </wui-flex>
    `}dispatchConnectOtherWalletEvent(){this.dispatchEvent(new CustomEvent(`connectOtherWallet`,{detail:!0,bubbles:!0,composed:!0}))}};sn.styles=[an],on([o({type:Array})],sn.prototype,`selectedExchange`,void 0),sn=on([x(`w3m-pay-options-empty`)],sn);var cn=w`
  :host {
    display: block;
    width: 100%;
  }

  .pay-options-container {
    max-height: 196px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }

  .pay-options-container::-webkit-scrollbar {
    display: none;
  }

  .pay-option-container {
    border-radius: ${({borderRadius:e})=>e[4]};
    padding: ${({spacing:e})=>e[3]};
    min-height: 60px;
  }

  .token-images-container {
    position: relative;
    justify-content: center;
    align-items: center;
  }

  .chain-image {
    position: absolute;
    bottom: -3px;
    right: -5px;
    border: 2px solid ${({tokens:e})=>e.theme.foregroundSecondary};
  }
`,ln=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},un=class extends n{render(){return e`
      <wui-flex flexDirection="column" gap="2" class="pay-options-container">
        ${this.renderOptionEntry()} ${this.renderOptionEntry()} ${this.renderOptionEntry()}
      </wui-flex>
    `}renderOptionEntry(){return e`
      <wui-flex
        alignItems="center"
        justifyContent="space-between"
        gap="2"
        class="pay-option-container"
      >
        <wui-flex alignItems="center" gap="2">
          <wui-flex class="token-images-container">
            <wui-shimmer
              width="32px"
              height="32px"
              rounded
              variant="light"
              class="token-image"
            ></wui-shimmer>
            <wui-shimmer
              width="16px"
              height="16px"
              rounded
              variant="light"
              class="chain-image"
            ></wui-shimmer>
          </wui-flex>

          <wui-flex flexDirection="column" gap="1">
            <wui-shimmer
              width="74px"
              height="16px"
              borderRadius="4xs"
              variant="light"
            ></wui-shimmer>
            <wui-shimmer
              width="46px"
              height="14px"
              borderRadius="4xs"
              variant="light"
            ></wui-shimmer>
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}};un.styles=[cn],un=ln([x(`w3m-pay-options-skeleton`)],un);var dn=w`
  :host {
    display: block;
    width: 100%;
  }

  .pay-options-container {
    max-height: 196px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    mask-image: var(--options-mask-image);
    -webkit-mask-image: var(--options-mask-image);
  }

  .pay-options-container::-webkit-scrollbar {
    display: none;
  }

  .pay-option-container {
    cursor: pointer;
    border-radius: ${({borderRadius:e})=>e[4]};
    padding: ${({spacing:e})=>e[3]};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e[`ease-out-power-1`]};
    will-change: background-color;
  }

  .token-images-container {
    position: relative;
    justify-content: center;
    align-items: center;
  }

  .token-image {
    border-radius: ${({borderRadius:e})=>e.round};
    width: 32px;
    height: 32px;
  }

  .chain-image {
    position: absolute;
    width: 16px;
    height: 16px;
    bottom: -3px;
    right: -5px;
    border-radius: ${({borderRadius:e})=>e.round};
    border: 2px solid ${({tokens:e})=>e.theme.backgroundPrimary};
  }

  @media (hover: hover) and (pointer: fine) {
    .pay-option-container:hover {
      background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    }
  }
`,fn=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},pn=300,mn=class extends n{constructor(){super(),this.unsubscribe=[],this.options=[],this.selectedPaymentAsset=null}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),this.resizeObserver?.disconnect(),(this.shadowRoot?.querySelector(`.pay-options-container`))?.removeEventListener(`scroll`,this.handleOptionsListScroll.bind(this))}firstUpdated(){let e=this.shadowRoot?.querySelector(`.pay-options-container`);e&&(requestAnimationFrame(this.handleOptionsListScroll.bind(this)),e?.addEventListener(`scroll`,this.handleOptionsListScroll.bind(this)),this.resizeObserver=new ResizeObserver(()=>{this.handleOptionsListScroll()}),this.resizeObserver?.observe(e),this.handleOptionsListScroll())}render(){return e`
      <wui-flex flexDirection="column" gap="2" class="pay-options-container">
        ${this.options.map(e=>this.payOptionTemplate(e))}
      </wui-flex>
    `}payOptionTemplate(t){let{network:n,metadata:r,asset:i,amount:a=`0`}=t,o=v.getAllRequestedCaipNetworks().find(e=>e.caipNetworkId===n),ee=`${n}:${i}`==`${this.selectedPaymentAsset?.network}:${this.selectedPaymentAsset?.asset}`,c=u.bigNumber(a,{safe:!0}),te=c.gt(0);return e`
      <wui-flex
        alignItems="center"
        justifyContent="space-between"
        gap="2"
        @click=${()=>this.onSelect?.(t)}
        class="pay-option-container"
      >
        <wui-flex alignItems="center" gap="2">
          <wui-flex class="token-images-container">
            <wui-image
              src=${s(r.logoURI)}
              class="token-image"
              size="3xl"
            ></wui-image>
            <wui-image
              src=${s(d.getNetworkImage(o))}
              class="chain-image"
              size="md"
            ></wui-image>
          </wui-flex>

          <wui-flex flexDirection="column" gap="1">
            <wui-text variant="lg-regular" color="primary">${r.symbol}</wui-text>
            ${te?e`<wui-text variant="sm-regular" color="secondary">
                  ${c.round(6).toString()} ${r.symbol}
                </wui-text>`:null}
          </wui-flex>
        </wui-flex>

        ${ee?e`<wui-icon name="checkmark" size="md" color="success"></wui-icon>`:null}
      </wui-flex>
    `}handleOptionsListScroll(){let e=this.shadowRoot?.querySelector(`.pay-options-container`);e&&(e.scrollHeight>pn?(e.style.setProperty(`--options-mask-image`,`linear-gradient(
          to bottom,
          rgba(0, 0, 0, calc(1 - var(--options-scroll--top-opacity))) 0px,
          rgba(200, 200, 200, calc(1 - var(--options-scroll--top-opacity))) 1px,
          black 50px,
          black calc(100% - 50px),
          rgba(155, 155, 155, calc(1 - var(--options-scroll--bottom-opacity))) calc(100% - 1px),
          rgba(0, 0, 0, calc(1 - var(--options-scroll--bottom-opacity))) 100%
        )`),e.style.setProperty(`--options-scroll--top-opacity`,xe.interpolate([0,50],[0,1],e.scrollTop).toString()),e.style.setProperty(`--options-scroll--bottom-opacity`,xe.interpolate([0,50],[0,1],e.scrollHeight-e.scrollTop-e.offsetHeight).toString())):(e.style.setProperty(`--options-mask-image`,`none`),e.style.setProperty(`--options-scroll--top-opacity`,`0`),e.style.setProperty(`--options-scroll--bottom-opacity`,`0`)))}};mn.styles=[dn],fn([o({type:Array})],mn.prototype,`options`,void 0),fn([o()],mn.prototype,`selectedPaymentAsset`,void 0),fn([o()],mn.prototype,`onSelect`,void 0),mn=fn([x(`w3m-pay-options`)],mn);var hn=w`
  .payment-methods-container {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-top-right-radius: ${({borderRadius:e})=>e[5]};
    border-top-left-radius: ${({borderRadius:e})=>e[5]};
  }

  .pay-options-container {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    border-radius: ${({borderRadius:e})=>e[5]};
    padding: ${({spacing:e})=>e[1]};
  }

  w3m-tooltip-trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: fit-content;
  }

  wui-image {
    border-radius: ${({borderRadius:e})=>e.round};
  }

  w3m-pay-options.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
`,G=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},gn={eip155:`ethereum`,solana:`solana`,bip122:`bitcoin`,ton:`ton`},_n={eip155:{icon:gn.eip155,label:`EVM`},solana:{icon:gn.solana,label:`Solana`},bip122:{icon:gn.bip122,label:`Bitcoin`},ton:{icon:gn.ton,label:`Ton`}},K=class extends n{constructor(){super(),this.unsubscribe=[],this.profileName=null,this.paymentAsset=L.state.paymentAsset,this.namespace=void 0,this.caipAddress=void 0,this.amount=L.state.amount,this.recipient=L.state.recipient,this.activeConnectorIds=_.state.activeConnectorIds,this.selectedPaymentAsset=L.state.selectedPaymentAsset,this.selectedExchange=L.state.selectedExchange,this.isFetchingQuote=L.state.isFetchingQuote,this.quoteError=L.state.quoteError,this.quote=L.state.quote,this.isFetchingTokenBalances=L.state.isFetchingTokenBalances,this.tokenBalances=L.state.tokenBalances,this.isPaymentInProgress=L.state.isPaymentInProgress,this.exchangeUrlForQuote=L.state.exchangeUrlForQuote,this.completedTransactionsCount=0,this.unsubscribe.push(L.subscribeKey(`paymentAsset`,e=>this.paymentAsset=e)),this.unsubscribe.push(L.subscribeKey(`tokenBalances`,e=>this.onTokenBalancesChanged(e))),this.unsubscribe.push(L.subscribeKey(`isFetchingTokenBalances`,e=>this.isFetchingTokenBalances=e)),this.unsubscribe.push(_.subscribeKey(`activeConnectorIds`,e=>this.activeConnectorIds=e)),this.unsubscribe.push(L.subscribeKey(`selectedPaymentAsset`,e=>this.selectedPaymentAsset=e)),this.unsubscribe.push(L.subscribeKey(`isFetchingQuote`,e=>this.isFetchingQuote=e)),this.unsubscribe.push(L.subscribeKey(`quoteError`,e=>this.quoteError=e)),this.unsubscribe.push(L.subscribeKey(`quote`,e=>this.quote=e)),this.unsubscribe.push(L.subscribeKey(`amount`,e=>this.amount=e)),this.unsubscribe.push(L.subscribeKey(`recipient`,e=>this.recipient=e)),this.unsubscribe.push(L.subscribeKey(`isPaymentInProgress`,e=>this.isPaymentInProgress=e)),this.unsubscribe.push(L.subscribeKey(`selectedExchange`,e=>this.selectedExchange=e)),this.unsubscribe.push(L.subscribeKey(`exchangeUrlForQuote`,e=>this.exchangeUrlForQuote=e)),this.resetQuoteState(),this.initializeNamespace(),this.fetchTokens()}disconnectedCallback(){super.disconnectedCallback(),this.resetAssetsState(),this.unsubscribe.forEach(e=>e())}updated(e){super.updated(e),e.has(`selectedPaymentAsset`)&&this.fetchQuote()}render(){return e`
      <wui-flex flexDirection="column">
        ${this.profileTemplate()}

        <wui-flex
          flexDirection="column"
          gap="4"
          class="payment-methods-container"
          .padding=${[`4`,`4`,`5`,`4`]}
        >
          ${this.paymentOptionsViewTemplate()} ${this.amountWithFeeTemplate()}

          <wui-flex
            alignItems="center"
            justifyContent="space-between"
            .padding=${[`1`,`0`,`1`,`0`]}
          >
            <wui-separator></wui-separator>
          </wui-flex>

          ${this.paymentActionsTemplate()}
        </wui-flex>
      </wui-flex>
    `}profileTemplate(){if(this.selectedExchange){let t=u.formatNumber(this.quote?.origin.amount,{decimals:this.quote?.origin.currency.metadata.decimals??0}).toString();return e`
        <wui-flex
          .padding=${[`4`,`3`,`4`,`3`]}
          alignItems="center"
          justifyContent="space-between"
          gap="2"
        >
          <wui-text variant="lg-regular" color="secondary">Paying with</wui-text>

          ${this.quote?e`<wui-text variant="lg-regular" color="primary">
                ${u.bigNumber(t,{safe:!0}).round(6).toString()}
                ${this.quote.origin.currency.metadata.symbol}
              </wui-text>`:e`<wui-shimmer width="80px" height="18px" variant="light"></wui-shimmer>`}
        </wui-flex>
      `}let t=h.getPlainAddress(this.caipAddress)??``,{name:n,image:r}=this.getWalletProperties({namespace:this.namespace}),{icon:i,label:a}=_n[this.namespace]??{};return e`
      <wui-flex
        .padding=${[`4`,`3`,`4`,`3`]}
        alignItems="center"
        justifyContent="space-between"
        gap="2"
      >
        <wui-wallet-switch
          profileName=${s(this.profileName)}
          address=${s(t)}
          imageSrc=${s(r)}
          alt=${s(n)}
          @click=${this.onConnectOtherWallet.bind(this)}
          data-testid="wui-wallet-switch"
        ></wui-wallet-switch>

        <wui-wallet-switch
          profileName=${s(a)}
          address=${s(t)}
          icon=${s(i)}
          iconSize="xs"
          .enableGreenCircle=${!1}
          alt=${s(a)}
          @click=${this.onConnectOtherWallet.bind(this)}
          data-testid="wui-wallet-switch"
        ></wui-wallet-switch>
      </wui-flex>
    `}initializeNamespace(){let e=v.state.activeChain;this.namespace=e,this.caipAddress=v.getAccountData(e)?.caipAddress,this.profileName=v.getAccountData(e)?.profileName??null,this.unsubscribe.push(v.subscribeChainProp(`accountState`,e=>this.onAccountStateChanged(e),e))}async fetchTokens(){if(this.namespace){let e;if(this.caipAddress){let{chainId:t,chainNamespace:n}=f.parseCaipAddress(this.caipAddress),r=`${n}:${t}`;e=v.getAllRequestedCaipNetworks().find(e=>e.caipNetworkId===r)}await L.fetchTokens({caipAddress:this.caipAddress,caipNetwork:e,namespace:this.namespace})}}fetchQuote(){if(this.amount&&this.recipient&&this.selectedPaymentAsset&&this.paymentAsset){let{address:e}=this.caipAddress?f.parseCaipAddress(this.caipAddress):{};L.fetchQuote({amount:this.amount.toString(),address:e,sourceToken:this.selectedPaymentAsset,toToken:this.paymentAsset,recipient:this.recipient})}}getWalletProperties({namespace:e}){if(!e)return{name:void 0,image:void 0};let t=this.activeConnectorIds[e];if(!t)return{name:void 0,image:void 0};let n=_.getConnector({id:t,namespace:e});if(!n)return{name:void 0,image:void 0};let r=d.getConnectorImage(n);return{name:n.name,image:r}}paymentOptionsViewTemplate(){return e`
      <wui-flex flexDirection="column" gap="2">
        <wui-text variant="sm-regular" color="secondary">CHOOSE PAYMENT OPTION</wui-text>
        <wui-flex class="pay-options-container">${this.paymentOptionsTemplate()}</wui-flex>
      </wui-flex>
    `}paymentOptionsTemplate(){let t=this.getPaymentAssetFromTokenBalances();return this.isFetchingTokenBalances?e`<w3m-pay-options-skeleton></w3m-pay-options-skeleton>`:t.length===0?e`<w3m-pay-options-empty
        @connectOtherWallet=${this.onConnectOtherWallet.bind(this)}
      ></w3m-pay-options-empty>`:e`<w3m-pay-options
      class=${i({disabled:this.isFetchingQuote})}
      .options=${t}
      .selectedPaymentAsset=${s(this.selectedPaymentAsset)}
      .onSelect=${this.onSelectedPaymentAssetChanged.bind(this)}
    ></w3m-pay-options>`}amountWithFeeTemplate(){return this.isFetchingQuote||!this.selectedPaymentAsset||this.quoteError?e`<w3m-pay-fees-skeleton></w3m-pay-fees-skeleton>`:e`<w3m-pay-fees></w3m-pay-fees>`}paymentActionsTemplate(){let t=this.isFetchingQuote||this.isFetchingTokenBalances,n=this.isFetchingQuote||this.isFetchingTokenBalances||!this.selectedPaymentAsset||!!this.quoteError,r=u.formatNumber(this.quote?.origin.amount??0,{decimals:this.quote?.origin.currency.metadata.decimals??0}).toString();return this.selectedExchange?t||n?e`
          <wui-shimmer width="100%" height="48px" variant="light" ?rounded=${!0}></wui-shimmer>
        `:e`<wui-button
        size="lg"
        fullWidth
        variant="accent-secondary"
        @click=${this.onPayWithExchange.bind(this)}
      >
        ${`Continue in ${this.selectedExchange.name}`}

        <wui-icon name="arrowRight" color="inherit" size="sm" slot="iconRight"></wui-icon>
      </wui-button>`:e`
      <wui-flex alignItems="center" justifyContent="space-between">
        <wui-flex flexDirection="column" gap="1">
          <wui-text variant="md-regular" color="secondary">Order Total</wui-text>

          ${t||n?e`<wui-shimmer width="58px" height="32px" variant="light"></wui-shimmer>`:e`<wui-flex alignItems="center" gap="01">
                <wui-text variant="h4-regular" color="primary">${Mt(r)}</wui-text>

                <wui-text variant="lg-regular" color="secondary">
                  ${this.quote?.origin.currency.metadata.symbol||`Unknown`}
                </wui-text>
              </wui-flex>`}
        </wui-flex>

        ${this.actionButtonTemplate({isLoading:t,isDisabled:n})}
      </wui-flex>
    `}actionButtonTemplate(t){let n=pt(this.quote),{isLoading:r,isDisabled:i}=t,a=`Pay`;return n.length>1&&this.completedTransactionsCount===0&&(a=`Approve`),e`
      <wui-button
        size="lg"
        variant="accent-primary"
        ?loading=${r||this.isPaymentInProgress}
        ?disabled=${i||this.isPaymentInProgress}
        @click=${()=>{n.length>0?this.onSendTransactions():this.onTransfer()}}
      >
        ${a}
        ${r?null:e`<wui-icon
              name="arrowRight"
              color="inherit"
              size="sm"
              slot="iconRight"
            ></wui-icon>`}
      </wui-button>
    `}getPaymentAssetFromTokenBalances(){return this.namespace?(this.tokenBalances[this.namespace]??[]).map(e=>{try{return At(e)}catch{return null}}).filter(e=>!!e).filter(e=>{let{chainId:t}=f.parseCaipNetworkId(e.network),{chainId:n}=f.parseCaipNetworkId(this.paymentAsset.network);return C.isLowerCaseMatch(e.asset,this.paymentAsset.asset)?!0:this.selectedExchange?!C.isLowerCaseMatch(t.toString(),n.toString()):!0}):[]}onTokenBalancesChanged(e){this.tokenBalances=e;let[t]=this.getPaymentAssetFromTokenBalances();t&&L.setSelectedPaymentAsset(t)}async onConnectOtherWallet(){await _.connect(),await m.open({view:`PayQuote`})}onAccountStateChanged(e){let{address:t}=this.caipAddress?f.parseCaipAddress(this.caipAddress):{};if(this.caipAddress=e?.caipAddress,this.profileName=e?.profileName??null,t){let{address:e}=this.caipAddress?f.parseCaipAddress(this.caipAddress):{};e?C.isLowerCaseMatch(e,t)||(this.resetAssetsState(),this.resetQuoteState(),this.fetchTokens()):m.close()}}onSelectedPaymentAssetChanged(e){this.isFetchingQuote||L.setSelectedPaymentAsset(e)}async onTransfer(){let e=ft(this.quote);if(e){if(!C.isLowerCaseMatch(this.selectedPaymentAsset?.asset,e.deposit.currency))throw Error(`Quote asset is not the same as the selected payment asset`);let t=this.selectedPaymentAsset?.amount??`0`,n=u.formatNumber(e.deposit.amount,{decimals:this.selectedPaymentAsset?.metadata.decimals??0}).toString();if(!u.bigNumber(t).gte(n)){c.showError(`Insufficient funds`);return}if(this.quote&&this.selectedPaymentAsset&&this.caipAddress&&this.namespace){let{address:t}=f.parseCaipAddress(this.caipAddress);await L.onTransfer({chainNamespace:this.namespace,fromAddress:t,toAddress:e.deposit.receiver,amount:n,paymentAsset:this.selectedPaymentAsset}),L.setRequestId(e.requestId),b.push(`PayLoading`)}}}async onSendTransactions(){let e=this.selectedPaymentAsset?.amount??`0`,t=u.formatNumber(this.quote?.origin.amount??0,{decimals:this.selectedPaymentAsset?.metadata.decimals??0}).toString();if(!u.bigNumber(e).gte(t)){c.showError(`Insufficient funds`);return}let n=pt(this.quote),[r]=pt(this.quote,this.completedTransactionsCount);r&&this.namespace&&(await L.onSendTransaction({namespace:this.namespace,transactionStep:r}),this.completedTransactionsCount+=1,this.completedTransactionsCount===n.length&&(L.setRequestId(r.requestId),b.push(`PayLoading`)))}onPayWithExchange(){if(this.exchangeUrlForQuote){let e=h.returnOpenHref(``,`popupWindow`,`scrollbar=yes,width=480,height=720`);if(!e)throw Error(`Could not create popup window`);e.location.href=this.exchangeUrlForQuote;let t=ft(this.quote);t&&L.setRequestId(t.requestId),L.initiatePayment(),b.push(`PayLoading`)}}resetAssetsState(){L.setSelectedPaymentAsset(null)}resetQuoteState(){L.resetQuoteState()}};K.styles=hn,G([a()],K.prototype,`profileName`,void 0),G([a()],K.prototype,`paymentAsset`,void 0),G([a()],K.prototype,`namespace`,void 0),G([a()],K.prototype,`caipAddress`,void 0),G([a()],K.prototype,`amount`,void 0),G([a()],K.prototype,`recipient`,void 0),G([a()],K.prototype,`activeConnectorIds`,void 0),G([a()],K.prototype,`selectedPaymentAsset`,void 0),G([a()],K.prototype,`selectedExchange`,void 0),G([a()],K.prototype,`isFetchingQuote`,void 0),G([a()],K.prototype,`quoteError`,void 0),G([a()],K.prototype,`quote`,void 0),G([a()],K.prototype,`isFetchingTokenBalances`,void 0),G([a()],K.prototype,`tokenBalances`,void 0),G([a()],K.prototype,`isPaymentInProgress`,void 0),G([a()],K.prototype,`exchangeUrlForQuote`,void 0),G([a()],K.prototype,`completedTransactionsCount`,void 0),K=G([x(`w3m-pay-quote-view`)],K);var vn=w`
  wui-image {
    border-radius: ${({borderRadius:e})=>e.round};
  }

  .transfers-badge {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border: 1px solid ${({tokens:e})=>e.theme.foregroundSecondary};
    border-radius: ${({borderRadius:e})=>e[4]};
  }
`,yn=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},bn=class extends n{constructor(){super(),this.unsubscribe=[],this.paymentAsset=L.state.paymentAsset,this.amount=L.state.amount,this.unsubscribe.push(L.subscribeKey(`paymentAsset`,e=>{this.paymentAsset=e}),L.subscribeKey(`amount`,e=>{this.amount=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let t=v.getAllRequestedCaipNetworks().find(e=>e.caipNetworkId===this.paymentAsset.network);return e`<wui-flex
      alignItems="center"
      gap="1"
      .padding=${[`1`,`2`,`1`,`1`]}
      class="transfers-badge"
    >
      <wui-image src=${s(this.paymentAsset.metadata.logoURI)} size="xl"></wui-image>
      <wui-text variant="lg-regular" color="primary">
        ${this.amount} ${this.paymentAsset.metadata.symbol}
      </wui-text>
      <wui-text variant="sm-regular" color="secondary">
        on ${t?.name??`Unknown`}
      </wui-text>
    </wui-flex>`}};bn.styles=[vn],yn([o()],bn.prototype,`paymentAsset`,void 0),yn([o()],bn.prototype,`amount`,void 0),bn=yn([x(`w3m-pay-header`)],bn);var xn=w`
  :host {
    height: 60px;
  }

  :host > wui-flex {
    box-sizing: border-box;
    background-color: var(--local-header-background-color);
  }

  wui-text {
    background-color: var(--local-header-background-color);
  }

  wui-flex.w3m-header-title {
    transform: translateY(0);
    opacity: 1;
  }

  wui-flex.w3m-header-title[view-direction='prev'] {
    animation:
      slide-down-out 120ms forwards ${({easings:e})=>e[`ease-out-power-2`]},
      slide-down-in 120ms forwards ${({easings:e})=>e[`ease-out-power-2`]};
    animation-delay: 0ms, 200ms;
  }

  wui-flex.w3m-header-title[view-direction='next'] {
    animation:
      slide-up-out 120ms forwards ${({easings:e})=>e[`ease-out-power-2`]},
      slide-up-in 120ms forwards ${({easings:e})=>e[`ease-out-power-2`]};
    animation-delay: 0ms, 200ms;
  }

  wui-icon-button[data-hidden='true'] {
    opacity: 0 !important;
    pointer-events: none;
  }

  @keyframes slide-up-out {
    from {
      transform: translateY(0px);
      opacity: 1;
    }
    to {
      transform: translateY(3px);
      opacity: 0;
    }
  }

  @keyframes slide-up-in {
    from {
      transform: translateY(-3px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes slide-down-out {
    from {
      transform: translateY(0px);
      opacity: 1;
    }
    to {
      transform: translateY(-3px);
      opacity: 0;
    }
  }

  @keyframes slide-down-in {
    from {
      transform: translateY(3px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`,Sn=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Cn=[`SmartSessionList`],wn={PayWithExchange:be.tokens.theme.foregroundPrimary};function Tn(){let e=b.state.data?.connector?.name,t=b.state.data?.wallet?.name,n=b.state.data?.network?.name,r=t??e,i=_.getConnectors(),a=i.length===1&&i[0]?.id===`w3m-email`,o=v.getAccountData()?.socialProvider,s=o?o.charAt(0).toUpperCase()+o.slice(1):`Connect Social`;return{Connect:`Connect ${a?`Email`:``} Wallet`,Create:`Create Wallet`,ChooseAccountName:void 0,Account:void 0,AccountSettings:void 0,AllWallets:`All Wallets`,ApproveTransaction:`Approve Transaction`,BuyInProgress:`Buy`,UsageExceeded:`Usage Exceeded`,ConnectingExternal:r??`Connect Wallet`,ConnectingWalletConnect:r??`WalletConnect`,ConnectingWalletConnectBasic:`WalletConnect`,ConnectingSiwe:`Sign In`,Convert:`Convert`,ConvertSelectToken:`Select token`,ConvertPreview:`Preview Convert`,Downloads:r?`Get ${r}`:`Downloads`,EmailLogin:`Email Login`,EmailVerifyOtp:`Confirm Email`,EmailVerifyDevice:`Register Device`,GetWallet:`Get a Wallet`,Networks:`Choose Network`,OnRampProviders:`Choose Provider`,OnRampActivity:`Activity`,OnRampTokenSelect:`Select Token`,OnRampFiatSelect:`Select Currency`,Pay:`How you pay`,ProfileWallets:`Wallets`,SwitchNetwork:n??`Switch Network`,Transactions:`Activity`,UnsupportedChain:`Switch Network`,UpgradeEmailWallet:`Upgrade Your Wallet`,UpdateEmailWallet:`Edit Email`,UpdateEmailPrimaryOtp:`Confirm Current Email`,UpdateEmailSecondaryOtp:`Confirm New Email`,WhatIsABuy:`What is Buy?`,RegisterAccountName:`Choose Name`,RegisterAccountNameSuccess:``,WalletReceive:`Receive`,WalletCompatibleNetworks:`Compatible Networks`,Swap:`Swap`,SwapSelectToken:`Select Token`,SwapPreview:`Preview Swap`,WalletSend:`Send`,WalletSendPreview:`Review Send`,WalletSendSelectToken:`Select Token`,WalletSendConfirmed:`Confirmed`,WhatIsANetwork:`What is a network?`,WhatIsAWallet:`What is a Wallet?`,ConnectWallets:`Connect Wallet`,ConnectSocials:`All Socials`,ConnectingSocial:s,ConnectingMultiChain:`Select Chain`,ConnectingFarcaster:`Farcaster`,SwitchActiveChain:`Switch Chain`,SmartSessionCreated:void 0,SmartSessionList:`Smart Sessions`,SIWXSignMessage:`Sign In`,PayLoading:`Processing payment...`,PayQuote:`Payment Quote`,DataCapture:`Profile`,DataCaptureOtpConfirm:`Confirm Email`,FundWallet:`Fund Wallet`,PayWithExchange:`Deposit from Exchange`,PayWithExchangeSelectAsset:`Select Asset`,SmartAccountSettings:`Smart Account Settings`}}var q=class extends n{constructor(){super(),this.unsubscribe=[],this.heading=Tn()[b.state.view],this.network=v.state.activeCaipNetwork,this.networkImage=d.getNetworkImage(this.network),this.showBack=!1,this.prevHistoryLength=1,this.view=b.state.view,this.viewDirection=``,this.unsubscribe.push(te.subscribeNetworkImages(()=>{this.networkImage=d.getNetworkImage(this.network)}),b.subscribeKey(`view`,e=>{setTimeout(()=>{this.view=e,this.heading=Tn()[e]},Je.ANIMATION_DURATIONS.HeaderText),this.onViewChange(),this.onHistoryChange()}),v.subscribeKey(`activeCaipNetwork`,e=>{this.network=e,this.networkImage=d.getNetworkImage(this.network)}))}disconnectCallback(){this.unsubscribe.forEach(e=>e())}render(){let t=wn[b.state.view]??be.tokens.theme.backgroundPrimary;return this.style.setProperty(`--local-header-background-color`,t),e`
      <wui-flex
        .padding=${[`0`,`4`,`0`,`4`]}
        justifyContent="space-between"
        alignItems="center"
      >
        ${this.leftHeaderTemplate()} ${this.titleTemplate()} ${this.rightHeaderTemplate()}
      </wui-flex>
    `}onWalletHelp(){y.sendEvent({type:`track`,event:`CLICK_WALLET_HELP`}),b.push(`WhatIsAWallet`)}async onClose(){await Ae.safeClose()}rightHeaderTemplate(){let t=g?.state?.features?.smartSessions;return b.state.view!==`Account`||!t?this.closeButtonTemplate():e`<wui-flex>
      <wui-icon-button
        icon="clock"
        size="lg"
        iconSize="lg"
        type="neutral"
        variant="primary"
        @click=${()=>b.push(`SmartSessionList`)}
        data-testid="w3m-header-smart-sessions"
      ></wui-icon-button>
      ${this.closeButtonTemplate()}
    </wui-flex> `}closeButtonTemplate(){return e`
      <wui-icon-button
        icon="close"
        size="lg"
        type="neutral"
        variant="primary"
        iconSize="lg"
        @click=${this.onClose.bind(this)}
        data-testid="w3m-header-close"
      ></wui-icon-button>
    `}titleTemplate(){if(this.view===`PayQuote`)return e`<w3m-pay-header></w3m-pay-header>`;let t=Cn.includes(this.view);return e`
      <wui-flex
        view-direction="${this.viewDirection}"
        class="w3m-header-title"
        alignItems="center"
        gap="2"
      >
        <wui-text
          display="inline"
          variant="lg-regular"
          color="primary"
          data-testid="w3m-header-text"
        >
          ${this.heading}
        </wui-text>
        ${t?e`<wui-tag variant="accent" size="md">Beta</wui-tag>`:null}
      </wui-flex>
    `}leftHeaderTemplate(){let{view:t}=b.state,n=t===`Connect`,r=g.state.enableEmbedded,i=t===`ApproveTransaction`,a=t===`ConnectingSiwe`,o=t===`Account`,ee=g.state.enableNetworkSwitch,c=i||a||n&&r;return o&&ee?e`<wui-select
        id="dynamic"
        data-testid="w3m-account-select-network"
        active-network=${s(this.network?.name)}
        @click=${this.onNetworks.bind(this)}
        imageSrc=${s(this.networkImage)}
      ></wui-select>`:this.showBack&&!c?e`<wui-icon-button
        data-testid="header-back"
        id="dynamic"
        icon="chevronLeft"
        size="lg"
        iconSize="lg"
        type="neutral"
        variant="primary"
        @click=${this.onGoBack.bind(this)}
      ></wui-icon-button>`:e`<wui-icon-button
      data-hidden=${!n}
      id="dynamic"
      icon="helpCircle"
      size="lg"
      iconSize="lg"
      type="neutral"
      variant="primary"
      @click=${this.onWalletHelp.bind(this)}
    ></wui-icon-button>`}onNetworks(){this.isAllowedNetworkSwitch()&&(y.sendEvent({type:`track`,event:`CLICK_NETWORKS`}),b.push(`Networks`))}isAllowedNetworkSwitch(){let e=v.getAllRequestedCaipNetworks(),t=e?e.length>1:!1,n=e?.find(({id:e})=>e===this.network?.id);return t||!n}onViewChange(){let{history:e}=b.state,t=Je.VIEW_DIRECTION.Next;e.length<this.prevHistoryLength&&(t=Je.VIEW_DIRECTION.Prev),this.prevHistoryLength=e.length,this.viewDirection=t}async onHistoryChange(){let{history:e}=b.state,t=this.shadowRoot?.querySelector(`#dynamic`);e.length>1&&!this.showBack&&t?(await t.animate([{opacity:1},{opacity:0}],{duration:200,fill:`forwards`,easing:`ease`}).finished,this.showBack=!0,t.animate([{opacity:0},{opacity:1}],{duration:200,fill:`forwards`,easing:`ease`})):e.length<=1&&this.showBack&&t&&(await t.animate([{opacity:1},{opacity:0}],{duration:200,fill:`forwards`,easing:`ease`}).finished,this.showBack=!1,t.animate([{opacity:0},{opacity:1}],{duration:200,fill:`forwards`,easing:`ease`}))}onGoBack(){b.goBack()}};q.styles=xn,Sn([a()],q.prototype,`heading`,void 0),Sn([a()],q.prototype,`network`,void 0),Sn([a()],q.prototype,`networkImage`,void 0),Sn([a()],q.prototype,`showBack`,void 0),Sn([a()],q.prototype,`prevHistoryLength`,void 0),Sn([a()],q.prototype,`view`,void 0),Sn([a()],q.prototype,`viewDirection`,void 0),q=Sn([x(`w3m-header`)],q);var En=w`
  :host {
    display: flex;
    align-items: center;
    gap: ${({spacing:e})=>e[1]};
    padding: ${({spacing:e})=>e[2]} ${({spacing:e})=>e[3]}
      ${({spacing:e})=>e[2]} ${({spacing:e})=>e[2]};
    border-radius: ${({borderRadius:e})=>e[20]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    box-shadow:
      0px 0px 8px 0px rgba(0, 0, 0, 0.1),
      inset 0 0 0 1px ${({tokens:e})=>e.theme.borderPrimary};
    max-width: 320px;
  }

  wui-icon-box {
    border-radius: ${({borderRadius:e})=>e.round} !important;
    overflow: hidden;
  }

  wui-loading-spinner {
    padding: ${({spacing:e})=>e[1]};
    background-color: ${({tokens:e})=>e.core.foregroundAccent010};
    border-radius: ${({borderRadius:e})=>e.round} !important;
  }
`,Dn=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},On=class extends n{constructor(){super(...arguments),this.message=``,this.variant=`success`}render(){return e`
      ${this.templateIcon()}
      <wui-text variant="lg-regular" color="primary" data-testid="wui-snackbar-message"
        >${this.message}</wui-text
      >
    `}templateIcon(){return this.variant===`loading`?e`<wui-loading-spinner size="md" color="accent-primary"></wui-loading-spinner>`:e`<wui-icon-box
      size="md"
      color=${{success:`success`,error:`error`,warning:`warning`,info:`default`}[this.variant]}
      icon=${{success:`checkmark`,error:`warning`,warning:`warningCircle`,info:`info`}[this.variant]}
    ></wui-icon-box>`}};On.styles=[S,En],Dn([o()],On.prototype,`message`,void 0),Dn([o()],On.prototype,`variant`,void 0),On=Dn([x(`wui-snackbar`)],On);var kn=r`
  :host {
    display: block;
    position: absolute;
    opacity: 0;
    pointer-events: none;
    top: 11px;
    left: 50%;
    width: max-content;
  }
`,An=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},jn=class extends n{constructor(){super(),this.unsubscribe=[],this.timeout=void 0,this.open=c.state.open,this.unsubscribe.push(c.subscribeKey(`open`,e=>{this.open=e,this.onOpen()}))}disconnectedCallback(){clearTimeout(this.timeout),this.unsubscribe.forEach(e=>e())}render(){let{message:t,variant:n}=c.state;return e` <wui-snackbar message=${t} variant=${n}></wui-snackbar> `}onOpen(){clearTimeout(this.timeout),this.open?(this.animate([{opacity:0,transform:`translateX(-50%) scale(0.85)`},{opacity:1,transform:`translateX(-50%) scale(1)`}],{duration:150,fill:`forwards`,easing:`ease`}),this.timeout&&clearTimeout(this.timeout),c.state.autoClose&&(this.timeout=setTimeout(()=>c.hide(),2500))):this.animate([{opacity:1,transform:`translateX(-50%) scale(1)`},{opacity:0,transform:`translateX(-50%) scale(0.85)`}],{duration:150,fill:`forwards`,easing:`ease`})}};jn.styles=kn,An([a()],jn.prototype,`open`,void 0),jn=An([x(`w3m-snackbar`)],jn);var Mn=r`
  :host {
    width: 100%;
    display: block;
  }
`,Nn=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Pn=class extends n{constructor(){super(),this.unsubscribe=[],this.text=``,this.open=k.state.open,this.unsubscribe.push(b.subscribeKey(`view`,()=>{k.hide()}),m.subscribeKey(`open`,e=>{e||k.hide()}),k.subscribeKey(`open`,e=>{this.open=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),k.hide()}render(){return e`
      <div
        @pointermove=${this.onMouseEnter.bind(this)}
        @pointerleave=${this.onMouseLeave.bind(this)}
      >
        ${this.renderChildren()}
      </div>
    `}renderChildren(){return e`<slot></slot> `}onMouseEnter(){let e=this.getBoundingClientRect();if(!this.open){let t=document.querySelector(`w3m-modal`),n={width:e.width,height:e.height,left:e.left,top:e.top};if(t){let r=t.getBoundingClientRect();n.left=e.left-(window.innerWidth-r.width)/2,n.top=e.top-(window.innerHeight-r.height)/2}k.showTooltip({message:this.text,triggerRect:n,variant:`shade`})}}onMouseLeave(e){this.contains(e.relatedTarget)||k.hide()}};Pn.styles=[Mn],Nn([o()],Pn.prototype,`text`,void 0),Nn([a()],Pn.prototype,`open`,void 0),Pn=Nn([x(`w3m-tooltip-trigger`)],Pn);var Fn=w`
  :host {
    pointer-events: none;
  }

  :host > wui-flex {
    display: var(--w3m-tooltip-display);
    opacity: var(--w3m-tooltip-opacity);
    padding: 9px ${({spacing:e})=>e[3]} 10px ${({spacing:e})=>e[3]};
    border-radius: ${({borderRadius:e})=>e[3]};
    color: ${({tokens:e})=>e.theme.backgroundPrimary};
    position: absolute;
    top: var(--w3m-tooltip-top);
    left: var(--w3m-tooltip-left);
    transform: translate(calc(-50% + var(--w3m-tooltip-parent-width)), calc(-100% - 8px));
    max-width: calc(var(--apkt-modal-width) - ${({spacing:e})=>e[5]});
    transition: opacity ${({durations:e})=>e.lg}
      ${({easings:e})=>e[`ease-out-power-2`]};
    will-change: opacity;
    opacity: 0;
    animation-duration: ${({durations:e})=>e.xl};
    animation-timing-function: ${({easings:e})=>e[`ease-out-power-2`]};
    animation-name: fade-in;
    animation-fill-mode: forwards;
  }

  :host([data-variant='shade']) > wui-flex {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  :host([data-variant='shade']) > wui-flex > wui-text {
    color: ${({tokens:e})=>e.theme.textSecondary};
  }

  :host([data-variant='fill']) > wui-flex {
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    border: 1px solid ${({tokens:e})=>e.theme.borderPrimary};
  }

  wui-icon {
    position: absolute;
    width: 12px !important;
    height: 4px !important;
    color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  wui-icon[data-placement='top'] {
    bottom: 0px;
    left: 50%;
    transform: translate(-50%, 95%);
  }

  wui-icon[data-placement='bottom'] {
    top: 0;
    left: 50%;
    transform: translate(-50%, -95%) rotate(180deg);
  }

  wui-icon[data-placement='right'] {
    top: 50%;
    left: 0;
    transform: translate(-65%, -50%) rotate(90deg);
  }

  wui-icon[data-placement='left'] {
    top: 50%;
    right: 0%;
    transform: translate(65%, -50%) rotate(270deg);
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`,In=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Ln=class extends n{constructor(){super(),this.unsubscribe=[],this.open=k.state.open,this.message=k.state.message,this.triggerRect=k.state.triggerRect,this.variant=k.state.variant,this.unsubscribe.push(k.subscribe(e=>{this.open=e.open,this.message=e.message,this.triggerRect=e.triggerRect,this.variant=e.variant}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){this.dataset.variant=this.variant;let t=this.triggerRect.top,n=this.triggerRect.left;return this.style.cssText=`
    --w3m-tooltip-top: ${t}px;
    --w3m-tooltip-left: ${n}px;
    --w3m-tooltip-parent-width: ${this.triggerRect.width/2}px;
    --w3m-tooltip-display: ${this.open?`flex`:`none`};
    --w3m-tooltip-opacity: ${this.open?1:0};
    `,e`<wui-flex>
      <wui-icon data-placement="top" size="inherit" name="cursor"></wui-icon>
      <wui-text color="primary" variant="sm-regular">${this.message}</wui-text>
    </wui-flex>`}};Ln.styles=[Fn],In([a()],Ln.prototype,`open`,void 0),In([a()],Ln.prototype,`message`,void 0),In([a()],Ln.prototype,`triggerRect`,void 0),In([a()],Ln.prototype,`variant`,void 0),Ln=In([x(`w3m-tooltip`)],Ln);var Rn={getTabsByNamespace(e){return e&&e===l.CHAIN.EVM?g.state.remoteFeatures?.activity===!1?Je.ACCOUNT_TABS.filter(e=>e.label!==`Activity`):Je.ACCOUNT_TABS:[]},isValidReownName(e){return/^[a-zA-Z0-9]+$/gu.test(e)},isValidEmail(e){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/gu.test(e)},validateReownName(e){return e.replace(/\^/gu,``).toLowerCase().replace(/[^a-zA-Z0-9]/gu,``)},hasFooter(){let e=b.state.view;if(Je.VIEWS_WITH_LEGAL_FOOTER.includes(e)){let{termsConditionsUrl:e,privacyPolicyUrl:t}=g.state,n=g.state.features?.legalCheckbox;return!(!e&&!t||n)}return Je.VIEWS_WITH_DEFAULT_FOOTER.includes(e)}},zn=w`
  :host wui-ux-by-reown {
    padding-top: 0;
  }

  :host wui-ux-by-reown.branding-only {
    padding-top: ${({spacing:e})=>e[3]};
  }

  a {
    text-decoration: none;
    color: ${({tokens:e})=>e.core.textAccentPrimary};
    font-weight: 500;
  }
`,Bn=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Vn=class extends n{constructor(){super(),this.unsubscribe=[],this.remoteFeatures=g.state.remoteFeatures,this.unsubscribe.push(g.subscribeKey(`remoteFeatures`,e=>this.remoteFeatures=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{termsConditionsUrl:t,privacyPolicyUrl:n}=g.state,r=g.state.features?.legalCheckbox;return!t&&!n||r?e`
        <wui-flex flexDirection="column"> ${this.reownBrandingTemplate(!0)} </wui-flex>
      `:e`
      <wui-flex flexDirection="column">
        <wui-flex .padding=${[`4`,`3`,`3`,`3`]} justifyContent="center">
          <wui-text color="secondary" variant="md-regular" align="center">
            By connecting your wallet, you agree to our <br />
            ${this.termsTemplate()} ${this.andTemplate()} ${this.privacyTemplate()}
          </wui-text>
        </wui-flex>
        ${this.reownBrandingTemplate()}
      </wui-flex>
    `}andTemplate(){let{termsConditionsUrl:e,privacyPolicyUrl:t}=g.state;return e&&t?`and`:``}termsTemplate(){let{termsConditionsUrl:t}=g.state;return t?e`<a href=${t} target="_blank" rel="noopener noreferrer"
      >Terms of Service</a
    >`:null}privacyTemplate(){let{privacyPolicyUrl:t}=g.state;return t?e`<a href=${t} target="_blank" rel="noopener noreferrer"
      >Privacy Policy</a
    >`:null}reownBrandingTemplate(t=!1){return this.remoteFeatures?.reownBranding?t?e`<wui-ux-by-reown class="branding-only"></wui-ux-by-reown>`:e`<wui-ux-by-reown></wui-ux-by-reown>`:null}};Vn.styles=[zn],Bn([a()],Vn.prototype,`remoteFeatures`,void 0),Vn=Bn([x(`w3m-legal-footer`)],Vn);var Hn=r``,Un=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Wn=class extends n{render(){let{termsConditionsUrl:t,privacyPolicyUrl:n}=g.state;return!t&&!n?null:e`
      <wui-flex
        .padding=${[`4`,`3`,`3`,`3`]}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap="3"
      >
        <wui-text color="secondary" variant="md-regular" align="center">
          We work with the best providers to give you the lowest fees and best support. More options
          coming soon!
        </wui-text>

        ${this.howDoesItWorkTemplate()}
      </wui-flex>
    `}howDoesItWorkTemplate(){return e` <wui-link @click=${this.onWhatIsBuy.bind(this)}>
      <wui-icon size="xs" color="accent-primary" slot="iconLeft" name="helpCircle"></wui-icon>
      How does it work?
    </wui-link>`}onWhatIsBuy(){y.sendEvent({type:`track`,event:`SELECT_WHAT_IS_A_BUY`,properties:{isSmartAccount:he(v.state.activeChain)===ve.ACCOUNT_TYPES.SMART_ACCOUNT}}),b.push(`WhatIsABuy`)}};Wn.styles=[Hn],Wn=Un([x(`w3m-onramp-providers-footer`)],Wn);var Gn=w`
  :host {
    display: block;
  }

  div.container {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    height: auto;
    display: block;
  }

  div.container[status='hide'] {
    animation: fade-out;
    animation-duration: var(--apkt-duration-dynamic);
    animation-timing-function: ${({easings:e})=>e[`ease-out-power-2`]};
    animation-fill-mode: both;
    animation-delay: 0s;
  }

  div.container[status='show'] {
    animation: fade-in;
    animation-duration: var(--apkt-duration-dynamic);
    animation-timing-function: ${({easings:e})=>e[`ease-out-power-2`]};
    animation-fill-mode: both;
    animation-delay: var(--apkt-duration-dynamic);
  }

  @keyframes fade-in {
    from {
      opacity: 0;
      filter: blur(6px);
    }
    to {
      opacity: 1;
      filter: blur(0px);
    }
  }

  @keyframes fade-out {
    from {
      opacity: 1;
      filter: blur(0px);
    }
    to {
      opacity: 0;
      filter: blur(6px);
    }
  }
`,Kn=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},qn=class extends n{constructor(){super(...arguments),this.resizeObserver=void 0,this.unsubscribe=[],this.status=`hide`,this.view=b.state.view}firstUpdated(){this.status=Rn.hasFooter()?`show`:`hide`,this.unsubscribe.push(b.subscribeKey(`view`,e=>{this.view=e,this.status=Rn.hasFooter()?`show`:`hide`,this.status===`hide`&&document.documentElement.style.setProperty(`--apkt-footer-height`,`0px`)})),this.resizeObserver=new ResizeObserver(e=>{for(let t of e)if(t.target===this.getWrapper()){let e=`${t.contentRect.height}px`;document.documentElement.style.setProperty(`--apkt-footer-height`,e)}}),this.resizeObserver.observe(this.getWrapper())}render(){return e`
      <div class="container" status=${this.status}>${this.templatePageContainer()}</div>
    `}templatePageContainer(){return Rn.hasFooter()?e` ${this.templateFooter()}`:null}templateFooter(){switch(this.view){case`Networks`:return this.templateNetworksFooter();case`Connect`:case`ConnectWallets`:case`OnRampFiatSelect`:case`OnRampTokenSelect`:return e`<w3m-legal-footer></w3m-legal-footer>`;case`OnRampProviders`:return e`<w3m-onramp-providers-footer></w3m-onramp-providers-footer>`;default:return null}}templateNetworksFooter(){return e` <wui-flex
      class="footer-in"
      padding="3"
      flexDirection="column"
      gap="3"
      alignItems="center"
    >
      <wui-text variant="md-regular" color="secondary" align="center">
        Your connected wallet may not support some of the networks available for this dApp
      </wui-text>
      <wui-link @click=${this.onNetworkHelp.bind(this)}>
        <wui-icon size="sm" color="accent-primary" slot="iconLeft" name="helpCircle"></wui-icon>
        What is a network
      </wui-link>
    </wui-flex>`}onNetworkHelp(){y.sendEvent({type:`track`,event:`CLICK_NETWORK_HELP`}),b.push(`WhatIsANetwork`)}getWrapper(){return this.shadowRoot?.querySelector(`div.container`)}};qn.styles=[Gn],Kn([a()],qn.prototype,`status`,void 0),Kn([a()],qn.prototype,`view`,void 0),qn=Kn([x(`w3m-footer`)],qn);var Jn=w`
  :host {
    display: block;
    width: inherit;
  }
`,Yn=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Xn=class extends n{constructor(){super(),this.unsubscribe=[],this.viewState=b.state.view,this.history=b.state.history.join(`,`),this.unsubscribe.push(b.subscribeKey(`view`,()=>{this.history=b.state.history.join(`,`),document.documentElement.style.setProperty(`--apkt-duration-dynamic`,`var(--apkt-durations-lg)`)}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),document.documentElement.style.setProperty(`--apkt-duration-dynamic`,`0s`)}render(){return e`${this.templatePageContainer()}`}templatePageContainer(){return e`<w3m-router-container
      history=${this.history}
      .setView=${()=>{this.viewState=b.state.view}}
    >
      ${this.viewTemplate(this.viewState)}
    </w3m-router-container>`}viewTemplate(t){switch(t){case`AccountSettings`:return e`<w3m-account-settings-view></w3m-account-settings-view>`;case`Account`:return e`<w3m-account-view></w3m-account-view>`;case`AllWallets`:return e`<w3m-all-wallets-view></w3m-all-wallets-view>`;case`ApproveTransaction`:return e`<w3m-approve-transaction-view></w3m-approve-transaction-view>`;case`BuyInProgress`:return e`<w3m-buy-in-progress-view></w3m-buy-in-progress-view>`;case`ChooseAccountName`:return e`<w3m-choose-account-name-view></w3m-choose-account-name-view>`;case`Connect`:return e`<w3m-connect-view></w3m-connect-view>`;case`Create`:return e`<w3m-connect-view walletGuide="explore"></w3m-connect-view>`;case`ConnectingWalletConnect`:return e`<w3m-connecting-wc-view></w3m-connecting-wc-view>`;case`ConnectingWalletConnectBasic`:return e`<w3m-connecting-wc-basic-view></w3m-connecting-wc-basic-view>`;case`ConnectingExternal`:return e`<w3m-connecting-external-view></w3m-connecting-external-view>`;case`ConnectingSiwe`:return e`<w3m-connecting-siwe-view></w3m-connecting-siwe-view>`;case`ConnectWallets`:return e`<w3m-connect-wallets-view></w3m-connect-wallets-view>`;case`ConnectSocials`:return e`<w3m-connect-socials-view></w3m-connect-socials-view>`;case`ConnectingSocial`:return e`<w3m-connecting-social-view></w3m-connecting-social-view>`;case`DataCapture`:return e`<w3m-data-capture-view></w3m-data-capture-view>`;case`DataCaptureOtpConfirm`:return e`<w3m-data-capture-otp-confirm-view></w3m-data-capture-otp-confirm-view>`;case`Downloads`:return e`<w3m-downloads-view></w3m-downloads-view>`;case`EmailLogin`:return e`<w3m-email-login-view></w3m-email-login-view>`;case`EmailVerifyOtp`:return e`<w3m-email-verify-otp-view></w3m-email-verify-otp-view>`;case`EmailVerifyDevice`:return e`<w3m-email-verify-device-view></w3m-email-verify-device-view>`;case`GetWallet`:return e`<w3m-get-wallet-view></w3m-get-wallet-view>`;case`Networks`:return e`<w3m-networks-view></w3m-networks-view>`;case`SwitchNetwork`:return e`<w3m-network-switch-view></w3m-network-switch-view>`;case`ProfileWallets`:return e`<w3m-profile-wallets-view></w3m-profile-wallets-view>`;case`Transactions`:return e`<w3m-transactions-view></w3m-transactions-view>`;case`OnRampProviders`:return e`<w3m-onramp-providers-view></w3m-onramp-providers-view>`;case`OnRampTokenSelect`:return e`<w3m-onramp-token-select-view></w3m-onramp-token-select-view>`;case`OnRampFiatSelect`:return e`<w3m-onramp-fiat-select-view></w3m-onramp-fiat-select-view>`;case`UpgradeEmailWallet`:return e`<w3m-upgrade-wallet-view></w3m-upgrade-wallet-view>`;case`UpdateEmailWallet`:return e`<w3m-update-email-wallet-view></w3m-update-email-wallet-view>`;case`UpdateEmailPrimaryOtp`:return e`<w3m-update-email-primary-otp-view></w3m-update-email-primary-otp-view>`;case`UpdateEmailSecondaryOtp`:return e`<w3m-update-email-secondary-otp-view></w3m-update-email-secondary-otp-view>`;case`UnsupportedChain`:return e`<w3m-unsupported-chain-view></w3m-unsupported-chain-view>`;case`Swap`:return e`<w3m-swap-view></w3m-swap-view>`;case`SwapSelectToken`:return e`<w3m-swap-select-token-view></w3m-swap-select-token-view>`;case`SwapPreview`:return e`<w3m-swap-preview-view></w3m-swap-preview-view>`;case`WalletSend`:return e`<w3m-wallet-send-view></w3m-wallet-send-view>`;case`WalletSendSelectToken`:return e`<w3m-wallet-send-select-token-view></w3m-wallet-send-select-token-view>`;case`WalletSendPreview`:return e`<w3m-wallet-send-preview-view></w3m-wallet-send-preview-view>`;case`WalletSendConfirmed`:return e`<w3m-send-confirmed-view></w3m-send-confirmed-view>`;case`WhatIsABuy`:return e`<w3m-what-is-a-buy-view></w3m-what-is-a-buy-view>`;case`WalletReceive`:return e`<w3m-wallet-receive-view></w3m-wallet-receive-view>`;case`WalletCompatibleNetworks`:return e`<w3m-wallet-compatible-networks-view></w3m-wallet-compatible-networks-view>`;case`WhatIsAWallet`:return e`<w3m-what-is-a-wallet-view></w3m-what-is-a-wallet-view>`;case`ConnectingMultiChain`:return e`<w3m-connecting-multi-chain-view></w3m-connecting-multi-chain-view>`;case`WhatIsANetwork`:return e`<w3m-what-is-a-network-view></w3m-what-is-a-network-view>`;case`ConnectingFarcaster`:return e`<w3m-connecting-farcaster-view></w3m-connecting-farcaster-view>`;case`SwitchActiveChain`:return e`<w3m-switch-active-chain-view></w3m-switch-active-chain-view>`;case`RegisterAccountName`:return e`<w3m-register-account-name-view></w3m-register-account-name-view>`;case`RegisterAccountNameSuccess`:return e`<w3m-register-account-name-success-view></w3m-register-account-name-success-view>`;case`SmartSessionCreated`:return e`<w3m-smart-session-created-view></w3m-smart-session-created-view>`;case`SmartSessionList`:return e`<w3m-smart-session-list-view></w3m-smart-session-list-view>`;case`SIWXSignMessage`:return e`<w3m-siwx-sign-message-view></w3m-siwx-sign-message-view>`;case`Pay`:return e`<w3m-pay-view></w3m-pay-view>`;case`PayLoading`:return e`<w3m-pay-loading-view></w3m-pay-loading-view>`;case`PayQuote`:return e`<w3m-pay-quote-view></w3m-pay-quote-view>`;case`FundWallet`:return e`<w3m-fund-wallet-view></w3m-fund-wallet-view>`;case`PayWithExchange`:return e`<w3m-deposit-from-exchange-view></w3m-deposit-from-exchange-view>`;case`PayWithExchangeSelectAsset`:return e`<w3m-deposit-from-exchange-select-asset-view></w3m-deposit-from-exchange-select-asset-view>`;case`UsageExceeded`:return e`<w3m-usage-exceeded-view></w3m-usage-exceeded-view>`;case`SmartAccountSettings`:return e`<w3m-smart-account-settings-view></w3m-smart-account-settings-view>`;default:return e`<w3m-connect-view></w3m-connect-view>`}}};Xn.styles=[Jn],Yn([a()],Xn.prototype,`viewState`,void 0),Yn([a()],Xn.prototype,`history`,void 0),Xn=Yn([x(`w3m-router`)],Xn);var Zn=w`
  :host {
    z-index: ${({tokens:e})=>e.core.zIndex};
    display: block;
    backface-visibility: hidden;
    will-change: opacity;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    opacity: 0;
    background-color: ${({tokens:e})=>e.theme.overlay};
    backdrop-filter: blur(0px);
    transition:
      opacity ${({durations:e})=>e.lg} ${({easings:e})=>e[`ease-out-power-2`]},
      backdrop-filter ${({durations:e})=>e.lg}
        ${({easings:e})=>e[`ease-out-power-2`]};
    will-change: opacity;
  }

  :host(.open) {
    opacity: 1;
    backdrop-filter: blur(8px);
  }

  :host(.appkit-modal) {
    position: relative;
    pointer-events: unset;
    background: none;
    width: 100%;
    opacity: 1;
  }

  wui-card {
    max-width: var(--apkt-modal-width);
    width: 100%;
    position: relative;
    outline: none;
    transform: translateY(4px);
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.05);
    transition:
      transform ${({durations:e})=>e.lg}
        ${({easings:e})=>e[`ease-out-power-2`]},
      border-radius ${({durations:e})=>e.lg}
        ${({easings:e})=>e[`ease-out-power-1`]},
      background-color ${({durations:e})=>e.lg}
        ${({easings:e})=>e[`ease-out-power-1`]},
      box-shadow ${({durations:e})=>e.lg}
        ${({easings:e})=>e[`ease-out-power-1`]};
    will-change: border-radius, background-color, transform, box-shadow;
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    padding: var(--local-modal-padding);
    box-sizing: border-box;
  }

  :host(.open) wui-card {
    transform: translateY(0px);
  }

  wui-card::before {
    z-index: 1;
    pointer-events: none;
    content: '';
    position: absolute;
    inset: 0;
    border-radius: clamp(0px, var(--apkt-borderRadius-8), 44px);
    transition: box-shadow ${({durations:e})=>e.lg}
      ${({easings:e})=>e[`ease-out-power-2`]};
    transition-delay: ${({durations:e})=>e.md};
    will-change: box-shadow;
  }

  :host([data-mobile-fullscreen='true']) wui-card::before {
    border-radius: 0px;
  }

  :host([data-border='true']) wui-card::before {
    box-shadow: inset 0px 0px 0px 4px ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  :host([data-border='false']) wui-card::before {
    box-shadow: inset 0px 0px 0px 1px ${({tokens:e})=>e.theme.borderPrimaryDark};
  }

  :host([data-border='true']) wui-card {
    animation:
      fade-in ${({durations:e})=>e.lg} ${({easings:e})=>e[`ease-out-power-2`]},
      card-background-border var(--apkt-duration-dynamic)
        ${({easings:e})=>e[`ease-out-power-2`]};
    animation-fill-mode: backwards, both;
    animation-delay: var(--apkt-duration-dynamic);
  }

  :host([data-border='false']) wui-card {
    animation:
      fade-in ${({durations:e})=>e.lg} ${({easings:e})=>e[`ease-out-power-2`]},
      card-background-default var(--apkt-duration-dynamic)
        ${({easings:e})=>e[`ease-out-power-2`]};
    animation-fill-mode: backwards, both;
    animation-delay: 0s;
  }

  :host(.appkit-modal) wui-card {
    max-width: var(--apkt-modal-width);
  }

  wui-card[shake='true'] {
    animation:
      fade-in ${({durations:e})=>e.lg} ${({easings:e})=>e[`ease-out-power-2`]},
      w3m-shake ${({durations:e})=>e.xl}
        ${({easings:e})=>e[`ease-out-power-2`]};
  }

  wui-flex {
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  @media (max-height: 700px) and (min-width: 431px) {
    wui-flex {
      align-items: flex-start;
    }

    wui-card {
      margin: var(--apkt-spacing-6) 0px;
    }
  }

  @media (max-width: 430px) {
    :host([data-mobile-fullscreen='true']) {
      height: 100dvh;
    }
    :host([data-mobile-fullscreen='true']) wui-flex {
      align-items: stretch;
    }
    :host([data-mobile-fullscreen='true']) wui-card {
      max-width: 100%;
      height: 100%;
      border-radius: 0;
      border: none;
    }
    :host(:not([data-mobile-fullscreen='true'])) wui-flex {
      align-items: flex-end;
    }

    :host(:not([data-mobile-fullscreen='true'])) wui-card {
      max-width: 100%;
      border-bottom: none;
    }

    :host(:not([data-mobile-fullscreen='true'])) wui-card[data-embedded='true'] {
      border-bottom-left-radius: clamp(0px, var(--apkt-borderRadius-8), 44px);
      border-bottom-right-radius: clamp(0px, var(--apkt-borderRadius-8), 44px);
    }

    :host(:not([data-mobile-fullscreen='true'])) wui-card:not([data-embedded='true']) {
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
    }

    wui-card[shake='true'] {
      animation: w3m-shake 0.5s ${({easings:e})=>e[`ease-out-power-2`]};
    }
  }

  @keyframes fade-in {
    0% {
      transform: scale(0.99) translateY(4px);
    }
    100% {
      transform: scale(1) translateY(0);
    }
  }

  @keyframes w3m-shake {
    0% {
      transform: scale(1) rotate(0deg);
    }
    20% {
      transform: scale(1) rotate(-1deg);
    }
    40% {
      transform: scale(1) rotate(1.5deg);
    }
    60% {
      transform: scale(1) rotate(-1.5deg);
    }
    80% {
      transform: scale(1) rotate(1deg);
    }
    100% {
      transform: scale(1) rotate(0deg);
    }
  }

  @keyframes card-background-border {
    from {
      background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    }
    to {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }
  }

  @keyframes card-background-default {
    from {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }
    to {
      background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    }
  }
`,J=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Qn=`scroll-lock`,$n={PayWithExchange:`0`,PayWithExchangeSelectAsset:`0`,Pay:`0`,PayQuote:`0`,PayLoading:`0`},Y=class extends n{constructor(){super(),this.unsubscribe=[],this.abortController=void 0,this.hasPrefetched=!1,this.enableEmbedded=g.state.enableEmbedded,this.open=m.state.open,this.caipAddress=v.state.activeCaipAddress,this.caipNetwork=v.state.activeCaipNetwork,this.shake=m.state.shake,this.filterByNamespace=_.state.filterByNamespace,this.padding=be.spacing[1],this.mobileFullScreen=g.state.enableMobileFullScreen,this.initializeTheming(),_e.prefetchAnalyticsConfig(),this.unsubscribe.push(m.subscribeKey(`open`,e=>e?this.onOpen():this.onClose()),m.subscribeKey(`shake`,e=>this.shake=e),v.subscribeKey(`activeCaipNetwork`,e=>this.onNewNetwork(e)),v.subscribeKey(`activeCaipAddress`,e=>this.onNewAddress(e)),g.subscribeKey(`enableEmbedded`,e=>this.enableEmbedded=e),_.subscribeKey(`filterByNamespace`,e=>{this.filterByNamespace!==e&&!v.getAccountData(e)?.caipAddress&&(_e.fetchRecommendedWallets(),this.filterByNamespace=e)}),b.subscribeKey(`view`,()=>{this.dataset.border=Rn.hasFooter()?`true`:`false`,this.padding=$n[b.state.view]??be.spacing[1]}))}firstUpdated(){if(this.dataset.border=Rn.hasFooter()?`true`:`false`,this.mobileFullScreen&&this.setAttribute(`data-mobile-fullscreen`,`true`),this.caipAddress){if(this.enableEmbedded){m.close(),this.prefetch();return}this.onNewAddress(this.caipAddress)}this.open&&this.onOpen(),this.enableEmbedded&&this.prefetch()}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),this.onRemoveKeyboardListener()}render(){return this.style.setProperty(`--local-modal-padding`,this.padding),this.enableEmbedded?e`${this.contentTemplate()}
        <w3m-tooltip></w3m-tooltip> `:this.open?e`
          <wui-flex @click=${this.onOverlayClick.bind(this)} data-testid="w3m-modal-overlay">
            ${this.contentTemplate()}
          </wui-flex>
          <w3m-tooltip></w3m-tooltip>
        `:null}contentTemplate(){return e` <wui-card
      shake="${this.shake}"
      data-embedded="${s(this.enableEmbedded)}"
      role="alertdialog"
      aria-modal="true"
      tabindex="0"
      data-testid="w3m-modal-card"
    >
      <w3m-header></w3m-header>
      <w3m-router></w3m-router>
      <w3m-footer></w3m-footer>
      <w3m-snackbar></w3m-snackbar>
      <w3m-alertbar></w3m-alertbar>
    </wui-card>`}async onOverlayClick(e){if(e.target===e.currentTarget){if(this.mobileFullScreen)return;await this.handleClose()}}async handleClose(){await Ae.safeClose()}initializeTheming(){let{themeVariables:e,themeMode:t}=fe.state;Ce(e,Se.getColorTheme(t))}onClose(){this.open=!1,this.classList.remove(`open`),this.onScrollUnlock(),c.hide(),this.onRemoveKeyboardListener()}onOpen(){this.open=!0,this.classList.add(`open`),this.onScrollLock(),this.onAddKeyboardListener()}onScrollLock(){let e=document.createElement(`style`);e.dataset.w3m=Qn,e.textContent=`
      body {
        touch-action: none;
        overflow: hidden;
        overscroll-behavior: contain;
      }
      w3m-modal {
        pointer-events: auto;
      }
    `,document.head.appendChild(e)}onScrollUnlock(){let e=document.head.querySelector(`style[data-w3m="${Qn}"]`);e&&e.remove()}onAddKeyboardListener(){this.abortController=new AbortController;let e=this.shadowRoot?.querySelector(`wui-card`);e?.focus(),window.addEventListener(`keydown`,t=>{if(t.key===`Escape`)this.handleClose();else if(t.key===`Tab`){let{tagName:n}=t.target;n&&!n.includes(`W3M-`)&&!n.includes(`WUI-`)&&e?.focus()}},this.abortController)}onRemoveKeyboardListener(){this.abortController?.abort(),this.abortController=void 0}async onNewAddress(e){let t=v.state.isSwitchingNamespace,n=b.state.view===`ProfileWallets`;!e&&!t&&!n&&m.close(),await Te.initializeIfEnabled(e),this.caipAddress=e,v.setIsSwitchingNamespace(!1)}onNewNetwork(e){let t=this.caipNetwork?.caipNetworkId?.toString()!==e?.caipNetworkId?.toString(),n=b.state.view===`UnsupportedChain`,r=m.state.open,i=!1;this.enableEmbedded&&b.state.view===`SwitchNetwork`&&(i=!0),t&&D.resetState(),r&&n&&(i=!0),i&&b.state.view!==`SIWXSignMessage`&&b.goBack(),this.caipNetwork=e}prefetch(){this.hasPrefetched||=(_e.prefetch(),_e.fetchWalletsByPage({page:1}),!0)}};Y.styles=Zn,J([o({type:Boolean})],Y.prototype,`enableEmbedded`,void 0),J([a()],Y.prototype,`open`,void 0),J([a()],Y.prototype,`caipAddress`,void 0),J([a()],Y.prototype,`caipNetwork`,void 0),J([a()],Y.prototype,`shake`,void 0),J([a()],Y.prototype,`filterByNamespace`,void 0),J([a()],Y.prototype,`padding`,void 0),J([a()],Y.prototype,`mobileFullScreen`,void 0);var er=class extends Y{};er=J([x(`w3m-modal`)],er);var tr=class extends Y{};tr=J([x(`appkit-modal`)],tr);var nr=w`
  .icon-box {
    width: 64px;
    height: 64px;
    border-radius: ${({borderRadius:e})=>e[5]};
    background-color: ${({colors:e})=>e.semanticError010};
  }
`,rr=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},ir=class extends n{constructor(){super()}render(){return e`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        gap="4"
        .padding="${[`1`,`3`,`4`,`3`]}"
      >
        <wui-flex justifyContent="center" alignItems="center" class="icon-box">
          <wui-icon size="xxl" color="error" name="warningCircle"></wui-icon>
        </wui-flex>

        <wui-text variant="lg-medium" color="primary" align="center">
          The app isn't responding as expected
        </wui-text>
        <wui-text variant="md-regular" color="secondary" align="center">
          Try again or reach out to the app team for help.
        </wui-text>

        <wui-button
          variant="neutral-secondary"
          size="md"
          @click=${this.onTryAgainClick.bind(this)}
          data-testid="w3m-usage-exceeded-button"
        >
          <wui-icon color="inherit" slot="iconLeft" name="refresh"></wui-icon>
          Try Again
        </wui-button>
      </wui-flex>
    `}onTryAgainClick(){b.goBack()}};ir.styles=nr,ir=rr([x(`w3m-usage-exceeded-view`)],ir);var ar=w`
  :host {
    width: 100%;
  }
`,X=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Z=class extends n{constructor(){super(...arguments),this.hasImpressionSent=!1,this.walletImages=[],this.imageSrc=``,this.name=``,this.size=`md`,this.tabIdx=void 0,this.disabled=!1,this.showAllWallets=!1,this.loading=!1,this.loadingSpinnerColor=`accent-100`,this.rdnsId=``,this.displayIndex=void 0,this.walletRank=void 0,this.namespaces=[]}connectedCallback(){super.connectedCallback()}disconnectedCallback(){super.disconnectedCallback(),this.cleanupIntersectionObserver()}updated(e){super.updated(e),(e.has(`name`)||e.has(`imageSrc`)||e.has(`walletRank`))&&(this.hasImpressionSent=!1),e.has(`walletRank`)&&this.walletRank&&!this.intersectionObserver&&this.setupIntersectionObserver()}setupIntersectionObserver(){this.intersectionObserver=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&!this.loading&&!this.hasImpressionSent&&this.sendImpressionEvent()})},{threshold:.1}),this.intersectionObserver.observe(this)}cleanupIntersectionObserver(){this.intersectionObserver&&=(this.intersectionObserver.disconnect(),void 0)}sendImpressionEvent(){!this.name||this.hasImpressionSent||!this.walletRank||(this.hasImpressionSent=!0,(this.rdnsId||this.name)&&y.sendWalletImpressionEvent({name:this.name,walletRank:this.walletRank,rdnsId:this.rdnsId,view:b.state.view,displayIndex:this.displayIndex}))}handleGetWalletNamespaces(){return Object.keys(me.state.adapters).length>1?this.namespaces:[]}render(){return e`
      <wui-list-wallet
        .walletImages=${this.walletImages}
        imageSrc=${s(this.imageSrc)}
        name=${this.name}
        size=${s(this.size)}
        tagLabel=${s(this.tagLabel)}
        .tagVariant=${this.tagVariant}
        .walletIcon=${this.walletIcon}
        .tabIdx=${this.tabIdx}
        .disabled=${this.disabled}
        .showAllWallets=${this.showAllWallets}
        .loading=${this.loading}
        loadingSpinnerColor=${this.loadingSpinnerColor}
        .namespaces=${this.handleGetWalletNamespaces()}
      ></wui-list-wallet>
    `}};Z.styles=ar,X([o({type:Array})],Z.prototype,`walletImages`,void 0),X([o()],Z.prototype,`imageSrc`,void 0),X([o()],Z.prototype,`name`,void 0),X([o()],Z.prototype,`size`,void 0),X([o()],Z.prototype,`tagLabel`,void 0),X([o()],Z.prototype,`tagVariant`,void 0),X([o()],Z.prototype,`walletIcon`,void 0),X([o()],Z.prototype,`tabIdx`,void 0),X([o({type:Boolean})],Z.prototype,`disabled`,void 0),X([o({type:Boolean})],Z.prototype,`showAllWallets`,void 0),X([o({type:Boolean})],Z.prototype,`loading`,void 0),X([o({type:String})],Z.prototype,`loadingSpinnerColor`,void 0),X([o()],Z.prototype,`rdnsId`,void 0),X([o()],Z.prototype,`displayIndex`,void 0),X([o()],Z.prototype,`walletRank`,void 0),X([o({type:Array})],Z.prototype,`namespaces`,void 0),Z=X([x(`w3m-list-wallet`)],Z);var or=w`
  :host {
    --local-duration-height: 0s;
    --local-duration: ${({durations:e})=>e.lg};
    --local-transition: ${({easings:e})=>e[`ease-out-power-2`]};
  }

  .container {
    display: block;
    overflow: hidden;
    overflow: hidden;
    position: relative;
    height: var(--local-container-height);
    transition: height var(--local-duration-height) var(--local-transition);
    will-change: height, padding-bottom;
  }

  .container[data-mobile-fullscreen='true'] {
    overflow: scroll;
  }

  .page {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: auto;
    width: inherit;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    border-bottom-left-radius: var(--local-border-bottom-radius);
    border-bottom-right-radius: var(--local-border-bottom-radius);
    transition: border-bottom-left-radius var(--local-duration) var(--local-transition);
  }

  .page[data-mobile-fullscreen='true'] {
    height: 100%;
  }

  .page-content {
    display: flex;
    flex-direction: column;
    min-height: 100%;
  }

  .footer {
    height: var(--apkt-footer-height);
  }

  div.page[view-direction^='prev-'] .page-content {
    animation:
      slide-left-out var(--local-duration) forwards var(--local-transition),
      slide-left-in var(--local-duration) forwards var(--local-transition);
    animation-delay: 0ms, var(--local-duration, ${({durations:e})=>e.lg});
  }

  div.page[view-direction^='next-'] .page-content {
    animation:
      slide-right-out var(--local-duration) forwards var(--local-transition),
      slide-right-in var(--local-duration) forwards var(--local-transition);
    animation-delay: 0ms, var(--local-duration, ${({durations:e})=>e.lg});
  }

  @keyframes slide-left-out {
    from {
      transform: translateX(0px) scale(1);
      opacity: 1;
      filter: blur(0px);
    }
    to {
      transform: translateX(8px) scale(0.99);
      opacity: 0;
      filter: blur(4px);
    }
  }

  @keyframes slide-left-in {
    from {
      transform: translateX(-8px) scale(0.99);
      opacity: 0;
      filter: blur(4px);
    }
    to {
      transform: translateX(0) translateY(0) scale(1);
      opacity: 1;
      filter: blur(0px);
    }
  }

  @keyframes slide-right-out {
    from {
      transform: translateX(0px) scale(1);
      opacity: 1;
      filter: blur(0px);
    }
    to {
      transform: translateX(-8px) scale(0.99);
      opacity: 0;
      filter: blur(4px);
    }
  }

  @keyframes slide-right-in {
    from {
      transform: translateX(8px) scale(0.99);
      opacity: 0;
      filter: blur(4px);
    }
    to {
      transform: translateX(0) translateY(0) scale(1);
      opacity: 1;
      filter: blur(0px);
    }
  }
`,Q=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},sr=60,$=class extends n{constructor(){super(...arguments),this.resizeObserver=void 0,this.transitionDuration=`0.15s`,this.transitionFunction=``,this.history=``,this.view=``,this.setView=void 0,this.viewDirection=``,this.historyState=``,this.previousHeight=`0px`,this.mobileFullScreen=g.state.enableMobileFullScreen,this.onViewportResize=()=>{this.updateContainerHeight()}}updated(e){if(e.has(`history`)){let e=this.history;this.historyState!==``&&this.historyState!==e&&this.onViewChange(e)}e.has(`transitionDuration`)&&this.style.setProperty(`--local-duration`,this.transitionDuration),e.has(`transitionFunction`)&&this.style.setProperty(`--local-transition`,this.transitionFunction)}firstUpdated(){this.transitionFunction&&this.style.setProperty(`--local-transition`,this.transitionFunction),this.style.setProperty(`--local-duration`,this.transitionDuration),this.historyState=this.history,this.resizeObserver=new ResizeObserver(e=>{for(let t of e)if(t.target===this.getWrapper()){let e=t.contentRect.height,n=parseFloat(getComputedStyle(document.documentElement).getPropertyValue(`--apkt-footer-height`)||`0`);this.mobileFullScreen?(e=(window.visualViewport?.height||window.innerHeight)-this.getHeaderHeight()-n,this.style.setProperty(`--local-border-bottom-radius`,`0px`)):(e+=n,this.style.setProperty(`--local-border-bottom-radius`,n?`var(--apkt-borderRadius-5)`:`0px`)),this.style.setProperty(`--local-container-height`,`${e}px`),this.previousHeight!==`0px`&&this.style.setProperty(`--local-duration-height`,this.transitionDuration),this.previousHeight=`${e}px`}}),this.resizeObserver.observe(this.getWrapper()),this.updateContainerHeight(),window.addEventListener(`resize`,this.onViewportResize),window.visualViewport?.addEventListener(`resize`,this.onViewportResize)}disconnectedCallback(){let e=this.getWrapper();e&&this.resizeObserver&&this.resizeObserver.unobserve(e),window.removeEventListener(`resize`,this.onViewportResize),window.visualViewport?.removeEventListener(`resize`,this.onViewportResize)}render(){return e`
      <div class="container" data-mobile-fullscreen="${s(this.mobileFullScreen)}">
        <div
          class="page"
          data-mobile-fullscreen="${s(this.mobileFullScreen)}"
          view-direction="${this.viewDirection}"
        >
          <div class="page-content">
            <slot></slot>
          </div>
        </div>
      </div>
    `}onViewChange(e){let t=e.split(`,`).filter(Boolean),n=this.historyState.split(`,`).filter(Boolean),r=n.length,i=t.length,a=t[t.length-1]||``,o=Se.cssDurationToNumber(this.transitionDuration),s=``;i>r?s=`next`:i<r?s=`prev`:i===r&&t[i-1]!==n[r-1]&&(s=`next`),this.viewDirection=`${s}-${a}`,setTimeout(()=>{this.historyState=e,this.setView?.(a)},o),setTimeout(()=>{this.viewDirection=``},o*2)}getWrapper(){return this.shadowRoot?.querySelector(`div.page`)}updateContainerHeight(){let e=this.getWrapper();if(!e)return;let t=parseFloat(getComputedStyle(document.documentElement).getPropertyValue(`--apkt-footer-height`)||`0`),n=0;this.mobileFullScreen?(n=(window.visualViewport?.height||window.innerHeight)-this.getHeaderHeight()-t,this.style.setProperty(`--local-border-bottom-radius`,`0px`)):(n=e.getBoundingClientRect().height+t,this.style.setProperty(`--local-border-bottom-radius`,t?`var(--apkt-borderRadius-5)`:`0px`)),this.style.setProperty(`--local-container-height`,`${n}px`),this.previousHeight!==`0px`&&this.style.setProperty(`--local-duration-height`,this.transitionDuration),this.previousHeight=`${n}px`}getHeaderHeight(){return sr}};$.styles=[or],Q([o({type:String})],$.prototype,`transitionDuration`,void 0),Q([o({type:String})],$.prototype,`transitionFunction`,void 0),Q([o({type:String})],$.prototype,`history`,void 0),Q([o({type:String})],$.prototype,`view`,void 0),Q([o({attribute:!1})],$.prototype,`setView`,void 0),Q([a()],$.prototype,`viewDirection`,void 0),Q([a()],$.prototype,`historyState`,void 0),Q([a()],$.prototype,`previousHeight`,void 0),Q([a()],$.prototype,`mobileFullScreen`,void 0),$=Q([x(`w3m-router-container`)],$);export{tr as AppKitModal,Z as W3mListWallet,er as W3mModal,Y as W3mModalBase,$ as W3mRouterContainer,ir as W3mUsageExceededView};