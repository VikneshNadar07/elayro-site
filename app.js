// 🔥 LOAD FIX
document.documentElement.classList.add("loaded");

document.addEventListener("DOMContentLoaded", () => {

  document.body.classList.add("loaded");

  /* =========================
     GLOBAL NAV SYSTEM
     ========================= */

  const navLinks = document.querySelectorAll(".nav-minimal a");

  let currentPage = window.location.pathname.split("/").pop();
  if (!currentPage || currentPage === "") currentPage = "index.html";

  navLinks.forEach(link => {
    const href = link.getAttribute("href");

    if (href === currentPage) {
      link.style.display = "none";
    }

    link.addEventListener("click", function (e) {
      if (!href || href.startsWith("#")) return;

      e.preventDefault();
      document.body.classList.add("fade-out");

      setTimeout(() => {
        window.location.href = href;
      }, 300);
    });
  });

  /* =========================
     SCROLL PROGRESS
     ========================= */

  const progressBar = document.querySelector(".scroll-progress");

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;

    if (progressBar) progressBar.style.width = progress + "%";
  });

  /* =========================
     SECTION REVEAL
     ========================= */

  const sections = document.querySelectorAll("section");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.2 });

  sections.forEach(section => observer.observe(section));

  /* =========================
     FOOTER REVEAL
     ========================= */

  const footer = document.querySelector(".footer-global");

  if (footer) {
    const footerObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    }, { threshold: 0.2 });

    footerObserver.observe(footer);
  }

  /* =========================
     DEMO SYSTEM
     ========================= */

  const chatBox = document.getElementById("chatBox");
  const clientTabs = document.querySelectorAll(".clients .client");
  const optionsPanel = document.getElementById("optionsPanel");
  const input = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");

  if (chatBox && optionsPanel && input && sendBtn) {

    let activeClient = 0;
    let chats = { 0: [], 1: [] };

    const wait = (t) => new Promise(res => setTimeout(res, t));
    const readTime = (t) => Math.max(1200, t.length * 35);

    input.addEventListener("focus", e => e.target.blur());
    sendBtn.addEventListener("click", e => e.preventDefault());

    function updateTabs() {
      clientTabs.forEach((t, i) => t.classList.toggle("active", i === activeClient));
    }

    function renderChat(i) {
      chatBox.innerHTML = "";
      chats[i].forEach(m => {
        const d = document.createElement("div");
        d.className = `message ${m.type} fade-in-up`;
        d.innerText = m.text;
        chatBox.appendChild(d);
      });
    }

    function addMessage(text, type) {
      chats[activeClient].push({ text, type });

      const d = document.createElement("div");
      d.className = `message ${type} fade-in-up`;
      d.innerText = text;

      chatBox.appendChild(d);
      chatBox.scrollTop = chatBox.scrollHeight;
    }

    function clickButton(btn) {
      btn.classList.add("press");
      setTimeout(() => btn.classList.remove("press"), 120);
    }

    /* 🔥 HUMAN RESPONSES */
    function generateOptions(msg) {
      const lower = msg.toLowerCase();

      if (lower.includes("busy") || lower.includes("later")) {
        return [
          "Got it — I’ll keep this short so it’s easy to pick up later.",
          "No problem, we can reconnect when you have more time.",
          "All good, I’ll follow up at a better time.",
          "Makes sense, we can continue this later."
        ];
      }

      if (lower.includes("pricing")) {
        return [
          "I’ll break it down clearly so you know exactly what to expect.",
          "Let me give you a simple overview of pricing.",
          "We can adjust based on what you need.",
          "I can share a quick range for clarity."
        ];
      }

      if (lower.includes("discount") || lower.includes("flex")) {
        return [
          "We can definitely adjust this to make it work for you.",
          "Let’s find something that fits your range.",
          "There’s flexibility depending on scope.",
          "We can tweak this as needed."
        ];
      }

      if (lower.includes("unsure")) {
        return [
          "Totally fair — what would you like me to clarify?",
          "Happy to walk you through anything unclear.",
          "Let me simplify it for you.",
          "Take your time — no pressure."
        ];
      }

      if (lower.includes("proceed")) {
        return [
          "Great — I’ll get everything set up.",
          "Perfect, I’ll move this forward.",
          "Sounds good — let’s get started.",
          "Alright, I’ll begin the process."
        ];
      }

      if (lower.includes("silent")) {
        return [
          "Just checking in — does this still make sense?",
          "Wanted to follow up in case this is still relevant.",
          "Happy to revisit whenever you're ready.",
          "No rush — just checking."
        ];
      }

      return [
        "Got it — I’ll take this forward.",
        "Makes sense, let’s move ahead.",
        "Alright, we’ll continue from here.",
        "Okay, I’ll handle the next step."
      ];
    }

    async function showOptions(msg) {
      const list = generateOptions(msg);

      optionsPanel.innerHTML = "";
      const buttons = [];

      list.forEach(t => {
        const b = document.createElement("div");
        b.className = "option-btn";
        b.innerText = t;
        optionsPanel.appendChild(b);
        buttons.push(b);
      });

      await wait(400);

      const selected = buttons[Math.floor(Math.random() * buttons.length)];
      selected.classList.add("selected");

      await wait(250);

      optionsPanel.innerHTML = "";
      addMessage(selected.innerText, "system");
    }

    async function simulateUser(text) {
      await wait(200);

      input.value = text;
      await wait(250);

      clickButton(sendBtn);

      input.value = "";
      addMessage(text, "user");
    }

    async function runDemo() {
      while (true) {

        chats = { 0: [], 1: [] };

        activeClient = 0;
        updateTabs();
        renderChat(0);

        const flow = [
          "Client asked about pricing",
          "Client asked for flexibility",
          "Client is evaluating options",
          "Client went silent"
        ];

        for (let msg of flow) {
          await simulateUser(msg);
          await wait(readTime(msg));
          await showOptions(msg);
        }

        addMessage("Outcome achieved.", "system");

        await wait(3000);

        chatBox.innerHTML = "";
        optionsPanel.innerHTML = "";
      }
    }

    runDemo();
  }

});

/* =========================
   NOTIFY SYSTEM (FIXED)
   ========================= */

document.addEventListener("DOMContentLoaded", () => {

  const notifyBtn = document.getElementById("notifyBtn");
  const notifyEmail = document.getElementById("notifyEmail");
  const notifySuccess = document.getElementById("notifySuccess");

  if (!notifyBtn || !notifyEmail || !notifySuccess) return;

  notifyBtn.addEventListener("click", async () => {

    const email = notifyEmail.value.trim();

    if (!email || !email.includes("@")) {
      notifySuccess.innerText = "Invalid email address";
      notifySuccess.classList.add("show");
      return;
    }

    notifyBtn.innerText = "Adding...";
    notifyBtn.disabled = true;

    try {
      const res = await fetch("https://elayro-notify.vikneshgaming07.workers.dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await res.json().catch(() => ({}));

      if (data.status === "exists") {
        notifySuccess.innerText = "Already registered";
      } else {
        notifySuccess.innerText = "You’re in";
      }

      notifySuccess.classList.add("show");
      notifyEmail.value = "";
      notifyBtn.innerText = "Added";

    } catch {
      notifySuccess.innerText = "Try again";
      notifySuccess.classList.add("show");

      notifyBtn.innerText = "Retry";
      notifyBtn.disabled = false;
    }
  });

});
