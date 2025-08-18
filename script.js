const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 400;

const box = 20;
let snake = [{ x: 9 * box, y: 10 * box }];
let direction;
let food = randomFood();
let score = 0;
let game;

document.addEventListener("keydown", event => {
  if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

function changeDirection(newDir) {
  if (newDir === "UP" && direction !== "DOWN") direction = "UP";
  if (newDir === "DOWN" && direction !== "UP") direction = "DOWN";
  if (newDir === "LEFT" && direction !== "RIGHT") direction = "LEFT";
  if (newDir === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box
  };
}

function draw() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 🐍 Draw Snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#4facfe" : "#00ff7f";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);

    ctx.strokeStyle = "#222";
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  // 🍎 Draw Food
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(food.x + box / 2, food.y + box / 2, box / 2, 0, Math.PI * 2);
  ctx.fill();

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === "LEFT") snakeX -= box;
  if (direction === "UP") snakeY -= box;
  if (direction === "RIGHT") snakeX += box;
  if (direction === "DOWN") snakeY += box;

  if (snakeX === food.x && snakeY === food.y) {
    score++;
    food = randomFood();
  } else {
    snake.pop();
  }

  let newHead = { x: snakeX, y: snakeY };

  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= canvas.width ||
    snakeY >= canvas.height ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    alert("Game Over! Final Score: " + score);
  }

  snake.unshift(newHead);

  // 🏆 Score
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 20);
}

function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) {
      return true;
    }
  }
  return false;
}

function restartGame() {
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = null;
  score = 0;
  food = randomFood();
  clearInterval(game);
  game = setInterval(draw, 120);
}

game = setInterval(draw, 120);