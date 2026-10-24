
/* ═════════════════════════════════════════════════════════════
   BOSS · LÍNH · CHẾ ĐỘ LEO THÁP · CHẾ ĐỘ VÔ TẬN
   ═════════════════════════════════════════════════════════════ */
function phase(b,txt,col,sub){G.banner={txt,sub,t:0,dur:1.8,size:52,c:col,c2:"#FFFFFF"};G.tint={c:col,t:.7};slowmo(.3,.7);G.shake=Math.min(30,G.shake+18);ring(b.x,b.y,b.r,b.r+220,col,.8,8);ripple(b.x,b.y,30);sparkBurst(b.x,b.y,[col,"#ffffff"],60,900);sfx.boom()}
function ringShot(b,n,o){const a0=rand(0,TAU);for(let k=0;k<n;k++)shoot(b,Object.assign({a:a0+k*TAU/n},o))}
function eyes(b,c,col,slit){const a=Math.atan2(b.vy,b.vx),fx=Math.cos(a),fy=Math.sin(a),px=-fy,py=fx;for(const s of [-1,1]){const ex=b.x+fx*b.r*.38+px*s*b.r*.3,ey=b.y+fy*b.r*.38+py*s*b.r*.3;glowAt(ex,ey,14,col,.8);c.fillStyle=col;c.beginPath();c.ellipse(ex,ey,b.r*.13,b.r*.09,a,0,TAU);c.fill();c.fillStyle="#050505";c.beginPath();c.ellipse(ex,ey,slit?b.r*.025:b.r*.05,b.r*.075,a,0,TAU);c.fill()}}
function bossAura(b,col){glowAt(b.x,b.y,b.r*3.2,col,.35+.12*Math.sin(G.t*4))}

/* — lính, rắn con, bóng ma — */
const SAND={id:"sand",name:"Lính cát",mono:"",rar:"common",color:"#D9B26F",hp:30,dmg:5,spd:205,r:12,ab:{name:"Lính cát"}};
const SAND_ARCHER={id:"sandarcher",name:"Cung thủ cát",mono:"",rar:"common",color:"#C98B4A",hp:20,dmg:3,spd:170,r:12,ab:{name:"Bắn cát"}};
const BOOMER={id:"boomer",name:"Chuột nổ",mono:"",rar:"rare",color:"#FF5470",hp:14,dmg:3,spd:255,r:10,ab:{name:"Cảm tử"}};
const SNAKE={id:"snake",name:"Rắn con",mono:"",rar:"epic",color:"#5BE33B",hp:30,dmg:5,spd:245,r:12,ab:{name:"Cắn độc",onHit:(b,t)=>status(t,"poison",3,1.4)}};
function archerAI(u,dt){u.mem.sh=(u.mem.sh??rand(.5,2))-dt;if(u.mem.sh<=0){u.mem.sh=2.1;const t=G.mains[0];if(alive(t))shoot(u,{target:t,spd:430,dmg:u.dmg*1.4,r:4,life:2,lead:.15})}}
function spawnUnit(def,lv,x,y,o={}){const sc=lvScale(lv);const u=makeBall(def,lv,1,x,y,Object.assign({kind:"unit",r:def.r,hp:def.hp*sc*(o.hpMul||1),dmg:def.dmg*sc*(o.dmgMul||1),life:9999},o));u.base=def.spd*(o.spdMul||1);u.mem.ghost=!!def.ab.onHit;if(o.ai)u.ai=o.ai;if(o.kamikaze){u.mem.kamikaze=true;u.mem.kdmg=o.kdmg||9}
  G.balls.push(u);ring(x,y,2,u.r+26,def.color,.45,3);burst(x,y,def.color,8,180,3);return u}
function bossMinion(b,def,o){const m=spawnMinion(b,Object.assign({kind:"clone",r:def.r,hp:def.hp,dmg:def.dmg,life:30},o));m.def=def;m.base=def.spd;m.mem.ghost=true;return m}

