"use strict";
/* ═════════════════════════════════════════════════════════════
   DỮ LIỆU — 126 quả bóng. Hiếm hơn = kỹ năng dị hơn.
   Mỗi kỹ năng là các "hook" mà engine gọi:
     cd + trigger(b)        : chiêu hồi theo giây
     init(b)                : đầu hiệp
     update(b,dt)           : mỗi bước mô phỏng
     preHit(b,t,info)       : trước khi va gây sát thương (sửa info.amt / info.crit)
     onHit(b,t,info)        : sau khi va trúng
     onWall(b,hit)          : đập tường
     onHurt(b,src,amt,o)    : khi bị đánh, trả về sát thương mới
     onDeath(b)             : trả true để không chết (hồi sinh/tua lại)
     takenMult              : hệ số sát thương nhận
     draw(b,ctx)            : vẽ thêm
   ═════════════════════════════════════════════════════════════ */
const RARS=["common","rare","epic","legendary","mythic"];
const RAR_VN={common:"Thường",rare:"Hiếm",epic:"Sử thi",legendary:"Huyền thoại",mythic:"Thần thoại"};
const MAX_LV=10;
const TAU=Math.PI*2;

const BALLS=[
/* ─────────── THƯỜNG (23) ─────────── */
{id:"pebble",name:"Pebble",mono:"PB",rar:"common",color:"#B3A892",hp:160,dmg:8,spd:205,r:27,ab:{name:"Vỏ cứng",desc:"Nội tại: giảm 25% mọi sát thương nhận vào.",takenMult:.75}},
{id:"spark",name:"Spark",mono:"SP",rar:"common",color:"#FFB648",hp:125,dmg:10,spd:240,r:22,ab:{name:"Lao vút",cd:2.5,desc:"Mỗi 2.5 giây lao thẳng vào đối thủ.",trigger:b=>dashAt(b,.5)}},
{id:"moss",name:"Moss",mono:"MS",rar:"common",color:"#7DBE5A",hp:135,dmg:8,spd:200,r:25,ab:{name:"Tái sinh",cd:6,desc:"Hồi 1 máu/giây, cứ 6 giây hồi thêm 8 máu.",
  update:(b,dt)=>heal(b,1*b.sc*dt),trigger:b=>{heal(b,8*b.sc,true);ring(b.x,b.y,b.r,b.r+34,"#7DBE5A",.5,3)}}},
{id:"zippy",name:"Zippy",mono:"ZP",rar:"common",color:"#4FF0D2",hp:105,dmg:8,spd:285,r:20,ab:{name:"Tăng tốc",desc:"Cực nhanh. Mỗi lần đập tường tăng tốc thêm 50% trong 0.8 giây.",onWall:b=>status(b,"haste",.8)}},
{id:"brick",name:"Brick",mono:"BR",rar:"common",color:"#D0673F",hp:185,dmg:9,spd:175,r:32,ab:{name:"Nặng ký",desc:"To, chậm, lì đòn. Mỗi cú va hất văng đối thủ.",onHit:(b,t)=>knock(t,b,380)}},
{id:"pin",name:"Pin",mono:"PN",rar:"common",color:"#E9E2F7",hp:115,dmg:9,spd:230,r:21,ab:{name:"Gai nhọn",desc:"Va chạm gây chảy máu 3/giây trong 3 giây.",onHit:(b,t)=>status(t,"bleed",3,3*b.sc)}},
{id:"bubble",name:"Bubble",mono:"BU",rar:"common",color:"#8FD3FF",hp:120,dmg:8,spd:215,r:25,ab:{name:"Bong bóng",cd:6,desc:"Mỗi 6 giây tạo khiên chặn 18 sát thương.",
  trigger:b=>{b.st.shield=18*b.sc;ring(b.x,b.y,b.r,b.r+22,"#8FD3FF",.4,3)}}},
{id:"coal",name:"Coal",mono:"CO",rar:"common",color:"#FF6A3D",hp:120,dmg:9,spd:220,r:23,ab:{name:"Than hồng",desc:"Va chạm đốt cháy đối thủ 3.5/giây trong 3 giây.",onHit:(b,t)=>status(t,"burn",3,3.5*b.sc)}},
{id:"pip",name:"Pip",mono:"PI",rar:"common",color:"#FFE066",hp:110,dmg:8,spd:220,r:21,ab:{name:"Súng hạt",cd:1.6,desc:"Cứ 1.6 giây bắn một viên đạn về phía đối thủ.",trigger:b=>shoot(b,{dmg:b.dmg*.7,spd:540})}},
{id:"clover",name:"Clover",mono:"CV",rar:"common",color:"#3DDC84",hp:125,dmg:9,spd:220,r:23,ab:{name:"May mắn",desc:"25% cơ hội chí mạng gây gấp đôi sát thương.",
  preHit:(b,t,i)=>{if(Math.random()<.25){i.amt*=2;i.crit=true}}}},
{id:"echo",name:"Echo",mono:"EC",rar:"common",color:"#9C8CFF",hp:120,dmg:8,spd:230,r:23,ab:{name:"Dội vang",desc:"Mỗi lần đập tường tích 1 điểm (tối đa 3). Cú va kế tiếp mạnh thêm 40% mỗi điểm.",
  onWall:b=>{b.mem.echo=Math.min(3,(b.mem.echo||0)+1)},preHit:(b,t,i)=>{if(b.mem.echo){i.amt*=1+.4*b.mem.echo;if(b.mem.echo>=3)i.crit=true;b.mem.echo=0}},
  draw:(b,c)=>{for(let k=0;k<(b.mem.echo||0);k++){c.strokeStyle="#9C8CFF";c.globalAlpha=.6-k*.15;c.lineWidth=2;c.beginPath();c.arc(b.x,b.y,b.r+10+k*6,0,TAU);c.stroke()}c.globalAlpha=1}}},
{id:"jelly",name:"Jelly",mono:"JL",rar:"common",color:"#FF8FC8",hp:140,dmg:8,spd:210,r:26,ab:{name:"Đàn hồi",desc:"Giảm 15% sát thương. Bị đánh thì nảy đi thật nhanh và hồi 3 máu.",
  onHurt:(b,s,amt,o)=>{if(!o.silent){status(b,"haste",.6);heal(b,3*b.sc)}return amt*.85}}},

{id:"shard",name:"Shard",mono:"SH",rar:"common",color:"#7FD1C7",hp:115,dmg:8,spd:225,r:22,ab:{name:"Mảnh vụn",desc:"Mỗi cú va bắn thêm 3 mảnh vụn tỏa hình quạt về phía đối thủ.",
  onHit:(b,t)=>{const a=angTo(b,t);for(const k of [-.35,0,.35])shoot(b,{a:a+k,spd:480,dmg:b.dmg*.35,r:4,life:1.2})}}},
{id:"gum",name:"Gum",mono:"GU",rar:"common",color:"#FF7EB6",hp:130,dmg:8,spd:215,r:24,ab:{name:"Kẹo dính",desc:"Va chạm làm đối thủ dính kẹo, chậm 45% trong 1.8 giây.",onHit:(b,t)=>{status(t,"slow",1.8,.45);burst(t.x,t.y,"#FF7EB6",8,160,3)}}},

{id:"brimstone",name:"Brimstone",mono:"BI",rar:"common",color:"#C2703D",hp:140,dmg:9,spd:205,r:26,ab:{name:"Tín hiệu tiếp viện",cd:6,desc:"Mỗi 6 giây thả hộp kích thích: tăng tốc 2 giây và nhận khiên 10.",
  trigger:b=>{status(b,"haste",2);b.st.shield=(b.st.shield||0)+10*b.sc;ring(b.x,b.y,b.r,b.r+44,"#C2703D",.5,4)}}},
{id:"breach",name:"Breach",mono:"BH",rar:"common",color:"#D1784B",hp:160,dmg:9,spd:195,r:27,ab:{name:"Dư chấn",cd:5,desc:"Phóng chấn động xuống chỗ đối thủ, nổ sau 0.8 giây: 8 sát thương và choáng 0.8 giây.",
  trigger:b=>{const e=E(b);if(!alive(e))return;blast(b,{x:clamp(e.x+e.vx*.5,40,W-40),y:clamp(e.y+e.vy*.5,40,H-40),fx:b.x,fy:b.y,r:70,delay:.8,dmg:8*b.sc,after:z=>{for(const o of foes(b))if(Math.hypot(o.x-z.x,o.y-z.y)<z.r+o.r)status(o,"stun",.8)}})}}},
{id:"dune",name:"Dune",mono:"DN",rar:"common",color:"#E3B04B",hp:140,dmg:10,spd:210,r:25,ab:{name:"Bão cát",cd:4,desc:"Dựng vùng cát dưới chân đối thủ, làm chậm 35% trong 4 giây.",
  trigger:b=>{const e=E(b);if(!alive(e))return;zone(b,{kind:"sand",x:e.x,y:e.y,r:85,life:4,slow:.35,dps:3*b.sc,draw:(z,f)=>{glowAt(z.x,z.y,z.r*1.1,"#E3B04B",.3*f)}})}}},
{id:"nib",name:"Nib",mono:"NB",rar:"common",color:"#6C8EBF",hp:140,dmg:10,spd:225,r:22,ab:{name:"Mực đen",desc:"Mỗi cú va làm đối thủ chậm 40% trong 1.5 giây và chảy máu 1/giây.",onHit:(b,t)=>{status(t,"slow",1.5,.4);status(t,"bleed",3,1*b.sc)}}},
{id:"cork",name:"Cork",mono:"CK",rar:"common",color:"#C98B5E",hp:150,dmg:10,spd:220,r:24,ab:{name:"Nảy tường",desc:"Mỗi lần nảy tường cộng 2 sát thương (tối đa +8). Va trúng địch thì mất một nửa.",
  onWall:b=>{b.mem.grow=Math.min(8,(b.mem.grow||0)+1.5)},onHit:b=>{b.mem.grow=(b.mem.grow||0)*.5}}},
{id:"dot",name:"Dot",mono:"DO",rar:"common",color:"#F2F2F2",hp:120,dmg:10,spd:300,r:17,ab:{name:"Bé tí",desc:"Nhỏ và rất nhanh: 25% né được đòn tấn công.",
  onHurt:(b,src,amt,o)=>{if(src&&!o.silent&&Math.random()<.25){floater(b,"NÉ","od");return 0}return amt}}},
{id:"ember",name:"Ember",mono:"EB",rar:"common",color:"#FF7B54",hp:130,dmg:9,spd:225,r:23,ab:{name:"Than hồng",desc:"Va chạm gây bỏng 2.5 sát thương/giây trong 3.5 giây.",onHit:(b,t)=>status(t,"burn",3.5,2.5*b.sc)}},
{id:"candy",name:"Candy",mono:"CD",rar:"common",color:"#FF8FC7",hp:125,dmg:9,spd:225,r:22,ab:{name:"Kẹo đạn",cd:2.5,desc:"Mỗi 2.5 giây bắn 2 viên kẹo hơi chếch nhau.",
  trigger:b=>{const e=E(b);if(!alive(e))return;for(const k of [-.18,.18])shoot(b,{spd:520,dmg:b.dmg*.65,r:5,a:angTo(b,e)+k})}}},
{id:"tick",name:"Tick",mono:"TK",rar:"common",color:"#8AA29E",hp:140,dmg:10,spd:225,r:23,ab:{name:"Lên dây cót",cd:5,desc:"Mỗi 5 giây lên dây: đòn đánh kế tiếp trong 3 giây chí mạng.",
  trigger:b=>{status(b,"crit",3);ring(b.x,b.y,b.r,b.r+30,"#8AA29E",.4,3)}}},
/* ─────────── HIẾM (28) ─────────── */
{id:"frost",name:"Frost",mono:"FR",rar:"rare",color:"#8EDCFF",hp:145,dmg:11,spd:225,r:24,ab:{name:"Đóng băng",desc:"Va chạm đóng băng đối thủ 1.4 giây. Đánh trúng mục tiêu đang đóng băng gây thêm 50%.",
  preHit:(b,t,i)=>{if(t.st.freeze>0){i.amt*=1.5;i.crit=true}},onHit:(b,t)=>{if(!(b.mem.fcd>G.t)){status(t,"freeze",1.4);b.mem.fcd=G.t+1.6}}}},
{id:"thorn",name:"Thorn",mono:"TH",rar:"rare",color:"#5FA35A",hp:135,dmg:8,spd:220,r:24,ab:{name:"Gai tường",cd:1.3,desc:"Cắm gai lên tường ngay chỗ đối thủ sắp lao tới (tối đa 8). Chạm gai mất 13 máu.",
  trigger:b=>{const e=E(b);if(alive(e))plantSpike(b,wallAhead(e))},onWall:(b,h)=>plantSpike(b,h)}},
{id:"quill",name:"Quill",mono:"QL",rar:"rare",color:"#E5CFA6",hp:110,dmg:8,spd:220,r:22,ab:{name:"Bắn lông",cd:1.1,desc:"Cứ 1.1 giây phóng một mũi lông nhọn đón đầu đối thủ.",
  trigger:b=>shoot(b,{kind:"quill",spd:640,dmg:b.dmg*.75,lead:.12})}},
{id:"volt",name:"Volt",mono:"VT",rar:"rare",color:"#FFF04D",hp:125,dmg:9,spd:235,r:23,ab:{name:"Tĩnh điện",desc:"Tích điện mỗi cú va. Đủ 3 lần thì phóng điện 14 sát thương vào mọi kẻ địch và làm choáng.",
  onHit:(b,t)=>{b.mem.c=(b.mem.c||0)+1;if(b.mem.c>=3){b.mem.c=0;for(const o of foes(b)){zap(b,o,14*b.sc);status(o,"stun",.4)}}},
  draw:(b,c)=>{for(let k=0;k<(b.mem.c||0);k++){const a=G.t*6+k*TAU/3;c.fillStyle="#FFF04D";c.beginPath();c.arc(b.x+Math.cos(a)*(b.r+8),b.y+Math.sin(a)*(b.r+8),3,0,TAU);c.fill()}}}},
{id:"venom",name:"Venom",mono:"VN",rar:"rare",color:"#A6E22E",hp:125,dmg:8,spd:225,r:23,ab:{name:"Độc tố",desc:"Mỗi cú va cộng 1 tầng độc (tối đa 5). Mỗi tầng mất 1.5 máu/giây.",onHit:(b,t)=>status(t,"poison",4,1.5*b.sc)}},
{id:"lodestone",name:"Lodestone",mono:"LD",rar:"rare",color:"#B07BA8",hp:145,dmg:10,spd:195,r:27,ab:{name:"Từ trường",cd:5,desc:"Luôn hút đối thủ ở gần, nhận ít hơn 30% và gây thêm 30% sát thương khi va. Mỗi 5 giây phát xung hút cực mạnh.",takenMult:.7,preHit:(b,t,i)=>{i.amt*=1.3},
  update:(b,dt)=>{const e=E(b);if(!alive(e))return;const d=dist(b,e);if(d<260&&d>1){e.vx+=(b.x-e.x)/d*380*dt;e.vy+=(b.y-e.y)/d*380*dt}},
  trigger:b=>{const e=E(b);if(!alive(e))return;knock(e,b,-340);ring(b.x,b.y,260,b.r,"#B07BA8",.5,4)},
  draw:(b,c)=>{c.strokeStyle="rgba(176,123,168,.35)";c.setLineDash([2,10]);c.lineDashOffset=-G.t*30;c.lineWidth=1.5;c.beginPath();c.arc(b.x,b.y,260,0,TAU);c.stroke();c.setLineDash([])}}},
{id:"ricochet",name:"Ricochet",mono:"RC",rar:"rare",color:"#FF9F1C",hp:120,dmg:9,spd:225,r:22,ab:{name:"Đạn nảy",cd:2,desc:"Bắn viên đạn nảy tường 4 lần, mỗi lần nảy lại nhanh hơn.",
  trigger:b=>shoot(b,{kind:"ric",spd:470,dmg:b.dmg*.6,life:6,bounces:4,r:6})}},
{id:"landmine",name:"Landmine",mono:"LM",rar:"rare",color:"#FF5470",hp:125,dmg:8,spd:220,r:23,ab:{name:"Thả mìn",cd:2.5,desc:"Rải mìn khắp sàn (tối đa 4). Kẻ địch lại gần là nổ 16 sát thương.",
  trigger:b=>{const m=G.zones.filter(z=>z.kind==="mine"&&z.owner===b);if(m.length>=4)m[0].life=0;zone(b,{kind:"mine",r:11,life:40,arm:.6,dmg:16*b.sc})}}},
{id:"fang",name:"Fang",mono:"FG",rar:"rare",color:"#C21E56",hp:120,dmg:10,spd:230,r:23,ab:{name:"Hút máu",desc:"Hồi lại 40% sát thương gây ra khi va chạm.",onHit:(b,t,i)=>{if(i.dealt>0){heal(b,i.dealt*.4,true);beam(t.x,t.y,b.x,b.y,"#C21E56",.25,3)}}}},
{id:"rang",name:"Rang",mono:"RG",rar:"rare",color:"#F4A261",hp:120,dmg:9,spd:225,r:23,ab:{name:"Boomerang",cd:2.2,desc:"Ném boomerang xuyên thấu, bay ra rồi quay về, trúng được hai lần.",
  trigger:b=>shoot(b,{kind:"boomer",spd:520,dmg:b.dmg*.65,life:3.5,pierce:true,r:10,ret:.55})}},
{id:"prism",name:"Prism",mono:"PR",rar:"rare",color:"#D7C4FF",hp:135,dmg:9,spd:225,r:24,ab:{name:"Phản chiếu",desc:"Phản lại 50% sát thương nhận vào cho kẻ gây ra.",
  onHurt:(b,s,amt,o)=>{if(s&&s!==b&&alive(s)&&!o.reflected){deal(b,s,amt*.5,{reflected:true});beam(b.x,b.y,s.x,s.y,"#D7C4FF",.2,2)}return amt}}},
{id:"tide",name:"Tide",mono:"TD",rar:"rare",color:"#3EC9FF",hp:135,dmg:9,spd:215,r:25,ab:{name:"Sóng thần",cd:4,desc:"Mỗi 4 giây tung sóng xung kích hất văng mọi kẻ địch quanh mình, gây 9 sát thương.",
  trigger:b=>{ring(b.x,b.y,b.r,220,"#3EC9FF",.6,8);ripple(b.x,b.y,18);for(const o of foes(b)){if(dist(o,b)<220+o.r){knock(o,b,460);deal(b,o,9*b.sc,{})}}}}},

{id:"buzz",name:"Buzzsaw",mono:"BZ",rar:"rare",color:"#C0C7D6",hp:125,dmg:9,spd:225,r:23,ab:{name:"Cưa máy",cd:3.5,desc:"Mỗi 3.5 giây rồ máy 1.5 giây: lao nhanh hơn, va chạm gây gấp đôi và làm chảy máu.",
  trigger:b=>{b.mem.saw=G.t+1.5;status(b,"haste",1.5);sfx.whoosh()},
  preHit:(b,t,i)=>{if(b.mem.saw>G.t){i.amt*=2;status(t,"bleed",3,3*b.sc)}},
  draw:(b,c)=>{const on=b.mem.saw>G.t;c.save();c.translate(b.x,b.y);c.rotate(G.t*(on?30:4));c.fillStyle=on?"#FFFFFF":"#C0C7D6";for(let k=0;k<10;k++){c.rotate(TAU/10);c.beginPath();c.moveTo(b.r-2,-4);c.lineTo(b.r+(on?9:5),0);c.lineTo(b.r-2,4);c.fill()}c.restore();if(on)glowAt(b.x,b.y,b.r*2.4,"#FFFFFF",.35)}}},
{id:"magma",name:"Magma",mono:"MG",rar:"rare",color:"#FF4E1A",hp:135,dmg:9,spd:210,r:25,ab:{name:"Dung nham",desc:"Mỗi cú va để lại vũng dung nham tại điểm va, đốt 6 máu/giây trong 4 giây.",
  onHit:(b,t)=>zone(b,{kind:"fire",x:(b.x+t.x)/2,y:(b.y+t.y)/2,r:42,life:4,dps:6*b.sc})}},
{id:"siren",name:"Siren",mono:"SI",rar:"rare",color:"#5EEAD4",hp:125,dmg:9,spd:225,r:23,ab:{name:"Tiếng hát",cd:4,desc:"Mỗi 4 giây cất tiếng hát: kẻ địch trong bán kính 200 mất 7 máu và chạy ngược 1.2 giây.",
  trigger:b=>{ring(b.x,b.y,b.r,200,"#5EEAD4",.7,3);ring(b.x,b.y,b.r,160,"#ffffff",.5,2);for(const o of foes(b))if(dist(o,b)<200+o.r){deal(b,o,7*b.sc,{});status(o,"confuse",1.2)}sfx.zap()}}},

{id:"sova",name:"Sova",mono:"SV",rar:"rare",color:"#3DDC97",hp:135,dmg:10,spd:225,r:22,ab:{name:"Mũi tên dò",cd:3,desc:"Bắn mũi tên nảy tường 2 lần. Trúng ai là bại lộ vị trí: kẻ đó yếu đi (-35% sát thương) trong 3 giây.",
  trigger:b=>shoot(b,{skin:"arrow",kind:"ric",spd:520,dmg:b.dmg*.8,life:4.5,bounces:2,r:6,onHit:(p,t)=>status(t,"weak",3)})}},
{id:"sage",name:"Sage",mono:"SA",rar:"rare",color:"#9BF6C8",hp:135,dmg:9,spd:215,r:24,ab:{name:"Băng chắn",cd:6,desc:"Dựng vùng băng làm chậm 50% dưới chân đối thủ trong 4 giây, đồng thời hồi 12 máu cho mình.",
  trigger:b=>{const e=E(b);if(!alive(e))return;zone(b,{kind:"ice",x:e.x,y:e.y,r:90,life:4,slow:.5});heal(b,12*b.sc,true);ring(b.x,b.y,b.r,b.r+34,"#9BF6C8",.5,3)}}},
{id:"cypher",name:"Cypher",mono:"CY",rar:"rare",color:"#D8D8D8",hp:150,dmg:10,spd:220,r:22,ab:{name:"Bẫy dây",cd:4.5,desc:"Giăng bẫy dây (tối đa 4) trên đường đi của đối thủ: bước vào là chậm 80% và rỉ máu.",
  trigger:b=>{const e=E(b);if(!alive(e))return;const m=G.zones.filter(z=>z.kind==="snare"&&z.owner===b);if(m.length>=4)m[0].life=0;zone(b,{kind:"snare",x:clamp(e.x+e.vx*.4,40,W-40),y:clamp(e.y+e.vy*.4,40,H-40),r:36,life:12,arm:.5,slow:.8,dps:12*b.sc,draw:(z,f)=>{glowAt(z.x,z.y,z.r*1.4,"#D8D8D8",.5*f)}})}}},
{id:"kayo",name:"KAY/O",mono:"KO",rar:"rare",color:"#5C7AEA",hp:145,dmg:10,spd:225,r:24,ab:{name:"Dao áp chế",cd:5,desc:"Phi dao áp chế: trúng là đối thủ bị câm lặng 2.5 giây, không dùng được kỹ năng.",
  trigger:b=>{const e=E(b);if(!alive(e))return;shoot(b,{skin:"knife",spd:700,dmg:b.dmg*1,r:6,lead:.15,onHit:(p,t)=>{status(t,"silence",2.5);floater(t,"CÂM LẶNG","od")}})}}},
{id:"harbor",name:"Harbor",mono:"HB",rar:"rare",color:"#2A9D8F",hp:130,dmg:9,spd:205,r:26,ab:{name:"Sóng chắn",cd:6,desc:"Dựng sóng nước quanh người: nhận khiên 12, làm chậm 40% kẻ địch lại gần trong 3.5 giây.",
  trigger:b=>{b.st.shield=(b.st.shield||0)+12*b.sc;zone(b,{kind:"tide",r:100,life:3.5,slow:.4,dps:3*b.sc,draw:(z,f)=>{glowAt(z.x,z.y,z.r*1.1,"#2A9D8F",.35*f)}});ring(b.x,b.y,b.r,b.r+60,"#2A9D8F",.5,5)}}},
{id:"deadlock",name:"Deadlock",mono:"DL",rar:"rare",color:"#A8DADC",hp:155,dmg:10,spd:215,r:24,ab:{name:"Lưới trọng lực",cd:6,desc:"Quăng lưới xuống chỗ đối thủ: chậm 85% trong 2.2 giây, kèm một phát đạn.",
  trigger:b=>{const e=E(b);if(!alive(e))return;zone(b,{kind:"net",x:e.x,y:e.y,r:100,life:2.2,slow:.85,draw:(z,f)=>{glowAt(z.x,z.y,z.r*1.1,"#A8DADC",.35*f)}});shoot(b,{spd:560,dmg:b.dmg*.9,lead:.1})}}},
{id:"howitzer",name:"Howitzer",mono:"HW",rar:"rare",color:"#8D99AE",hp:150,dmg:9,spd:215,r:25,ab:{name:"Pháo cối",cd:3.5,desc:"Bắn pháo vào chỗ đối thủ sắp tới, nổ sau 1 giây: 24 sát thương.",
  trigger:b=>{const e=E(b);if(!alive(e))return;blast(b,{x:clamp(e.x+e.vx*.7,40,W-40),y:clamp(e.y+e.vy*.7,40,H-40),fx:b.x,fy:b.y,r:70,delay:1,dmg:24*b.sc})}}},
{id:"static",name:"Static",mono:"SC",rar:"rare",color:"#FFE45E",hp:120,dmg:9,spd:230,r:22,ab:{name:"Tĩnh điện",cd:3.8,desc:"Phóng tia điện trúng ngay đối thủ: 9 sát thương và chậm 30% trong 1 giây.",
  trigger:b=>{const e=E(b);if(!alive(e))return;zap(b,e,9*b.sc,false);status(e,"slow",1,.3)}}},
{id:"weaver",name:"Weaver",mono:"WV",rar:"rare",color:"#B388EB",hp:145,dmg:10,spd:215,r:24,ab:{name:"Tơ nhện",cd:6,desc:"Phóng tơ trói đối thủ 3.5 giây, kéo về phía mình và siết 6 máu/giây.",
  trigger:b=>{const e=E(b);if(alive(e))tether(b,e,3.5,6*b.sc)}}},
{id:"spore",name:"Spore",mono:"SO",rar:"rare",color:"#A7C957",hp:140,dmg:10,spd:220,r:23,ab:{name:"Bào tử độc",cd:4.5,desc:"Phun 2 viên bào tử, mỗi viên trúng là nhiễm độc.",
  trigger:b=>{const e=E(b);if(!alive(e))return;for(const k of [-.12,.12])shoot(b,{kind:"spit",spd:460,dmg:b.dmg*.7,r:5,a:angTo(b,e)+k,onHit:(p,t)=>status(t,"poison",3,1.1*b.sc)})}}},
{id:"bastion",name:"Bastion",mono:"BA",rar:"rare",color:"#5E7CE2",hp:125,dmg:9,spd:205,r:27,ab:{name:"Pháo đài",cd:5,desc:"Giảm 10% sát thương nhận vào, mỗi 5 giây dựng khiên 14.",takenMult:.9,
  trigger:b=>{b.st.shield=(b.st.shield||0)+14*b.sc;ring(b.x,b.y,b.r,b.r+36,"#5E7CE2",.45,4)}}},
{id:"comet",name:"Comet",mono:"CM",rar:"rare",color:"#FF9EAA",hp:140,dmg:9,spd:235,r:22,ab:{name:"Sao chổi",cd:3.5,desc:"Mỗi 3.5 giây lao vào đối thủ với tốc độ gấp đôi.",
  trigger:b=>{dashAt(b,.5)}}},
{id:"bloom",name:"Bloom",mono:"BM",rar:"rare",color:"#F7A8B8",hp:150,dmg:10,spd:215,r:24,ab:{name:"Phấn hoa",cd:6,desc:"Mỗi 6 giây thả 2 bông hoa nhỏ biết đánh trong 8 giây.",
  trigger:b=>{for(let k=0;k<2;k++)spawnMinion(b,{kind:"clone",r:b.r*.55,hp:25*b.sc,dmg:b.dmg*.45,life:8})}}},
/* ─────────── SỬ THI (31) ─────────── */
{id:"hive",name:"Hive",mono:"HV",rar:"epic",color:"#FFC93C",hp:125,dmg:8,spd:215,r:24,ab:{name:"Bầy ong",cd:3,desc:"Thả ong tự đuổi kẻ địch (tối đa 4). Ong chích gây sát thương và trúng độc.",
  trigger:b=>{if(G.proj.filter(p=>p.kind==="bee"&&p.owner===b).length<4)shoot(b,{kind:"bee",a:rand(0,TAU),spd:290,dmg:b.dmg*.45,life:8,r:6,homing:5,bounces:99,onHit:(p,o)=>status(o,"poison",3,1.2*b.sc)})}}},
{id:"titan",name:"Titan",mono:"TI",rar:"epic",color:"#C98B5E",hp:150,dmg:9,spd:200,r:21,ab:{name:"Phình to",desc:"Mỗi cú va trúng làm Titan to ra, nặng hơn và đánh đau hơn.",
  onHit:(b,t)=>{if(b.r<42){b.r+=2.2;b.mem.grow=(b.mem.grow||0)+1.3*b.sc;ring(b.x,b.y,b.r,b.r+16,"#C98B5E",.3,3)}}}},
{id:"lumen",name:"Lumen",mono:"LU",rar:"epic",color:"#FF4FD8",hp:125,dmg:9,spd:225,r:23,ab:{name:"Tia laser",cd:3.4,desc:"Ngắm 0.7 giây rồi bắn tia laser xuyên cả sàn, 24 sát thương cho mọi thứ trên đường.",
  trigger:b=>{const e=E(b);if(!alive(e))return;line(b,{x:b.x,y:b.y,a:angTo(b,e),delay:.7,w:26,dmg:24*b.sc,track:b})}}},
{id:"halo",name:"Halo",mono:"HL",rar:"epic",color:"#9BE7FF",hp:130,dmg:9,spd:215,r:24,ab:{name:"Vệ tinh",desc:"3 mặt trăng quay quanh người. Kẻ địch chạm phải mất 7 máu, trăng tái tạo sau 1.2 giây.",
  init:b=>{b.mem.moons=[0,1,2].map(k=>({a:k*TAU/3,cd:0}))},
  update:(b,dt)=>{if(!b.mem.moons)b.mem.moons=[0,1,2].map(k=>({a:k*TAU/3,cd:0}));for(const m of b.mem.moons){m.a+=3.2*dt;if(m.cd>0){m.cd-=dt;continue}
    const mx=b.x+Math.cos(m.a)*(b.r+26),my=b.y+Math.sin(m.a)*(b.r+26);for(const o of foes(b)){if(Math.hypot(o.x-mx,o.y-my)<o.r+8){deal(b,o,7*b.sc,{});m.cd=1.2;burst(mx,my,"#9BE7FF",14,260,3);break}}}},
  draw:(b,c)=>{if(!b.mem.moons)return;for(const m of b.mem.moons){if(m.cd>0)continue;const mx=b.x+Math.cos(m.a)*(b.r+26),my=b.y+Math.sin(m.a)*(b.r+26);glowAt(mx,my,22,"#9BE7FF",.8);c.fillStyle="#E8FBFF";c.beginPath();c.arc(mx,my,6,0,TAU);c.fill()}}}},
{id:"mirage",name:"Mirage",mono:"MR",rar:"epic",color:"#C9A7FF",hp:120,dmg:9,spd:230,r:23,ab:{name:"Ảo ảnh",cd:6,desc:"Tạo 2 bản ảo đánh lừa đối thủ. Đối thủ đuổi theo ảo ảnh, chạm vào thì ảo ảnh nổ 8 sát thương.",
  trigger:b=>{for(let k=0;k<2;k++){const a=rand(0,TAU);spawnMinion(b,{kind:"decoy",x:b.x+Math.cos(a)*b.r*2.2,y:b.y+Math.sin(a)*b.r*2.2,r:b.r,hp:1,dmg:0,life:5})}ring(b.x,b.y,b.r,b.r+40,"#C9A7FF",.4,3)}}},
{id:"inferno",name:"Inferno",mono:"IF",rar:"epic",color:"#FF5A1F",hp:130,dmg:9,spd:230,r:24,ab:{name:"Vệt lửa",desc:"Để lại vệt lửa trên đường đi. Kẻ địch dẫm vào bị đốt 5/giây.",
  update:(b,dt)=>{b.mem.ft=(b.mem.ft||0)-dt;if(b.mem.ft<=0){b.mem.ft=.18;zone(b,{kind:"fire",x:b.x,y:b.y,r:20,life:2.6,dps:5*b.sc})}}}},
{id:"glacier",name:"Glacier",mono:"GL",rar:"epic",color:"#B8F1FF",hp:140,dmg:9,spd:210,r:25,ab:{name:"Kỷ băng hà",cd:5.5,desc:"Phủ băng một vùng lớn quanh đối thủ: làm chậm 60% và rút 3 máu/giây trong 3.5 giây.",
  trigger:b=>{const e=E(b);if(!alive(e))return;zone(b,{kind:"ice",x:e.x,y:e.y,r:115,life:3.5,dps:3*b.sc,slow:.6});ring(e.x,e.y,10,115,"#B8F1FF",.5,5)}}},
{id:"shackle",name:"Shackle",mono:"SK",rar:"epic",color:"#9AA4B8",hp:140,dmg:10,spd:210,r:25,ab:{name:"Xích sắt",cd:5,desc:"Quăng xích trói đối thủ 2.5 giây, kéo về phía mình và siết 5 máu/giây.",
  trigger:b=>{const e=E(b);if(alive(e))tether(b,e,2.5,5*b.sc)}}},
{id:"kaboom",name:"Kaboom",mono:"KB",rar:"epic",color:"#FF3B3B",hp:125,dmg:9,spd:220,r:23,ab:{name:"Bom nổ chậm",cd:3,desc:"Ném bom đón đầu đối thủ, nổ sau 1 giây: 20 sát thương diện rộng.",
  trigger:b=>{const e=E(b);if(!alive(e))return;const x=clamp(e.x+e.vx*.8,G.bd.l+20,G.bd.r-20),y=clamp(e.y+e.vy*.8,G.bd.t+20,G.bd.b-20);blast(b,{x,y,fx:b.x,fy:b.y,r:90,delay:1,dmg:20*b.sc,kind:"bomb"})}}},
{id:"berserk",name:"Berserk",mono:"BS",rar:"epic",color:"#E01E37",hp:140,dmg:9,spd:215,r:24,ab:{name:"Cuồng nộ",desc:"Càng mất máu càng điên: sát thương tới +130%, tốc độ tới +50%.",
  update:b=>{const m=1-b.hp/b.max;b.dmgMul=1+1.3*m;b.speedMul=1+.5*m;if(m>.4&&Math.random()<.3)burst(b.x,b.y,"#E01E37",1,80,3)},
  draw:b=>{const m=1-b.hp/b.max;if(m>.2)glowAt(b.x,b.y,b.r*(2.4+m*2),"#E01E37",m)}}},
{id:"dice",name:"Dice",mono:"DC",rar:"epic",color:"#F2F2F2",hp:130,dmg:10,spd:225,r:24,ab:{name:"Xúc xắc",desc:"Mỗi cú va gieo xúc xắc: 1 là xịt, 6 là gấp ba kèm vụ nổ.",
  preHit:(b,t,i)=>{const n=1+Math.floor(Math.random()*6);i.amt*=[0,.4,.8,1,1.3,1.7,3][n];if(n===6){i.crit=true;i.boom=true}floater(b,"XÚC XẮC "+n,n===6?"crit":"od")},
  onHit:(b,t,i)=>{if(i.boom)explode(t.x,t.y,80,10*b.sc,b,"#F2F2F2")}}},

{id:"hook",name:"Hook",mono:"HK",rar:"epic",color:"#8D99AE",hp:140,dmg:10,spd:215,r:25,ab:{name:"Móc câu",cd:3,desc:"Phóng móc câu. Trúng thì giật đối thủ sát vào mình, làm choáng 0.5 giây và cú va kế tiếp gây gấp đôi.",
  trigger:b=>shoot(b,{kind:"quill",spd:700,dmg:b.dmg*.5,r:7,lead:.08,life:1.4,onHit:(p,o)=>{if(o.kind!=="main")return;beam(b.x,b.y,o.x,o.y,"#8D99AE",.35,4);knock(o,b,-720);status(o,"stun",.5);status(b,"crit",1)}})}},
{id:"warden",name:"Warden",mono:"WD",rar:"epic",color:"#4CC9F0",hp:135,dmg:9,spd:215,r:24,ab:{name:"Tháp canh",cd:4.5,desc:"Dựng tháp canh ngay tại chỗ (tối đa 2). Tháp tự bắn kẻ địch liên tục trong 9 giây.",
  trigger:b=>{const own=G.balls.filter(c=>c.alive&&c.owner===b&&c.mem.turret);if(own.length>=2)kill(own[0]);const m=spawnMinion(b,{kind:"head",x:b.x,y:b.y,r:11,hp:40*b.sc,dmg:0,life:9,ai:turretAI});m.mem.turret=true;m.mem.px=m.x;m.mem.py=m.y;m.mem.life=9}}},
{id:"crystal",name:"Crystal",mono:"CR",rar:"epic",color:"#A5F3FC",hp:130,dmg:9,spd:220,r:24,ab:{name:"Pha lê vỡ",desc:"Mỗi khi bị đánh, vỡ ra 6 mảnh pha lê bắn tung tóe mọi hướng, nảy tường một lần.",
  onHurt:(b,s,amt,o)=>{if(!o.silent&&!(b.mem.cc>G.t)){b.mem.cc=G.t+.5;const a0=rand(0,TAU);for(let k=0;k<6;k++)shoot(b,{a:a0+k*TAU/6,spd:520,dmg:b.dmg*.4,r:4,life:1.4,bounces:1})}return amt}}},
{id:"graviton",name:"Graviton",mono:"GV",rar:"epic",color:"#9D4EDD",hp:135,dmg:10,spd:215,r:24,ab:{name:"Đảo trọng lực",cd:5,desc:"Bật trọng lực 2.5 giây, kéo kẻ địch dồn về một cạnh sàn. Mỗi lần chúng đập vào cạnh đó mất 8 máu.",
  trigger:b=>{b.mem.gT=G.t+2.5;b.mem.gd=pick([[0,1],[0,-1],[1,0],[-1,0]]);G.tint={c:"#9D4EDD",t:.4};sfx.whoosh()},
  update:(b,dt)=>{if(!(b.mem.gT>G.t))return;const [gx,gy]=b.mem.gd,B=G.bd;for(const o of foes(b)){if(o.kind==="head")continue;o.vx+=gx*900*dt;o.vy+=gy*900*dt;
    const touch=gy>0?o.y+o.r>=B.b-1:gy<0?o.y-o.r<=B.t+1:gx>0?o.x+o.r>=B.r-1:o.x-o.r<=B.l+1;if(touch&&!(o.mem.gh>G.t)){o.mem.gh=G.t+.45;deal(b,o,8*b.sc,{});sparkBurst(o.x,o.y,["#9D4EDD","#ffffff"],14,400)}}},
  draw:(b,c)=>{if(!(b.mem.gT>G.t))return;const [gx,gy]=b.mem.gd,B=G.bd;c.strokeStyle="rgba(199,125,255,.55)";c.lineWidth=2;c.lineCap="round";
    for(let k=0;k<9;k++){const p=(G.t*1.4+k*.37)%1,q=(k+.5)/9;const x=gx?(gx>0?B.l+(B.r-B.l)*p:B.r-(B.r-B.l)*p):B.l+(B.r-B.l)*q,y=gy?(gy>0?B.t+(B.b-B.t)*p:B.b-(B.b-B.t)*p):B.t+(B.b-B.t)*q;c.beginPath();c.moveTo(x,y);c.lineTo(x+gx*22,y+gy*22);c.stroke()}}}},

{id:"omen",name:"Omen",mono:"OM",rar:"epic",color:"#7B6CF6",hp:150,dmg:10,spd:225,r:24,ab:{name:"Màn khói",cd:6,desc:"Toả khói làm chậm và gây 4 sát thương/giây, rồi dịch chuyển sang phía đối diện sàn, miễn nhiễm 0.6 giây và đòn kế tiếp chí mạng.",
  trigger:b=>{const e=E(b);if(!alive(e))return;zone(b,{kind:"smoke",r:95,life:4,slow:.45,dps:4*b.sc,draw:(z,f)=>{glowAt(z.x,z.y,z.r*1.1,"#7B6CF6",.4*f);glowAt(z.x+Math.sin(G.t*3)*12,z.y+Math.cos(G.t*2)*10,z.r*.7,"#B9B0FF",.25*f)}});
    G.ghosts.push({x:b.x,y:b.y,r:b.r,c:b.def.color,t:0,dur:.5});const B=G.bd;b.x=clamp(W-e.x,B.l+b.r+20,B.r-b.r-20);b.y=clamp(H-e.y,B.t+b.r+20,B.b-b.r-20);b.trail=[];status(b,"invuln",.6);status(b,"crit",3);ring(b.x,b.y,4,70,"#7B6CF6",.4,4)}}},
{id:"jett",name:"Jett",mono:"JT",rar:"epic",color:"#BDEBFF",hp:130,dmg:10,spd:235,r:22,ab:{name:"Mưa dao",cd:6.5,desc:"Triệu hồi 5 con dao xoay quanh người, rồi lần lượt phi từng con vào đối thủ (mỗi con khoảng 6 sát thương).",
  trigger:b=>{b.mem.kq=5;b.mem.kw=.7;b.mem.kt=0;floater(b,"MƯA DAO","od");ring(b.x,b.y,b.r,b.r+40,"#BDEBFF",.4,3)},
  update:(b,dt)=>{if(!(b.mem.kq>0))return;if(b.mem.kw>0){b.mem.kw-=dt;return}b.mem.kt-=dt;if(b.mem.kt>0)return;b.mem.kt=.2;const e=E(b);if(!alive(e)){b.mem.kq=0;return}b.mem.kq--;shoot(b,{kind:"quill",spd:900,dmg:b.dmg*.6,r:5,life:1.6,lead:.1,target:e})},
  draw:(b,c)=>{const n=b.mem.kq||0;for(let i=0;i<n;i++){const a=G.t*5+i*TAU/5,x=b.x+Math.cos(a)*(b.r+14),y=b.y+Math.sin(a)*(b.r+14);c.save();c.translate(x,y);c.rotate(a+Math.PI/2);c.fillStyle="#EAF8FF";c.beginPath();c.moveTo(0,-9);c.lineTo(3,5);c.lineTo(0,3);c.lineTo(-3,5);c.closePath();c.fill();c.restore()}}}},
{id:"raze",name:"Raze",mono:"RZ",rar:"epic",color:"#FF6B35",hp:150,dmg:10,spd:225,r:25,ab:{name:"Bom nổ chậm",cd:5,desc:"Ném bom vào chỗ đối thủ sắp tới, nổ sau 0.9 giây gây 21 sát thương, rồi tự lao theo vụ nổ.",
  trigger:b=>{const e=E(b);if(!alive(e))return;blast(b,{x:clamp(e.x+e.vx*.5,40,W-40),y:clamp(e.y+e.vy*.5,40,H-40),fx:b.x,fy:b.y,r:80,delay:.9,dmg:21*b.sc});dashAt(b,.3)}}},
{id:"yoru",name:"Yoru",mono:"YR",rar:"epic",color:"#3A4DFF",hp:145,dmg:11,spd:230,r:23,ab:{name:"Dị chiều",cd:7,desc:"Thả bản sao mồi nhử, rồi xuyên không ra sau lưng đối thủ làm họ rối loạn 0.8 giây; đòn kế tiếp chí mạng.",
  trigger:b=>{const e=E(b);if(!alive(e))return;spawnMinion(b,{kind:"decoy",r:b.r,hp:30*b.sc,dmg:0,life:5});G.ghosts.push({x:b.x,y:b.y,r:b.r,c:b.def.color,t:0,dur:.5});
    const sp=Math.hypot(e.vx,e.vy)||1,B=G.bd;b.x=clamp(e.x-e.vx/sp*(e.r+b.r+25),B.l+b.r+10,B.r-b.r-10);b.y=clamp(e.y-e.vy/sp*(e.r+b.r+25),B.t+b.r+10,B.b-b.r-10);b.trail=[];status(e,"confuse",.8);status(b,"crit",3);ring(b.x,b.y,4,70,"#3A4DFF",.4,4)}}},
{id:"fade",name:"Fade",mono:"FD",rar:"epic",color:"#3D3D5C",hp:135,dmg:10,spd:220,r:25,ab:{name:"Bóng đêm",cd:6,desc:"Xích bóng tối trói đối thủ 3 giây, kèm làm yếu đi 4 giây (-35% sát thương) và chậm 25%.",
  trigger:b=>{const e=E(b);if(!alive(e))return;tether(b,e,3,5*b.sc);status(e,"weak",4);status(e,"slow",3,.25)}}},
{id:"viper",name:"Viper",mono:"VP",rar:"epic",color:"#2ECC71",hp:145,dmg:10,spd:215,r:25,ab:{name:"Màn độc",cd:7,desc:"Phun đám mây độc dưới chân đối thủ: 5 sát thương/giây, chậm 25% trong 5 giây. Va chạm gây nhiễm độc.",
  trigger:b=>{const e=E(b);if(!alive(e))return;zone(b,{kind:"toxic",x:e.x,y:e.y,r:115,life:5,dps:5*b.sc,slow:.25,draw:(z,f)=>{glowAt(z.x,z.y,z.r*1.1,"#2ECC71",.4*f);glowAt(z.x+Math.sin(G.t*2)*14,z.y+Math.cos(G.t*3)*10,z.r*.6,"#8CFF9E",.2*f)}})},
  onHit:(b,t)=>status(t,"poison",3,1.2*b.sc)}},
{id:"killjoy",name:"Killjoy",mono:"KJ",rar:"epic",color:"#FFE14D",hp:150,dmg:10,spd:215,r:24,ab:{name:"Tháp pháo",cd:5,desc:"Luân phiên dựng tháp pháo tự bắn (tối đa 2) và thả bầy nanô cháy dưới chân đối thủ.",
  trigger:b=>{b.mem.k=(b.mem.k||0)+1;
    if(b.mem.k%2){const own=G.balls.filter(c=>c.alive&&c.owner===b&&c.mem.turret);if(own.length>=2)kill(own[0]);const m=spawnMinion(b,{kind:"head",x:b.x,y:b.y,r:11,hp:60*b.sc,dmg:0,life:12,ai:turretAI});m.mem.turret=true;m.mem.px=m.x;m.mem.py=m.y;m.mem.life=12}
    else{const e=E(b);if(alive(e))zone(b,{kind:"fire",x:e.x,y:e.y,r:62,life:3.5,arm:.6,dps:14*b.sc})}}}},
{id:"gekko",name:"Gekko",mono:"GK",rar:"epic",color:"#A4F000",hp:135,dmg:10,spd:225,r:24,ab:{name:"Đội quân con",cd:6.5,desc:"Thả 2 chú cảm tử lao vào đối thủ. Mỗi lần thứ 3 ném thêm quả Mosh Pit nổ diện rộng 12 sát thương.",
  trigger:b=>{b.mem.k=(b.mem.k||0)+1;const e=E(b);for(let k=0;k<2;k++){const m=spawnMinion(b,{kind:"clone",r:10,hp:18*b.sc,dmg:b.dmg*.6,life:9});m.base=b.base*1.15;m.mem.kamikaze=true}
    if(b.mem.k%3===0&&alive(e))blast(b,{x:clamp(e.x+e.vx*.8,40,W-40),y:clamp(e.y+e.vy*.8,40,H-40),fx:b.x,fy:b.y,r:85,delay:1,dmg:12*b.sc})}}},
{id:"waylay",name:"Waylay",mono:"WL",rar:"epic",color:"#F72585",hp:130,dmg:11,spd:240,r:22,ab:{name:"Hồi quang",cd:5,desc:"Lao vút vào đối thủ, 1.1 giây sau bật ngược về chỗ cũ. Va chạm làm chậm 35% trong 1.5 giây.",
  trigger:b=>{b.mem.hx=b.x;b.mem.hy=b.y;b.mem.back=G.t+1.1;dashAt(b,.5)},
  update:b=>{if(b.mem.back&&G.t>=b.mem.back){b.mem.back=0;G.ghosts.push({x:b.x,y:b.y,r:b.r,c:b.def.color,t:0,dur:.5});b.x=clamp(b.mem.hx,G.bd.l+b.r,G.bd.r-b.r);b.y=clamp(b.mem.hy,G.bd.t+b.r,G.bd.b-b.r);b.trail=[];status(b,"haste",1);ring(b.x,b.y,4,60,"#F72585",.35,4)}},
  onHit:(b,t)=>status(t,"slow",1.5,.35)}},
{id:"tempest",name:"Tempest",mono:"TP",rar:"epic",color:"#5AA9E6",hp:135,dmg:10,spd:225,r:24,ab:{name:"Bão sét",cd:7.5,desc:"Gọi 4 tia sét giáng liên tiếp xuống đối thủ, mỗi tia 4.5 sát thương.",
  trigger:b=>{b.mem.zq=4;b.mem.zt=0},
  update:(b,dt)=>{if(!(b.mem.zq>0))return;b.mem.zt-=dt;if(b.mem.zt>0)return;b.mem.zt=.28;const e=E(b);if(!alive(e)){b.mem.zq=0;return}b.mem.zq--;zap(b,e,4.5*b.sc,true)}}},
{id:"anvil",name:"Anvil",mono:"AV",rar:"epic",color:"#9AA0A6",hp:170,dmg:12,spd:195,r:29,ab:{name:"Đe sắt",desc:"Giảm 25% sát thương nhận vào. Cứ cú va thứ 2 làm choáng 0.5 giây và hất văng.",takenMult:.75,
  onHit:(b,t)=>{b.mem.n=(b.mem.n||0)+1;if(b.mem.n%2===0){status(t,"stun",.5);knock(t,b,420)}}}},
{id:"lantern",name:"Lantern",mono:"LT",rar:"epic",color:"#FFD166",hp:135,dmg:10,spd:225,r:23,ab:{name:"Đèn soi",cd:7,desc:"Rọi sáng làm đối thủ yếu đi 4 giây (-35% sát thương) và thả 3 đốm sáng đuổi theo.",
  trigger:b=>{const e=E(b);if(!alive(e))return;status(e,"weak",4);for(let k=-1;k<=1;k++)shoot(b,{homing:4,spd:340,dmg:b.dmg*.6,life:3.5,r:6,a:angTo(b,e)+k*.8})}}},
{id:"maelstrom",name:"Maelstrom",mono:"ML",rar:"epic",color:"#2D6A9F",hp:150,dmg:10,spd:220,r:25,ab:{name:"Sóng thần",cd:8,desc:"Tạo sóng đẩy văng đối thủ ra xa, gây 16 sát thương và làm chậm 40% trong 3 giây.",
  trigger:b=>{const e=E(b);if(!alive(e))return;ring(b.x,b.y,b.r,700,"#2D6A9F",.7,6);knock(e,b,950);deal(b,e,16*b.sc,{crit:true});status(e,"slow",3,.4);G.shake=Math.min(26,G.shake+8)}}},
{id:"gambit",name:"Gambit",mono:"GB",rar:"epic",color:"#E63946",hp:135,dmg:10,spd:225,r:24,ab:{name:"Tung đồng xu",cd:6,desc:"Tung đồng xu: ngửa thì sát thương ×2 trong 3 giây, sấp thì hồi 10% máu và nhận khiên 15.",
  trigger:b=>{if(Math.random()<.5){status(b,"power",3);floater(b,"NGỬA","od")}else{heal(b,b.max*.1,true);b.st.shield=(b.st.shield||0)+15*b.sc;floater(b,"SẤP","od")}}}},
{id:"pulsar",name:"Pulsar",mono:"PS",rar:"epic",color:"#B5179E",hp:150,dmg:10,spd:220,r:25,ab:{name:"Xung từ",desc:"Cứ 1.2 giây phát xung: nếu đối thủ trong tầm 140 thì chịu 8 sát thương và bị đẩy lùi.",
  update:(b,dt)=>{b.mem.pt=(b.mem.pt??1.2)-dt;if(b.mem.pt>0)return;b.mem.pt=1.2;ring(b.x,b.y,b.r,140,"#B5179E",.5,4);const e=E(b);if(alive(e)&&dist(b,e)<140+e.r){deal(b,e,8*b.sc,{});knock(e,b,300)}}}},
{id:"scarab",name:"Scarab",mono:"SB",rar:"epic",color:"#3A86FF",hp:135,dmg:10,spd:225,r:24,ab:{name:"Bọ cánh cứng",cd:7,desc:"Thả 2 con bọ cảm tử lao vào đối thủ và nổ khi chạm.",
  trigger:b=>{for(let k=0;k<2;k++){const m=spawnMinion(b,{kind:"clone",r:10,hp:20*b.sc,dmg:b.dmg*.6,life:9});m.base=b.base*1.2;m.mem.kamikaze=true;m.mem.kdmg=7}}}},
/* ─────────── HUYỀN THOẠI (26) ─────────── */
{id:"blink",name:"Blink",mono:"BL",rar:"legendary",color:"#8C7BFF",hp:130,dmg:11,spd:245,r:22,ab:{name:"Dịch chuyển",cd:3.5,desc:"Biến mất rồi hiện ra sau lưng đối thủ. Cú va kế tiếp gây gấp đôi.",
  trigger:b=>{const e=E(b);if(!alive(e))return;ghostAt(b);const sp=Math.hypot(e.vx,e.vy)||1;let x=e.x-e.vx/sp*(e.r+b.r+60),y=e.y-e.vy/sp*(e.r+b.r+60);
    x=clamp(x,G.bd.l+b.r+4,G.bd.r-b.r-4);y=clamp(y,G.bd.t+b.r+4,G.bd.b-b.r-4);b.x=x;b.y=y;b.trail=[];aimAt(b,e);status(b,"crit",1.6);ring(x,y,4,b.r+30,"#8C7BFF",.4,4);sfx.zap()}}},
{id:"storm",name:"Storm",mono:"ST",rar:"legendary",color:"#5AA9FF",hp:135,dmg:9,spd:225,r:24,ab:{name:"Sét đánh",cd:3.2,desc:"Gọi sét đánh mọi kẻ địch ở bất cứ đâu: 11 sát thương và choáng.",
  trigger:b=>{for(const o of foes(b)){zap(b,o,11*b.sc,true);status(o,"stun",.35)}}}},
{id:"gemini",name:"Gemini",mono:"GM",rar:"legendary",color:"#FF8FB1",hp:150,dmg:12,spd:230,r:25,ab:{name:"Phân thân",cd:8,desc:"Định kỳ tách ra một bản sao biết đánh trong 10 giây. Còn nửa máu thì tách thêm một bản.",
  update:b=>{if(!b.mem.split&&b.hp<=b.max*.5){b.mem.split=true;clone(b)}},trigger:b=>{if(!G.balls.some(c=>c.kind==="clone"&&c.owner===b&&c.alive))clone(b)}}},
{id:"chrono",name:"Chrono",mono:"CH",rar:"legendary",color:"#FFD36E",hp:135,dmg:10,spd:230,r:24,ab:{name:"Ngưng đọng",cd:6.5,desc:"Làm chậm thời gian của đối thủ 2.5 giây: di chuyển và hồi chiêu chỉ còn 40%, bản thân thì tăng tốc.",
  trigger:b=>{for(const o of foes(b))status(o,"chrono",2.5);status(b,"haste",2.5);ring(b.x,b.y,b.r,600,"#FFD36E",.8,3);G.tint={c:"#FFD36E",t:.5}}}},
{id:"rewind",name:"Rewind",mono:"RW",rar:"legendary",color:"#7CFFCB",hp:130,dmg:10,spd:230,r:23,ab:{name:"Tua ngược",desc:"Một lần mỗi hiệp: khi sắp chết, tua lại vị trí và lượng máu của 3 giây trước.",
  update:(b,dt)=>{b.mem.ht=(b.mem.ht||0)-dt;if(b.mem.ht<=0){b.mem.ht=.1;(b.mem.h=b.mem.h||[]).push({x:b.x,y:b.y,hp:b.hp});if(b.mem.h.length>30)b.mem.h.shift()}},
  onDeath:b=>{if(b.mem.used||!b.mem.h||!b.mem.h.length)return false;b.mem.used=true;const o=b.mem.h[0];for(const p of b.mem.h)G.ghosts.push({x:p.x,y:p.y,r:b.r,c:b.def.color,t:0,dur:.8});
    b.x=o.x;b.y=o.y;b.hp=Math.max(b.max*.35,o.hp);b.trail=[];status(b,"invuln",1);floater(b,"TUA NGƯỢC","od");G.tint={c:"#7CFFCB",t:.6};slowmo(.35,.6);return true}}},
{id:"singularity",name:"Singularity",mono:"SG",rar:"legendary",color:"#6B4BFF",hp:135,dmg:10,spd:220,r:24,ab:{name:"Hố đen",cd:6,desc:"Mở hố đen giữa hai bên, hút mạnh kẻ địch vào tâm và nghiền 8 máu/giây trong 3 giây.",
  trigger:b=>{const e=E(b);if(!alive(e))return;zone(b,{kind:"hole",x:(b.x+e.x)/2,y:(b.y+e.y)/2,r:170,life:3,pull:620,dps:8*b.sc})}}},
{id:"phoenix",name:"Phoenix",mono:"PX",rar:"legendary",color:"#FF7A1A",hp:120,dmg:11,spd:235,r:23,ab:{name:"Tái sinh lửa",desc:"Va chạm đốt cháy. Khi chết lần đầu sẽ hồi sinh với 60% máu trong một vụ nổ lửa 24 sát thương.",
  onHit:(b,t)=>status(t,"burn",2,3*b.sc),update:b=>{if(Math.random()<.5)G.parts.push({x:b.x+rand(-b.r,b.r)*.6,y:b.y+rand(-b.r,b.r)*.6,vx:rand(-30,30),vy:rand(-90,-40),life:.5,max:.5,color:Math.random()<.5?"#FF7A1A":"#FFC93C",size:rand(2,4),add:true})},
  onDeath:b=>{if(b.mem.rev)return false;b.mem.rev=true;b.hp=b.max*.6;status(b,"invuln",1.2);explode(b.x,b.y,140,24*b.sc,b,"#FF7A1A");floater(b,"HỒI SINH","od");G.tint={c:"#FF7A1A",t:.6};slowmo(.3,.5);return true}}},
{id:"hydra",name:"Hydra",mono:"HY",rar:"legendary",color:"#2EC4B6",hp:145,dmg:10,spd:215,r:25,ab:{name:"Đa đầu",desc:"Cứ mất 20% máu lại mọc một đầu rắn (tối đa 3), mỗi đầu tự phun độc vào kẻ địch.",
  onHurt:(b,s,amt)=>{b.mem.lost=(b.mem.lost||0)+amt;while(b.mem.lost>=b.max*.2){b.mem.lost-=b.max*.2;if(G.balls.filter(c=>c.kind==="head"&&c.owner===b&&c.alive).length<3)spawnMinion(b,{kind:"head",r:9,hp:30*b.sc,dmg:0,life:99,ai:headAI})}return amt}}},
{id:"joker",name:"Joker",mono:"JK",rar:"legendary",color:"#B4FF39",hp:130,dmg:11,spd:235,r:23,ab:{name:"Đánh tráo",cd:4.5,desc:"Đổi chỗ với đối thủ, làm nó rối loạn 1.5 giây (chạy ngược) và cú va kế tiếp gây gấp đôi.",
  trigger:b=>{const e=E(b);if(!alive(e))return;beam(b.x,b.y,e.x,e.y,"#B4FF39",.35,4);[b.x,e.x]=[e.x,b.x];[b.y,e.y]=[e.y,b.y];b.trail=[];e.trail=[];status(e,"confuse",1.5);status(b,"crit",1.5);aimAt(b,e);ring(b.x,b.y,4,50,"#B4FF39",.4,3);ring(e.x,e.y,4,50,"#B4FF39",.4,3);sfx.zap()}}},

{id:"reaper",name:"Reaper",mono:"RP",rar:"legendary",color:"#B8B8D1",hp:130,dmg:11,spd:235,r:23,ab:{name:"Lưỡi hái",desc:"Cú va gây thêm 8% lượng máu đối thủ đã mất. Đối thủ dưới 15% máu: cú va kế tiếp hành quyết ngay lập tức.",
  preHit:(b,t,i)=>{if(t.kind!=="main")return;if(t.hp<=t.max*.15&&!(t.st.invuln>0)){i.amt=t.hp+999;i.crit=true;floater(t,"HÀNH QUYẾT","crit");G.tint={c:"#B8B8D1",t:.5};slowmo(.2,.6)}else i.amt+=(t.max-t.hp)*.08},
  draw:(b,c)=>{const e=E(b);if(alive(e)&&e.hp<=e.max*.15){c.strokeStyle="#E0E0FF";c.lineWidth=2;c.setLineDash([4,4]);c.beginPath();c.arc(e.x,e.y,e.r+12+Math.sin(G.t*10)*3,0,TAU);c.stroke();c.setLineDash([])}}}},
{id:"tesla",name:"Tesla",mono:"TS",rar:"legendary",color:"#7DF9FF",hp:130,dmg:10,spd:225,r:23,ab:{name:"Hàng rào điện",cd:6,desc:"Căng dây điện cao thế giữa hai bức tường đối diện trong 6 giây. Kẻ địch băng qua dây mất 13 máu và bị choáng.",
  trigger:b=>{const v=Math.random()<.5,B=G.bd,e=E(b);const along=alive(e)?(v?(e.x-B.l)/(B.r-B.l):(e.y-B.t)/(B.b-B.t)):rand(.2,.8);const q=clamp(along+rand(-.12,.12),.1,.9),q2=clamp(q+rand(-.25,.25),.1,.9);
    b.mem.fence=v?{x1:B.l+(B.r-B.l)*q,y1:B.t,x2:B.l+(B.r-B.l)*q2,y2:B.b,t:G.t+6}:{x1:B.l,y1:B.t+(B.b-B.t)*q,x2:B.r,y2:B.t+(B.b-B.t)*q2,t:G.t+6};sfx.zap()},
  update:(b,dt)=>{const f=b.mem.fence;if(!f||f.t<G.t)return;for(const o of foes(b)){if(o.mem.fz>G.t)continue;if(segDist(o.x,o.y,f.x1,f.y1,f.x2,f.y2)<o.r+4){o.mem.fz=G.t+.7;G.bolts.push({x1:f.x1,y1:f.y1,x2:o.x,y2:o.y,t:0,dur:.25,seed:Math.random()*999,c:"#7DF9FF"});deal(b,o,13*b.sc,{});status(o,"stun",.35)}}},
  draw:(b,c)=>{const f=b.mem.fence;if(!f||f.t<G.t)return;glowAt(f.x1,f.y1,34,"#7DF9FF",.8);glowAt(f.x2,f.y2,34,"#7DF9FF",.8);c.strokeStyle="rgba(125,249,255,.9)";c.lineWidth=2.5;c.beginPath();c.moveTo(f.x1,f.y1);
    for(let k=1;k<16;k++){const t=k/16;c.lineTo(f.x1+(f.x2-f.x1)*t+rand(-5,5),f.y1+(f.y2-f.y1)*t+rand(-5,5))}c.lineTo(f.x2,f.y2);c.stroke();c.strokeStyle="rgba(255,255,255,.7)";c.lineWidth=1;c.stroke()}}},
{id:"kraken",name:"Kraken",mono:"KR",rar:"legendary",color:"#E76F51",hp:145,dmg:10,spd:210,r:26,ab:{name:"Xúc tu",cd:3.2,desc:"Xúc tu khổng lồ trồi lên từ bức tường gần đối thủ nhất rồi quất ngang sàn: 18 sát thương và trói 0.7 giây.",
  trigger:b=>{const e=E(b);if(!alive(e))return;const B=G.bd;const ds=[[e.x-B.l,B.l,e.y],[B.r-e.x,B.r,e.y],[e.y-B.t,e.x,B.t],[B.b-e.y,e.x,B.b]].sort((u,v)=>u[0]-v[0]);const x=ds[0][1],y=ds[0][2];
    line(b,{x,y,a:Math.atan2(e.y+e.vy*.4-y,e.x+e.vx*.4-x),delay:.6,w:34,dmg:18*b.sc,kind:"tentacle",onHit:o=>status(o,"stun",.7)})}}},
{id:"valkyrie",name:"Valkyrie",mono:"VK",rar:"legendary",color:"#F1C40F",hp:140,dmg:11,spd:230,r:24,ab:{name:"Thương thần",cd:4,desc:"Gồng 0.5 giây rồi phóng thương với tốc độ gấp ba. Cú đâm gây gấp 2.5 lần và hất văng cực mạnh.",
  trigger:b=>{b.mem.charge=G.t+.5;status(b,"slow",.5,.85);ring(b.x,b.y,b.r+44,b.r,"#F1C40F",.5,3)},
  update:(b,dt)=>{if(b.mem.charge&&G.t>=b.mem.charge){b.mem.charge=0;const e=targetFor(b);if(!alive(e))return;status(b,"dash",.6);b.mem.spear=G.t+.8;const a=angTo(b,e);b.vx=Math.cos(a)*b.base*3.2;b.vy=Math.sin(a)*b.base*3.2;G.shake+=6;sfx.whoosh()}},
  preHit:(b,t,i)=>{if(b.mem.spear>G.t){i.amt*=2.5/1.5;i.crit=true;b.mem.spear=0;knock(t,b,900)}},
  draw:(b,c)=>{if(b.mem.charge){const k=clamp(1-(b.mem.charge-G.t)/.5,0,1);glowAt(b.x,b.y,b.r*(2+k*2),"#F1C40F",.3+k*.5)}
    if(b.mem.spear>G.t){const a=Math.atan2(b.vy,b.vx);c.strokeStyle="#FFF6C2";c.lineWidth=5;c.lineCap="round";c.beginPath();c.moveTo(b.x+Math.cos(a)*b.r,b.y+Math.sin(a)*b.r);c.lineTo(b.x+Math.cos(a)*(b.r+36),b.y+Math.sin(a)*(b.r+36));c.stroke()}}}},

{id:"reyna",name:"Reyna",mono:"RY",rar:"legendary",color:"#C77DFF",hp:150,dmg:12,spd:230,r:25,ab:{name:"Cuồng nộ",cd:6,desc:"Mỗi 6 giây nuốt linh hồn: hút 50% máu theo sát thương gây ra trong 5 giây và tăng tốc 3 giây.",
  trigger:b=>{status(b,"vamp",5);status(b,"haste",3);ring(b.x,b.y,b.r,b.r+60,"#C77DFF",.5,5);floater(b,"CUỒNG NỘ","od")}}},
{id:"chamber",name:"Chamber",mono:"CB",rar:"legendary",color:"#F5F0E1",hp:125,dmg:10,spd:225,r:24,ab:{name:"Bắn tỉa",cd:2.2,desc:"Bắn nhanh đạn nhanh 8 sát thương; mỗi phát thứ 3 là tia ngắm theo dõi gây 20 sát thương.",
  trigger:b=>{const e=E(b);if(!alive(e))return;b.mem.k=(b.mem.k||0)+1;
    if(b.mem.k%3===0)line(b,{x:b.x,y:b.y,a:angTo(b,e),delay:.8,w:20,dmg:20*b.sc,track:b});
    else shoot(b,{spd:850,dmg:b.dmg*.8,r:4,life:1.4,lead:.12})}}},
{id:"skye",name:"Skye",mono:"SY",rar:"legendary",color:"#2EC4B6",hp:150,dmg:10,spd:230,r:24,ab:{name:"Linh khuyển",cd:5.5,desc:"Thả 3 làn sáng tầm nhiệt đuổi theo đối thủ, mỗi làn làm chậm 35% trong 1.5 giây.",
  trigger:b=>{const e=E(b);if(!alive(e))return;for(let k=-1;k<=1;k++)shoot(b,{homing:5,spd:340,dmg:b.dmg*.55,life:4,r:6,pierce:true,a:angTo(b,e)+k*.9,onHit:(p,t)=>status(t,"slow",1.5,.35)})}}},
{id:"astra",name:"Astra",mono:"AS",rar:"legendary",color:"#8E5CF7",hp:155,dmg:11,spd:225,r:24,ab:{name:"Tinh vân",cd:7,desc:"Đặt giếng trọng lực hút đối thủ 2.2 giây, rồi giáng sao băng xuống chỗ đó: 32 sát thương và choáng 1 giây.",
  trigger:b=>{const e=E(b);if(!alive(e))return;const x=clamp(e.x,70,W-70),y=clamp(e.y,70,H-70);zone(b,{kind:"hole",x,y,r:120,life:2.2,pull:430,dps:4*b.sc});
    blast(b,{kind:"meteor",x,y,r:75,delay:1.8,dmg:32*b.sc,after:z=>{for(const o of foes(b))if(Math.hypot(o.x-z.x,o.y-z.y)<z.r+o.r)status(o,"stun",1)}})}}},
{id:"vyse",name:"Vyse",mono:"VY",rar:"legendary",color:"#5EEAD4",hp:155,dmg:11,spd:225,r:25,ab:{name:"Dây gai thép",cd:5.5,desc:"Mọc 3 bụi dây thép quanh đối thủ (tối đa 6): bước vào là chậm 55% và chảy máu 13/giây.",
  trigger:b=>{const e=E(b);if(!alive(e))return;const m=G.zones.filter(z=>z.kind==="vine"&&z.owner===b);while(m.length>3)m.shift().life=0;const a0=rand(0,TAU);for(let k=0;k<3;k++){const a=a0+k*TAU/3;zone(b,{kind:"vine",x:clamp(e.x+Math.cos(a)*85,50,W-50),y:clamp(e.y+Math.sin(a)*85,50,H-50),r:42,life:7,arm:.3,slow:.55,dps:13*b.sc,draw:(z,f)=>{glowAt(z.x,z.y,z.r*1.3,"#5EEAD4",.4*f);glowAt(z.x,z.y,z.r*.6,"#B8FFF2",.3*f)}})}}}},
{id:"tejo",name:"Tejo",mono:"TJ",rar:"legendary",color:"#E76F51",hp:140,dmg:10,spd:225,r:24,ab:{name:"Tên lửa dẫn đường",cd:5,desc:"Phóng 3 tên lửa tự dẫn nổ khi trúng. Mỗi lần thứ 3 thay bằng Armageddon: 4 vụ nổ liên hoàn quanh đối thủ.",
  trigger:b=>{const e=E(b);if(!alive(e))return;b.mem.k=(b.mem.k||0)+1;
    if(b.mem.k%3===0){const a0=rand(0,TAU);for(let k=0;k<4;k++){const a=a0+k*TAU/4;blast(b,{kind:"meteor",x:clamp(e.x+Math.cos(a)*70,40,W-40),y:clamp(e.y+Math.sin(a)*70,40,H-40),r:62,delay:.8+k*.22,dmg:12*b.sc})}floater(b,"ARMAGEDDON","od")}
    else for(let k=-1;k<=1;k++)shoot(b,{skin:"missile",homing:4,spd:360,dmg:b.dmg*.3,life:4,r:7,a:angTo(b,e)+k*.7,onHit:(p,t)=>explode(p.x,p.y,55,6*b.sc,b,"#E76F51",{small:true})})}}},
{id:"cascade",name:"Cascade",mono:"CS",rar:"legendary",color:"#00B4D8",hp:150,dmg:11,spd:225,r:24,ab:{name:"Thác tia",cd:5.5,desc:"Giáng 3 tia nước xuyên sàn nối tiếp nhau qua chỗ đối thủ, mỗi tia 20 sát thương.",
  trigger:b=>{const e=E(b);if(!alive(e))return;const a0=rand(0,TAU);for(let i=0;i<3;i++)line(b,{x:e.x,y:e.y,a:a0+i*.52,kind:"water",both:true,delay:.5+i*.2,w:22,dmg:20*b.sc})}}},
{id:"hex",name:"Hex",mono:"HX",rar:"legendary",color:"#6A0572",hp:140,dmg:10,spd:225,r:24,ab:{name:"Lời nguyền",cd:7,desc:"Nguyền rủa đối thủ: nhiễm độc chồng 3 lớp (5 giây) và yếu đi 4 giây.",
  trigger:b=>{const e=E(b);if(!alive(e))return;for(let k=0;k<3;k++)status(e,"poison",5,1.5*b.sc);status(e,"weak",4);ring(e.x,e.y,e.r,e.r+50,"#B24BF3",.5,4);floater(e,"NGUYỀN","od")}}},
{id:"warp",name:"Warp",mono:"WP",rar:"legendary",color:"#7209B7",hp:140,dmg:10,spd:230,r:24,ab:{name:"Cổng dịch chuyển",cd:5,desc:"Dịch chuyển ra sau lưng đối thủ và nổ 12 sát thương, choáng 0.5 giây.",
  trigger:b=>{const e=E(b);if(!alive(e))return;G.ghosts.push({x:b.x,y:b.y,r:b.r,c:b.def.color,t:0,dur:.5});const sp=Math.hypot(e.vx,e.vy)||1,B=G.bd;b.x=clamp(e.x-e.vx/sp*(e.r+b.r+30),B.l+b.r+10,B.r-b.r-10);b.y=clamp(e.y-e.vy/sp*(e.r+b.r+30),B.t+b.r+10,B.b-b.r-10);b.trail=[];
    explode(b.x,b.y,75,12*b.sc,b,"#7209B7",{small:true});status(e,"stun",.5)}}},
{id:"aegis",name:"Aegis",mono:"AG",rar:"legendary",color:"#FFD6A5",hp:150,dmg:10,spd:220,r:26,ab:{name:"Thánh khiên",cd:8,desc:"Giảm 5% sát thương nhận vào. Mỗi 8 giây bất tử 1 giây và nhận khiên 20.",takenMult:.95,
  trigger:b=>{status(b,"invuln",1);b.st.shield=(b.st.shield||0)+20*b.sc;ring(b.x,b.y,b.r,b.r+50,"#FFD6A5",.6,5)}}},
{id:"cinder",name:"Cinder",mono:"CN",rar:"legendary",color:"#D00000",hp:150,dmg:11,spd:225,r:24,ab:{name:"Mưa lửa",cd:5.5,desc:"Rải 5 vũng lửa quanh đối thủ, mỗi vũng cháy 16 sát thương/giây trong 3.5 giây.",
  trigger:b=>{const e=E(b);if(!alive(e))return;for(let k=0;k<5;k++)zone(b,{kind:"fire",x:clamp(e.x+rand(-110,110),40,W-40),y:clamp(e.y+rand(-110,110),40,H-40),r:56,life:3.5,arm:.3,dps:16*b.sc})}}},
{id:"retort",name:"Retort",mono:"RT",rar:"legendary",color:"#C77D4A",hp:135,dmg:10,spd:225,r:25,ab:{name:"Phản đòn",cd:8,desc:"Phản lại 25% sát thương nhận vào cho kẻ tấn công. Mỗi 8 giây dựng khiên 18.",
  onHurt:(b,src,amt,o)=>{if(src&&src!==b&&src.alive&&!o.silent&&!o.reflected)deal(b,src,amt*.25,{reflected:true});return amt},
  trigger:b=>{b.st.shield=(b.st.shield||0)+18*b.sc;ring(b.x,b.y,b.r,b.r+40,"#C77D4A",.45,4)}}},
{id:"parallax",name:"Parallax",mono:"PL",rar:"legendary",color:"#48CAE4",hp:140,dmg:11,spd:230,r:24,ab:{name:"Ảo ảnh kép",cd:6,desc:"Thả 2 bản sao mồi nhử khiến địch lao nhầm, và tăng tốc 2 giây, đòn kế tiếp chí mạng.",
  trigger:b=>{for(let k=0;k<2;k++)spawnMinion(b,{kind:"decoy",r:b.r,hp:30*b.sc,dmg:0,life:5});status(b,"haste",2);status(b,"crit",3)}}},
/* ─────────── THẦN THOẠI (18) ─────────── */
{id:"nova",name:"Nova",mono:"NV",rar:"mythic",color:"#FF6B3D",hp:150,dmg:11,spd:230,r:25,ab:{name:"Siêu tân tinh",desc:"Mỗi cú va nạp 1 điểm sao. Đủ 4 điểm thì phát nổ 32 sát thương. Khi chết nổ tung lần cuối.",
  onHit:b=>{b.mem.ch=(b.mem.ch||0)+1;if(b.mem.ch>=4){b.mem.ch=0;explode(b.x,b.y,190,32*b.sc,b,"#FF6B3D");slowmo(.35,.4)}},
  onDeath:b=>{explode(b.x,b.y,180,26*b.sc,b,"#FF6B3D");return false},
  draw:(b,c)=>{for(let k=0;k<4;k++){const a=-Math.PI/2+k*Math.PI/2+G.t;c.fillStyle=k<(b.mem.ch||0)?"#FFC23D":"rgba(255,255,255,.2)";c.beginPath();c.arc(b.x+Math.cos(a)*(b.r+10),b.y+Math.sin(a)*(b.r+10),3.5,0,TAU);c.fill()}if(b.mem.ch>=3)glowAt(b.x,b.y,b.r*3,"#FF6B3D",.5+.3*Math.sin(G.t*20))}}},
{id:"eclipse",name:"Eclipse",mono:"EL",rar:"mythic",color:"#7A5CFF",hp:140,dmg:10,spd:220,r:25,ab:{name:"Nhật thực",desc:"Vùng bóng tối lan rộng dần, rút máu kẻ địch bên trong để hồi cho mình.",
  update:(b,dt)=>{b.mem.au=Math.min(175,(b.mem.au||50)+6*dt);for(const o of foes(b)){if(dist(o,b)<b.mem.au+o.r){const d=3.5*b.sc*dt;deal(null,o,d,{silent:true,kind:"dot"});heal(b,d*.6)}}},
  draw:(b,c)=>{const R=b.mem.au||50;const g=c.createRadialGradient(b.x,b.y,R*.3,b.x,b.y,R);g.addColorStop(0,"rgba(20,8,40,.0)");g.addColorStop(.85,"rgba(122,92,255,.18)");g.addColorStop(1,"rgba(122,92,255,.0)");c.fillStyle=g;c.beginPath();c.arc(b.x,b.y,R,0,TAU);c.fill();
    c.strokeStyle="rgba(196,180,255,.55)";c.lineWidth=2;c.setLineDash([6,8]);c.lineDashOffset=G.t*30;c.beginPath();c.arc(b.x,b.y,R,0,TAU);c.stroke();c.setLineDash([])}}},
{id:"meteor",name:"Meteor",mono:"MT",rar:"mythic",color:"#FF8A00",hp:145,dmg:11,spd:225,r:25,ab:{name:"Mưa thiên thạch",cd:5,desc:"Gọi 5 thiên thạch rơi quanh đối thủ, mỗi viên 13 sát thương và để lại hố lửa.",
  trigger:b=>{const e=E(b);if(!alive(e))return;for(let k=0;k<5;k++){const a=rand(0,TAU),d=k?rand(30,120):0;blast(b,{kind:"meteor",x:clamp(e.x+Math.cos(a)*d,G.bd.l+20,G.bd.r-20),y:clamp(e.y+Math.sin(a)*d,G.bd.t+20,G.bd.b-20),r:55,delay:.8+k*.15,dmg:13*b.sc,after:z=>zone(b,{kind:"fire",x:z.x,y:z.y,r:34,life:3,dps:4*b.sc})})}}}},
{id:"mimic",name:"Mimic",mono:"MM",rar:"mythic",color:"#00F5D4",hp:145,dmg:11,spd:230,r:24,ab:{name:"Bắt chước",desc:"Đầu hiệp sao chép kỹ năng của đối thủ và dùng nó mạnh hơn 15%.",
  init:b=>{const e=E(b);if(!e||e.def.id==="mimic")return;b.abSrc=e.def.ab;b.dmg*=1.15;b.cd=(e.def.ab.cd||0)*.5;if(b.abSrc.init)b.abSrc.init(b);floater(b,"SAO CHÉP: "+e.def.ab.name.toUpperCase(),"od")}}},
{id:"monarch",name:"Monarch",mono:"MN",rar:"mythic",color:"#FFD700",hp:150,dmg:11,spd:220,r:25,ab:{name:"Bàn cờ vua",cd:2.8,desc:"Luân phiên ra lệnh Xe (bắn ngang dọc) và Tượng (bắn chéo) xuyên qua vị trí đối thủ, mỗi đường 15 sát thương.",
  trigger:b=>{const e=E(b);if(!alive(e))return;b.mem.k=(b.mem.k||0)+1;const base=b.mem.k%2?0:Math.PI/4;for(const a of [base,base+Math.PI/2])line(b,{x:e.x,y:e.y,a,both:true,delay:.75,w:24,dmg:15*b.sc,kind:"chess"});floater(b,b.mem.k%2?"XE":"TƯỢNG","od")}}},
{id:"paradox",name:"Paradox",mono:"PD",rar:"mythic",color:"#FF2E97",hp:150,dmg:11,spd:235,r:25,ab:{name:"Hỗn mang",cd:2.6,desc:"Mỗi 2.6 giây tung ngẫu nhiên kỹ năng của một quả bóng khác. Va chạm gây hiệu ứng bất kỳ.",
  trigger:b=>{const pool=BALLS.filter(d=>d.ab.trigger&&d.id!=="paradox");const d=pick(pool);floater(b,d.ab.name.toUpperCase(),"od");d.ab.trigger(b)},
  onHit:(b,t)=>{const k=pick(["burn","poison","freeze","bleed","stun","confuse"]);status(t,k,k==="stun"?.3:k==="freeze"?.8:2,2.5*b.sc)},
  draw:b=>{glowAt(b.x,b.y,b.r*2.6,["#FF2E97","#36E2FF","#FFC23D","#5CF2A8"][Math.floor(G.t*8)%4],.5)}}},
{id:"abyss",name:"Abyss",mono:"AB",rar:"mythic",color:"#4A1FD1",hp:150,dmg:11,spd:225,r:25,ab:{name:"Vực thẳm",cd:6,desc:"Rìa sàn sụp thành vực sâu trong 3.5 giây. Kẻ địch sát mép bị hút ra ngoài, mất 9 máu/giây và chậm 50%.",
  trigger:b=>{b.mem.abT=G.t+3.5;G.tint={c:"#4A1FD1",t:.5};ripple(W/2,H/2,20);sfx.boom()},
  update:(b,dt)=>{if(!(b.mem.abT>G.t))return;const B=G.bd,band=80;for(const o of foes(b)){if(o.kind==="head")continue;const dl=o.x-B.l,dr=B.r-o.x,dtp=o.y-B.t,db=B.b-o.y,m=Math.min(dl,dr,dtp,db);
    if(m<band+o.r){dot(o,9*b.sc*dt,"dot");status(o,"slow",.15,.5);if(m===dl)o.vx-=500*dt;else if(m===dr)o.vx+=500*dt;else if(m===dtp)o.vy-=500*dt;else o.vy+=500*dt}}},
  draw:(b,c)=>{if(!(b.mem.abT>G.t))return;const B=G.bd,band=80,left=b.mem.abT-G.t,k=clamp(Math.min(left*2,(3.5-left)*4),0,1);c.save();c.globalAlpha=k;
    for(const [x,y,w,h,x0,y0,x1,y1] of [[B.l,B.t,B.r-B.l,band,0,B.t,0,B.t+band],[B.l,B.b-band,B.r-B.l,band,0,B.b,0,B.b-band],[B.l,B.t,band,B.b-B.t,B.l,0,B.l+band,0],[B.r-band,B.t,band,B.b-B.t,B.r,0,B.r-band,0]]){
      const g=c.createLinearGradient(x0,y0,x1,y1);g.addColorStop(0,"rgba(5,0,15,.95)");g.addColorStop(.6,"rgba(74,31,209,.45)");g.addColorStop(1,"rgba(74,31,209,0)");c.fillStyle=g;c.fillRect(x,y,w,h)}c.restore()}}},
{id:"legion",name:"Legion",mono:"LG",rar:"mythic",color:"#E63946",hp:145,dmg:10,spd:220,r:25,ab:{name:"Quân đoàn",cd:5,desc:"Triệu tập 3 lính cảm tử lao vào đối thủ (tối đa 7). Lính chạm địch là nổ tung.",
  trigger:b=>{const n=G.balls.filter(c=>c.kind==="clone"&&c.owner===b&&c.alive).length;for(let k=0;k<Math.min(3,7-n);k++){const m=spawnMinion(b,{kind:"clone",r:10,hp:18*b.sc,dmg:b.dmg*.6,life:12});m.base=b.base*1.15;m.mem.kamikaze=true}floater(b,"QUÂN ĐOÀN","od")}}},
{id:"doppel",name:"Doppel",mono:"DP",rar:"mythic",color:"#F72585",hp:145,dmg:11,spd:230,r:25,ab:{name:"Gương ma",cd:7,desc:"Triệu hồi bóng ma mang hình dạng và hiệu ứng va chạm của chính đối thủ, chiến đấu cho bạn 9 giây.",
  trigger:b=>{const e=E(b);if(!alive(e))return;const m=spawnMinion(b,{kind:"clone",r:e.r*.8,hp:55*b.sc,dmg:Math.max(b.dmg,e.dmg)*.8,life:9});m.def=e.def;m.base=e.def.spd;m.mem.ghost=true;floater(b,"GƯƠNG MA: "+e.def.name.toUpperCase(),"od");G.tint={c:"#F72585",t:.4}}}},
{id:"iso",name:"Iso",mono:"IS",rar:"mythic",color:"#FFB703",hp:175,dmg:11,spd:230,r:25,ab:{name:"Tuyệt kỹ",cd:13,desc:"Mỗi 13 giây kích hoạt tuyệt kỹ: bất tử 1 giây, sát thương ×2 và tăng tốc 4 giây, kèm sóng nổ 14 sát thương quanh người.",
  trigger:b=>{status(b,"invuln",1);status(b,"power",4);status(b,"haste",4);explode(b.x,b.y,130,14*b.sc,b,"#FFB703");floater(b,"TUYỆT KỸ","od");G.tint={c:"#FFB703",t:.4}}}},
{id:"neon",name:"Neon",mono:"NE",rar:"mythic",color:"#00F0FF",hp:160,dmg:11,spd:235,r:24,ab:{name:"Vệt điện",cd:5,desc:"Mỗi 5 giây phóng vút vào đối thủ, để lại vệt điện cháy 13 sát thương/giây trong 3 giây.",
  trigger:b=>{dashAt(b,.6);b.mem.tr=G.t+.6},
  update:(b,dt)=>{if(b.mem.tr>G.t){b.mem.ta=(b.mem.ta||0)-dt;if(b.mem.ta<=0){b.mem.ta=.06;zone(b,{kind:"arc",r:26,life:3,dps:13*b.sc,draw:(z,f)=>glowAt(z.x,z.y,z.r*1.6,"#00F0FF",.5*f)})}}}}},
{id:"clove",name:"Clove",mono:"CL",rar:"mythic",color:"#FF8FD8",hp:125,dmg:10,spd:230,r:24,ab:{name:"Chưa chết đâu",cd:8,desc:"Lần đầu tử trận sẽ gượng dậy với 40% máu, bất tử 1.5 giây, hút máu và sát thương ×2 trong 6 giây. Mỗi 8 giây làm đối thủ yếu đi 4 giây và hồi 10 máu.",
  trigger:b=>{const e=E(b);if(alive(e))status(e,"weak",4);heal(b,10*b.sc,true)},
  onDeath:b=>{if(b.mem.rev)return false;b.mem.rev=true;b.hp=b.max*.4;status(b,"invuln",1.5);status(b,"power",6);status(b,"vamp",6);floater(b,"CHƯA CHẾT ĐÂU","od");G.tint={c:"#FF8FD8",t:.6};slowmo(.3,.5);return true}}},
{id:"veto",name:"Veto",mono:"VE",rar:"mythic",color:"#6B7280",hp:130,dmg:10,spd:225,r:26,ab:{name:"Tiến hoá",cd:9,desc:"Giảm 5% sát thương nhận vào, mỗi cú va tăng 0.9 sát thương (tối đa +5). Mỗi 9 giây tiến hoá: hồi 10% máu, xoá hiệu ứng xấu, bất tử 0.8 giây, sát thương ×2 trong 4 giây.",takenMult:.95,
  onHit:b=>{b.mem.grow=Math.min(5,(b.mem.grow||0)+.9)},
  trigger:b=>{heal(b,b.max*.1,true);for(const k of ["freeze","stun","slow","confuse","weak","burn","bleed","poison","silence"])b.st[k]=0;status(b,"invuln",.8);status(b,"power",4);ring(b.x,b.y,b.r,b.r+60,"#9CA3AF",.5,5)}}},
{id:"cataclysm",name:"Cataclysm",mono:"CA",rar:"mythic",color:"#FF3D00",hp:160,dmg:12,spd:225,r:25,ab:{name:"Đại hồng thuỷ lửa",cd:9,desc:"Gọi thiên thạch khổng lồ giáng xuống đối thủ sau 1.4 giây (48 sát thương) cùng 4 mảnh nhỏ bao quanh.",
  trigger:b=>{const e=E(b);if(!alive(e))return;blast(b,{kind:"meteor",x:clamp(e.x,70,W-70),y:clamp(e.y,70,H-70),r:190,delay:1.4,dmg:48*b.sc});for(let k=0;k<4;k++){const a=k*TAU/4+.4;blast(b,{kind:"meteor",x:clamp(e.x+Math.cos(a)*150,40,W-40),y:clamp(e.y+Math.sin(a)*150,40,H-40),r:55,delay:.8+k*.2,dmg:12*b.sc})}}}},
{id:"overmind",name:"Overmind",mono:"OV",rar:"mythic",color:"#9D4EDD",hp:160,dmg:12,spd:225,r:24,ab:{name:"Thao túng",cd:7,desc:"Chiếm thần trí đối thủ: rối loạn 2.5 giây, choáng 0.6 giây, yếu đi 4 giây, đồng thời hiện 2 phân thân hỗ trợ.",
  trigger:b=>{const e=E(b);if(!alive(e))return;status(e,"confuse",2.5);status(e,"stun",.6);status(e,"weak",4);for(let k=0;k<2;k++)spawnMinion(b,{kind:"clone",r:b.r*.6,hp:40*b.sc,dmg:b.dmg*.5,life:9});G.tint={c:"#9D4EDD",t:.4}}}},
{id:"solstice",name:"Solstice",mono:"SL",rar:"mythic",color:"#FFC300",hp:170,dmg:10,spd:225,r:25,ab:{name:"Ngày và đêm",desc:"Cứ 6 giây đổi pha. Ngày: sát thương +50%, nhanh +20%. Đêm: nhận ít sát thương hơn 40% và hồi 3 máu/giây.",
  init:b=>{b.dmgMul=1.5;b.speedMul=1.2},
  update:(b,dt)=>{b.mem.pt=(b.mem.pt??6)-dt;if(b.mem.pt<=0){b.mem.pt=6;b.mem.night=b.mem.night?0:1;b.dmgMul=b.mem.night?.9:1.5;b.speedMul=b.mem.night?.9:1.2;ring(b.x,b.y,b.r,b.r+70,b.mem.night?"#7A8CFF":"#FFC300",.6,5);floater(b,b.mem.night?"ĐÊM":"NGÀY","od")}if(b.mem.night)heal(b,3*b.sc*dt)},
  onHurt:(b,src,amt)=>amt*(b.mem.night?.6:1.1)}},
{id:"leviathan",name:"Leviathan",mono:"LV",rar:"mythic",color:"#0077B6",hp:180,dmg:11,spd:190,r:34,ab:{name:"Sóng cuộn",cd:4.5,desc:"Khổng lồ và lì đòn. Mỗi 4.5 giây tung làn sóng ngắm theo đối thủ: 18 sát thương. Cú va hất văng đối thủ.",
  trigger:b=>{const e=E(b);if(!alive(e))return;line(b,{kind:"wave",x:b.x,y:b.y,a:angTo(b,e),delay:.6,w:56,dmg:18*b.sc,track:b})},
  onHit:(b,t)=>knock(t,b,260)}},
{id:"genesis",name:"Genesis",mono:"GN",rar:"mythic",color:"#80ED99",hp:145,dmg:10,spd:225,r:25,ab:{name:"Khởi nguyên",cd:10,desc:"Mỗi 10 giây sinh ra 3 chiến binh xanh biết đánh trong 8 giây, hồi 12% máu và tăng tốc 2 giây.",
  trigger:b=>{for(let k=0;k<3;k++)spawnMinion(b,{kind:"clone",r:b.r*.6,hp:40*b.sc,dmg:b.dmg*.55,life:8});heal(b,b.max*.12,true);status(b,"haste",2);ring(b.x,b.y,b.r,b.r+70,"#80ED99",.6,5)}}},
];
/* Cân bằng sau mô phỏng hàng nghìn trận: [hệ số máu, hệ số sát thương] */
const TUNE={pebble:[1.1,1.15],zippy:[1.2,1.2],brick:[1.05,1.25],clover:[1.15,1.1],echo:[1.15,1.15],gum:[1.15,1.2],pip:[1.05,1.1],spark:[.88,.9],
  lodestone:[1.15,1.2],magma:[1.35,1.35],fang:[1.15,1.2],siren:[1.15,1.2],volt:[1.1,1.15],tide:[1.1,1.1],frost:[1.1,1.1],
  shackle:[1.15,1.2],glacier:[1.2,1.2],crystal:[1.2,1.2],inferno:[1.2,1.15],titan:[1.15,1.15],hook:[1.1,1.1],mirage:[1.1,1.15],
  rewind:[1.2,1.2],singularity:[1.2,1.2],chrono:[1.15,1.15],joker:[1.1,1.1],meteor:[1.25,1.2]};
