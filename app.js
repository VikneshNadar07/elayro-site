// ===== ReplyFast Interaction =====

// Audience → Situations → Replies flow
const situationsData = {
  Work: ["Deadline delay", "Meeting request", "Follow-up"],
  Friend: ["Casual reply", "Plan meetup", "Apology"],
  Client: ["Project update", "Price discussion", "Clarification"]
};

const repliesData = {
  "Deadline delay": ["I’ll need a bit more time, will update shortly."],
  "Meeting request": ["Sure, let me know a time that works."],
  "Follow-up": ["Just checking in on this, any updates?"],

  "Casual reply": ["Haha, that sounds great!"],
  "Plan meetup": ["Let’s do it, when are you free?"],
  "Apology": ["Sorry about that, didn’t mean to miss it."],

  "Project update": ["The project is progressing well, I’ll share an update soon."],
  "Price discussion": ["Let’s discuss pricing based on your requirements."],
  "Clarification": ["Could you clarify a bit more so I can assist better?"]
};

const audienceButtons = document.querySelectorAll(".audience-btn");
const situationsDiv = document.getElementById("situations");
const repliesDiv = document.getElementById("replies");
const resetBtn = document.getElementById("reset");

if (audienceButtons) {
  audienceButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const audience = btn.dataset.value;
      situationsDiv.innerHTML = "";
      repliesDiv.innerHTML = "";

      situationsData[audience].forEach(situation => {
        const sBtn = document.createElement("button");
        sBtn.textContent = situation;
        sBtn.className = "btn";
        sBtn.onclick = () => showReplies(situation);
        situationsDiv.appendChild(sBtn);
      });
    });
  });
}

function showReplies(situation) {
  repliesDiv.innerHTML = "";

  repliesData[situation].forEach(reply => {
    const p = document.createElement("p");
    p.textContent = reply;
    repliesDiv.appendChild(p);
  });

  if (resetBtn) resetBtn.style.display = "block";
}

if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    situationsDiv.innerHTML = "";
    repliesDiv.innerHTML = "";
    resetBtn.style.display = "none";
  });
}