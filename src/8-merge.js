
/* ═════════════════════════════════════════════════════════════
   HỢP THỂ — 2 bóng khác nhau cùng độ hiếm → 1 bóng ngẫu nhiên bậc kế tiếp
   Kết quả: thành công / thất bại (mất 1 quả) / vỡ (mất cả 2)
   ═════════════════════════════════════════════════════════════ */
const MERGE={common:{ok:80,fail:0,brk:20,cost:5},rare:{ok:65,fail:5,brk:30,cost:10},epic:{ok:50,fail:10,brk:40,cost:20},legendary:{ok:35,fail:15,brk:50,cost:40}};
const nextRar=r=>RARS[RARS.indexOf(r)+1];
let MG={a:null,b:null,filter:"all"};

function copiesOf(id){return S.owned[id]?Math.max(1,S.copies[id]||1):0}
function removeCopy(id){const n=copiesOf(id)-1;if(n<=0){delete S.owned[id];delete S.copies[id]}else S.copies[id]=n}
/** Nhận 1 bản bóng: bản mới, hoặc +1 bản và +1 cấp nếu đã có. */
function grantBall(id){
  const before=S.owned[id]||0;S.copies[id]=(before?copiesOf(id):0)+1;
  if(!before){S.owned[id]=1;return{type:"new",copies:1}}
  if(before<MAX_LV){S.owned[id]=before+1;return{type:"up",from:before,to:before+1,copies:S.copies[id]}}
  return{type:"max",copies:S.copies[id]};
}

/* — nền thiên hà — */
let galRaf=0;
function stopGalaxy(){if(galRaf){cancelAnimationFrame(galRaf);galRaf=0}}
function startGalaxy(c){
  const g=c.getContext("2d");let w=0,h=0,stars=[],shoot=null;
  const fit=()=>{const r=c.getBoundingClientRect(),d=Math.min(2,devicePixelRatio||1);w=r.width;h=r.height;c.width=w*d;c.height=h*d;g.setTransform(d,0,0,d,0,0);
    const R=srng(42);stars=Array.from({length:Math.round(w*h/2600)},()=>({x:R()*w,y:R()*h,s:R()*1.4+.2,p:R()*TAU,v:R()*2+.5,c:R()<.15?"#C3AEFF":R()<.1?"#9FD8FF":"#FFFFFF"}))};
  fit();const ro=new ResizeObserver(fit);ro.observe(c);
  (function f(ts){galRaf=requestAnimationFrame(f);if(!c.isConnected){ro.disconnect();stopGalaxy();return}const t=ts/1000;
    const bg=g.createLinearGradient(0,0,w,h);bg.addColorStop(0,"#05030D");bg.addColorStop(.5,"#0A0620");bg.addColorStop(1,"#030208");g.fillStyle=bg;g.fillRect(0,0,w,h);
    g.globalCompositeOperation="lighter";
    for(const [x,y,r,col] of [[.25+Math.sin(t*.05)*.05,.3,.55,"rgba(107,75,255,.16)"],[.78,.62+Math.cos(t*.04)*.05,.5,"rgba(255,77,170,.10)"],[.55,.12,.35,"rgba(54,180,255,.08)"],[.15,.85,.4,"rgba(140,90,255,.10)"]]){const gr=g.createRadialGradient(x*w,y*h,0,x*w,y*h,r*Math.max(w,h));gr.addColorStop(0,col);gr.addColorStop(1,"rgba(0,0,0,0)");g.fillStyle=gr;g.fillRect(0,0,w,h)}
    // dải ngân hà
    g.save();g.translate(w/2,h/2);g.rotate(-.35);const band=g.createLinearGradient(0,-h*.18,0,h*.18);band.addColorStop(0,"rgba(255,255,255,0)");band.addColorStop(.5,"rgba(200,190,255,.06)");band.addColorStop(1,"rgba(255,255,255,0)");g.fillStyle=band;g.fillRect(-w,-h*.18,w*2,h*.36);g.restore();
    for(const s of stars){const a=.35+.65*Math.abs(Math.sin(t*s.v+s.p));g.globalAlpha=a;g.fillStyle=s.c;g.beginPath();g.arc(s.x,s.y,s.s,0,TAU);g.fill();if(s.s>1.3){g.globalAlpha=a*.35;g.fillRect(s.x-s.s*3,s.y-.4,s.s*6,.8);g.fillRect(s.x-.4,s.y-s.s*3,.8,s.s*6)}}
    g.globalAlpha=1;
    if(!shoot&&Math.random()<.006)shoot={x:Math.random()*w,y:Math.random()*h*.4,vx:-(300+Math.random()*300),vy:150+Math.random()*120,l:1};
    if(shoot){shoot.x+=shoot.vx/60;shoot.y+=shoot.vy/60;shoot.l-=1/50;const gr=g.createLinearGradient(shoot.x,shoot.y,shoot.x-shoot.vx*.18,shoot.y-shoot.vy*.18);gr.addColorStop(0,`rgba(255,255,255,${shoot.l})`);gr.addColorStop(1,"rgba(255,255,255,0)");g.strokeStyle=gr;g.lineWidth=1.6;g.beginPath();g.moveTo(shoot.x,shoot.y);g.lineTo(shoot.x-shoot.vx*.18,shoot.y-shoot.vy*.18);g.stroke();if(shoot.l<=0)shoot=null}
    g.globalCompositeOperation="source-over";
  })(performance.now());
}

