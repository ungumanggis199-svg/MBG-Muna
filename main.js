// ── Animated counters on scroll ───────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1200, step = 16;
  const inc = target / (duration / step);
  let cur = 0;
  const t = setInterval(() => {
    cur += inc;
    if (cur >= target) {
      el.textContent = target.toLocaleString('id-ID');
      clearInterval(t);
    } else {
      el.textContent = Math.floor(cur).toLocaleString('id-ID');
    }
  }, step);
}

const statVals = document.querySelectorAll('.stat-val[data-target]');
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { animateCounter(e.target); obs.unobserve(e.target); }
  });
}, { threshold: 0.4 });
statVals.forEach(el => obs.observe(el));

// ── Password toggle ───────────────────────────────────
function togglePw() {
  const inp = document.getElementById('pwInput');
  const ico = document.getElementById('eyeIco');
  if (inp.type === 'password') {
    inp.type = 'text';
    ico.innerHTML = `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>`;
  } else {
    inp.type = 'password';
    ico.innerHTML = `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
  }
}

// ── Navbar scroll effect ──────────────────────────────
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  nav.style.borderBottomColor = window.scrollY > 10
    ? 'rgba(200,168,75,0.35)'
    : 'rgba(200,168,75,0.2)';
});