document.addEventListener("DOMContentLoaded", () => {

  const chatBox = document.getElementById("chatBox");
  const narration = document.getElementById("narration");
  const clientTabs = document.querySelectorAll(".client");

  if (!chatBox || !narration) return;

  let activeClient = 0;

  /* =========================
     TIMING ENGINE
     ========================= */

  const wait = (t) => new Promise(res => setTimeout(res, t));
  const readTime = (t) => Math.max(1200, t.length * 35);
  const thinkTime = () => 1600 + Math.random() * 400;

  /* =========================
     UI HELPERS
     ========================= */

  function updateTabs() {
    clientTabs.forEach((tab, i) => {
      tab.classList.toggle("active", i === activeClient);
    });
  }

  function clearChat() {
    chatBox.innerHTML = "";
  }

  function addMessage(text, type) {
    const div = document.createElement("div");
    div.className = `message ${type} fade-in-up`;
    div.innerText = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
    checkScroll();
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
        checkScroll();
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
     SCROLL BUTTON
     ========================= */

  const scrollBtn = document.createElement("button");
  scrollBtn.innerText = "↓";
  scrollBtn.className = "scroll-btn";
  document.body.appendChild(scrollBtn);

  scrollBtn.onclick = () => {
    chatBox.scrollTop = chatBox.scrollHeight;
  };

  function checkScroll() {
    if (chatBox.scrollHeight > chatBox.clientHeight + 50) {
      scrollBtn.style.opacity = "1";
    } else {
      scrollBtn.style.opacity = "0";
    }
  }

  /* =========================
     DEMO FLOW
     ========================= */

  async function runDemo() {

    /* ===== CLIENT 1 (PART 1) ===== */
    activeClient = 0;
    updateTabs();
    clearChat();
    narration.innerText = "User input received.";

    let msg = "Client said they are busy this week";
    addMessage(msg, "user");

    await wait(readTime(msg));

    showTyping();
    await wait(thinkTime());
    removeTyping();

    let opt = [
      "No worries — I’ll keep this simple for you.",
      "All good, I can summarize this quickly.",
      "Following up when it works for you.",
      "Let me know when this becomes a priority."
    ];

    showOptions(opt);
    await wait(readTime(opt[0]));
    selectOption(0);

    /* SECOND TURN */
    await wait(2000);

    msg = "Client said maybe next week";
    addMessage(msg, "user");

    await wait(readTime(msg));

    showTyping();
    await wait(thinkTime());
    removeTyping();

    showOptions([
      "Sure — I’ll follow up early next week.",
      "Works — I’ll check back in then.",
      "I’ll keep this ready for you.",
      "Let me know if anything changes."
    ]);

    await wait(2000);
    selectOption(0);

    /* ===== SWITCH CLIENT 2 ===== */
    await wait(2500);

    activeClient = 1;
    updateTabs();
    clearChat();
    narration.innerText = "Switching client...";

    msg = "Client asked about pricing";
    addMessage(msg, "user");

    await wait(readTime(msg));

    showTyping();
    await wait(thinkTime());
    removeTyping();

    showOptions([
      "Happy to break this down based on your needs.",
      "I can share a quick cost overview.",
      "Let me know if you want full details.",
      "We can customize based on your budget."
    ]);

    await wait(2000);
    selectOption(0);

    /* SECOND TURN CLIENT 2 */
    await wait(2000);

    msg = "Client asked for final details";
    addMessage(msg, "user");

    await wait(readTime(msg));

    showTyping();
    await wait(thinkTime());
    removeTyping();

    showOptions([
      "I’ll send everything clearly in one message.",
      "Sharing full details now.",
      "Here’s everything you need to get started.",
      "Let me break it down simply."
    ]);

    await wait(2000);
    selectOption(0);

    /* ===== BACK CLIENT 1 (CLOSE) ===== */
    await wait(2500);

    activeClient = 0;
    updateTabs();
    clearChat();
    narration.innerText = "Continuing...";

    msg = "Client said let's proceed";
    addMessage(msg, "user");

    await wait(readTime(msg));

    showTyping();
    await wait(thinkTime());
    removeTyping();

    showOptions([
      "Great — I’ll finalize everything.",
      "Perfect — I’ll get started.",
      "Moving ahead with this.",
      "Let’s begin."
    ]);

    await wait(2000);
    selectOption(0);

    await wait(1200);
    addMessage("Outcome achieved.", "system");

    /* ===== CLIENT 2 (CLOSE) ===== */
    await wait(2500);

    activeClient = 1;
    updateTabs();
    clearChat();
    narration.innerText = "Finalizing...";

    msg = "Client said okay that works";
    addMessage(msg, "user");

    await wait(readTime(msg));

    showTyping();
    await wait(thinkTime());
    removeTyping();

    showOptions([
      "Perfect — proceeding now.",
      "Great — I’ll move ahead.",
      "All set — starting now.",
      "Sounds good."
    ]);

    await wait(2000);
    selectOption(0);

    await wait(1200);
    addMessage("Outcome achieved.", "system");

    /* LOOP */
    await wait(3000);
    runDemo();
  }

  /* =========================
     INIT
     ========================= */

  narration.innerText = "Live demo — Outflow in action.";
  updateTabs();
  runDemo();

});
