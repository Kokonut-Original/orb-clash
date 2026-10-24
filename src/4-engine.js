
/* ═════════════════════════ TIỆN ÍCH ═════════════════════════ */
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const rand=(a,b)=>a+Math.random()*(b-a);
const pick=a=>a[Math.floor(Math.random()*a.length)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const fmt=n=>Math.round(n).toLocaleString("vi-VN");
const lvScale=lv=>1+.06*(lv-1);
const REDUCED=matchMedia("(prefers-reduced-motion: reduce)").matches;
function rgb(hex){const n=parseInt(hex.slice(1),16);return[(n>>16)&255,(n>>8)&255,n&255]}
function hexA(hex,a){const c=rgb(hex);return`rgba(${c[0]},${c[1]},${c[2]},${a})`}
function lum(hex){const c=rgb(hex);return(c[0]*.299+c[1]*.587+c[2]*.114)/255}
function shade(hex,t){const c=rgb(hex).map(v=>Math.round(t>0?v+(255-v)*t:v*(1+t)));return`rgb(${c[0]},${c[1]},${c[2]})`}

/* ═════════════════════════ LƯU TRỮ ═════════════════════════ */
const KEY="orbclash.save.v2";
const fresh=()=>({coins:2000,gems:30,owned:{pebble:1,spark:1,moss:1,zippy:1,coal:1},copies:{pebble:1,spark:1,moss:1,zippy:1,coal:1},pity:{basic:0,premium:0,star:0},codes:[],w:0,l:0,diff:"normal",muted:false,best:0,arenaPick:"random",tower:{best:0,ckpt:1,boss:[],run:null},endless:{best:0},gfx:{res:"auto",fx:(innerWidth<700?"med":"high"),shake:true,fps:false}});
let S=fresh();
try{const raw=localStorage.getItem(KEY);if(raw){const s=JSON.parse(raw);S=Object.assign(fresh(),s);const f0=fresh();for(const k of ["tower","endless","gfx"])S[k]=Object.assign(f0[k],s[k]||{});if(!s.copies){S.copies={};for(const id in S.owned)S.copies[id]=S.owned[id]}for(const id in S.owned)if(!(S.copies[id]>0))S.copies[id]=1;for(const id of Object.keys(S.owned))if(!BY_ID[id])delete S.owned[id]}}catch(e){}
const FXQ_LV={low:{p:.35,ripple:false,chroma:false,decal:false,bloom:false,amb:0,glow:.6,light:0},med:{p:.7,ripple:true,chroma:true,decal:true,bloom:false,amb:.5,glow:.85,light:.26},high:{p:1,ripple:true,chroma:true,decal:true,bloom:false,amb:1,glow:1,light:.34},ultra:{p:1.45,ripple:true,chroma:true,decal:true,bloom:true,amb:1.6,glow:1.12,light:.4}};
let FXQ=FXQ_LV[S.gfx.fx]||FXQ_LV.high;
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}

/* ═════════════════════════ ÂM THANH (tổng hợp, không file) ═════════════════════════ */
let AC=null,NOISE=null;
function audio(){if(S.muted)return null;try{if(!AC){AC=new (window.AudioContext||window.webkitAudioContext)();const len=AC.sampleRate*.5;NOISE=AC.createBuffer(1,len,AC.sampleRate);const d=NOISE.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1}if(AC.state==="suspended")AC.resume()}catch(e){return null}return AC}
function tone(f,d=.08,type="triangle",v=.06,slide=0,delay=0){const a=audio();if(!a)return;const t0=a.currentTime+delay,o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(f,t0);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(25,f+slide),t0+d);g.gain.setValueAtTime(v,t0);g.gain.exponentialRampToValueAtTime(.0001,t0+d);o.connect(g).connect(a.destination);o.start(t0);o.stop(t0+d+.03)}
function noise(d=.15,v=.1,freq=1200,q=.8,delay=0){const a=audio();if(!a)return;const t0=a.currentTime+delay,s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();s.buffer=NOISE;f.type="lowpass";f.frequency.setValueAtTime(freq,t0);f.frequency.exponentialRampToValueAtTime(80,t0+d);f.Q.value=q;g.gain.setValueAtTime(v,t0);g.gain.exponentialRampToValueAtTime(.0001,t0+d);s.connect(f).connect(g).connect(a.destination);s.start(t0);s.stop(t0+d+.02)}
let sfxGate=0;
const sfx={
  hit:(amt,crit)=>{const k=Math.min(1,amt/25);noise(.12+k*.15,.08+k*.12,1800+k*2000);tone(140+k*40,.18,"sine",.12+k*.1,-100);if(crit){tone(1400,.15,"square",.03,-900);noise(.3,.08,5000)}},
  tap:()=>{const n=performance.now();if(n-sfxGate<40)return;sfxGate=n;tone(420+Math.random()*120,.05,"square",.025,-200)},
  wall:()=>tone(700+Math.random()*200,.03,"sine",.012),
  pew:()=>{const n=performance.now();if(n-sfxGate<50)return;sfxGate=n;tone(900,.08,"square",.018,-600)},
  zap:()=>{noise(.18,.06,6000,4);tone(1200,.15,"sawtooth",.03,-1000)},
  laser:()=>{tone(220,.5,"sawtooth",.05,600);noise(.4,.06,3000)},
  boom:small=>{noise(small?.3:.7,small?.12:.22,small?1200:900);tone(90,small?.3:.6,"sine",small?.15:.25,-60)},
  ko:()=>{noise(1,.25,700);tone(180,.9,"sawtooth",.08,-160);tone(60,1,"sine",.3,-30)},
  click:()=>tone(880,.04,"sine",.03),
  hover:()=>tone(1500,.025,"sine",.012),
  tick:()=>tone(1600,.02,"square",.015),
  coin:()=>{tone(988,.08,"triangle",.05);tone(1319,.14,"triangle",.05,0,.07)},
  count:n=>tone(n?440:880,n?.12:.35,"square",.05),
  whoosh:()=>noise(.25,.06,2500,.5),
  cast:()=>{tone(520,.14,"triangle",.04,380);tone(1040,.18,"sine",.025,200,.05)},
  reveal:r=>{const base=[523,659,784,988,1175][RARS.indexOf(r)];[0,1,2,3].forEach(i=>tone(base*[1,1.25,1.5,2][i],.25,"triangle",.05,0,i*.08));if(RARS.indexOf(r)>=3)noise(.8,.1,8000)},
};

/* ═════════════════════════ ĐỘNG CƠ TRẬN ĐẤU ═════════════════════════ */
const W=600,H=600,PAD=18,OVERTIME=45,STEER=1.15,DT=1/120;
let G=null;

function abOf(b){return b.abSrc||b.def.ab}
function E(b){if(G.ffa){let best=null,bd=1e9;for(const o of G.mains){if(o.side===b.side||!o.alive)continue;const d=dist(b,o);if(d<bd){bd=d;best=o}}return best||G.mains.find(o=>o.side!==b.side)}return G.mains[1-b.side]}
function alive(b){return !!b&&b.alive}
function dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}
function angTo(a,b){return Math.atan2(b.y-a.y,b.x-a.x)}
function foes(b){return G.balls.filter(o=>o.alive&&o.side!==b.side)}
function targetFor(b){const dec=G.balls.filter(o=>o.alive&&o.side!==b.side&&o.kind==="decoy");if(dec.length){return dec.sort((u,v)=>dist(b,u)-dist(b,v))[0]}return E(b)}

function makeBall(def,lvl,side,x,y,o={}){
  const sc=lvScale(lvl),a=rand(0,TAU),kind=o.kind||"main";
  return{uid:++G.uid,def,side,lvl,sc,kind,x,y,vx:Math.cos(a)*def.spd,vy:Math.sin(a)*def.spd,r:o.r||def.r,
    hp:o.hp||def.hp*sc,max:o.hp||def.hp*sc,dmg:o.dmg??def.dmg*sc,base:def.spd,cd:def.ab.cd?def.ab.cd*rand(.4,.7):0,
    st:{},mem:{},alive:true,flash:0,trail:[],dotShow:0,healShow:0,life:o.life||0,owner:o.owner||null,dmgMul:1,speedMul:1,ai:o.ai||null,spin:rand(0,TAU)};
}
function newFight(pDef,pLv,bDef,bLv){
  G={t:0,uid:0,balls:[],proj:[],zones:[],lines:[],blasts:[],tethers:[],spikes:[],parts:[],sparks:[],rings:[],texts:[],bolts:[],beams:[],flashes:[],decals:[],ripples:[],ghosts:[],glyphs:[],pair:{},
     over:false,endT:0,winner:null,shake:0,stop:0,slowT:0,slowK:1,zoom:0,zx:W/2,zy:H/2,chroma:0,tint:null,screen:0,count:3.6,go:0,ko:null,
     bd:{l:0,t:0,r:W,b:H},ot:OVERTIME,arena:null,as:{},amb:[],label:null,boss:null,horde:false,hordeMax:0,pODn:1,banner:null,botOD:rand(5,15),boxes:[],bxT:6,pOD:false,bOD:false,combo:[{n:0,t:-9},{n:0,t:-9}],hurt:[0,0],round:M?M.round:1};
  const a=makeBall(pDef,pLv,0,160,440),b=makeBall(bDef,bLv,1,440,160);
  G.mains=[a,b];G.balls.push(a,b);
  const ang=angTo(a,b);aimAt(a,b,rand(-.5,.5));aimAt(b,a,rand(-.5,.5));
  for(const m of G.mains)if(m.def.ab.init)m.def.ab.init(m);
}

/* — trạng thái — */
function status(t,k,dur,val){
  if(!t||!t.alive)return;const s=t.st;
  if(k==="poison"){s.poison=Math.min(5,(s.poison||0)+1);s.poisonT=dur;s.poisonDps=Math.max(s.poisonDps||0,val||1.5)}
  else if(k==="burn"||k==="bleed"){s[k]=Math.max(s[k]||0,dur);s[k+"Dps"]=Math.max(s[k+"Dps"]||0,val||2)}
  else if(k==="slow"){s.slow=Math.max(s.slow||0,dur);s.slowAmt=val||.4}
  else s[k]=Math.max(s[k]||0,dur);
  if(k==="freeze"){ring(t.x,t.y,t.r,t.r+20,"#8EDCFF",.4,4);burst(t.x,t.y,"#DFF6FF",10,200,3)}
  if(k==="stun")floater(t,"CHOÁNG","od");
  if(k==="confuse")floater(t,"RỐI LOẠN","od");
}
function dot(t,amt,kind){deal(null,t,amt,{silent:true,kind})}
function heal(b,amt,show){if(!b||!b.alive)return;const before=b.hp;b.hp=Math.min(b.max,b.hp+amt);b.healShow+=b.hp-before;if(show||b.healShow>=6){if(b.healShow>=1)floater(b,"+"+Math.round(b.healShow),"heal");b.healShow=0}}
function knock(t,from,imp){const d=Math.max(1,dist(t,from));t.vx+=(t.x-from.x)/d*imp;t.vy+=(t.y-from.y)/d*imp}
function aimAt(b,e,jit=0){const a=angTo(b,e)+jit,s=Math.max(b.base,Math.hypot(b.vx,b.vy));b.vx=Math.cos(a)*s;b.vy=Math.sin(a)*s}
function dashAt(b,dur){const e=targetFor(b);if(!alive(e))return;status(b,"dash",dur);const a=angTo(b,e);b.vx=Math.cos(a)*b.base*2.2;b.vy=Math.sin(a)*b.base*2.2;ring(b.x,b.y,b.r,b.r+24,b.def.color,.3,3);sfx.whoosh()}
function slowmo(k,dur){G.slowK=Math.min(G.slowT>0?G.slowK:1,k);G.slowT=Math.max(G.slowT,dur)}

