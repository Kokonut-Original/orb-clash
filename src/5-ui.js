
/* ═════════════════════════ NỀN AURORA ═════════════════════════ */
const au=$("#aurora"),actx=au.getContext("2d");let auOn=true;
const BLOBS=[{c:"#6B4BFF",x:.2,y:.2,r:.45,sx:.13,sy:.17},{c:"#FF4D7A",x:.8,y:.3,r:.38,sx:.11,sy:.09},{c:"#36E2FF",x:.6,y:.85,r:.42,sx:.07,sy:.12},{c:"#B86CFF",x:.15,y:.8,r:.3,sx:.15,sy:.1}];
function sizeAurora(){au.width=Math.max(60,Math.round(innerWidth/10));au.height=Math.max(60,Math.round(innerHeight/10))}
sizeAurora();addEventListener("resize",sizeAurora);
let auT=0,mouseX=.5,mouseY=.5;
function drawAurora(ts){
  requestAnimationFrame(drawAurora);if(!auOn||ts-auT<40)return;auT=ts;const t=ts/1000,w=au.width,h=au.height;
  actx.fillStyle="#0B0814";actx.fillRect(0,0,w,h);actx.globalCompositeOperation="lighter";
  for(const b of BLOBS){const x=(b.x+Math.sin(t*b.sx*3)*.12+(mouseX-.5)*.08)*w,y=(b.y+Math.cos(t*b.sy*3)*.12+(mouseY-.5)*.08)*h,r=b.r*Math.max(w,h);const g=actx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,hexA(b.c,.55));g.addColorStop(1,hexA(b.c,0));actx.fillStyle=g;actx.fillRect(0,0,w,h)}
  actx.globalCompositeOperation="source-over";
}
requestAnimationFrame(drawAurora);

/* ═════════════════════════ CON TRỎ & TƯƠNG TÁC ═════════════════════════ */
const cur=$("#cursor"),cDot=cur.querySelector(".c-dot"),cRing=cur.querySelector(".c-ring");
let cx=-100,cy=-100,rx=-100,ry=-100;
addEventListener("pointermove",e=>{cx=e.clientX;cy=e.clientY;mouseX=cx/innerWidth;mouseY=cy/innerHeight;const hov=e.target.closest&&e.target.closest("button,a,input,.card,.pick");cur.classList.toggle("hov",!!hov)},{passive:true});
addEventListener("pointerdown",()=>cur.classList.add("down"));addEventListener("pointerup",()=>cur.classList.remove("down"));
(function cursorLoop(){rx+=(cx-rx)*.18;ry+=(cy-ry)*.18;cDot.style.transform=`translate(${cx}px,${cy}px) translate(-50%,-50%)`;cRing.style.transform=`translate(${rx}px,${ry}px) translate(-50%,-50%)`;requestAnimationFrame(cursorLoop)})();
function bindFx(root){
  if(!matchMedia("(hover:hover)").matches||REDUCED)return;
  root.querySelectorAll(".mag").forEach(el=>{
    el.addEventListener("pointermove",e=>{const r=el.getBoundingClientRect();const dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);el.style.transform=`translate(${dx*.22}px,${dy*.32}px)`});
    el.addEventListener("pointerleave",()=>{el.style.transform=""});
    el.addEventListener("pointerenter",()=>sfx.hover());
  });
  root.querySelectorAll(".tilt").forEach(el=>{
    el.addEventListener("pointermove",e=>{const r=el.getBoundingClientRect();const px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;el.style.transform=`rotateX(${(.5-py)*14}deg) rotateY(${(px-.5)*16}deg) translateZ(0)`;el.style.setProperty("--mx",px*100+"%");el.style.setProperty("--my",py*100+"%")});
    el.addEventListener("pointerleave",()=>{el.style.transform=""});
  });
}

