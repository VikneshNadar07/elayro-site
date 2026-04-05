let state={who:null,situation:null,tone:null};
let timeout;
let submitting=false;
let startTime=Date.now();

function selectOption(type,value,e){
state[type]=value;
const parent=document.getElementById(type);
Array.from(parent.children).forEach(btn=>btn.classList.remove("active"));
e.target.classList.add("active");
generateReply();
}

function generateReply(){
if(!state.who||!state.situation||!state.tone)return;

clearTimeout(timeout);

const output=document.getElementById("aiOutput");
output.innerHTML="<span class='small'>Creating replies...</span>";

timeout=setTimeout(()=>{
const replies=getReplies(state.situation,state.tone);
output.innerHTML="";

replies.forEach(text=>{
const div=document.createElement("div");
div.className="reply-card";
div.innerText=text;

div.onclick=()=>{
navigator.clipboard.writeText(text);
div.innerText="Copied ✓";
setTimeout(()=>{div.innerText=text},1000);
};

output.appendChild(div);
});
},300);
}

function getReplies(s,t){
if(s==="update") return t==="formal"
?["We’re on track and will update shortly.","Progress is steady — update soon.","Everything is moving as planned."]
:["Going well — will update soon!","All on track, will share soon.","Going good — will keep you posted!"];

if(s==="delay") return t==="formal"
?["Apologies for the delay. Update shortly.","Sorry for the delay — appreciate patience.","Apologies — will share soon."]
:["Sorry for the delay — will update soon!","My bad — will reply shortly.","Thanks for waiting — will update!"];

if(s==="meeting") return t==="formal"
?["That timing works for me.","Schedule works — confirmed.","That time works well."]
:["Works for me!","Sounds good.","Perfect — let’s do it!"];

return["Got it."];
}

function joinWaitlist(){
if(submitting) return;

const input=document.getElementById("emailInput");
const msg=document.getElementById("waitlistMsg");
const checkbox=document.getElementById("humanCheck");

const email=input.value.trim().toLowerCase();

if(Date.now()-startTime < 2000){
msg.innerText="Please wait a second";
msg.style.opacity="1";
return;
}

if(!checkbox.checked){
msg.innerText="Please confirm you're not a bot";
msg.style.opacity="1";
return;
}

const valid=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
if(!valid){
msg.innerText="Enter a valid email";
msg.style.opacity="1";
return;
}

submitting=true;
msg.innerText="Joining...";
msg.style.opacity="1";

fetch("YOUR_GOOGLE_SCRIPT_URL",{
method:"POST",
body:JSON.stringify({email:email,key:"elayro_secure_key"}),
headers:{"Content-Type":"application/json"}
})
.then(res=>res.text())
.then(res=>{
if(res==="Success"){
msg.innerText="You’re in.";
input.value="";
checkbox.checked=false;
}
else if(res==="Exists"){
msg.innerText="Already joined.";
}
else{
msg.innerText="Try again.";
}
submitting=false;
})
.catch(()=>{
msg.innerText="Connection error";
submitting=false;
});
}