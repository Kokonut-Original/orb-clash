
/* ═════════════════════════════════════════════════════════════
   ADMIN PANEL
   - Đăng nhập: chỉ lưu mã băm SHA-256 của mật khẩu, không lưu mật khẩu gốc.
   - Code quà: tự chứa phần thưởng + số seri + chữ ký → nhập được offline trên mọi máy.
   ═════════════════════════════════════════════════════════════ */
function sha256(ascii){function rr(v,a){return(v>>>a)|(v<<(32-a))}const mp=Math.pow,mw=mp(2,32);let res="",words=[],bitLen=ascii.length*8,hash=[],k=[],pc=0;const isC={};
  for(let c=2;pc<64;c++){if(!isC[c]){for(let i=0;i<313;i+=c)isC[i]=c;hash[pc]=(mp(c,.5)*mw)|0;k[pc++]=(mp(c,1/3)*mw)|0}}
  ascii+="\x80";while(ascii.length%64-56)ascii+="\x00";for(let i=0;i<ascii.length;i++){const j=ascii.charCodeAt(i);if(j>>8)return"";words[i>>2]|=j<<((3-i)%4)*8}
  words[words.length]=((bitLen/mw)|0);words[words.length]=bitLen;
  for(let j=0;j<words.length;){const w=words.slice(j,j+=16),old=hash;hash=hash.slice(0,8);
    for(let i=0;i<64;i++){const w15=w[i-15],w2=w[i-2],a=hash[0],e=hash[4];
      const t1=hash[7]+(rr(e,6)^rr(e,11)^rr(e,25))+((e&hash[5])^((~e)&hash[6]))+k[i]+(w[i]=(i<16)?w[i]:(w[i-16]+(rr(w15,7)^rr(w15,18)^(w15>>>3))+w[i-7]+(rr(w2,17)^rr(w2,19)^(w2>>>10)))|0);
      const t2=(rr(a,2)^rr(a,13)^rr(a,22))+((a&hash[1])^(a&hash[2])^(hash[1]&hash[2]));hash=[(t1+t2)|0].concat(hash);hash[4]=(hash[4]+t1)|0}
    for(let i=0;i<8;i++)hash[i]=(hash[i]+old[i])|0}
  for(let i=0;i<8;i++)for(let j=3;j+1;j--){const b=(hash[i]>>(j*8))&255;res+=(b<16?"0":"")+b.toString(16)}return res}
const ADMIN_HASH="eb9924efc9b228d96e46209309089dcc0c792ef1d93e8270895a6dcfc2a43cc9";
const GIFT_KEY="orbclash.gift.v1.kokonut";
let ADMIN=false;
const DBG={god:false,hit:false,bar:true};

/* ───────── Code quà ký số ───────── */
const B32="0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const EPOCH=Date.UTC(2026,0,1);
function b32enc(bytes){let bits=0,val=0,out="";for(const b of bytes){val=(val<<8)|b;bits+=8;while(bits>=5){out+=B32[(val>>>(bits-5))&31];bits-=5}}if(bits>0)out+=B32[(val<<(5-bits))&31];return out}
function b32dec(str){let bits=0,val=0;const out=[];for(const ch of str){const i=B32.indexOf(ch);if(i<0)return null;val=((val<<5)|i)&0xFFFF;bits+=5;if(bits>=8){out.push((val>>>(bits-8))&255);bits-=8}}return out}
function giftMask(sig){const h=sha256(GIFT_KEY+"|m|"+sig.join(","));return Array.from({length:10},(_,i)=>parseInt(h.slice(i*2,i*2+2),16))}
function giftSig(p){return sha256(GIFT_KEY+"|"+p.map(b=>b.toString(16).padStart(2,"0")).join(""))}
/** reward: {coins, gems, ball(id|null), serial, expDays(0 = không hạn)} */
function makeGift(r){
  const c10=Math.min(65535,Math.round((r.coins||0)/10)),g=Math.min(65535,r.gems||0),bi=r.ball?BALLS.findIndex(b=>b.id===r.ball)+1:0,s=r.serial,e=r.expDays||0;
  const p=[c10>>8,c10&255,g>>8,g&255,bi&255,(s>>16)&255,(s>>8)&255,s&255,e>>8,e&255];
  const h=giftSig(p);const sig=[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];
  const mk=giftMask(sig),s32=b32enc([...p.map((v,i)=>v^mk[i]),...sig]);return"OC-"+s32.slice(0,7)+"-"+s32.slice(7,14)+"-"+s32.slice(14,21);
}
function readGift(raw){
  let s=String(raw||"").toUpperCase().replace(/[\s-]/g,"").replace(/O/g,"0").replace(/[IL]/g,"1");
  if(!s.startsWith("0C"))return null;s=s.slice(2);if(s.length!==21)return null;
  const b=b32dec(s);if(!b||b.length<13)return null;const sig=b.slice(10,13),mk=giftMask(sig),p=b.slice(0,10).map((v,i)=>v^mk[i]);
  const h=giftSig(p);if(sig[0]!==parseInt(h.slice(0,2),16)||sig[1]!==parseInt(h.slice(2,4),16)||sig[2]!==parseInt(h.slice(4,6),16))return{bad:true};
  const bi=p[4];return{coins:((p[0]<<8)|p[1])*10,gems:(p[2]<<8)|p[3],ball:bi?BALLS[bi-1]&&BALLS[bi-1].id:null,serial:(p[5]<<16)|(p[6]<<8)|p[7],expDays:(p[8]<<8)|p[9]};
}
/* ───────── Mã màn tuỳ chỉnh ───────── */
function levelCode(L){const j=JSON.stringify(L),b=btoa(unescape(encodeURIComponent(j))).replace(/=+$/,"");return"OCL-"+b+"."+sha256(GIFT_KEY+"|L|"+j).slice(0,10)}
function readLevel(raw){const s=String(raw||"").trim();if(!s.startsWith("OCL-"))return null;const [b,sig]=s.slice(4).split(".");try{const j=decodeURIComponent(escape(atob(b)));if(sha256(GIFT_KEY+"|L|"+j).slice(0,10)!==sig)return{bad:true};return JSON.parse(j)}catch(e){return{bad:true}}}
/** Gọi từ ô nhập code: xử lý code quà ký số và mã màn. Trả true nếu đã xử lý. */
function tryRedeemSpecial(raw,msg){
  const L=readLevel(raw);
  if(L){if(L.bad){msg.className="msg err";msg.textContent="Mã màn bị hỏng hoặc bị sửa.";return true}
    S.levels=S.levels||[];if(S.levels.some(x=>x.id===L.id)){msg.className="msg err";msg.textContent="Bạn đã có màn này rồi.";return true}
    S.levels.push(L);save();sfx.coin();msg.className="msg ok";msg.textContent=`Đã thêm màn "${L.name}". Xem ở tab Đấu, mục Màn tuỳ chỉnh.`;return true}
  const g=readGift(raw);if(!g)return false;
  if(g.bad){msg.className="msg err";msg.textContent="Mã sai chữ ký. Kiểm tra lại từng ký tự.";return true}
  const key="#"+g.serial;
  if(S.codes.includes(key)){msg.className="msg err";msg.textContent=`Mã #${String(g.serial).padStart(6,"0")} đã được dùng trên máy này.`;return true}
  if(g.expDays&&Date.now()>EPOCH+g.expDays*864e5){msg.className="msg err";msg.textContent="Mã đã hết hạn.";return true}
  S.codes.push(key);S.coins+=g.coins;S.gems+=g.gems;let bl="";if(g.ball){grantBall(g.ball);bl=` và bóng ${BY_ID[g.ball].name}`}
  save();updateWallet();sfx.coin();flashbang("#FFC23D");const r=$("#codeInput").getBoundingClientRect();confettiBurst(r.left+r.width/2,r.top,120,["#FFC23D","#36E2FF","#FF4D7A"]);
  renderTab();const m2=$("#codeMsg");m2.className="msg ok";m2.textContent=`Mã quà #${String(g.serial).padStart(6,"0")}: nhận ${[g.coins?fmt(g.coins)+" xu":"",g.gems?g.gems+" Gems":""].filter(Boolean).join(", ")}${bl}.`;return true;
}

