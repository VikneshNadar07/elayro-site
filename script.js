const data={
Work:{
"Running late":["Running late — joining soon","Running a bit late, will join soon","Running behind, almost there"],
"Need more time":["Need more time, will update soon","Still working on it"]
},
Friend:{
"Running late":["Running late bro","On the way"]
},
Client:{
"Running late":["Apologies, running slightly late"]
}
};

let currentCategory=null;
let situationSelected=false;

// store emails (simple memory)
let savedEmails=[];

document.addEventListener("DOMContentLoaded",()=>{renderCategories();});

function renderCategories(){
document.getElementById("categories").innerHTML=
Object.keys(data).map(cat=>`<button onclick="selectCategory('${cat}',event)">${cat}</button>`).join('');
}

function selectCategory(cat,e){
if(currentCategory)return;
currentCategory=cat;
document.querySelectorAll("#categories button").forEach(b=>b.classList.remove("active"));
e.target.classList.add("active");

document.getElementById("situations").innerHTML=
Object.keys(data[cat]).map(s=>`<button onclick="selectSituation('${s}',event)">${s}</button>`).join('');
}

function selectSituation(s,e){
if(situationSelected)return;
situationSelected=true;

document.querySelectorAll("#situations button").forEach(b=>b.classList.remove("active"));
e.target.classList.add("active");

const replies=data[currentCategory][s];

document.getElementById("replies").innerHTML=
replies.map(r=>`<div class="reply" onclick="copyText('${r}')">${r}</div>`).join('');

document.getElementById("tryAnotherBtn").style.display="inline-block";
}

function copyText(text){
navigator.clipboard.writeText(text);
const msg=document.getElementById("copiedMsg");
msg.style.display="block";
setTimeout(()=>msg.style.display="none",2000);
}

function saveEmail(){
const emailInput=document.getElementById("email");
const email=emailInput.value.trim();
const check=document.getElementById("notbot").checked;
const msg=document.getElementById("notifyMsg");

if(!check){alert("Confirm you're not a bot");return;}
if(!email.includes("@")){alert("Enter valid email");return;}

// check duplicate
if(savedEmails.includes(email)){
msg.innerText="Already registered";
msg.style.display="block";
return;
}

// save email
savedEmails.push(email);

// clear input
emailInput.value="";
document.getElementById("notbot").checked=false;

// show message
msg.innerText="We will notify you";
msg.style.display="block";
msg.style.opacity="0";

setTimeout(()=>msg.style.opacity="0.7",50);
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
