const fades = document.querySelectorAll('.fade');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.3 });

fades.forEach(el => observer.observe(el));

/* EMAIL INTERACTION */
const email = document.getElementById("email");
const msg = document.getElementById("copy-msg");

email.addEventListener("click", () => {
    navigator.clipboard.writeText("contact@elayro.com");

    msg.style.opacity = "1";

    setTimeout(() => {
        msg.style.opacity = "0";
    }, 1500);
});