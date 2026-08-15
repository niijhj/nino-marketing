/* Main interactive JS — simplified and robust version to avoid truncation issues */
// Dynamic year (if element with id 'yr' exists)
(function(){
  try{
    const yrEl = document.getElementById('yr');
    if (yrEl) yrEl.textContent = new Date().getFullYear();
  }catch(e){console.error(e)}
})();

// Minimal translations map (English only). Expand if needed.
const T = {
  en: {
    'nav.services':'Services','nav.results':'Results','nav.exp':'Experience','nav.certs':'Certifications','nav.contact':'Contact','nav.cta':'Strategy Call',
    'hero.eyebrow':'Available for Strategic Engagements','hero.h1b':'Meets','hero.h1c':'Revenue-First','hero.h1d':'Marketing Strategy',
    'hero.sub':'<strong>Nour Nader (Nino)</strong> — Performance Marketing Specialist & Digital Marketing Manager with 9+ years delivering measurable ROI across Healthcare, B2B, Education, and Real Estate.',
    'hero.cta1':'View Proven Results','hero.cta2':'Schedule a Strategy Call','hero.loc':'Dokki, Giza, Egypt','hero.avail':'Open to New Projects',
    'stat.years':'Years\nExperience','stat.roas':'ROAS\nAchieved','stat.spend':'EGP Monthly\nSpend Managed','stat.rev':'Revenue Growth\nin 6 Months'
  }
};

// Language handling (fallback to English)
let savedLang = null;
try { savedLang = localStorage.getItem('nino-lang'); } catch (e) {}
const browserLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
let currentLang = savedLang || (browserLang.startsWith('ar') ? 'ar' : 'en');

const twPhrases = {
  en: ['Paid Media','AI Search','AEO Expert','ROI Growth','Data Mastery'],
  ar: ['إعلانات مدفوعة','بحث ذكي','خبير AEO','نمو حقيقي','ذكاء اصطناعي']
};

function applyTranslation(lang){
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.getAttribute('data-key');
    if (!key) return;
    const txt = (T[lang] && T[lang][key]) || (T['en'] && T['en'][key]) || el.innerHTML;
    el.innerHTML = txt;
  });
  try { localStorage.setItem('nino-lang', lang); } catch (e) {}
}

function toggleLang(){ currentLang = currentLang === 'en' ? 'ar' : 'en'; applyTranslation(currentLang); resetTypewriter(); }

applyTranslation(currentLang);

// Mobile nav
const mobNav = typeof document !== 'undefined' ? document.getElementById('mobNav') : null;
const hamburger = typeof document !== 'undefined' ? document.getElementById('hamburger') : null;
function toggleMobNav(){
  if(!mobNav || !hamburger) return;
  const isOpen = mobNav.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  document.body.style.overflow = isOpen ? 'hidden' : '';
}
function closeMobNav(){
  if(mobNav) mobNav.classList.remove('open');
  if(hamburger){ hamburger.classList.remove('open'); hamburger.setAttribute('aria-expanded','false'); }
  document.body.style.overflow = '';
}
window.toggleMobNav = toggleMobNav; window.closeMobNav = closeMobNav;

// Typewriter (simple and resilient)
let twPh = 0, twCh = 0, twDel = false, twTimer = null;
const twEl = typeof document !== 'undefined' ? document.getElementById('tw') : null;
const reducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function resetTypewriter(){
  clearTimeout(twTimer);
  twPh = 0; twCh = 0; twDel = false;
  if(!twEl) return;
  if(reducedMotion){ twEl.textContent = (twPhrases[currentLang] && twPhrases[currentLang][0]) || twPhrases.en[0]; return; }
  twEl.textContent = '';
  twTimer = setTimeout(twTick, 400);
}
function twTick(){
  if(!twEl || reducedMotion) return;
  const phrases = twPhrases[currentLang] || twPhrases['en'];
  const cur = phrases[twPh];
  if(!twDel){
    twEl.textContent = cur.substring(0, twCh + 1); twCh++;
    if(twCh === cur.length){ twTimer = setTimeout(()=>{ twDel = true; twTick(); }, 2200); return; }
  } else {
    twEl.textContent = cur.substring(0, twCh - 1); twCh--;
    if(twCh === 0){ twDel = false; twPh = (twPh + 1) % phrases.length; }
  }
  twTimer = setTimeout(twTick, twDel ? 40 : 80);
}
if(!reducedMotion) setTimeout(twTick, 800);

