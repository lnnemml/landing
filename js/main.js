// main.js

// Scroll to COA section
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// GA4 event tracking (якщо підключено)
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

const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.getElementById('primary-nav');
if (navToggle && navLinks){
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}
