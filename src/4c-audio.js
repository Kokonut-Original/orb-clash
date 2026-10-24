
/* ═════════════════════════════════════════════════════════════
   ÂM THANH NÂNG CAO — tổng hợp hoàn toàn bằng Web Audio, không cần file.
   • Mixer: SFX bus + Music bus → nén (compressor) → loa, kèm bus vang (reverb tự tạo)
   • Nhạc nền theo ngữ cảnh: sảnh (synthwave thư giãn), trận (nhịp 128), boss (tối, dồn dập),
     tự tăng cường độ khi sàn co lại hoặc máu thấp; chuyển bài có crossfade
   • SFX: va chạm nhiều lớp, cast theo nguyên tố, K.O., hộp, thắng
   ═════════════════════════════════════════════════════════════ */
if(!S.audio)S.audio={music:.55,sfx:.9};  // migration cho save cũ
const AUD={ready:false};
function _impulse(a,sec,decay){const n=Math.floor(a.sampleRate*sec),b=a.createBuffer(2,n,a.sampleRate);for(let c=0;c<2;c++){const d=b.getChannelData(c);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,decay)}return b}
function audInit(a){
  if(AUD.ready)return;
  const comp=a.createDynamicsCompressor();comp.threshold.value=-16;comp.knee.value=12;comp.ratio.value=4;comp.attack.value=.004;comp.release.value=.22;
  const master=a.createGain();master.gain.value=.9;master.connect(comp);comp.connect(a.destination);
  const sfxB=a.createGain();sfxB.gain.value=S.audio.sfx;sfxB.connect(master);
  const musB=a.createGain();musB.gain.value=0;musB.connect(master);
  const rev=a.createConvolver();rev.buffer=_impulse(a,2.2,2.8);const revG=a.createGain();revG.gain.value=.32;rev.connect(revG);revG.connect(master);
  Object.assign(AUD,{ready:true,a,comp,master,sfx:sfxB,mus:musB,rev});
}
function A(){const a=audio();if(!a)return null;audInit(a);return a}
/* thay tone/noise cũ: đi qua bus SFX + gửi một chút sang vang */
tone=function(f,d=.08,type="triangle",v=.06,slide=0,delay=0,rv=.12){const a=A();if(!a)return;const t0=a.currentTime+delay,o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(f,t0);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(25,f+slide),t0+d);g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(v,t0+.004);g.gain.exponentialRampToValueAtTime(.0001,t0+d);o.connect(g);g.connect(AUD.sfx);if(rv){const s=a.createGain();s.gain.value=rv;g.connect(s);s.connect(AUD.rev)}o.start(t0);o.stop(t0+d+.05)};
noise=function(d=.15,v=.1,freq=1200,q=.8,delay=0,type="lowpass",rv=.1){const a=A();if(!a)return;const t0=a.currentTime+delay,s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();s.buffer=NOISE;f.type=type;f.frequency.setValueAtTime(freq,t0);if(type==="lowpass")f.frequency.exponentialRampToValueAtTime(80,t0+d);f.Q.value=q;g.gain.setValueAtTime(v,t0);g.gain.exponentialRampToValueAtTime(.0001,t0+d);s.connect(f).connect(g);g.connect(AUD.sfx);if(rv){const r=a.createGain();r.gain.value=rv;g.connect(r);r.connect(AUD.rev)}s.start(t0);s.stop(t0+d+.02)};

