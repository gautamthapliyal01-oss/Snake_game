const cvs=document.getElementById('ludo'), ctx=cvs.getContext('2d');
const N=11, S=cvs.width/N; const colors=['#ef4444','#22c55e','#3b82f6','#f59e0b']; const names=['Red','Green','Blue','Yellow'];
const track=[], homes=[]; let players=4, tokens=[], turn=0, dice=0;

function makeTrack(){ const p=[]; for(let i=1;i<=9;i++)p.push([i,0]); for(let i=1;i<=9;i++)p.push([10,i]);
  for(let i=9;i>=1;i--)p.push([i,10]); for(let i=9;i>=1;i--)p.push([0,i]); return p.slice(0,40); }
function homeXY(){ return [[1,1],[9,1],[9,9],[1,9]]; }
function homePos(p,id){
  const base=[[1.3,1.3],[2.7,1.3],[1.3,2.7],[2.7,2.7],
              [8.3,1.3],[9.7,1.3],[8.3,2.7],[9.7,2.7],
              [8.3,8.3],[9.7,8.3],[8.3,9.7],[9.7,9.7],
              [1.3,8.3],[2.7,8.3],[1.3,9.7],[2.7,9.7]];
  return [base[p*4+id][0], base[p*4+id][1]];
}
function drawToken(cx,cy,color){
  ctx.beginPath(); ctx.fillStyle=color; ctx.arc((cx+.5)*S,(cy+.5)*S,S*.36,0,Math.PI*2); ctx.fill();
  ctx.lineWidth=2; ctx.strokeStyle='rgba(255,255,255,.7)'; ctx.stroke();
}
function drawBoard(){
  ctx.clearRect(0,0,cvs.width,cvs.height);
  ctx.fillStyle='#0b0e20'; ctx.fillRect(0,0,cvs.width,cvs.height);
  ctx.strokeStyle='rgba(255,255,255,.06)';
  for(let i=0;i<=N;i++){ ctx.beginPath(); ctx.moveTo(i*S,0); ctx.lineTo(i*S,cvs.height); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0,i*S); ctx.lineTo(cvs.width,i*S); ctx.stroke(); }
  track.forEach(([x,y],i)=>{ ctx.fillStyle=i%2?'rgba(255,255,255,.05)':'rgba(255,255,255,.02)'; ctx.fillRect(x*S,y*S,S,S); });
  homeXY().forEach((xy,i)=>{ ctx.fillStyle=colors[i]; ctx.globalAlpha=.3; ctx.fillRect(xy[0]*S,xy[1]*S,S*2,S*2); ctx.globalAlpha=1; });
  tokens.forEach(t=>{ const [x,y]=t.pos===-1? homePos(t.p,t.id): track[(homes[t.p]+t.pos)%40]; drawToken(x,y,colors[t.p]); });
}
function init(playersCount=4){
  players=playersCount; track.length=0; makeTrack().forEach(c=>track.push(c));
  homes.length=0; homes.push(0,10,20,30);
  tokens=[]; for(let p=0;p<players;p++) for(let k=0;k<2;k++) tokens.push({p,id:k,pos:-1,finished:false});
  turn=0; dice=0; updateUI(); drawBoard();
}
function updateUI(){ document.getElementById('turn').textContent=`Turn: ${names[turn]} — ${dice?('Dice: '+dice):'roll to play'}`; document.getElementById('dice').textContent=`🎲 ${dice||'-'}`; }
function roll(){ dice=Math.floor(Math.random()*6)+1; updateUI();
  const can=tokens.some(t=>t.p===turn && (t.pos===-1? dice===6 : !t.finished)); if(!can){ next(); } drawBoard(); }
function next(){ dice=0; turn=(turn+1)%players; updateUI(); }
cvs.addEventListener('click',e=>{
  if(!dice) return;
  const r=cvs.getBoundingClientRect(), x=Math.floor((e.clientX-r.left)/S), y=Math.floor((e.clientY-r.top)/S);
  let pick=null;
  tokens.filter(t=>t.p===turn && !t.finished).forEach(t=>{
    const [cx,cy]=t.pos===-1? homePos(t.p,t.id): track[(homes[t.p]+t.pos)%40];
    const d=Math.hypot((x+.5)-(cx+.5),(y+.5)-(cy+.5)); if(d<.5) pick=t;
  });
  if(!pick) return;
  if(pick.pos===-1){ if(dice!==6) return; pick.pos=0; }
  else { pick.pos+=dice; if(pick.pos>=40){ pick.finished=true; } }
  const myAbs=(homes[pick.p]+pick.pos)%40;
  tokens.forEach(t=>{
    if(t===pick||t.pos===-1||t.finished) return;
    const theirAbs=(homes[t.p]+t.pos)%40; if(myAbs===theirAbs && t.p!==pick.p) t.pos=-1;
  });
  drawBoard(); if(dice===6){ dice=0; updateUI(); return; } next();
});
document.getElementById('roll').onclick=roll;
document.getElementById('reset').onclick=()=>init(players);
init(4);
