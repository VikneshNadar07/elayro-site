/* TAGLINE TYPING */
const text="Executions, Perfected.";
let i=0;

function typing(){
if(i<text.length){
document.getElementById("typed").innerHTML+=text.charAt(i);
i++;
setTimeout(typing,60);
}
}
typing();

/* PARTICLES */
const canvas=document.getElementById("particles");
const ctx=canvas.getContext("2d");

canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

let particles=[];
for(let i=0;i<80;i++){
particles.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
r:Math.random()*2,
dx:Math.random()-0.5,
dy:Math.random()-0.5
});
}

function animate(){
ctx.clearRect(0,0,canvas.width,canvas.height);
particles.forEach(p=>{
ctx.beginPath();
ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
ctx.fillStyle="#6366f1";
ctx.fill();

```
p.x+=p.dx;
p.y+=p.dy;
```

});
requestAnimationFrame(animate);
}
animate();

/* CURSOR GLOW */
const glow=document.querySelector(".cursor-glow");
document.addEventListener("mousemove",(e)=>{
glow.style.left=e.clientX+"px";
glow.style.top=e.clientY+"px";
});

/* SCROLL REVEAL */
const reveals=document.querySelectorAll(".reveal");

window.addEventListener("scroll",()=>{
reveals.forEach(el=>{
if(el.getBoundingClientRect().top<window.innerHeight-100){
el.classList.add("active");
}
});
});
