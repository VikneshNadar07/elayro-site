document.addEventListener("DOMContentLoaded", () => {

  const chatBox = document.getElementById("chatBox");
  const narration = document.getElementById("narration");
  const input = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");
  const clientTabs = document.querySelectorAll(".client");

  if (!chatBox || !narration) return;

  /* =========================
     CLIENT SYSTEM
     ========================= */

  let activeClient = 0;

  const clients = [
    createClient(),
    createClient()
  ];

  function createClient() {
    return {
      messages: [],
      state: "active", // active | closing | won | lost
      isClosed: false
    };
  }

  /* =========================
     MESSAGE SYSTEM
     ========================= */

  function renderChat() {
    chatBox.innerHTML = "";

    clients[activeClient].messages.forEach(msg => {
      const div = document.createElement("div");
      div.className = `message ${msg.type}`;
      div.innerText = msg.text;
      chatBox.appendChild(div);
    });

    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function addMessage(text, type = "system") {
    clients[activeClient].messages.push({ text, type });
    renderChat();
  }

  /* =========================
     TAB UI STATE
     ========================= */

  function updateTabUI() {
    clientTabs.forEach((tab, i) => {

      tab.classList.remove("active", "won", "lost");

      if (i === activeClient) tab.classList.add("active");

      const state = clients[i].state;
      if (state === "won") tab.classList.add("won");
      if (state === "lost") tab.classList.add("lost");
    });
  }

  /* =========================
     ADVANCED INTENT DETECTION
     ========================= */

  function detectIntent(text) {

    const t = text.toLowerCase();

    const delaySignals = [
      "busy","later","not now","next week","get back",
      "will check","need time","circle back"
    ];

    const evaluationSignals = [
      "price","cost","budget","expensive","afford",
      "quote","pricing","how much"
    ];

    const rejectionSignals = [
      "not interested","no thanks","no need","already have",
      "went with someone else","no longer"
    ];

    const readySignals = [
      "ok","sounds good","looks good","let's proceed",
      "go ahead","works for me","i'm in","deal"
    ];

    const hesitationSignals = [
      "thinking","not sure","maybe","considering",
      "let me think","will decide","unsure"
    ];

    const ghostSignals = [
      "sorry for late reply","just saw this",
      "been busy","missed this"
    ];

    const matches = (arr) => arr.some(s => t.includes(s));

    if (matches(rejectionSignals)) return "rejection";
    if (matches(readySignals)) return "ready";
    if (matches(evaluationSignals)) return "evaluation";
    if (matches(delaySignals)) return "delay";
    if (matches(hesitationSignals)) return "evaluation";
    if (matches(ghostSignals)) return "followup";

    return "followup";
  }

  /* =========================
     RESPONSE ENGINE
     ========================= */

  function generate(intent) {

    const map = {
      followup: [
        "Hey — just checking in, still interested?",
        "Quick follow-up — want me to share next steps?",
        "Following up on this.",
        "Let me know if this is still relevant."
      ],
      delay: [
        "No worries — I’ll keep this simple for you.",
        "All good, I can summarize this quickly.",
        "Following up when it works for you.",
        "Let me know when this becomes a priority."
      ],
      evaluation: [
        "Happy to break this down based on your needs.",
        "I can share a quick cost overview for clarity.",
        "Let me know if you want more details.",
        "Take your time reviewing this."
      ],
      rejection: [
        "Got it — appreciate you letting me know.",
        "No problem at all, thanks for the update.",
        "All good — if things change, feel free to reach out.",
        "Understood."
      ],
      ready: [
        "Great — I’ll finalize everything and get started.",
        "Perfect, I’ll move ahead with the next steps.",
        "I’ll take this forward now.",
        "Sounds good."
      ]
    };

    return map[intent];
  }

  /* =========================
     OPTIONS UI
     ========================= */

  function showOptions(list) {

    removeOptions();

    const labels = ["BEST", "STRONG", "SAFE", "CASUAL"];

    list.forEach((text, i) => {

      const div = document.createElement("div");
      div.className = "response-pill";

      div.innerHTML = `
        <span class="pill-label">${labels[i]}</span>
        <div class="pill-text">${text}</div>
      `;

      div.onclick = () => handleSelection(text, i);

      chatBox.appendChild(div);
    });
  }

  function removeOptions() {
    document.querySelectorAll(".response-pill").forEach(el => el.remove());
  }

  /* =========================
     SELECTION LOGIC
     ========================= */

  function handleSelection(text, index) {

    const client = clients[activeClient];
    if (client.isClosed) return;

    navigator.clipboard.writeText(text);

    addMessage(text, "user");

    removeOptions();

    /* ===== WIN CONDITION ===== */

    if (client.state === "closing" && index === 0) {
      client.state = "won";
      client.isClosed = true;

      narration.innerText = "Deal closed.";
      addMessage("Client confirmed. Deal closed.", "system");
      updateTabUI();
      return;
    }

    narration.innerText = "Copied & sent. Waiting...";
  }

  /* =========================
     MAIN FLOW
     ========================= */

  function analyze(text) {

    const client = clients[activeClient];

    if (client.isClosed) {
      narration.innerText = "Conversation closed.";
      return;
    }

    narration.innerText = "Analyzing...";

    setTimeout(() => {

      const intent = detectIntent(text);

      /* ===== STATE TRANSITIONS ===== */

      if (intent === "ready") {
        client.state = "closing";
      }

      if (intent === "rejection") {
        client.state = "lost";
        client.isClosed = true;

        addMessage("Conversation closed.", "system");
        narration.innerText = "Closed";
        updateTabUI();
        return;
      }

      /* ===== NORMAL FLOW ===== */

      narration.innerText = "Suggested responses";

      const list = generate(intent);
      showOptions(list);

    }, 250);
  }

  /* =========================
     INPUT
     ========================= */

  if (sendBtn && input) {
    sendBtn.onclick = () => {

      const client = clients[activeClient];
      if (client.isClosed) return;

      const text = input.value.trim();
      if (!text) return;

      addMessage(text, "system"); // client message
      input.value = "";

      analyze(text);
    };
  }

  /* =========================
     CLIENT SWITCH
     ========================= */

  clientTabs.forEach((tab, i) => {

    if (tab.classList.contains("add")) return;

    tab.onclick = () => {
      activeClient = i;
      renderChat();
      updateTabUI();
      narration.innerText = "Switched client.";
    };
  });

  /* =========================
     INIT
     ========================= */

  renderChat();
  updateTabUI();

});
