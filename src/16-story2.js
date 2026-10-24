
/* ═════════════════════════════════════════════════════════════
   CỐT TRUYỆN — Chương 2: PHÒNG TRƯNG BÀY
   Mảnh vỡ đi qua cổng, leo lên khoảng không giữa đáy rương và sàn đấu: nơi những quả bóng
   "đã sở hữu" được đặt trong tủ kính. Tủ kính hiển thị đúng bộ sưu tập thật của người chơi.
   Câu đố trong Lò Hợp Thể dùng chính tỉ lệ hợp thể của game (MERGE), Hộp Bí Ẩn dùng BOX_TRAP.
   ═════════════════════════════════════════════════════════════ */
SKINS._statue={eyes:"sleepy",mouth:"flat",deco:[["cracks","#7a7290"],["facets","#ffffff"]]};
SKINS._box={eyes:"angry",mouth:"zig",deco:[["txt","?","#FFE98A"],["facets","#ffffff"]]};
const STATUE_DEF={id:"_statue",name:"Tượng",color:"#BDB6CF",rar:"common",ab:{}},BOX_DEF={id:"_box",name:"Hộp Bí Ẩn",color:"#FFB23D",rar:"rare",ab:{}};
BY_ID._statue=BY_ID._statue||STATUE_DEF;BY_ID._box=BY_ID._box||BOX_DEF;
Object.assign(SPK,{mirage:{def:"mirage",name:"Giám Tuyển",v:340},statue:{def:"_statue",name:"Tượng",v:200},box:{def:"_box",name:"Hộp Bí Ẩn",v:760},spark:{def:"spark",name:"Spark",v:820}});

Object.assign(RM,{
  thang:{name:"Thang Nắp",theme:"gate",music:"cave",map:[
"#####..#####",
"#..........#",
"#..r....r..#",
"#..........#",
"#....*.....#",
"#..........#",
"#..........#",
"#.r......r.#",
"#..........#",
"#..........#",
"#..........#",
"#..........#",
"#..........#",
"#..........#",
"#..........#",
"############"],
    exits:[{x:5,y:0,w:2,h:1,to:"trungbay",tx:13.5,ty:12.2}]},
  trungbay:{name:"Phòng Trưng Bày",theme:"gallery",music:"gallery",map:[
"############################",
"#C.C.C.C.C.C....C.C.C.C.C.C#",
"#..........................#",
"#..........................#",
"#..........................#",
"#..........................#",
"#...........................",
"#...........................",
"#..........................#",
"#..........................#",
"#..........................#",
"#C.C.C.C.C.C....C.C.C.C.C.C#",
"#..........................#",
"#############..#############"],
    exits:[{x:13,y:13,w:2,h:1,to:"thang",tx:5.5,ty:1.5},{x:27,y:6,w:1,h:2,to:"lo",tx:1.5,ty:7}]},
  lo:{name:"Lò Hợp Thể",theme:"furnace",music:"cave",dark:true,map:[
"#########||#########",
"#..................#",
"#..K.....OO.....K..#",
"#........OO........#",
"#..................#",
"#..................#",
"...................#",
"...................#",
"#.......K..........#",
"#..................#",
"#..r............r..#",
"#..................#",
"#..................#",
"####################"],
    exits:[{x:0,y:6,w:1,h:2,to:"trungbay",tx:26.5,ty:7},{x:9,y:0,w:2,h:1,to:"sandau",tx:10.5,ty:13.2}]},
  sandau:{name:"Sàn Đấu",theme:"arena",music:"cave",map:[
"######################",
"#....................#",
"#.AAAAAAAAAAAAAAAAAA.#",
"#.A................A.#",
"#.A................A.#",
"#.A................A.#",
"#.A................A.#",
"#.A................A.#",
"#.A................A.#",
"#.A................A.#",
"#.AAAAAAAAAAAAAAAAAA.#",
"#..*.................#",
"#....................#",
"#....................#",
"##########..##########"],
    exits:[{x:10,y:14,w:2,h:1,to:"lo",tx:9.5,ty:1.5}]},
});
Object.assign(THEME,{gallery:{f1:"#17121f",f2:"#1b1626",wall:"#2a2236",edge:"#FFE98A",g:"#221a30"},furnace:{f1:"#140c1e",f2:"#180f24",wall:"#2a1640",edge:"#B86CFF",g:"#1c1030"},arena:{f1:"#0f0c1c",f2:"#120f22",wall:"#221a40",edge:"#36E2FF",g:"#1a1430"}});
Object.assign(NPCS,{
  thang:[{id:"warden2",def:"warden",x:6,y:10,when:s=>!S.storyMem.killedWarden},{id:"keys",item:"keys",x:6,y:10,when:s=>S.storyMem.killedWarden&&!s.flags.keys}],
  trungbay:[{id:"mirage",def:"mirage",x:13.5,y:4,when:s=>!s.flags.curatorLeft},{id:"plaque",sign:true,x:14,y:9}],
  lo:[{id:"sign3",sign:true,x:3,y:5}],
  sandau:[{id:"mirage2",def:"mirage",x:10.5,y:5,when:s=>!s.flags.curatorDone},{id:"pip2",def:"pip",x:18.5,y:12,when:s=>s.flags.curatorDone&&!s.flags.pipOut}],
});
ITEM_NAME.keys="Chùm Chìa Khoá Cũ";
Object.assign(TRIG,{
  trungbay:[{id:"encStatue",x:18,y:4,w:3,h:5,fn:async()=>{await say(null,"(Một bức tượng trong góc phòng bỗng mở mắt.)");await battle("statue")}}],
  lo:[{id:"encBox",x:4,y:5,w:3,h:4,fn:async()=>{await say(null,"(Một chiếc hộp rơi từ trên trần xuống, lăn tới chân cậu... rồi nhe răng.)");await battle("mbox")}}],
});
/* — tủ kính: hiển thị bộ sưu tập thật — */
ROOM_ENTER.trungbay=s=>{const owned=BALLS.filter(b=>S.owned[b.id]).sort((a,b)=>RARS.indexOf(b.rar)-RARS.indexOf(a.rar)||(S.owned[b.id]-S.owned[a.id]));
  ST.cases={};let k=0;for(let y=0;y<ST.H;y++)for(let x=0;x<ST.W;x++)if(ST.map[y][x]==="C"){ST.cases[x+","+y]=owned[k]||null;k++}};
