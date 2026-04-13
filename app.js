document.addEventListener("DOMContentLoaded", () => {

  const chatBox = document.getElementById("chatBox");
  const narration = document.getElementById("narration");
  const clientsUI = document.querySelectorAll(".client");
  const resetBtn = document.getElementById("resetDemo");

  if (!chatBox || !narration || clientsUI.length === 0) return;

  let activeClient = 0;

  const progress = [0, 0];
  const outcomeScore = [50, 50];
  const completed = [false, false];

  function generateOptions(baseText) {
    return [
      { text: baseText, type: "best" },
      { text: baseText.replace("just", "").replace("—", ""), type: "strong" },
      { text: "Following up on this.", type: "safe" },
      { text: "Let me know if this is still relevant.", type: "worse" }
    ];
  }

  const clients = [
    {
      final: "Client confirmed. Deal closed successfully.",
      stages: [
        { label: "Conversation active", system: "Client engaged earlier but conversation slowed down.", next: 1, options: generateOptions("Hey — just checking in, still interested?") },
        { label: "Client responded", system: "Client: 'Yes, just been busy.'", next: 2, options: generateOptions("No worries — I’ll keep this simple.") },
        { label: "Plan shared", system: "You shared a quick plan.", next: 3, options: generateOptions("Here’s a simple plan to get started.") },
        { label: "Waiting for response", system: "Client hasn’t responded.", next: 4, options: generateOptions("Just checking — had a chance to look?") },
        { label: "Engagement confirmed", system: "Client: 'Looks good, let’s proceed.'", next: "end", options: generateOptions("Great — I’ll finalize and start.") }
      ]
    },
    {
      final: "Conversation closed. Client chose another option.",
      stages: [
        { label: "Initial conversation", system: "New client responded to your initial message.", next: 1, options: generateOptions("Great connecting — what are you currently looking for?") },
        { label: "Client engaged", system: "Client is open but evaluating options.", next: 2, options: generateOptions("Let me outline a simple approach for you.") },
        { label: "Plan shared", system: "You shared a plan.", next: 3, options: generateOptions("Here’s a quick plan — let me know your thoughts.") },
        { label: "Client response", system: "Client: 'We chose another option.'", next: "end", options: generateOptions("Got it — appreciate the update.") }
      ]
    }
  ];

  function init() {
    for (let i = 0; i < clients.length; i++) {
      const s = Math.random() < 0.5 ? 0 : 1;
      progress[i] = s;
      outcomeScore[i] = s ? 60 : 50;
      completed[i] = false;
    }
  }

  function showStage() {
    if (completed[activeClient]) {
      chatBox.innerHTML = `<div class="message system">${clients[activeClient].final}</div>`;
      narration.textContent = "Outcome reached";
      return;
    }

    const stage = clients[activeClient].stages[progress[activeClient]];
    narration.textContent = stage.label;

    chatBox.innerHTML = `<div class="message system">${stage.system}</div>`;

    stage.options.forEach(opt => {
      const div = document.createElement("div");
      div.className = "response-pill";
      div.innerText = opt.text;
      div.onclick = () => select(opt);
      chatBox.appendChild(div);
    });
  }

  function select(opt) {
    if (completed[activeClient]) return;

    if (opt.type === "best") outcomeScore[activeClient] += 12;
    if (opt.type === "strong") outcomeScore[activeClient] += 8;
    if (opt.type === "safe") outcomeScore[activeClient] += 3;
    if (opt.type === "worse") outcomeScore[activeClient] -= 10;

    const stage = clients[activeClient].stages[progress[activeClient]];

    if (stage.next === "end") {
      completed[activeClient] = true;
      showStage();
      return;
    }

    progress[activeClient] = stage.next;
    showStage();
  }

  clientsUI.forEach((btn, i) => {
    if (btn.classList.contains("add")) return;

    btn.onclick = () => {
      activeClient = i;
      showStage();

      clientsUI.forEach((c, idx) => {
        c.classList.toggle("active", idx === i);
      });
    };
  });

  if (resetBtn) {
    resetBtn.onclick = () => {
      const i = activeClient;
      const s = Math.random() < 0.5 ? 0 : 1;
      progress[i] = s;
      outcomeScore[i] = s ? 60 : 50;
      completed[i] = false;
      showStage();
    };
  }

  init();
  showStage();
});
