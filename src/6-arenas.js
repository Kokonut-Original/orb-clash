
/* ═════════════════════════════════════════════════════════════
   SÀN ĐẤU — mỗi sàn có hoạ tiết riêng (vẽ một lần rồi lưu đệm),
   hạt môi trường, và cơ chế riêng (cột đá, bumper, cổng, gió, băng, sét…)
   ═════════════════════════════════════════════════════════════ */
function srng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const R2=(r,a,b)=>a+r()*(b-a);

/* — hazard trung lập (đánh cả hai bên) — */
function hazardZone(o){G.zones.push(Object.assign({kind:"acid",r:44,life:5,dps:4,slow:0,pull:0,t:0,side:-1,owner:null,c:"#7CFF4F"},o,{max:o.life||5}))}
function hazardBlast(o){G.blasts.push(Object.assign({kind:"strike",r:50,delay:.9,dmg:10,owner:null,side:-1,t:0,c:"#9FD8FF"},o))}
function drawAcid(z,fade){
  const a=fade*(z.arm&&z.t<z.arm?.45+.3*Math.sin(G.t*20):1);
  const g=ctx.createRadialGradient(z.x,z.y,0,z.x,z.y,z.r);g.addColorStop(0,`rgba(160,255,90,${.42*a})`);g.addColorStop(.7,`rgba(70,200,40,${.28*a})`);g.addColorStop(1,"rgba(70,200,40,0)");
  ctx.fillStyle=g;circle(z.x,z.y,z.r);ctx.fill();
  ctx.strokeStyle=`rgba(190,255,120,${.55*a})`;ctx.lineWidth=1.5;ctx.setLineDash([5,7]);ctx.lineDashOffset=G.t*14;circle(z.x,z.y,z.r*.92);ctx.stroke();ctx.setLineDash([]);
  for(let k=0;k<3;k++){const ph=(G.t*1.3+k*.37+z.x*.01)%1,bx=z.x+Math.sin(k*2.1+z.y)*z.r*.45,by=z.y+Math.cos(k*1.7+z.x)*z.r*.4;ctx.strokeStyle=`rgba(210,255,150,${(1-ph)*.7*a})`;ctx.lineWidth=1.2;circle(bx,by,2+ph*7);ctx.stroke()}
}
function drawStrike(z,p){
  const fl=Math.sin(G.t*30)>0;ctx.strokeStyle=hexA(z.c,.4+.5*p);ctx.lineWidth=2+p*3;ctx.setLineDash([8,6]);ctx.lineDashOffset=-G.t*60;circle(z.x,z.y,z.r);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle=hexA(z.c,.08+p*.22);circle(z.x,z.y,z.r*p);ctx.fill();
  if(fl){ctx.strokeStyle="rgba(255,255,255,.8)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(z.x-6,z.y-12);ctx.lineTo(z.x+2,z.y-2);ctx.lineTo(z.x-3,z.y+2);ctx.lineTo(z.x+6,z.y+12);ctx.stroke()}
}
function drawGeyser(z,p){
  glowAt(z.x,z.y,z.r*1.4,"#FF5A1F",.25+.5*p);ctx.strokeStyle=`rgba(255,180,80,${.4+.5*p})`;ctx.lineWidth=2;ctx.setLineDash([4,6]);ctx.lineDashOffset=G.t*40;circle(z.x,z.y,z.r);ctx.stroke();ctx.setLineDash([]);
  if(Math.random()<.5)G.parts.push({x:z.x+rand(-z.r,z.r)*.5,y:z.y+rand(-z.r,z.r)*.5,vx:rand(-20,20),vy:rand(-120,-40),life:.5,max:.5,color:pick(["#FF6A2A","#FFC23D"]),size:rand(2,4),add:true});
}
function strikeAfter(z){
  G.bolts.push({x1:z.x+rand(-50,50),y1:G.bd.t-30,x2:z.x,y2:z.y,t:0,dur:.35,seed:Math.random()*999,c:"#9FD8FF"});
  for(const o of G.balls)if(o.alive&&Math.hypot(o.x-z.x,o.y-z.y)<z.r+o.r)status(o,"stun",.35);
}

/* — hoạ tiết dùng chung — */
function bgGrad(g,c0,c1,radial=true){const gr=radial?g.createRadialGradient(W/2,H/2,30,W/2,H/2,W*.75):g.createLinearGradient(0,0,W,H);gr.addColorStop(0,c0);gr.addColorStop(1,c1);g.fillStyle=gr;g.fillRect(0,0,W,H)}
function gridLines(g,step,c,cMajor){g.lineWidth=1;for(let k=0;k<=W;k+=step){g.strokeStyle=k%(step*3)===0?cMajor:c;g.beginPath();g.moveTo(k,0);g.lineTo(k,H);g.stroke();g.beginPath();g.moveTo(0,k);g.lineTo(W,k);g.stroke()}}
function snakePath(){const pts=[];for(let x=-40;x<=545;x+=6){pts.push([x,300+140*Math.sin(x/92+.6)+30*Math.sin(x/37)])}return pts}

const ARENAS=[
{id:"neon",name:"Lưới Neon",desc:"Sàn chuẩn. Không có bẫy.",neon:"#C3AEFF",void:"#08060F",swatch:["#2A1F55","#0C0918"],
  pattern:(g)=>{bgGrad(g,"#1C1438","#0C0918");gridLines(g,40,"rgba(195,174,255,.06)","rgba(195,174,255,.14)");g.strokeStyle="rgba(195,174,255,.18)";g.lineWidth=2;g.beginPath();g.arc(W/2,H/2,80,0,TAU);g.stroke()},
  amb:{rate:6,spawn:()=>({x:rand(0,W),y:rand(0,H),vx:rand(-6,6),vy:rand(-14,-4),life:rand(2,4),max:4,s:rand(1,2.2),c:"#C3AEFF"}),draw:(p,a)=>{glowAt(p.x,p.y,p.s*5,p.c,a*.6)}}},

{id:"viper",name:"Hang Rắn Độc",desc:"Vũng axit độc trồi lên liên tục.",neon:"#7CFF4F",void:"#030A05",swatch:["#1E5A22","#04110A"],
  pattern:(g,r)=>{
    bgGrad(g,"#123A18","#03100A");
    // vảy rắn phủ sàn
    for(let row=0,y=-10;y<H+20;y+=17,row++){for(let x=(row%2)*13-13;x<W+26;x+=26){const gr=g.createRadialGradient(x,y+4,1,x,y+4,14);gr.addColorStop(0,"rgba(124,255,79,.05)");gr.addColorStop(1,"rgba(0,0,0,0)");g.fillStyle=gr;g.beginPath();g.arc(x,y,13,0,Math.PI);g.fill();g.strokeStyle="rgba(124,255,79,.07)";g.lineWidth=1;g.beginPath();g.arc(x,y,13,.15,Math.PI-.15);g.stroke()}}
    // con rắn khổng lồ uốn lượn
    const pts=snakePath();
    g.lineCap="round";g.lineJoin="round";
    for(const [w,c] of [[64,"rgba(0,0,0,.45)"],[54,"#0E3A14"],[46,"#17561D"],[30,"#1F6E25"]]){g.strokeStyle=c;g.lineWidth=w;g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.stroke()}
    for(let i=2;i<pts.length-2;i+=2){const [x,y]=pts[i],[x2,y2]=pts[i+1],a=Math.atan2(y2-y,x2-x),nx=-Math.sin(a),ny=Math.cos(a);
      for(const s of [-1,0,1]){g.strokeStyle=s?"rgba(170,255,120,.16)":"rgba(200,255,140,.22)";g.lineWidth=1.3;g.beginPath();g.arc(x+nx*s*12,y+ny*s*12,7,a+Math.PI*.6,a+Math.PI*1.4);g.stroke()}
      if(i%8===0){g.save();g.translate(x,y);g.rotate(a);g.fillStyle="#0B2E10";g.beginPath();g.moveTo(-9,0);g.lineTo(0,-8);g.lineTo(9,0);g.lineTo(0,8);g.closePath();g.fill();g.strokeStyle="rgba(190,255,120,.35)";g.lineWidth=1;g.stroke();g.restore()}}
    const [hx,hy]=pts[pts.length-1],[px,py]=pts[pts.length-6],ha=Math.atan2(hy-py,hx-px);
    g.save();g.translate(hx,hy);g.rotate(ha);g.fillStyle="#17561D";g.beginPath();g.ellipse(14,0,38,27,0,0,TAU);g.fill();g.strokeStyle="rgba(190,255,120,.3)";g.lineWidth=1.5;g.stroke();
    g.fillStyle="#E8FF5A";for(const s of [-1,1]){g.beginPath();g.ellipse(30,s*12,7,4.5,s*.3,0,TAU);g.fill()}g.fillStyle="#061A08";for(const s of [-1,1]){g.beginPath();g.ellipse(31,s*12,1.6,4,s*.3,0,TAU);g.fill()}
    g.strokeStyle="#FF3B5C";g.lineWidth=2.5;g.beginPath();g.moveTo(50,0);g.lineTo(66,0);g.moveTo(66,0);g.lineTo(74,-6);g.moveTo(66,0);g.lineTo(74,6);g.stroke();g.restore();
    for(let k=0;k<26;k++){g.fillStyle=`rgba(124,255,79,${R2(r,.03,.08)})`;g.beginPath();g.ellipse(R2(r,0,W),R2(r,0,H),R2(r,6,26),R2(r,4,14),R2(r,0,3),0,TAU);g.fill()}
  },
  anim:(c,t)=>{if(!ARENA_BY.viper._pts)ARENA_BY.viper._pts=snakePath();const pts=ARENA_BY.viper._pts;for(let k=0;k<3;k++){const i=Math.floor(((t*.12+k/3)%1)*pts.length);const [x,y]=pts[i];glowAt(x,y,46,"#7CFF4F",.22)}},
  update:(dt,st)=>{st.ac=(st.ac??2.5)-dt;if(st.ac<=0){st.ac=4.2;const tg=G.mains[0];const near=Math.random()<.5&&alive(tg);hazardZone({x:near?clamp(tg.x+rand(-90,90),60,W-60):rand(70,W-70),y:near?clamp(tg.y+rand(-90,90),60,H-60):rand(70,H-70),r:rand(36,52),life:5.5,arm:.9,dps:4.5,draw:drawAcid})}},
  amb:{rate:10,spawn:()=>({x:rand(0,W),y:rand(H*.2,H),vx:rand(-4,4),vy:rand(-26,-10),life:rand(1.2,2.6),max:2.6,s:rand(2,5),c:"#7CFF4F",ring:true}),draw:(p,a)=>{ctx.strokeStyle=hexA(p.c,.45*a);ctx.lineWidth=1.2;circle(p.x,p.y,p.s*(1.4-a*.4));ctx.stroke()}}},

{id:"glacier",name:"Hồ Băng Vĩnh Cửu",desc:"Mặt băng trơn: bóng trượt nhanh và khó đổi hướng.",neon:"#9EE8FF",void:"#030B12",swatch:["#1D5A80","#061624"],steer:.38,spd:1.1,
  pattern:(g,r)=>{
    bgGrad(g,"#0F3A57","#061624");
    for(let k=0;k<9;k++){const x=R2(r,-200,W),w=R2(r,30,90);const gr=g.createLinearGradient(x,0,x+w,0);gr.addColorStop(0,"rgba(255,255,255,0)");gr.addColorStop(.5,"rgba(220,245,255,.045)");gr.addColorStop(1,"rgba(255,255,255,0)");g.save();g.transform(1,0,.6,1,0,0);g.fillStyle=gr;g.fillRect(x,0,w,H);g.restore()}
    const crack=(x,y,a,len,w,depth)=>{g.strokeStyle=`rgba(225,248,255,${.12+w*.06})`;g.lineWidth=w;g.beginPath();g.moveTo(x,y);for(let i=0;i<len;i++){a+=R2(r,-.5,.5);x+=Math.cos(a)*14;y+=Math.sin(a)*14;g.lineTo(x,y);if(depth<2&&r()<.18)crack(x,y,a+R2(r,-1.2,1.2),len/2|0,w*.6,depth+1)}g.stroke()};
    for(let k=0;k<11;k++)crack(R2(r,0,W),R2(r,0,H),R2(r,0,TAU),R2(r,6,16)|0,R2(r,1,2.2),0);
    for(let k=0;k<55;k++){const x=R2(r,0,W),y=R2(r,0,H),s=R2(r,2,7);g.strokeStyle=`rgba(255,255,255,${R2(r,.05,.13)})`;g.lineWidth=1;for(let j=0;j<3;j++){const a=j*Math.PI/3;g.beginPath();g.moveTo(x-Math.cos(a)*s,y-Math.sin(a)*s);g.lineTo(x+Math.cos(a)*s,y+Math.sin(a)*s);g.stroke()}}
    g.strokeStyle="rgba(158,232,255,.18)";g.lineWidth=2;g.beginPath();g.arc(W/2,H/2,80,0,TAU);g.stroke();
  },
  anim:(c,t)=>{const x=((t*60)%(W+400))-200;const gr=c.createLinearGradient(x,0,x+120,H);gr.addColorStop(0,"rgba(255,255,255,0)");gr.addColorStop(.5,"rgba(230,250,255,.06)");gr.addColorStop(1,"rgba(255,255,255,0)");c.fillStyle=gr;c.fillRect(0,0,W,H)},
  amb:{rate:22,spawn:()=>({x:rand(-50,W),y:-10,vx:rand(10,40),vy:rand(30,70),life:rand(6,10),max:10,s:rand(1,2.6),c:"#FFFFFF"}),draw:(p,a)=>{ctx.fillStyle=`rgba(255,255,255,${.7*Math.min(1,a*3)})`;circle(p.x,p.y,p.s);ctx.fill()}}},

{id:"magma",name:"Lò Dung Nham",desc:"Tường nóng bỏng: đập tường là bị đốt. Mạch dung nham phun trào.",neon:"#FF6A2A",void:"#0A0302",swatch:["#5A1A08","#0A0302"],hotWall:3,
  pattern:(g,r)=>{
    bgGrad(g,"#1C0B06","#070302");
    const N=9,cs=W/(N-1),P=[];for(let j=0;j<N;j++){P[j]=[];for(let i=0;i<N;i++)P[j][i]=[i*cs+(i&&i<N-1?R2(r,-cs*.3,cs*.3):0),j*cs+(j&&j<N-1?R2(r,-cs*.3,cs*.3):0)]}
    for(let j=0;j<N-1;j++)for(let i=0;i<N-1;i++){const q=[P[j][i],P[j][i+1],P[j+1][i+1],P[j+1][i]];const v=R2(r,14,30);g.fillStyle=`rgb(${v+8},${v*.55|0},${v*.4|0})`;g.beginPath();q.forEach(([x,y],k)=>k?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fill();
      const cx=(q[0][0]+q[2][0])/2,cy=(q[0][1]+q[2][1])/2;const gr=g.createRadialGradient(cx-10,cy-10,2,cx,cy,cs*.7);gr.addColorStop(0,"rgba(255,255,255,.04)");gr.addColorStop(1,"rgba(0,0,0,.15)");g.fillStyle=gr;g.fill()}
    ARENA_BY.magma._P=P;
    for(let j=0;j<N;j++)for(let i=0;i<N;i++){for(const [di,dj] of [[1,0],[0,1]]){const a=P[j]&&P[j][i],b=P[j+dj]&&P[j+dj][i+di];if(!a||!b)continue;g.strokeStyle="rgba(255,80,20,.22)";g.lineWidth=5;g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke();g.strokeStyle="rgba(255,190,90,.5)";g.lineWidth=1.2;g.stroke()}}
  },
  anim:(c,t)=>{const P=ARENA_BY.magma._P;if(!P)return;const a=.1+.08*Math.sin(t*2.2);c.save();c.globalCompositeOperation="lighter";c.strokeStyle=`rgba(255,110,30,${a})`;c.lineWidth=7;c.beginPath();for(let j=0;j<P.length;j++)for(let i=0;i<P.length;i++)for(const [di,dj] of [[1,0],[0,1]]){const p=P[j][i],q=P[j+dj]&&P[j+dj][i+di];if(!q)continue;c.moveTo(p[0],p[1]);c.lineTo(q[0],q[1])}c.stroke();c.restore()},
  update:(dt,st)=>{st.gy=(st.gy??4)-dt;if(st.gy<=0){st.gy=5.5;const tg=G.mains[0];for(let k=0;k<2;k++){const x=k||!alive(tg)?rand(80,W-80):clamp(tg.x+rand(-70,70),60,W-60),y=k||!alive(tg)?rand(80,H-80):clamp(tg.y+rand(-70,70),60,H-60);hazardBlast({kind:"geyser",x,y,r:56,delay:1.2,dmg:11,c:"#FF6A2A",draw:drawGeyser,after:z=>hazardZone({kind:"fire",x:z.x,y:z.y,r:30,life:2.5,dps:4})})}}},
  amb:{rate:16,spawn:()=>({x:rand(0,W),y:H+5,vx:rand(-12,12),vy:rand(-70,-30),life:rand(2,5),max:5,s:rand(1,2.4),c:pick(["#FF6A2A","#FFC23D"])}),draw:(p,a)=>{glowAt(p.x,p.y,p.s*4,p.c,a)}}},

{id:"temple",name:"Đền Cát Cổ",desc:"Bốn cột đá giữa sàn: bóng dội lại, đạn vỡ tan.",neon:"#E9C46A",void:"#0F0904",swatch:["#6B4E26","#21160B"],
  obs:()=>[{x:190,y:300,r:30},{x:410,y:300,r:30},{x:300,y:190,r:30},{x:300,y:410,r:30}],
  pattern:(g,r)=>{
    bgGrad(g,"#3E2D18","#1C1209");
    for(let y=0;y<H;y+=60)for(let x=0;x<W;x+=60){const v=R2(r,-8,8);g.fillStyle=`rgba(${120+v},${88+v},${48+v},.16)`;g.fillRect(x+2,y+2,56,56);g.strokeStyle="rgba(255,230,170,.08)";g.lineWidth=1.5;g.beginPath();g.moveTo(x+2,y+58);g.lineTo(x+2,y+2);g.lineTo(x+58,y+2);g.stroke();g.strokeStyle="rgba(0,0,0,.25)";g.beginPath();g.moveTo(x+58,y+2);g.lineTo(x+58,y+58);g.lineTo(x+2,y+58);g.stroke()}
    g.strokeStyle="rgba(233,196,106,.28)";for(const [rr,w] of [[150,3],[130,1.5],[96,1.5]]){g.lineWidth=w;g.beginPath();g.arc(W/2,H/2,rr,0,TAU);g.stroke()}
    g.fillStyle="rgba(233,196,106,.25)";g.font="700 18px serif";g.textAlign="center";g.textBaseline="middle";const gl="☥𓂀◬✶☼⚚◈☾";[...gl].forEach((ch,i)=>{const a=i/8*TAU-Math.PI/2;g.save();g.translate(W/2+Math.cos(a)*113,H/2+Math.sin(a)*113);g.rotate(a+Math.PI/2);g.fillText(ch,0,0);g.restore()});
    g.strokeStyle="rgba(233,196,106,.35)";g.lineWidth=2;g.beginPath();g.moveTo(W/2,H/2-40);g.lineTo(W/2+34,H/2+20);g.lineTo(W/2-34,H/2+20);g.closePath();g.stroke();g.beginPath();g.arc(W/2,H/2+2,8,0,TAU);g.stroke();
    for(let k=0;k<30;k++){g.strokeStyle="rgba(0,0,0,.22)";g.lineWidth=1;let x=R2(r,0,W),y=R2(r,0,H);g.beginPath();g.moveTo(x,y);for(let i=0;i<4;i++){x+=R2(r,-14,14);y+=R2(r,-14,14);g.lineTo(x,y)}g.stroke()}
    for(let k=0;k<40;k++){g.fillStyle=`rgba(240,200,130,${R2(r,.03,.08)})`;g.beginPath();g.ellipse(R2(r,0,W),R2(r,0,H),R2(r,8,30),R2(r,3,8),R2(r,0,3),0,TAU);g.fill()}
  },
  drawObs:(o)=>{ctx.fillStyle="rgba(0,0,0,.4)";circle(o.x+6,o.y+8,o.r+2);ctx.fill();const g=ctx.createRadialGradient(o.x-o.r*.4,o.y-o.r*.4,2,o.x,o.y,o.r);g.addColorStop(0,"#F3D79A");g.addColorStop(.6,"#B8894A");g.addColorStop(1,"#6B4A22");ctx.fillStyle=g;circle(o.x,o.y,o.r);ctx.fill();
    ctx.strokeStyle="rgba(60,35,10,.6)";ctx.lineWidth=2;for(const k of [.75,.45]){circle(o.x,o.y,o.r*k);ctx.stroke()}ctx.fillStyle="rgba(60,35,10,.55)";ctx.font="700 16px serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("☥",o.x,o.y+1);
    if(o.lit>0)glowAt(o.x,o.y,o.r*2.2,"#E9C46A",o.lit*3)},
  amb:{rate:7,spawn:()=>({x:rand(0,W),y:rand(0,H),vx:rand(8,24),vy:rand(-4,4),life:rand(3,6),max:6,s:rand(.8,1.8),c:"#F4D9A0"}),draw:(p,a)=>{ctx.fillStyle=hexA(p.c,.5*a);circle(p.x,p.y,p.s);ctx.fill()}}},

{id:"pinball",name:"Máy Pinball",desc:"Ba bumper nảy cực mạnh và làm bóng tăng tốc.",neon:"#FF4FD8",void:"#07020D",swatch:["#5A1680","#0B0316"],
  obs:()=>[{x:300,y:225,r:26,kick:430},{x:222,y:372,r:26,kick:430},{x:378,y:372,r:26,kick:430}],
  pattern:(g)=>{
    bgGrad(g,"#2C0C4A","#0A0314");
    for(let k=0;k<24;k++){const a0=k/24*TAU;g.fillStyle=k%2?"rgba(255,79,216,.035)":"rgba(80,220,255,.03)";g.beginPath();g.moveTo(W/2,H/2);g.arc(W/2,H/2,520,a0,a0+TAU/24);g.closePath();g.fill()}
    for(let k=0;k<6;k++){g.strokeStyle="rgba(255,79,216,.12)";g.lineWidth=2;g.beginPath();const y=470+k*14;g.moveTo(W/2-30+k*2,y);g.lineTo(W/2,y+10);g.lineTo(W/2+30-k*2,y);g.stroke()}
    g.strokeStyle="rgba(255,255,255,.07)";g.lineWidth=1;for(const rr of [250,262]){g.beginPath();g.arc(W/2,H/2,rr,0,TAU);g.stroke()}
    for(const [x1,y1,x2,y2] of [[40,520,170,470],[560,520,430,470],[40,80,150,140],[560,80,450,140]]){g.strokeStyle="rgba(80,220,255,.22)";g.lineWidth=6;g.lineCap="round";g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke()}
  },
  anim:(c,t)=>{for(let k=0;k<32;k++){const a=k/32*TAU,on=((k-Math.floor(t*14))%8+8)%8<2;const x=W/2+Math.cos(a)*256,y=H/2+Math.sin(a)*256;if(on)glowAt(x,y,14,k%2?"#FF4FD8":"#50DCFF",.9);c.fillStyle=on?"#ffffff":"rgba(255,255,255,.18)";circle(x,y,2.6);c.fill()}},
  drawObs:(o)=>{const lit=o.lit>0?1:0;glowAt(o.x,o.y,o.r*(2.4+lit),"#FF4FD8",.45+lit*.6);ctx.fillStyle="#1A0628";circle(o.x,o.y,o.r);ctx.fill();
    ctx.strokeStyle=lit?"#ffffff":"#FF4FD8";ctx.lineWidth=5;circle(o.x,o.y,o.r-3);ctx.stroke();ctx.strokeStyle="#50DCFF";ctx.lineWidth=2;circle(o.x,o.y,o.r*.55);ctx.stroke();
    ctx.fillStyle=lit?"#ffffff":"#FF9BEA";ctx.font="900 11px Unbounded,sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(o.score||"100",o.x,o.y+1)},
  amb:{rate:5,spawn:()=>({x:rand(0,W),y:rand(0,H),vx:0,vy:0,life:rand(.5,1.2),max:1.2,s:rand(1.5,3),c:pick(["#FF4FD8","#50DCFF","#FFE14F"])}),draw:(p,a)=>{glowAt(p.x,p.y,p.s*5,p.c,a*.8)}}},

{id:"void",name:"Cổng Hư Không",desc:"Hai cặp cổng dịch chuyển: lao vào cổng này, bật ra cổng kia.",neon:"#8C7BFF",void:"#020106",swatch:["#2A1F6A","#020108"],
  portals:()=>[{a:{x:110,y:300},b:{x:490,y:300},c:["#FF9F1C","#36E2FF"]},{a:{x:300,y:110},b:{x:300,y:490},c:["#FF4FD8","#5CF2A8"]}],
  pattern:(g,r)=>{
    bgGrad(g,"#0A0720","#010006");
    for(const [x,y,rr,c] of [[150,180,260,"rgba(140,123,255,.16)"],[470,420,240,"rgba(255,79,216,.11)"],[420,140,170,"rgba(54,226,255,.08)"],[160,470,200,"rgba(90,60,200,.12)"]]){const gr=g.createRadialGradient(x,y,0,x,y,rr);gr.addColorStop(0,c);gr.addColorStop(1,"rgba(0,0,0,0)");g.fillStyle=gr;g.fillRect(0,0,W,H)}
    for(let k=0;k<220;k++){const s=R2(r,.3,1.6);g.fillStyle=`rgba(255,255,255,${R2(r,.2,.9)})`;g.beginPath();g.arc(R2(r,0,W),R2(r,0,H),s,0,TAU);g.fill()}
    g.strokeStyle="rgba(140,123,255,.12)";g.lineWidth=1;for(let k=1;k<6;k++){g.beginPath();g.ellipse(W/2,H/2,k*55,k*22,-.4,0,TAU);g.stroke()}
  },
  anim:(c,t)=>{for(let k=0;k<6;k++){const x=(k*137+t*8)%W,y=(k*251)%H;glowAt(x,y,8+4*Math.sin(t*3+k),"#ffffff",.5)}},
  amb:{rate:8,spawn:()=>({x:rand(0,W),y:rand(0,H),vx:rand(-30,30),vy:rand(-30,30),life:rand(1,2.5),max:2.5,s:rand(.6,1.4),c:"#C9C0FF"}),draw:(p,a)=>{ctx.fillStyle=hexA(p.c,.8*a);circle(p.x,p.y,p.s);ctx.fill()}}},

{id:"desert",name:"Bão Sa Mạc",desc:"Gió đổi chiều mỗi 5 giây, đẩy mọi thứ trôi theo.",neon:"#F4A261",void:"#120A03",swatch:["#8A5A2A","#2A1A0A"],wind:170,
  pattern:(g,r)=>{
    const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,"#5E4020");gr.addColorStop(1,"#2B1B0B");g.fillStyle=gr;g.fillRect(0,0,W,H);
    for(let k=0;k<26;k++){const y0=k*24+R2(r,-6,6),amp=R2(r,6,18),f=R2(r,.008,.016),ph=R2(r,0,TAU);
      g.strokeStyle="rgba(255,220,160,.09)";g.lineWidth=2;g.beginPath();for(let x=0;x<=W;x+=8){const y=y0+Math.sin(x*f+ph)*amp;x?g.lineTo(x,y):g.moveTo(x,y)}g.stroke();
      g.strokeStyle="rgba(0,0,0,.14)";g.lineWidth=3;g.beginPath();for(let x=0;x<=W;x+=8){const y=y0+5+Math.sin(x*f+ph)*amp;x?g.lineTo(x,y):g.moveTo(x,y)}g.stroke()}
    for(let k=0;k<14;k++){g.fillStyle="rgba(70,45,20,.35)";g.beginPath();g.ellipse(R2(r,0,W),R2(r,0,H),R2(r,3,7),R2(r,2,4),0,0,TAU);g.fill()}
  },
  update:(dt,st)=>{if(st.wa===undefined){st.wa=rand(0,TAU);st.wt=5}st.wt-=dt;if(st.wt<=0){st.wt=5;st.wa+=rand(1.2,Math.PI);G.banner={txt:"GIÓ ĐỔI CHIỀU",t:0,dur:1.1,size:30,c:"#F4A261",c2:"#FFE0B0"}}
    const wx=Math.cos(st.wa)*170,wy=Math.sin(st.wa)*170;for(const b of G.balls){if(!b.alive||b.kind==="head")continue;b.vx+=wx*dt;b.vy+=wy*dt}for(const p of G.proj){p.vx+=wx*dt*.6;p.vy+=wy*dt*.6}},
  anim:(c,t,st)=>{if(st.wa===undefined)return;c.save();c.translate(W/2,H/2);c.rotate(st.wa);c.globalAlpha=.12;c.fillStyle="#FFE0B0";c.beginPath();c.moveTo(70,0);c.lineTo(20,-34);c.lineTo(20,-14);c.lineTo(-60,-14);c.lineTo(-60,14);c.lineTo(20,14);c.lineTo(20,34);c.closePath();c.fill();c.restore()},
  amb:{rate:40,spawn:()=>{const st=G.as,a=st.wa||0;return{x:rand(-60,W+60),y:rand(-60,H+60),vx:Math.cos(a)*rand(260,420),vy:Math.sin(a)*rand(260,420),life:rand(.5,1.1),max:1.1,s:rand(6,18),c:"#F4D9A0",streak:true}},draw:(p,a)=>{ctx.strokeStyle=hexA(p.c,.35*a);ctx.lineWidth=1.2;ctx.beginPath();const n=Math.hypot(p.vx,p.vy)||1;ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-p.vx/n*p.s,p.y-p.vy/n*p.s);ctx.stroke()}}},

{id:"storm",name:"Đỉnh Sấm Sét",desc:"Sét đánh xuống ngẫu nhiên: thấy vòng tròn nháy thì né.",neon:"#5AA9FF",void:"#02040A",swatch:["#24406A","#05080F"],
  pattern:(g,r)=>{
    bgGrad(g,"#15233A","#04070E");
    for(let k=0;k<14;k++){const cx=W/2+R2(r,-40,40),cy=H/2+R2(r,-40,40),rr=40+k*26;g.strokeStyle=`rgba(150,190,255,${R2(r,.03,.08)})`;g.lineWidth=R2(r,6,20);g.beginPath();g.arc(cx,cy,rr,R2(r,0,TAU),R2(r,0,TAU)+R2(r,1.5,4));g.stroke()}
    for(let k=0;k<8;k++){let x=R2(r,0,W),y=R2(r,0,H);g.strokeStyle="rgba(200,230,255,.1)";g.lineWidth=2;g.beginPath();g.moveTo(x,y);for(let i=0;i<6;i++){x+=R2(r,-20,20);y+=R2(r,8,22);g.lineTo(x,y)}g.stroke();g.fillStyle="rgba(0,0,0,.25)";g.beginPath();g.arc(x,y,R2(r,10,22),0,TAU);g.fill()}
  },
  anim:(c,t,st)=>{if(st.fl>0){c.fillStyle=`rgba(200,230,255,${st.fl*.25})`;c.fillRect(0,0,W,H)}},
  update:(dt,st)=>{st.fl=Math.max(0,(st.fl||0)-dt*2);st.sk=(st.sk??2.5)-dt;if(st.sk<=0){st.sk=3.2;const tg=G.mains[0];for(let k=0;k<2;k++){const near=k===0&&alive(tg);hazardBlast({x:near?clamp(tg.x+tg.vx*.6,60,W-60):rand(70,W-70),y:near?clamp(tg.y+tg.vy*.6,60,H-60):rand(70,H-70),r:52,delay:.95,dmg:12,draw:drawStrike,after:z=>{strikeAfter(z);st.fl=1}})}}},
  amb:{rate:55,spawn:()=>({x:rand(-80,W),y:-10,vx:120,vy:rand(520,700),life:1.2,max:1.2,s:14,c:"#9FC8FF"}),draw:(p,a)=>{ctx.strokeStyle=hexA(p.c,.28);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-p.vx*.025,p.y-p.vy*.025);ctx.stroke()}}},
];
const ARENA_BY=Object.fromEntries(ARENAS.map(a=>[a.id,a]));
const ARENA_IDS=ARENAS.map(a=>a.id);