/* ───────── Tỉ lệ game (lưu trên máy này) ───────── */
const TUNE_DEF=JSON.parse(JSON.stringify({crates:Object.fromEntries(Object.entries(CRATES).map(([k,c])=>[k,{rates:c.rates,pn:c.pity.n,cost:c.cost}])),merge:MERGE,box:{every:10,trap:15,life:15},rew:{coin:1,gem:1}}));
let TUNEX={coin:1,gem:1};
function applyTune(){
  const t=Object.assign(JSON.parse(JSON.stringify(TUNE_DEF)),S.tune||{});
  for(const [k,c] of Object.entries(t.crates)){if(!CRATES[k])continue;CRATES[k].rates=Object.assign({},c.rates);CRATES[k].pity.n=c.pn;CRATES[k].cost=c.cost}
  for(const [r,m] of Object.entries(t.merge))if(MERGE[r])Object.assign(MERGE[r],m);
  BOX_EVERY=t.box.every;BOX_TRAP=t.box.trap/100;BOX_LIFE=t.box.life;TUNEX=t.rew;
}
applyTune();

/* ───────── Đăng nhập (tab Code) ───────── */
function adminLoginHTML(){
  return ADMIN?`<div class="panel admin-box rv"><span class="idx"><b>(ADMIN)</b> — Đã đăng nhập</span><h2>Quản trị viên</h2><div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-play mag" id="admOpen">MỞ ADMIN PANEL ⟶</button><button class="btn btn-ghost mag" id="admOut">Đăng xuất</button></div></div>`
  :`<div class="panel admin-box rv"><span class="idx"><b>(ADMIN)</b> — Chỉ dành cho người quản lý game</span><h2>Đăng nhập admin</h2>
    <form class="code-box" id="admForm"><input id="admPw" type="password" autocomplete="current-password" placeholder="Mật khẩu" aria-label="Mật khẩu admin"><button class="btn btn-main mag" type="submit">Vào</button></form><p class="msg" id="admMsg"></p></div>`;
}
function bindAdminLogin(){
  const f=$("#admForm");if(f)f.onsubmit=e=>{e.preventDefault();const pw=$("#admPw").value;if(sha256("orbclash|admin|"+pw)===ADMIN_HASH){ADMIN=true;sfx.reveal("legendary");flashbang("#FFC23D");renderTab();openAdmin()}else{const m=$("#admMsg");m.className="msg err";m.textContent="Sai mật khẩu.";sfx.ko()}};
  const o=$("#admOpen");if(o)o.onclick=()=>openAdmin();
  const q=$("#admOut");if(q)q.onclick=()=>{ADMIN=false;renderTab();toast("Đã đăng xuất admin.")};
}

