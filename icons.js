// Тематические иконки для оценок. Каждый символ — 32×32, рисуется через <use href="#i-…">.
// NOUNS — как называть единицу оценки: «7 из 10 пауков».
(function(){
const STAR='M16 11L17.18 14.38L20.76 14.46L17.9 16.62L18.94 20.05L16 18L13.06 20.05L14.1 16.62L11.24 14.46L14.82 14.38Z';
const HEAD='M16 4c-5.5 0-9 4-9 10 0 8 4 15 9 15s9-7 9-15c0-6-3.5-10-9-10z';

const S={
spider:`
  <path d="M16 2C9 2 5 8 5 15c0 8 5 15 11 15s11-7 11-15C27 8 23 2 16 2z" fill="#d81f26"/>
  <g stroke="#5a0c10" stroke-width=".7" fill="none" stroke-linecap="round">
    <path d="M16 16V2.3M16 16L5.2 14.6M16 16l10.8-1.4M16 16L8.4 5.2M16 16l7.6-10.8M16 16L7.2 25.4M16 16l8.8 9.4M16 16v13.7"/>
    <path d="M9.4 8.6Q16 6.2 22.6 8.6M6.2 14.2Q16 11.2 25.8 14.2M6.4 20.6Q16 17.8 25.6 20.6M9.6 26.6Q16 24.4 22.4 26.6"/>
  </g>
  <path d="M7.4 12.4c2.6-1.1 6.2-.6 7.3 3 .5 2.1-1 3.6-3.1 3.3-2.7-.4-4.7-3.1-4.2-6.3z" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/>
  <path d="M24.6 12.4c-2.6-1.1-6.2-.6-7.3 3-.5 2.1 1 3.6 3.1 3.3 2.7-.4 4.7-3.1 4.2-6.3z" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/>`,
iron:`
  <path d="M16 2C9.5 2 6 6.5 6 13v7c0 5 4 10 10 10s10-5 10-10v-7C26 6.5 22.5 2 16 2z" fill="#b3121b"/>
  <path d="M16 5c-4.5 0-7 3-7 7.5V19c0 3.5 2 6.5 4 8h6c2-1.5 4-4.5 4-8v-6.5C23 8 20.5 5 16 5z" fill="#f2b62b"/>
  <path d="M16 5c-1.2 0-2.2.2-3 .6V11h6V5.6c-.8-.4-1.8-.6-3-.6z" fill="#ffd36a" opacity=".55"/>
  <path d="M10.3 14.2l4.4.9v1.5l-4.4-.5zM21.7 14.2l-4.4.9v1.5l4.4-.5z" fill="#d9fbff"/>
  <path d="M13 23.5h6" stroke="#8a5a00" stroke-width="1.1" stroke-linecap="round"/>`,
shield:`
  <circle cx="16" cy="16" r="14" fill="#c8102e"/><circle cx="16" cy="16" r="11" fill="#f2f2f2"/>
  <circle cx="16" cy="16" r="8" fill="#c8102e"/><circle cx="16" cy="16" r="5.4" fill="#1f3a93"/>
  <path d="${STAR}" fill="#fff"/>`,
deadpool:`
  <circle cx="16" cy="16" r="14" fill="#c41e1e"/>
  <path d="M16 2v28" stroke="#8f1010" stroke-width=".8"/>
  <path d="M3.8 11c3-1.5 8.2-1 10.2 3 1 2.5 0 6-3 6.5-4 .7-7.2-2.5-7.2-9.5zM28.2 11c-3-1.5-8.2-1-10.2 3-1 2.5 0 6 3 6.5 4 .7 7.2-2.5 7.2-9.5z" fill="#111"/>
  <path d="M7 13.6c2-.5 4.5 0 5.5 2-.5 1.2-2 1.6-3.5 1.2-1.3-.4-2-1.6-2-3.2zM25 13.6c-2-.5-4.5 0-5.5 2 .5 1.2 2 1.6 3.5 1.2 1.3-.4 2-1.6 2-3.2z" fill="#fff"/>`,
doom:`
  <path d="M16 1.5C8 1.5 3.5 8 3.5 16c0 6 2 11 4 14.5h17c2-3.5 4-8.5 4-14.5 0-8-4.5-14.5-12.5-14.5z" fill="#1d5a2c"/>
  <path d="M16 6c-5 0-8 3.5-8 9v6c0 4 3 8 8 8s8-4 8-8v-6c0-5.5-3-9-8-9z" fill="#8f99a2"/>
  <path d="M16 6c-5 0-8 3.5-8 9v1c2-5 5-7 8-7s6 2 8 7v-1c0-5.5-3-9-8-9z" fill="#c3cad1"/>
  <path d="M10.3 14.4h4.6v1.8h-4.6zM17.1 14.4h4.6v1.8h-4.6z" fill="#42ff8e"/>
  <path d="M9.4 13.1c2.1-1.1 4.6-1.2 6.6-.5 2-.7 4.5-.6 6.6.5" stroke="#4a5259" stroke-width=".9" fill="none" stroke-linecap="round"/><path d="M10 18.2l2.6 3.4M22 18.2l-2.6 3.4" stroke="#5f676e" stroke-width=".8" stroke-linecap="round"/>
  <path d="M16 11.5v8.5" stroke="#5f676e" stroke-width="1.1"/>
  <path d="M12.5 23.4h7M13.2 25.6h5.6" stroke="#3b4248" stroke-width="1.1" stroke-linecap="round"/>
  <circle cx="9.6" cy="19.8" r=".7" fill="#5f676e"/><circle cx="22.4" cy="19.8" r=".7" fill="#5f676e"/>`,
xmen:`
  <circle cx="16" cy="16" r="13.5" fill="#15171b" stroke="#f5c400" stroke-width="2.2"/>
  <path d="M10 8.5l12 15M22 8.5l-12 15" stroke="#f5c400" stroke-width="4.2" stroke-linecap="round"/>`,
ff:`
  <circle cx="16" cy="16" r="14" fill="#1d4fd8"/><circle cx="16" cy="16" r="11.2" fill="none" stroke="#fff" stroke-width="2"/>
  <path fill="#fff" fill-rule="evenodd" d="M17.5 8H21v9.6h2.4v2.9H21V24h-3.4v-3.5H9.4v-2.7L17.5 8zM17.6 17.6v-5.3l-4.3 5.3z"/>`,
hulk:`
  <path d="M16 3c-6.5 0-10.5 4.5-10.5 11 0 8 4.5 15 10.5 15s10.5-7 10.5-15C26.5 7.5 22.5 3 16 3z" fill="#4c9a2a"/>
  <path d="M5.5 12c0-6 4-10 10.5-10S26.5 6 26.5 12c-2-3-5-4-6.5-4-1 1.5-3 2-4 2s-3-.5-4-2c-1.5 0-4.5 1-6.5 4z" fill="#1b1b1b"/>
  <path d="M8.8 14.2l5.2 1.8M23.2 14.2L18 16" stroke="#173a0c" stroke-width="2" stroke-linecap="round"/>
  <ellipse cx="11.6" cy="17.6" rx="1.8" ry="1" fill="#e9ffe0"/><ellipse cx="20.4" cy="17.6" rx="1.8" ry="1" fill="#e9ffe0"/>
  <path d="M11.5 24.2c2.4-1.6 6.6-1.6 9 0v1.2h-9z" fill="#fff" stroke="#173a0c" stroke-width="1.1" stroke-linejoin="round"/>`,
wolverine:`
  <path d="${HEAD}" fill="#f2c014"/>
  <path d="M7.4 14C5 9 3 5 2.5 1.6c3 2 6 4.2 8.6 7.8 1 1.5.4 4-1.2 5.4zM24.6 14C27 9 29 5 29.5 1.6c-3 2-6 4.2-8.6 7.8-1 1.5-.4 4 1.2 5.4z" fill="#1c1c1c"/>
  <path d="M8.4 13c2-1 5-.5 6.6 2l-1 2.6c-2.6.3-5-1-5.6-4.6zM23.6 13c-2-1-5-.5-6.6 2l1 2.6c2.6.3 5-1 5.6-4.6z" fill="#1c1c1c"/>
  <path d="M10 14.6l3.6.9-.4 1c-1.6 0-2.8-.6-3.2-1.9zM22 14.6l-3.6.9.4 1c1.6 0 2.8-.6 3.2-1.9z" fill="#fff"/>
  <path d="M10.5 21c1.5 4 3.5 7 5.5 7s4-3 5.5-7c-2 1-3.5 1.3-5.5 1.3s-3.5-.3-5.5-1.3z" fill="#e9b48a"/>`,
hammer:`
  <path d="M26.5 1.5l-3.2 4.6h2.6L22.8 11" stroke="#ffe14d" stroke-width="1.3" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
  <rect x="4" y="6" width="21" height="10.5" rx="1.6" fill="#8f99a3"/>
  <rect x="4" y="6" width="21" height="3.2" rx="1.6" fill="#c3cad1"/>
  <path d="M8 6v10.5M21 6v10.5" stroke="#6e7780" stroke-width=".8"/>
  <rect x="12.6" y="16.5" width="3.8" height="10" fill="#6b4423"/>
  <path d="M12.6 18.5l3.8 1.2M12.6 21l3.8 1.2M12.6 23.5l3.8 1.2" stroke="#3e2512" stroke-width=".8"/>
  <path d="M12.8 26.5h3.4l1.4 4h-6.2z" fill="#3a2412"/>`,
avengers:`
  <circle cx="16" cy="16" r="13" fill="#15181d" stroke="#c9ced6" stroke-width="2.4"/>
  <path fill="#fff" fill-rule="evenodd" d="M8 27L17 4h4v23h-3.5v-6h-4l-2 6zM17.5 17.5V11L15 17.5z"/>
  <path d="M7 17.5h20.5l-2.2 2.2H7z" fill="#d6202c"/>`,
stones:`
  <path d="M8.5 4.2h3v6.6h-3zM12.5 3h3v7.8h-3zM16.5 3h3v7.8h-3zM20.5 4.2h3v6.6h-3z" fill="#c8930f"/>
  <path d="M8 10h16v14c0 3-3 6-8 6s-8-3-8-6z" fill="#e0aa1c"/>
  <path d="M5 16c0-2 1.4-3 3-3v8c-1.6 0-3-1-3-3z" fill="#c8930f"/>
  <circle cx="10" cy="7.5" r="1.4" fill="#3b82f6"/><circle cx="14" cy="6.5" r="1.4" fill="#ef4444"/>
  <circle cx="18" cy="6.5" r="1.4" fill="#a855f7"/><circle cx="22" cy="7.5" r="1.4" fill="#facc15"/>
  <circle cx="16" cy="18" r="2.8" fill="#22c55e" stroke="#9a6f07" stroke-width=".8"/>
  <circle cx="6.6" cy="17" r="1.3" fill="#f97316"/>`,
daredevil:`
  <path d="M9.2 7.4L7 1.4l4.8 3.8zM22.8 7.4L25 1.4l-4.8 3.8z" fill="#9b111e"/>
  <path d="${HEAD}" fill="#9b111e"/>
  <path d="M9.5 13.5l5 1.5-.5 1.8c-2.5 0-4-1.2-4.5-3.3zM22.5 13.5l-5 1.5.5 1.8c2.5 0 4-1.2 4.5-3.3z" fill="#2a0306"/>
  <path d="M13.4 8.6h1.6c1.4 0 2 .8 2 2s-.6 2-2 2h-1.6zM15 8.6h1.6c1.4 0 2 .8 2 2s-.6 2-2 2H15z" fill="none" stroke="#2a0306" stroke-width=".8"/>
  <path d="M11 21c1.5 4 3 7 5 7s3.5-3 5-7c-1.8.8-3.3 1.1-5 1.1s-3.2-.3-5-1.1z" fill="#e7b08c"/>`,
punisher:`
  <circle cx="16" cy="16" r="14" fill="#121212"/>
  <path d="M16 4.6c-5.5 0-9 3.5-9 8.5 0 3 1.3 5 3 6.3V23h12v-3.6c1.7-1.3 3-3.3 3-6.3 0-5-3.5-8.5-9-8.5z" fill="#f2f2f2"/>
  <path d="M10.5 12.3c1.5-.5 3.5 0 4 1.8.3 1.3-.6 2.4-2 2.4-1.6 0-2.6-1.4-2-4.2zM21.5 12.3c-1.5-.5-3.5 0-4 1.8-.3 1.3.6 2.4 2 2.4 1.6 0 2.6-1.4 2-4.2z" fill="#121212"/>
  <path d="M16 17l-1.1 2.2h2.2z" fill="#121212"/>
  <path d="M10 22.4h12v4.8c0 1-1 1.6-2 1.6h-8c-1 0-2-.6-2-1.6z" fill="#f2f2f2"/>
  <path d="M12 22.4v6.4M14 22.4v6.4M16 22.4v6.4M18 22.4v6.4M20 22.4v6.4" stroke="#121212" stroke-width=".8"/>`,
panther:`
  <path d="M8.2 9L7 2.4l5.2 3.4zM23.8 9L25 2.4l-5.2 3.4z" fill="#1b1b22"/>
  <path d="${HEAD}" fill="#1b1b22"/>
  <path d="M16 4v6M11 6.8l3 4.6M21 6.8l-3 4.6M8.6 19.5c2 1 3.6 1.4 5 1.4M23.4 19.5c-2 1-3.6 1.4-5 1.4" stroke="#b9c0cc" stroke-width=".8" fill="none"/>
  <path d="M9.5 14.5c2-.8 4-.5 5.5 1l-.4 1c-2 .2-4-.5-5.1-2zM22.5 14.5c-2-.8-4-.5-5.5 1l.4 1c2 .2 4-.5 5.1-2z" fill="#e8eef7"/>
  <path d="M10.4 26c2 2 3.8 2.8 5.6 2.8s3.6-.8 5.6-2.8" stroke="#8b5cf6" stroke-width="1.3" fill="none" stroke-linecap="round"/>`,
venom:`
  <path d="M16 3C8.5 3 4.5 9 4.5 15.5 4.5 23 9.5 29 16 29s11.5-6 11.5-13.5C27.5 9 23.5 3 16 3z" fill="#121318"/>
  <path d="M5.5 12c3-2.5 8.5-2 9.5 2.5.5 3-1.5 5-4 4.5-3.5-.7-5.5-3.5-5.5-7zM26.5 12c-3-2.5-8.5-2-9.5 2.5-.5 3 1.5 5 4 4.5 3.5-.7 5.5-3.5 5.5-7z" fill="#f5f5f5"/>
  <path d="M8 21c3 4.6 13 4.6 16 0-2 1-5 1.5-8 1.5S10 22 8 21z" fill="#f5f5f5"/>
  <path d="M8.6 21.6l1.4 2 1.5-1.3 1.4 2 1.5-1.5 1.6 2 1.6-2 1.5 1.5 1.4-2 1.5 1.3 1.4-2" stroke="#121318" stroke-width=".9" fill="none" stroke-linejoin="round"/>`,
strange:`
  <circle cx="16" cy="16" r="13.5" fill="#c9962b"/><circle cx="16" cy="16" r="10.6" fill="#3a2a10"/>
  <path d="M5.8 16c4.2-6.2 16.2-6.2 20.4 0-4.2 6.2-16.2 6.2-20.4 0z" fill="#e9c46a"/>
  <circle cx="16" cy="16" r="4.2" fill="#22c55e"/><circle cx="16" cy="16" r="1.7" fill="#063d1a"/>
  <path d="M16 2.5v3M16 26.5v3" stroke="#3a2a10" stroke-width="1.2"/>`,
cmarvel:`
  <circle cx="16" cy="16" r="14" fill="#1a2d6d"/><circle cx="16" cy="16" r="12.2" fill="none" stroke="#d61f2c" stroke-width="2"/>
  <path d="${STAR}" fill="#f3c623" transform="translate(16 16) scale(2.05) translate(-16 -16.2)"/>`,
wanda:`
  <path d="M3.6 23L6 8.6l5 6.2L16 3.6l5 11.2 5-6.2L28.4 23c-4 2.2-8.2 3.2-12.4 3.2S7.6 25.2 3.6 23z" fill="#c1121f"/>
  <path d="M6 8.6l5 6.2L16 3.6l5 11.2 5-6.2" fill="none" stroke="#ff5a67" stroke-width=".8"/>
  <path d="M8 21.4c5 1.6 11 1.6 16 0" stroke="#7a0b13" stroke-width="1.2" fill="none"/>
  <path d="M16 15.5l1.4 2.4-1.4 2.4-1.4-2.4z" fill="#ffb3ba"/>`,
loki:`
  <path d="M9.2 10.4C6 7.4 4.4 3.8 5 1.2c1.6 3 4.2 5.6 7.2 7.6zM22.8 10.4C26 7.4 27.6 3.8 27 1.2c-1.6 3-4.2 5.6-7.2 7.6z" fill="#d8a531" stroke="#8a6a12" stroke-width=".6"/>
  <path d="M8 14c0-5 3.5-8 8-8s8 3 8 8v10l-3 5H11l-3-5z" fill="#d8a531"/>
  <path d="M12 13.6h8v8.4c0 2.5-1.8 4.5-4 4.5s-4-2-4-4.5z" fill="#1d3b23"/>
  <path d="M13.4 16.6h2M16.6 16.6h2" stroke="#9cf5b0" stroke-width="1" stroke-linecap="round"/>
  <path d="M9 27l7 4 7-4" stroke="#2e7d32" stroke-width="2" fill="none"/>`,
};

const NOUNS={
  spider:['паук','паука','пауков'], iron:['шлем','шлема','шлемов'], shield:['щит','щита','щитов'],
  deadpool:['дэдпул','дэдпула','дэдпулов'], doom:['Дум','Дума','Думов'], xmen:['икс','икса','иксов'],
  ff:['четвёрка','четвёрки','четвёрок'], hulk:['халк','халка','халков'], wolverine:['коготь','когтя','когтей'],
  hammer:['молот','молота','молотов'], avengers:['мститель','мстителя','мстителей'],
  stones:['камень','камня','камней'], daredevil:['рожок','рожка','рожков'], punisher:['череп','черепа','черепов'],
  panther:['пантера','пантеры','пантер'], venom:['симбиот','симбиота','симбиотов'],
  strange:['глаз','глаза','глаз'], cmarvel:['звезда','звезды','звёзд'], wanda:['корона','короны','корон'],
  loki:['рог','рога','рогов'],
};

const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
svg.setAttribute('aria-hidden','true');
svg.style.cssText='position:absolute;width:0;height:0;overflow:hidden';
svg.innerHTML=Object.entries(S).map(([k,v])=>`<symbol id="i-${k}" viewBox="0 0 32 32">${v}</symbol>`).join('');
(document.body||document.documentElement).prepend(svg);

window.ICONS={
  has:k=>k in S,
  html(k,cls=''){
    return k in S
      ? `<svg class="ic ${cls}" viewBox="0 0 32 32" aria-hidden="true"><use href="#i-${k}"/></svg>`
      : `<span class="ic emo ${cls}" aria-hidden="true">${k}</span>`;
  },
  noun(k,n){
    const f=NOUNS[k]||['балл','балла','баллов'];
    const a=n%10,b=n%100;
    return f[(b>10&&b<20)?2:a===1?0:(a>=2&&a<=4)?1:2];
  },
};
})();
