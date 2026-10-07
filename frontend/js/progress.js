/* ============================================================
   MUNIR PORTAL — PortalProgress: gamified XP engine
   Khan-Academy-style energy points + Duolingo-style streaks,
   all in localStorage. No backend needed.
   ============================================================ */
(function () {
    'use strict';

    var KEY = 'munir-portal-progress-v1';

    var LEVELS = [
        { xp: 0,    name: 'Rookie' },
        { xp: 100,  name: 'Apprentice' },
        { xp: 250,  name: 'Analyst' },
        { xp: 500,  name: 'Specialist' },
        { xp: 1000, name: 'Expert' },
        { xp: 2000, name: 'Veteran' },
        { xp: 4000, name: 'Master' },
        { xp: 8000, name: 'Legend' }
    ];

    var BADGES = [
        { id: 'first-steps',      icon: '🌱', name: 'First Steps',      desc: 'Complete your first tutorial' },
        { id: 'tutorial-crusher', icon: '🔥', name: 'Tutorial Crusher', desc: 'Complete 5 tutorials' },
        { id: 'quiz-whiz',        icon: '🧠', name: 'Quiz Whiz',        desc: 'Score 80%+ on the Markets Quiz' },
        { id: 'bug-slayer',       icon: '🐛', name: 'Bug Slayer',       desc: 'Score 2,500+ in kill -9' },
        { id: 'speed-demon',      icon: '⚡', name: 'Speed Demon',      desc: 'Score 800+ in Latency Racer' },
        { id: 'night-owl',        icon: '🦉', name: 'Night Owl',        desc: 'Visit between midnight and 5 AM' },
        { id: 'explorer',         icon: '🗺️', name: 'Explorer',         desc: 'Visit 10 different pages' },
        { id: 'number-cruncher',  icon: '🧮', name: 'Number Cruncher',  desc: 'Run 5 different calculators' },
        { id: 'incident-commander', icon: '🚨', name: 'Incident Commander', desc: 'Score 16+ on A Day on the Desk' },
        { id: 'fix-certified',   icon: '📜', name: 'FIX Certified',   desc: 'Perfect score on the FIX Certification Simulator' }
    ];

    function blank() {
        return {
            xp: 0,
            visits: {},          // dateStr -> true
            pages: {},           // pathname -> true
            calcPages: {},       // calc slug -> true
            calcDaily: {},       // dateStr + '|' + slug -> true
            streak: { current: 0, longest: 0, last: null },
            tutorials: {},       // slug -> dateStr
            scores: {},          // game -> best score
            badges: {}           // badgeId -> dateStr
        };
    }

    function load() {
        try {
            var raw = window.localStorage.getItem(KEY);
            if (!raw) return blank();
            var s = JSON.parse(raw);
            var b = blank();
            for (var k in b) { if (s && typeof s[k] !== 'undefined') b[k] = s[k]; }
            if (!b.streak || typeof b.streak.current !== 'number') b.streak = blank().streak;
            return b;
        } catch (e) {
            return blank();
        }
    }

    function save(s) {
        try { window.localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* private mode */ }
    }

    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function dateStr(d) {
        d = d || new Date();
        return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
    }
    function yesterdayStr() {
        var d = new Date();
        d.setDate(d.getDate() - 1);
        return dateStr(d);
    }

    function emit(s) {
        try {
            document.dispatchEvent(new CustomEvent('progress', { detail: snapshotOf(s) }));
        } catch (e) { /* older engines */ }
    }

    function levelFor(xp) {
        var lvl = 1;
        for (var i = 0; i < LEVELS.length; i++) {
            if (xp >= LEVELS[i].xp) lvl = i + 1;
        }
        return lvl;
    }

    function snapshotOf(s) {
        var lvl = levelFor(s.xp);
        var cur = LEVELS[lvl - 1];
        var nxt = LEVELS[lvl] || null;
        var into = s.xp - cur.xp;
        var need = nxt ? (nxt.xp - cur.xp) : 1;
        return {
            xp: s.xp,
            level: lvl,
            levelName: cur.name,
            xpIntoLevel: into,
            xpForNext: nxt ? (nxt.xp - s.xp) : 0,
            pct: Math.min(100, Math.round(into / need * 100)),
            nextLevelName: nxt ? nxt.name : null,
            streak: s.streak.current,
            longestStreak: s.streak.longest,
            tutorialsDone: Object.keys(s.tutorials).length,
            badges: Object.keys(s.badges)
        };
    }

    function awardBadge(s, id) {
        if (s.badges[id]) return false;
        var known = false;
        for (var i = 0; i < BADGES.length; i++) { if (BADGES[i].id === id) known = true; }
        if (!known) return false;
        s.badges[id] = dateStr();
        return true;
    }

    var api = {
        BADGES: BADGES,
        LEVELS: LEVELS,

        getState: function () { return load(); },
        snapshot: function () { return snapshotOf(load()); },

        addXP: function (n, reason) {
            n = Math.max(0, Math.floor(n) || 0);
            if (n <= 0) return snapshotOf(load());
            var s = load();
            var before = levelFor(s.xp);
            s.xp += n;
            var after = levelFor(s.xp);
            save(s);
            emit(s);
            return snapshotOf(s);
        },

        getXP: function () { return load().xp; },

        getLevel: function () {
            var s = load();
            var snap = snapshotOf(s);
            return { level: snap.level, name: snap.levelName, pct: snap.pct };
        },

        /* Record today's visit: streaks, night-owl, page tracking. Called on load. */
        touch: function () {
            var s = load();
            var t = dateStr();
            var y = yesterdayStr();
            if (s.streak.last !== t) {
                if (s.streak.last === y) s.streak.current += 1;
                else s.streak.current = 1;
                s.streak.last = t;
                if (s.streak.current > s.streak.longest) s.streak.longest = s.streak.current;
            }
            s.visits[t] = true;
            try {
                var path = window.location.pathname || '';
                if (path) {
                    s.pages[path] = true;
                    if (Object.keys(s.pages).length >= 10) awardBadge(s, 'explorer');
                }
            } catch (e) { /* ignore */ }
            if (new Date().getHours() < 5) awardBadge(s, 'night-owl');
            save(s);
            emit(s);
            return snapshotOf(s);
        },

        markTutorialDone: function (slug) {
            if (!slug) return false;
            var s = load();
            if (s.tutorials[slug]) { save(s); return false; }
            s.tutorials[slug] = dateStr();
            var n = Object.keys(s.tutorials).length;
            if (n >= 1) awardBadge(s, 'first-steps');
            if (n >= 5) awardBadge(s, 'tutorial-crusher');
            save(s);
            emit(s);
            return true;
        },

        isTutorialDone: function (slug) {
            if (!slug) return false;
            return !!load().tutorials[slug];
        },

        /* Higher is better. Returns { isNew, best }. */
        setHighScore: function (game, score) {
            if (!game) return { isNew: false, best: 0 };
            score = Math.floor(Number(score) || 0);
            var s = load();
            var prev = s.scores[game] || 0;
            var isNew = score > prev;
            if (isNew) s.scores[game] = score;
            save(s);
            emit(s);
            return { isNew: isNew, best: s.scores[game] || 0 };
        },

        getHighScore: function (game) {
            if (!game) return 0;
            return load().scores[game] || 0;
        },

        award: function (id) {
            var s = load();
            var isNew = awardBadge(s, id);
            save(s);
            if (isNew) emit(s);
            return isNew;
        },

        hasBadge: function (id) { return !!load().badges[id]; },

        /* True once per page per day — drives the 10 XP calculator reward. */
        firstCalcToday: function (slug) {
            if (!slug) return false;
            var s = load();
            var key = dateStr() + '|' + slug;
            if (s.calcDaily[key]) { save(s); return false; }
            s.calcDaily[key] = true;
            s.calcPages[slug] = true;
            if (Object.keys(s.calcPages).length >= 5) awardBadge(s, 'number-cruncher');
            save(s);
            emit(s);
            return true;
        }
    };

    window.PortalProgress = api;

    /* Auto-track every visit on pages that include this script. */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { api.touch(); });
    } else {
        api.touch();
    }
})();
