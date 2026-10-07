/* ============================================================
   MUNIR PORTAL — fairy animation
   Creates fairies that fly across the page with flapping
   wings and a sparkle trail, then fade out.
   ============================================================ */
(function () {
    'use strict';

    var layer = document.getElementById('fairy-layer');
    if (!layer) return;

    /* Respect users who prefer reduced motion (matches style.css) */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    function makeFairy() {
        var fairy = document.createElement('div');
        fairy.className = 'fairy';

        var wingL = document.createElement('div');
        wingL.className = 'fairy-wing fairy-wing-left';

        var wingR = document.createElement('div');
        wingR.className = 'fairy-wing fairy-wing-right';

        var body = document.createElement('div');
        body.className = 'fairy-body';

        fairy.appendChild(wingL);
        fairy.appendChild(wingR);
        fairy.appendChild(body);
        layer.appendChild(fairy);
        return fairy;
    }

    function sparkle(x, y) {
        var s = document.createElement('div');
        s.className = 'fairy-spark';
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
        var fairy = makeFairy();

        var startX = -60;
        var startY = 40 + Math.random() * window.innerHeight * 0.7;
        var endX = window.innerWidth + 60;
        var amplitude = 40 + Math.random() * 60;   /* sine wave height */
        var waves = 3 + Math.floor(Math.random() * 3);
        var duration = 9000 + Math.random() * 6000; /* 9–15 seconds */

        /* fade in (CSS transition on .fairy handles the smoothing) */
        requestAnimationFrame(function () {
            fairy.style.opacity = '1';
        });

        var t0 = performance.now();

        function frame(now) {
            var t = (now - t0) / duration;
            if (t >= 1) {
                /* fade out, then remove from the DOM */
                fairy.style.opacity = '0';
                setTimeout(function () { fairy.remove(); }, 1300);
                return;
            }
            var x = startX + (endX - startX) * t;
            var y = startY + Math.sin(t * Math.PI * waves) * amplitude;
            fairy.style.transform = 'translate(' + x + 'px,' + y + 'px)';
            if (Math.random() < 0.3) sparkle(x + 24, y + 24);
            requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);

        /* schedule the next fairy 6–14 seconds later */
        setTimeout(fly, 6000 + Math.random() * 8000);
    }

    /* first fairy appears 2 seconds after page load */
    setTimeout(fly, 2000);
})();

/* Footer year (all pages) */
(function () {
    var y = document.getElementById('current-year');
    if (y) y.textContent = new Date().getFullYear();
})();
