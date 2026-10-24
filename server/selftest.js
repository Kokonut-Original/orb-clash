const {createContext}=require("./engine");
const c=createContext();const info=c.info();console.log("balls",info.balls.length,"arenas",info.arenas.join(","));
let ok=0,bad=0,tot=0;const t0=Date.now();
for(let i=0;i<12;i++){
  const A=info.balls[Math.floor(Math.random()*info.balls.length)].id,B=info.balls[Math.floor(Math.random()*info.balls.length)].id,ar=info.arenas[i%info.arenas.length];
  try{c.init(A,B,ar);let n=0,sn;while(!c.tick(1/60)&&n<60*120){n++;if(n%3===0){sn=c.snap();JSON.stringify(sn)}}
    sn=c.snap();tot+=JSON.stringify(sn).length;console.log(A,"vs",B,ar,"frames",n,"win",sn.win,"t",sn.gt.toFixed(1),"snapB",JSON.stringify(sn).length,"ev",sn.ev.length);ok++}
  catch(e){bad++;console.log("FAIL",A,B,ar,e.stack.split("\n").slice(0,3).join(" | "))}
}
console.log("ok",ok,"bad",bad,"ms",Date.now()-t0);
