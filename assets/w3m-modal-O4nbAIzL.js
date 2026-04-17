const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/exports-Hl9EKg2-.js","assets/chunk-Bj-mKKzh.js","assets/index-ZNIRkM0t.js","assets/preload-helper-DSXbuxSR.js","assets/lit-element-CQVoGdEF.js","assets/if-defined-Ba-nknRI.js","assets/hmac-Cu0qQFT_.js","assets/utils-B7R3x8nL.js","assets/sha3-BkDMOaVY.js","assets/index.es-CLLT_Pjb.js","assets/esm-kbT-2eNW.js","assets/index.es-SAGPgUtf.js","assets/ccip-LueDJ-jW.js","assets/_esm-CdXXPUGk.js","assets/sha256-GOXNWtuB.js","assets/secp256k1-BF-1NA5c.js","assets/utils-BeVtMw_R.js","assets/__vite-browser-external-CY0FFSRG.js","assets/index-DNWbbHac.css"])))=>i.map(i=>d[i]);
import{t as e}from"./preload-helper-DSXbuxSR.js";import{a as t,t as n,u as r}from"./lit-element-CQVoGdEF.js";import{o as i}from"./if-defined-Ba-nknRI.js";import{Sn as a,Yt as o,_n as s,an as c,bn as l,dn as u,fn as d,gn as f,on as p,pn as m,vn as h,xn as g}from"./index-ZNIRkM0t.js";var _=r`
  :host {
    z-index: var(--w3m-z-index);
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
    background-color: var(--wui-cover);
    transition: opacity 0.2s var(--wui-ease-out-power-2);
    will-change: opacity;
  }

  :host(.open) {
    opacity: 1;
  }

  wui-card {
    max-width: var(--w3m-modal-width);
    width: 100%;
    position: relative;
    animation: zoom-in 0.2s var(--wui-ease-out-power-2);
    animation-fill-mode: backwards;
    outline: none;
  }

  wui-card[shake='true'] {
    animation:
      zoom-in 0.2s var(--wui-ease-out-power-2),
      w3m-shake 0.5s var(--wui-ease-out-power-2);
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
      margin: var(--wui-spacing-xxl) 0px;
    }
  }

  @media (max-width: 430px) {
    wui-flex {
      align-items: flex-end;
    }

    wui-card {
      max-width: 100%;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      border-bottom: none;
      animation: slide-in 0.2s var(--wui-ease-out-power-2);
    }

    wui-card[shake='true'] {
      animation:
        slide-in 0.2s var(--wui-ease-out-power-2),
        w3m-shake 0.5s var(--wui-ease-out-power-2);
    }
  }

  @keyframes zoom-in {
    0% {
      transform: scale(0.95) translateY(0);
    }
    100% {
      transform: scale(1) translateY(0);
    }
  }

  @keyframes slide-in {
    0% {
      transform: scale(1) translateY(50px);
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

  @keyframes w3m-view-height {
    from {
      height: var(--prev-height);
    }
    to {
      height: var(--new-height);
    }
  }
`,v=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},y=`scroll-lock`,b=class extends n{constructor(){super(),this.unsubscribe=[],this.abortController=void 0,this.open=u.state.open,this.caipAddress=d.state.caipAddress,this.isSiweEnabled=s.state.isSiweEnabled,this.connected=d.state.isConnected,this.loading=u.state.loading,this.shake=u.state.shake,this.initializeTheming(),h.prefetch(),this.unsubscribe.push(u.subscribeKey(`open`,e=>e?this.onOpen():this.onClose()),u.subscribeKey(`shake`,e=>this.shake=e),u.subscribeKey(`loading`,e=>{this.loading=e,this.onNewAddress(d.state.caipAddress)}),d.subscribeKey(`isConnected`,e=>this.connected=e),d.subscribeKey(`caipAddress`,e=>this.onNewAddress(e)),s.subscribeKey(`isSiweEnabled`,e=>this.isSiweEnabled=e)),l.sendEvent({type:`track`,event:`MODAL_LOADED`})}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),this.onRemoveKeyboardListener()}render(){return this.open?t`
          <wui-flex @click=${this.onOverlayClick.bind(this)} data-testid="w3m-modal-overlay">
            <wui-card
              shake="${this.shake}"
              role="alertdialog"
              aria-modal="true"
              tabindex="0"
              data-testid="w3m-modal-card"
            >
              <w3m-header></w3m-header>
              <w3m-router></w3m-router>
              <w3m-snackbar></w3m-snackbar>
            </wui-card>
          </wui-flex>
          <w3m-tooltip></w3m-tooltip>
        `:null}async onOverlayClick(e){e.target===e.currentTarget&&await this.handleClose()}async handleClose(){let t=m.state.view===`ConnectingSiwe`,n=m.state.view===`ApproveTransaction`;if(this.isSiweEnabled){let{SIWEController:r}=await e(async()=>{let{SIWEController:e}=await import(`./exports-Hl9EKg2-.js`);return{SIWEController:e}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]));r.state.status!==`success`&&(t||n)?u.shake():u.close()}else u.close()}initializeTheming(){let{themeVariables:e,themeMode:t}=g.state;p(e,o.getColorTheme(t))}onClose(){this.open=!1,this.classList.remove(`open`),this.onScrollUnlock(),f.hide(),this.onRemoveKeyboardListener()}onOpen(){this.open=!0,this.classList.add(`open`),this.onScrollLock(),this.onAddKeyboardListener()}onScrollLock(){let e=document.createElement(`style`);e.dataset.w3m=y,e.textContent=`
      body {
        touch-action: none;
        overflow: hidden;
        overscroll-behavior: contain;
      }
      w3m-modal {
        pointer-events: auto;
      }
    `,document.head.appendChild(e)}onScrollUnlock(){let e=document.head.querySelector(`style[data-w3m="${y}"]`);e&&e.remove()}onAddKeyboardListener(){this.abortController=new AbortController;let e=this.shadowRoot?.querySelector(`wui-card`);e?.focus(),window.addEventListener(`keydown`,t=>{if(t.key===`Escape`)this.handleClose();else if(t.key===`Tab`){let{tagName:n}=t.target;n&&!n.includes(`W3M-`)&&!n.includes(`WUI-`)&&e?.focus()}},this.abortController)}onRemoveKeyboardListener(){this.abortController?.abort(),this.abortController=void 0}async onNewAddress(t){if(!this.connected||this.loading)return;let n=a.getPlainAddress(this.caipAddress),r=a.getPlainAddress(t),i=a.getNetworkId(this.caipAddress),o=a.getNetworkId(t);if(this.caipAddress=t,this.isSiweEnabled){let{SIWEController:t}=await e(async()=>{let{SIWEController:e}=await import(`./exports-Hl9EKg2-.js`);return{SIWEController:e}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18])),a=await t.getSession();if(a&&n&&r&&n!==r){t.state._client?.options.signOutOnAccountChange&&(await t.signOut(),this.onSiweNavigation());return}if(a&&i&&o&&i!==o){t.state._client?.options.signOutOnNetworkChange&&(await t.signOut(),this.onSiweNavigation());return}this.onSiweNavigation()}}onSiweNavigation(){this.open?m.push(`ConnectingSiwe`):u.open({view:`ConnectingSiwe`})}};b.styles=_,v([i()],b.prototype,`open`,void 0),v([i()],b.prototype,`caipAddress`,void 0),v([i()],b.prototype,`isSiweEnabled`,void 0),v([i()],b.prototype,`connected`,void 0),v([i()],b.prototype,`loading`,void 0),v([i()],b.prototype,`shake`,void 0),b=v([c(`w3m-modal`)],b);export{b as W3mModal};