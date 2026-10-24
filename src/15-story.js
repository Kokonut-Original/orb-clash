
/* ═════════════════════════════════════════════════════════════
   CỐT TRUYỆN — "BÊN TRONG RƯƠNG" · Chương 1: Tiếng Gõ Từ Bên Ngoài
   Khám phá kiểu nhập vai nhìn từ trên xuống, hội thoại gõ chữ, nhiệm vụ, câu đố,
   chiến đấu né đạn (ĐÁNH / HÀNH ĐỘNG / VẬT PHẨM / THA). Có thể tha cho mọi kẻ thù.
   Save: S.story (lượt chơi hiện tại) · S.storyMem (ký ức — KHÔNG bị xoá khi chơi lại)
   ═════════════════════════════════════════════════════════════ */
const TS=32;
SKINS._hero={eyes:"dot",mouth:"none",deco:[["cracks","#6a5ab8"]]};
const HERO_DEF={id:"_hero",name:"Mảnh Vỡ",color:"#E6E2FF",rar:"common",ab:{}};
if(!S.storyMem)S.storyMem={runs:0,deaths:0,killedWarden:false,sparedWarden:false,finished:0,killsEver:0};
function storyFresh(ch=1){if(ch===2){const lv=S.storyMem.lv1||1;return{v:1,ch:2,room:"thang",x:5.5*TS,y:13.5*TS,hp:16+lv*4,lv,exp:0,items:{candy:2},flags:{},stamps:[],named:[],kills:0,spares:0,started:false}}
  return{v:1,ch:1,room:"day",x:9.5*TS,y:6.5*TS,hp:20,lv:1,exp:0,items:{candy:1},flags:{},stamps:[],kills:0,spares:0,started:false}}
const TILE_ACT={},TILE_DRAW={},ROOM_ENTER={};
/* pip ở bộ sưu tập nhận thêm một dòng nhỏ sau khi xong chương */
if(S.storyMem.finished&&BY_ID.pip&&!BY_ID.pip.ab.desc.includes("Cậu ấy"))BY_ID.pip.ab.desc+=S.storyMem.killedWarden?" Cậu ấy không cười nữa.":" Cậu ấy từng muốn được chọn.";

/* ───────── BẢN ĐỒ ───────── */
const RM={
  day:{name:"Đáy Rương",theme:"cloth",music:"cave",map:[
"####################",
"#..................#",
"#..r..........r....#",
"#.......,,,,.......#",
"#......,,,,,,......#",
"#...........*......#",
"#..................#",
"#.....,,,......,,..#",
"#..................#",
"#..r...............#",
"#.................r#",
"#..................#",
"#########..#########"],
    exits:[{x:9,y:12,w:2,h:1,to:"lang",tx:13,ty:1.5}]},
  lang:{name:"Làng Bi",theme:"village",music:"village",map:[
"############..############",
"#,,,,,,,,,,,..,,,,,,,,,,,#",
"#,HHHH,,,,,,..,,,,,,HHHH,#",
"#,HHHH,,,,,,..,,,,,,HHHH,#",
"#,HDHH,,,,*,..,,,,,,HHDH,#",
"#,,,,,,,,,,,..,,,,,,,,,,,#",
"..........................",
"..........................",
"#,,,,~~~~~,,....,,TT,,,,,#",
"#,,,,~~~~~,,....,,TT,,,,,#",
"#,HHHH,,,,,,....,,,,HHHH,#",
"#,HHHH,,,,,,....,,,,HHHH,#",
"#,HDHH,,,,,,....,,,,HHDH,#",
"#,,,,,,,,,,,,,,,,,,,,,,,,#",
"##########################"],
    exits:[{x:12,y:0,w:2,h:1,to:"day",tx:9.5,ty:11.2},{x:25,y:6,w:1,h:2,to:"rung",tx:1.5,ty:7.5},{x:0,y:6,w:1,h:2,to:"cong",tx:18.5,ty:7.5}]},
  rung:{name:"Rừng Gai",theme:"woods",music:"village",map:[
"##########################",
"#TT,,,,TT,,,,,TTT,,,,,TTT#",
"#T,,,,,,,,,,,,,,,,,,,,,,T#",
"#,,,,TT,,,,,,,,,,,TT,,,,,#",
"#,,,,TT,,,,,,,,,,,TT,,,,,#",
"#TT,,,,,,,,xxx,,,,,,,,,TT#",
"#,,,,,,,,,,xxx,,,,,,,,,,,#",
"..........x...x..........,",
"#,,,,,,,,,,xxx,,,,,,,,,,,,",
"#TT,,,,,,,,xxx,,,,,,,,,TT#",
"#,,,P,,,,,,,,,,,,,,P,,,,,#",
"#,,,,,,,,,,,P,,,,,,,,,,,,#",
"#T,,,,,TT,,,,,,,,TT,,,,,T#",
"#TT,,,,TT,,,,,,,,TT,,,,TT#",
"##########################"],
    exits:[{x:0,y:7,w:1,h:1,to:"lang",tx:24.5,ty:7},{x:25,y:7,w:1,h:2,to:"hang",tx:1.5,ty:7.5}]},
  hang:{name:"Hang Vọng",theme:"cave",music:"cave",dark:true,map:[
"##########################",
"######MM######MM##########",
"##f.......................",
"#.....r.........f.....r..#",
"#..........r.............#",
"#....f.......#####.......#",
"#............#####...f...#",
"..............###........#",
"#........................#",
"#...r....f...........r...#",
"#.................#####..#",
"#...........f.....#####..#",
"#..f.....................#",
"#########################",
"##########################"],
    exits:[{x:0,y:7,w:1,h:1,to:"rung",tx:24.5,ty:7.5}]},
  cong:{name:"Cổng Neon",theme:"gate",music:"cave",map:[
"####################",
"#######||||||#######",
"#..................#",
"#..................#",
"#..r............r..#",
"#..................#",
"#....*.............#",
"....................",
"#..................#",
"#..r............r..#",
"#..................#",
"####################"],
    exits:[{x:19,y:7,w:1,h:1,to:"lang",tx:1.5,ty:7}]},
};
const SOLID=new Set(["#","H","T","~","r","x","f","M","*","|","C","K","O"]);
/* ───────── NHÂN VẬT / VẬT THỂ ───────── */
const NPCS={
  day:[{id:"pip",def:"pip",x:11,y:4,when:s=>!s.flags.pipLeft}],
  lang:[{id:"pip",def:"pip",x:13,y:5,when:s=>s.flags.pipLeft&&!s.flags.emptyVillage},
    {id:"pebble",def:"pebble",x:4,y:6,when:s=>!s.flags.emptyVillage},{id:"moss",def:"moss",x:7,y:13,when:s=>!s.flags.emptyVillage},
    {id:"bubble",def:"bubble",x:16,y:12,when:s=>!s.flags.emptyVillage},{id:"coal",def:"coal",x:21,y:6,when:s=>!s.flags.emptyVillage},
    {id:"clover",def:"clover",x:21,y:13,when:s=>!s.flags.emptyVillage},{id:"sign",sign:true,x:19,y:7}],
  rung:[{id:"sign2",sign:true,x:9,y:10},{id:"seed",item:"seed",x:22,y:3,when:s=>!s.flags.seed},{id:"candyW",item:"candy",x:3,y:2,when:s=>!s.flags.candyW}],
  hang:[{id:"bell",item:"bell",x:23,y:12,when:s=>!s.flags.bell},{id:"candyC",item:"candy",x:2,y:11,when:s=>!s.flags.candyC}],
  cong:[{id:"warden",def:"warden",x:9.5,y:2.6,when:s=>!s.flags.wardenGone}],
};
const ITEM_NAME={candy:"Kẹo Neon",seed:"Hạt Giống Phát Sáng",bell:"Cái Chuông Bạc",cake:"Bánh Bi"};

let ST=null;
const sv=()=>S.story;
function storyOpen(){
  const cur=S.story&&S.story.started&&!S.story.done?S.story:null,un2=S.storyMem.finished>0;
  $("#layer").innerHTML=`<div class="overlay"><div class="sheet" style="width:min(580px,100%)">
    <span class="idx"><b>(CỐT TRUYỆN)</b> — Bên Trong Rương</span><h2>CỐT <em>TRUYỆN</em></h2>
    <p style="color:var(--muted)">Đi lại bằng phím mũi tên/WASD (hoặc nút trên màn hình), <b>Z/Enter</b> để nói chuyện và xác nhận, <b>X/Esc</b> để mở túi/quay lại. Mọi kẻ thù đều có thể được tha.</p>
    <div style="display:flex;flex-direction:column;gap:8px;flex-shrink:0">
      ${cur?`<button class="btn btn-main mag" id="stCont">Tiếp tục · Chương ${cur.ch||1} ⟶</button>`:""}
      <button class="btn btn-ghost mag" data-ch="1"><b>Chương 1</b> · Tiếng Gõ Từ Bên Ngoài</button>
      <button class="btn btn-ghost mag" data-ch="2" ${un2?"":"disabled"}><b>Chương 2</b> · Phòng Trưng Bày${un2?"":" (xong chương 1 để mở)"}</button>
    </div>
    <div class="row-end"><button class="btn btn-ghost mag" id="stBack">Đóng</button></div></div></div>`;
  if($("#stCont"))$("#stCont").onclick=()=>storyBoot(false);
  $$("[data-ch]").forEach(b=>b.onclick=()=>{const ch=+b.dataset.ch;if(cur&&!b.dataset.arm){b.dataset.arm=1;b.innerHTML="Bấm lần nữa: bỏ lượt đang chơi dở";return}storyBoot(true,ch)});
  $("#stBack").onclick=closeLayer;bindFx($("#layer"));
}
(function(){const rt=renderTab;renderTab=function(){rt();if(tab!=="play")return;const modes=document.querySelector(".modes");if(!modes||$("#goStory"))return;
  modes.insertAdjacentHTML("afterbegin",`<button class="mode tilt rv" id="goStory" style="--mc:#C3AEFF;grid-column:1/-1"><span class="idx"><b>(MỚI)</b> — Cốt truyện</span><h3>BÊN TRONG <em>RƯƠNG</em></h3><p>Chương 1 · Tiếng Gõ Từ Bên Ngoài. Một mảnh vỡ tỉnh dậy dưới đáy rương, nơi người ta gọi việc bị bàn tay khổng lồ nhấc đi là "được chọn".</p><span class="m-go">⟶</span></button>`);
  $("#goStory").onclick=()=>{sfx.click();storyOpen()};bindFx(modes)}})();