// Progress bar
const pb = typeof document !== 'undefined' ? document.getElementById('pb') : null;
if (typeof window !== 'undefined') window.addEventListener('scroll', () => {
  try{
    if(!pb) return;
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    pb.style.width = Math.min(pct, 100) + '%';
  }catch(e){}
}, {passive:true});

// Intersection animations
if (typeof IntersectionObserver !== 'undefined'){
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, {threshold: 0.07});
  document.querySelectorAll('.fade-up, .fade-left, .fade-right').forEach(el => obs.observe(el));
}

// Counters
if (typeof IntersectionObserver !== 'undefined'){
  const cObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(!e.isIntersecting) return;
      const el = e.target; const raw = el.dataset && el.dataset.target;
      const target = raw ? parseFloat(raw) : 0; const suffix = el.dataset && el.dataset.suffix || '';
      if(reducedMotion){ el.textContent = (Number.isFinite(target) ? (target%1!==0 ? target.toFixed(1) : Math.round(target)) : target) + suffix; cObs.unobserve(el); return; }
      let start = 0; const steps = 60; const step = target / steps; const timer = setInterval(()=>{
        start = Math.min(start + step, target);
        el.textContent = (target%1!==0 ? start.toFixed(1) : Math.round(start)) + suffix;
        if(start >= target) clearInterval(timer);
      }, 16);
      cObs.unobserve(el);
    });
  }, {threshold: 0.5});
  document.querySelectorAll('.counter').forEach(el => cObs.observe(el));
}

// Active nav highlighting
if (typeof window !== 'undefined') window.addEventListener('scroll', () => {
  try{
    const secs = document.querySelectorAll('section[id]'); const navLinks = document.querySelectorAll('.nav-links a');
    let cur = '';
    secs.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
  }catch(e){}
}, {passive:true});

// Particles (lightweight) — only if canvas exists and motion not reduced
if(!reducedMotion && typeof document !== 'undefined'){
  (function(){
    const canvas = document.getElementById('particles'); if(!canvas) return;
    const ctx = canvas.getContext('2d'); let W = canvas.width = canvas.offsetWidth, H = canvas.height = canvas.offsetHeight;
    let dots = [];
    function resize(){ W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }
    window.addEventListener('resize', resize);
    for(let i=0;i<60;i++) dots.push({x:Math.random()*W, y:Math.random()*H, vx:(Math.random()-.5)*.3, vy:(Math.random()-.5)*.3, r:Math.random()*1.6+.4, o:Math.random()*.5+.1});
    let active = true;
    const hero = document.getElementById('hero');
    const heroObs = new IntersectionObserver(([e]) => { active = e.isIntersecting; if(active) draw(); }, {threshold: 0});
    if(hero) heroObs.observe(hero);
    function draw(){ if(!active) return; ctx.clearRect(0,0,W,H); dots.forEach(d=>{ d.x+=d.vx; d.y+=d.vy; if(d.x<0||d.x>W) d.vx*=-1; if(d.y<0||d.y>H) d.vy*=-1; ctx.beginPath(); ctx.arc(d.x,d.y,d.r,0,Math.PI*2); ctx.fillStyle = `rgba(96,165,250,${d.o})`; ctx.fill(); });
      for(let i=0;i<dots.length;i++){ for(let j=i+1;j<dots.length;j++){ const dx = dots[i].x - dots[j].x, dy = dots[i].y - dots[j].y; const dist = Math.sqrt(dx*dx+dy*dy); if(dist < 120){ ctx.beginPath(); ctx.moveTo(dots[i].x, dots[i].y); ctx.lineTo(dots[j].x, dots[j].y); ctx.strokeStyle = `rgba(59,130,246,${0.08*(1-dist/120)})`; ctx.lineWidth = .5; ctx.stroke(); } } }
      requestAnimationFrame(draw);
    }
    draw();
  })();
}

// Expose language toggle for the button
window.toggleLang = toggleLang;
