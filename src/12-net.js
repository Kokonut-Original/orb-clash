
/* ═════════════════════════ TOURNAMENT LAN (client) ═════════════════════════
   Server (server/server.js) chạy mô phỏng; client chỉ gửi input và vẽ snapshot (~25 lần/giây, nội suy 100ms).
   Offline vẫn chơi bình thường: mọi thứ ở đây chỉ chạy khi người chơi bấm vào thẻ "Tournament LAN". */
const NET={ws:null,on:false,token:null,me:null,rooms:[],room:null,fight:false,mid:null,side:-1,snaps:[],loc:new Map(),names:["",""],ended:false,ping:0,raf:0,lastT:0,addr:""};
try{NET.token=sessionStorage.getItem("oc.net.token");NET.addr=localStorage.getItem("oc.net.addr")||""}catch(e){}
const netSend=m=>{if(NET.ws&&NET.ws.readyState===1)NET.ws.send(JSON.stringify(m))};
const netName=()=>{try{return localStorage.getItem("oc.net.name")||"Người chơi"}catch(e){return"Người chơi"}};

/* — hook vào giao diện cũ — */
(function(){
  const rt=renderTab;
  renderTab=function(){rt();if(tab!=="play")return;const modes=document.querySelector(".modes");if(!modes)return;
    modes.insertAdjacentHTML("afterbegin",`<button class="mode tilt rv" id="goNet" style="--mc:#36E2FF;grid-column:1/-1"><span class="idx"><b>(LAN)</b> — Chế độ mới</span><h3>TOUR<em>NAMENT</em></h3><p>Giải đấu loại trực tiếp: chơi LAN với bạn bè (Radmin VPN) hoặc đấu giải offline với bot 4 / 8 / 16 người, cuối giải trao cúp.</p><span class="m-go">⟶</span></button>`);
    $("#goNet").onclick=()=>{sfx.click();tourOpen()};bindFx(modes)};
  const od=$("#odBtn"),odOld=od.onclick;
  od.onclick=function(){if(NET.fight){if(NET.side<0||G.count>0||G.over)return;netSend({t:"od"});return}return odOld.apply(this,arguments)};
  const tb=tapBox;
  tapBox=function(e){
    if(!NET.fight)return tb(e);
    if(NET.side<0||!G.boxes.length||G.count>0||G.over)return false;
    const r=cv.getBoundingClientRect(),lx=(e.clientX-r.left)/r.width*(W+PAD*2)-PAD,ly=(e.clientY-r.top)/r.height*(H+PAD*2)-PAD;
    for(const b of G.boxes)if(Math.hypot(b.x-lx,b.y-ly)<60){netSend({t:"box",x:lx,y:ly});ring(b.x,b.y,40,8,NET.side?"#FF4D7A":"#36E2FF",.35,3);sfx.click();return true}
    return false};
})();

