var board = null
var game = new Chess()

function onDragStart(source, piece) {
  if (game.game_over() ||
      (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }
}

function onDrop(source, target) {
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q'
  })

  if (move === null) return 'snapback'
  updateStatus()
}

function onSnapEnd() {
  board.position(game.fen())
}

function updateStatus() {
  var status = ''

  if (game.in_checkmate()) {
    status = 'Game over, ' + (game.turn() === 'w' ? 'Black' : 'White') + ' wins by Checkmate!'
  } else if (game.in_draw()) {
    status = 'Game over, Draw!'
  } else {
    status = (game.turn() === 'w' ? 'White' : 'Black') + ' to move'
    if (game.in_check()) {
      status += ', ' + (game.turn() === 'w' ? 'White' : 'Black') + ' is in Check!'
    }
  }

  document.getElementById('status').innerText = status
}

function resetGame() {
  game.reset()
  board.start()
  updateStatus()
}

var config = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
}
board = Chessboard('board', config)
updateStatus()
