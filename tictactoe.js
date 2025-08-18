const boardEl=document.getElementById('board'), statusEl=document.getElementById('status'), levelEl=document.getElementById('level');
let cells, board, human='X', ai='O', over=false;
function makeBoard(){
  boardEl.innerHTML=''; board=Array(9).fill(''); over=false;
  for(let i=0;i<9;i++){ const d=document.createElement('button'); d.className='cell'; d.dataset.i=i; d.onclick=()=>move(i); boardEl.appendChild(d); }
  cells=[...document.querySelectorAll('.cell')]; statusEl.textContent='Your turn (X)';
}
const wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
function winner(b){ for(const [a,c,d] of wins) if(b[a]&&b[a]===b[c]&&b[a]===b[d]) return b[a]; return b.every(v=>v)?'draw':null; }
function move(i){ if(over||board[i]) return; board[i]=human; cells[i].textContent=human; let w=winner(board); if(w) return end(w); bot(); }
function end(w){ over=true; statusEl.textContent=w==='draw'?'Draw!':(w===human?'You win!':'Bot wins!'); }
function bot(){
  const mode=levelEl.value; let i;
  if(mode==='e'){ const free=board.map((v,idx)=>v?null:idx).filter(v=>v!==null); i=free[Math.floor(Math.random()*free.length)]; }
  else { i=minimax(board, ai).i; }
  board[i]=ai; cells[i].textContent=ai;
  const w=winner(board); if(w) end(w); else statusEl.textContent='Your turn (X)';
}
function minimax(b, player){
  const w=winner(b); if(w===ai) return {score:10}; if(w===human) return {score:-10}; if(w==='draw') return {score:0};
  let best={score: player===ai? -Infinity: Infinity, i:null};
  for(let i=0;i<9;i++){ if(b[i]) continue; b[i]=player;
    const r=minimax(b, player===ai? human: ai); b[i]=''; r.i=i;
    if(player===ai){ if(r.score>best.score) best=r; } else { if(r.score<best.score) best=r; }
  } return best;
}
document.getElementById('new').onclick=makeBoard; makeBoard();