/* ═════════════════════════ 5 BOSS ═════════════════════════ */
const BOSSES=[
{floor:5,id:"vipera",boss:true,name:"Vipera",title:"Nữ hoàng Rắn độc",arena:"viper",rar:"mythic",color:"#4CD137",mono:"",hp:260,dmg:5,spd:190,r:40,
 ab:{name:"Nanh độc",takenMult:1.6,cd:2.8,desc:"Phun nanh độc hình quạt, để lại vệt axit. Còn nửa máu thì lột xác, gọi rắn con.",
  update:(b,dt)=>{b.mem.tr=(b.mem.tr||0)-dt;if(b.mem.tr<=0){b.mem.tr=.5;zone(b,{kind:"acid",x:b.x,y:b.y,r:20,life:1.8,dps:1.2,draw:drawAcid})}
    if(!b.mem.p2&&b.hp<b.max*.5){b.mem.p2=true;phase(b,"LỘT XÁC","#7CFF4F","Rắn con trườn ra từ bóng tối");for(let k=0;k<3;k++)bossMinion(b,SNAKE,{life:40})}},
  trigger:b=>{const e=E(b);if(!alive(e))return;const a=angTo(b,e),n=b.mem.p2?7:5;for(let k=0;k<n;k++)shoot(b,{a:a+(k-(n-1)/2)*.2,spd:420,dmg:4,r:6,life:2,onHit:(p,o)=>status(o,"slow",1,.3)})},
  draw:(b,c)=>{bossAura(b,"#7CFF4F");c.save();circle(b.x,b.y,b.r);c.clip();c.translate(b.x,b.y);c.rotate(b.spin*.3);c.strokeStyle="rgba(10,40,10,.45)";c.lineWidth=2;for(let y=-b.r;y<b.r;y+=9)for(let x=-b.r+((y/9|0)%2)*6;x<b.r;x+=12){c.beginPath();c.arc(x,y,6,.2,Math.PI-.2);c.stroke()}c.restore();
    eyes(b,c,"#E8FF5A",true);const a=Math.atan2(b.vy,b.vx);c.fillStyle="#F5F5F5";for(const s of [-1,1]){const bx=b.x+Math.cos(a)*b.r*.82+Math.cos(a+Math.PI/2)*s*b.r*.16,by=b.y+Math.sin(a)*b.r*.82+Math.sin(a+Math.PI/2)*s*b.r*.16;c.beginPath();c.moveTo(bx-Math.cos(a+Math.PI/2)*4,by-Math.sin(a+Math.PI/2)*4);c.lineTo(bx+Math.cos(a)*12,by+Math.sin(a)*12);c.lineTo(bx+Math.cos(a+Math.PI/2)*4,by+Math.sin(a+Math.PI/2)*4);c.fill()}}}},
{floor:10,id:"cryos",boss:true,name:"Cryos",title:"Bạo chúa Băng giá",arena:"glacier",rar:"mythic",color:"#8FE3FF",mono:"",hp:390,dmg:6,spd:195,r:42,
 ab:{name:"Vương miện băng",takenMult:1.6,cd:3,desc:"Bắn vòng mảnh băng, phủ băng lên đầu bạn. Dưới 45% máu thì gọi bão tuyết.",
  trigger:b=>{b.mem.k=(b.mem.k||0)+1;const e=E(b);if(b.mem.k%3===0&&alive(e)){zone(b,{kind:"ice",x:e.x,y:e.y,r:110,life:3.5,dps:3,slow:.55});ring(e.x,e.y,10,110,"#B8F1FF",.5,5)}else ringShot(b,b.mem.p2?16:12,{spd:360,dmg:5,r:5,life:2.4,onHit:(p,o)=>status(o,"slow",1.2,.4)})},
  update:(b,dt)=>{if(!b.mem.p2&&b.hp<b.max*.45){b.mem.p2=true;phase(b,"BÃO TUYẾT","#BFF3FF","Cả sàn đóng băng dần")}
    if(b.mem.p2){const e=E(b);if(alive(e)){status(e,"slow",.2,.22);b.mem.nv=(b.mem.nv??2)-dt;if(b.mem.nv<=0&&dist(b,e)<170+e.r){b.mem.nv=4;status(e,"freeze",1.1);ring(b.x,b.y,b.r,170,"#E8FBFF",.5,6);burst(b.x,b.y,"#E8FBFF",30,400,3)}}if(Math.random()<.4)G.amb.push({x:rand(0,W),y:-5,vx:rand(60,140),vy:rand(160,260),life:3,max:3,s:rand(1,2.5),c:"#FFFFFF"})}},
  draw:(b,c)=>{bossAura(b,"#8FE3FF");c.fillStyle="#E8FBFF";for(let k=0;k<12;k++){const a=k*TAU/12+G.t*.4,l=k%2?10:20;c.beginPath();c.moveTo(b.x+Math.cos(a-.12)*b.r*.95,b.y+Math.sin(a-.12)*b.r*.95);c.lineTo(b.x+Math.cos(a)*(b.r+l),b.y+Math.sin(a)*(b.r+l));c.lineTo(b.x+Math.cos(a+.12)*b.r*.95,b.y+Math.sin(a+.12)*b.r*.95);c.fill()}eyes(b,c,"#2BB8FF",false)}}},
{floor:15,id:"pharaoh",boss:true,name:"Pharaoh",title:"Vua Cát Bất tử",arena:"temple",rar:"mythic",color:"#E9C46A",mono:"",hp:360,dmg:6,spd:185,r:42,
 ab:{name:"Đạo quân cát",takenMult:1.6,cd:4.2,desc:"Triệu hồi lính cát, mở cát lún dưới chân bạn. Dưới nửa máu thì chui vào quan tài vàng.",
  trigger:b=>{b.mem.k=(b.mem.k||0)+1;const e=E(b);if(b.mem.k%2===0&&alive(e)){zone(b,{kind:"hole",x:e.x,y:e.y,r:120,life:3,pull:300,dps:2});floater(b,"CÁT LÚN","od")}else{const n=b.mem.p2?3:2;for(let k=0;k<n;k++)bossMinion(b,SAND,{life:14,hp:22,dmg:3});floater(b,"ĐẠO QUÂN CÁT","od")}},
  update:(b,dt)=>{if(!b.mem.p2&&b.hp<b.max*.5){b.mem.p2=true;phase(b,"QUAN TÀI VÀNG","#FFD36E","Bất tử 2.5 giây, gọi thêm quân");status(b,"invuln",2.5);b.st.shield=30;for(let k=0;k<3;k++)bossMinion(b,SAND,{life:16,hp:22,dmg:3})}},
  draw:(b,c)=>{bossAura(b,"#E9C46A");c.save();circle(b.x,b.y,b.r);c.clip();for(let k=-6;k<6;k++){c.fillStyle=k%2?"rgba(30,60,140,.55)":"rgba(255,215,110,.35)";c.fillRect(b.x+k*8,b.y-b.r,8,b.r*2)}c.restore();eyes(b,c,"#FFFFFF",false);
    c.strokeStyle="#1E3C8C";c.lineWidth=3;const a=Math.atan2(b.vy,b.vx);c.beginPath();c.moveTo(b.x+Math.cos(a)*b.r*.1,b.y+Math.sin(a)*b.r*.1);c.lineTo(b.x-Math.cos(a)*b.r*.4,b.y-Math.sin(a)*b.r*.4);c.stroke();if(b.st.invuln>0){c.strokeStyle="#FFD36E";c.lineWidth=4;c.strokeRect(b.x-b.r-6,b.y-b.r*1.25,b.r*2+12,b.r*2.5)}}}},
{floor:20,id:"infernus",boss:true,name:"Infernus",title:"Lõi Dung Nham",arena:"magma",rar:"mythic",color:"#FF5A1F",mono:"",hp:360,dmg:6.5,spd:195,r:44,
 ab:{name:"Hồ lửa",takenMult:1.6,cd:3.3,desc:"Gọi mưa thiên thạch và bắn tia lửa xuyên sàn. Dưới 35% máu thì phun trào liên tục.",
  trigger:b=>{b.mem.k=(b.mem.k||0)+1;const e=E(b);if(!alive(e))return;if(b.mem.k%2){const n=b.mem.p2?5:3;for(let k=0;k<n;k++){const a=rand(0,TAU),d=k?rand(30,110):0;blast(b,{kind:"meteor",x:clamp(e.x+Math.cos(a)*d,40,W-40),y:clamp(e.y+Math.sin(a)*d,40,H-40),r:52,delay:.8+k*.15,dmg:8,after:z=>zone(b,{kind:"fire",x:z.x,y:z.y,r:30,life:2.6,dps:4})})}}
    else line(b,{x:b.x,y:b.y,a:angTo(b,e),delay:.85,w:30,dmg:12,track:b})},
  update:(b,dt)=>{b.mem.ft=(b.mem.ft||0)-dt;if(b.mem.ft<=0){b.mem.ft=.25;zone(b,{kind:"fire",x:b.x,y:b.y,r:20,life:2,dps:2})}
    if(!b.mem.p2&&b.hp<b.max*.35){b.mem.p2=true;phase(b,"PHUN TRÀO","#FF6A2A","Sàn bùng nổ khắp nơi");b.dmgMul=1.3}
    if(b.mem.p2){b.mem.gy=(b.mem.gy??1)-dt;if(b.mem.gy<=0){b.mem.gy=1.5;const e=E(b);if(alive(e))blast(b,{kind:"geyser",x:clamp(e.x+rand(-80,80),50,W-50),y:clamp(e.y+rand(-80,80),50,H-50),r:52,delay:1,dmg:9,draw:drawGeyser})}}
    if(Math.random()<.6)G.parts.push({x:b.x+rand(-b.r,b.r)*.7,y:b.y+rand(-b.r,b.r)*.7,vx:rand(-20,20),vy:rand(-120,-50),life:.6,max:.6,color:pick(["#FF6A2A","#FFC23D"]),size:rand(2,5),add:true})},
  draw:(b,c)=>{bossAura(b,"#FF5A1F");c.save();circle(b.x,b.y,b.r);c.clip();c.strokeStyle=`rgba(255,220,120,${.6+.3*Math.sin(G.t*6)})`;c.lineWidth=2.5;for(let k=0;k<7;k++){const a=k*TAU/7+b.spin*.2;c.beginPath();c.moveTo(b.x,b.y);c.lineTo(b.x+Math.cos(a)*b.r*.5,b.y+Math.sin(a)*b.r*.5);c.lineTo(b.x+Math.cos(a+.3)*b.r,b.y+Math.sin(a+.3)*b.r);c.stroke()}c.restore();eyes(b,c,"#FFF2A8",false)}}},
{floor:25,id:"omega",boss:true,name:"Omega",title:"Kẻ Nuốt Sao",arena:"void",rar:"mythic",color:"#8C7BFF",mono:"",hp:400,dmg:6.5,spd:210,r:44,
 ab:{name:"Vô cực",takenMult:1.8,cd:3,desc:"Xoay vòng hố đen, tia thánh giá, dịch chuyển và sét. Còn nửa máu thì phân thân bóng tối.",
  trigger:b=>{const e=E(b);if(!alive(e))return;b.mem.k=(b.mem.k||0)+1;const m=b.mem.k%4;
    if(m===1)zone(b,{kind:"hole",x:e.x,y:e.y,r:150,life:2.6,pull:520,dps:3.5});
    else if(m===2){for(const a of [0,Math.PI/2])line(b,{x:e.x,y:e.y,a:a+(b.mem.p2?Math.PI/4:0),both:true,delay:.8,w:24,dmg:9,kind:"chess"})}
    else if(m===3){ghostAt(b);const sp=Math.hypot(e.vx,e.vy)||1;b.x=clamp(e.x-e.vx/sp*(e.r+b.r+50),b.r+4,W-b.r-4);b.y=clamp(e.y-e.vy/sp*(e.r+b.r+50),b.r+4,H-b.r-4);b.trail=[];aimAt(b,e);status(b,"crit",1.4);ring(b.x,b.y,4,b.r+40,"#8C7BFF",.4,4);sfx.zap()}
    else{zap(b,e,8,true);status(e,"stun",.3)}},
  update:(b,dt)=>{if(!b.mem.p2&&b.hp<b.max*.5){b.mem.p2=true;phase(b,"VÔ CỰC","#B4A0FF","Bóng tối phân thân");for(let k=0;k<2;k++){const m=spawnMinion(b,{kind:"clone",r:24,hp:60,dmg:5,life:30});m.mem.ghost=true}}if(b.mem.p2)b.cd-=dt*.4},
  draw:(b,c)=>{bossAura(b,"#8C7BFF");c.strokeStyle="rgba(200,190,255,.7)";c.lineWidth=2;c.beginPath();c.ellipse(b.x,b.y,b.r+16,(b.r+16)*.35,G.t*.8,0,TAU);c.stroke();c.beginPath();c.ellipse(b.x,b.y,b.r+22,(b.r+22)*.3,-G.t*.6+1,0,TAU);c.stroke();
    c.fillStyle="#020106";circle(b.x,b.y,b.r*.42);c.fill();glowAt(b.x,b.y,b.r*.8,"#FF4FD8",.6);c.fillStyle="#FFFFFF";circle(b.x+Math.cos(G.t*2)*b.r*.12,b.y+Math.sin(G.t*2)*b.r*.12,b.r*.1);c.fill()}}},
];
const BOSS_BY=Object.fromEntries(BOSSES.map(b=>[b.id,b]));

