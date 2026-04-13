/* ===============================
   OUTFLOW DEMO (AUTOPLAY)
   =============================== */

const chatBox = document.getElementById("chatBox");
const narration = document.getElementById("narration");

if (chatBox) {

  const flows = [
    [
      { type: "system", text: "Hey, just checking in — would you like a quick outline?" },
      { type: "user", text: "Yeah, that would help." },
      { type: "system", text: "Got it. I’ll keep it simple and clear for you." }
    ],
    [
      { type: "system", text: "Hi — just wanted to follow up, still interested?" },
      { type: "user", text: "Yes, just been busy." },
      { type: "system", text: "No worries at all — I can share a quick next step if that helps." }
    ]
  ];

  function addMessage(type, text) {
    const div = document.createElement("div");
    div.className = `message ${type}`;
    div.textContent = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function addOptions() {
    const container = document.createElement("div");
    container.className = "response-options";

    const options = [
      "Sure, send it over.",
      "Can you explain a bit more?",
      "Let’s move forward with this.",
      "Sounds good, go ahead."
    ];

    options.forEach(opt => {
      const pill = document.createElement("div");
      pill.className = "response-pill";
      pill.textContent = opt;

      pill.onclick = () => {
        navigator.clipboard.writeText(opt);
        pill.textContent = "Copied ✓";
        setTimeout(() => pill.textContent = opt, 800);
      };

      container.appendChild(pill);
    });

    chatBox.appendChild(container);
  }

  function runFlow() {
    chatBox.innerHTML = "";
    narration.textContent = "Outflow is analyzing the conversation...";

    const flow = flows[Math.floor(Math.random() * flows.length)];

    let i = 0;

    function step() {
      if (i < flow.length) {
        addMessage(flow[i].type, flow[i].text);
        i++;
        setTimeout(step, 1200);
      } else {
        addOptions();

        setTimeout(() => {
          runFlow(); // LOOP
        }, 5000);
      }
    }

    step();
  }

  runFlow();
}
