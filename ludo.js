// Ludo Lite: small, 4 players, 1 token each for fast play
const canvas = document.getElementById('ludoCanvas');
const ctxL = canvas.getContext('2d');
const rollBtn = document.getElementById('rollBtn');
const resetBtn = document.getElementById('resetBtn');
const lTurn = document.getElementById('lTurn');

const W = canvas.width;
const H = canvas.height;
const N = 11; // grid
const cell = W / N;
const colors = ['#ff4d6d','#00d4ff','#ffd166','#6ee7b7'];
const names = ['Red','Blue','Yellow','Green'];

let track = [];
let players = [];
let turn = 0;
let dice = 0;

function buildTrack(){
  // build rectangular loop as earlier, simplified
  const path = [];
  for(let x=1;x<=9;x++) path.push({x,y:1});
  for(let y=2;y<=9;y++) path.push({x:9,y});
  for(let x=8;x>=1;x--) path.push({x,y:9});
  for(let y=8;y>=2;y--) path.push({x:1,y});
  // compress to 20-ish points, but we keep all
  return path.slice(0,28);
}
function drawBoard(){
  ctxL.clearRect(0,0,W,H);
  ctxL.fillStyle='#071217'; ctxL.fillRect(0,0,W,H);
  // draw track
  track.forEach((p,i)=>{
    ctxL.fillStyle = (i%2)? 'rgba(255,255,255,.02)': 'rgba(255,255,255,.03)';
    ctxL.fillRect(p.x*cell, p.y*cell, cell, cell);
    ctxL.strokeStyle='rgba(255,255,255,.04)'; ctxL.strokeRect(p.x*cell, p.y*cell, cell, cell);
  });
  // draw players
  players.forEach((pl,idx)=>{
    const pos = pl.pos===-1 ? pl.home : track[pl.pos % track.length];
    const cx = (pos.x + 0.5) * cell, cy = (pos.y + 0.5) * cell;
    ctxL.beginPath(); ctxL.fillStyle = pl.color; ctxL.arc(cx,cy,cell*0.35,0,Math.PI*2); ctxL.fill();
    ctxL.strokeStyle='rgba(0,0,0,.4)'; ctxL.stroke();
  });
}
function initLudo(){
  track = buildTrack();
  // home positions approximate inside board (choose safe spots)
  players = [
    {color:colors[0], pos:-1, home:{x:1,y:1}},
    {color:colors[1], pos:14, home:{x:9,y:1}},
    {color:colors[2], pos:7, home:{x:9,y:9}},
    {color:colors[3], pos:21, home:{x:1,y:9}},
  ];
  turn = 0; dice = 0;
  lTurn.textContent = names[turn];
  drawBoard();
}
function rollDice(){
  dice = Math.floor(Math.random()*6)+1;
  // move current if possible
  const cur = players[turn];
  if(cur.pos === -1){
    if(dice === 6){ cur.pos = 0; } else { nextTurn(); return; }
  } else {
    cur.pos = (cur.pos + dice) % track.length;
  }
  // capture - if any other on same absolute pos and not safe index, send home
  players.forEach((p, i)=>{
    if(i===turn) return;
    if(p.pos !== -1 && players[turn].pos === p.pos){
      p.pos = -1; // send home
    }
  });
  drawBoard();
  // extra turn on 6
  if(dice !== 6) nextTurn();
}
function nextTurn(){ turn = (turn+1) % players.length; lTurn.textContent = names[turn]; }
rollBtn.onclick = rollDice;
resetBtn.onclick = initLudo;

initLudo();