/* — giao diện — */
function viewMerge(){
  return`<div class="view merge-view"><canvas id="galaxy" aria-hidden="true"></canvas>
  <div class="mg-in">
    <div class="head rv"><div><span class="idx"><b>(05)</b> — 2 bóng khác nhau cùng độ hiếm → 1 bóng bậc cao hơn</span><h2>HỢP <em>THỂ</em></h2></div>
      <span class="chip-cur"><span class="gem"></span><span class="num">${fmt(S.gems)}</span></span></div>
    <div class="mg-wrap"><section class="mg-inv rv" id="mgInv"></section><section class="mg-fuse rv" id="mgFuse" style="animation-delay:.1s"></section></div>
    <div class="mg-sticky" id="mgBar"></div>
  </div></div>`;
}
function bindMerge(){startGalaxy($("#galaxy"));renderMergeParts()}
function mgCanUse(id){const b=BY_ID[id];if(b.rar==="mythic")return false;if(!MG.a)return true;return b.rar===BY_ID[MG.a].rar}
function renderMergeParts(){
  if(MG.a&&!S.owned[MG.a])MG.a=null;if(MG.b&&!S.owned[MG.b])MG.b=null;if(!MG.a&&MG.b){MG.a=MG.b;MG.b=null}
  const ids=ownedSorted().filter(id=>MG.filter==="all"||BY_ID[id].rar===MG.filter);
  const total=Object.keys(S.owned).reduce((s,id)=>s+copiesOf(id),0);
  $("#mgInv").innerHTML=`<div class="mg-top"><span class="idx"><b>Kho bóng</b> · ${ownedCount()} loại · ${total} bản</span>
    <div class="chips">${["all",...RARS].map(r=>`<button class="chip" data-mgf="${r}" aria-pressed="${MG.filter===r}">${r==="all"?"Tất cả":`<i style="background:var(--r-${r})"></i>${RAR_VN[r]}`}</button>`).join("")}</div></div>
    <div class="inv-grid">${ids.map(id=>{const b=BY_ID[id],use=mgCanUse(id),sel=id===MG.a||id===MG.b,cp=copiesOf(id);
      return`<button class="inv-b ${use?"":"dim"} ${sel?"sel":""}" data-mg="${id}" style="--rc:var(--r-${b.rar})" ${use||sel?"":'aria-disabled="true"'}>${orbHTML(b)}<b>${b.name}</b><small>LV ${S.owned[id]}</small><span class="cp">×${cp}</span>${b.rar==="mythic"?'<span class="mx">TỐI ĐA</span>':""}</button>`}).join("")||`<p class="idx" style="padding:20px">Không có bóng nào ở độ hiếm này.</p>`}</div>`;
  const A=MG.a&&BY_ID[MG.a],B=MG.b&&BY_ID[MG.b],rar=A?A.rar:null,M=rar&&MERGE[rar],nr=rar&&nextRar(rar);
  const slot=(d,k)=>d?`<button class="slot full" data-slot="${k}" style="--rc:var(--r-${d.rar})">${orbHTML(d)}<b>${d.name}</b>${rarPill(d.rar)}<small class="${copiesOf(d.id)===1?"warn":""}">${copiesOf(d.id)===1?"Bản cuối cùng!":`Còn ×${copiesOf(d.id)}`}</small><span class="x">✕</span></button>`
    :`<div class="slot empty"><span class="plus">+</span><small>${k==="a"?"Chọn quả thứ nhất":A?`Chọn 1 quả ${RAR_VN[rar]} khác`:"Chọn quả thứ hai"}</small></div>`;
  const rateRow=(lbl,v,cls)=>`<div class="rate ${cls}"><span>${lbl}</span><div class="rbar"><i style="width:${v}%"></i></div><b class="num">${v}%</b></div>`;
  const can=A&&B&&S.gems>=M.cost;
  $("#mgFuse").innerHTML=`<div class="slots">${slot(A,"a")}<span class="amp">+</span>${slot(B,"b")}</div>
    <svg class="arrow" viewBox="0 0 60 70" aria-hidden="true"><path d="M20 0h20v38h16L30 68 4 38h16z"/></svg>
    <div class="slot res ${nr?"on":""}" style="--rc:${nr?`var(--r-${nr})`:"var(--line2)"}"><span class="q">?</span><small>${nr?`1 bóng <b>${RAR_VN[nr]}</b> ngẫu nhiên`:"Kết quả"}</small></div>
    ${M?`<div class="rates">${rateRow("Thành công",M.ok,"ok")}${rateRow("Thất bại · mất 1 quả",M.fail,"fail")}${rateRow("Vỡ · mất cả 2",M.brk,"brk")}</div>`
      :`<table class="rtab"><thead><tr><th>Độ hiếm</th><th>Thành công</th><th>Mất 1</th><th>Vỡ cả 2</th><th>Phí</th></tr></thead><tbody>${Object.entries(MERGE).map(([r,m])=>`<tr><td><i style="background:var(--r-${r})"></i>${RAR_VN[r]}</td><td>${m.ok}%</td><td>${m.fail}%</td><td>${m.brk}%</td><td>${m.cost}<span class="gem"></span></td></tr>`).join("")}</tbody></table>`}
    <button class="btn btn-play mag fuse-btn" id="fuseBtn" ${can?"":"disabled"}>HỢP THỂ ${M?`<span class="cost"><span class="gem"></span>${M.cost}</span>`:""}</button>
    ${A&&B&&S.gems<M.cost?`<p class="msg err">Cần ${M.cost} Gems, bạn có ${S.gems}.</p>`:""}`;
  $("#mgBar").innerHTML=A?`<div class="mb-o">${orbHTML(A)}<span>+</span>${B?orbHTML(B):`<span class="orb locked"><span>?</span></span>`}</div><div class="mb-t"><b>${B?`${A.name} + ${B.name}`:`Chọn thêm 1 quả ${RAR_VN[rar]}`}</b><small>Thành công ${M.ok}% · Vỡ ${M.brk}%</small></div><button class="btn btn-main" id="fuseBtn2" ${can?"":"disabled"}>HỢP <span class="cost"><span class="gem"></span>${M.cost}</span></button>`:"";
  $("#mgBar").classList.toggle("on",!!A);const fb2=$("#fuseBtn2");if(fb2)fb2.onclick=doMerge;
  $$("[data-mgf]").forEach(b=>b.onclick=()=>{MG.filter=b.dataset.mgf;sfx.click();renderMergeParts()});
  $$("[data-mg]").forEach(b=>b.onclick=()=>mgPick(b.dataset.mg));
  $$("[data-slot]").forEach(b=>b.onclick=()=>{if(b.dataset.slot==="a"){MG.a=MG.b;MG.b=null}else MG.b=null;sfx.click();renderMergeParts()});
  const fb=$("#fuseBtn");if(fb)fb.onclick=doMerge;
  bindFx($("#mgFuse"));
}
function mgPick(id){
  const b=BY_ID[id];
  if(id===MG.a){MG.a=MG.b;MG.b=null;sfx.click();return renderMergeParts()}
  if(id===MG.b){MG.b=null;sfx.click();return renderMergeParts()}
  if(b.rar==="mythic"){toast("Thần thoại là bậc cao nhất, không hợp thể được.");return}
  if(MG.a&&BY_ID[MG.a].rar!==b.rar){toast(`Chỉ ghép được 2 bóng cùng độ hiếm ${RAR_VN[BY_ID[MG.a].rar]}.`);return}
  if(!MG.a)MG.a=id;else MG.b=id;
  sfx.click();renderMergeParts();
}
function doMerge(){
  const A=BY_ID[MG.a],B=BY_ID[MG.b];if(!A||!B||A.id===B.id||A.rar!==B.rar)return;
  const M=MERGE[A.rar];if(!M||S.gems<M.cost)return;
  S.gems-=M.cost;const x=Math.random()*100;let res;
  if(x<M.ok){removeCopy(A.id);removeCopy(B.id);const nb=pick(BALLS.filter(b=>b.rar===nextRar(A.rar)));res={type:"ok",ball:nb,out:grantBall(nb.id)}}
  else if(x<M.ok+M.fail){const lost=Math.random()<.5?A:B;removeCopy(lost.id);res={type:"fail",lost,kept:lost===A?B:A}}
  else{removeCopy(A.id);removeCopy(B.id);res={type:"brk"}}
  save();updateWallet();MG.a=MG.b=null;
  fuseAnim(A,B,res);
}

