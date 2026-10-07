/* ============================================================
   MUNIR PORTAL — robot bear flyover
   A little robot bear with a spinning rotor crosses the page:
   cruise in, loop-the-loop, hover and look around, then dash
   off. Every ~3 minutes.
   ============================================================ */
(function () {
    'use strict';

    var layer = document.getElementById('fairy-layer');
    if (!layer) return;

    /* Respect users who prefer reduced motion (matches style.css) */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    function part(cls) {
        var d = document.createElement('div');
        d.className = cls;
        return d;
    }

    function makeBear() {
        var bear = part('robo-bear');
        bear.appendChild(part('bear-rotor'));
        bear.appendChild(part('bear-mast'));
        bear.appendChild(part('bear-ear bear-ear-left'));
        bear.appendChild(part('bear-ear bear-ear-right'));
        bear.appendChild(part('bear-head'));
        bear.appendChild(part('bear-eye bear-eye-left'));
        bear.appendChild(part('bear-eye bear-eye-right'));
        bear.appendChild(part('bear-snout'));
        bear.appendChild(part('bear-antenna'));
        bear.appendChild(part('bear-arm bear-arm-left'));
        bear.appendChild(part('bear-arm bear-arm-right'));
        bear.appendChild(part('bear-body'));
        bear.appendChild(part('bear-chest'));
        bear.appendChild(part('bear-leg bear-leg-left'));
        bear.appendChild(part('bear-leg bear-leg-right'));
        layer.appendChild(bear);
        return bear;
    }

    function sparkle(x, y) {
        var s = document.createElement('div');
        s.className = 'robo-spark';
        s.style.left = x + 'px';
        s.style.top = y + 'px';
        layer.appendChild(s);
        var anim = s.animate(
            [
                { opacity: 1, transform: 'scale(1)' },
                { opacity: 0, transform: 'scale(0.2) translateY(12px)' }
            ],
            { duration: 900, easing: 'ease-out' }
        );
        anim.onfinish = function () { s.remove(); };
    }

    function fly() {
        var bear = makeBear();

        var W = window.innerWidth;
        var H = window.innerHeight;
        var baseY = H * 0.25 + Math.random() * H * 0.40;
        var midX = W * 0.45;
        var duration = 12000 + Math.random() * 4000; /* 12-16 seconds */

        /* fade in (CSS transition on .robo-bear handles the smoothing) */
        requestAnimationFrame(function () {
            bear.style.opacity = '1';
        });

        var t0 = performance.now();

        function frame(now) {
            var t = (now - t0) / duration;
            if (t >= 1) {
                /* fade out, then remove from the DOM */
                bear.style.opacity = '0';
                setTimeout(function () { bear.remove(); }, 1300);
                schedule();
                return;
            }

            var x, y, rot;

            if (t < 0.35) {
                /* phase 1 — cruise in from the left with a gentle bob */
                var p1 = t / 0.35;
                x = -70 + p1 * (midX + 70);
                y = baseY + Math.sin(p1 * Math.PI * 4) * 22;
                rot = 6;
            } else if (t < 0.55) {
                /* phase 2 — loop-the-loop */
                var p2 = (t - 0.35) / 0.20;
                var r = 52;
                var a = -Math.PI / 2 + p2 * Math.PI * 2;
                x = midX + p2 * 56 + Math.cos(a) * r;
                y = baseY + Math.sin(a) * r;
                rot = p2 * 360;
            } else if (t < 0.72) {
                /* phase 3 — hover in place, bobbing and looking around */
                var p3 = (t - 0.55) / 0.17;
                x = midX + 56 + Math.sin(p3 * Math.PI * 2) * 10;
                y = baseY + Math.sin(p3 * Math.PI * 6) * 13;
                rot = Math.sin(p3 * Math.PI * 4) * 10;
            } else {
                /* phase 4 — dash off to the right */
                var p4 = (t - 0.72) / 0.28;
                var eased = p4 * p4;
                x = midX + 56 + eased * (W * 0.55 + 130);
                y = baseY - eased * 70 + Math.sin(p4 * Math.PI * 3) * 10 * (1 - p4);
                rot = -12;
            }

            bear.style.transform =
                'translate(' + x + 'px,' + y + 'px) rotate(' + rot + 'deg)';
            if (Math.random() < 0.25) sparkle(x + 28, y + 62);
            requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }

    function schedule() {
        /* next bear in ~3 minutes */
        setTimeout(fly, 170000 + Math.random() * 20000);
    }

    /* first bear appears 2 seconds after page load */
    setTimeout(fly, 2000);
})();

/* Footer year (all pages) */
(function () {
    var y = document.getElementById('current-year');
    if (y) y.textContent = new Date().getFullYear();
})();

/* Mobile navigation toggle */
(function () {
    var btn = document.getElementById('mobile-menu-button');
    var nav = document.querySelector('.main-nav');
    if (!btn || !nav) return;

    btn.addEventListener('click', function () {
        var open = nav.classList.toggle('open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        btn.setAttribute(
            'aria-label',
            open ? 'Close navigation menu' : 'Open navigation menu'
        );
    });

    /* close the menu when a link is tapped */
    nav.addEventListener('click', function (e) {
        if (e.target && e.target.tagName === 'A') {
            nav.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
            btn.setAttribute('aria-label', 'Open navigation menu');
        }
    });
})();