/* — SFX mới — */
Object.assign(sfx,{
  hit:(amt,crit)=>{const k=Math.min(1,amt/25);tone(70+k*30,.22,"sine",.22+k*.12,-40,0,0);noise(.08+k*.12,.12+k*.12,2600+k*2500,.9);tone(180+k*60,.12,"triangle",.08+k*.06,-120);
    if(crit){tone(1760,.25,"square",.035,-1200,0,.35);tone(2637,.3,"sine",.03,-800,.03,.4);noise(.35,.1,7000,.6,0,"highpass",.3)}},
  wall:()=>{tone(320+Math.random()*120,.05,"sine",.018,-100,0,.05)},
  boom:small=>{tone(52,small?.35:.8,"sine",small?.28:.42,-22,0,.2);noise(small?.35:.9,small?.16:.26,small?1400:1000,.7,0,"lowpass",.35);noise(.12,.12,5000,.5,0,"highpass",.1)},
  ko:()=>{tone(46,1.4,"sine",.5,-20,0,.3);noise(1.4,.3,800,.6,0,"lowpass",.5);tone(220,1.1,"sawtooth",.07,-180,0,.5);[0,1,2].forEach(i=>tone([880,660,440][i],.5,"triangle",.05,-60,.25+i*.12,.5))},
  cast:el=>{const t={fire:()=>{noise(.5,.12,3000,.5,0,"bandpass",.3);tone(180,.4,"sawtooth",.05,320,0,.3)},
      ice:()=>{[0,1,2,3].forEach(i=>tone(1800+i*420,.25,"sine",.03,0,i*.04,.5));noise(.25,.05,9000,.8,0,"highpass",.3)},
      water:()=>{tone(300,.3,"sine",.07,500,0,.4);tone(520,.25,"sine",.05,-200,.08,.4);noise(.3,.05,1800,2,0,"bandpass",.3)},
      elec:()=>{noise(.25,.1,6000,6,0,"bandpass",.2);tone(1400,.18,"sawtooth",.04,-1100,0,.2);tone(90,.2,"square",.05,30,0,.1)},
      poison:()=>{[0,1,2].forEach(i=>tone(240+Math.random()*120,.12,"sine",.05,180,i*.07,.3));noise(.4,.05,900,3,0,"bandpass",.2)},
      nature:()=>{[0,1,2].forEach(i=>tone([660,880,990][i],.3,"triangle",.04,0,i*.05,.5));noise(.3,.04,4000,1,0,"bandpass",.3)},
      earth:()=>{tone(60,.45,"sine",.3,-25,0,.2);noise(.45,.14,700,.6,0,"lowpass",.3)},
      dark:()=>{tone(110,.6,"sawtooth",.06,-50,0,.6);tone(116,.6,"sawtooth",.05,-50,0,.6);noise(.6,.06,500,4,0,"bandpass",.5)},
      light:()=>{[0,1,2,3].forEach(i=>tone([1047,1319,1568,2093][i],.5,"sine",.035,0,i*.05,.7))},
      steel:()=>{tone(1200,.35,"square",.03,-200,0,.4);tone(1810,.4,"triangle",.03,-300,.02,.4);noise(.1,.08,6000,.7,0,"highpass",.1)},
      wind:()=>{noise(.6,.1,1200,1.5,0,"bandpass",.4);tone(400,.4,"sine",.03,400,0,.4)},
      arcane:()=>{[0,1,2].forEach(i=>tone([523,784,1175][i],.4,"triangle",.04,40,i*.06,.6))}}[el]||null;
    (t||(()=>{tone(520,.14,"triangle",.04,380);tone(1040,.18,"sine",.025,200,.05)}))()},
  callout:()=>{noise(.4,.1,1800,1.2,0,"bandpass",.35);tone(260,.35,"sawtooth",.05,420,0,.35);tone(1300,.25,"triangle",.03,-600,.05,.3)},
  win:()=>{[0,4,7,12,16].forEach((n,i)=>tone(523*Math.pow(2,n/12),.45,"triangle",.06,0,i*.09,.5));tone(1047,.9,"sine",.05,0,.5,.6)},
  reveal:r=>{const base=[523,659,784,988,1175][RARS.indexOf(r)];[0,1,2,3].forEach(i=>tone(base*[1,1.25,1.5,2][i],.35,"triangle",.05,0,i*.08,.5));if(RARS.indexOf(r)>=3){noise(.9,.08,9000,.5,0,"highpass",.5);tone(base*4,1.2,"sine",.03,0,.35,.8)}},
});
{let lastWin=0;const cb=confettiBurst;confettiBurst=function(...a){const n=performance.now();if(n-lastWin>2500){lastWin=n;sfx.win()}return cb.apply(this,a)}}

