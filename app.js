document.addEventListener("DOMContentLoaded", () => {

  const chatBox = document.getElementById("chatBox");
  const narration = document.getElementById("narration");
  const clientTabs = document.querySelectorAll(".client");
  const optionsPanel = document.getElementById("optionsPanel");

  if (!chatBox || !narration || !optionsPanel) return;

  let activeClient = 0;

  /* =========================
     TIMING ENGINE
     ========================= */

  const wait = (t) => new Promise(res => setTimeout(res, t));
  const readTime = (t) => Math.max(1200, t.length * 35);
  const thinkTime = () => 1600 + Math.random() * 400;

  /* =========================
     GHOST CURSOR (NO GLOW)
     ========================= */

  const ghostCursor = document.createElement("div");
  ghostCursor.className = "ghost-cursor";
  document.body.appendChild(ghostCursor);

  function moveCursorTo(el) {
    const rect = el.getBoundingClientRect();
    ghostCursor.style.opacity = "1";

    setTimeout(() => {
      ghostCursor.style.left = rect.left + rect.width / 2 + "px";
      ghostCursor.style.top = rect.top + rect.height / 2 + "px";
    }, 80);
  }

  function clickCursor() {
    ghostCursor.style.transform = "translate(-50%, -50%) scale(0.7)";
    setTimeout(() => {
      ghostCursor.style.transform = "translate(-50%, -50%) scale(1)";
    }, 100);
  }

  function hideCursor() {
    setTimeout(() => {
      ghostCursor.style.opacity = "0";
    }, 250);
  }

  function hesitateCursor() {
    return new Promise(resolve => {
      const delay = 200 + Math.random() * 200;

      setTimeout(() => {
        const offsetX = (Math.random() - 0.5) * 6;
        const offsetY = (Math.random() - 0.5) * 6;

        ghostCursor.style.transform =
          `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;

        setTimeout(() => {
          ghostCursor.style.transform = "translate(-50%, -50%)";
          resolve();
        }, 120);
      }, delay);
    });
  }

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

  /* =========================
     OPTIONS PANEL (AUTO DEMO)
     ========================= */

  async function showOptions(list, autoIndex = 0) {

    optionsPanel.innerHTML = "";
    const chatArea = document.querySelector(".chat-area");

    chatArea.classList.add("dimmed");

    let buttons = [];

    list.forEach((text, i) => {
      const btn = document.createElement("div");
      btn.className = "option-btn";
      btn.innerText = text;

      setTimeout(() => {
        optionsPanel.appendChild(btn);
      }, i * 120);

      buttons.push(btn);
    });

    await wait(1600);

    const selected = buttons[autoIndex];
    if (!selected) return;

    moveCursorTo(selected);
    await wait(400);

    await hesitateCursor();

    clickCursor();
    selected.classList.add("selected");

    await wait(350);

    hideCursor();

    optionsPanel.innerHTML = "";
    chatArea.classList.remove("dimmed");

    addMessage(selected.innerText, "user");
  }

  /* =========================
     DEMO FLOW
     ========================= */

  async function runDemo() {

    /* CLIENT 1 */
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

    await showOptions([
      "No worries — I’ll keep this simple for you.",
      "All good, I can summarize this quickly.",
      "Following up when it works for you.",
      "Let me know when this becomes a priority."
    ]);

    await wait(2000);

    msg = "Client said maybe next week";
    addMessage(msg, "user");
    await wait(readTime(msg));

    showTyping();
    await wait(thinkTime());
    removeTyping();

    await showOptions([
      "Sure — I’ll follow up early next week.",
      "Works — I’ll check back in then.",
      "I’ll keep this ready for you.",
      "Let me know if anything changes."
    ]);

    /* CLIENT 2 */
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

    await showOptions([
      "Happy to break this down based on your needs.",
      "I can share a quick cost overview.",
      "Let me know if you want full details.",
      "We can customize based on your budget."
    ]);

    await wait(2000);

    msg = "Client asked for final details";
    addMessage(msg, "user");
    await wait(readTime(msg));

    showTyping();
    await wait(thinkTime());
    removeTyping();

    await showOptions([
      "I’ll send everything clearly in one message.",
      "Sharing full details now.",
      "Here’s everything you need to get started.",
      "Let me break it down simply."
    ]);

    /* CLOSE CLIENT 1 */
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

    await showOptions([
      "Great — I’ll finalize everything.",
      "Perfect — I’ll get started.",
      "Moving ahead with this.",
      "Let’s begin."
    ]);

    await wait(1200);
    addMessage("Outcome achieved.", "system");

    /* CLOSE CLIENT 2 */
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

    await showOptions([
      "Perfect — proceeding now.",
      "Great — I’ll move ahead.",
      "All set — starting now.",
      "Sounds good."
    ]);

    await wait(1200);
    addMessage("Outcome achieved.", "system");

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
