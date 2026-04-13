/* ===============================
   OUTFLOW FINAL DEMO (TRUE FINAL)
   =============================== */

const chatBox = document.getElementById("chatBox");
const narration = document.getElementById("narration");
const clientsUI = document.querySelectorAll(".client");

if (chatBox) {

  let activeClient = 0;

  const progress = [0, 0];
  const toneMemory = ["balanced", "balanced"];
  const outcomeScore = [50, 50];

  const clients = [
    {
      outcome: "won",
      personality: "fast",
      stages: [
        {
          label: "Analyzing situation...",
          system: "Client showed interest but stopped responding.",
          next: 1,
          options: [
            { text: "Hey — just checking in, still interested?", type: "best", confidence: "high", reason: "Direct, low-pressure re-engagement" },
            { text: "Quick follow-up — want me to share next steps?", type: "safe", confidence: "medium", reason: "Adds value while following up" },
            { text: "Let me know if this is still relevant.", type: "fallback", confidence: "low", reason: "Passive, low engagement trigger" }
          ]
        },
        {
          label: "Client responded",
          system: "Client: 'Yes, just been busy.'",
          next: 2,
          options: [
            { text: "No worries — I’ll keep this simple.", type: "best", confidence: "high", reason: "Reduces friction" },
            { text: "Totally understand, here’s the next step.", type: "safe", confidence: "medium", reason: "Moves forward" },
            { text: "Let’s move forward when you're ready.", type: "fallback", confidence: "low", reason: "Passive control" }
          ]
        },
        {
          label: "Plan shared",
          system: "You shared a quick plan.",
          next: 3,
          options: [
            { text: "Here’s a simple plan to get started.", type: "best", confidence: "high", reason: "Clear direction" },
            { text: "Sharing a quick outline for you.", type: "safe", confidence: "medium", reason: "Neutral tone" },
            { text: "Let me know your thoughts.", type: "fallback", confidence: "low", reason: "Less control" }
          ]
        },
        {
          label: "Waiting for response",
          system: "Client hasn’t responded.",
          next: [3, 4],
          options: [
            { text: "Just checking — had a chance to look?", type: "best", confidence: "high", reason: "Direct follow-up" },
            { text: "Happy to adjust anything if needed.", type: "safe", confidence: "medium", reason: "Flexible" },
            { text: "Following up on the plan.", type: "fallback", confidence: "low", reason: "Generic" }
          ]
        },
        {
          label: "Engagement confirmed",
          system: "Client: 'Looks good, let’s proceed.'",
          next: "end",
          options: [
            { text: "Great — I’ll finalize and start.", type: "best", confidence: "high", reason: "Strong close" },
            { text: "Perfect, I’ll move ahead.", type: "safe", confidence: "medium", reason: "Smooth" }
          ]
        }
      ],
      final: "Client confirmed. Deal closed successfully."
    },

    {
      outcome: "lost",
      personality: "hesitant",
      stages: [
        {
          label: "Analyzing situation...",
          system: "Client showed interest but went silent.",
          next: 1,
          options: [
            { text: "Hey — just following up, still interested?", type: "best", confidence: "high", reason: "Re-engagement" },
            { text: "Should I share a quick outline?", type: "safe", confidence: "medium", reason: "Value-first" },
            { text: "Let me know if timing works.", type: "fallback", confidence: "low", reason: "Passive" }
          ]
        },
        {
          label: "Client responded",
          system: "Client: 'Yes, share details.'",
          next: 2,
          options: [
            { text: "Great — I’ll share a simple plan.", type: "best", confidence: "high", reason: "Forward motion" },
            { text: "Sending outline now.", type: "safe", confidence: "medium", reason: "Clear" }
          ]
        },
        {
          label: "Plan shared",
          system: "You shared a plan.",
          next: [2, 3],
          options: [
            { text: "Here’s the plan — let me know.", type: "best", confidence: "high", reason: "Invites response" },
            { text: "Happy to tweak this.", type: "safe", confidence: "medium", reason: "Flexible" }
          ]
        },
        {
          label: "Client response",
          system: "Client: 'We chose another option.'",
          next: "end",
          options: [
            { text: "Got it — appreciate the update.", type: "best", confidence: "high", reason: "Professional close" },
            { text: "No problem, thanks for letting me know.", type: "safe", confidence: "medium", reason: "Respectful" }
          ]
        }
      ],
      final: "Conversation closed. Client chose another option."
    }
  ];

  function showTyping() {
    const el = document.createElement("div");
    el.className = "typing";
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement("div");
      dot.className = "dot";
      el.appendChild(dot);
    }
    chatBox.appendChild(el);
    return el;
  }

  function removeTyping(el) {
    if (el) el.remove();
  }

  function getToneReason(tone) {
    if (tone === "direct") return "Prioritizing decisive responses based on your choices.";
    if (tone === "balanced") return "Maintaining balanced communication.";
    if (tone === "passive") return "Using low-pressure responses.";
  }

  function showStage() {
    chatBox.innerHTML = "";

    const stage = clients[activeClient].stages[progress[activeClient]];
    narration.textContent = stage.label;

    const prob = document.createElement("div");
    prob.className = "prob-box";
    prob.textContent = `Win Probability: ${outcomeScore[activeClient]}%`;
    chatBox.appendChild(prob);

    const tone = toneMemory[activeClient];

    const toneBox = document.createElement("div");
    toneBox.className = "tone-box";
    toneBox.textContent = getToneReason(tone);
    chatBox.appendChild(toneBox);

    const typing = showTyping();

    setTimeout(() => {
      removeTyping(typing);

      const msg = document.createElement("div");
      msg.className = "message system";
      msg.textContent = stage.system;
      chatBox.appendChild(msg);

      const container = document.createElement("div");
      container.className = "response-options";

      let sorted = [...stage.options];

      if (tone === "direct") sorted.sort((a,b)=>a.type==="best"?-1:1);
      if (tone === "passive") sorted.sort((a,b)=>a.type==="fallback"?-1:1);

      sorted.forEach(opt => {
        const pill = document.createElement("div");
        pill.className = "response-pill";
        pill.innerHTML = `${opt.text}<div class="reason">${opt.reason}</div>`;
        pill.onclick = () => handleSelection(opt);
        container.appendChild(pill);
      });

      chatBox.appendChild(container);

    }, 800);
  }

  function handleSelection(opt) {
    chatBox.innerHTML = "";

    const userMsg = document.createElement("div");
    userMsg.className = "message user";
    userMsg.textContent = opt.text;
    chatBox.appendChild(userMsg);

    if (opt.type === "best") toneMemory[activeClient] = "direct";
    if (opt.type === "safe") toneMemory[activeClient] = "balanced";
    if (opt.type === "fallback") toneMemory[activeClient] = "passive";

    if (opt.type === "best") outcomeScore[activeClient] += 10;
    if (opt.type === "safe") outcomeScore[activeClient] += 4;
    if (opt.type === "fallback") outcomeScore[activeClient] -= 6;

    outcomeScore[activeClient] = Math.max(0, Math.min(100, outcomeScore[activeClient]));

    const typing = showTyping();

    setTimeout(() => {
      removeTyping(typing);

      const stage = clients[activeClient].stages[progress[activeClient]];

      if (!stage.loopCount) stage.loopCount = 0;

      if (Array.isArray(stage.next)) {
        if (stage.loopCount < (clients[activeClient].personality === "hesitant" ? 2 : 1)) {
          progress[activeClient] = stage.next[0];
          stage.loopCount++;
        } else {
          progress[activeClient] = stage.next[1];
        }
      } else if (stage.next === "end") {
        progress[activeClient] = "end";
      } else {
        progress[activeClient] = stage.next;
      }

      if (progress[activeClient] === "end") {
        chatBox.innerHTML = "";
        const msg = document.createElement("div");
        msg.className = "message system";
        msg.textContent = clients[activeClient].final;
        chatBox.appendChild(msg);
        narration.textContent = "Outcome reached";
        return;
      }

      showStage();

    }, 1000);
  }

  clientsUI.forEach((btn, i) => {
    btn.onclick = () => {
      activeClient = i;
      showStage();
    };
  });

  showStage();
}
