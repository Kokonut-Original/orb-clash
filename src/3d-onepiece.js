
/* ═════════════════════════════════════════════════════════════
   50 BÓNG ONE PIECE — tên là người sở hữu trái ác quỷ, kỹ năng mang tên trái.
   Luffy có đủ 5 Gear: Gear 1 (Thường) → Gear 5 (Thần thoại).
   call: các câu hô tên chiêu hiện chữ to kiểu anime khi cast.
   ═════════════════════════════════════════════════════════════ */
/** cánh tay cao su / đòn vươn dài: tia từ bóng tới đối thủ + nắm đấm */
function opArm(b,e,dmg,o={}){
  if(!alive(e))return;const c=o.c||"#F2C29B";
  beam(b.x,b.y,e.x,e.y,c,.22,o.w||9);beam(b.x,b.y,e.x,e.y,"#ffffff",.12,(o.w||9)*.35);
  ring(e.x,e.y,6,(o.big?60:34),c,.35,o.big?8:5);G.flashes.push({x:e.x,y:e.y,r:o.big?120:60,t:0,dur:.2,c:"#ffffff"});
  deal(b,e,dmg,{crit:!!o.big});if(o.knock)knock(e,b,o.knock);if(o.stun)status(e,"stun",o.stun);
  G.shake=Math.min(26,G.shake+(o.big?12:5));sfx.hit(dmg,!!o.big);
}
function opQueue(b,n,gap,fn){b.mem.q=n;b.mem.qt=0;b.mem.qg=gap;b.mem.qf=fn}
function opQueueStep(b,dt){if(!(b.mem.q>0))return;b.mem.qt-=dt;if(b.mem.qt>0)return;b.mem.qt=b.mem.qg;b.mem.q--;const e=E(b);if(alive(e)&&b.mem.qf)b.mem.qf(b,e)}
const OPB=[
/* ─────────── THƯỜNG ─────────── */
{id:"luffy1",name:"Luffy G1",mono:"L1",rar:"common",color:"#E03A3A",el:"earth",hp:135,dmg:9,spd:225,r:24,call:["GOMU GOMU NO... PISTOL!","GOMU GOMU NO... WHIP!"],ab:{name:"Gomu Gomu no Mi",cd:3.2,desc:"Gear 1. Vươn tay cao su đấm thẳng từ xa: 10 sát thương, hất lùi đối thủ.",
  trigger:b=>opArm(b,E(b),10*b.sc,{knock:280})}},
{id:"buggy",name:"Buggy",mono:"BG",rar:"common",color:"#3A6FE0",el:"steel",hp:125,dmg:8,spd:220,r:23,call:["BARA BARA FESTIVAL!","BARA BARA HOU!"],ab:{name:"Bara Bara no Mi",cd:5,desc:"Tách cơ thể thành 3 mảnh nhỏ biết cắn trong 5 giây. Nội tại: 20% đòn chém đâm xuyên qua người.",
  trigger:b=>{for(let k=0;k<3;k++)spawnMinion(b,{kind:"clone",r:b.r*.45,hp:18*b.sc,dmg:b.dmg*.5,life:5})},
  onHurt:(b,src,amt,o)=>{if(src&&!o.silent&&Math.random()<.2){floater(b,"BARA!","od");return amt*.2}return amt}}},
{id:"alvida",name:"Alvida",mono:"AV",rar:"common",color:"#F2A7D8",el:"wind",hp:125,dmg:9,spd:240,r:23,call:["SUBE SUBE!"],ab:{name:"Sube Sube no Mi",desc:"Da trơn tuột: 25% đòn đánh trượt khỏi người, mỗi lần trượt được tăng tốc 1 giây.",
  onHurt:(b,src,amt,o)=>{if(src&&!o.silent&&Math.random()<.25){floater(b,"TRƯỢT","od");status(b,"haste",1);return 0}return amt}}},
{id:"mr3",name:"Mr. 3",mono:"M3",rar:"common",color:"#F5F0D0",el:"earth",hp:130,dmg:8,spd:215,r:24,call:["DORU DORU NO... CANDLE LOCK!","DORU DORU ARTS!"],ab:{name:"Doru Doru no Mi",cd:6,desc:"Bắn sáp nến: trúng là đối thủ bị đông cứng 1.1 giây.",
  trigger:b=>shoot(b,{spd:480,dmg:b.dmg*.5,r:7,lead:.15,c:"#F5F0D0",onHit:(p,t)=>status(t,"freeze",1.1)})}},
{id:"wapol",name:"Wapol",mono:"WP",rar:"common",color:"#7A9BD8",el:"steel",hp:150,dmg:9,spd:200,r:27,call:["BAKU BAKU MUNCH!"],ab:{name:"Baku Baku no Mi",desc:"Ăn tất: hồi 35% sát thương gây ra khi va chạm.",
  onHit:(b,t,i)=>{if(i.dealt>0)heal(b,i.dealt*.35,true)}}},
{id:"mr5",name:"Mr. 5",mono:"M5",rar:"common",color:"#4A4A5A",el:"fire",hp:125,dmg:8,spd:220,r:23,call:["NOSE FANCY CANNON!","BOMU BOMU!"],ab:{name:"Bomu Bomu no Mi",cd:4,desc:"Búng gỉ mũi phát nổ khi trúng (9 sát thương diện rộng).",
  trigger:b=>shoot(b,{spd:420,dmg:b.dmg*.3,r:5,lead:.1,onHit:(p,t)=>explode(p.x,p.y,60,9*b.sc,b,"#FF7A3A",{small:true})})}},
{id:"valentine",name:"Miss Valentine",mono:"MV",rar:"common",color:"#FFD86B",el:"wind",hp:120,dmg:9,spd:230,r:22,call:["10.000 KILO PRESS!","KILO KILO!"],ab:{name:"Kilo Kilo no Mi",cd:4.5,desc:"Tăng trọng lượng lên 10.000 kg: cú va kế tiếp trong 2 giây gây gấp đôi sát thương và hất văng.",
  trigger:b=>{status(b,"power",2);b.mem.heavy=G.t+2},onHit:(b,t)=>{if(b.mem.heavy>G.t){knock(t,b,520);b.mem.heavy=0}}}},
{id:"chopper",name:"Chopper",mono:"CP",rar:"common",color:"#C98B5E",el:"nature",hp:140,dmg:8,spd:215,r:24,call:["RUMBLE!","MONSTER POINT!","HEAVY POINT!"],ab:{name:"Hito Hito no Mi",cd:7,desc:"Nuốt Rumble Ball, biến hình ngẫu nhiên 4 giây: Heavy (khiên 20), Jumping (nhanh), Arm (sát thương ×2). Hồi 10 máu.",
  trigger:b=>{const k=Math.floor(Math.random()*3);if(k===0)b.st.shield=(b.st.shield||0)+20*b.sc;else if(k===1)status(b,"haste",4);else status(b,"power",4);heal(b,10*b.sc,true)}}},
{id:"bentham",name:"Bentham",mono:"BT",rar:"common",color:"#E8A8E0",el:"arcane",hp:125,dmg:9,spd:225,r:23,call:["MANE MANE MONTAGE!"],ab:{name:"Mane Mane no Mi",cd:6,desc:"Biến thành đối thủ trong giây lát và tung kỹ năng của họ; nếu họ không có chiêu thì đòn kế tiếp chí mạng.",
  trigger:b=>{const e=E(b);const ab=e&&abOf(e);if(ab&&ab.trigger&&e.def.id!=="bentham"){try{ab.trigger(b)}catch(err){}}else status(b,"crit",3)}}},
{id:"kaku",name:"Kaku",mono:"KK",rar:"common",color:"#E8C35A",el:"wind",hp:135,dmg:9,spd:220,r:24,call:["RANKYAKU!","RANKYAKU: AMANEDACHI!"],ab:{name:"Ushi Ushi no Mi: Hươu cao cổ",cd:4,desc:"Đá ra lưỡi gió chém thẳng qua đối thủ: 12 sát thương.",
  trigger:b=>{const e=E(b);if(alive(e))line(b,{x:b.x,y:b.y,a:angTo(b,e),delay:.45,w:16,dmg:12*b.sc})}}},
/* ─────────── HIẾM ─────────── */
{id:"luffy2",name:"Luffy G2",mono:"L2",rar:"rare",color:"#FF5A7A",el:"fire",hp:135,dmg:9,spd:240,r:24,call:["GEAR SECOND!","JET PISTOL!","JET GATLING!"],ab:{name:"Gomu Gomu no Mi",cd:4.5,desc:"Gear 2. Bơm máu toả hơi nước: tăng tốc 3 giây và tung 3 cú Jet Pistol liên tiếp (mỗi cú 7).",
  trigger:b=>{status(b,"haste",3);opQueue(b,3,.18,(b,e)=>opArm(b,e,7*b.sc,{knock:150,c:"#FF8FA8",w:7}))},
  update:(b,dt)=>{opQueueStep(b,dt);if(b.st.haste>0&&Math.random()<dt*20)G.parts.push({x:b.x+rand(-b.r,b.r),y:b.y-b.r*.4,vx:rand(-20,20),vy:rand(-90,-40),life:.6,max:.6,color:"#FFE0E8",size:rand(3,6)})}}},
{id:"smoker",name:"Smoker",mono:"SM",rar:"rare",color:"#D8D8E0",el:"dark",hp:145,dmg:9,spd:215,r:25,call:["WHITE BLOW!","WHITE OUT!"],ab:{name:"Moku Moku no Mi",cd:6,desc:"Logia khói: giảm 15% sát thương nhận vào. Trói đối thủ bằng khói 3 giây, siết 4 máu/giây và làm chậm.",takenMult:.85,
  trigger:b=>{const e=E(b);if(!alive(e))return;tether(b,e,3,4*b.sc);status(e,"slow",3,.3);zone(b,{kind:"smoke",x:e.x,y:e.y,r:70,life:2.5,slow:.3})}}},
{id:"robin",name:"Nico Robin",mono:"NR",rar:"rare",color:"#6A4C93",el:"nature",hp:130,dmg:9,spd:220,r:23,call:["CIEN FLEUR... CLUTCH!","DOS FLEUR!"],ab:{name:"Hana Hana no Mi",cd:5,desc:"Mọc trăm cánh tay trên người đối thủ: khoá chặt 1 giây và bẻ 12 sát thương.",
  trigger:b=>{const e=E(b);if(!alive(e))return;status(e,"stun",1);deal(b,e,12*b.sc,{crit:true});for(let k=0;k<10;k++){const a=k*TAU/10;G.parts.push({x:e.x+Math.cos(a)*e.r,y:e.y+Math.sin(a)*e.r,vx:Math.cos(a)*90,vy:Math.sin(a)*90,life:.6,max:.6,color:"#FF9AD8",size:4,chunk:true,rot:a,vr:4})}}}},
{id:"brook",name:"Brook",mono:"BK",rar:"rare",color:"#EDE6D6",el:"ice",hp:120,dmg:9,spd:230,r:23,call:["YOHOHOHO!","HANAUTA SANCHO: YAHAZU GIRI!","SOUL SOLID!"],ab:{name:"Yomi Yomi no Mi",cd:5,desc:"Lần đầu tử trận sẽ sống lại với 40% máu. Chém kiếm linh hồn lạnh buốt: 9 sát thương, đóng băng 0.8 giây.",
  trigger:b=>{const e=E(b);if(!alive(e))return;deal(b,e,9*b.sc,{crit:true});status(e,"freeze",.8);ring(e.x,e.y,e.r,e.r+40,"#BDEBFF",.4,4)},
  onDeath:b=>{if(b.mem.rev)return false;b.mem.rev=true;b.hp=b.max*.4;status(b,"invuln",1.2);floater(b,"YOHOHOHO!","od");return true}}},
{id:"perona",name:"Perona",mono:"PR",rar:"rare",color:"#FF8FC7",el:"dark",hp:125,dmg:9,spd:220,r:23,call:["NEGATIVE HOLLOW!","HORO HORO HORO!"],ab:{name:"Horo Horo no Mi",cd:5,desc:"Thả 2 hồn ma tiêu cực đuổi theo: trúng là đối thủ suy sụp (yếu đi 35%) và chậm lại 3 giây.",
  trigger:b=>{const e=E(b);if(!alive(e))return;for(const k of[-.6,.6])shoot(b,{homing:3.5,spd:300,dmg:b.dmg*.4,life:4,r:8,c:"#F2F2FF",a:angTo(b,e)+k,onHit:(p,t)=>{status(t,"weak",3);status(t,"slow",3,.3);floater(t,"XIN LỖI VÌ ĐÃ SINH RA...","od")}})}}},
{id:"daz",name:"Daz Bones",mono:"DB",rar:"rare",color:"#C9D1E2",el:"steel",hp:140,dmg:10,spd:215,r:24,call:["SPIDER!","ATOMIC SPAR!"],ab:{name:"Supa Supa no Mi",cd:5,desc:"Thân thể thép: phản 25% sát thương va chạm. Xoay lưỡi kiếm quanh người: 10 sát thương và chảy máu.",
  onHurt:(b,src,amt,o)=>{if(src&&src!==b&&src.alive&&!o.silent&&!o.reflected&&o.contact)deal(b,src,amt*.25,{reflected:true});return amt},
  trigger:b=>{const e=E(b);ring(b.x,b.y,b.r,b.r+70,"#E8EEFF",.35,4);sparkBurst(b.x,b.y,["#fff","#C9D1E2"],30,600);if(alive(e)&&dist(b,e)<b.r+e.r+90){deal(b,e,10*b.sc,{});status(e,"bleed",3,2*b.sc)}}}},
{id:"caesar",name:"Caesar",mono:"CC",rar:"rare",color:"#9A7AD8",el:"poison",hp:130,dmg:9,spd:215,r:24,call:["GASTANET!","SHUROROROROR!"],ab:{name:"Gasu Gasu no Mi",cd:6,desc:"Phun khí độc quanh đối thủ (6 sát thương/giây), sau 1.5 giây châm nổ: 12 sát thương.",
  trigger:b=>{const e=E(b);if(!alive(e))return;zone(b,{kind:"toxic",x:e.x,y:e.y,r:90,life:2,dps:6*b.sc,slow:.2});blast(b,{x:e.x,y:e.y,fx:b.x,fy:b.y,r:90,delay:1.5,dmg:12*b.sc})}}},
{id:"jozu",name:"Jozu",mono:"JZ",rar:"rare",color:"#B8F1FF",el:"earth",hp:160,dmg:10,spd:195,r:28,call:["DIAMOND JOZU!","BRILLIANT PUNK!"],ab:{name:"Kira Kira no Mi",desc:"Thân kim cương: giảm 30% sát thương nhận vào, mỗi cú va hất văng đối thủ.",takenMult:.7,
  onHit:(b,t)=>knock(t,b,320)}},
{id:"bonney",name:"Bonney",mono:"BN",rar:"rare",color:"#FF7AA8",el:"arcane",hp:130,dmg:9,spd:225,r:23,call:["TOSHI TOSHI!","AGE LOOKING!"],ab:{name:"Toshi Toshi no Mi",cd:6,desc:"Hoán đổi tuổi tác: đối thủ già đi (yếu 35%, chậm 30% trong 3 giây), bản thân trẻ lại (hồi 10 máu).",
  trigger:b=>{const e=E(b);if(alive(e)){status(e,"weak",3);status(e,"slow",3,.3);floater(e,"GIÀ ĐI!","od")}heal(b,10*b.sc,true)}}},
{id:"sugar",name:"Sugar",mono:"SG",rar:"rare",color:"#7AC8FF",el:"arcane",hp:120,dmg:9,spd:225,r:22,call:["HOBI HOBI!","YOU'RE A TOY NOW!"],ab:{name:"Hobi Hobi no Mi",cd:8,desc:"Chạm biến đối thủ thành đồ chơi: choáng 1.4 giây và yếu đi 3 giây.",
  trigger:b=>{const e=E(b);if(!alive(e))return;status(e,"stun",1.4);status(e,"weak",3);floater(e,"ĐỒ CHƠI!","od");burst(e.x,e.y,"#FFD86B",20,260,3)}}},
/* ─────────── SỬ THI ─────────── */
{id:"luffy3",name:"Luffy G3",mono:"L3",rar:"epic",color:"#E03A3A",el:"earth",hp:145,dmg:10,spd:215,r:25,call:["GEAR THIRD!","ELEPHANT GUN!","GIGANT PISTOL!"],ab:{name:"Gomu Gomu no Mi",cd:5.5,desc:"Gear 3. Thổi phồng nắm đấm khổng lồ: Elephant Gun nện xuống chỗ đối thủ sau 0.45 giây, 22 sát thương và hất văng.",
  trigger:b=>{const e=E(b);if(!alive(e))return;beam(b.x,b.y,e.x,e.y,"#F2C29B",.5,14);blast(b,{x:e.x,y:e.y,fx:b.x,fy:b.y,r:85,delay:.45,dmg:22*b.sc,after:z=>{for(const o of foes(b))if(Math.hypot(o.x-z.x,o.y-z.y)<z.r+o.r)knock(o,{x:z.x,y:z.y},600)}})}}},
{id:"ace",name:"Portgas D. Ace",mono:"AC",rar:"epic",color:"#FF6A1A",el:"fire",hp:140,dmg:10,spd:225,r:24,call:["HIKEN!","HIBASHIRA!","ENTEI!"],ab:{name:"Mera Mera no Mi",cd:5,desc:"Hoả Quyền: cột lửa thẳng tới đối thủ, 18 sát thương và gây bỏng. Để lại vệt lửa trên sàn.",
  trigger:b=>{const e=E(b);if(!alive(e))return;line(b,{x:b.x,y:b.y,a:angTo(b,e),delay:.5,w:34,dmg:18*b.sc,onHit:o=>status(o,"burn",3,3*b.sc)});zone(b,{kind:"fire",x:(b.x+e.x)/2,y:(b.y+e.y)/2,r:55,life:2.5,arm:.5,dps:7*b.sc})}}},
{id:"crocodile",name:"Crocodile",mono:"CR",rar:"epic",color:"#D8A86B",el:"earth",hp:150,dmg:10,spd:210,r:25,call:["DESERT SPADA!","SABLES!","GROUND SECCO!"],ab:{name:"Suna Suna no Mi",cd:5.5,desc:"Lưỡi cát xé đất về phía đối thủ (16 sát thương) và hút khô: hồi 50% sát thương gây ra.",
  trigger:b=>{const e=E(b);if(!alive(e))return;line(b,{x:b.x,y:b.y,a:angTo(b,e),delay:.55,w:22,dmg:16*b.sc,onHit:o=>heal(b,8*b.sc,true)});zone(b,{kind:"sand",x:e.x,y:e.y,r:80,life:3,slow:.35})}}},
{id:"lucci",name:"Rob Lucci",mono:"RL",rar:"epic",color:"#E8C35A",el:"steel",hp:145,dmg:11,spd:225,r:25,call:["ROKUOGAN!","SHIGAN!","TEKKAI!"],ab:{name:"Neko Neko no Mi: Báo",cd:5,desc:"Lao vụt tới rồi nổ Lục Vương Thương ở cự ly gần: 18 sát thương diện rộng.",
  trigger:b=>{dashAt(b,.35);b.mem.rk=G.t+.3},update:b=>{if(b.mem.rk&&G.t>=b.mem.rk){b.mem.rk=0;explode(b.x,b.y,95,18*b.sc,b,"#FFF2C0")}}}},
{id:"law",name:"Trafalgar Law",mono:"LW",rar:"epic",color:"#4CC9F0",el:"arcane",hp:140,dmg:10,spd:225,r:24,call:["ROOM!","SHAMBLES!","GAMMA KNIFE!"],ab:{name:"Ope Ope no Mi",cd:6.5,desc:"Dựng ROOM, Shambles hoán đổi vị trí với đối thủ rồi đâm Gamma Knife xuyên khiên: 18 sát thương.",
  trigger:b=>{const e=E(b);if(!alive(e))return;zone(b,{kind:"room",x:b.x,y:b.y,r:160,life:1.2});beam(b.x,b.y,e.x,e.y,"#4CC9F0",.3,3);[b.x,e.x]=[e.x,b.x];[b.y,e.y]=[e.y,b.y];b.trail=[];e.trail=[];
    const sh=e.st.shield||0;e.st.shield=0;deal(b,e,18*b.sc,{crit:true});e.st.shield=sh;status(e,"confuse",.8)}}},
{id:"moria",name:"Gecko Moria",mono:"GM",rar:"epic",color:"#7A5CC8",el:"dark",hp:150,dmg:10,spd:205,r:27,call:["BRICK BAT!","SHADOW'S ASGARD!","KISHISHISHI!"],ab:{name:"Kage Kage no Mi",cd:7,desc:"Cắt bóng của đối thủ, biến thành chiến binh bóng tối mang chiêu của họ chiến đấu 7 giây; kèm bầy dơi đuổi theo.",
  trigger:b=>{const e=E(b);if(!alive(e))return;const m=spawnMinion(b,{kind:"clone",r:e.r*.75,hp:45*b.sc,dmg:Math.max(b.dmg,e.dmg)*.6,life:7});m.def=e.def;m.base=e.def.spd;m.mem.ghost=true;
    for(const k of[-.5,0,.5])shoot(b,{homing:3,spd:320,dmg:b.dmg*.25,life:3,r:5,c:"#2A1050",a:angTo(b,e)+k})}}},
{id:"doflamingo",name:"Doflamingo",mono:"DF",rar:"epic",color:"#FF5AA8",el:"steel",hp:140,dmg:10,spd:225,r:24,call:["OVERHEAT!","GOSHIKIITO!","FUFUFUFU!"],ab:{name:"Ito Ito no Mi",cd:6,desc:"Giăng chỉ trói đối thủ 2.5 giây rồi quất 5 sợi chỉ xé ngang sàn qua chỗ họ, mỗi sợi 7 sát thương.",
  trigger:b=>{const e=E(b);if(!alive(e))return;tether(b,e,2.5,3*b.sc);for(let i=0;i<5;i++)line(b,{x:e.x,y:e.y,a:i*Math.PI/5+rand(0,.3),both:true,delay:.7+i*.08,w:8,dmg:7*b.sc})}}},
{id:"magellan",name:"Magellan",mono:"MG",rar:"epic",color:"#8A2BE2",el:"poison",hp:155,dmg:10,spd:205,r:27,call:["HYDRA!","VENOM DEMON!"],ab:{name:"Doku Doku no Mi",cd:5,desc:"Thả rồng độc 3 đầu đuổi theo đối thủ, mỗi đầu gây nhiễm độc chồng lớp. Va chạm cũng gây độc.",
  trigger:b=>{const e=E(b);if(!alive(e))return;for(const k of[-.7,0,.7])shoot(b,{kind:"spit",homing:3.5,spd:330,dmg:b.dmg*.3,life:4,r:7,c:"#8A2BE2",a:angTo(b,e)+k,onHit:(p,t)=>status(t,"poison",4,1.6*b.sc)})},
  onHit:(b,t)=>status(t,"poison",3,1.2*b.sc)}},
{id:"kuma",name:"Bartholomew Kuma",mono:"KM",rar:"epic",color:"#5A5A6A",el:"wind",hp:160,dmg:10,spd:195,r:28,call:["URSUS SHOCK!","PAD HO!"],ab:{name:"Nikyu Nikyu no Mi",cd:6,desc:"Đẩy văng đối thủ bằng bàn tay đệm thịt (10 sát thương), rồi nén không khí thành Ursus Shock nổ 20 sát thương.",
  trigger:b=>{const e=E(b);if(!alive(e))return;opArm(b,e,10*b.sc,{knock:900,c:"#FFC8D8",w:12});blast(b,{x:clamp(e.x+e.vx*.5,50,W-50),y:clamp(e.y+e.vy*.5,50,H-50),fx:b.x,fy:b.y,r:95,delay:1.1,dmg:20*b.sc})}}},
{id:"sabo",name:"Sabo",mono:"SB",rar:"epic",color:"#3A86FF",el:"fire",hp:140,dmg:10,spd:230,r:24,call:["RYU NO KAGIZUME!","HIKEN!","DRAGON CLAW!"],ab:{name:"Mera Mera no Mi",cd:4.5,desc:"Móng Rồng rực lửa: cú va kế tiếp chí mạng và đốt cháy; kèm luồng lửa ngắn về phía đối thủ.",
  trigger:b=>{const e=E(b);status(b,"crit",2.5);if(alive(e))line(b,{x:b.x,y:b.y,a:angTo(b,e),delay:.4,w:20,dmg:10*b.sc,onHit:o=>status(o,"burn",3,2.5*b.sc)})},
  onHit:(b,t,i)=>{if(i.crit)status(t,"burn",3,3*b.sc)}}},
/* ─────────── HUYỀN THOẠI ─────────── */
{id:"luffy4",name:"Luffy G4",mono:"L4",rar:"legendary",color:"#B0182A",el:"earth",hp:150,dmg:11,spd:230,r:26,call:["GEAR FOURTH!","BOUNDMAN!","KONG GUN!","KING KONG GUN!"],ab:{name:"Gomu Gomu no Mi",cd:5.5,desc:"Gear 4 Boundman: giảm 15% sát thương nhận vào, nảy liên tục (nhanh hơn). Kong Gun: đấm Haki 20 sát thương, hất văng và choáng 0.5 giây.",takenMult:.85,
  init:b=>{b.speedMul=1.12},
  trigger:b=>{status(b,"power",2);opArm(b,E(b),20*b.sc,{knock:700,stun:.5,big:true,c:"#3A1010",w:16})}}},
{id:"enel",name:"Enel",mono:"EN",rar:"legendary",color:"#FFE45E",el:"elec",hp:140,dmg:10,spd:230,r:24,call:["EL THOR!","KARI!","200 MILLION VOLT: AMARU!"],ab:{name:"Goro Goro no Mi",cd:5.5,desc:"Giáng El Thor: cột sét khổng lồ 18 sát thương, rồi thêm 2 tia sét lan (mỗi tia 7).",
  trigger:b=>{const e=E(b);if(!alive(e))return;zap(b,e,18*b.sc,true);status(e,"stun",.4);opQueue(b,2,.25,(b,e)=>zap(b,e,7*b.sc,true))},update:(b,dt)=>opQueueStep(b,dt)}},
{id:"aokiji",name:"Aokiji",mono:"AO",rar:"legendary",color:"#7FD8FF",el:"ice",hp:150,dmg:10,spd:215,r:25,call:["ICE AGE!","ICE TIME!","PARTISAN!"],ab:{name:"Hie Hie no Mi",cd:7,desc:"Kỷ Băng Hà: đóng băng đối thủ 1.6 giây và phủ băng sàn (chậm 45%); kèm mũi giáo băng 12 sát thương.",
  trigger:b=>{const e=E(b);if(!alive(e))return;status(e,"freeze",1.6);zone(b,{kind:"ice",x:e.x,y:e.y,r:120,life:4,slow:.45});shoot(b,{spd:600,dmg:12*b.sc,r:7,lead:.05})}}},
{id:"akainu",name:"Akainu",mono:"AK",rar:"legendary",color:"#C0392B",el:"fire",hp:150,dmg:11,spd:215,r:25,call:["DAI FUNKA!","MEIGOU!","RYUSEI KAZAN!"],ab:{name:"Magu Magu no Mi",cd:6,desc:"Đại Phun Trào: nắm đấm dung nham khổng lồ nện xuống đối thủ (24 sát thương), để lại 3 vũng dung nham cháy.",
  trigger:b=>{const e=E(b);if(!alive(e))return;blast(b,{kind:"meteor",x:e.x,y:e.y,r:90,delay:.7,dmg:24*b.sc});for(let k=0;k<3;k++)zone(b,{kind:"fire",x:clamp(e.x+rand(-80,80),40,W-40),y:clamp(e.y+rand(-80,80),40,H-40),r:48,life:3.5,arm:.7,dps:10*b.sc})}}},
{id:"kizaru",name:"Kizaru",mono:"KZ",rar:"legendary",color:"#FFD23D",el:"light",hp:140,dmg:10,spd:240,r:24,call:["YASAKANI NO MAGATAMA!","AMATERASU!","OOO~ KOWAI~"],ab:{name:"Pika Pika no Mi",cd:5.5,desc:"Lao với tốc độ ánh sáng tới cạnh đối thủ rồi xả 8 viên ngọc ánh sáng, mỗi viên 4 sát thương.",
  trigger:b=>{const e=E(b);if(!alive(e))return;G.ghosts.push({x:b.x,y:b.y,r:b.r,c:b.def.color,t:0,dur:.5});const a=rand(0,TAU),B=G.bd;b.x=clamp(e.x+Math.cos(a)*140,B.l+b.r,B.r-b.r);b.y=clamp(e.y+Math.sin(a)*140,B.t+b.r,B.b-b.r);b.trail=[];
    for(let k=0;k<8;k++)shoot(b,{spd:820,dmg:4*b.sc,r:5,a:angTo(b,e)+(k-3.5)*.09,c:"#FFF2A0",life:1.2})}}},
{id:"marco",name:"Marco",mono:"MC",rar:"legendary",color:"#3AC8FF",el:"fire",hp:145,dmg:10,spd:230,r:24,call:["PHOENIX BRAND!","AOI TORI!"],ab:{name:"Tori Tori no Mi: Phượng Hoàng",cd:5,desc:"Lửa xanh tái sinh: hồi 2 máu/giây và sống lại 1 lần với 50% máu. Phoenix Brand: lao đá kèm chí mạng.",
  update:(b,dt)=>heal(b,2*b.sc*dt),trigger:b=>{dashAt(b,.45);status(b,"crit",1.2)},
  onDeath:b=>{if(b.mem.rev)return false;b.mem.rev=true;b.hp=b.max*.5;status(b,"invuln",1.3);floater(b,"PHƯỢNG HOÀNG XANH","od");G.tint={c:"#3AC8FF",t:.6};return true}}},
{id:"fujitora",name:"Fujitora",mono:"FT",rar:"legendary",color:"#8E5CF7",el:"dark",hp:150,dmg:10,spd:210,r:25,call:["GRAVITY BLADE!","METEOR!","MOKO!"],ab:{name:"Zushi Zushi no Mi",cd:7,desc:"Trọng lực đè bẹp đối thủ (hút và chậm 2.2 giây), rồi kéo thiên thạch từ trời xuống: 26 sát thương.",
  trigger:b=>{const e=E(b);if(!alive(e))return;const x=clamp(e.x,70,W-70),y=clamp(e.y,70,H-70);zone(b,{kind:"hole",x,y,r:110,life:2.2,pull:380,dps:3*b.sc});status(e,"slow",2.2,.5);blast(b,{kind:"meteor",x,y,r:85,delay:1.6,dmg:26*b.sc})}}},
{id:"kid",name:"Eustass Kid",mono:"EK",rar:"legendary",color:"#D0263A",el:"steel",hp:145,dmg:11,spd:220,r:25,call:["PUNK GIBSON!","REPEL!","DAMNED PUNK!"],ab:{name:"Jiki Jiki no Mi",cd:5.5,desc:"Từ trường kéo đối thủ sát lại rồi nện cánh tay kim loại khổng lồ: 20 sát thương; kèm 4 mảnh sắt bắn ra.",
  trigger:b=>{const e=E(b);if(!alive(e))return;tether(b,e,.8,0);b.mem.pg=G.t+.75;for(let k=0;k<4;k++)shoot(b,{spd:520,dmg:b.dmg*.3,r:5,a:angTo(b,e)+(k-1.5)*.35,c:"#9AA0A6"})},
  update:b=>{if(b.mem.pg&&G.t>=b.mem.pg){b.mem.pg=0;opArm(b,E(b),20*b.sc,{knock:500,big:true,c:"#9AA0A6",w:16})}}}},
{id:"hancock",name:"Boa Hancock",mono:"BH",rar:"legendary",color:"#E83A6A",el:"light",hp:140,dmg:10,spd:225,r:24,call:["SLAVE ARROW!","MERO MERO MELLOW!","PERFUME FEMUR!"],ab:{name:"Mero Mero no Mi",cd:6,desc:"Bắn trái tim mê hoặc tự dẫn: trúng là đối thủ hoá đá 1.6 giây và yếu đi 3 giây.",
  trigger:b=>{const e=E(b);if(!alive(e))return;for(const k of[-.35,0,.35])shoot(b,{skin:"heart",homing:3,spd:380,dmg:b.dmg*.35,life:3.5,r:7,c:"#FF6AA8",a:angTo(b,e)+k,onHit:(p,t)=>{if(!(t.mem.stone>G.t)){t.mem.stone=G.t+2;status(t,"freeze",1.6);status(t,"weak",3);floater(t,"HOÁ ĐÁ","od")}}})}}},
{id:"bartolomeo",name:"Bartolomeo",mono:"BR",rar:"legendary",color:"#5AE07A",el:"light",hp:155,dmg:10,spd:210,r:26,call:["BARRIER!","BARI BARI NO PISTOL!","BARRIER CRASH!"],ab:{name:"Bari Bari no Mi",cd:6,desc:"Dựng kết giới: khiên 30 và bất tử 0.6 giây; đập kết giới vào đối thủ ở gần (12 sát thương, hất văng).",
  trigger:b=>{b.st.shield=(b.st.shield||0)+30*b.sc;status(b,"invuln",.6);ring(b.x,b.y,b.r,b.r+50,"#9AFFB8",.5,5);const e=E(b);if(alive(e)&&dist(b,e)<b.r+e.r+110){deal(b,e,12*b.sc,{crit:true});knock(e,b,520)}}}},
/* ─────────── THẦN THOẠI ─────────── */
{id:"luffy5",name:"Luffy G5",mono:"L5",rar:"mythic",color:"#F5F5FF",el:"light",hp:165,dmg:11,spd:235,r:26,call:["GEAR FIFTH!","BAJRANG GUN!","GOMU GOMU NO... DAWN WHIP!","DON DON DON!"],ab:{name:"Hito Hito no Mi: Nika",cd:7,desc:"Gear 5 – Thần Mặt Trời Nika: biến đối thủ thành cao su (choáng 1 giây), tung Bajrang Gun nắm đấm khổng lồ 30 sát thương, rồi cười lớn – bất tử 1.2 giây.",
  trigger:b=>{const e=E(b);if(!alive(e))return;status(e,"stun",1);status(b,"invuln",1.2);floater(b,"HAHAHA!","od");beam(b.x,b.y,e.x,e.y,"#FFFFFF",.6,22);blast(b,{x:e.x,y:e.y,fx:b.x,fy:b.y,r:130,delay:.6,dmg:30*b.sc});G.tint={c:"#FFFFFF",t:.4}},
  update:(b,dt)=>{if(Math.random()<dt*10)G.parts.push({x:b.x+rand(-b.r,b.r),y:b.y-b.r*.6,vx:rand(-30,30),vy:rand(-80,-30),life:.8,max:.8,color:"#FFFFFF",size:rand(3,6),add:true})}}},
{id:"whitebeard",name:"Râu Trắng",mono:"WB",rar:"mythic",color:"#F2F2E8",el:"earth",hp:175,dmg:12,spd:200,r:28,call:["GURA GURA!","KAISHIN!","GURARARARA!"],ab:{name:"Gura Gura no Mi",cd:6,desc:"Đấm nứt không gian: sóng chấn động lan khắp sàn, 20 sát thương và choáng 0.6 giây; ở gần còn bị hất văng.",
  trigger:b=>{for(let i=0;i<3;i++)ring(b.x,b.y,b.r,500+i*120,i?"#ffffff":"#C9E8FF",.6+i*.15,8-i*2);G.shake=Math.min(30,G.shake+22);ripple(b.x,b.y,40);for(const o of foes(b)){if(o.kind!=="main")continue;deal(b,o,20*b.sc,{crit:true});status(o,"stun",.6);if(dist(b,o)<220)knock(o,b,700)}}}},
{id:"blackbeard",name:"Râu Đen",mono:"BB",rar:"mythic",color:"#2A1A3A",el:"dark",hp:170,dmg:11,spd:205,r:28,call:["BLACK HOLE!","KUROUZU!","ZEHAHAHAHA!"],ab:{name:"Yami Yami no Mi",cd:7,desc:"Bóng tối nuốt chửng: hút đối thủ vào hố đen, vô hiệu hoá kỹ năng 2.5 giây, rồi chấn động 14 sát thương.",
  trigger:b=>{const e=E(b);if(!alive(e))return;zone(b,{kind:"hole",x:b.x,y:b.y,r:150,life:2,pull:520,dps:5*b.sc});status(e,"silence",2.5);floater(e,"VÔ HIỆU","od");blast(b,{x:b.x,y:b.y,fx:b.x,fy:b.y,r:120,delay:1.6,dmg:14*b.sc})}}},
{id:"kaido",name:"Kaido",mono:"KD",rar:"mythic",color:"#3A5AC8",el:"fire",hp:180,dmg:12,spd:205,r:29,call:["BORO BREATH!","RAIMEI HAKKE!","URORORORO!"],ab:{name:"Uo Uo no Mi: Thanh Long",cd:6,desc:"Rồng xanh phun Boro Breath: luồng lửa rộng 24 sát thương và gây bỏng. Da rồng giảm 20% sát thương nhận vào.",takenMult:.8,
  trigger:b=>{const e=E(b);if(!alive(e))return;line(b,{x:b.x,y:b.y,a:angTo(b,e),delay:.7,w:60,dmg:24*b.sc,track:b,onHit:o=>status(o,"burn",3,3.5*b.sc)})}}},
{id:"yamato",name:"Yamato",mono:"YM",rar:"mythic",color:"#E8F6FF",el:"ice",hp:165,dmg:11,spd:225,r:26,call:["NARIKABURA ARROW!","NAMEKAZE!","THUNDER BAGUA!"],ab:{name:"Inu Inu no Mi: Okuchi no Makami",cd:5.5,desc:"Thần sói băng: lao tới đóng băng đối thủ 1.2 giây, rồi phóng mũi tên Narikabura 18 sát thương.",
  trigger:b=>{const e=E(b);if(!alive(e))return;dashAt(b,.4);status(e,"freeze",1.2);line(b,{x:b.x,y:b.y,a:angTo(b,e),delay:.55,w:24,dmg:18*b.sc});zone(b,{kind:"ice",x:e.x,y:e.y,r:80,life:3,slow:.4})}}},
{id:"ryokugyu",name:"Ryokugyu",mono:"RG",rar:"mythic",color:"#4CAF50",el:"nature",hp:170,dmg:11,spd:210,r:27,call:["MORI MORI!","FOREST!"],ab:{name:"Mori Mori no Mi",cd:6,desc:"Rễ cây mọc khắp nơi quanh đối thủ (trói chậm 60%, 9 sát thương/giây) và hút dưỡng chất: hồi 15% máu.",
  trigger:b=>{const e=E(b);if(!alive(e))return;for(let k=0;k<4;k++){const a=k*TAU/4+rand(0,1);zone(b,{kind:"vine",x:clamp(e.x+Math.cos(a)*70,50,W-50),y:clamp(e.y+Math.sin(a)*70,50,H-50),r:44,life:5,arm:.3,slow:.6,dps:9*b.sc})}heal(b,b.max*.15,true)}}},
{id:"bigmom",name:"Big Mom",mono:"BM",rar:"mythic",color:"#FF8FC7",el:"arcane",hp:180,dmg:12,spd:200,r:29,call:["ZEUS!","PROMETHEUS!","SOUL POCUS!","MAMAMAMA!"],ab:{name:"Soru Soru no Mi",cd:4.5,desc:"Luân phiên gọi Zeus (sét 16 sát thương), Prometheus (vùng lửa) và Soul Pocus (hút hồn: đối thủ yếu đi, bà hồi 10% máu).",
  trigger:b=>{const e=E(b);if(!alive(e))return;b.mem.k=((b.mem.k||0)+1)%3;
    if(b.mem.k===1)zap(b,e,16*b.sc,true);else if(b.mem.k===2)zone(b,{kind:"fire",x:e.x,y:e.y,r:80,life:3,arm:.4,dps:11*b.sc});else{status(e,"weak",4);heal(b,b.max*.1,true);beam(e.x,e.y,b.x,b.y,"#FFB0E0",.4,4)}}}},
{id:"shiki",name:"Kim Sư Shiki",mono:"SK",rar:"mythic",color:"#FFC23D",el:"wind",hp:160,dmg:11,spd:220,r:26,call:["FUWA FUWA!","SHISHI ODOSHI!","JIHO HARE!"],ab:{name:"Fuwa Fuwa no Mi",cd:6,desc:"Bay lơ lửng điều khiển đá trời: 4 tảng đá rơi quanh đối thủ (mỗi tảng 12) và làm chậm 40%.",
  trigger:b=>{const e=E(b);if(!alive(e))return;status(e,"slow",2.5,.4);for(let k=0;k<4;k++){const a=k*TAU/4+rand(0,.8);blast(b,{kind:"meteor",x:clamp(e.x+Math.cos(a)*(k?70:0),40,W-40),y:clamp(e.y+Math.sin(a)*(k?70:0),40,H-40),r:60,delay:.8+k*.2,dmg:12*b.sc})}}}},
{id:"sengoku",name:"Sengoku",mono:"SE",rar:"mythic",color:"#FFD700",el:"light",hp:175,dmg:11,spd:205,r:28,call:["DAIBUTSU!","BUDDHA SHOCKWAVE!"],ab:{name:"Hito Hito no Mi: Đại Phật",cd:6,desc:"Hoá Đại Phật vàng: nhận khiên 25 rồi tung chưởng sóng xung kích 22 sát thương, hất văng đối thủ ra xa.",
  trigger:b=>{b.st.shield=(b.st.shield||0)+25*b.sc;const e=E(b);if(!alive(e))return;ring(b.x,b.y,b.r,b.r+160,"#FFE98A",.6,10);G.flashes.push({x:b.x,y:b.y,r:220,t:0,dur:.35,c:"#FFE98A"});opArm(b,e,22*b.sc,{knock:950,big:true,c:"#FFE98A",w:22})}}},
{id:"katakuri",name:"Katakuri",mono:"KT",rar:"mythic",color:"#C8507A",el:"wind",hp:165,dmg:11,spd:225,r:26,call:["ZAN GIRI MOCHI!","FUTURE SIGHT!","MOCHI THRUST!"],ab:{name:"Mochi Mochi no Mi",cd:5,desc:"Nhìn thấy tương lai: 25% né mọi đòn. Mochi Thrust: giáo mochi đâm thẳng 18 sát thương và để lại vũng mochi dính (chậm 55%).",
  onHurt:(b,src,amt,o)=>{if(src&&!o.silent&&Math.random()<.25){floater(b,"ĐOÁN TRƯỚC","od");return 0}return amt},
  trigger:b=>{const e=E(b);if(!alive(e))return;line(b,{x:b.x,y:b.y,a:angTo(b,e),delay:.5,w:26,dmg:18*b.sc});zone(b,{kind:"sand",x:e.x,y:e.y,r:75,life:3,slow:.55})}}},
];
/* hệ số cân bằng (tự chỉnh bằng mô phỏng): [máu, sát thương va chạm, hồi chiêu] */
const OP_TUNE=/*TUNE*/{"sugar":[1.35,1.162,0.861],"shiki":[1.197,1.095,0.914],"mr3":[1.234,1.111,0.901],"caesar":[1.239,1.113,0.899],"blackbeard":[1.143,1.069,0.936],"doflamingo":[1.184,1.088,0.919],"akainu":[1.213,1.101,0.908],"aokiji":[1.15,1.072,0.933],"crocodile":[1.102,1.05,0.953],"valentine":[1.114,1.055,0.947],"wapol":[1.176,1.085,0.922],"hancock":[1.097,1.048,0.954],"bentham":[1.092,1.045,0.957],"kuma":[1.032,1.016,0.984],"kaku":[1.164,1.078,0.926],"alvida":[1.121,1.059,0.943],"buggy":[0.946,0.973,1.028],"sabo":[0.879,0.938,1.066],"whitebeard":[0.933,0.966,1.035],"fujitora":[0.925,0.962,1.04],"bonney":[0.987,0.993,1.007],"luffy3":[0.91,0.954,1.048],"lucci":[0.849,0.922,1.085],"kid":[0.874,0.935,1.069],"ryokugyu":[0.801,0.895,1.117],"chopper":[0.859,0.927,1.079],"robin":[0.941,0.971,1.031],"brook":[0.859,0.927,1.079],"enel":[0.82,0.906,1.104],"bartolomeo":[0.668,0.818,1.223],"luffy5":[0.79,0.889,1.125],"sengoku":[0.664,0.814,1.228],"luffy4":[0.686,0.829,1.207],"kaido":[0.687,0.828,1.207],"luffy2":[0.691,0.832,1.202],"luffy1":[0.754,0.868,1.152],"magellan":[0.663,0.814,1.229],"marco":[0.545,0.738,1.355],"mr5":[1.109,1.053,0.95],"jozu":[1.088,1.043,0.959],"law":[0.937,0.968,1.033],"yamato":[1.001,1.001,0.999],"ace":[1.133,1.064,0.939],"moria":[1.088,1.043,0.959]}/*END*/;
for(const b of OPB){const t=OP_TUNE[b.id];if(t){b.hp=Math.round(b.hp*t[0]);b.dmg=Math.round(b.dmg*t[1]*10)/10;if(b.ab.cd)b.ab.cd=Math.round(b.ab.cd*t[2]*100)/100}b.op=true;BALLS.push(b);BY_ID[b.id]=b}
