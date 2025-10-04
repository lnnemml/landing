// Smooth anchor scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const id = a.getAttribute("href");
    if (!id || id === "#") return;
    const el = document.querySelector(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("revealed");
  });
}, { threshold: 0.18 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// Modal (native <dialog>)
document.querySelectorAll("[data-open]").forEach(btn => {
  btn.addEventListener("click", () => {
    const id = btn.getAttribute("data-open");
    const dlg = document.getElementById(id);
    if (dlg && typeof dlg.showModal === "function") dlg.showModal();
  });
});
document.querySelectorAll("[data-close]").forEach(btn => {
  btn.addEventListener("click", () => {
    const id = btn.getAttribute("data-close");
    const dlg = document.getElementById(id);
    if (dlg && typeof dlg.close === "function") dlg.close();
  });
});

// GA4 event helpers
function gaEvent(name, params = {}) {
  try { if (typeof gtag === "function") gtag("event", name, params); } catch(e){}
}
// Track buttons with data-gtag
document.querySelectorAll("[data-gtag]").forEach(el => {
  el.addEventListener("click", () => {
    const label = el.getAttribute("data-gtag");
    gaEvent(label || "cta_click", { location: label });
  });
});

// Scroll depth (25/50/75/90)
(function trackScrollDepth(){
  const marks = [25,50,75,90]; let passed = new Set();
  const onScroll = () => {
    const h = document.documentElement; 
    const scrolled = (h.scrollTop || document.body.scrollTop) / ((h.scrollHeight - h.clientHeight) || 1) * 100;
    marks.forEach(m => {
      if (scrolled >= m && !passed.has(m)) {
        passed.add(m); gaEvent("scroll_depth", { percent: m });
      }
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
})();

// UTM carryover → when linking to dev.isrib.shop, append current UTM
(function utmCarry(){
  const params = new URLSearchParams(window.location.search);
  if (![...params.keys()].some(k => k.startsWith("utm_"))) return;
  document.querySelectorAll('a[href*="dev.isrib.shop"]').forEach(a => {
    const url = new URL(a.href);
    ["utm_source","utm_medium","utm_campaign","utm_content","utm_term"].forEach(k=>{
      if (params.has(k)) url.searchParams.set(k, params.get(k));
    });
    a.href = url.toString();
  });
})();
