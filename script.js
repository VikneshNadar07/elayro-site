let state={who:null,situation:null,tone:null};
let locked=false;
let usedCombos=[];

const reveals=document.querySelectorAll(".reveal");

function revealOnScroll(){
const trigger=window.innerHeight*0.88;
reveals.forEach(el=>{
const top=el.getBoundingClientRect().top;
if(top<trigger) el.classList.add("active");
});
}
window.addEventListener("scroll",()=>requestAnimationFrame(revealOnScroll));
revealOnScroll();

function selectOption(type,value,e){
if(locked) return;
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
const key=state.who+"-"+state.situation+"-"+state.tone;
if(usedCombos.includes(key)){
output.innerHTML="Try another combination";
return;
}
usedCombos.push(key);
output.innerHTML="Generating...";

setTimeout(()=>{
const replies=buildReplies();
output.innerHTML="";
locked=true;
document.querySelectorAll(".options button").forEach(b=>b.disabled=true);

replies.forEach((t,i)=>{
let div=document.createElement("div");
div.className="reply-card";
div.innerText=t;
if(i===0) navigator.clipboard.writeText(t);
div.onclick=()=>{
navigator.clipboard.writeText(t);
div.innerText="Copied ✓";
setTimeout(()=>div.innerText=t,700);
};
output.appendChild(div);
});

let retry=document.createElement("button");
retry.className="retry-btn";
retry.innerText="Try another";
retry.onclick=resetAll;
output.appendChild(retry);

},300);
}

function buildReplies(){
const arr=[
"Will update shortly.",
"On it — will get back soon.",
"Got it — will respond soon.",
"Running slightly late — update soon.",
"Will share update shortly."
];
return arr.sort(()=>Math.random()-0.5).slice(0,3);
}

function resetAll(){
locked=false;
state={who:null,situation:null,tone:null};
document.querySelectorAll(".options button").forEach(b=>{
b.classList.remove("active");
b.disabled=false;
});
document.getElementById("progressText").innerText="0/3 selected";
document.getElementById("aiOutput").innerHTML="<span class='small'>Select all 3 options to generate replies</span>";
}