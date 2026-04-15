// 🔥 LOAD FIX
document.documentElement.classList.add("loaded");

document.addEventListener("DOMContentLoaded", () => {

  // ✅ FIX DARK SCREEN
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
     DEMO ELEMENTS
     ========================= */

  const chatBox = document.getElementById("chatBox");
  const clientTabs = document.querySelectorAll(".clients .client");
  const optionsPanel = document.getElementById("optionsPanel");
  const input = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");

  /* =========================
     DEMO ONLY IF PRESENT
     ========================= */

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

    function generateOptions(msg) {
      const lower = msg.toLowerCase();

      if (lower.includes("busy") || lower.includes("later")) {
        return [
          "No worries — I’ll keep this quick.",
          "All good, we can pick this up later.",
          "Happy to follow up when you're free.",
          "Cool, let’s reconnect later."
        ];
      }

      if (lower.includes("pricing")) {
        return [
          "I’ll break it down clearly.",
          "Here’s a quick overview.",
          "We can adjust based on scope.",
          "I can share a rough range."
        ];
      }

      if (lower.includes("discount") || lower.includes("flex")) {
        return [
          "We can make this work.",
          "Let’s find something that fits.",
          "There’s some flexibility.",
          "We can tweak things."
        ];
      }

      if (lower.includes("unsure")) {
        return [
          "Totally fair — what would help clarify?",
          "Happy to walk you through it.",
          "Let me simplify it.",
          "Take your time."
        ];
      }

      if (lower.includes("proceed") || lower.includes("start")) {
        return [
          "Great — I’ll get started.",
          "Perfect, moving ahead.",
          "Sounds good, let’s begin.",
          "Alright, let’s go."
        ];
      }

      if (lower.includes("stop") || lower.includes("silent")) {
        return [
          "Just checking in.",
          "Still relevant for you?",
          "Happy to revisit.",
          "No rush at all."
        ];
      }

      return [
        "Got it.",
        "Makes sense.",
        "Let’s move ahead.",
        "Noted."
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

      const r = Math.random();
      const index = r < 0.5 ? 0 : r < 0.75 ? 1 : r < 0.9 ? 2 : 3;

      const selected = buttons[index];
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

        const flow0Sets = [
          ["Client is busy", "Follow up later", "Client unsure", "Client proceeds"],
          ["Client tied up", "Reconnect later", "Needs clarity", "Client confirms"]
        ];

        const flow1Sets = [
          ["Asked pricing", "Asked discount", "Comparing options", "Stopped responding"],
          ["Wants cost", "Flexible?", "Evaluating", "Went silent"]
        ];

        const flow0 = flow0Sets[Math.floor(Math.random() * flow0Sets.length)];
        const flow1 = flow1Sets[Math.floor(Math.random() * flow1Sets.length)];

        let msg;

        for (let i = 0; i < 2; i++) {
          msg = flow0[i];
          await simulateUser(msg);
          await wait(readTime(msg));
          await showOptions(msg);
        }

        activeClient = 1;
        updateTabs();
        renderChat(1);

        for (let i = 0; i < 2; i++) {
          msg = flow1[i];
          await simulateUser(msg);
          await wait(readTime(msg));
          await showOptions(msg);
        }

        activeClient = 0;
        updateTabs();
        renderChat(0);

        for (let i = 2; i < 4; i++) {
          msg = flow0[i];
          await simulateUser(msg);
          await wait(readTime(msg));
          await showOptions(msg);
        }

        addMessage("Outcome achieved.", "system");

        activeClient = 1;
        updateTabs();
        renderChat(1);

        for (let i = 2; i < 4; i++) {
          msg = flow1[i];
          await simulateUser(msg);
          await wait(readTime(msg));
          await showOptions(msg);
        }

        addMessage("Conversation ended.", "system");

        await wait(3000);

        chatBox.innerHTML = "";
        optionsPanel.innerHTML = "";
      }
    }

    runDemo();
  }

});

/* =========================
   NOTIFY SYSTEM
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
