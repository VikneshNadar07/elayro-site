const sections = document.querySelectorAll(".section");
const hero = document.getElementById("hero");

/* SCROLL ENGINE */
window.addEventListener("scroll", () => {

  const scrollY = window.scrollY;

  /* HERO SHRINK */
  if (scrollY > 80) {
    hero.classList.add("shrink");
  } else {
    hero.classList.remove("shrink");
  }

  sections.forEach((section, i) => {

    const rect = section.getBoundingClientRect();

    /* ENTER VIEW */
    if (rect.top < window.innerHeight - 100) {
      section.classList.add("visible");

      const tilt = (i % 2 === 0 ? 1 : -1) * 0.5;

      section.style.transform =
        `translateY(0px) scale(1) rotate(${tilt}deg)`;
    }

    /* ACTIVE CENTER SHRINK */
    if (
      rect.top < window.innerHeight / 2 &&
      rect.bottom > window.innerHeight / 2
    ) {
      section.classList.add("active");
    } else {
      section.classList.remove("active");
    }

  });

});

/* GLOW FOLLOW */
const glow = document.querySelector(".glow");

document.addEventListener("mousemove", (e) => {
  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";
});

/* BLOCK COPY */
document.addEventListener("contextmenu", e => e.preventDefault());

document.addEventListener("keydown", e => {
  if (e.ctrlKey && (e.key === "c" || e.key === "u")) {
    e.preventDefault();
  }
});