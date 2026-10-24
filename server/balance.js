const {createContext}=require("./engine");
const c=createContext(),info=c.info();
const NEW=process.argv[3]?process.argv[3].split(","):info.balls.map(b=>b.id);
const N=+process.argv[2]||40;const RES=[];const errs=new Set();
function duel(a,b,ar){try{c.init(a,b,ar);let n=0;while(!c.tick(1/30)&&n<30*200)n++;const s=c.snap();return s.win}catch(e){errs.add(a+"/"+b+": "+e.message.slice(0,90));return -2}}
for(const id of NEW){
  const me=info.balls.find(b=>b.id===id);let w=0,l=0,d=0;
  const peers=info.balls.filter(b=>b.rar===me.rar&&b.id!==id);
  for(let i=0;i<N;i++){const o=peers[i%peers.length].id,ar=info.arenas[i%info.arenas.length];
    const side=i%2;const r=side?duel(o,id,ar):duel(id,o,ar);const win=side?(r===1):(r===0);
    if(r===-1)d++;else if(r===-2){}else if(win)w++;else l++}
  RES.push([id,me.rar,Math.round(w/Math.max(1,w+l)*100)]);
  if(!process.env.QUIET)console.log(id.padEnd(9),me.rar.padEnd(10),"thắng",w,"thua",l,"hoà",d,"→",Math.round(w/Math.max(1,w+l)*100)+"%");
}
// tỉ lệ thắng trung bình của bóng cũ cùng độ hiếm để so sánh
console.log("lỗi:",[...errs].join(" | ")||"không");

if(process.env.QUIET){RES.sort((a,b)=>a[2]-b[2]);console.log(RES.filter(r=>r[2]<40||r[2]>60).map(r=>r.join(":")).join("  "))}