/* ═════════════════════════ KHỞI CHẠY TRẬN CHUNG ═════════════════════════ */
function launchFight(cfg){
  $("#match").hidden=false;auOn=false;stopShowcase();speed=speed||1;fitCanvas();
  newFight(cfg.pDef,cfg.pLv,cfg.eDef||SAND,cfg.eLv||1);
  setArena(cfg.arena||pick(ARENA_IDS));G.label=cfg.label||null;G.ot=cfg.ot||OVERTIME;G.koTxt=cfg.koTxt||null;G.pODn=cfg.odN||1;
  const p=G.mains[0];
  if(cfg.mods){p.mods=JSON.parse(JSON.stringify(cfg.mods));const m=p.mods;p.max*=m.hpMul;p.hp=p.max*clamp(cfg.hpRatio??1,.05,1);p.dmg*=m.dmgMul;p.base*=m.spdMul;p.r*=m.sizeMul;if(m.shield)p.st.shield=m.shield*p.sc}
  if(cfg.setup)cfg.setup(G);
  delete $("#fP").dataset.mim;delete $("#fB").dataset.mim;
  fillFighter($("#fP"),cfg.pDef,cfg.pLv);fillFighter($("#fB"),G.mains[1].def,cfg.eLv||1);
  $("#fB .who b").textContent=cfg.eName||"Bot";
  const bb=$("#bossBar");bb.hidden=!G.boss;if(G.boss){bb.querySelector("b").textContent=G.boss.def.name.toUpperCase();bb.querySelector("small").textContent=G.boss.def.title;bb.style.setProperty("--bc",G.boss.def.color)}
  setOD(G.pODn);renderPips();
  lastT=performance.now();acc=0;if(!raf)raf=requestAnimationFrame(loop);renderDbgBar();
}
function setOD(n){const od=$("#odBtn");od.dataset.n=n;od.disabled=n<=0;od.innerHTML=n<=0?"ĐÃ DÙNG":`DỒN LỰC${n>1?" ×"+n:""} <kbd>Space</kbd>`}
function setupBoss(def,mult=1){return g=>{const b=g.mains[1];b.max=b.hp=def.hp*mult;b.dmg=def.dmg*Math.sqrt(mult);b.r=def.r;b.x=W/2;b.y=150;g.boss=b;g.botOD=999}}
function setupHorde(n,lv,mix){return g=>{
  const lead=g.mains[1];g.balls.splice(g.balls.indexOf(lead),1);const us=[];
  for(let k=0;k<n;k++){const a=Math.PI+k/n*Math.PI+rand(-.1,.1),x=clamp(W/2+Math.cos(a)*230+rand(-20,20),30,W-30),y=clamp(H/2+Math.sin(a)*230*.9+40,30,H-30);
    const kind=mix&&mix(k);us.push(kind==="archer"?spawnUnit(SAND_ARCHER,lv,x,y,{ai:archerAI}):kind==="boomer"?spawnUnit(BOOMER,lv,x,y,{kamikaze:true,kdmg:12}):spawnUnit(SAND,lv,x,y))}
  g.horde=true;g.mains[1]=us[0];g.hordeMax=us.reduce((s,u)=>s+u.max,0);g.botOD=999}}
