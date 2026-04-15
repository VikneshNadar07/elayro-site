/* =========================
   ELAYRO FINAL APP.JS
   (FULL PROJECT - STABLE)
========================= */

document.addEventListener("DOMContentLoaded", () => {

  const wait = (t) => new Promise(res => setTimeout(res, t));

  /* =========================
     NAV
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
     SECTION FADE
  ========================= */

  const sections = document.querySelectorAll("section");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.2 });

  sections.forEach(s => observer.observe(s));

  /* =========================
     FOOTER FADE
  ========================= */

  const footer = document.querySelector(".footer-global");

  if (footer) {
    new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    }, { threshold: 0.2 }).observe(footer);
  }

  /* =========================
     DEMO SYSTEM
  ========================= */

  const chatBox = document.getElementById("chatBox");
  const optionsPanel = document.getElementById("optionsPanel");
  const input = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");
  const clientTabs = document.querySelectorAll(".clients .client");

  const demoEnabled = chatBox && optionsPanel && input && sendBtn;

  if (demoEnabled) {

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
      input.classList.add("typing-active");

      for (let i = 0; i < text.length; i++) {
        input.value += text[i];
        await wait(18 + Math.random() * 20);
      }

      sendBtn.classList.add("press");
      await wait(120);
      sendBtn.classList.remove("press");

      addMessage(text, "user");

      input.value = "";
      input.classList.remove("typing-active");

      await wait(500);
    }

    function getRandomStart() {
      const pool = ["pricing","scope","evaluating","engaged","delayed","ghosting"];
      return pool[Math.floor(Math.random() * pool.length)];
    }

    function getNextState(s) {
      const map = {
        pricing:["scope","evaluating"],
        scope:["evaluating","engaged"],
        evaluating:["engaged","delayed"],
        engaged:["closing","ghosting"],
        delayed:["followup","ghosting"],
        followup:["engaged","ghosting"],
        ghosting:["followup","lost"],
        closing:["won"]
      };
      const next = map[s] || ["evaluating"];
      return next[Math.floor(Math.random() * next.length)];
    }

    function getMsg(s) {
      return {
        pricing:"Client asked about pricing",
        scope:"Client wants clarity on scope",
        evaluating:"Client is comparing options",
        engaged:"Client is actively engaging",
        delayed:"Client said maybe later",
        ghosting:"Client hasn’t responded",
        followup:"Following up again",
        closing:"Client is ready to proceed"
      }[s];
    }

    function getOptions(s) {
      return {
        pricing:[
          "Here’s a simple breakdown so you know exactly what to expect.",
          "Let me walk you through pricing clearly.",
          "I can share details to help you decide.",
          "I’ll explain it simply."
        ],
        scope:[
          "Let me define the scope clearly so everything is aligned.",
          "I’ll break down what’s included.",
          "We can go step by step.",
          "I’ll simplify it."
        ],
        evaluating:[
          "Take your time — I can help you compare.",
          "Happy to guide you through options.",
          "Let me simplify this.",
          "We can narrow it down."
        ],
        engaged:[
          "Great — let’s keep this moving.",
          "We’re aligned, I’ll take it ahead.",
          "Let’s build momentum.",
          "We’re progressing well."
        ],
        delayed:[
          "No problem — we’ll pick this up later.",
          "All good, I’ll follow up.",
          "We’ll continue when ready.",
          "I’ll check back in."
        ],
        ghosting:[
          "Just checking in — still relevant?",
          "Following up to keep things moving.",
          "Happy to revisit anytime.",
          "Hey — checking in."
        ],
        followup:[
          "Circling back here.",
          "Following up again.",
          "Let’s reconnect.",
          "Checking in once more."
        ],
        closing:[
          "Perfect — I’ll finalize this.",
          "Great, proceeding now.",
          "We’re good to go.",
          "Let’s get started."
        ]
      }[s];
    }

    function getReason(result) {
      return result === "win"
        ? "Closed with strong alignment."
        : "Lost due to drop in engagement.";
    }

    async function showOptions(state) {

      optionsPanel.innerHTML = '<div class="thinking"></div>';
      await wait(800);

      optionsPanel.innerHTML = "";

      const options = getOptions(state);

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

    async function handleClient(client, index) {

      if (client.done) return;

      await switchClient(index);

      const stepsToRun = 2 + Math.floor(Math.random() * 2);

      for (let i = 0; i < stepsToRun; i++) {

        if (client.done) return;

        const state = client.state;

        await typeMessage(getMsg(state));
        await showOptions(state);

        client.steps++;

        if (client.steps >= client.max) {
          const win = state === "closing" || state === "engaged";

          addMessage(win ? "✅ Deal closed successfully" : "❌ Conversation lost", "system");
          await wait(400);
          addMessage(getReason(win ? "win" : "lost"), "system");

          client.done = true;
          return;
        }

        client.state = getNextState(state);
      }
    }

    async function runDemo() {

      while (true) {

        const clients = [
          { state: getRandomStart(), done: false, steps: 0, max: 5 },
          { state: getRandomStart(), done: false, steps: 0, max: 4 }
        ];

        chats = { 0: [], 1: [] };
        chatBox.innerHTML = "";
        optionsPanel.innerHTML = "";

        while (!clients[0].done || !clients[1].done) {

          if (!clients[0].done) await handleClient(clients[0], 0);
          if (!clients[1].done) await handleClient(clients[1], 1);
        }

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