ROOM_ENTER.lo=s=>{if(s.flags.vent)ST.map=ST.map.map(r=>r.replace(/\|/g,"."));ST.dials={};let k=0;for(let y=0;y<ST.H;y++)for(let x=0;x<ST.W;x++)if(ST.map[y][x]==="K")ST.dials[x+","+y]=k++};
TILE_DRAW.C=(g,X,Y,x,y,t)=>{const d=ST.cases&&ST.cases[x+","+y];g.fillStyle="#120e1a";g.fillRect(X+2,Y+2,TS-4,TS-4);
  if(d){g.save();g.globalCompositeOperation="lighter";g.globalAlpha=.35;g.drawImage(glowSprite(d.color),X-6,Y-6,TS+12,TS+12);g.restore();drawCreature(g,d,X+16,Y+15,9,{t:t*.2,id:x*7+y,gx:0,gy:.3})}
  else{g.strokeStyle="rgba(200,190,220,.25)";g.setLineDash([2,3]);g.beginPath();g.arc(X+16,Y+15,8,0,TAU);g.stroke();g.setLineDash([])}
  g.fillStyle="rgba(180,230,255,.10)";g.fillRect(X+2,Y+2,TS-4,TS-4);g.strokeStyle="rgba(220,240,255,.55)";g.lineWidth=1.5;g.strokeRect(X+2,Y+2,TS-4,TS-4);
  g.fillStyle="rgba(255,255,255,.35)";g.beginPath();g.moveTo(X+5,Y+5);g.lineTo(X+12,Y+5);g.lineTo(X+5,Y+14);g.closePath();g.fill();g.fillStyle="#FFE98A";g.fillRect(X+8,Y+TS-6,TS-16,3)};
TILE_DRAW.K=(g,X,Y,x,y,t)=>{const ok=sv().flags["dial"+ST.dials[x+","+y]];g.fillStyle="#2a1640";g.beginPath();g.arc(X+16,Y+16,13,0,TAU);g.fill();g.strokeStyle=ok?"#5CF2A8":"#B86CFF";g.lineWidth=2.5;g.stroke();
  const a=ok?-Math.PI/2:t*1.5;g.beginPath();g.moveTo(X+16,Y+16);g.lineTo(X+16+Math.cos(a)*10,Y+16+Math.sin(a)*10);g.strokeStyle="#fff";g.stroke()};
