// Global Variables
const colors = [
  "#F2CB05",
  "#F28505",
  "#1BAD4D",
  "#0564F2",
  "#A605F2",
  "#F20505",
  "#26D9B9",
  "#05B9F2",
  "#282828",
  "#A3F205",
  "#2D05F2",
  "#FCFC5F",
  "#F205CB",
  "#B44343",
  "#CDBB5E",
];

const pallette = document.querySelector(".game__pallette");
const display = document.querySelector(".game__display");
const button = document.querySelector(".header__button");
const timer = document.querySelector('.main__timer');
const scoreboard = document.querySelector('.scoreboard');
const modal = document.querySelector('.modal');

let colorTarget = [];
let colorGuess = [];
let score = 0;
let gameState = 'new';
let timeout;
let interval;

// Render game elements
function renderPallette() {
  colors.forEach((color) => {
    let swatch = document.createElement("div");
    swatch.style.backgroundColor = color;
    swatch.classList.add('swatch');
    swatch.dataset.color = color;
    pallette.append(swatch);
  });
}

function renderDisplay() {
  [1, 2, 3].forEach((value) => {
    let target = document.createElement("div");
    target.classList.add(`target-${value}`);
    display.append(target);
  });
}

function displayColors(colorSet) {
  colorSet.forEach((color, index) => {
    display.children[index].style.backgroundColor = color;
  });
} 

function displayWhite() {
  [...display.children].forEach((target) => {
    target.style.backgroundColor = 'white';
  });
}

function displayTarget() {
  colorTarget = randomColorSet();
  displayColors(colorTarget);
  startTimer(5000, displayWhite);
}

function incrementScore() {
  score++;
  scoreboard.textContent = `WINS: ${score}`;

}

function resetScore() {
  score=0;
  scoreboard.textContent = `WINS: ${score}`;
}

function renderModal() {
  if (gameState == 'win') {
    setTimeout(x => { if (confirm('WINNER')) resetGame() }, 0)
    incrementScore();
    
    
  } else if (gameState == 'lose') {
    setTimeout(x => { if (confirm('LOSER')) resetGame() }, 0)
    resetScore();
  }
}

function resetGame() {
  resetTimer();
  colorGuess = [];
  colorTarget = [];
  displayTarget();
  gameState = 'new';
  

}

function randomColorSet() {
  const shuffledColors = colors.sort((color) => (Math.random() > 0.5 ? 1 : -1));
  return shuffledColors.splice(0,3);
}

function toSeconds(totalMilliSeconds) {
  seconds = (totalMilliSeconds - totalMilliSeconds % 1000) / 1000;
  milliseconds = totalMilliSeconds % 1000;
  return `${seconds.toString().padStart(2,"0")}:${milliseconds.toString().slice(0,2).padStart(2,"0")}`
}

function startTimer(milliseconds, callback) {
  const startTime = new Date();
  
  interval = setInterval(function () {
    let currentTime = new Date();  
    let timeElapsed = currentTime - startTime;
    let timeRemaining = milliseconds - timeElapsed;
    if (timeRemaining >= 0) timer.textContent = toSeconds(timeRemaining);
    else timer.textContent = "00:00"

  },100)

  timeout = setTimeout(() => {
      callback();
      clearInterval(interval);
    },milliseconds)
}

function resetTimer() {
  clearTimeout(timeout);
  clearInterval(interval);
  timer.textContent = "05:00";
}

function monitorPalletteInput() {
  
  pallette.addEventListener('click', event => {
    if (event.target.classList.contains('swatch')) {
      
      guessColor(event.target.dataset.color);
      if (!contained(colorGuess, colorTarget)) gameState = 'lose'
      if (same(colorGuess, colorTarget)) gameState = 'win'
      if (gameState !== 'new') renderModal();
      
    }
  }); 
  
}

function monitorNewGameButton() {
  button.addEventListener("click", resetGame);
  window.addEventListener("keyup",  event => {
    if (event.code === 'Enter') resetGame();
  })

}

function guessColor(color) {
  colorGuess.push(color)
  displayColors(colorGuess);
}

function contained(colorSet1, colorSet2) {
  return colorSet1.every((color, index) => colorSet2[index] == color )
}

function same(colorSet1, colorSet2) {
 return contained(colorSet1, colorSet2) && contained(colorSet2, colorSet1)
}

(function main() {
  renderPallette();
  renderDisplay();
  monitorPalletteInput();
  monitorNewGameButton();
  modal.showModal();

})();

