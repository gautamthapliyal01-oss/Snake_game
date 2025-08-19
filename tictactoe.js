const grid = document.getElementById('grid');
const statusEl = document.getElementById('status');
let board, human='X', ai='O', over=false;

function init(){
  board = Array(9).fill('');
  grid.innerHTML = '';
  for(let i=0;i<9;i++){
    const d=document.createElement('div');
    d.className='cell'; d.dataset.i=i;
    d.onclick = ()=>move(i);
    grid.appendChild(d);
  }
  over=false; statusEl.textContent = "You: X  |  Bot: O";
}
document.getElementById('new').onclick=(e)=>{e.preventDefault();init();}

function move(i){
  if (over || board[i]) return;
  board[i]=human; render();
  if (checkWin(board,human)){statusEl.textContent="You win! 🎉"; over=true; return;}
  if (board.every(x=>x)){statusEl.textContent="Draw!"; over=true; return;}
  // AI
  const best = minimax(board, ai).index;
  board[best]=ai; render();
  if (checkWin(board,ai)){statusEl.textContent="Bot wins 🤖"; over=true; return;}
  if (board.every(x=>x)){statusEl.textContent="Draw!"; over=true;}
}

function render(){
  [...grid.children].forEach((c,i)=> c.textContent = board[i]);
}

function checkWin(b, p){
  const w=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  return w.some(([a,b2,c])=> b[a]===p && b[b2]===p && b[c]===p);
}

function minimax(newBoard, player){
  const avail = newBoard.map((v,i)=> v===''?i:null).filter(v=>v!==null);
  if (checkWin(newBoard,human)) return {score:-10};
  if (checkWin(newBoard,ai)) return {score:10};
  if (avail.length===0) return {score:0};

  const moves=[];
  for (let i of avail){
    const move={index:i};
    newBoard[i]=player;
    move.score = minimax(newBoard, player===ai?human:ai).score;
    newBoard[i]='';
    moves.push(move);
  }
  let bestMove, bestScore = player===ai ? -Infinity : Infinity;
  moves.forEach((m,idx)=>{
    if (player===ai && m.score>bestScore){bestScore=m.score; bestMove=idx;}
    if (player===human && m.score<bestScore){bestScore=m.score; bestMove=idx;}
  });
  return moves[bestMove];
}

init();
