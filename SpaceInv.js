/*
• JavaScript program name: Space Invaders Strange; Author: Peter B and Kamal H. Zada; date: 25 july 2022

• Instructions → Make Your Game !

With the passing of time and evolution of technology, the human brain has been requesting more and more stimuli to keep the brain occupied.
Boredom happens whenever people don't receive enough of these stimuli.
And you are not receiving enough of it, so you decide to make your own game. And to make it more challenging you decide to use JavaScript to make it.

Your game will be single player only and you will have to create your own engine and tools for the game.
And as you try to search for all sorts of information you start to remember all the 60 FPS memes.

• Objectives:
Here are some of the features you want to implement in your game:
    Game runs at at least 60 FPS (Frames per second) at all times
    No frame drops!
    Proper use of RequestAnimationFrame
    It is very hard to predict performances in JS. So measure performances to see if your code is fast. This will be tested!
    Pause menu, that includes:
        Continue
        Restart
    A score board that displays the following metrics:
        Countdown clock or Timer that will indicate the amount of time the player has until the game ends or the time that the game has been running
        Score that will display the current score (XP or points)
        Lives that shows the number of lives that the player has left

You must not use frameworks or canvas, the game must be implemented using plain JS/DOM and HTML only

• Instructions:
Animation must have consistent motion,
so in order to have a smooth animation (without interruptions or so called jank animation) you must achieve the special number, 60 FPS.
You can see more about performance here.

In order to play the game the player must only use the keyboard.
The controls must be smooth, in other words you should not need to spam a key to take actions in the game.
Instead, for example, if a key is kept pressed, the player must continue to do the relevant action.
If the key is released the player should stop doing the action.

Basically, motions triggered by a key must not jank or stutter.

For the pause menu you must be able to pause, restart, and continue the game whenever you want to do so. The frames should not drop if paused.
Pre-Approved List

Your game will have to respect the genre of one of these games listed below.
In other words, the main goal of the game has to be similar to one of these:
  Bomberman
  Flipper/ Pinball
  Space Invaders
  Donkey Kong
  Brick Breaker/ Arkanoid
  Pac-Man
  Super Mario
  Tetris
  Duck Hunt

• Dev Tools:
We strongly advise you to use Developer Tools available in every browser
(can be accessed using hot keys that depend on the browser or from the browser's Tools menu option).

Developer tools that will help the most with developing this project:
  Page Inspector: You can view and edit page content and layout.
  Web Console: You can see your console.logs and interact with the page using JavaScript.
  Performance Tool: You can analyze your site's general responsiveness, performance, Javascript and layout performance.

The tool that will help you the most is the Performance Tool.
There you can record a sample of your actions on the site and analyze the FPS, check for frame drops,
how much time your functions take to execute, and other useful metrics monitoring.

In the developer tools you can also find a Paint Flashing option that will highlight every paint that happens in your page as actions are performed on it.

• This project will help you learn about:
  requestAnimationFrame
  Event loop
  FPS
  DOM
  Jank/stutter animation
  Transform/ opacity
  Tasks
      JavaScript
      Styles
      Layout
      Painting
      Compositing
  Developer Tools
    Firefox and Chrome.
*/
(function () {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
  var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
  console.log('Golbal Function → to set up Request Animation Frame entered.');
})();
var animationID;

const grid = document.querySelector('.grid');
const resultsDisplay = document.querySelector('.results');
const shipsDisplay = document.querySelector('.ships');
let currentShooterIndex = 202;
let width = 15;
let direction = 1;
let invadersId;
let goingRight = true;
let aliensRemoved = [];
let results = 0;
let ships = 3;
let flag = false;

/*create & display the squares inside the outer grid (Canvas).*/
for (let i = 0; i < 225; i++) {
  const square = document.createElement('div');
  grid.appendChild(square);
};/*for loop*/

const squares = Array.from(document.querySelectorAll('.grid div'))

const alienInvaders = [
  0,1,2,3,4,5,6,7,8,9,
  15,16,17,18,19,20,21,22,23,24,
  30,31,32,33,34,35,36,37,38,39
];

