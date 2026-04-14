// 🔥 SAFETY FIX
document.documentElement.classList.add("loaded");

document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     GLOBAL NAV SYSTEM
     ========================= */

  const navLinks = document.querySelectorAll(".nav-minimal a");

  let currentPage = window.location.pathname.split("/").pop();
  if (!currentPage || currentPage === "") currentPage = "index.html";

  navLinks.forEach(link => {
    const href = link.getAttribute("href");

    if (href === currentPage) {
      link.style.display = "none";
    }

    link.addEventListener("click", function(e){
      if (!href || href.startsWith("#")) return;

      e.preventDefault();
      document.body.classList.add("fade-out");

      setTimeout(() => {
        window.location.href = href;
      }, 300);
    });
  });

  /* =========================
     NAV SCROLL EFFECT
     ========================= */

  const nav = document.querySelector(".nav-minimal");

  window.addEventListener("scroll", () => {
    if (!nav) return;

    if (window.scrollY > 40) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  });

  /* =========================
     SECTION REVEAL
     ========================= */

  const sections = document.querySelectorAll("section");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.2 });

  sections.forEach(section => observer.observe(section));

  /* =========================
     ELEMENTS
     ========================= */

  const chatBox = document.getElementById("chatBox");
  const clientTabs = document.querySelectorAll(".clients .client");
  const optionsPanel = document.getElementById("optionsPanel");
  const input = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");
  const cursor = document.getElementById("fakeCursor");
  const container = document.querySelector(".demo-container");

  if (!chatBox || !optionsPanel || !input || !sendBtn || !container) return;

  let activeClient = 0;
  let chats = { 0: [], 1: [] };
  let memory = [];

  const wait = (t) => new Promise(res => setTimeout(res, t));
  const readTime = (t) => Math.max(1400, t.length * 40);

  document.addEventListener("selectstart", e => e.preventDefault());
  document.addEventListener("dragstart", e => e.preventDefault());
  input.addEventListener("focus", e => e.target.blur());
  sendBtn.addEventListener("click", e => e.preventDefault());

  /* =========================
     HUMAN CURSOR SYSTEM
     ========================= */

  let cx = window.innerWidth/2, cy = window.innerHeight/2;
  let tx = cx, ty = cy;
  let vx = 0, vy = 0;

  let cursorActiveTimeout;

  function activateCursor(){
    cursor?.classList.add("active");
    cursor?.classList.remove("idle");

    clearTimeout(cursorActiveTimeout);
    cursorActiveTimeout = setTimeout(()=>{
      cursor?.classList.add("idle");
    }, 1200);
  }

  function spawnTrail(x,y){
    const t = document.createElement("div");
    t.className = "cursor-trail";
    t.style.left = x+"px";
    t.style.top = y+"px";
    container.appendChild(t);
    setTimeout(()=>t.remove(),500);
  }

  function animateCursor(){
    const dx = tx - cx;
    const dy = ty - cy;

    vx += dx * 0.06;
    vy += dy * 0.06;

    vx *= 0.78;
    vy *= 0.78;

    cx += vx;
    cy += vy;

    const rect = container.getBoundingClientRect();

    if(cursor){
      cursor.style.left = (cx - rect.left) + "px";
      cursor.style.top = (cy - rect.top) + "px";

      if(Math.abs(dx)>1 || Math.abs(dy)>1) activateCursor();

      if(Math.random()<0.3){
        spawnTrail(cx-rect.left, cy-rect.top);
      }
    }

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  function moveCursorTo(el){
    const r = el.getBoundingClientRect();

    tx = r.left + r.width*(0.4+Math.random()*0.3) + (Math.random()*20-10);
    ty = r.top + r.height*(0.4+Math.random()*0.3) + (Math.random()*20-10);
  }

  async function lookAt(el){
    moveCursorTo(el);
    await wait(300+Math.random()*300);
    moveCursorTo(el);
    await wait(120);
  }

  async function clickCursor(el){
    await lookAt(el);
    await wait(120+Math.random()*150);

    cursor?.classList.add("clicking");
    await wait(120);
    cursor?.classList.remove("clicking");
  }

  /* =========================
     CAMERA
     ========================= */

  function cameraFocus(mode){
    container.classList.remove("camera-focus","camera-shift-left","camera-shift-right");
    if(mode) container.classList.add(mode);
  }

  /* =========================
     CHAT
     ========================= */

  function updateTabs(){
    clientTabs.forEach((t,i)=>t.classList.toggle("active",i===activeClient));
  }

  function renderChat(i){
    chatBox.innerHTML="";
    chats[i].forEach(m=>{
      const d=document.createElement("div");
      d.className=`message ${m.type} fade-in-up`;
      d.innerText=m.text;
      chatBox.appendChild(d);
    });
  }

  function addMessage(text,type){
    chats[activeClient].push({text,type});

    const d=document.createElement("div");
    d.className=`message ${type} fade-in-up`;
    d.innerText=text;

    chatBox.appendChild(d);
    chatBox.scrollTo({top:chatBox.scrollHeight,behavior:"smooth"});
  }

  /* =========================
     MEMORY + HUMAN OPTIONS
     ========================= */

  function remember(msg){
    memory.push(msg.toLowerCase());
    if(memory.length>6) memory.shift();
  }

  function humanize(text){
    if(Math.random()<0.2){
      return text.split("—")[0];
    }

    if(Math.random()<0.15){
      const fillers=["yeah,", "alright,", "okay,"];
      return fillers[Math.floor(Math.random()*fillers.length)] + " " + text.toLowerCase();
    }

    return text;
  }

  function varyLength(arr){
    const count = 3 + Math.floor(Math.random()*2);
    return arr.slice(0,count);
  }

  function generateOptions(msg){
    const context=(memory.join(" ")+" "+msg).toLowerCase();

    function pick(arr){
      return varyLength(arr.sort(()=>Math.random()-0.5));
    }

    if(context.includes("busy")){
      return pick([
        "Got it — I’ll keep it short.",
        "All good, we can take this later.",
        "No rush, just wanted to check in.",
        "Cool, I’ll follow up next week.",
        "Makes sense — I’ll keep this light."
      ]);
    }

    if(context.includes("pricing")){
      return pick([
        "Yeah, I can break it down quickly.",
        "Let me give you a rough idea first.",
        "We can adjust this based on what you need.",
        "Depends a bit on scope, but here’s a range.",
        "I’ll keep it simple — here’s how it works."
      ]);
    }

    if(context.includes("flex")){
      return pick([
        "Yeah, we can adjust it.",
        "There’s some flexibility there.",
        "We can shape it around your needs.",
        "Not fixed — we can tweak it.",
        "We’ll make it work."
      ]);
    }

    if(context.includes("start")||context.includes("proceed")){
      return pick([
        "Alright, let’s do it.",
        "Cool, I’ll get this moving.",
        "Sounds good — I’ll start on this.",
        "Nice, let’s go ahead.",
        "Perfect, I’ll handle it."
      ]);
    }

    if(context.includes("stop")){
      return pick([
        "I’ll check back later.",
        "Leaving this here for now.",
        "No worries, we can revisit.",
        "I’ll follow up in a bit.",
        "All good — we’ll circle back."
      ]);
    }

    return pick([
      "Got it.",
      "Alright, makes sense.",
      "Yeah, let’s move on that.",
      "Okay, I’ll handle it.",
      "Cool, continuing from here."
    ]);
  }

  /* =========================
     INPUT SIMULATION
     ========================= */

  async function typeInput(text){
    cameraFocus("camera-focus");

    await lookAt(input);
    input.value="";

    for(let i=0;i<text.length;i++){
      input.value+=text[i];
      await wait(25+Math.random()*60);
    }
  }

  async function simulateUser(text){
    await wait(300+Math.random()*400);

    remember(text);
    await typeInput(text);

    await clickCursor(sendBtn);

    input.value="";
    addMessage(text,"user");
  }

  /* =========================
     OPTIONS
     ========================= */

  async function showOptions(msg){

    const list=generateOptions(msg);

    optionsPanel.innerHTML="";
    const buttons=[];

    list.forEach(t=>{
      const b=document.createElement("div");
      b.className="option-btn";
      b.innerText=humanize(t);
      optionsPanel.appendChild(b);
      buttons.push(b);
    });

    cameraFocus(Math.random()<0.5?"camera-shift-left":"camera-shift-right");

    await wait(800+Math.random()*600);

    for(let i=0;i<2;i++){
      await lookAt(buttons[Math.floor(Math.random()*buttons.length)]);
    }

    const selected=buttons[Math.floor(Math.random()*buttons.length)];

    await clickCursor(selected);
    selected.classList.add("selected");

    await wait(400);

    optionsPanel.innerHTML="";
    addMessage(selected.innerText,"system");

    cameraFocus(null);
  }

  /* =========================
     FLOW
     ========================= */

  async function runDemo(){

    while(true){

      chats={0:[],1:[]};

      activeClient=0;
      updateTabs(); renderChat(0);

      let msg;

      msg="Client said they are busy this week";
      await simulateUser(msg); await wait(readTime(msg)); await showOptions(msg);

      msg="Client said maybe next week";
      await simulateUser(msg); await wait(readTime(msg)); await showOptions(msg);

      activeClient=1;
      await clickCursor(clientTabs[1]); updateTabs(); renderChat(1);

      msg="Client asked about pricing";
      await simulateUser(msg); await wait(readTime(msg)); await showOptions(msg);

      msg="Client asked if flexible";
      await simulateUser(msg); await wait(readTime(msg)); await showOptions(msg);

      activeClient=0;
      await clickCursor(clientTabs[0]); updateTabs(); renderChat(0);

      msg="Client asked if we can start soon";
      await simulateUser(msg); await wait(readTime(msg)); await showOptions(msg);

      msg="Client said let's proceed";
      await simulateUser(msg); await wait(readTime(msg)); await showOptions(msg);

      addMessage("Outcome achieved.","system");

      activeClient=1;
      await clickCursor(clientTabs[1]); updateTabs(); renderChat(1);

      msg="Client stopped responding";
      await simulateUser(msg); await wait(readTime(msg)); await showOptions(msg);

      addMessage("Conversation ended.","system");

      await wait(4000);
      chatBox.innerHTML="";
      optionsPanel.innerHTML="";
    }
  }

  runDemo();
});

window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loaded");
});
