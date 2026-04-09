document.addEventListener("contextmenu", e => e.preventDefault());
document.addEventListener("selectstart", e => e.preventDefault());
document.addEventListener("dragstart", e => e.preventDefault());
document.addEventListener("keydown", e => {
  if ((e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "x")) e.preventDefault();
});

const repliesData = {
  Work: {
    Greeting: ["Got it, thanks!", "I'll handle this.", "Understood.", "On it now.", "Will update soon."],
    FollowUp: ["Any updates?", "Checking in.", "Reminder.", "Let’s sync soon.", "Please confirm status."]
  },
  Friend: {
    Invite: ["Let's hang out!", "Coffee?", "Movie night?", "Join me for dinner.", "Game time?"],
    Casual: ["What's up?", "Tell me more!", "Cool!", "Sounds fun!", "Long time no see."]
  },
  Client: {
    Greeting: ["Thank you for reaching out.", "We’ll get back shortly.", "Glad to connect.", "We value your time."],
    Proposal: ["Here’s our proposal.", "Please review attached details.", "We suggest this approach.", "Looking forward to feedback."]
  }
};

let selectedAudience = null;
let selectedSituation = null;
let replyIndex = {};
const situationsDiv = document.getElementById("situations");
const repliesDiv = document.getElementById("replies");
const resetBtn = document.getElementById("reset");

document.querySelectorAll(".audience-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedAudience = btn.dataset.value;
    freezeButton(btn);
    showSituations();
  });
});

function freezeButton(btn) { btn.classList.add("selected"); btn.disabled = true; }
function unfreezeButtons() {
  document.querySelectorAll(".audience-btn, .situation-btn").forEach(btn => {
    btn.classList.remove("selected"); btn.disabled = false;
  });
}

function showSituations() {
  const situations = Object.keys(repliesData[selectedAudience]);
  situationsDiv.innerHTML = situations.map(s =>
    `<button class="btn situation-btn" data-value="${s}">${s}</button>`
  ).join("");
  document.querySelectorAll(".situation-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedSituation = btn.dataset.value;
      freezeButton(btn);
      showReplies();
    });
  });
}

function showReplies() {
  if (!selectedAudience || !selectedSituation) return;
  const key = `${selectedAudience}-${selectedSituation}`;
  if (!replyIndex[key]) replyIndex[key] = 0;
  const replies = repliesData[selectedAudience][selectedSituation];
  const start = replyIndex[key] * 3;
  const selected = replies.slice(start, start + 3);
  repliesDiv.innerHTML = selected.map(r =>
    `<button class="reply-box" onclick="copyText('${r}')">${r}</button>`
  ).join("");
  resetBtn.style.display = selected.length > 0 ? "inline-block" : "none";
}

resetBtn?.addEventListener("click", () => {
  if (!selectedAudience || !selectedSituation) return;
  const key = `${selectedAudience}-${selectedSituation}`;
  replyIndex[key] = (replyIndex[key] || 0) + 1;
  if (replyIndex[key] * 3 >= repliesData[selectedAudience][selectedSituation].length) replyIndex[key] = 0;
  unfreezeButtons();
  resetBtn.style.display = "none";
  showSituations();
});

function copyText(text) {
  navigator.clipboard.writeText(text);
  showNotification("Copied!");
}

function showNotification(msg) {
  const notif = document.createElement("div");
  notif.className = "copy-notification";
  notif.textContent = msg;
  document.body.appendChild(notif);
  setTimeout(() => notif.classList.add("show"), 50);
  setTimeout(() => { notif.classList.remove("show"); notif.remove(); }, 1500);
}

// Email capture
const emailInput = document.getElementById("email");
const notifyBtn = document.getElementById("notify");
const checkbox = document.getElementById("botcheck");
let registeredEmails = [];

checkbox?.addEventListener("change", () => { notifyBtn.disabled = !checkbox.checked; });
notify
