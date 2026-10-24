/* Orb Clash — server Tournament LAN. Chạy: node server.js [port]  (mặc định 8787) */
const http=require("http"),fs=require("fs"),path=require("path"),os=require("os"),crypto=require("crypto");
const {WebSocketServer}=require("ws");
const {createContext}=require("./engine");
const HTML=path.join(__dirname,"..","OrbClash-offline.html");
const PICK_MS=+process.env.PICK_MS||15000,GRACE_MS=+process.env.GRACE_MS||30000,SNAP_MS=40;
const info=createContext().info();           // danh sách bóng + sàn (lấy từ chính engine)
const pickR=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};

const players=new Map();   // token → player
const rooms=new Map();     // id → room
let nid=1;

const send=(p,m)=>{if(p&&p.ws&&p.ws.readyState===1)p.ws.send(JSON.stringify(m))};
const pub=p=>({id:p.id,name:p.name,on:!!(p.ws&&p.ws.readyState===1)});

/* ───────────── TRẬN 1v1 ───────────── */
class Match{
  constructor(room,pa,pb,opts={}){
    this.room=room;this.id=room.id+"-m"+(room.mseq=(room.mseq||0)+1);this.p=[pa,pb];this.state="pick";this.watch=new Set();
    this.rar=room.rar;this.offers=[pa,pb].map(()=>shuffle(info.balls.filter(b=>b.rar===room.rar)).slice(0,5).map(b=>b.id));
    this.choice=[null,null];this.deadline=Date.now()+PICK_MS;this.onEnd=opts.onEnd||(()=>{});this.gone=[0,0];
    this.pickT=setTimeout(()=>this.forcePick(),PICK_MS);
    for(let i=0;i<2;i++)send(this.p[i],{t:"offer",m:this.id,ids:this.offers[i],ms:PICK_MS,opp:pub(this.p[1-i]),side:i});
  }
  pick(side,idx){if(this.state!=="pick"||side<0||this.choice[side])return;this.choice[side]=this.offers[side][idx|0]||this.offers[side][0];send(this.p[side],{t:"picked",m:this.id});if(this.choice[0]&&this.choice[1])this.begin()}
  forcePick(){if(this.state!=="pick")return;for(let i=0;i<2;i++)if(!this.choice[i])this.choice[i]=pickR(this.offers[i]);this.begin()}
  startMsg(side){return{t:"mstart",m:this.id,arena:this.arena,balls:this.choice,p:this.p.map(pub),rar:this.rar,side}}
  begin(){
    clearTimeout(this.pickT);this.state="fight";this.arena=pickR(info.arenas);
    this.sim=createContext();this.sim.init(this.choice[0],this.choice[1],this.arena);
    for(const s of [...this.p,...this.watch])send(s,this.startMsg(this.p.indexOf(s)));
    this.last=process.hrtime.bigint();this.acc=0;this.timer=setInterval(()=>this.tick(),1000/60);
  }
  tick(){
    const now=process.hrtime.bigint(),dt=Number(now-this.last)/1e9;this.last=now;
    let fin=false;try{fin=this.sim.tick(dt)}catch(e){console.error("sim lỗi:",e.stack);fin=true}
    this.acc+=dt*1000;
    if(this.acc>=SNAP_MS||fin){this.acc=0;const s=this.sim.snap();
      const msg=JSON.stringify(Object.assign({t:"s",m:this.id},s));
      for(const p of [...this.p,...this.watch])if(p.ws&&p.ws.readyState===1)p.ws.send(msg);
      if(fin)this.finish(s.win)}
  }
  input(side,m){if(this.state==="fight")this.sim.input(side,m)}
  finish(win,why){
    if(this.state==="done")return;
    if(win===-1||win==null){ // hoà → đấu lại ngay (luật sàn co đã nằm trong engine)
      if(this.state==="fight"&&!why){clearInterval(this.timer);this.sim.destroy();this.begin();return}
      win=Math.random()<.5?0:1}
    this.state="done";clearInterval(this.timer);clearTimeout(this.pickT);if(this.sim)this.sim.destroy();
    const m={t:"mend",m:this.id,win,why:why||null};
    for(const s of [...this.p,...this.watch])send(s,m);
    this.onEnd(win,this);
  }
  /* mất kết nối: chờ GRACE_MS rồi xử thua */
  dropped(p){const i=this.p.indexOf(p);if(i<0||this.state==="done")return;
    send(this.p[1-i],{t:"note",txt:`${p.name} mất kết nối — chờ ${GRACE_MS/1000}s`});
    this.gone[i]=setTimeout(()=>{if(!(p.ws&&p.ws.readyState===1))this.finish(1-i,"dc")},GRACE_MS)}
  resumed(p){const i=this.p.indexOf(p);if(i<0)return;clearTimeout(this.gone[i]);this.gone[i]=0;
    if(this.state==="pick")send(p,{t:"offer",m:this.id,ids:this.offers[i],ms:Math.max(0,this.deadline-Date.now()),opp:pub(this.p[1-i]),side:i});
    else if(this.state==="fight")send(p,this.startMsg(i))}
}

