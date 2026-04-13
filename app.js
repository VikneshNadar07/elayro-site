document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     GLOBAL: DYNAMIC HOOK
     ========================= */

  const hookEl = document.getElementById("dynamicHook");

  if (hookEl) {
    const hooks = [
      "From uncertainty to outcome.",
      "Execution removes hesitation.",
      "Every message should move forward.",
      "Clarity creates momentum.",
      "Structure turns intent into results."
    ];

    let i = 0;

    function rotateHook() {
      hookEl.style.opacity = 0;
      setTimeout(() => {
        hookEl.innerText = hooks[i];
        hookEl.style.opacity = 0.6;
        i = (i + 1) % hooks.length;
      }, 300);
    }

    rotateHook();
    setInterval(rotateHook, 4000);
  }

  /* =========================
     CHAT SYSTEM
     ========================= */

  const chatBox = document.getElementById("chatBox");
  const clientTabs = document.querySelectorAll(".client");
  const optionsPanel = document.getElementById("optionsPanel");
  const input = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");

  if (!chatBox || !optionsPanel || !input || !sendBtn) return;

  let activeClient = 0;

  // 🔥 CHAT MEMORY
  let chats = { 0: [], 1: [] };

  // 🔥 STATUS SYSTEM
  let clientStatus = { 0: "active", 1: "active" };

  const wait = (t) => new Promise(res => setTimeout(res, t));
  const readTime = (t) => Math.max(1200, t.length * 35);
  const thinkTime = () => 1600 + Math.random() * 400;

  /* =========================
     UI HELPERS
     ========================= */

  function updateTabs() {
    clientTabs.forEach((t, i) =>
      t.classList.toggle("active", i === activeClient)
    );
  }

  function renderChat(clientIndex) {
    chatBox.innerHTML = "";

    chats[clientIndex].forEach(msg => {
      const div = document.createElement("div");
      div.className = `message ${msg.type}`;

      if (msg.type === "system") {
        const label = document.createElement("div");
        label.className = "msg-label";
        label.innerText = "Outflow";

        const content = document.createElement("div");
        content.innerText = msg.text;

        div.appendChild(label);
        div.appendChild(content);
      } else {
        div.innerText = msg.text;
      }

      chatBox.appendChild(div);
    });

    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function addMessage(text, type) {

    chats[activeClient].push({ text, type });

    const div = document.createElement("div");
    div.className = `message ${type} fade-in-up`;

    if (type === "system") {
      const label = document.createElement("div");
      label.className = "msg-label";
      label.innerText = "Outflow";

      const content = document.createElement("div");
      content.innerText = text;

      div.appendChild(label);
      div.appendChild(content);
    } else {
      div.innerText = text;
    }

    chatBox.appendChild(div);

    chatBox.scrollTo({
      top: chatBox.scrollHeight,
      behavior: "smooth"
    });
  }

  /* =========================
     STATUS SYSTEM
     ========================= */

  function setClientStatus(index, status) {
    const tab = document.querySelector(`.client[data-client="${index}"]`);
    if (!tab) return;

    tab.classList.remove("active", "pending", "won");
    tab.classList.add(status);

    clientStatus[index] = status;
    updateConversion();
  }

  function updateConversion() {
    const el = document.getElementById("conversionIndicator");
    if (!el) return;

    const values = Object.values(clientStatus);
    const closed = values.filter(s => s === "won").length;

    el.innerText = `${closed} / 2 Closed`;
  }

  /* =========================
     INPUT SIMULATION
     ========================= */

  async function typeInput(text) {
    input.value = "";
    for (let i = 0; i < text.length; i++) {
      input.value += text[i];
      await wait(20);
    }
  }

  async function simulateUser(text) {
    await typeInput(text);
    await wait(300);
    input.value = "";
    addMessage(text, "user");
  }

  /* =========================
     OPTIONS
     ========================= */

  async function showOptions(list) {

    optionsPanel.innerHTML = "";

    list.forEach(text => {
      const btn = document.createElement("div");
      btn.className = "option-btn";
      btn.innerText = text;
      optionsPanel.appendChild(btn);
    });

    await wait(1500);

    const selected = optionsPanel.children[0];
    selected.classList.add("selected");

    await wait(300);

    optionsPanel.innerHTML = "";
    addMessage(selected.innerText, "system");
  }

  /* =========================
     DEMO FLOW (FINAL)
     ========================= */

  async function runDemo() {

    // 🔥 RESET
    chats = { 0: [], 1: [] };
    clientStatus = { 0: "active", 1: "active" };

    document.querySelectorAll(".client").forEach((c, i) => {
      c.classList.remove("pending", "won");
      if (i < 2) c.classList.add("active");
    });

    activeClient = 0;
    updateTabs();
    renderChat(activeClient);

    let msg;

    /* CLIENT 1 */

    msg = "Client said they are busy this week";
    await simulateUser(msg);
    await wait(readTime(msg));

    setClientStatus(0, "pending");

    await showOptions([
      "No worries — I’ll keep this simple for you.",
      "All good, I can summarize this quickly."
    ]);

    await wait(2000);

    /* CLIENT 2 */

    activeClient = 1;
    updateTabs();
    renderChat(activeClient);

    msg = "Client asked about pricing";
    await simulateUser(msg);
    await wait(readTime(msg));

    setClientStatus(1, "pending");

    await showOptions([
      "Happy to break this down based on your needs.",
      "I can share a quick cost overview."
    ]);

    await wait(2000);

    /* CLOSE CLIENT 1 */

    activeClient = 0;
    updateTabs();
    renderChat(activeClient);

    msg = "Client said let's proceed";
    await simulateUser(msg);
    await wait(readTime(msg));

    await showOptions([
      "Great — I’ll finalize everything."
    ]);

    addMessage("Outcome achieved.", "system");
    setClientStatus(0, "won");

    /* CLOSE CLIENT 2 */

    await wait(2000);

    activeClient = 1;
    updateTabs();
    renderChat(activeClient);

    addMessage("Outcome achieved.", "system");
    setClientStatus(1, "won");

    /* 🔥 WAIT 15s THEN RESET */

    await wait(15000);

    runDemo();
  }

  updateTabs();
  runDemo();
});

/* =========================
   PAGE LOAD
   ========================= */

window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loaded");
});

/* =========================
   SCROLL PROGRESS
   ========================= */

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const height = document.body.scrollHeight - window.innerHeight;
  const progress = (scrollTop / height) * 100;
  const bar = document.querySelector(".scroll-progress");
  if (bar) bar.style.width = progress + "%";
});

/* =========================
   NAV AUTO HIDE
   ========================= */

(function () {
  const path = window.location.pathname;
  let current = "home";

  if (path.includes("outflow")) current = "outflow";
  else if (path.includes("elira")) current = "elira";
  else if (path.includes("execution")) current = "execution";

  document.querySelectorAll(".nav-minimal a").forEach(link => {
    if (link.dataset.page === current) {
      link.classList.add("hide");
      setTimeout(() => link.style.display = "none", 300);
    }
  });
})();
