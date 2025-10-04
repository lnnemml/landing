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
    const email = document.getElementById('lead-email').value;

    statusMsg.textContent = 'Sending...';

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data.success) {
        statusMsg.textContent = '✓ Sent! Check your inbox soon.';
        leadForm.reset();
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (err) {
      statusMsg.textContent = 'Something went wrong. Try again later.';
      console.error('[LEAD_FORM_ERROR]', err);
    }
  });
}
