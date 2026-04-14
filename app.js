// 🔥 SAFETY FIX
document.documentElement.classList.add("loaded");

document.addEventListener("DOMContentLoaded", () => {

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
  let memory = [];

  const wait = (t) => new Promise(res => setTimeout(res, t));
  const readTime = (t) => Math.max(1400, t.length * 40);

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

  async function clickCursor(el){
    moveCursorTo(el);
    await wait(200);
    cursor?.classList.add("clicking");
    await wait(120);
    cursor?.classList.remove("clicking");
  }

  /* =========================
     CAMERA
     ========================= */

  function cameraFocus(mode){
    const c = document.querySelector(".demo-container");
    if(!c) return;

    c.classList.remove("camera-focus","camera-shift-left","camera-shift-right");
    if(mode) c.classList.add(mode);
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
     MEMORY + AI OPTIONS
     ========================= */

  function remember(msg){
    memory.push(msg.toLowerCase());
    if(memory.length > 6) memory.shift();
  }

  function generateOptions(msg){
    const context = (memory.join(" ") + " " + msg).toLowerCase();

    if(context.includes("busy")){
      return [
        "No worries — I’ll keep this simple.",
        "All good — I’ll follow up later.",
        "I’ll make this quick for you.",
        "Let me know when it works better."
      ];
    }

    if(context.includes("pricing")){
      return [
        "Happy to break this down.",
        "Quick overview for you.",
        "Let’s tailor this.",
        "We can adjust pricing."
      ];
    }

    if(context.includes("start") || context.includes("proceed")){
      return [
        "Let’s begin.",
        "Starting now.",
        "Everything is aligned.",
        "Moving forward."
      ];
    }

    if(context.includes("stop")){
      return [
        "I’ll follow up later.",
        "Leaving this open.",
        "Happy to reconnect.",
        "Closing for now."
      ];
    }

    return [
      "Continuing from here.",
      "I’ll take the next step.",
      "Moving forward.",
      "Handled."
    ];
  }

  /* =========================
     HUMAN INPUT
     ========================= */

  async function typeInput(text){
    cameraFocus("camera-focus");

    await clickCursor(input);
    input.value="";

    for(let i=0;i<text.length;i++){
      input.value+=text[i];
      await wait(25+Math.random()*60);

      if(Math.random()<0.08){
        await wait(200);
      }
    }
  }

  async function simulateUser(text){
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

    const list = generateOptions(msg);

    optionsPanel.innerHTML="";
    const buttons=[];

    list.sort(()=>Math.random()-0.5).forEach(t=>{
      const b=document.createElement("div");
      b.className="option-btn";
      b.innerText=t;
      optionsPanel.appendChild(b);
      buttons.push(b);
    });

    cameraFocus(Math.random()<0.5 ? "camera-shift-left" : "camera-shift-right");

    await wait(1500+Math.random()*800);

    const selected = buttons[Math.floor(Math.random()*buttons.length)];

    await clickCursor(selected);
    selected.classList.add("selected");

    await wait(400);

    optionsPanel.innerHTML="";
    addMessage(selected.innerText,"system");

    cameraFocus(null);
  }

  /* =========================
     FINAL FLOW (FIXED)
     ========================= */

  async function runDemo(){

    while(true){

      chats={0:[],1:[]};

      /* CLIENT 1 */

      activeClient=0;
      updateTabs();
      renderChat(0);

      let msg;

      msg="Client said they are busy this week";
      await simulateUser(msg);
      await wait(readTime(msg));
      await showOptions(msg);

      msg="Client said maybe next week";
      await simulateUser(msg);
      await wait(readTime(msg));
      await showOptions(msg);

      /* CLIENT 2 FULL */

      activeClient=1;
      await clickCursor(clientTabs[1]);
      updateTabs();
      renderChat(1);

      msg="Client asked about pricing";
      await simulateUser(msg);
      await wait(readTime(msg));
      await showOptions(msg);

      msg="Client asked if flexible";
      await simulateUser(msg);
      await wait(readTime(msg));
      await showOptions(msg);

      msg="Client will confirm soon";
      await simulateUser(msg);
      await wait(readTime(msg));
      await showOptions(msg);

      /* BACK CLIENT 1 */

      activeClient=0;
      await clickCursor(clientTabs[0]);
      updateTabs();
      renderChat(0);

      msg="Client asked if we can start soon";
      await simulateUser(msg);
      await wait(readTime(msg));
      await showOptions(msg);

      msg="Client said let's proceed";
      await simulateUser(msg);
      await wait(readTime(msg));
      await showOptions(msg);

      addMessage("Outcome achieved.","system");

      /* CLIENT 2 END */

      activeClient=1;
      await clickCursor(clientTabs[1]);
      updateTabs();
      renderChat(1);

      msg="Client stopped responding";
      await simulateUser(msg);
      await wait(readTime(msg));
      await showOptions(msg);

      addMessage("Conversation ended.","system");

      /* RESET */

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
