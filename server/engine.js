/* Chạy nguyên engine của game (src/*.js) trong một vm context với DOM giả → mô phỏng trận không cần trình duyệt. */
const vm=require("vm"),fs=require("fs"),path=require("path");
const SRC=path.join(__dirname,"..","src");
const FILES=["3-data.js","4-engine.js","5-ui.js","6-arenas.js","7-modes.js","8-merge.js","9-boxes.js","10-admin.js"];
let script=null;
function load(){
  if(script)return script;
  const code=FILES.map(f=>fs.readFileSync(path.join(SRC,f),"utf8")).join("")+fs.readFileSync(path.join(__dirname,"glue.js"),"utf8");
  script=new vm.Script(code,{filename:"orbclash-bundle.js"});return script;
}
function dummy(){
  const f=function(){};
  const p=new Proxy(f,{
    get(t,k){if(k===Symbol.toPrimitive)return()=>"";if(k===Symbol.iterator)return()=>[][Symbol.iterator]();if(k==="then")return undefined;return p},
    set(){return true},apply(){return p},construct(){return p},has(){return true}});
  return p;
}
const mem={};
function createContext(){
  const D=dummy();let dead=false;
  const sb={document:D,window:D,navigator:D,ResizeObserver:function(){return D},Image:function(){return D},
    localStorage:{getItem:k=>mem[k]??null,setItem:(k,v)=>{mem[k]=String(v)},removeItem:k=>{delete mem[k]}},
    innerWidth:1280,innerHeight:800,devicePixelRatio:1,matchMedia:()=>({matches:false}),
    requestAnimationFrame:()=>1,cancelAnimationFrame:()=>{},performance,console:{log(){},warn(){},error(){}},
    setTimeout:(fn,ms)=>setTimeout(()=>{if(!dead)try{fn()}catch(e){}},ms),clearTimeout,
    setInterval:()=>0,clearInterval:()=>{},addEventListener:()=>{},AudioContext:undefined};
  const ctx=vm.createContext(sb);
  load().runInContext(ctx);
  const run=c=>vm.runInContext(c,ctx);
  return{
    run,destroy(){dead=true},
    init:(a,b,arena)=>run(`__init(${JSON.stringify(a)},${JSON.stringify(b)},${JSON.stringify(arena)})`),
    input:(side,m)=>{sb.__in=[side,m];run("__input(__in[0],__in[1])")},
    tick:dt=>{sb.__dt=dt;return run("__tick(__dt)")},
    snap:()=>run("__snap()"),
    info:()=>JSON.parse(run("JSON.stringify({balls:BALLS.map(b=>({id:b.id,name:b.name,rar:b.rar,color:b.color,mono:b.mono,abn:b.ab.name})),rars:RARS,arenas:ARENA_IDS})")),
  };
}
module.exports={createContext};
