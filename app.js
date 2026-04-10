/* ===============================
   DYNAMIC HOOK SYSTEM
   =============================== */

const hooks = {
  "/": "From decision to outcome.",
  "/index.html": "From decision to outcome.",

  "/replyfast.html": "Respond instantly. Communicate clearly.",
  
  "/elira.html": "Turn intention into independence.",
  
  "/execution.html": "Every decision becomes action."
};

function setDynamicHook() {
  const path = window.location.pathname;
  const hookEl = document.getElementById("dynamicHook");

  if (!hookEl) return;

  const hookText = hooks[path] || "Execution, simplified.";
  hookEl.textContent = hookText;
}

document.addEventListener("DOMContentLoaded", setDynamicHook);



/* ===============================
   REPLYFAST DEMO SYSTEM
   =============================== */

const situationsMap = {
  Work: [
    "Follow-up",
    "Meeting Delay",
    "Send Report"
  ],
  Friend: [
    "Plan Weekend",
    "Reply Late",
    "Casual Chat"
  ],
  Client: [
    "Project Update",
    "Pricing",
    "Deadline"
  ]
};

const repliesMap = {
  "Follow-up": [
    "Just checking in on this.",
    "Following up on my previous message.",
    "Any updates on this?"
  ],
  "Meeting Delay": [
    "Running a bit late, will join shortly.",
    "Apologies, I'll be a few minutes late.",
    "Joining in a moment."
  ],
  "Send Report": [
    "I’ll send it by today.",
    "Sharing the report shortly.",
    "You’ll have it soon."
  ],
  "Plan Weekend": [
    "Sounds good, what time?",
    "Let’s do it, I’m in.",
    "I’m free, let’s plan."
  ],
  "Reply Late": [
    "Sorry, just saw this.",
    "Apologies for the late reply.",
    "Got back to this now."
  ],
  "Casual Chat": [
    "Haha nice!",
    "That’s interesting.",
    "Tell me more."
  ],
  "Project Update": [
    "Project is on track.",
    "Sharing progress shortly.",
    "Everything is moving well."
  ],
  "Pricing": [
    "Sharing pricing details shortly.",
    "Let me send you the breakdown.",
    "I’ll get back with numbers."
  ],
  "Deadline": [
    "We’ll meet the deadline.",
    "On track for completion.",
    "Will deliver as planned."
  ]
};

function initReplyFast() {
  const audienceButtons = document.querySelectorAll(".audience-btn");
  const situationsContainer = document.getElementById("situations");
  const repliesContainer = document.getElementById("replies");
  const resetBtn = document.getElementById("reset");

  if (!audienceButtons.length) return;

  audienceButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const value = btn.dataset.value;

      situationsContainer.innerHTML = "";
      repliesContainer.innerHTML = "";

      situationsMap[value].forEach(situation => {
        const el = document.createElement("button");
        el.className = "btn situation-btn";
        el.textContent = situation;

        el.onclick = () => {
          repliesContainer.innerHTML = "";

          repliesMap[situation].forEach(reply => {
            const r = document.createElement("div");
            r.className = "reply";
            r.textContent = reply;
            repliesContainer.appendChild(r);
          });

          resetBtn.style.display = "inline-block";
        };

        situationsContainer.appendChild(el);
      });
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      situationsContainer.innerHTML = "";
      repliesContainer.innerHTML = "";
      resetBtn.style.display = "none";
    });
  }
}

document.addEventListener("DOMContentLoaded", initReplyFast);