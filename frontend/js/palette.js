/* ============================================================
   MUNIR PORTAL — Command palette (Cmd+K / Ctrl+K)
   Fuzzy-search every page. Plus the Konami easter egg.
   Vanilla JS, no dependencies.
   ============================================================ */
(function () {
    'use strict';

    /* ---------- page index (root-relative URLs) ---------- */
    var PAGES = [
        /* home */
        { t: 'Home — Munir Nweiser', u: 'index.html', k: 'portfolio about hire contact', s: 'Home' },
        { t: 'Resume', u: 'resume.html', k: 'cv experience capital markets production support', s: 'Home' },
        /* calculators */
        { t: 'CFA Calculators', u: 'calculators.html', k: 'finance hub all calculators', s: 'Calculators' },
        { t: 'Scientific Calculator', u: 'scientific-calculator.html', k: 'math trig log parser', s: 'Calculators' },
        { t: 'Time Value of Money', u: 'calculators/tvm.html', k: 'pv fv pmt rate nper compounding', s: 'Calculators' },
        { t: 'NPV & IRR', u: 'calculators/npv-irr.html', k: 'discounted cash flow capital budgeting', s: 'Calculators' },
        { t: 'Bond Price & YTM', u: 'calculators/bonds.html', k: 'coupon yield maturity fixed income', s: 'Calculators' },
        { t: 'Duration & Convexity', u: 'calculators/duration-convexity.html', k: 'macaulay modified interest rate risk bonds', s: 'Calculators' },
        { t: 'CAPM', u: 'calculators/capm.html', k: 'beta expected return sml equity', s: 'Calculators' },
        { t: 'WACC', u: 'calculators/wacc.html', k: 'cost of capital debt equity valuation', s: 'Calculators' },
        { t: 'Portfolio Risk & Return', u: 'calculators/portfolio.html', k: 'two asset diversification correlation', s: 'Calculators' },
        { t: 'Sharpe Ratio', u: 'calculators/sharpe.html', k: 'risk adjusted return volatility', s: 'Calculators' },
        { t: 'FX Forwards', u: 'calculators/fx-forwards.html', k: 'forward points swap currency hedging', s: 'Calculators' },
        { t: 'Option Payoffs', u: 'calculators/options.html', k: 'call put strike payoff chart derivatives', s: 'Calculators' },
        { t: 'Statistics Calculator', u: 'calculators/statistics.html', k: 'mean median mode stddev variance histogram', s: 'Calculators' },
        { t: 'Canada Salary Calculator', u: 'calculators/salary-ca.html', k: 'gross net tax ontario quebec pay', s: 'Calculators' },
        /* tutorials */
        { t: 'Learning Tracks', u: 'tutorials/index.html', k: 'courses paths guide start here', s: 'Tutorials' },
        { t: 'FX Essentials', u: 'tutorials/fx.html', k: 'forex currency pairs pips spot', s: 'Tutorials' },
        { t: 'Fixed Income Essentials', u: 'tutorials/fixed-income.html', k: 'bonds coupons yield curve', s: 'Tutorials' },
        { t: 'Futures & Options', u: 'tutorials/futures-options.html', k: 'derivatives margin clearing', s: 'Tutorials' },
        { t: 'Trade Lifecycle Walkthrough', u: 'tutorials/trade-lifecycle.html', k: 'execution clearing settlement t+1 affirmation', s: 'Tutorials' },
        { t: 'Straight-Through Processing', u: 'tutorials/stp.html', k: 'automation breaks exception', s: 'Tutorials' },
        { t: 'Valuation Methods', u: 'tutorials/valuation.html', k: 'pricing models dcf multiples', s: 'Tutorials' },
        { t: 'Risk Measures: VaR & Stress', u: 'tutorials/risk-measures.html', k: 'value at risk expected shortfall svar', s: 'Tutorials' },
        { t: 'Risk Measures', u: 'tutorials/risk.html', k: 'var limits greeks market risk', s: 'Tutorials' },
        { t: 'Multi-Asset Instruments', u: 'tutorials/multi-asset-instruments.html', k: 'equities rates credit fx commodities', s: 'Tutorials' },
        { t: 'FIX Protocol Deep Dive', u: 'tutorials/fix-protocol.html', k: 'fix 4.4 tags session newordersingle executionreport', s: 'Tutorials' },
        { t: 'Frontend / Backend / Middleware', u: 'tutorials/frontend-backend-middleware.html', k: 'architecture mq tiers integration', s: 'Tutorials' },
        { t: 'SQL for Production Support', u: 'tutorials/databases-sql.html', k: 'query select join oracle', s: 'Tutorials' },
        { t: 'Oracle for Production Support', u: 'tutorials/databases-oracle.html', k: 'plsql v$ dba tablespace', s: 'Tutorials' },
        { t: 'SQL Server for Production Support', u: 'tutorials/databases-sqlserver.html', k: 'tsql ssms agent jobs', s: 'Tutorials' },
        { t: 'Docker for Production Support', u: 'tutorials/docker.html', k: 'containers images dockerfile', s: 'Tutorials' },
        { t: 'Kubernetes for Production Support', u: 'tutorials/kubernetes.html', k: 'k8s pods deployments helm', s: 'Tutorials' },
        { t: 'Jenkins', u: 'tutorials/jenkins.html', k: 'ci cd pipeline groovy agents', s: 'Tutorials' },
        { t: 'Git Essentials', u: 'tutorials/git-essentials.html', k: 'version control branch merge rebase', s: 'Tutorials' },
        { t: 'Terraform', u: 'tutorials/terraform.html', k: 'iac infrastructure plan apply state', s: 'Tutorials' },
        { t: 'Ansible', u: 'tutorials/ansible.html', k: 'playbook automation yaml inventory', s: 'Tutorials' },
        { t: 'YAML & Dockerfiles', u: 'tutorials/yaml-dockerfiles.html', k: 'syntax config lint', s: 'Tutorials' },
        { t: 'VPN', u: 'tutorials/vpn.html', k: 'tunnel ipsec network security', s: 'Tutorials' },
        { t: 'Building AI Agents', u: 'tutorials/ai-agents.html', k: 'llm react tools autonomy', s: 'Tutorials' },
        /* apps */
        { t: 'Trading App', u: 'apps/trading-app.html', k: 'workstation orders blotter portfolio lifecycle', s: 'Apps' },
        { t: 'X-One Terminal (Simulation)', u: 'apps/x-one-simulator.html', k: 'socgen markets terminal risk var', s: 'Apps' },
        { t: 'Trading Simulator', u: 'apps/trading-simulator.html', k: 'practice game pnl', s: 'Apps' },
        { t: 'Markets Quiz', u: 'apps/quiz.html', k: 'trivia test knowledge challenge', s: 'Apps' },
        { t: 'FIX Tag Match', u: 'apps/fix-match.html', k: 'memory game tags', s: 'Apps' },
        { t: 'FIX Message Builder', u: 'apps/fix-builder.html', k: 'newordersingle checksum decode soh', s: 'Apps' },
        { t: 'Incident Commander', u: 'apps/incident-commander.html', k: 'sev1 triage game oncall', s: 'Apps' },
        { t: 'kill -9', u: 'apps/kill-nine.html', k: 'game process unix signal', s: 'Apps' },
        { t: 'Latency Racer', u: 'apps/latency-racer.html', k: 'game speed network microseconds', s: 'Apps' },
        { t: 'Pipeline Panic', u: 'apps/pipeline-panic.html', k: 'game cicd deploy jenkins', s: 'Apps' },
        { t: 'Log Hunter', u: 'apps/log-hunter.html', k: 'game grep logs splunk', s: 'Apps' },
        { t: 'Deploy Dash', u: 'apps/deploy-dash.html', k: 'game release shipping', s: 'Apps' },
        { t: 'Dynatrace Simulator', u: 'apps/dynatrace-simulator.html', k: 'incidents cpu memory problems mttr', s: 'Apps' },
        { t: 'Interview Q&A Bank', u: 'apps/interview-bank.html', k: 'flashcards linux sql fix prep', s: 'Apps' },
        { t: 'Interview Simulator', u: 'apps/interview-simulator.html', k: 'mock interview scored practice job', s: 'Apps' },
        { t: 'AI Lab', u: 'apps/ai-lab.html', k: 'agents demo chatbot desk', s: 'Apps' },
        /* more */
        { t: 'Community', u: 'community.html', k: 'social feed stories likes', s: 'More' },
        { t: 'Guestbook', u: 'comments.html', k: 'comments moderation sign', s: 'More' },
        { t: 'My Progress', u: 'progress.html', k: 'xp streak badges levels dashboard', s: 'More' },
        { t: 'Health Lab', u: 'health.html', k: 'bmi bmr tdee fitness', s: 'More' },
        { t: 'World News', u: 'news.html', k: 'hacker news tech finance headlines', s: 'More' },
        { t: 'Weather', u: 'weather.html', k: 'forecast montreal temperature', s: 'More' },
        { t: 'Linux 300 Commands', u: 'linux-commands.html', k: 'bash shell cli reference cheat sheet', s: 'Reference' },
        { t: 'Munibot', u: 'munir-bot.html', k: 'robot bear mascot movie song story', s: 'Fun' },
        { t: 'Roadmap — 50 Ideas', u: 'roadmap.html', k: 'plans ideas future', s: 'More' },
        { t: 'Changelog', u: 'changelog.html', k: 'build log updates history', s: 'More' }
    ];

    var POPULAR = ['apps/trading-app.html', 'tutorials/index.html', 'apps/interview-simulator.html',
                   'tutorials/fix-protocol.html', 'munir-bot.html', 'progress.html'];

    /* ---------- site root detection (works on any host / depth) ---------- */
    function siteRoot() {
        try {
            var src = (document.currentScript && document.currentScript.src) || '';
            var m = src.match(/^(.*\/)js\/palette\.js(\?.*)?$/);
            if (m) return m[1];
        } catch (e) { /* fall through */ }
        return './';
    }
    var ROOT = siteRoot();

    /* ---------- fuzzy search ---------- */
    function fuzzyScore(query, text) {
        query = query.toLowerCase();
        text = text.toLowerCase();
        var qi = 0, ti, score = 0, run = 0, prev = -2, first = -1;
        for (ti = 0; ti < text.length && qi < query.length; ti++) {
            if (text[ti] === query[qi]) {
                if (first < 0) first = ti;
                run = (prev === ti - 1) ? run + 1 : 1;
                var boundary = ti === 0 || /[\s\-_\/:.]/.test(text[ti - 1]);
                score += 10 + run * 6 + (boundary ? 9 : 0) - ti * 0.05;
                prev = ti;
                qi++;
            } else {
                run = 0;
            }
        }
        if (qi < query.length) return -1;
        score += Math.max(0, 24 - first);
        return score;
    }

    function search(q) {
        q = (q || '').trim();
        if (!q) {
            return POPULAR.map(function (u) {
                return PAGES.filter(function (p) { return p.u === u; })[0];
            }).filter(Boolean);
        }
        var scored = [];
        for (var i = 0; i < PAGES.length; i++) {
            var p = PAGES[i];
            var hay = p.t + ' ' + p.k + ' ' + p.s;
            var sc = fuzzyScore(q, hay);
            if (sc > 0) scored.push({ p: p, sc: sc });
        }
        scored.sort(function (a, b) { return b.sc - a.sc; });
        return scored.slice(0, 8).map(function (x) { return x.p; });
    }

    /* ---------- UI ---------- */
    var overlay, input, list, activeIdx = -1, current = [];

    function injectStyles() {
        var css = [
            '#cmdk-overlay{position:fixed;inset:0;z-index:1200;display:flex;justify-content:center;align-items:flex-start;padding:12vh 16px 16px}',
            '#cmdk-overlay[hidden]{display:none}',
            '#cmdk-backdrop{position:absolute;inset:0;background:rgba(2,6,16,.72);backdrop-filter:blur(3px)}',
            '#cmdk-box{position:relative;width:100%;max-width:580px;background:#0b1322;border:1px solid rgba(34,211,238,.35);border-radius:14px;box-shadow:0 24px 80px rgba(0,0,0,.6),0 0 0 1px rgba(34,211,238,.08);overflow:hidden}',
            '#cmdk-input{width:100%;padding:16px 18px;font-size:1.05rem;color:#e8f0ff;background:transparent;border:0;border-bottom:1px solid rgba(148,163,184,.18);outline:none}',
            '#cmdk-input::placeholder{color:#64748b}',
            '#cmdk-list{max-height:340px;overflow-y:auto;padding:8px}',
            '.cmdk-item{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:9px;cursor:pointer;color:#cbd5e1}',
            '.cmdk-item .cmdk-t{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
            '.cmdk-item .cmdk-s{font-size:.72rem;color:#22d3ee;border:1px solid rgba(34,211,238,.35);border-radius:20px;padding:2px 9px;white-space:nowrap}',
            '.cmdk-item.active,.cmdk-item:hover{background:rgba(34,211,238,.12);color:#fff}',
            '#cmdk-foot{display:flex;gap:16px;padding:9px 16px;border-top:1px solid rgba(148,163,184,.14);font-size:.75rem;color:#64748b}',
            '#cmdk-foot kbd{background:#1e293b;border:1px solid #334155;border-radius:5px;padding:1px 6px;font-family:inherit;color:#cbd5e1}',
            '#cmdk-toast{position:fixed;bottom:26px;left:50%;transform:translateX(-50%);background:#0b1322;border:1px solid rgba(34,211,238,.4);color:#e8f0ff;padding:10px 20px;border-radius:30px;z-index:1300;font-size:.9rem;box-shadow:0 8px 30px rgba(0,0,0,.5)}'
        ].join('\n');
        var st = document.createElement('style');
        st.textContent = css;
        document.head.appendChild(st);
    }

    function build() {
        overlay = document.createElement('div');
        overlay.id = 'cmdk-overlay';
        overlay.setAttribute('hidden', '');
        overlay.innerHTML =
            '<div id="cmdk-backdrop"></div>' +
            '<div id="cmdk-box" role="dialog" aria-modal="true" aria-label="Search pages">' +
            '<input id="cmdk-input" type="text" placeholder="Search pages, tutorials, apps\u2026  (Esc to close)" autocomplete="off" spellcheck="false" aria-label="Search pages">' +
            '<div id="cmdk-list" role="listbox"></div>' +
            '<div id="cmdk-foot"><span><kbd>\u2191\u2193</kbd> navigate</span><span><kbd>\u23ce</kbd> open</span><span><kbd>esc</kbd> close</span></div>' +
            '</div>';
        document.body.appendChild(overlay);
        input = overlay.querySelector('#cmdk-input');
        list = overlay.querySelector('#cmdk-list');
        overlay.querySelector('#cmdk-backdrop').addEventListener('click', close);
        input.addEventListener('input', function () { render(search(input.value)); });
        input.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
            else if (e.key === 'Enter') { e.preventDefault(); go(); }
            else if (e.key === 'Escape') { e.preventDefault(); close(); }
        });
        list.addEventListener('click', function (e) {
            var it = e.target.closest ? e.target.closest('.cmdk-item') : null;
            if (it) { activeIdx = parseInt(it.getAttribute('data-i'), 10); go(); }
        });
        list.addEventListener('mousemove', function (e) {
            var it = e.target.closest ? e.target.closest('.cmdk-item') : null;
            if (it) { activeIdx = parseInt(it.getAttribute('data-i'), 10); paint(); }
        });
    }

    function esc(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function render(results) {
        current = results;
        activeIdx = results.length ? 0 : -1;
        if (!results.length) {
            list.innerHTML = '<div style="padding:22px;text-align:center;color:#64748b">No matches. Try "fix", "var", "docker", "quiz"\u2026</div>';
            return;
        }
        var html = '';
        for (var i = 0; i < results.length; i++) {
            html += '<div class="cmdk-item" role="option" data-i="' + i + '"' +
                    (i === activeIdx ? ' aria-selected="true"' : '') + '>' +
                    '<span class="cmdk-t">' + esc(results[i].t) + '</span>' +
                    '<span class="cmdk-s">' + esc(results[i].s) + '</span></div>';
        }
        list.innerHTML = html;
        paint();
    }

    function paint() {
        var items = list.querySelectorAll('.cmdk-item');
        for (var i = 0; i < items.length; i++) {
            var on = i === activeIdx;
            items[i].classList.toggle('active', on);
            if (on) items[i].setAttribute('aria-selected', 'true');
            else items[i].removeAttribute('aria-selected');
            if (on && items[i].scrollIntoView) items[i].scrollIntoView({ block: 'nearest' });
        }
    }

    function move(d) {
        if (!current.length) return;
        activeIdx = (activeIdx + d + current.length) % current.length;
        paint();
    }

    function go() {
        if (activeIdx >= 0 && current[activeIdx]) {
            window.location.href = ROOT + current[activeIdx].u;
        }
    }

    function open() {
        if (!overlay) { injectStyles(); build(); }
        overlay.removeAttribute('hidden');
        input.value = '';
        render(search(''));
        setTimeout(function () { input.focus(); }, 0);
    }

    function close() {
        if (overlay) overlay.setAttribute('hidden', '');
    }

    function isOpen() {
        return overlay && !overlay.hasAttribute('hidden');
    }

    document.addEventListener('keydown', function (e) {
        var tag = (e.target && e.target.tagName) || '';
        var typing = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target && e.target.isContentEditable);
        if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
            e.preventDefault();
            if (isOpen()) close(); else open();
            return;
        }
        if (e.key === 'Escape' && isOpen()) { close(); }
        /* Konami easter egg — not while typing */
        if (!typing && !isOpen()) konami(e.key);
    });

    /* ---------- Konami easter egg: Munibot swarm ---------- */
    var SEQ = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    var pos = 0;
    function konami(key) {
        pos = (key === SEQ[pos]) ? pos + 1 : (key === SEQ[0] ? 1 : 0);
        if (pos === SEQ.length) { pos = 0; swarm(); }
    }

    function swarm() {
        toast('Munibot swarm incoming! \uD83D\uDC3B');
        for (var i = 0; i < 14; i++) {
            (function (i) {
                var s = document.createElement('div');
                s.textContent = '\uD83D\uDC3B';
                var size = 26 + Math.random() * 26;
                s.style.cssText = 'position:fixed;z-index:1250;font-size:' + size + 'px;pointer-events:none;' +
                    'left:' + (Math.random() * 100) + 'vw;top:' + (105 + Math.random() * 10) + 'vh;';
                document.body.appendChild(s);
                var dx = (Math.random() - 0.5) * 60;
                var dy = -(110 + Math.random() * 40);
                if (s.animate) {
                    s.animate([
                        { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
                        { transform: 'translate(' + dx + 'vw,' + dy + 'vh) rotate(' + (Math.random() > 0.5 ? 360 : -360) + 'deg)', opacity: 0.9 }
                    ], { duration: 4500 + Math.random() * 3000, easing: 'cubic-bezier(.2,.6,.4,1)', delay: i * 180 });
                }
                setTimeout(function () { if (s.parentNode) s.parentNode.removeChild(s); }, 9000);
            })(i);
        }
    }

    function toast(msg) {
        var t = document.createElement('div');
        t.id = 'cmdk-toast';
        t.textContent = msg;
        document.body.appendChild(t);
        setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 2600);
    }

    /* test hook (harmless in production) */
    if (typeof window !== 'undefined') {
        window.__cmdk = { search: search, fuzzyScore: fuzzyScore, pageCount: PAGES.length, konami: konami, swarm: swarm };
    }
})();