/* — sát thương — */
function bumpCombo(side){const c=G.combo[side];c.n=G.t-c.t<1.8?c.n+1:1;c.t=G.t;if(c.n>=3&&c.n%2===1)G.texts.push({x:W/2,y:side?90:H-70,txt:c.n+" COMBO",kind:side?"cfoe":"cyou",t:0,big:true})}
function deal(src,tgt,amt,o={}){
  if(!tgt||!tgt.alive||!(amt>0))return 0;
  if(DBG.god&&tgt===G.mains[0])return 0;
  if(tgt.st.invuln>0){if(!o.silent)floater(tgt,"MIỄN","shield");return 0}
  const ab=tgt.kind==="main"?abOf(tgt):null;
  if(ab&&ab.takenMult)amt*=ab.takenMult;
  if(ab&&ab.onHurt){amt=ab.onHurt(tgt,src,amt,o);if(!(amt>0))return 0}
  if(tgt.st.shield>0){const s=Math.min(tgt.st.shield,amt);tgt.st.shield-=s;amt-=s;if(!o.silent)ring(tgt.x,tgt.y,tgt.r+6,tgt.r+16,"#8FD3FF",.25,3);if(amt<=0){if(!o.silent)floater(tgt,"CHẶN","shield");return 0}}
  if(tgt.mods&&tgt.mods.thorns&&src&&src!==tgt&&alive(src)&&!o.reflected&&!o.silent)deal(tgt,src,amt*tgt.mods.thorns,{reflected:true});
  if(src&&src.mods&&src.mods.lifesteal&&!o.reflected&&src!==tgt)heal(src,amt*src.mods.lifesteal);
  if(src&&src.st&&src.st.vamp>0&&src!==tgt&&!o.reflected)heal(src,amt*.5);
  tgt.hp-=amt;
  if(!o.silent){
    tgt.flash=.14;floater(tgt,Math.round(amt),o.crit?"crit":"dmg",amt);
    if(!o.contact){burst(tgt.x,tgt.y,tgt.def.color,8,240,3);sparkBurst(tgt.x,tgt.y,[tgt.def.color,"#ffffff"],8,420);G.shake=Math.min(22,G.shake+2+amt*.35);sfx.tap()}
    if(src&&src.side!==tgt.side)bumpCombo(src.side);
    if(tgt.kind==="main")G.hurt[tgt.side]=1;
  }else{tgt.dotShow+=amt;if(tgt.dotShow>=4){floater(tgt,Math.round(tgt.dotShow),o.kind||"dot");tgt.dotShow=0}}
  if(tgt.hp<=0){tgt.hp=0;if(tgt.dying)return amt;tgt.dying=true;let saved=!!(ab&&ab.onDeath&&ab.onDeath(tgt));if(!saved&&tgt.mods&&tgt.mods.revive>0){tgt.mods.revive--;saved=true;tgt.hp=tgt.max*.5;status(tgt,"invuln",1.3);floater(tgt,"PHƯỢNG HOÀNG","od");explode(tgt.x,tgt.y,120,12*tgt.sc,tgt,"#FF7A1A");G.tint={c:"#FF7A1A",t:.6};slowmo(.3,.5)}tgt.dying=false;if(!saved)kill(tgt,src)}
  return amt;
}
function kill(b){
  if(!b.alive)return;b.alive=false;
  if(b.kind!=="main"){burst(b.x,b.y,b.def.color,16,260,3);sparkBurst(b.x,b.y,[b.def.color,"#fff"],14,500);ring(b.x,b.y,b.r,b.r+30,b.def.color,.35,3);return}
  if(G.ffa&&G.mains.filter(o=>o.alive).length>=2){G.elim.push(b.side);G.flashes.push({x:b.x,y:b.y,r:200,t:0,dur:.4,c:b.def.color});ring(b.x,b.y,b.r,b.r+110,b.def.color,.55,5);sparkBurst(b.x,b.y,[b.def.color,"#fff"],50,900);ripple(b.x,b.y,24);decal(b.x,b.y,b.r*2,b.def.color);G.shake=Math.min(26,G.shake+12);G.stop=.1;slowmo(.4,.4);sfx.boom(false);
    G.texts.push({feed:1,x:W/2,y:70+G.texts.filter(t=>t.feed).length*34,txt:(b.side===0?"CON BẠN BỊ LOẠI":"LOẠI: "+b.def.name.toUpperCase())+" · CÒN "+G.mains.filter(o=>o.alive).length,kind:b.side===0?"cfoe":"cyou",t:0,big:true});return}
  if(G.horde&&b.side===1&&G.balls.some(o=>o!==b&&o.alive&&o.side===1&&(o.kind==="main"||o.kind==="unit"))){G.flashes.push({x:b.x,y:b.y,r:160,t:0,dur:.35,c:b.def.color});ring(b.x,b.y,b.r,b.r+90,b.def.color,.5,5);sparkBurst(b.x,b.y,[b.def.color,"#fff"],40,800);ripple(b.x,b.y,20);G.shake=Math.min(26,G.shake+12);G.stop=.08;sfx.boom(true);return}
  G.ko={x:b.x,y:b.y,side:b.side,t:0,c:b.def.color};
  G.flashes.push({x:b.x,y:b.y,r:260,t:0,dur:.5,c:"#ffffff"});
  for(let i=0;i<4;i++)ring(b.x,b.y,b.r,b.r+120+i*70,i%2?b.def.color:"#ffffff",.5+i*.15,6-i);
  sparkBurst(b.x,b.y,[b.def.color,"#ffffff",shade(b.def.color,.5)],90,1100);
  for(let i=0;i<26;i++){const a=rand(0,TAU),s=rand(120,520);G.parts.push({x:b.x,y:b.y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:rand(.8,1.6),max:1.6,color:b.def.color,size:rand(3,8),chunk:true,rot:rand(0,TAU),vr:rand(-12,12)})}
  ripple(b.x,b.y,40);decal(b.x,b.y,b.r*2.2,b.def.color);
  G.shake=30;G.stop=.2;slowmo(.18,1.5);G.zoom=.22;G.zx=b.x;G.zy=b.y;G.screen=.7;G.chroma=.5;
  sfx.ko();
}

/* — hiệu ứng (fx) — */
function ring(x,y,r0,r1,c,dur=.45,w=3){G.rings.push({x,y,r0,r1,c,t:0,dur,w})}
function burst(x,y,c,n=10,sp=220,size=3){n=Math.round(n*FXQ.p);for(let i=0;i<n;i++){const a=rand(0,TAU),s=rand(.25,1)*sp;G.parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:rand(.3,.75),max:.75,color:c,size:rand(size*.5,size*1.4),add:true})}}
function sparkBurst(x,y,cols,n,sp,dirA){n=Math.round(n*FXQ.p);for(let i=0;i<n;i++){const a=dirA!==undefined?dirA+rand(-.9,.9)+(Math.random()<.5?Math.PI:0):rand(0,TAU),s=rand(.3,1)*sp;G.sparks.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:rand(.18,.5),max:.5,c:pick(cols),w:rand(1.4,3.2)})}}
function ripple(x,y,amp){if(!FXQ.ripple)return;G.ripples.push({x,y,t:0,amp});if(G.ripples.length>7)G.ripples.shift()}
function decal(x,y,r,c){if(!FXQ.decal)return;G.decals.push({x,y,r,c,t:0,life:6});if(G.decals.length>40)G.decals.shift()}
function floater(b,txt,kind,amt=0){G.texts.push({x:b.x+rand(-10,10),y:b.y-b.r-10,txt:String(txt),kind,t:0,amt})}
function beam(x1,y1,x2,y2,c,dur=.3,w=4){G.beams.push({x1,y1,x2,y2,c,t:0,dur,w})}
function ghostAt(b){G.ghosts.push({x:b.x,y:b.y,r:b.r,c:b.def.color,t:0,dur:.5})}

