const input = document.getElementById("userInput");
const chatBody = document.getElementById("chatBody");
const toneSelect = document.getElementById("tone");
const regenBtn = document.getElementById("regen");

let lastUserText = "";

/* BASE REPLY */
function getBaseReply(text){
text = text.toLowerCase();

if(text.includes("client")) return "Thanks for reaching out.";
if(text.includes("boss")) return "I'll update you shortly.";
if(text.includes("meeting")) return "What time works for you?";
if(text.includes("friend")) return "Sounds good!";

return "Let’s move forward.";
}

/* APPLY TONE */
function applyTone(base, tone){
if(tone==="formal") return base+" Please confirm.";
if(tone==="casual") return base+" 👍";
if(tone==="confident") return base+" Let’s do it.";
return base;
}

/* GENERATE */
function generateReply(text){
const base = getBaseReply(text);
const tone = toneSelect.value;

const reply = applyTone(base, tone);

const msg = document.createElement("div");
msg.className = "msg ai";
msg.innerText = reply;

chatBody.appendChild(msg);
}

/* ENTER */
input.addEventListener("keypress", e=>{
if(e.key==="Enter" && input.value){
lastUserText = input.value;

```
const userMsg = document.createElement("div");
userMsg.className="msg user";
userMsg.innerText=input.value;

chatBody.appendChild(userMsg);

generateReply(input.value);

input.value="";
```

}
});

/* SCENARIOS */
document.querySelectorAll(".scenarios button").forEach(btn=>{
btn.onclick=()=>{
const text=btn.dataset.text;
input.value=text;
input.dispatchEvent(new KeyboardEvent("keypress",{key:"Enter"}));
};
});

/* WAITLIST */
document.getElementById("waitlist-form").addEventListener("submit", e=>{
e.preventDefault();
document.getElementById("success-msg").innerText="You're on the list 🚀";
});
