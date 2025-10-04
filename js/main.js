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
