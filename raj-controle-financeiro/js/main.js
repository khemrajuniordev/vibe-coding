/* ── Custom Cursor ── */
const ring = document.getElementById('curRing');
const dot  = document.getElementById('curDot');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px'; dot.style.top = my + 'px';
});
(function animRing() {
  rx += (mx - rx) * 0.13;
  ry += (my - ry) * 0.13;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animRing);
})();
document.querySelectorAll('a,button,.feature-card,.goal-card,.stat-item,.metric-card,.step-item').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('big'));
  el.addEventListener('mouseleave', () => ring.classList.remove('big'));
});

/* ── Scroll Progress ── */
const prog = document.getElementById('prog');
window.addEventListener('scroll', () => {
  prog.style.width = (window.scrollY / (document.body.scrollHeight - innerHeight) * 100) + '%';
}, { passive: true });

/* ── Nav ── */
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 50), { passive: true });

/* ── Hero Canvas Particles ── */
const cvs = document.getElementById('hero-canvas');
const ctx = cvs.getContext('2d');
function resizeCvs() { cvs.width = cvs.offsetWidth; cvs.height = cvs.offsetHeight; }
resizeCvs();
window.addEventListener('resize', resizeCvs, { passive: true });

const PCOUNT = 85;
const pts = Array.from({ length: PCOUNT }, () => ({
  x: Math.random() * cvs.width,
  y: Math.random() * cvs.height,
  vx: (Math.random() - .5) * .35,
  vy: (Math.random() - .5) * .35,
  r: Math.random() * 1.4 + .4,
  a: Math.random() * .45 + .1
}));

function animPts() {
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  pts.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > cvs.width)  p.vx *= -1;
    if (p.y < 0 || p.y > cvs.height) p.vy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(30,200,122,${p.a})`;
    ctx.fill();
  });
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
      const d = Math.sqrt(dx*dx + dy*dy);
      if (d < 115) {
        ctx.beginPath();
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[j].x, pts[j].y);
        ctx.strokeStyle = `rgba(30,200,122,${.07 * (1 - d/115)})`;
        ctx.lineWidth = .5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animPts);
}
animPts();

/* ── Reveal on scroll ── */
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); } });
}, { threshold: .1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

/* ── Animated Bars ── */
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('.cat-bar-fill,.goal-progress-fill').forEach(bar => {
      const w = bar.dataset.w || '0%';
      bar.style.width = '0%';
      setTimeout(() => bar.style.width = w, 200);
    });
    barObs.unobserve(e.target);
  });
}, { threshold: .25 });
document.querySelectorAll('.categories-wrap,.goals-grid').forEach(el => barObs.observe(el));

/* ── 3D Tilt on Feature Cards ── */
document.querySelectorAll('.feature-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - .5;
    const y = (e.clientY - r.top)  / r.height - .5;
    card.style.transform = `translateY(-6px) rotateX(${-y*9}deg) rotateY(${x*9}deg)`;
  });
  card.addEventListener('mouseleave', () => card.style.transform = '');
});

/* ── Animated Counters ── */
const ctrObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.target;
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    if (isNaN(target)) return;
    const start = performance.now();
    const dur = 1600;
    (function tick(now) {
      const t = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      el.textContent = prefix + Math.floor(ease * target) + suffix;
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = prefix + target + suffix;
    })(start);
    ctrObs.unobserve(el);
  });
}, { threshold: .6 });
document.querySelectorAll('.metric-num[data-target]').forEach(el => ctrObs.observe(el));

/* ── Magnetic Buttons ── */
document.querySelectorAll('.btn-primary,.btn-ghost,.nav-cta').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width  / 2;
    const y = e.clientY - r.top  - r.height / 2;
    btn.style.transform = `translate(${x * .18}px,${y * .18}px)`;
  });
  btn.addEventListener('mouseleave', () => btn.style.transform = '');
});
