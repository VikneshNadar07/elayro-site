/* ===============================
   OUTFLOW FINAL SYSTEM (LOCKED)
   =============================== */

const chatBox = document.getElementById("chatBox");
const narration = document.getElementById("narration");
const clientsUI = document.querySelectorAll(".client");

if (chatBox && narration && clientsUI.length > 0) {

  let activeClient = 0;

  const progress = [0, 0];
  const outcomeScore = [50, 50];
  const completed = [false, false]; // 🔥 LOCK STATE

  const clients = [
    {
      outcome: "won",
      final: "Client confirmed. Deal closed successfully.",
      stages: [
        {
          label: "Analyzing situation...",
          system: "Client showed interest but stopped responding.",
          next: 1,
          options: [
            {
              text: "Hey — just checking in, still interested?",
              type: "best",
              confidence: "high",
              reason: "Direct and re-engages immediately"
            },
            {
              text: "Quick follow-up — want me to share next steps?",
              type: "safe",
              confidence: "medium",
              reason: "Keeps momentum going"
            },
            {
              text: "Let me know if this is still relevant.",
              type: "fallback",
              confidence: "low",
              reason: "Passive and low engagement"
            }
          ]
        },
        {
          label: "Client responded",
          system: "Client: 'Yes, just been busy.'",
          next: 2,
          options: [
            {
              text: "No worries — I’ll keep this simple.",
              type: "best",
              confidence: "high",
              reason: "Reduces friction immediately"
            },
            {
              text: "Totally understand, here’s the next step.",
              type: "safe",
              confidence: "medium",
              reason: "Moves forward with clarity"
            },
            {
              text: "Let’s move forward when you're ready.",
              type: "fallback",
              confidence: "low",
              reason: "Too passive, delays progress"
            }
          ]
        },
        {
          label: "Plan shared",
          system: "You shared a quick plan.",
          next: 3,
          options: [
            {
              text: "Here’s a simple plan to get started.",
              type: "best",
              confidence: "high",
              reason: "Clear and actionable"
            },
            {
              text: "Sharing a quick outline for you.",
              type: "safe",
              confidence: "medium",
              reason: "Still helpful but less direct"
            },
            {
              text: "Let me know your thoughts.",
              type: "fallback",
              confidence: "low",
              reason: "No direction given"
            }
          ]
        },
        {
          label: "Waiting for response",
          system: "Client hasn’t responded.",
          next: 4,
          options: [
            {
              text: "Just checking — had a chance to look?",
              type: "best",
              confidence: "high",
              reason: "Strong follow-up without pressure"
            },
            {
              text: "Happy to adjust anything if needed.",
              type: "safe",
              confidence: "medium",
              reason: "Supportive but passive"
            },
            {
              text: "Following up on the plan.",
              type: "fallback",
              confidence: "low",
              reason: "Weak and generic"
            }
          ]
        },
        {
          label: "Engagement confirmed",
          system: "Client: 'Looks good, let’s proceed.'",
          next: "end",
          options: [
            {
              text: "Great — I’ll finalize and start.",
              type: "best",
              confidence: "high",
              reason: "Confident close"
            },
            {
              text: "Perfect, I’ll move ahead.",
              type: "safe",
              confidence: "medium",
              reason: "Clear but softer"
            }
          ]
        }
      ]
    },

    {
      outcome: "lost",
      final: "Conversation closed. Client chose another option.",
      stages: [
        {
          label: "Analyzing situation...",
          system: "Client showed interest but went silent.",
          next: 1,
          options: [
            {
              text: "Hey — just following up, still interested?",
              type: "best",
              confidence: "high",
              reason: "Direct re-engagement"
            },
            {
              text: "Should I share a quick outline?",
              type: "safe",
              confidence: "medium",
              reason: "Value-first approach"
            },
            {
              text: "Let me know if timing works.",
              type: "fallback",
              confidence: "low",
              reason: "Passive and weak"
            }
          ]
        },
        {
          label: "Client responded",
          system: "Client: 'Yes, share details.'",
          next: 2,
          options: [
            {
              text: "Great — I’ll share a simple plan.",
              type: "best",
              confidence: "high",
              reason: "Moves forward clearly"
            },
            {
              text: "Sending outline now.",
              type: "safe",
              confidence: "medium",
              reason: "Neutral progress"
            }
          ]
        },
        {
          label: "Plan shared",
          system: "You shared a plan.",
          next: 3,
          options: [
            {
              text: "Here’s the plan — let me know.",
              type: "best",
              confidence: "high",
              reason: "Clear and professional"
            },
            {
              text: "Happy to tweak this.",
              type: "safe",
              confidence: "medium",
              reason: "Flexible approach"
            }
          ]
        },
        {
          label: "Client response",
          system: "Client: 'We chose another option.'",
          next: "end",
          options: [
            {
              text: "Got it — appreciate the update.",
              type: "best",
              confidence: "high",
              reason: "Professional close"
            },
            {
              text: "No problem, thanks for letting me know.",
              type: "safe",
              confidence: "medium",
              reason: "Neutral close"
            }
          ]
        }
      ]
    }
  ];

  function getStateText(score) {
    if (score > 65) return "Momentum building.";
    if (score > 45) return "Maintaining balanced communication.";
    return "Engagement weakening.";
  }

  function showStage() {

    // 🔒 HARD LOCK AFTER END
    if (completed[activeClient]) {
      chatBox.innerHTML = "";

      const msg = document.createElement("div");
      msg.className = "message system";
      msg.textContent = clients[activeClient].final;

      chatBox.appendChild(msg);
      narration.textContent = "Outcome reached";
      return;
    }

    chatBox.innerHTML = "";

    const stage = clients[activeClient].stages[progress[activeClient]];
    narration.textContent = stage.label;

    const state = document.createElement("div");
    state.className = "prob-box";
    state.textContent = getStateText(outcomeScore[activeClient]);
    chatBox.appendChild(state);

    const msg = document.createElement("div");
    msg.className = "message system";
    msg.textContent = stage.system;
    chatBox.appendChild(msg);

    const container = document.createElement("div");
    container.className = "response-options";

    stage.options.forEach(opt => {
      const pill = document.createElement("div");
      pill.className = "response-pill";

      pill.innerHTML = `
        <div>${opt.text}</div>
        <div class="response-meta">
          <span class="badge ${opt.type}">${opt.type.toUpperCase()}</span>
          <span class="conf ${opt.confidence}">${opt.confidence}</span>
        </div>
        <div class="reason">${opt.reason}</div>
      `;

      pill.onclick = () => handleSelection(opt);
      container.appendChild(pill);
    });

    chatBox.appendChild(container);
  }

  function handleSelection(opt) {

    if (completed[activeClient]) return;

    chatBox.innerHTML = "";

    const userMsg = document.createElement("div");
    userMsg.className = "message user";
    userMsg.textContent = opt.text;
    chatBox.appendChild(userMsg);

    if (opt.type === "best") outcomeScore[activeClient] += 10;
    if (opt.type === "safe") outcomeScore[activeClient] += 4;
    if (opt.type === "fallback") outcomeScore[activeClient] -= 6;

    outcomeScore[activeClient] = Math.max(0, Math.min(100, outcomeScore[activeClient]));

    setTimeout(() => {

      const stage = clients[activeClient].stages[progress[activeClient]];

      if (stage.next === "end") {

        completed[activeClient] = true;

        chatBox.innerHTML = "";

        const msg = document.createElement("div");
        msg.className = "message system";
        msg.textContent = clients[activeClient].final;

        chatBox.appendChild(msg);
        narration.textContent = "Outcome reached";

        return;
      }

      progress[activeClient] = stage.next;
      showStage();

    }, 600);
  }

  clientsUI.forEach((btn, i) => {
    btn.onclick = () => {

      activeClient = i;

      chatBox.innerHTML = "";
      narration.textContent = "";

      showStage();

      clientsUI.forEach((c, idx) => {
        c.classList.toggle("active", idx === i);
      });
    };
  });

  showStage();
}
