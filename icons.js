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
blade:`
  <path d="M8 9.4c2-3.2 5-4.8 8-4.8s6 1.6 8 4.8" fill="#2a1a12"/>
  <path d="${HEAD}" fill="#6b4630"/>
  <path d="M8.2 8.6c2.2-2.6 5-3.8 7.8-3.8s5.6 1.2 7.8 3.8c-2.4-.8-5-1.2-7.8-1.2s-5.4.4-7.8 1.2z" fill="#1d120b"/>
  <path d="M7.6 12.6h16.8v2.2c0 2-1.4 3.2-3.4 3.2h-2.4c-1.3 0-2-1-2.6-2.2-.6 1.2-1.3 2.2-2.6 2.2H11c-2 0-3.4-1.2-3.4-3.2z" fill="#0d0d0f"/>
  <path d="M9.2 13.6l2.6-.5M18.6 13.6l2.6-.5" stroke="#6f8496" stroke-width=".7" stroke-linecap="round"/>
  <path d="M12.4 22.4c1 2.6 2.3 4 3.6 4s2.6-1.4 3.6-4c-1.2.6-2.4.8-3.6.8s-2.4-.2-3.6-.8z" fill="#1a1110"/>
  <path d="M13.6 21.2h4.8" stroke="#3a2418" stroke-width=".9" stroke-linecap="round"/>`,
elektra:`
  <g transform="rotate(-32 16 16)">
    <path d="M14.9 2.5h2.2l.4 17.2h-3z" fill="#dfe4ea"/>
    <path d="M16 19.4c-2.8 0-4.2-1.6-4.2-4.4v-2.4M16 19.4c2.8 0 4.2-1.6 4.2-4.4v-2.4" stroke="#c3cad1" stroke-width="1.7" fill="none" stroke-linecap="round"/>
    <rect x="14.7" y="19.6" width="2.6" height="9" rx="1.1" fill="#b3121b"/>
    <path d="M14.7 22l2.6 1M14.7 24.4l2.6 1M14.7 26.8l2.6 1" stroke="#6e0b11" stroke-width=".6"/>
  </g>
  <g transform="rotate(32 16 16)">
    <path d="M14.9 2.5h2.2l.4 17.2h-3z" fill="#eef1f4"/>
    <path d="M16 19.4c-2.8 0-4.2-1.6-4.2-4.4v-2.4M16 19.4c2.8 0 4.2-1.6 4.2-4.4v-2.4" stroke="#d3d9df" stroke-width="1.7" fill="none" stroke-linecap="round"/>
    <rect x="14.7" y="19.6" width="2.6" height="9" rx="1.1" fill="#c81d25"/>
    <path d="M14.7 22l2.6 1M14.7 24.4l2.6 1M14.7 26.8l2.6 1" stroke="#6e0b11" stroke-width=".6"/>
  </g>`,
eagle:`
  <circle cx="16" cy="16" r="13.6" fill="#14213d" stroke="#b9c0cc" stroke-width="1.4"/>
  <path d="M9.6 13.6c1.6-3.4 5.6-4.8 9-3.4l3.6 1.6-3.2.8c-.2 2.2-1.6 4-3.8 4.8l-1.2 4.8-1.6-4.2c-2.2-.6-3.4-2.2-2.8-4.4z" fill="#e8edf3"/>
  <circle cx="17.6" cy="12.4" r=".7" fill="#14213d"/>
  <path d="M6.8 17.6l5.4 1.4M7.6 20.6l5.2.4M9.6 23.6l4.6-1M25.2 17.6l-5.4 1.4M24.4 20.6l-5.2.4M22.4 23.6l-4.6-1" stroke="#e8edf3" stroke-width="1.4" stroke-linecap="round"/>`,