function setupElite(def2,lv){return g=>{const m1=g.mains[1];m1.max=m1.hp=m1.max*.55;const b2=makeBall(def2,lv,1,W-150,H-440+rand(-30,30));b2.max=b2.hp=b2.max*.55;g.balls.push(b2);aimAt(b2,g.mains[0]);if(def2.ab.init)def2.ab.init(b2);g.horde=true;g.hordeMax=g.balls.filter(o=>o.side===1).reduce((s,u)=>s+u.max,0)}}
function setupGiant(){return g=>{const b=g.mains[1];b.r*=1.75;b.max=b.hp=b.max*1.5;b.dmg*=1.1;b.base*=.72;b.x=W/2;b.y=150}}
function setupMirror(){return g=>{const b=g.mains[1];b.max=b.hp=b.max*1.15;G.tint={c:"#C3AEFF",t:.5}}}

/* ═════════════════════════ CHỌN BÓNG (CHO CHẾ ĐỘ) ═════════════════════════ */
function ownedSorted(){return Object.keys(S.owned).sort((a,b)=>RARS.indexOf(BY_ID[b].rar)-RARS.indexOf(BY_ID[a].rar)||S.owned[b]-S.owned[a])}
function pickBallSheet(title,sub,onPick,onBack){
  const ids=ownedSorted();
  $("#layer").innerHTML=`<div class="overlay"><div class="draft wide">
    <div class="head"><div><span class="idx">${sub}</span><h2>${title}</h2></div><button class="btn btn-ghost mag" id="pbBack">⟵ Quay lại</button></div>
    <div class="ballgrid">${ids.map((id,i)=>{const b=BY_ID[id],lv=S.owned[id],sc=lvScale(lv);return`<button class="mini-card" data-r="${b.rar}" data-pb="${id}" style="--rc:var(--r-${b.rar});animation-delay:${Math.min(i,24)*.02}s">${orbHTML(b)}<span class="mc-b"><b>${b.name}</b><small>LV ${lv} · HP ${Math.round(b.hp*sc)} · ST ${Math.round(b.dmg*sc)}</small><em>${b.ab.name}</em></span></button>`}).join("")}</div></div></div>`;
  $$("[data-pb]").forEach(bt=>bt.onclick=()=>{sfx.click();onPick(bt.dataset.pb)});
  $("#pbBack").onclick=()=>{sfx.click();(onBack||(()=>{closeLayer();backToLobby()}))()};bindFx($("#layer"));
}
function backToLobby(){if(raf){cancelAnimationFrame(raf);raf=0}closeLayer();$("#match").hidden=true;renderDbgBar();auOn=true;renderTab()}
function introCard(o,done){
  $("#layer").innerHTML=`<div class="overlay intro ${o.boss?"is-boss":""}" style="--ic:${o.color||"#C3AEFF"}"><div class="intro-in">
    <span class="idx">${o.kicker}</span>${o.orb?`<div class="intro-orb">${o.orb}</div>`:""}<h2 class="intro-t">${splitChars(o.title)}</h2>${o.sub?`<p class="intro-s">${o.sub}</p>`:""}
    <div class="intro-tags">${(o.tags||[]).map(t=>`<span class="chip">${t}</span>`).join("")}</div><span class="idx tapnote">Chạm để bắt đầu</span></div></div>`;
  sfx.whoosh();if(o.boss){setTimeout(()=>{sfx.boom();flashbang(o.color);quake()},350)}else setTimeout(()=>sfx.boom(true),250);
  let fired=false;const go=()=>{if(fired)return;fired=true;closeLayer();done()};
  $("#layer .overlay").onclick=go;setTimeout(go,o.boss?3200:1900);
}
function arenaTag(id){const A=ARENA_BY[id];return`<i style="background:${A.neon};box-shadow:0 0 8px ${A.neon}"></i>Sàn: ${A.name}`}