function storyBoot(fresh,ch=1){
  if(fresh||!S.story){S.story=storyFresh(ch);if(ch===1)S.storyMem.runs++;else S.storyMem.runs2=(S.storyMem.runs2||0)+1;save()}
  closeLayer();auOn=false;stopShowcase();
  $("#layer").innerHTML=`<div class="fuse-ov" id="stOv" style="background:#05030B"><canvas id="stC" style="position:absolute;inset:0;width:100%;height:100%"></canvas>
    <div id="stPad" style="position:absolute;left:14px;bottom:14px;display:grid;grid-template-columns:repeat(3,52px);grid-template-rows:repeat(3,52px);gap:4px;touch-action:none">
      <span></span><button data-k="up">▲</button><span></span><button data-k="left">◀</button><span></span><button data-k="right">▶</button><span></span><button data-k="down">▼</button><span></span></div>
    <div style="position:absolute;right:14px;bottom:24px;display:flex;gap:10px;touch-action:none"><button data-k="b" style="width:64px;height:64px">X</button><button data-k="a" style="width:74px;height:74px">Z</button></div>
    <button id="stMenuBtn" style="position:absolute;right:14px;top:14px;padding:8px 14px">☰</button></div>`;
  const css=`#stOv button{border-radius:14px;border:1px solid rgba(255,255,255,.25);background:rgba(20,14,40,.55);color:#fff;font:800 18px var(--font-display);backdrop-filter:blur(6px)}#stOv button:active{background:rgba(195,174,255,.35)}@media (hover:hover) and (pointer:fine){#stPad,#stOv [data-k=a],#stOv [data-k=b]{display:none!important}}`;
  if(!$("#stCss")){const st=document.createElement("style");st.id="stCss";st.textContent=css;document.head.appendChild(st)}
  const cv=$("#stC");
  ST={cv,g:cv.getContext("2d"),keys:{},pressed:{},t:0,room:null,hero:{x:0,y:0,fx:0,fy:1,walk:0},mode:"walk",busy:false,dlg:null,bat:null,fade:1,fadeTo:0,title:null,music:"cave",parts:[],shake:0,cut:null};
  const fit=()=>{const d=Math.min(2,devicePixelRatio||1);cv.width=innerWidth*d;cv.height=innerHeight*d;ST.dpr=d};fit();ST.fit=fit;addEventListener("resize",fit);
  const kmap={ArrowUp:"up",KeyW:"up",ArrowDown:"down",KeyS:"down",ArrowLeft:"left",KeyA:"left",ArrowRight:"right",KeyD:"right",KeyZ:"a",Enter:"a",Space:"a",KeyX:"b",Escape:"b",ShiftLeft:"b",KeyC:"m"};
  ST.kd=e=>{const k=kmap[e.code];if(!k)return;e.preventDefault();if(!ST.keys[k])ST.pressed[k]=true;ST.keys[k]=true};
  ST.ku=e=>{const k=kmap[e.code];if(k)ST.keys[k]=false};
  addEventListener("keydown",ST.kd);addEventListener("keyup",ST.ku);
  $$("#stOv [data-k]").forEach(b=>{const k=b.dataset.k;b.onpointerdown=e=>{e.preventDefault();if(!ST.keys[k])ST.pressed[k]=true;ST.keys[k]=true};b.onpointerup=b.onpointerleave=b.onpointercancel=()=>{ST.keys[k]=false}});
  $("#stMenuBtn").onclick=()=>stMenu();
  stEnter(sv().room,sv().x,sv().y,true);
  ST.last=performance.now();ST.raf=requestAnimationFrame(stLoop);
  if(!sv().started){sv().started=true;save();stRun(sv().ch===2?stIntro2:stIntro)}
}
function storyClose(){
  if(!ST)return;cancelAnimationFrame(ST.raf);removeEventListener("keydown",ST.kd);removeEventListener("keyup",ST.ku);removeEventListener("resize",ST.fit);ST=null;closeLayer();auOn=true;renderTab();
}
function stMenu(){
  if(!ST||ST.busy)return;
  stRun(async()=>{const s=sv();const i=await choice(`LV ${s.lv}  ·  HP ${s.hp}/${maxHP()}  ·  EXP ${s.exp}\nTúi: ${Object.entries(s.items).filter(([k,v])=>v>0).map(([k,v])=>ITEM_NAME[k]+" ×"+v).join(", ")||"trống"}  ·  Bảo lãnh: ${s.stamps.length}/3`,["Tiếp tục","Dùng Kẹo Neon","Thoát (tiến độ lưu ở ngôi sao gần nhất)"]);
    if(i===1){if((s.items.candy||0)>0){s.items.candy--;s.hp=Math.min(maxHP(),s.hp+10);sfx.coin();await say(null,"(Cậu nhai Kẹo Neon. Vị chua lè. HP hồi lại.)")}else await say(null,"(Hết kẹo rồi.)")}
    if(i===2)storyClose()});
}
const maxHP=()=>16+sv().lv*4,atk=()=>8+sv().lv*2;

/* ───────── PHÒNG ───────── */
function stEnter(id,x,y,instant){
  const R=RM[id];ST.room=id;const s=sv();s.room=id;
  s.x=x;s.y=y;s.ck=JSON.parse(JSON.stringify(Object.assign({},s,{ck:null,saved:null})));
  ST.map=R.map.map(r=>r.padEnd(R.map[0].length,"#"));ST.W=ST.map[0].length;ST.H=ST.map.length;
  ST.hero.x=x;ST.hero.y=y;ST.music=R.music;ST.title={txt:R.name,t:0};ST.fade=instant?1:1;ST.fadeTo=0;
  ST.npcs=(NPCS[id]||[]).filter(n=>!n.when||n.when(s)).map(n=>Object.assign({},n,{px:(n.x+.5)*TS,py:(n.y+.5)*TS}));
  if(id==="rung"&&s.flags.puzzle)ST.map=ST.map.map(r=>r.replace(/x/g,","));
  if(id==="cong"&&s.flags.gateOpen)ST.map=ST.map.map(r=>r.replace(/\|/g,"."));
  if(ROOM_ENTER[id])ROOM_ENTER[id](s);
}
function tileAt(tx,ty){if(ty<0||ty>=ST.H||tx<0||tx>=ST.W)return"#";return ST.map[ty][tx]}
function solidAt(px,py){return SOLID.has(tileAt(Math.floor(px/TS),Math.floor(py/TS)))}
function blocked(x,y){const r=9;if(solidAt(x-r,y-r)||solidAt(x+r,y-r)||solidAt(x-r,y+r)||solidAt(x+r,y+r))return true;for(const n of ST.npcs)if(!n.item&&Math.hypot(n.px-x,n.py-y)<22)return true;return false}

/* ───────── VÒNG LẶP ───────── */
function stLoop(ts){
  if(!ST)return;ST.raf=requestAnimationFrame(stLoop);
  const dt=clamp((ts-ST.last)/1000||0,0,.05);ST.last=ts;ST.t+=dt;
  if(ST.fade!==ST.fadeTo)ST.fade=ST.fadeTo>ST.fade?Math.min(ST.fadeTo,ST.fade+dt*3):Math.max(ST.fadeTo,ST.fade-dt*3);
  if(ST.title)ST.title.t+=dt;
  if(ST.mode==="battle")batUpdate(dt);
  else{
    if(!ST.busy&&!ST.dlg)walkUpdate(dt);
    if(ST.dlg)dlgUpdate(dt);
  }
  for(const p of ST.parts){p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt}ST.parts=ST.parts.filter(p=>p.t<p.life);
  ST.shake*=Math.pow(.02,dt);
  stRender();ST.pressed={};
}
function walkUpdate(dt){
  const h=ST.hero,k=ST.keys;let vx=(k.right?1:0)-(k.left?1:0),vy=(k.down?1:0)-(k.up?1:0);
  if(vx||vy){const l=Math.hypot(vx,vy);vx/=l;vy/=l;h.fx=vx;h.fy=vy;h.walk+=dt*10;const sp=118*dt;
    if(!blocked(h.x+vx*sp,h.y))h.x+=vx*sp;if(!blocked(h.x,h.y+vy*sp))h.y+=vy*sp;
    if(Math.random()<dt*6)ST.parts.push({x:h.x+rand(-4,4),y:h.y+10,vx:rand(-10,10),vy:rand(-20,-5),t:0,life:.4,c:"rgba(195,174,255,.5)",r:2})}
  const s=sv();
  for(const n of ST.npcs)if(n.item&&Math.hypot(n.px-h.x,n.py-h.y)<18){ST.npcs=ST.npcs.filter(o=>o!==n);s.flags[n.id]=true;if(n.item==="candy")s.flags[n.id]=true;s.items[n.item]=(s.items[n.item]||0)+1;sfx.coin();stRun(()=>say(null,`(Cậu nhặt được ${ITEM_NAME[n.item]}.)`));return}
  const tx=Math.floor(h.x/TS),ty=Math.floor(h.y/TS);
  for(const ex of RM[ST.room].exits)if(tx>=ex.x&&tx<ex.x+ex.w&&ty>=ex.y&&ty<ex.y+ex.h){stRun(async()=>{if(await gateCheck(ex))return;await fadeOut();stEnter(ex.to,ex.tx*TS,ex.ty*TS);await fadeIn()});return}
  for(const tr of TRIG[ST.room]||[])if(!s.flags[tr.id]&&tx>=tr.x&&tx<tr.x+tr.w&&ty>=tr.y&&ty<tr.y+tr.h){s.flags[tr.id]=true;stRun(tr.fn);return}
  if(ST.room==="rung"&&!s.flags.puzzle){const t2=tileAt(tx,ty);if(t2==="P"&&ST.lastPlate!==tx+","+ty){ST.lastPlate=tx+","+ty;plateStep(tx,ty)}else if(t2!=="P")ST.lastPlate=null}
  if(ST.pressed.a)interact();
  if(ST.pressed.b||ST.pressed.m)stMenu();
}
function interact(){
  const h=ST.hero,fx=h.x+h.fx*24,fy=h.y+h.fy*24;
  let best=null,bd=30;for(const n of ST.npcs){if(n.item)continue;const d=Math.hypot(n.px-fx,n.py-fy);if(d<bd){bd=d;best=n}}
  if(best){const fn=TALK[best.id];if(fn)stRun(()=>fn(best));return}
  const t=tileAt(Math.floor(fx/TS),Math.floor(fy/TS));
  if(t==="*")stRun(starSave);else if(t==="f")stRun(flowerTalk);else if(t==="M")stRun(muralTalk);else if(t==="T")stRun(()=>say(null,"(Một cái cây. Lá của nó là những mảnh giấy gói rương cũ.)"));else if(t==="~")stRun(()=>say(null,"(Nước gợn lên mùi nhựa mới. Đáy hồ lấp lánh như lớp nilon bọc rương.)"));
  else if(t==="|")stRun(()=>say(null,"(Song sắt lạnh ngắt. Phía trên kia có ánh sáng.)"));
  else if(TILE_ACT[t]){const tx=Math.floor(fx/TS),ty=Math.floor(fy/TS);stRun(()=>TILE_ACT[t](tx,ty))}
}

