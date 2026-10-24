
/* ═════════════════════════════════════════════════════════════
   SKIN SINH VẬT cho mọi quả bóng.
   Mỗi bóng là một "nhân vật" hoạt hình: thân bóng bẩy có viền, mắt biết nhìn theo hướng bay,
   biết chớp mắt, miệng, và các phụ kiện (gai, sừng, tai, cánh, vương miện…).
   Spec: { eyes, mouth, deco:[[tên,...tham số]], + tinh chỉnh (ey, ex, er, my, mw, ec, pc) }
   ═════════════════════════════════════════════════════════════ */
const OUTLN="rgba(12,6,28,.62)";
const SKINS={
  /* ── THƯỜNG ── */
  pebble:{eyes:"sleepy",mouth:"flat",deco:[["cracks","#6e6452"],["spots","#8a8070",3]]},
  spark:{eyes:"dot",mouth:"grin",deco:[["spikes","cone",6,"#FFE14D"],["cheeks","#ff8a5a"]]},
  moss:{eyes:"sleepy",mouth:"smile",deco:[["leaves","#5fbf3a"],["spots","#4e9a2e",4]]},
  zippy:{eyes:"dot",mouth:"smirk",deco:[["stripes","#ffffff",2],["goggles","#1f6b5e"]]},
  brick:{eyes:"angry",mouth:"flat",deco:[["cracks","#7a2e14"],["brow","#4a1a08"]]},
  pin:{eyes:"dot",mouth:"o",deco:[["spikes","cone",1,"#c9c2d8",-1.5708],["cheeks","#ffb0c8"]]},
  bubble:{eyes:"dot",mouth:"o",deco:[["bubbles","#ffffff"],["cheeks","#ffffff"]]},
  coal:{eyes:"angry",mouth:"grin",deco:[["cracks","#ff8a3a"],["spots","#222",3]]},
  pip:{eyes:"dot",mouth:"smile",deco:[["hat","cap","#b8860b"],["cheeks","#ff9a5a"]]},
  clover:{eyes:"sleepy",mouth:"smile",deco:[["leaves","#3fa83f"],["cheeks","#ffb0c8"]]},
  echo:{eyes:"cyclops",mouth:"o",deco:[["orbit","#ffffff"]]},
  jelly:{eyes:"dot",mouth:"smile",deco:[["tentacles","#e07ad8",4],["cheeks","#ffffff"]]},
  shard:{eyes:"sleepy",mouth:"flat",deco:[["spikes","cone",4,"#ffffff",.4],["facets","#ffffff"]]},
  gum:{eyes:"dot",mouth:"tongue",deco:[["bubbles","#ffffff"],["cheeks","#ff4d9a"]]},
  brimstone:{eyes:"angry",mouth:"smirk",deco:[["hat","cap","#5a3a1a"],["mustache","#4a2a10"]]},
  breach:{eyes:"angry",mouth:"grin",deco:[["brow","#4a1a08"],["cracks","#7a3a1a"],["spikes","nub",4,"#ffcf9a",.78]]},
  dune:{eyes:"sleepy",mouth:"smile",deco:[["stripes","#c78f2a",2],["spots","#fff0c8",3]]},
  nib:{eyes:"dot",mouth:"smirk",deco:[["monocle","#d9c27a"],["spots","#2a3a5a",2]]},
  cork:{eyes:"dot",mouth:"smile",deco:[["flattop","#a06a40"],["spots","#8a5a30",4]]},
  dot:{eyes:"dot",mouth:"smile",er:.26,deco:[["cheeks","#ff9ac8"]]},
  ember:{eyes:"angry",mouth:"grin",deco:[["flamehair","#ff5a1f","#ffd23d"]]},
  candy:{eyes:"dot",mouth:"tongue",deco:[["stripes","#ffffff",3],["cheeks","#ff4d9a"]]},
  tick:{eyes:"dot",mouth:"flat",deco:[["clock","#ffffff"],["antenna","#555","#ffd23d"]]},
  /* ── HIẾM ── */
  frost:{eyes:"sleepy",mouth:"flat",deco:[["spikes","cone",6,"#ffffff"]]},
  thorn:{eyes:"angry",mouth:"fang",deco:[["spikes","cone",8,"#2f6b2a"]]},
  quill:{eyes:"dot",mouth:"smirk",deco:[["ears","long","#fff4dd"],["cheeks","#ffb0c8"]]},
  volt:{eyes:"angry",mouth:"grin",deco:[["bolt","#ffffff"],["spikes","nub",4,"#fff6a8",.78]]},
  venom:{eyes:"slit",mouth:"fang",deco:[["spots","#4a7a1a",5],["tongue","#ff4d7a"]]},
  lodestone:{eyes:"dot",mouth:"o",deco:[["ears","bear","#ff4d4d"],["seam","#5a2a6a"]]},
  ricochet:{eyes:"dot",mouth:"smirk",deco:[["stripes","#ffffff",2],["goggles","#3a2a1a"]]},
  landmine:{eyes:"angry",mouth:"zig",deco:[["antenna","#333","#ff3b3b"],["seam","#7a1a2a"]]},
  fang:{eyes:"angry",mouth:"fang",deco:[["ears","cat","#C21E56"],["brow","#3a0718"]]},
  rang:{eyes:"dot",mouth:"smirk",deco:[["hat","cap","#8a4a1a"],["cheeks","#ffb07a"]]},
  prism:{eyes:"sleepy",mouth:"smile",deco:[["facets","#ffffff"],["spikes","cone",3,"#ffffff"]]},
  tide:{eyes:"dot",mouth:"smile",deco:[["drips","#e0f7ff"],["swirl","#ffffff"]]},
  buzz:{eyes:"angry",mouth:"smirk",deco:[["wings","#e8f6ff"],["antenna","#2a1a00"],["stripes","#2a1a00",3]]},
  magma:{eyes:"angry",mouth:"grin",deco:[["cracks","#ffb04d"],["flamehair","#ff3d00","#ffd23d"]]},
  siren:{eyes:"sleepy",mouth:"o",deco:[["hair","#c2185b"],["cheeks","#ffd0e0"]]},
  sova:{eyes:"bulge",mouth:"none",deco:[["ears","cat","#2a6b4a"],["wings","#bfe8d0"],["beak","#ffb03d"]]},
  sage:{eyes:"sleepy",mouth:"smile",deco:[["halo","#e8fff6"],["cheeks","#ffd0e0"]]},
  cypher:{eyes:"glow",ec:"#ffffff",mouth:"none",deco:[["mask","#2a2a33"],["hat","top","#3a3a44"]]},
  kayo:{eyes:"visor",ec:"#ff4d6a",mouth:"flat",deco:[["antenna","#2a3a6a","#ff4d6a"],["facets","#ffffff"]]},
  harbor:{eyes:"dot",mouth:"smile",deco:[["bubbles","#ffffff"],["swirl","#9ee6ff"]]},
  deadlock:{eyes:"visor",ec:"#e0ffff",mouth:"flat",deco:[["facets","#ffffff"],["seam","#5a8a8c"]]},
  howitzer:{eyes:"angry",mouth:"grin",deco:[["hat","cap","#4a5a3a"],["goggles","#2a2a2a"]]},
  static:{eyes:"dot",mouth:"grin",deco:[["bolt","#ffffff"],["spikes","nub",6,"#fff6a8"]]},
  weaver:{eyes:"tri",mouth:"fang",deco:[["legs","#5a3a8a"]]},
  spore:{eyes:"sleepy",mouth:"smile",deco:[["spots","#ffffff",5],["leaves","#7dbe5a"]]},
  bastion:{eyes:"angry",mouth:"flat",deco:[["helmet","#2a3a8a"],["brow","#1a1a3a"]]},
  comet:{eyes:"dot",mouth:"grin",deco:[["flamehair","#ff9eaa","#ffffff"],["stripes","#ffffff",1]]},
  bloom:{eyes:"sleepy",mouth:"smile",deco:[["leaves","#ff8fb8"],["spots","#ffd0e0",4],["cheeks","#ff6f9c"]]},
  /* ── ONE PIECE ── */
  luffy1:{eyes:"dot",mouth:"grin",deco:[["strawhat","#F2D16B"],["cheekscar","#5a1010"]]},
  buggy:{eyes:"angry",mouth:"grin",deco:[["hat","pirate","#2b2b3a"],["rednose","#E8302A"],["lips","#E8302A"]]},
  alvida:{eyes:"sleepy",mouth:"smile",deco:[["lips","#E8304A"],["freckles","#c87aa8"],["cheeks","#ff9ac8"]]},
  mr3:{eyes:"dot",mouth:"smirk",deco:[["txt","3","#3a2a1a"],["shades","#1a1a22"]]},
  wapol:{eyes:"dot",mouth:"grin",mw:.46,deco:[["crown","#FFD23D"],["spots","#5a7ab8",3]]},
  mr5:{eyes:"dot",mouth:"flat",deco:[["shades","#111111"],["rednose","#8a8a9a"]]},
  valentine:{eyes:"dot",mouth:"smile",deco:[["hat","cap","#E8B820"],["cheeks","#ff9a5a"]]},
  chopper:{eyes:"dot",mouth:"smile",er:.25,deco:[["antlers","#8a5a30"],["hat","top","#FF7AA8"],["rednose","#3a7ad8"]]},
  bentham:{eyes:"dot",mouth:"grin",deco:[["lips","#E8304A"],["cheeks","#ff9ac8"],["swan","#ffffff"]]},
  kaku:{eyes:"dot",mouth:"smirk",deco:[["hat","cap","#2a2a2a"],["longnose","#E8C35A"]]},
  luffy2:{eyes:"angry",mouth:"grin",deco:[["strawhat","#F2D16B"],["cheekscar","#5a1010"],["steam","#ffffff"]]},
  smoker:{eyes:"angry",mouth:"flat",deco:[["hair","#E8E8F0"],["cigars","#8a5a30"],["brow","#222"]]},
  robin:{eyes:"sleepy",mouth:"smile",deco:[["hair","#1a1020"],["cheeks","#c8a0e8"]]},
  brook:{eyes:"glow",ec:"#ffe08a",mouth:"none",deco:[["afro","#141018"],["hat","top","#1a1a22"],["skull","#1a1018"]]},
  perona:{eyes:"dot",mouth:"o",deco:[["hair","#FF5AA8"],["crown","#FFD23D"],["cheeks","#ffffff"]]},
  daz:{eyes:"angry",mouth:"flat",deco:[["spikes","cone",6,"#E8EEFF"],["xscar","#5a6070"]]},
  caesar:{eyes:"dot",mouth:"grin",deco:[["horns","#d8c8ff",.9],["spots","#6a4ab8",4]]},
  jozu:{eyes:"angry",mouth:"flat",deco:[["facets","#ffffff"],["brow","#4a6a7a"]]},
  bonney:{eyes:"dot",mouth:"tongue",deco:[["hat","cap","#FF5A8A"],["freckles","#c8507a"]]},
  sugar:{eyes:"sleepy",mouth:"smile",deco:[["hat","top","#2a4a8a"],["cheeks","#ffd0e0"]]},
  luffy3:{eyes:"angry",mouth:"grin",deco:[["strawhat","#F2D16B"],["cheekscar","#5a1010"],["fist","#F2C29B"]]},
  ace:{eyes:"dot",mouth:"grin",deco:[["cowboy","#FF8A1A"],["freckles","#7a3a10"]]},
  crocodile:{eyes:"angry",mouth:"smirk",deco:[["hair","#1a1a20"],["xscar","#6a3a20"],["hookarm","#FFD23D"]]},
  lucci:{eyes:"slit",mouth:"fang",deco:[["spots","#7a5a10",7],["hat","top","#1a1a1a"]]},
  law:{eyes:"angry",mouth:"smirk",deco:[["furhat","#F5F5F0"],["freckles","#2a2a40"]]},
  moria:{eyes:"dot",mouth:"grin",deco:[["horns","#3a2a50",1],["brow","#1a1028"]]},
  doflamingo:{eyes:"dot",mouth:"grin",deco:[["featherboa","#FF5AA8"],["shades","#FF5AA8"]]},
  magellan:{eyes:"glow",ec:"#d28bff",mouth:"zig",deco:[["horns","#5a1a8a",1.1],["spots","#5a1a8a",4]]},
  kuma:{eyes:"glow",ec:"#ffffff",mouth:"flat",deco:[["ears","bear","#4a4a5a"],["shades","#111111"]]},
  sabo:{eyes:"dot",mouth:"smirk",deco:[["hat","top","#2a4ac8"],["goggles","#3a2a1a"],["cheekscar","#a03a3a"]]},
  luffy4:{eyes:"angry",mouth:"grin",deco:[["strawhat","#F2D16B"],["stripes","#1a0508",2],["steam","#ffd0d8"]]},
  enel:{eyes:"dot",mouth:"smirk",deco:[["drums","#FFB03D"],["cheeks","#ffe08a"]]},
  aokiji:{eyes:"sleepy",mouth:"flat",deco:[["afro","#1a2a3a"],["sleepmask","#2a4a8a"]]},
  akainu:{eyes:"angry",mouth:"flat",deco:[["flamehair","#C0392B","#FFB03D"],["hat","cap","#8a1a1a"],["brow","#3a0a0a"]]},
  kizaru:{eyes:"dot",mouth:"o",deco:[["shades","#5a3a10"],["stripes","#ffffff",2]]},
  marco:{eyes:"sleepy",mouth:"smirk",deco:[["flamehair","#3AC8FF","#ffffff"],["wings","#7fe0ff"]]},
  fujitora:{eyes:"sleepy",mouth:"flat",deco:[["xscar","#3a1a5a"],["hair","#2a1a3a"]]},
  kid:{eyes:"angry",mouth:"grin",deco:[["flamehair","#D0263A","#FF7A3A"],["goggles","#2a2a2a"],["lips","#3a0a14"]]},
  hancock:{eyes:"sleepy",mouth:"smile",deco:[["hair","#141018"],["crown","#FFD23D"],["cheeks","#ff9ac8"]]},
  bartolomeo:{eyes:"angry",mouth:"tongue",deco:[["flamehair","#3fc85a","#9affb8"],["freckles","#1a6a2a"]]},
  luffy5:{eyes:"dot",mouth:"grin",mw:.42,deco:[["flamehair","#ffffff","#E8F6FF"],["clouds","#ffffff"],["strawhat","#F2D16B"]]},
  whitebeard:{eyes:"angry",mouth:"none",deco:[["wbstache","#ffffff"],["hat","cap","#2a2a3a"]]},
  blackbeard:{eyes:"dot",mouth:"grin",deco:[["beard","#141018"],["hat","pirate","#2a1a3a"]]},
  kaido:{eyes:"angry",mouth:"grin",deco:[["horns","#E8E8F0",1.3],["beard","#1a1a3a"],["hair","#141018"]]},
  yamato:{eyes:"dot",mouth:"grin",deco:[["horns","#E8304A",1.2],["hair","#F5F5FF"],["cheeks","#ffb0c8"]]},
  ryokugyu:{eyes:"sleepy",mouth:"smirk",deco:[["leaves","#3fae4a"],["horns","#d8c8a0",.8],["vines","#2a7a2a"]]},
  bigmom:{eyes:"dot",mouth:"grin",mw:.46,deco:[["hair","#FF5AA8"],["hat","pirate","#2a1a3a"],["lips","#E8304A"]]},
  shiki:{eyes:"angry",mouth:"grin",deco:[["flamehair","#FFC23D","#FFF2A0"],["xscar","#7a5a10"]]},
  sengoku:{eyes:"sleepy",mouth:"smile",deco:[["afro","#2a2a2a"],["beard","#e8e8e8"],["halo","#FFE98A"]]},
  katakuri:{eyes:"angry",mouth:"none",deco:[["scarf","#3a1a2a"],["hair","#7a1a3a"],["brow","#2a0a18"]]},
  /* ── SỬ THI ── */
  hive:{eyes:"angry",mouth:"grin",deco:[["wings","#E8F6FF"],["antenna","#2a1a00"],["stripes","#2A1A00",3],["spikes","cone",1,"#2a1a00"]]},
  titan:{eyes:"glow",ec:"#FFB04D",mouth:"flat",deco:[["cracks","#3a2410"],["horns","#8a5a38",.7],["brow","#3a2410"]]},
  lumen:{eyes:"dot",mouth:"smile",deco:[["spikes","cone",12,"#FFE14D"],["cheeks","#ff9ac8"]]},
  halo:{eyes:"sleepy",mouth:"smile",deco:[["wings","#FFFFFF"],["halo","#FFE98A"],["cheeks","#ffb0c8"]]},
  mirage:{eyes:"sleepy",mouth:"smile",deco:[["swirl","#ffffff"],["cheeks","#ff9ac8"],["spots","#ffffff",4]]},
  inferno:{eyes:"angry",mouth:"grin",deco:[["flamehair","#FF5A1F","#FFD23D"],["cheeks","#ffb04d"]]},
  glacier:{eyes:"sleepy",mouth:"flat",deco:[["spikes","cone",9,"#ffffff"],["cracks","#7fb8d6"]]},
  shackle:{eyes:"angry",mouth:"zig",deco:[["chainring","#c9d1e2"],["cracks","#4a5368"]]},
  kaboom:{eyes:"angry",mouth:"grin",deco:[["fuse","#7a5a3a"],["spots","#555a66",3]]},
  berserk:{eyes:"angry",mouth:"fang",deco:[["horns","#fff2d6",1],["scar","#2a0710"],["brow","#2a0710"]]},
  dice:{eyes:"dot",mouth:"smile",deco:[["pips","#16121f"]]},
  hook:{eyes:"dot",mouth:"grin",deco:[["hat","pirate","#2b2b3a"],["eyepatch","#14101c"],["hookarm","#c9d1e2"]]},
  warden:{eyes:"dot",mouth:"flat",deco:[["hat","cap","#1d3557"],["mustache","#2a1a10"]]},
  crystal:{eyes:"sleepy",mouth:"smile",deco:[["spikes","cone",8,"#ffffff"],["facets","#ffffff"]]},
  graviton:{eyes:"cyclops",mouth:"o",deco:[["orbit","#e0c3ff"],["spots","#e0c3ff",3]]},
  jett:{eyes:"dot",mouth:"smirk",deco:[["ears","long","#BDEBFF"],["wings","#ffffff"],["cheeks","#ff9ac8"]]},
  raze:{eyes:"angry",mouth:"grin",deco:[["goggles","#2b2b3a"],["spikes","nub",7,"#ffd23d"]]},
  omen:{eyes:"glow",ec:"#B9B0FF",mouth:"none",deco:[["hood","#2a2350"],["tentacles","#4b3f9e",4]]},
  yoru:{eyes:"visor",ec:"#7fe9ff",mouth:"smirk",deco:[["mask","#1b2166"],["horns","#6e83ff",.6]]},
  fade:{eyes:"glow",ec:"#d28bff",mouth:"zig",deco:[["tentacles","#2a2a45",5],["cracks","#8a5cff"]]},
  viper:{eyes:"slit",mouth:"fang",deco:[["spots","#1f8f4b",6],["tongue","#ff4d7a"]]},
  killjoy:{eyes:"dot",mouth:"smile",deco:[["goggles","#3a3a46"],["antenna","#555a66"],["cheeks","#ff9ac8"]]},
  gekko:{eyes:"bulge",mouth:"tongue",deco:[["spots","#6fb800",7],["spikes","nub",5,"#6fb800"]]},
  waylay:{eyes:"visor",ec:"#ffe3f2",mouth:"smirk",deco:[["stripes","#ffffff",2],["ears","cat","#F72585"]]},
  tempest:{eyes:"glow",ec:"#fff6a8",mouth:"grin",deco:[["clouds","#dfe9f7"],["bolt","#fff6a8"]]},
  anvil:{eyes:"angry",mouth:"flat",deco:[["brow","#1a1a22"],["flattop","#777c86"],["cracks","#555a66"]]},
  lantern:{eyes:"sleepy",mouth:"smile",deco:[["antenna","#7a5a1a","#fff2a8"],["cheeks","#ff9a5a"]]},
  maelstrom:{eyes:"angry",mouth:"grin",deco:[["swirl","#9ee6ff"],["spikes","cone",8,"#9ee6ff"]]},
  gambit:{eyes:"dot",mouth:"grin",deco:[["hat","top","#1a1a22"],["monocle","#ffd23d"],["mustache","#1a1a22"]]},
  pulsar:{eyes:"cyclops",mouth:"o",deco:[["orbit","#ff9af0"],["antenna","#7a1a6a","#ffd0f8"]]},
  scarab:{eyes:"dot",mouth:"fang",deco:[["horns","#1c3f9e",1.1],["seam","#1c3f9e"],["legs","#1c3f9e"]]},
  /* ── HUYỀN THOẠI ── */
  blink:{eyes:"dot",mouth:"smirk",deco:[["orbit","#d8d0ff"],["stripes","#ffffff",2]]},
  storm:{eyes:"angry",mouth:"grin",deco:[["clouds","#e8f1ff"],["bolt","#ffe45e"],["brow","#1d2b4f"]]},
  gemini:{eyes:"dot",mouth:"smile",deco:[["twin","#ff6f9c"],["cheeks","#ffd0e0"]]},
  chrono:{eyes:"dot",mouth:"smile",deco:[["clock","#ffffff"],["hat","top","#3a2a00"]]},
  rewind:{eyes:"dot",mouth:"o",deco:[["arrowring","#ffffff"],["cheeks","#ffffff"]]},
  singularity:{eyes:"cyclops",mouth:"none",deco:[["swirl","#c9baff"],["orbit","#c9baff"]]},
  phoenix:{eyes:"angry",mouth:"smirk",deco:[["flamehair","#FF7A1A","#FFE14D"],["wings","#FF9A3D"],["beak","#ffd23d"]]},
  hydra:{eyes:"slit",mouth:"fang",deco:[["heads","#2EC4B6"],["spots","#1a8a7d",5]]},
  joker:{eyes:"dot",mouth:"grin",deco:[["hat","jester","#7a2cff"],["spots","#7a2cff",3],["cheeks","#ff4d7a"]]},
  reaper:{eyes:"glow",ec:"#ff4d6a",mouth:"none",deco:[["hood","#2a2a3a"],["scythe","#d0d0e8"]]},
  tesla:{eyes:"dot",mouth:"o",deco:[["spikes","nub",8,"#cffaff"],["bolt","#ffffff"],["goggles","#2d3a4a"]]},
  kraken:{eyes:"angry",mouth:"grin",deco:[["tentacles","#c24a2c",6],["spots","#a63a22",8],["brow","#4a1608"]]},
  valkyrie:{eyes:"dot",mouth:"smile",deco:[["wings","#ffffff"],["hat","valk","#d8d8e8"],["braids","#ffe08a"]]},
  reyna:{eyes:"glow",ec:"#ff7ae0",mouth:"smirk",deco:[["hair","#2b0a3d"],["spikes","cone",6,"#d9a0ff"]]},
  chamber:{eyes:"dot",mouth:"smirk",deco:[["hat","top","#3a3a3a"],["monocle","#d9c27a"],["mustache","#3a2a1a"]]},
  skye:{eyes:"dot",mouth:"smile",deco:[["ears","cat","#2EC4B6"],["spots","#1a8a7d",4],["cheeks","#ff9ac8"],["leaves","#7dffa8"]]},
  astra:{eyes:"cyclops",mouth:"smile",deco:[["stars","#ffffff"],["halo","#d0b8ff"]]},
  vyse:{eyes:"angry",mouth:"smirk",deco:[["vines","#1f9d82"],["leaves","#8affd8"]]},
  tejo:{eyes:"angry",mouth:"grin",deco:[["hat","cap","#8a3a24"],["spikes","nub",5,"#ffd0b0"]]},
  cascade:{eyes:"dot",mouth:"smile",deco:[["drips","#9ee6ff"],["swirl","#ffffff"]]},
  hex:{eyes:"glow",ec:"#ff6af0",mouth:"zig",deco:[["hat","wizard","#3b0a44"],["runes","#ff9af0"]]},
  warp:{eyes:"cyclops",mouth:"o",deco:[["orbit","#e0b8ff"],["swirl","#e0b8ff"]]},
  aegis:{eyes:"dot",mouth:"flat",deco:[["shieldface","#fff2d6"],["halo","#ffe08a"]]},
  cinder:{eyes:"angry",mouth:"grin",deco:[["flamehair","#ff3d00","#ffd23d"],["cracks","#ffb04d"],["spikes","cone",7,"#5a0000"]]},
  retort:{eyes:"angry",mouth:"smirk",deco:[["shieldface","#e8c9a0"],["spikes","nub",8,"#e8c9a0"]]},
  parallax:{eyes:"dot",mouth:"smirk",deco:[["twin","#2fa8d0"],["orbit","#ffffff"]]},
  /* ── THẦN THOẠI ── */
  nova:{eyes:"angry",mouth:"grin",deco:[["spikes","cone",14,"#ffe14d"],["flamehair","#FF6B3D","#ffffff"]]},
  eclipse:{eyes:"glow",ec:"#ffffff",mouth:"none",deco:[["crescent","#ffd86b"],["stars","#ffffff"]]},
  meteor:{eyes:"angry",mouth:"grin",deco:[["flamehair","#ff8a00","#ffe08a"],["cracks","#7a3a00"],["craters","#c76400"]]},
  mimic:{eyes:"dot",mouth:"grin",deco:[["maskface","#ffffff"],["cheeks","#ff4d9a"]]},
  monarch:{eyes:"dot",mouth:"smile",deco:[["crown","#ffd23d"],["mustache","#7a5a00"],["cape","#c0392b"]]},
  paradox:{eyes:"dot",mouth:"o",deco:[["twin","#ffd0f0"],["orbit","#ffffff"]]},
  abyss:{eyes:"glow",ec:"#b8a8ff",mouth:"grin",deco:[["tentacles","#2a1070",6],["swirl","#9a82ff"]]},
  legion:{eyes:"angry",mouth:"grin",deco:[["helmet","#8a1a24"],["spikes","cone",6,"#ffd0d0"]]},
  doppel:{eyes:"dot",mouth:"smirk",deco:[["twin","#ff9ad8"],["mustache","#7a0a4a"]]},
  iso:{eyes:"visor",ec:"#ffe9a8",mouth:"flat",deco:[["facets","#ffffff"],["spikes","cone",6,"#ffe9a8"]]},
  neon:{eyes:"visor",ec:"#ffffff",mouth:"grin",deco:[["stripes","#ffffff",3],["bolt","#ffffff"],["spikes","nub",6,"#9ffcff"]]},
  clove:{eyes:"sleepy",mouth:"smirk",deco:[["horns","#ffd0f0",.8],["leaves","#7dffa8"],["cheeks","#ffffff"]]},
  veto:{eyes:"angry",mouth:"flat",deco:[["facets","#c8ccd6"],["spikes","cone",8,"#9aa0ac"],["brow","#1a1a22"]]},
  cataclysm:{eyes:"angry",mouth:"grin",deco:[["flamehair","#ff3d00","#ffd23d"],["craters","#aa2a00"],["cracks","#ffb04d"]]},
  overmind:{eyes:"tri",ec:"#ffe0ff",mouth:"smirk",deco:[["brainveins","#5a1a8a"],["antenna","#7a2cc0","#ffe0ff"]]},
  solstice:{eyes:"dot",mouth:"smile",deco:[["spikes","cone",12,"#ffe14d"],["crescent","#7a8cff"]]},
  leviathan:{eyes:"slit",mouth:"grin",deco:[["spikes","cone",7,"#bfe9ff"],["fins","#0a5a8a"],["bubbles","#ffffff"]]},
  genesis:{eyes:"dot",mouth:"smile",deco:[["leaves","#5ae07a"],["sprout","#5ae07a"],["cheeks","#ff9ac8"]]},
};
function hasSkin(def){return !!SKINS[def.id]}

