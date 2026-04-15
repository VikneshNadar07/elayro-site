/* =========================
   ELAYRO FULL APP.JS
   COMPLETE PROJECT FILE
========================= */

document.addEventListener("DOMContentLoaded", () => {

  const wait = (t) => new Promise(res => setTimeout(res, t));

  /* =========================
     NAVIGATION
  ========================= */

  const navLinks = document.querySelectorAll(".nav-minimal a");
  let currentPage = window.location.pathname.split("/").pop() || "index.html";

  navLinks.forEach(link => {
    const href = link.getAttribute("href");

    if (href === currentPage) link.style.opacity = "0.4";

    link.addEventListener("click", (e) => {
      if (!href || href.startsWith("#")) return;
      e.preventDefault();
      document.body.classList.add("fade-out");
      setTimeout(() => window.location.href = href, 300);
    });
  });

  /* =========================
     SCROLL PROGRESS
  ========================= */

  const progressBar = document.querySelector(".scroll-progress");

  window.addEventListener("scroll", () => {
    const total = document.body.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / total) * 100;
    if (progressBar) progressBar.style.width = progress + "%";
  });

  /* =========================
     SECTION + FOOTER FADE
  ========================= */

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.2 });

  document.querySelectorAll("section").forEach(s => observer.observe(s));

  const footer = document.querySelector(".footer-global");
  if (footer) observer.observe(footer);

  /* =========================
     DEMO SYSTEM
  ========================= */

  const chatBox = document.getElementById("chatBox");
  const optionsPanel = document.getElementById("optionsPanel");
  const input = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");
  const clientTabs = document.querySelectorAll(".clients .client");

  if (chatBox && optionsPanel && input && sendBtn) {

    let activeClient = 0;
    let chats = { 0: [], 1: [] };

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
      updateTabs();
      renderChat(i);
      await wait(400);
    }

    async function typeMessage(text) {
      input.value = "";

      for (let i = 0; i < text.length; i++) {
        input.value += text[i];
        await wait(15 + Math.random() * 25);
      }

      sendBtn.classList.add("press");
      await wait(120);
      sendBtn.classList.remove("press");

      addMessage(text, "user");
      input.value = "";

      await wait(500);
    }

    /* =========================
       REAL CONVERSATION FLOWS
    ========================= */

    const flows = [
      [
        "Hey, can you share pricing?",
        "Is there flexibility based on scope?",
        "Let me think about it",
        null,
        "Sorry missed this — still available?",
        "Okay let’s move ahead"
      ],
      [
        "What exactly is included?",
        "Can we reduce this slightly?",
        "I’ll get back to you",
        null,
        null,
        "Let’s pause this for now"
      ]
    ];

    function getOptions(msg) {

      if (!msg) {
        return [
          "Just checking in — does this still make sense for you?",
          "Following up here — happy to pick this up anytime.",
          "Wanted to check if this is still relevant for you.",
          "Hey — just circling back on this."
        ];
      }

      if (msg.includes("pricing")) return [
        "Here’s a clear breakdown so you know exactly what to expect.",
        "Let me walk you through pricing clearly.",
        "I can share details to help you decide.",
        "I’ll explain it simply."
      ];

      if (msg.includes("flex")) return [
        "Yes — we can adjust this based on your needs.",
        "We can make this flexible depending on scope.",
        "There’s room to adapt this.",
        "We can tweak this easily."
      ];

      if (msg.includes("think")) return [
        "Makes sense — take your time.",
        "All good — I’m here when ready.",
        "No rush — we can continue later.",
        "Happy to reconnect anytime."
      ];

      if (msg.includes("included")) return [
        "Let me break down everything clearly.",
        "I’ll walk you through it step by step.",
        "Here’s the full scope explained.",
        "Let me simplify this for you."
      ];

      if (msg.includes("reduce")) return [
        "We can definitely optimize this.",
        "Let’s adjust to fit your budget.",
        "We can refine this easily.",
        "There’s room to reduce here."
      ];

      if (msg.includes("pause")) return [
        "Understood — we can revisit anytime.",
        "No problem, we’ll reconnect later.",
        "All good — I’ll be here.",
        "We can pick this up later."
      ];

      return [
        "Got it — I’ll take this forward.",
        "Understood — let’s proceed.",
        "Makes sense — moving ahead.",
        "Alright — continuing from here."
      ];
    }

    async function showOptions(msg) {

      optionsPanel.innerHTML = '<div class="thinking"></div>';
      await wait(700);

      optionsPanel.innerHTML = "";

      const options = getOptions(msg);

      for (let i = 0; i < 4; i++) {

        const d = document.createElement("div");
        d.className = "option-bubble";

        d.innerHTML = `
          <span class="tag">${["Best","Strong","Safe","Casual"][i]}</span>
          ${options[i]}
        `;

        optionsPanel.appendChild(d);
        await wait(180);
      }

      await wait(900);

      optionsPanel.innerHTML = "";

      addMessage(options[0], "system");
      await wait(600);
    }

    async function runClient(flow, index, steps) {

      await switchClient(index);

      for (let i = 0; i < steps; i++) {

        const msg = flow[i];

        if (msg === null) {
          await wait(1200);
        } else {
          await typeMessage(msg);
        }

        await showOptions(msg);
      }

      const last = flow[steps - 1];
      const win = last && last.includes("move ahead");

      addMessage(win ? "✅ Deal closed successfully" : "❌ Conversation lost", "system");
      await wait(400);

      addMessage(
        win ? "Closed with clear intent and alignment." :
              "Conversation dropped due to low engagement.",
        "system"
      );
    }

    async function runDemo() {

      while (true) {

        chats = { 0: [], 1: [] };
        chatBox.innerHTML = "";
        optionsPanel.innerHTML = "";

        await runClient(flows[0], 0, 5);
        await runClient(flows[1], 1, 4);

        await wait(2000);

        chatBox.innerHTML = "";
        optionsPanel.innerHTML = "";
      }
    }

    runDemo();
  }

  /* =========================
     NOTIFY SYSTEM
  ========================= */

  const notifyBtn = document.getElementById("notifyBtn");
  const notifyEmail = document.getElementById("notifyEmail");
  const notifySuccess = document.getElementById("notifySuccess");

  if (notifyBtn && notifyEmail && notifySuccess) {

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
  }

});