var Clock = {
  totalSeconds: 0,
  start: function () {
    if (!this.interval) {
        var self = this;
        function pad(val) { return val > 9 ? val : "0" + val; }
        this.interval = setInterval(function () {
          self.totalSeconds += 1;

          document.getElementById("min").innerHTML = pad(Math.floor(self.totalSeconds / 60 % 60));
          document.getElementById("sec").innerHTML = pad(parseInt(self.totalSeconds % 60));
        }, 1000);
    }
  },

  restart: function () {
    Clock.totalSeconds = null; 
    clearInterval(this.interval);
    document.getElementById("min").innerHTML = "00";
    document.getElementById("sec").innerHTML = "00";
    delete this.interval;
    // this.restart();
    Clock.start();
  },
  pause: function () {
    clearInterval(this.interval);
    delete this.interval;
  },

  resume: function () {
    this.start();
    Clock.start();
  },
};/*Clock*/

function draw() {
  for (let i = 0; i < alienInvaders.length; i++) {
    if (!aliensRemoved.includes(i)) {
      squares[alienInvaders[i]].classList.add('invader')
    };/*if*/
  };/*for loop*/
};/*draw*/

draw();

function remove() {
  for (let i = 0; i < alienInvaders.length; i++) {
    squares[alienInvaders[i]].classList.remove('invader');
  }/*for loop*/
}/*remove*/

squares[currentShooterIndex].classList.add('shooter');

function moveShooter(e) {
  squares[currentShooterIndex].classList.remove('shooter')

  switch(e.key) {
    case 'ArrowLeft':
      if (currentShooterIndex % width !== 0) currentShooterIndex -=1
        break
    case 'ArrowRight' :
      if (currentShooterIndex % width < width -1) currentShooterIndex +=1 
        break
  };/*switch*/
  squares[currentShooterIndex].classList.add('shooter');
};/*moveShooter*/
document.addEventListener('keydown', moveShooter);

function moveInvaders() {
  var idx = 0;
  const leftEdge = alienInvaders[0] % width === 0;
  const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;
  remove();

  if (rightEdge && goingRight) {
    for (idx = 0; idx < alienInvaders.length; idx++) {
      alienInvaders[idx] += width + 1;
      direction = -1;
      goingRight = false;
    };/*for loop*/
  };/*if*/

  if (leftEdge && !goingRight) {
    for (idx = 0; idx < alienInvaders.length; idx++) {
      alienInvaders[idx] += width - 1;
      direction = 1;
      goingRight = true;
    };/*for loop*/
  };/*if*/

  for (idx = 0; idx < alienInvaders.length; idx++) {
    alienInvaders[idx] += direction;
  };/*for loop*/

  draw();

  if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
    resultsDisplay.innerHTML = results + ' ' + '- GAME OVER';
    Clock.pause();
    flag = false;
    clearInterval(invadersId);
    clearInterval(invaderlaserId);
  };

  for (let i = 0; i < alienInvaders.length; i++) {
    if (alienInvaders[i] > (squares.length)) {
      resultsDisplay.innerHTML = results + ' ' + '- GAME OVER';
      Clock.pause();
      flag = false;
      clearInterval(invadersId);
      clearInterval(invaderlaserId);
    };/*if*/
  };/*for loop*/

  if (aliensRemoved.length === alienInvaders.length) {
    resultsDisplay.innerHTML = results + ' ' + '- YOU WIN';
    Clock.pause();
    flag = false;
    clearInterval(invadersId);
    clearInterval(invaderlaserId);
  };/*if*/

  if (ships === 0) {
    resultsDisplay.innerHTML = results +' '+'- GAME OVER'
    Clock.pause()
    flag = false
    clearInterval(invadersId)
    clearInterval(invaderlaserId)
  };/*if*/
};/*moveInvaders*/

let fps, eachNthFrame, frameCount;

fps = 60;

//This variable specifies how many frames should be skipped.
//If it is 1 then no frames are skipped. If it is 2, one frame 
//is skipped so "eachSecondFrame" is rendered.
eachNthFrame = Math.round((1000 / fps) / 16.66);

