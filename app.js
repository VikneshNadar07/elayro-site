document.addEventListener("DOMContentLoaded", () => {

  const chatBox = document.getElementById("chatBox");
  const narration = document.getElementById("narration");
  const clientTabs = document.querySelectorAll(".client");
  const optionsPanel = document.getElementById("optionsPanel");
  const input = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");

  if (!chatBox || !narration || !optionsPanel) return;

  let activeClient = 0;

  const wait = (t) => new Promise(res => setTimeout(res, t));
  const readTime = (t) => Math.max(1200, t.length * 35);
  const thinkTime = () => 1600 + Math.random() * 400;

  /* =========================
     GHOST CURSOR
     ========================= */

  const ghostCursor = document.createElement("div");
  ghostCursor.className = "ghost-cursor";
  document.body.appendChild(ghostCursor);

  function moveTo(el) {
    const r = el.getBoundingClientRect();
    ghostCursor.style.opacity = "1";
    ghostCursor.style.left = r.left + r.width / 2 + "px";
    ghostCursor.style.top = r.top + r.height / 2 + "px";
  }

  function clickCursor() {
    ghostCursor.style.transform = "translate(-50%, -50%) scale(0.7)";
    setTimeout(() => {
      ghostCursor.style.transform = "translate(-50%, -50%) scale(1)";
    }, 100);
  }

  function hideCursor() {
    setTimeout(() => ghostCursor.style.opacity = "0", 250);
  }

  async function hesitate() {
    await wait(200 + Math.random() * 200);
  }

  /* =========================
     UI HELPERS
     ========================= */

  function updateTabs() {
    clientTabs.forEach((t, i) =>
      t.classList.toggle("active", i === activeClient)
    );
  }

  function clearChat() {
    chatBox.innerHTML = "";
  }

  function addMessage(text, type) {
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
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function showTyping() {
    const div = document.createElement("div");
    div.className = "message system typing";
    div.innerHTML = `<span></span><span></span><span></span>`;
    chatBox.appendChild(div);
  }

  function removeTyping() {
    const t = document.querySelector(".typing");
    if (t) t.remove();
  }

  /* =========================
     INPUT SIMULATION
     ========================= */

  async function typeInput(text) {
    input.value = "";
    for (let i = 0; i < text.length; i++) {
      input.value += text[i];
      await wait(20 + Math.random() * 30);
    }
  }

  async function simulateUser(text) {
    moveTo(input);
    await wait(400);
    clickCursor();

    await wait(200);
    await typeInput(text);

    await wait(300);

    moveTo(sendBtn);
    await wait(400);
    clickCursor();

    await wait(200);

    input.value = "";
    addMessage(text, "user");

    hideCursor();
  }

  /* =========================
     OPTIONS
     ========================= */

  async function showOptions(list, autoIndex = 0) {

    optionsPanel.innerHTML = "";
    const chatArea = document.querySelector(".chat-area");
    chatArea.classList.add("dimmed");

    let buttons = [];

    list.forEach((text, i) => {
      const btn = document.createElement("div");
      btn.className = "option-btn";
      btn.innerText = text;

      setTimeout(() => optionsPanel.appendChild(btn), i * 120);
      buttons.push(btn);
    });

    await wait(1500);

    const selected = buttons[autoIndex];
    if (!selected) return;

    moveTo(selected);
    await wait(300);

    await hesitate();

    clickCursor();
    selected.classList.add("selected");

    await wait(300);

    hideCursor();
    optionsPanel.innerHTML = "";
    chatArea.classList.remove("dimmed");

    // 🔥 FIXED: now LEFT side (system)
    addMessage(selected.innerText, "system");
  }

  /* =========================
     DEMO FLOW
     ========================= */

  async function runDemo() {

    activeClient = 0;
    updateTabs();
    clearChat();
    narration.innerText = "User input received.";

    let msg = "Client said they are busy this week";
    await simulateUser(msg);
    await wait(readTime(msg));

    showTyping();
    await wait(thinkTime());
    removeTyping();

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

    showTyping();
    await wait(thinkTime());
    removeTyping();

    await showOptions([
      "Sure — I’ll follow up early next week.",
      "Works — I’ll check back in then.",
      "I’ll keep this ready for you.",
      "Let me know if anything changes."
    ]);

    await wait(2500);

    activeClient = 1;
    updateTabs();
    clearChat();
    narration.innerText = "Switching client...";

    msg = "Client asked about pricing";
    await simulateUser(msg);
    await wait(readTime(msg));

    showTyping();
    await wait(thinkTime());
    removeTyping();

    await showOptions([
      "Happy to break this down based on your needs.",
      "I can share a quick cost overview.",
      "Let me know if you want full details.",
      "We can customize based on your budget."
    ]);

    await wait(2500);

    activeClient = 0;
    updateTabs();
    clearChat();
    narration.innerText = "Continuing...";

    msg = "Client said let's proceed";
    await simulateUser(msg);
    await wait(readTime(msg));

    showTyping();
    await wait(thinkTime());
    removeTyping();

    await showOptions([
      "Great — I’ll finalize everything.",
      "Perfect — I’ll get started.",
      "Moving ahead with this.",
      "Let’s begin."
    ]);

    await wait(1000);
    addMessage("Outcome achieved.", "system");

    await wait(3000);
    runDemo();
  }

  narration.innerText = "Live demo — Outflow in action.";
  updateTabs();
  runDemo();

});
/* =========================
   PAGE LOAD ANIMATION
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
   NAV ACTIVE STATE
   ========================= */
(function () {
  const path = window.location.pathname;
  let current = "home";

  if (path.includes("outflow")) current = "outflow";
  else if (path.includes("elira")) current = "elira";
  else if (path.includes("execution")) current = "execution";

  document.querySelectorAll(".nav-minimal a").forEach(link => {
    if (link.dataset.page === current) {
      link.classList.add("active");
    }
  });
})();
