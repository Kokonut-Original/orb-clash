
/* ═══ GLUE (chỉ chạy trên server): điều khiển trận không cần DOM ═══ */
S.muted=true;FXQ=FXQ_LV.low;
let __ev=[],__depth=0;
const __uid=a=>a&&typeof a==="object"&&a.uid!==undefined?{u:a.uid}:a;
function __wrap(name,keepInner){const f=globalThis[name];globalThis[name]=function(...a){
  if(__depth===0)__ev.push([name,...a.map(__uid)]);
  __depth++;try{return f.apply(this,a)}finally{__depth--}}}
for(const n of ["impact","explode","ring","sparkBurst","burst","ripple","decal","beam","floater","kill","overdrive","openBox","castFx"])__wrap(n);
const __spawnBox0=spawnBox;
spawnBox=function(){__spawnBox0();if(G&&G.mains[1])G.mains[1].mem.seek=null};
function __init(idA,idB,arena){
  M={mode:"net",round:1,score:[0,0]};
  newFight(BY_ID[idA],1,BY_ID[idB],1);setArena(arena);
  G.botOD=Infinity;G.pODn=1;G.odN1=1;G.noBotSeek=true;acc=0;
}
function __input(side,m){
  if(!G||G.over||G.count>0)return;
  if(m.t==="od"){
    if(side===0){if(G.pODn>0){G.pODn--;overdrive(G.mains[0])}}
    else if(G.odN1>0){G.odN1--;overdrive(G.mains[1])}
  }else if(m.t==="box"){
    let best=null,bd=70;for(const box of G.boxes){const d=Math.hypot(box.x-m.x,box.y-m.y);if(d<bd){bd=d;best=box}}
    if(best){const p=G.mains[side];p.mem.seek=best;p.mem.seekT=G.t+2}
  }
}
function __tick(dt){
  dt=clamp(dt,0,.05);
  if(G.count>0){G.count-=dt;if(G.count<=0){G.go=.9;G.shake=14;G.screen=.35}stepFx(dt)}
  else{
    let k=1;if(G.stop>0){G.stop-=dt;k*=.06}if(G.slowT>0){G.slowT-=dt;k*=G.slowK}
    acc+=dt*k;let n=0;while(acc>=DT&&n<40){acc-=DT;step(DT);n++}
    stepFx(dt*Math.min(1,k));
    if(G.over){G.endT+=dt;if(G.endT>2.4)return true}
  }
  return false;
}
const __r1=v=>Math.round(v*10)/10;
function __prim(o){const r={};for(const k in o){const v=o[k];if(typeof v==="number"){r[k]=Math.round(v*100)/100}else if(typeof v==="boolean"||typeof v==="string")r[k]=v}return r}
function __snap(){
  const balls=G.balls.map(b=>{const st={};for(const k in b.st){const v=b.st[k];if(typeof v==="number"&&v>0)st[k]=__r1(v)}
    return{u:b.uid,d:b.def.id,sd:b.side,k:b.kind,lv:b.lvl,x:__r1(b.x),y:__r1(b.y),vx:__r1(b.vx),vy:__r1(b.vy),r:__r1(b.r),hp:__r1(b.hp),mx:__r1(b.max),cd:__r1(b.cd),al:b.alive?1:0,fl:b.flash>0?1:0,st,mem:__prim(b.mem),ow:b.owner?b.owner.uid:0,mm:b.abSrc?(BALLS.find(x=>x.ab===b.abSrc)||{}).id:0,mods:b.mods?1:0}});
  return{gt:__r1(G.t*1000)/1000,c:__r1(G.count*100)/100,over:G.over?1:0,win:G.winner,ot:G.ot,bd:G.bd,od:[G.pODn,G.odN1],
    balls,
    pj:G.proj.map(p=>({x:__r1(p.x),y:__r1(p.y),vx:__r1(p.vx),vy:__r1(p.vy),r:p.r,c:p.c,kd:p.kind,el:p.el,sk:p.skin,a:__r1(p.a*100)/100,t:__r1(p.t),sd:p.side})),
    zn:G.zones.map(z=>({x:__r1(z.x),y:__r1(z.y),r:z.r,kd:z.kind,life:__r1(z.life),t:__r1(z.t),c:z.c,arm:z.arm||0,dk:z.draw?1:0})),
    ln:G.lines.map(L=>({kind:L.kind,x:__r1(L.x),y:__r1(L.y),a:Math.round(L.a*100)/100,w:L.w,t:__r1(L.t),delay:L.delay,c:L.c,fired:L.fired?1:0,both:L.both?1:0})),
    bl:G.blasts.map(z=>({x:z.x,y:z.y,r:z.r,t:__r1(z.t),delay:z.delay,c:z.c,kd:z.kind,fx:z.fx||0,fy:z.fy||0})),
    te:G.tethers.map(T=>({a:T.a.uid,b:T.b.uid})),
    sp:G.spikes.map(s=>({x:s.x,y:s.y,nx:s.nx,ny:s.ny,t:__r1(s.t),sd:s.side})),
    bx:G.boxes.map(b=>({x:__r1(b.x),y:__r1(b.y),t:__r1(b.t),c:b.c})),
    ev:__ev.splice(0).map(e=>e.map(a=>Array.isArray(a)?a:a))};
}
