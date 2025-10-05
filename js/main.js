/* ========================= CONFIG ========================= */
const GA_ID = 'G-DV41FBCRCM'; // ← замініть, якщо у вас інший GA4 ID для ЛЕНДІНГУ

/* =============== Smooth scroll by anchors ================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth" });
  }, { passive: true });
});

/* ================== GA: CTA "See COA" ==================== */
document.querySelectorAll(".cta-btn").forEach(button => {
  button.addEventListener("click", () => {
    if (typeof gtag === "function") {
      gtag("event", "cta_click", {
        event_category: "engagement",
        event_label: "See COA",
        value: 1
      });
    }
  }, { passive: true });
});

/* ====== Order button: fast redirect + GA + _gl linker ====== */
(function wireOrderCta() {
  const buyBtn = document.querySelector('.pricing-cta .btn.btn-primary');
  if (!buyBtn) return;

  buyBtn.addEventListener('click', (e) => {
    const href = buyBtn.getAttribute('href');
    if (!href) return;
    e.preventDefault(); // контролюємо навігацію самі

    let redirected = false;
    const go = (url) => {
      if (redirected) return;
      redirected = true;
      window.location.assign(url);
    };

    // 1) Відправляємо подію в GA без блокування мережі
    if (typeof gtag === 'function') {
      gtag('event', 'go_to_main_site', {
        event_category: 'Navigation',
        event_label: 'From Landing to Main Site',
        transport_type: 'beacon'
      });
    }

    // 2) Просимо у GA лінкер‑параметр і додаємо його до URL (щоб гарантовано був ?_gl=...)
    if (typeof gtag === 'function' && GA_ID) {
      try {
        gtag('get', GA_ID, 'linker_param', function(param) {
          const decorated = href + (href.includes('?') ? '&' : '?') + param;
          go(decorated);
        });
      } catch {
        // якщо щось пішло не так — ідемо звичайним шляхом
        go(href);
      }
    } else {
      go(href);
    }

    // 3) Фолбек, якщо GA завис або мережа тупила
    setTimeout(() => go(href), 1200);
  });
})();

/* ================= Lead form (optional) ================== */
const leadForm = document.getElementById('lead-form');
const statusMsg = document.getElementById('lead-status');

if (leadForm) {
  leadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('lead-email').value.trim();
    if (statusMsg) statusMsg.textContent = 'Sending...';

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        if (statusMsg) statusMsg.textContent = '✓ Sent! Check inbox soon.';
        leadForm.reset();
      } else {
        if (statusMsg) statusMsg.textContent = `Error: ${data?.error || res.status}`;
      }
    } catch (err) {
      console.error('[LEAD_FORM_ERROR]', err);
      if (statusMsg) statusMsg.textContent = 'Network error. Try again.';
    }
  });
}

/* ===== Sticky CTA hide when #order is visible (optional) ===== */
const sticky = document.getElementById('sticky-cta');
const order  = document.getElementById('order');
if (sticky && order){
  const io = new IntersectionObserver(([en]) => {
    sticky.style.display = en.isIntersecting ? 'none' : 'flex';
  }, { threshold: 0.2 });
  io.observe(order);
}

/* ================= Mobile nav toggle (optional) ================= */
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.getElementById('primary-nav');
if (navToggle && navLinks){
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}