/* — hiệu ứng cast chiêu theo nguyên tố — */
const EL_COL={fire:["#FF6A2A","#FFC23D"],ice:["#8EDCFF","#E8FBFF"],water:["#36A8FF","#9EE6FF"],elec:["#FFE45E","#FFFFFF"],poison:["#7DDB3A","#C6F06A"],nature:["#5CF2A8","#B4FF8A"],earth:["#C9A66B","#8A6B3A"],dark:["#8A5CFF","#D8B8FF"],light:["#FFF2B0","#FFFFFF"],steel:["#C9D1E2","#FFFFFF"],wind:["#BDEBFF","#FFFFFF"],arcane:["#C3AEFF","#FF8AF0"]};
function castFx(b){
  if(!b||!G||b.kind!=="main")return;
  const el=b.def.el||"arcane",c=EL_COL[el]||EL_COL.arcane,cx=b.x,cy=b.y,R=b.r,n=Math.max(4,Math.round(16*FXQ.p));
  b.cast=.5;
  G.glyphs.push({x:cx,y:cy,r:R,def:b.def,t:0,dur:.75});
  ring(cx,cy,R,R+50,c[0],.5,5);ring(cx,cy,R*.6,R+100,c[1],.75,2);
  G.flashes.push({x:cx,y:cy,r:R*3.4,t:0,dur:.32,c:c[0]});
  const P=o=>G.parts.push(Object.assign({life:rand(.5,1),max:1},o));
  for(let i=0;i<n;i++){const a=rand(0,TAU),s=rand(80,320),col=pick(c);
    if(el==="fire")P({x:cx+rand(-R,R),y:cy+rand(0,R*.6),vx:rand(-50,50),vy:rand(-300,-90),color:col,size:rand(2.5,5.5),add:true});
    else if(el==="ice")P({x:cx,y:cy,vx:Math.cos(a)*s,vy:Math.sin(a)*s,color:col,size:rand(3,6),chunk:true,rot:rand(0,TAU),vr:rand(-10,10)});
    else if(el==="water")P({x:cx+rand(-R,R),y:cy+rand(-R,R),vx:rand(-40,40),vy:rand(-160,-40),color:col,size:rand(3,6),ringP:true});
    else if(el==="poison")P({x:cx+rand(-R,R),y:cy+rand(-R,R),vx:rand(-60,60),vy:rand(-140,-30),color:col,size:rand(3,7),ringP:true});
    else if(el==="nature")P({x:cx,y:cy,vx:Math.cos(a)*s*.7,vy:Math.sin(a)*s*.7-80,color:col,size:rand(3,6),chunk:true,rot:rand(0,TAU),vr:rand(-6,6)});
    else if(el==="earth")P({x:cx,y:cy,vx:Math.cos(a)*s,vy:Math.sin(a)*s-120,color:col,size:rand(3,7),chunk:true,rot:rand(0,TAU),vr:rand(-12,12)});
    else if(el==="dark"){const d=rand(70,130);P({x:cx+Math.cos(a)*d,y:cy+Math.sin(a)*d,vx:-Math.cos(a)*d*2.2,vy:-Math.sin(a)*d*2.2,color:col,size:rand(2,4.5),add:true,life:.45})}
    else if(el==="light")P({x:cx,y:cy,vx:Math.cos(a)*s*1.2,vy:Math.sin(a)*s*1.2,color:col,size:rand(1.8,3.5),add:true});
    else P({x:cx,y:cy,vx:Math.cos(a)*s,vy:Math.sin(a)*s,color:col,size:rand(2,4.5),add:true});
  }
  if(el==="elec"){sparkBurst(cx,cy,c,26,760);for(let i=0;i<4;i++)beam(cx,cy,cx+rand(-80,80),cy+rand(-80,80),c[0],.2,2.5)}
  else if(el==="steel"||el==="light")sparkBurst(cx,cy,c,24,700);
  else if(el==="wind"){for(let i=0;i<3;i++)ring(cx,cy,R*(.6+i*.4),R+70+i*30,c[1],.5+i*.12,2)}
  else if(el==="earth"){G.shake=Math.min(26,G.shake+5);ripple(cx,cy,14)}
  else if(el==="water"){ripple(cx,cy,12)}
  else if(el==="dark"){G.tint={c:"#8A5CFF",t:.25}}
  G.shake=Math.min(26,G.shake+3);sfx.cast();
}
function impact(x,y,nx,ny,amt,cA,cB,crit){
  const k=clamp(amt/12,.3,3);
  G.flashes.push({x,y,r:30+amt*3.4,t:0,dur:.16,c:"#ffffff"});
  ring(x,y,4,44+amt*5,"#ffffff",.3,3);ring(x,y,4,34+amt*4,cA,.45,6);ring(x,y,4,26+amt*3.2,cB,.55,3);
  sparkBurst(x,y,[cA,cB,"#ffffff"],Math.min(80,16+amt*2.4),420+k*260,Math.atan2(ny,nx)+Math.PI/2);
  burst(x,y,cA,7,240,4);burst(x,y,cB,7,240,4);
  ripple(x,y,7+amt);decal(x,y,10+amt*1.4,cA);
  G.shake=Math.min(26,G.shake+4+amt*.75);
  G.stop=Math.max(G.stop,Math.min(.16,.03+amt*.005)*(crit?1.6:1));
  if(amt>10||crit){G.zoom=Math.max(G.zoom,Math.min(.14,.03+amt*.004));G.zx=x;G.zy=y}
  if(crit){G.chroma=Math.max(G.chroma,.35);G.speed={x,y,t:0};G.texts.push({x,y:y-40,txt:"CHÍ MẠNG!",kind:"critbig",t:0});slowmo(.35,.22)}
  sfx.hit(amt,crit);
}
function explode(x,y,R,dmg,src,color,o={}){
  G.flashes.push({x,y,r:R*1.2,t:0,dur:.28,c:color});G.flashes.push({x,y,r:R*.6,t:0,dur:.18,c:"#ffffff"});
  ring(x,y,6,R,"#ffffff",.35,4);ring(x,y,6,R*1.2,color,.6,8);ring(x,y,R*.2,R*.85,color,.75,2);
  sparkBurst(x,y,[color,"#ffffff",shade(color,.4)],o.small?18:56,R*4.5);burst(x,y,color,o.small?8:26,R*2.6,4);
  ripple(x,y,o.small?10:26);decal(x,y,R*.55,color);
  G.shake=Math.min(28,G.shake+(o.small?6:16));if(!o.small)G.screen=Math.max(G.screen,.25);sfx.boom(o.small);
  const sd=src?src.side:-1;
  for(const t of G.balls){if(!t.alive||t.side===sd)continue;const d=Math.hypot(t.x-x,t.y-y);if(d<R+t.r){deal(src,t,dmg,{crit:true});const n=Math.max(d,1);t.vx+=(t.x-x)/n*360;t.vy+=(t.y-y)/n*360}}
}
function zap(src,tgt,dmg,sky){
  const x1=sky?tgt.x+rand(-60,60):src.x,y1=sky?G.bd.t-20:src.y;
  G.bolts.push({x1,y1,x2:tgt.x,y2:tgt.y,t:0,dur:.32,seed:Math.random()*1000,c:src.def.color});
  G.flashes.push({x:tgt.x,y:tgt.y,r:70,t:0,dur:.2,c:"#E8F4FF"});sparkBurst(tgt.x,tgt.y,["#ffffff",src.def.color],22,520);
  deal(src,tgt,dmg,{});G.screen=Math.max(G.screen,.15);sfx.zap();
}

/* — vật thể kỹ năng — */
function shoot(b,o){
  const tg=o.target||targetFor(b);
  let a=o.a;if(a===undefined){if(!alive(tg))return;let tx=tg.x,ty=tg.y;if(o.lead){tx+=tg.vx*o.lead;ty+=tg.vy*o.lead}a=Math.atan2(ty-b.y,tx-b.x)}
  const spd=o.spd||520;
  G.proj.push(Object.assign({el:b.def.el,kind:"pellet",r:5,dmg:b.dmg*.7,life:2.2,bounces:0,pierce:false,homing:0},o,{x:b.x+Math.cos(a)*b.r,y:b.y+Math.sin(a)*b.r,a,spd,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,owner:b,side:b.side,t:0,hit:new Set(),c:b.def.color,trail:[]}));
  sfx.pew();
}
function zone(b,o){G.zones.push(Object.assign({kind:"zone",x:b.x,y:b.y,r:60,life:3,dps:0,slow:0,pull:0},o,{owner:b,side:b.side,t:0,c:b.def.color,max:o.life||3}))}
function line(b,o){G.lines.push(Object.assign({delay:.7,w:24,dmg:15,both:false},o,{owner:b,side:b.side,t:0,c:b.def.color,fired:false}));sfx.laser()}
function blast(b,o){G.blasts.push(Object.assign({kind:"bomb",r:70,delay:1,dmg:15},o,{owner:b,side:b.side,t:0,c:b.def.color}))}
function tether(b,t,dur,dps){G.tethers.push({a:b,b:t,t:0,dur,dps});sfx.zap();ring(t.x,t.y,t.r,t.r+20,"#9AA4B8",.3,3)}
function plantSpike(b,hit){if(!hit)return;const mine=G.spikes.filter(p=>p.owner===b);if(mine.length>=8)G.spikes.splice(G.spikes.indexOf(mine[0]),1);G.spikes.push({x:hit.x,y:hit.y,nx:hit.nx,ny:hit.ny,owner:b,side:b.side,dmg:13*b.sc,t:0})}
function wallAhead(e){
  const sp=Math.hypot(e.vx,e.vy)||1,dx=e.vx/sp,dy=e.vy/sp,B=G.bd;
  const tx=dx>0?(B.r-e.x)/dx:dx<0?(B.l-e.x)/dx:1e9,ty=dy>0?(B.b-e.y)/dy:dy<0?(B.t-e.y)/dy:1e9;
  return tx<ty?{x:dx>0?B.r:B.l,y:clamp(e.y+dy*tx,B.t+12,B.b-12),nx:dx>0?-1:1,ny:0}:{x:clamp(e.x+dx*ty,B.l+12,B.r-12),y:dy>0?B.b:B.t,nx:0,ny:dy>0?-1:1};
}
function spawnMinion(b,o){
  const a=rand(0,TAU),x=clamp(o.x??b.x+Math.cos(a)*b.r*2,G.bd.l+20,G.bd.r-20),y=clamp(o.y??b.y+Math.sin(a)*b.r*2,G.bd.t+20,G.bd.b-20);
  const m=makeBall(b.def,b.lvl,b.side,x,y,Object.assign({},o,{owner:b}));m.owner=b;
  if(o.kind==="decoy"){m.vx=b.vx*rand(-1,1);m.vy=b.vy*rand(-1,1)}
  G.balls.push(m);ring(x,y,4,m.r+18,b.def.color,.4,3);burst(x,y,b.def.color,10,200,3);return m;
}
function clone(b){spawnMinion(b,{kind:"clone",r:b.r*.65,hp:60*b.sc,dmg:b.dmg*.75,life:10});floater(b,"PHÂN THÂN","od")}
function turretAI(h,dt){
  const o=h.owner;h.x=h.mem.px;h.y=h.mem.py;h.vx=0;h.vy=0;h.mem.life-=dt;
  if(h.mem.life<=0||!alive(o)){kill(h);return}
  h.mem.cd=(h.mem.cd??.35)-dt;if(h.mem.cd<=0){h.mem.cd=.8;const e=E(o);if(alive(e))shoot(h,{target:e,spd:640,dmg:o.dmg*.4,r:4,life:1.5,lead:.1})}
}
function headAI(h,dt){
  const o=h.owner;if(!alive(o)){h.alive=false;return}
  const heads=G.balls.filter(c=>c.kind==="head"&&c.owner===o&&c.alive),i=heads.indexOf(h);
  const a=G.t*1.6+i*TAU/Math.max(1,heads.length);h.x=o.x+Math.cos(a)*(o.r+16);h.y=o.y+Math.sin(a)*(o.r+16);
  h.mem.cd=(h.mem.cd??rand(.3,1.2))-dt;if(h.mem.cd<=0){h.mem.cd=1.3;shoot(h,{kind:"spit",spd:430,dmg:o.dmg*.45,r:5,onHit:(p,t)=>status(t,"poison",3,1*o.sc)})}
}

