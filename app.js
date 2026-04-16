/* =========================
   ELAYRO GLOBAL APP.JS
   (FINAL TRUE MERGE — COMPLETE SYSTEM)
========================= */

document.addEventListener("DOMContentLoaded", () => {

  const wait = (t) => new Promise(res => setTimeout(res, t));

  /* =========================
     GLOBAL NAV
  ========================= */

  const navLinks = document.querySelectorAll(".nav-minimal a");

  let currentPage = window.location.pathname.split("/").pop();
  if (!currentPage) currentPage = "index.html";

  navLinks.forEach(link => {
    const href = link.getAttribute("href");

    if (href === currentPage) link.style.opacity = "0.4";

    link.addEventListener("click", (e) => {
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
    const total = document.body.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / total) * 100;
    if (progressBar) progressBar.style.width = progress + "%";
  });

  /* =========================
     FADE-IN
  ========================= */

  const observer = new IntersectionObserver((entries) => {
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
  const demoContainer = document.querySelector(".demo-container");

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

      requestAnimationFrame(() => {
        chatBox.scrollTop = chatBox.scrollHeight;
      });
    }

    function addMessage(text, type) {
      chats[activeClient].push({ text, type });

      const d = document.createElement("div");
      d.className = `message ${type}`;
      d.innerText = text;

      chatBox.appendChild(d);

      requestAnimationFrame(() => {
        chatBox.scrollTop = chatBox.scrollHeight;
      });
    }

    async function switchClient(i) {
      activeClient = i;
      updateTabs();
      renderChat(i);
      await wait(400);
    }

    function setFocus(state) {
      if (demoContainer) {
        demoContainer.classList.toggle("focus-mode", state);
      }
    }

    async function typeMessage(text) {
      setFocus(true);

      input.value = "";

      for (let i = 0; i < text.length; i++) {
        input.value += text[i];
        await wait(20);
      }

      sendBtn.classList.add("press");
      await wait(120);
      sendBtn.classList.remove("press");

      addMessage(text, "user");

      input.value = "";

      await wait(400);
    }

    /* =========================
       STATE MACHINE
    ========================= */

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
        evaluating:"Client is evaluating options",
        engaged:"Client is actively engaging",
        delayed:"Client said maybe later",
        ghosting:"Client stopped replying",
        followup:"Following up again",
        closing:"Client is ready to proceed"
      }[s];
    }

    function getOptions(s) {
      return {
        pricing:["Here’s a clear breakdown so you know exactly what to expect.","Let me outline pricing clearly.","I can share pricing.","I’ll explain it simply."],
        scope:["Let me define scope clearly.","I’ll break it down.","We’ll go step by step.","I’ll simplify it."],
        evaluating:["Take your time.","I’ll help compare.","Let’s simplify decision.","We’ll narrow it."],
        engaged:["Great — let’s move forward.","We’re aligned.","Let’s continue.","Good progress."],
        delayed:["No problem.","We’ll continue later.","I’ll follow up.","We’ll pick this up."],
        ghosting:["Checking in.","Following up.","Happy to revisit.","Just checking."],
        followup:["Circling back.","Following up again.","Reconnect here.","Checking again."],
        closing:["Perfect — proceeding.","Finalizing.","We’re good.","Let’s start."]
      }[s];
    }

    /* =========================
       SILENCE / NOTIFY HANDLER
    ========================= */

    async function handleSilence(state) {

      addMessage("...", "system");
      await wait(800);

      const follow = getOptions("followup")[0];
      addMessage(follow, "system");

      await wait(400);
    }

    async function showOptions(state) {

      optionsPanel.innerHTML = '<div class="thinking"></div>';
      await wait(600);

      const options = getOptions(state);
      optionsPanel.innerHTML = "";

      const buttons = [];

      options.forEach((opt, i) => {
        const d = document.createElement("div");
        d.className = "option-btn";
        d.innerHTML = `<strong>${["Best","Strong","Safe","Casual"][i]}</strong><br>${opt}`;
        optionsPanel.appendChild(d);
        buttons.push(d);
      });

      await wait(500);

      const selected = buttons[0];
      selected.classList.add("selected");

      await wait(300);

      optionsPanel.innerHTML = "";
      addMessage(options[0], "system");
    }

    /* =========================
       DEMO LOOP (FINAL)
    ========================= */

    async function runDemo() {

      while (true) {

        const clients = {
          0:{state:getRandomStart(),done:false,steps:0,max:5,history:[]},
          1:{state:getRandomStart(),done:false,steps:0,max:4,history:[]}
        };

        chats = {0:[],1:[]};
        chatBox.innerHTML = "";
        optionsPanel.innerHTML = "";

        let active = 0;

        while (!clients[0].done || !clients[1].done) {

          active = active === 0 ? 1 : 0;

          if (clients[active].done) continue;

          const batch = 2 + Math.floor(Math.random() * 2);

          for (let b = 0; b < batch; b++) {

            if (clients[active].done) break;

            await switchClient(active);

            const state = clients[active].state;
            clients[active].history.push(state);

            // 🔥 HANDLE SILENCE STATES
            if (state === "ghosting") {
              await handleSilence(state);
            } else {
              await typeMessage(getMsg(state));
              await showOptions(state);
            }

            clients[active].steps++;

            const next = getNextState(state);

            if (next === "won" || next === "lost" || clients[active].steps >= clients[active].max) {

              const win = next === "won" || state === "closing" || state === "engaged";

              addMessage(win ? "Deal closed." : "Conversation lost.", "system");
              addMessage(win ? "Closed with strong alignment." : "Lost due to drop-off.", "system");

              clients[active].done = true;
              break;
            }

            clients[active].state = next;
          }
        }

        await wait(2000);
        addMessage("Starting new conversations...", "system");
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
