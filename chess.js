let board = null
let game = new Chess()

function onDragStart (source, piece) {
  if (game.game_over()) return false
  if (game.turn() === 'w' && piece.startsWith('b')) return false
  if (game.turn() === 'b' && piece.startsWith('w')) return false
}

function onDrop (source, target) {
  const move = game.move({
    from: source,
    to: target,
    promotion: 'q' // always promote to queen
  })

  if (move === null) return 'snapback'
  updateStatus()

  // Bot move
  window.setTimeout(makeRandomMove, 250)
}

function makeRandomMove () {
  if (game.game_over()) return
  const possibleMoves = game.moves()
  const randomIdx = Math.floor(Math.random() * possibleMoves.length)
  game.move(possibleMoves[randomIdx])
  board.position(game.fen())
  updateStatus()
}

function onSnapEnd () {
  board.position(game.fen())
}

function updateStatus () {
  let status = ''
  let moveColor = game.turn() === 'w' ? 'White' : 'Black'

  if (game.in_checkmate()) {
    status = `Game over, ${moveColor} is in checkmate.`
  } else if (game.in_draw()) {
    status = 'Game over, drawn position.'
  } else {
    status = `${moveColor} to move`
    if (game.in_check()) {
      status += `, ${moveColor} is in check`
    }
  }

  document.getElementById('status').innerText = status
}

board = Chessboard('board', {
  draggable: true,
  position: 'start',
  onDragStart,
  onDrop,
  onSnapEnd
})

updateStatus()
