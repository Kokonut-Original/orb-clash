
/* ═════════════════════════════════════════════════════════════
   HỘP BÍ ẨN — cứ ~10 giây rơi xuống sàn. Bóng chạm trước nhận năng lực
   ngẫu nhiên, kích hoạt ngay. 15% là hộp bẫy (trông giống hệt hộp thường).
   ═════════════════════════════════════════════════════════════ */
let BOX_EVERY=10,BOX_LIFE=15,BOX_TRAP=.15;
const BOX_RAR={common:{w:45,c:"#FFC23D"},rare:{w:30,c:"#3FA9FF"},epic:{w:18,c:"#B86CFF"},legendary:{w:7,c:"#FF4D7A"}};
const FOE=b=>foes(b).filter(o=>o.kind==="main"||o.kind==="unit");
const POWERS=[
 {id:"heal",rar:"common",icon:"✚",name:"HỒI MÁU",fn:b=>{heal(b,b.max*.25,true);ring(b.x,b.y,b.r,b.r+60,"#5CF2A8",.6,5);burst(b.x,b.y,"#5CF2A8",24,260,3)}},
 {id:"shield",rar:"common",icon:"⬡",name:"KHIÊN",fn:b=>{b.st.shield=(b.st.shield||0)+30*b.sc;ring(b.x,b.y,b.r,b.r+40,"#8FD3FF",.5,5)}},
 {id:"haste",rar:"common",icon:"➶",name:"TĂNG TỐC",fn:b=>{status(b,"haste",4);sparkBurst(b.x,b.y,["#4FF0D2","#ffffff"],30,600)}},
 {id:"cast",rar:"common",icon:"✦",name:"TUNG CHIÊU",fn:b=>{const ab=abOf(b);if(ab.cd&&ab.trigger){castFx(b);ab.trigger(b);b.cd=ab.cd}else status(b,"crit",2.5);ring(b.x,b.y,b.r,b.r+70,b.def.color,.5,5)}},
 {id:"od",rar:"rare",icon:"⚡",name:"+1 DỒN LỰC",fn:b=>{if(b===G.mains[0]){G.pODn++;setOD(G.pODn)}else setTimeout(()=>{if(G&&!G.over&&alive(b))overdrive(b)},rand(600,1800))}},
 {id:"power",rar:"rare",icon:"⚔",name:"SÁT THƯƠNG ×2",fn:b=>{status(b,"power",5);ring(b.x,b.y,b.r,b.r+60,"#FF3B3B",.5,6)}},
 {id:"giant",rar:"rare",icon:"⬤",name:"KHỔNG LỒ",fn:b=>{if(!b.mem.grow0){b.mem.grow0=b.r;b.r*=1.5}b.mem.growT=G.t+6;ripple(b.x,b.y,18);G.shake+=8}},
 {id:"freeze",rar:"rare",icon:"❄",name:"ĐÓNG BĂNG",fn:b=>{for(const o of FOE(b))status(o,"freeze",1.6);ring(b.x,b.y,b.r,600,"#B8F1FF",.7,4);G.tint={c:"#B8F1FF",t:.4}}},
 {id:"magnet",rar:"rare",icon:"🧲",name:"NAM CHÂM",fn:b=>{const e=E(b);if(alive(e))tether(b,e,3,3*b.sc)}},
 {id:"swap",rar:"rare",icon:"⇄",name:"ĐỔI CHỖ",fn:b=>{const e=E(b);if(!alive(e))return;beam(b.x,b.y,e.x,e.y,"#B4FF39",.35,4);[b.x,e.x]=[e.x,b.x];[b.y,e.y]=[e.y,b.y];b.trail=[];e.trail=[];status(e,"confuse",1.5);sfx.zap()}},
 {id:"thunder",rar:"epic",icon:"ϟ",name:"THẦN SẤM",fn:b=>{for(const o of FOE(b)){zap(b,o,14*b.sc,true);status(o,"stun",.45)}G.tint={c:"#E8F4FF",t:.4}}},
 {id:"meteor",rar:"epic",icon:"☄",name:"MƯA THIÊN THẠCH",fn:b=>{const e=E(b);if(!alive(e))return;for(let k=0;k<5;k++){const a=rand(0,TAU),d=k?rand(30,120):0;blast(b,{kind:"meteor",x:clamp(e.x+Math.cos(a)*d,30,W-30),y:clamp(e.y+Math.sin(a)*d,30,H-30),r:52,delay:.7+k*.15,dmg:11*b.sc})}}},
 {id:"vamp",rar:"epic",icon:"❦",name:"HÚT MÁU",fn:b=>{status(b,"vamp",6);ring(b.x,b.y,b.r,b.r+50,"#C21E56",.5,5)}},
 {id:"clone",rar:"epic",icon:"◎",name:"PHÂN THÂN",fn:b=>{for(let k=0;k<2;k++)spawnMinion(b,{kind:"clone",r:b.r*.6,hp:40*b.sc,dmg:b.dmg*.6,life:7})}},
 {id:"star",rar:"legendary",icon:"★",name:"NGÔI SAO",fn:b=>{status(b,"star",4);status(b,"invuln",4);status(b,"haste",4);G.tint={c:"#FFC23D",t:.5};slowmo(.4,.3)}},
 {id:"borrow",rar:"legendary",icon:"♻",name:"MƯỢN KỸ NĂNG",fn:b=>{const d=pick(BALLS.filter(x=>x.ab.trigger&&x.id!==b.def.id&&x.id!=="paradox"));if(!b.mem.borrow)b.mem.borrow={prev:b.abSrc||null};b.abSrc=d.ab;b.mem.borrowT=G.t+8;b.cd=0;floater(b,"MƯỢN: "+d.name.toUpperCase(),"od")}},
];
const TRAPS=[
 {id:"bomb",icon:"💣",name:"BÙM! HỘP BẪY",fn:b=>{explode(b.x,b.y,110,14*b.sc,null,"#FF5470")}},
 {id:"stun",icon:"✶",name:"BẪY CHOÁNG",fn:b=>status(b,"stun",1.2)},
 {id:"shrink",icon:"⊖",name:"BỊ THU NHỎ",fn:b=>{if(!b.mem.shr0){b.mem.shr0=b.r;b.r*=.65}b.mem.shrT=G.t+6;status(b,"weak",6)}},
 {id:"slow",icon:"⧖",name:"BẪY CHẬM",fn:b=>status(b,"slow",4,.5)},
 {id:"confuse",icon:"?",name:"RỐI LOẠN",fn:b=>status(b,"confuse",2.5)},
];
function rollPower(){let x=Math.random()*100,rar="common";for(const [r,o] of Object.entries(BOX_RAR)){x-=o.w;if(x<=0){rar=r;break}}return pick(POWERS.filter(p=>p.rar===rar))}
function spawnBox(){
  const B=G.bd;let best=null,bs=-1;
  for(let i=0;i<14;i++){const x=rand(B.l+50,B.r-50),y=rand(B.t+50,B.b-50);let m=1e9;
    for(const o of G.balls)if(o.alive)m=Math.min(m,Math.hypot(o.x-x,o.y-y)-o.r);
    for(const o of G.as.obs||[])m=Math.min(m,Math.hypot(o.x-x,o.y-y)-o.r-20);
    for(const P of G.as.portals||[])for(const p of [P.a,P.b])m=Math.min(m,Math.hypot(p.x-x,p.y-y)-40);
    for(const o of G.boxes)m=Math.min(m,Math.hypot(o.x-x,o.y-y)-60);m=Math.min(m,260);m+=rand(0,60);
    if(m>bs){bs=m;best={x,y}}}
  const trap=Math.random()<BOX_TRAP,pw=trap?pick(TRAPS):rollPower();
  const look=trap?pick(Object.keys(BOX_RAR)):pw.rar;
  const box={x:best.x,y:best.y,t:0,pw,trap,c:BOX_RAR[look].c,alive:true,gone:false,r:18};
  G.boxes.push(box);sfx.whoosh();
  // bot tranh hộp nếu ở gần hơn
  const p=G.mains[0],e=G.mains[1];
  if(alive(e)&&e.kind==="main"&&(!alive(p)||dist(e,box)<dist(p,box)*1.2)&&Math.random()<.6){e.mem.seek=box;e.mem.seekT=G.t+2.2}
}
function openBox(box,b){
  box.gone=true;box.alive=false;
  const col=box.trap?"#FF5470":box.c;
  G.flashes.push({x:box.x,y:box.y,r:90,t:0,dur:.25,c:col});ring(box.x,box.y,8,80,col,.45,5);sparkBurst(box.x,box.y,[col,"#ffffff","#FFE14F"],34,560);
  for(let i=0;i<8;i++){const a=rand(0,TAU),s=rand(140,380);G.parts.push({x:box.x,y:box.y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-120,life:rand(.6,1),max:1,color:box.c,size:rand(4,7),chunk:true,rot:rand(0,TAU),vr:rand(-12,12)})}
  const you=b===G.mains[0],big=box.trap||box.pw.rar==="legendary"||box.pw.rar==="epic";
  G.texts.push({x:b.x,y:b.y-b.r-34,txt:box.pw.icon+" "+box.pw.name,kind:box.trap?"cfoe":you?"cyou":"cfoe",t:0,big:true});
  if(big)G.banner={txt:box.pw.name,sub:(you?"Bạn":"Đối thủ")+(box.trap?" dính bẫy!":" nhận năng lực"),t:0,dur:1.2,size:40,c:col,c2:"#FFFFFF"};
  if(box.trap){sfx.ko()}else sfx.reveal(box.pw.rar==="common"?"rare":box.pw.rar);
  box.pw.fn(b);
}
function boxStep(dt){
  if(!G.boxes||G.over||G.noBox)return;
  G.bxT-=dt;if(G.bxT<=0){G.bxT=BOX_EVERY;if(G.boxes.length<2)spawnBox()}
  for(const box of G.boxes){box.t+=dt;if(box.t>BOX_LIFE){box.gone=true;box.alive=false;burst(box.x,box.y,box.c,10,160,3);continue}
    if(box.t<.6)continue;
    for(const b of G.balls){if(!b.alive||b.kind!=="main")continue;if(Math.hypot(b.x-box.x,b.y-box.y)<b.r+box.r+4){openBox(box,b);break}}}
  G.boxes=G.boxes.filter(x=>!x.gone);
  // hết hạn hiệu ứng tạm thời
  for(const b of G.mains){if(!b||!b.mem)continue;
    if(b.mem.grow0&&G.t>b.mem.growT){b.r=b.mem.grow0;b.mem.grow0=0}
    if(b.mem.shr0&&G.t>b.mem.shrT){b.r=b.mem.shr0;b.mem.shr0=0}
    if(b.mem.borrow&&G.t>b.mem.borrowT){b.abSrc=b.mem.borrow.prev;b.mem.borrow=null;b.cd=Math.min(b.cd,(abOf(b).cd||0)*.5)}}
}
function drawBoxes(){
  if(!G.boxes)return;
  for(const box of G.boxes){
    const drop=Math.min(1,box.t/.6),fall=(1-drop)*(1-drop)*260,blink=box.t>BOX_LIFE-3&&Math.sin(G.t*20)>0;
    if(blink)continue;
    const bob=Math.sin(G.t*3+box.x)*3,x=box.x,y=box.y-fall+bob,s=box.r*(1+.06*Math.sin(G.t*6));
    ctx.fillStyle=`rgba(0,0,0,${.35*drop})`;ctx.beginPath();ctx.ellipse(box.x,box.y+s+4,s*(.6+.4*drop),s*.35,0,0,TAU);ctx.fill();
    glowAt(x,y,s*4,box.c,.55+.25*Math.sin(G.t*5));
    ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(G.t*2+box.y)*.12);
    const g=ctx.createLinearGradient(-s,-s,s,s);g.addColorStop(0,shade(box.c,.45));g.addColorStop(.5,box.c);g.addColorStop(1,shade(box.c,-.45));
    ctx.fillStyle=g;ctx.beginPath();ctx.roundRect?ctx.roundRect(-s,-s,s*2,s*2,5):ctx.rect(-s,-s,s*2,s*2);ctx.fill();
    ctx.strokeStyle="rgba(0,0,0,.45)";ctx.lineWidth=2;ctx.stroke();
    ctx.fillStyle="rgba(255,255,255,.55)";for(const [px,py] of [[-s+4,-s+4],[s-4,-s+4],[-s+4,s-4],[s-4,s-4]]){ctx.beginPath();ctx.arc(px,py,1.8,0,TAU);ctx.fill()}
    ctx.strokeStyle="rgba(255,255,255,.35)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-s+3,s-3);ctx.lineTo(-s+3,-s+3);ctx.lineTo(s-3,-s+3);ctx.stroke();
    ctx.font=`900 ${Math.round(s*1.35)}px Unbounded,"Arial Black",sans-serif`;ctx.textAlign="center";ctx.textBaseline="middle";ctx.lineWidth=4;ctx.strokeStyle="rgba(30,15,0,.75)";ctx.strokeText("?",0,2);ctx.fillStyle="#FFFFFF";ctx.fillText("?",0,2);
    ctx.restore();
    if(Math.random()<.25)G.parts.push({x:x+rand(-s,s),y:y+rand(-s,s),vx:0,vy:-30,life:.5,max:.5,color:"#FFF4C2",size:1.6,add:true});
    if(G.mains[0].mem.seek===box&&G.mains[0].mem.seekT>G.t){ctx.strokeStyle="rgba(54,226,255,.7)";ctx.lineWidth=2;ctx.setLineDash([4,6]);ctx.lineDashOffset=-G.t*40;ctx.beginPath();ctx.arc(box.x,box.y,s*2.2,0,TAU);ctx.stroke();ctx.setLineDash([])}
  }
  // hiệu ứng năng lực đang chạy
  for(const b of G.mains){if(!alive(b))continue;const s=b.st;
    if(s.star>0){const hue=Math.round((G.t*360)%360/24)*24;glowAt(b.x,b.y,b.r*3,`#${hslHex(hue)}`,.8);ctx.strokeStyle=`hsl(${hue},100%,70%)`;ctx.lineWidth=3;ctx.beginPath();ctx.arc(b.x,b.y,b.r+8,0,TAU);ctx.stroke()}
    if(s.power>0){glowAt(b.x,b.y,b.r*2.6,"#FF3B3B",.55+.2*Math.sin(G.t*14));if(Math.random()<.4)G.parts.push({x:b.x+rand(-b.r,b.r),y:b.y+rand(-b.r,b.r),vx:0,vy:-60,life:.4,max:.4,color:"#FF6A3D",size:2.5,add:true})}
    if(s.vamp>0){ctx.strokeStyle="rgba(194,30,86,.7)";ctx.lineWidth=2;ctx.setLineDash([3,5]);ctx.lineDashOffset=G.t*30;ctx.beginPath();ctx.arc(b.x,b.y,b.r+12,0,TAU);ctx.stroke();ctx.setLineDash([])}
    if(s.weak>0){ctx.strokeStyle="rgba(160,160,160,.6)";ctx.lineWidth=2;ctx.beginPath();ctx.arc(b.x,b.y,b.r+6,0,TAU);ctx.stroke()}
    if(b.mem.borrow){ctx.fillStyle="#B4FF39";ctx.font='800 10px Unbounded,sans-serif';ctx.textAlign="center";ctx.fillText("♻",b.x,b.y+b.r+14)}
  }
}
function hslHex(h){const f=n=>{const k=(n+h/30)%12,a=.5;const c=.6-a*Math.max(-1,Math.min(k-3,9-k,1));return Math.round(255*c).toString(16).padStart(2,"0")};return f(0)+f(8)+f(4)}
/** Chạm/bấm vào hộp trên sàn → lái bóng của bạn về phía hộp trong 2 giây. */
function tapBox(e){
  if(!G||!G.boxes||!G.boxes.length||G.count>0||G.over)return false;
  const r=cv.getBoundingClientRect(),lx=(e.clientX-r.left)/r.width*(W+PAD*2)-PAD,ly=(e.clientY-r.top)/r.height*(H+PAD*2)-PAD;
  let best=null,bd=60;for(const box of G.boxes){const d=Math.hypot(box.x-lx,box.y-ly);if(d<bd){bd=d;best=box}}
  if(!best)return false;
  const p=G.mains[0];p.mem.seek=best;p.mem.seekT=G.t+2;ring(best.x,best.y,40,8,"#36E2FF",.35,3);sfx.click();return true;
}
