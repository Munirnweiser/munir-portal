/* ============================================================
   MUNIR PORTAL — tutorial slides mode
   Adds a "Present slides" button to tutorial pages. Clicking it
   opens a full-screen overlay that walks through each
   .resume-card as a slide: title slide, one slide per card,
   then an end slide. Controls: Prev/Next buttons, click zones,
   keyboard Left/Right/Escape. Esc or the X button exits and
   restores the page. Works from file:// and http(s).
   Vanilla JS, no libraries, no eval().
   ============================================================ */
(function () {
    'use strict';

    var main = document.querySelector('main');
    if (!main) { return; }

    var cards = main.querySelectorAll('.resume-card');
    if (!cards || cards.length === 0) { return; }

    var reducedMotion = false;
    try {
        reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
        reducedMotion = false;
    }

    /* ---------- collect title / intro ---------- */
    var heading = main.querySelector('.section-heading');
    var titleText = document.title || 'Tutorial';
    var eyebrowText = '';
    var introText = '';
    if (heading) {
        var h2 = heading.querySelector('h2');
        if (h2) { titleText = h2.textContent.trim(); }
        var eyebrow = heading.querySelector('.eyebrow');
        if (eyebrow) { eyebrowText = eyebrow.textContent.trim(); }
        var ps = heading.querySelectorAll('p');
        for (var pi = 0; pi < ps.length; pi++) {
            if (!ps[pi].classList.contains('eyebrow')) {
                introText = ps[pi].textContent.trim();
                break;
            }
        }
    }

    /* ---------- injected stylesheet ---------- */
    var cssText = [
        '.mp-present-btn{position:fixed;bottom:24px;right:24px;z-index:150;box-shadow:0 8px 24px rgba(0,0,0,0.45);}',
        '.mp-overlay{position:fixed;inset:0;z-index:500;background:rgba(4,7,17,0.98);display:flex;flex-direction:column;color:#e8eef7;}',
        '.mp-topbar{display:flex;align-items:center;justify-content:space-between;padding:14px 22px;border-bottom:1px solid rgba(148,163,184,0.18);}',
        '.mp-counter{font-size:0.85rem;letter-spacing:0.12em;color:#94a3b8;}',
        '.mp-close{background:transparent;border:1px solid rgba(148,163,184,0.35);color:#e8eef7;border-radius:10px;width:40px;height:40px;font-size:1.1rem;cursor:pointer;line-height:1;}',
        '.mp-close:hover{border-color:#7dd3fc;color:#7dd3fc;}',
        '.mp-progress{height:3px;background:rgba(148,163,184,0.15);}',
        '.mp-progress-fill{height:100%;width:0%;background:linear-gradient(90deg,#7dd3fc,#a78bfa);transition:width 0.3s ease;}',
        '.mp-stage-wrap{position:relative;flex:1;display:flex;align-items:stretch;justify-content:center;overflow:hidden;padding:34px 90px;}',
        '.mp-stage{width:100%;max-width:860px;overflow-y:auto;display:flex;flex-direction:column;justify-content:center;}',
        '.mp-stage .resume-card{margin:0;width:100%;}',
        '.mp-fade{transition:opacity 0.25s ease;}',
        '.mp-zone{position:absolute;top:0;bottom:0;width:90px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:2rem;color:rgba(148,163,184,0.0);user-select:none;}',
        '.mp-zone:hover{color:rgba(125,211,252,0.7);background:rgba(125,211,252,0.05);}',
        '.mp-zone-prev{left:0;}',
        '.mp-zone-next{right:0;}',
        '.mp-controls{display:flex;align-items:center;justify-content:center;gap:16px;padding:18px;border-top:1px solid rgba(148,163,184,0.18);}',
        '.mp-controls button{background:rgba(125,211,252,0.1);border:1px solid rgba(125,211,252,0.35);color:#e8eef7;border-radius:10px;padding:10px 22px;font-size:0.95rem;cursor:pointer;}',
        '.mp-controls button:hover:not(:disabled){background:rgba(125,211,252,0.22);}',
        '.mp-controls button:disabled{opacity:0.35;cursor:default;}',
        '.mp-title-slide{text-align:center;padding:20px;}',
        '.mp-title-slide .mp-eyebrow{color:#7dd3fc;letter-spacing:0.18em;text-transform:uppercase;font-size:0.8rem;margin-bottom:14px;}',
        '.mp-title-slide h2{font-size:2.4rem;margin:0 0 16px;color:#f8fafc;}',
        '.mp-title-slide p{color:#b8c4d9;font-size:1.1rem;line-height:1.7;max-width:640px;margin:0 auto;}',
        '.mp-end-slide{text-align:center;padding:20px;}',
        '.mp-end-slide h2{font-size:2.2rem;margin:0 0 14px;color:#f8fafc;}',
        '.mp-end-slide p{color:#b8c4d9;margin-bottom:26px;}',
        '.mp-end-slide button{background:rgba(125,211,252,0.12);border:1px solid rgba(125,211,252,0.4);color:#e8eef7;border-radius:12px;padding:12px 28px;font-size:1rem;cursor:pointer;}',
        '.mp-end-slide button:hover{background:rgba(125,211,252,0.25);}',
        '@media (max-width:700px){.mp-stage-wrap{padding:20px 54px;}.mp-zone{width:54px;}.mp-title-slide h2{font-size:1.7rem;}.mp-present-btn{bottom:16px;right:16px;}}'
    ].join('\n');

    if (reducedMotion) {
        cssText += '\n.mp-fade{transition:none;}\n.mp-progress-fill{transition:none;}';
    }

    function injectCss() {
        var style = document.createElement('style');
        style.setAttribute('data-mp-slides', 'true');
        style.textContent = cssText;
        document.head.appendChild(style);
        return style;
    }

    /* ---------- slide model ---------- */
    var total = cards.length + 2; /* title + cards + end */
    var current = 0;
    var overlay = null;
    var stage = null;
    var counterEl = null;
    var fillEl = null;
    var prevBtn = null;
    var nextBtn = null;
    var presentBtn = null;
    var styleEl = null;
    var savedOverflow = '';

    function el(tag, cls, text) {
        var d = document.createElement(tag);
        if (cls) { d.className = cls; }
        if (typeof text === 'string') { d.textContent = text; }
        return d;
    }

    function cloneCard(i) {
        var clone = cards[i].cloneNode(true);
        var withIds = clone.querySelectorAll('[id]');
        Array.prototype.forEach.call(withIds, function (n) {
            n.removeAttribute('id');
        });
        if (clone.hasAttribute('id')) { clone.removeAttribute('id'); }
        return clone;
    }

    function renderTitle() {
        var wrap = el('div', 'mp-title-slide');
        if (eyebrowText) { wrap.appendChild(el('div', 'mp-eyebrow', eyebrowText)); }
        wrap.appendChild(el('h2', null, titleText));
        if (introText) { wrap.appendChild(el('p', null, introText)); }
        return wrap;
    }

    function renderEnd() {
        var wrap = el('div', 'mp-end-slide');
        wrap.appendChild(el('h2', null, 'Questions?'));
        wrap.appendChild(el('p', null, 'That concludes "' + titleText + '".'));
        var back = el('button', null, '\u2190 Back to tutorial');
        back.setAttribute('type', 'button');
        back.addEventListener('click', exit);
        wrap.appendChild(back);
        return wrap;
    }

    function render() {
        stage.innerHTML = '';
        var node;
        if (current === 0) {
            node = renderTitle();
        } else if (current === total - 1) {
            node = renderEnd();
        } else {
            node = cloneCard(current - 1);
        }
        if (!reducedMotion) {
            node.classList.add('mp-fade');
            node.style.opacity = '0';
        }
        stage.appendChild(node);
        if (!reducedMotion) {
            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    node.style.opacity = '1';
                });
            });
        }
        counterEl.textContent = (current + 1) + ' / ' + total;
        fillEl.style.width = ((current + 1) / total * 100) + '%';
        prevBtn.disabled = (current === 0);
        nextBtn.disabled = (current === total - 1);
        stage.scrollTop = 0;
    }

    function go(i) {
        var next = Math.max(0, Math.min(total - 1, i));
        if (next === current) { return; }
        current = next;
        render();
    }

    function onKey(e) {
        if (e.key === 'Escape') { exit(); }
        else if (e.key === 'ArrowRight') { go(current + 1); }
        else if (e.key === 'ArrowLeft') { go(current - 1); }
    }

    function enter() {
        if (overlay) { return; }
        styleEl = injectCss();

        overlay = el('div', 'mp-overlay');
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Presentation: ' + titleText);

        var topbar = el('div', 'mp-topbar');
        counterEl = el('span', 'mp-counter', '1 / ' + total);
        var close = el('button', 'mp-close', '\u2715');
        close.setAttribute('type', 'button');
        close.setAttribute('aria-label', 'Exit presentation');
        close.addEventListener('click', exit);
        topbar.appendChild(counterEl);
        topbar.appendChild(close);

        var progress = el('div', 'mp-progress');
        fillEl = el('div', 'mp-progress-fill');
        progress.appendChild(fillEl);

        var wrap = el('div', 'mp-stage-wrap');
        var zonePrev = el('div', 'mp-zone mp-zone-prev', '\u2039');
        zonePrev.setAttribute('aria-hidden', 'true');
        zonePrev.addEventListener('click', function () { go(current - 1); });
        var zoneNext = el('div', 'mp-zone mp-zone-next', '\u203a');
        zoneNext.setAttribute('aria-hidden', 'true');
        zoneNext.addEventListener('click', function () { go(current + 1); });
        stage = el('div', 'mp-stage');
        wrap.appendChild(zonePrev);
        wrap.appendChild(stage);
        wrap.appendChild(zoneNext);

        var controls = el('div', 'mp-controls');
        prevBtn = el('button', null, '\u2190 Prev');
        prevBtn.setAttribute('type', 'button');
        prevBtn.addEventListener('click', function () { go(current - 1); });
        nextBtn = el('button', null, 'Next \u2192');
        nextBtn.setAttribute('type', 'button');
        nextBtn.addEventListener('click', function () { go(current + 1); });
        controls.appendChild(prevBtn);
        controls.appendChild(nextBtn);

        overlay.appendChild(topbar);
        overlay.appendChild(progress);
        overlay.appendChild(wrap);
        overlay.appendChild(controls);
        document.body.appendChild(overlay);

        savedOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', onKey);
        if (presentBtn) { presentBtn.style.display = 'none'; }

        current = 0;
        render();
        close.focus();
    }

    function exit() {
        if (!overlay) { return; }
        document.removeEventListener('keydown', onKey);
        document.body.style.overflow = savedOverflow;
        if (overlay.parentNode) { overlay.parentNode.removeChild(overlay); }
        overlay = null;
        stage = null;
        if (styleEl && styleEl.parentNode) { styleEl.parentNode.removeChild(styleEl); }
        styleEl = null;
        if (presentBtn) { presentBtn.style.display = ''; }
        if (presentBtn) { presentBtn.focus(); }
    }

    /* ---------- inject the Present button ---------- */
    presentBtn = el('button', 'btn mp-present-btn', '\u25B6 Present slides');
    presentBtn.setAttribute('type', 'button');
    presentBtn.addEventListener('click', enter);
    document.body.appendChild(presentBtn);

    /* expose a tiny API for testing */
    window.__mpSlides = {
        cardCount: cards.length,
        total: total,
        enter: enter,
        exit: exit,
        go: go,
        current: function () { return current; },
        isOpen: function () { return !!overlay; }
    };
})();