/* ═════════════════════════ LEO THÁP ═════════════════════════ */
const TOWER_N=25;
const TOWER_POOLS=[["common","rare"],["rare","epic"],["epic","legendary"],["legendary","mythic"],["mythic","legendary"]];
function towerFloor(f){
  const boss=BOSSES.find(b=>b.floor===f);if(boss)return{type:"boss",boss,arena:boss.arena,lv:1};
  const tier=Math.floor((f-1)/5),inTier=(f-1)%5,lv=clamp(1+tier*2+(inTier>=2?1:0),1,MAX_LV);
  const type=inTier===2?"horde":inTier===3&&f>5?"elite":"duel";
  const nonBoss=ARENA_IDS.filter(id=>!BOSSES.some(b=>b.arena===id&&b.floor===f));
  return{type,lv,pool:TOWER_POOLS[Math.min(4,tier)],arena:type==="horde"?pick(["desert","temple"]):nonBoss[(f*5+tier*3)%nonBoss.length],n:8+tier*2};
}
function towerRun(){if(!S.tower.run)S.tower.run={floor:Math.max(1,S.tower.ckpt||1),hearts:3};return S.tower.run}
function openTower(){
  const run=towerRun(),f=run.floor;
  const rows=[];for(let k=TOWER_N;k>=1;k--){const info=towerFloor(k),cur=k===f,done=k<f||k<=S.tower.best&&k<f,b=info.boss;
    rows.push(`<div class="fl ${b?"boss":""} ${cur?"cur":""} ${k<f?"done":""} ${k>f?"lock":""}" style="--fc:${b?b.color:ARENA_BY[info.arena].neon}"><span class="fn">${String(k).padStart(2,"0")}</span>
      <span class="ft-n">${b?`<b>${b.name.toUpperCase()}</b><small>${b.title}</small>`:`<b>${info.type==="horde"?"Bầy lính cát":info.type==="elite"?"Song đấu tinh nhuệ":"Đấu tay đôi"}</b><small>${ARENA_BY[info.arena].name} · bot LV ${info.lv}</small>`}</span>
      <span class="fs">${k<f?"✓":cur?"⟵":b?"BOSS":k%5===0?"":""}</span></div>`)}
  const next=BOSSES.find(b=>b.floor>=f)||BOSSES[BOSSES.length-1];
  $("#layer").innerHTML=`<div class="overlay"><div class="tower">
    <div class="tw-l">
      <span class="idx"><b>(T)</b> — ${TOWER_N} tầng · 5 boss · checkpoint sau mỗi boss</span>
      <h2>THÁP <em>VÔ CỰC</em></h2>
      <div class="tw-stats"><div><span class="idx">Tầng hiện tại</span><b class="num">${f>TOWER_N?"✓":f}</b></div><div><span class="idx">Tim</span><b class="hearts">${"♥".repeat(run.hearts)}<span>${"♥".repeat(3-run.hearts)}</span></b></div><div><span class="idx">Kỷ lục</span><b class="num">${S.tower.best}</b></div></div>
      <div class="tw-next" style="--bc:${next.color}"><span class="idx">Boss kế tiếp · tầng ${next.floor}</span><div class="tw-bn"><span class="orb r-mythic" style="--c:${next.color}"><span></span></span><div><b>${next.name.toUpperCase()}</b><small>${next.title} · ${ARENA_BY[next.arena].name}</small></div></div><p>${next.ab.desc}</p></div>
      <p class="tw-rule">Thua một tầng mất 1 tim. Hết tim thì quay về checkpoint gần nhất. Hạ boss lần đầu nhận Gems và một quả bóng hiếm.</p>
      <div class="row-end" style="justify-content:flex-start">${f<=TOWER_N?`<button class="btn btn-play mag" id="twGo">LEO TẦNG ${f} ⟶</button>`:`<button class="btn btn-play mag" id="twReset">LEO LẠI TỪ ĐẦU</button>`}<button class="btn btn-ghost mag" id="twBack">Về sảnh</button></div>
    </div>
    <div class="tw-r" id="twList">${rows.join("")}</div></div></div>`;
  const cur=$("#twList .cur"),L=$("#twList");if(cur&&L.scrollHeight>L.clientHeight+4)L.scrollTop=cur.offsetTop-L.offsetTop-L.clientHeight/2+cur.clientHeight/2;
  $("#twBack").onclick=()=>{sfx.click();backToLobby()};
  const go=$("#twGo");if(go)go.onclick=()=>{sfx.click();pickBallSheet(`TẦNG <em>${f}</em>`,`(T${String(f).padStart(2,"0")}) — Chọn bóng leo tầng này`,id=>towerStart(id),openTower)};
  const rs=$("#twReset");if(rs)rs.onclick=()=>{S.tower.ckpt=1;S.tower.run=null;save();openTower()};
  bindFx($("#layer"));
}
function towerStart(pid){
  const run=towerRun(),f=run.floor,info=towerFloor(f),lv=S.owned[pid];
  M={mode:"tower",round:1,score:[0,0],floor:f,pid,info,onEnd:towerEnd,onQuit:()=>towerEnd(1,true)};
  const label="TẦNG "+f;
  if(info.type==="boss"){const b=info.boss;
    introCard({boss:true,color:b.color,kicker:`Tầng ${f} · Boss ${BOSSES.indexOf(b)+1}/5`,title:b.name.toUpperCase(),sub:b.title,orb:`<span class="orb r-mythic" style="--c:${b.color}"><span></span></span>`,tags:[arenaTag(b.arena),`Kỹ năng: ${b.ab.name}`]},
      ()=>launchFight({pDef:BY_ID[pid],pLv:lv,eDef:b,eLv:1,arena:b.arena,label,ot:90,eName:b.name,setup:setupBoss(b,1+(S.owned[pid]-1)*.06),koTxt:w=>w===0?"BOSS GỤC NGÃ":"BẠN ĐÃ NGÃ"}))}
  else{
    const eDef=pick(BALLS.filter(b=>info.pool.includes(b.rar)&&b.id!==pid));
    const cfg={pDef:BY_ID[pid],pLv:lv,eDef,eLv:info.lv,arena:info.arena,label,koTxt:w=>w===0?"QUA TẦNG":"THẤT THỦ"};
    let title=eDef.name.toUpperCase(),sub=eDef.ab.name+" · "+RAR_VN[eDef.rar],tags=[arenaTag(info.arena),`Bot LV ${info.lv}`];
    if(info.type==="horde"){cfg.setup=setupHorde(info.n,info.lv,k=>k%4===3?"archer":null);cfg.eName=`Lính cát ×${info.n}`;title="BẦY LÍNH CÁT";sub=`${info.n} lính cát, có cả cung thủ`}
    if(info.type==="elite"){const d2=pick(BALLS.filter(b=>info.pool.includes(b.rar)&&b.id!==pid&&b.id!==eDef.id));cfg.setup=setupElite(d2,Math.max(1,info.lv-1));cfg.eName="Bộ đôi";title="SONG ĐẤU";sub=`${eDef.name} và ${d2.name} cùng lúc`}
    introCard({color:ARENA_BY[info.arena].neon,kicker:`Tháp vô cực · tầng ${f}/${TOWER_N}`,title,sub,tags},()=>launchFight(cfg))}
}
function towerEnd(w,quit){
  if(M.ended)return;M.ended=true;if(raf){cancelAnimationFrame(raf);raf=0}
  const run=towerRun(),f=M.floor,info=M.info;let coins=0,gems=0,extra="",ballGift=null;
  if(w===0&&!quit){
    coins=40+f*12;run.floor=f+1;S.tower.best=Math.max(S.tower.best,f);
    if(info.type==="boss"){const b=info.boss;S.tower.ckpt=f+1;
      if(!S.tower.boss.includes(b.id)){S.tower.boss.push(b.id);gems=25+BOSSES.indexOf(b)*10;coins+=300*(BOSSES.indexOf(b)+1);
        const rr=["rare","epic","legendary","mythic","mythic"][BOSSES.indexOf(b)];ballGift=pick(BALLS.filter(x=>x.rar===rr));const before=S.owned[ballGift.id]||0;grantBall(ballGift.id);
        extra=`Phần thưởng hạ boss lần đầu: <b>${ballGift.name}</b> (${RAR_VN[rr]})${before?" · lên cấp":""}`}
      else extra="Checkpoint đã lưu ở tầng "+(f+1)}
    if(f>=TOWER_N){extra="Bạn đã chinh phục cả tháp!";S.tower.ckpt=1;S.tower.run=null;gems+=50}
  }else{run.hearts--;if(run.hearts<=0){extra=`Hết tim. Quay về checkpoint tầng ${S.tower.ckpt}.`;S.tower.run=null}else extra=`Còn ${run.hearts} tim. Thử lại tầng ${f}.`;coins=quit?0:15}
  coins=Math.round(coins*TUNEX.coin);gems=Math.round(gems*TUNEX.gem);S.coins+=coins;S.gems+=gems;save();updateWallet();if(coins)sfx.coin();
  const win=w===0&&!quit;
  $("#layer").innerHTML=`<div class="overlay"><div class="sheet result ${win?"win":""}">
    <span class="idx">Tháp vô cực · tầng ${f}</span><h2>${win?(info.type==="boss"?"HẠ BOSS!":"QUA TẦNG"):"THẤT THỦ"}</h2>
    ${ballGift?`<div class="gift">${orbHTML(ballGift)}</div>`:""}<p style="color:var(--muted)">${extra}</p>
    <div class="rewards">${coins?`<span class="chip-cur"><span class="coin"></span>+${fmt(coins)}</span>`:""}${gems?`<span class="chip-cur"><span class="gem"></span>+${gems}</span>`:""}</div>
    <div class="row-end" style="justify-content:center"><button class="btn btn-ghost mag" id="toLobby">Về sảnh</button><button class="btn btn-main mag" id="again">${S.tower.run?"Bản đồ tháp ⟶":"Vào lại tháp ⟶"}</button></div></div></div>`;
  if(win){confettiBurst(innerWidth/2,innerHeight*.5,info.type==="boss"?260:120,["#36E2FF","#FF4D7A","#FFC23D","#5CF2A8",info.type==="boss"?info.boss.color:"#C3AEFF"]);flashbang("#FFC23D")}
  $("#toLobby").onclick=backToLobby;$("#again").onclick=()=>{closeLayer();openTower()};bindFx($("#layer"));
}

