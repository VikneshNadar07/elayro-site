
const repliesData = {
  Work: {
    Greeting: ["Got it, thanks!", "I'll handle this.", "Understood."],
    FollowUp: ["Any updates?", "Checking in.", "Reminder."]
  },
  Friend: {
    Invite: ["Let's hang out!", "Coffee?", "Movie night?"],
    Casual: ["What's up?", "Tell me more!", "Cool!"]
  }
};

let selectedAudience = null;
let selectedSituation = null;

const situationsDiv = document.getElementById("situations");
const repliesDiv = document.getElementById("replies");

document.querySelectorAll(".audience-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedAudience = btn.dataset.value;
    showSituations();
  });
});

function showSituations() {
  const situations = Object.keys(repliesData[selectedAudience]);
  situationsDiv.innerHTML = situations.map(s => 
    `<button class="btn situation-btn" data-value="${s}">${s}</button>`
  ).join("");

  document.querySelectorAll(".situation-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedSituation = btn.dataset.value;
      showReplies();
    });
  });
}

function showReplies() {
  const replies = repliesData[selectedAudience][selectedSituation];
  repliesDiv.innerHTML = replies.map(r => 
    `<button class="reply-box" data-text="${r}">${r}</button>`
  ).join("");

  document.querySelectorAll(".reply-box").forEach(btn => {
    btn.addEventListener("click", () => copyText(btn.dataset.text));
  });
}

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
  setTimeout(() => notif.remove(), 1500);
}
