// Сравнение «база 3D / постобработка AI» для всех трёх вариантов.
// Разметка: <div class="cmp" style="--cut:0"> <img class="cmp-after"> <img class="cmp-before"> <i class="cmp-line"></i>
//            <input class="cmp-range" type="range"> </div>
// --cut — сколько процентов кадра слева показывает базу 3D. 0 = готовая работа целиком, 100 = база целиком.
// Кнопки с data-cmp-set="0|50|100" внутри общего предка [data-cmp-scope] двигают шторку с анимацией.
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function set(cmp, v) {
    v = Math.max(0, Math.min(100, v));
    cmp.style.setProperty('--cut', v + '%');
    cmp.dataset.cut = v;
    const r = cmp.querySelector('.cmp-range');
    if (r) { r.value = v; r.setAttribute('aria-valuetext', Math.round(v) + '% ' + Site.T('base')); }
    const scope = cmp.closest('[data-cmp-scope]');
    if (scope) scope.querySelectorAll('[data-cmp-set]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.cmpSet) === Math.round(v))));
  }
  function animate(cmp, to) {
    const from = Number(cmp.dataset.cut || 0);
    if (reduce) return set(cmp, to);
    cancelAnimationFrame(cmp._raf);
    const t0 = performance.now(), d = 700;
    const step = t => { const k = Math.min(1, (t - t0) / d), e = 1 - Math.pow(1 - k, 3); set(cmp, from + (to - from) * e); if (k < 1) cmp._raf = requestAnimationFrame(step); };
    cmp._raf = requestAnimationFrame(step);
  }
  function mount(cmp) {
    if (cmp._mounted) return; cmp._mounted = true;
    set(cmp, Number(cmp.dataset.start || 0));
    let drag = false;
    const at = e => { const b = cmp.getBoundingClientRect(); set(cmp, (e.clientX - b.left) / b.width * 100); };
    cmp.addEventListener('pointerdown', e => { if (e.button !== 0) return; cancelAnimationFrame(cmp._raf); drag = true; cmp.setPointerCapture(e.pointerId); at(e); });
    cmp.addEventListener('pointermove', e => { if (drag) at(e); });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(n => cmp.addEventListener(n, () => { drag = false; }));
    const r = cmp.querySelector('.cmp-range');
    if (r) r.addEventListener('input', () => { cancelAnimationFrame(cmp._raf); set(cmp, Number(r.value)); });
    const scope = cmp.closest('[data-cmp-scope]');
    if (scope) scope.querySelectorAll('[data-cmp-set]').forEach(b => b.addEventListener('click', () => animate(cmp, Number(b.dataset.cmpSet))));
  }
  window.Compare = { mount, set, animate, mountAll: (root = document) => root.querySelectorAll('.cmp').forEach(mount) };
  window.Compare.html = (f, opts = {}) => {
    const t = Site.L(f.title);
    return `
    <div class="cmp" data-start="${opts.start ?? 0}">
      <img class="cmp-after" src="${ARTUR.src(f.img, 'after')}" alt="${t} — ${Site.T('ai')}" loading="${opts.eager ? 'eager' : 'lazy'}" decoding="async">
      <img class="cmp-before" src="${ARTUR.src(f.img, 'before')}" alt="${t} — ${Site.T('base')}" loading="${opts.eager ? 'eager' : 'lazy'}" decoding="async">
      <i class="cmp-line" aria-hidden="true"></i>
      <input class="cmp-range" type="range" min="0" max="100" step="0.5" value="0" aria-label="${Site.T('cmpLabel')}">
    </div>`;
  };
})();