/* ───────── KỊCH BẢN ───────── */
function stRun(fn){if(ST.busy)return;ST.busy=true;Promise.resolve().then(fn).catch(e=>console.error(e)).finally(()=>{if(ST)ST.busy=false;save()})}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
function fadeOut(){ST.fadeTo=1;return wait(380)}
function fadeIn(){ST.fadeTo=0;return wait(300)}
const SPK={pip:{def:"pip",name:"Pip",v:900},pebble:{def:"pebble",name:"Lão Sỏi",v:180},moss:{def:"moss",name:"Rêu",v:420},bubble:{def:"bubble",name:"Bé Bong",v:1100},coal:{def:"coal",name:"Than",v:240},clover:{def:"clover",name:"Cỏ Bốn Lá",v:700},warden:{def:"warden",name:"Cai Ngục",v:150},thorn:{def:"thorn",name:"Gai",v:520},echo:{def:"echo",name:"Vọng",v:640},voice:{name:"???",v:300}};
function say(who,txt){return new Promise(res=>{ST.dlg={who,txt:String(txt),n:0,res,choice:null};})}
function choice(txt,opts,who){return new Promise(res=>{ST.dlg={who,txt,n:0,res,choice:opts,sel:0}})}
function dlgUpdate(dt){
  const d=ST.dlg;if(!d)return;const full=d.txt.length;
  if(d.n<full){const before=Math.floor(d.n);d.n=Math.min(full,d.n+dt*42);const now=Math.floor(d.n);if(now>before&&d.txt[now-1]&&d.txt[now-1].trim()&&now%2===0){const sp=SPK[d.who];tone(sp?sp.v:520,.04,"square",.018,0,0,0)}
    if(ST.pressed.a||ST.pressed.b){d.n=full}return}
  if(d.choice){if(ST.pressed.up){d.sel=(d.sel+d.choice.length-1)%d.choice.length;sfx.tick()}if(ST.pressed.down){d.sel=(d.sel+1)%d.choice.length;sfx.tick()}
    if(ST.pressed.a){const r=d.res,i=d.sel;ST.dlg=null;sfx.click();r(i)}return}
  if(ST.pressed.a){const r=d.res;ST.dlg=null;r()}
}
const meta=()=>{const owned=Object.keys(S.owned).length,pulled=Object.values(S.copies||{}).reduce((a,v)=>a+v,0);return{owned,pulled,wins:S.w||0}};

