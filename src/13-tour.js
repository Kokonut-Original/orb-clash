
/* ═════════════════════════ TOURNAMENT ĐẤU BOT (offline) ═════════════════════════
   Vào thẻ TOURNAMENT → chọn "Chơi LAN" (12-net.js) hoặc "Đấu với bot".
   Giải 4/8/16 người, loại trực tiếp 1 hiệp, có tranh hạng 3. Mỗi trận random 1 độ hiếm,
   mỗi người chọn 1 trong 5 quả của độ hiếm đó (kể cả chưa mở khoá), tất cả Lv1.
   Trận bot với bot: xem trực tiếp hoặc mô phỏng tức thì. Cuối giải: màn trao cúp. */
const TOUR_BOTS=["Bot Sấm","Bot Gió","Bot Lửa","Bot Băng","Bot Bóng Đêm","Bot Tia Chớp","Bot Hổ","Bot Rồng","Bot Mèo","Bot Đại Bàng","Bot Thép","Bot Ngọc","Bot Bão","Bot Sói","Bot Cáo","Bot Gấu","Bot Phượng","Bot Kỳ Lân"];
const TOUR_REW={1:{c:300,g:8},2:{c:160,g:4},3:{c:100,g:2}};
let TOUR=null;

function tourOpen(){
  $("#layer").innerHTML=`<div class="overlay" id="tourOv"><div class="sheet" style="width:min(640px,100%)">
    <span class="idx"><b>(TOURNAMENT)</b> — chọn cách chơi</span><h2>TOUR<em>NAMENT</em></h2>
    <div class="diff" role="group" style="flex-shrink:0">
      <button class="mag" id="tChLan"><b>Chơi LAN</b><small>Đấu người thật qua mạng LAN / Radmin</small></button>
      <button class="mag" id="tChBot"><b>Đấu với bot</b><small>Giải offline 4 / 8 / 16 người</small></button>
    </div>
    <div class="row-end"><button class="btn btn-ghost mag" id="tClose">Đóng</button></div></div></div>`;
  $("#tChLan").onclick=()=>{sfx.click();netOpen()};
  $("#tChBot").onclick=()=>{sfx.click();tourSetup()};
  $("#tClose").onclick=()=>{sfx.click();closeLayer()};bindFx($("#layer"));
}
function tourSetup(){
  let size=8;
  $("#layer").innerHTML=`<div class="overlay"><div class="sheet" style="width:min(640px,100%)">
    <span class="idx"><b>(GIẢI BOT)</b> — tạo giải</span><h2>TẠO <em>GIẢI</em></h2>
    <p style="color:var(--muted)">Loại trực tiếp, mỗi trận 1 hiệp. Mỗi trận bốc ngẫu nhiên 1 độ hiếm, bạn chọn 1 trong 5 quả của độ hiếm đó (kể cả quả chưa mở), tất cả Lv1. Có tranh hạng 3, cuối giải trao cúp.</p>
    <div class="diff" role="group" style="flex-shrink:0">${[4,8,16].map(n=>`<button class="mag" data-tsz="${n}" aria-pressed="${n===size}"><b>${n} người</b><small>${n===4?"Bán kết → Chung kết":n===8?"Tứ kết → Chung kết":"Vòng 1/8 → Chung kết"}</small></button>`).join("")}</div>
    <div class="row-end"><button class="btn btn-ghost mag" id="tBack">Quay lại</button><button class="btn btn-main mag" id="tGo">Bắt đầu giải ⟶</button></div></div></div>`;
  $$("[data-tsz]").forEach(b=>b.onclick=()=>{size=+b.dataset.tsz;$$("[data-tsz]").forEach(x=>x.setAttribute("aria-pressed",x===b));sfx.click()});
  $("#tBack").onclick=()=>{sfx.click();tourOpen()};
  $("#tGo").onclick=()=>{sfx.click();tourStart(size)};bindFx($("#layer"));
}
function tourStart(size){
  const names=TOUR_BOTS.slice().sort(()=>Math.random()-.5).slice(0,size-1);
  const ps=[{id:0,name:"Bạn",bot:false}].concat(names.map((n,i)=>({id:i+1,name:n,bot:true}))).sort(()=>Math.random()-.5);
  const r0=[];for(let i=0;i<ps.length;i+=2)r0.push({a:ps[i].id,b:ps[i+1].id,w:null});
  TOUR={size,ps,rounds:[r0],third:null,final:null,last:{},out:{},done:false};
  tourBracket();
}
const tourP=id=>TOUR.ps.find(p=>p.id===id);
function tourRoundName(n){return n===8?"VÒNG 1/8":n===4?"TỨ KẾT":n===2?"BÁN KẾT":"CHUNG KẾT"}
/** trận kế tiếp chưa đấu: theo vòng, rồi tranh hạng 3, rồi chung kết */
function tourNext(){
  const T=TOUR;
  for(const [ri,R] of T.rounds.entries()){if(R.length===1&&T.rounds.length>1&&ri===T.rounds.length-1)break;const i=R.findIndex(m=>m.w===null);if(i>=0)return{m:R[i],label:tourRoundName(R.length)}}
  if(T.third&&T.third.w===null)return{m:T.third,label:"TRANH HẠNG 3"};
  if(T.final&&T.final.w===null)return{m:T.final,label:"CHUNG KẾT"};
  return null;
}
function tourAdvance(){
  const T=TOUR,R=T.rounds[T.rounds.length-1];
  if(R.some(m=>m.w===null))return;
  if(R.length>2){const nr=[];for(let i=0;i<R.length;i+=2)nr.push({a:R[i].w,b:R[i+1].w,w:null});T.rounds.push(nr);return}
  if(R.length===2&&!T.final){const lo=R.map(m=>m.w===m.a?m.b:m.a);T.third={a:lo[0],b:lo[1],w:null};T.final={a:R[0].w,b:R[1].w,w:null};T.rounds.push([T.final])}
}
function tourResult(m,w){m.w=w;tourAdvance()}
function tourOffers(rar){return BALLS.filter(b=>b.rar===rar).sort(()=>Math.random()-.5).slice(0,5)}

