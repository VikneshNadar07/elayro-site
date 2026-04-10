/* ===============================
   HOOK (SINGLE)
   =============================== */

const hooks = [
  "Stop overthinking replies.",
  "Say the right thing instantly.",
  "Respond faster. Sound better."
];

const hookEl = document.getElementById("dynamicHook");
if (hookEl) {
  hookEl.textContent = hooks[Math.floor(Math.random() * hooks.length)];
}

/* ===============================
   DATA (FULL SYSTEM)
   =============================== */

const situationsMap = {
  Work: ["Follow-up", "Delay Update", "Report Submission"],
  Professional: ["Introduction", "Request", "Clarification"],
  Client: ["Project Proposal", "Meeting Schedule", "Delivery Confirmation"]
};

const repliesMap = {

  /* WORK */
  "Work-Follow-up": [
    "Just checking in on this — any updates?",
    "Following up to see where things stand.",
    "Quick nudge on this whenever you get a chance.",
    "Wanted to circle back on this.",
    "Any progress here?",
    "Let me know if there’s an update."
  ],

  "Work-Delay Update": [
    "There’s a slight delay — I’ll keep you posted.",
    "Running a bit behind, will update shortly.",
    "Apologies for the delay, working on it.",
    "Taking a bit longer than expected.",
    "Thanks for your patience.",
    "Update coming soon."
  ],

  "Work-Report Submission": [
    "I’ll send the report by today.",
    "The report will be ready shortly.",
    "Sharing the report in a bit.",
    "You’ll have it before end of day.",
    "Finalizing now.",
    "Report is almost ready."
  ],

  /* PROFESSIONAL */
  "Professional-Introduction": [
    "Hi, just reaching out to introduce myself.",
    "Wanted to connect and introduce myself.",
    "Hello, I’d like to introduce myself.",
    "Reaching out regarding a potential collaboration.",
    "Hope you're doing well — just introducing myself.",
    "Sharing a quick introduction."
  ],

  "Professional-Request": [
    "Could you please take a look at this?",
    "Would you be able to review this?",
    "Let me know your thoughts.",
    "Could you share your feedback?",
    "Would appreciate your input.",
    "Let me know if this works."
  ],

  "Professional-Clarification": [
    "Just to clarify, are we aligned on this?",
    "Can you confirm the details?",
    "Want to make sure I understood correctly.",
    "Could you clarify this part?",
    "Checking for clarity here.",
    "Let me know if I got this right."
  ],

  /* CLIENT */
  "Client-Project Proposal": [
    "I’ll share the proposal shortly.",
    "Working on the proposal — will send soon.",
    "You’ll receive it shortly.",
    "Preparing it now.",
    "Almost ready to send.",
    "Will share soon."
  ],

  "Client-Meeting Schedule": [
    "Let’s schedule a meeting.",
    "What time works best for you?",
    "Happy to connect.",
    "Let me know a good time.",
    "Available anytime.",
    "We can set up a call."
  ],

  "Client-Delivery Confirmation": [
    "This will be delivered on time.",
    "Everything is on track.",
    "Delivery is confirmed.",
    "We’re aligned for delivery.",
    "No issues — on schedule.",
    "You’ll receive it as expected."
  ]
};

/* ===============================
   ELEMENTS
   =============================== */

const audienceBtns = document.querySelectorAll(".audience-btn");
const situationsDiv = document.getElementById("situations");
const repliesDiv = document.getElementById("replies");

const changeBtn = document.getElementById("change");
const resetBtn = document.getElementById("reset");
const guide = document.getElementById("demoGuide");

/* ===============================
   STATE
   =============================== */

let selectedAudience = null;
let selectedSituation = null;
let currentReplies = [];
let usedSets = [];

/* ===============================
   AUDIENCE SELECT
   =============================== */

audienceBtns.forEach(btn => {
  btn.onclick = () => {

    if (selectedAudience) return;

    selectedAudience = btn.dataset.value;

    audienceBtns.forEach(b => b.disabled = true);
    btn.classList.add("active");

    guide.textContent = "Select Situation →";
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

/* ===============================
   SITUATION SELECT
   =============================== */

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

/* ===============================
   SHOW REPLIES (3 OUT OF 6)
   =============================== */

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

  changeBtn.style.display = "inline-block";
}

/* ===============================
   CHANGE REPLIES
   =============================== */

changeBtn.onclick = () => {
  if (!selectedAudience || !selectedSituation) return;
  showReplies();
};

/* ===============================
   RESET
   =============================== */

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
  changeBtn.style.display = "none";
};

/* ===============================
   HELPERS
   =============================== */

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function isSameSet(newSet) {
  return usedSets.some(set =>
    set.every(val => newSet.includes(val))
  );
}