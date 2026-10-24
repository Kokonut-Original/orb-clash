
/* ═════════════════════════════════════════════════════════════
   HIỆU ỨNG NÂNG CAO (chỉ phía client, không ảnh hưởng mô phỏng)
   • ZFX   : vẽ riêng từng loại vùng kỹ năng (khói, độc, bẫy dây, lưới, dây gai, sóng, điện, cát)
   • PSKIN : hình riêng cho đạn (mũi tên, tên lửa, dao)
   • lightPass : lớp ánh sáng động — sàn tối đi, chỗ có bóng/đạn/nổ được rọi sáng
   ═════════════════════════════════════════════════════════════ */
function puff(x,y,r,c,a){if(a<=0||r<=0)return;const ga=ctx.globalAlpha;ctx.globalAlpha=clamp(a,0,1);ctx.drawImage(glowSprite(c),x-r,y-r,r*2,r*2);ctx.globalAlpha=ga}
const _h=(i,k)=>{const s=Math.sin(i*127.1+k*311.7)*43758.5453;return s-Math.floor(s)};
const ZFX={
  smoke(z,f){const t=G.t;for(let k=0;k<7;k++){const a=k*.9+t*.25*(k%2?1:-1),d=z.r*(.15+.35*_h(k,1));puff(z.x+Math.cos(a)*d,z.y+Math.sin(a)*d,z.r*(.55+.2*_h(k,2)),k%3?"#4B3F7A":"#7B6CF6",.55*f)}
    puff(z.x,z.y,z.r*.7,"#1A1238",.6*f)},
  toxic(z,f){const t=G.t;for(let k=0;k<7;k++){const a=k*.9+t*.3*(k%2?1:-1),d=z.r*(.15+.4*_h(k,3));puff(z.x+Math.cos(a)*d,z.y+Math.sin(a)*d,z.r*(.5+.2*_h(k,4)),k%2?"#2ECC71":"#7DDB3A",.42*f)}
    ctx.strokeStyle=`rgba(198,240,106,${.7*f})`;ctx.lineWidth=1.5;for(let k=0;k<6;k++){const p=(t*.5+_h(k,5))%1,x=z.x+(_h(k,6)-.5)*z.r*1.3,y=z.y+z.r*.4-p*z.r*.9;circle(x,y,2+3*_h(k,7));ctx.stroke()}},
  sand(z,f){const t=G.t;puff(z.x,z.y,z.r*1.1,"#E3B04B",.35*f);ctx.save();ctx.strokeStyle=`rgba(255,228,170,${.55*f})`;ctx.lineWidth=2;ctx.setLineDash([10,14]);for(let k=0;k<3;k++){ctx.lineDashOffset=-t*40*(k+1);circle(z.x,z.y,z.r*(.35+k*.25));ctx.stroke()}ctx.restore();
    ctx.fillStyle=`rgba(255,240,200,${.7*f})`;for(let k=0;k<10;k++){const a=t*(1+_h(k,8))+k,d=z.r*_h(k,9);ctx.fillRect(z.x+Math.cos(a)*d,z.y+Math.sin(a)*d,2,2)}},
  snare(z,f){const armed=!(z.arm&&z.t<z.arm),fl=armed?.75+.25*Math.sin(G.t*14):.3;const x1=z.x-z.r,x2=z.x+z.r;
    glowAt(z.x,z.y,z.r*1.4,"#D8D8D8",.25*f*fl);ctx.strokeStyle=`rgba(230,240,255,${.9*f*fl})`;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x1,z.y);ctx.lineTo(x2,z.y);ctx.stroke();
    for(const x of[x1,x2]){ctx.fillStyle="#2A2A33";circle(x,z.y,5);ctx.fill();ctx.strokeStyle="#D8D8D8";ctx.lineWidth=1.5;ctx.stroke();ctx.fillStyle=armed?"#7FE9FF":"#555";circle(x,z.y,1.8);ctx.fill()}},
  tide(z,f){const t=G.t;ctx.fillStyle=`rgba(42,157,143,${.12*f})`;circle(z.x,z.y,z.r);ctx.fill();
    for(let k=0;k<3;k++){const p=(t*.7+k/3)%1;ctx.strokeStyle=`rgba(158,230,255,${(1-p)*.7*f})`;ctx.lineWidth=2.5;circle(z.x,z.y,z.r*(.3+p*.7));ctx.stroke()}
    glowAt(z.x,z.y,z.r*.9,"#2A9D8F",.3*f)},
  net(z,f){ctx.save();circle(z.x,z.y,z.r);ctx.clip();ctx.fillStyle=`rgba(168,218,220,${.1*f})`;ctx.fillRect(z.x-z.r,z.y-z.r,z.r*2,z.r*2);ctx.strokeStyle=`rgba(200,250,255,${.6*f})`;ctx.lineWidth=1.3;
    const s=18;for(let gy=-z.r;gy<=z.r;gy+=s*.87)for(let gx=-z.r;gx<=z.r;gx+=s){const ox=((gy/(s*.87))|0)%2?s/2:0;ctx.beginPath();for(let k=0;k<6;k++){const a=k*Math.PI/3,x=z.x+gx+ox+Math.cos(a)*s*.55,y=z.y+gy+Math.sin(a)*s*.55;k?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.closePath();ctx.stroke()}
    ctx.restore();ctx.strokeStyle=`rgba(200,250,255,${.85*f})`;ctx.lineWidth=2.5;circle(z.x,z.y,z.r);ctx.stroke()},
  vine(z,f){const armed=!(z.arm&&z.t<z.arm);ctx.fillStyle=`rgba(10,40,34,${.35*f})`;circle(z.x,z.y,z.r);ctx.fill();ctx.strokeStyle=`rgba(94,234,212,${.9*f})`;ctx.lineWidth=3;ctx.beginPath();
    for(let a=0;a<=TAU+.01;a+=.2){const r=z.r*(.85+.12*Math.sin(a*5+z.x));const x=z.x+Math.cos(a)*r,y=z.y+Math.sin(a)*r;a?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke();
    ctx.fillStyle=`rgba(184,255,242,${f})`;for(let k=0;k<10;k++){const a=k*TAU/10,r=z.r*.9,len=armed?8:4;ctx.save();ctx.translate(z.x+Math.cos(a)*r,z.y+Math.sin(a)*r);ctx.rotate(a);ctx.beginPath();ctx.moveTo(0,-3);ctx.lineTo(len,0);ctx.lineTo(0,3);ctx.closePath();ctx.fill();ctx.restore()}
    glowAt(z.x,z.y,z.r*1.2,"#5EEAD4",.25*f)},
  arc(z,f){glowAt(z.x,z.y,z.r*1.8,"#00F0FF",.55*f);ctx.strokeStyle=`rgba(220,255,255,${.85*f})`;ctx.lineWidth=1.6;ctx.beginPath();let x=z.x-z.r,y=z.y;ctx.moveTo(x,y);for(let k=1;k<=5;k++){x=z.x-z.r+k*z.r*.4;y=z.y+rand(-z.r*.6,z.r*.6);ctx.lineTo(x,y)}ctx.stroke()},
};
const PSKIN={
  arrow(p){const a=Math.atan2(p.vy,p.vx);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(a);glowAt(0,0,22,"#3DDC97",.6);
    ctx.strokeStyle="#EFFFF6";ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(-16,0);ctx.lineTo(6,0);ctx.stroke();
    ctx.fillStyle="#3DDC97";ctx.beginPath();ctx.moveTo(12,0);ctx.lineTo(3,-5);ctx.lineTo(3,5);ctx.closePath();ctx.fill();
    ctx.fillStyle="#BFF7DA";ctx.beginPath();ctx.moveTo(-16,0);ctx.lineTo(-20,-5);ctx.lineTo(-12,0);ctx.lineTo(-20,5);ctx.closePath();ctx.fill();ctx.restore()},
  missile(p){const a=Math.atan2(p.vy,p.vx);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(a);const fl=.7+Math.random()*.5;
    glowAt(-12,0,18*fl,"#FF8A3D",.9);ctx.fillStyle="#FFD23D";ctx.beginPath();ctx.moveTo(-8,-3);ctx.lineTo(-8-12*fl,0);ctx.lineTo(-8,3);ctx.closePath();ctx.fill();
    ctx.fillStyle="#E8E2DA";ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(5,-4);ctx.lineTo(-8,-4);ctx.lineTo(-8,4);ctx.lineTo(5,4);ctx.closePath();ctx.fill();
    ctx.fillStyle="#E76F51";ctx.fillRect(-1,-4,3,8);ctx.beginPath();ctx.moveTo(-8,-4);ctx.lineTo(-12,-8);ctx.lineTo(-5,-4);ctx.moveTo(-8,4);ctx.lineTo(-12,8);ctx.lineTo(-5,4);ctx.fill();ctx.restore();
    if(Math.random()<.35*FXQ.p)G.parts.push({x:p.x-Math.cos(a)*12,y:p.y-Math.sin(a)*12,vx:rand(-20,20),vy:rand(-20,20),life:.5,max:.5,color:"#9A9AA8",size:rand(2,4)})},
  knife(p){const a=Math.atan2(p.vy,p.vx);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(a);glowAt(0,0,18,"#5C7AEA",.7);
    ctx.fillStyle="#E6ECFF";ctx.beginPath();ctx.moveTo(12,0);ctx.lineTo(-2,-3.5);ctx.lineTo(-2,3.5);ctx.closePath();ctx.fill();ctx.fillStyle="#5C7AEA";ctx.fillRect(-9,-2.5,7,5);ctx.fillRect(-3,-5,2,10);ctx.restore()},
};
/* — lớp ánh sáng — */
let _LC=null,_LG=null,_LS=null;
function lightSprite(){if(!_LS){_LS=document.createElement("canvas");_LS.width=_LS.height=128;const g=_LS.getContext("2d"),gr=g.createRadialGradient(64,64,0,64,64,64);gr.addColorStop(0,"rgba(255,255,255,1)");gr.addColorStop(.45,"rgba(255,255,255,.6)");gr.addColorStop(1,"rgba(255,255,255,0)");g.fillStyle=gr;g.fillRect(0,0,128,128)}return _LS}
function lightPass(){
  const w=cv.width,h=cv.height;if(!_LC){_LC=document.createElement("canvas");_LG=_LC.getContext("2d")}
  if(_LC.width!==w||_LC.height!==h){_LC.width=w;_LC.height=h}
  const g=_LG,m=ctx.getTransform(),sp=lightSprite();
  g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation="source-over";g.globalAlpha=1;g.clearRect(0,0,w,h);g.fillStyle=`rgba(4,2,12,${FXQ.light})`;g.fillRect(0,0,w,h);
  g.setTransform(m);g.globalCompositeOperation="destination-out";
  const L=(x,y,r,a=1)=>{if(!(r>0)||!(a>0))return;g.globalAlpha=Math.min(1,a);g.drawImage(sp,x-r,y-r,r*2,r*2)};
  for(const b of G.balls)if(b.alive)L(b.x,b.y,b.r*(b.kind==="main"?5.5:3.6),b.kind==="main"?1:.8);
  for(const p of G.proj)L(p.x,p.y,Math.max(38,p.r*9),.9);
  for(const f of G.flashes)L(f.x,f.y,f.r*1.5,1-f.t/f.dur);
  for(const z of G.zones)L(z.x,z.y,z.r*1.4,z.kind==="smoke"?.15:.55);
  for(const z of G.blasts)L(z.x,z.y,z.r*1.2,.25+.6*(z.t/z.delay));
  for(const L2 of G.lines)if(L2.fired){const [x1,y1,x2,y2]=lineEnds(L2),a=1-(L2.t-L2.delay)/.4;for(let k=0;k<=8;k++)L(x1+(x2-x1)*k/8,y1+(y2-y1)*k/8,70,a)}
  for(const bo of G.bolts)L(bo.x2,bo.y2,120,1-bo.t/bo.dur);
  for(const bx of G.boxes||[])L(bx.x,bx.y,70,.8);
  for(const P of (G.as&&G.as.portals)||[])for(const q of[P.a,P.b])L(q.x,q.y,80,.8);
  g.globalAlpha=1;
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(_LC,0,0);ctx.restore();
}