function setArena(id){
  const A=ARENA_BY[id]||ARENA_BY.neon;G.arena=A;G.as={obs:A.obs?A.obs():[],portals:A.portals?A.portals():[]};G.amb=[];
}
function arenaPat(A){
  const key=A.id+"|"+cv.width;let c=patCache.get(key);
  if(!c){c=document.createElement("canvas");const px=Math.max(64,Math.round(W*SCALE));c.width=c.height=px;const g=c.getContext("2d");g.scale(px/W,px/H);A.pattern(g,srng(A.id.length*977+13));patCache.set(key,c)}
  return c;
}
function arenaStep(dt){
  const A=G.arena;if(!A)return;const st=G.as;
  if(A.update)A.update(dt,st);
  for(const o of st.obs){if(o.lit>0)o.lit-=dt;
    for(const b of G.balls){if(!b.alive||b.kind==="head")continue;const dx=b.x-o.x,dy=b.y-o.y,d=Math.hypot(dx,dy),m=b.r+o.r;if(d>=m||d===0)continue;
      const nx=dx/d,ny=dy/d;b.x=o.x+nx*m;b.y=o.y+ny*m;const vn=b.vx*nx+b.vy*ny;if(vn<0){b.vx-=2*vn*nx;b.vy-=2*vn*ny}
      if(o.kick){if(!(b.mem.bk>G.t)){b.mem.bk=G.t+.15;b.vx+=nx*o.kick;b.vy+=ny*o.kick;status(b,"haste",.6);o.lit=.25;o.score=pick(["100","250","500","1K"]);sparkBurst(o.x+nx*o.r,o.y+ny*o.r,["#FF4FD8","#50DCFF","#ffffff"],18,520);ring(o.x,o.y,o.r,o.r+40,"#FF4FD8",.35,4);G.shake=Math.min(26,G.shake+5);sfx.tap()}}
      else if(Math.abs(vn)>140){o.lit=.12;sparkBurst(o.x+nx*o.r,o.y+ny*o.r,[A.neon,"#ffffff"],6,280,Math.atan2(ny,nx)+Math.PI/2);if(b.kind==="main"&&Math.random()<.5)sfx.wall()}}
    for(const p of G.proj){if(p.life>0&&p.kind!=="bee"&&Math.hypot(p.x-o.x,p.y-o.y)<o.r+p.r){if(o.kick){const n=Math.max(1,Math.hypot(p.x-o.x,p.y-o.y)),nx=(p.x-o.x)/n,ny=(p.y-o.y)/n;const vn=p.vx*nx+p.vy*ny;if(vn<0){p.vx-=2*vn*nx;p.vy-=2*vn*ny;p.a=Math.atan2(p.vy,p.vx)}}else{p.life=0;sparkBurst(p.x,p.y,[A.neon,"#fff"],6,220)}}}
  }
  for(const P of st.portals){for(const [from,to,ci] of [[P.a,P.b,0],[P.b,P.a,1]]){
    for(const b of G.balls){if(!b.alive||b.kind==="head"||b.mem.port>G.t)continue;if(Math.hypot(b.x-from.x,b.y-from.y)<24){
      const sp=Math.hypot(b.vx,b.vy)||1;G.ghosts.push({x:b.x,y:b.y,r:b.r,c:P.c[ci],t:0,dur:.5});
      b.x=clamp(to.x+b.vx/sp*(b.r+30),G.bd.l+b.r,G.bd.r-b.r);b.y=clamp(to.y+b.vy/sp*(b.r+30),G.bd.t+b.r,G.bd.b-b.r);b.trail=[];b.mem.port=G.t+.9;
      ring(from.x,from.y,4,60,P.c[ci],.4,4);ring(to.x,to.y,60,4,P.c[1-ci],.4,4);sparkBurst(to.x,to.y,[P.c[1-ci],"#ffffff"],16,420);if(b.kind==="main")sfx.zap()}}}}
}
function drawArenaObjects(A){
  const st=G.as;
  for(const P of st.portals){for(const [p,c] of [[P.a,P.c[0]],[P.b,P.c[1]]]){glowAt(p.x,p.y,70,c,.6);ctx.fillStyle="#020106";circle(p.x,p.y,26);ctx.fill();
    for(let k=0;k<4;k++){ctx.strokeStyle=hexA(c,.9-k*.18);ctx.lineWidth=3-k*.5;ctx.beginPath();ctx.arc(p.x,p.y,26-k*5,G.t*(3+k)+k,G.t*(3+k)+k+Math.PI*1.3);ctx.stroke()}
    ctx.strokeStyle=c;ctx.lineWidth=2;circle(p.x,p.y,28);ctx.stroke()}}
  for(const o of st.obs)if(A.drawObs)A.drawObs(o);
}
function drawArenaFloor(){
  const A=G.arena||ARENA_BY.neon,B=G.bd,hot=G.t>G.ot;
  ctx.fillStyle=A.void;ctx.fillRect(-200,-200,W+400,H+400);
  ctx.save();ctx.beginPath();ctx.rect(B.l,B.t,B.r-B.l,B.b-B.t);ctx.clip();
  ctx.drawImage(arenaPat(A),0,0,W,H);
  if(A.anim&&FXQ.amb>0)A.anim(ctx,G.t,G.as);
  if(G.ripples.length){ctx.lineWidth=1;const col=hexA(A.neon,.16);ctx.strokeStyle=col;
    for(let pass=0;pass<2;pass++)for(let k=0;k<=W;k+=40){ctx.beginPath();for(let s=0;s<=H;s+=15){const x=pass?s:k,y=pass?k:s;const [dx,dy]=rippleD(x,y);s?ctx.lineTo(x+dx,y+dy):ctx.moveTo(x+dx,y+dy)}ctx.stroke()}}
  if(hot){ctx.fillStyle="rgba(255,77,122,.08)";ctx.fillRect(0,0,W,H);ctx.strokeStyle="rgba(255,77,122,.16)";ctx.lineWidth=8;for(let k=-H;k<W;k+=26){ctx.beginPath();ctx.moveTo(k+(G.t*30)%26,0);ctx.lineTo(k+H+(G.t*30)%26,H);ctx.stroke()}}
  for(const d of G.decals){const a=(1-d.t/d.life)*.5;const gr=ctx.createRadialGradient(d.x,d.y,0,d.x,d.y,d.r);gr.addColorStop(0,"rgba(0,0,0,"+a*.45+")");gr.addColorStop(.7,hexA(d.c,a*.3));gr.addColorStop(1,hexA(d.c,0));ctx.fillStyle=gr;circle(d.x,d.y,d.r);ctx.fill()}
  drawArenaObjects(A);
  ctx.restore();
  const col=hot?"#FF4D7A":A.neon;
  ctx.save();ctx.globalCompositeOperation="lighter";
  for(const [w,a] of [[18,.08],[8,.2],[3,.95]]){ctx.strokeStyle=hexA(col,a);ctx.lineWidth=w;ctx.strokeRect(B.l,B.t,B.r-B.l,B.b-B.t)}
  if(G.wallHit){const h=G.wallHit;h.t+=1/60;const a=Math.max(0,1-h.t*3);if(a>0){ctx.strokeStyle=hexA(h.c,a);ctx.lineWidth=6;ctx.beginPath();const tx=-h.ny,ty=h.nx,L=60+h.t*200;ctx.moveTo(h.x-tx*L,h.y-ty*L);ctx.lineTo(h.x+tx*L,h.y+ty*L);ctx.stroke()}}
  ctx.restore();
  ctx.strokeStyle="#F5EFFF";ctx.lineWidth=3;const L=22;for(const [x,y,sx,sy] of [[B.l,B.t,1,1],[B.r,B.t,-1,1],[B.l,B.b,1,-1],[B.r,B.b,-1,-1]]){ctx.beginPath();ctx.moveTo(x+sx*L,y);ctx.lineTo(x,y);ctx.lineTo(x,y+sy*L);ctx.stroke()}
}
/* — hạt môi trường — */
function ambStep(dt){
  const A=G&&G.arena;if(!A||!A.amb||FXQ.amb<=0)return;
  G.ambAcc=(G.ambAcc||0)+dt*A.amb.rate*FXQ.amb;
  while(G.ambAcc>=1&&G.amb.length<260){G.ambAcc-=1;G.amb.push(A.amb.spawn())}
  for(const p of G.amb){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt}
  G.amb=G.amb.filter(p=>p.life>0);
}
function drawAmb(){const A=G.arena;if(!A||!A.amb)return;ctx.save();for(const p of G.amb)A.amb.draw(p,clamp(p.life/p.max,0,1));ctx.restore()}

