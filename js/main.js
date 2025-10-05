// Scroll to sections by anchor
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// GA4 event: "See COA" CTA buttons
document.querySelectorAll(".cta-btn").forEach(button => {
  button.addEventListener("click", () => {
    if (typeof gtag !== "undefined") {
      gtag("event", "cta_click", {
        event_category: "engagement",
        event_label: "See COA",
        value: 1
      });
    }
  });
});

// GA4 event: "Order ISRIB A15 Now" — without preventing navigation
const buyBtn = document.querySelector('.pricing-cta .btn.btn-primary');
if (buyBtn) {
  buyBtn.addEventListener('click', () => {
    if (typeof gtag === 'function') {
      gtag('event', 'go_to_main_site', {
        event_category: 'Navigation',
        event_label: 'From Landing to Main Site'
      });
    }
  }, { passive: true });
}

// Lead form submission
const leadForm = document.getElementById('lead-form');
const statusMsg = document.getElementById('lead-status');

if (leadForm) {
  leadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('lead-email').value.trim();
    statusMsg.textContent = 'Sending...';

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        statusMsg.textContent = '✓ Sent! Check inbox soon.';
        leadForm.reset();
      } else {
        statusMsg.textContent = `Error: ${data?.error || res.status}`;
      }
    } catch (err) {
      console.error('[LEAD_FORM_ERROR]', err);
      statusMsg.textContent = 'Network error. Try again.';
    }
  });
}

// Hide sticky CTA when order section is in view
const sticky = document.getElementById('sticky-cta');
const order  = document.getElementById('order');
if (sticky && order){
  const io = new IntersectionObserver(([e]) => {
    sticky.style.display = e.isIntersecting ? 'none' : 'flex';
  }, { threshold: 0.2 });
  io.observe(order);
}

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.getElementById('primary-nav');
if (navToggle && navLinks){
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

// Track button click without interrupting native navigation (autodecorate enabled)
const buyBtn = document.querySelector('.pricing-cta .btn.btn-primary');
if (buyBtn) {
  buyBtn.addEventListener('click', () => {
    if (typeof gtag === 'function') {
      gtag('event', 'go_to_main_site', {
        event_category: 'Navigation',
        event_label: 'From Landing to Main Site'
      });
    }
  }, { passive: true });
}