/* — animation hợp thể — */
function orbOn(g,x,y,r,def,a=1){
  g.save();g.globalAlpha=a;g.globalCompositeOperation="lighter";g.drawImage(glowSprite(def.color),x-r*2.8,y-r*2.8,r*5.6,r*5.6);g.globalCompositeOperation="source-over";
  if(hasSkin(def))drawCreature(g,def,x,y,r,{t:performance.now()/1000,id:1,gx:.45,gy:.3});
  else{
  const gr=g.createRadialGradient(x-r*.38,y-r*.42,r*.06,x,y,r);gr.addColorStop(0,"#ffffff");gr.addColorStop(.18,shade(def.color,.35));gr.addColorStop(.62,def.color);gr.addColorStop(1,shade(def.color,-.6));
  g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,TAU);g.fill();
  drawIcon(g,def,x,y+.5,r)
  }
  g.restore();
}
function fuseAnim(A,B,res){
  $("#layer").innerHTML=`<div class="fuse-ov" id="fuseOv"><canvas id="fuseC"></canvas><div class="fuse-ui" id="fuseUI"><span class="idx fz-k">Đang hợp thể ${A.name} + ${B.name}…</span></div><span class="idx fz-skip">Chạm để tua nhanh</span></div>`;
  const c=$("#fuseC"),g=c.getContext("2d"),d=Math.min(2,devicePixelRatio||1);let w=innerWidth,h=innerHeight;
  const fit=()=>{w=innerWidth;h=innerHeight;c.width=w*d;c.height=h*d;g.setTransform(d,0,0,d,0,0)};fit();addEventListener("resize",fit);
  const R=srng(7),stars=Array.from({length:220},()=>({x:R(),y:R(),s:R()*1.4+.2,p:R()*TAU}));
  const SPIN=3.6,cx=()=>w/2,cy=()=>h*.42,R0=()=>Math.min(w,h)*.2,orbR=()=>Math.max(26,Math.min(w,h)*.06);
  let fzFrames=0,fired=false,t=0,last=performance.now(),ang=0,shown=false,parts=[],rockets=[],shards=[],flash=0,shake=0,tickAcc=0,done=false;
  const trailA=[],trailB=[];
  const skip=()=>{if(t<SPIN-.25)t=SPIN-.25};$("#fuseOv").addEventListener("pointerdown",skip);
  const burstAt=(x,y,cols,n,sp,grav=0)=>{for(let i=0;i<n;i++){const a=rand(0,TAU),s=rand(.2,1)*sp;parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:rand(.8,1.6),max:1.6,c:pick(cols),s:rand(1.5,3.5),grav})}};
  const sweep=()=>tone(160,SPIN,"sawtooth",.035,1400);sweep();
  function outcome(){
    shown=true;const ui=$("#fuseUI");
    if(res.type==="ok"){const nb=res.ball,rc=RC(nb.rar);
      ui.innerHTML=`<div class="fz-top"><span class="banner">HỢP THỂ THÀNH CÔNG</span></div><div class="fz-res ok" style="--rc:${rc}">${rarPill(nb.rar)}<h2>${nb.name}</h2><p>${outLine(res.out)}</p><p class="fz-ab"><b>${nb.ab.name}:</b> ${nb.ab.desc}</p>
        <div class="row-end"><button class="btn btn-ghost mag" id="fzCol">Xem bộ sưu tập</button><button class="btn btn-main mag" id="fzAgain">Hợp tiếp ⟶</button></div></div>`;
      sfx.reveal(nb.rar);flashbang(rc);confettiBurst(innerWidth/2,innerHeight*.45,160,[rc,"#ffffff","#FFC23D","#36E2FF","#FF4D7A"]);if(RARS.indexOf(nb.rar)>=3)quake()}
    else if(res.type==="fail"){
      ui.innerHTML=`<div class="fz-top fail"><span class="fz-t">KHÔNG THÀNH CÔNG</span></div><div class="fz-res fail"><p>Mất 1 bản <b>${res.lost.name}</b>. <b>${res.kept.name}</b> được giữ lại.</p>
        <div class="row-end"><button class="btn btn-ghost mag" id="fzCol">Xem bộ sưu tập</button><button class="btn btn-main mag" id="fzAgain">Thử lại ⟶</button></div></div>`;
      tone(300,.5,"triangle",.06,-150)}
    else{
      ui.innerHTML=`<div class="fz-top brk"><span class="fz-t">VỠ!</span></div><div class="fz-res brk"><p>Năng lượng quá tải. Mất 1 bản <b>${A.name}</b> và 1 bản <b>${B.name}</b>.</p>
        <div class="row-end"><button class="btn btn-ghost mag" id="fzCol">Xem bộ sưu tập</button><button class="btn btn-main mag" id="fzAgain">Thử lại ⟶</button></div></div>`;
      sfx.ko();quake()}
    const close=go=>{done=true;removeEventListener("resize",fit);closeLayer();if(go){tab="collection";$$(".tab").forEach(x=>x.setAttribute("aria-selected",x.dataset.tab==="collection"))}renderTab()};
    $("#fzCol").onclick=()=>close(true);$("#fzAgain").onclick=()=>close(false);bindFx(ui);
    $(".fz-skip").remove();
  }
  (function f(now){
    if(done||!c.isConnected)return;requestAnimationFrame(f);
    const dt=clamp((now-last)/1000,0,.1);last=now;t+=dt;fzFrames++;
    const X=cx(),Y=cy();
    g.fillStyle="#04020B";g.fillRect(0,0,w,h);
    const neb=g.createRadialGradient(X,Y,0,X,Y,Math.max(w,h)*.7);neb.addColorStop(0,`rgba(107,75,255,${.12+Math.min(.25,t/SPIN*.25)})`);neb.addColorStop(1,"rgba(0,0,0,0)");g.fillStyle=neb;g.fillRect(0,0,w,h);
    for(const s of stars){const a=.3+.7*Math.abs(Math.sin(t*1.5+s.p));g.globalAlpha=a;g.fillStyle="#fff";
      if(t<SPIN){const k=Math.pow(t/SPIN,3)*.25,sx=X+(s.x*w-X)*(1-k),sy=Y+(s.y*h-Y)*(1-k);g.fillRect(sx,sy,s.s,s.s)}else{g.fillRect(s.x*w,s.y*h,s.s,s.s)}}
    g.globalAlpha=1;
    g.save();if(shake>0){g.translate(rand(-shake,shake),rand(-shake,shake));shake*=.9}
    if(t<SPIN){
      const k=t/SPIN,wv=1.4+22*Math.pow(k,2.4);ang+=wv*dt;
      const rr=R0()*(k<.55?1:1-Math.pow((k-.55)/.45,1.6)),or=orbR()*(1-.35*Math.pow(k,3));
      const ax=X+Math.cos(ang)*rr,ay=Y+Math.sin(ang)*rr*.85,bx=X-Math.cos(ang)*rr,by=Y-Math.sin(ang)*rr*.85;
      trailA.push(ax,ay);trailB.push(bx,by);if(trailA.length>60){trailA.splice(0,2);trailB.splice(0,2)}
      g.globalCompositeOperation="lighter";
      for(const [tr,col] of [[trailA,A.color],[trailB,B.color]]){for(let i=0;i<tr.length;i+=2){const q=i/tr.length;g.globalAlpha=q*.5;g.fillStyle=col;g.beginPath();g.arc(tr[i],tr[i+1],or*q*.8,0,TAU);g.fill()}}
      g.globalAlpha=Math.min(1,k*1.5);g.drawImage(glowSprite("#C3AEFF"),X-rr*1.4-40,Y-rr*1.4-40,(rr*1.4+40)*2,(rr*1.4+40)*2);
      g.strokeStyle=`rgba(195,174,255,${.15+k*.5})`;g.lineWidth=1.5;g.beginPath();g.ellipse(X,Y,rr+or+10,(rr+or+10)*.85,0,0,TAU);g.stroke();
      g.globalAlpha=1;g.globalCompositeOperation="source-over";
      if(Math.random()<.3+k){const a=rand(0,TAU),r0=Math.max(w,h)*.5;parts.push({x:X+Math.cos(a)*r0,y:Y+Math.sin(a)*r0,vx:-Math.cos(a)*r0*1.2,vy:-Math.sin(a)*r0*1.2,life:.8,max:.8,c:pick([A.color,B.color,"#ffffff"]),s:rand(1,2.5),grav:0})}
      orbOn(g,ax,ay,or,A);orbOn(g,bx,by,or,B);
      tickAcc+=dt*wv*.6;if(tickAcc>1){tickAcc=0;sfx.tick()}
      shake=k>.7?(k-.7)*14:0;
    }else{
      if(!fired){fired=true;flash=1;shake=res.type==="brk"?26:16;sfx.boom();burstAt(X,Y,["#ffffff",A.color,B.color],res.type==="brk"?40:90,900);
        if(res.type==="brk"){for(const d of [A,B])for(let i=0;i<26;i++){const a=rand(0,TAU),s=rand(150,700);shards.push({x:X,y:Y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,r:rand(0,TAU),vr:rand(-12,12),sz:rand(6,18),c:d.color,life:2.2})}}
        if(res.type==="fail"){shards.push({ghost:true,d:res.kept,x:X,y:Y,vx:-200,vy:-40,life:99});shards.push({crack:true,d:res.lost,x:X,y:Y,vx:220,vy:-60,life:2.4,r:0,vr:2})}
        setTimeout(outcome,450)}
      // vòng sóng sau loé sáng
      const tt=t-SPIN;if(tt<1.2){g.strokeStyle=`rgba(255,255,255,${1-tt/1.2})`;g.lineWidth=6*(1-tt/1.2)+1;g.beginPath();g.arc(X,Y,tt*Math.max(w,h)*.6,0,TAU);g.stroke()}
      if(res.type==="ok"){const nb=res.ball,rc=RC(nb.rar),r=orbR()*1.5*Math.min(1,tt*3);
        g.save();g.translate(X,Y);g.rotate(tt*.4);g.globalCompositeOperation="lighter";for(let k=0;k<16;k++){g.rotate(TAU/16);g.fillStyle=hexA(rc.startsWith("#")?rc:"#FFC23D",.08);g.beginPath();g.moveTo(0,0);g.lineTo(-30,-Math.max(w,h));g.lineTo(30,-Math.max(w,h));g.fill()}g.restore();
        if(r>1)orbOn(g,X,Y,r*(1+.04*Math.sin(tt*6)),nb);
        if(tt<4&&Math.random()<dt*2.2)rockets.push({x:rand(w*.1,w*.9),y:h+10,vy:-rand(h*.9,h*1.3),ty:rand(h*.08,h*.45),c:pick([rc,"#FFC23D","#36E2FF","#FF4D7A","#5CF2A8","#ffffff"])})}
    }
    // pháo hoa
    for(const r of rockets){r.y+=r.vy*dt;g.fillStyle=r.c;g.fillRect(r.x-1.5,r.y,3,10);if(r.y<=r.ty){r.dead=true;burstAt(r.x,r.y,[r.c,"#ffffff"],70,320,260);sfx.tap()}}
    rockets=rockets.filter(r=>!r.dead);
    // mảnh vỡ
    for(const s of shards){s.life-=dt;s.x+=s.vx*dt;s.y+=s.vy*dt;
      if(s.ghost){s.vx*=.95;s.vy*=.95;orbOn(g,s.x,s.y,orbR(),s.d,1);continue}
      if(s.crack){s.vy+=500*dt;s.r+=s.vr*dt;g.save();g.translate(s.x,s.y);g.rotate(s.r);orbOn(g,0,0,orbR(),s.d,Math.max(0,s.life/2.4));g.strokeStyle="rgba(10,6,20,.9)";g.lineWidth=3;g.beginPath();g.moveTo(-orbR()*.7,-orbR()*.2);g.lineTo(-orbR()*.1,orbR()*.1);g.lineTo(orbR()*.2,-orbR()*.5);g.moveTo(-orbR()*.1,orbR()*.1);g.lineTo(orbR()*.3,orbR()*.6);g.stroke();g.restore();continue}
      s.vy+=420*dt;s.r+=s.vr*dt;g.save();g.translate(s.x,s.y);g.rotate(s.r);g.globalAlpha=Math.max(0,Math.min(1,s.life));g.fillStyle=s.c;g.beginPath();g.moveTo(0,-s.sz);g.lineTo(s.sz*.7,s.sz*.6);g.lineTo(-s.sz*.6,s.sz*.4);g.closePath();g.fill();g.strokeStyle="rgba(255,255,255,.6)";g.lineWidth=1;g.stroke();g.restore()}
    shards=shards.filter(s=>s.life>0);
    g.globalCompositeOperation="lighter";
    for(const p of parts){p.life-=dt;p.vy+=p.grav*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.985;p.vy*=.985;g.globalAlpha=Math.max(0,p.life/p.max);g.fillStyle=p.c;g.beginPath();g.arc(p.x,p.y,p.s,0,TAU);g.fill()}
    parts=parts.filter(p=>p.life>0);if(parts.length>1800)parts.splice(0,parts.length-1800);
    g.globalAlpha=1;g.globalCompositeOperation="source-over";g.restore();
    if(flash>0){g.fillStyle=res.type==="brk"?`rgba(255,60,90,${flash*.6})`:`rgba(255,255,255,${flash})`;g.fillRect(0,0,w,h);flash=Math.max(0,flash-dt*1.8)}
  })(last);
}