/* ───────── PANEL ───────── */
const ADM_TABS=[["gift","Code quà","🎁"],["res","Xu & Gems","◈"],["balls","Bóng","⬤"],["prog","Tiến trình","⇧"],["sand","Sân tập","⚔"],["level","Tạo màn","✎"],["tune","Tỉ lệ game","%"],["debug","Debug","⚙"],["cup","Trao cúp","🏆"]];
let admTab="gift";
function openAdmin(){
  if(!ADMIN)return;
  $("#layer").innerHTML=`<div class="overlay adm-ov" id="admOv"><div class="adm">
    <aside class="adm-nav"><div class="adm-brand">ORB<em>ADMIN</em></div>${ADM_TABS.map(([k,n,i])=>`<button data-at="${k}" aria-pressed="${admTab===k}"><span>${i}</span>${n}</button>`).join("")}<button class="adm-x" id="admClose">✕ Đóng</button></aside>
    <section class="adm-body" id="admBody"></section></div></div>`;
  $$("[data-at]").forEach(b=>b.onclick=()=>{admTab=b.dataset.at;$$("[data-at]").forEach(x=>x.setAttribute("aria-pressed",x===b));renderAdm();sfx.click()});
  $("#admClose").onclick=()=>{closeLayer();renderTab()};renderAdm();
}
const ballOpts=(sel,rar)=>BALLS.filter(b=>!rar||b.rar===rar).map(b=>`<option value="${b.id}" ${b.id===sel?"selected":""}>${b.name} · ${RAR_VN[b.rar]}</option>`).join("");
const arenaOpts=sel=>ARENAS.map(a=>`<option value="${a.id}" ${a.id===sel?"selected":""}>${a.name}</option>`).join("");
const bossOpts=sel=>BOSSES.map(b=>`<option value="${b.id}" ${b.id===sel?"selected":""}>${b.name} · tầng ${b.floor}</option>`).join("");
function admMsg(t,ok=true){const m=$("#admBody .msg.live");if(m){m.className="msg live "+(ok?"ok":"err");m.textContent=t}else toast(t)}
function renderAdm(){
  const B=$("#admBody");S.admin=S.admin||{serial:1,batches:[]};
  const head=(t,s)=>`<div class="adm-h"><span class="idx">${s}</span><h2>${t}</h2></div>`;
  if(admTab==="gift"){
    const bs=S.admin.batches.slice().reverse();
    B.innerHTML=head("CODE <em>QUÀ</em>","Code tự chứa phần thưởng và chữ ký · nhập được offline trên mọi máy · mỗi mã dùng 1 lần trên 1 máy")+`
    <div class="adm-grid">
      <label>Xu<input type="number" id="gCoins" min="0" max="655350" step="10" value="1000"></label>
      <label>Gems<input type="number" id="gGems" min="0" max="65535" value="50"></label>
      <label>Tặng bóng<select id="gBall"><option value="">— Không —</option>${ballOpts("")}</select></label>
      <label>Hết hạn<input type="date" id="gExp"></label>
      <label>Số lượng<input type="number" id="gN" min="1" max="1000" value="100"></label>
      <label>Ghi chú lô<input type="text" id="gNote" maxlength="40" placeholder="VD: Give away tháng 10"></label>
    </div>
    <div class="adm-row"><button class="btn btn-play mag" id="gMake">TẠO CODE</button><span class="idx">Seri tiếp theo: #${String(S.admin.serial).padStart(6,"0")}</span></div>
    <p class="msg live"></p>
    <textarea id="gOut" rows="8" readonly placeholder="Danh sách code sẽ hiện ở đây"></textarea>
    <div class="adm-row"><button class="btn btn-main mag" id="gCopy">Sao chép tất cả</button><button class="btn btn-ghost mag" id="gDl">Tải file .txt</button><span class="idx">Tải file chỉ chạy ở bản offline, trên claude.ai hãy dùng Sao chép</span></div>
    <h3 class="adm-sub">Các lô đã tạo</h3>
    <div class="adm-table stack"><table><thead><tr><th>Ngày</th><th>Seri</th><th>Phần thưởng</th><th>Ghi chú</th><th></th></tr></thead><tbody>${bs.map((b,i)=>`<tr><td>${new Date(b.at).toLocaleDateString("vi-VN")}</td><td>#${String(b.from).padStart(6,"0")}–#${String(b.to).padStart(6,"0")}</td><td>${[b.coins?fmt(b.coins)+" xu":"",b.gems?b.gems+" Gems":"",b.ball?BY_ID[b.ball].name:""].filter(Boolean).join(" + ")}</td><td>${esc(b.note||"")}</td><td><button class="chip" data-reb="${bs.length-1-i}">Xuất lại</button></td></tr>`).join("")||`<tr><td colspan="5" class="idx">Chưa có lô nào</td></tr>`}</tbody></table></div>`;
    const gen=(b)=>{const exp=b.exp?Math.max(1,Math.ceil((Date.parse(b.exp)+864e5-EPOCH)/864e5)):0;const out=[];for(let s=b.from;s<=b.to;s++)out.push(makeGift({coins:b.coins,gems:b.gems,ball:b.ball,serial:s,expDays:exp}));return out};
    const show=(b,list)=>{$("#gOut").value=`# Orb Clash · ${list.length} code · ${[b.coins?fmt(b.coins)+" xu":"",b.gems?b.gems+" Gems":"",b.ball?BY_ID[b.ball].name:""].filter(Boolean).join(" + ")}${b.exp?" · hạn "+b.exp:""}${b.note?" · "+b.note:""}\n`+list.map((c,i)=>`#${String(b.from+i).padStart(6,"0")}  ${c}`).join("\n");admMsg(`Đã tạo ${list.length} code. Gửi từng dòng cho từng người.`)};
    $("#gMake").onclick=()=>{const n=clamp(+$("#gN").value|0,1,1000),coins=clamp(+$("#gCoins").value|0,0,655350),gems=clamp(+$("#gGems").value|0,0,65535),ball=$("#gBall").value||null;
      if(!coins&&!gems&&!ball){admMsg("Hãy chọn ít nhất một phần thưởng.",false);return}
      const b={at:Date.now(),from:S.admin.serial,to:S.admin.serial+n-1,coins,gems,ball,exp:$("#gExp").value||"",note:$("#gNote").value.trim()};S.admin.serial+=n;S.admin.batches.push(b);save();
      const list=gen(b);renderAdm();show(b,list);sfx.coin()};
    $$("[data-reb]").forEach(x=>x.onclick=()=>{const b=S.admin.batches[+x.dataset.reb];show(b,gen(b))});
    $("#gCopy").onclick=async()=>{const t=$("#gOut").value;if(!t){admMsg("Chưa có code để sao chép.",false);return}try{await navigator.clipboard.writeText(t);admMsg("Đã sao chép danh sách code.")}catch(e){$("#gOut").select();admMsg("Đã bôi đen, hãy bấm Ctrl+C.")}};
    $("#gDl").onclick=()=>{const t=$("#gOut").value;if(!t){admMsg("Chưa có code để tải.",false);return}const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([t],{type:"text/plain"}));a.download="orbclash-codes.txt";document.body.appendChild(a);a.click();a.remove()};
  }
  else if(admTab==="res"){
    B.innerHTML=head("XU & <em>GEMS</em>","Chỉnh trực tiếp trên máy đang chơi")+`
    <div class="adm-grid"><label>Xu<input type="number" id="rC" min="0" value="${S.coins}"></label><label>Gems<input type="number" id="rG" min="0" value="${S.gems}"></label></div>
    <div class="adm-row"><button class="btn btn-main mag" id="rSet">Đặt số này</button>${[[1000,0],[10000,0],[0,100],[0,1000]].map(([c,g])=>`<button class="chip" data-add="${c},${g}">+${c?fmt(c)+" xu":g+" Gems"}</button>`).join("")}<button class="chip" data-add="max">Tối đa</button></div><p class="msg live"></p>`;
    $("#rSet").onclick=()=>{S.coins=Math.max(0,+$("#rC").value|0);S.gems=Math.max(0,+$("#rG").value|0);save();updateWallet();admMsg("Đã cập nhật.")};
    $$("[data-add]").forEach(b=>b.onclick=()=>{if(b.dataset.add==="max"){S.coins=9999999;S.gems=999999}else{const [c,g]=b.dataset.add.split(",").map(Number);S.coins+=c;S.gems+=g}save();updateWallet();renderAdm();admMsg("Đã cộng.")});
  }
  else if(admTab==="balls"){
    B.innerHTML=head("CHỈNH <em>BÓNG</em>","Cấp 0 = chưa có · thay đổi lưu ngay")+`
    <div class="adm-row"><button class="chip" id="bAll1">Mở hết (Lv1 ×1)</button><button class="chip" id="bMax">Tối đa hết (Lv10 ×10)</button><button class="chip" id="bStart">Về bộ khởi đầu</button></div><p class="msg live"></p>
    <div class="adm-balls">${RARS.map(r=>`<div class="ab-g"><span class="idx"><i style="background:var(--r-${r})"></i>${RAR_VN[r]}</span>${BALLS.filter(b=>b.rar===r).map(b=>`<div class="ab-r">${orbHTML(b)}<b>${b.name}</b><label>Lv<input type="number" min="0" max="${MAX_LV}" value="${S.owned[b.id]||0}" data-lv="${b.id}"></label><label>×<input type="number" min="0" max="999" value="${copiesOf(b.id)}" data-cp="${b.id}"></label></div>`).join("")}</div>`).join("")}</div>`;
    $$("[data-lv]").forEach(i=>i.onchange=()=>{const id=i.dataset.lv,v=clamp(+i.value|0,0,MAX_LV);if(!v){delete S.owned[id];delete S.copies[id]}else{S.owned[id]=v;if(!(S.copies[id]>0))S.copies[id]=1}save();renderAdm()});
    $$("[data-cp]").forEach(i=>i.onchange=()=>{const id=i.dataset.cp,v=clamp(+i.value|0,0,999);if(!v){delete S.owned[id];delete S.copies[id]}else{S.copies[id]=v;if(!S.owned[id])S.owned[id]=1}save();renderAdm()});
    $("#bAll1").onclick=()=>{for(const b of BALLS)if(!S.owned[b.id]){S.owned[b.id]=1;S.copies[b.id]=1}save();renderAdm();admMsg("Đã mở cả 66 quả.")};
    $("#bMax").onclick=()=>{for(const b of BALLS){S.owned[b.id]=MAX_LV;S.copies[b.id]=10}save();renderAdm();admMsg("Đã đưa mọi quả lên Lv10 ×10.")};
    $("#bStart").onclick=()=>{const f=fresh();S.owned=f.owned;S.copies=f.copies;save();renderAdm();admMsg("Đã về 5 quả khởi đầu.")};
  }
  else if(admTab==="prog"){
    const run=S.tower.run;
    B.innerHTML=head("TIẾN <em>TRÌNH</em>","Leo tháp · Vô tận · thống kê")+`
    <div class="adm-grid">
      <label>Tầng đang leo<input type="number" id="pF" min="1" max="${TOWER_N}" value="${run?run.floor:S.tower.ckpt||1}"></label>
      <label>Tim<input type="number" id="pH" min="1" max="3" value="${run?run.hearts:3}"></label>
      <label>Checkpoint<input type="number" id="pC" min="1" max="${TOWER_N}" value="${S.tower.ckpt||1}"></label>
      <label>Kỷ lục tháp<input type="number" id="pB" min="0" max="${TOWER_N}" value="${S.tower.best}"></label>
      <label>Kỷ lục Vô tận<input type="number" id="pE" min="0" value="${S.endless.best}"></label>
      <label>Thắng / Thua<span class="two-in"><input type="number" id="pW" min="0" value="${S.w}"><input type="number" id="pL" min="0" value="${S.l}"></span></label>
    </div>
    <div class="adm-checks"><span class="idx">Boss đã hạ (nhận quà lần đầu)</span>${BOSSES.map(b=>`<label class="ck"><input type="checkbox" data-boss="${b.id}" ${S.tower.boss.includes(b.id)?"checked":""}>${b.name}</label>`).join("")}</div>
    <div class="adm-row"><button class="btn btn-main mag" id="pSave">Lưu tiến trình</button><button class="chip" id="pPity">Reset bảo đảm rương</button><button class="chip" id="pCodes">Xoá lịch sử code đã dùng</button><button class="chip" id="pLv">Xoá màn tuỳ chỉnh</button></div><p class="msg live"></p>`;
    $("#pSave").onclick=()=>{const f=clamp(+$("#pF").value|0,1,TOWER_N);S.tower.run={floor:f,hearts:clamp(+$("#pH").value|0,1,3)};S.tower.ckpt=clamp(+$("#pC").value|0,1,TOWER_N);S.tower.best=clamp(+$("#pB").value|0,0,TOWER_N);S.endless.best=Math.max(0,+$("#pE").value|0);S.w=Math.max(0,+$("#pW").value|0);S.l=Math.max(0,+$("#pL").value|0);
      S.tower.boss=$$("[data-boss]").filter(x=>x.checked).map(x=>x.dataset.boss);save();admMsg("Đã lưu tiến trình.")};
    $("#pPity").onclick=()=>{S.pity={basic:0,premium:0,star:0};save();admMsg("Đã reset bảo đảm.")};
    $("#pCodes").onclick=()=>{S.codes=[];save();admMsg("Đã xoá lịch sử code trên máy này.")};
    $("#pLv").onclick=()=>{S.levels=[];S.levelsDone=[];save();admMsg("Đã xoá màn tuỳ chỉnh.")};
  }
  else if(admTab==="sand"||admTab==="level"){
    const isL=admTab==="level",L=isL?(admEdit||defaultLevel()):(S.admin.sand||defaultLevel());
    B.innerHTML=head(isL?"TẠO <em>MÀN</em>":"SÂN <em>TẬP</em>",isL?"Thiết kế màn, lưu lại, xuất mã gửi bạn bè":"Chọn bất kỳ bóng, boss, sàn · không tính thưởng")+`
    <div class="adm-grid">
      ${isL?`<label class="w2">Tên màn<input type="text" id="lName" maxlength="40" value="${esc(L.name)}"></label><label class="w2">Mô tả<input type="text" id="lDesc" maxlength="90" value="${esc(L.desc||"")}"></label>`:`<label>Bóng của bạn<select id="lP">${ballOpts(L.pid||"pebble")}</select></label><label>Cấp bạn<input type="number" id="lPl" min="1" max="10" value="${L.plv||1}"></label>`}
      <label>Kiểu trận<select id="lType">${[["duel","Đấu tay đôi"],["boss","Boss"],["horde","Bầy lính cát"],["swarm","Bầy chuột nổ"],["elite","Song đấu"],["giant","Khổng lồ"],["mirror","Bóng gương"]].map(([v,n])=>`<option value="${v}" ${L.type===v?"selected":""}>${n}</option>`).join("")}</select></label>
      <label id="lEw">Đối thủ<select id="lE">${L.type==="boss"?bossOpts(L.enemy):ballOpts(L.enemy)}</select></label>
      <label>Cấp đối thủ<input type="number" id="lLv" min="1" max="10" value="${L.lv}"></label>
      <label>Số lính<input type="number" id="lN" min="2" max="24" value="${L.count}"></label>
      <label>Hệ số máu địch<input type="number" id="lHp" min=".2" max="10" step=".1" value="${L.hpMul}"></label>
      <label>Sàn đấu<select id="lA">${arenaOpts(L.arena)}</select></label>
      <label>Sàn co sau (giây)<input type="number" id="lOt" min="15" max="300" value="${L.ot}"></label>
      <label class="ck"><input type="checkbox" id="lBox" ${L.boxes?"checked":""}>Hộp bí ẩn</label>
      ${isL?`<label>Thưởng xu<input type="number" id="lRc" min="0" max="100000" value="${L.reward.coins}"></label><label>Thưởng Gems<input type="number" id="lRg" min="0" max="10000" value="${L.reward.gems}"></label>`:""}
    </div>
    <div class="adm-row">${isL?`<button class="btn btn-main mag" id="lSave">${admEdit&&S.levels.some(x=>x.id===admEdit.id)?"Lưu thay đổi":"Lưu màn"}</button><button class="btn btn-ghost mag" id="lTry">Chơi thử</button><button class="chip" id="lNew">Màn mới</button>`:`<button class="btn btn-play mag" id="lTry">VÀO SÂN ⟶</button>`}</div><p class="msg live"></p>
    ${isL?`<h3 class="adm-sub">Màn đã lưu (${(S.levels||[]).length})</h3><div class="adm-table stack"><table><tbody>${(S.levels||[]).map((x,i)=>`<tr><td><b>${esc(x.name)}</b><br><span class="idx">${ENC[x.type]?ENC[x.type].name:x.type} · ${ARENA_BY[x.arena].name}</span></td><td>${fmt(x.reward.coins)} xu · ${x.reward.gems} Gems</td><td class="nw"><button class="chip" data-le="${i}">Sửa</button><button class="chip" data-lx="${i}">Xuất mã</button><button class="chip" data-ld="${i}">Xoá</button></td></tr>`).join("")||`<tr><td class="idx">Chưa có màn nào</td></tr>`}</tbody></table></div><textarea id="lOut" rows="3" readonly placeholder="Mã màn (OCL-…) hiện ở đây. Bạn bè dán vào ô nhập code để nhận màn."></textarea>`:""}`;
    $("#lType").onchange=()=>{const t=$("#lType").value;$("#lE").innerHTML=t==="boss"?bossOpts():ballOpts()};
    const read=()=>{const t=$("#lType").value;const o={id:(isL&&admEdit&&admEdit.id)||("L"+Date.now().toString(36)),type:t,enemy:$("#lE").value,lv:clamp(+$("#lLv").value||1,1,10),count:clamp(+$("#lN").value||8,2,24),hpMul:clamp(+$("#lHp").value||1,.2,10),arena:$("#lA").value,ot:clamp(+$("#lOt").value||45,15,300),boxes:$("#lBox").checked};
      if(isL){o.name=$("#lName").value.trim()||"Màn không tên";o.desc=$("#lDesc").value.trim();o.reward={coins:clamp(+$("#lRc").value|0,0,100000),gems:clamp(+$("#lRg").value|0,0,10000)}}else{o.pid=$("#lP").value;o.plv=clamp(+$("#lPl").value||1,1,10)}return o};
    if(isL){
      $("#lSave").onclick=()=>{const o=read();S.levels=S.levels||[];const i=S.levels.findIndex(x=>x.id===o.id);if(i>=0)S.levels[i]=o;else S.levels.push(o);admEdit=o;save();renderAdm();admMsg(`Đã lưu "${o.name}". Màn hiện ở tab Đấu.`)};
      $("#lNew").onclick=()=>{admEdit=null;renderAdm()};
      $("#lTry").onclick=()=>{const o=read();closeLayer();playLevel(o,true)};
      $$("[data-le]").forEach(b=>b.onclick=()=>{admEdit=JSON.parse(JSON.stringify(S.levels[+b.dataset.le]));renderAdm()});
      $$("[data-lx]").forEach(b=>b.onclick=async()=>{const c=levelCode(S.levels[+b.dataset.lx]);$("#lOut").value=c;try{await navigator.clipboard.writeText(c);admMsg("Đã sao chép mã màn.")}catch(e){$("#lOut").select();admMsg("Mã màn đã hiện bên dưới.")}});
      $$("[data-ld]").forEach(b=>b.onclick=()=>{S.levels.splice(+b.dataset.ld,1);save();renderAdm()});
    }else $("#lTry").onclick=()=>{const o=read();S.admin.sand=o;save();closeLayer();playSandbox(o)};
  }
  else if(admTab==="tune"){
    const T=Object.assign(JSON.parse(JSON.stringify(TUNE_DEF)),S.tune||{});
    B.innerHTML=head("TỈ LỆ <em>GAME</em>","Chỉ áp dụng trên máy này · tỉ lệ rương là trọng số, không cần cộng đủ 100")+`
    <h3 class="adm-sub">Rương</h3><div class="adm-table"><table><thead><tr><th></th>${RARS.map(r=>`<th>${RAR_VN[r]}</th>`).join("")}<th>Bảo đảm sau</th><th>Giá</th></tr></thead><tbody>${Object.entries(T.crates).map(([k,c])=>`<tr><td><b>${CRATES[k].name}</b></td>${RARS.map(r=>`<td><input type="number" step=".1" min="0" data-cr="${k}|${r}" value="${c.rates[r]||0}"></td>`).join("")}<td><input type="number" min="1" data-cp="${k}|pn" value="${c.pn}"></td><td><input type="number" min="0" data-cp="${k}|cost" value="${c.cost}"></td></tr>`).join("")}</tbody></table></div>
    <h3 class="adm-sub">Hợp thể</h3><div class="adm-table"><table><thead><tr><th></th><th>Thành công %</th><th>Mất 1 %</th><th>Vỡ % (tự tính)</th><th>Phí Gems</th></tr></thead><tbody>${Object.entries(T.merge).map(([r,m])=>`<tr><td><b>${RAR_VN[r]}</b></td><td><input type="number" min="0" max="100" data-mg2="${r}|ok" value="${m.ok}"></td><td><input type="number" min="0" max="100" data-mg2="${r}|fail" value="${m.fail}"></td><td class="num">${Math.max(0,100-m.ok-m.fail)}</td><td><input type="number" min="0" data-mg2="${r}|cost" value="${m.cost}"></td></tr>`).join("")}</tbody></table></div>
    <h3 class="adm-sub">Hộp bí ẩn & thưởng</h3><div class="adm-grid">
      <label>Rơi mỗi (giây)<input type="number" id="tBe" min="2" max="60" value="${T.box.every}"></label><label>Tỉ lệ hộp bẫy %<input type="number" id="tBt" min="0" max="100" value="${T.box.trap}"></label><label>Hộp tồn tại (giây)<input type="number" id="tBl" min="3" max="60" value="${T.box.life}"></label>
      <label>Hệ số thưởng xu<input type="number" id="tRc" min="0" max="20" step=".1" value="${T.rew.coin}"></label><label>Hệ số thưởng Gems<input type="number" id="tRg" min="0" max="20" step=".1" value="${T.rew.gem}"></label></div>
    <div class="adm-row"><button class="btn btn-main mag" id="tSave">Áp dụng</button><button class="btn btn-ghost mag" id="tReset">Khôi phục mặc định</button></div><p class="msg live"></p>`;
    $("#tSave").onclick=()=>{const t=JSON.parse(JSON.stringify(TUNE_DEF));
      $$("[data-cr]").forEach(i=>{const [k,r]=i.dataset.cr.split("|");const v=Math.max(0,+i.value||0);if(v)t.crates[k].rates[r]=v;else delete t.crates[k].rates[r]});
      $$("[data-cp]").forEach(i=>{const [k,f]=i.dataset.cp.split("|");if(t.crates[k])t.crates[k][f]=Math.max(f==="pn"?1:0,+i.value|0)});
      $$("[data-mg2]").forEach(i=>{const [r,f]=i.dataset.mg2.split("|");t.merge[r][f]=clamp(+i.value|0,0,f==="cost"?99999:100)});
      for(const m of Object.values(t.merge)){if(m.ok+m.fail>100)m.fail=100-m.ok;m.brk=100-m.ok-m.fail}
      t.box={every:clamp(+$("#tBe").value||10,2,60),trap:clamp(+$("#tBt").value||0,0,100),life:clamp(+$("#tBl").value||15,3,60)};t.rew={coin:clamp(+$("#tRc").value||0,0,20),gem:clamp(+$("#tRg").value||0,0,20)};
      for(const [k,c] of Object.entries(t.crates))if(!Object.keys(c.rates).length)c.rates={common:1};
      S.tune=t;save();applyTune();renderAdm();admMsg("Đã áp dụng tỉ lệ mới.")};
    $("#tReset").onclick=()=>{S.tune=null;save();applyTune();renderAdm();admMsg("Đã về mặc định.")};
  }
  else if(admTab==="debug"){
    const tg=(k,n,d)=>`<button class="tog" data-dbg="${k}" aria-pressed="${DBG[k]}"><span><b>${n}</b><small>${d}</small></span><i></i></button>`;
    B.innerHTML=head("DE<em>BUG</em>","Các nút nhanh hiện ở góc trên sàn đấu khi đang đăng nhập admin")+`
    <div class="grp">${tg("bar","Thanh debug trong trận","Hạ đối thủ, tự hạ, thả hộp, tua ×5 ngay trên sàn")}${tg("god","Bất tử","Bóng của bạn không mất máu")}${tg("hit","Hiện hitbox","Vẽ vòng va chạm và tâm của mọi vật thể")}</div>
    <h3 class="adm-sub">Thả hộp theo ý (trong trận)</h3><div class="adm-row">${[...POWERS,...TRAPS].map(p=>`<button class="chip" data-dp="${p.id}">${p.icon} ${p.name}</button>`).join("")}</div><p class="msg live"></p>`;
    $$("[data-dbg]").forEach(b=>b.onclick=()=>{const k=b.dataset.dbg;DBG[k]=!DBG[k];b.setAttribute("aria-pressed",DBG[k]);renderDbgBar();sfx.click()});
    $$("[data-dp]").forEach(b=>b.onclick=()=>{if(!G||$("#match").hidden){admMsg("Hãy vào một trận trước, rồi mở panel bằng nút ⚑ trên sàn.",false);return}dbgDrop(b.dataset.dp);admMsg("Đã thả hộp.")});
  }
  else if(admTab==="cup"){
    const pk=()=>pick(BALLS).id;
    B.innerHTML=head("TRAO <em>CÚP</em>","Xem trước màn trao giải dùng cho tournament")+`
    <div class="adm-grid">${[1,2,3].map(i=>`<label>Hạng ${i} · tên<input type="text" id="cN${i}" maxlength="16" value="${["Long","Minh","Huy"][i-1]}"></label><label>Hạng ${i} · bóng<select id="cB${i}">${ballOpts(pk())}</select></label>`).join("")}</div>
    <div class="adm-row"><button class="btn btn-play mag" id="cGo">BẮT ĐẦU TRAO CÚP 🏆</button></div>`;
    $("#cGo").onclick=()=>{const list=[1,2,3].map(i=>({name:$("#cN"+i).value.trim()||"Người chơi "+i,def:BY_ID[$("#cB"+i).value]}));closeLayer();playCeremony(list,()=>openAdmin())};
  }
  bindFx(B);
}
let admEdit=null;
function defaultLevel(){return{type:"duel",enemy:"nova",lv:3,count:10,hpMul:1,arena:"neon",ot:45,boxes:true,name:"Màn mới",desc:"",reward:{coins:300,gems:10}}}

