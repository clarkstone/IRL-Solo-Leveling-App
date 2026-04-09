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
body{background:#020010;overflow:hidden;touch-action:none;font-family:'Segoe UI',-apple-system,sans-serif}
canvas{display:block}
#ui{position:fixed;top:0;left:0;right:0;padding:8px 12px;pointer-events:none;z-index:10}
.hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px}
.dn{color:#c4b5fd;font-size:10px;font-weight:700;letter-spacing:2px;text-shadow:0 0 8px rgba(139,92,246,0.5)}
.wv{color:#a78bfa;font-size:11px;font-weight:800;letter-spacing:3px;text-shadow:0 0 12px rgba(139,92,246,0.6)}
.bars{display:flex;flex-direction:column;gap:3px}
.bw{height:14px;border-radius:7px;background:rgba(10,5,25,0.85);overflow:hidden;position:relative;border:1px solid rgba(99,102,241,0.25)}
.hpf{height:100%;background:linear-gradient(90deg,#991b1b,#dc2626 40%,#ef4444);border-radius:7px;transition:width 0.2s}
.mpf{height:100%;background:linear-gradient(90deg,#312e81,#6366f1 40%,#818cf8);border-radius:7px;transition:width 0.2s}
.bt{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#fff;font-size:8px;font-weight:800;text-shadow:0 1px 2px rgba(0,0,0,0.9)}
#combo{position:fixed;top:78px;right:12px;pointer-events:none;z-index:15;text-align:right;opacity:0;transition:opacity 0.3s}
#combo.show{opacity:1}
.cn{font-size:34px;font-weight:900;color:#fbbf24;text-shadow:0 0 20px rgba(251,191,36,0.5);line-height:1}
.cl{font-size:9px;font-weight:800;color:#f59e0b;letter-spacing:3px}
.cm{font-size:11px;font-weight:800;color:#c084fc;margin-top:2px}
#skills{position:fixed;bottom:12px;left:50%;transform:translateX(-50%);display:flex;gap:6px;pointer-events:all;z-index:10}
.sk{width:50px;height:50px;border-radius:12px;background:linear-gradient(135deg,rgba(15,5,30,0.95),rgba(30,10,60,0.9));border:1.5px solid rgba(139,92,246,0.35);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;position:relative;box-shadow:0 2px 10px rgba(0,0,0,0.5);transition:transform 0.1s}
.sk:active{transform:scale(0.9)}.sk.cd{opacity:0.3}.sk.nomp{opacity:0.2;border-color:rgba(239,68,68,0.4)}
.sk .i{font-size:18px}.sk .n{font-size:6px;color:#a78bfa;margin-top:1px}
.sk .cdov{position:absolute;inset:0;background:rgba(0,0,0,0.7);border-radius:11px;display:flex;align-items:center;justify-content:center;color:#c4b5fd;font-size:14px;font-weight:900}
#abtn{position:fixed;bottom:75px;right:14px;width:62px;height:62px;border-radius:31px;background:radial-gradient(circle at 40% 35%,rgba(167,139,250,0.95),rgba(88,28,135,0.95));border:2px solid rgba(196,181,253,0.6);display:flex;align-items:center;justify-content:center;font-size:24px;cursor:pointer;pointer-events:all;z-index:10;box-shadow:0 0 20px rgba(139,92,246,0.4);transition:transform 0.08s}
#abtn:active{transform:scale(0.88)}
#movs{position:fixed;bottom:75px;left:14px;display:flex;gap:8px;pointer-events:all;z-index:10}
.mb{width:50px;height:50px;border-radius:25px;background:linear-gradient(135deg,rgba(15,5,30,0.9),rgba(30,10,60,0.85));border:1.5px solid rgba(139,92,246,0.25);display:flex;align-items:center;justify-content:center;font-size:16px;color:#a78bfa;cursor:pointer;transition:transform 0.1s}
.mb:active{transform:scale(0.9)}
#bhp{position:fixed;bottom:148px;left:20px;right:20px;pointer-events:none;z-index:10;display:none}
.bn{color:#ef4444;font-size:10px;font-weight:900;text-align:center;letter-spacing:4px;text-shadow:0 0 15px rgba(239,68,68,0.7)}
.bhb{height:8px;background:rgba(10,5,25,0.9);border-radius:4px;overflow:hidden;margin-top:3px;border:1px solid rgba(239,68,68,0.25)}
.bhf{height:100%;background:linear-gradient(90deg,#7f1d1d,#dc2626 50%,#fb923c);border-radius:4px;transition:width 0.25s}
#res{position:fixed;inset:0;background:rgba(2,0,16,0.95);display:none;flex-direction:column;align-items:center;justify-content:center;z-index:100;pointer-events:all}
#res.show{display:flex}
.rt{font-size:32px;font-weight:900;letter-spacing:8px;margin-bottom:4px}
.rt2{font-size:12px;font-weight:700;letter-spacing:4px;margin-bottom:20px}
.rvc{color:#a78bfa;text-shadow:0 0 40px rgba(139,92,246,0.8)}.rdf{color:#ef4444;text-shadow:0 0 40px rgba(239,68,68,0.8)}
.rvc2{color:#c4b5fd}.rdf2{color:#fca5a5}
.rsts{display:flex;gap:20px;margin-bottom:20px}
.rst{text-align:center}.rstv{font-size:22px;font-weight:900;color:#fbbf24}.rstl{font-size:8px;color:#94a3b8;letter-spacing:2px;font-weight:700}
.ri{color:#94a3b8;font-size:13px;text-align:center;line-height:1.8;margin-bottom:16px}
.rb{padding:12px 36px;border-radius:12px;border:none;font-size:15px;font-weight:800;cursor:pointer;letter-spacing:2px;transition:transform 0.1s}
.rb:active{transform:scale(0.95)}
.rbv{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;box-shadow:0 0 30px rgba(139,92,246,0.5)}
.rbd{background:linear-gradient(135deg,#1e1b4b,#312e81);color:#c4b5fd;border:1px solid rgba(139,92,246,0.3)}
#sys{position:fixed;top:42%;left:0;right:0;pointer-events:none;z-index:60;text-align:center}
.sM{color:#c4b5fd;font-size:16px;font-weight:900;letter-spacing:5px;text-shadow:0 0 30px rgba(139,92,246,0.9);opacity:0}
.sM.show{animation:sA 2s ease-out forwards}
.sS{color:#a78bfa;font-size:9px;font-weight:700;letter-spacing:6px;opacity:0;margin-top:4px}
.sS.show{animation:sB 2s ease-out forwards}
.sL{height:1px;margin:0 15%;background:linear-gradient(90deg,transparent,rgba(139,92,246,0.5),transparent);opacity:0}
.sL.show{animation:sC 2s ease-out forwards}
@keyframes sA{0%{opacity:0;letter-spacing:20px}10%{opacity:1;letter-spacing:5px}80%{opacity:1}100%{opacity:0}}
@keyframes sB{0%{opacity:0}15%{opacity:0.7}80%{opacity:0.7}100%{opacity:0}}
@keyframes sC{0%{opacity:0;transform:scaleX(0)}10%{opacity:0.8;transform:scaleX(1)}80%{opacity:0.4}100%{opacity:0}}
</style></head><body>
<canvas id="c"></canvas>
<div id="ui"><div class="hdr"><span class="dn" id="dn"></span><span class="wv" id="wv"></span></div><div class="bars"><div class="bw"><div class="hpf" id="hpB"></div><div class="bt" id="hpT"></div></div><div class="bw"><div class="mpf" id="mpB"></div><div class="bt" id="mpT"></div></div></div></div>
<div id="combo"><div class="cn" id="cN">0</div><div class="cl">COMBO</div><div class="cm" id="cM"></div></div>
<div id="skills"></div>
<div id="movs"><div class="mb" ontouchstart="SM(-1)" ontouchend="SM(0)" onmousedown="SM(-1)" onmouseup="SM(0)">◀</div><div class="mb" ontouchstart="SM(1)" ontouchend="SM(0)" onmousedown="SM(1)" onmouseup="SM(0)">▶</div></div>
<div id="abtn" ontouchstart="ATK()" onmousedown="ATK()">⚔️</div>
<div id="bhp"><div class="bn" id="bn"></div><div class="bhb"><div class="bhf" id="bf"></div></div></div>
<div id="res"><div class="rt" id="rt"></div><div class="rt2" id="rt2"></div><div class="rsts" id="rsts"></div><div class="ri" id="ri"></div><button class="rb" id="rbtn" onclick="HR()">OK</button></div>
<div id="sys"><div class="sL" id="sL"></div><div class="sM" id="sM"></div><div class="sS" id="sS"></div></div>
<script>
const C=${configJSON};
const cv=document.getElementById('c'),cx=cv.getContext('2d');
let W,H;function rsz(){W=cv.width=innerWidth;H=cv.height=innerHeight}rsz();addEventListener('resize',rsz);
document.getElementById('dn').textContent=C.dungeonName;

let GO=false,VIC=false,CW=0,MD=0,ACD=0,SCD={},LT=0;
let DMG=[],FX=[],PT=[],TRAILS=[];
let SKT=0,HSTOP=0,camX=0,camY=0;
let combo=0,comboT=0,maxCombo=0,totalDmg=0;

const P={x:80,y:0,w:44,h:58,hp:C.playerHp,mhp:C.playerMaxHp,mp:C.playerMp,mmp:C.playerMaxMp,
atk:C.playerAttack,def:C.playerDefense,spd:C.playerSpeed,cr:C.playerCritRate,dr:C.playerDodgeRate,
face:1,atkA:0,hitA:0,swPh:0,swSp:0,runT:0,idle:0,aura:0};

let EN=[],TK=0,TG=0,TE=0;
const GY=()=>H*0.74;

// Shadow soldiers
const SH=[];for(let i=0;i<3;i++)SH.push({x:-25-i*18,y:0,ph:Math.random()*6.28,op:0.1+i*0.03,sc:0.5-i*0.05});

// System msg
function showSys(m,s){
  const a=document.getElementById('sM'),b=document.getElementById('sS'),l=document.getElementById('sL');
  a.textContent=m;a.className='sM show';b.textContent=s||'';b.className='sS show';l.className='sL show';
  setTimeout(()=>{a.className='sM';b.className='sS';l.className='sL'},2200);
}

// Particles
function emit(x,y,col,n,spd,sz,gv,lf){
  for(let i=0;i<n;i++)PT.push({x,y,vx:(Math.random()-0.5)*spd,vy:-Math.random()*spd*0.6-spd*0.2,
    life:lf||0.5+Math.random()*0.4,ml:lf||0.9,color:col,size:sz||2+Math.random()*2,g:gv===undefined?6:gv,attr:null});
}
function emitRing(x,y,col,n,r){
  for(let i=0;i<n;i++){const a=Math.PI*2*i/n;PT.push({x:x+Math.cos(a)*r,y:y+Math.sin(a)*r,
    vx:Math.cos(a)*r*3,vy:Math.sin(a)*r*3,life:0.35,ml:0.35,color:col,size:3,g:0,attr:null})}
}

// Slash FX
function addSlash(x,y,dir,crit,big){
  const a=-0.3+Math.random()*0.6;
  FX.push({t:'slash',x,y,dir,life:0.35,ml:0.35,crit,angle:a,r:big?60:crit?50:35});
  if(crit){
    FX.push({t:'xslash',x,y,life:0.4,ml:0.4});
    FX.push({t:'flash',life:0.1,ml:0.1,c:'rgba(139,92,246,0.3)'});
    FX.push({t:'lines',life:0.2,ml:0.2,x,y});
    emit(x,y,'#c4b5fd',14,8,3);emit(x,y,'#fbbf24',8,5,2);emitRing(x,y,'#a78bfa',12,3);
    HSTOP=0.05;
  } else {
    emit(x,y,'#8b5cf6',6,5,2);
  }
}

// Combo
function addCombo(d){
  combo++;comboT=2.5;totalDmg+=d;if(combo>maxCombo)maxCombo=combo;
  const ce=document.getElementById('combo'),cn=document.getElementById('cN'),cm=document.getElementById('cM');
  ce.className='show';cn.textContent=combo;
  const m=1+Math.floor(combo/5)*0.5;cm.textContent=m>1?'x'+m.toFixed(1)+' DMG':'';
  if(combo%10===0&&combo>0){showSys(combo+' HIT COMBO','SHADOW MONARCH POWER');FX.push({t:'flash',life:0.08,ml:0.08,c:'rgba(251,191,36,0.2)'})}
}
function cMult(){return 1+Math.floor(combo/5)*0.1}

// Waves
function spawnWave(wi){
  if(wi>=C.waves.length){endGame(true);return}
  CW=wi;
  const isB=wi===C.waves.length-1;
  document.getElementById('wv').textContent=isB?'BOSS WAVE':'WAVE '+(wi+1)+'/'+C.waves.length;
  const wave=C.waves[wi];
  EN=wave.enemies.map((e,i)=>({...e,x:W+40+i*80,y:GY()-48,
    w:e.isBoss?58:42,h:e.isBoss?66:50,at:1.5+Math.random()*1.5,
    ha:0,da:0,idle:Math.random()*6,ent:false,entD:i*0.35}));
  const boss=EN.find(e=>e.isBoss);
  if(boss){
    document.getElementById('bhp').style.display='block';
    document.getElementById('bn').textContent='\\u2620 '+boss.name.toUpperCase()+' \\u2620';ubhp();
    setTimeout(()=>showSys('\\u2014 '+boss.name.toUpperCase()+' \\u2014','A powerful enemy blocks your path'),300);
  } else {
    document.getElementById('bhp').style.display='none';
    if(wi>0)showSys('\\u2014 WAVE '+(wi+1)+' \\u2014','Enemies approaching');
  }
}
function ubhp(){const b=EN.find(e=>e.isBoss);if(b)document.getElementById('bf').style.width=Math.max(0,(b.hp/b.maxHp)*100)+'%'}

// Skills UI
(function(){
  const bar=document.getElementById('skills');
  C.skills.forEach((s,i)=>{SCD[s.id]=0;
    const b=document.createElement('div');b.className='sk';b.id='s_'+s.id;
    b.innerHTML='<span class="i">'+s.icon+'</span><span class="n">'+s.name.slice(0,8)+'</span>';
    b.addEventListener('touchstart',e=>{e.preventDefault();US(i)});
    b.addEventListener('mousedown',e=>{e.preventDefault();US(i)});
    bar.appendChild(b);
  });
})();

function SM(d){MD=d}window.SM=SM;

// Attack
function ATK(){
  if(GO||ACD>0)return;ACD=0.28;P.atkA=0.3;P.swPh=0;P.swSp=12;
  const range=75;let tgt=null,md=Infinity;
  EN.forEach(e=>{if(e.hp<=0||!e.ent)return;const d=Math.abs((e.x+e.w/2)-(P.x+P.w/2));if(d<range+e.w/2&&d<md){tgt=e;md=d}});
  if(tgt){
    P.face=tgt.x>P.x?1:-1;
    const ic=Math.random()<P.cr;let d=Math.max(1,P.atk*cMult()-tgt.defense*0.5);if(ic)d*=2;d=Math.floor(d);
    hitEnemy(tgt,d,ic);addSlash(tgt.x+tgt.w/2,tgt.y+tgt.h/3,P.face,ic,false);
  } else {
    addSlash(P.x+P.w/2+P.face*40,P.y+P.h/3,P.face,false,false);
  }
  TRAILS.push({x:P.x,y:P.y,life:0.15,ml:0.15,f:P.face});
}
window.ATK=ATK;

function US(i){
  if(GO)return;const s=C.skills[i];if(!s||SCD[s.id]>0||P.mp<s.mpCost)return;
  P.mp-=s.mpCost;SCD[s.id]=s.cooldown+1;P.atkA=0.4;P.swPh=0;P.swSp=15;P.aura=0.5;
  showSys('SKILL: '+s.name.toUpperCase(),s.element?s.element.toUpperCase()+' ELEMENT':'');
  FX.push({t:'flash',life:0.12,ml:0.12,c:'rgba(139,92,246,0.2)'});
  const aoe=s.damage>=2;
  if(aoe){
    EN.forEach(e=>{if(e.hp<=0||!e.ent)return;const ic=Math.random()<P.cr;
      let d=Math.max(1,P.atk*s.damage*cMult()-e.defense*0.3);if(ic)d*=1.5;d=Math.floor(d);
      hitEnemy(e,d,ic);addSlash(e.x+e.w/2,e.y+e.h/3,P.face,ic,true)});
  } else {
    let tgt=null,md=Infinity;EN.forEach(e=>{if(e.hp<=0||!e.ent)return;const d=Math.abs((e.x+e.w/2)-(P.x+P.w/2));if(d<md){tgt=e;md=d}});
    if(tgt){const ic=Math.random()<P.cr;let d=Math.max(1,P.atk*s.damage*cMult()-tgt.defense*0.3);if(ic)d*=1.5;d=Math.floor(d);hitEnemy(tgt,d,ic);addSlash(tgt.x+tgt.w/2,tgt.y+tgt.h/3,P.face,ic,true)}
  }
  uUI();
}

function hitEnemy(e,d,ic){
  e.hp=Math.max(0,e.hp-d);e.ha=0.2;addCombo(d);
  DMG.push({x:e.x+e.w/2+(Math.random()-0.5)*25,y:e.y-10,t:String(d),tp:ic?'crit':'',life:1});
  ubhp();camX+=(Math.random()-0.5)*4;camY+=(Math.random()-0.5)*2;
  if(e.hp<=0){
    TK++;TE+=10+Math.floor(e.maxHp*0.3);TG+=5+Math.floor(e.maxHp*0.15);
    emit(e.x+e.w/2,e.y+e.h/2,'#8b5cf6',20,7,3,4);emitRing(e.x+e.w/2,e.y+e.h/2,'#6d28d9',14,4);
    e.da=0.8;
    for(let i=0;i<6;i++)PT.push({x:e.x+e.w/2+(Math.random()-0.5)*20,y:e.y+e.h/2+(Math.random()-0.5)*20,
      vx:0,vy:0,life:1,ml:1,color:'#7c3aed',size:4,g:0,attr:{x:P.x+P.w/2,y:P.y+P.h/2,s:180}});
    if(e.isBoss){showSys('\\u2014 BOSS DEFEATED \\u2014','Shadow extraction complete');FX.push({t:'flash',life:0.2,ml:0.2,c:'rgba(251,191,36,0.3)'})}
    if(EN.every(en=>en.hp<=0))setTimeout(()=>{CW+1>=C.waves.length?endGame(true):spawnWave(CW+1)},900);
  }
}

function hitPlayer(d){
  if(Math.random()<P.dr){DMG.push({x:P.x+P.w/2,y:P.y-5,t:'DODGE',tp:'dodge',life:0.9});
    TRAILS.push({x:P.x,y:P.y,life:0.2,ml:0.2,f:P.face});P.x+=P.face*-25;return}
  const ad=Math.max(1,d-P.def*0.4);P.hp=Math.max(0,P.hp-Math.floor(ad));P.hitA=0.2;SKT=0.12;
  DMG.push({x:P.x+P.w/2,y:P.y-5,t:String(Math.floor(ad)),tp:'phit',life:1});
  emit(P.x+P.w/2,P.y+P.h/2,'#ef4444',10,5,2);camX+=(Math.random()-0.5)*8;camY+=3;
  uUI();if(P.hp<=0){endGame(false)}
}

function endGame(w){
  GO=true;VIC=w;
  setTimeout(()=>{
    const rs=document.getElementById('res');rs.classList.add('show');
    document.getElementById('rt').textContent=w?'DUNGEON CLEARED':'YOU DIED';
    document.getElementById('rt').className='rt '+(w?'rvc':'rdf');
    document.getElementById('rt2').textContent=w?'SHADOW MONARCH':'HUNTER DOWN';
    document.getElementById('rt2').className='rt2 '+(w?'rvc2':'rdf2');
    document.getElementById('rsts').innerHTML='<div class="rst"><div class="rstv">'+TK+'</div><div class="rstl">KILLS</div></div>'
      +'<div class="rst"><div class="rstv">'+maxCombo+'</div><div class="rstl">MAX COMBO</div></div>'
      +(w?'<div class="rst"><div class="rstv">'+totalDmg+'</div><div class="rstl">TOTAL DMG</div></div>':'');
    document.getElementById('ri').innerHTML=w?'[SYSTEM] Dungeon cleared. Rewards available.':'[SYSTEM] You have been defeated. Grow stronger.';
    const rb=document.getElementById('rbtn');rb.className='rb '+(w?'rbv':'rbd');rb.textContent=w?'COLLECT REWARDS':'RETREAT';
  },w?800:1200);
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

// ══════════ RENDERING ══════════
const TH={
  cave:{s1:'#05001a',s2:'#0c0520',g1:'#110a22',g2:'#1a1038',p:'#7c3aed',p2:'#4c1d95'},
  forest:{s1:'#010a03',s2:'#061208',g1:'#0a1a0c',g2:'#142e16',p:'#22c55e',p2:'#15803d'},
  tomb:{s1:'#06001a',s2:'#0c0620',g1:'#140e28',g2:'#1e1640',p:'#8b5cf6',p2:'#6d28d9'},
  fortress:{s1:'#0a0600',s2:'#1a1008',g1:'#221a10',g2:'#302818',p:'#f59e0b',p2:'#b45309'},
  tower:{s1:'#0a0010',s2:'#160818',g1:'#1e0e22',g2:'#2e1430',p:'#ec4899',p2:'#be185d'},
  ice:{s1:'#020818',s2:'#081420',g1:'#0e1e30',g2:'#142840',p:'#22d3ee',p2:'#0891b2'},
  demon:{s1:'#0a0000',s2:'#1a0404',g1:'#240808',g2:'#3a0c0c',p:'#ef4444',p2:'#b91c1c'},
  shadow:{s1:'#010010',s2:'#040420',g1:'#060618',g2:'#0a0a28',p:'#8b5cf6',p2:'#6d28d9'},
};

// Parallax background objects
let bgObjs=[];
function genBG(){
  bgObjs=[];
  for(let i=0;i<8;i++)bgObjs.push({x:Math.random()*W*1.5,layer:0,h:40+Math.random()*60,w:15+Math.random()*20});
  for(let i=0;i<6;i++)bgObjs.push({x:Math.random()*W*1.5,layer:1,h:60+Math.random()*80,w:8+Math.random()*12});
}
genBG();

function drawBG(){
  const th=TH[C.backgroundTheme]||TH.cave,gy=GY(),t=Date.now()*0.001;
  // Sky
  const sg=cx.createLinearGradient(0,0,0,gy);sg.addColorStop(0,th.s1);sg.addColorStop(1,th.s2);
  cx.fillStyle=sg;cx.fillRect(0,0,W,gy);
  // Parallax far layer
  cx.globalAlpha=0.15;cx.fillStyle=th.p2;
  bgObjs.filter(o=>o.layer===0).forEach(o=>{
    const ox=(o.x-t*8)%((W+100))-50;
    cx.fillRect(ox,gy-o.h,o.w,o.h);cx.fillRect(ox+2,gy-o.h-8,o.w-4,8);
  });
  // Parallax mid layer
  cx.globalAlpha=0.08;cx.fillStyle=th.p;
  bgObjs.filter(o=>o.layer===1).forEach(o=>{
    const ox=(o.x-t*15)%((W+100))-50;
    cx.fillRect(ox,gy-o.h,o.w,o.h);
  });
  cx.globalAlpha=1;
  // Ambient mana particles
  for(let i=0;i<30;i++){
    const px=(i*47+t*12*(i%4+1))%(W+20)-10,py=(i*31+Math.sin(t*0.8+i)*25)%(gy-20);
    const a=0.08+Math.sin(t*1.5+i*0.7)*0.06;
    const sz=1+Math.sin(t+i)*0.5;
    cx.globalAlpha=a;cx.fillStyle=th.p;
    cx.beginPath();cx.arc(px,py,sz,0,Math.PI*2);cx.fill();
  }
  // Floating runes (3 slow-moving)
  cx.globalAlpha=0.04;cx.strokeStyle=th.p;cx.lineWidth=1;
  for(let i=0;i<3;i++){
    const rx=(i*W/3+t*5+Math.sin(t*0.3+i)*30)%W,ry=gy*0.3+Math.sin(t*0.5+i*2)*40;
    cx.beginPath();cx.arc(rx,ry,12+Math.sin(t+i)*3,0,Math.PI*2);cx.stroke();
    cx.beginPath();cx.moveTo(rx-8,ry);cx.lineTo(rx+8,ry);cx.moveTo(rx,ry-8);cx.lineTo(rx,ry+8);cx.stroke();
  }
  cx.globalAlpha=1;
  // Ground
  const gg=cx.createLinearGradient(0,gy,0,H);gg.addColorStop(0,th.g1);gg.addColorStop(1,th.g2);
  cx.fillStyle=gg;cx.fillRect(0,gy,W,H-gy);
  // Ground glow
  cx.strokeStyle=th.p;cx.lineWidth=2;cx.globalAlpha=0.5;
  cx.beginPath();cx.moveTo(0,gy);cx.lineTo(W,gy);cx.stroke();
  cx.globalAlpha=0.12;cx.lineWidth=8;cx.beginPath();cx.moveTo(0,gy);cx.lineTo(W,gy);cx.stroke();
  // Ground fog
  cx.globalAlpha=0.06;cx.fillStyle=th.p;
  for(let i=0;i<10;i++){
    const fx=(i*W/10+t*20+Math.sin(t+i)*15)%(W+60)-30;
    cx.beginPath();cx.ellipse(fx,gy+8,30+Math.sin(t*0.5+i)*10,6,0,0,Math.PI*2);cx.fill();
  }
  cx.globalAlpha=1;
}

// Shadow soldiers behind player
function drawShadows(){
  const gy=GY();
  SH.forEach((s,i)=>{
    const sx=P.x+s.x*P.face,sy=gy-42;
    const bob=Math.sin(Date.now()*0.002+s.ph)*3;
    cx.globalAlpha=s.op;
    // Body silhouette
    cx.fillStyle='#1a0a2e';
    cx.beginPath();cx.moveTo(sx+6,sy+10+bob);cx.lineTo(sx+22,sy+10+bob);
    cx.lineTo(sx+25,sy+38+bob);cx.lineTo(sx+3,sy+38+bob);cx.closePath();cx.fill();
    // Head
    cx.beginPath();cx.arc(sx+14,sy+6+bob,8*s.sc+2,0,Math.PI*2);cx.fill();
    // Eyes
    cx.fillStyle='#7c3aed';cx.globalAlpha=s.op*1.5;
    cx.beginPath();cx.arc(sx+11+P.face*2,sy+5+bob,1.5,0,Math.PI*2);cx.fill();
    cx.beginPath();cx.arc(sx+17+P.face*2,sy+5+bob,1.5,0,Math.PI*2);cx.fill();
    cx.globalAlpha=1;
  });
}

function drawPlayer(){
  const gy=GY();P.y=gy-P.h;
  const sk=SKT>0?(Math.random()-0.5)*6:0,px=P.x+sk,py=P.y+sk;
  // Aura
  if(P.aura>0){
    cx.globalAlpha=P.aura*0.3;cx.strokeStyle='#a78bfa';cx.lineWidth=2;
    cx.beginPath();cx.arc(px+P.w/2,py+P.h/2,32+Math.random()*4,0,Math.PI*2);cx.stroke();
    cx.globalAlpha=P.aura*0.1;cx.fillStyle='#7c3aed';
    cx.beginPath();cx.arc(px+P.w/2,py+P.h/2,28,0,Math.PI*2);cx.fill();
    cx.globalAlpha=1;
  }
  // Shadow
  cx.fillStyle='rgba(80,40,180,0.12)';cx.beginPath();cx.ellipse(px+P.w/2,gy+2,P.w*0.7,7,0,0,Math.PI*2);cx.fill();
  cx.fillStyle='rgba(0,0,0,0.35)';cx.beginPath();cx.ellipse(px+P.w/2,gy,P.w*0.45,4,0,0,Math.PI*2);cx.fill();
  // Cloak
  const hit=P.hitA>0;
  cx.fillStyle=hit?'#6b21a8':'#0f0a20';
  cx.beginPath();cx.moveTo(px+10,py+18);cx.lineTo(px+P.w-10,py+18);
  cx.lineTo(px+P.w-2,py+48);cx.lineTo(px+2,py+48);cx.closePath();cx.fill();
  // Cloak trim
  cx.strokeStyle=hit?'#a78bfa':'#2e1065';cx.lineWidth=1;
  cx.beginPath();cx.moveTo(px+10,py+18);cx.lineTo(px+P.w-10,py+18);
  cx.lineTo(px+P.w-2,py+48);cx.lineTo(px+2,py+48);cx.closePath();cx.stroke();
  // Armor plate
  cx.fillStyle=hit?'#7c3aed':'#1e1b4b';
  cx.fillRect(px+14,py+20,16,6);
  cx.fillStyle=hit?'#a78bfa':'#312e81';
  cx.fillRect(px+12,py+28,20,2);cx.fillRect(px+14,py+32,16,2);
  // Head
  cx.fillStyle=hit?'#ddd6fe':'#e2e8f0';
  cx.beginPath();cx.arc(px+P.w/2,py+12,11,0,Math.PI*2);cx.fill();
  // Hair (dark)
  cx.fillStyle='#0a0a1a';
  cx.beginPath();cx.arc(px+P.w/2,py+9,11,Math.PI,Math.PI*2);cx.fill();
  cx.fillRect(px+P.w/2-11,py+9,22,4);
  // Glowing eyes
  const ex=P.face>0?3:-3;
  cx.fillStyle='#8b5cf6';
  cx.beginPath();cx.arc(px+P.w/2+ex-2,py+12,2.5,0,Math.PI*2);cx.fill();
  cx.beginPath();cx.arc(px+P.w/2+ex+4,py+12,2.5,0,Math.PI*2);cx.fill();
  // Eye glow/bloom
  cx.fillStyle='rgba(139,92,246,0.25)';
  cx.beginPath();cx.arc(px+P.w/2+ex+1,py+12,8,0,Math.PI*2);cx.fill();
  // Pupils
  cx.fillStyle='#e9d5ff';
  cx.beginPath();cx.arc(px+P.w/2+ex-2,py+12,1,0,Math.PI*2);cx.fill();
  cx.beginPath();cx.arc(px+P.w/2+ex+4,py+12,1,0,Math.PI*2);cx.fill();
  // Legs
  const lO=MD!==0?Math.sin(P.runT*12)*4:0;
  cx.fillStyle='#0f0a20';
  cx.fillRect(px+13,py+46,7,10+lO);cx.fillRect(px+24,py+46,7,10-lO);
  cx.fillStyle='#1e1b4b';
  cx.fillRect(px+11,py+54+lO,10,4);cx.fillRect(px+23,py+54-lO,10,4);

  // ═══ SWORD ═══
  const sw=P.swPh;
  cx.save();
  const sxp=px+P.w/2+P.face*10,syp=py+24;
  cx.translate(sxp,syp);
  let sA;
  if(P.atkA>0){
    const prog=P.swPh;
    sA=P.face>0?(-1.5+prog*3.2):(-1.7-prog*3.2+3.14);
    // Afterimage trail (5 layers)
    for(let t=0;t<5;t++){
      const tp=Math.max(0,prog-t*0.06);
      const ta=P.face>0?(-1.5+tp*3.2):(-1.7-tp*3.2+3.14);
      cx.save();cx.rotate(ta);
      const al=0.12-t*0.02;
      // Trail glow
      cx.strokeStyle='rgba(139,92,246,'+al+')';cx.lineWidth=6-t;
      cx.beginPath();cx.moveTo(0,0);cx.lineTo(P.face*34,0);cx.stroke();
      cx.restore();
    }
  } else {
    sA=P.face>0?0.4:-0.4+3.14;
  }
  cx.rotate(sA);
  // Blade outer glow
  cx.strokeStyle='rgba(139,92,246,0.3)';cx.lineWidth=10;
  cx.beginPath();cx.moveTo(2,0);cx.lineTo(P.face*32,0);cx.stroke();
  // Blade
  const bg=cx.createLinearGradient(0,0,P.face*34,0);
  bg.addColorStop(0,'#6d28d9');bg.addColorStop(0.5,'#a78bfa');bg.addColorStop(1,'#e9d5ff');
  cx.strokeStyle=bg;cx.lineWidth=3;
  cx.beginPath();cx.moveTo(0,0);cx.lineTo(P.face*34,0);cx.stroke();
  // Blade tip sparkle
  cx.fillStyle='#fff';cx.globalAlpha=0.8+Math.sin(Date.now()*0.01)*0.2;
  cx.beginPath();cx.arc(P.face*34,0,2.5,0,Math.PI*2);cx.fill();cx.globalAlpha=1;
  // Handle
  cx.fillStyle='#4c1d95';cx.fillRect(-4,-5,8,10);
  // Guard
  cx.fillStyle='#7c3aed';cx.fillRect(-2,-7,4,14);
  cx.restore();
}

function drawEnemies(){
  const gy=GY();
  EN.forEach(e=>{
    if(e.hp<=0){
      if(e.da>0){
        cx.globalAlpha=e.da;cx.fillStyle='#8b5cf6';
        for(let i=0;i<8;i++){
          const dx=(Math.random()-0.5)*40*(1-e.da),dy=(Math.random()-0.5)*40*(1-e.da);
          cx.beginPath();cx.arc(e.x+e.w/2+dx,e.y+e.h/2+dy,2+Math.random()*4,0,Math.PI*2);cx.fill();
        }
        cx.globalAlpha=1;
      }
      return;
    }
    // Enter animation
    if(!e.ent){e.entD-=1/60;if(e.entD<=0)e.ent=true;else return}
    e.y=gy-e.h;e.idle+=1/60;
    const hf=e.ha>0,bob=Math.sin(e.idle*2)*2;
    // Shadow
    cx.fillStyle='rgba(0,0,0,0.3)';cx.beginPath();cx.ellipse(e.x+e.w/2,gy,e.w*0.4,4,0,0,Math.PI*2);cx.fill();
    if(e.isBoss){
      // Boss dark aura
      const t=Date.now()*0.001;
      cx.globalAlpha=0.08+Math.sin(t*2)*0.03;cx.fillStyle='#ef4444';
      cx.beginPath();cx.arc(e.x+e.w/2,e.y+e.h/2+bob,45+Math.sin(t*3)*5,0,Math.PI*2);cx.fill();cx.globalAlpha=1;
      // Body
      cx.fillStyle=hf?'#fbbf24':'#2a0a0a';
      cx.beginPath();cx.moveTo(e.x+6,e.y+16+bob);cx.lineTo(e.x+e.w-6,e.y+16+bob);
      cx.lineTo(e.x+e.w+2,e.y+e.h-6+bob);cx.lineTo(e.x-2,e.y+e.h-6+bob);cx.closePath();cx.fill();
      // Armor trim
      cx.strokeStyle=hf?'#fde047':'#7f1d1d';cx.lineWidth=1;
      cx.beginPath();cx.moveTo(e.x+10,e.y+20+bob);cx.lineTo(e.x+e.w-10,e.y+20+bob);cx.stroke();
      // Head
      cx.fillStyle=hf?'#fde047':'#450a0a';
      cx.beginPath();cx.arc(e.x+e.w/2,e.y+12+bob,16,0,Math.PI*2);cx.fill();
      // Horns
      cx.fillStyle='#991b1b';
      cx.beginPath();cx.moveTo(e.x+e.w/2-14,e.y+4+bob);cx.lineTo(e.x+e.w/2-8,e.y-14+bob);cx.lineTo(e.x+e.w/2-2,e.y+6+bob);cx.fill();
      cx.beginPath();cx.moveTo(e.x+e.w/2+14,e.y+4+bob);cx.lineTo(e.x+e.w/2+8,e.y-14+bob);cx.lineTo(e.x+e.w/2+2,e.y+6+bob);cx.fill();
      // Eyes
      cx.fillStyle='#ef4444';cx.globalAlpha=0.8+Math.sin(Date.now()*0.005)*0.2;
      cx.beginPath();cx.arc(e.x+e.w/2-6,e.y+11+bob,3.5,0,Math.PI*2);cx.fill();
      cx.beginPath();cx.arc(e.x+e.w/2+6,e.y+11+bob,3.5,0,Math.PI*2);cx.fill();
      cx.globalAlpha=1;
      cx.fillStyle='rgba(239,68,68,0.2)';cx.beginPath();cx.arc(e.x+e.w/2,e.y+11+bob,12,0,Math.PI*2);cx.fill();
    } else {
      // Regular enemy body
      cx.fillStyle=hf?'#fbbf24':'#1a1a2e';
      cx.fillRect(e.x+8,e.y+14+bob,e.w-16,e.h-22);
      // Head
      cx.fillStyle=hf?'#fde047':'#2d2d44';
      cx.beginPath();cx.arc(e.x+e.w/2,e.y+10+bob,11,0,Math.PI*2);cx.fill();
      // Eyes
      cx.fillStyle='#ef4444';
      cx.beginPath();cx.arc(e.x+e.w/2-4,e.y+9+bob,2,0,Math.PI*2);cx.fill();
      cx.beginPath();cx.arc(e.x+e.w/2+4,e.y+9+bob,2,0,Math.PI*2);cx.fill();
      // Legs
      cx.fillStyle=hf?'#fbbf24':'#14142a';
      cx.fillRect(e.x+12,e.y+e.h-10+bob,6,10);cx.fillRect(e.x+e.w-18,e.y+e.h-10+bob,6,10);
    }
    // HP bar (non-boss)
    if(!e.isBoss){
      const bw=38,bx=e.x+e.w/2-bw/2,by=e.y-12;
      cx.fillStyle='rgba(10,5,25,0.8)';cx.fillRect(bx-1,by-1,bw+2,6);
      const hp=Math.max(0,e.hp/e.maxHp);
      cx.fillStyle=hp>0.5?'#dc2626':hp>0.2?'#f97316':'#ef4444';
      cx.fillRect(bx,by,bw*hp,4);
    }
    // Name
    cx.fillStyle=e.isBoss?'#fbbf24':'#4b5563';cx.font=(e.isBoss?'bold 10px':'8px')+' sans-serif';cx.textAlign='center';
    cx.fillText(e.name,e.x+e.w/2,e.y-(e.isBoss?18:16));
  });
}

function drawTrails(){
  TRAILS=TRAILS.filter(tr=>{tr.life-=1/60;if(tr.life<=0)return false;
    const a=tr.life/tr.ml*0.25;const gy=GY();
    cx.globalAlpha=a;cx.fillStyle='#4c1d95';
    cx.beginPath();cx.moveTo(tr.x+10,gy-40);cx.lineTo(tr.x+P.w-10,gy-40);
    cx.lineTo(tr.x+P.w-2,gy-10);cx.lineTo(tr.x+2,gy-10);cx.closePath();cx.fill();
    cx.beginPath();cx.arc(tr.x+P.w/2,gy-46,10,0,Math.PI*2);cx.fill();
    cx.globalAlpha=1;return true;
  });
}

function drawFX(dt){
  FX=FX.filter(f=>{
    f.life-=dt;if(f.life<=0)return false;
    const a=f.life/f.ml;
    if(f.t==='slash'){
      cx.save();cx.globalAlpha=a;
      const r=f.r,prog=1-a;
      for(let l=0;l<(f.crit?4:2);l++){
        const lr=r+l*10;
        cx.strokeStyle=f.crit?'rgba(251,191,36,'+(a*0.6-l*0.12)+')':'rgba(167,139,250,'+(a*0.5-l*0.1)+')';
        cx.lineWidth=f.crit?7-l*1.5:4-l;
        cx.beginPath();cx.arc(f.x,f.y,lr*prog,f.angle-1.2+prog*0.4,f.angle+1.2-prog*0.4);cx.stroke();
      }
      // Inner white core
      cx.strokeStyle='rgba(255,255,255,'+(a*0.6)+')';cx.lineWidth=1.5;
      cx.beginPath();cx.arc(f.x,f.y,r*prog*0.7,f.angle-0.8,f.angle+0.8);cx.stroke();
      cx.restore();
    }
    if(f.t==='xslash'){
      cx.save();cx.globalAlpha=a*0.7;cx.strokeStyle='#fbbf24';cx.lineWidth=3;
      const r=40*a;
      cx.beginPath();cx.moveTo(f.x-r,f.y-r);cx.lineTo(f.x+r,f.y+r);cx.stroke();
      cx.beginPath();cx.moveTo(f.x+r,f.y-r);cx.lineTo(f.x-r,f.y+r);cx.stroke();
      cx.restore();
    }
    if(f.t==='flash'){cx.save();cx.fillStyle=f.c||'rgba(139,92,246,0.2)';cx.globalAlpha=a;cx.fillRect(0,0,W,H);cx.restore()}
    if(f.t==='lines'){
      cx.save();cx.globalAlpha=a*0.4;cx.strokeStyle='#c4b5fd';cx.lineWidth=1.5;
      for(let i=0;i<8;i++){
        const ang=Math.PI*2*i/8+Date.now()*0.002;
        const r1=20+40*(1-a),r2=r1+30+20*(1-a);
        cx.beginPath();cx.moveTo(f.x+Math.cos(ang)*r1,f.y+Math.sin(ang)*r1);
        cx.lineTo(f.x+Math.cos(ang)*r2,f.y+Math.sin(ang)*r2);cx.stroke();
      }
      cx.restore();
    }
    return true;
  });
  // Particles
  PT=PT.filter(p=>{
    p.life-=dt;if(p.life<=0)return false;
    if(p.attr){
      const dx=p.attr.x-p.x,dy=p.attr.y-p.y,d=Math.sqrt(dx*dx+dy*dy)+1;
      p.vx+=dx/d*p.attr.s*dt;p.vy+=dy/d*p.attr.s*dt;
    }
    p.x+=p.vx*dt*60;p.y+=p.vy*dt*60;p.vy+=p.g*dt;
    const al=Math.min(1,p.life/p.ml*2);
    cx.globalAlpha=al;cx.fillStyle=p.color;
    cx.beginPath();cx.arc(p.x,p.y,p.size*Math.min(1,p.life/p.ml+0.3),0,Math.PI*2);cx.fill();
    cx.globalAlpha=1;
    return true;
  });
}

function drawDMG(dt){
  DMG=DMG.filter(d=>{
    d.life-=dt;if(d.life<=0)return false;
    const a=d.life,yo=(1-d.life)*50;
    cx.save();cx.globalAlpha=Math.min(1,a*2);
    const ic=d.tp==='crit';
    cx.font=(ic?'bold 28px':'bold 18px')+' sans-serif';cx.textAlign='center';
    cx.fillStyle='rgba(0,0,0,0.5)';cx.fillText(ic?d.t+'!!':d.t,d.x+1,d.y-yo+2);
    if(ic){cx.fillStyle='#fbbf24';cx.shadowColor='#f59e0b';cx.shadowBlur=15}
    else if(d.tp==='dodge'){cx.fillStyle='#a78bfa';cx.shadowColor='#8b5cf6';cx.shadowBlur=10}
    else if(d.tp==='phit'){cx.fillStyle='#ef4444';cx.shadowColor='#dc2626';cx.shadowBlur=10}
    else{cx.fillStyle='#e2e8f0';cx.shadowColor='#818cf8';cx.shadowBlur=8}
    cx.fillText(ic?d.t+'!!':d.t,d.x,d.y-yo);
    cx.restore();return true;
  });
}

// Vignette overlay
function drawVignette(){
  const g=cx.createRadialGradient(W/2,H/2,H*0.3,W/2,H/2,H*0.8);
  g.addColorStop(0,'transparent');g.addColorStop(1,'rgba(0,0,0,0.4)');
  cx.fillStyle=g;cx.fillRect(0,0,W,H);
  // Low HP warning
  if(P.hp<=P.mhp*0.25&&P.hp>0&&!GO){
    cx.fillStyle='rgba(200,0,0,'+(0.05+Math.sin(Date.now()*0.005)*0.03)+')';cx.fillRect(0,0,W,H);
  }
}

// ══════════ GAME LOOP ══════════
function update(dt){
  if(HSTOP>0){HSTOP-=dt;return}
  if(GO){if(SKT>0)SKT-=dt;camX*=0.9;camY*=0.9;return}
  if(ACD>0)ACD-=dt;if(P.atkA>0){P.atkA-=dt;P.swPh+=P.swSp*dt}
  if(P.hitA>0)P.hitA-=dt;if(SKT>0)SKT-=dt;if(P.aura>0)P.aura-=dt;
  P.idle+=dt;camX*=0.9;camY*=0.9;
  // Combo timer
  if(comboT>0){comboT-=dt;if(comboT<=0){combo=0;document.getElementById('combo').className=''}}
  Object.keys(SCD).forEach(k=>{if(SCD[k]>0)SCD[k]-=dt});
  // Movement
  if(MD!==0){P.x+=MD*(P.spd*14)*dt;P.face=MD;P.x=Math.max(0,Math.min(W-P.w,P.x));P.runT+=dt;
    // Run particles
    if(Math.random()<0.3)PT.push({x:P.x+P.w/2,y:GY()-2,vx:-MD*2+Math.random()*2,vy:-1-Math.random(),
      life:0.3,ml:0.3,color:'rgba(139,92,246,0.3)',size:2+Math.random()*2,g:0,attr:null})}
  // Enemy AI
  EN.forEach(e=>{
    if(e.hp<=0){if(e.da>0)e.da-=dt;return}
    if(!e.ent){e.entD-=dt;if(e.entD<=0){e.ent=true;e.x=Math.min(e.x,W-60)}return}
    if(e.ha>0)e.ha-=dt;e.at-=dt;
    const dist=(e.x+e.w/2)-(P.x+P.w/2),ar=e.isBoss?65:50;
    if(Math.abs(dist)>ar)e.x-=Math.sign(dist)*e.speed*10*dt;
    e.x=Math.max(0,Math.min(W-e.w,e.x));
    if(Math.abs(dist)<=ar+10&&e.at<=0){
      e.at=e.isBoss?(0.8+Math.random()*0.8):(1.2+Math.random()*1.5);
      hitPlayer(e.attack);
    }
  });
  P.mp=Math.min(P.mmp,P.mp+0.6*dt);
  uUI();
}

function render(dt){
  cx.save();
  cx.translate(camX,camY);
  cx.clearRect(-10,-10,W+20,H+20);
  drawBG();drawShadows();drawTrails();drawPlayer();drawEnemies();drawFX(dt);drawDMG(dt);
  cx.restore();
  drawVignette();
}

function loop(ts){
  const dt=LT?Math.min((ts-LT)/1000,0.05):1/60;LT=ts;
  update(dt);render(dt);requestAnimationFrame(loop);
}

P.y=GY()-P.h;spawnWave(0);uUI();
showSys('\\u2014 ENTERING DUNGEON \\u2014','Prepare for battle, Hunter');
requestAnimationFrame(loop);
<\/script></body></html>`;
};
