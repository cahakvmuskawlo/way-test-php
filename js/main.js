/* Hrshop — main.js
 * Independent editorial about self-directed learning.
 * ------------------------------------------------------ */
(function () {
    'use strict';

    // ---------- Mobile nav ----------
    var navToggle = document.querySelector('.nav-toggle');
    var primaryNav = document.querySelector('.primary-nav');

    function closeNav() {
        if (!primaryNav) return;
        primaryNav.classList.remove('open');
        document.body.classList.remove('nav-open');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    }
    function openNav() {
        if (!primaryNav) return;
        primaryNav.classList.add('open');
        document.body.classList.add('nav-open');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'true');
    }
    if (navToggle && primaryNav) {
        navToggle.addEventListener('click', function () {
            if (primaryNav.classList.contains('open')) closeNav(); else openNav();
        });
        // Close on link click (mobile)
        primaryNav.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', closeNav);
        });
        // Close on Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeNav();
        });
        // Close on outside click (mobile)
        document.addEventListener('click', function (e) {
            if (!primaryNav.classList.contains('open')) return;
            if (primaryNav.contains(e.target) || navToggle.contains(e.target)) return;
            closeNav();
        });
    }

    // ---------- Newsletter form ----------
    document.querySelectorAll('form[data-newsletter]').forEach(function (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var msg = form.querySelector('.form-msg');
            var email = form.querySelector('input[type="email"]');
            var hp = form.querySelector('input[name="website"]');
            if (hp && hp.value) { return; } // honeypot triggered
            if (!email || !email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
                if (msg) { msg.className = 'form-msg err'; msg.textContent = 'Please enter a valid email address.'; }
                if (email) email.focus();
                return;
            }
            if (msg) { msg.className = 'form-msg ok'; msg.textContent = 'Thank you — we\'ll send new articles as they are published.'; }
            form.reset();
        });
    });

    // ---------- Contact / generic form ----------
    document.querySelectorAll('form[data-contact]').forEach(function (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var msg = form.querySelector('.form-msg');
            var hp = form.querySelector('input[name="website"]');
            if (hp && hp.value) { return; }
            var required = form.querySelectorAll('[required]');
            var ok = true;
            required.forEach(function (el) {
                if (!el.value.trim()) { ok = false; el.setAttribute('aria-invalid', 'true'); }
                else { el.removeAttribute('aria-invalid'); }
            });
            var email = form.querySelector('input[type="email"]');
            if (ok && email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
                ok = false;
                email.setAttribute('aria-invalid', 'true');
            }
            if (!ok) {
                if (msg) { msg.className = 'form-msg err'; msg.textContent = 'Please complete all required fields and check your email address.'; }
                return;
            }
            if (msg) { msg.className = 'form-msg ok'; msg.textContent = 'Thank you — your message has been received. We reply within a few working days.'; }
            form.reset();
        });
    });

    // ---------- Article filter / search ----------
    var searchInput = document.querySelector('[data-article-search]');
    var categorySelect = document.querySelector('[data-category-filter]');
    var sortSelect = document.querySelector('[data-sort]');
    var cards = document.querySelectorAll('[data-article-card]');
    var noResults = document.querySelector('[data-no-results]');

    function applyFilters() {
        if (!cards.length) return;
        var q = (searchInput && searchInput.value || '').toLowerCase().trim();
        var cat = (categorySelect && categorySelect.value || 'all');
        var visible = 0;
        var arr = Array.prototype.slice.call(cards);

        if (sortSelect) {
            var sort = sortSelect.value;
            var parent = cards[0].parentNode;
            arr.sort(function (a, b) {
                if (sort === 'title') return (a.dataset.title || '').localeCompare(b.dataset.title || '');
                var da = a.dataset.date || '';
                var db = b.dataset.date || '';
                if (sort === 'oldest') return da.localeCompare(db);
                return db.localeCompare(da);
            });
            arr.forEach(function (n) { parent.appendChild(n); });
        }

        arr.forEach(function (card) {
            var matchCat = cat === 'all' || (card.dataset.category || '').split(',').indexOf(cat) !== -1;
            var haystack = (card.dataset.title || '') + ' ' + (card.dataset.desc || '') + ' ' + (card.dataset.category || '');
            var matchQ = !q || haystack.toLowerCase().indexOf(q) !== -1;
            if (matchCat && matchQ) { card.style.display = ''; visible++; }
            else { card.style.display = 'none'; }
        });
        if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
    }
    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (categorySelect) categorySelect.addEventListener('change', applyFilters);
    if (sortSelect) sortSelect.addEventListener('change', applyFilters);

    // ---------- Site-wide search (search.html) ----------
    var siteSearchForm = document.querySelector('[data-site-search-form]');
    var siteSearchInput = document.querySelector('[data-site-search-input]');
    var siteSearchResults = document.querySelector('[data-site-search-results]');
    if (siteSearchForm && siteSearchInput && siteSearchResults) {
        function runSiteSearch() {
            var q = siteSearchInput.value.toLowerCase().trim();
            var results = siteSearchResults.querySelectorAll('[data-search-item]');
            var count = 0;
            results.forEach(function (item) {
                var hay = (item.dataset.title || '') + ' ' + (item.dataset.desc || '') + ' ' + (item.dataset.category || '');
                if (!q || hay.toLowerCase().indexOf(q) !== -1) { item.style.display = ''; count++; }
                else { item.style.display = 'none'; }
            });
            var empty = siteSearchResults.querySelector('[data-search-empty]');
            var summary = siteSearchResults.querySelector('[data-search-summary]');
            if (empty) empty.style.display = count === 0 && q ? 'block' : 'none';
            if (summary) summary.textContent = q ? (count + ' result' + (count === 1 ? '' : 's') + ' for "' + q + '"') : (results.length + ' articles indexed');
        }
        siteSearchForm.addEventListener('submit', function (e) { e.preventDefault(); runSiteSearch(); });
        siteSearchInput.addEventListener('input', runSiteSearch);
        // Prefill from ?q=
        var urlQ = new URLSearchParams(window.location.search).get('q');
        if (urlQ) { siteSearchInput.value = urlQ; runSiteSearch(); }
        else { runSiteSearch(); }
    }

    // ---------- Cookie banner ----------
    var STORAGE_KEY = 'hrshop.consent';
    var banner = document.getElementById('cookie-banner');
    var consent = null;
    try { consent = localStorage.getItem(STORAGE_KEY); } catch (e) { consent = null; }
    if (banner && !consent) { banner.classList.add('show'); }
    function setConsent(val) {
        try { localStorage.setItem(STORAGE_KEY, val); } catch (e) {}
        if (banner) banner.classList.remove('show');
    }
    var accept = document.querySelector('.cookie-banner .accept');
    var reject = document.querySelector('.cookie-banner .reject');
    if (accept) accept.addEventListener('click', function () { setConsent('accepted'); });
    if (reject) reject.addEventListener('click', function () { setConsent('rejected'); });

    // ---------- Year in footer ----------
    document.querySelectorAll('[data-year]').forEach(function (el) {
        el.textContent = new Date().getFullYear();
    });

    // ---------- Fade-up on scroll ----------
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-up');
                    io.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -60px 0px', threshold: 0.05 });
        document.querySelectorAll('[data-reveal]').forEach(function (el) { io.observe(el); });
    }
})();
