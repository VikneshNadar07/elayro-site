/* =========================
   ELAYRO FINAL APP.JS
   FULL PROJECT (STABLE + HUMAN FLOW)
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
     FADE
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

      // 🔥 SMOOTH AUTO SCROLL
      chatBox.scrollTo({
        top: chatBox.scrollHeight,
        behavior: "smooth"
      });
    }

    async function switchClient(i) {
      activeClient = i;
      updateTabs();
      renderChat(i);
      await wait(800); // slower switch
    }

    async function typeMessage(text) {
      input.value = "";

      for (let i = 0; i < text.length; i++) {
        input.value += text[i];
        await wait(30 + Math.random() * 40); // slower typing
      }

      sendBtn.classList.add("press");
      await wait(150);
      sendBtn.classList.remove("press");

      addMessage(text, "user");
      input.value = "";

      await wait(900);
    }

    /* =========================
       CONVERSATIONS
    ========================= */

    const flows = [
      {
        messages: [
          "Hey, can you share pricing?",
          "Is there flexibility here?",
          "That sounds good actually",
          "Let’s move ahead"
        ],
        result: "win"
      },
      {
        messages: [
          "What’s included exactly?",
          "Hmm seems a bit high",
          "I’ll think about it",
          null,
          null
        ],
        result: "lost"
      }
    ];

    function getOptions(msg) {

      if (!msg) {
        return [
          "Just checking in — does this still make sense?",
          "Following up — happy to continue anytime.",
          "Wanted to see if this is still relevant.",
          "Hey — just circling back here."
        ];
      }

      if (msg.includes("pricing")) return [
        "Here’s a clear breakdown so you know exactly what to expect.",
        "Let me walk you through pricing clearly.",
        "I’ll share details so it’s easier to decide.",
        "I’ll explain it simply."
      ];

      if (msg.includes("flex")) return [
        "Yes — we can adjust this based on your needs.",
        "We can definitely make this flexible.",
        "There’s room to adapt this.",
        "We can tweak it to fit better."
      ];

      if (msg.includes("high")) return [
        "We can optimize this to fit better.",
        "Let’s refine this slightly.",
        "We can adjust the scope to reduce cost.",
        "There’s room to improve this."
      ];

      if (msg.includes("think")) return [
        "Makes sense — take your time.",
        "All good — I’m here when ready.",
        "No rush — we can continue later.",
        "Happy to reconnect anytime."
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
      await wait(1200); // slower thinking

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
        await wait(250);
      }

      await wait(1200);

      optionsPanel.innerHTML = "";
      addMessage(options[0], "system");

      await wait(900);
    }

    async function runDemo() {

      while (true) {

        chats = { 0: [], 1: [] };
        chatBox.innerHTML = "";
        optionsPanel.innerHTML = "";

        let steps = [0, 0];
        let done = [false, false];

        while (!done[0] || !done[1]) {

          for (let i = 0; i < 2; i++) {

            if (done[i]) continue;

            await switchClient(i);

            const flow = flows[i];

            const batch = 2 + Math.floor(Math.random() * 2);

            for (let b = 0; b < batch; b++) {

              if (steps[i] >= flow.messages.length) {
                done[i] = true;

                addMessage(
                  flow.result === "win"
                    ? "✅ Deal closed successfully"
                    : "❌ Conversation lost",
                  "system"
                );

                break;
              }

              const msg = flow.messages[steps[i]];

              if (msg === null) {
                await wait(2000);
              } else {
                await typeMessage(msg);
              }

              await showOptions(msg);

              steps[i]++;
            }
          }
        }

        await wait(2500);

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