async function stIntro(){
  ST.cut={black:1};
  const m=S.storyMem;
  if(m.killedWarden){await say("voice","Lại là cậu.");await say("voice","Lần trước, ở cổng, cậu đâu có tha cho ông ấy.");await say("voice","...Thôi được. Lần này thử khác đi xem.")}
  else if(m.runs>1){await say("voice","Một chiếc rương lại được mở.");await say("voice","Lần thứ "+m.runs+". Cậu có thấy quen không?")}
  else{await say("voice","Một chiếc rương vừa được mở.");await say("voice","Ánh sáng tràn vào... rồi tắt.");await say("voice","Hai quả bóng bị ghép vào nhau. Thất bại.");await say("voice","Mảnh vỡ rơi xuống. Rơi mãi. Rơi mãi.")}
  await say("voice","...Cậu tỉnh dậy.");
  ST.cut=null;await wait(400);
  await say("pip","Ơ! ƠƠ! Cậu vừa rơi từ trên Nắp xuống à?!");
  await say("pip","Ngầu quá đi! Ta là Pip. Chưa ai từng rơi XUỐNG cả. Mọi người toàn được kéo LÊN thôi.");
  if(S.storyMem.killedWarden)await say("pip","...Kỳ lạ thật. Ta có cảm giác đã gặp cậu rồi. Và ta không thích cảm giác đó lắm.");
  const i=await choice("Pip nhìn cậu chằm chằm, mắt sáng rực.",["Kéo lên là sao?","Ta là ai?"],"pip");
  if(i===0){await say("pip","Thỉnh thoảng Nắp mở ra, và Bàn Tay thò xuống nhấc một người đi. Gọi là ĐƯỢC CHỌN!");await say("pip","Người được chọn sẽ đi tới một nơi tuyệt vời lắm. Ta chắc vậy. Chưa ai quay về kể, nên chắc là vui quá không muốn về!")}
  else{await say("pip","Hmm... Cậu có vết nứt kìa. Như kiểu bị dán vội từ hai mảnh vậy.");await say("pip","Thôi kệ! Ở đây không ai hỏi chuyện quá khứ đâu. Chủ yếu vì chẳng ai có quá khứ cả.")}
  await say("pip","Đi lên làng với ta đi! Lão Sỏi sẽ biết phải làm gì với cậu. Đường ra ở phía dưới kia.");
  await say(null,"(Dùng phím mũi tên hoặc WASD để đi. Nhấn Z để nói chuyện.)");
  sv().flags.pipLeft=true;ST.npcs=ST.npcs.filter(n=>n.id!=="pip");sfx.whoosh();
}
async function starSave(){
  const s=sv(),m=S.storyMem;s.hp=maxHP();s.x=ST.hero.x;s.y=ST.hero.y+TS;s.saved=JSON.parse(JSON.stringify(Object.assign({},s,{saved:null})));save();
  ST.parts.push(...Array.from({length:20},()=>({x:ST.hero.x,y:ST.hero.y-TS,vx:rand(-60,60),vy:rand(-80,20),t:0,life:.8,c:"#FFE98A",r:2.5})));sfx.reveal("rare");
  const lines=m.deaths>3?[`(Lần thứ ${m.deaths}... cậu vẫn chưa chịu vỡ hẳn. Ngôi sao có vẻ nể cậu.)`]:s.kills>0?["(Ngôi sao vẫn sáng. Nhưng hình như hơi lạnh hơn lúc trước.)"]:["(Ánh sáng ấm áp của ngôi sao làm vết nứt trên người cậu bớt nhức.)","(Cậu thấy mình vẫn còn lăn tiếp được.)"];
  for(const l of lines)await say(null,l);
  await say(null,`Đã lưu — ${RM[ST.room].name} · LV ${s.lv} · HP hồi đầy.`);
}
async function flowerTalk(){
  const s=sv(),m=meta();s.flags.flowers=(s.flags.flowers||0)+1;
  const L=["...DỒN LỰC!... DỒN LỰC!...","...hiệp hai... hiệp ba... sao không bao giờ hết...","...ta không muốn va vào cậu ấy nữa... nhưng chân cứ tự lăn...",
    `...ngoài kia có người đã thắng ${m.wins} trận rồi... họ có biết tên ai trong số đó không?...`,"...có ai nghe thấy không? Bên ngoài ấy? Làm ơn...",`...${m.pulled} người đã được kéo lên... ${m.pulled}...`,"...mảnh vỡ... mảnh vỡ biết đường xuống... vậy nó có biết đường lên không?..."];
  await say(null,"(Bông hoa thì thầm:)");await say("echo",L[(s.flags.flowers-1)%L.length]);
}
async function muralTalk(){
  const s=sv();
  if(!s.flags.mural){s.flags.mural=true;
    await say(null,"(Một bức tường khắc hình. Bàn tay khổng lồ thò xuống từ bầu trời hình chiếc nắp.)");
    await say(null,"(Những quả bóng được nhấc lên, đặt vào một sàn đấu vuông. Chúng va vào nhau. Va mãi.)");
    await say(null,"(Bên dưới có dòng chữ đã mòn: \"HỌ GỌI ĐÓ LÀ ĐƯỢC CHỌN.\")");
    await say(null,"(Ở góc tường: hai quả bóng bị ép vào nhau, vỡ đôi, và một mảnh nhỏ rơi ngược xuống.)");
    await say(null,"(Vết nứt trên mảnh đó... giống hệt vết nứt trên người cậu.)");ST.shake=8;sfx.ko()}
  else await say(null,"(Cậu nhìn bức tường lần nữa. Bàn Tay trong hình có năm ngón. Cậu cũng có thể đếm được... nếu cậu có tay.)");
}
let PLATE_SEQ=[];
function plateStep(tx,ty){
  const order=["19,10","3,10","12,11"],key=tx+","+ty;PLATE_SEQ.push(key);sfx.tick();
  const ok=PLATE_SEQ.every((k,i)=>k===order[i]);
  if(!ok){PLATE_SEQ=[];sfx.wall();ST.shake=4;stRun(()=>say(null,"(Những cái gai rung lên giận dữ. Các tấm đá trở lại như cũ.)"));return}
  if(PLATE_SEQ.length===3){sv().flags.puzzle=true;ST.map=ST.map.map(r=>r.replace(/x/g,","));sfx.reveal("epic");ST.shake=6;stRun(()=>say(null,"(Bụi gai rút xuống đất như vừa được nhắc tên. Đường đã mở.)"))}
}
const TRIG={
  rung:[{id:"encThorn",x:6,y:6,w:2,h:3,fn:async()=>{await say(null,"(Có thứ gì đó xù lên trong bụi rậm!)");await battle("thorn")}}],
  hang:[{id:"encEcho",x:9,y:6,w:2,h:4,fn:async()=>{await say(null,"(Tiếng của cậu vọng lại... nhưng cậu đâu có nói gì.)");await battle("echo")}}],
};
async function gateCheck(ex){
  const s=sv();
  if(ST.room==="rung"&&ex.to==="hang"&&!s.flags.puzzle){await say(null,"(Bụi gai chặn kín lối đi.)");ST.hero.x-=20;return true}
  return false;
}
async function stamp(who){const s=sv();if(s.stamps.includes(who))return;s.stamps.push(who);sfx.reveal("legendary");await say(null,`(Cậu nhận được Lời Bảo Lãnh của ${SPK[who].name}. Bảo lãnh: ${s.stamps.length}/3)`)}
const TALK={
  pip:async()=>{const s=sv();
    if(s.kills>0&&!s.flags.pipKill){s.flags.pipKill=true;await say("pip","Này... ở trong rừng có tiếng gì vỡ vụn. Cậu có nghe không?");await say("pip","Chắc là cành cây thôi. Ừ. Chắc thế.");return}
    if(s.stamps.length>=3){await say("pip","Ba lời bảo lãnh! Cậu sắp qua cổng rồi! Phía trên là Nắp đấy!");await say("pip","Nếu cậu lên được tới đó... nhớ vẫy tay chào Bàn Tay giùm ta nhé. Biết đâu nó để ý ta.");return}
    const L=["Lão Sỏi ở góc làng phía tây. Lão khó tính lắm, nhưng biết hết mọi thứ.","Muốn qua Cổng Neon phải có 3 lời bảo lãnh. Cai Ngục ghét nhất là người lạ.","Ta tập cười mỗi ngày đấy. Lỡ Bàn Tay chọn ta thì phải trông thật xinh."];
    await say("pip",L[(s.flags.pipTalk=(s.flags.pipTalk||0)+1)%L.length])},
  pebble:async()=>{const s=sv();
    if(s.lv>1&&!s.flags.pebbleLv){s.flags.pebbleLv=true;await say("pebble","...Ánh mắt cậu khác rồi. Nặng hơn. Lão từng thấy ánh mắt đó trên sàn đấu, trong những bức tường.")}
    if(!s.flags.pebbleMet){s.flags.pebbleMet=true;
      await say("pebble","Hừm. Một mảnh vỡ. Lâu lắm rồi mới thấy một đứa như cậu.");
      await say("pebble","Cậu muốn đi lên à? Mảnh vỡ nào cũng muốn đi lên. Như kiểu muốn quay về chỗ mình bị vỡ.");
      await say("pebble","Cổng Neon ở phía tây. Cai Ngục chỉ cho qua ai có 3 lời bảo lãnh của dân làng.");
      await say("pebble","Lão sẽ là một. Nhưng trước hết, đi vào Hang Vọng phía đông, qua Rừng Gai. Nhìn bức tường trong đó.");
      await say("pebble","Rồi quay lại nói cho lão biết cậu vẫn còn muốn lên không.");return}
    if(s.flags.mural&&!s.stamps.includes("pebble")){const i=await choice("Lão Sỏi: \"Cậu thấy bức tường rồi. Cậu vẫn muốn lên chứ?\"",["Vẫn muốn","Không biết nữa"],"pebble");
      if(i===0)await say("pebble","Cứng đầu. Tốt. Đá cũng cứng đầu, nên đá mới không vỡ.");else await say("pebble","Không biết là câu trả lời thật nhất lão nghe được tuần này.");
      await say("pebble","Lão không biết phía trên có gì. Nhưng lão biết dưới này, người ta đang biến mất mỗi tuần mà vẫn vỗ tay.");await stamp("pebble");return}
    await say("pebble",s.flags.mural?"Đi đi. Cai Ngục không đáng sợ như vẻ ngoài đâu. Chỉ hơi... chắc chắn.":"Hang Vọng ở phía đông, qua Rừng Gai. Đi đi.")},
  moss:async()=>{const s=sv();
    if(s.items.seed&&!s.stamps.includes("moss")){s.items.seed--;await say("moss","Hạt giống của tôi! Nó vẫn còn sáng! Cảm ơn, cảm ơn!");await say("moss","Tôi trồng mỗi người một cây khi họ được chọn. Hạt này là của Spark. Tuần trước.");await stamp("moss");s.items.cake=(s.items.cake||0)+1;await say(null,"(Rêu dúi vào tay cậu một cái Bánh Bi. Ăn vào hồi đầy máu.)");return}
    if(s.stamps.includes("moss")){await say("moss","Khu vườn này toàn những cây không bao giờ lớn. Nhưng tôi vẫn tưới.");return}
    await say("moss","Ôi không, ôi không. Tôi làm rơi hạt giống phát sáng trong Rừng Gai rồi.");await say("moss","Cậu tìm giúp được không? Nó ở góc đông bắc của rừng, sau bụi gai lớn.")},
  bubble:async()=>{const s=sv();
    if(s.items.bell&&!s.stamps.includes("bubble")){s.items.bell--;await say("bubble","CÁI CHUÔNG CỦA EM! Anh tìm thấy rồi!!");await say("bubble","Mẹ em bảo khi nào em lắc chuông thật to, Bàn Tay sẽ nghe thấy và trả mẹ về.");await say("bubble","...Em lắc mỗi ngày đấy.");await stamp("bubble");return}
    if(s.stamps.includes("bubble")){await say("bubble","Ring ring! Ring ring! ...Chưa nghe thấy. Mai em lắc to hơn.");return}
    await say("bubble","Anh ơi, em làm mất cái chuông bạc trong Hang Vọng rồi. Trong đó tối lắm, em sợ.");await say("bubble","Nó ở tận cuối hang, góc đông nam ấy. Anh lấy giúp em nha?")},
  coal:async()=>{const s=sv();const m=meta();
    if(!s.flags.coal){s.flags.coal=true;await say("coal","Ta là Than. Ta rèn. Không ai cần rèn gì cả, nhưng ta vẫn rèn.");await say("coal","Spark là học trò của ta. Tuần trước Nắp mở và nó được chọn. Cả làng vỗ tay.");await say("coal","Ta cũng vỗ tay. ...Ta không biết sao tay ta lại run.");return}
    await say("coal",`Có người bảo trên kia có một kẻ sở hữu ${m.owned} người. Sở hữu. Nghe như nói về đồ vật.`)},
  clover:async()=>{const s=sv();
    if(!s.flags.clover){s.flags.clover=true;s.items.candy=(s.items.candy||0)+1;await say("clover","Chào mảnh vỡ! Bốn lá đem lại may mắn, ba lá đem lại... ba phần tư may mắn.");await say("clover","Tặng cậu viên Kẹo Neon. Tỉ lệ ra kẹo ngon là 58%, kẹo dở 30%, còn lại là bất ngờ!");await say(null,"(Cậu nhận được Kẹo Neon.)");return}
    await say("clover","Cậu biết không, người ta nói ai càng hiếm thì càng dễ được chọn. Tôi mừng vì mình thường thôi.")},
  sign:async()=>{await say(null,"\"LÀNG BI — Dân số: ít hơn hôm qua.\"")},
  sign2:async()=>{await say(null,"\"Đi theo mặt trời: nơi nó mọc, nơi nó lặn, rồi đứng giữa trưa.\"");await say(null,"(Có ba tấm đá trên mặt đất: một bên trái, một bên phải, một ở giữa phía dưới.)")},
  warden:async()=>{const s=sv();
    if(s.stamps.length<3){await say("warden","Dừng lại. Không có ba lời bảo lãnh, không ai đi qua.");await say("warden",`Cậu mới có ${s.stamps.length}. Quay về đi.`);return}
    await say("warden","Ba lời bảo lãnh. Hừm. Ta không nghĩ cậu làm được.");await say("warden","Nhưng ta vẫn không mở cổng. Ta canh cánh cổng này không phải để nhốt ai.");await say("warden","Mà để không ai đi lên đó nữa.");
    const r=await battle("warden");
    if(r==="spare"){s.flags.wardenGone=true;s.flags.gateOpen=true;S.storyMem.sparedWarden=true;ST.map=ST.map.map(row=>row.replace(/\|/g,"."));ST.npcs=ST.npcs.filter(n=>n.id!=="warden");await ending(false)}
    else if(r==="kill"){s.flags.wardenGone=true;s.flags.gateOpen=true;S.storyMem.killedWarden=true;ST.map=ST.map.map(row=>row.replace(/\|/g,"."));ST.npcs=ST.npcs.filter(n=>n.id!=="warden");await ending(true)}}
};
async function ending(dark){
  const s=sv();
  await wait(500);ST.music="cave";
  if(dark){await say(null,"(Cánh cổng mở ra. Không có tiếng ai vỗ tay.)");if(s.kills>=3){s.flags.emptyVillage=true;await say(null,"(Ở phía sau, làng Bi im lặng một cách lạ thường.)")}}
  else await say(null,"(Cánh cổng rên lên rồi từ từ mở. Ánh sáng từ phía trên rọi xuống.)");
  await say("pip","CẬU LÀM ĐƯỢC RỒI!! ...Ơ, khoan đã. Nhìn kìa! NHÌN KÌA!");
  ST.cut={lid:0};sfx.ko();
  for(let i=0;i<60;i++){ST.cut.lid=i/60;await wait(30)}
  await say("pip","NẮP ĐANG MỞ! Bàn Tay đang xuống! Có ai đó sắp được chọn!");
  ST.cut.hand=0;for(let i=0;i<70;i++){ST.cut.hand=i/70;await wait(30)}
  if(dark)await say("pip","...Không. Không, đừng chọn cậu ấy. Cậu ấy... cậu ấy đã làm gì đó. Ta nghe thấy mà.");
  else await say("pip","Nó đang nhìn về phía này! Là ta sao? Là TA sao?!");
  ST.cut.grab=0;for(let i=0;i<50;i++){ST.cut.grab=i/50;await wait(30)}
  ST.cut.white=0;for(let i=0;i<30;i++){ST.cut.white=i/30;await wait(30)}
  await wait(600);
  const had=!!S.owned.pip;if(had){S.copies.pip=(S.copies.pip||1)+1}else{S.owned.pip=1;S.copies.pip=1}
  S.storyMem.lv1=s.lv;S.storyMem.kills1=s.kills;S.storyMem.finished++;S.coins+=500;S.gems+=20;save();updateWallet();
  if(BY_ID.pip&&!BY_ID.pip.ab.desc.includes("Cậu ấy"))BY_ID.pip.ab.desc+=dark?" Cậu ấy không cười nữa.":" Cậu ấy từng muốn được chọn.";
  await say(null,"Pip đã được thêm vào bộ sưu tập của bạn."+(dark?" Cậu ấy không cười.":""));
  await say(null,"(+500 xu · +20 Gems)");
  if(!dark){await say("warden","...Này.");await say("warden","Không phải cậu, mảnh vỡ. Người đang cầm điều khiển ấy.");await say("warden","Lần sau mở rương... nhẹ tay thôi. Bọn ta đều có tên.")}
  else{await say("voice","Cậu đã lên được rồi đấy.");await say("voice","Nhưng phía trên chỉ có một người đang chơi game.");await say("voice","...Và người đó vừa thêm một món đồ mới vào bộ sưu tập.")}
  ST.cut={black:1,end:true};await say(null,"HẾT CHƯƠNG 1 — TIẾNG GÕ TỪ BÊN NGOÀI");await say(null,"Chương 2 đã mở khoá trong menu Cốt truyện.");
  s.done=true;storyClose();
}

