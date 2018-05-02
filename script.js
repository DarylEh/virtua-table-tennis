//----Declare variables----
//font
const fontName = "Press Start 2P";
//----Ball----
//opening x position
let ballX = 50;
//opening y position
let ballY = 50;
//inital x frame rate
let ballSpeedX = 10;
//inital y frame rate
let ballSpeedY = 4;
//----Paddle----
//opening y position
let paddleOneY = 250;
//opening y position
let paddleTwoY = 250;
const paddleHeight = 100;
const paddleThickness = 10;
//score keeping
let playerOneScore = 0;
let playerTwoScore = 0;
const winningScore = 3;
//end screen
let showWinScreen = false;
//canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

//Initiate Start Screen
window.onload = function() {
  colorRect(0, 0, canvas.width, canvas.height, "black");
  ctx.font = `48px "${fontName}"`;
  ctx.fillStyle = "white";
  ctx.fillText("Virtua Tennis", 100, 200);
  ctx.font = `36px "${fontName}"`;
  ctx.fillText("Press Enter", 225, 350);
  ctx.fillText("to Start", 275, 400);
  //When user hits the enter, the game begins
  document.addEventListener("keypress", e => {
    if (e.keyCode === 13) {
      gameStart();
    }
  });
};
//gameStart function
function gameStart() {
  //seting up frames per second with set interval
  //calling move function and draw function in setInterval
  const framesPerSecond = 30;
  setInterval(() => {
    moveEverything();
    drawEverything();
  }, 1000 / framesPerSecond);
  //when game ends, restart occurs on mouse click
  canvas.addEventListener("mousedown", handleMouseClick);
  //mouse movement controls paddle
  canvas.addEventListener("mousemove", function(e) {
    let mousePos = calculateMousePos(e);
    paddleOneY = mousePos.y - paddleHeight / 2;
  });
}
//handle click to restart game is WinScreen appears
function handleMouseClick(e) {
  if (showWinScreen) {
    playerOneScore = 0;
    playerTwoScore = 0;
    showWinScreen = false;
  }
}
//function calculates mouse postion on the canvas and used in gameStart function
function calculateMousePos(e) {
  let rect = canvas.getBoundingClientRect();
  let root = document.documentElement;
  let mouseX = e.clientX - rect.left - root.scroolLeft;
  let mouseY = e.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY
  };
}
//function is called when score hits 3
function ballReset() {
  if (playerOneScore >= winningScore || playerTwoScore >= winningScore) {
    showWinScreen = true;
  }
  //ball fires from the middle of the screen towards the winner of the last point
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = -ballSpeedX;
}
//Computer AI.  Paddle follows the position of the ball as it moves
function computerMovement() {
  let paddleTwoYCenter = paddleTwoY + paddleHeight / 2;
  if (paddleTwoYCenter < ballY - 35) {
    paddleTwoY += 6;
  } else if (paddleTwoYCenter > ballY + 35) {
    paddleTwoY -= 6;
  }
}
//function includes ball and AI movements
function moveEverything() {
  //If we are show the WinScree stop everything
  if (showWinScreen) {
    return;
  }
  //otehrwise run computerMovement
  computerMovement();
  //ball movment on the x axis
  ballX += ballSpeedX;
  //ball movment on the y axis
  ballY += ballSpeedY;

  //what happens when ball reaches the left side
  if (ballX < paddleThickness + 20) {
    if (ballY > paddleOneY && ballY < paddleOneY + paddleHeight) {
      ballSpeedX = -ballSpeedX;
      //ball control...if ball hits further from the paddle speed increases
      let deltaY = ballY - (paddleOneY + paddleHeight / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      playerTwoScore++; //must be before ballReset()
      ballReset();
    }
  }
  //what happend when ball reaches the right side
  if (ballX > canvas.width - paddleThickness - 20) {
    if (ballY > paddleTwoY && ballY < paddleTwoY + paddleHeight) {
      ballSpeedX = -ballSpeedX;
      //ball control...if ball hits further from the paddle speed increases
      let deltaY = ballY - (paddleTwoY + paddleHeight / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      playerOneScore++;
      ballReset();
    }
  }
  //ball bounce off the top edge
  if (ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }
  //ball bounces of the bottom edge
  if (ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }
}
//Draw function includes background, winScreen, net, paddles, ball
function drawEverything() {
  //background black
  colorRect(0, 0, canvas.width, canvas.height, "black");
  //Winner Screen
  if (showWinScreen) {
    ctx.fillStyle = "white";
    ctx.font = `25px "${fontName}"`;
    ctx.fillText("Click here to Play Again", 100, 400);
    if (playerOneScore >= winningScore) {
      ctx.fillText("Winner You Are!!!", 100, 200);
    } else if (playerTwoScore >= winningScore) {
      ctx.fillText("Winner You Are Not!!!", 100, 200);
    }
    return;
  }
  //draw net
  drawNet();
  //left paddle
  colorRect(10, paddleOneY, paddleThickness, paddleHeight, "white");
  //right paddle (computer)
  colorRect(
    canvas.width - paddleThickness - 10,
    paddleTwoY,
    paddleThickness,
    paddleHeight,
    "white"
  );
  //ball
  colorCircle(ballX, ballY, 10, "red");
  //score keeper
  ctx.font = `20px "${fontName}"`;
  ctx.fillText(playerOneScore, 100, 100);
  ctx.fillText(playerTwoScore, canvas.width - 100, 100);
  ctx.font = "10px 'Press Start 2P'";
  ctx.fillText("Instructions:", 40, 540);
  ctx.fillText("Move mouse to control left paddle", 40, 560);
  ctx.fillText("First to 3 points wins", 450, 560);
}
//drawNet function using for loop
function drawNet() {
  for (let i = 0; i < canvas.height; i += 40) {
    colorRect(canvas.width / 2 - 1, i, 2, 20, "white");
  }
}
//function to fill rectangles
function colorRect(leftX, topY, width, height, drawColor) {
  ctx.fillStyle = drawColor;
  ctx.fillRect(leftX, topY, width, height);
}
//draw circle function
function colorCircle(centerX, centerY, radius, drawColor) {
  ctx.fillStyle = drawColor;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  ctx.fill();
}
