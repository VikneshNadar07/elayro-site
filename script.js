const data={
Work:{
"Running late":["Running late — joining soon","Running a bit late, will update shortly","Delayed slightly, will be there ASAP"],
"Need more time":["Need more time, will share an update soon","Still working on it, will get back shortly","Working through it, will update you soon"],
"Can’t attend":["Won’t be able to make it, apologies","Unable to attend today, will follow up","Can’t join this time, will catch up later"]
},
Friend:{
"Running late":["Running late bro, almost there","On the way, just got delayed","Late but coming 😅"],
"Can’t come":["Can’t make it today yaar","Won’t be able to come, sorry","Not coming today, let’s plan later"],
"Call later":["Can I call you later?","Busy now, will call you in a bit","Will call you after some time"]
},
Client:{
"Running late":["Apologies, running slightly late","Running behind schedule, joining shortly","Delay from my side, will connect soon"],
"Need more time":["Requesting a bit more time to complete this","Will need additional time, will update shortly","Working on it, sharing soon"],
"Reschedule":["Can we reschedule this to a later time?","Requesting to move this to another slot","Let’s shift this to a better time today"]
}
};

let currentCategory=null;
let situationSelected=false;

document.addEventListener("DOMContentLoaded",()=>renderCategories());

function renderCategories(){
document.getElementById("categories").innerHTML=
Object.keys(data).map(cat=>`<button onclick="selectCategory('${cat}',event)">${cat}</button>`).join('');
}

function selectCategory(cat,e){
if(currentCategory)return;
currentCategory=cat;
e.target.classList.add("active");

document.getElementById("situations").innerHTML=
Object.keys(data[cat]).map(s=>`<button onclick="selectSituation('${s}',event)">${s}</button>`).join('');
}

function selectSituation(s,e){
if(situationSelected)return;
situationSelected=true;
e.target.classList.add("active");

const replies=data[currentCategory][s];

document.getElementById("replies").innerHTML=
replies.map(r=>`<div class="reply" onclick="copyText('${r}')">${r}</div>`).join('');

document.getElementById("tryAnotherBtn").style.display="inline-block";
document.getElementById("replies").scrollIntoView({behavior:"smooth"});
}

function copyText(text){
navigator.clipboard.writeText(text);
const msg=document.getElementById("copiedMsg");
msg.style.opacity="1";
setTimeout(()=>msg.style.opacity="0",2000);
}

function saveEmail(){
const emailInput=document.getElementById("email");
const email=emailInput.value.trim();
const check=document.getElementById("notbot").checked;
const msg=document.getElementById("notifyMsg");

if(!check){alert("Confirm you're not a bot");return;}
if(!email.includes("@")){alert("Enter valid email");return;}

let stored=JSON.parse(localStorage.getItem("emails")||"[]");

if(stored.includes(email)){
msg.innerText="Already registered";
msg.style.opacity="1";
setTimeout(()=>msg.style.opacity="0",2000);
return;
}

stored.push(email);
localStorage.setItem("emails",JSON.stringify(stored));

emailInput.value="";
document.getElementById("notbot").checked=false;

msg.innerText="We will notify you";
msg.style.opacity="1";
setTimeout(()=>msg.style.opacity="0",2000);
}

function resetFlow(){
currentCategory=null;
situationSelected=false;
document.getElementById("situations").innerHTML="";
document.getElementById("replies").innerHTML="";
document.querySelectorAll("button").forEach(b=>b.classList.remove("active"));
document.getElementById("tryAnotherBtn").style.display="none";
window.scrollTo({top:0,behavior:"smooth"});
}
