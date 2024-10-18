const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const SHIP_WIDTH = 115;
const SHIP_HEIGHT = 20;

canvas.width = 400;
canvas.height = 600;

let plane = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 100,
    width: 40,
    height: 40,
    speed: 5,
    dx: 0,
    distanceTravelled: 0 // Distância total percorrida
};

let obstacles = [];
let fuels = [];
let bullets = [];
let enemies = [];
let score = 0;
let gameOver = false;

// Estatísticas
let totalTimePlayed = 0;
let totalEnemiesDown = 0;
let totalBulletsFired = 0;
let totalDistanceTravelled = 0;
let finalScore = 0; // Adicionando a variável para pontuação final

// Função para criar obstáculos
function createObstacle() {
    let width = SHIP_WIDTH; // Usando a largura fixa do navio
    let x = Math.random() * (canvas.width - width);
    obstacles.push({ x, y: -50, width, height: SHIP_HEIGHT });
}

// Função para criar combustível
function createFuel() {
    let x = Math.random() * (canvas.width - 30);
    fuels.push({ x, y: -50, width: 30, height: 30 });
}

// Função para criar inimigos
function createEnemy() {
    let x = Math.random() * (canvas.width - 30);
    enemies.push({ x, y: -50, width: 30, height: 30 });
}

// Função para disparar projéteis
function shoot() {
    bullets.push({ x: plane.x + plane.width / 2 - 5, y: plane.y, width: 5, height: 10, speed: 7 });
    totalBulletsFired++; // Conta o total de tiros disparados
}

// Movimento do avião
function movePlane() {
    plane.x += plane.dx;
    if (plane.x < 0) plane.x = 0;
    if (plane.x + plane.width > canvas.width) plane.x = canvas.width - plane.width;

    plane.distanceTravelled += Math.abs(plane.dx); // Acumula a distância percorrida
    totalDistanceTravelled = Math.round(plane.distanceTravelled); // Atualiza a distância total
}

// Atualiza os tiros
function updateBullets() {
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].y -= bullets[i].speed;
        if (bullets[i].y < 0) {
            bullets.splice(i, 1);
            i--;
        }
    }
}

// Atualiza obstáculos
function updateObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].y += 3;
        if (
            plane.x < obstacles[i].x + obstacles[i].width &&
            plane.x + plane.width > obstacles[i].x &&
            plane.y < obstacles[i].y + obstacles[i].height &&
            plane.y + plane.height > obstacles[i].y
        ) {
            gameOver = true;
        }

        for (let j = 0; j < bullets.length; j++) {
            if (
                bullets[j].x < obstacles[i].x + obstacles[i].width &&
                bullets[j].x + bullets[j].width > obstacles[i].x &&
                bullets[j].y < obstacles[i].y + obstacles[i].height &&
                bullets[j].y + bullets[j].height > obstacles[i].y
            ) {
                obstacles.splice(i, 1);
                bullets.splice(j, 1);
                score += 10;
                i--;
                break;
            }
        }

        if (obstacles[i] && obstacles[i].y > canvas.height) {
            obstacles.splice(i, 1);
            i--;
            score++;
        }
    }
}

// Atualiza os inimigos
function updateEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].y += 3;
        if (
            plane.x < enemies[i].x + enemies[i].width &&
            plane.x + plane.width > enemies[i].x &&
            plane.y < enemies[i].y + enemies[i].height &&
            plane.y + plane.height > enemies[i].y
        ) {
            gameOver = true;
        }

        for (let j = 0; j < bullets.length; j++) {
            if (
                bullets[j].x < enemies[i].x + enemies[i].width &&
                bullets[j].x + bullets[j].width > enemies[i].x &&
                bullets[j].y < enemies[i].y + enemies[i].height &&
                bullets[j].y + bullets[j].height > enemies[i].y
            ) {
                enemies.splice(i, 1);
                bullets.splice(j, 1);
                score += 20;
                totalEnemiesDown++; // Conta os inimigos abatidos
                i--;
                break;
            }
        }

        if (enemies[i] && enemies[i].y > canvas.height) {
            enemies.splice(i, 1);
            i--;
        }
    }
}

// Atualiza os combustíveis
function updateFuels() {
    for (let i = 0; i < fuels.length; i++) {
        fuels[i].y += 2;
        if (
            plane.x < fuels[i].x + fuels[i].width &&
            plane.x + plane.width > fuels[i].x &&
            plane.y < fuels[i].y + fuels[i].height &&
            plane.y + plane.height > fuels[i].y
        ) {
            fuels.splice(i, 1);
            i--;
            score += 5;
        }

        if (fuels[i] && fuels[i].y > canvas.height) {
            fuels.splice(i, 1);
            i--;
        }
    }
}

function drawPlane() {
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(plane.x, plane.y, plane.width, plane.height);
}

function drawBullets() {
    ctx.fillStyle = "#ffff00";
    for (let bullet of bullets) {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }
}

function drawObstacles() {
    ctx.fillStyle = 'darkgreen';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function drawEnemies() {
    ctx.fillStyle = "#ff00ff";
    for (let enemy of enemies) {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }
}

function drawFuels() {
    ctx.fillStyle = "#00ff00";
    for (let fuel of fuels) {
        ctx.fillRect(fuel.x, fuel.y, fuel.width, fuel.height);
    }
}

function drawScore() {
    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 30);
}

// Exibe as estatísticas ao fim do jogo
function showGameOverStats() {
    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial";
    ctx.fillText(`Pontuação Final: ${finalScore}`, 10, 270); // Mostra a pontuação final
    ctx.fillText(`Tempo total jogado: ${Math.floor(totalTimePlayed)}s`, 10, 300);
    ctx.fillText(`Total de aviões abatidos: ${totalEnemiesDown}`, 10, 330);
    ctx.fillText(`Total de tiros disparados: ${totalBulletsFired}`, 10, 360);
    ctx.fillText(`Distância total percorrida: ${totalDistanceTravelled}px`, 10, 390);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function gameLoop(timestamp) {
    if (gameOver) {
        finalScore = score; // Registra a pontuação final ao acabar o jogo
        clearCanvas();
        ctx.fillStyle = "#fff";
        ctx.font = "40px Arial";
        ctx.fillText("Game Over", canvas.width / 4, canvas.height / 2);
        showGameOverStats(); // Mostra as estatísticas ao fim do jogo
        return;
    }

    clearCanvas();
    movePlane();
    updateBullets();
    updateObstacles();
    updateEnemies();
    updateFuels();
    drawPlane();
    drawBullets();
    drawObstacles();
    drawEnemies();
    drawFuels();
    drawScore();

    totalTimePlayed = timestamp / 1000; // Atualiza o tempo total jogado

    requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") plane.dx = -plane.speed;
    if (e.key === "ArrowRight") plane.dx = plane.speed;
    if (e.key === " ") shoot();
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") plane.dx = 0;
});

// Inicia o jogo
setInterval(createObstacle, 1000);
setInterval(createFuel, 3000);
setInterval(createEnemy, 5000);
requestAnimationFrame(gameLoop);
