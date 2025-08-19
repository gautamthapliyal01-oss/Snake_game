const chessboard = [
    ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
    ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
    ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
];

const boardElement = document.getElementById('chessboard');
chessboard.forEach((row, rowIndex) => {
    row.forEach((piece, colIndex) => {
        const square = document.createElement('div');
        square.className = 'square ' + ((rowIndex + colIndex) % 2 === 0 ? 'light' : 'dark');
        square.innerHTML = piece;
        boardElement.appendChild(square);
    });
});
