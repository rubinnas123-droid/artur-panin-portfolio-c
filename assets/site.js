// Общее для всех вариантов: язык (pl / en) и набор шрифтов (?f=), словарь интерфейса, перенос параметров по ссылкам.
// Подключается сразу после data.js и до кода страницы. Язык и шрифт живут в адресе: ?lang=en&f=b2.
(function () {
  const q = new URLSearchParams(location.search);
  const lang = q.get('lang') === 'en' ? 'en' : 'pl';
  const FONTSETS = {
    a: [['a0', 'Hanken Grotesk'], ['a1', 'Inter Tight'], ['a2', 'Geist'], ['a3', 'Host Grotesk']],
    b: [['b0', 'Instrument Serif + IBM Plex Mono'], ['b1', 'Newsreader + Geist Mono'], ['b2', 'Bodoni Moda + Jost'], ['b3', 'Cormorant Garamond + DM Mono'], ['b4', 'Fraunces + Geist Mono']],
    c: [['c3', 'Barlow + Barlow Condensed']]
  };
  const variant = document.documentElement.dataset.variant || '';
  const sets = FONTSETS[variant] || [];
  // Выбор владельца 12.11.2026: A — Inter Tight, B — Bodoni Moda + Jost, C — Barlow Condensed. Остальные наборы доступны через ?f=.
  const CHOSEN = { a: 'a1', b: 'b2', c: 'c3' };
  const f = sets.some(s => s[0] === q.get('f')) ? q.get('f') : (CHOSEN[variant] || (sets[0] || [''])[0]);
  document.documentElement.lang = lang;
  if (f) document.documentElement.dataset.f = f;

  const D = {
    works: ['Prace', 'Works'], showBase: ['Pokaż bazę 3D', 'Show 3D base'], showAI: ['Pokaż efekt AI', 'Show AI result'],
    scroll: ['Przewiń, aby zobaczyć', 'Scroll to explore'], prevFrames: ['Poprzednie kadry', 'Previous frames'], nextFrames: ['Następne kadry', 'Next frames'],
    skipWorks: ['Przejdź do prac', 'Skip to works'], skipMain: ['Przejdź do treści', 'Skip to content'], skipFrames: ['Przejdź do kadrów', 'Skip to frames'], skipIndex: ['Przejdź do indeksu', 'Skip to index'],
    allWorks: ['Wszystkie prace', 'All works'], projects: ['Projekty', 'Projects'], project: ['Projekt', 'Project'], frames: ['Kadry', 'Frames'], frame: ['Kadr', 'Frame'],
    stages: ['Etapy', 'Stages'], stagesVal: ['Baza 3D → postprodukcja AI', '3D base → AI post-production'],
    base: ['Baza 3D', '3D base'], baseShort: ['Baza', 'Base'], ai: ['Postprodukcja AI', 'AI post-production'], aiShort: ['Efekt AI', 'AI result'], compare: ['Porównaj', 'Compare'],
    dragHint: ['Przeciągnij po kadrze, aby odsłonić bazę 3D', 'Drag across the image to reveal the 3D base'], dragShort: ['Przeciągnij po kadrze', 'Drag across the image'],
    nextProject: ['Następny projekt', 'Next project'], twoFrames: ['2 kadry · przed / po', '2 frames · before / after'], scrollShort: ['(Przewiń)', '(Scroll)'],
    introA: ['Od modelu do obrazu. Model 3D i ten sam kadr po postprodukcji AI.', 'From model to image. The 3D model and the same frame after AI post-production.'],
    motto: ['Od modelu do obrazu.', 'From model to image.'], mottoBr: ['Od modelu<br>do obrazu.', 'From model<br>to image.'],
    index: ['Indeks prac', 'Index of works'], count: ['03 projekty / 06 kadrów', '03 projects / 06 frames'], ledeSub: ['Baza 3D i ten sam kadr po postprodukcji AI', 'The 3D base and the same frame after AI post-production'],
    no: ['Nr', 'No.'], beforeAfter: ['Przed / Po', 'Before / After'], pairs: ['02 pary', '02 pairs'], plates: ['Plansze', 'Plates'],
    platesSub: ['Każda plansza: po lewej baza 3D, po prawej postprodukcja AI', 'Each plate: the 3D base on the left, AI post-production on the right'],
    plate: ['Pl.', 'Pl.'], toTop: ['Do góry ↑', 'Back to top ↑'], hoverBase: ['najedź: baza 3D', 'hover: 3D base'], backIndex: ['← Indeks prac', '← Index of works'],
    of: ['z', 'of'], hold: ['Przytrzymaj kadr, aby zobaczyć bazę 3D', 'Press and hold the image to see the 3D base'],
    introC: ['Od modelu do obrazu. Każdy kadr pokazany dwa razy: baza 3D i postprodukcja AI.', 'From model to image. Every frame is shown twice: the 3D base and the AI post-production.'],
    hoverHint: ['Najedź na kadr, aby zobaczyć bazę 3D', 'Hover over a frame to see the 3D base'], replay: ['↺ Baza 3D', '↺ 3D base'],
    cmpLabel: ['Porównanie: przesuń, aby odsłonić bazę 3D', 'Comparison: slide to reveal the 3D base'], frameView: ['Widok kadru', 'Frame view'],
    home: ['strona główna', 'home page'], langLabel: ['Język', 'Language']
  };
  const i = lang === 'en' ? 1 : 0;
  const T = k => (D[k] || [k, k])[i];
  const L = v => (v && typeof v === 'object') ? (v[lang] || v.pl) : v;

  // Внутренние ссылки несут язык и шрифт дальше.
  function withParams(href, extra = {}) {
    if (!href || /^(https?:|mailto:|tel:|#)/.test(href)) return href;
    const u = new URL(href, location.href);
    if (u.origin !== location.origin) return href;
    const p = u.searchParams;
    if (!p.has('lang') && lang !== 'pl') p.set('lang', lang);
    if (!p.has('f') && q.has('f')) p.set('f', f);
    if (!p.has('fonts') && q.has('fonts')) p.set('fonts', '1');
    for (const [k, v] of Object.entries(extra)) v === null ? p.delete(k) : p.set(k, v);
    const s = p.toString();
    return u.pathname.split('/').pop() + (s ? '?' + s : '') + u.hash;
  }
  function fixLinks(root = document) {
    root.querySelectorAll('a[href]').forEach(a => { if (!a.dataset.fixed) { a.setAttribute('href', withParams(a.getAttribute('href'))); a.dataset.fixed = 1; } });
  }
  function apply(root = document) {
    root.querySelectorAll('[data-t]').forEach(e => { e.innerHTML = T(e.dataset.t); });
    root.querySelectorAll('[data-t-aria]').forEach(e => e.setAttribute('aria-label', T(e.dataset.tAria)));
    root.querySelectorAll('[data-lang-switch]').forEach(e => {
      e.setAttribute('aria-label', T('langLabel'));
      e.innerHTML = ['pl', 'en'].map(l => `<a href="${withParams(location.pathname.split('/').pop() + location.search, { lang: l === 'pl' ? null : 'en' })}${location.hash}" hreflang="${l}" lang="${l}"${l === lang ? ' aria-current="true"' : ''} data-fixed="1">${l.toUpperCase()}</a>`).join('<span aria-hidden="true">/</span>');
    });
    fixLinks(root);
  }
  // Панель шрифтов: видна, только когда в адресе есть ?fonts=1. Клавиши 1–5 переключают набор.
  function fontPanel() {
    if (!q.has('fonts') || !sets.length) return;
    const bar = document.createElement('div');
    bar.className = 'fontbar';
    bar.innerHTML = `<style>.fontbar{position:fixed;left:12px;bottom:12px;z-index:99;display:flex;flex-wrap:wrap;gap:4px;align-items:center;max-width:calc(100vw - 24px);padding:6px;background:#111d;color:#fff;font:500 12px/1.2 system-ui,sans-serif;border-radius:8px;backdrop-filter:blur(6px)}.fontbar a{color:#fff;text-decoration:none;padding:7px 9px;border-radius:5px;white-space:nowrap}.fontbar a[aria-current]{background:#fff;color:#111}.fontbar b{padding:0 6px;font-weight:600}</style><b>Шрифт</b>` +
      sets.map(([id, name], n) => `<a href="${withParams(location.pathname.split('/').pop() + location.search, { f: id })}${location.hash}" data-fixed="1"${id === f ? ' aria-current="true"' : ''} title="${name}">${n + 1}. ${name}</a>`).join('');
    document.body.append(bar);
    addEventListener('keydown', e => { const n = Number(e.key); if (n >= 1 && n <= sets.length && !e.target.closest('input,textarea')) location.href = bar.querySelectorAll('a')[n - 1].href; });
  }
  window.Site = { lang, f, T, L, withParams, fixLinks, apply, FONTSETS, ready: () => { apply(); fontPanel(); } };
})();