carter:`
  <path d="M3 21.2c0-1.8 5.8-3.2 13-3.2s13 1.4 13 3.2-5.8 3-13 3-13-1.2-13-3z" fill="#9c1622"/>
  <path d="M9 19.6c0-6 2.4-11 7-11s7 5 7 11c-2 .9-4.4 1.3-7 1.3s-5-.4-7-1.3z" fill="#c1121f"/>
  <path d="M13.2 9.8c1-.8 1.8-1.1 2.8-1.1s1.8.3 2.8 1.1c-.9 1-1.8 1.6-2.8 1.6s-1.9-.6-2.8-1.6z" fill="#8a0f18"/>
  <path d="M9.1 17.4c2 .9 4.3 1.4 6.9 1.4s4.9-.5 6.9-1.4v2.1c-2 .9-4.3 1.4-6.9 1.4s-4.9-.5-6.9-1.4z" fill="#1f3a93"/>
  <path d="M13 27.2c1.8-1.2 4.2-1.2 6 0-1 1.4-2 2-3 2s-2-.6-3-2z" fill="#d61f2c"/>`,
rocket:`
  <path d="M7 11.4L5.8 3.6l6.2 4.2zM25 11.4l1.2-7.8-6.2 4.2z" fill="#6f625a"/>
  <path d="M7.6 9.6l-.6-4 3.4 2.3zM24.4 9.6l.6-4-3.4 2.3z" fill="#d9a5a0"/>
  <path d="M16 6C10 6 6 10.5 6 16c0 6 4.5 11 10 11s10-5 10-11c0-5.5-4-10-10-10z" fill="#8c7d72"/>
  <path d="M16 6.4v6" stroke="#5c514a" stroke-width="1.6"/>
  <path d="M6.3 14c2.5-1.6 6-1.8 9.7.2 3.7-2 7.2-1.8 9.7-.2-.3 2.6-2.4 4.4-5 4.4-2 0-3.6-.8-4.7-2-1.1 1.2-2.7 2-4.7 2-2.6 0-4.7-1.8-5-4.4z" fill="#2b2420"/>
  <circle cx="11.3" cy="15.6" r="1.3" fill="#f2c14e"/><circle cx="20.7" cy="15.6" r="1.3" fill="#f2c14e"/>
  <path d="M11 21c1.2-2 3-3 5-3s3.8 1 5 3c-.6 2.8-2.6 4.6-5 4.6s-4.4-1.8-5-4.6z" fill="#e6ddd3"/>
  <ellipse cx="16" cy="20" rx="1.6" ry="1.1" fill="#1b1512"/>
  <path d="M14.4 23.2c1 .7 2.2.7 3.2 0" stroke="#5c514a" stroke-width=".8" fill="none" stroke-linecap="round"/>`,
antman:`
  <path d="M11 6.4L8 1.6M21 6.4l3-4.8" stroke="#9aa3ab" stroke-width="1.2" stroke-linecap="round"/>
  <circle cx="6.6" cy="17.5" r="2.2" fill="#7f8992"/><circle cx="25.4" cy="17.5" r="2.2" fill="#7f8992"/>
  <path d="M16 4C9.5 4 6 8.5 6 15c0 7 4.5 13 10 13s10-6 10-13c0-6.5-3.5-11-10-11z" fill="#b8bfc6"/>
  <path d="M16 4C9.5 4 6 8.5 6 15v3l4-1v-5c0-2.6 2.6-4.4 6-4.4s6 1.8 6 4.4v5l4 1v-3c0-6.5-3.5-11-10-11z" fill="#c81d25"/>
  <ellipse cx="12" cy="15.2" rx="2.9" ry="3.3" fill="#2a1a12"/><ellipse cx="20" cy="15.2" rx="2.9" ry="3.3" fill="#2a1a12"/>
  <ellipse cx="11.1" cy="14.1" rx="1" ry="1.2" fill="#ff8a3d" opacity=".85"/><ellipse cx="19.1" cy="14.1" rx="1" ry="1.2" fill="#ff8a3d" opacity=".85"/>
  <path d="M12 22.4h8l-1 3.6h-6z" fill="#5f676e"/>
  <path d="M13.6 22.8v2.8M16 22.8v3M18.4 22.8v2.8" stroke="#2f353a" stroke-width=".7"/>`,