/* — mô phỏng — */
function updateBall(b,dt){
  const s=b.st;
  for(const k of ["freeze","stun","slow","chrono","confuse","haste","crit","invuln","dash","power","weak","vamp","star","silence"])if(s[k]>0)s[k]-=dt;
  if(b.flash>0)b.flash-=dt;
  if(s.burn>0){s.burn-=dt;dot(b,s.burnDps*dt,"burn");if(Math.random()<dt*30)G.parts.push({x:b.x+rand(-b.r,b.r)*.7,y:b.y+rand(-b.r,b.r)*.5,vx:rand(-20,20),vy:rand(-120,-60),life:.45,max:.45,color:pick(["#FF6A3D","#FFC23D"]),size:rand(2,4),add:true})}
  if(s.bleed>0){s.bleed-=dt;dot(b,s.bleedDps*dt,"bleed");if(Math.random()<dt*14)G.parts.push({x:b.x,y:b.y,vx:rand(-60,60),vy:rand(30,90),life:.5,max:.5,color:"#E0223F",size:2.5})}
  if(s.poison>0){s.poisonT-=dt;dot(b,s.poison*s.poisonDps*dt,"poison");if(s.poisonT<=0)s.poison=0;if(Math.random()<dt*12)G.parts.push({x:b.x+rand(-b.r,b.r)*.6,y:b.y,vx:0,vy:-50,life:.6,max:.6,color:"#A6E22E",size:rand(2,4),ringP:true})}
  if(!b.alive)return;
  if(b.kind!=="main"){
    if(b.ai)b.ai(b,dt);
    if(b.kind!=="head"){b.life-=dt;if(b.life<=0)kill(b)}
    if(b.owner&&!b.owner.alive)kill(b);
    return;
  }
  const ab=abOf(b);
  if(ab.update)ab.update(b,dt);
  if(b.mods)modsUpdate(b,dt);
  if(ab.cd&&!(s.stun>0)&&!(s.silence>0)&&b.alive){b.cd-=dt*(s.chrono>0?.4:1)*(b.mods?b.mods.cdRate||1:1);if(b.cd<=0){b.cd=ab.cd;if(ab.trigger){castFx(b);ab.trigger(b)}}}
}
function move(b,dt){
  if(b.kind==="head")return;
  const s=b.st;
  let target=b.base*(s.dash>0?2.2:1)*(s.freeze>0?.3:1)*(s.slow>0?1-s.slowAmt:1)*(s.chrono>0?.4:1)*(s.haste>0?1.5:1)*b.speedMul*(G.arena&&G.arena.spd||1);
  if(s.stun>0)target*=.08;
  let sp=Math.hypot(b.vx,b.vy);if(sp<1){const a=rand(0,TAU);b.vx=Math.cos(a);b.vy=Math.sin(a);sp=1}
  if(!(s.freeze>0)&&!(s.stun>0)&&b.kind!=="decoy"){
    const sk=b.mem.seek,tg=(sk&&b.mem.seekT>G.t&&!sk.gone)?sk:targetFor(b);
    if(alive(tg)){let want=angTo(b,tg);if(s.confuse>0)want+=Math.PI;const cur=Math.atan2(b.vy,b.vx);const da=clamp(Math.atan2(Math.sin(want-cur),Math.cos(want-cur)),-STEER*(G.arena&&G.arena.steer||1)*dt,STEER*(G.arena&&G.arena.steer||1)*dt);const c=Math.cos(da),sn=Math.sin(da),vx=b.vx;b.vx=vx*c-b.vy*sn;b.vy=vx*sn+b.vy*c}
  }
  const ns=sp+(target-sp)*Math.min(1,dt*2.5);b.vx*=ns/sp;b.vy*=ns/sp;
  b.x+=b.vx*dt;b.y+=b.vy*dt;
  const B=G.bd;let hit=null;
  if(b.x-b.r<B.l){b.x=B.l+b.r;b.vx=Math.abs(b.vx);hit={x:B.l,y:b.y,nx:1,ny:0}}
  else if(b.x+b.r>B.r){b.x=B.r-b.r;b.vx=-Math.abs(b.vx);hit={x:B.r,y:b.y,nx:-1,ny:0}}
  if(b.y-b.r<B.t){b.y=B.t+b.r;b.vy=Math.abs(b.vy);hit={x:b.x,y:B.t,nx:0,ny:1}}
  else if(b.y+b.r>B.b){b.y=B.b-b.r;b.vy=-Math.abs(b.vy);hit={x:b.x,y:B.b,nx:0,ny:-1}}
  if(hit){
    const a=rand(-.12,.12),c=Math.cos(a),sn=Math.sin(a),vx=b.vx;b.vx=vx*c-b.vy*sn;b.vy=vx*sn+b.vy*c;
    if(b.kind==="main"){const ab=abOf(b);if(ab.onWall)ab.onWall(b,hit);if(G.arena&&G.arena.hotWall&&!(b.mem.hw>G.t)){b.mem.hw=G.t+.5;status(b,"burn",1.5,G.arena.hotWall);sparkBurst(hit.x,hit.y,["#FF6A2A","#FFC23D"],10,320)}
      if(sp>200){sparkBurst(hit.x,hit.y,[b.def.color,"#ffffff"],6,300,Math.atan2(hit.ny,hit.nx)+Math.PI/2);G.wallHit={x:hit.x,y:hit.y,t:0,nx:hit.nx,ny:hit.ny,c:b.def.color}}
      if(Math.random()<.5)sfx.wall()}
  }
  b.spin+=dt*sp/Math.max(8,b.r);
  b.trail.push(b.x,b.y);if(b.trail.length>24)b.trail.splice(0,2);
}
function collide(a,b){
  if(a.kind==="head"||b.kind==="head")return;
  if(a.side===b.side)return;
  const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy),min=a.r+b.r;
  if(d>=min||d===0)return;
  const nx=dx/d,ny=dy/d,ma=a.r*a.r,mb=b.r*b.r,ov=min-d;
  a.x-=nx*ov*mb/(ma+mb);a.y-=ny*ov*mb/(ma+mb);b.x+=nx*ov*ma/(ma+mb);b.y+=ny*ov*ma/(ma+mb);
  const pa=Math.max(0,a.vx*nx+a.vy*ny),pb=Math.max(0,-(b.vx*nx+b.vy*ny));
  const rel=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;
  if(rel<0){const j=-2*rel/(1/ma+1/mb);a.vx-=j*nx/ma;a.vy-=j*ny/ma;b.vx+=j*nx/mb;b.vy+=j*ny/mb}
  contact(a,b,a.x+nx*a.r,a.y+ny*a.r,nx,ny,pa,pb);
}
function hitBy(att,tgt,k=1){
  const ab=att.kind==="main"?abOf(att):att.mem.ghost?att.def.ab:null;
  const i={amt:(att.dmg+(att.mem.grow||0))*att.dmgMul*k*rand(.85,1.15),crit:false,dealt:0};
  if(att.st.dash>0)i.amt*=1.5;
  if(att.st.power>0)i.amt*=2;if(att.st.star>0)i.amt*=1.5;if(att.st.weak>0)i.amt*=.65;
  if(att.st.crit>0){i.amt*=2;i.crit=true;att.st.crit=0}
  if(att.mods&&att.mods.critCh&&Math.random()<att.mods.critCh){i.amt*=2;i.crit=true}
  if(ab&&ab.preHit)ab.preHit(att,tgt,i);
  i.dealt=deal(att,tgt,i.amt,{crit:i.crit,contact:true});
  if(ab&&ab.onHit&&att.alive)ab.onHit(att,tgt,i);
  if(att.mods&&att.mods.boom&&i.crit&&att.alive)explode(tgt.x,tgt.y,85,9*att.mods.boom*att.sc,att,att.def.color,{small:true});
  return i;
}
function contact(a,b,px,py,nx,ny,pa=1,pb=1){
  const k=a.uid<b.uid?a.uid+"-"+b.uid:b.uid+"-"+a.uid;
  if(G.t-(G.pair[k]??-9)<.25)return;G.pair[k]=G.t;
  if(a.kind==="decoy"||b.kind==="decoy"){const d=a.kind==="decoy"?a:b;explode(d.x,d.y,60,8*d.sc,d.owner||d,d.def.color,{small:true});kill(d);return}
  // ai lao vào mạnh hơn thì đánh đau hơn (0.55× → 1.45×)
  const sh=pa/(pa+pb+1e-3),ia=hitBy(a,b,.55+.9*sh),ib=hitBy(b,a,.55+.9*(1-sh));
  impact(px,py,nx,ny,ia.dealt+ib.dealt,a.def.color,b.def.color,ia.crit||ib.crit);
  for(const m of [a,b])if(m.mem.kamikaze&&m.alive){explode(m.x,m.y,52,(m.mem.kdmg||7)*m.sc,m.owner||m,m.def.color,{small:true});kill(m)}
}
function segDist(px,py,x1,y1,x2,y2){const dx=x2-x1,dy=y2-y1,l=dx*dx+dy*dy||1;const t=clamp(((px-x1)*dx+(py-y1)*dy)/l,0,1);return Math.hypot(px-(x1+dx*t),py-(y1+dy*t))}
function lineEnds(L){const L2=900,dx=Math.cos(L.a),dy=Math.sin(L.a);return L.both?[L.x-dx*L2,L.y-dy*L2,L.x+dx*L2,L.y+dy*L2]:[L.x,L.y,L.x+dx*L2,L.y+dy*L2]}
function step(dt){
  G.t+=dt;
  if(G.horde)hordeFocus();
  for(const b of G.balls)if(b.alive)updateBall(b,dt);
  for(const b of G.balls)if(b.alive)move(b,dt);
  arenaStep(dt);boxStep(dt);
  const live=G.balls.filter(b=>b.alive);
  for(let i=0;i<live.length;i++)for(let j=i+1;j<live.length;j++)if(live[i].alive&&live[j].alive)collide(live[i],live[j]);
  // đạn
  const B=G.bd;
  for(const p of G.proj){
    p.t+=dt;p.life-=dt;
    if(p.homing){let best=null,bd=1e9;for(const o of G.balls){if(!o.alive||o.side===p.side)continue;const d=Math.hypot(o.x-p.x,o.y-p.y);if(d<bd){bd=d;best=o}}
      if(best){const da=Math.atan2(Math.sin(Math.atan2(best.y-p.y,best.x-p.x)-p.a),Math.cos(Math.atan2(best.y-p.y,best.x-p.x)-p.a));p.a+=clamp(da,-p.homing*dt,p.homing*dt)}
      const sp=p.spd+(p.kind==="bee"?Math.sin(G.t*22+p.x)*50:0);p.vx=Math.cos(p.a)*sp;p.vy=Math.sin(p.a)*sp}
    if(p.kind==="boomer"){if(!p.back&&p.t>p.ret){p.back=true;p.hit.clear()}
      if(p.back){if(!alive(p.owner))p.life=0;else{const a=Math.atan2(p.owner.y-p.y,p.owner.x-p.x);p.vx=Math.cos(a)*p.spd*1.15;p.vy=Math.sin(a)*p.spd*1.15;if(dist(p,p.owner)<p.owner.r)p.life=0}}}
    p.x+=p.vx*dt;p.y+=p.vy*dt;
    p.trail.push(p.x,p.y);if(p.trail.length>16)p.trail.splice(0,2);
    let out=false;
    if(p.x<B.l+p.r){p.x=B.l+p.r;p.vx=Math.abs(p.vx);out=true}else if(p.x>B.r-p.r){p.x=B.r-p.r;p.vx=-Math.abs(p.vx);out=true}
    if(p.y<B.t+p.r){p.y=B.t+p.r;p.vy=Math.abs(p.vy);out=true}else if(p.y>B.b-p.r){p.y=B.b-p.r;p.vy=-Math.abs(p.vy);out=true}
    if(out){if(p.kind==="boomer"){p.back=true}else if(p.bounces>0){p.bounces--;p.a=Math.atan2(p.vy,p.vx);if(p.kind==="ric"){p.spd*=1.15;p.vx*=1.15;p.vy*=1.15;sparkBurst(p.x,p.y,[p.c,"#fff"],6,260)}}else{p.life=0;sparkBurst(p.x,p.y,[p.c],5,200)}}
    for(const o of G.balls){if(!o.alive||o.side===p.side||p.life<=0||p.hit.has(o.uid))continue;
      if(Math.hypot(o.x-p.x,o.y-p.y)<o.r+p.r){p.hit.add(o.uid);
        if(o.kind==="decoy")kill(o);else{deal(p.owner,o,p.dmg,{});if(p.onHit)p.onHit(p,o)}
        sparkBurst(p.x,p.y,[p.c,"#ffffff"],10,380);if(!p.pierce)p.life=0}}
  }
  G.proj=G.proj.filter(p=>p.life>0&&(p.kind!=="bee"||alive(p.owner)));
  // vùng
  for(const z of G.zones){
    z.t+=dt;z.life-=dt;
    if(z.kind==="mine"){if(z.t>z.arm)for(const o of foes(z.owner)){if(Math.hypot(o.x-z.x,o.y-z.y)<o.r+z.r+16){explode(z.x,z.y,78,z.dmg,z.owner,"#FF5470");z.life=0;break}}continue}
    if(z.arm&&z.t<z.arm)continue;
    for(const o of G.balls){if(!o.alive||o.side===z.side)continue;const d=Math.hypot(o.x-z.x,o.y-z.y);if(d>z.r+o.r*.5)continue;
      if(z.pull){const n=Math.max(d,1);o.vx+=(z.x-o.x)/n*z.pull*dt;o.vy+=(z.y-o.y)/n*z.pull*dt;if(d<60)dot(o,z.dps*dt,"dot")}
      else{if(z.dps)dot(o,z.dps*dt,z.kind==="fire"?"burn":"dot");if(z.slow)status(o,"slow",.15,z.slow)}}
  }
  G.zones=G.zones.filter(z=>z.life>0&&(z.kind!=="mine"||alive(z.owner)));
  // tia
  for(const L of G.lines){
    L.t+=dt;
    if(!L.fired&&L.track&&alive(L.track)){L.x=L.track.x;L.y=L.track.y;const e=E(L.track);if(alive(e)){const want=angTo(L.track,e);L.a+=clamp(Math.atan2(Math.sin(want-L.a),Math.cos(want-L.a)),-2.2*dt,2.2*dt)}}
    if(!L.fired&&L.t>=L.delay){L.fired=true;const [x1,y1,x2,y2]=lineEnds(L);
      for(const o of G.balls){if(!o.alive||o.side===L.side)continue;if(segDist(o.x,o.y,x1,y1,x2,y2)<L.w/2+o.r){deal(L.owner,o,L.dmg,{crit:true});if(L.onHit&&o.alive)L.onHit(o);sparkBurst(o.x,o.y,[L.c,"#fff"],24,600)}}
      G.shake=Math.min(26,G.shake+10);G.screen=Math.max(G.screen,.18);ripple((x1+x2)/2,(y1+y2)/2,14);sfx.boom(true);
      for(let k=0;k<30;k++){const t=Math.random();sparkBurst(x1+(x2-x1)*t,y1+(y2-y1)*t,[L.c,"#ffffff"],1,300)}}
  }
  G.lines=G.lines.filter(L=>L.t<L.delay+.4);
  // nổ hẹn giờ
  for(const z of G.blasts){z.t+=dt;if(z.t>=z.delay&&!z.done){z.done=true;explode(z.x,z.y,z.r,z.dmg,z.owner,z.c);if(z.after)z.after(z)}}
  G.blasts=G.blasts.filter(z=>!z.done);
  // xích
  for(const T of G.tethers){T.t+=dt;if(!alive(T.a)||!alive(T.b)){T.t=T.dur;continue}const d=dist(T.a,T.b);if(d>90){const k=Math.min(1600,(d-90)*14)*dt;T.b.vx+=(T.a.x-T.b.x)/d*k;T.b.vy+=(T.a.y-T.b.y)/d*k}dot(T.b,T.dps*dt,"dot")}
  G.tethers=G.tethers.filter(T=>T.t<T.dur);
  // gai
  for(const s of G.spikes){s.t+=dt;for(const o of G.balls){if(!o.alive||o.side===s.side||s.dead)continue;if(Math.hypot(o.x-s.x,o.y-s.y)<o.r+14){deal(s.owner,o,s.dmg,{});s.dead=true;sparkBurst(s.x,s.y,["#5FA35A","#fff"],14,380)}}}
  G.spikes=G.spikes.filter(s=>!s.dead&&alive(s.owner)&&(Math.abs(s.x-B.l)<3||Math.abs(s.x-B.r)<3||Math.abs(s.y-B.t)<3||Math.abs(s.y-B.b)<3));
  // bot dồn lực
  if(!G.bOD&&G.t>=G.botOD){G.bOD=true;overdrive(G.mains[1])}
  if(G.watch0&&!G.pOD&&G.t>=G.botOD0){G.pOD=true;overdrive(G.mains[0])}
  // thu hẹp sàn
  if(G.t>G.ot){const ins=Math.min(150,(G.t-G.ot)*7);G.bd={l:ins,t:ins,r:W-ins,b:H-ins};const dps=1+(G.t-G.ot)*.2;for(const m of G.mains)if(m.alive)dot(m,dps*dt,"dot")}
  G.balls=G.balls.filter(b=>b.alive||b.kind==="main");
  if(G.ffa){for(const m of G.mains)if(m.side!==0&&m.alive&&!m.mem.od&&G.t>=m.mem.odT){m.mem.od=1;overdrive(m)}}
  if(!G.over&&G.ffa){const al=G.mains.filter(o=>o.alive);if(al.length<=1){G.over=true;G.winner=al.length?al[0].side:-1;G.endT=0}}
  else if(!G.over){const pa=G.mains[0].alive,ba=G.horde?G.balls.some(o=>o.alive&&o.side===1&&(o.kind==="main"||o.kind==="unit")):G.mains[1].alive;if(!pa||!ba){G.over=true;G.winner=pa&&!ba?0:ba&&!pa?1:-1;G.endT=0}}
}
function overdrive(b){
  if(!alive(b)||G.count>0||G.over)return;
  dashAt(b,.7);const ab=abOf(b);if(ab.cd&&ab.trigger){castFx(b);ab.trigger(b);b.cd=ab.cd}
  status(b,"crit",.9);
  ring(b.x,b.y,b.r,b.r+90,b.side===0?"#36E2FF":"#FF4D7A",.6,6);ring(b.x,b.y,b.r,b.r+50,"#ffffff",.4,3);
  G.texts.push({x:b.x,y:b.y-b.r-26,txt:"DỒN LỰC!",kind:b.side?"cfoe":"cyou",t:0,big:true});
  G.speed={x:b.x,y:b.y,t:0};G.chroma=Math.max(G.chroma,.25);G.shake+=8;
}
function stepFx(dt){
  for(const b of G.balls)if(b.cast>0)b.cast-=dt;
  for(const g of G.glyphs)g.t+=dt;G.glyphs=G.glyphs.filter(g=>g.t<g.dur);
  for(const p of G.parts){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;const f=p.chunk?.96:.92;p.vx*=f;p.vy*=f;if(p.chunk){p.vy+=200*dt;p.rot+=p.vr*dt}}
  G.parts=G.parts.filter(p=>p.life>0);if(G.parts.length>900)G.parts.splice(0,G.parts.length-900);
  for(const s of G.sparks){s.life-=dt;s.x+=s.vx*dt;s.y+=s.vy*dt;s.vx*=.9;s.vy*=.9}
  G.sparks=G.sparks.filter(s=>s.life>0);if(G.sparks.length>700)G.sparks.splice(0,G.sparks.length-700);
  for(const r of G.rings)r.t+=dt;G.rings=G.rings.filter(r=>r.t<r.dur);
  for(const t of G.texts){t.t+=dt;t.y-=(t.big?20:46)*dt}G.texts=G.texts.filter(t=>t.t<(t.big?1.1:.9));
  for(const b of G.bolts)b.t+=dt;G.bolts=G.bolts.filter(b=>b.t<b.dur);
  for(const b of G.beams)b.t+=dt;G.beams=G.beams.filter(b=>b.t<b.dur);
  for(const f of G.flashes)f.t+=dt;G.flashes=G.flashes.filter(f=>f.t<f.dur);
  for(const g of G.ghosts)g.t+=dt;G.ghosts=G.ghosts.filter(g=>g.t<g.dur);
  for(const d of G.decals)d.t+=dt;G.decals=G.decals.filter(d=>d.t<d.life);
  for(const r of G.ripples)r.t+=dt;G.ripples=G.ripples.filter(r=>r.t<1.6);
  G.shake*=Math.pow(.015,dt);G.zoom*=Math.pow(.04,dt);G.chroma=Math.max(0,G.chroma-dt*1.2);G.screen=Math.max(0,G.screen-dt*2.2);
  if(G.tint){G.tint.t-=dt;if(G.tint.t<=0)G.tint=null}
  if(G.speed){G.speed.t+=dt;if(G.speed.t>.35)G.speed=null}
  if(G.ko)G.ko.t+=dt;
  G.go=Math.max(0,G.go-dt);
  if(G.banner){G.banner.t+=dt;if(G.banner.t>G.banner.dur)G.banner=null}
  ambStep(dt);
}

