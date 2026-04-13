document.addEventListener("DOMContentLoaded", () => {

  const chatBox = document.getElementById("chatBox");
  const narration = document.getElementById("narration");
  const clientTabs = document.querySelectorAll(".client");

  if (!chatBox || !narration) return;

  let activeClient = 0;

  /* =========================
     TAB UI
     ========================= */

  function updateTabs() {
    clientTabs.forEach((tab, i) => {
      tab.classList.remove("active");
      if (i === activeClient) tab.classList.add("active");
    });
  }

  /* =========================
     CHAT HELPERS
     ========================= */

  function clearChat() {
    chatBox.innerHTML = "";
  }

  function addMessage(text, type) {
    const div = document.createElement("div");
    div.className = `message ${type}`;
    div.innerText = text;
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

  function showOptions(list) {
    list.forEach(text => {
      const div = document.createElement("div");
      div.className = "response-pill";
      div.innerText = text;
      chatBox.appendChild(div);
    });
  }

  /* =========================
     DEMO FLOW
     ========================= */

  function runDemo() {

    clearChat();

    /* ===== CLIENT 1 START ===== */
    activeClient = 0;
    updateTabs();
    narration.innerText = "Analyzing conversation...";

    setTimeout(() => {
      addMessage("Client: Sorry, been busy this week", "system");
    }, 500);

    setTimeout(showTyping, 1200);

    setTimeout(() => {
      removeTyping();
      showOptions([
        "No worries — I’ll keep this simple for you.",
        "All good, I can summarize this quickly.",
        "Following up when it works for you.",
        "Let me know when this becomes a priority."
      ]);
    }, 2000);

    setTimeout(() => {
      addMessage("No worries — I’ll keep this simple for you.", "user");
    }, 3000);

    /* ===== SWITCH CLIENT 2 ===== */
    setTimeout(() => {
      activeClient = 1;
      updateTabs();
      clearChat();
      narration.innerText = "Switching client...";
    }, 4200);

    setTimeout(() => {
      addMessage("Client: What’s the price?", "system");
    }, 4800);

    setTimeout(showTyping, 5500);

    setTimeout(() => {
      removeTyping();
      showOptions([
        "Happy to break this down based on your needs.",
        "I can share a quick cost overview for clarity.",
        "Let me know if you want more details.",
        "Take your time reviewing this."
      ]);
    }, 6300);

    setTimeout(() => {
      addMessage("Happy to break this down based on your needs.", "user");
    }, 7200);

    /* ===== BACK CLIENT 1 (CLOSE) ===== */
    setTimeout(() => {
      activeClient = 0;
      updateTabs();
      clearChat();
      narration.innerText = "Continuing...";
    }, 8500);

    setTimeout(() => {
      addMessage("Client: Sounds good, let's proceed", "system");
    }, 9000);

    setTimeout(showTyping, 9700);

    setTimeout(() => {
      removeTyping();
      showOptions([
        "Great — I’ll finalize everything and get started.",
        "Perfect, I’ll move ahead with the next steps.",
        "I’ll take this forward now.",
        "Sounds good."
      ]);
    }, 10500);

    setTimeout(() => {
      addMessage("Great — I’ll finalize everything and get started.", "user");
      addMessage("Client confirmed. Deal closed.", "system");
    }, 11500);

    /* ===== CLIENT 2 (CLOSE) ===== */
    setTimeout(() => {
      activeClient = 1;
      updateTabs();
      clearChat();
      narration.innerText = "Finalizing...";
    }, 13000);

    setTimeout(() => {
      addMessage("Client: Okay, that works", "system");
    }, 13500);

    setTimeout(showTyping, 14200);

    setTimeout(() => {
      removeTyping();
      showOptions([
        "Perfect — I’ll proceed with this.",
        "Great, I’ll move ahead now.",
        "Sounds good, taking this forward.",
        "All set."
      ]);
    }, 15000);

    setTimeout(() => {
      addMessage("Perfect — I’ll proceed with this.", "user");
      addMessage("Client confirmed. Deal closed.", "system");
    }, 16000);

    /* ===== LOOP ===== */
    setTimeout(runDemo, 18000);
  }

  /* =========================
     INIT
     ========================= */

  narration.innerText = "Live demo — Outflow in action.";
  updateTabs();
  runDemo();

});
