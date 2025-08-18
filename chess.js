// chess.js - uses chess.js & chessboard.js from CDN
let board = null;
let game = null;
let aiThinking = false;

const statusEl = document.getElementById('chessStatus');
const turnName = document.getElementById('turnName');
const newBtn = document.getElementById('newGame');
const flipBtn = document.getElementById('flipBoard');
const aiLevel = document.getElementById('aiLevel');

function onDragStart(source, piece, position, orientation) {
  if (game.game_over()) return false;
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false;
  }
}

function onDrop(source, target) {
  const move = game.move({from: source, to: target, promotion: 'q'});
  if (move === null) return 'snapback';
  updateStatus();
  if (!game.game_over()) {
    window.setTimeout(makeAIMove, 300);
  }
}

function onSnapEnd() { board.position(game.fen()); }

function updateStatus(){
  const turn = game.turn() === 'w' ? 'White' : 'Black';
  turnName.textContent = turn;
  if (game.in_checkmate()) statusEl.textContent = 'Checkmate!';
  else if (game.in_draw()) statusEl.textContent = 'Draw!';
  else if (game.in_check()) statusEl.textContent = 'Check!';
  else statusEl.textContent = '';
}

function startNew(){
  game = new Chess();
  board = Chessboard('chessBoard', {
    position: 'start',
    draggable: true,
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd,
    pieceTheme: 'https://cdn.jsdelivr.net/npm/chessboardjs@1.0.0/www/img/chesspieces/wikipedia/{piece}.png'
  });
  updateStatus();
}

// Simple eval: piece values
function evaluateBoard(g){
  const values = {p:1, n:3, b:3, r:5, q:9, k:0};
  const fen = g.fen().split(' ')[0];
  let score = 0;
  for(const ch of fen){
    if(ch === '/') continue;
    if(/[1-8]/.test(ch)) continue;
    const isUpper = ch === ch.toUpperCase();
    const piece = ch.toLowerCase();
    score += (isUpper ? 1 : -1) * (values[piece] || 0);
  }
  return score;
}

// minimax with alpha-beta, depth small for performance
function minimax(g, depth, alpha, beta, isMax){
  if(depth===0 || g.game_over()){
    return {score: evaluateBoard(g)};
  }
  const moves = g.moves();
  if(isMax){
    let best = -Infinity, bestMove = null;
    for(const m of moves){
      g.move(m);
      const res = minimax(g, depth-1, alpha, beta, false);
      g.undo();
      if(res.score > best){ best = res.score; bestMove = m; }
      alpha = Math.max(alpha, best);
      if(beta <= alpha) break;
    }
    return {score: best, move: bestMove};
  } else {
    let best = Infinity, bestMove = null;
    for(const m of moves){
      g.move(m);
      const res = minimax(g, depth-1, alpha, beta, true);
      g.undo();
      if(res.score < best){ best = res.score; bestMove = m; }
      beta = Math.min(beta, best);
      if(beta <= alpha) break;
    }
    return {score: best, move: bestMove};
  }
}

function makeAIMove(){
  if(game.game_over()) return;
  const level = parseInt(aiLevel.value,10);
  const depth = level === 1 ? 1 : level === 2 ? 2 : 3;
  aiThinking = true;
  const copy = new Chess(game.fen());
  const mv = minimax(copy, depth, -9999, 9999, game.turn()==='b'? true : false);
  if(mv.move){
    game.move(mv.move);
    board.position(game.fen());
    updateStatus();
  }
  aiThinking = false;
}

newBtn.onclick = startNew;
flipBtn.onclick = ()=> board.flip();
startNew();
