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
     CINEMATIC DEMO SYSTEM
     ========================= */

  const chatBox = document.getElementById("chatBox");
  const clientTabs = document.querySelectorAll(".clients .client");
  const optionsPanel = document.getElementById("optionsPanel");
  const input = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");
  const demoContainer = document.querySelector(".demo-container");

  if (!chatBox || !optionsPanel || !input || !sendBtn) return;

  let activeClient = 0;
  let chats = { 0: [], 1: [] };

  const wait = (t) => new Promise(res => setTimeout(res, t));

  input.addEventListener("focus", e => e.target.blur());
  sendBtn.addEventListener("click", e => e.preventDefault());

  function updateTabs() {
    clientTabs.forEach((t, i) => t.classList.toggle("active", i === activeClient));
  }

  function renderChat(i) {
    chatBox.innerHTML = "";
    chats[i].forEach(m => {
      const d = document.createElement("div");
      d.className = `message ${m.type}`;
      d.innerText = m.text;
      chatBox.appendChild(d);
    });
  }

  function addMessage(text, type) {
    chats[activeClient].push({ text, type });

    const d = document.createElement("div");
    d.className = `message ${type}`;
    d.innerText = text;

    chatBox.appendChild(d);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  async function switchClient(i) {
    activeClient = i;
    await wait(300);
    updateTabs();
    await wait(250);
    renderChat(i);
    await wait(300);
  }

  function setFocus(state) {
    if (!demoContainer) return;
    demoContainer.classList.toggle("focus-mode", state);
  }

  async function typeMessage(text) {
    setFocus(true);
    input.classList.add("typing-active");

    input.value = "";

    for (let i = 0; i < text.length; i++) {
      input.value += text[i];
      await wait(28 + Math.random() * 18);
    }

    await wait(400);

    sendBtn.classList.add("press");
    await wait(120);
    sendBtn.classList.remove("press");

    addMessage(text, "user");

    input.value = "";
    input.classList.remove("typing-active");

    await wait(600);
  }

  function generateOptions(msg) {
    const lower = msg.toLowerCase();

    if (lower.includes("pricing")) {
      return [
        "Here’s a clear breakdown so you know exactly what to expect.",
        "Let me outline pricing so we can move forward quickly.",
        "I can share pricing details if that helps.",
        "Yeah, I’ll explain pricing simply."
      ];
    }

    if (lower.includes("silent")) {
      return [
        "Just checking in — does this still make sense for you?",
        "Following up to keep things moving.",
        "Happy to revisit whenever you're ready.",
        "Hey, just checking in."
      ];
    }

    return [
      "Got it — I’ll take this forward clearly.",
      "Let’s move ahead from here.",
      "We can continue step by step.",
      "Alright, let’s go ahead."
    ];
  }

  async function showOptions(msg) {

    setFocus(true);

    optionsPanel.innerHTML = '<div class="thinking"></div>';
    await wait(900);

    optionsPanel.innerHTML = "";

    const options = generateOptions(msg);
    const elements = [];

    for (let i = 0; i < options.length; i++) {
      const div = document.createElement("div");
      div.className = "option-btn";
      div.innerHTML = `<strong class="tag">${["Best","Strong","Safe","Casual"][i]}</strong><br>${options[i]}`;
      optionsPanel.appendChild(div);
      elements.push(div);
      await wait(260);
    }

    await wait(1200);

    elements[0].classList.add("best-glow");

    await wait(400);

    elements[0].classList.add("selected");

    await wait(400);

    optionsPanel.innerHTML = "";
    addMessage(options[0], "system");

    await wait(800);

    setFocus(false);
  }

  async function runDemo() {

    const flows = {
      0: [
        { msg: "Client asked about pricing" },
        { msg: "Client wants clarity on scope" },
        { msg: "Client is evaluating options" },
        { msg: "Client requested final confirmation" },
        { msg: "Client is ready to proceed", outcome: "win" }
      ],
      1: [
        { msg: "Client asked if flexible" },
        { msg: "Client said maybe next week" },
        { msg: "Client stopped replying" },
        { msg: "Follow-up attempt", outcome: "lose" }
      ]
    };

    const progress = { 0: 0, 1: 0 };
    let active = 0;

    chatBox.innerHTML = "";
    optionsPanel.innerHTML = "";

    while (progress[0] < 5 || progress[1] < 4) {

      active = active === 0 ? 1 : 0;

      if (progress[active] >= flows[active].length) {
        active = active === 0 ? 1 : 0;
      }

      await switchClient(active);

      const step = flows[active][progress[active]];

      await typeMessage(step.msg);
      await wait(800);
      await showOptions(step.msg);

      progress[active]++;

      if (step.outcome === "win") {
        addMessage("Deal closed successfully.", "system");
        await wait(1200);
      }

      if (step.outcome === "lose") {
        addMessage("Conversation lost due to inactivity.", "system");
        await wait(1200);
      }

      await wait(1400);
    }

    await wait(5000);
  }

  runDemo();

});

/* =========================
   NOTIFY SYSTEM (UNCHANGED)
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
