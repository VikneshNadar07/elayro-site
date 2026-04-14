document.addEventListener("DOMContentLoaded", () => {

  const chatBox = document.getElementById("chatBox");
  const clientTabs = document.querySelectorAll(".client");
  const optionsPanel = document.getElementById("optionsPanel");
  const input = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");

  if (!chatBox || !optionsPanel || !input || !sendBtn) return;

  let activeClient = 0;
  let chats = { 0: [], 1: [] };

  const wait = (t) => new Promise(res => setTimeout(res, t));
  const readTime = (t) => Math.max(1400, t.length * 40);

  function updateTabs() {
    clientTabs.forEach((t, i) =>
      t.classList.toggle("active", i === activeClient)
    );
  }

  function renderChat(clientIndex) {
    chatBox.innerHTML = "";

    chats[clientIndex].forEach(msg => {
      const div = document.createElement("div");
      div.className = `message ${msg.type}`;

      if (msg.type === "system") {
        const label = document.createElement("div");
        label.className = "msg-label";
        label.innerText = "Outflow";

        const content = document.createElement("div");
        content.innerText = msg.text;

        div.appendChild(label);
        div.appendChild(content);
      } else {
        div.innerText = msg.text;
      }

      chatBox.appendChild(div);
    });

    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function addMessage(text, type) {
    chats[activeClient].push({ text, type });

    const div = document.createElement("div");
    div.className = `message ${type}`;

    if (type === "system") {
      const label = document.createElement("div");
      label.className = "msg-label";
      label.innerText = "Outflow";

      const content = document.createElement("div");
      content.innerText = text;

      div.appendChild(label);
      div.appendChild(content);
    } else {
      div.innerText = text;
    }

    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  async function simulateUser(text) {
    input.value = text;
    await wait(300);
    input.value = "";
    addMessage(text, "user");
  }

  /* ✅ FINAL SAFE OPTIONS */
  async function showOptions(list) {

    optionsPanel.innerHTML = "";

    const buttons = [];
    const tags = ["Best", "Strong", "Safe", "Casual"];

    list.forEach((text, i) => {

      const btn = document.createElement("div");
      btn.className = "option-btn";

      btn.innerHTML = `
        <span class="tag left">${tags[i]}</span>
        ${text}
        <span class="tag right">${tags[i]}</span>
      `;

      optionsPanel.appendChild(btn);
      buttons.push(btn);
    });

    for (let i = 0; i < buttons.length; i++) {
      await wait(120);
      buttons[i].classList.add("show");
    }

    await wait(2000);

    if (!buttons.length) return;

    const selected = buttons[Math.floor(Math.random() * buttons.length)];
    selected.classList.add("selected");

    await wait(400);

    optionsPanel.innerHTML = "";

    const cleanText = selected.innerText
      .replace("Best","")
      .replace("Strong","")
      .replace("Safe","")
      .replace("Casual","")
      .trim();

    addMessage(cleanText, "system");
  }

  async function runDemo() {

    chats = { 0: [], 1: [] };
    activeClient = 0;

    updateTabs();
    renderChat(activeClient);

    let msg;

    msg = "Client said they are busy this week";
    await simulateUser(msg);
    await wait(readTime(msg));

    await showOptions([
      "No worries — I’ll keep this simple.",
      "All good, I can summarize this quickly.",
      "Following up when it works for you.",
      "Let me know when this becomes a priority."
    ]);

  }

  runDemo();
});

/* ✅ SINGLE TRANSITION ONLY */
document.querySelectorAll("a").forEach(link => {
  if (link.href && link.href.includes(window.location.origin)) {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      document.body.classList.add("fade-out");

      setTimeout(() => {
        window.location.href = link.href;
      }, 250);
    });
  }
});
