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

  /* =========================
     STATE SYSTEM
     ========================= */

  function getNextState(current) {
    const transitions = {
      pricing: ["scope", "evaluating"],
      scope: ["evaluating", "engaged"],
      evaluating: ["engaged", "delayed"],
      engaged: ["closing", "ghosting"],
      delayed: ["followup", "ghosting"],
      followup: ["engaged", "ghosting"],
      ghosting: ["followup", "lost"],
      closing: ["won"]
    };
    const next = transitions[current] || ["evaluating"];
    return next[Math.floor(Math.random() * next.length)];
  }

  function getMessageFromState(state) {
    const map = {
      pricing: "Client asked about pricing",
      scope: "Client wants clarity on scope",
      evaluating: "Client is evaluating options",
      engaged: "Client is actively engaging",
      delayed: "Client said maybe later",
      ghosting: "Client stopped replying",
      followup: "Follow-up attempt",
      closing: "Client is ready to proceed"
    };
    return map[state];
  }

  function generateOptions(state) {
    const responses = {
      pricing: [
        "Here’s a clear breakdown so you know exactly what to expect.",
        "Let me outline pricing so we can move forward quickly.",
        "I can share pricing details if that helps.",
        "I’ll explain it simply."
      ],
      scope: [
        "Let me clearly define the scope so everything is aligned.",
        "I’ll break down exactly what’s included.",
        "We can go step by step to clarify this.",
        "I’ll simplify it for you."
      ],
      evaluating: [
        "Take your time — I can help you compare options clearly.",
        "Happy to guide you through what fits best.",
        "Let me simplify the decision.",
        "We can narrow this down quickly."
      ],
      engaged: [
        "Great — let’s move this forward step by step.",
        "We’re aligned, I’ll take this ahead.",
        "Let’s build on this momentum.",
        "We’re progressing well."
      ],
      delayed: [
        "No problem — I’ll follow up at a better time.",
        "All good, we can continue when you're ready.",
        "I’ll check back in shortly.",
        "We’ll pick this up later."
      ],
      ghosting: [
        "Just checking in — does this still make sense?",
        "Following up to keep things moving.",
        "Happy to revisit when you're ready.",
        "Hey — just checking in."
      ],
      followup: [
        "Circling back — wanted to keep this moving.",
        "Following up to reconnect on this.",
        "Let’s pick this back up.",
        "Checking in again here."
      ],
      closing: [
        "Perfect — I’ll lock everything in and proceed.",
        "Great, I’ll finalize this now.",
        "We’re good to go — I’ll take it forward.",
        "Let’s get this started."
      ]
    };

    return responses[state] || ["Let’s move forward."];
  }

  function getOutcomeReason(history, result) {
    const last = history.slice(-3).join(" ");

    if (result === "win") {
      if (last.includes("closing")) return "Closed due to strong alignment and timely execution.";
      return "Won through consistent engagement.";
    }

    if (result === "lost") {
      if (last.includes("ghosting")) return "Lost due to repeated drop-offs.";
      return "Lost due to lack of momentum.";
    }

    return "";
  }

  async function showDynamicOptions(state) {
    setFocus(true);

    optionsPanel.innerHTML = '<div class="thinking"></div>';
    await wait(900);

    optionsPanel.innerHTML = "";

    const options = generateOptions(state);
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

    setFocus(false);
  }

  async function runDemo() {

    const clients = {
      0: { state: "pricing", done: false, history: [] },
      1: { state: "pricing", done: false, history: [] }
    };

    chatBox.innerHTML = "";
    optionsPanel.innerHTML = "";

    while (!clients[0].done || !clients[1].done) {

      for (let i = 0; i < 2; i++) {

        if (clients[i].done) continue;

        await switchClient(i);

        const state = clients[i].state;
        clients[i].history.push(state);

        const msg = getMessageFromState(state);

        await typeMessage(msg);
        await wait(800);

        await showDynamicOptions(state);
        await wait(1200);

        const next = getNextState(state);

        if (next === "won") {
          addMessage("Deal closed successfully.", "system");
          await wait(600);
          addMessage(getOutcomeReason(clients[i].history, "win"), "system");
          clients[i].done = true;
          continue;
        }

        if (next === "lost") {
          addMessage("Conversation lost.", "system");
          await wait(600);
          addMessage(getOutcomeReason(clients[i].history, "lost"), "system");
          clients[i].done = true;
          continue;
        }

        clients[i].state = next;
      }
    }

    await wait(5000);
  }

  runDemo();

});

/* =========================
   NOTIFY SYSTEM
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