/* ── phụ kiện ── */
const _o=(g,w=.06)=>{g.strokeStyle=OUTLN;g.lineWidth=w;g.stroke()};
const _poly=(g,pts)=>{g.beginPath();g.moveTo(pts[0],pts[1]);for(let i=2;i<pts.length;i+=2)g.lineTo(pts[i],pts[i+1]);g.closePath()};
const _fs=(g,fill,w)=>{g.fillStyle=fill;g.fill();_o(g,w)};
const DECO_BACK={
  spikes(g,c,d,t){const kind=d[1],n=d[2]||8,col=d[3]||shade(c,.3);
    for(let i=0;i<n;i++){const a=i*TAU/n+(d[4]||0),ca=Math.cos(a),sa=Math.sin(a);g.save();g.translate(ca*.9,sa*.9);g.rotate(a);
      if(kind==="nub"){g.beginPath();g.roundRect?g.roundRect(0,-.12,.34,.24,.1):g.rect(0,-.12,.34,.24);_fs(g,col,.05)}
      else{_poly(g,[0,-.14,.42,0,0,.14]);_fs(g,col,.05)}g.restore()}},
  wings(g,c,d,t){const col=d[1]||"#fff";for(const s of[-1,1]){g.save();g.translate(s*.95,-.15);g.rotate(s*(.55+Math.sin(t*7)*.08));g.beginPath();g.ellipse(s*.3,0,.62,.28,0,0,TAU);_fs(g,col,.05);g.beginPath();g.ellipse(s*.34,0,.42,.14,0,0,TAU);g.fillStyle="rgba(255,255,255,.35)";g.fill();g.restore()}},
  tentacles(g,c,d,t){const col=d[1]||shade(c,-.2),n=d[2]||5;for(let i=0;i<n;i++){const x=-.7+i*1.4/(n-1),w=Math.sin(t*3+i)*.1;g.beginPath();g.moveTo(x,.7);g.quadraticCurveTo(x+w+.1,1.1,x*1.15+w*2,1.5);g.lineWidth=.2;g.strokeStyle=OUTLN;g.stroke();g.lineWidth=.13;g.strokeStyle=col;g.stroke()}},
  ears(g,c,d){const kind=d[1],col=d[2]||c;for(const s of[-1,1]){if(kind==="bear"){g.beginPath();g.arc(s*.66,-.72,.3,0,TAU);_fs(g,col,.05)}
      else if(kind==="long"){g.save();g.translate(s*.42,-1);g.rotate(s*.25);g.beginPath();g.ellipse(0,-.3,.16,.5,0,0,TAU);_fs(g,col,.05);g.beginPath();g.ellipse(0,-.3,.08,.34,0,0,TAU);g.fillStyle="rgba(255,150,190,.6)";g.fill();g.restore()}
      else{_poly(g,[s*.35,-.85,s*.62,-1.42,s*.95,-.62]);_fs(g,col,.05);_poly(g,[s*.48,-.88,s*.63,-1.2,s*.8,-.76]);g.fillStyle="rgba(255,150,190,.65)";g.fill()}}},
  antenna(g,c,d,t){g.beginPath();g.moveTo(0,-.9);g.quadraticCurveTo(.12,-1.2,.22,-1.45);g.lineWidth=.09;g.strokeStyle=d[1]||"#333";g.stroke();const b=d[2]||"#ff4d6a";g.beginPath();g.arc(.22,-1.5,.14+Math.sin(t*6)*.015,0,TAU);_fs(g,b,.05)},
  horns(g,c,d){const col=d[1]||"#fff",k=d[2]||1;for(const s of[-1,1]){g.beginPath();g.moveTo(s*.32,-.86);g.quadraticCurveTo(s*.78,-.98,s*.7,-.86-.6*k);g.quadraticCurveTo(s*1.0,-.98,s*.72,-.66);g.closePath();_fs(g,col,.05)}},
  flamehair(g,c,d,t){for(const [x,s,ph] of[[-.38,.6,0],[0,.85,1.3],[.38,.6,2.4]]){const w=Math.sin(t*9+ph)*.06;g.save();g.translate(x,-.82);g.beginPath();g.moveTo(0,-.7*s-w*3);g.quadraticCurveTo(.3*s,-.25*s,.22*s,.1);g.lineTo(-.22*s,.1);g.quadraticCurveTo(-.3*s,-.25*s,0,-.7*s-w*3);_fs(g,d[1]||"#f60",.05);g.beginPath();g.moveTo(0,-.4*s);g.quadraticCurveTo(.15*s,-.15*s,.1*s,.08);g.lineTo(-.1*s,.08);g.quadraticCurveTo(-.15*s,-.15*s,0,-.4*s);g.fillStyle=d[2]||"#fd3";g.fill();g.restore()}},
  orbit(g,c,d,t){g.save();g.rotate(-.35);g.beginPath();g.ellipse(0,0,1.45,.42,0,Math.PI,TAU);g.lineWidth=.1;g.strokeStyle=d[1]||"#fff";g.stroke();g.restore()},
  hood(g,c,d){g.beginPath();g.moveTo(-1.05,.5);g.quadraticCurveTo(-1.15,-.9,0,-1.2);g.quadraticCurveTo(1.15,-.9,1.05,.5);g.closePath();_fs(g,d[1],.06)},
  legs(g,c,d){for(const s of[-1,1])for(const y of[-.35,.1,.55]){g.beginPath();g.moveTo(s*.85,y);g.lineTo(s*1.28,y+.2);g.lineWidth=.12;g.strokeStyle=OUTLN;g.stroke();g.lineWidth=.07;g.strokeStyle=d[1];g.stroke()}},
  fins(g,c,d){_poly(g,[0,-.9,.2,-1.5,.55,-.85]);_fs(g,d[1],.05);for(const s of[-1,1]){_poly(g,[s*.95,.1,s*1.45,.4,s*.95,.55]);_fs(g,d[1],.05)}},
  clouds(g,c,d){for(const [x,y,r] of[[-.75,-.55,.42],[.75,-.55,.42],[-.3,-.95,.46],[.35,-.95,.46],[0,-.7,.5]]){g.beginPath();g.arc(x,y,r,0,TAU);_fs(g,d[1],.05)}},
  heads(g,c,d,t){for(const s of[-1,1]){const w=Math.sin(t*4+s)*.08;g.beginPath();g.moveTo(s*.55,-.6);g.quadraticCurveTo(s*1.1,-.9,s*1.0+w,-1.35);g.lineWidth=.26;g.strokeStyle=OUTLN;g.stroke();g.lineWidth=.19;g.strokeStyle=d[1];g.stroke();g.beginPath();g.arc(s*1.0+w,-1.4,.22,0,TAU);_fs(g,d[1],.05);g.fillStyle="#fff";g.beginPath();g.arc(s*.94+w,-1.45,.06,0,TAU);g.fill()}},
  cape(g,c,d){g.beginPath();g.moveTo(-.9,.2);g.lineTo(-1.15,1.3);g.quadraticCurveTo(0,1.05,1.15,1.3);g.lineTo(.9,.2);g.closePath();_fs(g,d[1],.05)},
  scythe(g,c,d){g.save();g.rotate(.5);g.beginPath();g.moveTo(1.15,-1.3);g.lineTo(1.15,1.4);g.lineWidth=.09;g.strokeStyle="#5a4a3a";g.stroke();g.beginPath();g.moveTo(1.15,-1.3);g.quadraticCurveTo(.5,-1.7,.1,-1.1);g.quadraticCurveTo(.6,-1.35,1.15,-1.15);g.closePath();_fs(g,d[1],.04);g.restore()},
  vines(g,c,d,t){for(const s of[-1,1]){g.beginPath();g.moveTo(s*.7,.7);g.bezierCurveTo(s*1.3,.4,s*.8,-.2,s*1.2,-.7);g.lineWidth=.14;g.strokeStyle=OUTLN;g.stroke();g.lineWidth=.08;g.strokeStyle=d[1];g.stroke()}},
  fuse(g,c,d,t){g.beginPath();g.moveTo(.1,-.92);g.quadraticCurveTo(.2,-1.2,.45,-1.3);g.lineWidth=.1;g.strokeStyle=d[1];g.stroke();const f=.55+Math.random()*.3;g.beginPath();g.arc(.5,-1.32,.17*f+.08,0,TAU);g.fillStyle="#ffd23d";g.fill();g.beginPath();g.arc(.5,-1.32,.08,0,TAU);g.fillStyle="#fff";g.fill()},
  heads2(){},
  brainveins(){},
  chainring(g,c,d){g.beginPath();g.ellipse(0,.1,1.15,1.15,0,0,TAU);g.lineWidth=.16;g.strokeStyle=OUTLN;g.setLineDash([.28,.1]);g.stroke();g.lineWidth=.1;g.strokeStyle=d[1];g.stroke();g.setLineDash([])},
  hair(g,c,d){g.beginPath();g.moveTo(-1.02,.3);g.quadraticCurveTo(-1.1,-1.1,0,-1.15);g.quadraticCurveTo(1.1,-1.1,1.02,.3);g.lineTo(.8,-.2);g.lineTo(-.8,-.2);g.closePath();_fs(g,d[1],.05)},
  braids(g,c,d){for(const s of[-1,1]){g.beginPath();g.moveTo(s*.85,-.3);g.quadraticCurveTo(s*1.15,.3,s*.95,.95);g.lineWidth=.2;g.strokeStyle=OUTLN;g.stroke();g.lineWidth=.13;g.strokeStyle=d[1];g.stroke()}},
  sprout(){},
  afro(g,c,d){for(const [x,y,r] of[[0,-.85,.62],[-.58,-.68,.5],[.58,-.68,.5],[-.36,-1.18,.46],[.36,-1.18,.46]]){g.beginPath();g.arc(x,y,r,0,TAU);_fs(g,d[1],.05)}},
  antlers(g,c,d){for(const s of[-1,1]){g.beginPath();g.moveTo(s*.32,-.8);g.lineTo(s*.72,-1.45);g.moveTo(s*.55,-1.15);g.lineTo(s*.98,-1.22);g.moveTo(s*.62,-1.3);g.lineTo(s*.5,-1.62);g.lineWidth=.17;g.strokeStyle=OUTLN;g.stroke();g.lineWidth=.1;g.strokeStyle=d[1];g.stroke()}},
  featherboa(g,c,d){for(let k=0;k<11;k++){const a=Math.PI*(.05+k*.09),x=Math.cos(a)*1.02,y=Math.sin(a)*1.02-.05;g.beginPath();g.arc(x,y,.26,0,TAU);_fs(g,d[1],.04)}},
  drums(g,c,d,t){for(let k=0;k<6;k++){const a=Math.PI*(1.05+k*.18),x=Math.cos(a)*1.32,y=Math.sin(a)*1.32+.15;g.beginPath();g.arc(x,y,.2,0,TAU);_fs(g,d[1],.04);g.beginPath();g.arc(x,y,.08,0,TAU);g.fillStyle="#7a3a00";g.fill()}},
  swan(g,c,d){g.beginPath();g.moveTo(.6,.6);g.quadraticCurveTo(1.35,.4,1.15,-.25);g.lineWidth=.16;g.strokeStyle=OUTLN;g.stroke();g.lineWidth=.1;g.strokeStyle=d[1];g.stroke();g.beginPath();g.arc(1.12,-.3,.13,0,TAU);_fs(g,d[1],.04)},
  fist(g,c,d){g.beginPath();g.arc(1.05,.45,.42,0,TAU);_fs(g,d[1],.05);g.strokeStyle=OUTLN;g.lineWidth=.04;for(const y of[.3,.45,.6]){g.beginPath();g.moveTo(.8,y);g.lineTo(1.0,y);g.stroke()}},
  flattop(g,c,d){g.beginPath();g.roundRect?g.roundRect(-.72,-1.12,1.44,.3,.08):g.rect(-.72,-1.12,1.44,.3);_fs(g,d[1],.05)},
};
const DECO_FRONT={
  skull(g,c,d){for(const sx of[-1,1]){g.beginPath();g.ellipse(sx*.37,-.1,.25,.29,0,0,TAU);g.fillStyle=d[1];g.fill()}g.beginPath();g.moveTo(0,.08);g.lineTo(-.08,.24);g.lineTo(.08,.24);g.closePath();g.fill();
    g.fillStyle="#f5f0e6";g.beginPath();g.roundRect?g.roundRect(-.34,.36,.68,.18,.05):g.rect(-.34,.36,.68,.18);g.fill();_o(g,.035);g.strokeStyle=OUTLN;g.lineWidth=.03;for(let k=-2;k<=2;k++){g.beginPath();g.moveTo(k*.12,.36);g.lineTo(k*.12,.54);g.stroke()}},
  beard(g,c,d){g.beginPath();g.moveTo(-.86,.05);g.quadraticCurveTo(-.7,.95,0,1.12);g.quadraticCurveTo(.7,.95,.86,.05);g.quadraticCurveTo(.5,.3,0,.28);g.quadraticCurveTo(-.5,.3,-.86,.05);_fs(g,d[1],.05)},
  freckles(g,c,d){g.fillStyle=d[1];for(const s of[-1,1])for(const [x,y] of[[.5,.15],[.62,.22],[.54,.28],[.68,.12]]){g.beginPath();g.arc(s*x,y,.03,0,TAU);g.fill()}},
  cheekscar(g,c,d){g.beginPath();g.arc(-.38,.18,.11,.2,Math.PI-.2);g.lineWidth=.05;g.strokeStyle=d[1];g.stroke();for(const x of[-.46,-.38,-.3]){g.beginPath();g.moveTo(x,.24);g.lineTo(x,.32);g.lineWidth=.035;g.stroke()}},
  xscar(g,c,d){g.lineWidth=.07;g.strokeStyle=d[1];g.beginPath();g.moveTo(-.6,-.5);g.lineTo(.5,.35);g.moveTo(.6,-.5);g.lineTo(-.5,.35);g.globalAlpha=.75;g.stroke()},
  steam(g,c,d,t){for(let k=0;k<4;k++){const p=(t*.8+k*.25)%1,x=-.7+k*.45+Math.sin(t*3+k)*.08,y=-1.0-p*.6;g.beginPath();g.arc(x,y,.16+p*.12,0,TAU);g.fillStyle=d[1];g.globalAlpha=(1-p)*.6;g.fill()}g.globalAlpha=1},
  stripes(g,c,d){const n=d[2]||3;g.save();g.beginPath();g.arc(0,0,1,0,TAU);g.clip();g.fillStyle=d[1];g.globalAlpha=.78;for(let i=0;i<n;i++){const y=-.55+i*(1.15/Math.max(1,n-1))+(n===1?.55:0);g.fillRect(-1.2,y-.1,2.4,.2)}g.restore()},
  spots(g,c,d){const n=d[2]||4;g.save();g.beginPath();g.arc(0,0,1,0,TAU);g.clip();for(let i=0;i<n;i++){const a=i*2.4+1,r=.5+((i*37)%5)*.1,x=Math.cos(a)*r,y=Math.sin(a)*r*.9+.1,s=.09+((i*13)%4)*.025;g.beginPath();g.arc(x,y,s,0,TAU);g.fillStyle=d[1];g.globalAlpha=.7;g.fill()}g.restore()},
  cracks(g,c,d){g.save();g.beginPath();g.arc(0,0,1,0,TAU);g.clip();g.strokeStyle=d[1];g.lineWidth=.06;g.lineCap="round";for(const [x,y,dx,dy] of[[-.9,-.2,.45,.3],[.9,.4,-.4,.25],[.2,.95,-.1,-.5],[-.3,-.95,.2,.4]]){g.beginPath();g.moveTo(x,y);g.lineTo(x+dx*.4,y+dy*.7);g.lineTo(x+dx*.55,y+dy*.35);g.lineTo(x+dx,y+dy);g.stroke()}g.restore()},
  swirl(g,c,d,t){g.save();g.beginPath();g.arc(0,0,1,0,TAU);g.clip();g.strokeStyle=d[1];g.globalAlpha=.4;g.lineWidth=.07;g.beginPath();for(let a=0;a<14;a+=.25){const r=.12+a*.065;g.lineTo(Math.cos(a+t*.8)*r,Math.sin(a+t*.8)*r)}g.stroke();g.restore()},
  cheeks(g,c,d){for(const s of[-1,1]){g.beginPath();g.ellipse(s*.6,.22,.15,.1,0,0,TAU);g.fillStyle=d[1];g.globalAlpha=.7;g.fill();g.globalAlpha=1}},
  pips(g,c,d){for(const [x,y] of[[-.62,-.58],[.62,-.58],[-.62,.58],[.62,.58],[0,.9],[0,-.92]]){g.beginPath();g.arc(x,y,.1,0,TAU);g.fillStyle=d[1];g.fill()}},
  facets(g,c,d){g.save();g.beginPath();g.arc(0,0,1,0,TAU);g.clip();g.strokeStyle=d[1];g.globalAlpha=.35;g.lineWidth=.04;for(const [a,b,x,y] of[[-1,-.2,1,-.5],[-1,.4,.6,1],[-.2,-1,.6,.9],[.3,-1,-.5,1],[-.8,-.8,.9,.6]]){g.beginPath();g.moveTo(a,b);g.lineTo(x,y);g.stroke()}g.restore()},
  brow(g,c,d){for(const s of[-1,1]){g.beginPath();g.moveTo(s*.66,-.5);g.lineTo(s*.12,-.28);g.lineWidth=.12;g.strokeStyle=d[1];g.stroke()}},
  scar(g,c,d){g.beginPath();g.moveTo(-.55,-.5);g.lineTo(-.18,.15);g.lineWidth=.07;g.strokeStyle=d[1];g.stroke();for(let i=0;i<3;i++){const x=-.5+i*.12,y=-.4+i*.2;g.beginPath();g.moveTo(x-.06,y+.05);g.lineTo(x+.08,y-.05);g.stroke()}},
  mask(g,c,d){g.beginPath();g.moveTo(-1,-.38);g.quadraticCurveTo(0,-.55,1,-.38);g.lineTo(.96,.04);g.quadraticCurveTo(0,.18,-.96,.04);g.closePath();_fs(g,d[1],.04)},
  seam(g,c,d){g.beginPath();g.moveTo(0,-1);g.lineTo(0,1);g.lineWidth=.05;g.strokeStyle=d[1];g.globalAlpha=.7;g.stroke();g.globalAlpha=1},
  clock(g,c,d,t){g.beginPath();g.arc(0,.78,.2,0,TAU);_fs(g,d[1],.04);g.beginPath();g.moveTo(0,.78);g.lineTo(0,.65);g.moveTo(0,.78);g.lineTo(.1,.82);g.lineWidth=.04;g.strokeStyle="#222";g.stroke()},
  stars(g,c,d,t){for(const [x,y,s] of[[-.62,-.45,.1],[.7,-.1,.08],[.35,.7,.09],[-.5,.62,.07]]){const k=.6+.4*Math.sin(t*5+x*9);g.beginPath();for(let i=0;i<8;i++){const a=i*Math.PI/4,r=i%2?s*.4:s*1.4*k;g.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r)}g.closePath();g.fillStyle=d[1];g.fill()}},
  craters(g,c,d){for(const [x,y,r] of[[-.55,.5,.16],[.6,.5,.12],[.15,-.62,.13]]){g.beginPath();g.arc(x,y,r,0,TAU);g.fillStyle=d[1];g.globalAlpha=.7;g.fill();g.globalAlpha=1}},
  runes(g,c,d,t){g.save();g.globalAlpha=.55+.3*Math.sin(t*4);g.strokeStyle=d[1];g.lineWidth=.05;g.beginPath();g.moveTo(-.2,.55);g.lineTo(0,.85);g.lineTo(.2,.55);g.moveTo(-.3,.7);g.lineTo(.3,.7);g.stroke();g.restore()},
  drips(g,c,d,t){for(const [x,y] of[[-.5,.7],[0,.88],[.5,.7]]){g.beginPath();g.moveTo(x,y-.25);g.quadraticCurveTo(x+.12,y+.02,x,y+.2);g.quadraticCurveTo(x-.12,y+.02,x,y-.25);g.fillStyle=d[1];g.globalAlpha=.8;g.fill();g.globalAlpha=1}},
  brainveins(g,c,d){g.save();g.beginPath();g.arc(0,0,1,0,TAU);g.clip();g.strokeStyle=d[1];g.globalAlpha=.5;g.lineWidth=.06;g.beginPath();g.moveTo(-.9,-.3);g.quadraticCurveTo(-.5,-.7,-.1,-.5);g.quadraticCurveTo(.3,-.8,.8,-.4);g.moveTo(-.8,.2);g.quadraticCurveTo(-.4,-.1,0,.1);g.stroke();g.restore()},
  twin(g,c,d){g.save();g.beginPath();g.arc(0,0,1,0,TAU);g.clip();g.fillStyle=d[1];g.globalAlpha=.55;g.fillRect(0,-1.1,1.1,2.2);g.globalAlpha=1;g.beginPath();g.moveTo(0,-1);g.lineTo(0,1);g.lineWidth=.05;g.strokeStyle=OUTLN;g.stroke();g.restore()},
  crescent(g,c,d){g.save();g.beginPath();g.arc(0,0,1,0,TAU);g.clip();g.beginPath();g.arc(-.05,0,.98,0,TAU);g.arc(.34,-.1,.84,0,TAU,true);g.fillStyle=d[1];g.globalAlpha=.9;g.fill("evenodd");g.restore()},
  shieldface(g,c,d){g.save();g.beginPath();g.arc(0,0,1,0,TAU);g.clip();g.strokeStyle=d[1];g.lineWidth=.1;g.globalAlpha=.8;g.beginPath();g.arc(0,0,.9,0,TAU);g.stroke();g.beginPath();g.moveTo(0,-1);g.lineTo(0,1);g.moveTo(-1,.05);g.lineTo(1,.05);g.lineWidth=.05;g.stroke();g.restore()},
  maskface(g,c,d){g.beginPath();g.arc(0,0,.88,0,TAU);g.fillStyle=d[1];g.fill();_o(g,.04)},
  arrowring(g,c,d,t){g.beginPath();g.arc(0,0,.8,t*2,t*2+4.2);g.lineWidth=.1;g.strokeStyle=d[1];g.globalAlpha=.7;g.stroke();g.globalAlpha=1},
  bolt(g,c,d){g.beginPath();g.moveTo(.1,-.98);g.lineTo(-.18,-.5);g.lineTo(.02,-.5);g.lineTo(-.2,-.05);g.lineTo(.3,-.62);g.lineTo(.08,-.62);g.lineTo(.3,-.98);g.closePath();g.fillStyle=d[1];g.globalAlpha=.9;g.fill();g.globalAlpha=1},
  helmet(g,c,d){g.beginPath();g.moveTo(-1,-.05);g.quadraticCurveTo(-1.02,-1.05,0,-1.05);g.quadraticCurveTo(1.02,-1.05,1,-.05);g.lineTo(.7,-.3);g.lineTo(-.7,-.3);g.closePath();_fs(g,d[1],.05);g.beginPath();g.moveTo(0,-1.05);g.lineTo(0,-1.5);g.lineWidth=.14;g.strokeStyle="#ffd23d";g.stroke()},
  bubbles(g,c,d,t){for(const [x,y,r] of[[-.7,-.2,.1],[-.85,-.55,.07],[.8,-.4,.09]]){g.beginPath();g.arc(x,y-((t*.4)%.3),r,0,TAU);g.strokeStyle=d[1];g.lineWidth=.03;g.stroke()}},
  leaves(g,c,d,t){for(const s of[-1,1]){g.save();g.translate(s*.38,-.95);g.rotate(s*(.7+Math.sin(t*3)*.05));g.beginPath();g.ellipse(0,-.2,.14,.3,0,0,TAU);_fs(g,d[1],.04);g.restore()}},
};
const DECO_TOP={
  strawhat(g,c,d){const col=d[1];g.beginPath();g.ellipse(0,-.74,1.3,.3,0,0,TAU);_fs(g,col,.05);g.beginPath();g.moveTo(-.62,-.78);g.bezierCurveTo(-.62,-1.42,.62,-1.42,.62,-.78);g.closePath();_fs(g,col,.05);g.fillStyle="#D0263A";g.fillRect(-.6,-.96,1.2,.17);g.strokeStyle="rgba(140,100,30,.5)";g.lineWidth=.03;for(let k=-3;k<=3;k++){g.beginPath();g.moveTo(k*.3,-.62);g.lineTo(k*.36,-.88);g.stroke()}},
  cowboy(g,c,d){const col=d[1];g.beginPath();g.moveTo(-1.25,-.62);g.quadraticCurveTo(0,-.38,1.25,-.62);g.quadraticCurveTo(0,-.92,-1.25,-.62);_fs(g,col,.05);g.beginPath();g.moveTo(-.56,-.72);g.lineTo(-.5,-1.34);g.quadraticCurveTo(0,-1.16,.5,-1.34);g.lineTo(.56,-.72);g.closePath();_fs(g,col,.05);g.fillStyle="#2a1a10";g.fillRect(-.55,-.88,1.1,.12);for(const s of[-1,1]){g.beginPath();g.arc(s*.32,-1.05,.09,0,TAU);g.fillStyle="#ffd23d";g.fill()}},
  furhat(g,c,d){const col=d[1];g.beginPath();g.arc(0,-.6,.82,Math.PI,TAU);g.closePath();_fs(g,col,.05);for(let k=0;k<7;k++){g.beginPath();g.arc(-.78+k*.26,-.6,.15,0,TAU);_fs(g,col,.03)}g.fillStyle="#3a2a20";for(const [x,y] of[[-.4,-1.0],[.1,-1.2],[.45,-.9],[-.1,-.85]]){g.beginPath();g.arc(x,y,.09,0,TAU);g.fill()}},
  shades(g,c,d){for(const s of[-1,1]){g.beginPath();g.ellipse(s*.38,-.12,.31,.19,s*-.1,0,TAU);g.fillStyle=d[1];g.globalAlpha=.92;g.fill();g.globalAlpha=1;_o(g,.04);g.beginPath();g.ellipse(s*.38-.08,-.17,.1,.05,0,0,TAU);g.fillStyle="rgba(255,255,255,.55)";g.fill()}g.beginPath();g.moveTo(-.08,-.14);g.lineTo(.08,-.14);g.lineWidth=.05;g.strokeStyle=OUTLN;g.stroke()},
  wbstache(g,c,d){for(const s of[-1,1]){g.beginPath();g.moveTo(0,.24);g.quadraticCurveTo(s*.62,.4,s*1.12,-.22);g.quadraticCurveTo(s*.66,.2,0,.12);g.closePath();_fs(g,d[1],.04)}},
  scarf(g,c,d){g.beginPath();g.roundRect?g.roundRect(-.98,.12,1.96,.62,.28):g.rect(-.98,.12,1.96,.62);_fs(g,d[1],.05);for(let k=0;k<6;k++){g.beginPath();g.arc(-.8+k*.32,.14,.12,Math.PI,TAU);g.fillStyle=d[1];g.fill()}},
  sleepmask(g,c,d){g.beginPath();g.moveTo(-1,-.62);g.quadraticCurveTo(0,-.78,1,-.62);g.lineTo(.98,-.42);g.quadraticCurveTo(0,-.56,-.98,-.42);g.closePath();_fs(g,d[1],.04);g.strokeStyle="#fff";g.lineWidth=.05;for(const s of[-1,1]){g.beginPath();g.arc(s*.36,-.58,.12,.2,Math.PI-.2);g.stroke()}},
  rednose(g,c,d){g.beginPath();g.arc(0,.13,.17,0,TAU);const gr=g.createRadialGradient(-.05,.08,0,0,.13,.17);gr.addColorStop(0,"#fff");gr.addColorStop(.3,d[1]);gr.addColorStop(1,shade(d[1],-.4));g.fillStyle=gr;g.fill();_o(g,.04)},
  lips(g,c,d){g.beginPath();g.ellipse(0,.42,.2,.08,0,0,TAU);g.fillStyle=d[1];g.fill()},
  cigars(g,c,d){for(const [a,l] of[[-.35,.5],[-.15,.55]]){g.save();g.translate(.15,.4);g.rotate(a);g.fillStyle=d[1];g.fillRect(0,-.05,l,.1);g.fillStyle="#ffb03d";g.fillRect(l-.05,-.05,.05,.1);g.restore()}},
  txt(g,c,d){g.font="900 0.9px Unbounded, Arial Black, sans-serif";g.textAlign="center";g.textBaseline="middle";g.lineWidth=.12;g.strokeStyle=OUTLN;g.strokeText(d[1],0,-1.12);g.fillStyle=d[2];g.fillText(d[1],0,-1.12)},
  longnose(g,c,d){g.beginPath();g.roundRect?g.roundRect(-.06,.04,.6,.14,.04):g.rect(-.06,.04,.6,.14);_fs(g,d[1],.04)},
  crown(g,c,d){const col=d[1];g.beginPath();g.moveTo(-.55,-.82);g.lineTo(-.6,-1.35);g.lineTo(-.3,-1.1);g.lineTo(0,-1.5);g.lineTo(.3,-1.1);g.lineTo(.6,-1.35);g.lineTo(.55,-.82);g.closePath();_fs(g,col,.05);for(const x of[-.3,0,.3]){g.beginPath();g.arc(x,-.95,.05,0,TAU);g.fillStyle="#ff4d6a";g.fill()}},
  halo(g,c,d,t){g.beginPath();g.ellipse(0,-1.22+Math.sin(t*3)*.03,.55,.15,0,0,TAU);g.lineWidth=.12;g.strokeStyle=OUTLN;g.stroke();g.lineWidth=.08;g.strokeStyle=d[1];g.stroke()},
  hat(g,c,d){const k=d[1],col=d[2];
    if(k==="wizard"){_poly(g,[-.7,-.8,.1,-1.95,.7,-.8]);_fs(g,col,.05);g.beginPath();g.ellipse(0,-.8,.95,.2,0,0,TAU);_fs(g,col,.05)}
    else if(k==="top"){g.beginPath();g.ellipse(0,-.85,.8,.18,0,0,TAU);_fs(g,col,.05);g.beginPath();g.roundRect?g.roundRect(-.5,-1.55,1,.72,.08):g.rect(-.5,-1.55,1,.72);_fs(g,col,.05);g.fillStyle="#c0392b";g.fillRect(-.5,-1.0,1,.14)}
    else if(k==="cap"){g.beginPath();g.moveTo(-.9,-.55);g.quadraticCurveTo(-.9,-1.4,0,-1.4);g.quadraticCurveTo(.9,-1.4,.9,-.55);g.closePath();_fs(g,col,.05);g.beginPath();g.ellipse(0,-.56,1.0,.15,0,0,TAU);_fs(g,shade(col,-.2),.05);g.beginPath();g.arc(0,-.98,.14,0,TAU);g.fillStyle="#ffd23d";g.fill()}
    else if(k==="pirate"){g.beginPath();g.moveTo(-1,-.62);g.quadraticCurveTo(0,-1.7,1,-.62);g.quadraticCurveTo(0,-.78,-1,-.62);_fs(g,col,.05);g.fillStyle="#fff";g.beginPath();g.arc(0,-1.0,.1,0,TAU);g.fill()}
    else if(k==="jester"){for(const s of[-1,1]){g.beginPath();g.moveTo(s*.2,-.85);g.quadraticCurveTo(s*.9,-1.1,s*.95,-1.55);g.quadraticCurveTo(s*.55,-1.35,s*.05,-.85);_fs(g,col,.05);g.beginPath();g.arc(s*.95,-1.58,.11,0,TAU);g.fillStyle="#ffd23d";g.fill()}}
    else if(k==="valk"){g.beginPath();g.moveTo(-.9,-.45);g.quadraticCurveTo(-.9,-1.35,0,-1.35);g.quadraticCurveTo(.9,-1.35,.9,-.45);g.lineTo(.6,-.6);g.lineTo(-.6,-.6);g.closePath();_fs(g,col,.05);for(const s of[-1,1]){g.beginPath();g.ellipse(s*.98,-.95,.32,.14,s*.9,0,TAU);_fs(g,"#fff",.04)}}},
  glasses(g,c,d){},
  goggles(g,c,d){g.beginPath();g.moveTo(-1,-.22);g.lineTo(1,-.22);g.lineWidth=.12;g.strokeStyle=d[1];g.stroke();for(const s of[-1,1]){g.beginPath();g.arc(s*.38,-.12,.3,0,TAU);_fs(g,d[1],.04);g.beginPath();g.arc(s*.38,-.12,.21,0,TAU);g.fillStyle="rgba(150,230,255,.55)";g.fill()}},
  monocle(g,c,d){g.beginPath();g.arc(.38,-.12,.28,0,TAU);g.lineWidth=.06;g.strokeStyle=d[1];g.stroke();g.beginPath();g.moveTo(.6,.05);g.lineTo(.8,.6);g.lineWidth=.03;g.stroke()},
  mustache(g,c,d){for(const s of[-1,1]){g.beginPath();g.moveTo(0,.2);g.quadraticCurveTo(s*.3,.08,s*.52,.28);g.quadraticCurveTo(s*.3,.3,0,.26);g.closePath();g.fillStyle=d[1];g.fill()}},
  eyepatch(g,c,d){g.beginPath();g.moveTo(-1,-.62);g.lineTo(.9,.05);g.lineWidth=.05;g.strokeStyle=d[1];g.stroke();g.beginPath();g.ellipse(.36,-.1,.25,.22,0,0,TAU);_fs(g,d[1],.03)},
  orbit(g,c,d){g.save();g.rotate(-.35);g.beginPath();g.ellipse(0,0,1.45,.42,0,0,Math.PI);g.lineWidth=.1;g.strokeStyle=d[1];g.stroke();g.restore()},
  tongue(g,c,d){},
  beak(g,c,d){_poly(g,[-.14,.05,.14,.05,0,.3]);_fs(g,d[1],.04)},
  hookarm(g,c,d){g.beginPath();g.moveTo(.95,.35);g.lineTo(1.3,.6);g.arc(1.3,.8,.2,-Math.PI/2,Math.PI);g.lineWidth=.09;g.strokeStyle=d[1];g.stroke()},
};

