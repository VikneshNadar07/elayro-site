// Cursor
const cursor = document.querySelector(".cursor");

document.addEventListener("mousemove", (e) => {
  cursor.style.top = e.clientY + "px";
  cursor.style.left = e.clientX + "px";
  cursor.style.transform = "translate(-50%, -50%) scale(1)";
});

document.addEventListener("mousedown", () => {
  cursor.style.transform = "translate(-50%, -50%) scale(0.8)";
});

document.addEventListener("mouseup", () => {
  cursor.style.transform = "translate(-50%, -50%) scale(1)";
});

// Reveal
const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, { threshold: 0.3 });

reveals.forEach(el => observer.observe(el));

// Lenis Smooth Scroll
const lenis = new Lenis({
  duration: 1.4,
  smooth: true,
  easing: (t) => 1 - Math.pow(1 - t, 3),
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);