/* ═════ NHẠC NỀN ═════ */
const mid=n=>440*Math.pow(2,(n-69)/12);
function _env(g,t,a,v,d,rel){g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+a);g.gain.setTargetAtTime(0,t+d,rel)}
function _out(node,rv){node.connect(AUD.mus);if(rv){const s=AUD.a.createGain();s.gain.value=rv;node.connect(s);s.connect(AUD.rev)}}
const INS={
  kick(t,v=1){const a=AUD.a,o=a.createOscillator(),g=a.createGain();o.type="sine";o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(42,t+.12);g.gain.setValueAtTime(.55*v,t);g.gain.exponentialRampToValueAtTime(.001,t+.32);o.connect(g);_out(g,0);o.start(t);o.stop(t+.35)},
  snare(t,v=1){const a=AUD.a,s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();s.buffer=NOISE;f.type="highpass";f.frequency.value=1600;g.gain.setValueAtTime(.22*v,t);g.gain.exponentialRampToValueAtTime(.001,t+.18);s.connect(f).connect(g);_out(g,.25);s.start(t);s.stop(t+.2);
    const o=a.createOscillator(),g2=a.createGain();o.type="triangle";o.frequency.setValueAtTime(220,t);o.frequency.exponentialRampToValueAtTime(140,t+.08);g2.gain.setValueAtTime(.12*v,t);g2.gain.exponentialRampToValueAtTime(.001,t+.1);o.connect(g2);_out(g2,0);o.start(t);o.stop(t+.12)},
  hat(t,v=1,open){const a=AUD.a,s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();s.buffer=NOISE;f.type="highpass";f.frequency.value=8000;const d=open?.18:.045;g.gain.setValueAtTime(.07*v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);s.connect(f).connect(g);_out(g,0);s.start(t);s.stop(t+d+.02)},
  bass(t,n,d,v=1,cut=700){const a=AUD.a,o=a.createOscillator(),f=a.createBiquadFilter(),g=a.createGain();o.type="sawtooth";o.frequency.value=mid(n);f.type="lowpass";f.frequency.setValueAtTime(cut*2.2,t);f.frequency.exponentialRampToValueAtTime(cut*.5,t+d);f.Q.value=6;_env(g,t,.006,.16*v,d*.7,.05);o.connect(f).connect(g);_out(g,0);o.start(t);o.stop(t+d+.3)},
  pluck(t,n,d,v=1,type="square"){const a=AUD.a,o=a.createOscillator(),f=a.createBiquadFilter(),g=a.createGain();o.type=type;o.frequency.value=mid(n);f.type="lowpass";f.frequency.setValueAtTime(4200,t);f.frequency.exponentialRampToValueAtTime(700,t+d);_env(g,t,.003,.05*v,.02,d*.5);o.connect(f).connect(g);_out(g,.35);o.start(t);o.stop(t+d+.4)},
  pad(t,notes,d,v=1){const a=AUD.a,f=a.createBiquadFilter(),g=a.createGain();f.type="lowpass";f.frequency.value=1400;_env(g,t,d*.35,.035*v,d*.75,d*.3);f.connect(g);_out(g,.6);
    for(const n of notes)for(const det of[-7,7]){const o=a.createOscillator();o.type="sawtooth";o.frequency.value=mid(n);o.detune.value=det;o.connect(f);o.start(t);o.stop(t+d*1.6)}},
  lead(t,n,d,v=1){const a=AUD.a,o=a.createOscillator(),o2=a.createOscillator(),f=a.createBiquadFilter(),g=a.createGain();o.type="sawtooth";o2.type="square";o.frequency.value=mid(n);o2.frequency.value=mid(n)*1.003;f.type="lowpass";f.frequency.value=2600;_env(g,t,.01,.045*v,d*.8,.08);o.connect(f);o2.connect(f);f.connect(g);_out(g,.4);o.start(t);o2.start(t);o.stop(t+d+.4);o2.stop(t+d+.4)},
};
/* hợp âm theo bậc (midi) */
const PROG={
  lobby:[[57,60,64],[53,57,60],[48,52,55],[55,59,62]],          // Am F C G
  battle:[[57,60,64],[55,59,62],[53,57,60],[52,56,59]],         // Am G F E
  boss:[[50,53,57],[46,50,53],[43,46,50],[45,49,52]],           // Dm Bb Gm A
};
const MELO={battle:[76,0,74,72,0,72,74,76,79,0,76,74,72,0,69,0],boss:[74,0,77,0,74,72,70,0,69,0,70,72,74,0,0,0]};
const TRACKS={
  lobby:{bpm:92,play(s,bar,t,I){const ch=PROG.lobby[bar%4],st=60/92/4;
    if(s===0)INS.pad(t,ch.map(n=>n),st*16,1);
    if(s%2===0){const arp=[ch[0]+12,ch[1]+12,ch[2]+12,ch[1]+12,ch[0]+24,ch[2]+12,ch[1]+12,ch[2]+12];INS.pluck(t,arp[(s/2)%8],st*1.8,.8,"triangle")}
    if(s===0||s===8)INS.kick(t,.55);if(s%4===2)INS.hat(t,.6);if(s===0||s===10)INS.bass(t,ch[0]-12,st*5,.8,500)}},
  battle:{bpm:128,play(s,bar,t,I){const ch=PROG.battle[bar%4],st=60/128/4;
    if(s%4===0)INS.kick(t,1);if(s===4||s===12)INS.snare(t,1);if(s%2===1)INS.hat(t,.8);if(I>0&&s%2===0)INS.hat(t,.5);if(s===14)INS.hat(t,.6,true);
    if(s%2===0)INS.bass(t,ch[0]-12+(s%4===2?12:0),st*1.6,1,600+I*500);
    INS.pluck(t,[ch[0]+12,ch[1]+12,ch[2]+12,ch[1]+24][s%4],st*1.2,.55+I*.25);
    if(s===0&&bar%2===0)INS.pad(t,ch,st*32,.7);
    if((bar%8>=4||I>0)){const m=MELO.battle[s];if(m)INS.lead(t,m,st*1.8,.8)}}},
  boss:{bpm:140,play(s,bar,t,I){const ch=PROG.boss[bar%4],st=60/140/4;
    if(s%4===0||s===14)INS.kick(t,1);if(s===4||s===12)INS.snare(t,1.1);if(s%2===1||I>0)INS.hat(t,.7);
    INS.bass(t,ch[0]-12+(s%8===6?7:0),st*.9,1.1,500+I*600);
    if(s%2===0)INS.pluck(t,[ch[0]+12,ch[2]+12,ch[1]+12,ch[2]+24][(s/2)%4],st*1.4,.6,"sawtooth");
    if(s===0)INS.pad(t,ch.map(n=>n-12),st*16,.9);
    if(bar%4>=2||I>0){const m=MELO.boss[s];if(m)INS.lead(t,m-12,st*1.8,.9)}}},
};
const MUS={track:null,want:null,step:0,bar:0,next:0,timer:0,fade:0};
function musWanted(){if($("#cerOv"))return"lobby";if(!$("#match").hidden&&G)return G.boss?"boss":"battle";return"lobby"}
function musIntensity(){if(!G||$("#match").hidden)return 0;const m=G.mains&&G.mains[0];return(G.t>G.ot||(m&&m.alive&&m.hp/m.max<.3))?1:0}
function musTick(){
  if(!AUD.ready||!AC)return;const a=AUD.a,now=a.currentTime,vol=S.muted?0:S.audio.music*.55;
  const want=musWanted();
  if(want!==MUS.track){if(MUS.fade===0){MUS.fade=1;AUD.mus.gain.cancelScheduledValues(now);AUD.mus.gain.setTargetAtTime(0,now,.15);MUS.swapAt=now+.5}
    else if(now>=MUS.swapAt){MUS.track=want;MUS.step=0;MUS.bar=0;MUS.next=now+.05;MUS.fade=0;AUD.mus.gain.cancelScheduledValues(now);AUD.mus.gain.setTargetAtTime(vol,now,.4)}}
  else AUD.mus.gain.setTargetAtTime(vol,now,.2);
  const T=TRACKS[MUS.track];if(!T||MUS.fade)return;const st=60/T.bpm/4,I=musIntensity();
  while(MUS.next<now+.15){try{T.play(MUS.step,MUS.bar,MUS.next,I)}catch(e){}MUS.next+=st;MUS.step++;if(MUS.step>=16){MUS.step=0;MUS.bar++}}
}
function musStart(){if(MUS.timer)return;if(!A())return;MUS.timer=setInterval(musTick,25)}
addEventListener("pointerdown",musStart,{once:false,passive:true});
addEventListener("keydown",musStart,{passive:true});
document.addEventListener("visibilitychange",()=>{if(!AC)return;if(document.hidden)AC.suspend();else if(!S.muted)AC.resume()});

