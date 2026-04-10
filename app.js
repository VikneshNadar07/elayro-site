// Smooth Scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
  });
});

// Button Ripple Effect
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const circle = document.createElement('span');
    const diameter = Math.max(this.clientWidth, this.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - this.offsetLeft - radius}px`;
    circle.style.top = `${e.clientY - this.offsetTop - radius}px`;
    circle.classList.add('ripple');

    const ripple = this.getElementsByClassName('ripple')[0];
    if (ripple) ripple.remove();

    this.appendChild(circle);
  });
});

// Section Reveal on Scroll
const revealSections = document.querySelectorAll('section');
const revealOptions = { threshold: 0.15 };

const revealOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, revealOptions);

revealSections.forEach(section => {
  revealOnScroll.observe(section);
});
