let game, board;
function onDragStart (source, piece) {
  if (game.game_over()) return false;
  if (game.turn() === 'w' && piece.startsWith('b')) return false;
  if (game.turn() === 'b' && piece.startsWith('w')) return false;
}
function onDrop (source, target) {
  const move = game.move({from: source, to: target, promotion: 'q'});
  if (move === null) return 'snapback';
  updateStatus();
}
function onSnapEnd () { board.position(game.fen()); }
function updateStatus(){
  const sEl=document.getElementById('status');
  let txt=(game.turn()==='w'?'White':'Black')+' to move';
  if (game.in_checkmate()) txt='Checkmate!';
  else if (game.in_draw()) txt='Draw!';
  else if (game.in_check()) txt+=' — check!';
  sEl.textContent=txt;
  document.getElementById('fen').value=game.fen();
}
function newGame(){
  game=new Chess();
  board=Chessboard('board',{
    position:'start', draggable:true, moveSpeed:'fast',
    pieceTheme:'https://cdn.jsdelivr.net/npm/chessboardjs@1.0.0/www/img/chesspieces/wikipedia/{piece}.png',
    onDragStart,onDrop,onSnapEnd
  });
  updateStatus();
}
document.getElementById('new').onclick=newGame;
document.getElementById('flip').onclick=()=>board.flip();
newGame();