/* ───────── chạy màn / sân tập ───────── */
function levelCfg(L,pDef,pLv){
  const cfg={pDef,pLv,arena:L.arena,ot:L.ot,label:(L.name||"SÂN TẬP").toUpperCase().slice(0,18)};let eDef=BY_ID[L.enemy]||pick(BALLS);let setup=null;
  if(L.type==="boss"){eDef=BOSS_BY[L.enemy]||BOSSES[0];setup=setupBoss(eDef,L.hpMul);cfg.eName=eDef.name}
  else if(L.type==="horde"){setup=setupHorde(L.count,L.lv,k=>k%4===3?"archer":null);cfg.eName=`Lính cát ×${L.count}`}
  else if(L.type==="swarm"){setup=setupHorde(L.count,L.lv,k=>k%3===2?null:"boomer");cfg.eName=`Bầy chuột ×${L.count}`}
  else if(L.type==="elite"){const d2=pick(BALLS.filter(b=>b.rar===eDef.rar&&b.id!==eDef.id));setup=setupElite(d2,L.lv);cfg.eName="Bộ đôi"}
  else if(L.type==="giant"){setup=setupGiant();cfg.eName="Khổng lồ"}
  else if(L.type==="mirror"){eDef=pDef;setup=setupMirror();cfg.eName="Bóng gương"}
  cfg.eDef=eDef;cfg.eLv=L.type==="boss"?1:L.lv;
  cfg.setup=g=>{if(setup)setup(g);if(L.type!=="boss"&&L.hpMul!==1)for(const o of g.balls)if(o.side===1){o.max*=L.hpMul;o.hp=o.max}if(g.horde)g.hordeMax=g.balls.filter(o=>o.side===1).reduce((s,u)=>s+u.max,0);g.noBox=!L.boxes};
  return cfg;
}
function playSandbox(L){
  M={mode:"sandbox",round:1,score:[0,0],onEnd:w=>sandEnd(w,L),onQuit:()=>sandEnd(1,L)};
  launchFight(Object.assign(levelCfg(L,BY_ID[L.pid],L.plv),{koTxt:w=>w===0?"THẮNG":"THUA"}));
}
function sandEnd(w,L){
  if(M.ended)return;M.ended=true;if(raf){cancelAnimationFrame(raf);raf=0}
  $("#layer").innerHTML=`<div class="overlay"><div class="sheet result ${w===0?"win":""}"><span class="idx">Sân tập · không tính thưởng</span><h2>${w===0?"THẮNG":w===1?"THUA":"HOÀ"}</h2>
    <div class="row-end" style="justify-content:center"><button class="btn btn-ghost mag" id="sbP">Về panel</button><button class="btn btn-main mag" id="sbA">Đấu lại ⟶</button></div></div></div>`;
  $("#sbP").onclick=()=>{backToLobby();openAdmin()};$("#sbA").onclick=()=>{closeLayer();playSandbox(L)};bindFx($("#layer"));
}
function playLevel(L,test){
  pickBallSheet(esc(L.name).toUpperCase(),`${test?"Chơi thử · ":""}${ENC[L.type]?ENC[L.type].name:""} · ${ARENA_BY[L.arena].name}`,pid=>{
    M={mode:"level",round:1,score:[0,0],onEnd:w=>levelEnd(w,L,test),onQuit:()=>levelEnd(1,L,test)};
    introCard({color:ARENA_BY[L.arena].neon,kicker:"Màn tuỳ chỉnh",title:L.name.toUpperCase(),sub:L.desc||"",tags:[arenaTag(L.arena),`Địch LV ${L.lv}`,L.boxes?"Có hộp bí ẩn":"Không hộp"]},()=>launchFight(Object.assign(levelCfg(L,BY_ID[pid],S.owned[pid]),{koTxt:w=>w===0?"QUA MÀN":"THẤT BẠI"})))},()=>{closeLayer();if(test)openAdmin();else backToLobby()});
}
function levelEnd(w,L,test){
  if(M.ended)return;M.ended=true;if(raf){cancelAnimationFrame(raf);raf=0}
  S.levelsDone=S.levelsDone||[];let coins=0,gems=0,first=false;
  if(w===0&&!test&&!S.levelsDone.includes(L.id)){first=true;S.levelsDone.push(L.id);coins=Math.round(L.reward.coins*TUNEX.coin);gems=Math.round(L.reward.gems*TUNEX.gem);S.coins+=coins;S.gems+=gems;save();updateWallet();sfx.coin()}
  $("#layer").innerHTML=`<div class="overlay"><div class="sheet result ${w===0?"win":""}"><span class="idx">${esc(L.name)}${test?" · chơi thử":""}</span><h2>${w===0?"QUA MÀN":"THẤT BẠI"}</h2>
    <p style="color:var(--muted)">${w===0?(first?"Thưởng lần đầu hoàn thành.":test?"Chơi thử không tính thưởng.":"Bạn đã nhận thưởng màn này trước đó."):"Thử lại với quả bóng khác xem."}</p>
    <div class="rewards">${coins?`<span class="chip-cur"><span class="coin"></span>+${fmt(coins)}</span>`:""}${gems?`<span class="chip-cur"><span class="gem"></span>+${gems}</span>`:""}</div>
    <div class="row-end" style="justify-content:center"><button class="btn btn-ghost mag" id="lvBack">${test?"Về panel":"Về sảnh"}</button><button class="btn btn-main mag" id="lvAgain">Chơi lại ⟶</button></div></div></div>`;
  if(w===0)confettiBurst(innerWidth/2,innerHeight*.5,140,["#36E2FF","#FF4D7A","#FFC23D"]);
  $("#lvBack").onclick=()=>{backToLobby();if(test)openAdmin()};$("#lvAgain").onclick=()=>{closeLayer();playLevel(L,test)};bindFx($("#layer"));
}
function levelsHTML(){
  const L=S.levels||[];if(!L.length)return"";S.levelsDone=S.levelsDone||[];
  return`<section class="arenas rv"><div class="head"><div><span class="idx"><b>(007)</b> — Màn tuỳ chỉnh · ${L.length} màn</span><h2 class="h-sm">MÀN <em>TUỲ CHỈNH</em></h2></div></div>
    <div class="arena-grid">${L.map((x,i)=>{const A=ARENA_BY[x.arena]||ARENA_BY.neon,done=S.levelsDone.includes(x.id);return`<button class="arena-c lvl" data-lvl="${i}" style="--a0:${A.swatch[0]};--a1:${A.swatch[1]};--an:${A.neon}"><b>${esc(x.name)}</b><small>${esc(x.desc||ENC[x.type].name)} · ${A.name}</small><small class="lv-r">${done?"✓ Đã qua":`Thưởng ${fmt(x.reward.coins)} xu · ${x.reward.gems} Gems`}</small></button>`}).join("")}</div></section>`;
}

