document.addEventListener("DOMContentLoaded", () => {

document.documentElement.classList.add("js");
document.body.classList.add("loaded");

const wait = (t) => new Promise(res => setTimeout(res, t));
  // 🔥 ADD THIS RIGHT AFTER const wait = ...
async function smoothScroll(chatBox) {
  const start = chatBox.scrollTop;
  const end = chatBox.scrollHeight;
  const duration = 400;
  const startTime = performance.now();

  function animate(time) {
    const progress = Math.min((time - startTime) / duration, 1);
    chatBox.scrollTop = start + (end - start) * progress;
    if (progress < 1) requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

/* =========================
GLOBAL NAV
========================= */

const navLinks = document.querySelectorAll(".nav-minimal a");

let currentPage = window.location.pathname.split("/").pop();
if (!currentPage) currentPage = "index.html";

navLinks.forEach(link => {
const href = link.getAttribute("href");

if (href === currentPage) link.classList.add("active");

link.addEventListener("click", (e) => {
if (!href || href.startsWith("#")) return;

e.preventDefault();
document.body.classList.remove("loaded");

setTimeout(() => {
window.location.href = href;
}, 250);

});
});

/* =========================
NAV SCROLL STATE
========================= */

const nav = document.querySelector(".nav-minimal");

window.addEventListener("scroll", () => {
if (nav) nav.classList.toggle("scrolled", window.scrollY > 20);
});

/* =========================
SCROLL PROGRESS
========================= */

const progressBar = document.querySelector(".scroll-progress");

window.addEventListener("scroll", () => {
const total = document.body.scrollHeight - window.innerHeight;
const progress = (window.scrollY / total) * 100;
if (progressBar) progressBar.style.width = progress + "%";
});

/* =========================
FADE-IN
========================= */

const observer = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) entry.target.classList.add("visible");
});
}, { threshold: 0.2 });

document.querySelectorAll("section").forEach(s => {
s.classList.add("animate");
observer.observe(s);
});

const footer = document.querySelector(".footer-global");
if (footer) observer.observe(footer);

/* =========================
DEMO SYSTEM
========================= */

const chatBox = document.getElementById("chatBox");
const optionsPanel = document.getElementById("optionsPanel");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const clientTabs = document.querySelectorAll(".clients .client");

const demo = document.querySelector(".demo-container");

if (demo) {
  demo.addEventListener("wheel", e => e.preventDefault(), { passive: false });
  demo.addEventListener("touchmove", e => e.preventDefault(), { passive: false });
  demo.addEventListener("mousedown", e => e.preventDefault());
  demo.addEventListener("click", e => e.preventDefault());
}

