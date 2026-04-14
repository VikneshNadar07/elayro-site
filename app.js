// 🔥 SAFETY FIX
document.documentElement.classList.add("loaded");

document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     GLOBAL HOOK
     ========================= */

  const hookEl = document.getElementById("dynamicHook");

  if (hookEl) {
    const hooks = [
      "From uncertainty to outcome.",
      "Execution removes hesitation.",
      "Every message should move forward.",
      "Clarity creates momentum.",
      "Structure turns intent into results."
    ];

    let i = 0;

    function rotateHook() {
      hookEl.style.opacity = 0;
      setTimeout(() => {
        hookEl.innerText = hooks[i];
        hookEl.style.opacity = 0.6;
        i = (i + 1) % hooks.length;
      }, 300);
    }

    rotateHook();
    setInterval(rotateHook, 4000);
  }

  /* =========================
     ELEMENTS
     ========================= */

  const chatBox = document.getElementById("chatBox");
  const clientTabs = document.querySelectorAll(".clients .client");
  const optionsPanel = document.getElementById("optionsPanel");
  const input = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");
  const cursor = document.getElementById("fakeCursor");

  if (!chatBox || !optionsPanel || !input || !sendBtn) return;

  let activeClient = 0;
  let chats = { 0: [], 1: [] };

  const wait = (t) => new Promise(res => setTimeout(res, t));
  const readTime = (t) => Math.max(1400, t.length * 40);
  const adaptiveDelay = (b=800)=> b + Math.random()*b*0.6;

  document.addEventListener("selectstart", e => e.preventDefault());
  document.addEventListener("dragstart", e => e.preventDefault());
  input.addEventListener("focus", e => e.target.blur());
  sendBtn.addEventListener("click", e => e.preventDefault());

  /* =========================
     CURSOR SYSTEM
     ========================= */

  let cx = window.innerWidth/2, cy = window.innerHeight/2;
  let tx = cx, ty = cy;

  function animateCursor(){
    cx += (tx-cx)*0.1;
    cy += (ty-cy)*0.1;
    if(cursor){
      cursor.style.left = cx+"px";
      cursor.style.top = cy+"px";
    }
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  function moveCursorTo(el){
    const r = el.getBoundingClientRect();
    tx = r.left + r.width*(0.4+Math.random()*0.3);
    ty = r.top + r.height*(0.4+Math.random()*0.3);
  }

  async function hoverCursor(el){
    moveCursorTo(el);
    await wait(150 + Math.random()*300);
  }

  async function clickCursor(el){
    await hoverCursor(el);
    cursor?.classList.add("clicking");
    await wait(120);
    cursor?.classList.remove("clicking");
  }

  /* =========================
     CHAT RENDER
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
    chatBox.scrollTop=chatBox.scrollHeight;
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
     HUMAN TYPING
     ========================= */

  async function typeInput(text){
    await clickCursor(input);
    input.value="";
    for(let i=0;i<text.length;i++){
      input.value+=text[i];
      await wait(25+Math.random()*60);
      if(Math.random()<0.08) await wait(200);
    }
  }

  async function simulateUser(text){
    await typeInput(text);
    await clickCursor(sendBtn);
    input.value="";
    addMessage(text,"user");
  }

  /* =========================
     OPTIONS
     ========================= */

  async function showOptions(list){

    optionsPanel.innerHTML="";
    const buttons=[];

    list.sort(()=>Math.random()-0.5).forEach(t=>{
      const b=document.createElement("div");
      b.className="option-btn";
      b.innerText=t;
      optionsPanel.appendChild(b);
      buttons.push(b);
    });

    for(let b of buttons){
      await wait(100);
      b.classList.add("show");
    }

    await wait(1500+Math.random()*1000);

    const selected=buttons[Math.floor(Math.random()*buttons.length)];

    await clickCursor(selected);
    selected.classList.add("selected");

    await wait(400);
    optionsPanel.innerHTML="";
    addMessage(selected.innerText,"system");
  }

  /* =========================
     SCENARIOS
     ========================= */

  const scenarios=[
    ["Client is busy","Client maybe next week"],
    ["Client reviewing","Client follow up later"],
    ["Client interested","Client stopped replying"]
  ];

  function getScenario(){
    return scenarios[Math.floor(Math.random()*scenarios.length)];
  }

  /* =========================
     DEMO LOOP
     ========================= */

  async function runDemo(){

    while(true){

      const s=getScenario();

      chats={0:[],1:[]};
      activeClient=0;
      updateTabs();
      renderChat(0);

      await simulateUser(s[0]);
      await wait(adaptiveDelay());

      await showOptions([
        "No worries — I’ll keep this simple.",
        "All good — quick summary works.",
        "Following up when it works.",
        "Let me know when ready."
      ]);

      await wait(adaptiveDelay());

      await simulateUser(s[1]);
      await wait(adaptiveDelay());

      await showOptions([
        "Sure — I’ll follow up.",
        "Works — I’ll check back.",
        "Keeping this ready.",
        "Let me know anytime."
      ]);

      await wait(2000);

      activeClient=1;
      await clickCursor(clientTabs[1]);
      updateTabs();
      renderChat(1);

      await simulateUser("Client asked about pricing");
      await wait(adaptiveDelay());

      await showOptions([
        "Happy to break this down.",
        "Quick cost overview.",
        "Full details if needed.",
        "We can customize."
      ]);

      addMessage("Outcome achieved.","system");

      await wait(5000);
    }
  }

  runDemo();
});

window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loaded");
});
