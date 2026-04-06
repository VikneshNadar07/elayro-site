const state={category:null,situation:null};
const data={work:{"Running late":["Running late — joining soon","Running a bit late, will join soon","Running behind, almost there"]}};
document.addEventListener("DOMContentLoaded",()=>{renderCategories();});
function renderCategories(){const el=document.getElementById("categories");if(!el)return;el.innerHTML=Object.keys(data).map(cat=>`<button onclick="selectCategory('${cat}')">${cat}</button>`).join('');}
function selectCategory(cat){state.category=cat;document.getElementById("situationSection").style.display="block";const list=Object.keys(data[cat]);document.getElementById("situations").innerHTML=list.map(s=>`<button onclick="selectSituation('${s}')">${s}</button>`).join('');}
function selectSituation(s){state.situation=s;document.getElementById("replySection").style.display="block";const replies=data[state.category][s];document.getElementById("replies").innerHTML=replies.map(r=>`<div class="reply" onclick="copyText('${r}')">${r}</div>`).join('');}
function copyText(text){navigator.clipboard.writeText(text);const msg=document.getElementById("copiedMsg");if(msg){msg.style.display="block";setTimeout(()=>msg.style.display="none",2000);}}
function saveEmail(){const email=document.getElementById("email").value;const check=document.getElementById("notbot")?.checked;if(!check){alert("Please confirm you're not a bot");return;}if(!email.includes("@")){alert("Enter valid email");return;}alert("Saved");}
function resetFlow(){document.getElementById("situationSection").style.display="none";document.getElementById("replySection").style.display="none";}
const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("show");}});});
document.querySelectorAll("section,.card").forEach(el=>{el.classList.add("fade");observer.observe(el);});