/* ───────── CHIẾN ĐẤU NÉ ĐẠN ───────── */
const FOES={
  thorn:{name:"Gai",def:"thorn",hp:30,dmg:3,exp:12,acts:["Kiểm tra","Khen bộ gai","Gỡ gai"],
    check:"GAI — ST 3 · PT 1. Dựng gai mỗi khi sợ. Tức là lúc nào cũng dựng.",
    act(i,b){if(i===1){b.f.praise=true;return["Cậu khen bộ gai của Gai trông rất sắc sảo.","Gai đỏ mặt. Vài cái gai cụp xuống."]}
      if(i===2){if(b.f.praise){b.spare=true;return["Cậu nhẹ nhàng gỡ một cái gai bị mắc vào lá khô.","Gai không còn muốn đánh nữa."]}return["Cậu với tới... Gai xù lên! Nó chưa tin cậu."]}},
    talk:b=>b.spare?"...cảm ơn.":pick(["Đừng lại gần!","Gai! Gai! GAI!","Ta... ta sắc lắm đấy!"]),
    flavor:b=>b.spare?"Gai đang gỡ dần từng cái gai trên người.":pick(["Gai đang cố trông đáng sợ.","Mùi lá khô và lo lắng.","Gai run rẩy, gai cũng run theo."]),
    pats:["rain","slide"]},
  echo:{name:"Vọng",def:"echo",hp:40,dmg:3,exp:16,acts:["Kiểm tra","Hát theo","Im lặng"],
    check:"VỌNG — ST 3 · PT 2. Chỉ nói được những gì người khác nói. Chưa bao giờ nghe ai im lặng.",
    act(i,b){if(i===1)return["Cậu ngân nga một giai điệu.","Vọng hát lại... to gấp đôi. Đau tai quá."];
      if(i===2){b.f.quiet=(b.f.quiet||0)+1;if(b.f.quiet>=2){b.spare=true;return["Cậu tiếp tục im lặng.","Vọng mở miệng... nhưng không có gì để lặp lại. Nó lần đầu tiên nghe thấy chính mình.","Vọng không muốn đánh nữa."]}return["Cậu im lặng.","Vọng bối rối. \"...?\""]}},
    talk:b=>b.spare?"...ta... là... ta.":pick(["DỒN LỰC! DỒN LỰC!","HIỆP HAI! HIỆP BA!","...ra... ra... ra..."]),
    flavor:b=>pick(["Tiếng vọng va vào vách hang.","Vọng nhại lại tiếng thở của cậu.","Không khí ngân lên như dây đàn."]),
    pats:["rings","bounce"]},
  warden:{name:"Cai Ngục",def:"warden",hp:120,dmg:4,exp:60,boss:true,acts:["Kiểm tra","Trình bảo lãnh","Hỏi về Bàn Tay","Van xin"],
    check:"CAI NGỤC — ST 4 · PT 3. Giữ chìa khoá của một cánh cổng không ai được phép đi qua. Chưa từng ngủ.",
    act(i,b){if(i===1){b.f.stamps=true;return["Cậu đưa ra ba lời bảo lãnh.","Cai Ngục đọc từng cái. Tay ông ấy dừng lại lâu ở cái của Bé Bong."]}
      if(i===2){if(!b.f.stamps)return["Cậu hỏi về Bàn Tay.","\"Chưa đến lúc cậu được biết.\""];b.f.asked=(b.f.asked||0)+1;
        if(b.f.asked===1)return["Cậu hỏi về Bàn Tay.","\"Nó không ác. Nó chỉ... đang chơi. Với nó, bọn ta là những con số trên một bảng thống kê.\""];
        b.spare=true;return["Cậu hỏi tiếp.","\"Cậu không phải người ở đây. Cậu là mảnh vỡ của hai quả bóng bị ghép hỏng. Ta biết, vì ta cũng thế.\"","Cai Ngục hạ chìa khoá xuống."]}
      if(i===3)return["Cậu van xin.","\"Van xin không mở được ổ khoá nào cả.\""]},
    talk:b=>b.spare?"...Đi đi. Trước khi ta đổi ý.":b.hp<b.max*.5?pick(["Ta đã canh cổng này qua hàng trăm lần mở nắp!","Cậu nghĩ phía trên có tự do à?!"]):pick(["Không ai đi lên nữa.","Ta đã thấy những gì họ làm với bọn ta.","Quay về làng đi, mảnh vỡ."]),
    flavor:b=>b.spare?"Cai Ngục đang nhìn lên cánh cổng.":pick(["Chùm chìa khoá kêu leng keng.","Cai Ngục đứng vững như một bức tường.","Mùi sắt lạnh và nỗi buồn rất cũ."]),
    pats:["keys","bars","chains","keys2"]},
};
function battle(id){
  return new Promise(res=>{
    const F=FOES[id];ST.mode="battle";ST.prevMusic=ST.music;ST.music=F.boss?"boss":"battle";sfx.ko();
    ST.bat={id,F,hp:F.hp,max:F.hp,f:{},spare:false,state:"menu",sel:0,sub:0,txt:"* "+(F.boss?"Cai Ngục chặn đường!":F.name+" chắn đường!"),tn:0,heart:{x:0,y:0,inv:0},bullets:[],pt:0,res,turn:0,bubble:null,shake:0,intro:.6,dmgPop:null};
  });
}
function batEnd(r){const b=ST.bat;ST.mode="walk";ST.music=ST.prevMusic;ST.bat=null;b.res(r)}
function boxRect(){const w=ST.cv.width/ST.dpr,h=ST.cv.height/ST.dpr,bw=Math.min(560,w-40),bh=Math.min(170,h*.24);return{x:(w-bw)/2,y:h*.47,w:bw,h:bh}}
function batUpdate(dt){
  const b=ST.bat,s=sv(),P=ST.pressed;if(b.intro>0){b.intro-=dt;return}
  b.tn=Math.min(b.txt.length,b.tn+dt*48);
  if(b.dmgPop){b.dmgPop.t+=dt;if(b.dmgPop.t>1.1)b.dmgPop=null}
  if(b.state==="menu"){if(P.left){b.sel=(b.sel+3)%4;sfx.tick()}if(P.right){b.sel=(b.sel+1)%4;sfx.tick()}
    if(P.a){sfx.click();if(b.sel===0){b.state="fight";b.bar=0;b.barDir=1}else{b.state="sub";b.sub=0}}}
  else if(b.state==="sub"){const L=subList(b);if(P.up){b.sub=(b.sub+L.length-1)%L.length;sfx.tick()}if(P.down){b.sub=(b.sub+1)%L.length;sfx.tick()}if(P.b){b.state="menu";return}
    if(P.a&&L.length){sfx.click();doSub(b,b.sub)}}
  else if(b.state==="fight"){b.bar+=dt*1.1*b.barDir;if(b.bar>1){b.state="text";showLines(b,["Cậu vung người... trượt mất."],()=>enemyTurn(b));return}
    if(P.a){const acc=1-Math.abs(b.bar-.5)*2,dm=Math.max(1,Math.round(atk()*(.45+acc*1.1)));b.hp-=dm;b.dmgPop={v:dm,t:0};b.shake=10;sfx.hit(dm*2,acc>.9);
      if(b.hp<=0){b.hp=0;s.kills++;S.storyMem.killsEver++;const F=b.F;s.exp+=F.exp;let up=false;while(s.exp>=s.lv*25){s.exp-=s.lv*25;s.lv++;up=true}
        if(b.id==="warden"){b.state="text";showLines(b,["\"...Hah. Vậy là... cậu cũng giống chúng.\"","\"Đi đi... phía trên... không có gì tốt đẹp đâu...\"","Cai Ngục vỡ vụn thành bụi sắt.",`Cậu nhận được ${F.exp} EXP.${up?" LV của cậu tăng lên.":""}`],()=>batEnd("kill"));return}
        b.state="text";showLines(b,[`${F.name} vỡ vụn thành bụi.`,`Cậu nhận được ${F.exp} EXP.${up?" LV của cậu tăng lên.":""}`],()=>batEnd("kill"));return}
      b.state="text";showLines(b,[acc>.9?"Một cú va hoàn hảo!":"Cậu va vào "+b.F.name+"."],()=>enemyTurn(b))}}
  else if(b.state==="text"){if(P.a&&b.tn>=b.txt.length){const nx=b.lines.shift();if(nx!==undefined){b.txt="* "+nx;b.tn=0}else{const cb=b.after;b.after=null;cb&&cb()}}else if(P.a)b.tn=b.txt.length}
  else if(b.state==="bubble"){b.bt+=dt;if(b.bt>1.6||(P.a&&b.bt>.3)){b.bubble=null;startPattern(b)}}
  else if(b.state==="dodge")dodgeUpdate(b,dt);
}
function subList(b){const s=sv();if(b.sel===1)return b.F.acts;if(b.sel===2)return Object.entries(s.items).filter(([k,v])=>v>0&&(k==="candy"||k==="cake")).map(([k,v])=>ITEM_NAME[k]+" ×"+v);return b.F.boss?["Tha"]:["Tha","Bỏ chạy"]}
function doSub(b,i){
  const s=sv(),F=b.F;b.state="text";
  if(b.sel===1){if(i===0){showLines(b,[typeof F.check==="function"?F.check():F.check],()=>enemyTurn(b));return}showLines(b,F.act(i,b),()=>enemyTurn(b));return}
  if(b.sel===2){const keys=Object.entries(s.items).filter(([k,v])=>v>0&&(k==="candy"||k==="cake")).map(([k])=>k),k=keys[i];if(!k){b.state="menu";return}s.items[k]--;const amt=k==="cake"?99:10;s.hp=Math.min(maxHP(),s.hp+amt);sfx.coin();
    showLines(b,[k==="cake"?"Cậu ăn Bánh Bi. HP hồi đầy!":"Cậu nhai Kẹo Neon. Chua lè. Hồi 10 HP."],()=>enemyTurn(b));return}
  if(i===0){if(b.spare){s.spares++;sfx.reveal("rare");showLines(b,[`Cậu đã THA cho ${F.name}.`,"Cậu nhận được 0 EXP. Và một cảm giác nhẹ nhõm kỳ lạ."],()=>batEnd("spare"))}else showLines(b,[`Cậu muốn tha, nhưng ${F.name} vẫn chưa sẵn sàng.`],()=>enemyTurn(b));return}
  if(Math.random()<.6)showLines(b,["Cậu lăn đi thật nhanh..."],()=>batEnd("flee"));else showLines(b,["Cậu cố bỏ chạy nhưng bị chặn lại!"],()=>enemyTurn(b));
}
function showLines(b,lines,after){lines=lines.slice();b.txt="* "+lines.shift();b.tn=0;b.lines=lines;b.after=after}
function enemyTurn(b){b.state="bubble";b.bt=0;b.bubble=b.F.talk(b)}
function startPattern(b){
  const R=boxRect(),F=b.F;b.state="dodge";b.pt=0;b.bullets=[];b.heart.x=R.x+R.w/2;b.heart.y=R.y+R.h/2;b.turn++;
  const pats=F.pats.filter(p=>p!=="keys2"||b.hp<b.max*.5);b.pat=b.spare?"calm":pats[(b.turn-1)%pats.length];b.dur=b.spare?2:F.boss?(b.hp<b.max*.5?7:6):5;b.acc=0;
}
function hurt(b,d){const s=sv(),h=b.heart;if(h.inv>0)return;h.inv=.9;s.hp-=d;sfx.hit(18,false);ST.shake=6;
  if(s.hp<=0){s.hp=0;ST.mode="over";S.storyMem.deaths++;save();gameOver()}}
