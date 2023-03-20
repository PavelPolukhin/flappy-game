const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const gameContainer = document.getElementById('game-container');

const flappyImg = new Image();
flappyImg.src = 'images/flapUp.png';

const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 30;
const PIPE_WIDTH = 50;

let flappySpeed = -1.5;
let pipeGap = 150;
let birdX = 50;
let birdY = 50;
let birdVelocity = 0;
let birdAcceleration = 0.01;
let speedPipe = 0.5;

let pipeX = 400;
let pipeY = canvas.height - 200;

let score = 0;
let highScore = 0;
let scored = false;

const getDivById = (id) => {
    return document.getElementById(id)
}

let scoreDiv = getDivById('score-display');
const endMenuDiv = getDivById('end-menu');
const endScoreDiv = getDivById('end-score');
const bestScoreDiv = getDivById('best-score');
const restartButton = getDivById('restart-button');

document.body.onkeyup = (e) => {
    if (e.code === 'Space') {
        flappyImg.src = 'images/flapUp.png';
        birdVelocity = flappySpeed;
    }
}

document.body.onkeydown = (e) => {
    if (e.code === 'Space') {
        flappyImg.src = 'images/flapDown.png';
    }
}

restartButton.addEventListener('click', () => {
    hideEndMenu();
    resetGame();
    loop();
})


function increaseScore() {
    if (birdX > pipeX + PIPE_WIDTH && (birdY < pipeY + pipeGap || birdY + BIRD_HEIGHT > pipeY + pipeGap) && !scored) {
        score++;
        scoreDiv.innerHTML = score;
        scored = true;
    }

    if (birdX < pipeX + PIPE_WIDTH) {
        scored = false;
    }
}

function collisionCheck() {
    const birdBox = {
        x: birdX, y: birdY, width: BIRD_WIDTH, height: BIRD_HEIGHT,
    }

    const topPipeBox = {
        x: pipeX, y: pipeY - pipeGap + BIRD_HEIGHT, width: PIPE_WIDTH, height: pipeY,
    }

    const bottomPipeBox = {
        x: pipeX, y: pipeY + pipeGap + BIRD_HEIGHT, width: PIPE_WIDTH, height: canvas.height - pipeY - pipeGap,
    }

    if (birdBox.x + birdBox.width > topPipeBox.x && birdBox.x < topPipeBox.x + topPipeBox.width && birdBox.y < topPipeBox.y) {
        return true;
    }

    if (birdBox.x + birdBox.width > bottomPipeBox.x && birdBox.x < bottomPipeBox.x + bottomPipeBox.width && birdBox.y + birdBox.height > bottomPipeBox.y) {
        return true;
    }

    if (birdY < 0 || birdY + BIRD_HEIGHT > canvas.height) {
        return true;
    }

    return false;
}

function hideEndMenu() {
    endMenuDiv.style.display = 'none';
    gameContainer.classList.remove('backdrop-blur');
}

function showEndMenu() {
    endMenuDiv.style.display = 'block';
    gameContainer.classList.add('backdrop-blur');
    endScoreDiv.innerHTML = `${score}`;
}

function resetGame() {
    flappySpeed = -1.5;
    pipeGap = 150;
    birdX = 50;
    birdY = 50;
    birdVelocity = 0;
    birdAcceleration = 0.01;
    speedPipe = 0.5;

    pipeX = 400;
    pipeY = canvas.height - 200;
    score = 0;
    scoreDiv.innerHTML = `0`;
}

function endGame() {
    if (highScore < score) {
        highScore = score;
    }
    bestScoreDiv.innerHTML = `${highScore}`
    showEndMenu();
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(flappyImg, birdX, birdY);

    ctx.fillStyle = '#333';
    ctx.fillRect(pipeX, -100, PIPE_WIDTH, pipeY);
    ctx.fillRect(pipeX, pipeY + pipeGap, PIPE_WIDTH, canvas.height - pipeY);

    pipeX -= speedPipe;

    if (pipeX < -50) {
        pipeX = 400;
        pipeY = Math.random() * (canvas.height - pipeGap) + PIPE_WIDTH;
        if (scored) {
            switch (true) {
                case score >= 5 &&  score < 10:
                    speedPipe = 0.7;
                    pipeGap = 140;
                    break;
                case score >= 10 && score < 15:
                    speedPipe = 0.9;
                    pipeGap = 130;
                    break;
                case score >= 15:
                    speedPipe = 1.1;
                    pipeGap = 120;
                    break;
            }
        }
    }

    console.log(pipeGap)

    birdVelocity += birdAcceleration;
    birdY += birdVelocity;
    if (collisionCheck()) {
        endGame();
        return;
    }
    increaseScore();
    requestAnimationFrame(loop);
}

loop();

