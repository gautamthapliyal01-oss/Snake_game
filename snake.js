const cvs = document.getElementById('snake');
const ctx = cvs.getContext('2d');
const size = 20, cells = cvs.width / size;
let snake, dir, food, score, speed, timer;

const rnd = n => Math.floor(Math.random()*n);
const newFood = () => {
  let f; do { f = {x:rnd(cells), y:rnd(cells)}; }
  while(snake.some(s=>s.x===f.x && s.y===f.y));
  return f;
};
function reset(){
  snake=[{x:10,y:10}]; dir={x:1,y:0}; food=newFood(); score=0; speed=120;
  clearInterval(timer); timer=setInterval(loop,speed); draw(); upd();
}
const upd=()=>document.getElementById('score').textContent=score;
function drawGrid(){
  ctx.clearRect(0,0,cvs.width,cvs.height);
  ctx.fillStyle='#0d1030'; ctx.fillRect(0,0,cvs.width,cvs.height);
  ctx.strokeStyle='rgba(255,255,255,.05)';
  for(let i=0;i<=cells;i++){
    ctx.beginPath(); ctx.moveTo(i*size,0); ctx.lineTo(i*size,cvs.height); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0,i*size); ctx.lineTo(cvs.width,i*size); ctx.stroke();
  }
}
function draw(){
  drawGrid();
  ctx.fillStyle='#22d3ee'; ctx.fillRect(food.x*size, food.y*size, size, size);
  snake.forEach((p,i)=>{ ctx.fillStyle=i? '#5b67ff':'#8b5cf6';
    ctx.fillRect(p.x*size+2,p.y*size+2,size-4,size-4);
  });
}
function step(){
  const head={x:snake[0].x+dir.x, y:snake[0].y+dir.y};
  head.x=(head.x+cells)%cells; head.y=(head.y+cells)%cells;
  if(snake.some((s,i)=>i && s.x===head.x && s.y===head.y)) return over();
  snake.unshift(head);
  if(head.x===food.x && head.y===food.y){ score++; upd(); if(speed>70){speed-=5;clearInterval(timer);timer=setInterval(loop,speed);} food=newFood(); }
  else snake.pop();
}
function loop(){ step(); draw(); }
function over(){
  clearInterval(timer);
  ctx.fillStyle='rgba(0,0,0,.6)'; ctx.fillRect(0,0,cvs.width,cvs.height);
  ctx.fillStyle='#fff'; ctx.font='20px ui-sans-serif,system-ui'; ctx.textAlign='center';
  ctx.fillText('Game Over! Tap Restart', cvs.width/2, cvs.height/2);
}
['up','down','left','right'].forEach(id=>{
  document.getElementById(id).onclick=()=>{
    if(id==='up'&&dir.y===0)dir={x:0,y:-1};
    if(id==='down'&&dir.y===0)dir={x:0,y:1};
    if(id==='left'&&dir.x===0)dir={x:-1,y:0};
    if(id==='right'&&dir.x===0)dir={x:1,y:0};
  };
});
document.getElementById('restart').onclick=reset;
window.addEventListener('keydown',e=>{
  ({ArrowUp:()=>document.getElementById('up').onclick(),
    ArrowDown:()=>document.getElementById('down').onclick(),
    ArrowLeft:()=>document.getElementById('left').onclick(),
    ArrowRight:()=>document.getElementById('right').onclick()}[e.key]?.());
});
reset();