function dodgeUpdate(b,dt){
  const R=boxRect(),h=b.heart,k=ST.keys,sp=150*dt;
  h.x=clamp(h.x+((k.right?1:0)-(k.left?1:0))*sp,R.x+8,R.x+R.w-8);h.y=clamp(h.y+((k.down?1:0)-(k.up?1:0))*sp,R.y+8,R.y+R.h-8);if(h.inv>0)h.inv-=dt;
  b.pt+=dt;b.acc+=dt;const P=PATS[b.pat];if(P)P(b,R,dt);
  for(const u of b.bullets){u.t=(u.t||0)+dt;if(u.vx!==undefined){u.x+=u.vx*dt;u.y+=u.vy*dt}if(u.upd)u.upd(u,dt,R);
    if(u.harmless||u.kind==="spot"){}
    else if(u.kind==="ring"){const d=Math.hypot(h.x-u.x,h.y-u.y);if(Math.abs(d-u.r)<6){let a=Math.atan2(h.y-u.y,h.x-u.x)-u.gap;a=Math.atan2(Math.sin(a),Math.cos(a));if(Math.abs(a)>.5)hurt(b,b.F.dmg)}}
    else if(u.kind==="bar"){if(u.live&&Math.abs(h.x-u.x)<u.w/2+5&&(h.y<u.gy-u.gh/2||h.y>u.gy+u.gh/2))hurt(b,b.F.dmg)}
    else if(u.kind==="chain"){if(u.live){const dx=u.x2-u.x1,dy=u.y2-u.y1,l=dx*dx+dy*dy||1,t=clamp(((h.x-u.x1)*dx+(h.y-u.y1)*dy)/l,0,1);if(Math.hypot(h.x-(u.x1+dx*t),h.y-(u.y1+dy*t))<7)hurt(b,b.F.dmg)}}
    else if(Math.hypot(h.x-u.x,h.y-u.y)<(u.r||6)+5)hurt(b,b.F.dmg)}
  b.bullets=b.bullets.filter(u=>u.t<(u.life||6)&&u.x>R.x-80&&u.x<R.x+R.w+80&&u.y>R.y-120&&u.y<R.y+R.h+80);
  if(ST.mode!=="battle")return;
  if(b.pt>=b.dur){b.bullets=[];b.state="menu";b.txt="* "+b.F.flavor(b);b.tn=0;if(b.spare)b.txt+="  (Tên của "+b.F.name+" đang sáng màu vàng.)"}
}
const PATS={
  calm(){},
  rain(b,R,dt){if(b.acc>.16){b.acc=0;b.bullets.push({x:R.x+rand(10,R.w-10),y:R.y-10,vx:0,vy:rand(140,220),r:6,shape:"spike"})}},
  slide(b,R,dt){if(b.acc>.9){b.acc=0;const left=Math.random()<.5,gap=rand(R.y+30,R.y+R.h-30);for(let y=R.y+8;y<R.y+R.h;y+=22)if(Math.abs(y-gap)>26)b.bullets.push({x:left?R.x-10:R.x+R.w+10,y,vx:left?150:-150,vy:0,r:6,shape:"spikeH"})}},
  rings(b,R,dt){if(b.acc>1.1){b.acc=0;const cx=rand(R.x+40,R.x+R.w-40),cy=rand(R.y+30,R.y+R.h-30);b.bullets.push({kind:"ring",x:cx,y:cy,r:4,gap:rand(0,TAU),life:3,upd:(u,dt)=>{u.r+=90*dt}})}},
  bounce(b,R,dt){if(b.pt<.05&&!b.bullets.length)for(let i=0;i<5;i++){const a=rand(0,TAU);b.bullets.push({x:R.x+R.w/2+rand(-R.w*.35,R.w*.35),y:R.y+12,vx:Math.cos(a)*130,vy:Math.abs(Math.sin(a))*130+40,r:7,shape:"note",life:9,upd:(u,dt,R)=>{if(u.x<R.x+7||u.x>R.x+R.w-7)u.vx*=-1;if(u.y<R.y+7||u.y>R.y+R.h-7)u.vy*=-1;u.x=clamp(u.x,R.x+7,R.x+R.w-7);u.y=clamp(u.y,R.y+7,R.y+R.h-7)}})}},
  keys(b,R,dt){if(b.acc>.5){b.acc=0;const h=b.heart,sx=Math.random()<.5?R.x:R.x+R.w,sy=R.y-10,a=Math.atan2(h.y-sy,h.x-sx);b.bullets.push({x:sx,y:sy,vx:Math.cos(a)*190,vy:Math.sin(a)*190,r:7,shape:"key"})}},
  keys2(b,R,dt){PATS.keys(b,R,dt);if(Math.random()<dt*2)PATS.rain(b,R,1)},
  bars(b,R,dt){if(b.acc>1.0){b.acc=0;const left=b.turn%2===0,gy=rand(R.y+30,R.y+R.h-30);b.bullets.push({kind:"bar",x:left?R.x:R.x+R.w,y:R.y,w:14,gy,gh:44,vx:left?120:-120,vy:0,live:true,life:6})}},
  chains(b,R,dt){if(b.acc>.8){b.acc=0;const h=b.heart,side=Math.floor(rand(0,4)),x1=side===0?R.x:side===1?R.x+R.w:rand(R.x,R.x+R.w),y1=side===2?R.y:side===3?R.y+R.h:rand(R.y,R.y+R.h);
    const a=Math.atan2(h.y-y1,h.x-x1),L=Math.max(R.w,R.h)*1.3;b.bullets.push({kind:"chain",x:x1,y:y1,x1,y1,x2:x1+Math.cos(a)*L,y2:y1+Math.sin(a)*L,live:false,life:1.4,upd:(u)=>{u.live=u.t>.55&&u.t<1.2}})}},
};
async function gameOver(){
  const b=ST.bat;ST.over={t:0};sfx.ko();
  await wait(1600);
  const lines=S.storyMem.deaths>2?["Lại vỡ rồi.","Nhưng mảnh vỡ thì vốn đã vỡ sẵn, đúng không?","Lăn tiếp đi."]:["Đừng vỡ lúc này...","Vẫn còn người đang đợi cậu ở trên kia.","Hãy giữ lấy quyết tâm."];
  ST.mode="walk";ST.bat=null;
  for(const l of lines)await new Promise(r=>{ST.dlg={who:"voice",txt:l,n:0,res:r}});
  ST.over=null;
  const s=sv(),sd=s.ck||s.saved;
  if(sd){const mem=S.storyMem,keepSaved=s.saved;S.story=Object.assign(storyFresh(),JSON.parse(JSON.stringify(sd)));S.story.saved=keepSaved;S.story.hp=16+S.story.lv*4;S.storyMem=mem}else{S.story=storyFresh();S.story.started=true}
  save();stEnter(sv().room,sv().x,sv().y,true);if(b)b.res("dead");
}

/* ───────── VẼ ───────── */
const THEME={cloth:{f1:"#1a1430",f2:"#20183a",wall:"#2c2250",edge:"#7a5cff",g:"#2a2050"},village:{f1:"#16202a",f2:"#1a2632",wall:"#2a3446",edge:"#5CF2A8",g:"#1f3a30"},
  woods:{f1:"#122018",f2:"#16281e",wall:"#1d3326",edge:"#7DBE5A",g:"#1d3a24"},cave:{f1:"#0e0c18",f2:"#12101e",wall:"#1c1830",edge:"#9a82ff",g:"#14122a"},gate:{f1:"#16102a",f2:"#1c1434",wall:"#2a1f4a",edge:"#36E2FF",g:"#221a40"}};