TILE_DRAW.O=(g,X,Y,x,y,t)=>{g.fillStyle="#1a0a2a";g.fillRect(X,Y,TS,TS);if(ST.map[y][x-1]!=="O"&&ST.map[y-1]&&ST.map[y-1][x]!=="O"){const cx=X+TS,cy=Y+TS;g.save();g.globalCompositeOperation="lighter";g.globalAlpha=.7+.3*Math.sin(t*3);g.drawImage(glowSprite("#B86CFF"),cx-60,cy-60,120,120);g.restore();
  for(let k=0;k<3;k++){g.strokeStyle=`rgba(220,180,255,${.6-k*.15})`;g.lineWidth=2;g.beginPath();g.arc(cx,cy,10+k*8,t*(2+k)+k,t*(2+k)+k+4);g.stroke()}}};
TILE_DRAW.A=(g,X,Y,x,y,t)=>{g.fillStyle="#141030";g.fillRect(X,Y,TS,TS);g.strokeStyle=`rgba(54,226,255,${.35+.25*Math.sin(t*2+x*.4+y*.4)})`;g.lineWidth=2;g.strokeRect(X+3,Y+3,TS-6,TS-6)};
const caseLine=d=>{const lv=S.owned[d.id]||1,cp=S.copies[d.id]||1,n=d.name;
  if(d.op)return`${n}: "...Ta từng là hải tặc ở một thế giới khác. Có biển, có gió. Giờ ta là một quả bóng trong tủ kính, cấp ${lv}."`;
  return{common:`${n}: "Ta có ${cp} bản sao. Bọn ta thay phiên nhau được nhìn. Hôm nay tới lượt ta."`,
    rare:`${n}: "Thỉnh thoảng ta được mang ra đấu. Ta thích cảm giác được chạm vào ai đó... kể cả là để va."`,
    epic:`${n}: "Ta đang ở cấp ${lv}. Mỗi lần trùng bản, người ta ép một bản sao vào người ta. Ta nghe thấy giọng chúng trong đầu."`,
    legendary:`${n}: "Nếu bị đổi, ta đáng ${REFUND[d.rar]||500} xu. Ngươi có biết cảm giác biết rõ giá của mình không?"`,
    mythic:`${n}: "Họ phải mở rất nhiều rương mới có được ta. Mỗi chiếc rương mở ra, dưới đáy có một người biến mất. Ta được làm từ những lần mất mát đó."`}[d.rar]};
TILE_ACT.C=async(x,y)=>{const d=ST.cases&&ST.cases[x+","+y],s=sv();
  if(!d){await say(null,"(Tủ kính trống. Tấm biển ghi \"CHƯA SỞ HỮU\". Dưới đáy có một vòng bụi tròn, như ai đó từng đứng đây rồi bị đổi đi.)");return}
  await say(null,`(Trong tủ là ${d.name}. Tấm biển nhỏ: "${RAR_VN[d.rar]} · Cấp ${S.owned[d.id]} · ×${S.copies[d.id]||1}".)`);
  await say(null,caseLine(d));
  s.named=s.named||[];if(!s.named.includes(d.name)){s.named.push(d.name);if(s.named.length===3)await say(null,"(Cậu đã nhớ tên được ba người trong tủ kính. Không hiểu sao điều đó có vẻ quan trọng.)")}};
TILE_ACT.K=async(x,y)=>{const i=ST.dials[x+","+y],s=sv(),M0=MERGE;
  const Q=[{q:"Kim thứ nhất: tỉ lệ THÀNH CÔNG khi ghép hai quả Thường.",a:M0.common.ok},{q:"Kim thứ hai: tỉ lệ VỠ khi ghép hai quả Sử thi.",a:M0.epic.brk},{q:"Kim thứ ba: tỉ lệ MẤT 1 QUẢ khi ghép hai quả Huyền thoại.",a:M0.legendary.fail}][i];
  if(s.flags["dial"+i]){await say(null,"(Kim này đã khớp. Nó rung nhè nhẹ như đang thở.)");return}
  const opts=[...new Set([Q.a,Q.a+10,Math.max(0,Q.a-10),Q.a+20])].sort((a,b)=>a-b);
  const k=await choice(Q.q,opts.map(v=>v+"%"));
  if(opts[k]===Q.a){s.flags["dial"+i]=true;sfx.reveal("rare");await say(null,"(Cạch. Kim khoá vào đúng vị trí.)");
    if([0,1,2].every(j=>s.flags["dial"+j])){s.flags.vent=true;ST.map=ST.map.map(r=>r.replace(/\|/g,"."));ST.shake=8;sfx.ko();await say(null,"(Lò Hợp Thể rền vang. Lỗ thông hơi phía trên bật mở. Có tiếng reo hò vọng xuống từ đó.)")}}
  else{sfx.wall();ST.shake=4;await say(null,"(Kim quay vòng rồi trôi về số 0. Lò phả ra một làn hơi nóng.)")}};
