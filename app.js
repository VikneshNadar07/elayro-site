const situationsMap = {
  Work: ["Follow-up", "Delay", "Report"],
  Friend: ["Plan", "Apology", "Casual Reply"],
  Client: ["Proposal", "Meeting", "Deadline"]
};

const repliesMap = {
  "Work-Follow-up": ["Just following up on this.", "Any updates?", "Checking in.", "Quick follow-up."],
  "Work-Delay": ["Slight delay.", "Running behind.", "Will update soon.", "Thanks for patience."],
  "Work-Report": ["Sending today.", "Ready shortly.", "Sharing soon.", "By end of day."],

  "Friend-Plan": ["Let’s do it!", "Sounds good!", "I’m in!", "Let’s plan."],
  "Friend-Apology": ["Sorry!", "My bad.", "Apologies.", "Won’t happen again."],
  "Friend-Casual Reply": ["Nice!", "Haha!", "Love that!", "Awesome!"],

  "Client-Proposal": ["Sharing soon.", "In progress.", "Working on it.", "Will send shortly."],
  "Client-Meeting": ["Let’s schedule.", "Available anytime.", "What time works?", "Let me know."],
  "Client-Deadline": ["On time.", "On track.", "Will deliver.", "Aligned."]
};

const audienceBtns = document.querySelectorAll(".audience-btn");
const situationsDiv = document.getElementById("situations");
const repliesDiv = document.getElementById("replies");

const changeBtn = document.getElementById("change");
const resetBtn = document.getElementById("reset");
const actions = document.getElementById("actions");

let selectedAudience = null;
let selectedSituation = null;

audienceBtns.forEach(btn => {
  btn.onclick = () => {
    if (selectedAudience) return;

    selectedAudience = btn.dataset.value;
    audienceBtns.forEach(b => b.disabled = true);
    btn.classList.add("active");

    situationsDiv.innerHTML = "";

    situationsMap[selectedAudience].forEach(s => {
      const b = document.createElement("button");
      b.className = "btn situation-btn";
      b.textContent = s;

      b.onclick = () => {
        if (selectedSituation) return;

        selectedSituation = s;
        document.querySelectorAll(".situation-btn").forEach(x => x.disabled = true);
        b.classList.add("active");

        showReplies();
      };

      situationsDiv.appendChild(b);
    });
  };
});

function showReplies() {
  repliesDiv.innerHTML = "";

  const key = `${selectedAudience}-${selectedSituation}`;
  const list = shuffle([...repliesMap[key]]).slice(0, 4);

  list.forEach(text => {
    const btn = document.createElement("button");
    btn.className = "reply-btn";
    btn.textContent = text;

    btn.onclick = () => {
      navigator.clipboard.writeText(text);
      btn.textContent = "Copied ✓";
      setTimeout(() => btn.textContent = text, 1000);
    };

    repliesDiv.appendChild(btn);
  });

  actions.style.display = "flex";
}

changeBtn.onclick = () => {
  if (!selectedAudience || !selectedSituation) return;
  showReplies();
};

resetBtn.onclick = () => {
  selectedAudience = null;
  selectedSituation = null;

  audienceBtns.forEach(b => {
    b.disabled = false;
    b.classList.remove("active");
  });

  situationsDiv.innerHTML = "";
  repliesDiv.innerHTML = "";
  actions.style.display = "none";
};

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}