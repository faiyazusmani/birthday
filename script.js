/* ---------- COUNTDOWN ---------- */
(function countdown(){
  const el = document.getElementById("countdown");
  const target = new Date("2025-11-25T00:00:00"); // change if needed
  function tick(){
    const now = new Date();
    const diff = target - now;
    if(diff <= 0){ el.innerText = "🎉 Happy Birthday Dua! 🎉"; return; }
    const d = Math.floor(diff / (1000*60*60*24));
    const h = Math.floor((diff / (1000*60*60)) % 24);
    const m = Math.floor((diff / (1000*60)) % 60);
    const s = Math.floor((diff / 1000) % 60);
    el.innerText = `${d}d ${h}h ${m}m ${s}s`;
  }
  tick(); setInterval(tick, 1000);
})();


/* ---------- THEME TOGGLE ---------- */
const body = document.body;
const btnTheme = document.getElementById("toggleTheme");
btnTheme.addEventListener("click", () => {
  if(body.classList.contains("theme-dark")){
    body.classList.remove("theme-dark");
    body.classList.add("theme-light");
    btnTheme.innerText = "☀️";
    btnTheme.setAttribute("aria-pressed","true");
    document.documentElement.style.setProperty('--bg','#f7f7fa');
  } else {
    body.classList.remove("theme-light");
    body.classList.add("theme-dark");
    btnTheme.innerText = "🌙";
    btnTheme.setAttribute("aria-pressed","false");
    document.documentElement.style.removeProperty('--bg');
  }
});


/* ---------- TYPEWRITER ---------- */
const lines = [
  "Khuda se fariyad yahi, har subah ho tere liye khushiyon bhari.",
  "Har lamha tere liye khudaa se qubool ho, aur sapne tere sab sach ho.",
  "Janamdin mubarak ho Dua — hasi hamesha chehre pe bani rahe. 🎂"
];
const typeEl = document.getElementById("typewriter");
let typing = false;
function startTypewriter(force){
  if(typing && !force) return;
  typing = true;
  typeEl.innerHTML = "";
  function typeLine(i){
    if(i >= lines.length){ typing = false; return; }
    const str = lines[i];
    let char = 0;
    const span = document.createElement("span");
    typeEl.appendChild(span);
    const cur = setInterval(()=> {
      if(char <= str.length){
        span.innerHTML = str.slice(0,char) + '<span class="cursor"></span>';
        char++;
      } else {
        clearInterval(cur);
        setTimeout(()=> { typeEl.appendChild(document.createElement("br")); typeLine(i+1); }, 700);
      }
    }, 28);
  }
  typeLine(0);
}
startTypewriter(false);


/* ---------- LIGHTBOX (gallery) ---------- */
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

/* close lightbox on backdrop click */
document.getElementById("lightbox").addEventListener("click", (e)=> {
  if(e.target.id === "lightbox" || e.target.id === "closeLB") {
    document.getElementById("lightbox").style.display = "none";
  }
});


/* ---------- SHARE / COPY ---------- */
document.getElementById("shareCopy").addEventListener("click", ()=>{
  const txt = `Happy Birthday Dua! 🎂\nWishing you lots of love — from Faiyaz`;
  navigator.clipboard?.writeText(txt).then(()=> alert("Message copied to clipboard!")).catch(()=> alert("Copy failed"));
});
document.getElementById("shareWhats").addEventListener("click", ()=>{
  const url = encodeURIComponent("Happy Birthday Dua! 🎂 Wishing you lots of love — from Faiyaz");
  window.open(`https://wa.me/?text=${url}`,'_blank');
});


/* ---------- CANDLE BLOW (left candles + overlay candles on cake) ---------- */
let blown = false;
function blowCandles(){
  if(blown) return; // only once per page load
  blown = true;

  // fade out all flame elements
  document.querySelectorAll(".flame, .oc-flame").forEach(f=>{
    f.style.transition = "all 0.9s ease";
    f.style.opacity = "0";
    f.style.transform = "translateY(-10px) scale(0.9)";
  });

  // start continuous confetti
  startConfetti();

  // visual mini fireworks show (if video exists)
  const v = document.getElementById("fireworksV");
  if(v){ v.style.display = "block"; try{ v.play(); }catch(e){} }

  // accelerate typewriter
  startTypewriter(true);
}

// bind left-panel candles area
const leftCandles = document.getElementById("candles");
if(leftCandles){
  leftCandles.addEventListener("click", (e)=> { e.stopPropagation(); blowCandles(); });
  leftCandles.addEventListener("keydown", (e)=> { if(e.key === "Enter" || e.key === " ") { e.preventDefault(); blowCandles(); } });
}

// bind overlay candles on cake photo
const overlayCandles = document.getElementById("overlayCandles");
if(overlayCandles){
  overlayCandles.addEventListener("click", (e)=> { e.stopPropagation(); blowCandles(); });
  // allow clicking the entire cake card
  const cakeCard = document.getElementById("cakeCard");
  cakeCard.addEventListener("click", (e)=> { e.stopPropagation(); blowCandles(); });
  cakeCard.addEventListener("keydown", (e)=> { if(e.key === "Enter" || e.key === " ") { e.preventDefault(); blowCandles(); } });
}


/* ---------- SURPRISE BUTTON ---------- */
document.getElementById("surpriseBtn").addEventListener("click", ()=>{
  alert("Dua 💖 — Happy Birthday!, Faiyaz");
  startConfetti();
});


/* ---------- CONFETTI (continuous, optimized for device) ---------- */
let confettiRunning = false;
function startConfetti(){
  if(confettiRunning) return;
  confettiRunning = true;

  const canvas = document.getElementById("confettiCanvas");
  if(!canvas) return;
  const ctx = canvas.getContext("2d");

  function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // particle settings scale with area — but clamp for mobile
  const area = canvas.width * canvas.height;
  let total = Math.floor(area / 12000); // tuned value
  if(total < 80) total = 80;
  if(total > 500) total = 500;
  // reduce on small screens for perf
  if(window.innerWidth < 600) total = Math.max(50, Math.floor(total * 0.45));

  const colors = ["#ff2e85","#ff74c7","#ffd6ea","#fff0f8"];
  const pieces = [];
  for(let i=0;i<total;i++){
    pieces.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height * -1,
      r: Math.random()*7 + 2,
      vx: (Math.random()*2 - 1) * (1 + Math.random()*0.6),
      vy: 1 + Math.random()*3,
      col: colors[Math.floor(Math.random()*colors.length)],
      rot: Math.random()*360,
      swing: Math.random()*0.02 + 0.005
    });
  }

  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let i=0;i<pieces.length;i++){
      const p = pieces[i];
      p.x += p.vx + Math.sin(p.rot * p.swing);
      p.y += p.vy;
      p.rot += 3 + Math.random()*2;

      if(p.y > canvas.height + 30){
        p.y = -20;
        p.x = Math.random()*canvas.width;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI/180);
      ctx.fillStyle = p.col;
      ctx.fillRect(-p.r/2, -p.r/2, p.r, p.r*1.6);
      ctx.restore();
    }
    requestAnimationFrame(draw);
  }
  draw();
}


/* ---------- small accessible touches ---------- */
window.addEventListener("resize", ()=> {
  const c = document.getElementById("confettiCanvas");
  if(c){ c.width = window.innerWidth; c.height = window.innerHeight; }
});