/* — thanh âm lượng trong cài đặt — */
{const os=openSettings;openSettings=function(){os();const sh=document.querySelector("#gfxOv .sheet");if(!sh)return;const foot=sh.querySelector(".gfx-foot");
  const row=(k,l)=>`<label style="display:flex;align-items:center;gap:12px;flex-shrink:0"><span style="min-width:110px;font-weight:700">${l}</span><input type="range" min="0" max="100" value="${Math.round(S.audio[k]*100)}" data-av="${k}" style="flex:1;accent-color:var(--you)"><span class="idx" data-avl="${k}">${Math.round(S.audio[k]*100)}%</span></label>`;
  foot.insertAdjacentHTML("beforebegin",`<div class="grp" style="display:flex;flex-direction:column;gap:10px;flex-shrink:0"><span class="idx">Âm thanh</span>${row("music","Nhạc nền")}${row("sfx","Hiệu ứng âm")}</div>`);
  sh.querySelectorAll("[data-av]").forEach(r=>r.oninput=()=>{const k=r.dataset.av;S.audio[k]=r.value/100;sh.querySelector(`[data-avl="${k}"]`).textContent=r.value+"%";if(AUD.ready){if(k==="sfx")AUD.sfx.gain.value=S.audio.sfx}save()});
  sh.querySelector('[data-av="sfx"]').onchange=()=>sfx.hit(14,false)}}
