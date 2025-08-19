const cvs = document.getElementById('board');
const ctx = cvs.getContext('2d');
const box = 20; // 18x18 grid
let snake, dir, food, score, speed, loop, lastDir;

function reset() {
  snake = [{x: 8*box, y: 8*box}];
  dir = 'RIGHT';
  lastDir = 'RIGHT';
  score = 0;
  speed = 120; // ms
  food = spawnFood();
  document.getElementById('score').textContent = score;
  if (loop) clearInterval(loop);
  loop = setInterval(draw, speed);
}
function spawnFood(){
  return { x: Math.floor(Math.random()* (cvs.width/box)) * box,
           y: Math.floor(Math.random()* (cvs.height/box)) * box };
}

function draw(){
  ctx.fillStyle = '#0b1624'; ctx.fillRect(0,0,cvs.width,cvs.height);

  // draw food
  ctx.fillStyle = '#ffce3a'; ctx.fillRect(food.x, food.y, box, box);

  // move snake
  let head = {x: snake[0].x, y: snake[0].y};
  if (dir==='LEFT') head.x -= box;
  if (dir==='RIGHT') head.x += box;
  if (dir==='UP') head.y -= box;
  if (dir==='DOWN') head.y += box;

  // wrap walls
  if (head.x < 0) head.x = cvs.width-box;
  if (head.x >= cvs.width) head.x = 0;
  if (head.y < 0) head.y = cvs.height-box;
  if (head.y >= cvs.height) head.y = 0;

  // eat
  if (head.x===food.x && head.y===food.y){
    score++; document.getElementById('score').textContent = score;
    food = spawnFood();
  } else {
    snake.pop();
  }

  // collision with self
  if (snake.some((s,i)=> i && s.x===head.x && s.y===head.y)){
    reset(); return;
  }

  snake.unshift(head);
  lastDir = dir;

  // draw snake
  snake.forEach((s,i)=>{
    ctx.fillStyle = i===0 ? '#6ecbff' : '#2e8ae6';
    ctx.fillRect(s.x, s.y, box, box);
  });
}

/* Controls */
document.addEventListener('keydown', e=>{
  if (e.key==='ArrowLeft' && lastDir!=='RIGHT') dir='LEFT';
  if (e.key==='ArrowRight' && lastDir!=='LEFT') dir='RIGHT';
  if (e.key==='ArrowUp' && lastDir!=='DOWN') dir='UP';
  if (e.key==='ArrowDown' && lastDir!=='UP') dir='DOWN';
});
document.getElementById('restart').onclick = (e)=>{e.preventDefault(); reset();};

// D-pad
document.querySelectorAll('.btn').forEach(b=>{
  b.addEventListener('click', ()=>{
    const d=b.dataset.d;
    if (d==='left' && lastDir!=='RIGHT') dir='LEFT';
    if (d==='right' && lastDir!=='LEFT') dir='RIGHT';
    if (d==='up' && lastDir!=='DOWN') dir='UP';
    if (d==='down' && lastDir!=='UP') dir='DOWN';
  });
});

// Swipe
let sx=0, sy=0;
cvs.addEventListener('touchstart', e=>{
  const t=e.touches[0]; sx=t.clientX; sy=t.clientY;
});
cvs.addEventListener('touchend', e=>{
  const dx=e.changedTouches[0].clientX - sx;
  const dy=e.changedTouches[0].clientY - sy;
  if (Math.abs(dx) > Math.abs(dy)){
    if (dx>20 && lastDir!=='LEFT') dir='RIGHT';
    if (dx<-20 && lastDir!=='RIGHT') dir='LEFT';
  } else {
    if (dy>20 && lastDir!=='UP') dir='DOWN';
    if (dy<-20 && lastDir!=='DOWN') dir='UP';
  }
});

reset();
