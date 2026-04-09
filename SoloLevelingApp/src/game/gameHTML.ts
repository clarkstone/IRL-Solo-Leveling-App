// Generates the HTML/JS for the 2D side-scroller game running in a WebView
export interface GameConfig {
  playerHp: number;
  playerMaxHp: number;
  playerMp: number;
  playerMaxMp: number;
  playerAttack: number;
  playerDefense: number;
  playerSpeed: number;
  playerCritRate: number;
  playerDodgeRate: number;
  skills: { id: string; name: string; icon: string; damage: number; mpCost: number; cooldown: number; element: string }[];
  waves: { enemies: { id: string; name: string; icon: string; hp: number; maxHp: number; attack: number; defense: number; speed: number; isBoss: boolean }[] }[];
  dungeonName: string;
  backgroundTheme: string;
}

export const generateGameHTML = (config: GameConfig): string => {
  const configJSON = JSON.stringify(config).replace(/</g, '\\u003c');

  return `<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<style>
*{margin:0;padding:0;box-sizing:border-box;-webkit-user-select:none;user-select:none}
body{background:#030108;overflow:hidden;touch-action:none;font-family:-apple-system,sans-serif}
canvas{display:block}
#ui{position:absolute;top:0;left:0;right:0;padding:10px 14px;pointer-events:none;z-index:10}
.bars{margin-top:4px}
.bar-wrap{height:16px;border-radius:8px;background:rgba(15,15,35,0.9);margin-bottom:3px;overflow:hidden;position:relative;border:1px solid rgba(99,102,241,0.3)}
.hp-fill{height:100%;background:linear-gradient(90deg,#7f1d1d,#dc2626,#ef4444);border-radius:8px;transition:width 0.3s;box-shadow:0 0 8px rgba(239,68,68,0.4)}
.mp-fill{height:100%;background:linear-gradient(90deg,#312e81,#4f46e5,#818cf8);border-radius:8px;transition:width 0.3s;box-shadow:0 0 8px rgba(129,140,248,0.4)}
.bar-txt{position:absolute;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;color:#fff;font-size:9px;font-weight:800;text-shadow:0 1px 3px #000}
.wave-txt{text-align:center;color:#a78bfa;font-size:12px;font-weight:800;letter-spacing:3px;text-shadow:0 0 10px rgba(139,92,246,0.6)}
.dname{text-align:center;color:#c4b5fd;font-size:10px;font-weight:600;margin-bottom:2px;letter-spacing:1px}
#skills{position:absolute;bottom:14px;left:0;right:0;display:flex;justify-content:center;gap:8px;padding:0 14px;pointer-events:all;z-index:10}
.sk{width:54px;height:54px;border-radius:14px;background:rgba(15,5,30,0.9);border:2px solid rgba(139,92,246,0.4);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;position:relative;-webkit-tap-highlight-color:transparent;box-shadow:0 0 10px rgba(139,92,246,0.15)}
.sk.cd{opacity:0.35}.sk.nomp{opacity:0.25;border-color:#ef4444}
.sk .i{font-size:20px}.sk .n{font-size:7px;color:#a78bfa;margin-top:1px}
.sk .cdov{position:absolute;inset:0;background:rgba(0,0,0,0.65);border-radius:12px;display:flex;align-items:center;justify-content:center;color:#c4b5fd;font-size:15px;font-weight:900}
#atkbtn{position:absolute;bottom:82px;right:18px;width:66px;height:66px;border-radius:33px;background:radial-gradient(circle,rgba(139,92,246,0.9),rgba(88,28,135,0.9));border:3px solid #a78bfa;display:flex;align-items:center;justify-content:center;font-size:26px;cursor:pointer;pointer-events:all;z-index:10;-webkit-tap-highlight-color:transparent;box-shadow:0 0 20px rgba(139,92,246,0.5)}
#movs{position:absolute;bottom:82px;left:18px;display:flex;gap:10px;pointer-events:all;z-index:10}
.mbtn{width:54px;height:54px;border-radius:27px;background:rgba(15,5,30,0.85);border:2px solid rgba(139,92,246,0.3);display:flex;align-items:center;justify-content:center;font-size:18px;color:#c4b5fd;cursor:pointer;-webkit-tap-highlight-color:transparent}
#bosshp{position:absolute;bottom:155px;left:24px;right:24px;pointer-events:none;z-index:10;display:none}
.bname{color:#ef4444;font-size:11px;font-weight:900;text-align:center;letter-spacing:3px;text-shadow:0 0 10px rgba(239,68,68,0.6)}
.bhpbar{height:10px;background:rgba(15,15,35,0.9);border-radius:5px;overflow:hidden;margin-top:4px;border:1px solid rgba(239,68,68,0.3)}
.bhpfill{height:100%;background:linear-gradient(90deg,#7f1d1d,#dc2626,#f97316);border-radius:5px;transition:width 0.3s;box-shadow:0 0 12px rgba(239,68,68,0.4)}
#result{position:absolute;inset:0;background:rgba(3,1,8,0.92);display:none;flex-direction:column;align-items:center;justify-content:center;z-index:100;pointer-events:all}
#result.show{display:flex}
.rtitle{font-size:36px;font-weight:900;letter-spacing:6px;text-shadow:0 0 30px currentColor}
.rvic{color:#a78bfa}.rdef{color:#ef4444}
.rinfo{color:#94a3b8;font-size:14px;margin:16px 0;text-align:center;line-height:2}
.rbtn{padding:14px 40px;border-radius:14px;border:none;font-size:16px;font-weight:800;cursor:pointer;margin-top:8px;-webkit-tap-highlight-color:transparent;letter-spacing:1px}
.rbtn-v{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;box-shadow:0 0 25px rgba(139,92,246,0.5)}
.rbtn-d{background:#1e1b4b;color:#c4b5fd;border:1px solid rgba(139,92,246,0.3)}
.sysmsg{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#a78bfa;font-size:14px;font-weight:800;letter-spacing:4px;text-shadow:0 0 20px rgba(139,92,246,0.8);opacity:0;pointer-events:none;z-index:60;white-space:nowrap}
.sysmsg.show{animation:sysPop 1.5s ease-out forwards}
@keyframes sysPop{0%{opacity:0;transform:translate(-50%,-50%) scale(0.5)}15%{opacity:1;transform:translate(-50%,-50%) scale(1.1)}30%{transform:translate(-50%,-50%) scale(1)}80%{opacity:1}100%{opacity:0;transform:translate(-50%,-60%) scale(1)}}
</style></head><body>
<canvas id="c"></canvas>
<div id="ui">
  <div class="dname" id="dn"></div>
  <div class="wave-txt" id="wv">WAVE 1</div>
  <div class="bars">
    <div class="bar-wrap"><div class="hp-fill" id="hpB" style="width:100%"></div><div class="bar-txt" id="hpT"></div></div>
    <div class="bar-wrap"><div class="mp-fill" id="mpB" style="width:100%"></div><div class="bar-txt" id="mpT"></div></div>
  </div>
</div>
<div id="skills"></div>
<div id="movs">
  <div class="mbtn" ontouchstart="SM(-1)" ontouchend="SM(0)" onmousedown="SM(-1)" onmouseup="SM(0)">◀</div>
  <div class="mbtn" ontouchstart="SM(1)" ontouchend="SM(0)" onmousedown="SM(1)" onmouseup="SM(0)">▶</div>
</div>
<div id="atkbtn" ontouchstart="ATK()" onmousedown="ATK()">⚔️</div>
<div id="bosshp"><div class="bname" id="bn"></div><div class="bhpbar"><div class="bhpfill" id="bf" style="width:100%"></div></div></div>
<div id="result"><div class="rtitle" id="rt"></div><div class="rinfo" id="ri"></div><button class="rbtn" id="rb" onclick="HR()">OK</button></div>
<div class="sysmsg" id="sys"></div>
<script>
const C=${configJSON};
const cv=document.getElementById('c'),cx=cv.getContext('2d');
function rsz(){cv.width=innerWidth;cv.height=innerHeight}rsz();addEventListener('resize',rsz);
document.getElementById('dn').textContent=C.dungeonName;

let GO=false,VIC=false,CW=0,MD=0,ACD=0,SCD={},DMG=[],SKT=0,LT=0,FX=[],PARTICLES=[];

const P={x:80,y:0,w:40,h:52,hp:C.playerHp,mhp:C.playerMaxHp,mp:C.playerMp,mmp:C.playerMaxMp,
atk:C.playerAttack,def:C.playerDefense,spd:C.playerSpeed,cr:C.playerCritRate,dr:C.playerDodgeRate,
face:1,aatk:0,ahit:0,swordAngle:0,swordSwing:0,runCycle:0};

let EN=[],TK=0,TG=0,TE=0;
const GY=()=>cv.height*0.72;

// System message popup
function showSys(t){const el=document.getElementById('sys');el.textContent=t;el.className='sysmsg show';setTimeout(()=>el.className='sysmsg',1600)}

// Particles
function addParticles(x,y,color,count,spread){
  for(let i=0;i<count;i++){
    PARTICLES.push({x,y,vx:(Math.random()-0.5)*spread,vy:-Math.random()*spread*0.7-1,
    life:0.4+Math.random()*0.4,maxLife:0.8,color,size:2+Math.random()*3});
  }
}

// Slash FX
function addSlashFX(x,y,dir,isCrit){
  FX.push({type:'slash',x,y,dir,life:0.3,maxLife:0.3,crit:isCrit,angle:Math.random()*0.5-0.25});
  if(isCrit){
    FX.push({type:'flash',life:0.12,maxLife:0.12});
    addParticles(x,y,'#a78bfa',12,6);
    addParticles(x,y,'#fbbf24',8,4);
  } else {
    addParticles(x,y,'#818cf8',6,4);
  }
}

function spawnWave(wi){
  if(wi>=C.waves.length){endGame(true);return}
  CW=wi;
  const isBoss=wi===C.waves.length-1;
  document.getElementById('wv').textContent=isBoss?'⚠ BOSS WAVE ⚠':'WAVE '+(wi+1)+' / '+C.waves.length;
  if(isBoss)showSys('— WARNING: BOSS DETECTED —');
  else if(wi>0)showSys('— WAVE '+(wi+1)+' —');
  const wave=C.waves[wi];
  EN=wave.enemies.map((e,i)=>({...e,x:cv.width-70-(i*75),y:GY()-48,
    w:e.isBoss?54:40,h:e.isBoss?60:48,at:1+Math.random()*1.5,ha:0,da:0}));
  const boss=EN.find(e=>e.isBoss);
  if(boss){document.getElementById('bosshp').style.display='block';document.getElementById('bn').textContent=boss.name.toUpperCase();ubhp()}
  else document.getElementById('bosshp').style.display='none';
}

function ubhp(){const b=EN.find(e=>e.isBoss);if(b)document.getElementById('bf').style.width=Math.max(0,(b.hp/b.maxHp)*100)+'%'}

// Skills UI
(function(){
  const bar=document.getElementById('skills');
  C.skills.forEach((s,i)=>{SCD[s.id]=0;
    const b=document.createElement('div');b.className='sk';b.id='s_'+s.id;
    b.innerHTML='<span class="i">'+s.icon+'</span><span class="n">'+s.name.slice(0,7)+'</span>';
    b.addEventListener('touchstart',e=>{e.preventDefault();US(i)});
    b.addEventListener('mousedown',e=>{e.preventDefault();US(i)});
    bar.appendChild(b);
  });
})();

function SM(d){MD=d}window.SM=SM;

function ATK(){
  if(GO||ACD>0)return;ACD=0.35;P.aatk=0.35;P.swordSwing=1;
  const range=70;let tgt=null,md=Infinity;
  EN.forEach(e=>{if(e.hp<=0)return;const d=Math.abs((e.x+e.w/2)-(P.x+P.w/2));if(d<range+e.w/2&&d<md){tgt=e;md=d}});
  if(tgt){
    const ic=Math.random()<P.cr;let d=Math.max(1,P.atk-tgt.defense*0.5);if(ic)d*=2;d=Math.floor(d);
    hitEnemy(tgt,d,ic);
    addSlashFX(tgt.x+tgt.w/2,tgt.y+tgt.h/3,P.face,ic);
  } else {
    addSlashFX(P.x+P.w/2+P.face*35,P.y+P.h/3,P.face,false);
  }
}
window.ATK=ATK;

function US(i){
  if(GO)return;const s=C.skills[i];if(!s||SCD[s.id]>0||P.mp<s.mpCost)return;
  P.mp-=s.mpCost;SCD[s.id]=s.cooldown+1;P.aatk=0.4;P.swordSwing=1;
  showSys(s.name.toUpperCase());
  const aoe=s.damage>=2.5;
  if(aoe){
    FX.push({type:'flash',life:0.15,maxLife:0.15});
    EN.forEach(e=>{if(e.hp<=0)return;const ic=Math.random()<P.cr;let d=Math.max(1,P.atk*s.damage-e.defense*0.3);if(ic)d*=1.5;d=Math.floor(d);hitEnemy(e,d,ic);addParticles(e.x+e.w/2,e.y+e.h/2,'#c084fc',10,5)});
  } else {
    let tgt=null,md=Infinity;EN.forEach(e=>{if(e.hp<=0)return;const d=Math.abs((e.x+e.w/2)-(P.x+P.w/2));if(d<md){tgt=e;md=d}});
    if(tgt){const ic=Math.random()<P.cr;let d=Math.max(1,P.atk*s.damage-tgt.defense*0.3);if(ic)d*=1.5;d=Math.floor(d);hitEnemy(tgt,d,ic);addSlashFX(tgt.x+tgt.w/2,tgt.y+tgt.h/3,P.face,ic)}
  }
  uUI();
}

function hitEnemy(e,d,ic){
  e.hp=Math.max(0,e.hp-d);e.ha=0.25;
  DMG.push({x:e.x+e.w/2+(Math.random()-0.5)*20,y:e.y-5,t:String(d),tp:ic?'crit':'',life:0.9});
  ubhp();
  if(e.hp<=0){
    TK++;TE+=Math.floor(d*0.5);TG+=Math.floor(d*0.2);
    addParticles(e.x+e.w/2,e.y+e.h/2,'#8b5cf6',15,6);
    e.da=0.5;
    if(EN.every(en=>en.hp<=0))setTimeout(()=>{CW+1>=C.waves.length?endGame(true):spawnWave(CW+1)},700);
  }
}

function hitPlayer(d){
  if(Math.random()<P.dr){DMG.push({x:P.x+P.w/2,y:P.y-5,t:'DODGE',tp:'dodge',life:0.8});return}
  const ad=Math.max(1,d-P.def*0.4);P.hp=Math.max(0,P.hp-Math.floor(ad));P.ahit=0.25;SKT=0.15;
  DMG.push({x:P.x+P.w/2,y:P.y-5,t:String(Math.floor(ad)),tp:'phit',life:0.9});
  addParticles(P.x+P.w/2,P.y+P.h/2,'#ef4444',8,4);
  uUI();if(P.hp<=0)endGame(false);
}

function endGame(w){
  GO=true;VIC=w;
  const rs=document.getElementById('result'),rt=document.getElementById('rt'),ri=document.getElementById('ri'),rb=document.getElementById('rb');
  rs.classList.add('show');
  if(w){
    rt.textContent='DUNGEON CLEARED';rt.className='rtitle rvic';
    ri.innerHTML='[SYSTEM] You have cleared the dungeon.<br><br>⭐ EXP earned<br>💰 Gold earned<br>📦 Rewards await';
    rb.className='rbtn rbtn-v';rb.textContent='COLLECT REWARDS';
    showSys('— DUNGEON CLEARED —');
  } else {
    rt.textContent='YOU DIED';rt.className='rtitle rdef';
    ri.innerHTML='[SYSTEM] You have been defeated.<br>Return and grow stronger.';
    rb.className='rbtn rbtn-d';rb.textContent='RETREAT';
  }
}

function HR(){
  const msg=JSON.stringify({type:VIC?'victory':'defeat',kills:TK,exp:TE,gold:TG});
  try{if(window.ReactNativeWebView)window.ReactNativeWebView.postMessage(msg)}catch(e){}
  try{window.parent.postMessage(msg,'*')}catch(e){}
}
window.HR=HR;

function uUI(){
  document.getElementById('hpB').style.width=Math.max(0,(P.hp/P.mhp)*100)+'%';
  document.getElementById('mpB').style.width=Math.max(0,(P.mp/P.mmp)*100)+'%';
  document.getElementById('hpT').textContent=Math.floor(P.hp)+'/'+P.mhp;
  document.getElementById('mpT').textContent=Math.floor(P.mp)+'/'+P.mmp;
  C.skills.forEach(s=>{
    const b=document.getElementById('s_'+s.id);if(!b)return;
    const cd=SCD[s.id]||0,nm=P.mp<s.mpCost;
    b.className='sk'+(cd>0?' cd':'')+(nm?' nomp':'');
    let ov=b.querySelector('.cdov');
    if(cd>0){if(!ov){ov=document.createElement('div');ov.className='cdov';b.appendChild(ov)}ov.textContent=Math.ceil(cd)}
    else if(ov)ov.remove();
  });
}

// === RENDERING ===
const TH={
  cave:{s:'#0a0518',g:'#120e24',a:'#1a1338',p:'#6d28d9'},
  forest:{s:'#060e08',g:'#0e1e10',a:'#142e16',p:'#22c55e'},
  tomb:{s:'#0e0818',g:'#1a1230',a:'#221842',p:'#8b5cf6'},
  fortress:{s:'#120e08',g:'#241e14',a:'#302818',p:'#f59e0b'},
  tower:{s:'#100610',g:'#201020',a:'#2e1430',p:'#ec4899'},
  ice:{s:'#081018',g:'#102030',a:'#142840',p:'#06b6d4'},
  demon:{s:'#140404',g:'#280a0a',a:'#3a0c0c',p:'#ef4444'},
  shadow:{s:'#030310',g:'#08081c',a:'#0e0e2a',p:'#8b5cf6'},
};

function drawBG(){
  const th=TH[C.backgroundTheme]||TH.cave,gy=GY(),t=Date.now()*0.001;
  // Sky gradient
  const sg=cx.createLinearGradient(0,0,0,gy);
  sg.addColorStop(0,'#010005');sg.addColorStop(1,th.s);
  cx.fillStyle=sg;cx.fillRect(0,0,cv.width,gy);
  // Floating particles (mana-like)
  for(let i=0;i<25;i++){
    const px=(i*53+t*15*(i%3+1))%cv.width,py=(i*37+Math.sin(t+i)*20)%(gy-30);
    const a=0.15+Math.sin(t*2+i)*0.1;
    cx.fillStyle=th.p;cx.globalAlpha=a;
    cx.beginPath();cx.arc(px,py,1+Math.sin(t+i*0.5)*0.5,0,Math.PI*2);cx.fill();
    cx.globalAlpha=1;
  }
  // Ground
  const gg=cx.createLinearGradient(0,gy,0,cv.height);
  gg.addColorStop(0,th.g);gg.addColorStop(1,th.a);
  cx.fillStyle=gg;cx.fillRect(0,gy,cv.width,cv.height-gy);
  // Ground glow line
  cx.strokeStyle=th.p;cx.lineWidth=2;cx.globalAlpha=0.4;
  cx.beginPath();cx.moveTo(0,gy);cx.lineTo(cv.width,gy);cx.stroke();
  cx.globalAlpha=0.15;cx.lineWidth=6;cx.beginPath();cx.moveTo(0,gy);cx.lineTo(cv.width,gy);cx.stroke();
  cx.globalAlpha=1;
}

function drawPlayer(){
  const gy=GY();P.y=gy-P.h;
  const sk=SKT>0?(Math.random()-0.5)*8:0,px=P.x+sk,py=P.y+sk;
  // Shadow with glow
  cx.fillStyle='rgba(139,92,246,0.15)';cx.beginPath();cx.ellipse(px+P.w/2,gy+2,P.w*0.7,8,0,0,Math.PI*2);cx.fill();
  cx.fillStyle='rgba(0,0,0,0.4)';cx.beginPath();cx.ellipse(px+P.w/2,gy,P.w*0.5,5,0,0,Math.PI*2);cx.fill();
  // Aura
  if(P.aatk>0){cx.strokeStyle='rgba(139,92,246,'+(P.aatk)+')';cx.lineWidth=3;cx.beginPath();cx.arc(px+P.w/2,py+P.h/2,30+Math.random()*5,0,Math.PI*2);cx.stroke()}
  // Cloak/body
  const bc=P.ahit>0?'#6b21a8':'#1e1b4b';
  cx.fillStyle=bc;
  cx.beginPath();cx.moveTo(px+8,py+16);cx.lineTo(px+P.w-8,py+16);cx.lineTo(px+P.w-4,py+44);cx.lineTo(px+4,py+44);cx.closePath();cx.fill();
  // Armor highlights
  cx.fillStyle=P.ahit>0?'#9333ea':'#312e81';
  cx.fillRect(px+12,py+18,16,4);cx.fillRect(px+10,py+24,20,2);
  // Head
  cx.fillStyle=P.ahit>0?'#ddd6fe':'#e2e8f0';
  cx.beginPath();cx.arc(px+P.w/2,py+10,11,0,Math.PI*2);cx.fill();
  // Glowing eyes
  const ex=P.face>0?4:-4;
  cx.fillStyle='#8b5cf6';cx.beginPath();cx.arc(px+P.w/2+ex-2,py+9,2.5,0,Math.PI*2);cx.fill();
  cx.arc(px+P.w/2+ex+4,py+9,2.5,0,Math.PI*2);cx.fill();
  cx.fillStyle='#c4b5fd';cx.beginPath();cx.arc(px+P.w/2+ex-2,py+9,1,0,Math.PI*2);cx.fill();
  cx.arc(px+P.w/2+ex+4,py+9,1,0,Math.PI*2);cx.fill();
  // Eye glow
  cx.fillStyle='rgba(139,92,246,0.3)';cx.beginPath();cx.arc(px+P.w/2+ex+1,py+9,6,0,Math.PI*2);cx.fill();
  // Legs
  const lOff=MD!==0?Math.sin(P.runCycle*12)*4:0;
  cx.fillStyle='#1e1b4b';
  cx.fillRect(px+11,py+42,7,10+lOff);cx.fillRect(px+22,py+42,7,10-lOff);
  // Boots
  cx.fillStyle='#312e81';
  cx.fillRect(px+9,py+50+lOff,10,4);cx.fillRect(px+21,py+50-lOff,10,4);
  
  // SWORD - always visible, dramatic swing animation
  const swt=P.swordSwing;
  cx.save();
  const sx=px+P.w/2+P.face*8,sy=py+22;
  cx.translate(sx,sy);
  let sAngle;
  if(swt>0){
    // Swing arc: goes from behind to forward
    const prog=1-swt;
    sAngle=P.face>0?(-1.2+prog*2.8):(-1.6-prog*2.8+3.14);
    // Sword trail/afterimage
    for(let t=0;t<3;t++){
      const tp=(1-(swt+t*0.08));
      const ta=P.face>0?(-1.2+tp*2.8):(-1.6-tp*2.8+3.14);
      cx.save();cx.rotate(ta);
      cx.strokeStyle='rgba(139,92,246,'+(0.15-t*0.04)+')';cx.lineWidth=4;
      cx.beginPath();cx.moveTo(0,0);cx.lineTo(P.face*28,0);cx.stroke();
      cx.restore();
    }
  } else {
    sAngle=P.face>0?0.3:-0.3+3.14;
  }
  cx.rotate(sAngle);
  // Blade
  cx.strokeStyle='#c4b5fd';cx.lineWidth=3.5;cx.beginPath();cx.moveTo(0,0);cx.lineTo(P.face*30,0);cx.stroke();
  // Blade glow
  cx.strokeStyle='rgba(167,139,250,0.5)';cx.lineWidth=8;cx.beginPath();cx.moveTo(0,0);cx.lineTo(P.face*28,0);cx.stroke();
  // Blade tip
  cx.fillStyle='#e9d5ff';cx.beginPath();cx.arc(P.face*30,0,3,0,Math.PI*2);cx.fill();
  // Handle
  cx.fillStyle='#7c3aed';cx.fillRect(-3,-4,6,8);
  cx.restore();
}

function drawEnemies(){
  const gy=GY();
  EN.forEach(e=>{
    if(e.hp<=0){
      if(e.da>0){
        // Death dissolve effect
        cx.globalAlpha=e.da*2;
        cx.fillStyle='#8b5cf6';
        for(let i=0;i<5;i++){
          cx.beginPath();cx.arc(e.x+e.w/2+(Math.random()-0.5)*30,e.y+e.h/2+(Math.random()-0.5)*30,3+Math.random()*4,0,Math.PI*2);cx.fill();
        }
        cx.globalAlpha=1;
      }
      return;
    }
    e.y=gy-e.h;
    // Shadow
    cx.fillStyle='rgba(0,0,0,0.35)';cx.beginPath();cx.ellipse(e.x+e.w/2,gy,e.w*0.45,4,0,0,Math.PI*2);cx.fill();
    // Hit flash
    const hf=e.ha>0;
    if(e.isBoss){
      // Boss: dark aura
      cx.fillStyle='rgba(239,68,68,0.1)';cx.beginPath();cx.arc(e.x+e.w/2,e.y+e.h/2,40,0,Math.PI*2);cx.fill();
      // Body
      cx.fillStyle=hf?'#fbbf24':'#450a0a';
      cx.beginPath();cx.moveTo(e.x+6,e.y+14);cx.lineTo(e.x+e.w-6,e.y+14);cx.lineTo(e.x+e.w,e.y+e.h-8);cx.lineTo(e.x,e.y+e.h-8);cx.closePath();cx.fill();
      // Head
      cx.fillStyle=hf?'#fde047':'#7f1d1d';cx.beginPath();cx.arc(e.x+e.w/2,e.y+10,16,0,Math.PI*2);cx.fill();
      // Horns
      cx.fillStyle='#991b1b';
      cx.beginPath();cx.moveTo(e.x+e.w/2-12,e.y+2);cx.lineTo(e.x+e.w/2-8,e.y-12);cx.lineTo(e.x+e.w/2-4,e.y+4);cx.fill();
      cx.beginPath();cx.moveTo(e.x+e.w/2+12,e.y+2);cx.lineTo(e.x+e.w/2+8,e.y-12);cx.lineTo(e.x+e.w/2+4,e.y+4);cx.fill();
      // Eyes
      cx.fillStyle='#ef4444';cx.beginPath();cx.arc(e.x+e.w/2-5,e.y+9,3,0,Math.PI*2);cx.fill();cx.beginPath();cx.arc(e.x+e.w/2+5,e.y+9,3,0,Math.PI*2);cx.fill();
      cx.fillStyle='rgba(239,68,68,0.3)';cx.beginPath();cx.arc(e.x+e.w/2,e.y+9,10,0,Math.PI*2);cx.fill();
    } else {
      // Regular enemy
      cx.fillStyle=hf?'#fbbf24':'#1f2937';
      cx.fillRect(e.x+8,e.y+14,e.w-16,e.h-20);
      cx.fillStyle=hf?'#fde047':'#374151';
      cx.beginPath();cx.arc(e.x+e.w/2,e.y+10,10,0,Math.PI*2);cx.fill();
      // Red eyes
      cx.fillStyle='#ef4444';cx.beginPath();cx.arc(e.x+e.w/2-3,e.y+9,2,0,Math.PI*2);cx.fill();cx.beginPath();cx.arc(e.x+e.w/2+3,e.y+9,2,0,Math.PI*2);cx.fill();
    }
    // HP bar
    if(!e.isBoss){
      const bw=36,bx=e.x+e.w/2-bw/2,by=e.y-10;
      cx.fillStyle='rgba(15,15,35,0.8)';cx.fillRect(bx-1,by-1,bw+2,6);
      cx.fillStyle='#dc2626';cx.fillRect(bx,by,bw*(e.hp/e.maxHp),4);
    }
    // Name
    cx.fillStyle=e.isBoss?'#fbbf24':'#64748b';cx.font=(e.isBoss?'bold 10px':'8px')+' sans-serif';cx.textAlign='center';
    cx.fillText(e.name,e.x+e.w/2,e.y-(e.isBoss?16:14));
  });
}

function drawFX(dt){
  FX=FX.filter(f=>{
    f.life-=dt;if(f.life<=0)return false;
    const a=f.life/f.maxLife;
    if(f.type==='slash'){
      cx.save();cx.globalAlpha=a;
      const r=f.crit?50:35,prog=1-a;
      // Multi-layer slash arc
      for(let l=0;l<(f.crit?3:2);l++){
        const lr=r+l*8;
        cx.strokeStyle=f.crit?'rgba(251,191,36,'+(a*0.7-l*0.15)+')':'rgba(167,139,250,'+(a*0.6-l*0.1)+')';
        cx.lineWidth=f.crit?6-l*1.5:4-l;
        cx.beginPath();cx.arc(f.x,f.y,lr*prog,f.angle-1+prog*0.5,f.angle+1-prog*0.5);cx.stroke();
      }
      // Inner bright line
      cx.strokeStyle=f.crit?'rgba(255,255,200,'+a*0.8+')':'rgba(200,180,255,'+a*0.6+')';
      cx.lineWidth=2;cx.beginPath();cx.arc(f.x,f.y,r*prog*0.8,f.angle-0.8,f.angle+0.8);cx.stroke();
      cx.restore();
    }
    if(f.type==='flash'){
      cx.save();cx.fillStyle='rgba(139,92,246,'+a*0.3+')';cx.fillRect(0,0,cv.width,cv.height);cx.restore();
    }
    return true;
  });
  // Particles
  PARTICLES=PARTICLES.filter(p=>{
    p.life-=dt;if(p.life<=0)return false;
    p.x+=p.vx;p.y+=p.vy;p.vy+=8*dt;
    const a=p.life/p.maxLife;
    cx.globalAlpha=a;cx.fillStyle=p.color;
    cx.beginPath();cx.arc(p.x,p.y,p.size*a,0,Math.PI*2);cx.fill();
    cx.globalAlpha=1;
    return true;
  });
}

function drawDMG(dt){
  DMG=DMG.filter(d=>{
    d.life-=dt;if(d.life<=0)return false;
    const a=d.life/0.9,yo=(0.9-d.life)*55;
    cx.save();cx.globalAlpha=a;
    const isCrit=d.tp==='crit';
    cx.font=(isCrit?'bold 26px':'bold 18px')+' sans-serif';cx.textAlign='center';
    // Shadow
    cx.fillStyle='rgba(0,0,0,0.6)';cx.fillText(isCrit?d.t+'!!':d.t,d.x+1,d.y-yo+2);
    // Text
    if(isCrit){cx.fillStyle='#fbbf24';cx.shadowColor='#f59e0b';cx.shadowBlur=12}
    else if(d.tp==='dodge'){cx.fillStyle='#a78bfa';cx.shadowColor='#8b5cf6';cx.shadowBlur=8}
    else if(d.tp==='phit'){cx.fillStyle='#ef4444';cx.shadowColor='#dc2626';cx.shadowBlur=8}
    else{cx.fillStyle='#e2e8f0';cx.shadowColor='#818cf8';cx.shadowBlur=6}
    cx.fillText(isCrit?d.t+'!!':d.t,d.x,d.y-yo);
    cx.restore();
    return true;
  });
}

// === GAME LOOP ===
function update(dt){
  if(GO)return;
  if(ACD>0)ACD-=dt;if(P.aatk>0)P.aatk-=dt;if(P.ahit>0)P.ahit-=dt;if(SKT>0)SKT-=dt;
  if(P.swordSwing>0)P.swordSwing=Math.max(0,P.swordSwing-dt*3.5);
  Object.keys(SCD).forEach(k=>{if(SCD[k]>0)SCD[k]-=dt});
  // Movement
  if(MD!==0){P.x+=MD*(P.spd*14)*dt;P.face=MD;P.x=Math.max(0,Math.min(cv.width-P.w,P.x));P.runCycle+=dt}
  // Enemy AI
  EN.forEach(e=>{
    if(e.hp<=0){if(e.da>0)e.da-=dt;return}
    if(e.ha>0)e.ha-=dt;e.at-=dt;
    const dist=(e.x+e.w/2)-(P.x+P.w/2),ar=e.isBoss?65:50;
    if(Math.abs(dist)>ar)e.x-=Math.sign(dist)*e.speed*10*dt;
    if(Math.abs(dist)<=ar+10&&e.at<=0){
      e.at=e.isBoss?(0.8+Math.random()*0.8):(1.2+Math.random()*1.5);
      hitPlayer(e.attack);
    }
  });
  P.mp=Math.min(P.mmp,P.mp+0.6*dt);
  uUI();
}

function render(dt){
  cx.clearRect(0,0,cv.width,cv.height);
  drawBG();drawPlayer();drawEnemies();drawFX(dt);drawDMG(dt);
}

function loop(ts){
  const dt=LT?Math.min((ts-LT)/1000,0.05):1/60;LT=ts;
  update(dt);render(dt);requestAnimationFrame(loop);
}

P.y=GY()-P.h;spawnWave(0);uUI();showSys('— ENTERING DUNGEON —');
requestAnimationFrame(loop);
<\/script></body></html>`;
};