/* ───────── debug trong trận ───────── */
function dbgDrop(id){const pw=[...POWERS,...TRAPS].find(p=>p.id===id);spawnBox();const bx=G.boxes[G.boxes.length-1];if(bx){bx.pw=pw;bx.trap=TRAPS.includes(pw);bx.c=bx.trap?"#FF5470":BOX_RAR[pw.rar||"common"].c;bx.t=.6;const p=G.mains[0];p.mem.seek=bx;p.mem.seekT=G.t+3}}
function renderDbgBar(){
  let bar=$("#dbgBar");const on=ADMIN&&DBG.bar&&!$("#match").hidden;
  if(!on){if(bar)bar.remove();return}
  if(!bar){bar=document.createElement("div");bar.id="dbgBar";bar.className="dbg-bar";$("#stage").appendChild(bar)}
  bar.innerHTML=`<b>ADMIN</b><button data-db="ko">Hạ địch</button><button data-db="die">Tự hạ</button><button data-db="box">Thả hộp</button><button data-db="spd">${speed===5?"×1":"×5"}</button><button data-db="god" aria-pressed="${DBG.god}">Bất tử</button><button data-db="panel">⚑ Panel</button>`;
  bar.querySelectorAll("[data-db]").forEach(b=>b.onclick=e=>{e.stopPropagation();const k=b.dataset.db;if(!G)return;
    if(k==="ko"){for(const o of G.balls)if(o.side===1&&o.alive&&o.kind!=="head")deal(null,o,99999,{})}
    else if(k==="die")deal(null,G.mains[0],99999,{});
    else if(k==="box")dbgDrop(pick([...POWERS,...TRAPS]).id);
    else if(k==="spd"){speed=speed===5?1:5;$("#speedBtn").textContent=`Tốc độ ${speed}×`}
    else if(k==="god")DBG.god=!DBG.god;
    else if(k==="panel"){openAdminInMatch();return}
    renderDbgBar()});
}
function openAdminInMatch(){
  // mở panel phủ lên trận, trận tạm dừng bằng tốc độ 0
  const prev=speed;speed=0;openAdmin();const close=$("#admClose");close.onclick=()=>{closeLayer();speed=prev||1;renderDbgBar()};
}
function drawHitboxes(){
  if(!DBG.hit||!G)return;ctx.save();ctx.lineWidth=1;
  for(const b of G.balls){if(!b.alive)continue;ctx.strokeStyle=b.side?"#FF4D7A":"#36E2FF";circle(b.x,b.y,b.r);ctx.stroke();ctx.fillStyle=ctx.strokeStyle;ctx.fillRect(b.x-1.5,b.y-1.5,3,3);ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(b.x+b.vx*.15,b.y+b.vy*.15);ctx.stroke()}
  ctx.strokeStyle="#FFE14F";for(const p of G.proj){circle(p.x,p.y,p.r);ctx.stroke()}for(const bx of G.boxes||[]){circle(bx.x,bx.y,bx.r);ctx.stroke()}
  ctx.strokeStyle="#5CF2A8";for(const z of G.zones){circle(z.x,z.y,z.r);ctx.stroke()}for(const o of (G.as&&G.as.obs)||[]){circle(o.x,o.y,o.r);ctx.stroke()}
  ctx.restore();
}