TILE_ACT.O=async()=>{const s=sv();
  if(s.flags.memory){await say(null,"(Lõi lò vẫn xoáy tròn. Cậu không muốn nhìn vào đó lâu nữa.)");return}
  s.flags.memory=true;ST.cut={black:1};sfx.ko();
  await say("voice","...Cậu nhìn vào lõi lò. Lõi lò nhìn lại.");
  await say("voice","Một ký ức không phải của cậu tràn vào.");
  await say("spark","Thầy Than ơi! Tuần sau con sẽ rèn được thanh kiếm đầu tiên! Thầy nhớ đến xem nhé!");
  await say("voice","Rồi Nắp mở. Bàn Tay thò xuống. Cả làng vỗ tay.");
  await say("voice","Spark được đặt vào cái lò này, cạnh một quả bóng khác. Không ai ghi tên quả kia.");
  await say("voice",`Thanh tiến trình chạy. ${MERGE.common.ok} thành công... ${MERGE.common.brk} vỡ.`);
  await say("voice","VỠ.");ST.shake=12;
  await say("voice","Một nửa rơi xuống đáy rương. Nửa kia... vẫn đang ở đâu đó phía trên.");
  await say(null,"(Cậu nhớ ra đôi bàn tay run run của một người thợ rèn. Ông ấy đã vỗ tay.)");
  await say(null,"(Cậu là một nửa của Spark.)");
  ST.cut=null};
