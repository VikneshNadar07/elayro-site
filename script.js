const data={
work:["Running late","Need more time","Can't attend"]
};

document.addEventListener("DOMContentLoaded",()=>{
const cat=document.getElementById("categories");
if(!cat)return;

cat.innerHTML='<button onclick="showSituations()">Work</button>';
});

function showSituations(){
document.getElementById("situations").innerHTML=data.work.map(s=>`<button onclick="showReplies('${s}')">${s}</button>`).join('');
}

function showReplies(s){
document.getElementById("replies").innerHTML=`<div class="reply">${s} — reply ready</div>`;
}