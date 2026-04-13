/* ===============================
   OUTFLOW MULTI-CLIENT INTELLIGENT FLOW
   =============================== */

const chatBox = document.getElementById("chatBox");
const narration = document.getElementById("narration");
const clientsUI = document.querySelectorAll(".client");

if (chatBox) {

  let activeClient = 0;
  let stageIndex = 0;

  const clients = [
    {
      outcome: "won",
      stages: [
        {
          label: "Analyzing situation...",
          system: "Client showed interest but stopped responding.",
          options: [
            { text: "Hey — just checking in, still interested?", type: "best", confidence: "high" },
            { text: "Quick follow-up — want me to share next steps?", type: "safe", confidence: "medium" },
            { text: "Should I send a short outline?", type: "safe", confidence: "medium" },
            { text: "Let me know if this is still relevant.", type: "fallback", confidence: "low" }
          ]
        },
        {
          label: "Client responded",
          system: "Client: 'Yes, just been busy.'",
          options: [
            { text: "No worries — I’ll keep this simple.", type: "best", confidence: "high" },
            { text: "Totally understand, here’s the next step.", type: "safe", confidence: "medium" },
            { text: "Let’s move forward when you're ready.", type: "safe", confidence: "medium" },
            { text: "Here’s a quick breakdown.", type: "fallback", confidence: "low" }
          ]
        },
        {
          label: "Engagement phase",
          system: "Client is open — move forward.",
          options: [
            { text: "I’ll send a quick plan now.", type: "best", confidence: "high" },
            { text: "Let’s finalize this together.", type: "safe", confidence: "medium" },
            { text: "Here’s exactly how we proceed.", type: "safe", confidence: "medium" },
            { text: "We can start right away.", type: "fallback", confidence: "low" }
          ]
        }
      ],
      final: "Client confirmed. Deal closed successfully."
    },

    {
      outcome: "lost",
      stages: [
        {
          label: "Analyzing situation...",
          system: "Client showed interest but went silent.",
          options: [
            { text: "Hey — just following up, still interested?", type: "best", confidence: "high" },
            { text: "Should I share a quick outline?", type: "safe", confidence: "medium" },
            { text: "Let me know if timing works.", type: "safe", confidence: "medium" },
            { text: "Happy to reconnect if needed.", type: "fallback", confidence: "low" }
          ]
        },
        {
          label: "Client responded",
          system: "Client: 'Hey, I went with someone else.'",
          options: [
            { text: "Got it — appreciate you letting me know.", type: "best", confidence: "high" },
            { text: "No problem at all, thanks for the update.", type: "safe", confidence: "medium" },
            { text: "Totally understand, wishing you the best.", type: "safe", confidence: "medium" },
            { text: "Thanks for considering — appreciate it.", type: "fallback", confidence: "low" }
          ]
        },
        {
          label: "Closure phase",
          system: "Client decision is external.",
          options: [
            { text: "If anything changes, feel free to reach out.", type: "best", confidence: "high" },
            { text: "Happy to connect in future if needed.", type: "safe", confidence: "medium" },
            { text: "Open anytime if you need support.", type: "safe", confidence: "medium" },
            { text: "All the best with your project.", type: "fallback", confidence: "low" }
          ]
        }
      ],
      final: "Conversation closed. Client chose another option."
    }
  ];

  function updateClientUI() {
    clientsUI.forEach((c, i) => {
      c.classList.toggle("active", i === activeClient);
    });
  }

  function showStage() {
    chatBox.innerHTML = "";
    const stage = clients[activeClient].stages[stageIndex];

    narration.textContent = stage.label;

    const msg = document.createElement("div");
    msg.className = "message system";
    msg.textContent = stage.system;
    chatBox.appendChild(msg);

    const container = document.createElement("div");
    container.className = "response-options";

    stage.options.forEach(opt => {
      const pill = document.createElement("div");
      pill.className = "response-pill";

      const text = document.createElement("div");
      text.textContent = opt.text;

      const meta = document.createElement("div");
      meta.className = "response-meta";

      const badge = document.createElement("span");
      badge.className = `badge ${opt.type}`;
      badge.textContent = opt.type.toUpperCase();

      const conf = document.createElement("span");
      conf.className = `conf ${opt.confidence}`;
      conf.textContent = opt.confidence;

      meta.appendChild(badge);
      meta.appendChild(conf);

      pill.appendChild(text);
      pill.appendChild(meta);

      pill.onclick = () => handleSelection(opt.text);

      container.appendChild(pill);
    });

    chatBox.appendChild(container);
  }

  function handleSelection(text) {
    chatBox.innerHTML = "";

    const userMsg = document.createElement("div");
    userMsg.className = "message user";
    userMsg.textContent = text;
    chatBox.appendChild(userMsg);

    narration.textContent = "Processing...";

    setTimeout(() => {
      stageIndex++;

      if (stageIndex >= clients[activeClient].stages.length) {

        chatBox.innerHTML = "";

        const finalMsg = document.createElement("div");
        finalMsg.className = "message system";
        finalMsg.textContent = clients[activeClient].final;

        chatBox.appendChild(finalMsg);

        narration.textContent =
          clients[activeClient].outcome === "won"
            ? "Outcome: Success"
            : "Outcome: Closed (External)";

        setTimeout(() => {
          activeClient = activeClient === 0 ? 1 : 0;
          stageIndex = 0;
          updateClientUI();
          showStage();
        }, 4000);

      } else {
        showStage();
      }

    }, 1000);
  }

  clientsUI.forEach((btn, index) => {
    btn.onclick = () => {
      activeClient = index;
      stageIndex = 0;
      updateClientUI();
      showStage();
    };
  });

  updateClientUI();
  showStage();
}