Object.assign(TALK,{
  warden2:async()=>{const s=sv();if(!s.flags.w2){s.flags.w2=true;await say("warden","Ta chỉ đưa cậu tới đây thôi. Phía trên không phải chỗ của một Cai Ngục.");await say("warden","Cầm lấy. Kẹo của Bé Bong gửi. Con bé bảo cậu gầy quá.");s.items.candy=(s.items.candy||0)+1;await say(null,"(Cậu nhận được Kẹo Neon.)");await say("warden","Và này... đừng tin những ai nói rằng họ đang \"giữ gìn\" bọn ta.");return}
    await say("warden","Đi đi. Ta sẽ canh cầu thang này. Lần này là để cậu có đường quay về.")},
  mirage:async()=>{const s=sv();
    if(!s.flags.cur1){s.flags.cur1=true;await say("mirage","A. Một vị khách. Lâu lắm rồi mới có ai đi LÊN chứ không phải được NHẤC lên.");
      if(S.storyMem.killedWarden)await say("mirage","Cậu đã phá cánh cổng dưới kia, phải không? Ta nghe thấy tiếng sắt vỡ. Cậu sẽ hợp với nơi này lắm.");
      await say("mirage","Chào mừng tới Phòng Trưng Bày. Ta là Giám Tuyển. Ở đây không ai già đi, không ai vỡ, không ai bị quên.");
      await say("mirage","Mỗi người đều được đặt trong tủ kính riêng, có biển ghi cấp độ và số bản sao. Đẹp chứ?");
      const i=await choice("Giám Tuyển mỉm cười chờ đợi.",["Họ có muốn ở đây không?","Tên của họ đâu?"],"mirage");
      if(i===0)await say("mirage","Muốn? Câu hỏi thú vị. Họ được chọn. Được chọn thì cần gì muốn.");
      else await say("mirage","Tên ư? Biển ghi cấp và độ hiếm là đủ rồi. Không ai đọc tên trên một bảng thống kê cả.");
      await say("mirage","Cứ tự nhiên xem tranh. Lò Hợp Thể ở phía đông, nếu cậu muốn biết mình... được làm ra thế nào.");return}
    await say("mirage",pick(["Đừng chạm vào kính. Dấu vân tay làm hỏng vẻ đẹp.","Người ta bảo bộ sưu tập này đã có "+Object.keys(S.owned).length+" món. Ta thì thấy chưa bao giờ là đủ.","Lò Hợp Thể ở phía đông. Lối ra Sàn Đấu nằm sau cái lò."]))},
  plaque:async()=>{await say(null,`"PHÒNG TRƯNG BÀY — ${Object.keys(S.owned).length} hiện vật. Xin đừng gõ vào kính. Hiện vật có thể nghe thấy."`)},
  sign3:async()=>{await say(null,"\"LÒ HỢP THỂ — Muốn mở lỗ thông hơi, hãy chỉnh ba kim cho đúng những con số mà ai ghép bóng cũng phải chấp nhận.\"")},
  keys:async()=>{},
  mirage2:async()=>{const s=sv();
    await say("mirage","Cậu tới được Sàn Đấu rồi. Nơi các hiện vật của ta được mang ra va vào nhau cho Bàn Tay xem.");
    await say("mirage","Cậu muốn đưa họ ra khỏi tủ kính phải không? Ra ngoài là vỡ, là già, là bị quên.");
    await say("mirage","Trong tủ, họ được yêu. Mãi mãi. Ta sẽ không để cậu phá hỏng điều đó.");
    const r=await battle("curator");
    if(r==="spare"){s.flags.curatorDone=true;ST.npcs=ST.npcs.filter(n=>n.id!=="mirage2");ST.npcs.push({id:"pip2",def:"pip",x:18.5,y:12,px:19*TS,py:12.5*TS});
      await say(null,"(Giám Tuyển ngồi xuống giữa sàn đấu. Lần đầu tiên, ông ấy trông giống một quả bóng bình thường.)");
      await say("mirage","...Có lẽ được yêu và được nhớ tên là hai chuyện khác nhau.");
      await say("mirage","Tủ kính ở góc sàn. Cậu bé đó được đặt vào hôm qua. Nó cười suốt.");S.storyMem.sparedCurator=true}
    else if(r==="kill"){s.flags.curatorDone=true;S.storyMem.killedCurator=true;ST.npcs=ST.npcs.filter(n=>n.id!=="mirage2");ST.npcs.push({id:"pip2",def:"pip",x:18.5,y:12,px:19*TS,py:12.5*TS});
      await say(null,"(Những tủ kính trên khắp sàn đấu đồng loạt nứt một đường nhỏ.)")}},
  pip2:async()=>{await ending2()},
});
/* — kẻ thù chương 2 — */
Object.assign(FOES,{
  statue:{name:"Tượng",def:"_statue",hp:44,dmg:4,exp:18,acts:["Kiểm tra","Lau kính","Gọi tên"],
    check:"TƯỢNG — ST 4 · PT 3. Đứng yên quá lâu nên quên mất mình biết cử động.",
    act(i,b){if(i===1){b.f.wipe=true;return["Cậu lau lớp bụi trên mặt Tượng.","Tượng chớp mắt. Lần đầu tiên sau rất lâu nó thấy rõ."]}
      if(i===2){if(b.f.wipe){b.spare=true;return["Cậu hỏi tên nó.","Tượng ngẩn ra. \"...Lumi. Ta tên là Lumi. Ta suýt quên.\"","Tượng không muốn đánh nữa."]}return["Cậu hỏi tên nó.","Tượng không nghe thấy gì qua lớp bụi dày."]}},
    talk:b=>b.spare?"Lumi... Lumi...":pick(["ĐỪNG... CHẠM... VÀO... KÍNH.","...cấp bảy... bản sao mười hai...","Hiện vật không được rời tủ."]),
    flavor:b=>pick(["Tượng kêu răng rắc khi cử động.","Bụi bay lả tả như tuyết.","Tượng nhìn cậu bằng đôi mắt bằng kính."]),
    pats:["frames","shards"]},
  mbox:{name:"Hộp Bí Ẩn",def:"_box",hp:40,dmg:4,exp:20,acts:["Kiểm tra","Lắc thử","Không mở"],
    check:()=>`HỘP BÍ ẨN — ST 4 · PT 1. ${Math.round(BOX_TRAP*100)}% là bẫy. Con số này có thật, nó nằm trong mã nguồn.`,
    act(i,b){if(i===1)return["Cậu lắc chiếc hộp.","Bên trong có tiếng gì đó đang cười."];
      if(i===2){b.f.no=(b.f.no||0)+1;if(b.f.no>=2){b.spare=true;return["Cậu nhất quyết không mở.","Hộp Bí Ẩn sững sờ. Chưa ai từng từ chối nó cả.","Hộp Bí Ẩn không muốn đánh nữa."]}return["Cậu không mở hộp.","\"Mở đi mà! Có thể là thứ hiếm lắm đấy! Có thể lắm!\""]}},
    talk:b=>b.spare?"...vậy là cậu không cần ta?":pick(["MỞ TA RA! MỞ TA RA!","Lần này chắc chắn là huyền thoại!","Chỉ một lần nữa thôi mà!"]),
    flavor:b=>pick(["Hộp Bí Ẩn rung lắc đầy hứa hẹn.","Mùi giấy gói và hy vọng.","Có tiếng nhạc thắng giải phát ra từ bên trong."]),
    pats:["boxes","boxes2"]},
  curator:{name:"Giám Tuyển",def:"mirage",hp:140,dmg:5,exp:80,boss:true,acts:["Kiểm tra","Kể về làng Bi","Gọi tên các hiện vật","Cho xem vết nứt"],
    check:"GIÁM TUYỂN — ST 5 · PT 4. Yêu bộ sưu tập của mình hơn bất cứ thứ gì. Kể cả những người ở trong đó.",
    act(i,b){const s=sv();
      if(i===1){b.f.village=true;return["Cậu kể về Lão Sỏi cứng đầu, Rêu tưới những cây không bao giờ lớn, Bé Bong lắc chuông mỗi ngày.","Giám Tuyển im lặng lâu hơn bình thường."]}
      if(i===2){const n=s.named||[];if(n.length<3)return["Cậu cố nhớ tên những người trong tủ kính...","...nhưng cậu chưa nhớ được ai. (Hãy xem các tủ kính ở Phòng Trưng Bày.)"];
        b.f.names=true;const out=["Cậu đọc to từng cái tên: "+n.slice(0,5).join(", ")+"."];if(b.f.village){b.spare=true;out.push("Giám Tuyển run lên. \"Ta... chưa bao giờ đọc những tấm biển đó. Chỉ đọc con số.\"","Giám Tuyển không muốn đánh nữa.")}else out.push("\"Tên thì có ý nghĩa gì? Họ vẫn đẹp dù không ai gọi.\"");return out}
      if(i===3)return["Cậu cho Giám Tuyển xem vết nứt.","\"Một hiện vật hỏng. Ở đây, hiện vật hỏng sẽ bị đổi lấy xu.\" Nhưng giọng ông ấy chùng xuống."]},
    talk:b=>b.spare?"...Cứ đi đi.":b.hp<b.max*.5?pick(["Ta đã lau từng tủ kính mỗi ngày!","Không ai được phá vỡ bộ sưu tập của ta!"]):pick(["Đứng yên. Để ta ngắm cậu.","Cậu sẽ đẹp lắm trong một tủ kính.","Mọi thứ quý giá đều cần được khoá lại."]),
    flavor:b=>b.spare?"Giám Tuyển nhìn những tủ kính như lần đầu thấy chúng.":pick(["Ánh đèn trưng bày rọi thẳng vào cậu.","Khung tranh vàng lấp lánh.","Giám Tuyển chỉnh lại chiếc nơ không hề lệch."]),
    pats:["frames","spot","rarity","shards","rarity2"]},
});
Object.assign(PATS,{
  frames(b,R,dt){if(b.acc>.95){b.acc=0;const left=Math.random()<.5,y=rand(R.y+20,R.y+R.h-20),hgt=rand(26,46);b.bullets.push({x:left?R.x-30:R.x+R.w+30,y,vx:left?160:-160,vy:0,r:hgt/2,shape:"frame",w:46,h:hgt,upd:(u)=>{u.rx=u.w/2;u.ry=u.h/2}})}},
  shards(b,R,dt){if(b.acc>.14){b.acc=0;const fromL=Math.random()<.5;b.bullets.push({x:fromL?R.x+rand(0,R.w*.5):R.x+rand(R.w*.5,R.w),y:R.y-8,vx:fromL?70:-70,vy:rand(150,210),r:5,shape:"shard"})}},
  spot(b,R,dt){if(!b.bullets.some(u=>u.kind==="spot"))b.bullets.push({kind:"spot",x:R.x,y:R.y,a:0,life:99,upd:(u,dt)=>{u.a+=dt*1.3}});
    if(b.acc>.6){b.acc=0;b.bullets.push({x:R.x+rand(10,R.w-10),y:R.y-8,vx:0,vy:170,r:6,shape:"star"})}},
  rarity(b,R,dt){if(b.acc>.22){b.acc=0;const k=Math.floor(Math.random()*5),col=["#B8B8C8","#3FA9FF","#B86CFF","#FFC23D","#FF4D7A"][k];b.bullets.push({x:R.x+rand(10,R.w-10),y:R.y-8,vx:0,vy:110+k*45,r:5+k,shape:"ball",col})}},
  rarity2(b,R,dt){PATS.rarity(b,R,dt);if(Math.random()<dt*1.2)PATS.frames(b,R,1)},
  boxes(b,R,dt){if(b.acc>.5){b.acc=0;const trap=Math.random()<Math.max(.3,BOX_TRAP*2);b.bullets.push({x:R.x+rand(16,R.w-16),y:R.y-10,vx:0,vy:120,r:9,shape:"box",trap,upd:(u,dt,R)=>{if(u.trap&&u.y>R.y+R.h*.55&&!u.popped){u.popped=true;u.t=99;for(let k=0;k<8;k++){const a=k*TAU/8;b.bullets.push({x:u.x,y:u.y,vx:Math.cos(a)*130,vy:Math.sin(a)*130,r:4})}}}})}},
  boxes2(b,R,dt){PATS.boxes(b,R,dt)},
});
/* va chạm riêng: hộp vàng (không bẫy) hồi máu khi chạm; đèn rọi gây sát thương nếu đứng lâu */
{const du=dodgeUpdate;dodgeUpdate=function(b,dt){
  const h=b.heart,R=boxRect();
  for(const u of b.bullets){
    if(u.shape==="box"&&!u.trap){u.harmless=true;if(!u.got&&Math.hypot(h.x-u.x,h.y-u.y)<15){u.got=true;u.t=99;const s=sv();s.hp=Math.min(maxHP(),s.hp+2);sfx.coin()}}
    if(u.kind==="spot"){const cx=R.x+R.w/2+Math.sin(u.a||0)*R.w*.42;u.cx=cx;if(Math.abs(h.x-cx)<18){u.heat=(u.heat||0)+dt;if(u.heat>.45){u.heat=0;hurt(b,b.F.dmg)}}else u.heat=Math.max(0,(u.heat||0)-dt)}}
  du(b,dt)}}
{const db=drawBullet;drawBullet=function(g,u,R){
  if(u.kind==="spot"){const cx=u.cx||R.x+R.w/2;const gr=g.createLinearGradient(cx,R.y,cx,R.y+R.h);gr.addColorStop(0,"rgba(255,240,180,.55)");gr.addColorStop(1,"rgba(255,240,180,.1)");g.fillStyle=gr;g.beginPath();g.moveTo(cx-8,R.y);g.lineTo(cx+8,R.y);g.lineTo(cx+22,R.y+R.h);g.lineTo(cx-22,R.y+R.h);g.closePath();g.fill();return}
  if(u.shape==="frame"){g.strokeStyle="#FFD23D";g.lineWidth=4;g.strokeRect(u.x-u.w/2,u.y-u.h/2,u.w,u.h);g.fillStyle="rgba(255,210,60,.15)";g.fillRect(u.x-u.w/2,u.y-u.h/2,u.w,u.h);return}
  if(u.shape==="shard"){g.save();g.translate(u.x,u.y);g.rotate(Math.atan2(u.vy,u.vx));g.fillStyle="rgba(200,240,255,.9)";g.beginPath();g.moveTo(8,0);g.lineTo(-5,-4);g.lineTo(-3,4);g.closePath();g.fill();g.restore();return}
  if(u.shape==="star"){g.save();g.translate(u.x,u.y);g.rotate(u.t*4);g.fillStyle="#FFE98A";g.beginPath();for(let k=0;k<10;k++){const a=k*Math.PI/5,r=k%2?2.5:6.5;g.lineTo(Math.cos(a)*r,Math.sin(a)*r)}g.closePath();g.fill();g.restore();return}
  if(u.shape==="ball"){g.fillStyle=u.col;g.beginPath();g.arc(u.x,u.y,u.r,0,TAU);g.fill();g.fillStyle="rgba(255,255,255,.5)";g.beginPath();g.arc(u.x-u.r*.3,u.y-u.r*.3,u.r*.3,0,TAU);g.fill();return}
  if(u.shape==="box"){g.fillStyle=u.trap?"#E8A23A":"#FFC23D";g.fillRect(u.x-9,u.y-9,18,18);g.strokeStyle="#5a3a0a";g.lineWidth=2;g.strokeRect(u.x-9,u.y-9,18,18);g.fillStyle="#fff";g.font="900 12px Unbounded, sans-serif";g.textAlign="center";g.textBaseline="middle";g.fillText("?",u.x,u.y+1);return}
  return db(g,u,R)}}