/* ═════════════════════════ VÔ TẬN ═════════════════════════ */
const CARD_RAR={common:{w:50,c:"var(--r-common)",n:"Thường"},rare:{w:30,c:"var(--r-rare)",n:"Hiếm"},epic:{w:15,c:"var(--r-epic)",n:"Sử thi"},legendary:{w:5,c:"var(--r-legendary)",n:"Huyền thoại"}};
const CARDS=[
 {id:"hp",rar:"common",icon:"✚",name:"Vỏ dày",desc:"+20% máu tối đa, hồi thêm 20% máu.",apply:(m,R)=>{m.hpMul*=1.2;R.hpRatio=Math.min(1,R.hpRatio+.2)}},
 {id:"dmg",rar:"common",icon:"⚔",name:"Mài sắc",desc:"+15% sát thương va chạm.",apply:m=>{m.dmgMul*=1.15}},
 {id:"spd",rar:"common",icon:"➶",name:"Gió lốc",desc:"+12% tốc độ lăn.",apply:m=>{m.spdMul*=1.12}},
 {id:"heal",rar:"common",icon:"♥",name:"Băng bó",desc:"Hồi ngay 45% máu.",apply:(m,R)=>{R.hpRatio=Math.min(1,R.hpRatio+.45)}},
 {id:"shield",rar:"common",icon:"⬡",name:"Khiên năng lượng",desc:"Mỗi vòng bắt đầu với khiên chặn 25 sát thương (cộng dồn).",apply:m=>{m.shield+=25}},
 {id:"vamp",rar:"rare",icon:"❦",name:"Ma cà rồng",desc:"Hút 8% sát thương gây ra thành máu.",apply:m=>{m.lifesteal+=.08}},
 {id:"thorn",rar:"rare",icon:"✹",name:"Giáp gai",desc:"Phản 20% sát thương nhận vào.",apply:m=>{m.thorns+=.2}},
 {id:"crit",rar:"rare",icon:"◎",name:"Mắt diều hâu",desc:"+12% cơ hội chí mạng gấp đôi.",apply:m=>{m.critCh+=.12}},
 {id:"cd",rar:"rare",icon:"⧗",name:"Đồng hồ cát",desc:"Kỹ năng hồi nhanh hơn 20%.",apply:m=>{m.cdRate*=1.2}},
 {id:"big",rar:"rare",icon:"⬤",name:"Khổng lồ",desc:"+15% kích thước và +15% máu. Va chạm nặng tay hơn.",apply:m=>{m.sizeMul*=1.15;m.hpMul*=1.15}},
 {id:"fire",rar:"epic",icon:"♨",name:"Vệt lửa",desc:"Lăn tới đâu để lại lửa tới đó.",apply:m=>{m.fire+=1}},
 {id:"shot",rar:"epic",icon:"➹",name:"Pháo mini",desc:"Tự bắn đạn vào kẻ địch gần nhất (cộng dồn: bắn nhanh hơn).",apply:m=>{m.shot+=1}},
 {id:"moon",rar:"epic",icon:"☾",name:"Vệ tinh",desc:"+1 mặt trăng quay quanh, chạm địch gây 7 sát thương (tối đa 4).",apply:m=>{m.moons=Math.min(4,m.moons+1)},ok:m=>m.moons<4},
 {id:"od",rar:"epic",icon:"⚡",name:"Dồn lực kép",desc:"+1 lần Dồn lực mỗi vòng.",apply:m=>{m.odExtra+=1},ok:m=>m.odExtra<3},
 {id:"thunder",rar:"legendary",icon:"ϟ",name:"Thần sấm",desc:"Cứ 3.6 giây sét đánh một kẻ địch bất kỳ, gây choáng.",apply:m=>{m.thunder+=1}},
 {id:"revive",rar:"legendary",icon:"❂",name:"Phượng hoàng",desc:"Một lần hồi sinh với 50% máu kèm vụ nổ lửa.",apply:m=>{m.revive+=1}},
 {id:"boom",rar:"legendary",icon:"✺",name:"Va chạm nổ",desc:"Mọi cú chí mạng gây thêm vụ nổ diện rộng. Kèm +8% chí mạng.",apply:m=>{m.boom+=1;m.critCh+=.08}},
];
const freshMods=()=>({hpMul:1,dmgMul:1,spdMul:1,sizeMul:1,shield:0,lifesteal:0,thorns:0,critCh:0,cdRate:1,fire:0,shot:0,moons:0,odExtra:0,thunder:0,revive:0,boom:0});
let RUN=null;
const ENC={
 duel:{name:"Đấu tay đôi",desc:"Một đối thủ ngẫu nhiên."},
 horde:{name:"Bầy lính cát",desc:"Một mình bạn chống cả đội quân cát."},
 elite:{name:"Song đấu tinh nhuệ",desc:"Hai quả bóng mạnh lao vào cùng lúc."},
 mirror:{name:"Bóng gương",desc:"Đối đầu chính bản sao của bạn, khoẻ hơn 15%."},
 giant:{name:"Gã khổng lồ",desc:"Một quả bóng to gấp đôi, trâu gấp ba."},
 swarm:{name:"Bầy chuột nổ",desc:"Lũ chuột cảm tử lao vào rồi nổ tung."},
 boss:{name:"Boss",desc:""},
};
function endlessPool(w){return w<4?["common","rare"]:w<8?["rare","epic"]:w<14?["epic","legendary"]:["legendary","mythic"]}
function genEncounter(w){
  const lv=clamp(1+Math.floor(w/3),1,MAX_LV);
  if(w%10===0){const b=BOSSES[(w/10-1)%BOSSES.length];return{type:"boss",boss:b,lv,arena:b.arena,mult:.75+w*.025}}
  const opts=[["duel",30],["horde",w>=2?24:0],["elite",w>=4?14:0],["mirror",w>=3?10:0],["giant",w>=3?11:0],["swarm",w>=5?11:0]];
  let x=Math.random()*opts.reduce((s,o)=>s+o[1],0),type="duel";for(const [t,wt] of opts){x-=wt;if(x<=0){type=t;break}}
  if(RUN&&RUN.last===type&&type!=="duel")type="duel";
  const arena=type==="horde"?pick(["desert","temple","neon"]):type==="swarm"?pick(["magma","pinball"]):type==="mirror"?"void":type==="giant"?pick(["temple","pinball","glacier"]):pick(ARENA_IDS);
  return{type,lv,arena,n:Math.min(18,6+Math.floor(w*.8))};
}
function openEndless(){
  $("#layer").innerHTML=`<div class="overlay"><div class="sheet endless-start">
    <span class="idx"><b>(∞)</b> — Kỷ lục: vòng ${S.endless.best}</span><h2>VÔ <em>TẬN</em></h2>
    <p style="color:var(--muted)">Một quả bóng, vô số vòng đấu. Máu không hồi đầy giữa các vòng. Thắng mỗi vòng được chọn 1 trong 3 thẻ nâng cấp. Mỗi 10 vòng gặp một boss.</p>
    <div class="enc-list">${["duel","horde","elite","mirror","giant","swarm"].map(k=>`<span class="chip">${ENC[k].name}</span>`).join("")}</div>
    <div class="row-end"><button class="btn btn-ghost mag" id="enBack">Về sảnh</button><button class="btn btn-play mag" id="enGo">CHỌN BÓNG ⟶</button></div></div></div>`;
  $("#enBack").onclick=()=>{sfx.click();backToLobby()};
  $("#enGo").onclick=()=>{sfx.click();pickBallSheet("VÔ <em>TẬN</em>","(∞) — Quả bóng đi cùng bạn suốt chặng",id=>{RUN={pid:id,lv:S.owned[id],wave:1,hpRatio:1,mods:freshMods(),cards:{},coins:0,gems:0,last:null};endlessWave()},openEndless)};
  bindFx($("#layer"));
}
function endlessWave(){
  const w=RUN.wave,enc=genEncounter(w);RUN.last=enc.type;RUN.enc=enc;
  M={mode:"endless",round:w,score:[0,0],onEnd:endlessEnd,onQuit:()=>endlessEnd(1,true)};
  const pDef=BY_ID[RUN.pid],cfg={pDef,pLv:RUN.lv,arena:enc.arena,label:"VÒNG "+w,mods:RUN.mods,hpRatio:RUN.hpRatio,odN:1+RUN.mods.odExtra,koTxt:x=>x===0?"QUA VÒNG":"GỤC NGÃ"};
  let title,sub,color=ARENA_BY[enc.arena].neon,boss=false,orb="";
  if(enc.type==="boss"){const b=enc.boss;Object.assign(cfg,{eDef:b,eLv:1,ot:90,eName:b.name,setup:setupBoss(b,enc.mult)});title=b.name.toUpperCase();sub=b.title;color=b.color;boss=true;orb=`<span class="orb r-mythic" style="--c:${b.color}"><span></span></span>`}
  else{const pool=BALLS.filter(b=>endlessPool(w).includes(b.rar)&&b.id!==RUN.pid);const eDef=pick(pool);Object.assign(cfg,{eDef,eLv:enc.lv});title=eDef.name.toUpperCase();sub=eDef.ab.name;
    if(enc.type==="horde"){cfg.setup=setupHorde(enc.n,enc.lv,k=>k%4===3?"archer":null);cfg.eName=`Lính cát ×${enc.n}`;title=`${enc.n} LÍNH CÁT`;sub="1 chọi "+enc.n}
    if(enc.type==="swarm"){const n=Math.round(enc.n*.8);cfg.setup=setupHorde(n,enc.lv,k=>k%3===2?null:"boomer");cfg.eName=`Bầy chuột ×${n}`;title="BẦY CHUỘT NỔ";sub=`${n} kẻ cảm tử`}
    if(enc.type==="elite"){const d2=pick(pool.filter(b=>b.id!==eDef.id));cfg.setup=setupElite(d2,Math.max(1,enc.lv-1));cfg.eName="Bộ đôi";title="SONG ĐẤU";sub=`${eDef.name} + ${d2.name}`}
    if(enc.type==="mirror"){cfg.eDef=pDef;cfg.eLv=RUN.lv;cfg.setup=setupMirror();cfg.eName="Bóng gương";title="BÓNG GƯƠNG";sub=`${pDef.name} đối đầu ${pDef.name}`}
    if(enc.type==="giant"){cfg.setup=setupGiant();cfg.eName="Khổng lồ";title="GÃ KHỔNG LỒ";sub=`${eDef.name} cỡ đại`}}
  introCard({boss,color,orb,kicker:`Vô tận · vòng ${w} · ${ENC[enc.type].name}`,title,sub,tags:[arenaTag(enc.arena),`Máu ${Math.round(RUN.hpRatio*100)}%`,`${Object.values(RUN.cards).reduce((a,b)=>a+b,0)} thẻ`]},()=>launchFight(cfg));
}
function endlessEnd(w,quit){
  if(M.ended)return;M.ended=true;if(raf){cancelAnimationFrame(raf);raf=0}
  if(w===0&&!quit){
    const p=G.mains[0];RUN.hpRatio=clamp(p.hp/p.max+.15,.2,1);const wv=RUN.wave;RUN.coins+=20+wv*10;if(wv%5===0)RUN.gems+=5;if(RUN.enc.type==="boss")RUN.gems+=15;
    S.endless.best=Math.max(S.endless.best,wv);save();RUN.wave++;sfx.coin();cardPick();return}
  const cleared=RUN.wave-1;RUN.coins=Math.round(RUN.coins*TUNEX.coin);RUN.gems=Math.round(RUN.gems*TUNEX.gem);S.coins+=RUN.coins;S.gems+=RUN.gems;S.endless.best=Math.max(S.endless.best,cleared);save();updateWallet();
  $("#layer").innerHTML=`<div class="overlay"><div class="sheet result">
    <span class="idx">Vô tận · ${BY_ID[RUN.pid].name} · ${Object.values(RUN.cards).reduce((a,b)=>a+b,0)} thẻ</span><h2>VÒNG ${RUN.wave}</h2>
    <p style="color:var(--muted)">Vượt qua ${cleared} vòng. Kỷ lục: vòng ${S.endless.best}.</p>
    <div class="cards-owned">${Object.entries(RUN.cards).map(([id,n])=>{const c=CARDS.find(x=>x.id===id);return`<span class="chip" style="--cc:${CARD_RAR[c.rar].c}">${c.icon} ${c.name}${n>1?" ×"+n:""}</span>`}).join("")}</div>
    <div class="rewards">${RUN.coins?`<span class="chip-cur"><span class="coin"></span>+${fmt(RUN.coins)}</span>`:""}${RUN.gems?`<span class="chip-cur"><span class="gem"></span>+${RUN.gems}</span>`:""}</div>
    <div class="row-end" style="justify-content:center"><button class="btn btn-ghost mag" id="toLobby">Về sảnh</button><button class="btn btn-main mag" id="again">Chơi lại ⟶</button></div></div></div>`;
  if(RUN.coins)sfx.coin();
  $("#toLobby").onclick=backToLobby;$("#again").onclick=()=>{closeLayer();openEndless()};bindFx($("#layer"));
}
function rollCards(){
  const out=[];let guard=0;
  while(out.length<3&&guard++<200){let x=Math.random()*100,rar="common";for(const [r,o] of Object.entries(CARD_RAR)){x-=o.w;if(x<=0){rar=r;break}}
    const pool=CARDS.filter(c=>c.rar===rar&&!out.includes(c)&&(!c.ok||c.ok(RUN.mods)));if(pool.length)out.push(pick(pool))}
  return out;
}
function cardPick(){
  const opts=rollCards();
  $("#layer").innerHTML=`<div class="overlay"><div class="draft">
    <div class="head"><div><span class="idx"><b>(VÒNG ${String(RUN.wave-1).padStart(2,"0")} ✓)</b> — Máu còn ${Math.round(RUN.hpRatio*100)}% · Đã tích ${fmt(RUN.coins)} xu</span><h2>CHỌN <em>THẺ</em></h2></div></div>
    <div class="ucards">${opts.map((c,i)=>{const own=RUN.cards[c.id]||0;return`<button class="ucard" data-card="${c.id}" style="--cc:${CARD_RAR[c.rar].c};animation-delay:${i*.12}s"><span class="uc-r">${CARD_RAR[c.rar].n}</span><span class="uc-i">${c.icon}</span><h3>${c.name}</h3><p>${c.desc}</p>${own?`<span class="uc-o">Đang có ×${own}</span>`:""}</button>`}).join("")}</div>
    <div class="dfoot"><span class="idx">Thẻ cộng dồn suốt lượt chơi</span><button class="btn btn-ghost mag" id="enQuit">Dừng & nhận thưởng</button></div></div></div>`;
  $$("[data-card]").forEach(bt=>bt.onclick=()=>{const c=CARDS.find(x=>x.id===bt.dataset.card);c.apply(RUN.mods,RUN);RUN.cards[c.id]=(RUN.cards[c.id]||0)+1;
    bt.classList.add("chosen");sfx.reveal(c.rar==="legendary"?"legendary":c.rar==="epic"?"epic":"rare");const r=bt.getBoundingClientRect();confettiBurst(r.left+r.width/2,r.top+r.height/2,c.rar==="legendary"?140:60,["#FFC23D","#ffffff","#C3AEFF"]);
    $$("[data-card]").forEach(x=>x.disabled=true);setTimeout(endlessWave,650)});
  $("#enQuit").onclick=()=>{M.ended=false;endlessEnd(1,true)};
  bindFx($("#layer"));
}
