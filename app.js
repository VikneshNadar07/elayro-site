const situationsMap = {
  Work: ["Follow-up", "Delay Update", "Report Submission"],
  Friend: ["Weekend Plan", "Apology Message", "Casual Chat"],
  Client: ["Project Proposal", "Meeting Schedule", "Delivery Confirmation"]
};

const repliesMap = {
  "Work-Follow-up": ["Follow up.", "Any updates?", "Checking in.", "Quick ping.", "Update?", "Status?"],
  "Work-Delay Update": ["Slight delay.", "Running late.", "Apologies.", "Soon update.", "Working on it.", "Thanks patience."],
  "Work-Report Submission": ["Sending today.", "Ready soon.", "Sharing shortly.", "EOD delivery.", "Finalizing.", "Almost done."],

  "Friend-Weekend Plan": ["Let’s go!", "I’m in.", "What time?", "Plan it.", "Weekend works.", "Let’s fix it."],
  "Friend-Apology Message": ["Sorry!", "My bad.", "Apologies.", "Won’t repeat.", "I’ll fix.", "Didn’t mean it."],
  "Friend-Casual Chat": ["Haha!", "Nice!", "Love that.", "Awesome!", "Cool!", "Haha good one."],

  "Client-Project Proposal": ["Sending proposal.", "In progress.", "Soon share.", "Preparing.", "Almost ready.", "Will send."],
  "Client-Meeting Schedule": ["Schedule meeting.", "Time?", "Available.", "Let me know.", "Let’s connect.", "Anytime works."],
  "Client-Delivery Confirmation": ["On time.", "Confirmed.", "On track.", "As planned.", "Aligned.", "Will deliver."]
};

const audienceBtns = document.querySelectorAll(".audience-btn");
const situationsDiv = document.getElementById("situations");
const repliesDiv = document.getElementById("replies");

const changeBtn = document.getElementById("change");
const resetBtn = document.getElementById("reset");
const guide = document.getElementById("demoGuide");

let selectedAudience = null;
let selectedSituation = null;
let currentReplies = [];
let usedSets = [];

audienceBtns.forEach(btn => {
  btn.onclick = () => {
    if (selectedAudience) return;

    selectedAudience = btn.dataset.value;

    audienceBtns.forEach(b => b.disabled = true);
    btn.classList.add("active");

    guide.textContent = "Now select a situation →";

    situationsDiv.innerHTML = "";

    situationsMap[selectedAudience].forEach(s => {
      const b = document.createElement("button");
      b.className = "btn situation-btn";
      b.textContent = s;

      b.onclick = () => selectSituation(b, s);

      situationsDiv.appendChild(b);
    });
  };
});

function selectSituation(button, situation) {
  if (selectedSituation) return;

  selectedSituation = situation;

  document.querySelectorAll(".situation-btn").forEach(b => b.disabled = true);
  button.classList.add("active");

  guide.textContent = "Tap a reply to copy →";

  currentReplies = [...repliesMap[`${selectedAudience}-${selectedSituation}`]];
  usedSets = [];

  showReplies();
}

function showReplies() {
  repliesDiv.innerHTML = "";

  let newSet;

  do {
    newSet = shuffle([...currentReplies]).slice(0, 3);
  } while (isSameSet(newSet));

  usedSets.push(newSet);

  newSet.forEach(text => {
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

  guide.textContent = "Select Audience Type →";
};

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function isSameSet(newSet) {
  return usedSets.some(set =>
    set.every(val => newSet.includes(val))
  );
}