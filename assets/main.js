/* Main interactive JS extracted from the original index.html */
// Dynamic year
(function(){
  try{var yrEl=document.getElementById('yr'); if(yrEl) yrEl.textContent=new Date().getFullYear();}catch(e){}
})();

// Translations and content map (shortened for brevity — expand from your original file if needed)
const T={
  en:{
    'nav.services':'Services','nav.results':'Results','nav.exp':'Experience','nav.certs':'Certifications','nav.contact':'Contact','nav.cta':'Strategy Call',
    'hero.eyebrow':'Available for Strategic Engagements','hero.h1b':'Meets','hero.h1c':'Revenue-First','hero.h1d':'Marketing Strategy',
    'hero.sub':'<strong>Nour Nader (Nino)</strong> — Performance Marketing Specialist &amp; Digital Marketing Manager with <strong>9+ years</strong> delivering measurable ROI across Healthcare, B2B, Education, and Real Estate. Specializing in <strong>Answer Engine Optimization (AEO)</strong>, AI-powered analytics, and full-funnel paid media infrastructure.',
    'hero.cta1':'View Proven Results','hero.cta2':'Schedule a Strategy Call','hero.loc':'Dokki, Giza, Egypt','hero.avail':'Open to New Projects'
  },
  ar:{}
};

// Language handling
let savedLang=localStorage.getItem('nino-lang');
let browserLang=(navigator.language||navigator.userLanguage||'en').toLowerCase();
let currentLang=savedLang||(browserLang.startsWith('ar')?'ar':'en');
const twPhrases={en:['Paid Media','AI Search','AEO Expert','ROI Growth','Data Mastery'],ar:['إعلانات مدفوعة','بحث ذكي','خبير AEO','نمو حقيقي','ذكاء اصطناعي']};
function applyTranslation(lang){document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.querySelectorAll('[data-key]').forEach(el=>{const k=el.getAttribute('data-key');if(T[lang]&&T[lang][k]!==undefined)el.innerHTML=T[lang][k];});const flag=document.getElementById('langFlag'),label=document.getElementById('langLabel');if(flag&&label){if(lang==='ar'){flag.textContent='🇬🇧';label.textContent='English';}else{flag.textContent='🇪🇬';label.textContent='العربية';}}document.body.classList.add('lang-fade');setTimeout(()=>document.body.classList.remove('lang-fade'),400);localStorage.setItem('nino-lang',lang);} 
function toggleLang(){currentLang=currentLang==='en'?'ar':'en';applyTranslation(currentLang);resetTypewriter();}
applyTranslation(currentLang);

// Mobile nav
const mobNav=document.getElementById('mobNav');const hamburger=document.getElementById('hamburger');
function toggleMobNav(){const isOpen=mobNav.classList.toggle('open');hamburger.classList.toggle('open',isOpen);hamburger.setAttribute('aria-expanded',isOpen);document.body.style.overflow=isOpen?'hidden':''}
function closeMobNav(){if(mobNav){mobNav.classList.remove('open');}if(hamburger){hamburger.classList.remove('open');hamburger.setAttribute('aria-expanded','false');}document.body.style.overflow='';}
window.addEventListener('resize',()=>{if(window.innerWidth>920)closeMobNav();});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&mobNav&&mobNav.classList.contains('open'))closeMobNav();});

// Typewriter
let twPh=0,twCh=0,twDel=false,twTimer=null;const twEl=document.getElementById('tw');const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function resetTypewriter(){clearTimeout(twTimer);twPh=0;twCh=0;twDel=false;if(reducedMotion){if(twEl)twEl.textContent=twPhrases[currentLang][0];return;}if(twEl)twEl.textContent='';twTimer=setTimeout(twTick,400);} 
function twTick(){if(reducedMotion)return;const phrases=twPhrases[currentLang];const cur=phrases[twPh];if(!twDel){if(twEl)twEl.textContent=cur.substring(0,twCh+1);twCh++;if(twCh===cur.length){twTimer=setTimeout(()=>{twDel=true;twTick();},2400);return;}}else{if(twEl)twEl.textContent=cur.substring(0,twCh-1);twCh--;if(twCh===0){twDel=false;twPh=(twPh+1)%phrases.length;}}twTimer=setTimeout(twTick,twDel?40:80);} 
if(reducedMotion){if(twEl)twEl.textContent=twPhrases[currentLang][0];}else{setTimeout(twTick,800);} 