jessica:`
  <path d="M7 9h18l-2 18.4c-.1 1-.9 1.6-2 1.6H11c-1.1 0-1.9-.6-2-1.6z" fill="rgba(210,230,240,.16)" stroke="#cfe2ec" stroke-width="1.2" stroke-linejoin="round"/>
  <path d="M8.3 16h15.4l-1.1 10.6c-.1.8-.7 1.2-1.6 1.2H11c-.9 0-1.5-.4-1.6-1.2z" fill="#c97c16"/>
  <path d="M8.3 16h15.4" stroke="#f5c24a" stroke-width="1"/>
  <rect x="10.8" y="12.6" width="5" height="5" rx="1" fill="rgba(235,248,255,.75)" transform="rotate(-12 13.3 15.1)"/>
  <rect x="16.6" y="13.4" width="4.6" height="4.6" rx="1" fill="rgba(235,248,255,.6)" transform="rotate(10 18.9 15.7)"/>
  <path d="M10.1 11.2l1.2 15" stroke="#fff" stroke-width=".8" opacity=".5"/>`,
cage:`
  <path d="M5 30.5c1-4.6 5-7.2 11-7.2s10 2.6 11 7.2z" fill="#f2c014"/>
  <path d="M12.6 23.6c1 1.4 2.2 2 3.4 2s2.4-.6 3.4-2" stroke="#b08a00" stroke-width="1" fill="none"/>
  <path d="M16 3.4c-5.3 0-8.6 4-8.6 9.6 0 7 3.8 12.4 8.6 12.4s8.6-5.4 8.6-12.4c0-5.6-3.3-9.6-8.6-9.6z" fill="#5a3a26"/>
  <path d="M7.6 10.6c2.6-1.4 5.4-2 8.4-2s5.8.6 8.4 2l-.4 2c-2.6-1.2-5.2-1.8-8-1.8s-5.4.6-8 1.8z" fill="#c9ced6"/>
  <path d="M16 7.4l1.7 2.3-1.7 2.3-1.7-2.3z" fill="#eef1f4"/>
  <path d="M10.8 15.6h3M18.2 15.6h3" stroke="#1d120b" stroke-width="1.3" stroke-linecap="round"/>
  <path d="M13.4 21.4c.8 1.4 1.7 2.1 2.6 2.1s1.8-.7 2.6-2.1" stroke="#1d120b" stroke-width="1.2" fill="none" stroke-linecap="round"/>`,
ironfist:`
  <circle cx="16" cy="17" r="14" fill="#f5c400" opacity=".14"/><circle cx="16" cy="17" r="10.5" fill="#f5c400" opacity=".2"/>
  <path d="M9 12.6c0-1.4 1-2.3 2.2-2.3s2 .7 2.1 1.6c.2-1 1-1.7 2.1-1.7s2 .7 2.1 1.7c.2-.9 1-1.6 2.1-1.6 1.2 0 2.2.9 2.2 2.3v6.6c0 4.4-3 7.6-7 7.6h-1.4C11.4 26.8 9 23.8 9 20.2z" fill="#ffd34d" stroke="#b07a00" stroke-width=".8"/>
  <path d="M9 16.6c0-1.2 1-2 2.4-2h3.4c1 0 1.6.6 1.6 1.4s-.6 1.4-1.6 1.4h-2.4" fill="none" stroke="#b07a00" stroke-width=".9"/>
  <path d="M13.3 11.8v3M17.5 11.7v3" stroke="#b07a00" stroke-width=".8"/>
  <path d="M12.4 21.6c1.5 1 3 1 4.2 0s2.6-1 3.8 0" stroke="#c0392b" stroke-width="1.1" fill="none" stroke-linecap="round"/>`,
inhumans:`
  <path d="M7.4 12.4l-3.2-3.6 1 5.2zM24.6 12.4l3.2-3.6-1 5.2z" fill="#1e2433"/>
  <path d="${HEAD}" fill="#1e2433"/>
  <path d="M16 13V3.2M12.4 3.4c0 3 1.6 5 3.6 5s3.6-2 3.6-5" stroke="#c9ced6" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  <path d="M9 13.6c2 .6 4.4 1 7 1s5-.4 7-1" stroke="#9aa3ab" stroke-width=".8" fill="none"/>
  <path d="M10.4 16l3.6.6v1l-3.6-.4zM21.6 16l-3.6.6v1l3.6-.4z" fill="#e8edf3"/>
  <path d="M11 21c1.5 4 3 7 5 7s3.5-3 5-7c-1.8.8-3.3 1.1-5 1.1s-3.2-.3-5-1.1z" fill="#d9a888"/>`,