/* ═════════════════════════ VẼ ═════════════════════════ */
const cv=$("#arena"),ctx=cv.getContext("2d");let SCALE=1;
const glowCache=new Map();
function glowSprite(c){let s=glowCache.get(c);if(!s){s=document.createElement("canvas");s.width=s.height=128;const g=s.getContext("2d"),gr=g.createRadialGradient(64,64,0,64,64,64);gr.addColorStop(0,hexA(c,1));gr.addColorStop(.22,hexA(c,.55));gr.addColorStop(.55,hexA(c,.15));gr.addColorStop(1,hexA(c,0));g.fillStyle=gr;g.fillRect(0,0,128,128);glowCache.set(c,s)}return s}
function glowAt(x,y,r,c,a=1){a*=FXQ.glow;if(a<=0)return;const op=ctx.globalCompositeOperation,ga=ctx.globalAlpha;ctx.globalCompositeOperation="lighter";ctx.globalAlpha=clamp(a,0,1);ctx.drawImage(glowSprite(c),x-r,y-r,r*2,r*2);ctx.globalCompositeOperation=op;ctx.globalAlpha=ga}
function circle(x,y,r){ctx.beginPath();ctx.arc(x,y,Math.max(0,r),0,TAU)}
const patCache=new Map();
function renderRatio(){const d=Math.min(2,window.devicePixelRatio||1),r=S.gfx.res;return r==="auto"?d:clamp(r,.5,3)}
function fitCanvas(){patCache.clear();
  const st=$("#stage");const size=Math.max(220,Math.floor(Math.min(st.clientWidth,st.clientHeight)-8));
  const dpr=renderRatio();cv.style.width=size+"px";cv.style.height=size+"px";cv.width=Math.round(size*dpr);cv.height=Math.round(size*dpr);SCALE=cv.width/(W+PAD*2);requestAnimationFrame(()=>{const bb=$("#bossBar");if(bb)bb.style.top=Math.max(4,cv.offsetTop+8)+"px"});
}
new ResizeObserver(()=>{if(!$("#match").hidden)fitCanvas()}).observe($("#stage"));
function rippleD(x,y){let dx=0,dy=0;for(const r of G.ripples){const ex=x-r.x,ey=y-r.y,d=Math.hypot(ex,ey)||1;const w=r.amp*Math.sin(d*.075-r.t*16)*Math.exp(-r.t*2.4)*Math.exp(-d/240);dx+=ex/d*w;dy+=ey/d*w}return[dx,dy]}
function drawFloor(){drawArenaFloor()}
function drawZones(){
  for(const z of G.zones){
    const fade=Math.min(1,z.life*2,z.t*4);
    if(z.kind==="fire"){glowAt(z.x,z.y,z.r*1.6,"#FF5A1F",.45*fade);for(let k=0;k<2;k++)glowAt(z.x+Math.sin(G.t*13+z.x+k)*5,z.y+Math.cos(G.t*11+z.y)*5,z.r*.9,"#FFC23D",.35*fade)}
    else if(z.kind==="ice"){ctx.fillStyle=`rgba(184,241,255,${.13*fade})`;circle(z.x,z.y,z.r);ctx.fill();ctx.strokeStyle=`rgba(184,241,255,${.7*fade})`;ctx.lineWidth=2;ctx.setLineDash([10,6]);ctx.lineDashOffset=G.t*20;ctx.stroke();ctx.setLineDash([]);
      for(let k=0;k<8;k++){const a=k*TAU/8+G.t*.3,r=z.r*.7;ctx.save();ctx.translate(z.x+Math.cos(a)*r,z.y+Math.sin(a)*r);ctx.rotate(a);ctx.fillStyle=`rgba(232,251,255,${.8*fade})`;ctx.fillRect(-1,-7,2,14);ctx.fillRect(-7,-1,14,2);ctx.restore()}}
    else if(z.kind==="hole"){const R=z.r*fade;const g=ctx.createRadialGradient(z.x,z.y,0,z.x,z.y,R);g.addColorStop(0,"rgba(0,0,0,1)");g.addColorStop(.3,"rgba(10,0,30,.95)");g.addColorStop(.55,"rgba(107,75,255,.35)");g.addColorStop(1,"rgba(107,75,255,0)");ctx.fillStyle=g;circle(z.x,z.y,R);ctx.fill();
      for(let k=0;k<3;k++){ctx.strokeStyle=`rgba(180,160,255,${.5*fade})`;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(z.x,z.y,R*(.45+k*.15),R*(.18+k*.06),G.t*(2+k)+k,0,TAU);ctx.stroke()}
      if(Math.random()<.6){const a=rand(0,TAU),r=R;G.parts.push({x:z.x+Math.cos(a)*r,y:z.y+Math.sin(a)*r,vx:-Math.cos(a)*r*1.6,vy:-Math.sin(a)*r*1.6,life:.6,max:.6,color:"#B4A0FF",size:2,add:true})}
      glowAt(z.x,z.y,40,"#6B4BFF",.6)}
    else if(typeof ZFX!=="undefined"&&ZFX[z.kind])ZFX[z.kind](z,fade);
    else if(z.draw)z.draw(z,fade);
    else if(z.kind==="mine"){const armed=z.t>z.arm,bl=armed&&Math.sin(G.t*12)>0;glowAt(z.x,z.y,26,"#FF5470",bl?.9:.3);ctx.fillStyle="#2A1020";circle(z.x,z.y,z.r);ctx.fill();ctx.strokeStyle="#FF5470";ctx.lineWidth=2;ctx.stroke();ctx.fillStyle=bl?"#fff":"#FF5470";circle(z.x,z.y,3.5);ctx.fill()}
  }
  for(const T of G.tethers){if(!alive(T.a)||!alive(T.b))continue;const n=Math.ceil(dist(T.a,T.b)/12);ctx.strokeStyle="#C9D1E2";ctx.lineWidth=2.5;for(let k=0;k<n;k++){const t=k/n,x=T.a.x+(T.b.x-T.a.x)*t,y=T.a.y+(T.b.y-T.a.y)*t+Math.sin(t*Math.PI)*8;ctx.beginPath();ctx.ellipse(x,y,5,3,angTo(T.a,T.b)+(k%2?Math.PI/2:0),0,TAU);ctx.stroke()}glowAt(T.b.x,T.b.y,T.b.r*2,"#9AA4B8",.4)}
  for(const L of G.lines){const [x1,y1,x2,y2]=lineEnds(L);
    if(!L.fired){const p=L.t/L.delay;ctx.strokeStyle=hexA(L.c,.25+.5*(Math.sin(G.t*40)>0?1:.4));ctx.lineWidth=2+p*L.w*.5;ctx.setLineDash([14,10]);ctx.lineDashOffset=-G.t*80;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.setLineDash([])}
    else{const a=1-(L.t-L.delay)/.4;if(L.kind==="water"||L.kind==="wave"){ctx.save();ctx.strokeStyle=`rgba(200,245,255,${a})`;ctx.lineWidth=2;ctx.beginPath();const n=24;for(let k=0;k<=n;k++){const u=k/n,px=x1+(x2-x1)*u,py=y1+(y2-y1)*u,o=Math.sin(u*40+G.t*30)*L.w*.35,nx=-(y2-y1),ny=x2-x1,nl=Math.hypot(nx,ny)||1;k?ctx.lineTo(px+nx/nl*o,py+ny/nl*o):ctx.moveTo(px+nx/nl*o,py+ny/nl*o)}ctx.stroke();ctx.restore()}
      ctx.save();ctx.globalCompositeOperation="lighter";for(const [w,al] of [[L.w*2.4,.15],[L.w,.5],[L.w*.35,1]]){ctx.strokeStyle=al===1?`rgba(255,255,255,${a})`:hexA(L.c,al*a);ctx.lineWidth=w*(.6+a*.4);ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()}ctx.restore()}}
  for(const z of G.blasts){const p=z.t/z.delay;ctx.strokeStyle=hexA(z.c,.8);ctx.lineWidth=2;ctx.setLineDash([6,6]);ctx.lineDashOffset=G.t*40;circle(z.x,z.y,z.r);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle=hexA(z.c,.12+p*.2);circle(z.x,z.y,z.r*p);ctx.fill();
    if(z.draw)z.draw(z,p);
    else if(z.kind==="meteor"){const sx=z.x+260*(1-p),sy=z.y-420*(1-p);glowAt(sx,sy,40,"#FF8A00",.9);ctx.strokeStyle="rgba(255,200,120,.6)";ctx.lineWidth=6*(1-p)+2;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx+60,sy-100);ctx.stroke();ctx.fillStyle="#FFE2B0";circle(sx,sy,8);ctx.fill()}
    else{const sx=z.fx+(z.x-z.fx)*p,sy=z.fy+(z.y-z.fy)*p-Math.sin(p*Math.PI)*120;ctx.fillStyle="#1A1A1A";circle(sx,sy,9);ctx.fill();glowAt(sx-6,sy-8,14,"#FFC23D",Math.sin(G.t*40)>0?1:.4)}}
  for(const s of G.spikes){const tx=-s.ny,ty=s.nx,len=Math.min(1,s.t*6)*18;ctx.fillStyle="#BFF2B0";ctx.beginPath();ctx.moveTo(s.x+tx*9,s.y+ty*9);ctx.lineTo(s.x-tx*9,s.y-ty*9);ctx.lineTo(s.x+s.nx*len,s.y+s.ny*len);ctx.closePath();ctx.fill();glowAt(s.x+s.nx*8,s.y+s.ny*8,16,s.side?"#FF4D7A":"#36E2FF",.6)}
}
function drawProj(){
  for(const p of G.proj){
    const t=p.trail;ctx.save();ctx.globalCompositeOperation="lighter";
    for(let i=0;i<t.length;i+=2){const k=i/t.length;ctx.globalAlpha=k*.6;ctx.fillStyle=p.c;circle(t[i],t[i+1],p.r*k);ctx.fill()}ctx.restore();
    if(p.skin&&typeof PSKIN!=="undefined"&&PSKIN[p.skin])PSKIN[p.skin](p);
    else if(p.kind==="quill"){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(Math.atan2(p.vy,p.vx));glowAt(0,0,18,p.c,.6);ctx.fillStyle="#FFF4DD";ctx.beginPath();ctx.moveTo(12,0);ctx.lineTo(-9,-4);ctx.lineTo(-5,0);ctx.lineTo(-9,4);ctx.closePath();ctx.fill();ctx.restore()}
    else if(p.kind==="bee"){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(Math.atan2(p.vy,p.vx));glowAt(0,0,16,"#FFC93C",.5);ctx.fillStyle="#FFC93C";ctx.beginPath();ctx.ellipse(0,0,8,5.5,0,0,TAU);ctx.fill();ctx.fillStyle="#1A1208";ctx.fillRect(-3,-5,2.5,10);ctx.fillRect(2,-5,2,10);ctx.fillStyle="rgba(220,240,255,.85)";ctx.beginPath();ctx.ellipse(-1,-6,4,2.4,Math.sin(G.t*60),0,TAU);ctx.ellipse(-1,6,4,2.4,-Math.sin(G.t*60),0,TAU);ctx.fill();ctx.restore()}
    else if(p.kind==="boomer"){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.t*22);glowAt(0,0,22,p.c,.5);ctx.strokeStyle="#FFE3C4";ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-11,6);ctx.lineTo(0,-4);ctx.lineTo(11,6);ctx.stroke();ctx.restore()}
    else{const el=p.el;
      if(el==="fire"){glowAt(p.x,p.y,p.r*5.5,"#FF6A2A",.85);glowAt(p.x,p.y,p.r*2.6,"#FFC23D",.95);ctx.fillStyle="#fff";circle(p.x,p.y,p.r*.6);ctx.fill()}
      else if(el==="ice"){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(Math.atan2(p.vy,p.vx));glowAt(0,0,p.r*4.5,"#8EDCFF",.7);ctx.fillStyle="#E8FBFF";ctx.beginPath();ctx.moveTo(p.r*2.2,0);ctx.lineTo(0,-p.r*.95);ctx.lineTo(-p.r*1.7,0);ctx.lineTo(0,p.r*.95);ctx.closePath();ctx.fill();ctx.restore()}
      else if(el==="elec"){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(Math.atan2(p.vy,p.vx));glowAt(0,0,p.r*4.5,"#FFE45E",.8);ctx.strokeStyle="#fff";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-p.r*2.4,0);ctx.lineTo(-p.r*1.1,-p.r*.9);ctx.lineTo(0,p.r*.7);ctx.lineTo(p.r*1.2,-p.r*.6);ctx.lineTo(p.r*2.4,0);ctx.stroke();ctx.restore()}
      else if(el==="poison"||el==="water"){const cc=el==="poison"?"#7DDB3A":"#36A8FF";glowAt(p.x,p.y,p.r*4,cc,.6);ctx.strokeStyle=cc;ctx.lineWidth=2;circle(p.x,p.y,p.r*1.1);ctx.stroke();ctx.fillStyle="rgba(255,255,255,.7)";circle(p.x-p.r*.35,p.y-p.r*.35,p.r*.3);ctx.fill()}
      else if(el==="nature"){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(Math.atan2(p.vy,p.vx));glowAt(0,0,p.r*3.6,"#5CF2A8",.6);ctx.fillStyle="#B4FF8A";ctx.beginPath();ctx.ellipse(0,0,p.r*1.9,p.r*.9,0,0,TAU);ctx.fill();ctx.restore()}
      else if(el==="dark"){glowAt(p.x,p.y,p.r*5,"#8A5CFF",.8);ctx.fillStyle="#12081F";circle(p.x,p.y,p.r*.95);ctx.fill();ctx.strokeStyle="#D8B8FF";ctx.lineWidth=1.4;circle(p.x,p.y,p.r*1.3);ctx.stroke()}
      else{glowAt(p.x,p.y,p.r*4,p.c,.9);ctx.fillStyle="#ffffff";circle(p.x,p.y,p.r*.7);ctx.fill()}}
  }
}
function drawBall(b){
  if(b.cast>0){const k=1+.2*Math.sin(Math.PI*clamp(1-b.cast/.5,0,1));ctx.save();ctx.translate(b.x,b.y);ctx.scale(k,k);ctx.translate(-b.x,-b.y);_drawBall(b);ctx.restore()}else _drawBall(b)
}
function _drawBall(b){
  const {x,y,r}=b,c=b.def.color,side=b.side===0?"#36E2FF":G.ffa?b.def.color:"#FF4D7A",s=b.st;
  const isDec=b.kind==="decoy";
  // vệt sáng
  const tr=b.trail,strong=s.dash>0||s.haste>0;
  ctx.save();ctx.globalCompositeOperation="lighter";
  for(let i=0;i<tr.length;i+=2){const k=i/tr.length;ctx.globalAlpha=(strong?.32:.1)*k;ctx.fillStyle=c;circle(tr[i],tr[i+1],r*(.35+k*.65));ctx.fill()}
  ctx.restore();
  glowAt(x,y,r*2.6,c,isDec?.25:.45);
  if(b.kind==="main")glowAt(x,y,r*1.9,side,.18);
  ctx.save();
  if(isDec)ctx.globalAlpha=.55+.2*Math.sin(G.t*20+b.uid);
  if(s.invuln>0)ctx.globalAlpha=.5+.5*Math.sin(G.t*40);
  // chromatic aberration
  if(FXQ.chroma&&G.chroma>0&&b.kind==="main"){const o=G.chroma*14;ctx.save();ctx.globalCompositeOperation="lighter";ctx.globalAlpha=Math.min(.7,G.chroma*1.6);ctx.fillStyle="#FF1F4B";circle(x-o,y,r);ctx.fill();ctx.fillStyle="#1FE7FF";circle(x+o,y,r);ctx.fill();ctx.restore()}
  // bóng đổ
  ctx.fillStyle="rgba(0,0,0,.35)";ctx.beginPath();ctx.ellipse(x+4,y+r*.65,r*.95,r*.45,0,0,TAU);ctx.fill();
  // thân
  const SK=hasSkin(b.def);
  if(SK)drawCreature(ctx,b.def,x,y,r,{gx:b.vx,gy:b.vy,t:G.t,hurt:b.flash>0,id:b.uid});
  else{
  const g=ctx.createRadialGradient(x-r*.38,y-r*.42,r*.06,x,y,r);g.addColorStop(0,"#ffffff");g.addColorStop(.18,shade(c,.35));g.addColorStop(.62,c);g.addColorStop(1,shade(c,-.6));
  ctx.fillStyle=g;circle(x,y,r);ctx.fill();
  ctx.save();circle(x,y,r);ctx.clip();ctx.fillStyle="rgba(255,255,255,.28)";ctx.beginPath();ctx.ellipse(x-r*.3,y-r*.46,r*.34,r*.17,-.55,0,TAU);ctx.fill();ctx.strokeStyle="rgba(255,255,255,.22)";ctx.lineWidth=1.5;circle(x,y,r-.8);ctx.stroke();ctx.restore();
  // vân xoay
  ctx.save();circle(x,y,r);ctx.clip();ctx.translate(x,y);ctx.rotate(b.spin);ctx.strokeStyle="rgba(255,255,255,.18)";ctx.lineWidth=r*.18;ctx.beginPath();ctx.arc(0,0,r*.72,-.6,.6);ctx.stroke();ctx.beginPath();ctx.arc(0,0,r*.72,Math.PI-.6,Math.PI+.6);ctx.stroke();ctx.restore();
  // chữ
  if(r>=13)drawIcon(ctx,b.def,x,y+.5,r*(b.kind==="main"?1:.92));
  }
  // trạng thái
  if(s.freeze>0){ctx.fillStyle="rgba(200,240,255,.5)";circle(x,y,r+2);ctx.fill();ctx.strokeStyle="#E8FBFF";ctx.lineWidth=2;for(let k=0;k<6;k++){const a=k*TAU/6;ctx.beginPath();ctx.moveTo(x+Math.cos(a)*r*.4,y+Math.sin(a)*r*.4);ctx.lineTo(x+Math.cos(a)*(r+6),y+Math.sin(a)*(r+6));ctx.stroke()}}
  if(s.shield>0){ctx.strokeStyle="rgba(143,211,255,.9)";ctx.lineWidth=2.5;ctx.beginPath();for(let k=0;k<=6;k++){const a=k*TAU/6+G.t;const px=x+Math.cos(a)*(r+9),py=y+Math.sin(a)*(r+9);k?ctx.lineTo(px,py):ctx.moveTo(px,py)}ctx.stroke();glowAt(x,y,r*1.8,"#8FD3FF",.25)}
  if(s.stun>0){for(let k=0;k<3;k++){const a=G.t*8+k*TAU/3;ctx.fillStyle="#FFF04D";ctx.font="700 12px sans-serif";ctx.fillText("✦",x+Math.cos(a)*(r*.8),y-r-6+Math.sin(a)*4)}}
  if(s.chrono>0){ctx.strokeStyle="#FFD36E";ctx.lineWidth=2;circle(x,y,r+12);ctx.stroke();ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(G.t*2)*(r+8),y+Math.sin(G.t*2)*(r+8));ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(G.t*.5)*(r*.6),y+Math.sin(G.t*.5)*(r*.6));ctx.stroke()}
  if(s.confuse>0){ctx.fillStyle="#B4FF39";ctx.font="800 14px Unbounded,sans-serif";ctx.fillText("?",x+Math.sin(G.t*10)*8,y-r-12)}
  if(s.crit>0){ctx.strokeStyle="#FFC23D";ctx.lineWidth=3;ctx.setLineDash([5,6]);ctx.lineDashOffset=-G.t*40;circle(x,y,r+7);ctx.stroke();ctx.setLineDash([]);glowAt(x,y,r*2,"#FFC23D",.3)}
  if(b.flash>0){ctx.fillStyle=`rgba(255,255,255,${Math.min(1,b.flash*7)})`;circle(x,y,r);ctx.fill()}
  // vòng máu
  if(b.kind!=="decoy"){const pr=r+4.5;ctx.lineWidth=3;ctx.strokeStyle="rgba(255,255,255,.12)";circle(x,y,pr);ctx.stroke();ctx.strokeStyle=side;ctx.beginPath();ctx.arc(x,y,pr,-Math.PI/2,-Math.PI/2+TAU*clamp(b.hp/b.max,0,1));ctx.stroke()}
  ctx.restore();
  if(b.kind==="main"){const ri=RARS.indexOf(b.def.rar);
    if(ri>=2){const n=ri-1;for(let k=0;k<n;k++){const a=G.t*(1.3+ri*.28)+k*TAU/n,ox=x+Math.cos(a)*(r+8),oy=y+Math.sin(a)*(r+8);glowAt(ox,oy,6,c,.85);ctx.fillStyle="#fff";circle(ox,oy,1.7);ctx.fill()}}
    if(ri>=4){ctx.save();ctx.strokeStyle=hexA(c,.5);ctx.lineWidth=1.6;ctx.setLineDash([3,7]);ctx.lineDashOffset=-G.t*26;circle(x,y,r+15);ctx.stroke();ctx.restore()}}
  if(b.kind==="main"){const ab=abOf(b);if(ab.draw){ctx.save();ab.draw(b,ctx);ctx.restore()}if(b.mods)drawMods(b)}
  else if(b.mem.ghost&&b.def.ab.draw&&b.def.boss){ctx.save();b.def.ab.draw(b,ctx);ctx.restore()}
}
function drawFx(){
  ctx.save();ctx.globalCompositeOperation="lighter";
  for(const b of G.beams){const a=1-b.t/b.dur;ctx.strokeStyle=hexA(b.c,a);ctx.lineWidth=b.w*a+1;ctx.beginPath();ctx.moveTo(b.x1,b.y1);ctx.lineTo(b.x2,b.y2);ctx.stroke()}
  for(const bo of G.bolts){const a=1-bo.t/bo.dur;for(const [w,c] of [[10,hexA(bo.c,.35*a)],[3,`rgba(255,255,255,${a})`]]){ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(bo.x1,bo.y1);const n=10;for(let i=1;i<=n;i++){const t=i/n,j=i===n?0:22;ctx.lineTo(bo.x1+(bo.x2-bo.x1)*t+Math.sin(bo.seed+i*12.9+bo.t*60)*j,bo.y1+(bo.y2-bo.y1)*t+Math.cos(bo.seed+i*7.3+bo.t*60)*j)}ctx.stroke()}}
  for(const f of G.flashes){const a=1-f.t/f.dur;glowAt(f.x,f.y,f.r*(.7+.6*(f.t/f.dur)),f.c,a)}
  for(const s of G.sparks){const a=s.life/s.max;ctx.strokeStyle=hexA(s.c[0]==="#"?s.c:"#ffffff",a);ctx.lineWidth=s.w;ctx.beginPath();ctx.moveTo(s.x,s.y);ctx.lineTo(s.x-s.vx*.035,s.y-s.vy*.035);ctx.stroke()}
  for(const p of G.parts){if(!p.add)continue;ctx.globalAlpha=Math.max(0,p.life/p.max);ctx.fillStyle=p.color;circle(p.x,p.y,p.size);ctx.fill()}
  ctx.globalAlpha=1;
  for(const r of G.rings){const t=r.t/r.dur,e=1-Math.pow(1-t,3);ctx.globalAlpha=(1-t);ctx.strokeStyle=r.c;ctx.lineWidth=r.w*(1-t*.6);circle(r.x,r.y,r.r0+(r.r1-r.r0)*e);ctx.stroke()}
  ctx.restore();ctx.globalAlpha=1;
  for(const p of G.parts){if(p.add)continue;ctx.globalAlpha=Math.max(0,p.life/p.max);ctx.fillStyle=p.color;if(p.chunk){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*.6);ctx.restore()}else if(p.ringP){ctx.strokeStyle=p.color;ctx.lineWidth=1.5;circle(p.x,p.y,p.size);ctx.stroke()}else{circle(p.x,p.y,p.size);ctx.fill()}}
  ctx.globalAlpha=1;
  for(const g of G.ghosts){const a=(1-g.t/g.dur)*.5;ctx.strokeStyle=hexA(g.c,a);ctx.lineWidth=2;circle(g.x,g.y,g.r*(1+g.t));ctx.stroke();ctx.fillStyle=hexA(g.c,a*.4);circle(g.x,g.y,g.r);ctx.fill()}
  for(const g of G.glyphs){const k=g.t/g.dur,ez=1-Math.pow(1-k,3),col=(EL_COL[g.def.el||"arcane"]||EL_COL.arcane)[0];ctx.save();ctx.globalCompositeOperation="lighter";ctx.globalAlpha=Math.max(0,(1-k)*.8);ctx.translate(g.x,g.y);ctx.rotate(k*.5);ctx.translate(-g.x,-g.y);drawIcon(ctx,g.def,g.x,g.y,g.r*(1.3+ez*3.4),col);ctx.restore()}
}
const TXT_COL={dmg:"#FFFFFF",crit:"#FFC23D",heal:"#5CF2A8",dot:"#C6F06A",burn:"#FF8A4D",bleed:"#FF4D6A",poison:"#A6E22E",od:"#F5EFFF",shield:"#8FD3FF",cyou:"#36E2FF",cfoe:"#FF4D7A",critbig:"#FFC23D"};
function drawTexts(){
  ctx.textAlign="center";ctx.textBaseline="middle";
  for(const t of G.texts){
    const k=t.kind,life=t.big?1.1:.9;let sz=k==="crit"?30+Math.min(16,t.amt*.5):k==="dmg"?17+Math.min(14,t.amt*.6):k==="od"?13:k==="critbig"?30:t.big?26:14;
    const pop=t.t<.1?.4+t.t/.1*.9:1.3-Math.min(.3,(t.t-.1)*1.5);
    ctx.save();ctx.translate(t.x,t.y);ctx.scale(pop,pop);if(k==="crit"||k==="critbig")ctx.rotate(-.08);
    ctx.globalAlpha=1-Math.max(0,(t.t-life*.6)/(life*.4));
    ctx.font=`${k==="dmg"||k==="crit"||t.big||k==="critbig"?900:700} ${sz}px Unbounded,"Arial Black",sans-serif`;
    ctx.lineWidth=k==="critbig"||t.big?7:5;ctx.strokeStyle="rgba(8,6,15,.9)";ctx.lineJoin="round";ctx.strokeText(t.txt,0,0);
    ctx.fillStyle=TXT_COL[k]||"#fff";ctx.fillText(t.txt,0,0);ctx.restore();
  }
}
function bigText(txt,y,size,colA,colB,t,glitch){
  ctx.save();ctx.textAlign="center";ctx.textBaseline="middle";ctx.font=`900 ${size}px Unbounded,"Arial Black",sans-serif`;
  if(glitch){ctx.globalCompositeOperation="lighter";ctx.fillStyle="rgba(255,31,75,.8)";ctx.fillText(txt,W/2-6+rand(-3,3),y);ctx.fillStyle="rgba(31,231,255,.8)";ctx.fillText(txt,W/2+6+rand(-3,3),y);ctx.globalCompositeOperation="source-over"}
  ctx.lineWidth=12;ctx.strokeStyle="rgba(8,6,15,.85)";ctx.lineJoin="round";ctx.strokeText(txt,W/2,y);
  const g=ctx.createLinearGradient(W/2-size*2,0,W/2+size*2,0);g.addColorStop(0,colA);g.addColorStop(1,colB);ctx.fillStyle=g;ctx.fillText(txt,W/2,y);
  if(glitch){for(let k=0;k<3;k++){const sy=y+rand(-size/2,size/2),h=rand(3,10);ctx.drawImage(cv,0,(sy-h/2+PAD)*SCALE,cv.width,h*SCALE,rand(-20,20)-PAD,sy-h/2,W+PAD*2,h)}}
  ctx.restore();
}
function render(){
  ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle="#08060F";ctx.fillRect(0,0,cv.width,cv.height);
  const z=1+G.zoom,shk=G.shake*(S.gfx.shake?1:.12),sx=(Math.random()-.5)*shk,sy=(Math.random()-.5)*shk;
  ctx.setTransform(SCALE*z,0,0,SCALE*z,SCALE*(PAD+G.zx-G.zx*z+sx),SCALE*(PAD+G.zy-G.zy*z+sy));
  drawFloor();drawZones();drawBoxes();drawProj();
  for(const b of G.balls)if(b.alive&&b.kind!=="main")drawBall(b);
  for(const b of G.mains)if(b.alive)drawBall(b);
  drawFx();drawAmb();if(FXQ.light&&typeof lightPass!=="undefined")lightPass();drawHitboxes();
  ctx.setTransform(SCALE,0,0,SCALE,SCALE*PAD,SCALE*PAD);
  // vạch tốc độ
  if(G.speed){const a=1-G.speed.t/.35;ctx.save();ctx.globalCompositeOperation="lighter";ctx.strokeStyle=`rgba(255,255,255,${.35*a})`;for(let k=0;k<40;k++){const an=k/40*TAU+k,r1=120+((k*53)%90),r2=r1+120+((k*31)%200);ctx.lineWidth=1+(k%3);ctx.beginPath();ctx.moveTo(G.speed.x+Math.cos(an)*r1,G.speed.y+Math.sin(an)*r1);ctx.lineTo(G.speed.x+Math.cos(an)*r2,G.speed.y+Math.sin(an)*r2);ctx.stroke()}ctx.restore()}
  ctx.setTransform(SCALE*z,0,0,SCALE*z,SCALE*(PAD+G.zx-G.zx*z+sx),SCALE*(PAD+G.zy-G.zy*z+sy));drawTexts();
  ctx.setTransform(SCALE,0,0,SCALE,SCALE*PAD,SCALE*PAD);
  // vignette + tint
  const v=ctx.createRadialGradient(W/2,H/2,W*.35,W/2,H/2,W*.75);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(0,0,0,.35)");ctx.fillStyle=v;ctx.fillRect(-PAD,-PAD,W+PAD*2,H+PAD*2);
  const low=G.mains[0].alive&&G.mains[0].hp/G.mains[0].max<.3;
  if(low){const a=.25+.2*Math.sin(G.t*8);const lv=ctx.createRadialGradient(W/2,H/2,W*.3,W/2,H/2,W*.75);lv.addColorStop(0,"rgba(255,0,60,0)");lv.addColorStop(1,`rgba(255,0,60,${a})`);ctx.fillStyle=lv;ctx.fillRect(-PAD,-PAD,W+PAD*2,H+PAD*2)}
  if(G.tint){ctx.fillStyle=hexA(G.tint.c,G.tint.t*.35);ctx.fillRect(-PAD,-PAD,W+PAD*2,H+PAD*2)}
  if(G.screen>0){ctx.fillStyle=`rgba(255,255,255,${G.screen*.6})`;ctx.fillRect(-PAD,-PAD,W+PAD*2,H+PAD*2)}
  // chữ lớn
  if(G.count>0){ctx.fillStyle="rgba(8,6,15,.5)";ctx.fillRect(-PAD,-PAD,W+PAD*2,H+PAD*2);const n=Math.ceil(G.count-.6),f=(G.count-.6)-Math.floor(G.count-.6);
    if(n>=1){bigText(G.label||"HIỆP "+G.round,H/2-110,30,"#C3AEFF","#F5EFFF",0,false);ctx.save();ctx.translate(W/2,H/2+10);const s=1+f*.6;ctx.scale(s,s);ctx.globalAlpha=Math.min(1,(1-f)*3);ctx.translate(-W/2,-(H/2+10));bigText(String(n),H/2+10,150,"#36E2FF","#FF4D7A",0,false);ctx.restore()}}
  if(G.go>0){const t=1-G.go/.9;ctx.save();ctx.globalAlpha=Math.min(1,G.go*2.5);ctx.translate(W/2,H/2);const s=t<.15?2.4-t/.15*1.4:1+(t-.15)*.25;ctx.scale(s,s);ctx.rotate(-.06);ctx.translate(-W/2,-H/2);bigText("ĐẤU!",H/2,120,"#FFC23D","#FF4D7A",0,true);ctx.restore()}
  if(G.banner){const b=G.banner,t=b.t/b.dur;ctx.save();ctx.globalAlpha=Math.min(1,(1-t)*3,b.t*6);ctx.translate(W/2,H/2-40);const s=b.t<.15?1.8-b.t/.15*.8:1;ctx.scale(s,s);ctx.translate(-W/2,-(H/2-40));bigText(b.txt,H/2-40,b.size||58,b.c||"#FFFFFF",b.c2||"#FFC23D",0,true);if(b.sub){ctx.globalAlpha*=.9;bigText(b.sub,H/2+12,18,"#F5EFFF","#C3AEFF",0,false)}ctx.restore()}
  if(G.ko){const t=G.ko.t;ctx.save();ctx.globalAlpha=Math.min(1,t*4);ctx.translate(W/2,H/2);const s=t<.2?3-t/.2*2:1;ctx.scale(s,s);ctx.translate(-W/2,-H/2);bigText("K.O.",H/2-20,140,"#FFFFFF","#FFC23D",0,true);ctx.restore();
    if(t>.6){const txt=G.koTxt?G.koTxt(G.winner):G.winner===0?"THẮNG HIỆP":G.winner===1?"THUA HIỆP":"HOÀ";ctx.globalAlpha=Math.min(1,(t-.6)*4);bigText(txt,H/2+90,36,G.winner===1?"#FF4D7A":"#36E2FF",G.winner===1?"#FFB23D":"#5CF2A8",0,false);ctx.globalAlpha=1}}
  if(FXQ.bloom)bloomPass();
}