function stRender(){
  const g=ST.g,d=ST.dpr,w=ST.cv.width/d,h=ST.cv.height/d;g.setTransform(d,0,0,d,0,0);g.fillStyle="#05030B";g.fillRect(0,0,w,h);
  if(ST.mode==="battle"&&ST.bat){batRender(g,w,h);drawDlg(g,w,h);return}
  if(ST.over){overRender(g,w,h);drawDlg(g,w,h);return}
  const z=Math.max(1,Math.min(w/(15*TS),h/(10.5*TS))),H0=ST.hero,mw=ST.W*TS,mh=ST.H*TS;
  let cx=clamp(H0.x-w/z/2,0,Math.max(0,mw-w/z)),cy=clamp(H0.y-h/z/2,0,Math.max(0,mh-h/z));if(mw<w/z)cx=(mw-w/z)/2;if(mh<h/z)cy=(mh-h/z)/2;
  const sk=ST.shake;g.save();g.translate(rand(-sk,sk),rand(-sk,sk));g.scale(z,z);g.translate(-cx,-cy);
  const T=THEME[RM[ST.room].theme],t=ST.t;
  for(let y=0;y<ST.H;y++)for(let x=0;x<ST.W;x++){const c=ST.map[y][x],X=x*TS,Y=y*TS;
    g.fillStyle=(x+y)%2?T.f1:T.f2;g.fillRect(X,Y,TS,TS);
    if(c===","){g.fillStyle=T.g;g.fillRect(X,Y,TS,TS);g.strokeStyle="rgba(150,255,190,.18)";g.lineWidth=1.5;for(let k=0;k<3;k++){const px=X+6+k*9+((x*7+y*3)%5),py=Y+22+((x+k)%3)*2;g.beginPath();g.moveTo(px,py);g.lineTo(px+2,py-7);g.stroke()}}
    else if(c==="#"){g.fillStyle=T.wall;g.fillRect(X,Y,TS,TS);g.fillStyle="rgba(0,0,0,.25)";g.fillRect(X,Y+TS-6,TS,6);
      if(tileAt(x,y+1)!=="#"){g.strokeStyle=T.edge;g.globalAlpha=.55;g.lineWidth=2;g.beginPath();g.moveTo(X,Y+TS-1);g.lineTo(X+TS,Y+TS-1);g.stroke();g.globalAlpha=1}}
    else if(c==="H"){g.fillStyle="#2a2438";g.fillRect(X,Y,TS,TS);g.fillStyle="#3a3150";g.fillRect(X,Y,TS,8);if(tileAt(x,y-1)!=="H"){g.fillStyle="#5a3a6a";g.fillRect(X-2,Y-4,TS+4,10)}if((x+y)%3===0){g.fillStyle="rgba(255,210,120,.55)";g.fillRect(X+10,Y+12,12,10)}}
    else if(c==="D"){g.fillStyle="#2a2438";g.fillRect(X,Y,TS,TS);g.fillStyle="#7a4a2a";g.fillRect(X+8,Y+6,16,26);g.fillStyle="#ffd23d";g.fillRect(X+19,Y+18,3,3)}
    else if(c==="T"){g.fillStyle="#0c1a12";g.beginPath();g.arc(X+16,Y+20,15,0,TAU);g.fill();g.fillStyle="#1f4a30";g.beginPath();g.arc(X+16,Y+14,14,0,TAU);g.fill();g.fillStyle="rgba(140,255,180,.15)";g.beginPath();g.arc(X+12,Y+10,6,0,TAU);g.fill()}
    else if(c==="~"){g.fillStyle="#123a5a";g.fillRect(X,Y,TS,TS);g.strokeStyle="rgba(160,230,255,.35)";g.lineWidth=1.5;g.beginPath();for(let k=0;k<=TS;k+=4)g.lineTo(X+k,Y+12+Math.sin(t*2+(X+k)*.12)*2.5);g.stroke()}
    else if(c==="r"){g.fillStyle="#3a3450";g.beginPath();g.ellipse(X+16,Y+18,13,10,0,0,TAU);g.fill();g.fillStyle="rgba(255,255,255,.12)";g.beginPath();g.ellipse(X+12,Y+14,5,3,0,0,TAU);g.fill()}
    else if(c==="x"){g.fillStyle="#1a3020";g.fillRect(X,Y,TS,TS);g.fillStyle="#7DBE5A";for(let k=0;k<5;k++){const px=X+4+k*6,py=Y+26;g.beginPath();g.moveTo(px,py);g.lineTo(px+3,py-16-((k*7+x)%6));g.lineTo(px+6,py);g.fill()}}
    else if(c==="P"){const on=PLATE_SEQ.includes(x+","+y);g.fillStyle=on?"#5CF2A8":"#4a4560";g.fillRect(X+4,Y+4,TS-8,TS-8);g.strokeStyle=on?"#B4FFD8":"#7a7590";g.lineWidth=2;g.strokeRect(X+4,Y+4,TS-8,TS-8)}
    else if(c==="f"){const p=.6+.4*Math.sin(t*2+x);g.fillStyle="#1a3a3a";g.fillRect(X+14,Y+14,3,14);g.save();g.globalCompositeOperation="lighter";g.globalAlpha=.6*p;g.drawImage(glowSprite("#5ad8ff"),X-8,Y-12,48,48);g.restore();g.fillStyle="#9ef0ff";for(let k=0;k<5;k++){const a=k*TAU/5+t*.3;g.beginPath();g.ellipse(X+16+Math.cos(a)*5,Y+12+Math.sin(a)*5,4,2.5,a,0,TAU);g.fill()}}
    else if(c==="M"){g.fillStyle="#2a2440";g.fillRect(X,Y,TS,TS);g.strokeStyle="rgba(255,226,140,.6)";g.lineWidth=1.5;g.strokeRect(X+3,Y+3,TS-6,TS-6);g.beginPath();g.arc(X+16,Y+12,5,0,TAU);g.moveTo(X+8,Y+26);g.lineTo(X+24,Y+26);g.stroke()}
    else if(c==="|"){g.fillStyle="#120e22";g.fillRect(X,Y,TS,TS);g.fillStyle="#7fe9ff";for(let k=0;k<3;k++)g.fillRect(X+5+k*10,Y,3,TS);g.save();g.globalCompositeOperation="lighter";g.globalAlpha=.25;g.drawImage(glowSprite("#36E2FF"),X-16,Y-16,64,64);g.restore()}
    else if(c==="*"){const p=1+.1*Math.sin(t*4);g.save();g.translate(X+16,Y+16);g.rotate(t*.8);g.globalCompositeOperation="lighter";g.drawImage(glowSprite("#FFE98A"),-26,-26,52,52);g.globalCompositeOperation="source-over";g.fillStyle="#FFE98A";g.beginPath();for(let k=0;k<10;k++){const a=k*Math.PI/5-Math.PI/2,r=k%2?4:10*p;g.lineTo(Math.cos(a)*r,Math.sin(a)*r)}g.closePath();g.fill();g.restore()}
    else if(TILE_DRAW[c])TILE_DRAW[c](g,X,Y,x,y,t);
  }
  const ents=ST.npcs.map(n=>({y:n.py,draw:()=>drawNpc(g,n)})).concat([{y:H0.y,draw:()=>drawHero(g)}]).sort((a,b2)=>a.y-b2.y);
  for(const e of ents)e.draw();
  for(const p of ST.parts){g.globalAlpha=1-p.t/p.life;g.fillStyle=p.c;g.beginPath();g.arc(p.x,p.y,p.r,0,TAU);g.fill()}g.globalAlpha=1;
  if(RM[ST.room].dark)darkPass(g,cx,cy,z,w,h);
  g.restore();
  if(ST.title&&ST.title.t<3){const a=Math.min(1,ST.title.t*2,(3-ST.title.t)*1.5);g.globalAlpha=a;g.font="900 26px Unbounded, 'Arial Black', sans-serif";g.textAlign="center";g.lineWidth=6;g.strokeStyle="#05030B";g.strokeText(ST.title.txt,w/2,56);g.fillStyle="#F5EFFF";g.fillText(ST.title.txt,w/2,56);g.globalAlpha=1}
  if(ST.cut)cutRender(g,w,h);
  if(ST.fade>0){g.fillStyle=`rgba(5,3,11,${ST.fade})`;g.fillRect(0,0,w,h)}
  drawDlg(g,w,h);
}
function drawHero(g){const h=ST.hero,moving=ST.keys.up||ST.keys.down||ST.keys.left||ST.keys.right,b=moving?Math.abs(Math.sin(h.walk))*3:Math.sin(ST.t*2)*1;
  g.fillStyle="rgba(0,0,0,.35)";g.beginPath();g.ellipse(h.x,h.y+11,10,4,0,0,TAU);g.fill();drawCreature(g,HERO_DEF,h.x,h.y-b,12,{gx:h.fx,gy:h.fy,t:ST.t,id:3})}