runaways:`
  <path d="M4 20c0-6 4.5-11 11-11 5 0 8 2 10.5 5l2.5 3.2c.6.8.1 1.8-.9 1.8H19l-3 6H9c-3 0-5-2.2-5-5z" fill="#7b4fa0"/>
  <path d="M16 19h10.5c.8 0 1.2.8.7 1.4-1.6 2-3.8 3.6-6.6 4.4L16 26z" fill="#62407f"/>
  <path d="M18 19l.7 1.3.7-1.3.7 1.3.7-1.3.7 1.3.7-1.3.7 1.3.7-1.3" stroke="#fff" stroke-width=".7" fill="none" stroke-linejoin="round"/>
  <circle cx="17" cy="14" r="1.9" fill="#f2c14e"/><path d="M17 12.4v3.2" stroke="#1b1020" stroke-width=".8"/>
  <circle cx="9" cy="15" r="1.1" fill="#9a6fc4"/><circle cx="11.6" cy="11.8" r=".8" fill="#9a6fc4"/><circle cx="7.4" cy="19" r=".9" fill="#9a6fc4"/>
  <circle cx="25" cy="15.6" r=".5" fill="#2a1838"/>`,
cloak:`
  <circle cx="16" cy="16" r="14" fill="#0f1220" stroke="#3b4566" stroke-width="1"/>
  <path d="M16 2a14 14 0 0 1 0 28a7 7 0 0 1 0-14a7 7 0 0 0 0-14z" fill="#eef3ff"/>
  <path d="M16 6.2l.9 2 2.1.8-2.1.9-.9 2-.9-2-2.1-.9 2.1-.8z" fill="#eef3ff"/>
  <circle cx="16" cy="23" r="2" fill="#0f1220"/>`,
helstrom:`
  <path d="M16 9v21" stroke="#b3121b" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M9 4.6v4.6c0 3 3 5 7 5s7-2 7-5V4.6" stroke="#b3121b" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <path d="M16 3v10" stroke="#b3121b" stroke-width="2.2"/>
  <path d="M9 1.4l-2 3.6h4zM23 1.4l-2 3.6h4zM16 .2l-2 3.6h4z" fill="#e62429"/>
  <path d="M12.4 30c1-2.6 2.2-4 3.6-4s2.6 1.4 3.6 4" fill="#ff7a1a" opacity=".85"/>`,
widow:`
  <circle cx="16" cy="16" r="14" fill="#111317" stroke="#2c3036" stroke-width="1"/>
  <path d="M10 7.6h12l-4.6 8.4L22 24.4H10l4.6-8.4z" fill="#d61f2c"/>`,
rings:`
  <g fill="none" stroke-width="1.9">
    <ellipse cx="16" cy="8.6" rx="7.6" ry="2.5" stroke="#2f8fff"/>
    <ellipse cx="16" cy="12.8" rx="9" ry="2.8" stroke="#5ab0ff"/>
    <ellipse cx="16" cy="17" rx="9.6" ry="3" stroke="#2f8fff"/>
    <ellipse cx="16" cy="21.2" rx="9" ry="2.8" stroke="#5ab0ff"/>
    <ellipse cx="16" cy="25.4" rx="7.6" ry="2.5" stroke="#2f8fff"/>
  </g>
  <g fill="none" stroke="#dff0ff" stroke-width=".5" opacity=".9">
    <ellipse cx="16" cy="12.8" rx="9" ry="2.8"/><ellipse cx="16" cy="21.2" rx="9" ry="2.8"/>
  </g>`,
