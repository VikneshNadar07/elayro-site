// Global restrictions: no right-click, no text selection, no drag, no copy shortcuts
document.addEventListener("contextmenu", e => e.preventDefault());
document.addEventListener("selectstart", e => e.preventDefault());
document.addEventListener("dragstart", e => e.preventDefault());
document.addEventListener("keydown", e => {
  if ((e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "x")) {
    e.preventDefault();
  }
});

// Freeze selected buttons
function freezeButton(btn) {
  btn.classList.add("selected");
  btn.disabled = true;
}

// Unfreeze audience and situation buttons
function unfreezeButtons() {
  document.querySelectorAll(".audience-btn, .situation-btn").forEach(btn => {
    btn.classList.remove("selected");
    btn.disabled = false;
  });
}

// Show notification
function showNotification(msg) {
  const notif = document.createElement("div");
  notif.className = "copy-notification";
  notif.textContent = msg;
  document.body.appendChild(notif);
  setTimeout(() => notif.classList.add("show"), 50);
  setTimeout(() => {
    notif.classList.remove("show");
    notif.remove();
  }, 1500);
}

// Reply data structure (6 replies each)
const repliesData = {
  Work: {
    Greeting: ["Got it, thanks!", "I'll handle this.", "Noted, moving forward.", "Understood.", "On it now.", "Will update soon."],
    FollowUp: ["Just checking in.", "Any updates on this?", "Let’s sync soon.", "Following up here.", "Reminder on this task.", "Please confirm status."],
    Thanks: ["Appreciate your effort.", "Thanks for the quick turnaround.", "Grateful for your support.", "Much appreciated.", "Thanks again.", "Your help means a lot."]
  },
  Friend: {
    Invite: ["Let’s hang out!", "Want to grab coffee?", "Movie night?", "Join me for dinner.", "Game time?", "Let’s catch up soon."],
    Decline: ["Sorry, can’t make it.", "Next time for sure.", "Not today, but soon!", "I’ll pass this time.", "Busy right now.", "Catch you later."],
    CasualChat: ["What’s up?", "How’s it going?", "Long time no see.", "Tell me more!", "Sounds fun!", "Cool story!"]
  },
  Client: {
    Greeting: ["Thank you for reaching out.", "We’ll get back shortly.", "Appreciate your patience.", "Glad to connect.", "We value your time.", "Thanks for contacting us."],
    Proposal: ["Here’s our proposal.", "Please review attached details.", "We suggest this approach.", "Proposal ready for discussion.", "Sharing our plan.", "Looking forward to feedback."],
    FollowUp: ["Following up on our last discussion.", "Any feedback on the proposal?", "Looking forward to your response.", "Gentle reminder.", "Checking status.", "Awaiting your reply."]
  }
};

let selectedAudience = null;
let selectedSituation = null;
let replyIndex = {};
const situationsDiv = document.getElementById("situations");
const repliesDiv = document.getElementById("replies");
const resetBtn = document.getElementById("reset");

// Audience selection
document.querySelectorAll(".audience-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedAudience = btn.dataset.value;
    freezeButton(btn);
    showSituations();
  });
});

// Show situations
function showSituations() {
  const situations = Object.keys(repliesData[selectedAudience]);
  situationsDiv.innerHTML = situations.map(s => `
    <button class="btn situation-btn" data-value="${s}">${s}</button>
  `).join("");

  document.querySelectorAll(".situation-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedSituation = btn.dataset.value;
      freezeButton(btn);
      showReplies();
    });
  });
}

// Show replies (3 at a time)
function showReplies() {
  if (!selectedAudience || !selectedSituation) return;
  const key = `${selectedAudience}-${selectedSituation}`;
  if (!replyIndex[key]) replyIndex[key] = 0;
  const replies = repliesData[selectedAudience][selectedSituation];
  const start = replyIndex[key] * 3;
  const selected = replies.slice(start, start + 3);

  repliesDiv.innerHTML = selected.map(r => `
    <button class="reply-box" onclick="navigator.clipboard.writeText('${r}'); showNotification('Copied!');">${r}</button>
  `).join("");

  resetBtn.style.display = selected.length > 0 ? "inline-block" : "none";
}

// Cycle replies
resetBtn?.addEventListener("click", () => {
  if (!selectedAudience || !selectedSituation) return;
  const key = `${selectedAudience}-${selectedSituation}`;
  replyIndex[key] = (replyIndex[key] || 0) + 1;
  if (replyIndex[key] * 3 >= repliesData[selectedAudience][selectedSituation].length) {
    replyIndex[key] = 0; // loop back
  }
  unfreezeButtons(); // unfreeze audience & situation
  resetBtn.style.display = "none"; // hide until new replies appear
  showSituations(); // let user reselect situation
});

// Email capture
const emailInput = document.getElementById("email");
const notifyBtn = document.getElementById("notify");
const checkbox = document.getElementById("botcheck");
let registeredEmails = [];

checkbox?.addEventListener("change", () => {
  notifyBtn.disabled = !checkbox.checked;
});

notifyBtn?.addEventListener("click", ()