/* — sơ đồ nhánh — */
function tourBracket(note){
  const T=TOUR,nx=tourNext();
  if(!nx)return tourFinish();
  const card=(m,hl)=>{const A=tourP(m.a),B=tourP(m.b),row=(p,won)=>`<div style="display:flex;justify-content:space-between;gap:8px;padding:5px 8px;border-radius:8px;${won?"background:color-mix(in srgb,var(--gold),transparent 80%);color:var(--gold)":m.w!==null?"opacity:.45":""}${p&&!p.bot?";font-weight:800;color:var(--you)":""}"><span>${p?esc(p.name):"—"}</span>${won?"<b>✓</b>":""}</div>`;
    return`<div style="border:1px solid ${hl?"var(--you)":"var(--line2)"};border-radius:12px;background:var(--panel);padding:4px;min-width:150px;flex-shrink:0;${hl?"box-shadow:0 0 18px color-mix(in srgb,var(--you),transparent 60%)":""}">${row(A,m.w!==null&&m.w===m.a)}${row(B,m.w!==null&&m.w===m.b)}</div>`};
  const cols=T.rounds.map(R=>`<div style="display:flex;flex-direction:column;justify-content:space-around;gap:10px;flex-shrink:0"><span class="idx" style="text-align:center">${R===T.rounds[T.rounds.length-1]&&T.final&&R[0]===T.final?"CHUNG KẾT":tourRoundName(R.length)}</span>${R.map(m=>card(m,m===nx.m)).join("")}</div>`).join("");
  const third=T.third?`<div style="display:flex;flex-direction:column;gap:10px;justify-content:center;flex-shrink:0"><span class="idx" style="text-align:center">TRANH HẠNG 3</span>${card(T.third,T.third===nx.m)}</div>`:"";
  const A=tourP(nx.m.a),B=tourP(nx.m.b),mine=!A.bot||!B.bot,alive=T.rounds.every(R=>R.every(m=>!(m.w!==null&&(m.a===0||m.b===0)&&m.w!==0)));
  $("#layer").innerHTML=`<div class="overlay" id="tourBr"><div class="sheet" style="width:min(980px,100%);max-height:94vh;overflow:auto">
    <span class="idx"><b>(GIẢI BOT · ${T.size} NGƯỜI)</b>${note?" — "+note:""}</span><h2>SƠ ĐỒ <em>NHÁNH</em></h2>
    <div style="display:flex;gap:16px;overflow-x:auto;padding-bottom:8px;flex-shrink:0">${cols}${third}</div>
    <div class="stat" style="flex-direction:row;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;flex-shrink:0"><span><span class="idx">Trận tiếp theo · ${nx.label}</span><br><span style="font:800 18px var(--font-display)">${esc(A.name)} <span style="color:var(--muted);font-size:13px">vs</span> ${esc(B.name)}</span></span>
      <span style="display:flex;gap:8px;flex-wrap:wrap">${mine?`<button class="btn btn-main mag" id="tPlay">Vào trận ⟶</button>`:`<button class="btn btn-ghost mag" id="tSim">Mô phỏng</button><button class="btn btn-ghost mag" id="tSimAll">${alive?"Mô phỏng tới trận của bạn":"Mô phỏng hết"}</button><button class="btn btn-main mag" id="tWatch">Xem trận ⟶</button>`}</span></div>
    <div class="row-end"><button class="btn btn-ghost mag" id="tQuit">Bỏ giải</button></div></div></div>`;
  if($("#tPlay"))$("#tPlay").onclick=()=>{sfx.click();tourPlayerPick(nx)};
  if($("#tWatch"))$("#tWatch").onclick=()=>{sfx.click();tourWatch(nx)};
  if($("#tSim"))$("#tSim").onclick=()=>{sfx.click();tourSimOne(nx);tourBracket()};
  if($("#tSimAll"))$("#tSimAll").onclick=()=>{sfx.click();let n=tourNext();while(n){const A=tourP(n.m.a),B=tourP(n.m.b);if(!A.bot||!B.bot)break;tourSimOne(n);n=tourNext()}tourBracket()};
  $("#tQuit").onclick=()=>{const b=$("#tQuit");if(b.dataset.arm){TOUR=null;closeLayer();renderTab();return}b.dataset.arm=1;b.textContent="Bấm lần nữa để bỏ"};
  bindFx($("#layer"));
}
/* mô phỏng tức thì một trận bot vs bot (không vẽ, không tiếng) */
function tourSimDuel(dA,dB,arena){
  const mu=S.muted,fx=FXQ,m0=M;S.muted=true;FXQ=FXQ_LV.low;let w=-1;
  try{for(let tries=0;tries<3&&w===-1;tries++){M={mode:"sim",round:1,score:[0,0]};newFight(dA,1,dB,1);setArena(arena);G.count=0;G.watch0=true;G.botOD0=rand(5,15);G.pODn=0;
    let n=0;while(!G.over&&n<120*200){step(DT);n++;if(n%10===0)stepFx(DT*10)}w=G.winner}}
  finally{S.muted=mu;FXQ=fx;M=m0}
  return w===-1?(Math.random()<.5?0:1):w;
}
function tourSimOne(nx){
  const rar=pick(RARS),dA=pick(tourOffers(rar)),dB=pick(tourOffers(rar));
  const w=tourSimDuel(dA,dB,pick(ARENA_IDS));TOUR.last[nx.m.a]=dA;TOUR.last[nx.m.b]=dB;
  tourResult(nx.m,w===0?nx.m.a:nx.m.b);
}
/* — người chơi chọn bóng — */
function tourPlayerPick(nx){
  const rar=pick(RARS),youA=!tourP(nx.m.a).bot,opp=tourP(youA?nx.m.b:nx.m.a),offers=tourOffers(rar),botDef=pick(tourOffers(rar));
  $("#layer").innerHTML=`<div class="overlay"><div class="draft">
    <div class="head"><div><span class="idx"><b>${nx.label}</b> — gặp ${esc(opp.name)} · độ hiếm ${RAR_VN[rar]} · Lv1</span><h2>CHỌN <em>BÓNG</em></h2></div></div>
    <div class="picks">${offers.map((b,i)=>`<button class="pick" data-r="${b.rar}" data-ti="${i}">${orbHTML(b)}<div class="body"><h3>${b.name}</h3><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">${rarPill(b.rar)}<span class="lv on">LV 1</span></div>
      <div class="mini"><span>HP <b>${b.hp}</b></span><span>ST <b>${b.dmg}</b></span><span>TỐC <b>${b.spd}</b></span></div><p><b>${b.ab.name}.</b> ${b.ab.desc}</p></div></button>`).join("")}</div></div></div>`;
  $$("[data-ti]").forEach(b=>b.onclick=()=>{sfx.click();const me=offers[+b.dataset.ti];closeLayer();tourFight(nx,me,botDef,opp,false)});
  bindFx($("#layer"));
}
function tourWatch(nx){
  const rar=pick(RARS),dA=pick(tourOffers(rar)),dB=pick(tourOffers(rar));
  closeLayer();tourFight(nx,dA,dB,tourP(nx.m.b),true,tourP(nx.m.a));
}
/** chạy 1 trận có hình. watch=true: bot vs bot, người chơi chỉ xem */
function tourFight(nx,dMe,dOpp,opp,watch,pA){
  TOUR.last[watch?pA.id:0]=dMe;TOUR.last[opp.id]=dOpp;
  const cur={mode:"tour",round:1,score:[0,0]};
  cur.onEnd=w=>{if(cur.ended)return;
    if(w===-1){launch();return}
    cur.ended=true;if(raf){cancelAnimationFrame(raf);raf=0}
    $("#match").hidden=true;$("#fP .who b").textContent="Bạn";$("#odBtn").style.display="";auOn=true;
    const winId=w===0?(watch?pA.id:0):opp.id;tourResult(nx.m,winId);
    if(!watch){if(winId===0){sfx.coin();confettiBurst(innerWidth/2,innerHeight*.5,120,["#36E2FF","#FFC23D","#5CF2A8"])}tourBracket(winId===0?"Bạn thắng "+nx.label.toLowerCase()+"!":"Bạn thua — xem tiếp các trận còn lại")}
    else tourBracket(esc(tourP(winId).name)+" thắng");
  };
  cur.onQuit=()=>{if(watch){cur.onEnd(Math.random()<.5?0:1)}else cur.onEnd(1)};
  const launch=()=>{M=cur;launchFight({pDef:dMe,pLv:1,eDef:dOpp,eLv:1,arena:pick(ARENA_IDS),label:nx.label,eName:opp.name,odN:watch?0:1,
    setup:g=>{if(watch){g.watch0=true;g.botOD0=rand(5,15);g.pODn=0}}});
    $("#fP .who b").textContent=watch?pA.name:"Bạn";$("#odBtn").style.display=watch?"none":"";
    $("#pips").innerHTML=`<span class="pip-t">${watch?"ĐANG XEM":nx.label}</span>`};
  launch();
}
/* — kết thúc giải — */
function tourFinish(){
  const T=TOUR;if(T.done)return;T.done=true;
  const f=T.final,th=T.third,first=f.w,second=f.w===f.a?f.b:f.a,third=th?th.w:null;
  const place=first===0?1:second===0?2:third===0?3:0;
  const mult=T.size===4?1:T.size===8?1.6:2.5;
  const rw=TOUR_REW[place]||{c:40,g:0},coins=Math.round(rw.c*mult*TUNEX.coin),gems=Math.round(rw.g*mult*TUNEX.gem);
  S.coins+=coins;S.gems+=gems;if(place===1)S.w++;save();updateWallet();
  const top=[first,second,third].filter(x=>x!==null).map(id=>({name:tourP(id).name,def:T.last[id]||pick(BALLS)}));
  const show=()=>{
    $("#layer").innerHTML=`<div class="overlay"><div class="sheet result ${place===1?"win":""}"><span class="idx">Giải bot ${T.size} người</span><h2>${place===1?"VÔ ĐỊCH":place?"HẠNG "+place:"KẾT THÚC GIẢI"}</h2>
      <div style="display:flex;flex-direction:column;gap:6px;flex-shrink:0">${top.map((p,i)=>`<div class="stat" style="flex-direction:row;justify-content:space-between;flex-shrink:0"><span style="font-weight:800">${["🥇","🥈","🥉"][i]} ${esc(p.name)}</span><small class="idx">${p.def.name}</small></div>`).join("")}</div>
      <div class="rewards"><span class="chip-cur"><span class="coin"></span>+${fmt(coins)}</span>${gems?`<span class="chip-cur"><span class="gem"></span>+${gems}</span>`:""}</div>
      <div class="row-end" style="justify-content:center"><button class="btn btn-ghost mag" id="tHome">Về sảnh</button><button class="btn btn-main mag" id="tAgain">Giải mới ⟶</button></div></div></div>`;
    if(place===1){confettiBurst(innerWidth/2,innerHeight*.5,180,["#36E2FF","#FF4D7A","#FFC23D","#5CF2A8","#C3AEFF"]);flashbang("#FFC23D")}
    $("#tHome").onclick=()=>{TOUR=null;backToLobby()};$("#tAgain").onclick=()=>{sfx.click();tourSetup()};bindFx($("#layer"));
  };
  if(top.length>=3)playCeremony(top,show);else show();
}