function _eye(g,S,c,cx,cy,rr,gx,gy,blink,hurt,kind,sx){
  if(blink||hurt){g.beginPath();if(hurt){g.moveTo(cx-rr*.7,cy-rr*.5);g.lineTo(cx+rr*.5*(-sx||1),cy);g.lineTo(cx-rr*.7,cy+rr*.5)}else{g.moveTo(cx-rr,cy);g.quadraticCurveTo(cx,cy+rr*.6,cx+rr,cy)}g.lineWidth=.07;g.strokeStyle="#16121f";g.stroke();return}
  if(kind==="glow"){const ec=S.ec||"#fff";g.beginPath();g.arc(cx,cy,rr*1.7,0,TAU);const gr=g.createRadialGradient(cx,cy,0,cx,cy,rr*1.7);gr.addColorStop(0,ec);gr.addColorStop(.35,ec);gr.addColorStop(1,"rgba(0,0,0,0)");g.fillStyle=gr;g.globalAlpha=.9;g.fill();g.globalAlpha=1;g.beginPath();g.ellipse(cx+gx*rr*.15,cy+gy*rr*.15,rr*.78,rr*.95,0,0,TAU);g.fillStyle=ec;g.fill();g.beginPath();g.ellipse(cx+gx*rr*.3,cy+gy*rr*.3,rr*.32,rr*.42,0,0,TAU);g.fillStyle="#fff";g.fill();return}
  g.beginPath();g.arc(cx,cy,rr,0,TAU);const gr=g.createRadialGradient(cx-rr*.3,cy-rr*.3,0,cx,cy,rr);gr.addColorStop(0,"#fff");gr.addColorStop(1,kind==="slit"?"#ffe14d":"#e9e9f2");g.fillStyle=kind==="slit"?"#ffe14d":gr;g.fill();_o(g,.045);
  const pr=rr*(kind==="slit"?.9:.52),px=cx+gx*rr*.42,py=cy+gy*rr*.42;
  g.beginPath();if(kind==="slit")g.ellipse(px,py,pr*.32,pr*1.0,0,0,TAU);else g.arc(px,py,pr,0,TAU);g.fillStyle="#16121f";g.fill();
  g.beginPath();g.arc(px-pr*.3,py-pr*.35,pr*.28,0,TAU);g.fillStyle="#fff";g.fill();
  if(kind==="sleepy"){g.beginPath();g.moveTo(cx-rr*1.1,cy+rr*.02);g.arc(cx,cy,rr*1.1,Math.PI,TAU);g.closePath();g.fillStyle=shade(c,-.15);g.fill();_o(g,.045)}
  if(kind==="angry"){const ox=cx+sx*rr*1.25,ix=cx-sx*rr*1.1;g.beginPath();g.moveTo(ox,cy-rr*1.65);g.lineTo(ix,cy-rr*.55);g.lineWidth=.11;g.strokeStyle="#16121f";g.stroke()}
}
function _eyes(g,S,c,gx,gy,t,o){
  const st=S.eyes||"dot",ex=S.ex??.38,er=S.er??.215,ey=S.ey??-.1,blink=((t*.9+(o.id||0)*1.7)%4)<.1,hurt=!!o.hurt;
  if(st==="visor"){const ec=S.ec||"#7fe9ff";g.beginPath();g.moveTo(-.92,ey-.2);g.quadraticCurveTo(0,ey-.38,.92,ey-.2);g.lineTo(.84,ey+.2);g.quadraticCurveTo(0,ey+.36,-.84,ey+.2);g.closePath();_fs(g,"#12101f",.045);
    g.beginPath();g.roundRect?g.roundRect(-.7+gx*.08,ey-.1+gy*.05,1.4,.2,.1):g.rect(-.7,ey-.1,1.4,.2);g.fillStyle=ec;g.globalAlpha=blink?.35:1;g.fill();g.globalAlpha=1;return}
  if(st==="cyclops"){_eye(g,S,c,0,ey,er*1.7,gx,gy,blink,hurt,"dot",1);return}
  if(st==="tri"){_eye(g,S,c,0,ey-.3,er*.9,gx,gy,blink,hurt,"dot",1);_eye(g,S,c,-ex,ey+.05,er*.9,gx,gy,blink,hurt,"angry",-1);_eye(g,S,c,ex,ey+.05,er*.9,gx,gy,blink,hurt,"angry",1);return}
  const kind=st==="bulge"?"dot":st,rr=st==="bulge"?er*1.25:er;
  const exx=st==="bulge"?ex*1.05:ex,eyy=st==="bulge"?ey-.2:ey;
  _eye(g,S,c,-exx,eyy,rr,gx,gy,blink,hurt,kind,-1);_eye(g,S,c,exx,eyy,rr,gx,gy,blink,hurt,kind,1);
}
function _mouth(g,S,c,dc,o){
  const m=o.hurt?"o":(S.mouth||"smile"),my=S.my??.4,mw=S.mw??.34;
  g.lineCap="round";
  if(m==="none")return;
  if(m==="smile"){g.beginPath();g.arc(0,my-.2,mw,.18*Math.PI,.82*Math.PI);g.lineWidth=.08;g.strokeStyle="#16121f";g.stroke()}
  else if(m==="smirk"){g.beginPath();g.moveTo(-mw*.8,my);g.quadraticCurveTo(0,my+.18,mw*.9,my-.1);g.lineWidth=.08;g.strokeStyle="#16121f";g.stroke()}
  else if(m==="flat"){g.beginPath();g.moveTo(-mw*.8,my);g.lineTo(mw*.8,my);g.lineWidth=.09;g.strokeStyle="#16121f";g.stroke()}
  else if(m==="zig"){g.beginPath();g.moveTo(-mw,my);for(let i=1;i<=6;i++)g.lineTo(-mw+i*mw/3,my+(i%2?.09:-.04));g.lineWidth=.07;g.strokeStyle="#16121f";g.stroke()}
  else if(m==="o"){g.beginPath();g.ellipse(0,my+.04,.11,.14,0,0,TAU);g.fillStyle="#16121f";g.fill()}
  else if(m==="grin"||m==="fang"||m==="tongue"){
    if(m==="fang"){g.beginPath();g.arc(0,my-.2,mw,.15*Math.PI,.85*Math.PI);g.lineWidth=.08;g.strokeStyle="#16121f";g.stroke();for(const s of[-1,1]){_poly(g,[s*mw*.55,my+.1,s*mw*.3,my+.1,s*mw*.45,my+.3]);g.fillStyle="#fff";g.fill()}return}
    g.beginPath();g.moveTo(-mw,my-.12);g.quadraticCurveTo(0,my+.62,mw,my-.12);g.closePath();g.fillStyle="#2a0c24";g.fill();_o(g,.05);
    g.save();g.clip();g.fillStyle="#fff";g.fillRect(-mw,my-.14,mw*2,.15);if(m==="tongue"||m==="grin"){g.beginPath();g.ellipse(.02,my+.34,.2,.14,0,0,TAU);g.fillStyle="#ff6f8f";g.fill()}g.restore();
    if(m==="tongue"){g.beginPath();g.ellipse(.08,my+.4,.15,.2,0,0,TAU);g.fillStyle="#ff6f8f";g.fill();_o(g,.04)}}
}