/* — kết nối — */
function netConnect(addr){
  return new Promise((res,rej)=>{
    let url;try{url=(addr.startsWith("ws")?addr:"ws://"+addr.replace(/^https?:\/\//,"").replace(/\/$/,""))}catch(e){return rej(e)}
    let ws;try{ws=new WebSocket(url)}catch(e){return rej(e)}
    const to=setTimeout(()=>{try{ws.close()}catch(e){}rej(new Error("Hết giờ chờ"))},5000);
    ws.onopen=()=>{clearTimeout(to);NET.ws=ws;NET.on=true;NET.addr=addr;try{localStorage.setItem("oc.net.addr",addr)}catch(e){}netSend({t:"hello",token:NET.token,name:netName()})};
    ws.onmessage=ev=>{let m;try{m=JSON.parse(ev.data)}catch(e){return}if(m.t==="welcome"){NET.me=m;NET.token=m.token;try{sessionStorage.setItem("oc.net.token",m.token)}catch(e){}res(m)}netOnMsg(m)};
    ws.onerror=()=>{clearTimeout(to);rej(new Error("Không kết nối được"))};
    ws.onclose=()=>{NET.on=false;NET.ws=null;if(NET.fight){netStopFight();toast("Mất kết nối server")}if($("#netOv"))netView()};
  });
}
function netOnMsg(m){
  switch(m.t){
    case"rooms":NET.rooms=m.rooms;if($("#netOv")&&!NET.room)netView();break;
    case"room":NET.room=m.room;if(!NET.fight&&!$("#pickOv"))netView();break;
    case"left":NET.room=null;netStopFight();netView();break;
    case"err":toast(m.txt);break;
    case"note":toast(m.txt);break;
    case"offer":netPick(m);break;
    case"picked":{const o=$("#pickOv");if(o)o.querySelector(".idx b").textContent="Đã chọn — chờ đối thủ…";break}
    case"mstart":netStart(m);break;
    case"s":if(m.m===NET.mid)netSnap(m);break;
    case"mend":if(m.m===NET.mid)netEnd(m);break;
    case"result":break;
  }
}

/* — màn sảnh — */
function netOpen(){
  $("#layer").innerHTML=`<div class="overlay" id="netOv"><div class="sheet" id="netSheet" style="width:min(640px,100%)"></div></div>`;
  netView();
}
function netView(){
  const sh=$("#netSheet");if(!sh)return;
  const close=`<button class="btn btn-ghost mag" id="netClose">Đóng</button>`;
  if(!NET.on){
    const def=NET.addr||(location.protocol.startsWith("http")&&location.host?location.host:"");
    sh.innerHTML=`<span class="idx"><b>(LAN)</b> — Kết nối</span><h2>TOUR<em>NAMENT</em></h2>
      <p style="color:var(--muted)">Nhập địa chỉ server của người host (VD <b>26.12.34.56:8787</b> — IP Radmin của host). Nếu bạn mở game từ địa chỉ đó thì đã điền sẵn.</p>
      <input id="netAddr" class="code-input" style="font-size:18px" placeholder="IP:cổng" value="${esc(def)}" autocomplete="off">
      <input id="netNick" class="code-input" style="font-size:18px" placeholder="Tên của bạn" value="${esc(netName())}" maxlength="16" autocomplete="off">
      <div class="row-end">${close}${window.orbDesktop?`<button class="btn btn-ghost mag" id="netHost">Tạo giải (host)</button>`:""}<button class="btn btn-main mag" id="netGo">Kết nối ⟶</button></div><span class="idx" id="netErr" style="color:var(--foe)"></span>`;
    if($("#netHost"))$("#netHost").onclick=async()=>{const n=$("#netNick").value.trim()||"Người chơi";try{localStorage.setItem("oc.net.name",n)}catch(e){}
      $("#netHost").disabled=true;const r=await window.orbDesktop.startServer(8787);if(r.error){$("#netHost").disabled=false;$("#netErr").textContent=r.error;return}
      NET.hostIps=r.ips.map(x=>x.ip+":"+r.port);try{await netConnect("localhost:"+r.port);netSend({t:"create",size:4,fmt:"bracket"});netView()}catch(e){$("#netHost").disabled=false;$("#netErr").textContent=e.message}};
    $("#netGo").onclick=async()=>{const a=$("#netAddr").value.trim(),n=$("#netNick").value.trim()||"Người chơi";if(!a)return;try{localStorage.setItem("oc.net.name",n)}catch(e){}
      $("#netGo").disabled=true;try{await netConnect(a);netView()}catch(e){$("#netGo").disabled=false;$("#netErr").textContent=e.message}};
  }else if(!NET.room){
    sh.innerHTML=`<span class="idx"><b>(LAN)</b> — ${esc(NET.me.name)} · đã kết nối</span><h2>PHÒNG <em>ĐANG MỞ</em></h2>
      <div id="netRooms" style="display:flex;flex-direction:column;gap:8px;max-height:36vh;overflow:auto">${NET.rooms.length?NET.rooms.map(r=>`<div class="stat" style="flex-direction:row;align-items:center;justify-content:space-between;gap:12px;flex-shrink:0"><span><b>${esc(r.name)}</b><br><small class="idx">Host ${esc(r.host)} · ${r.n}/${r.size} · ${r.fmt==="groups"?"Vòng bảng":"Đấu loại"} · ${RAR_VN[r.rar]}${r.state!=="lobby"?" · đang đấu":""}</small></span><button class="btn btn-main mag" data-j="${r.id}" ${r.state!=="lobby"||r.n>=r.size?"disabled":""}>Vào</button></div>`).join(""):`<span class="idx">Chưa có phòng nào. Hãy tạo phòng mới.</span>`}</div>
      <div class="diff" role="group" style="flex-shrink:0"><button class="mag" data-sz="4" aria-pressed="true"><b>4 người</b><small>Bán kết + chung kết + hạng 3</small></button><button class="mag" data-sz="12" aria-pressed="false"><b>12 người</b><small>Nhánh 16 hoặc vòng bảng</small></button></div>
      <div class="diff" id="netFmtRow" role="group" style="flex-shrink:0" hidden><button class="mag" data-fmt="bracket" aria-pressed="true"><b>Nhánh đấu</b><small>16 chỗ, 4 người miễn vòng 1</small></button><button class="mag" data-fmt="groups" aria-pressed="false"><b>Vòng bảng</b><small>4 bảng × 3, nhất bảng vào bán kết</small></button></div>
      <div class="row-end">${close}<button class="btn btn-ghost mag" id="netRef">Làm mới</button><button class="btn btn-main mag" id="netMk">Tạo phòng</button></div>`;
    let sz=4,fmt="bracket";
    $$("[data-sz]").forEach(b=>b.onclick=()=>{sz=+b.dataset.sz;$$("[data-sz]").forEach(x=>x.setAttribute("aria-pressed",x===b));$("#netFmtRow").hidden=sz!==12;sfx.click()});
    $$("[data-fmt]").forEach(b=>b.onclick=()=>{fmt=b.dataset.fmt;$$("[data-fmt]").forEach(x=>x.setAttribute("aria-pressed",x===b));sfx.click()});
    $$("[data-j]").forEach(b=>b.onclick=()=>netSend({t:"join",room:b.dataset.j}));
    $("#netMk").onclick=()=>netSend({t:"create",size:sz,fmt});$("#netRef").onclick=()=>netSend({t:"rooms"});
  }else{
    const r=NET.room,host=r.hostId===NET.me.id;
    sh.innerHTML=`<span class="idx"><b>(PHÒNG)</b> — ${esc(r.name)} · ${r.n}/${r.size} · bóng độ hiếm <b style="color:var(--r-${r.rar})">${RAR_VN[r.rar]}</b></span><h2>SẢNH <em>CHỜ</em></h2>
      <div style="display:flex;flex-direction:column;gap:8px;flex-shrink:0">${r.players.map(p=>`<div class="stat" style="flex-direction:row;justify-content:space-between;flex-shrink:0"><b>${esc(p.name)}${p.id===r.hostId?" ★":""}${p.id===NET.me.id?" (bạn)":""}</b><small class="idx">${p.on?"online":"mất kết nối"}</small></div>`).join("")}</div>
      ${NET.hostIps?`<p class="idx" style="flex-shrink:0">Gửi cho bạn bè nhập: <b>${NET.hostIps.map(esc).join(" &nbsp;·&nbsp; ")}</b> (ưu tiên IP Radmin 26.x.x.x)</p>`:""}<p style="color:var(--muted)">${host?(r.n>=2?"Bạn là host — bấm bắt đầu để mở trận (Giai đoạn 1: 2 người đầu đấu trận thử).":"Chờ thêm người vào…"):"Chờ host bắt đầu…"}</p>
      <div class="row-end"><button class="btn btn-ghost mag" id="netLeave">Rời phòng</button>${host?`<button class="btn btn-main mag" id="netStart" ${r.n<2?"disabled":""}>Bắt đầu ⟶</button>`:""}</div>`;
    $("#netLeave").onclick=()=>netSend({t:"leave"});if($("#netStart"))$("#netStart").onclick=()=>netSend({t:"start"});
  }
  const c=$("#netClose");if(c)c.onclick=()=>{if(NET.room)netSend({t:"leave"});if(NET.ws)NET.ws.close();NET.room=null;closeLayer()};
  bindFx($("#layer"));
}

/* — chọn bóng (1 trong 5, giấu lựa chọn, có đếm giờ) — */
function netPick(m){
  const info=NET.me.info.balls;NET.mid=m.m;NET.side=m.side;
  $("#layer").innerHTML=`<div class="overlay" id="pickOv"><div class="draft">
    <div class="head"><div><span class="idx"><b>Chọn bóng</b> — gặp ${esc(m.opp.name)} · <span id="pickT"></span></span><h2>CHỌN <em>BÓNG</em></h2></div></div>
    <div class="picks">${m.ids.map((id,i)=>{const b=BY_ID[id];return`<button class="pick" data-r="${b.rar}" data-i="${i}">${orbHTML(b)}<div class="body"><h3>${b.name}</h3><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">${rarPill(b.rar)}<span class="lv on">LV 1</span></div>
      <div class="mini"><span>HP <b>${b.hp}</b></span><span>ST <b>${b.dmg}</b></span><span>TỐC <b>${b.spd}</b></span></div><p><b>${b.ab.name}.</b> ${b.ab.desc}</p></div></button>`}).join("")}</div></div></div>`;
  const t0=performance.now(),el=$("#pickT");let done=false;
  const iv=setInterval(()=>{if(!el.isConnected||done){clearInterval(iv);return}el.textContent=Math.max(0,Math.ceil((m.ms-(performance.now()-t0))/1000))+"s"},200);
  $$("[data-i]").forEach(b=>b.onclick=()=>{if(done)return;done=true;sfx.click();$$("[data-i]").forEach(x=>x.disabled=true);b.classList.add("on");b.style.outline="2px solid var(--you)";netSend({t:"pick",i:+b.dataset.i})});
  bindFx($("#layer"));
}

/* — trận — */
function netStart(m){
  netStopFight(true);
  NET.fight=true;NET.mid=m.m;NET.side=m.side;NET.ended=false;NET.snaps=[];NET.names=m.p.map(p=>p.name);
  if(raf){cancelAnimationFrame(raf);raf=0}
  M={mode:"net",round:1,score:[0,0],onQuit:()=>{netStopFight();closeLayer();$("#match").hidden=true;auOn=true;renderTab();netOpen()}};
  closeLayer();$("#match").hidden=false;auOn=false;stopShowcase();fitCanvas();
  newFight(BY_ID[m.balls[0]],1,BY_ID[m.balls[1]],1);setArena(m.arena);G.botOD=Infinity;G.label="TOURNAMENT";G.count=3.6;
  NET.loc=new Map([[G.mains[0].uid,G.mains[0]],[G.mains[1].uid,G.mains[1]]]);
  delete $("#fP").dataset.mim;delete $("#fB").dataset.mim;
  fillFighter($("#fP"),G.mains[0].def,1);fillFighter($("#fB"),G.mains[1].def,1);
  $("#fP .who b").textContent=m.p[0].name+(m.side===0?" (bạn)":"");$("#fB .who b").textContent=m.p[1].name+(m.side===1?" (bạn)":"");
  $("#pips").innerHTML=`<span class="pip-t">${m.side<0?"ĐANG XEM":"1 HIỆP"}</span>`;
  $("#bossBar").hidden=true;$("#odBtn").style.display=m.side<0?"none":"";setOD(1);
  NET.lastT=performance.now();NET.raf=requestAnimationFrame(netLoop);
}
function netStopFight(keep){NET.fight=false;$("#fP .who b").textContent="Bạn";if(NET.raf){cancelAnimationFrame(NET.raf);NET.raf=0}if(!keep){$("#odBtn").style.display=""}}
function netSnap(s){
  NET.snaps.push({at:performance.now(),s});if(NET.snaps.length>12)NET.snaps.shift();
  for(const e of s.ev)netReplay(e);
}
function netBall(sn){
  let b=NET.loc.get(sn.u);
  if(!b){b=makeBall(BY_ID[sn.d],sn.lv,sn.sd,sn.x,sn.y,{kind:sn.k,r:sn.r,hp:sn.mx});b.uid=sn.u;NET.loc.set(sn.u,b);G.balls.push(b)}
  return b;
}
const _ba=(a,b,k)=>a+(b-a)*k;
function netApply(){
  const S2=NET.snaps;if(!S2.length)return;
  const T=performance.now()-100;let a=S2[0],b=S2[S2.length-1];
  for(let i=0;i<S2.length-1;i++)if(S2[i].at<=T&&S2[i+1].at>=T){a=S2[i];b=S2[i+1];break}
  if(T>b.at)a=b;
  const k=a===b?1:clamp((T-a.at)/(b.at-a.at),0,1),sb=b.s,sa=a.s;
  G.t=sb.gt;G.ot=sb.ot;G.bd=sb.bd;G.over=!!sb.over;G.winner=sb.win;
  if(G.count>0&&sb.c<=0){G.go=.9;G.shake=14;G.screen=.35;sfx.boom(true)}
  if(sb.c!==G.count&&sb.c>0){const bf=Math.ceil(G.count-.6);G.count=sb.c;const nw=Math.ceil(G.count-.6);if(nw!==bf&&nw>=0)sfx.count(nw)}else G.count=sb.c;
  if(NET.side>=0){const n=sb.od[NET.side];if(n!==G.pODn){G.pODn=n;setOD(n)}}
  const prevA=new Map(sa.balls.map(x=>[x.u,x])),seen=new Set();
  for(const sn of sb.balls){
    const lb=netBall(sn),pa=prevA.get(sn.u)||sn;seen.add(sn.u);
    lb.x=_ba(pa.x,sn.x,k);lb.y=_ba(pa.y,sn.y,k);lb.vx=sn.vx;lb.vy=sn.vy;lb.r=sn.r;lb.hp=sn.hp;lb.max=sn.mx;lb.cd=sn.cd;
    if(lb.alive&&!sn.al)kill(lb);
    lb.alive=!!sn.al;lb.flash=sn.fl?.1:Math.max(0,lb.flash-.016);lb.st=sn.st;lb.mem=Object.assign({},sn.mem);
    lb.owner=sn.ow?NET.loc.get(sn.ow):null;lb.abSrc=sn.mm?BY_ID[sn.mm].ab:null;lb.sc=lvScale(sn.lv);
    if(sn.mods&&!lb.mods)lb.mods={};
    lb.trail.push(lb.x,lb.y);if(lb.trail.length>24)lb.trail.splice(0,2);
    lb.spin+=Math.hypot(sn.vx,sn.vy)*.016/Math.max(8,sn.r);
  }
  G.balls=G.balls.filter(x=>seen.has(x.uid)||x.kind==="main");
  for(const x of G.balls)if(!seen.has(x.uid)&&x.kind!=="main")NET.loc.delete(x.uid);
  G.proj=sb.pj.map(p=>{const tr=[];for(let i=7;i>=0;i--)tr.push(p.x-p.vx*i*.007,p.y-p.vy*i*.007);return{skin:p.sk,el:p.el,kind:p.kd,x:p.x,y:p.y,vx:p.vx,vy:p.vy,r:p.r,c:p.c,a:p.a,t:p.t,side:p.sd,trail:tr}});
  G.zones=sb.zn.map(z=>({kind:z.kd,x:z.x,y:z.y,r:z.r,life:z.life,t:z.t,c:z.c,arm:z.arm,draw:z.dk?(q,f)=>glowAt(q.x,q.y,q.r*1.2,q.c,.35*f):null}));
  G.lines=sb.ln.map(L=>Object.assign({},L,{fired:!!L.fired,both:!!L.both}));
  G.blasts=sb.bl.map(z=>({kind:z.kd,x:z.x,y:z.y,r:z.r,t:z.t,delay:z.delay,c:z.c,fx:z.fx||z.x,fy:z.fy||z.y-300}));
  G.tethers=sb.te.map(t=>({a:NET.loc.get(t.a),b:NET.loc.get(t.b)})).filter(t=>t.a&&t.b);
  G.spikes=sb.sp.map(s=>Object.assign({},s,{side:s.sd}));
  G.boxes=sb.bx.map(x=>Object.assign({r:18},x));
}
/* phát lại hiệu ứng từ server (không gây sát thương: explode truyền dmg=0) */
function netReplay(e){
  const [n,...a]=e,L=x=>x&&typeof x==="object"&&x.u!==undefined?NET.loc.get(x.u):x;
  try{
    if(n==="explode"){explode(a[0],a[1],a[2],0,null,a[5],a[6]||{})}
    else if(n==="impact")impact(...a);
    else if(n==="ring")ring(...a);else if(n==="sparkBurst")sparkBurst(...a);else if(n==="burst")burst(...a);
    else if(n==="ripple")ripple(...a);else if(n==="decal")decal(...a);else if(n==="beam")beam(...a);
    else if(n==="floater"){const b=L(a[0]);if(b)floater(b,a[1],a[2],a[3])}
    else if(n==="castFx"){const b=L(a[0]);if(b)castFx(b)}
    else if(n==="kill"){const b=L(a[0]);if(b&&b.alive)kill(b)}
    else if(n==="overdrive"){const b=L(a[0]);if(b){ring(b.x,b.y,b.r,b.r+90,b.side===0?"#36E2FF":"#FF4D7A",.6,6);ring(b.x,b.y,b.r,b.r+50,"#ffffff",.4,3);
      G.texts.push({x:b.x,y:b.y-b.r-26,txt:"DỒN LỰC!",kind:b.side?"cfoe":"cyou",t:0,big:true});G.speed={x:b.x,y:b.y,t:0};G.chroma=Math.max(G.chroma,.25);G.shake+=8;sfx.whoosh()}}
    else if(n==="openBox"){const box=a[0],b=L(a[1]);if(box&&b){const col=box.trap?"#FF5470":box.c;G.flashes.push({x:box.x,y:box.y,r:90,t:0,dur:.25,c:col});ring(box.x,box.y,8,80,col,.45,5);sparkBurst(box.x,box.y,[col,"#ffffff","#FFE14F"],34,560);sfx.click()}}
  }catch(err){}
}
function netLoop(ts){
  NET.raf=requestAnimationFrame(netLoop);
  const dt=clamp((ts-NET.lastT)/1000||0,0,.05);NET.lastT=ts;
  netApply();stepFx(dt);G.t+=0;render();updateHUD();
}
function netEnd(m){
  if(NET.ended)return;NET.ended=true;
  setTimeout(()=>{
    const win=NET.side>=0&&m.win===NET.side,name=NET.names[m.win];
    netStopFight();$("#match").hidden=true;auOn=true;
    $("#layer").innerHTML=`<div class="overlay"><div class="sheet result ${win?"win":""}"><span class="idx">${m.why==="dc"?"Đối thủ mất kết nối":"Kết thúc trận"}</span><h2>${NET.side<0?esc(name)+" THẮNG":win?"CHIẾN THẮNG":"THẤT BẠI"}</h2>
      <div class="row-end" style="justify-content:center"><button class="btn btn-main mag" id="netBack">Về sảnh chờ ⟶</button></div></div></div>`;
    if(win){confettiBurst(innerWidth/2,innerHeight*.5,160,["#36E2FF","#FF4D7A","#FFC23D","#5CF2A8","#C3AEFF"]);flashbang("#FFC23D")}
    $("#netBack").onclick=()=>{netOpen()};bindFx($("#layer"));
  },m.why?200:1800);
}
