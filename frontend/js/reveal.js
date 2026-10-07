/* ============================================================
   MUNIR PORTAL — Scroll-reveal micro-interactions
   Cards fade/slide in as they enter the viewport.
   - Respects prefers-reduced-motion (does nothing then)
   - No-JS safe: hidden state only applies when JS adds .has-reveal
   ============================================================ */
(function () {
    'use strict';

    /* Inject the reveal styles (kept here so this is a single-file drop-in) */
    function injectStyles() {
        var css = [
            '.has-reveal .resume-card{opacity:0;transform:translateY(16px);',
            'transition:opacity .55s ease,transform .55s cubic-bezier(.2,.6,.3,1);',
            'will-change:opacity,transform}',
            '.has-reveal .resume-card.in-view{opacity:1;transform:none}'
        ].join('\n');
        var st = document.createElement('style');
        st.textContent = css;
        document.head.appendChild(st);
    }

    function init() {
        /* Reduced motion: leave everything visible, do nothing */
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        if (!('IntersectionObserver' in window)) {
            return; /* old browser: leave visible */
        }
        var IO = window.IntersectionObserver;
        injectStyles();
        document.documentElement.classList.add('has-reveal');

        var io = new IO(function (entries) {
            for (var i = 0; i < entries.length; i++) {
                var e = entries[i];
                if (e.isIntersecting) {
                    e.target.classList.add('in-view');
                    io.unobserve(e.target);
                }
            }
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

        var cards = document.querySelectorAll('.resume-card');
        for (var j = 0; j < cards.length; j++) {
            /* Skip cards already inside overlays/clones (slides mode clones) */
            if (cards[j].closest && cards[j].closest('#slides-overlay')) continue;
            io.observe(cards[j]);
        }

        if (typeof window !== 'undefined') {
            window.__reveal = { observed: cards.length };
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
