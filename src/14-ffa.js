
/* ═════════════════════════ HỖN CHIẾN 8 BÓNG (chế độ giải trí) ═════════════════════════
   8 quả bóng cùng thả vào một sàn, mỗi quả một phe, tự đuổi kẻ gần nhất. Ai trụ lại cuối cùng thắng.
   Người chơi chọn 1 con để cổ vũ (con đó dùng được nút Dồn lực) và đặt cược xu. */
const FFA_N=8,FFA_BETS=[0,100,300,1000],FFA_BASE=[0,150,80,50,25,20,15,10,10];
let FFA=null;
(function(){
  const rt=renderTab;
  renderTab=function(){rt();if(tab!=="play")return;const modes=document.querySelector(".modes");if(!modes||$("#goFFA"))return;
    modes.insertAdjacentHTML("beforeend",`<button class="mode tilt rv" id="goFFA" style="--mc:#FF4D7A;grid-column:1/-1"><span class="idx"><b>(VUI)</b> — Giải trí</span><h3>HỖN <em>CHIẾN</em></h3><p>8 quả bóng cùng lao vào một sàn, ai trụ lại cuối cùng thắng. Chọn 1 con để cổ vũ, đặt cược xu, giữ nút Dồn lực cho nó vào lúc gay cấn.</p><span class="m-go">⟶</span></button>`);
    $("#goFFA").onclick=()=>{sfx.click();ffaOpen()};bindFx(modes)};
})();
function ffaRoll(){const pool=BALLS.slice().sort(()=>Math.random()-.5);return pool.slice(0,FFA_N)}
function ffaOpen(keep){
  if(!keep||!FFA)FFA={defs:ffaRoll(),champ:0,bet:0};
  const F=FFA;if(F.bet>S.coins)F.bet=0;
  $("#layer").innerHTML=`<div class="overlay"><div class="draft">
    <div class="head"><div><span class="idx"><b>(HỖN CHIẾN)</b> — 8 bóng · ai trụ lại cuối thắng · tất cả Lv1</span><h2>CHỌN CON <em>CỔ VŨ</em></h2></div></div>
    <div class="picks" style="grid-template-columns:repeat(auto-fill,minmax(150px,1fr))">${F.defs.map((b,i)=>`<button class="pick" data-r="${b.rar}" data-fc="${i}" style="${i===F.champ?"outline:2px solid var(--you);outline-offset:2px":""}">${orbHTML(b)}<div class="body"><h3>${b.name}</h3><div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">${rarPill(b.rar)}</div><p><b>${b.ab.name}.</b></p></div></button>`).join("")}</div>
    <div class="dfoot" style="flex-wrap:wrap;gap:10px"><span class="idx">Đặt cược:</span>${FFA_BETS.map(v=>`<button class="btn ${v===F.bet?"btn-main":"btn-ghost"} mag" data-fb="${v}" ${v>S.coins?"disabled":""}>${v?`<span class="coin"></span> ${fmt(v)}`:"Không cược"}</button>`).join("")}
      <span class="idx" style="flex-basis:100%">Hạng 1: nhận ×5 tiền cược · Hạng 2: ×2 · Hạng 3: hoàn tiền · thấp hơn: mất cược</span>
      <button class="btn btn-ghost mag" id="fRe">Đổi đội hình</button><button class="btn btn-ghost mag" id="fBack">Quay lại</button><button class="btn btn-main mag" id="fGo">Bắt đầu ⟶</button></div>
  </div></div>`;
  $$("[data-fc]").forEach(b=>b.onclick=()=>{F.champ=+b.dataset.fc;sfx.click();ffaOpen(true)});
  $$("[data-fb]").forEach(b=>b.onclick=()=>{F.bet=+b.dataset.fb;sfx.click();ffaOpen(true)});
  $("#fRe").onclick=()=>{sfx.whoosh();FFA=null;ffaOpen()};$("#fBack").onclick=()=>{closeLayer()};
  $("#fGo").onclick=()=>{sfx.click();ffaStart()};bindFx($("#layer"));
}
function ffaStart(){
  const F=FFA;S.coins-=F.bet;save();updateWallet();
  const defs=[F.defs[F.champ]].concat(F.defs.filter((_,i)=>i!==F.champ));F.order=defs;F.box0=BOX_EVERY;BOX_EVERY=5;
  M={mode:"ffa",round:1,score:[0,0],onEnd:ffaEnd,onQuit:()=>ffaEnd(-2)};
  closeLayer();
  launchFight({pDef:defs[0],pLv:1,eDef:defs[1],eLv:1,arena:pick(["neon","temple","void","desert","glacier","magma","pinball"]),label:"HỖN CHIẾN",eName:"Hỗn chiến",ot:60,setup:g=>{
    g.ffa=true;g.botOD=Infinity;g.elim=[];g.bxT=3;g.combo=Array.from({length:FFA_N},()=>({n:0,t:-9}));g.hurt=Array(FFA_N).fill(0);
    for(let i=2;i<FFA_N;i++){const m=makeBall(defs[i],1,i,W/2,H/2);g.mains.push(m);g.balls.push(m)}
    g.mains.forEach((m,k)=>{const a=k*TAU/FFA_N+.4;m.x=W/2+Math.cos(a)*215;m.y=H/2+Math.sin(a)*215;const to=Math.atan2(H/2-m.y,W/2-m.x)+rand(-.6,.6),s=m.base;m.vx=Math.cos(to)*s;m.vy=Math.sin(to)*s;m.mem.odT=rand(6,26);m.trail=[]});
    for(let i=2;i<FFA_N;i++){const m=g.mains[i];if(m.def.ab.init)m.def.ab.init(m)}
    g.hordeMax=g.mains.slice(1).reduce((a,m)=>a+m.max,0);
    g.koTxt=w=>w===0?"CON BẠN VÔ ĐỊCH":w>=0?(g.mains[w].def.name.toUpperCase()+" THẮNG"):"HOÀ";
  }});
  $("#pips").innerHTML=`<span class="pip-t">HỖN CHIẾN</span>`;$("#fB .who b").textContent="Hỗn chiến";
}
function ffaEnd(w){
  if(M.ended)return;M.ended=true;if(raf){cancelAnimationFrame(raf);raf=0}
  const F=FFA,g=G;BOX_EVERY=F.box0||10;
  // bảng xếp hạng: người thắng, rồi thứ tự bị loại ngược lại
  const rank=[];if(w>=0)rank.push(w);
  for(const m of g.mains)if(m.alive&&!rank.includes(m.side))rank.push(m.side);
  for(const m of g.mains)if(!m.alive&&!g.elim.includes(m.side)&&!rank.includes(m.side))rank.push(m.side);
  for(let i=g.elim.length-1;i>=0;i--)if(!rank.includes(g.elim[i]))rank.push(g.elim[i]);
  for(const m of g.mains)if(!rank.includes(m.side))rank.push(m.side);
  const place=w===-2?0:rank.indexOf(0)+1;
  const base=FFA_BASE[place]||0,mult=place===1?5:place===2?2:place===3?1:0,win=F.bet*mult;
  const coins=Math.round(base*TUNEX.coin)+win,gems=place===1?Math.round(3*TUNEX.gem):0;
  S.coins+=coins;S.gems+=gems;save();updateWallet();if(coins)sfx.coin();
  $("#match").hidden=true;auOn=true;
  $("#layer").innerHTML=`<div class="overlay"><div class="sheet result ${place===1?"win":""}" style="width:min(560px,100%);max-height:94vh;overflow:auto">
    <span class="idx">Hỗn chiến 8 bóng${F.bet?` · cược ${fmt(F.bet)} xu`:""}</span><h2>${w===-2?"BỎ CUỘC":place===1?"VÔ ĐỊCH":"HẠNG "+place}</h2>
    <div style="display:flex;flex-direction:column;gap:6px;flex-shrink:0">${rank.map((sd,i)=>{const d=g.mains[sd].def,me=sd===0;return`<div style="display:flex;align-items:center;gap:10px;padding:6px 10px;border-radius:12px;flex-shrink:0;background:${me?"color-mix(in srgb,var(--you),transparent 85%)":"var(--panel)"};border:1px solid ${me?"var(--you)":"var(--line2)"}"><b style="width:26px;font-family:var(--font-display)">#${i+1}</b>${orbHTML(d,false,"").replace('class="orb','style="width:34px;height:34px" class="orb')}<span style="flex:1;font-weight:700">${d.name}${me?' <small style="color:var(--you)">(con bạn)</small>':""}</span><small class="idx">${RAR_VN[d.rar]}</small></div>`}).join("")}</div>
    <div class="rewards">${coins?`<span class="chip-cur"><span class="coin"></span>+${fmt(coins)}</span>`:""}${gems?`<span class="chip-cur"><span class="gem"></span>+${gems}</span>`:""}${!coins&&!gems?`<span style="color:var(--muted)">Mất cược</span>`:""}</div>
    <div class="row-end" style="justify-content:center"><button class="btn btn-ghost mag" id="fHome">Về sảnh</button><button class="btn btn-main mag" id="fAgain">Chơi lại ⟶</button></div></div></div>`;
  if(place===1){confettiBurst(innerWidth/2,innerHeight*.5,180,["#36E2FF","#FF4D7A","#FFC23D","#5CF2A8","#C3AEFF"]);flashbang("#FFC23D")}
  $("#fHome").onclick=()=>{backToLobby()};$("#fAgain").onclick=()=>{sfx.click();ffaOpen()};bindFx($("#layer"));
}
