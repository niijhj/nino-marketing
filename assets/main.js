// Main JS extracted from original index.html and wrapped to run after DOM is ready.
// Accessibility improvements: language toggle separated, focus restore for mobile nav, counters moved to rAF where helpful.

document.addEventListener('DOMContentLoaded', function () {
  // Dynamic year
  const yrEl = document.getElementById('yr');
  if (yrEl) yrEl.textContent = new Date().getFullYear();

  // TRANSLATIONS (trimmed/cleaned strings - keep them in full if you prefer)
  const T = {
    en: {
      'nav.services':'Services','nav.results':'Results','nav.exp':'Experience','nav.certs':'Certifications','nav.contact':'Contact','nav.cta':'Strategy Call',
      'hero.eyebrow':'Available for Strategic Engagements',
      'hero.h1b':'Meets','hero.h1c':'Revenue-First','hero.h1d':'Marketing Strategy',
      'hero.sub':'<strong>Nour Nader (Nino)</strong> — Performance Marketing Specialist &amp; Digital Marketing Manager with <strong>9+ years</strong> delivering measurable ROI across Healthcare, B2B, Education, and Real Estate.',
      'hero.cta1':'View Proven Results','hero.cta2':'Schedule a Strategy Call','hero.loc':'Dokki, Giza, Egypt','hero.avail':'Open to New Projects',
      'stat.years':'Years<br/>Experience','stat.roas':'ROAS<br/>Achieved','stat.spend':'EGP Monthly<br/>Spend Managed','stat.rev':'Revenue Growth<br/>in 6 Months',
      'id.name':'Nour Nader (Nino)','id.title':'Performance Marketing Specialist','id.loc':'<span aria-hidden="true">📍</span> Dokki, Giza · Available Remotely',
      'svc.tag':'What I Deliver','svc.h2':'Core Services','svc.sub':'End-to-end marketing execution — from paid acquisition to AI-powered search visibility and data infrastructure.'
      // (expand language entries as needed)
    },
    ar: {
      'nav.services':'الخدمات','nav.results':'النتائج','nav.exp':'الخبرة','nav.certs':'الشهادات','nav.contact':'تواصل معي','nav.cta':'احجز مكالمة',
      'hero.eyebrow':'متاح للتعاون في المشاريع الاستراتيجية',
      'hero.h1b':'بأسلوب تسويقي','hero.h1c':'يُحقق النتائج','hero.h1d':'على أرض الواقع',
      'hero.sub':'<strong>نور نادر (نينو)</strong> — متخصص تسويق رقمي بخبرة أكثر من <strong>9 سنوات</strong> في تحقيق نتائج ملموسة.',
      'hero.cta1':'شوف النتائج بنفسك','hero.cta2':'احجز مكالمة استراتيجية','hero.loc':'الدقي، الجيزة، مصر','hero.avail':'متاح لمشاريع جديدة'
    }
  };

  // LANGUAGE — auto-detect + localStorage
  const savedLang = localStorage.getItem('nino-lang');
  const browserLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
  let currentLang = savedLang || (browserLang.startsWith('ar') ? 'ar' : 'en');

  const twPhrases = {
    en: ['Paid Media','AI Search','AEO Expert','ROI Growth','Data Mastery'],
    ar: ['إعلانات مدفوعة','بحث ذكي','خبير AEO','نمو حقيقي','ذكاء اصطناعي']
  };

  const langFlag = document.getElementById('langFlag');
  const langLabel = document.getElementById('langLabel');
  const twEl = document.getElementById('tw');

  function applyTranslation(lang) {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-key]').forEach(el => {
      const key = el.getAttribute('data-key');
      if (T[lang] && T[lang][key] !== undefined) el.innerHTML = T[lang][key];
    });
    if (lang === 'ar') { if (langFlag) langFlag.textContent = '🇬🇧'; if (langLabel) langLabel.textContent = 'English'; }
    else { if (langFlag) langFlag.textContent = '🇪🇬'; if (langLabel) langLabel.textContent = 'العربية'; }
    document.body.classList.add('lang-fade');
    setTimeout(() => document.body.classList.remove('lang-fade'), 400);
    localStorage.setItem('nino-lang', lang);
  }

  function resetTypewriter() {
    // typewriter uses twPhrases[currentLang]
    clearTimeout(window.__twTimer);
    window.__twPh = 0; window.__twCh = 0; window.__twDel = false;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) { if (twEl) twEl.textContent = twPhrases[currentLang][0]; return; }
    if (twEl) { twEl.textContent = ''; window.__twTimer = setTimeout(twTick, 400); }
  }
  function twTick() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;
    const phrases = twPhrases[currentLang] || twPhrases.en;
    const cur = phrases[window.__twPh];
    if (!window.__twDel) {
      if (twEl) twEl.textContent = cur.substring(0, window.__twCh + 1);
      window.__twCh++;
      if (window.__twCh === cur.length) { window.__twTimer = setTimeout(() => { window.__twDel = true; twTick(); }, 2400); return; }
    } else {
      if (twEl) twEl.textContent = cur.substring(0, window.__twCh - 1);
      window.__twCh--;
      if (window.__twCh === 0) { window.__twDel = false; window.__twPh = (window.__twPh + 1) % phrases.length; }
    }
    window.__twTimer = setTimeout(twTick, window.__twDel ? 40 : 80);
  }

  // Init translations and typewriter
  applyTranslation(currentLang);
  resetTypewriter();
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) setTimeout(twTick, 800);

  // MOBILE NAV focus trapping helpers
  const mobNav = document.getElementById('mobNav');
  const hamburger = document.getElementById('hamburger');

  let releaseTrap = null;
  function trapFocus(container) {
    const focusable = Array.from(container.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'));
    if (!focusable.length) return function () {};
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    function handleKey(e){
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    container.addEventListener('keydown', handleKey);
    return function cleanup(){ container.removeEventListener('keydown', handleKey); };
  }

  function openMobNav(){
    if (!mobNav || !hamburger) return;
    const isOpen = mobNav.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.querySelector('main')?.setAttribute('aria-hidden', 'true');
    releaseTrap = trapFocus(mobNav);
    const first = mobNav.querySelector('a,button');
    if (first) first.focus();
    document.body.style.overflow = 'hidden';
  }
  function closeMobNav(){
    if (!mobNav || !hamburger) return;
    mobNav.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.querySelector('main')?.removeAttribute('aria-hidden');
    if (typeof releaseTrap === 'function') { releaseTrap(); releaseTrap = null; }
    hamburger.focus();
    document.body.style.overflow = '';
  }
  window.toggleMobNav = function(){
    if (mobNav.classList.contains('open')) closeMobNav(); else openMobNav();
  };
  window.closeMobNav = closeMobNav;

  // Close on resize to desktop
  window.addEventListener('resize', () => { if (window.innerWidth > 920) closeMobNav(); });

  // Close on Escape key
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && mobNav.classList.contains('open')) closeMobNav(); });

  // Language toggle (exposed)
  const langBtn = document.getElementById('langBtn');
  window.toggleLang = function() {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    applyTranslation(currentLang);
    resetTypewriter();
  };
  if (langBtn) langBtn.addEventListener('click', window.toggleLang);

  // PROGRESS BAR
  const pb = document.getElementById('pb');
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    if (pb) pb.style.width = Math.min(pct, 100) + '%';
  }, {passive:true});

  // Intersection animations
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, {threshold:0.07});
  document.querySelectorAll('.fade-up,.fade-left,.fade-right').forEach(el => obs.observe(el));

  // COUNTER — using rAF for smoother animation
  const counters = Array.from(document.querySelectorAll('.counter'));
  const cObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.target || 0);
      const suffix = el.dataset.suffix || '';
      const isFloat = target % 1 !== 0;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion) { el.textContent = (isFloat ? target.toFixed(1) : target) + suffix; cObs.unobserve(el); return; }
      let start = 0;
      const duration = 900; // ms
      const startTime = performance.now();
      function step(now) {
        const elapsed = Math.min(now - startTime, duration);
        const progress = elapsed / duration;
        const value = start + (target - start) * progress;
        el.textContent = (isFloat ? value.toFixed(1) : Math.round(value)) + suffix;
        if (elapsed < duration) requestAnimationFrame(step);
        else { el.textContent = (isFloat ? target.toFixed(1) : target) + suffix; }
      }
      requestAnimationFrame(step);
      cObs.unobserve(el);
    });
  }, {threshold:0.5});
  counters.forEach(el => cObs.observe(el));

  // ACTIVE NAV
  const secs = Array.from(document.querySelectorAll('section[id]'));
  const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
  window.addEventListener('scroll', () => {
    let cur = '';
    secs.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
  }, {passive:true});

  // PARTICLES CANVAS (keeps same code but moved to external file)
  (function(){
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, dots = [], rafId, active = true;
    function resize(){ W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }
    resize();
    window.addEventListener('resize', resize);
    for(let i=0;i<70;i++) dots.push({x:Math.random()*2000,y:Math.random()*900,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,r:Math.random()*1.5+.5,o:Math.random()*.4+.1});
    const hero = document.getElementById('hero');
    if (!hero) return;
    const heroObs = new IntersectionObserver(([e]) => { active = e.isIntersecting; if(active) draw(); }, {threshold:0});
    heroObs.observe(hero);
    function draw(){
      if(!active) return;
      ctx.clearRect(0,0,W,H);
      dots.forEach(d=>{
        d.x+=d.vx; d.y+=d.vy;
        if(d.x<0||d.x>W) d.vx*=-1;
        if(d.y<0||d.y>H) d.vy*=-1;
        ctx.beginPath(); ctx.arc(d.x,d.y,d.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(96,165,250,${d.o})`; ctx.fill();
      });
      dots.forEach((d,i)=>{
        for(let j=i+1;j<dots.length;j++){
          const dx=d.x-dots[j].x, dy=d.y-dots[j].y, dist=Math.sqrt(dx*dx+dy*dy);
          if(dist<120){ctx.beginPath();ctx.moveTo(d.x,d.y);ctx.lineTo(dots[j].x,dots[j].y);ctx.strokeStyle=`rgba(59,130,246,${.08*(1-dist/120)})`;ctx.lineWidth=.5;ctx.stroke();}
        }
      });
      rafId = requestAnimationFrame(draw);
    }
    draw();
  })();

}); // DOMContentLoaded
