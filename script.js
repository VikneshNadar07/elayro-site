let state={who:null,situation:null,tone:null};
let locked=false;

function selectOption(type,value,e){
if(locked) return;
state[type]=value;
const parent=document.getElementById(type);
Array.from(parent.children).forEach(b=>b.classList.remove("active"));
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
const replies=[
"Will update shortly.",
"On it — will get back soon.",
"Got it — will respond soon.",
"Running slightly late — update soon."
].sort(()=>Math.random()-0.5).slice(0,3);

output.innerHTML="";
locked=true;

document.querySelectorAll(".options button").forEach(b=>b.disabled=true);

replies.forEach(t=>{
let div=document.createElement("div");
div.className="reply-card";
div.innerText=t;
div.onclick=()=>{
navigator.clipboard.writeText(t);
div.innerText="Copied ✓";
setTimeout(()=>div.innerText=t,700);
};
output.appendChild(div);
});

let retry=document.createElement("button");
retry.innerText="Try another";
retry.onclick=resetAll;
output.appendChild(retry);

},300);
}

function resetAll(){
locked=false;
state={who:null,situation:null,tone:null};
document.querySelectorAll(".options button").forEach(b=>{
b.classList.remove("active");
b.disabled=false;
});
document.getElementById("progressText").innerText="0/3 selected";
document.getElementById("aiOutput").innerHTML="<span class='small'>Select all 3 options</span>";
}
