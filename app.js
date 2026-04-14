// 🔥 SAFETY: ensure page is visible immediately
document.documentElement.classList.add("loaded");

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
  let chats = { 0: [], 1: [] };

  const wait = (t) => new Promise(res => setTimeout(res, t));
  const readTime = (t) => Math.max(1400, t.length * 40);

  /* =========================
     LOCK UI
     ========================= */

  document.addEventListener("selectstart", e => e.preventDefault());
  document.addEventListener("dragstart", e => e.preventDefault());

  input.addEventListener("focus", e => e.target.blur());
  sendBtn.addEventListener("click", e => e.preventDefault());

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
     INPUT SIMULATION
     ========================= */

  async function typeInput(text) {
    input.classList.add("ai-active");
    input.value = "";

    for (let i = 0; i < text.length; i++) {
      input.value += text[i];
      await wait(18 + Math.random() * 30);
    }

    await wait(200);
    input.classList.remove("ai-active");
  }

  async function simulateUser(text) {
    await typeInput(text);

    sendBtn.classList.add("sending");
    await wait(200);
    sendBtn.classList.remove("sending");

    input.value = "";
    addMessage(text, "user");
  }

  /* =========================
     OPTIONS
     ========================= */

 async function showOptions(list) {

  optionsPanel.innerHTML = "";

  const buttons = [];
  const tags = ["Best", "Strong", "Safe", "Casual"];

  list.forEach((text, i) => {
    const btn = document.createElement("div");
    btn.className = "option-btn";

    btn.innerHTML = `
      <span class="tag left">${tags[i]}</span>
      ${text}
      <span class="tag right">${tags[i]}</span>
    `;

    optionsPanel.appendChild(btn);
    buttons.push(btn);
  });

  for (let i = 0; i < buttons.length; i++) {
    await wait(120);
    buttons[i].classList.add("show");
  }

  await wait(2000 + Math.random() * 1000);

  if (!buttons.length) return;

  const index = Math.floor(Math.random() * buttons.length);
  const selected = buttons[index];

  selected.classList.add("selected");

  await wait(400);

  optionsPanel.innerHTML = "";

  const cleanText = selected.innerText
    .replace("Best","")
    .replace("Strong","")
    .replace("Safe","")
    .replace("Casual","")
    .trim();

  addMessage(cleanText, "system");
}

  /* =========================
     DEMO FLOW
     ========================= */

  async function runDemo() {

    chats = { 0: [], 1: [] };

    activeClient = 0;
    updateTabs();
    renderChat(activeClient);

    let msg;

    msg = "Client said they are busy this week";
    await simulateUser(msg);
    await wait(readTime(msg));

    await showOptions([
      "No worries — I’ll keep this simple for you.",
      "All good, I can summarize this quickly.",
      "Following up when it works for you.",
      "Let me know when this becomes a priority."
    ]);

    await wait(2000);

    msg = "Client said maybe next week";
    await simulateUser(msg);
    await wait(readTime(msg));

    await showOptions([
      "Sure — I’ll follow up early next week.",
      "Works — I’ll check back in then.",
      "I’ll keep this ready for you.",
      "Let me know if anything changes."
    ]);

    await wait(2000);
    activeClient = 1;
    updateTabs();
    renderChat(activeClient);

    msg = "Client asked about pricing";
    await simulateUser(msg);
    await wait(readTime(msg));

    await showOptions([
      "Happy to break this down based on your needs.",
      "I can share a quick cost overview.",
      "Let me know if you want full details.",
      "We can customize based on your budget."
    ]);

    await wait(2000);
    activeClient = 0;
    updateTabs();
    renderChat(activeClient);

    msg = "Client asked if this can start soon";
    await simulateUser(msg);
    await wait(readTime(msg));

    await showOptions([
      "Yes — we can begin immediately.",
      "We can start as early as this week.",
      "I’ll align everything and get started.",
      "We’re ready to move forward anytime."
    ]);

    await wait(2000);

    msg = "Client said let's proceed";
    await simulateUser(msg);
    await wait(readTime(msg));

    await showOptions([
      "Great — I’ll finalize everything.",
      "Perfect — I’ll get started.",
      "Moving ahead with this.",
      "Let’s begin."
    ]);

    addMessage("Outcome achieved.", "system");

    await wait(2000);
    activeClient = 1;
    updateTabs();
    renderChat(activeClient);

    msg = "Client said they need to think";
    await simulateUser(msg);
    await wait(readTime(msg));

    await showOptions([
      "No problem — take your time.",
      "Happy to revisit when you're ready.",
      "I’ll follow up later.",
      "Let me know if you have questions."
    ]);

    await wait(2000);

    msg = "Client stopped responding";
    await simulateUser(msg);
    await wait(readTime(msg));

    await showOptions([
      "I’ll close this for now.",
      "Happy to reconnect later.",
      "Leaving this open if needed.",
      "Feel free to reach out anytime."
    ]);

    addMessage("Conversation ended.", "system");

    await wait(6000);
    runDemo();
  }

  runDemo();
});

/* =========================
   GLOBAL OUTSIDE DOM
   ========================= */

window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loaded");
  document.documentElement.classList.add("loaded"); // 🔥 FIX
});

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const height = document.body.scrollHeight - window.innerHeight;
  const progress = (scrollTop / height) * 100;
  const bar = document.querySelector(".scroll-progress");
  if (bar) bar.style.width = progress + "%";
});

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

const revealElements = document.querySelectorAll("section, .demo-container");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.12 });

revealElements.forEach(el => {
  el.classList.add("reveal");
  observer.observe(el);
});

document.querySelectorAll("a").forEach(link => {
  if (link.href && link.href.includes(window.location.origin)) {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      document.body.style.opacity = "0";
      document.body.style.transform = "translateY(6px)";
      setTimeout(() => {
        window.location.href = link.href;
      }, 250);
    });
  }
});
