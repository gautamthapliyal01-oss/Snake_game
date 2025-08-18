let currentPlayer = 1;
const rollBtn = document.getElementById("rollBtn");
const diceResult = document.getElementById("diceResult");
const turnText = document.getElementById("turn");
const history = document.getElementById("history");

rollBtn.addEventListener("click", () => {
    const roll = Math.floor(Math.random() * 6) + 1;

    diceResult.innerHTML = `🎲 You rolled: ${roll}`;
    history.innerHTML += `<p>Player ${currentPlayer} rolled: ${roll}</p>`;

    // Switch turn
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    turnText.innerText = `Player ${currentPlayer}'s Turn`;
});
