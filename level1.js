const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const playerImage = new Image();
playerImage.src = 'https://img.icons8.com/ios/50/000000/car.png';  // Replace with your player image

const objectImage = new Image();
objectImage.src = 'https://img.icons8.com/ios/50/000000/box.png';  // Replace with your falling object image

let player = {
    x: canvas.width / 2 - 30,
    y: canvas.height - 60,
    width: 60,
    height: 60,
    speed: 7
};

let fallingObjects = [];
const objectSpeed = 3;
const objectCount = 5;  // Number of objects to generate

let score = 0;
const gameDuration = 60;  // Game duration in seconds
let gameStartTime = Date.now();

function generateObjects() {
    for (let i = 0; i < objectCount; i++) {
        fallingObjects.push({
            x: Math.random() * (canvas.width - 60),
            y: Math.random() * -canvas.height,
            width: 60,
            height: 60
        });
    }
}

function update() {
    let elapsedTime = (Date.now() - gameStartTime) / 1000; // Elapsed time in seconds

    if (elapsedTime > gameDuration) {
        alert('Game Over! Your score: ' + score);
        window.location.reload();  // Reload the page to restart the game
        return;
    }

    // Move player
    if (keys['ArrowLeft'] || leftPressed) {
        player.x -= player.speed;
    }
    if (keys['ArrowRight'] || rightPressed) {
        player.x += player.speed;
    }
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x)); // Stay within canvas bounds

    // Move falling objects
    fallingObjects.forEach(object => {
        object.y += objectSpeed;
        if (object.y > canvas.height) {
            object.y = Math.random() * -canvas.height;
            object.x = Math.random() * (canvas.width - object.width);
        }
        // Check for collisions
        if (player.x < object.x + object.width &&
            player.x + player.width > object.x &&
            player.y < object.y + object.height &&
            player.y + player.height > object.y) {
            score++;
            object.y = Math.random() * -canvas.height;
            object.x = Math.random() * (canvas.width - object.width);
        }
    });

    document.getElementById('score').innerText = 'Score: ' + score;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

    // Draw falling objects
    fallingObjects.forEach(object => {
        ctx.drawImage(objectImage, object.x, object.y, object.width, object.height);
    });
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

let keys = {};
let leftPressed = false;
let rightPressed = false;

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});
window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

document.getElementById('leftBtn').addEventListener('touchstart', () => {
    leftPressed = true;
});
document.getElementById('leftBtn').addEventListener('touchend', () => {
    leftPressed = false;
});
document.getElementById('rightBtn').addEventListener('touchstart', () => {
    rightPressed = true;
});
document.getElementById('rightBtn').addEventListener('touchend', () => {
    rightPressed = false;
});

generateObjects();
gameLoop();
