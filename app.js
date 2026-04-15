// 🔥 LOAD FIX
document.documentElement.classList.add("loaded");

document.addEventListener("DOMContentLoaded", () => {

  document.body.classList.add("loaded");

  /* =========================
     GLOBAL NAV + SCROLL
     ========================= */

  const navLinks = document.querySelectorAll(".nav-minimal a");

  let currentPage = window.location.pathname.split("/").pop();
  if (!currentPage || currentPage === "") currentPage = "index.html";

  navLinks.forEach(link => {
    const href = link.getAttribute("href");

    if (href === currentPage) link.style.display = "none";

    link.addEventListener("click", function (e) {
      if (!href || href.startsWith("#")) return;

      e.preventDefault();
      document.body.classList.add("fade-out");

      setTimeout(() => window.location.href = href, 300);
    });
  });

  const progressBar = document.querySelector(".scroll-progress");

  window.addEventListener("scroll", () => {
    const progress =
      window.scrollY /
      (document.body.scrollHeight - window.innerHeight);

    if (progressBar) progressBar.style.width = progress * 100 + "%";
  });

  /* =========================
     DEMO CORE
     ========================= */

  const chatBox = document.getElementById("chatBox");
  const clientTabs = document.querySelectorAll(".clients .client");
  const optionsPanel = document.getElementById("optionsPanel");
  const input = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");
  const demoContainer = document.querySelector(".demo-container");

  if (!chatBox) return;

  let activeClient = 0;
  let chats = { 0: [], 1: [] };

  const wait = (t) => new Promise(res => setTimeout(res, t));

  function updateTabs() {
    clientTabs.forEach((t, i) =>
      t.classList.toggle("active", i === activeClient)
    );
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
      await wait(25 + Math.random() * 20);
    }

    await wait(300);

    sendBtn.classList.add("press");
    await wait(120);
    sendBtn.classList.remove("press");

    addMessage(text, "user");

    input.value = "";
    input.classList.remove("typing-active");

    await wait(600);
  }

  function getNextState(current) {
    const map = {
      pricing: ["scope", "evaluating"],
      scope: ["evaluating", "engaged"],
      evaluating: ["engaged", "delayed"],
      engaged: ["closing", "ghosting"],
      delayed: ["followup", "ghosting"],
      followup: ["engaged", "ghosting"],
      ghosting: ["followup", "lost"],
      closing: ["won"]
    };
    const next = map[current] || ["evaluating"];
    return next[Math.floor(Math.random() * next.length)];
  }

  function getMessageFromState(state) {
    return {
      pricing: "Client asked about pricing",
      scope: "Client wants clarity on scope",
      evaluating: "Client is evaluating options",
      engaged: "Client is actively engaging",
      delayed: "Client said maybe later",
      ghosting: "Client stopped replying",
      followup: "Following up again",
      closing: "Client is ready to proceed"
    }[state];
  }

  function generateOptions(state) {
    return {
      pricing: [
        "Here’s a clear breakdown so you know exactly what to expect.",
        "Let me outline pricing so we can move forward quickly.",
        "I can share pricing details if that helps.",
        "I’ll explain it simply."
      ],
      scope: [
        "Let me clearly define the scope so everything is aligned.",
        "I’ll break it down so everything is clear.",
        "We can go step by step here.",
        "I’ll simplify this for you."
      ],
      evaluating: [
        "Take your time — I can help you compare options.",
        "Happy to guide you through this.",
        "Let me simplify the decision.",
        "We can narrow it down quickly."
      ],
      engaged: [
        "Great — let’s move this forward.",
        "We’re aligned, I’ll take this ahead.",
        "Let’s build on this momentum.",
        "We’re progressing well."
      ],
      delayed: [
        "No problem — I’ll follow up later.",
        "All good, we can continue when ready.",
        "I’ll check back in.",
        "We’ll pick this up later."
      ],
      ghosting: [
        "Just checking in — does this still make sense?",
        "Following up to keep this moving.",
        "Happy to revisit anytime.",
        "Hey — just checking in."
      ],
      followup: [
        "Circling back to keep this moving.",
        "Following up again here.",
        "Let’s reconnect on this.",
        "Checking in once more."
      ],
      closing: [
        "Perfect — I’ll lock this in.",
        "Great, I’ll finalize this now.",
        "We’re good to go.",
        "Let’s get this started."
      ]
    }[state];
  }

  function getOutcomeReason(history, result) {
    const last = history.slice(-3).join(" ");

    if (result === "win") {
      return last.includes("closing")
        ? "Closed with strong alignment and timing."
        : "Won through consistent engagement.";
    }

    if (result === "lost") {
      return last.includes("ghosting")
        ? "Lost due to repeated drop-offs."
        : "Lost due to lack of momentum.";
    }
  }

  async function showDynamicOptions(state) {
    setFocus(true);

    optionsPanel.innerHTML = '<div class="thinking"></div>';
    await wait(900);

    optionsPanel.innerHTML = "";

    const options = generateOptions(state);

    for (let i = 0; i < options.length; i++) {

      const div = document.createElement("div");
      div.className = "option-btn";

      div.innerHTML = `
        <strong class="tag">${["Best","Strong","Safe","Casual"][i]}</strong><br>
        ${options[i]}
      `;

      optionsPanel.appendChild(div);
      await wait(220);

      if (i === 0) {
        await wait(700);

        div.classList.add("best-glow");

        await wait(300);

        optionsPanel.innerHTML = "";
        addMessage(options[i], "system");

        break;
      }
    }

    setFocus(false);
  }

  function getRandomStart() {
    const pool = ["pricing","scope","evaluating","engaged","delayed","ghosting"];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  async function runDemo() {

    while (true) {

      const clients = {
        0: { state: getRandomStart(), done: false, history: [], steps: 0, max: 5 },
        1: { state: getRandomStart(), done: false, history: [], steps: 0, max: 4 }
      };

      chats = { 0: [], 1: [] };
      chatBox.innerHTML = "";
      optionsPanel.innerHTML = "";

      let active = 0;

      while (!clients[0].done || !clients[1].done) {

        active = active === 0 ? 1 : 0;

        if (clients[active].done) {
          active = active === 0 ? 1 : 0;
          if (clients[active].done) break;
        }

        const batch = 2 + Math.floor(Math.random() * 2);

        for (let i = 0; i < batch; i++) {

          if (clients[active].done) break;

          await switchClient(active);

          const state = clients[active].state;
          clients[active].history.push(state);

          await typeMessage(getMessageFromState(state));
          await wait(600);

          await showDynamicOptions(state);
          await wait(1000);

          clients[active].steps++;

          if (clients[active].steps >= clients[active].max) {

            const win = state === "closing" || state === "engaged";

            addMessage(win ? "Deal closed successfully." : "Conversation lost.", "system");
            await wait(500);
            addMessage(getOutcomeReason(clients[active].history, win ? "win" : "lost"), "system");

            clients[active].done = true;
            break;
          }

          const next = getNextState(state);

          if (next === "won" || next === "lost") {

            const type = next === "won" ? "win" : "lost";

            addMessage(type === "win" ? "Deal closed successfully." : "Conversation lost.", "system");
            await wait(500);
            addMessage(getOutcomeReason(clients[active].history, type), "system");

            clients[active].done = true;
            break;
          }

          clients[active].state = next;
        }
      }

      await wait(2000);

      activeClient = 0;
      updateTabs();
      renderChat(0);

      addMessage("Starting new conversations...", "system");

      await wait(2000);

      chatBox.style.opacity = "0.3";
      optionsPanel.style.opacity = "0";

      await wait(800);

      chats = { 0: [], 1: [] };
      chatBox.innerHTML = "";
      optionsPanel.innerHTML = "";

      chatBox.style.opacity = "1";
      optionsPanel.style.opacity = "1";

      await wait(800);
    }
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

      notifySuccess.innerText =
        data.status === "exists" ? "Already registered" : "You’re in";

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