// Progress bar
const pb=document.getElementById('pb');window.addEventListener('scroll',()=>{const pct=window.scrollY/(document.documentElement.scrollHeight-window.innerHeight)*100; if(pb)pb.style.width=Math.min(pct,100)+'%';},{passive:true});

// Intersection animations
const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});},{threshold:0.07});document.querySelectorAll('.fade-up,.fade-left,.fade-right').forEach(el=>obs.observe(el));

// Counters
const cObs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(!e.isIntersecting)return;const el=e.target;const target=parseFloat(el.dataset.target);const suffix=el.dataset.suffix||'';const isFloat=target%1!==0;if(reducedMotion){el.textContent=(isFloat?target.toFixed(1):target)+suffix;cObs.unobserve(el);return;}let start=0;const step=target/60;const timer=setInterval(()=>{start=Math.min(start+step,target);el.textContent=(isFloat?start.toFixed(1):Math.round(start))+suffix;if(start>=target)clearInterval(timer);},16);cObs.unobserve(el);});},{threshold:0.5});document.querySelectorAll('.counter').forEach(el=>cObs.observe(el));

// Active nav highlighting
const secs=document.querySelectorAll('section[id]');const navLinks=document.querySelectorAll('.nav-links a');window.addEventListener('scroll',()=>{let cur='';secs.forEach(s=>{if(window.scrollY>=s.offsetTop-120)cur=s.id;});navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+cur));},{passive:true});

// Particles (lightweight) — skip if reduced motion
if(!reducedMotion){(function(){const canvas=document.getElementById('particles');if(!canvas)return;const ctx=canvas.getContext('2d');let W=canvas.width=canvas.offsetWidth,H=canvas.height=canvas.offsetHeight,dots=[],rafId,active=true;function resize(){W=canvas.width=canvas.offsetWidth;H=canvas.height=canvas.offsetHeight;}window.addEventListener('resize',resize);for(let i=0;i<70;i++)dots.push({x:Math.random()*2000,y:Math.random()*900,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,r:Math.random()*1.5+.5,o:Math.random()*.4+.1});const heroObs=new IntersectionObserver(([e])=>{active=e.isIntersecting;if(active)draw();},{threshold:0});heroObs.observe(document.getElementById('hero'));function draw(){if(!active)return;ctx.clearRect(0,0,W,H);dots.forEach(d=>{d.x+=d.vx;d.y+=d.vy;if(d.x<0||d.x>W)d.vx*=-1;if(d.y<0||d.y>H)d.vy*=-1;ctx.beginPath();ctx.arc(d.x,d.y,d.r,0,Math.PI*2);ctx.fillStyle=`rgba(96,165,250,${d.o})`;ctx.fill();});dots.forEach((d,i)=>{for(let j=i+1;j<dots.length;j++){const dx=d.x-dots[j].x,dy=d.y-dots[j].y,dist=Math.sqrt(dx*dx+dy*dy);if(dist<120){ctx.beginPath();ctx.moveTo(d.x,d.y);ctx.lineTo(dots[j].x,dots[j].y);ctx.strokeStyle=`rgba(59,130,246,${.08*(1-dist/120)})`;ctx.lineWidth=.5;ctx.stroke();}}});rafId=requestAnimationFrame(draw);}draw();})();}

// Ensure functions exist for mobile nav references in HTML
window.toggleMobNav=toggleMobNav;window.closeMobNav=closeMobNav;window.toggleLang=toggleLang;