//This variable is the number of the current frame. It is set to eachNthFrame so that the 
//first frame will be rendered.
frameCount = eachNthFrame;

function frame() {
  if (frameCount === eachNthFrame) {
  frameCount = 1;
    invadersId = setInterval(moveInvaders, 500);/*to increase/decrease speed of Aliens; 100 is very fast*/
    invaderlaserId = setInterval(invaderShoot, 100); 
  };/*if*/
  frameCount++;
  console.log('animation frame:', frameCount);
  animationID = requestAnimationFrame(frame);
};/*frame*/

let count = 0;
document.getElementById("startButton").addEventListener("click", function () { 
    flag = true;
    Clock.start(); 
  if (count === 0) {
    // invadersId = setInterval(moveInvaders, 600)
    // invaderlaserId = setInterval(invaderShoot, 100) 
    frameCount = eachNthFrame;
    frame();
  };/*if*/

  if (count2 > 0) {
    // invadersId = setInterval(moveInvaders, 600)
    // invaderlaserId = setInterval(invaderShoot, 100)
    frameCount = eachNthFrame;
    frame();
  }
  count++
});

let count2 = 0;
document.getElementById("pauseButton").addEventListener("click", function () { 
  flag = false;
  Clock.pause(); 
  invadersId = clearInterval(invadersId);
  invaderlaserId = clearInterval(invaderlaserId);
  count2++;
});

document.getElementById("restartButton").addEventListener("click", function () { 
  location.reload();
});

function shoot(e) {
  let laserId;
  let currentLaserIndex = currentShooterIndex;
  function moveLaser() {
    squares[currentLaserIndex].classList.remove('laser');
    currentLaserIndex -= width;
    squares[currentLaserIndex].classList.add('laser');

    if (squares[currentLaserIndex].classList.contains('invader')) {
      squares[currentLaserIndex].classList.remove('laser');
      squares[currentLaserIndex].classList.remove('invader');
      squares[currentLaserIndex].classList.add('boom');

      setTimeout(()=> squares[currentLaserIndex].classList.remove('boom'), 300);
      clearInterval(laserId);

      const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
      aliensRemoved.push(alienRemoved);

      results++;
      resultsDisplay.innerHTML = results;
    };/*if*/

    if (squares[currentLaserIndex].classList.contains('invaderlaser')) {
      squares[currentLaserIndex].classList.remove('laser');
      squares[currentLaserIndex].classList.remove('invaderlaser');
      squares[currentLaserIndex].classList.add('boom');

      setTimeout(()=> squares[currentLaserIndex].classList.remove('boom'), 300);
      clearInterval(laserId);
      currentinvaderLaserIndex = alienInvaders[Math.floor(Math.random() * alienInvaders.length)];
    };/*if*/
  };/*moveLaser*/

  if (flag) {
    switch(e.key) {
     case 'ArrowUp':
       laserId = setInterval(moveLaser, 100);
       break;
    };/*switch*/
  };/*if*/
};/*shoot*/

document.addEventListener('keydown', shoot);

let invaderlaserId;
let currentinvaderLaserIndex = alienInvaders[Math.floor(Math.random() * alienInvaders.length)];

function invaderShoot() {
  //console.log(aliensRemoved.length)
    squares[currentinvaderLaserIndex].classList.remove('invaderlaser');
    currentinvaderLaserIndex += width;
    squares[currentinvaderLaserIndex].classList.add('invaderlaser');

    if (squares[currentinvaderLaserIndex].classList.contains('shooter')) {
      squares[currentinvaderLaserIndex].classList.remove('invaderlaser');
      ships--;
      shipsDisplay.innerHTML = ships;
    }/*if*/

  if (currentinvaderLaserIndex > 200) {
    squares[currentinvaderLaserIndex].classList.remove('invaderlaser');
    setTimeout(()=> squares[currentinvaderLaserIndex].classList.remove('boom'), 300);
    currentinvaderLaserIndex = alienInvaders[Math.floor(Math.random() * alienInvaders.length)]
  };/*if*/
};/*invaderShoot*/