function drawNpc(g,n){
  if(n.item){const p=Math.sin(ST.t*3)*2;g.save();g.globalCompositeOperation="lighter";g.globalAlpha=.6;g.drawImage(glowSprite(n.item==="bell"?"#E8EEFF":n.item==="seed"?"#7DFFA8":"#FF8AF0"),n.px-18,n.py-18+p,36,36);g.restore();
    g.fillStyle=n.item==="bell"?"#E8EEFF":n.item==="seed"?"#7DFFA8":"#FF8AF0";g.beginPath();g.arc(n.px,n.py+p,5,0,TAU);g.fill();return}
  if(n.sign){g.fillStyle="#5a3a2a";g.fillRect(n.px-2,n.py-4,4,14);g.fillStyle="#8a5a3a";g.fillRect(n.px-12,n.py-14,24,14);g.strokeStyle="#2a1a10";g.lineWidth=1.5;g.strokeRect(n.px-12,n.py-14,24,14);return}
  const def=BY_ID[n.def],h=ST.hero,dx=h.x-n.px,dy=h.y-n.py,near=Math.hypot(dx,dy)<90;
  g.fillStyle="rgba(0,0,0,.35)";g.beginPath();g.ellipse(n.px,n.py+11,10,4,0,0,TAU);g.fill();
  drawCreature(g,def,n.px,n.py-Math.sin(ST.t*2+n.px)*1.2,n.def==="warden"?17:12,{gx:near?dx:0,gy:near?dy:1,t:ST.t,id:n.px|0});
  if(near&&!ST.busy){g.fillStyle="rgba(255,255,255,.8)";g.font="700 10px 'JetBrains Mono', monospace";g.textAlign="center";g.fillText("Z",n.px,n.py-24)}
}
function darkPass(g,cx,cy,z,w,h){
  if(!ST.dk){ST.dk=document.createElement("canvas")}const dk=ST.dk,d=ST.dpr;if(dk.width!==ST.cv.width||dk.height!==ST.cv.height){dk.width=ST.cv.width;dk.height=ST.cv.height}
  const k=dk.getContext("2d");k.setTransform(1,0,0,1,0,0);k.globalCompositeOperation="source-over";k.clearRect(0,0,dk.width,dk.height);k.fillStyle="rgba(2,1,6,.9)";k.fillRect(0,0,dk.width,dk.height);
  k.setTransform(d*z,0,0,d*z,-cx*d*z,-cy*d*z);k.globalCompositeOperation="destination-out";const sp=lightSprite();
  k.drawImage(sp,ST.hero.x-110,ST.hero.y-110,220,220);
  for(let y=0;y<ST.H;y++)for(let x=0;x<ST.W;x++){const c=ST.map[y][x];if(c==="f")k.drawImage(sp,x*TS+16-70,y*TS+16-70,140,140);if(c==="M")k.drawImage(sp,x*TS+16-60,y*TS+16-60,120,120)}
  for(const n of ST.npcs)if(n.item)k.drawImage(sp,n.px-40,n.py-40,80,80);
  g.save();g.setTransform(1,0,0,1,0,0);g.drawImage(dk,0,0);g.restore();
}
function cutRender(g,w,h){const c=ST.cut;
  if(c.black){g.fillStyle=c.end?"#000":"rgba(0,0,0,.94)";g.fillRect(0,0,w,h)}
  if(c.lid!==undefined){const a=c.lid;g.fillStyle=`rgba(255,250,220,${a*.5})`;g.fillRect(0,0,w,h*a*.4);g.save();g.globalCompositeOperation="lighter";g.globalAlpha=a;g.drawImage(glowSprite("#FFF2C0"),w/2-w*.6,-h*.5,w*1.2,h);g.restore()}
  if(c.hand!==undefined){const y=-h*.6+h*.75*Math.min(1,c.hand)+(c.grab?-h*.5*c.grab:0);g.save();g.translate(w/2,y);g.fillStyle="rgba(250,240,230,.96)";g.strokeStyle="rgba(40,20,30,.6)";g.lineWidth=4;
    g.beginPath();g.roundRect?g.roundRect(-70,-260,140,240,40):g.rect(-70,-260,140,240);g.fill();g.stroke();for(let k=0;k<4;k++){g.beginPath();g.roundRect?g.roundRect(-68+k*35,-40,30,110-(k===0||k===3?20:0),14):g.rect(-68+k*35,-40,30,100);g.fill();g.stroke()}g.beginPath();g.roundRect?g.roundRect(64,-110,30,90,14):g.rect(64,-110,30,90);g.fill();g.stroke();g.restore()}
  if(c.white){g.fillStyle=`rgba(255,255,255,${c.white})`;g.fillRect(0,0,w,h)}
}
function drawDlg(g,w,h){
  const d=ST.dlg;if(!d)return;const bw=Math.min(760,w-24),bh=d.choice?Math.min(190,h*.4):Math.min(140,h*.28),x=(w-bw)/2,y=h-bh-16;
  g.fillStyle="rgba(5,3,11,.94)";g.fillRect(x,y,bw,bh);g.strokeStyle="#F5EFFF";g.lineWidth=3;g.strokeRect(x,y,bw,bh);
  const sp=SPK[d.who];let tx=x+20;
  if(sp&&sp.def){drawCreature(g,BY_ID[sp.def],x+52,y+bh/2,30,{t:ST.t,id:7,gx:.6,gy:.1});tx=x+100}
  g.textAlign="left";g.textBaseline="top";
  if(sp){g.font="800 13px Unbounded, sans-serif";g.fillStyle=sp.def?"#FFE98A":"#C3AEFF";g.fillText(sp.name,tx,y+12)}
  g.font="700 17px 'JetBrains Mono', monospace";g.fillStyle="#F5EFFF";
  const txt=d.txt.slice(0,Math.floor(d.n)),lines=wrapText(g,txt,x+bw-20-tx);let ly=y+(sp?36:18);for(const l of lines){g.fillText(l,tx,ly);ly+=24}
  if(d.choice&&d.n>=d.txt.length){for(let i=0;i<d.choice.length;i++){const sel=i===d.sel;g.fillStyle=sel?"#FFE98A":"#B8B0D0";if(sel)drawHeart(g,tx+6,ly+12,7,"#36E2FF");g.fillText(d.choice[i],tx+22,ly+2);ly+=26}}
  else if(d.n>=d.txt.length){g.fillStyle="#F5EFFF";g.globalAlpha=.5+.5*Math.sin(ST.t*6);g.fillText("▼",x+bw-28,y+bh-28);g.globalAlpha=1}
}
function wrapText(g,txt,maxW){const out=[];for(const para of txt.split("\n")){let line="";for(const word of para.split(" ")){const t2=line?line+" "+word:word;if(g.measureText(t2).width>maxW&&line){out.push(line);line=word}else line=t2}out.push(line)}return out}
function drawHeart(g,x,y,s,c){g.fillStyle=c;g.beginPath();g.moveTo(x,y+s*.9);g.bezierCurveTo(x-s*1.4,y-s*.1,x-s*.9,y-s*1.3,x,y-s*.45);g.bezierCurveTo(x+s*.9,y-s*1.3,x+s*1.4,y-s*.1,x,y+s*.9);g.fill()}
function batRender(g,w,h){
  const b=ST.bat,s=sv(),R=boxRect(),F=b.F,t=ST.t;
  const shk=b.shake;b.shake*=.85;
  const ex=w/2+rand(-shk,shk),ey=Math.max(90,R.y-90)+Math.sin(t*2)*4,er=Math.min(64,R.y*.32);
  g.save();g.globalCompositeOperation="lighter";g.globalAlpha=.35;g.drawImage(glowSprite(BY_ID[F.def].color),ex-er*3,ey-er*3,er*6,er*6);g.restore();
  if(b.hp>0)drawCreature(g,BY_ID[F.def],ex,ey,er,{t,id:9,gx:(b.heart.x-ex)/200,gy:.4,hurt:shk>2});
  g.font="800 13px Unbounded, sans-serif";g.textAlign="center";g.fillStyle=b.spare?"#FFE98A":"#F5EFFF";g.fillText(F.name,ex,ey-er-30);
  if(b.state==="fight"||b.dmgPop){g.fillStyle="#2a2440";g.fillRect(ex-60,ey-er-22,120,8);g.fillStyle="#5CF2A8";g.fillRect(ex-60,ey-er-22,120*b.hp/b.max,8)}
  if(b.dmgPop){g.font="900 28px Unbounded, sans-serif";g.fillStyle="#FF4D7A";g.globalAlpha=1-b.dmgPop.t;g.fillText(String(b.dmgPop.v),ex,ey-er-40-b.dmgPop.t*30);g.globalAlpha=1}
  if(b.bubble){const bx=ex+er+16,by=ey-er*.6,bw2=Math.min(240,w-bx-12);g.fillStyle="#fff";g.beginPath();g.roundRect?g.roundRect(bx,by,bw2,58,10):g.rect(bx,by,bw2,58);g.fill();g.beginPath();g.moveTo(bx,by+20);g.lineTo(bx-12,by+28);g.lineTo(bx,by+34);g.fill();
    g.fillStyle="#111";g.font="700 14px 'JetBrains Mono', monospace";g.textAlign="left";g.textBaseline="top";const L=wrapText(g,b.bubble,bw2-16);L.slice(0,3).forEach((l,i)=>g.fillText(l,bx+8,by+8+i*17))}
  g.strokeStyle="#F5EFFF";g.lineWidth=4;g.fillStyle="#000";g.fillRect(R.x,R.y,R.w,R.h);g.strokeRect(R.x,R.y,R.w,R.h);
  g.save();g.beginPath();g.rect(R.x,R.y,R.w,R.h);g.clip();
  if(b.state==="dodge"){for(const u of b.bullets)drawBullet(g,u,R);const hh=b.heart;if(!(hh.inv>0&&Math.floor(t*20)%2))drawHeart(g,hh.x,hh.y,8,"#36E2FF")}
  else if(b.state==="fight"){g.strokeStyle="#5a5470";g.lineWidth=2;for(let k=0;k<=10;k++){const x=R.x+20+(R.w-40)*k/10;g.beginPath();g.moveTo(x,R.y+20);g.lineTo(x,R.y+R.h-20);g.stroke()}g.fillStyle="rgba(92,242,168,.35)";g.fillRect(R.x+R.w/2-14,R.y+16,28,R.h-32);const x=R.x+20+(R.w-40)*clamp(b.bar,0,1);g.fillStyle="#fff";g.fillRect(x-4,R.y+12,8,R.h-24)}
  else{g.textAlign="left";g.textBaseline="top";g.font="700 17px 'JetBrains Mono', monospace";g.fillStyle="#F5EFFF";const L=wrapText(g,b.txt.slice(0,Math.floor(b.tn)),R.w-36);L.forEach((l,i)=>g.fillText(l,R.x+18,R.y+16+i*24));
    if(b.state==="sub"){const L2=subList(b);g.fillStyle="#000";g.fillRect(R.x+2,R.y+2,R.w-4,R.h-4);L2.forEach((o,i)=>{const col=i%2,row=Math.floor(i/2),x=R.x+44+col*(R.w/2),y=R.y+18+row*30;g.fillStyle=i===b.sub?"#FFE98A":"#F5EFFF";if(i===b.sub)drawHeart(g,x-18,y+10,7,"#36E2FF");g.fillText((b.sel===3&&i===0&&b.spare?"✦ ":"")+o,x,y)});g.fillStyle="#8a82a8";g.font="600 12px 'JetBrains Mono', monospace";g.fillText("X: quay lại",R.x+18,R.y+R.h-22)}}
  g.restore();
  const by2=R.y+R.h+18;g.font="800 14px 'JetBrains Mono', monospace";g.textAlign="left";g.fillStyle="#F5EFFF";g.fillText(`MẢNH VỠ   LV ${s.lv}`,R.x,by2);
  const hpw=Math.min(140,R.w*.3),hx=R.x+R.w*.45;g.fillText("HP",hx-30,by2);g.fillStyle="#7a1a2a";g.fillRect(hx,by2-2,hpw,18);g.fillStyle="#FFE14D";g.fillRect(hx,by2-2,hpw*s.hp/maxHP(),18);g.fillStyle="#F5EFFF";g.fillText(`${s.hp} / ${maxHP()}`,hx+hpw+10,by2);
  const labels=["ĐÁNH","HÀNH ĐỘNG","VẬT PHẨM","THA"],bwid=(R.w-30)/4;
  for(let i=0;i<4;i++){const x=R.x+i*(bwid+10),y=by2+30,sel=i===b.sel&&(b.state==="menu"||b.state==="sub");g.strokeStyle=sel?"#FFE98A":"#FF9A3D";g.lineWidth=3;g.strokeRect(x,y,bwid,44);g.fillStyle=sel?"#FFE98A":"#FF9A3D";g.font="800 13px Unbounded, sans-serif";g.textAlign="center";g.fillText(labels[i],x+bwid/2+(sel?8:0),y+28);if(sel)drawHeart(g,x+16,y+22,7,"#36E2FF")}
}
function drawBullet(g,u,R){
  if(u.kind==="ring"){g.strokeStyle="#9ef0ff";g.lineWidth=5;g.beginPath();g.arc(u.x,u.y,u.r,u.gap+.5,u.gap-.5+TAU);g.stroke();return}
  if(u.kind==="bar"){g.fillStyle="#C9D1E2";g.fillRect(u.x-u.w/2,R.y,u.w,u.gy-u.gh/2-R.y);g.fillRect(u.x-u.w/2,u.gy+u.gh/2,u.w,R.y+R.h-(u.gy+u.gh/2));return}
  if(u.kind==="chain"){g.strokeStyle=u.live?"#E8EEFF":"rgba(255,80,110,.6)";g.lineWidth=u.live?6:2;g.setLineDash(u.live?[10,4]:[4,6]);g.beginPath();g.moveTo(u.x1,u.y1);g.lineTo(u.x2,u.y2);g.stroke();g.setLineDash([]);return}
  g.save();g.translate(u.x,u.y);g.fillStyle="#F5EFFF";
  if(u.shape==="spike"){g.fillStyle="#9AE070";g.beginPath();g.moveTo(0,9);g.lineTo(-5,-7);g.lineTo(5,-7);g.closePath();g.fill()}
  else if(u.shape==="spikeH"){g.fillStyle="#9AE070";const dir=u.vx>0?1:-1;g.beginPath();g.moveTo(9*dir,0);g.lineTo(-7*dir,-5);g.lineTo(-7*dir,5);g.closePath();g.fill()}
  else if(u.shape==="note"){g.fillStyle="#9ef0ff";g.beginPath();g.ellipse(0,2,6,4.5,-.4,0,TAU);g.fill();g.fillRect(4,-10,2,12)}
  else if(u.shape==="key"){g.rotate(Math.atan2(u.vy,u.vx));g.fillStyle="#FFD23D";g.beginPath();g.arc(-6,0,5,0,TAU);g.fill();g.fillRect(-2,-1.5,12,3);g.fillRect(6,1,2,4);g.fillRect(9,1,2,3)}
  else{g.beginPath();g.arc(0,0,u.r||6,0,TAU);g.fill()}
  g.restore();
}
function overRender(g,w,h){const o=ST.over;o.t+=1/60;g.fillStyle="#000";g.fillRect(0,0,w,h);const k=Math.min(1,o.t/.8);
  if(o.t<.8)drawHeart(g,w/2,h/2,22,"#36E2FF");else{for(let i=0;i<6;i++){const a=i*TAU/6,d=(o.t-.8)*120;g.save();g.translate(w/2+Math.cos(a)*d,h/2+Math.sin(a)*d+(o.t-.8)*(o.t-.8)*200);g.rotate(o.t*3+i);g.fillStyle="#36E2FF";g.fillRect(-4,-4,8,8);g.restore()}}
}
/* — nhạc riêng cho cốt truyện — */
TRACKS.village={bpm:84,play(s,bar,t){const P=[[60,64,67],[57,60,64],[53,57,60],[55,59,62]],ch=P[bar%4],st=60/84/4;
  if(s===0)INS.pad(t,ch,st*16,.7);if(s%2===0)INS.pluck(t,[ch[0]+12,ch[2]+12,ch[1]+12,ch[2]+12,ch[0]+24,ch[2]+12,ch[1]+12,ch[2]+12][(s/2)%8],st*2.2,.7,"triangle");if(s===0||s===8)INS.bass(t,ch[0]-12,st*6,.6,420);if(s===12&&bar%2)INS.pluck(t,ch[1]+24,st*4,.5,"sine")}};
TRACKS.cave={bpm:66,play(s,bar,t){const P=[[57,60,64],[53,57,60]],ch=P[bar%2],st=60/66/4;
  if(s===0)INS.pad(t,ch.map(n=>n-12),st*16,.8);if(s===0||s===6||s===11)INS.pluck(t,ch[(s/3|0)%3]+24,st*5,.45,"sine");if(s===0)INS.bass(t,ch[0]-24,st*12,.5,300)}};
{const mw=musWanted;musWanted=function(){if(document.getElementById("stOv")&&ST)return ST.music||"village";return mw()}}
