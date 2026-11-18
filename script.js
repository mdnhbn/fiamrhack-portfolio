const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  navigation?.classList.toggle("open", !isOpen);
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("open");
  });
});

const year = document.querySelector("#year");
if (year) year.textContent = String(new Date().getFullYear());

const motionToggle = document.querySelector("#motion-toggle");
const motionValue = motionToggle?.querySelector("span");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let motionEnabled = !prefersReducedMotion.matches;

function setMotion(enabled) {
  motionEnabled = enabled && !prefersReducedMotion.matches;
  document.body.classList.toggle("motion-paused", !motionEnabled);
  if (motionToggle) {
    motionToggle.setAttribute("aria-pressed", String(motionEnabled));
    motionToggle.setAttribute("aria-label", motionEnabled ? "Pause animations" : "Play animations");
  }
  if (motionValue) motionValue.textContent = motionEnabled ? "on" : "off";
}

setMotion(motionEnabled);
motionToggle?.addEventListener("click", () => setMotion(!motionEnabled));
prefersReducedMotion.addEventListener?.("change", (event) => setMotion(!event.matches));

const focusItems = ["Web application security", "Reconnaissance & OSINT", "Linux and platform security", "Evidence & responsible practice"];
const focusLabel = document.querySelector("#live-feed-value");
let focusIndex = 0;
let tickerTimer;

function startTicker() {
  window.clearInterval(tickerTimer);
  tickerTimer = window.setInterval(() => {
    if (!motionEnabled || !focusLabel) return;
    focusLabel.classList.add("is-changing");
    window.setTimeout(() => {
      focusIndex = (focusIndex + 1) % focusItems.length;
      focusLabel.textContent = focusItems[focusIndex];
      focusLabel.classList.remove("is-changing");
    }, 180);
  }, 3200);
}
startTicker();

const revealTargets = document.querySelectorAll(".reveal-section, .reveal-item");
if ("IntersectionObserver" in window && !prefersReducedMotion.matches) {
  revealTargets.forEach((target) => target.classList.add("reveal-ready"));
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealTargets.forEach((target) => revealObserver.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

const canvas = document.querySelector("#matrix-canvas");
const context = canvas?.getContext("2d");
if (canvas && context && !prefersReducedMotion.matches) {
  const glyphs = "01アイウエオカキクケコサシスセソ";
  const fontSize = 14;
  let columns = [];
  let width = 0;
  let height = 0;
  let frame = 0;

  function resizeCanvas() {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * pixelRatio);
    canvas.height = Math.floor(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    columns = Array.from({ length: Math.ceil(width / fontSize) }, () => Math.random() * -50);
  }

  function drawMatrix() {
    if (!motionEnabled) {
      frame = 0;
      return;
    }
    context.fillStyle = "rgba(8, 11, 16, 0.12)";
    context.fillRect(0, 0, width, height);
    context.font = `${fontSize}px monospace`;
    columns.forEach((position, index) => {
      const glyph = glyphs[Math.floor(Math.random() * glyphs.length)];
      context.fillStyle = index % 7 === 0 ? "rgba(127, 231, 238, 0.34)" : "rgba(183, 243, 107, 0.2)";
      context.fillText(glyph, index * fontSize, position * fontSize);
      columns[index] = position * fontSize > height && Math.random() > 0.982 ? -2 : position + 0.36;
    });
    frame = window.requestAnimationFrame(drawMatrix);
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas, { passive: true });
  motionToggle?.addEventListener("click", () => {
    if (motionEnabled && !frame) frame = window.requestAnimationFrame(drawMatrix);
    if (!motionEnabled && frame) {
      window.cancelAnimationFrame(frame);
      frame = 0;
    }
  });
  frame = window.requestAnimationFrame(drawMatrix);
}
