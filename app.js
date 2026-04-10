
const situationsData = {
  Work: ["Deadline delay","Meeting request","Follow-up"],
  Friend: ["Casual reply","Plan meetup","Apology"],
  Client: ["Project update","Price discussion","Clarification"]
};

const repliesData = {
  "Deadline delay":["I’ll need a bit more time, will update shortly."],
  "Meeting request":["Sure, let me know a time that works."],
  "Follow-up":["Just checking in on this, any updates?"],
  "Casual reply":["Haha, that sounds great!"],
  "Plan meetup":["Let’s do it, when are you free?"],
  "Apology":["Sorry about that, didn’t mean to miss it."],
  "Project update":["The project is progressing well."],
  "Price discussion":["Let’s discuss pricing based on your requirements."],
  "Clarification":["Could you clarify more?"]
};

document.querySelectorAll("[data-value]").forEach(el=>{
  el.addEventListener("click",()=>{
    const audience = el.getAttribute("data-value");
    const s = document.getElementById("situations");
    const r = document.getElementById("replies");
    if(!s || !r) return;

    s.innerHTML=""; r.innerHTML="";
    situationsData[audience].forEach(item=>{
      let p=document.createElement("p");
      p.textContent=item;
      p.style.cursor="pointer";
      p.onclick=()=>{
        r.innerHTML="";
        repliesData[item].forEach(rep=>{
          let rp=document.createElement("p");
          rp.textContent=rep;
          r.appendChild(rp);
        });
      };
      s.appendChild(p);
    });
  });
});