/* ───────────── PHÒNG (Giai đoạn 1: 2 người đầu đấu 1 trận thử) ───────────── */
class Room{
  constructor(host,o){this.id="r"+(nid++);this.host=host;this.size=o.size||4;this.fmt=o.fmt||"bracket";this.name=o.name||`Phòng của ${host.name}`;
    this.rar=pickR(info.rars);this.players=[host];this.state="lobby";this.match=null;host.room=this}
  pub(){return{id:this.id,name:this.name,host:this.host.name,size:this.size,fmt:this.fmt,n:this.players.length,state:this.state,rar:this.rar}}
  full(){return this.players.length>=this.size}
  broadcast(m){for(const p of this.players)send(p,m)}
  sync(){this.broadcast({t:"room",room:Object.assign(this.pub(),{players:this.players.map(pub),hostId:this.host.id})})}
  start(){
    if(this.state!=="lobby"||this.players.length<2)return;this.state="play";
    const [a,b]=this.players;
    this.match=new Match(this,a,b,{onEnd:(w,m)=>{this.state="lobby";this.match=null;this.broadcast({t:"result",win:m.p[w].name,winSide:w});this.sync()}});
    for(const p of this.players.slice(2)){this.match.watch.add(p);send(p,this.match.startMsg(-1))}
    this.sync()}
  leave(p){const i=this.players.indexOf(p);if(i<0)return;this.players.splice(i,1);p.room=null;
    if(this.match){this.match.watch.delete(p);if(this.match.p.includes(p))this.match.finish(1-this.match.p.indexOf(p),"left")}
    if(!this.players.length){rooms.delete(this.id);return}
    if(this.host===p)this.host=this.players[0];this.sync()}
}

/* ───────────── HTTP + WS ───────────── */
const srv=http.createServer((req,res)=>{
  if(req.url==="/rooms"){res.writeHead(200,{"content-type":"application/json","access-control-allow-origin":"*"});return res.end(JSON.stringify([...rooms.values()].map(r=>r.pub())))}
  fs.readFile(HTML,(e,d)=>{if(e){res.writeHead(500);return res.end("Chưa build: chạy python build.py ở thư mục orbclash2")}
    res.writeHead(200,{"content-type":"text/html; charset=utf-8","cache-control":"no-store"});res.end(d)})
});
const wss=new WebSocketServer({server:srv,maxPayload:4096});
const roomList=()=>[...rooms.values()].map(r=>r.pub());
wss.on("connection",ws=>{
  let me=null;ws.isAlive=true;ws.on("pong",()=>ws.isAlive=true);
  ws.on("message",raw=>{
    let m;try{m=JSON.parse(raw)}catch(e){return}
    if(m.t==="hello"){
      let p=m.token&&players.get(m.token);
      if(p){p.ws=ws;if(m.name)p.name=String(m.name).slice(0,16)}
      else{p={id:crypto.randomBytes(4).toString("hex"),token:crypto.randomBytes(12).toString("hex"),name:String(m.name||"Người chơi").slice(0,16),ws,room:null};players.set(p.token,p)}
      me=p;send(p,{t:"welcome",token:p.token,id:p.id,name:p.name,info:{balls:info.balls,rars:info.rars}});
      send(p,{t:"rooms",rooms:roomList()});
      if(p.room){p.room.sync();if(p.room.match)p.room.match.resumed(p)}
      return}
    if(!me)return;
    switch(m.t){
      case"rooms":send(me,{t:"rooms",rooms:roomList()});break;
      case"create":{if(me.room)me.room.leave(me);const r=new Room(me,{size:m.size===12?12:4,fmt:m.fmt==="groups"?"groups":"bracket",name:String(m.name||"").slice(0,24)});rooms.set(r.id,r);r.sync();break}
      case"join":{const r=rooms.get(m.room);if(!r||r.state!=="lobby"||r.full()){send(me,{t:"err",txt:"Không vào được phòng"});break}
        if(me.room)me.room.leave(me);r.players.push(me);me.room=r;r.sync();break}
      case"leave":if(me.room)me.room.leave(me);send(me,{t:"left"});break;
      case"start":if(me.room&&me.room.host===me)me.room.start();break;
      case"pick":if(me.room&&me.room.match)me.room.match.pick(me.room.match.p.indexOf(me),m.i);break;
      case"od":case"box":{const mt=me.room&&me.room.match;if(mt){const s=mt.p.indexOf(me);if(s>=0)mt.input(s,{t:m.t,x:+m.x||0,y:+m.y||0})}break}
    }
  });
  ws.on("close",()=>{if(me&&me.ws===ws){me.ws=null;const r=me.room;if(r){if(r.match)r.match.dropped(me);r.sync();
    setTimeout(()=>{if(!me.ws&&me.room===r)r.leave(me)},GRACE_MS+2000)}}});
});
const hb=setInterval(()=>{for(const ws of wss.clients){if(!ws.isAlive){ws.terminate();continue}ws.isAlive=false;ws.ping()}},10000);
const ips=()=>{const o=[];for(const [n,l] of Object.entries(os.networkInterfaces()))for(const a of l)if(a.family==="IPv4"&&!a.internal)o.push({name:n,ip:a.address});return o};
function start(port=8787){return new Promise((res,rej)=>{srv.once("error",rej);srv.listen(port,"0.0.0.0",()=>res({port,ips:ips()}))})}
function stop(){clearInterval(hb);for(const ws of wss.clients)ws.terminate();for(const r of rooms.values())if(r.match)r.match.finish(0,"stop");return new Promise(r=>srv.close(()=>r()))}
module.exports={start,stop,ips};
if(require.main===module){
  const port=+process.argv[2]||+process.env.PORT||8787;
  start(port).then(({ips})=>{console.log("Orb Clash Tournament - server chay o cong "+port);for(const a of ips)console.log("  http://"+a.ip+":"+port+"   ("+a.name+")");console.log("Nguoi khac nhap dia chi Radmin (26.x.x.x) o tren.")});
}
