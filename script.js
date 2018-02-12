//declare variables
//ball
let ballX = 50;
let ballY = 50;
let ballSpeedX = 10;
let ballSpeedY = 4;
//paddle
let paddleOneY = 250;
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
const canvas = document.getElementById('gameCanvas');
const canvasContext = canvas.getContext('2d');
canvasContext.font = "20px sans-serif";


function calculateMousePos(e) {
    let rect = canvas.getBoundingClientRect();
    let root = document.documentElement;
    let mouseX = e.clientX - rect.left - root.scroolLeft;
    let mouseY  = e.clientY - rect.top - root.scrollTop;
    return {
        x:mouseX,
        y:mouseY
    }


}
//handle click to start game
function handleMouseClick(e){
    if (showWinScreen) {
        playerOneScore = 0;
        playerTwoScore = 0;
        showWinScreen = false;
    }
}

window.onload = function(){ 
    //seting up frames per second with set interval
    //calling move function and draw function in setInterval
    const framesPerSecond = 30;
    setInterval(() => {
        moveEverything();
        drawEverything();
    } , 1000/framesPerSecond)

    //mouse movement controls paddle
    canvas.addEventListener('mousedown', handleMouseClick);
    canvas.addEventListener('mousemove',
        function(e){
            let mousePos = calculateMousePos(e);
            paddleOneY = mousePos.y-(paddleHeight/2);
    });
}
//create a function 
function ballReset(){
    if (playerOneScore >= winningScore || 
        playerTwoScore >= winningScore){
            // playerOneScore = 0;
            // playerTwoScore = 0;
            showWinScreen = true;
        }
    ballX = canvas.width/2;
    ballY = canvas.height/2;
    ballSpeedX = -ballSpeedX;
}
function computerMovement () {
    let paddleTwoYCenter = paddleTwoY + (paddleHeight/2);
    if(paddleTwoYCenter < ballY - 35){
        paddleTwoY += 6;
    } else if (paddleTwoYCenter > ballY + 35){
        paddleTwoY -= 6;
    }
}

function moveEverything() {
    if (showWinScreen) {
        return;
    }
    computerMovement();

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    //what happens when ball reaches the left side
    if (ballX < (paddleThickness+20)) {
        if(ballY > paddleOneY && ballY < paddleOneY+paddleHeight){
            ballSpeedX = -ballSpeedX;
            //ball control
            let deltaY = ballY - (paddleOneY+paddleHeight/2)
            ballSpeedY = deltaY *0.35;
        } else {
            playerTwoScore++;//must be before ballReset()
            ballReset();
        }
    }
    //what happend when ball reaches the right side
    if (ballX > canvas.width-paddleThickness-20){
        if (ballY > paddleTwoY && ballY < paddleTwoY+paddleHeight) {
            ballSpeedX = -ballSpeedX;
            //ball control
            let deltaY = ballY - (paddleTwoY + paddleHeight / 2)
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

function drawNet(){
    for (let i = 0; i <canvas.height; i+=40) {
        colorRect(canvas.width/2-1, i, 2, 20, 'white');
    }
}

function drawEverything (){
    //background black
    colorRect(0, 0, canvas.width, canvas.height, 'black');
    
    //Winner Screen
    if (showWinScreen) {
        canvasContext.fillStyle = 'white';

        canvasContext.fillText("Click here to Play Again", 300, 400)
        if (playerOneScore >= winningScore) {
            canvasContext.fillText("Winner You Are!!!", 300, 200)
        } else if (playerTwoScore >= winningScore){
            canvasContext.fillText("Winner You Are Not!!!", 300, 200)
        }
        return;
    }
    //draw net
    drawNet();
    //left paddle
    colorRect(10, paddleOneY, paddleThickness, paddleHeight, 'white');
    //right paddle (computer)
    colorRect(canvas.width - paddleThickness-10, paddleTwoY, paddleThickness, paddleHeight, 'white');
    //ball
    colorCircle(ballX, ballY, 10,'red');
    //score keeper
    canvasContext.fillText(playerOneScore, 100,100);
    canvasContext.fillText(playerTwoScore, canvas.width-100, 100);
    canvasContext.fillText("Instructions:", 75, 540);
    canvasContext.fillText("Move mouse to control left paddle", 75, 560)
}

//function to fill rectangles
function colorRect(leftX, topY, width, height, drawColor){
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);

    
}
//draw circle function
function colorCircle(centerX, centerY, radius, drawColor){
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}