if (
chatBox &&
optionsPanel &&
input &&
sendBtn &&
document.querySelector(".demo-container")
) {

let activeClient = 0;
let chats = { 0: [], 1: [] };

function updateTabs() {
clientTabs.forEach((t, i) =>
t.classList.toggle("active", i === activeClient)
);
}

function renderChat(i) {
chatBox.innerHTML = "";

chats[i].forEach(m => {
const d = document.createElement("div");
d.className = `message ${m.type}`;
d.innerText = m.text;
chatBox.appendChild(d);
});

chatBox.scrollTop = chatBox.scrollHeight;
}

function addMessage(text, type, extraClass = "") {
chats[activeClient].push({ text, type });

const d = document.createElement("div");
d.className = `message ${type} ${extraClass}`;
d.innerText = text;

chatBox.appendChild(d);

smoothScroll(chatBox);
}

async function switchClient(i) {
activeClient = i;
updateTabs();
renderChat(i);
await wait(800);
}

async function typeMessage(text) {
  document.querySelector(".demo-container")?.classList.add("active-zoom");
if (!input) return;

input.value = "";

for (let i = 0; i < text.length; i++) {
input.value += text[i];
await wait(25 + Math.random() * 90);
}

sendBtn.classList.add("press");
await wait(150);
sendBtn.classList.remove("press");

addMessage(text, "user");
input.value = "";

await wait(700 + Math.random() * 500);
  setTimeout(() => {
  document.querySelector(".demo-container")?.classList.remove("active-zoom");
}, 300);
}

const flows = [
{
result: "win",
messages: [
"Hey, can you share pricing?",
"What exactly is included in this?",
"Is there flexibility depending on what we need?",
"That sounds good actually",
"Let’s move ahead"
]
},
{
result: "lost",
messages: [
"What all does this cover?",
"Hmm this feels a bit high for us",
"Let me think about it",
null,
null
]
}
];

function getOptions(msg) {

if (!msg) {
return [
"Just checking in — does this still make sense for you?",
"Following up here — happy to continue whenever you're ready.",
"Wanted to check if this is still something you're considering.",
"Hey — just circling back on this."
];
}

const m = msg.toLowerCase();

if (m.includes("pricing")) return [
"Here’s a clear breakdown so you know exactly what to expect and how it’s structured.",
"Let me walk you through pricing so it’s easy to understand.",
"I’ll share the pricing details clearly so you can evaluate properly.",
"I can quickly explain how pricing works here."
];

if (m.includes("included") || m.includes("cover")) return [
"Great question — I’ll break down exactly what’s included so everything is clear end-to-end.",
"Let me outline what’s included step by step so there’s no confusion.",
"I’ll walk you through everything that’s part of this so it’s clear.",
"Yeah — I’ll quickly explain what’s included so it’s easy to follow."
];

if (m.includes("flex")) return [
"Yes — we can definitely adjust this based on what works best for you.",
"There’s flexibility here — we can tailor it to your needs.",
"We can adapt this depending on your priorities.",
"Yeah, we can tweak this a bit to fit better."
];

if (m.includes("high")) return [
"I understand — we can adjust the scope slightly to make this more comfortable.",
"That’s fair — let’s see where we can optimize without losing value.",
"We can definitely refine this to better match your budget.",
"Got it — we can tweak things a bit to bring it down."
];

if (m.includes("think")) return [
"Makes sense — take your time, I’m here if anything comes up.",
"All good — happy to pick this up whenever you're ready.",
"No rush — we can continue whenever it works for you.",
"Sure — we can reconnect later."
];

if (m.includes("sounds good")) return [
"Perfect — I’ll take this forward and get everything aligned.",
"Great — I’ll move ahead with the next steps.",
"Nice — I’ll start putting this into action.",
"Awesome — let’s move forward with this."
];

if (m.includes("move ahead")) return [
"Perfect — I’ll lock this in and get everything started right away.",
"Great, I’ll finalize this and move things forward.",
"We’re good to go — I’ll take it from here.",
"Nice — I’ll get everything set up."
];

return [
"Got it — I’ll take this forward clearly.",
"Understood — let’s continue from here.",
"Makes sense — I’ll guide this ahead.",
"Alright — we’ll move step by step."
];
}

async function showOptions(msg) {

if (!msg) return;

await wait(300);

optionsPanel.innerHTML = '<div class="thinking"></div>';

await wait(900);

optionsPanel.innerHTML = "";

const options = getOptions(msg);

if (!options || !options.length) return;

for (let i = 0; i < 4; i++) {
const d = document.createElement("div");
d.className = "option-bubble";

d.innerHTML = `  <span class="tag">${["Best","Strong","Safe","Casual"][i]}</span>
  ${options[i]}`;

optionsPanel.appendChild(d);
await wait(200);
}

await wait(1200);

optionsPanel.innerHTML = "";

addMessage(options[0], "system");

await wait(700);
}

async function cinematicClose(result) {

await wait(800);

addMessage("Processing...", "system");

await wait(1200);

if (result === "win") {
addMessage("🟢 Deal closed successfully", "system", "win-glow");
await wait(400);
addMessage("Closed with strong alignment and clarity.", "system");
} else {
addMessage("🔴 Conversation lost", "system", "lose-glow");
await wait(400);
addMessage("Lost due to drop in engagement and momentum.", "system");
}
}

async function runDemo() {

while (true) {

chats = { 0: [], 1: [] };
chatBox.innerHTML = "";
optionsPanel.innerHTML = "";

let steps = [0, 0];
let done = [false, false];

while (!done[0] || !done[1]) {

for (let i = 0; i < 2; i++) {

if (done[i]) continue;

await switchClient(i);

const flow = flows[i];

if (steps[i] >= flow.messages.length) continue;

const msg = flow.messages[steps[i]];

if (msg === null) {
  await wait(2500);
} else {
  await typeMessage(msg);
  await showOptions(msg);
}

steps[i]++;

if (steps[i] === flow.messages.length) {
  await cinematicClose(flow.result);
  done[i] = true;
}

}
}

await wait(3000);

chatBox.innerHTML = "";
optionsPanel.innerHTML = "";
}
}

setTimeout(() => {
  document.body.classList.add("demo-active");
  runDemo();
}, 300);
}

/* =========================
NOTIFY SYSTEM (FINAL SAFE)
========================= */

const notifyBtn = document.getElementById("notifyBtn");
const notifyEmail = document.getElementById("notifyEmail");
const notifySuccess = document.getElementById("notifySuccess");
const notifyWrapper = document.querySelector(".notify-wrapper");

if (notifyBtn && notifyEmail && notifySuccess) {

notifyBtn.classList.add("disabled");

notifyEmail.addEventListener("input", () => {
const val = notifyEmail.value.trim();

notifyEmail.classList.remove("valid", "invalid");
notifySuccess.classList.remove("show");

if (!val) {
notifyBtn.classList.add("disabled");
return;
}

if (val.includes("@") && val.includes(".")) {
notifyEmail.classList.add("valid");
notifyBtn.classList.remove("disabled");
} else {
notifyEmail.classList.add("invalid");
notifyBtn.classList.add("disabled");
}
});

notifyBtn.addEventListener("click", async () => {

if (notifyBtn.classList.contains("disabled")) return;

const email = notifyEmail.value.trim();

notifyBtn.innerText = "Adding...";
notifyBtn.disabled = true;

try {
const res = await fetch("https://elayro-notify.vikneshgaming07.workers.dev", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ email })
});

const data = await res.json().catch(() => ({}));

if (data.status === "exists") {
notifySuccess.innerText = "You're already on the list";
notifyEmail.classList.add("valid");
} else {
notifySuccess.innerText = "You're in ✨";
notifyWrapper.classList.add("success");
notifyEmail.value = "";
}

notifySuccess.classList.add("show");

notifyBtn.innerText = "Added ✓";
notifyBtn.classList.remove("disabled");
notifyBtn.classList.add("success");

} catch {

notifySuccess.innerText = "Network error — try again";
notifySuccess.classList.add("show");

notifyBtn.innerText = "Retry";
notifyBtn.disabled = false;
notifyBtn.classList.remove("disabled");
}
});

notifyEmail.addEventListener("keypress", (e) => {
if (e.key === "Enter") notifyBtn.click();
});

}

});
document.querySelectorAll('.faq-question').forEach(btn => {
btn.addEventListener('click', () => {
const item = btn.parentElement;

item.classList.toggle('active');

});
});