for(const b of BALLS){const t=TUNE[b.id];if(t){b.hp=Math.round(b.hp*t[0]);b.dmg=Math.round(b.dmg*t[1]*10)/10}}
const BY_ID=Object.fromEntries(BALLS.map(b=>[b.id,b]));

const CRATES={
 basic:{name:"Rương Neon",cur:"coins",cost:300,color:"#3FA9FF",desc:"Ra đủ mọi độ hiếm.",rates:{common:58,rare:30,epic:9,legendary:2.6,mythic:.4},pity:{n:10,min:"epic"}},
 premium:{name:"Rương Plasma",cur:"coins",cost:900,color:"#B86CFF",desc:"Không có bóng Thường. Sử thi rơi nhiều.",rates:{rare:55,epic:33,legendary:10,mythic:2},pity:{n:12,min:"legendary"}},
 star:{name:"Rương Siêu Sao",cur:"gems",cost:60,color:"#FF4D7A",desc:"Chỉ Sử thi trở lên. Mở bằng Gems.",rates:{epic:68,legendary:26,mythic:6},pity:{n:15,min:"mythic"}},
};
const REFUND={common:60,rare:120,epic:250,legendary:500,mythic:900};
const CODES={WELCOME:{coins:500},ORBCLASH:{gems:40},LUCKYORB:{coins:1000,gems:20},NEONRUSH:{gems:60},
  /* code ẩn: không hiện trong gợi ý */
  LONGDEPTRAI:{gems:1000},TRANDUCLONG:{coins:5000}};
const DIFF={
 easy:{name:"Dễ",mult:.6,pool:["common","rare"],lv:-99,note:"Bot bóng yếu"},
 normal:{name:"Thường",mult:1,pool:["common","rare","epic","legendary"],lv:0,note:"Ngang cấp bạn"},
 hard:{name:"Khó",mult:1.6,pool:RARS,lv:3,note:"Bot +3 cấp"},
};
const REROLL_COST=10;
