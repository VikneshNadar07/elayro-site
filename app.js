// 🔥 SAFETY FIX
document.documentElement.classList.add("loaded");

document.addEventListener("DOMContentLoaded", () => {

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
     NAV SCROLL EFFECT
     ========================= */

  const nav = document.querySelector(".nav-minimal");

  window.addEventListener("scroll", () => {
    if (!nav) return;

    if (window.scrollY > 40) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
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
     ELEMENTS
     ========================= */

  const chatBox = document.getElementById("chatBox");
  const clientTabs = document.querySelectorAll(".clients .client");
  const optionsPanel = document.getElementById("optionsPanel");
  const input = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");

  if (!chatBox || !optionsPanel || !input || !sendBtn) return;

  let activeClient = 0;
  let chats = { 0: [], 1: [] };

  const wait = (t) => new Promise(res => setTimeout(res, t));
  const readTime = (t) => Math.max(1400, t.length * 40);

  input.addEventListener("focus", e => e.target.blur());
  sendBtn.addEventListener("click", e => e.preventDefault());

  /* =========================
     CHAT
     ========================= */

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
    chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: "smooth" });
  }

  /* =========================
     BUTTON CLICK ANIMATION
     ========================= */

  function clickButton(btn) {
    btn.classList.add("press");
    setTimeout(() => btn.classList.remove("press"), 120);
  }

  /* =========================
     OPTIONS (ORDERED + HUMAN)
     ========================= */

  function generateOptions(msg) {

    const lower = msg.toLowerCase();

    if (lower.includes("busy") || lower.includes("later")) {
      return [
        "No worries — I’ll keep this quick and simple.",
        "All good, we can pick this up when you're free.",
        "Happy to follow up later if that works better.",
        "Cool, let’s connect another time."
      ];
    }

    if (lower.includes("pricing") || lower.includes("cost")) {
      return [
        "I’ll break it down clearly so you can decide fast.",
        "Let me give you a quick overview of how it works.",
        "We can adjust it depending on what you need.",
        "I can share a rough range if that helps."
      ];
    }

    if (lower.includes("discount") || lower.includes("flex")) {
      return [
        "We can definitely make this work within your range.",
        "Let’s find a setup that fits what you’re comfortable with.",
        "There’s some flexibility depending on scope.",
        "We can tweak things if needed."
      ];
    }

    if (lower.includes("soon") || lower.includes("urgent")) {
      return [
        "Yes — we can get started right away.",
        "We’re ready to move on this immediately.",
        "We can begin as early as this week.",
        "Shouldn’t be an issue to start soon."
      ];
    }

    if (lower.includes("unsure") || lower.includes("think")) {
      return [
        "Totally fair — what part would you like me to clarify?",
        "Happy to walk you through anything that's unclear.",
        "Let me simplify it for you.",
        "Take your time, no pressure."
      ];
    }

    if (lower.includes("stop") || lower.includes("silent")) {
      return [
        "Just checking in — does this still make sense for you?",
        "Wanted to follow up in case this is still relevant.",
        "Happy to revisit whenever you're ready.",
        "No rush at all — just thought I’d check."
      ];
    }

    if (lower.includes("proceed") || lower.includes("start")) {
      return [
        "Great — I’ll get everything set up and started.",
        "Perfect, I’ll move this forward from here.",
        "Sounds good — let’s begin.",
        "Alright, let’s get this going."
      ];
    }

    return [
      "Got it — I’ll take it forward.",
      "Makes sense, let’s move ahead.",
      "Alright, we can work with that.",
      "Okay, noted."
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

    await wait(500);

    // 🎯 weighted random selection
    const r = Math.random();
    let index = r < 0.5 ? 0 : r < 0.75 ? 1 : r < 0.9 ? 2 : 3;

    const selected = buttons[index];
    selected.classList.add("selected");

    await wait(300);

    optionsPanel.innerHTML = "";
    addMessage(selected.innerText, "system");
  }

  /* =========================
     SIMULATION
     ========================= */

  async function simulateUser(text) {
    await wait(250);

    input.value = text;
    await wait(300);

    clickButton(sendBtn);

    input.value = "";
    addMessage(text, "user");
  }

  /* =========================
     DEMO FLOW
     ========================= */

  async function runDemo() {
    while (true) {

      chats = { 0: [], 1: [] };

      activeClient = 0;
      updateTabs();
      renderChat(0);

      let msg;

      msg = "Client said they are busy this week";
      await simulateUser(msg);
      await wait(readTime(msg));
      await showOptions(msg);

      msg = "Client asked to follow up later";
      await simulateUser(msg);
      await wait(readTime(msg));
      await showOptions(msg);

      activeClient = 1;
      updateTabs();
      renderChat(1);

      msg = "Client asked about pricing";
      await simulateUser(msg);
      await wait(readTime(msg));
      await showOptions(msg);

      msg = "Client asked for discount";
      await simulateUser(msg);
      await wait(readTime(msg));
      await showOptions(msg);

      activeClient = 0;
      updateTabs();
      renderChat(0);

      msg = "Client is unsure and needs clarity";
      await simulateUser(msg);
      await wait(readTime(msg));
      await showOptions(msg);

      msg = "Client said let's proceed";
      await simulateUser(msg);
      await wait(readTime(msg));
      await showOptions(msg);

      addMessage("Outcome achieved.", "system");

      activeClient = 1;
      updateTabs();
      renderChat(1);

      msg = "Client is comparing alternatives";
      await simulateUser(msg);
      await wait(readTime(msg));
      await showOptions(msg);

      msg = "Client stopped responding";
      await simulateUser(msg);
      await wait(readTime(msg));
      await showOptions(msg);

      addMessage("Conversation ended.", "system");

      await wait(3000);

      chatBox.innerHTML = "";
      optionsPanel.innerHTML = "";
    }
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

  if (!notifyBtn || !notifyEmail) return;

  notifyBtn.addEventListener("click", async () => {

    const email = notifyEmail.value.trim();

    if (!email || !email.includes("@")) {
      alert("Enter valid email");
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

      if (!res.ok) throw new Error();

      notifySuccess.classList.add("show");
      notifyEmail.value = "";
      notifyBtn.innerText = "Added";

    } catch {
      notifyBtn.innerText = "Retry";
      notifyBtn.disabled = false;
    }
  });

});