/* — bloom (chất lượng Cực đại) — */
const bloomC=document.createElement("canvas"),bctx=bloomC.getContext("2d");
function bloomPass(){
  const w=Math.max(32,cv.width>>2),h=Math.max(32,cv.height>>2);if(bloomC.width!==w){bloomC.width=w;bloomC.height=h}
  bctx.globalCompositeOperation="copy";bctx.filter="blur(3px) brightness(1.15)";bctx.drawImage(cv,0,0,w,h);bctx.filter="none";
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalCompositeOperation="lighter";ctx.globalAlpha=.42;ctx.imageSmoothingEnabled=true;ctx.drawImage(bloomC,0,0,cv.width,cv.height);ctx.restore();
}

/* — nhiều kẻ địch: luôn nhắm kẻ gần nhất — */
function hordeFocus(){const p=G.mains[0];let best=null,bd=1e9;for(const o of G.balls){if(!o.alive||o.side!==1||(o.kind!=="main"&&o.kind!=="unit"))continue;const d=dist(o,p);if(d<bd){bd=d;best=o}}if(best)G.mains[1]=best}

/* — hiệu ứng của thẻ nâng cấp (chế độ Vô tận) — */
function modsUpdate(b,dt){
  const m=b.mods,M2=b.mem;
  if(m.fire){M2.mf=(M2.mf||0)-dt;if(M2.mf<=0){M2.mf=.2;zone(b,{kind:"fire",x:b.x,y:b.y,r:18,life:2.2,dps:3.5*m.fire*b.sc})}}
  if(m.shot){M2.ms=(M2.ms??.8)-dt;if(M2.ms<=0){M2.ms=1.5/m.shot;shoot(b,{dmg:b.dmg*.45,spd:600,r:4,life:1.6})}}
  if(m.thunder){M2.mt=(M2.mt??2)-dt;if(M2.mt<=0){M2.mt=3.6;const fs=foes(b).filter(o=>o.kind!=="head");if(fs.length){const t=pick(fs);zap(b,t,12*b.sc*m.thunder,true);status(t,"stun",.25)}}}
  if(m.moons){if(!M2.mm||M2.mm.length!==m.moons)M2.mm=Array.from({length:m.moons},(_,k)=>({a:k*TAU/m.moons,cd:0}));
    for(const o of M2.mm){o.a+=3*dt;if(o.cd>0){o.cd-=dt;continue}const mx=b.x+Math.cos(o.a)*(b.r+26),my=b.y+Math.sin(o.a)*(b.r+26);
      for(const f of foes(b)){if(f.kind==="head")continue;if(Math.hypot(f.x-mx,f.y-my)<f.r+8){deal(b,f,7*b.sc,{});o.cd=1.1;burst(mx,my,"#C3AEFF",12,240,3);break}}}}
}
function drawMods(b){
  const M2=b.mem;if(!M2.mm)return;
  for(const o of M2.mm){if(o.cd>0)continue;const mx=b.x+Math.cos(o.a)*(b.r+26),my=b.y+Math.sin(o.a)*(b.r+26);glowAt(mx,my,20,"#C3AEFF",.8);ctx.fillStyle="#F2EDFF";circle(mx,my,5.5);ctx.fill()}
}

