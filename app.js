/* =========================
   ELAYRO FULL APP.JS
   (ALL PAGES + DEMO + NOTIFY)
========================= */

document.addEventListener("DOMContentLoaded", () => {

  const wait = (t) => new Promise(res => setTimeout(res, t));

  /* =========================
     NAV (ALL PAGES)
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
     SECTION FADE-IN
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
        await wait(20 + Math.random() * 20);
      }

      sendBtn.classList.add("press");
      await wait(120);
      sendBtn.classList.remove("press");

      addMessage(text, "user");

      input.value = "";
      input.classList.remove("typing-active");

      await wait(600);
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
          "Let me walk you through the pricing clearly.",
          "I can share the details so it’s easier to decide.",
          "I’ll explain it in a simple way."
        ],
        scope:[
          "Let me define the scope clearly so everything is aligned.",
          "I’ll break down exactly what’s included.",
          "We can go step by step so nothing is unclear.",
          "I’ll simplify it for you."
        ],
        evaluating:[
          "Take your time — I can help you compare what fits best.",
          "Happy to guide you through the options.",
          "Let me simplify the decision for you.",
          "We can narrow this down quickly."
        ],
        engaged:[
          "Great — let’s keep this moving forward.",
          "We’re aligned, I’ll take this ahead.",
          "Let’s build on this momentum.",
          "We’re progressing well here."
        ],
        delayed:[
          "No problem — we can pick this up when you’re ready.",
          "All good, I’ll follow up at a better time.",
          "We’ll continue whenever it works for you.",
          "I’ll check back in shortly."
        ],
        ghosting:[
          "Just checking in — does this still make sense for you?",
          "Following up to keep things moving.",
          "Happy to revisit this whenever you're ready.",
          "Hey — just wanted to check in."
        ],
        followup:[
          "Circling back to keep this moving.",
          "Following up again here.",
          "Let’s reconnect on this.",
          "Checking in once more."
        ],
        closing:[
          "Perfect — I’ll lock this in and proceed.",
          "Great, I’ll finalize everything now.",
          "We’re good to go from here.",
          "Let’s get this started."
        ]
      }[s];
    }

    function getReason(result) {
      return result === "win"
        ? "Closed smoothly with clear alignment."
        : "Lost due to drop in momentum.";
    }

    async function showOptions(state) {

      optionsPanel.innerHTML = '<div class="thinking"></div>';
      await wait(900);

      optionsPanel.innerHTML = "";

      const options = getOptions(state);
      const elements = [];

      for (let i = 0; i < 4; i++) {
        const d = document.createElement("div");
        d.className = "option-bubble";

        d.innerHTML = `
          <span class="tag">${["Best","Strong","Safe","Casual"][i]}</span>
          ${options[i]}
        `;

        optionsPanel.appendChild(d);
        elements.push(d);

        await wait(200);
      }

      await wait(1000);

      elements[0].classList.add("best-glow");
      await wait(400);

      elements[0].classList.add("selected");
      await wait(400);

      optionsPanel.innerHTML = "";

      addMessage(options[0], "system");

      await wait(800);
    }

    async function runDemo() {

      while (true) {

        const clients = {
          0:{state:getRandomStart(),done:false,steps:0,max:5},
          1:{state:getRandomStart(),done:false,steps:0,max:4}
        };

        chats = {0:[],1:[]};
        chatBox.innerHTML = "";
        optionsPanel.innerHTML = "";

        while (!clients[0].done || !clients[1].done) {

          for (let i = 0; i < 2; i++) {

            if (clients[i].done) continue;

            await switchClient(i);

            const batch = 2 + Math.floor(Math.random()*2);

            for (let b = 0; b < batch; b++) {

              if (clients[i].done) break;

              const state = clients[i].state;

              await typeMessage(getMsg(state));
              await showOptions(state);

              clients[i].steps++;

              if (clients[i].steps >= clients[i].max) {
                const win = state === "closing" || state === "engaged";

                addMessage(win ? "Deal closed." : "Conversation lost.", "system");
                addMessage(getReason(win ? "win":"lost"), "system");

                clients[i].done = true;
                break;
              }

              clients[i].state = getNextState(state);
            }
          }
        }

        await wait(2000);

        chatBox.innerHTML = "";
        optionsPanel.innerHTML = "";

        await wait(800);
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
