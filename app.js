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
  const cursor = document.getElementById("fakeCursor");
  const container = document.querySelector(".demo-container");

  if (!chatBox || !optionsPanel || !input || !sendBtn || !container || !cursor) return;

  let activeClient = 0;
  let chats = { 0: [], 1: [] };
  let memory = [];

  const wait = (t) => new Promise(res => setTimeout(res, t));
  const readTime = (t) => Math.max(1400, t.length * 40);

  document.addEventListener("selectstart", e => e.preventDefault());
  document.addEventListener("dragstart", e => e.preventDefault());
  input.addEventListener("focus", e => e.target.blur());
  sendBtn.addEventListener("click", e => e.preventDefault());

  /* =========================
     SYSTEM CURSOR (FINAL)
     ========================= */

  let cx = 0, cy = 0, tx = 0, ty = 0;

  function initCursorPosition() {
    const rect = sendBtn.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const cursorSize = 12;

    cx = rect.left - containerRect.left + rect.width / 2 - cursorSize / 2;
    cy = rect.top  - containerRect.top  + rect.height / 2 - cursorSize / 2;

    tx = cx;
    ty = cy;

    cursor.classList.add("active");
  }

  function animateCursor() {
    cx += (tx - cx) * 0.2;
    cy += (ty - cy) * 0.2;

    cursor.style.left = cx + "px";
    cursor.style.top  = cy + "px";

    requestAnimationFrame(animateCursor);
  }

  setTimeout(() => {
    initCursorPosition();
    animateCursor();
  }, 100);

  function moveCursorTo(el){
    const rect = el.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const cursorSize = 12;

    tx = rect.left - containerRect.left + rect.width / 2 - cursorSize / 2;
    ty = rect.top  - containerRect.top  + rect.height / 2 - cursorSize / 2;
  }

  async function lookAt(el) {
    moveCursorTo(el);
    await wait(180);
  }

  async function clickCursor(el) {
    moveCursorTo(el);
    await wait(120);

    cursor.classList.add("clicking");
    await wait(100);
    cursor.classList.remove("clicking");
  }

  /* =========================
     CAMERA
     ========================= */

  function cameraFocus(mode) {
    container.classList.remove("camera-focus");
    if (mode) container.classList.add(mode);
  }

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
     MEMORY + OPTIONS
     ========================= */

  function remember(msg) {
    memory.push(msg.toLowerCase());
    if (memory.length > 6) memory.shift();
  }

  function generateOptions(msg) {
    const context = (memory.join(" ") + " " + msg).toLowerCase();

    const pick = (arr) => arr.slice(0, 4);

    if (context.includes("busy")) {
      return pick([
        "Got it — I’ll keep it short.",
        "All good, we can take this later.",
        "No rush, just checking in.",
        "Cool, I’ll follow up next week."
      ]);
    }

    if (context.includes("pricing")) {
      return pick([
        "I’ll break it down simply.",
        "Here’s a quick overview.",
        "We can adjust based on your needs.",
        "Here’s a rough range."
      ]);
    }

    if (context.includes("flex")) {
      return pick([
        "We can adjust it.",
        "There’s flexibility there.",
        "We’ll shape it around your needs.",
        "We can tweak it."
      ]);
    }

    if (context.includes("start") || context.includes("proceed")) {
      return pick([
        "Alright, let’s do it.",
        "I’ll get this moving.",
        "Sounds good — starting now.",
        "Let’s go ahead."
      ]);
    }

    if (context.includes("stop")) {
      return pick([
        "I’ll check back later.",
        "We can revisit this.",
        "I’ll follow up soon.",
        "Let’s circle back."
      ]);
    }

    return pick([
      "Got it.",
      "Makes sense.",
      "Let’s move on that.",
      "I’ll handle it."
    ]);
  }

  /* =========================
     INPUT SIMULATION
     ========================= */

  async function typeInput(text) {
    cameraFocus("camera-focus");

    await lookAt(input);
    input.value = "";

    for (let i = 0; i < text.length; i++) {
      input.value += text[i];
      await wait(25);
    }
  }

  async function simulateUser(text) {
    await wait(250);

    remember(text);
    await typeInput(text);

    await clickCursor(sendBtn);

    input.value = "";
    addMessage(text, "user");
  }

  /* =========================
     OPTIONS
     ========================= */

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

    cameraFocus("camera-focus");

    await wait(500);

    const selected = buttons[0];

    await clickCursor(selected);
    selected.classList.add("selected");

    await wait(300);

    optionsPanel.innerHTML = "";
    addMessage(selected.innerText, "system");

    cameraFocus(null);
  }

  /* =========================
     FLOW
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

      msg = "Client said maybe next week";
      await simulateUser(msg);
      await wait(readTime(msg));
      await showOptions(msg);

      activeClient = 1;
      await clickCursor(clientTabs[1]);
      updateTabs();
      renderChat(1);

      msg = "Client asked about pricing";
      await simulateUser(msg);
      await wait(readTime(msg));
      await showOptions(msg);

      msg = "Client asked if flexible";
      await simulateUser(msg);
      await wait(readTime(msg));
      await showOptions(msg);

      activeClient = 0;
      await clickCursor(clientTabs[0]);
      updateTabs();
      renderChat(0);

      msg = "Client asked if we can start soon";
      await simulateUser(msg);
      await wait(readTime(msg));
      await showOptions(msg);

      msg = "Client said let's proceed";
      await simulateUser(msg);
      await wait(readTime(msg));
      await showOptions(msg);

      addMessage("Outcome achieved.", "system");

      activeClient = 1;
      await clickCursor(clientTabs[1]);
      updateTabs();
      renderChat(1);

      msg = "Client stopped responding";
      await simulateUser(msg);
      await wait(readTime(msg));
      await showOptions(msg);

      addMessage("Conversation ended.", "system");

      await wait(3500);
      chatBox.innerHTML = "";
      optionsPanel.innerHTML = "";
    }
  }

  runDemo();
});

window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loaded");
});
/* =========================
   NOTIFY SYSTEM (FINAL FIX)
   ========================= */

document.addEventListener("DOMContentLoaded", () => {

  const notifyBtn = document.getElementById("notifyBtn");
  const notifyEmail = document.getElementById("notifyEmail");
  const notifySuccess = document.getElementById("notifySuccess");

  console.log("notify init");

  if (!notifyBtn || !notifyEmail) {
    console.log("notify elements missing");
    return;
  }

  notifyBtn.addEventListener("click", async () => {
    console.log("clicked");

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
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      console.log("response:", data);

      if (!res.ok) throw new Error();

      notifySuccess.classList.add("show");
      notifyEmail.value = "";
      notifyBtn.innerText = "Added";

    } catch (err) {
      console.log("error:", err);
      notifyBtn.innerText = "Retry";
      notifyBtn.disabled = false;
    }
  });

});
