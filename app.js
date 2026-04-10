// Smooth reveal on scroll
const revealElements = document.querySelectorAll('.content section, .divider, .email-box');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealElements.forEach(el => observer.observe(el));

// Email notify button activation
const emailInput = document.getElementById('email');
const botCheck = document.getElementById('botcheck');
const notifyBtn = document.getElementById('notify');

function toggleNotify() {
  if (emailInput.value.includes('@') && botCheck.checked) {
    notifyBtn.disabled = false;
    notifyBtn.classList.add('glow');
    notifyBtn.style.cursor = 'pointer';
  } else {
    notifyBtn.disabled = true;
    notifyBtn.classList.remove('glow');
    notifyBtn.style.cursor = 'not-allowed';
  }
}

emailInput.addEventListener('input', toggleNotify);
botCheck.addEventListener('change', toggleNotify);

// Parallax header effect
document.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  const scrollY = window.scrollY;
  header.style.transform = `translateY(${scrollY * 0.2}px)`;
});
