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
if(count===3) el.innerText="Ready ✓";
}
}

function generateReply(){
const output=document.getElementById("aiOutput");

if(!state.who||!state.situation||!state.tone){
output.innerHTML="<span class='small'>Select all options</span>";
return;
}

output.innerHTML="<div class='loading'>Generating...</div>";

setTimeout(()=>{
const replies=getReplies();

output.innerHTML="";

replies.forEach((text,i)=>{
const div=document.createElement("div");
div.className="reply-card";
div.innerText=text;

if(i===0) copyText(text);

div.onclick=()=>{
copyText(text);
div.innerText="Copied ✓";
setTimeout(()=>div.innerText=text,800);
};

output.appendChild(div);
});
},220);
}

function getReplies(){
return [
"Running slightly late — will update shortly.",
"Everything is on track — update soon.",
"That timing works for me."
];
}

function copyText(text){
if(navigator.clipboard){
navigator.clipboard.writeText(text);
}
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