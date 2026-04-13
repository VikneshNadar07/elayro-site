document.addEventListener("DOMContentLoaded", () => {

  const chatBox = document.getElementById("chatBox");
  const narration = document.getElementById("narration");
  const clientTabs = document.querySelectorAll(".client");

  if (!chatBox || !narration) return;

  let activeClient = 0;

  /* =========================
     TIMING ENGINE (HUMAN)
     ========================= */

  const wait = (t) => new Promise(res => setTimeout(res, t));

  const readTime = (text) => Math.max(1200, text.length * 35);
  const thinkTime = () => 1600 + Math.random() * 400;

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
    div.className = `message ${type} fade-in-up`;
    div.innerText = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function showTyping() {
    const div = document.createElement("div");
    div.className = "message system typing";
    div.innerHTML = `<span></span><span></span><span></span>`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function removeTyping() {
    const t = document.querySelector(".typing");
    if (t) t.remove();
  }

  function showOptions(list) {
    list.forEach((text, i) => {
      const div = document.createElement("div");
      div.className = "response-pill fade-in-up";
      div.innerText = text;

      setTimeout(() => {
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
      }, i * 220);
    });
  }

  function selectOption(index) {
    const options = document.querySelectorAll(".response-pill");
    if (!options[index]) return;

    options[index].classList.add("selected");

    setTimeout(() => {
      addMessage(options[index].innerText, "user");
    }, 500);
  }

  /* =========================
     DEMO FLOW (FINAL)
     ========================= */

  async function runDemo() {

    /* ===== CLIENT 1 START ===== */
    activeClient = 0;
    updateTabs();
    clearChat();
    narration.innerText = "User input received.";

    await wait(1200);

    const msg1 = "Client said they are busy this week";
    addMessage(msg1, "user");

    await wait(readTime(msg1));

    narration.innerText = "Analyzing...";
    showTyping();

    await wait(thinkTime());
    removeTyping();

    const opt1 = [
      "No worries — I’ll keep this simple for you.",
      "All good, I can summarize this quickly.",
      "Following up when it works for you.",
      "Let me know when this becomes a priority."
    ];

    showOptions(opt1);

    await wait(readTime(opt1[0]));
    selectOption(0);

    /* ===== SWITCH CLIENT 2 ===== */
    await wait(2500);

    activeClient = 1;
    updateTabs();
    clearChat();
    narration.innerText = "Switching client...";

    await wait(1200);

    const msg2 = "Client asked about pricing";
    addMessage(msg2, "user");

    await wait(readTime(msg2));

    narration.innerText = "Analyzing...";
    showTyping();

    await wait(thinkTime());
    removeTyping();

    const opt2 = [
      "Happy to break this down based on your needs.",
      "I can share a quick cost overview for clarity.",
      "Let me know if you want more details.",
      "Take your time reviewing this."
    ];

    showOptions(opt2);

    await wait(readTime(opt2[0]));
    selectOption(0);

    /* ===== BACK CLIENT 1 (CLOSE) ===== */
    await wait(2500);

    activeClient = 0;
    updateTabs();
    clearChat();
    narration.innerText = "Continuing conversation...";

    await wait(1200);

    const msg3 = "Client said let's proceed";
    addMessage(msg3, "user");

    await wait(readTime(msg3));

    showTyping();
    await wait(thinkTime());
    removeTyping();

    const opt3 = [
      "Great — I’ll finalize everything and get started.",
      "Perfect, I’ll move ahead with the next steps.",
      "I’ll take this forward now.",
      "Sounds good."
    ];

    showOptions(opt3);

    await wait(readTime(opt3[0]));
    selectOption(0);

    await wait(1400);
    addMessage("Outcome achieved.", "system");

    /* ===== CLIENT 2 (CLOSE) ===== */
    await wait(2500);

    activeClient = 1;
    updateTabs();
    clearChat();
    narration.innerText = "Finalizing...";

    await wait(1200);

    const msg4 = "Client said okay that works";
    addMessage(msg4, "user");

    await wait(readTime(msg4));

    showTyping();
    await wait(thinkTime());
    removeTyping();

    const opt4 = [
      "Perfect — I’ll proceed with this.",
      "Great, I’ll move ahead now.",
      "Sounds good, taking this forward.",
      "All set."
    ];

    showOptions(opt4);

    await wait(readTime(opt4[0]));
    selectOption(0);

    await wait(1400);
    addMessage("Outcome achieved.", "system");

    /* ===== LOOP ===== */
    await wait(3200);
    runDemo();
  }

  /* =========================
     INIT
     ========================= */

  narration.innerText = "Live demo — Outflow in action.";
  updateTabs();
  runDemo();

});