eternals:`
  <path d="M16 2v5M16 25v5M2 16h5M25 16h5M6.1 6.1l3.5 3.5M22.4 22.4l3.5 3.5M6.1 25.9l3.5-3.5M22.4 9.6l3.5-3.5" stroke="#f3c623" stroke-width="1.7" stroke-linecap="round"/>
  <path d="M10.6 3.1l1.1 2.8M21.4 28.9l-1.1-2.8M3.1 21.4l2.8-1.1M28.9 10.6l-2.8 1.1M3.1 10.6l2.8 1.1M28.9 21.4l-2.8-1.1M10.6 28.9l1.1-2.8M21.4 3.1l-1.1 2.8" stroke="#d4a017" stroke-width="1.1" stroke-linecap="round"/>
  <circle cx="16" cy="16" r="8.4" fill="none" stroke="#8a6a12" stroke-width=".8"/>
  <circle cx="16" cy="16" r="6.2" fill="#f3c623"/><circle cx="16" cy="16" r="3" fill="#fff3c0"/>`,
hawkeye:`
  <circle cx="14" cy="18" r="12.4" fill="#5b2a86"/><circle cx="14" cy="18" r="9" fill="#f2f2f2"/>
  <circle cx="14" cy="18" r="5.6" fill="#5b2a86"/><circle cx="14" cy="18" r="2.4" fill="#f2f2f2"/>
  <path d="M14 18L28.4 3.6" stroke="#1b1b1b" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M26.2 2.4l.8 3.4 3.4.8" stroke="#a66bff" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
moonknight:`
  <path d="M16 2C9 2 5 8 5 15c0 7 3 12 5 15h12c2-3 5-8 5-15 0-7-4-13-11-13z" fill="#e9edf2"/>
  <path d="M16 5c-5.4 0-8.4 4.6-8.4 10.4" stroke="#c3cad1" stroke-width=".8" fill="none"/>
  <path d="M16 9c-3.6 0-6 2.6-6 6.5 0 4.6 2.6 9 6 9s6-4.4 6-9C22 11.6 19.6 9 16 9z" fill="#14161b"/>
  <path d="M11.8 15l3 .6v.9l-3-.3zM20.2 15l-3 .6v.9l3-.3z" fill="#f5f7fa"/>
  <path d="M17.6 29.4a2.5 2.5 0 1 1 0-4.6 2 2 0 1 0 0 4.6z" fill="#7f8b98"/>`,
morbius:`
  <circle cx="16" cy="16" r="13.6" fill="#4a0b12"/>
  <circle cx="16" cy="16" r="10" fill="#7a1420" opacity=".7"/>
  <path d="M16 10c1.2 0 2 .8 2.4 1.8l1-2.6.6 3.2c3-1.6 6.6-1.8 10 .2-2.2.4-3.6 1.8-4 3.6-1.6-.8-3.4-.6-4.6.6-.8-1-2-1.4-3-1-.6 1.8-1.4 3.4-2.4 4.6-1-1.2-1.8-2.8-2.4-4.6-1-.4-2.2 0-3 1-1.2-1.2-3-1.4-4.6-.6-.4-1.8-1.8-3.2-4-3.6 3.4-2 7-1.8 10-.2l.6-3.2 1 2.6c.4-1 1.2-1.8 2.4-1.8z" fill="#120a0d"/>
  <circle cx="15.1" cy="12.7" r=".6" fill="#ff3b3b"/><circle cx="16.9" cy="12.7" r=".6" fill="#ff3b3b"/>`,
msmarvel:`
  <circle cx="16" cy="16" r="14" fill="#1b3a8a"/>
  <circle cx="16" cy="16" r="12" fill="none" stroke="#d61f2c" stroke-width="2"/>
  <path d="M18.6 4L9 18h6l-2.6 10L23 13h-6.2z" fill="#f3c623" stroke="#b07a00" stroke-width=".6" stroke-linejoin="round"/>`,
shehulk:`
  <path d="M16 2.5c-7 0-11 5-11 11.5 0 6 1 11 3 15h16c2-4 3-9 3-15 0-6.5-4-11.5-11-11.5z" fill="#1d1d24"/>
  <path d="M16 6c-5 0-8 3.6-8 9 0 6.4 3.6 12 8 12s8-5.6 8-12c0-5.4-3-9-8-9z" fill="#5bb04a"/>
  <path d="M8 13c1-4.6 4-7 8-7s7 2.4 8 7c-2.6-1.6-5.4-2.6-8-2.6S10.6 11.4 8 13z" fill="#1d1d24"/>
  <path d="M10.6 16.2c1-.8 2.4-.8 3.4 0M18 16.2c1-.8 2.4-.8 3.4 0" stroke="#173a0c" stroke-width="1.3" stroke-linecap="round" fill="none"/>
  <path d="M13.6 22.2c1.5.9 3.3.9 4.8 0-.6 1.3-1.4 1.9-2.4 1.9s-1.8-.6-2.4-1.9z" fill="#7a1f3d"/>`,
werewolf:`
  <circle cx="25.4" cy="6" r="4.2" fill="#e9e3c8"/>
  <path d="M7 13.4L5.8 2.8l7.4 5.2zM25 13.4l1.2-10.6-7.4 5.2z" fill="#4a4540"/>
  <path d="M7.8 10.8l-.5-5.2 3.6 2.7zM24.2 10.8l.5-5.2-3.6 2.7z" fill="#8a5a4a"/>
  <path d="M16 6c-6 0-10 4-10 9.6 0 3 1.4 5.4 3.4 7L16 29.4l6.6-6.8c2-1.6 3.4-4 3.4-7C26 10 22 6 16 6z" fill="#5d5650"/>
  <path d="M8 16.4l-2.4 2.4 3.6-.4zM24 16.4l2.4 2.4-3.6-.4z" fill="#5d5650"/>
  <path d="M11.6 19.2c1.2-1.6 2.7-2.4 4.4-2.4s3.2.8 4.4 2.4L16 27.6z" fill="#c9bfb2"/>
  <path d="M10 12.6l4.4 1.6M22 12.6l-4.4 1.6" stroke="#2e2a26" stroke-width="1.3" stroke-linecap="round"/>
  <path d="M9.8 14.6l4 1.1-1 1.4c-1.6-.2-2.6-1.1-3-2.5zM22.2 14.6l-4 1.1 1 1.4c1.6-.2 2.6-1.1 3-2.5z" fill="#ffd34d"/>
  <path d="M14.3 20.6h3.4L16 22.8z" fill="#1b1714"/>
  <path d="M14.6 24.2l.7 1.8.6-1.5M17.4 24.2l-.7 1.8-.6-1.5" fill="#fff"/>`,
skrull:`
  <path d="M7 14L2.4 9.8l1.3 6.6L7.4 18.2zM25 14l4.6-4.2-1.3 6.6-3.7 1.8z" fill="#3f8f3a"/>
  <path d="M16 4c-5.5 0-9 3.6-9 9.4 0 4 1.6 7.2 3.6 9.6.8 3.2 2.8 5 5.4 5s4.6-1.8 5.4-5c2-2.4 3.6-5.6 3.6-9.6C25 7.6 21.5 4 16 4z" fill="#4caf50"/>
  <path d="M9 12.4c2.2-1 4.6-1 7 .2 2.4-1.2 4.8-1.2 7-.2" stroke="#2e6b2b" stroke-width="1" fill="none"/>
  <path d="M9.6 14.4c1.6-.6 3.4-.4 4.8.6-1.4.9-3.4 1-4.8-.6zM22.4 14.4c-1.6-.6-3.4-.4-4.8.6 1.4.9 3.4 1 4.8-.6z" fill="#c8f560"/>
  <path d="M13.8 19.6h4.4" stroke="#1d4a1b" stroke-width="1" stroke-linecap="round"/>
  <path d="M11.6 21.6c1 1.2 2.6 2 4.4 2s3.4-.8 4.4-2M12.6 24.2c.9.9 2 1.4 3.4 1.4s2.5-.5 3.4-1.4" stroke="#2e6b2b" stroke-width=".9" fill="none"/>`,
echo:`
  <circle cx="16" cy="16" r="14" fill="#141414" stroke="#3a3a3a" stroke-width="1"/>
  <g fill="#f2f2f2">
    <rect x="11" y="14" width="10.2" height="11.4" rx="4.6"/>
    <rect x="11" y="6.6" width="2.4" height="10" rx="1.2"/><rect x="13.8" y="5" width="2.4" height="11" rx="1.2"/>
    <rect x="16.6" y="5.6" width="2.4" height="10.4" rx="1.2"/><rect x="19.2" y="7.6" width="2.2" height="9" rx="1.1"/>
    <rect x="6.6" y="14.6" width="2.4" height="8" rx="1.2" transform="rotate(-40 7.8 18.6)"/>
  </g>`,
thunderbolts:`
  <circle cx="16" cy="16" r="14" fill="#101215" stroke="#2c3036" stroke-width="1"/>
  <path d="M16 5v22M6.5 10.5l19 11M25.5 10.5l-19 11" stroke="#e8edf3" stroke-width="2.6" stroke-linecap="round"/>
  <path d="M17.6 8.6L12 17h3.7l-1.5 6.8L20.2 15h-3.7z" fill="#f3c623" stroke="#101215" stroke-width=".8" stroke-linejoin="round"/>`,
ironheart:`
  <path d="M16 28C9 23 4 18.6 4 12.6 4 8.8 6.8 6 10.4 6c2.4 0 4.4 1.2 5.6 3.2C17.2 7.2 19.2 6 21.6 6 25.2 6 28 8.8 28 12.6 28 18.6 23 23 16 28z" fill="#b3121b" stroke="#f2b62b" stroke-width="1.4"/>
  <circle cx="16" cy="15" r="4.6" fill="#c9ced6"/><circle cx="16" cy="15" r="3" fill="#bff6ff"/><circle cx="16" cy="15" r="1.2" fill="#fff"/>
  <path d="M16 10.4V12M16 18v1.6M11.4 15H13M19 15h1.6" stroke="#5f676e" stroke-width=".8"/>`,
wonderman:`
  <rect x="4" y="12" width="24" height="16" rx="1.6" fill="#1d1f24"/>
  <path d="M4 7.6l23-3.4.6 4L4.6 11.6z" fill="#e8edf3"/>
  <path d="M7.5 7.1l2.6 3.6M12.5 6.4l2.6 3.6M17.5 5.6l2.6 3.6M22.5 4.9l2.6 3.6" stroke="#1d1f24" stroke-width="1.6"/>
  <path d="M4 12h24v3H4z" fill="#e8edf3"/>
  <path d="M7 12l2.4 3M12 12l2.4 3M17 12l2.4 3M22 12l2.4 3" stroke="#1d1f24" stroke-width="1.6"/>
  <path d="M9.6 18l2.2 7 2.1-4.6L16 25l2.1-4.6L20.2 25l2.2-7" stroke="#b07cff" stroke-width="1.7" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`,
agatha:`
  <path d="M2.5 24c0-1.8 6-3.2 13.5-3.2S29.5 22.2 29.5 24s-6 3.2-13.5 3.2S2.5 25.8 2.5 24z" fill="#3b1d5c"/>
  <path d="M8.5 23.2C10 17 12 11 14 6.5c1-2.2 3-3.4 5.4-3.6-.9 1-1.2 2.4-.8 4L23.5 23c-2.2.7-4.8 1-7.5 1s-5.3-.3-7.5-.8z" fill="#5b2a86"/>
  <path d="M9.4 20c2 .6 4.2.9 6.6.9s4.6-.3 6.6-.9l.5 2.2c-2.2.6-4.6 1-7.1 1s-4.9-.4-7.1-1z" fill="#2a123f"/>
  <circle cx="16" cy="21.4" r="1.7" fill="#36e48c" stroke="#d8a531" stroke-width=".6"/>`,
vision:`
  <path d="${HEAD}" fill="#9b2335"/>
  <path d="M16 4v6M10.5 6.2c1.5 2 3.4 3.4 5.5 4M21.5 6.2c-1.5 2-3.4 3.4-5.5 4" stroke="#2e8b57" stroke-width="1.1" fill="none"/>
  <path d="M16 8.4l2.5 1.9-1 2.9h-3l-1-2.9z" fill="#f3c623" stroke="#b07a00" stroke-width=".5"/>
  <path d="M10.6 15.6c1.3-.6 2.6-.6 3.6.2M17.8 15.8c1-.8 2.3-.8 3.6-.2" stroke="#f3e3b0" stroke-width="1.1" stroke-linecap="round" fill="none"/>
  <path d="M10 18.5c.8 2.6 2 4.6 3.4 5.8M22 18.5c-.8 2.6-2 4.6-3.4 5.8" stroke="#6e1726" stroke-width=".8" fill="none"/>
  <path d="M14 22.4h4" stroke="#5a1220" stroke-width=".9" stroke-linecap="round"/>`,
crown:`
  <path d="M4 24L3 10l7 5.5L16 6l6 9.5 7-5.5-1 14z" fill="#e0aa1c" stroke="#9a6f07" stroke-width=".8" stroke-linejoin="round"/>
  <path d="M4.2 24h23.6v3.4H4.2z" fill="#c8930f"/>
  <circle cx="16" cy="19" r="1.9" fill="#d61f2c"/><circle cx="9.6" cy="20.4" r="1.2" fill="#2b59c3"/><circle cx="22.4" cy="20.4" r="1.2" fill="#2b59c3"/>
  <circle cx="3" cy="10" r="1.2" fill="#f3c623"/><circle cx="16" cy="6" r="1.3" fill="#f3c623"/><circle cx="29" cy="10" r="1.2" fill="#f3c623"/>`,
holiday:`
  <path d="M16 4l5 7h-2.6l4.6 6.5h-3l5 7.5H7l5-7.5H9l4.6-6.5H11z" fill="#1f7a3a"/>
  <rect x="14.2" y="25" width="3.6" height="4.4" fill="#6b4423"/>
  <path d="${STAR}" fill="#f3c623" transform="translate(16 4.2) scale(.9) translate(-16 -16)"/>
  <circle cx="13" cy="13.6" r="1.1" fill="#e62429"/><circle cx="18.6" cy="16.4" r="1.1" fill="#3f7bff"/><circle cx="12" cy="21" r="1.1" fill="#f3c623"/><circle cx="20.2" cy="22" r="1.1" fill="#e62429"/>
  <rect x="14.6" y="18.8" width="3.6" height="2.4" rx=".4" fill="#ff8a3d"/><circle cx="15.6" cy="20" r=".5" fill="#1d1f24"/><circle cx="17.2" cy="20" r=".5" fill="#1d1f24"/>`
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
  blade:['клинок','клинка','клинков'], elektra:['сай','сая','саев'], eagle:['орёл','орла','орлов'],
  carter:['шляпа','шляпы','шляп'], rocket:['енот','енота','енотов'], antman:['муравей','муравья','муравьёв'],
  jessica:['виски','виски','виски'], cage:['Кейдж','Кейджа','Кейджей'], ironfist:['кулак','кулака','кулаков'],
  inhumans:['камертон','камертона','камертонов'], runaways:['динозавр','динозавра','динозавров'],
  cloak:['плащ','плаща','плащей'], helstrom:['трезубец','трезубца','трезубцев'], widow:['вдова','вдовы','вдов'],
  rings:['кольцо','кольца','колец'], eternals:['целестиал','целестиала','целестиалов'], hawkeye:['мишень','мишени','мишеней'],
  moonknight:['луна','луны','лун'], morbius:['мышь','мыши','мышей'], msmarvel:['молния','молнии','молний'],
  shehulk:['адвокат','адвоката','адвокатов'], werewolf:['волк','волка','волков'], skrull:['скрулл','скрулла','скруллов'],
  echo:['ладонь','ладони','ладоней'], thunderbolts:['громовержец','громовержца','громовержцев'],
  ironheart:['сердце','сердца','сердец'], wonderman:['дубль','дубля','дублей'], agatha:['ведьма','ведьмы','ведьм'],
  vision:['синтезоид','синтезоида','синтезоидов'], crown:['король','короля','королей'], holiday:['ёлка','ёлки','ёлок'],
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