/** Vẽ nguyên con sinh vật (thay cho quả bóng + icon). o: {gx,gy hướng nhìn, t thời gian, hurt, id} */
function drawCreature(g,def,x,y,r,o={}){
  const S=SKINS[def.id],c=def.color,t=o.t||0;
  let gx=o.gx||0,gy=o.gy||0;const gl=Math.hypot(gx,gy);if(gl>1){gx/=gl;gy/=gl}else{gx=.5;gy=.35}
  const D=S.deco||[];
  g.save();g.translate(x,y);g.scale(r,r);g.lineJoin="round";g.lineCap="round";
  for(const d of D){const f=DECO_BACK[d[0]];if(f){g.save();f(g,c,d,t,o);g.restore()}}
  g.beginPath();g.arc(0,0,1,0,TAU);
  const gr=g.createRadialGradient(-.38,-.42,.04,-.05,-.05,1.08);gr.addColorStop(0,shade(c,.62));gr.addColorStop(.3,shade(c,.18));gr.addColorStop(.72,c);gr.addColorStop(1,shade(c,-.58));
  g.fillStyle=gr;g.fill();_o(g,.075);
  for(const d of D){const f=DECO_FRONT[d[0]];if(f){g.save();f(g,c,d,t,o);g.restore()}}
  _eyes(g,S,c,gx,gy,t,o);_mouth(g,S,c,shade(c,-.6),o);
  for(const d of D){const f=DECO_TOP[d[0]];if(f){g.save();f(g,c,d,t,o);g.restore()}}
  g.save();g.beginPath();g.arc(0,0,1,0,TAU);g.clip();g.fillStyle="rgba(255,255,255,.3)";g.beginPath();g.ellipse(-.38,-.52,.36,.17,-.6,0,TAU);g.fill();g.beginPath();g.arc(.5,.62,.1,0,TAU);g.fillStyle="rgba(255,255,255,.14)";g.fill();g.restore();
  g.restore();
}

/* sprite tĩnh cho giao diện HTML (cache dataURL) */
const _skURL=new Map();
function skinURL(def){
  let u=_skURL.get(def.id);
  if(!u){const cv=document.createElement("canvas");cv.width=cv.height=192;const g=cv.getContext("2d");drawCreature(g,def,96,100,62,{gx:.45,gy:.25,t:0,id:1});u=cv.toDataURL("image/png");_skURL.set(def.id,u)}
  return u;
}