/* ═════════════════════════ CÀI ĐẶT ĐỒ HOẠ ═════════════════════════ */
const RES_OPTS=[["auto","Tự động"],[.75,"Thấp"],[1,"Chuẩn"],[2,"Cao"],[3,"Siêu nét"]];
const FX_OPTS=[["low","Thấp","Ít hạt, tắt gợn sóng. Mượt nhất cho máy yếu."],["med","Vừa","Cân bằng cho điện thoại."],["high","Cao","Đầy đủ hiệu ứng va chạm."],["ultra","Cực đại","Thêm bloom phát sáng và gấp rưỡi số hạt."]];
function applyGfx(){FXQ=FXQ_LV[S.gfx.fx]||FXQ_LV.high;save();if(!$("#match").hidden)fitCanvas();const f=$("#fps");if(f)f.hidden=!S.gfx.fps}
function resLabel(v){const st=$("#stage");const size=Math.round(Math.min(st.clientWidth||600,st.clientHeight||600,900)||600);const d=Math.min(2,devicePixelRatio||1);const r=v==="auto"?d:v;const px=Math.round(Math.max(320,size)*r);return px+"×"+px}
function openSettings(){
  const seg=(key,opts,cur)=>`<div class="seg" data-key="${key}">${opts.map(([v,l,d])=>`<button data-v="${v}" aria-pressed="${String(cur)===String(v)}"><b>${l}</b>${key==="res"?`<small>${resLabel(v)}</small>`:d?`<small>${d}</small>`:""}</button>`).join("")}</div>`;
  const tog=(key,label,desc)=>`<button class="tog" data-tog="${key}" aria-pressed="${!!S.gfx[key]}"><span><b>${label}</b><small>${desc}</small></span><i></i></button>`;
  $("#layer").insertAdjacentHTML("beforeend",`<div class="overlay" id="gfxOv"><div class="sheet gfx" role="dialog" aria-label="Cài đặt đồ hoạ">
    <div><span class="idx"><b>(⚙)</b> — Áp dụng ngay, kể cả đang trong trận</span><h2>ĐỒ HOẠ</h2></div>
    <div class="grp"><span class="idx">Độ phân giải sàn đấu</span>${seg("res",RES_OPTS,S.gfx.res)}</div>
    <div class="grp"><span class="idx">Chất lượng hiệu ứng</span>${seg("fx",FX_OPTS,S.gfx.fx)}</div>
    <div class="grp">${tog("shake","Rung màn hình","Rung khi va chạm mạnh và hạ gục.")}${tog("fps","Hiện FPS","Đếm khung hình ở góc sàn đấu.")}</div>
    <div class="row-end gfx-foot"><p class="author">Tác giả <b>Trần Đức Long</b> · GitHub: <a href="https://github.com/Kokonut-Original" target="_blank" rel="noopener">Kokonut-Original</a></p><button class="btn btn-main mag" id="gfxClose">Xong</button></div></div></div>`);
  const ov=$("#gfxOv");
  ov.querySelectorAll(".seg").forEach(sg=>sg.querySelectorAll("button").forEach(bt=>bt.onclick=()=>{const k=sg.dataset.key;let v=bt.dataset.v;if(k==="res"&&v!=="auto")v=+v;S.gfx[k]=v;sg.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===bt));applyGfx();sfx.click()}));
  ov.querySelectorAll("[data-tog]").forEach(bt=>bt.onclick=()=>{const k=bt.dataset.tog;S.gfx[k]=!S.gfx[k];bt.setAttribute("aria-pressed",S.gfx[k]);applyGfx();sfx.click()});
  const close=()=>ov.remove();$("#gfxClose").onclick=close;ov.onclick=e=>{if(e.target===ov)close()};bindFx(ov);sfx.click();
}
