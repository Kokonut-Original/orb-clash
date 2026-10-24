
/* ═════════════════════════════════════════════════════════════
   MÀN TRAO CÚP — bục 2·1·3 hiện trước; hạng 3 và hạng 2 rơi từ trời
   kèm cúp; hạng 1 bước ra từ cổng không gian, camera zoom, vương miện
   rơi xuống đầu, cúp vàng bật lên, pháo hoa.
   list = [{name, def}, …] theo thứ tự hạng 1, 2, 3
   ═════════════════════════════════════════════════════════════ */
function playCeremony(list,done){
  $("#layer").innerHTML=`<div class="fuse-ov cer" id="cerOv"><canvas id="cerC"></canvas><div class="cer-ui" id="cerUI"></div><button class="btn btn-ghost cer-skip" id="cerSkip">Bỏ qua ⟶</button></div>`;
  const c=$("#cerC"),g=c.getContext("2d"),d=Math.min(2,devicePixelRatio||1);let w,h;
  const fit=()=>{w=innerWidth;h=innerHeight;c.width=w*d;c.height=h*d;g.setTransform(d,0,0,d,0,0)};fit();addEventListener("resize",fit);
  const R=srng(99),stars=Array.from({length:180},()=>({x:R(),y:R()*.7,s:R()*1.3+.2,p:R()*TAU}));
  const MEDAL=[["#FFD54A","#FFF3B0","#B8860B"],["#D9DEE8","#FFFFFF","#8A93A6"],["#E09A5A","#FFD2A6","#8B4A1C"]];
  let t=0,last=performance.now(),parts=[],rockets=[],shake=0,done2=false,cam={z:1,x:0,y:0},flash=0;
  const ev={};const once=(k,fn)=>{if(!ev[k]){ev[k]=1;fn()}};
  // bố cục
  const L=()=>{const u=Math.min(w/3.4,h/4.2,260),cx=w/2,base=h*.82;return{u,cx,base,pod:[{x:cx,hgt:u*1.15},{x:cx-u*1.05,hgt:u*.8},{x:cx+u*1.05,hgt:u*.58}]}};
  const ease=x=>1-Math.pow(1-clamp(x,0,1),3),bounce=x=>{x=clamp(x,0,1);const n=7.5625,d1=2.75;if(x<1/d1)return n*x*x;if(x<2/d1)return n*(x-=1.5/d1)*x+.75;if(x<2.5/d1)return n*(x-=2.25/d1)*x+.9375;return n*(x-=2.625/d1)*x+.984375};
  const burstAt=(x,y,cols,n,sp,grav=0)=>{for(let i=0;i<n;i++){const a=rand(0,TAU),s=rand(.2,1)*sp;parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:rand(.8,1.7),max:1.7,c:pick(cols),s:rand(1.5,3.5),grav})}};
  function trophy(x,y,s,m,label,a=1){
    g.save();g.globalAlpha=a;g.translate(x,y);const [c0,c1,c2]=MEDAL[m];
    g.globalCompositeOperation="lighter";g.drawImage(glowSprite(c0),-s*1.6,-s*2.4,s*3.2,s*3.2);g.globalCompositeOperation="source-over";
    const gr=g.createLinearGradient(-s*.6,0,s*.6,0);gr.addColorStop(0,c2);gr.addColorStop(.35,c1);gr.addColorStop(.6,c0);gr.addColorStop(1,c2);g.fillStyle=gr;g.strokeStyle=c2;g.lineWidth=2;
    g.beginPath();g.moveTo(-s*.55,-s*1.5);g.lineTo(s*.55,-s*1.5);g.quadraticCurveTo(s*.5,-s*.55,s*.12,-s*.42);g.lineTo(s*.1,-s*.18);g.lineTo(-s*.1,-s*.18);g.lineTo(-s*.12,-s*.42);g.quadraticCurveTo(-s*.5,-s*.55,-s*.55,-s*1.5);g.fill();g.stroke();
    g.lineWidth=s*.09;g.strokeStyle=c0;for(const sd of [-1,1]){g.beginPath();g.arc(sd*s*.55,-s*1.15,s*.22,sd>0?-Math.PI/2:Math.PI/2,sd>0?Math.PI/2:Math.PI*1.5,sd<0);g.stroke()}
    g.fillStyle=gr;g.fillRect(-s*.35,-s*.18,s*.7,s*.12);g.fillRect(-s*.45,-s*.08,s*.9,s*.16);
    g.fillStyle="rgba(255,255,255,.45)";g.beginPath();g.ellipse(-s*.25,-s*1.15,s*.07,s*.25,-.2,0,TAU);g.fill();
    g.fillStyle=c2;g.font=`900 ${Math.round(s*.42)}px Unbounded,"Arial Black",sans-serif`;g.textAlign="center";g.textBaseline="middle";g.fillText(label,0,-s*.98);
    g.restore();
  }
  function crown(x,y,s,a=1){
    g.save();g.globalAlpha=a;g.translate(x,y);g.globalCompositeOperation="lighter";g.drawImage(glowSprite("#FFD54A"),-s*1.4,-s*1.2,s*2.8,s*2.8);g.globalCompositeOperation="source-over";
    const gr=g.createLinearGradient(0,-s*.6,0,s*.3);gr.addColorStop(0,"#FFF3B0");gr.addColorStop(.5,"#FFD54A");gr.addColorStop(1,"#B8860B");g.fillStyle=gr;g.strokeStyle="#8A6508";g.lineWidth=2;
    g.beginPath();g.moveTo(-s*.7,s*.3);g.lineTo(-s*.75,-s*.35);g.lineTo(-s*.38,-s*.05);g.lineTo(0,-s*.6);g.lineTo(s*.38,-s*.05);g.lineTo(s*.75,-s*.35);g.lineTo(s*.7,s*.3);g.closePath();g.fill();g.stroke();
    for(const [jx,jy,jc] of [[0,s*.12,"#FF4D7A"],[-s*.4,s*.14,"#36E2FF"],[s*.4,s*.14,"#5CF2A8"]]){g.fillStyle=jc;g.beginPath();g.arc(jx,jy,s*.1,0,TAU);g.fill()}
    for(const [px,py] of [[-s*.75,-s*.35],[0,-s*.6],[s*.75,-s*.35]]){g.fillStyle="#FFFFFF";g.beginPath();g.arc(px,py,s*.07,0,TAU);g.fill()}
    g.restore();
  }
  function podium(p,rank,rise){
    const {u,base}=L(),hh=p.hgt*ease(rise),x=p.x-u*.5,y=base-hh,col=["#FFD54A","#D9DEE8","#E09A5A"][rank];
    const gr=g.createLinearGradient(x,y,x+u,y);gr.addColorStop(0,"#1C1438");gr.addColorStop(.5,"#2E2258");gr.addColorStop(1,"#150F2A");g.fillStyle=gr;g.fillRect(x,y,u,hh);
    g.fillStyle=hexA(col,.85);g.fillRect(x,y,u,6);g.strokeStyle="rgba(195,174,255,.25)";g.lineWidth=1;g.strokeRect(x,y,u,hh);
    if(hh>40){g.fillStyle=hexA(col,.9);g.font=`900 ${Math.round(u*.32)}px Unbounded,"Arial Black",sans-serif`;g.textAlign="center";g.textBaseline="middle";g.fillText(String(rank+1),p.x,y+Math.min(hh*.5,u*.4))}
    return y;
  }
  function label(x,y,name,col){g.save();g.font='800 16px Unbounded,"Arial Black",sans-serif';g.textAlign="center";g.textBaseline="middle";g.lineWidth=5;g.strokeStyle="rgba(4,2,11,.9)";g.strokeText(name,x,y);g.fillStyle=col;g.fillText(name,x,y);g.restore()}
  // dòng thời gian (giây)
  const T3=1.4,T2=3.2,TP=5.0,TZ=6.4,TC=7.2,TT=8.0,TF=8.6,TOUT=10.6,TEND=11.4;
  $("#cerSkip").onclick=()=>{if(t<TEND)t=TEND;};
  function finish(){
    const ui=$("#cerUI");
    ui.innerHTML=`<div class="cer-res"><span class="banner">KẾT QUẢ CHUNG CUỘC</span><div class="cer-list">${list.map((p,i)=>`<div class="cer-row r${i}"><span class="cer-n">#${i+1}</span>${orbHTML(p.def)}<b>${esc(p.name)}</b><small>${p.def.name}</small></div>`).join("")}</div><button class="btn btn-main mag" id="cerDone">Xong</button></div>`;
    $("#cerSkip").remove();$("#cerDone").onclick=()=>{done2=true;removeEventListener("resize",fit);closeLayer();if(done)done()};bindFx(ui);
  }
  (function f(now){
    if(done2||!c.isConnected)return;requestAnimationFrame(f);
    const dt=clamp((now-last)/1000,0,.1);last=now;t+=dt;const {u,base,pod}=L(),orbR=u*.24;
    // nền
    const bg=g.createLinearGradient(0,0,0,h);bg.addColorStop(0,"#05030D");bg.addColorStop(1,"#130B2A");g.fillStyle=bg;g.fillRect(0,0,w,h);
    for(const s of stars){g.globalAlpha=.3+.7*Math.abs(Math.sin(t*1.3+s.p));g.fillStyle="#fff";g.fillRect(s.x*w,s.y*h,s.s,s.s)}g.globalAlpha=1;
    // camera
    let tz=1,tx=pod[0].x,ty=base-pod[0].hgt-orbR*2;
    if(t>TZ&&t<TOUT){tz=1.55}cam.z+=(tz-cam.z)*Math.min(1,dt*3);cam.x+=(tx-cam.x)*Math.min(1,dt*3);cam.y+=(ty-cam.y)*Math.min(1,dt*3);
    g.save();if(shake>0){g.translate(rand(-shake,shake),rand(-shake,shake));shake*=.88}
    g.translate(cam.x,cam.y);g.scale(cam.z,cam.z);g.translate(-cam.x,-cam.y);
    // đèn sân khấu
    g.globalCompositeOperation="lighter";for(let k=0;k<3;k++){const a=Math.sin(t*.7+k*2)*.35,sx=w*(.2+k*.3);const gr=g.createLinearGradient(sx,0,sx+Math.sin(a)*h,h);gr.addColorStop(0,"rgba(195,174,255,.18)");gr.addColorStop(1,"rgba(195,174,255,0)");g.fillStyle=gr;g.beginPath();g.moveTo(sx-10,0);g.lineTo(sx+Math.sin(a)*h-u*.7,h);g.lineTo(sx+Math.sin(a)*h+u*.7,h);g.lineTo(sx+10,0);g.fill()}
    if(t>TF){g.save();g.translate(pod[0].x,base-pod[0].hgt);g.rotate(t*.3);for(let k=0;k<14;k++){g.rotate(TAU/14);g.fillStyle="rgba(255,213,74,.07)";g.beginPath();g.moveTo(0,0);g.lineTo(-40,-Math.max(w,h));g.lineTo(40,-Math.max(w,h));g.fill()}g.restore()}
    g.globalCompositeOperation="source-over";
    // sàn sân khấu
    g.fillStyle="#0B0718";g.fillRect(-w,base,w*3,h);g.strokeStyle="rgba(195,174,255,.3)";g.beginPath();g.moveTo(-w,base);g.lineTo(w*2,base);g.stroke();
    // bục
    const rise=t/1.2,tops=[podium(pod[1],1,rise),podium(pod[0],0,rise),podium(pod[2],2,rise)];const top=[tops[1],tops[0],tops[2]];
    // hạng 3 và 2: rơi từ trời + cúp rơi
    for(const [rank,T0] of [[2,T3],[1,T2]]){
      const p=pod[rank],P=list[rank],ty0=top[rank]-orbR,k=(t-T0)/.8;
      if(t>T0){const y=k<1?-orbR*2+(ty0+orbR*2)*bounce(k):ty0;const sq=k>.33&&k<.5?.82:1;g.save();g.translate(p.x,y);g.scale(1/sq,sq);orbOn(g,0,0,orbR,P.def);g.restore();
        once("land"+rank,()=>setTimeout(()=>{shake=10;burstAt(p.x,top[rank],["#ffffff",P.def.color,"#C3AEFF"],40,420,300);sfx.boom(true)},330));
        if(t>T0+1.0)label(p.x,top[rank]+u*.75,P.name,["#FFD54A","#D9DEE8","#E09A5A"][rank])}
      const kt=(t-T0-.7)/.7;if(t>T0+.7){const s=u*.32,yt=kt<1?-s*2+(top[rank]+s*2)*bounce(kt):top[rank];trophy(p.x+u*.33,yt,s,rank,"#"+(rank+1));once("cup"+rank,()=>setTimeout(()=>{tone(1400+rank*-200,.25,"triangle",.06);burstAt(p.x+u*.33,top[rank],[MEDAL[rank][0],"#ffffff"],24,300,200)},500))}
    }
    // hạng 1: cổng không gian → bước ra → zoom → vương miện → cúp bật lên
    const p1=pod[0],P1=list[0],y1=top[0]-orbR,py=y1-u*1.05;
    if(t>TP){const k=clamp((t-TP)/.6,0,1),close=t>TZ+.8?clamp(1-(t-TZ-.8)/.6,0,1):1,rr=u*.55*ease(k)*close;
      if(rr>1){g.save();g.globalCompositeOperation="lighter";g.drawImage(glowSprite("#8C7BFF"),p1.x-rr*2.2,py-rr*2.2,rr*4.4,rr*4.4);g.restore();g.fillStyle="#020106";g.beginPath();g.ellipse(p1.x,py,rr,rr*.42,0,0,TAU);g.fill();
        for(let j=0;j<4;j++){g.strokeStyle=hexA(["#8C7BFF","#FF4FD8","#36E2FF","#FFD54A"][j],.85);g.lineWidth=3-j*.4;g.beginPath();g.ellipse(p1.x,py,rr*(1-j*.12),rr*.42*(1-j*.12),0,t*(3+j)+j,t*(3+j)+j+Math.PI*1.4);g.stroke()}
        if(Math.random()<.6)parts.push({x:p1.x+rand(-rr,rr),y:py+rand(-rr,rr)*.4,vx:rand(-40,40),vy:rand(-60,60),life:.6,max:.6,c:pick(["#8C7BFF","#FF4FD8","#ffffff"]),s:2,grav:0})}
      once("portal",()=>{sfx.zap();tone(200,1.2,"sawtooth",.03,500)})}
    if(t>TP+.7){const k=clamp((t-TP-.7)/1,0,1),y=py+(y1-py)*ease(k),sc=.3+.7*ease(k);orbOn(g,p1.x,y,orbR*sc*1.15,P1.def);
      once("step",()=>{}) ;if(k>=1)once("land1",()=>{shake=14;burstAt(p1.x,top[0],["#FFD54A","#ffffff",P1.def.color],60,520,300);sfx.boom()})}
    if(t>TC){const k=clamp((t-TC)/.6,0,1),cy=y1-orbR*1.15-u*.12,yy=k<1?cy-u*1.6+(u*1.6)*bounce(k):cy;crown(p1.x,yy,u*.22,1);if(k>=1)once("crown",()=>{flash=.45;sfx.reveal("legendary");burstAt(p1.x,cy,["#FFD54A","#FFFFFF"],50,380,0)})}
    if(t>TT){const k=clamp((t-TT)/.9,0,1),s=u*.4,jump=Math.sin(Math.min(1,k)*Math.PI)*u*.9,yt=top[0]-jump*(k<1?1:0);trophy(p1.x+u*.36,yt,s,0,"#1");once("cup1",()=>{tone(1760,.3,"triangle",.07);tone(2349,.4,"triangle",.06,0,.12)})}
    if(t>TOUT-1)label(p1.x,top[0]+u*.85,P1.name,"#FFD54A");
    // pháo hoa
    if(t>TF&&Math.random()<dt*3.2)rockets.push({x:rand(w*.08,w*.92),y:h+10,vy:-rand(h*.9,h*1.3),ty:rand(h*.06,h*.42),c:pick(["#FFD54A","#36E2FF","#FF4D7A","#5CF2A8","#C3AEFF","#ffffff"])});
    once("conf",()=>{});if(t>TF)once("confetti",()=>{confettiBurst(innerWidth/2,innerHeight*.35,220,["#FFD54A","#36E2FF","#FF4D7A","#5CF2A8","#ffffff"]);flashbang("#FFD54A")});
    for(const r of rockets){r.y+=r.vy*dt;g.fillStyle=r.c;g.fillRect(r.x-1.5,r.y,3,12);if(r.y<=r.ty){r.dead=true;burstAt(r.x,r.y,[r.c,"#ffffff"],80,340,240);sfx.tap()}}
    rockets=rockets.filter(r=>!r.dead);
    g.globalCompositeOperation="lighter";
    for(const p of parts){p.life-=dt;p.vy+=p.grav*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.985;p.vy*=.985;g.globalAlpha=Math.max(0,p.life/p.max);g.fillStyle=p.c;g.beginPath();g.arc(p.x,p.y,p.s,0,TAU);g.fill()}
    parts=parts.filter(p=>p.life>0);if(parts.length>2000)parts.splice(0,parts.length-2000);
    g.globalAlpha=1;g.globalCompositeOperation="source-over";g.restore();
    if(flash>0){g.fillStyle=`rgba(255,240,200,${flash})`;g.fillRect(0,0,w,h);flash=Math.max(0,flash-dt*2)}
    if(t>TEND)once("ui",finish);
  })(last);
}
