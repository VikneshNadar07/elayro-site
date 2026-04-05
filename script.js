let state={who:null,situation:null,tone:null};
let submitting=false;

const checkbox=document.getElementById("humanCheck");
const accessBtn=document.getElementById("accessBtn");

if(checkbox && accessBtn){
checkbox.addEventListener("change",()=>{
accessBtn.disabled=!checkbox.checked;
});
}

function selectOption(type,value,e){
state[type]=value;
const parent=document.getElementById(type);
Array.from(parent.children).forEach(btn=>btn.classList.remove("active"));
e.target.classList.add("active");
updateProgress();
generateReply();
}

function updateProgress(){
const count=[state.who,state.situation,state.tone].filter(Boolean).length;
const el=document.getElementById("progressText");
if(el){
el.innerText=count+"/3 selected";
if(count===3) el.innerText="Ready ✓ Tap a reply";
}
}

function generateReply(){
const output=document.getElementById("aiOutput");
if(!state.who||!state.situation||!state.tone){
output.innerHTML="<span class='small'>Select all 3 options</span>";
return;
}
output.innerHTML="Generating...";
setTimeout(()=>{
const variations=[
"Running slightly late — will update shortly.",
"On it — will get back in a bit.",
"Got it — will respond soon.",
"Will update shortly.",
"Working on it — will share soon."
];
const replies=variations.sort(()=>Math.random()-0.5).slice(0,3);
output.innerHTML="";
replies.forEach((text,i)=>{
const div=document.createElement("div");
div.className="reply-card";
div.innerText=text;
if(i===0) navigator.clipboard.writeText(text);
div.onclick=()=>{
navigator.clipboard.writeText(text);
div.innerText="Copied ✓";
setTimeout(()=>div.innerText=text,700);
};
output.appendChild(div);
});
setTimeout(()=>{
const hint=document.createElement("div");
hint.className="small";
hint.innerText="Try another combination";
output.appendChild(hint);
},1200);
},300);
}

function joinWaitlist(){
if(submitting) return;
const email=document.getElementById("emailInput").value;
const honeypot=document.getElementById("honeypot").value;
const msg=document.getElementById("waitlistMsg");
if(honeypot) return;
if(!email.includes("@")){
msg.innerText="Enter valid email";
return;
}
msg.innerText="You're in. Early access reserved.";
submitting=true;
setTimeout(()=>{
msg.innerText="";
submitting=false;
},2000);
}