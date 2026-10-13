(function () {
  'use strict';
  var root = document.documentElement;

  // ----- Theme toggle -----
  var themeBtn = document.getElementById('themeToggle');
  function isDark() {
    var t = root.getAttribute('data-theme');
    if (t) return t === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('bc-theme', next); } catch (e) {}
  });

  // ----- Mobile menu -----
  var menuBtn = document.getElementById('menuBtn');
  var nav = document.getElementById('nav');
  function closeMenu() { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }

  // ----- Active nav link on scroll -----
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav a'));
  var sections = links.map(function (a) { return document.querySelector(a.getAttribute('href')); }).filter(Boolean);
  var toTop = document.getElementById('toTop');
  function onScroll() {
    var y = window.scrollY + 140;
    var current = null;
    sections.forEach(function (s) { if (s.offsetTop <= y) current = s.id; });
    links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + current); });
    if (toTop) toTop.classList.toggle('show', window.scrollY > 700);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ----- Project filters -----
  var filters = document.querySelectorAll('.filter');
  var projects = document.querySelectorAll('.project');
  var grid = document.getElementById('projectsGrid');
  var showMore = document.getElementById('showMore');
  if (showMore) showMore.addEventListener('click', function () { grid.classList.remove('collapsed'); });
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.getAttribute('data-filter');
      if (grid && f !== 'all') grid.classList.remove('collapsed');
      filters.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('active', on);
        b.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      projects.forEach(function (p) {
        p.classList.toggle('is-hidden', f !== 'all' && p.getAttribute('data-cat') !== f);
      });
    });
  });

  // ----- Contact form (opens the visitor's email client) -----
  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    form.querySelectorAll('[required]').forEach(function (input) {
      var valid = input.value.trim() !== '' && (input.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value));
      input.closest('.field').classList.toggle('invalid', !valid);
      if (!valid) ok = false;
    });
    if (!ok) { note.textContent = 'Please complete the highlighted fields.'; return; }

    var d = new FormData(form);
    var subject = 'Project enquiry: ' + d.get('service') + ' (' + d.get('name') + ')';
    var body = [
      'Name: ' + d.get('name'),
      'Company: ' + (d.get('company') || '-'),
      'Email: ' + d.get('email'),
      'Phone: ' + (d.get('phone') || '-'),
      'Service: ' + d.get('service'),
      '',
      d.get('message')
    ].join('\n');
    window.location.href = 'mailto:info@baichuanltd.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    note.textContent = 'Opening your email app… If nothing happens, email info@baichuanltd.com directly.';
  });

  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
