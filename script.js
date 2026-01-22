
const menuScreen = document.getElementById("menuScreen");
const difficultyScreen = document.getElementById("difficultyScreen");
const gameScreen = document.getElementById("gameScreen");
const boardDiv = document.getElementById("board");
const statusText = document.getElementById("status");

let cells = [];
let board = ["","","","","","","","",""];
let currentPlayer = "X";
let isGameActive = true;
let gameMode = "player";
let difficulty = "easy";

const winConditions = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

/* SCREENS */
function openDifficulty(){menuScreen.style.display="none";difficultyScreen.style.display="block";}
function backToMenu(){difficultyScreen.style.display="none";menuScreen.style.display="block";}
function startCpuGame(level){difficulty=level;startGame("cpu");}

function startGame(mode){
  gameMode=mode;
  menuScreen.style.display="none";
  difficultyScreen.style.display="none";
  gameScreen.style.display="block";
  createBoard();
  restartGame();
}

/* GAME */
function createBoard(){
  boardDiv.innerHTML="";
  cells=[];
  for(let i=0;i<9;i++){
    const cell=document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index=i;
    cell.addEventListener("click", handleClick);
    boardDiv.appendChild(cell);
    cells.push(cell);
  }
}

function handleClick(){
  const i=this.dataset.index;
  if(board[i]!=="" || !isGameActive) return;

  makeMove(i,currentPlayer);

  if(gameMode==="cpu" && isGameActive && currentPlayer==="O"){
    setTimeout(cpuMove,400);
  }
}

function makeMove(i,p){
  board[i]=p;
  cells[i].textContent=p;
  cells[i].classList.add(p);
  checkWinner();
}

/* CPU */
function cpuMove(){
  let move;
  if(difficulty==="easy") move=randomMove();
  else if(difficulty==="medium"){
    move=findBestMove("O");
    if(move===-1) move=findBestMove("X");
    if(move===-1 && board[4]==="") move=4;
    if(move===-1) move=randomMove();
  } else {
    move=minimax(board,"O").index;
  }
  makeMove(move,"O");
}

function randomMove(){
  let empty=board.map((v,i)=>v===""?i:null).filter(v=>v!==null);
  return empty[Math.floor(Math.random()*empty.length)];
}

function findBestMove(player){
  for(let c of winConditions){
    const [a,b,c2]=c;
    const line=[board[a],board[b],board[c2]];
    if(line.filter(v=>v===player).length===2 && line.includes("")){
      if(board[a]==="") return a;
      if(board[b]==="") return b;
      if(board[c2]==="") return c2;
    }
  }
  return -1;
}

/* MINIMAX */
function minimax(b,p){
  if(checkWinFor(b,"X")) return {score:-10};
  if(checkWinFor(b,"O")) return {score:10};
  if(!b.includes("")) return {score:0};

  let moves=[];
  for(let i=0;i<9;i++){
    if(b[i]===""){
      let move={index:i};
      b[i]=p;
      move.score=minimax(b, p==="O"?"X":"O").score;
      b[i]="";
      moves.push(move);
    }
  }

  let best;
  if(p==="O"){
    let max=-9999;
    for(let m of moves){ if(m.score>max){max=m.score; best=m;} }
  } else {
    let min=9999;
    for(let m of moves){ if(m.score<min){min=m.score; best=m;} }
  }
  return best;
}

function checkWinFor(b,p){
  return winConditions.some(c=>c.every(i=>b[i]===p));
}

/* WIN CHECK */
function checkWinner(){
  for(let c of winConditions){
    const [a,b,c2]=c;
    if(board[a] && board[a]===board[b] && board[a]===board[c2]){
      statusText.textContent=`🎉 Player ${currentPlayer} Wins!`;
      c.forEach(i=>cells[i].classList.add("win"));
      isGameActive=false;
      return;
    }
  }
  if(!board.includes("")){
    statusText.textContent="😲 It's a Draw!";
    isGameActive=false;
    return;
  }
  currentPlayer=currentPlayer==="X"?"O":"X";
  statusText.textContent=`Player ${currentPlayer} Turn`;
}

/* RESET */
function restartGame(){
  board=["","","","","","","","",""];
  currentPlayer="X";
  isGameActive=true;
  statusText.textContent="Player X Turn";
  cells.forEach(c=>{c.textContent="";c.className="cell";});
}

function goToMenu(){
  gameScreen.style.display="none";
  menuScreen.style.display="block";
}