async function stIntro2(){
  const m=S.storyMem;ST.cut={black:1};
  await say("voice","Cánh cổng phía sau khép lại.");
  if(m.killedWarden)await say("voice","Không ai tiễn cậu. Chỉ có tiếng chìa khoá lăn trên bậc thang.");else await say("voice","Cai Ngục đi theo cậu đến chân cầu thang, chậm rãi, như sợ mình đổi ý.");
  await say("voice","Pip đã được chọn. Bàn Tay đặt cậu ấy vào một nơi gọi là \"bộ sưu tập\".");
  await say("voice","Phía trên kia có ánh sáng. Và có tiếng vỗ tay.");
  ST.cut=null;await wait(300);
  await say(null,"(Chương 2 — PHÒNG TRƯNG BÀY. Lối đi ở phía trên.)");
}
async function ending2(){
  const s=sv(),dark=!!S.storyMem.killedCurator;
  if(dark){await say("pip","...Cậu đấy à. Ta nghe thấy tiếng kính vỡ. Nhiều lắm.");await say("pip","Đừng mở tủ. Cậu sẽ làm vỡ ta mất.")}
  else{await say("pip","MẢNH VỠ!! Cậu tới thật này!");await say("pip","...Trong này ấm lắm. Và lần đầu tiên trong đời, có người đứng nhìn ta.");
    const i=await choice("Pip áp mặt vào tấm kính.",["Ra ngoài với ta","Ở lại cũng được"],"pip");
    if(i===0){await say("pip","Ra ngoài thì ta sẽ không còn được ngắm nữa...");await say("pip","...Nhưng cậu nhớ tên ta. Gọi ta lần nữa đi.");await say(null,"(Cậu gọi: \"Pip.\")");sfx.reveal("mythic");await say("pip","Hehe. Vậy là đủ rồi.");s.flags.pipOut=true;S.storyMem.pipFree=true}
    else{await say("pip","Thật hả? Cảm ơn cậu! Cậu là người đầu tiên hỏi ta muốn gì đấy.");await say("pip","...Nhưng nếu có ngày ta muốn ra, cậu sẽ quay lại chứ?")}}
  ST.cut={lid:0};sfx.ko();for(let i=0;i<50;i++){ST.cut.lid=i/50;await wait(30)}
  await say("voice","Trên cao, chữ \"DỒN LỰC!\" sáng rực như một vì sao.");
  await say("voice",`Và ${fmt(S.coins)} đồng xu vàng lấp lánh trên bầu trời. Tất cả để mua thêm những chiếc rương.`);
  ST.cut.hand=0;for(let i=0;i<70;i++){ST.cut.hand=i/70;await wait(30)}
  await say("voice","Bàn Tay thò xuống. Lần này, về phía cậu.");
  if(dark){await say("voice","Nó nhấc cậu lên. Nhẹ nhàng, như nhặt một món đồ.");await say("voice","Một hiện vật hỏng... nhưng đã biết đập vỡ tủ kính. Hiếm đấy.")}
  else{await say("voice","Rồi nó khựng lại.");await say("voice","Lần đầu tiên, Bàn Tay không nhấc ai lên cả.");await say("voice","Như thể ở phía trên kia, có ai đó vừa đọc được một cái tên.")}
  ST.cut={black:1};
  S.storyMem.finished2=(S.storyMem.finished2||0)+1;S.storyMem.lv2=s.lv;S.coins+=800;S.gems+=30;S.copies.pip=(S.copies.pip||0)+1;if(!S.owned.pip)S.owned.pip=1;save();updateWallet();
  if(BY_ID.pip&&!BY_ID.pip.ab.desc.includes("gọi tên"))BY_ID.pip.ab.desc+=dark?"":" Đã có người gọi tên cậu ấy.";
  await say(null,"(+800 xu · +30 Gems · Pip thêm 1 bản sao)");
  await say(null,"HẾT CHƯƠNG 2 — PHÒNG TRƯNG BÀY");
  await say(null,"Chương 3: Người Cầm Điều Khiển — sắp ra mắt.");
  s.done=true;storyClose();
}
/* nhạc phòng trưng bày */
TRACKS.gallery={bpm:76,play(s,bar,t){const P=[[64,67,71],[60,64,67],[62,65,69],[59,62,67]],ch=P[bar%4],st=60/76/4;
  if(s===0)INS.pad(t,ch.map(n=>n-12),st*16,.6);if(s%3===0)INS.pluck(t,[ch[0]+12,ch[1]+12,ch[2]+12,ch[1]+24,ch[2]+12,ch[0]+24][(s/3|0)%6],st*3,.55,"sine");if(s===0||s===8)INS.bass(t,ch[0]-24,st*7,.5,320)}};
