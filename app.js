/* ===============================
   OUTFLOW FINAL INTELLIGENT DEMO
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
            { text: "Hey — just checking in, still interested?", type: "best", confidence: "high", reason: "Direct, low-pressure re-engagement" },
            { text: "Quick follow-up — want me to share next steps?", type: "safe", confidence: "medium", reason: "Adds value while following up" },
            { text: "Should I send a short outline?", type: "safe", confidence: "medium", reason: "Soft entry into discussion" },
            { text: "Let me know if this is still relevant.", type: "fallback", confidence: "low", reason: "Passive, low engagement trigger" }
          ]
        },
        {
          label: "Client responded",
          system: "Client: 'Yes, just been busy.'",
          options: [
            { text: "No worries — I’ll keep this simple.", type: "best", confidence: "high", reason: "Reduces friction immediately" },
            { text: "Totally understand, here’s the next step.", type: "safe", confidence: "medium", reason: "Moves forward with clarity" },
            { text: "Let’s move forward when you're ready.", type: "safe", confidence: "medium", reason: "Keeps control but flexible" },
            { text: "Here’s a quick breakdown.", type: "fallback", confidence: "low", reason: "Less personalized" }
          ]
        },
        {
          label: "Plan shared",
          system: "You shared a quick plan with the client.",
          options: [
            { text: "Here’s a simple plan to get started.", type: "best", confidence: "high", reason: "Clear and actionable" },
            { text: "Sharing a quick outline for you.", type: "safe", confidence: "medium", reason: "Neutral delivery" },
            { text: "Let me know your thoughts on this.", type: "safe", confidence: "medium", reason: "Invites feedback" },
            { text: "This is a rough idea we can refine.", type: "fallback", confidence: "low", reason: "Less confidence signal" }
          ]
        },
        {
          label: "Waiting for response",
          system: "Client hasn’t responded after seeing the plan.",
          options: [
            { text: "Just checking — had a chance to look at the plan?", type: "best", confidence: "high", reason: "Direct but polite follow-up" },
            { text: "Let me know if you want me to adjust anything.", type: "safe", confidence: "medium", reason: "Shows flexibility" },
            { text: "Happy to clarify anything if needed.", type: "safe", confidence: "medium", reason: "Supportive tone" },
            { text: "Following up on the plan I shared.", type: "fallback", confidence: "low", reason: "Generic follow-up" }
          ]
        },
        {
          label: "Engagement confirmed",
          system: "Client: 'Looks good, let’s proceed.'",
          options: [
            { text: "Great — I’ll finalize and get started.", type: "best", confidence: "high", reason: "Confident close" },
            { text: "Perfect, I’ll move ahead with this.", type: "safe", confidence: "medium", reason: "Smooth transition" },
            { text: "Let’s lock this in and proceed.", type: "safe", confidence: "medium", reason: "Strong direction" },
            { text: "Sounds good, moving forward.", type: "fallback", confidence: "low", reason: "Less decisive" }
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
            { text: "Hey — just following up, still interested?", type: "best", confidence: "high", reason: "Clear re-engagement" },
            { text: "Should I share a quick outline?", type: "safe", confidence: "medium", reason: "Value-first approach" },
            { text: "Let me know if timing works.", type: "safe", confidence: "medium", reason: "Flexible approach" },
            { text: "Happy to reconnect if needed.", type: "fallback", confidence: "low", reason: "Low urgency" }
          ]
        },
        {
          label: "Client responded",
          system: "Client: 'Yes, you can share details.'",
          options: [
            { text: "Great — I’ll share a simple plan.", type: "best", confidence: "high", reason: "Moves forward efficiently" },
            { text: "Perfect, sending an outline now.", type: "safe", confidence: "medium", reason: "Clear progression" },
            { text: "I’ll keep it clear and quick for you.", type: "safe", confidence: "medium", reason: "Reduces friction" },
            { text: "Sharing initial thoughts.", type: "fallback", confidence: "low", reason: "Less structured" }
          ]
        },
        {
          label: "Plan shared",
          system: "You shared a plan with the client.",
          options: [
            { text: "Here’s the plan — let me know what you think.", type: "best", confidence: "high", reason: "Invites response" },
            { text: "Sharing this for your review.", type: "safe", confidence: "medium", reason: "Neutral tone" },
            { text: "Happy to tweak this based on your needs.", type: "safe", confidence: "medium", reason: "Flexible approach" },
            { text: "Let me know if this works.", type: "fallback", confidence: "low", reason: "Passive" }
          ]
        },
        {
          label: "Client response",
          system: "Client: 'We decided to go with another option.'",
          options: [
            { text: "Got it — appreciate you letting me know.", type: "best", confidence: "high", reason: "Professional closure" },
            { text: "No problem at all, thanks for the update.", type: "safe", confidence: "medium", reason: "Maintains relationship" },
            { text: "Totally understand, wishing you the best.", type: "safe", confidence: "medium", reason: "Positive exit" },
            { text: "Thanks for considering.", type: "fallback", confidence: "low", reason: "Minimal response" }
          ]
        }
      ],
      final: "Conversation closed. Client chose another option."
    }
  ];

  function showTyping() {
    const typing = document.createElement("div");
    typing.className = "typing";
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement("div");
      dot.className = "dot";
      typing.appendChild(dot);
    }
    chatBox.appendChild(typing);
    return typing;
  }

  function removeTyping(el) {
    if (el) el.remove();
  }

  function showStage() {
    chatBox.innerHTML = "";
    const stage = clients[activeClient].stages[stageIndex];

    narration.textContent = stage.label;

    const typing = showTyping();

    setTimeout(() => {
      removeTyping(typing);

      const msg = document.createElement("div");
      msg.className = "message system";
      msg.textContent = stage.system;
      chatBox.appendChild(msg);

      setTimeout(() => {
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

          const reason = document.createElement("div");
          reason.className = "reason";
          reason.textContent = opt.reason;

          meta.appendChild(badge);
          meta.appendChild(conf);

          pill.appendChild(text);
          pill.appendChild(meta);
          pill.appendChild(reason);

          pill.onclick = () => handleSelection(opt.text);

          container.appendChild(pill);
        });

        chatBox.appendChild(container);
      }, 600);

    }, 900);
  }

  function handleSelection(text) {
    chatBox.innerHTML = "";

    const userMsg = document.createElement("div");
    userMsg.className = "message user";
    userMsg.textContent = text;
    chatBox.appendChild(userMsg);

    narration.textContent = "Thinking...";

    const typing = showTyping();

    setTimeout(() => {
      removeTyping(typing);
      stageIndex++;

      if (stageIndex >= clients[activeClient].stages.length) {

        chatBox.innerHTML = "";
        const finalTyping = showTyping();

        setTimeout(() => {
          removeTyping(finalTyping);

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

        }, 1000);

      } else {
        showStage();
      }

    }, 1000);
  }

  function updateClientUI() {
    clientsUI.forEach((c, i) => {
      c.classList.toggle("active", i === activeClient);
    });
  }

  updateClientUI();
  showStage();
}