/* ═════════════════════════ TIỆN ÍCH UI ═════════════════════════ */
function orbHTML(def,locked=false,cls=""){
  if(locked)return`<span class="orb locked ${cls}"><span>??</span></span>`;
  if(hasSkin(def))return`<span class="orb sk r-${def.rar} ${cls}" style="--c:${def.color}"><img src="${skinURL(def)}" alt=""></span>`;
  return`<span class="orb r-${def.rar} ${lum(def.color)>.7?"light":""} ${cls}" style="--c:${def.color}"><span>${iconSVG(def)}</span></span>`;
}
const rarPill=r=>`<span class="rar" data-r="${r}">${RAR_VN[r]}</span>`;
let toastT;
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove("show"),2600)}
let shownCoins=-1,shownGems=-1;
function updateWallet(){
  const ce=$("#coins"),ge=$("#gems");
  const anim=(el,from,to,chip)=>{if(from<0||from===to){el.textContent=fmt(to);return}chip.classList.remove("bump");void chip.offsetWidth;chip.classList.add("bump");const t0=performance.now();(function f(){const k=Math.min(1,(performance.now()-t0)/600);el.textContent=fmt(from+(to-from)*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(f)})()};
  anim(ce,shownCoins,S.coins,$("#coinChip"));anim(ge,shownGems,S.gems,$("#gemChip"));shownCoins=S.coins;shownGems=S.gems;
}
const ICON_SOUND='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>';
const ICON_MUTE='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M17 9l5 6M22 9l-5 6"/></svg>';
function renderMute(){$("#muteBtn").innerHTML=S.muted?ICON_MUTE:ICON_SOUND}
$("#muteBtn").onclick=()=>{S.muted=!S.muted;save();renderMute();sfx.click()};
function ownedCount(){return Object.keys(S.owned).length}
function avgLevel(){const v=Object.values(S.owned);return v.reduce((a,b)=>a+b,0)/Math.max(1,v.length)}
function splitChars(txt){return [...txt].map((c,i)=>`<span class="ch" style="animation-delay:${.15+i*.06}s">${c}</span>`).join("")}

/* ═════════════════════════ FX CANVAS (confetti) ═════════════════════════ */
const fxc=$("#fxc"),fctx=fxc.getContext("2d");let confetti=[],fxRun=false;
function sizeFx(){const d=Math.min(2,devicePixelRatio||1);fxc.width=innerWidth*d;fxc.height=innerHeight*d;fctx.setTransform(d,0,0,d,0,0)}
sizeFx();addEventListener("resize",sizeFx);
function confettiBurst(x,y,n,cols){
  if(REDUCED)return;
  for(let i=0;i<n;i++){const a=rand(-Math.PI,0),s=rand(300,1100);confetti.push({x,y,vx:Math.cos(a)*s*rand(.4,1),vy:Math.sin(a)*s,life:rand(1.4,2.6),max:2.6,c:pick(cols),w:rand(5,10),h:rand(8,16),r:rand(0,TAU),vr:rand(-10,10),star:Math.random()<.3})}
  if(!fxRun){fxRun=true;let last=performance.now();(function f(ts){const dt=Math.min(.05,(ts-last)/1000);last=ts;fctx.clearRect(0,0,innerWidth,innerHeight);
    for(const p of confetti){p.life-=dt;p.vy+=900*dt;p.vx*=.985;p.vy*=.985;p.x+=p.vx*dt;p.y+=p.vy*dt;p.r+=p.vr*dt;fctx.save();fctx.globalAlpha=Math.min(1,p.life);fctx.translate(p.x,p.y);fctx.rotate(p.r);fctx.fillStyle=p.c;
      if(p.star){fctx.globalCompositeOperation="lighter";fctx.beginPath();for(let k=0;k<8;k++){const rr=k%2?3:9;fctx.lineTo(Math.cos(k*Math.PI/4)*rr,Math.sin(k*Math.PI/4)*rr)}fctx.fill()}else fctx.fillRect(-p.w/2,-p.h/2,p.w,p.h*Math.abs(Math.cos(p.r*2)));fctx.restore()}
    confetti=confetti.filter(p=>p.life>0&&p.y<innerHeight+50);if(confetti.length)requestAnimationFrame(f);else{fxRun=false;fctx.clearRect(0,0,innerWidth,innerHeight)}})(last)}
}
function flashbang(c){const d=document.createElement("div");d.className="flashbang";d.style.setProperty("--fc",c);document.body.appendChild(d);setTimeout(()=>d.remove(),650)}
function quake(){const a=$("#app");a.classList.remove("quake");void a.offsetWidth;a.classList.add("quake")}

/* ═════════════════════════ TAB ═════════════════════════ */
let tab="play";
$$(".tab").forEach(b=>b.onclick=()=>{tab=b.dataset.tab;$$(".tab").forEach(x=>x.setAttribute("aria-selected",x===b));renderTab();sfx.click()});
function renderTab(){
  const m=$("#main");m.scrollTop=0;stopShowcase();
  stopGalaxy();m.innerHTML=tab==="play"?viewPlay():tab==="collection"?viewCollection():tab==="crates"?viewCrates():tab==="merge"?viewMerge():viewCodes();
  bindTab();bindFx(m);if(tab==="play")startShowcase();
}
function viewPlay(){
  const total=S.w+S.l,names=BALLS.map(b=>`<span>${b.name}<i style="background:${b.color};box-shadow:0 0 10px ${b.color}"></i></span>`).join("");
  return`<div class="view">
  <section class="hero">
    <div class="hero-l">
      <span class="idx rv"><b>(001)</b> — Đấu với bot · thắng 2 hiệp</span>
      <h1 class="mega" aria-label="Orb Clash"><span class="ln">${splitChars("ORB")}</span><span class="ln ol">${splitChars("CLASH")}</span></h1>
      <p class="lede rv" style="animation-delay:.5s">Chọn 1 trong 3 quả bóng rút ngẫu nhiên. Chúng tự lao vào nhau, kỹ năng tự nổ. Bạn có <b>một cú Dồn lực</b> mỗi hiệp: bấm đúng lúc để lật kèo.</p>
      <div class="rv" style="animation-delay:.6s"><div class="idx" style="margin-bottom:10px"><b>(002)</b> — Độ khó</div>
        <div class="diff" role="group" aria-label="Độ khó">${Object.entries(DIFF).map(([k,d])=>`<button class="mag" data-diff="${k}" aria-pressed="${S.diff===k}"><b>${d.name}</b><small>×${d.mult} · ${d.note}</small></button>`).join("")}</div></div>
      <div class="rv" style="animation-delay:.7s"><button class="btn btn-play mag" id="startBtn">VÀO TRẬN ⟶</button></div>
    </div>
    <div class="showcase rv" style="animation-delay:.3s">
      <canvas id="show"></canvas>
      <div class="cap"><span class="idx"><b>(003)</b> — Đội hình của bạn</span><span class="idx">${ownedCount()} / ${BALLS.length}</span></div>
      <div class="foot"><div><span class="idx">Mạnh nhất</span><br><b id="bestName">—</b></div><button class="btn btn-ghost mag" id="goCrates">Mở rương</button></div>
    </div>
  </section>
  <section class="modes">
    <button class="mode m-tower tilt rv" id="goTower" style="--mc:${(BOSSES.find(b=>b.floor>=(S.tower.run?S.tower.run.floor:S.tower.ckpt||1))||BOSSES[4]).color}">
      <span class="idx"><b>(004)</b> — Chế độ</span><h3>LEO <em>THÁP</em></h3>
      <p>25 tầng, 5 boss với sàn riêng: rắn độc, băng giá, vua cát, dung nham, hư không.</p>
      <span class="m-meta"><b class="num">${S.tower.run?"Tầng "+S.tower.run.floor:"Tầng "+(S.tower.ckpt||1)}</b><small>Kỷ lục ${S.tower.best}/${TOWER_N} · ${S.tower.boss.length}/5 boss</small></span>
      <div class="m-bosses">${BOSSES.map(b=>`<span class="orb r-mythic ${S.tower.boss.includes(b.id)?"":"dim"}" style="--c:${b.color}" title="${b.name}"><span></span></span>`).join("")}</div><span class="m-go">⟶</span></button>
    <button class="mode m-endless tilt rv" id="goEndless" style="animation-delay:.08s">
      <span class="idx"><b>(005)</b> — Chế độ</span><h3>VÔ <em>TẬN</em></h3>
      <p>Một quả bóng, vô số vòng: 1 chọi 15 lính cát, bóng gương, gã khổng lồ… Thắng là chọn thẻ nâng cấp.</p>
      <span class="m-meta"><b class="num">Vòng ${S.endless.best}</b><small>Kỷ lục cao nhất</small></span>
      <div class="m-cards">${["⚔","☾","ϟ","❂","♨"].map((c,i)=>`<span style="--d:${i}">${c}</span>`).join("")}</div><span class="m-go">⟶</span></button>
  </section>
  <section class="arenas rv"><div class="head"><div><span class="idx"><b>(006)</b> — Sàn đấu nhanh · ${ARENAS.length} sàn</span><h2 class="h-sm">CHỌN <em>SÀN</em></h2></div></div>
    <div class="arena-grid"><button class="arena-c" data-arena="random" aria-pressed="${S.arenaPick==="random"}" style="--a0:#3A2A70;--a1:#120C24;--an:#F5EFFF"><b>Ngẫu nhiên</b><small>Mỗi hiệp một sàn khác</small></button>${ARENAS.map(a=>`<button class="arena-c" data-arena="${a.id}" aria-pressed="${S.arenaPick===a.id}" style="--a0:${a.swatch[0]};--a1:${a.swatch[1]};--an:${a.neon}"><b>${a.name}</b><small>${a.desc}</small></button>`).join("")}</div></section>
  ${levelsHTML()}
  <div class="marquee" aria-hidden="true"><div class="trk">${names}${names}</div></div>
  <section class="stats">
    <div class="stat rv"><span class="idx">Thắng</span><b data-count="${S.w}">0</b></div>
    <div class="stat rv" style="animation-delay:.08s"><span class="idx">Thua</span><b data-count="${S.l}">0</b></div>
    <div class="stat rv" style="animation-delay:.16s"><span class="idx">Tỉ lệ thắng</span><b data-count="${total?Math.round(S.w/total*100):0}" data-suf="%">0</b></div>
    <div class="stat rv" style="animation-delay:.24s"><span class="idx">Bộ sưu tập</span><b data-count="${ownedCount()}" data-suf="/${BALLS.length}">0</b></div>
  </section>
  <section class="how">
    <div class="rv"><span class="idx"><b>(01)</b></span><h3>Chọn bóng</h3><p>3 lựa chọn mỗi hiệp. Không ưng thì đổi bộ khác với ${REROLL_COST} Gems. Bot không bao giờ chọn trùng bóng với bạn.</p></div>
    <div class="rv" style="animation-delay:.08s"><span class="idx"><b>(02)</b></span><h3>Xem bóng va</h3><p>Cứ 10 giây có một hộp bí ẩn rơi xuống. Bấm vào hộp để lái bóng tới giành, cẩn thận hộp bẫy. Nhấn Space để Dồn lực.</p></div>
    <div class="rv" style="animation-delay:.16s"><span class="idx"><b>(03)</b></span><h3>Mở rương</h3><p>Bóng càng hiếm kỹ năng càng điên. Mở trùng thì bóng lên cấp, mỗi cấp mạnh thêm 6%.</p></div>
  </section></div>`;
}
let colFilter="all";
function viewCollection(){
  const list=BALLS.filter(b=>colFilter==="all"||(colFilter==="owned"?S.owned[b.id]:b.rar===colFilter));
  const cnt=r=>BALLS.filter(b=>b.rar===r&&S.owned[b.id]).length+"/"+BALLS.filter(b=>b.rar===r).length;
  return`<div class="view"><div class="head"><div><span class="idx rv"><b>(02)</b> — ${ownedCount()} / ${BALLS.length} đã mở</span><h2 class="rv">BỘ <em>SƯU TẬP</em></h2></div>
  <div class="chips rv">${["all","owned",...RARS].map(r=>`<button class="chip" data-filter="${r}" aria-pressed="${colFilter===r}">${r==="all"?"Tất cả":r==="owned"?"Đã có":`<i style="background:var(--r-${r})"></i>${RAR_VN[r]} <span class="num" style="opacity:.6">${cnt(r)}</span>`}</button>`).join("")}</div></div>
  <div class="grid">${list.map((b,i)=>{const lv=S.owned[b.id];return`<button class="card tilt rv ${lv?"":"locked"}" data-r="${b.rar}" data-ball="${b.id}" style="animation-delay:${Math.min(i,20)*.025}s">
    <div class="row">${orbHTML(b,!lv)}<span class="lv ${lv?"on":""}">${lv?`LV ${lv} · ×${copiesOf(b.id)}`:"KHOÁ"}</span></div>
    <h3>${b.name}</h3>${rarPill(b.rar)}<span class="ab">${b.ab.name}</span></button>`}).join("")}</div></div>`;
}
function viewCrates(){
  return`<div class="view"><div class="head"><div><span class="idx rv"><b>(03)</b> — Bảo đảm độ hiếm sau N lần mở</span><h2 class="rv">MỞ <em>RƯƠNG</em></h2></div></div>
  <div class="crates">${Object.entries(CRATES).map(([k,c],i)=>{const p=S.pity[k]||0,ic=c.cur==="coins"?"coin":"gem";return`<div class="crate rv" style="--cc:${c.color};animation-delay:${i*.1}s">
    <div class="crate-art"><div class="box"></div></div>
    <div><h3>${c.name}</h3><p style="color:var(--muted);font-size:14px;margin-top:6px">${c.desc}</p></div>
    <ul class="rates">${RARS.filter(r=>c.rates[r]).map(r=>`<li><span class="dot" style="background:var(--r-${r});box-shadow:0 0 8px var(--r-${r})"></span><span>${RAR_VN[r]}</span><span>${c.rates[r]}%</span></li>`).join("")}</ul>
    <div class="pity"><span>Bảo đảm ${RAR_VN[c.pity.min]}+ trong ${c.pity.n} lần · còn <b class="num" style="color:var(--text)">${c.pity.n-p}</b></span><div class="bar"><i style="width:${p/c.pity.n*100}%"></i></div></div>
    <div class="btns"><button class="btn btn-main mag" data-open="${k}" data-n="1" ${S[c.cur]>=c.cost?"":"disabled"}>×1 <span class="cost"><span class="${ic}"></span>${fmt(c.cost)}</span></button>
    <button class="btn btn-ghost mag" data-open="${k}" data-n="5" ${S[c.cur]>=c.cost*5?"":"disabled"}>×5 <span class="cost"><span class="${ic}"></span>${fmt(c.cost*5)}</span></button></div>
  </div>`}).join("")}</div></div>`;
}
function viewCodes(){
  return`<div class="view"><div class="head"><div><span class="idx rv"><b>(04)</b> — Quà &amp; cài đặt</span><h2 class="rv">NHẬP <em>CODE</em></h2></div></div>
  <div class="two">
  <div class="panel rv"><span class="idx">Đổi quà</span><h2>Có mã? Dán vào đây.</h2>
    <form class="code-box" id="codeForm"><input id="codeInput" autocomplete="off" placeholder="VD: WELCOME" maxlength="4000" aria-label="Mã code"><button class="btn btn-main mag" type="submit">Đổi</button></form>
    <p class="msg" id="codeMsg"></p>
    <p style="color:var(--muted);font-size:13px">Đã dùng: ${S.codes.filter(c=>c[0]!=="#").length?S.codes.filter(c=>c[0]!=="#").map(esc).join(", "):"chưa có"}. Gợi ý: WELCOME, ORBCLASH, LUCKYORB, NEONRUSH.</p></div>
  <div class="panel rv" style="animation-delay:.1s"><span class="idx">Dữ liệu</span><h2>Tiến trình lưu trong trình duyệt.</h2>
    <p style="color:var(--muted)">Xoá dữ liệu trình duyệt hoặc chơi ở cửa sổ ẩn danh sẽ mất tiến trình. Bắt đầu lại sẽ đưa bạn về 2.000 xu, 5 bóng khởi đầu, xoá tiến trình Leo tháp và Vô tận.</p>
    <div class="backup"><span class="idx"><b>Sao lưu</b> · chuyển sang máy khác hoặc phòng mất dữ liệu</span>
      <div class="bk-row"><button class="btn btn-main mag" id="bkCopy">Sao chép mã lưu</button><label class="btn btn-ghost mag" for="bkFile">Nạp từ file .txt</label><input type="file" id="bkFile" accept=".txt,text/plain" hidden></div>
      <textarea id="bkText" rows="3" placeholder="Dán mã lưu (bắt đầu bằng OC1:) vào đây để khôi phục" spellcheck="false"></textarea>
      <div class="bk-row"><button class="btn btn-ghost mag" id="bkLoad">Khôi phục từ mã</button><span class="msg" id="bkMsg"></span></div></div>
    <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-main mag" id="gfxOpen">Cài đặt đồ hoạ</button><button class="btn btn-ghost mag" id="resetBtn">Chơi lại từ đầu</button></div><p class="author">Tác giả <b>Trần Đức Long</b> · GitHub: <a href="https://github.com/Kokonut-Original" target="_blank" rel="noopener">Kokonut-Original</a></p></div>
  </div></div>${adminLoginHTML()}`;
}
function countUp(root){root.querySelectorAll("[data-count]").forEach(el=>{const to=+el.dataset.count,suf=el.dataset.suf||"",t0=performance.now();(function f(){const k=Math.min(1,(performance.now()-t0)/1100);el.textContent=Math.round(to*(1-Math.pow(1-k,4)))+suf;if(k<1)requestAnimationFrame(f)})()})}
function bindTab(){
  const m=$("#main");countUp(m);if(tab==="merge")bindMerge();
  $$("[data-diff]").forEach(b=>b.onclick=()=>{S.diff=b.dataset.diff;save();$$("[data-diff]").forEach(x=>x.setAttribute("aria-pressed",x===b));sfx.click()});
  const st=$("#startBtn");if(st)st.onclick=()=>{sfx.click();startMatch()};
  const gt=$("#goTower");if(gt)gt.onclick=()=>{sfx.click();openTower()};
  const ge=$("#goEndless");if(ge)ge.onclick=()=>{sfx.click();openEndless()};
  $$("[data-arena]").forEach(b=>b.onclick=()=>{S.arenaPick=b.dataset.arena;save();$$("[data-arena]").forEach(x=>x.setAttribute("aria-pressed",x===b));sfx.click()});
  const gx=$("#gfxOpen");if(gx)gx.onclick=openSettings;
  const gc=$("#goCrates");if(gc)gc.onclick=()=>$('.tab[data-tab="crates"]').click();
  $$("[data-filter]").forEach(b=>b.onclick=()=>{colFilter=b.dataset.filter;renderTab()});
  $$("[data-ball]").forEach(b=>b.onclick=()=>showBall(b.dataset.ball));
  $$("[data-open]").forEach(b=>b.onclick=()=>openCrate(b.dataset.open,+b.dataset.n));
  const f=$("#codeForm");if(f)f.onsubmit=e=>{e.preventDefault();redeem($("#codeInput").value)};
  if($("#bkCopy"))bindBackup();
  if($("#admForm"))bindAdminLogin();
  $$("[data-lvl]").forEach(b=>b.onclick=()=>{sfx.click();playLevel(S.levels[+b.dataset.lvl])});
  const r=$("#resetBtn");if(r){let armed=false;r.onclick=()=>{if(!armed){armed=true;r.textContent="Bấm lần nữa để xoá hết";setTimeout(()=>{armed=false;r.textContent="Chơi lại từ đầu"},3000);return}const g0=S.gfx;S=fresh();S.gfx=g0;save();updateWallet();renderMute();renderTab();toast("Đã đặt lại. Bạn có 2.000 xu để bắt đầu.")}}
}
function redeem(raw){
  const code=String(raw||"").trim().toUpperCase(),msg=$("#codeMsg");
  if(!code){msg.className="msg err";msg.textContent="Hãy nhập một mã.";return}
  const g=CODES[code];
  if(!g&&tryRedeemSpecial(String(raw).trim(),msg))return;
  if(!g){msg.className="msg err";msg.textContent="Mã không đúng. Kiểm tra lại chính tả.";return}
  if(S.codes.includes(code)){msg.className="msg err";msg.textContent="Mã này bạn đã dùng rồi.";return}
  S.codes.push(code);S.coins+=g.coins||0;S.gems+=g.gems||0;save();updateWallet();sfx.coin();flashbang("#C3AEFF");
  const r=$("#codeInput").getBoundingClientRect();confettiBurst(r.left+r.width/2,r.top,80,["#36E2FF","#FF4D7A","#FFC23D","#C3AEFF"]);
  renderTab();const m2=$("#codeMsg");m2.className="msg ok";m2.textContent=`Đã nhận ${g.coins?fmt(g.coins)+" xu":""}${g.coins&&g.gems?" và ":""}${g.gems?g.gems+" Gems":""}.`;
}

/* — Showcase quỹ đạo — */
let showRaf=0;
function startShowcase(){
  const c=$("#show");if(!c)return;const g=c.getContext("2d");
  const ids=Object.keys(S.owned).sort((a,b)=>RARS.indexOf(BY_ID[b].rar)-RARS.indexOf(BY_ID[a].rar)||S.owned[b]-S.owned[a]).slice(0,9);
  $("#bestName").textContent=ids.length?BY_ID[ids[0]].name:"—";
  const fit=()=>{const r=c.getBoundingClientRect(),d=Math.min(2,devicePixelRatio||1);c.width=r.width*d;c.height=r.height*d;g.setTransform(d,0,0,d,0,0)};fit();
  const t0=performance.now();
  (function f(ts){showRaf=requestAnimationFrame(f);const t=(ts-t0)/1000,w=c.clientWidth,h=c.clientHeight,cx=w/2+(mouseX-.5)*30,cy=h/2+(mouseY-.5)*20;g.clearRect(0,0,w,h);
    const R=Math.min(w,h)*.36;
    const items=ids.map((id,i)=>{const a=t*.5+i*TAU/ids.length,z=Math.sin(a);return{d:BY_ID[id],x:cx+Math.cos(a)*R*1.25,y:cy+z*R*.42,z}}).sort((p,q)=>p.z-q.z);
    g.strokeStyle="rgba(195,174,255,.18)";g.lineWidth=1;g.beginPath();g.ellipse(cx,cy,R*1.25,R*.42,0,0,TAU);g.stroke();
    const core=g.createRadialGradient(cx,cy,0,cx,cy,R*.7);core.addColorStop(0,"rgba(195,174,255,.35)");core.addColorStop(1,"rgba(195,174,255,0)");g.fillStyle=core;g.beginPath();g.arc(cx,cy,R*.7,0,TAU);g.fill();
    for(const p of items){const s=.6+(p.z+1)*.35,r=24*s,col=p.d.color;
      g.globalCompositeOperation="lighter";g.globalAlpha=.6*s;g.drawImage(glowSprite(col),p.x-r*2.6,p.y-r*2.6,r*5.2,r*5.2);g.globalCompositeOperation="source-over";g.globalAlpha=.5+.5*s;
      if(hasSkin(p.d))drawCreature(g,p.d,p.x,p.y,r,{t:performance.now()/1000,id:p.d.mono.charCodeAt(0),gx:Math.cos(p.a||1),gy:Math.sin(p.a||1)});else{
      const gr=g.createRadialGradient(p.x-r*.35,p.y-r*.4,r*.05,p.x,p.y,r);gr.addColorStop(0,"#fff");gr.addColorStop(.2,shade(col,.3));gr.addColorStop(.65,col);gr.addColorStop(1,shade(col,-.6));g.fillStyle=gr;g.beginPath();g.arc(p.x,p.y,r,0,TAU);g.fill();
      drawIcon(g,p.d,p.x,p.y+.5,r)};g.globalAlpha=1}
  })(t0);
}
function stopShowcase(){if(showRaf){cancelAnimationFrame(showRaf);showRaf=0}}

/* — Chi tiết bóng — */
function closeLayer(){$("#layer").innerHTML=""}
function showBall(id){
  const b=BY_ID[id],lv=S.owned[id],sc=lvScale(lv||1);
  const bars=[["Máu",b.hp*sc,190],["Sát thương",b.dmg*sc,16],["Tốc độ",b.spd,290],["Kích thước",b.r,32]];
  $("#layer").innerHTML=`<div class="overlay" id="ov"><div class="sheet" role="dialog" aria-label="${b.name}" style="background:radial-gradient(80% 50% at 20% 0%,${hexA(b.color,.25)},transparent 70%),linear-gradient(180deg,var(--bg2),var(--bg))">
   <div class="sheet-head">${orbHTML(b,!lv)}<div style="display:flex;flex-direction:column;gap:8px">${rarPill(b.rar)}<h2>${b.name}</h2><span class="lv on">${lv?`CẤP ${lv} / ${MAX_LV}`:"CHƯA SỞ HỮU · MỞ RƯƠNG ĐỂ NHẬN"}</span></div></div>
   <div><span class="idx"><b>${b.ab.name}</b> · ${b.ab.cd?`hồi ${b.ab.cd}s`:"nội tại"}</span><p style="margin-top:8px;font-size:16px">${b.ab.desc}</p></div>
   <div class="statbars">${bars.map(([n,v,m])=>`<span>${n}</span><div class="bar"><i style="width:0" data-w="${clamp(v/m*100,4,100)}%"></i></div><span class="num">${Math.round(v)}</span>`).join("")}</div>
   <div class="row-end"><button class="btn btn-ghost mag" id="closeOv">Đóng</button></div></div></div>`;
  requestAnimationFrame(()=>requestAnimationFrame(()=>$$("[data-w]").forEach(e=>e.style.width=e.dataset.w)));
  $("#closeOv").onclick=closeLayer;$("#ov").onclick=e=>{if(e.target.id==="ov")closeLayer()};bindFx($("#layer"));sfx.click();
}

/* ═════════════════════════ GACHA ═════════════════════════ */
function rollRarity(rates,min){
  const ok=RARS.filter(r=>rates[r]&&(!min||RARS.indexOf(r)>=RARS.indexOf(min)));
  let x=Math.random()*ok.reduce((a,r)=>a+rates[r],0);for(const r of ok){x-=rates[r];if(x<=0)return r}return ok[ok.length-1];
}
function rollCrate(k){
  const c=CRATES[k];S.pity[k]=(S.pity[k]||0)+1;
  const rar=rollRarity(c.rates,S.pity[k]>=c.pity.n?c.pity.min:null);
  if(RARS.indexOf(rar)>=RARS.indexOf(c.pity.min))S.pity[k]=0;
  const ball=pick(BALLS.filter(b=>b.rar===rar));
  return{ball,out:grantBall(ball.id)};
}
const RC=r=>getComputedStyle(document.documentElement).getPropertyValue("--r-"+r).trim();
function outLine(o){return o.type==="new"?"BÓNG MỚI!":o.type==="up"?`LÊN CẤP ${o.from} → ${o.to} · ×${o.copies} BẢN`:`CẤP TỐI ĐA · ×${o.copies} BẢN`}
function openCrate(k,n=1){
  const c=CRATES[k],cost=c.cost*n;
  if(S[c.cur]<cost){toast(`Chưa đủ ${c.cur==="coins"?"xu":"Gems"}. Thắng trận để kiếm thêm.`);return}
  S[c.cur]-=cost;const res=[];for(let i=0;i<n;i++)res.push(rollCrate(k));save();updateWallet();
  const top=res.reduce((a,r)=>RARS.indexOf(r.ball.rar)>RARS.indexOf(a.ball.rar)?r:a,res[0]);
  $("#layer").innerHTML=`<div class="overlay"><div class="gacha" id="gacha"><div class="shake-box" id="sbox" style="--cc:${c.color}"><div class="box" style="--cc:${c.color}"></div></div><span class="idx">Đang mở ${c.name}${n>1?" ×"+n:""}…</span></div></div>`;
  sfx.whoosh();let tk=0;const ti=setInterval(()=>{tk++;sfx.tick();if(tk===7)$("#sbox").classList.add("hard")},110);
  setTimeout(()=>{clearInterval(ti);const col=RC(top.ball.rar);flashbang(col);if(RARS.indexOf(top.ball.rar)>=3)quake();n===1?runReel(k,res[0]):runMulti(k,res,n)},REDUCED?100:1000);
}
function runReel(k,res){
  const c=CRATES[k],items=[];
  for(let i=0;i<46;i++){if(i===38){items.push(res.ball);continue}const rr=rollRarity(c.rates);items.push(pick(BALLS.filter(b=>b.rar===rr)))}
  $("#gacha").innerHTML=`<div class="reel"><div class="marker"></div><div class="strip" id="strip">${items.map(b=>`<div class="ri" style="--rc:${RC(b.rar)}">${orbHTML(b)}<span>${b.name}</span></div>`).join("")}</div></div><div id="revealBox" style="width:100%;display:flex;justify-content:center"></div>`;
  const strip=$("#strip"),reel=strip.parentElement,itemW=130,target=38*itemW+60-reel.clientWidth/2+rand(-40,40),dur=REDUCED?.2:4.4;
  strip.style.transform="translateX(0)";
  requestAnimationFrame(()=>requestAnimationFrame(()=>{strip.style.transition=`transform ${dur}s cubic-bezier(.08,.7,.1,1)`;strip.style.transform=`translateX(${-target}px)`}));
  let last=0;const tt=setInterval(()=>{const m=new DOMMatrixReadOnly(getComputedStyle(strip).transform);const i=Math.floor((-m.m41+reel.clientWidth/2)/itemW);if(i!==last){last=i;sfx.tick()}},25);
  setTimeout(()=>{clearInterval(tt);reveal(k,res,1)},dur*1000+200);
}
function reveal(k,{ball,out},n){
  const rc=RC(ball.rar),c=CRATES[k],hi=RARS.indexOf(ball.rar)>=3;
  $("#revealBox").innerHTML=`<div class="sheet reveal" style="--rc:${rc}"><div class="rays"></div>
    <span class="banner">${hi?RAR_VN[ball.rar]+"!!":outLine(out)}</span>${orbHTML(ball)}${rarPill(ball.rar)}<h2>${ball.name}</h2>
    <p style="color:var(--muted)">${hi?outLine(out)+" · ":""}<b style="color:var(--text)">${ball.ab.name}:</b> ${ball.ab.desc}</p>
    <div class="row-end" style="justify-content:center"><button class="btn btn-ghost mag" id="rvClose">Xong</button><button class="btn btn-main mag" id="rvAgain" ${S[c.cur]>=c.cost*n?"":"disabled"}>Mở tiếp ×${n} <span class="cost"><span class="${c.cur==="coins"?"coin":"gem"}"></span>${fmt(c.cost*n)}</span></button></div></div>`;
  sfx.reveal(ball.rar);flashbang(rc);
  confettiBurst(innerWidth/2,innerHeight*.45,[30,50,80,140,220][RARS.indexOf(ball.rar)],[rc,"#ffffff","#FFC23D",rc]);
  if(hi){quake();setTimeout(()=>confettiBurst(innerWidth*.2,innerHeight*.7,80,[rc,"#fff"]),250);setTimeout(()=>confettiBurst(innerWidth*.8,innerHeight*.7,80,[rc,"#fff"]),400)}
  $("#rvClose").onclick=()=>{closeLayer();renderTab()};$("#rvAgain").onclick=()=>openCrate(k,n);bindFx($("#layer"));
}
function runMulti(k,res,n){
  const c=CRATES[k];
  $("#gacha").innerHTML=`<span class="banner">${n} QUẢ BÓNG</span><div class="multi">${res.map((r,i)=>`<div class="flip" id="fl${i}" style="animation-delay:${i*.08}s"><div class="flip-in"><div class="face back">?</div><div class="face front" style="--rc:${RC(r.ball.rar)}">${orbHTML(r.ball)}<b>${r.ball.name}</b>${rarPill(r.ball.rar)}<small>${outLine(r.out)}</small></div></div></div>`).join("")}</div>
   <div class="row-end" style="justify-content:center" id="mBtns" hidden><button class="btn btn-ghost mag" id="rvClose">Xong</button><button class="btn btn-main mag" id="rvAgain" ${S[c.cur]>=c.cost*n?"":"disabled"}>Mở tiếp ×${n}</button></div>`;
  const order=res.map((r,i)=>i).sort((a,b)=>RARS.indexOf(res[a].ball.rar)-RARS.indexOf(res[b].ball.rar));
  order.forEach((i,j)=>setTimeout(()=>{const el=$("#fl"+i);if(!el)return;el.classList.add("open");const r=res[i],rr=RARS.indexOf(r.ball.rar);sfx.reveal(r.ball.rar);const b=el.getBoundingClientRect();confettiBurst(b.left+b.width/2,b.top+b.height/2,[10,18,30,70,120][rr],[RC(r.ball.rar),"#fff"]);if(rr>=3){flashbang(RC(r.ball.rar));quake()}
    if(j===order.length-1){$("#mBtns").hidden=false;$("#rvClose").onclick=()=>{closeLayer();renderTab()};$("#rvAgain").onclick=()=>openCrate(k,n);bindFx($("#gacha"))}},700+j*(j===order.length-1?700:420)));
}

/* ═════════════════════════ ĐIỀU PHỐI TRẬN ═════════════════════════ */
let M=null,raf=0,lastT=0,speed=1,acc=0;
function fillFighter(el,def,lv){
  const o=el.querySelector(".orb");o.style.setProperty("--c",def.color);if(hasSkin(def)){o.className=`orb sk r-${def.rar}`;o.innerHTML=`<img src="${skinURL(def)}" alt="">`}else{o.className=`orb r-${def.rar}${lum(def.color)>.7?" light":""}`;o.innerHTML=`<span>${iconSVG(def)}</span>`}
  el.querySelector(".who small").textContent=`${def.name} · LV ${lv}`;el.querySelector(".abt").textContent=def.ab.name;
  el.querySelector(".combo").classList.remove("on");
}
let hudT=0;const lastCombo=[0,0];
function updateHUD(){
  const now=performance.now();if(now-hudT<50)return;hudT=now;
  [["#fP",0],["#fB",1]].forEach(([s,i])=>{let m=G.mains[i];if(i===1&&(G.horde||G.ffa)){const us=G.ffa?G.mains.filter(o=>o.alive&&o.side!==0):G.balls.filter(o=>o.alive&&o.side===1&&(o.kind==="main"||o.kind==="unit"));m={hp:us.reduce((a,u)=>a+u.hp,0),max:G.hordeMax||1,st:{},cd:0,def:m.def,mem:{}};$("#fB .who small").textContent=`Còn ${us.length} kẻ địch`}const el=$(s),p=clamp(m.hp/m.max,0,1)*100+"%";
    el.querySelector(".hp i").style.width=p;el.querySelector(".hp em").style.width=p;el.querySelector(".hp s").style.width=clamp((m.st.shield||0)/m.max,0,1)*100+"%";
    el.querySelector(".hpt").textContent=`${Math.ceil(m.hp)} / ${Math.round(m.max)}`;
    const ab=abOf(m);el.querySelector(".cdr").style.setProperty("--p",ab.cd?clamp(1-m.cd/ab.cd,0,1):1);
    if(m.abSrc&&!el.dataset.mim){el.dataset.mim=1;el.querySelector(".abt").textContent="Chép: "+m.abSrc.name}
    if(G.hurt[i]){G.hurt[i]=0;el.classList.remove("hit");void el.offsetWidth;el.classList.add("hit")}
    const c=G.combo[i],cb=el.querySelector(".combo"),on=c.n>=2&&G.t-c.t<1.8;cb.classList.toggle("on",on);if(on&&c.n!==lastCombo[i]){cb.textContent=`×${c.n} COMBO`;cb.classList.remove("pop");void cb.offsetWidth;cb.classList.add("pop")}lastCombo[i]=c.n});
  if(G.boss){const b=G.boss,p=clamp(b.hp/b.max,0,1)*100+"%",bb=$("#bossBar");bb.querySelector("i").style.width=p;bb.querySelector("em").style.width=p;bb.classList.toggle("p2",!!b.mem.p2)}
  const left=G.ot-G.t,t=$("#timer");
  if(left>0){const s=Math.ceil(left);t.textContent=`${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;t.classList.toggle("hot",s<=10)}else{t.textContent="SÀN CO LẠI";t.classList.add("hot")}
}
function renderPips(){const p=$("#pips");let h="";if(M&&M.mode==="tower"){const r=S.tower.run||{hearts:0};p.innerHTML=`<span class="pip-t">T${M.floor}</span>`+[0,1,2].map(i=>`<b class="hrt ${i<r.hearts?"on":""}">♥</b>`).join("");return}if(M&&M.mode==="endless"){p.innerHTML=`<span class="pip-t">VÒNG ${M.round}</span>`;return}for(let i=0;i<2;i++)h+=`<i class="${i<M.score[0]?"p":""}"></i>`;h+=`<span style="width:6px"></span>`;for(let i=0;i<2;i++)h+=`<i class="${i<M.score[1]?"b":""}"></i>`;p.innerHTML=h}
function loop(ts){
  raf=requestAnimationFrame(loop);
  let dt=clamp((ts-lastT)/1000||0,0,.05);lastT=ts;
  if(G.count>0){const before=Math.ceil(G.count-.6);G.count-=dt;const now=Math.ceil(G.count-.6);if(now!==before&&now>=0)sfx.count(now);if(G.count<=0){G.go=.9;G.shake=14;G.screen=.35;sfx.boom(true)}stepFx(dt)}
  else{
    let k=speed;if(G.stop>0){G.stop-=dt;k*=.06}if(G.slowT>0){G.slowT-=dt;k*=G.slowK}
    acc+=dt*k;let n=0;while(acc>=DT&&n<40){acc-=DT;step(DT);n++}
    stepFx(dt*Math.min(1,k));
    if(G.over){G.endT+=dt;if(G.endT>2.4){cancelAnimationFrame(raf);raf=0;(M.onEnd||roundEnd)(G.winner);return}}
  }
  render();updateHUD();
  if(S.gfx.fps){fpsN++;if(ts-fpsT>500){$("#fps").textContent=Math.round(fpsN*1000/(ts-fpsT))+" FPS";fpsN=0;fpsT=ts}}
}
let fpsN=0,fpsT=0;
function startMatch(){
  M={mode:"quick",diff:S.diff,round:1,score:[0,0],botUsed:[]};
  const d=DIFF[M.diff];M.botLv=clamp(Math.round(d.lv<-50?1:avgLevel()+d.lv),1,MAX_LV);
  $("#match").hidden=false;auOn=false;stopShowcase();speed=1;$("#speedBtn").textContent="Tốc độ 1×";fitCanvas();renderPips();
  ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle="#08060F";ctx.fillRect(0,0,cv.width,cv.height);
  bindFx($("#match"));openDraft();
}
function draftOptions(){const ids=Object.keys(S.owned),pool=[...ids],out=[];while(out.length<3&&pool.length)out.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0]);while(out.length<3)out.push(pick(ids));return out}
/** Bot chọn bóng: không trùng bóng người chơi đang dùng, không lặp lại bóng nó đã dùng trong trận. */
function botChoice(playerId){
  const d=DIFF[M.diff];
  let pool=BALLS.filter(b=>d.pool.includes(b.rar)&&b.id!==playerId&&!M.botUsed.includes(b.id));
  if(!pool.length)pool=BALLS.filter(b=>d.pool.includes(b.rar)&&b.id!==playerId);
  let best=pick(pool);
  if(M.diff==="hard"){for(let i=0;i<2;i++){const c=pick(pool);if(RARS.indexOf(c.rar)>RARS.indexOf(best.rar))best=c}}
  M.botUsed.push(best.id);return best;
}
function openDraft(){
  M.options=draftOptions();
  const html=()=>`<div class="overlay"><div class="draft">
    <div class="head"><div><span class="idx"><b>(HIỆP ${String(M.round).padStart(2,"0")})</b> — Bạn ${M.score[0]} : ${M.score[1]} Bot · Bot cấp ${M.botLv}</span><h2>CHỌN <em>BÓNG</em></h2></div></div>
    <div class="picks">${M.options.map(id=>{const b=BY_ID[id],lv=S.owned[id],sc=lvScale(lv);return`<button class="pick" data-r="${b.rar}" data-pick="${id}">${orbHTML(b)}<div class="body"><h3>${b.name}</h3><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">${rarPill(b.rar)}<span class="lv on">LV ${lv}</span></div>
      <div class="mini"><span>HP <b>${Math.round(b.hp*sc)}</b></span><span>ST <b>${Math.round(b.dmg*sc)}</b></span><span>TỐC <b>${b.spd}</b></span></div><p><b>${b.ab.name}.</b> ${b.ab.desc}</p></div></button>`}).join("")}</div>
    <div class="dfoot"><button class="btn btn-ghost mag" id="rerollBtn" ${S.gems>=REROLL_COST?"":"disabled"}>Đổi bộ khác <span class="cost"><span class="gem"></span>${REROLL_COST}</span></button><span class="idx">Bạn có ${S.gems} Gems</span></div>
  </div></div>`;
  const bind=()=>{$$("[data-pick]").forEach(b=>b.onclick=()=>{sfx.click();lockPick(b.dataset.pick)});
    $("#rerollBtn").onclick=()=>{if(S.gems<REROLL_COST)return;S.gems-=REROLL_COST;save();updateWallet();sfx.whoosh();M.options=draftOptions();$("#layer").innerHTML=html();bind()};bindFx($("#layer"))};
  $("#layer").innerHTML=html();bind();
}
function lockPick(id){
  const p=BY_ID[id],b=botChoice(id);M.pId=id;M.bDef=b;M.arena=S.arenaPick==="random"||!ARENA_BY[S.arenaPick]?pick(ARENA_IDS):S.arenaPick;
  $("#layer").innerHTML=`<div class="overlay"><div class="vs">
    <div class="side">${orbHTML(p)}<b>${p.name}</b>${rarPill(p.rar)}<span class="idx">BẠN · LV ${S.owned[id]}</span></div><span class="x">VS</span>
    <div class="side">${orbHTML(b)}<b>${b.name}</b>${rarPill(b.rar)}<span class="idx">BOT · LV ${M.botLv}</span></div><div class="vs-arena chip">${arenaTag(M.arena)}</div></div></div>`;
  sfx.whoosh();setTimeout(()=>{sfx.boom(true);flashbang("#ffffff")},300);
  const cur=M;setTimeout(()=>{if(M!==cur||M.ended)return;closeLayer();beginRound()},1700);
}
function beginRound(){
  const lv=S.owned[M.pId];
  newFight(BY_ID[M.pId],lv,M.bDef,M.botLv);setArena(M.arena);$("#bossBar").hidden=true;setTimeout(renderDbgBar,0);
  delete $("#fP").dataset.mim;delete $("#fB").dataset.mim;
  fillFighter($("#fP"),BY_ID[M.pId],lv);fillFighter($("#fB"),M.bDef,M.botLv);
  setOD(1);
  lastT=performance.now();acc=0;if(!raf)raf=requestAnimationFrame(loop);
}
function roundEnd(w){
  if(w===0)M.score[0]++;else if(w===1)M.score[1]++;
  renderPips();
  if(M.score[0]>=2||M.score[1]>=2||M.round>=5){endMatch();return}
  M.round++;const cur=M;setTimeout(()=>{if(M===cur&&!M.ended)openDraft()},250);
}
function endMatch(surrender=false){
  if(M.ended)return;M.ended=true;
  if(raf){cancelAnimationFrame(raf);raf=0}
  const win=!surrender&&M.score[0]>M.score[1],draw=!surrender&&M.score[0]===M.score[1],d=DIFF[M.diff];
  let coins=0,gems=0;
  if(win){coins=Math.round(150*d.mult);gems=Math.max(1,Math.round(4*d.mult));S.w++}
  else if(draw)coins=Math.round(60*d.mult);
  else{coins=surrender?0:Math.round(30*d.mult);S.l++}
  coins=Math.round(coins*TUNEX.coin);gems=Math.round(gems*TUNEX.gem);S.coins+=coins;S.gems+=gems;save();updateWallet();if(coins)sfx.coin();
  $("#layer").innerHTML=`<div class="overlay"><div class="sheet result ${win?"win":""}">
    <span class="idx">${surrender?"Bạn đã đầu hàng":`Tỉ số ${M.score[0]} : ${M.score[1]} · Độ khó ${d.name}`}</span><h2>${win?"CHIẾN THẮNG":draw?"HOÀ":"THẤT BẠI"}</h2>
    <div class="rewards">${coins?`<span class="chip-cur"><span class="coin"></span>+${fmt(coins)}</span>`:""}${gems?`<span class="chip-cur" style="animation-delay:.15s"><span class="gem"></span>+${gems}</span>`:""}${!coins&&!gems?`<span style="color:var(--muted)">Không có phần thưởng</span>`:""}</div>
    <div class="row-end" style="justify-content:center"><button class="btn btn-ghost mag" id="toLobby">Về sảnh</button><button class="btn btn-main mag" id="again">Đấu tiếp ⟶</button></div></div></div>`;
  if(win){confettiBurst(innerWidth/2,innerHeight*.5,180,["#36E2FF","#FF4D7A","#FFC23D","#5CF2A8","#C3AEFF"]);flashbang("#FFC23D")}
  $("#toLobby").onclick=backToLobby;
  $("#again").onclick=()=>{closeLayer();startMatch()};bindFx($("#layer"));
}
$("#odBtn").onclick=()=>{if(!G||G.pODn<=0||G.count>0||G.over)return;G.pODn--;overdrive(G.mains[0]);setOD(G.pODn)};
$("#arena").addEventListener("pointerdown",e=>{if(tapBox(e))return;if(e.pointerType!=="mouse")$("#odBtn").click()});
$("#gfxBtn").onclick=openSettings;$("#gfxBtn2").onclick=openSettings;
$("#speedBtn").onclick=()=>{speed=speed===1?2:speed===2?3:1;$("#speedBtn").textContent=`Tốc độ ${speed}×`;sfx.click()};
{let armed=false;$("#quitBtn").onclick=()=>{const b=$("#quitBtn");if(!armed){armed=true;b.textContent="Bấm lần nữa";setTimeout(()=>{armed=false;b.textContent="Đầu hàng"},2500);return}armed=false;b.textContent="Đầu hàng";closeLayer();if(M&&M.onQuit)M.onQuit();else endMatch(true)}}
document.addEventListener("keydown",e=>{
  if(!$("#match").hidden&&e.code==="Space"&&!e.target.closest("input")){e.preventDefault();$("#odBtn").click()}
  if(e.key==="Escape"){if($("#gfxOv"))$("#gfxOv").remove();else if($("#ov"))closeLayer()}
});
document.addEventListener("visibilitychange",()=>{lastT=performance.now()});

/* ═════════════════════════ KHỞI ĐỘNG ═════════════════════════ */
(function boot(){
  updateWallet();renderMute();$("#fps").hidden=!S.gfx.fps;
  const ld=$("#loader"),n=$("#ldn"),bar=$("#ldb"),cap=$("#ldt");
  const msgs=["Đang bơm khí cho 126 quả bóng…","Đang dựng 9 sàn đấu…","Đang đánh thức 5 boss…","Đang xếp tháp 25 tầng…","Sẵn sàng va chạm."];
  const dur=REDUCED?200:1500,t0=performance.now();
  (function f(){const k=Math.min(1,(performance.now()-t0)/dur),e=1-Math.pow(1-k,2.2),v=Math.round(e*100);n.textContent=String(v).padStart(3,"0");bar.style.width=v+"%";cap.textContent=msgs[Math.min(msgs.length-1,Math.floor(e*msgs.length))];
    if(k<1)requestAnimationFrame(f);else setTimeout(()=>{ld.classList.add("done");renderTab();setTimeout(()=>ld.remove(),1000)},220)})();
})();

/* ═════════════════════════ SAO LƯU / KHÔI PHỤC ═════════════════════════ */
function exportCode(){const j=JSON.stringify(S);let h=0;for(let i=0;i<j.length;i++)h=(h*31+j.charCodeAt(i))|0;return"OC1:"+btoa(unescape(encodeURIComponent(j)))+"."+(h>>>0).toString(36)}
function importCode(code){
  code=String(code||"").trim().replace(/\s+/g,"");if(!code.startsWith("OC1:"))throw new Error("Mã phải bắt đầu bằng OC1:");
  const [body,sum]=code.slice(4).split(".");const j=decodeURIComponent(escape(atob(body)));let h=0;for(let i=0;i<j.length;i++)h=(h*31+j.charCodeAt(i))|0;
  if(sum&&(h>>>0).toString(36)!==sum)throw new Error("Mã bị thiếu hoặc sai một vài ký tự.");
  const s=JSON.parse(j);if(!s||typeof s.owned!=="object")throw new Error("Mã không chứa dữ liệu game.");return s;
}
function bindBackup(){
  const msg=(t,ok)=>{const m=$("#bkMsg");m.className="msg "+(ok?"ok":"err");m.textContent=t};
  $("#bkCopy").onclick=async()=>{const c=exportCode();const ta=$("#bkText");ta.value=c;
    try{await navigator.clipboard.writeText(c);msg("Đã sao chép. Dán vào ghi chú hoặc gửi sang máy khác.",true)}catch(e){ta.focus();ta.select();msg("Mã đã hiện trong ô, hãy bôi đen và sao chép.",true)}sfx.coin()};
  $("#bkFile").onchange=e=>{const f=e.target.files[0];if(!f)return;const rd=new FileReader();rd.onload=()=>{$("#bkText").value=String(rd.result).trim();msg("Đã đọc file. Bấm Khôi phục để nạp.",true)};rd.readAsText(f)};
  let armed=false;$("#bkLoad").onclick=()=>{let s;try{s=importCode($("#bkText").value)}catch(e){msg(e.message||"Mã không hợp lệ.",false);return}
    if(!armed){armed=true;$("#bkLoad").textContent="Bấm lần nữa để ghi đè";msg(`Mã có ${Object.keys(s.owned).length} loại bóng, ${fmt(s.coins||0)} xu, ${fmt(s.gems||0)} Gems. Tiến trình hiện tại sẽ bị thay thế.`,true);setTimeout(()=>{armed=false;const b=$("#bkLoad");if(b)b.textContent="Khôi phục từ mã"},5000);return}
    const f0=fresh();S=Object.assign(f0,s);for(const k of ["tower","endless","gfx"])S[k]=Object.assign(fresh()[k],s[k]||{});S.copies=s.copies||{};for(const id of Object.keys(S.owned)){if(!BY_ID[id])delete S.owned[id];else if(!(S.copies[id]>0))S.copies[id]=S.owned[id]}
    save();FXQ=FXQ_LV[S.gfx.fx]||FXQ_LV.high;updateWallet();renderMute();renderTab();toast("Đã khôi phục tiến trình.");flashbang("#5CF2A8")};
}
