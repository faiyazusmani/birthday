/* ---------- Countdown ---------- */
(function countdown(){
  const el = document.getElementById("countdown");
  // change birthday date if needed
  const target = new Date("2025-11-25T00:00:00");
  function tick(){
    const now = new Date();
    const diff = target - now;
    if(diff <= 0){ el.innerText = "🎉 Happy Birthday Dua! 🎉"; return; }
    const d = Math.floor(diff/(1000*60*60*24));
    const h = Math.floor(diff/(1000*60*60)%24);
    const m = Math.floor(diff/(1000*60)%60);
    const s = Math.floor(diff/1000%60);
    el.innerText = `${d}d ${h}h ${m}m ${s}s`;
  }
  tick(); setInterval(tick,1000);
})();

/* ---------- Theme Toggle & music ---------- */
const body = document.body;
const btnTheme = document.getElementById("toggleTheme");
btnTheme.addEventListener("click", () => {
  if(body.classList.contains("theme-dark")){
    body.classList.remove("theme-dark"); body.classList.add("theme-light");
    btnTheme.innerText = "☀️"; btnTheme.setAttribute("aria-pressed","true");
    // lighten CSS variables dynamically (basic)
    document.documentElement.style.setProperty('--bg','#f7f7fa');
    document.documentElement.style.setProperty('--panel','#ffffff');
    document.documentElement.style.setProperty('--muted','#444');
    document.documentElement.style.setProperty('--card','#fff');
    document.documentElement.style.setProperty('--accent','#ff2e85');
  } else {
    body.classList.remove("theme-light"); body.classList.add("theme-dark");
    btnTheme.innerText = "🌙"; btnTheme.setAttribute("aria-pressed","false");
    document.documentElement.style.removeProperty('--bg'); document.documentElement.style.removeProperty('--panel');
    document.documentElement.style.removeProperty('--muted'); document.documentElement.style.removeProperty('--card');
  }
});

/* Background music control */
const music = document.getElementById("bgMusic");
const playBtn = document.getElementById("playMusic");
const vol = document.getElementById("musicVolume");
playBtn.addEventListener("click", ()=>{
  if(music.paused){ music.volume = vol.value; music.play(); playBtn.innerText="🔈"; }
  else { music.pause(); playBtn.innerText="🔊"; }
});
vol.addEventListener("input", ()=> music.volume = vol.value);

/* ---------- Candle blow (click anywhere) ---------- */
let blown=false;
function blowCandles(){
  if(blown) return;
  blown=true;
  // hide main flames
  document.querySelectorAll(".flame, .mini-flame").forEach(f=>{
    f.style.transition="all 0.8s ease";
    f.style.opacity="0";
    f.style.transform="translateY(-6px) scale(0.9)";
  });
  // confetti + fireworks
  startConfetti();
  const v = document.getElementById("fireworksV");
  if(v){ v.style.display="block"; v.play(); }
  // reveal typewriter lines faster
  startTypewriter(true);
}
document.addEventListener("click", blowCandles);

/* ---------- Surprise button ---------- */
document.getElementById("surpriseBtn").addEventListener("click", ()=>{
  alert("Dua 💖 — Happy Birthday! Love, Faiyaz");
  startConfetti();
});

/* ---------- Typewriter (line by line) ---------- */
const lines = [
  "Khuda se fariyad yahi, har subah ho tere liye khushiyon bhari.",
  "Har lamha tere liye khudaa se qubool ho, aur sapne tere sab sach ho.",
  "Janamdin mubarak ho Dua — hasi hamesha chehre pe bani rahe. 🎂"
];
const typeEl = document.getElementById("typewriter");
let li = 0, char=0, typing=false;
function startTypewriter(force){
  if(typing && !force) return;
  typing = true;
  typeEl.innerHTML = "";
  function typeLine(i){
    if(i>=lines.length){ typing=false; return; }
    const str = lines[i];
    char = 0;
    const span = document.createElement("span");
    typeEl.appendChild(span);
    const cur = setInterval(()=>{
      if(char<=str.length){
        span.innerHTML = str.slice(0,char) + '<span class="cursor"></span>';
        char++;
      } else {
        clearInterval(cur);
        // small pause then next line
        setTimeout(()=>{ typeEl.appendChild(document.createElement("br")); typeLine(i+1); }, 700);
      }
    }, 28);
  }
  typeLine(0);
}
startTypewriter(false);

/* ---------- Gallery Lightbox ---------- */
document.querySelectorAll(".gallery img").forEach(img=>{
  img.addEventListener("click", (e)=>{
    const lb = document.getElementById("lightbox");
    document.getElementById("lbImg").src = e.target.src;
    document.getElementById("lbCaption").innerText = e.target.dataset.caption || "";
    lb.style.display = "flex"; lb.setAttribute("aria-hidden","false");
  });
});
document.getElementById("closeLB").addEventListener("click", ()=> {
  const lb = document.getElementById("lightbox");
  lb.style.display = "none"; lb.setAttribute("aria-hidden","true");
});

/* ---------- Copy & share ---------- */
document.getElementById("shareCopy").addEventListener("click", ()=>{
  const txt = `Happy Birthday Dua! 🎂\nWishing you lots of love — from Faiyaz`;
  navigator.clipboard?.writeText(txt).then(()=> alert("Message copied to clipboard!"));
});
document.getElementById("shareWhats").addEventListener("click", ()=>{
  const url = encodeURIComponent("Happy Birthday Dua! 🎂 Wishing you lots of love — from Faiyaz");
  window.open(`https://wa.me/?text=${url}`,'_blank');
});

/* ---------- Confetti (canvas) ---------- */
function startConfetti(){
  const canvas = document.getElementById("confettiCanvas");
  if (!canvas) return;
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  canvas.style.position = "fixed"; canvas.style.top = 0; canvas.style.left = 0; canvas.style.zIndex = 9998; canvas.style.pointerEvents = "none";
  const ctx = canvas.getContext("2d");
  const pieces = [];
  const colors = ["#ff2e85","#ff74c7","#ffd6ea","#fff0f8"];
  for(let i=0;i<250;i++){
    pieces.push({x:Math.random()*canvas.width, y:Math.random()*-canvas.height, r:Math.random()*6+2, vx:Math.random()*2-1, vy:Math.random()*3+2, col: colors[Math.floor(Math.random()*colors.length)], rot:Math.random()*360});
  }
  let running=true;
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(p=>{
      p.x += p.vx; p.y += p.vy; p.rot += 4;
      if(p.y>canvas.height) { p.y = -20; p.x = Math.random()*canvas.width; }
      ctx.save();
      ctx.translate(p.x,p.y); ctx.rotate(p.rot*Math.PI/180);
      ctx.fillStyle = p.col; ctx.fillRect(-p.r/2,-p.r/2,p.r,p.r*1.6);
      ctx.restore();
    });
    if(running) requestAnimationFrame(draw);
  }
  draw();
  // auto stop after 6s
  setTimeout(()=>{ running=false; ctx.clearRect(0,0,canvas.width,canvas.height); canvas.style.zIndex = 0 },6000);
}

/* ---------- small accessible touches ---------- */
window.addEventListener("resize", ()=> {
  const c = document.getElementById("confettiCanvas");
  if(c){ c.width = window.innerWidth; c.height = window.innerHeight; }
});
