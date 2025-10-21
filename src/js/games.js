// Games JavaScript Functionality
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initSnakeGame();
    initAsteroidsGame();
    init2048Game();
    initBoxBreathingMeditation();
    init478Meditation();
    
    // Ensure collapsible sections work properly
    setTimeout(() => {
        console.log('Box breathing meditation elements check:');
        console.log('Start button:', document.getElementById('box-start-btn'));
        console.log('Meditation section:', document.getElementById('box-meditation'));
    }, 100);
});

// Navigation functionality
function initNavigation() {
    // Set active navigation link
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if ((currentPage === 'games.html' && href === 'games.html') ||
            (currentPage === 'meditate.html' && href === 'meditate.html') ||
            (currentPage === 'index.html' && href === 'index.html') ||
            (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Snake Game Implementation
let snake = {
    canvas: null,
    ctx: null,
    gridSize: 20,
    snake: [],
    food: {},
    direction: 'right',
    nextDirection: 'right',
    score: 0,
    highScore: 0,
    gameRunning: false,
    gamePaused: false,
    gameLoop: null
};

function initSnakeGame() {
    snake.canvas = document.getElementById('snake-canvas');
    snake.ctx = snake.canvas.getContext('2d');
    
    // Load high score from localStorage
    snake.highScore = localStorage.getItem('snakeHighScore') || 0;
    document.getElementById('snake-high-score').textContent = snake.highScore;
    
    // Set up event listeners
    document.getElementById('snake-start-btn').addEventListener('click', startSnakeGame);
    document.getElementById('snake-pause-btn').addEventListener('click', togglePauseSnakeGame);
    document.getElementById('snake-reset-btn').addEventListener('click', resetSnakeGame);
    
    // Keyboard controls
    document.addEventListener('keydown', handleSnakeKeyPress);
    
    // Initialize game state
    resetSnakeGameState();
    drawSnakeGame();
}

function resetSnakeGameState() {
    snake.snake = [
        { x: 100, y: 100 },
        { x: 80, y: 100 },
        { x: 60, y: 100 }
    ];
    snake.direction = 'right';
    snake.nextDirection = 'right';
    snake.score = 0;
    snake.gameRunning = false;
    snake.gamePaused = false;
    
    updateScoreDisplay();
    generateFood();
    
    // Update button states
    document.getElementById('snake-start-btn').disabled = false;
    document.getElementById('snake-pause-btn').disabled = true;
    document.getElementById('game-over-overlay').style.display = 'none';
}

function startSnakeGame() {
    if (!snake.gameRunning) {
        snake.gameRunning = true;
        snake.gamePaused = false;
        
        // Update button states
        document.getElementById('snake-start-btn').disabled = true;
        document.getElementById('snake-pause-btn').disabled = false;
        
        // Start game loop
        snake.gameLoop = setInterval(updateSnakeGame, 150);
    }
}

function togglePauseSnakeGame() {
    if (snake.gameRunning) {
        snake.gamePaused = !snake.gamePaused;
        
        if (snake.gamePaused) {
            clearInterval(snake.gameLoop);
            document.getElementById('snake-pause-btn').textContent = 'Resume';
        } else {
            snake.gameLoop = setInterval(updateSnakeGame, 150);
            document.getElementById('snake-pause-btn').textContent = 'Pause';
        }
    }
}

function resetSnakeGame() {
    if (snake.gameLoop) {
        clearInterval(snake.gameLoop);
    }
    
    resetSnakeGameState();
    drawSnakeGame();
    
    document.getElementById('snake-pause-btn').textContent = 'Pause';
}

function handleSnakeKeyPress(event) {
    if (!snake.gameRunning) return;
    
    switch(event.code) {
        case 'ArrowUp':
        case 'KeyW':
            if (snake.direction !== 'down') snake.nextDirection = 'up';
            event.preventDefault();
            break;
        case 'ArrowDown':
        case 'KeyS':
            if (snake.direction !== 'up') snake.nextDirection = 'down';
            event.preventDefault();
            break;
        case 'ArrowLeft':
        case 'KeyA':
            if (snake.direction !== 'right') snake.nextDirection = 'left';
            event.preventDefault();
            break;
        case 'ArrowRight':
        case 'KeyD':
            if (snake.direction !== 'left') snake.nextDirection = 'right';
            event.preventDefault();
            break;
        case 'Space':
            togglePauseSnakeGame();
            event.preventDefault();
            break;
    }
}

function updateSnakeGame() {
    if (!snake.gameRunning || snake.gamePaused) return;
    
    // Update direction
    snake.direction = snake.nextDirection;
    
    // Move snake
    const head = { ...snake.snake[0] };
    
    switch(snake.direction) {
        case 'up':
            head.y -= snake.gridSize;
            break;
        case 'down':
            head.y += snake.gridSize;
            break;
        case 'left':
            head.x -= snake.gridSize;
            break;
        case 'right':
            head.x += snake.gridSize;
            break;
    }
    
    // Handle boundary wrapping
    if (head.x < 0) {
        head.x = snake.canvas.width - snake.gridSize;
    } else if (head.x >= snake.canvas.width) {
        head.x = 0;
    }
    
    if (head.y < 0) {
        head.y = snake.canvas.height - snake.gridSize;
    } else if (head.y >= snake.canvas.height) {
        head.y = 0;
    }
    
    // Check self collision
    for (let segment of snake.snake) {
        if (head.x === segment.x && head.y === segment.y) {
            gameOver();
            return;
        }
    }
    
    snake.snake.unshift(head);
    
    // Check food collision
    if (head.x === snake.food.x && head.y === snake.food.y) {
        snake.score += 10;
        updateScoreDisplay();
        generateFood();
    } else {
        snake.snake.pop();
    }
    
    drawSnakeGame();
}

function generateFood() {
    let validPosition = false;
    
    while (!validPosition) {
        snake.food = {
            x: Math.floor(Math.random() * (snake.canvas.width / snake.gridSize)) * snake.gridSize,
            y: Math.floor(Math.random() * (snake.canvas.height / snake.gridSize)) * snake.gridSize
        };
        
        // Make sure food doesn't spawn on snake
        validPosition = true;
        for (let segment of snake.snake) {
            if (segment.x === snake.food.x && segment.y === snake.food.y) {
                validPosition = false;
                break;
            }
        }
    }
}

function drawSnakeGame() {
    // Clear canvas
    snake.ctx.fillStyle = '#1a1a1a';
    snake.ctx.fillRect(0, 0, snake.canvas.width, snake.canvas.height);
    
    // Draw grid (optional)
    snake.ctx.strokeStyle = '#333';
    snake.ctx.lineWidth = 1;
    for (let i = 0; i <= snake.canvas.width; i += snake.gridSize) {
        snake.ctx.beginPath();
        snake.ctx.moveTo(i, 0);
        snake.ctx.lineTo(i, snake.canvas.height);
        snake.ctx.stroke();
    }
    for (let i = 0; i <= snake.canvas.height; i += snake.gridSize) {
        snake.ctx.beginPath();
        snake.ctx.moveTo(0, i);
        snake.ctx.lineTo(snake.canvas.width, i);
        snake.ctx.stroke();
    }
    
    // Draw snake
    snake.ctx.fillStyle = '#00ff00';
    for (let i = 0; i < snake.snake.length; i++) {
        const segment = snake.snake[i];
        
        // Head is slightly different color
        if (i === 0) {
            snake.ctx.fillStyle = '#00dd00';
        } else {
            snake.ctx.fillStyle = '#00ff00';
        }
        
        snake.ctx.fillRect(segment.x + 1, segment.y + 1, snake.gridSize - 2, snake.gridSize - 2);
        
        // Draw eyes on head
        if (i === 0) {
            snake.ctx.fillStyle = '#000';
            const eyeSize = 3;
            const eyeOffset = 5;
            
            switch(snake.direction) {
                case 'up':
                    snake.ctx.fillRect(segment.x + eyeOffset, segment.y + 3, eyeSize, eyeSize);
                    snake.ctx.fillRect(segment.x + snake.gridSize - eyeOffset - eyeSize, segment.y + 3, eyeSize, eyeSize);
                    break;
                case 'down':
                    snake.ctx.fillRect(segment.x + eyeOffset, segment.y + snake.gridSize - 6, eyeSize, eyeSize);
                    snake.ctx.fillRect(segment.x + snake.gridSize - eyeOffset - eyeSize, segment.y + snake.gridSize - 6, eyeSize, eyeSize);
                    break;
                case 'left':
                    snake.ctx.fillRect(segment.x + 3, segment.y + eyeOffset, eyeSize, eyeSize);
                    snake.ctx.fillRect(segment.x + 3, segment.y + snake.gridSize - eyeOffset - eyeSize, eyeSize, eyeSize);
                    break;
                case 'right':
                    snake.ctx.fillRect(segment.x + snake.gridSize - 6, segment.y + eyeOffset, eyeSize, eyeSize);
                    snake.ctx.fillRect(segment.x + snake.gridSize - 6, segment.y + snake.gridSize - eyeOffset - eyeSize, eyeSize, eyeSize);
                    break;
            }
        }
    }
    
    // Draw food
    snake.ctx.fillStyle = '#ff0000';
    snake.ctx.fillRect(snake.food.x + 1, snake.food.y + 1, snake.gridSize - 2, snake.gridSize - 2);
    
    // Draw food highlight
    snake.ctx.fillStyle = '#ff6666';
    snake.ctx.fillRect(snake.food.x + 3, snake.food.y + 3, snake.gridSize - 6, snake.gridSize - 6);
}

function updateScoreDisplay() {
    document.getElementById('snake-score').textContent = snake.score;
    
    // Update high score if necessary
    if (snake.score > snake.highScore) {
        snake.highScore = snake.score;
        document.getElementById('snake-high-score').textContent = snake.highScore;
        localStorage.setItem('snakeHighScore', snake.highScore);
    }
}

function gameOver() {
    snake.gameRunning = false;
    clearInterval(snake.gameLoop);
    
    // Update button states
    document.getElementById('snake-start-btn').disabled = false;
    document.getElementById('snake-pause-btn').disabled = true;
    document.getElementById('snake-pause-btn').textContent = 'Pause';
    
    // Show game over overlay
    document.getElementById('final-score').textContent = snake.score;
    document.getElementById('game-over-overlay').style.display = 'flex';
}

// ============================================
// ASTEROIDS GAME IMPLEMENTATION
// ============================================

let asteroids = {
    canvas: null,
    ctx: null,
    ship: { x: 0, y: 0, angle: 0, velX: 0, velY: 0, thrust: false },
    bullets: [],
    asteroidsList: [],
    score: 0,
    lives: 3,
    highScore: 0,
    gameRunning: false,
    gamePaused: false,
    gameLoop: null,
    level: 1,
    keys: {}
};

function initAsteroidsGame() {
    asteroids.canvas = document.getElementById('asteroids-canvas');
    asteroids.ctx = asteroids.canvas.getContext('2d');
    
    // Load high score
    asteroids.highScore = localStorage.getItem('asteroidsHighScore') || 0;
    document.getElementById('asteroids-high-score').textContent = asteroids.highScore;
    
    // Event listeners
    document.getElementById('asteroids-start-btn').addEventListener('click', startAsteroidsGame);
    document.getElementById('asteroids-pause-btn').addEventListener('click', togglePauseAsteroidsGame);
    document.getElementById('asteroids-reset-btn').addEventListener('click', resetAsteroidsGame);
    
    // Keyboard controls
    document.addEventListener('keydown', handleAsteroidsKeyDown);
    document.addEventListener('keyup', handleAsteroidsKeyUp);
    
    resetAsteroidsGameState();
    drawAsteroidsGame();
}

function resetAsteroidsGameState() {
    asteroids.ship = {
        x: asteroids.canvas.width / 2,
        y: asteroids.canvas.height / 2,
        angle: 0,
        velX: 0,
        velY: 0,
        thrust: false
    };
    asteroids.bullets = [];
    asteroids.asteroidsList = [];
    asteroids.score = 0;
    asteroids.lives = 3;
    asteroids.level = 1;
    asteroids.gameRunning = false;
    asteroids.gamePaused = false;
    
    createAsteroids();
    updateAsteroidsDisplay();
    
    document.getElementById('asteroids-start-btn').disabled = false;
    document.getElementById('asteroids-pause-btn').disabled = true;
    document.getElementById('asteroids-game-over-overlay').style.display = 'none';
}

function createAsteroids() {
    asteroids.asteroidsList = [];
    const numAsteroids = 4 + asteroids.level;
    
    for (let i = 0; i < numAsteroids; i++) {
        let x, y;
        do {
            x = Math.random() * asteroids.canvas.width;
            y = Math.random() * asteroids.canvas.height;
        } while (Math.abs(x - asteroids.ship.x) < 100 && Math.abs(y - asteroids.ship.y) < 100);
        
        asteroids.asteroidsList.push({
            x: x,
            y: y,
            velX: (Math.random() - 0.5) * 2,
            velY: (Math.random() - 0.5) * 2,
            size: 3,
            angle: Math.random() * Math.PI * 2
        });
    }
}

function startAsteroidsGame() {
    if (!asteroids.gameRunning) {
        asteroids.gameRunning = true;
        asteroids.gamePaused = false;
        
        document.getElementById('asteroids-start-btn').disabled = true;
        document.getElementById('asteroids-pause-btn').disabled = false;
        
        asteroids.gameLoop = setInterval(updateAsteroidsGame, 16);
    }
}

function togglePauseAsteroidsGame() {
    if (asteroids.gameRunning) {
        asteroids.gamePaused = !asteroids.gamePaused;
        
        if (asteroids.gamePaused) {
            clearInterval(asteroids.gameLoop);
            document.getElementById('asteroids-pause-btn').textContent = 'Resume';
        } else {
            asteroids.gameLoop = setInterval(updateAsteroidsGame, 16);
            document.getElementById('asteroids-pause-btn').textContent = 'Pause';
        }
    }
}

function resetAsteroidsGame() {
    if (asteroids.gameLoop) {
        clearInterval(asteroids.gameLoop);
    }
    
    resetAsteroidsGameState();
    drawAsteroidsGame();
    document.getElementById('asteroids-pause-btn').textContent = 'Pause';
}

function handleAsteroidsKeyDown(event) {
    if (!asteroids.gameRunning || asteroids.gamePaused) return;
    
    asteroids.keys[event.code] = true;
    
    if (event.code === 'Space') {
        shoot();
        event.preventDefault();
    }
}

function handleAsteroidsKeyUp(event) {
    asteroids.keys[event.code] = false;
}

function updateAsteroidsGame() {
    if (!asteroids.gameRunning || asteroids.gamePaused) return;
    
    // Handle ship controls
    if (asteroids.keys['ArrowLeft'] || asteroids.keys['KeyA']) {
        asteroids.ship.angle -= 0.1;
    }
    if (asteroids.keys['ArrowRight'] || asteroids.keys['KeyD']) {
        asteroids.ship.angle += 0.1;
    }
    if (asteroids.keys['ArrowUp'] || asteroids.keys['KeyW']) {
        asteroids.ship.thrust = true;
        asteroids.ship.velX += Math.cos(asteroids.ship.angle) * 0.3;
        asteroids.ship.velY += Math.sin(asteroids.ship.angle) * 0.3;
    } else {
        asteroids.ship.thrust = false;
    }
    
    // Apply friction and update ship position
    asteroids.ship.velX *= 0.98;
    asteroids.ship.velY *= 0.98;
    asteroids.ship.x += asteroids.ship.velX;
    asteroids.ship.y += asteroids.ship.velY;
    
    // Wrap ship around screen
    if (asteroids.ship.x < 0) asteroids.ship.x = asteroids.canvas.width;
    if (asteroids.ship.x > asteroids.canvas.width) asteroids.ship.x = 0;
    if (asteroids.ship.y < 0) asteroids.ship.y = asteroids.canvas.height;
    if (asteroids.ship.y > asteroids.canvas.height) asteroids.ship.y = 0;
    
    // Update bullets
    for (let i = asteroids.bullets.length - 1; i >= 0; i--) {
        const bullet = asteroids.bullets[i];
        bullet.x += bullet.velX;
        bullet.y += bullet.velY;
        bullet.life--;
        
        if (bullet.life <= 0 || bullet.x < 0 || bullet.x > asteroids.canvas.width || 
            bullet.y < 0 || bullet.y > asteroids.canvas.height) {
            asteroids.bullets.splice(i, 1);
        }
    }
    
    // Update asteroids
    for (const asteroid of asteroids.asteroidsList) {
        asteroid.x += asteroid.velX;
        asteroid.y += asteroid.velY;
        asteroid.angle += 0.02;
        
        // Wrap asteroids around screen
        if (asteroid.x < 0) asteroid.x = asteroids.canvas.width;
        if (asteroid.x > asteroids.canvas.width) asteroid.x = 0;
        if (asteroid.y < 0) asteroid.y = asteroids.canvas.height;
        if (asteroid.y > asteroids.canvas.height) asteroid.y = 0;
    }
    
    // Check collisions
    checkAsteroidsCollisions();
    
    // Check if level complete
    if (asteroids.asteroidsList.length === 0) {
        asteroids.level++;
        createAsteroids();
    }
    
    drawAsteroidsGame();
    updateAsteroidsDisplay();
}

function shoot() {
    asteroids.bullets.push({
        x: asteroids.ship.x,
        y: asteroids.ship.y,
        velX: Math.cos(asteroids.ship.angle) * 8,
        velY: Math.sin(asteroids.ship.angle) * 8,
        life: 60
    });
}

function checkAsteroidsCollisions() {
    // Bullet-asteroid collisions
    for (let i = asteroids.bullets.length - 1; i >= 0; i--) {
        const bullet = asteroids.bullets[i];
        
        for (let j = asteroids.asteroidsList.length - 1; j >= 0; j--) {
            const asteroid = asteroids.asteroidsList[j];
            const dist = Math.sqrt((bullet.x - asteroid.x) ** 2 + (bullet.y - asteroid.y) ** 2);
            
            if (dist < asteroid.size * 10) {
                asteroids.bullets.splice(i, 1);
                
                // Add score
                asteroids.score += asteroid.size * 20;
                
                // Break asteroid into smaller pieces
                if (asteroid.size > 1) {
                    for (let k = 0; k < 2; k++) {
                        asteroids.asteroidsList.push({
                            x: asteroid.x,
                            y: asteroid.y,
                            velX: (Math.random() - 0.5) * 4,
                            velY: (Math.random() - 0.5) * 4,
                            size: asteroid.size - 1,
                            angle: Math.random() * Math.PI * 2
                        });
                    }
                }
                
                asteroids.asteroidsList.splice(j, 1);
                break;
            }
        }
    }
    
    // Ship-asteroid collisions
    for (const asteroid of asteroids.asteroidsList) {
        const dist = Math.sqrt((asteroids.ship.x - asteroid.x) ** 2 + (asteroids.ship.y - asteroid.y) ** 2);
        
        if (dist < asteroid.size * 10 + 10) {
            asteroids.lives--;
            
            if (asteroids.lives <= 0) {
                asteroidsGameOver();
            } else {
                // Reset ship position
                asteroids.ship.x = asteroids.canvas.width / 2;
                asteroids.ship.y = asteroids.canvas.height / 2;
                asteroids.ship.velX = 0;
                asteroids.ship.velY = 0;
            }
            break;
        }
    }
}

function drawAsteroidsGame() {
    // Clear canvas
    asteroids.ctx.fillStyle = '#000';
    asteroids.ctx.fillRect(0, 0, asteroids.canvas.width, asteroids.canvas.height);
    
    // Draw stars background
    asteroids.ctx.fillStyle = '#fff';
    for (let i = 0; i < 50; i++) {
        const x = (i * 37) % asteroids.canvas.width;
        const y = (i * 73) % asteroids.canvas.height;
        asteroids.ctx.fillRect(x, y, 1, 1);
    }
    
    // Draw ship
    asteroids.ctx.save();
    asteroids.ctx.translate(asteroids.ship.x, asteroids.ship.y);
    asteroids.ctx.rotate(asteroids.ship.angle);
    asteroids.ctx.strokeStyle = '#fff';
    asteroids.ctx.lineWidth = 2;
    asteroids.ctx.beginPath();
    asteroids.ctx.moveTo(15, 0);
    asteroids.ctx.lineTo(-10, -8);
    asteroids.ctx.lineTo(-5, 0);
    asteroids.ctx.lineTo(-10, 8);
    asteroids.ctx.closePath();
    asteroids.ctx.stroke();
    
    // Draw thrust
    if (asteroids.ship.thrust) {
        asteroids.ctx.strokeStyle = '#f80';
        asteroids.ctx.beginPath();
        asteroids.ctx.moveTo(-5, 0);
        asteroids.ctx.lineTo(-15, 0);
        asteroids.ctx.stroke();
    }
    
    asteroids.ctx.restore();
    
    // Draw bullets
    asteroids.ctx.fillStyle = '#fff';
    for (const bullet of asteroids.bullets) {
        asteroids.ctx.fillRect(bullet.x - 1, bullet.y - 1, 2, 2);
    }
    
    // Draw asteroids
    for (const asteroid of asteroids.asteroidsList) {
        asteroids.ctx.save();
        asteroids.ctx.translate(asteroid.x, asteroid.y);
        asteroids.ctx.rotate(asteroid.angle);
        asteroids.ctx.strokeStyle = '#fff';
        asteroids.ctx.lineWidth = 2;
        asteroids.ctx.beginPath();
        
        const points = 8;
        const size = asteroid.size * 10;
        for (let i = 0; i < points; i++) {
            const angle = (i / points) * Math.PI * 2;
            const radius = size + Math.sin(i) * 3;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            if (i === 0) {
                asteroids.ctx.moveTo(x, y);
            } else {
                asteroids.ctx.lineTo(x, y);
            }
        }
        
        asteroids.ctx.closePath();
        asteroids.ctx.stroke();
        asteroids.ctx.restore();
    }
}

function updateAsteroidsDisplay() {
    document.getElementById('asteroids-score').textContent = asteroids.score;
    document.getElementById('asteroids-lives').textContent = asteroids.lives;
    
    if (asteroids.score > asteroids.highScore) {
        asteroids.highScore = asteroids.score;
        document.getElementById('asteroids-high-score').textContent = asteroids.highScore;
        localStorage.setItem('asteroidsHighScore', asteroids.highScore);
    }
}

function asteroidsGameOver() {
    asteroids.gameRunning = false;
    clearInterval(asteroids.gameLoop);
    
    document.getElementById('asteroids-start-btn').disabled = false;
    document.getElementById('asteroids-pause-btn').disabled = true;
    document.getElementById('asteroids-pause-btn').textContent = 'Pause';
    
    document.getElementById('asteroids-final-score').textContent = asteroids.score;
    document.getElementById('asteroids-game-over-overlay').style.display = 'flex';
}

// ============================================
// 2048 GAME IMPLEMENTATION
// ============================================

let game2048 = {
    grid: [],
    score: 0,
    bestScore: 0,
    gridSize: 4,
    gameWon: false,
    gameOver: false,
    previousState: null,
    cellSize: 70,
    gap: 8
};

function init2048Game() {
    // Load best score
    game2048.bestScore = localStorage.getItem('2048BestScore') || 0;
    document.getElementById('game2048-best').textContent = game2048.bestScore;
    
    // Event listeners
    document.getElementById('game2048-new-btn').addEventListener('click', newGame2048);
    document.getElementById('game2048-undo-btn').addEventListener('click', undoMove2048);
    document.getElementById('grid-size-select').addEventListener('change', changeGridSize);
    
    // Keyboard controls
    document.addEventListener('keydown', handle2048KeyPress);
    
    // Initialize game
    newGame2048();
}

function changeGridSize() {
    game2048.gridSize = parseInt(document.getElementById('grid-size-select').value);
    
    // Update cell size and gap based on grid size
    switch(game2048.gridSize) {
        case 4:
            game2048.cellSize = 70;
            break;
        case 5:
            game2048.cellSize = 60;
            break;
        case 6:
            game2048.cellSize = 50;
            break;
    }
    
    newGame2048();
}

function newGame2048() {
    game2048.grid = Array(game2048.gridSize).fill().map(() => Array(game2048.gridSize).fill(0));
    game2048.score = 0;
    game2048.gameWon = false;
    game2048.gameOver = false;
    game2048.previousState = null;
    
    addRandomTile();
    addRandomTile();
    
    update2048Display();
    render2048Grid();
    
    document.getElementById('game2048-win-overlay').style.display = 'none';
    document.getElementById('game2048-lose-overlay').style.display = 'none';
}

function addRandomTile() {
    const emptyCells = [];
    
    for (let i = 0; i < game2048.gridSize; i++) {
        for (let j = 0; j < game2048.gridSize; j++) {
            if (game2048.grid[i][j] === 0) {
                emptyCells.push({x: i, y: j});
            }
        }
    }
    
    if (emptyCells.length > 0) {
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        game2048.grid[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
    }
}

function handle2048KeyPress(event) {
    if (game2048.gameOver) return;
    
    let moved = false;
    
    // Save state for undo
    game2048.previousState = {
        grid: game2048.grid.map(row => [...row]),
        score: game2048.score
    };
    
    switch(event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moved = move2048Up();
            event.preventDefault();
            break;
        case 'ArrowDown':
        case 'KeyS':
            moved = move2048Down();
            event.preventDefault();
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moved = move2048Left();
            event.preventDefault();
            break;
        case 'ArrowRight':
        case 'KeyD':
            moved = move2048Right();
            event.preventDefault();
            break;
    }
    
    if (moved) {
        addRandomTile();
        update2048Display();
        render2048Grid();
        
        if (checkWin() && !game2048.gameWon) {
            game2048.gameWon = true;
            document.getElementById('game2048-win-overlay').style.display = 'flex';
        } else if (isGameOver()) {
            game2048.gameOver = true;
            document.getElementById('game2048-lose-overlay').style.display = 'flex';
        }
    } else {
        // Restore previous state if no move was made
        game2048.previousState = null;
    }
}

function move2048Left() {
    let moved = false;
    
    for (let i = 0; i < game2048.gridSize; i++) {
        const row = game2048.grid[i].filter(val => val !== 0);
        
        for (let j = 0; j < row.length - 1; j++) {
            if (row[j] === row[j + 1]) {
                row[j] *= 2;
                game2048.score += row[j];
                row.splice(j + 1, 1);
            }
        }
        
        while (row.length < game2048.gridSize) {
            row.push(0);
        }
        
        for (let j = 0; j < game2048.gridSize; j++) {
            if (game2048.grid[i][j] !== row[j]) {
                moved = true;
            }
            game2048.grid[i][j] = row[j];
        }
    }
    
    return moved;
}

function move2048Right() {
    let moved = false;
    
    for (let i = 0; i < game2048.gridSize; i++) {
        const row = game2048.grid[i].filter(val => val !== 0);
        
        for (let j = row.length - 1; j > 0; j--) {
            if (row[j] === row[j - 1]) {
                row[j] *= 2;
                game2048.score += row[j];
                row.splice(j - 1, 1);
                j--;
            }
        }
        
        while (row.length < game2048.gridSize) {
            row.unshift(0);
        }
        
        for (let j = 0; j < game2048.gridSize; j++) {
            if (game2048.grid[i][j] !== row[j]) {
                moved = true;
            }
            game2048.grid[i][j] = row[j];
        }
    }
    
    return moved;
}

function move2048Up() {
    let moved = false;
    
    for (let j = 0; j < game2048.gridSize; j++) {
        const column = [];
        for (let i = 0; i < game2048.gridSize; i++) {
            if (game2048.grid[i][j] !== 0) {
                column.push(game2048.grid[i][j]);
            }
        }
        
        for (let i = 0; i < column.length - 1; i++) {
            if (column[i] === column[i + 1]) {
                column[i] *= 2;
                game2048.score += column[i];
                column.splice(i + 1, 1);
            }
        }
        
        while (column.length < game2048.gridSize) {
            column.push(0);
        }
        
        for (let i = 0; i < game2048.gridSize; i++) {
            if (game2048.grid[i][j] !== column[i]) {
                moved = true;
            }
            game2048.grid[i][j] = column[i];
        }
    }
    
    return moved;
}

function move2048Down() {
    let moved = false;
    
    for (let j = 0; j < game2048.gridSize; j++) {
        const column = [];
        for (let i = 0; i < game2048.gridSize; i++) {
            if (game2048.grid[i][j] !== 0) {
                column.push(game2048.grid[i][j]);
            }
        }
        
        for (let i = column.length - 1; i > 0; i--) {
            if (column[i] === column[i - 1]) {
                column[i] *= 2;
                game2048.score += column[i];
                column.splice(i - 1, 1);
                i--;
            }
        }
        
        while (column.length < game2048.gridSize) {
            column.unshift(0);
        }
        
        for (let i = 0; i < game2048.gridSize; i++) {
            if (game2048.grid[i][j] !== column[i]) {
                moved = true;
            }
            game2048.grid[i][j] = column[i];
        }
    }
    
    return moved;
}

function checkWin() {
    for (let i = 0; i < game2048.gridSize; i++) {
        for (let j = 0; j < game2048.gridSize; j++) {
            if (game2048.grid[i][j] === 2048) {
                return true;
            }
        }
    }
    return false;
}

function isGameOver() {
    // Check for empty cells
    for (let i = 0; i < game2048.gridSize; i++) {
        for (let j = 0; j < game2048.gridSize; j++) {
            if (game2048.grid[i][j] === 0) {
                return false;
            }
        }
    }
    
    // Check for possible merges
    for (let i = 0; i < game2048.gridSize; i++) {
        for (let j = 0; j < game2048.gridSize; j++) {
            const current = game2048.grid[i][j];
            if ((j < game2048.gridSize - 1 && current === game2048.grid[i][j + 1]) ||
                (i < game2048.gridSize - 1 && current === game2048.grid[i + 1][j])) {
                return false;
            }
        }
    }
    
    return true;
}

function render2048Grid() {
    const gridElement = document.getElementById('game2048-grid');
    gridElement.innerHTML = '';
    
    // Update grid class based on size
    gridElement.className = `game2048-grid size-${game2048.gridSize}`;
    
    // Create background cells
    const totalCells = game2048.gridSize * game2048.gridSize;
    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div');
        cell.className = 'game2048-cell';
        gridElement.appendChild(cell);
    }
    
    // Create tiles
    const cellSizeWithGap = game2048.cellSize + game2048.gap;
    for (let i = 0; i < game2048.gridSize; i++) {
        for (let j = 0; j < game2048.gridSize; j++) {
            const value = game2048.grid[i][j];
            if (value !== 0) {
                const tile = document.createElement('div');
                tile.className = `game2048-tile game2048-tile-${value > 2048 ? 'super' : value}`;
                tile.textContent = value;
                tile.style.transform = `translate(${j * cellSizeWithGap}px, ${i * cellSizeWithGap}px)`;
                gridElement.appendChild(tile);
            }
        }
    }
}

function update2048Display() {
    document.getElementById('game2048-score').textContent = game2048.score;
    
    if (game2048.score > game2048.bestScore) {
        game2048.bestScore = game2048.score;
        document.getElementById('game2048-best').textContent = game2048.bestScore;
        localStorage.setItem('2048BestScore', game2048.bestScore);
    }
}

function undoMove2048() {
    if (game2048.previousState) {
        game2048.grid = game2048.previousState.grid;
        game2048.score = game2048.previousState.score;
        game2048.previousState = null;
        
        update2048Display();
        render2048Grid();
    }
}

function continueGame2048() {
    document.getElementById('game2048-win-overlay').style.display = 'none';
}

// ============================================
// BOX BREATHING MEDITATION IMPLEMENTATION
// ============================================

// ============================================
// BOX BREATHING MEDITATION - EXACT UI MATCH
// ============================================

class SimpleMeditationApp {
    constructor() {
        this.config = {
            breathDuration: 4,
            sessionDuration: 10,
            phases: ['Inhale', 'Hold', 'Exhale', 'Hold Empty']
        };

        this.state = {
            isRunning: false,
            currentPhase: 0,
            phaseTimeRemaining: 0,
            sessionStartTime: null,
            sessionTimeElapsed: 0,
            cyclesCompleted: 1,
            timers: { phase: null, session: null }
        };

        this.elements = {};
        this.init();
    }

    init() {
        this.bindElements();
        this.bindEvents();
        console.log('Simple Meditation App initialized');
    }

    bindElements() {
        // Settings
        this.elements.breathDurationSelect = document.getElementById('breath-duration');
        this.elements.sessionDurationSelect = document.getElementById('session-duration');
        this.elements.startBtn = document.getElementById('start-meditation');
        
        // Settings panel and interface
        this.elements.settingsPanel = document.getElementById('meditation-settings');
        this.elements.meditationInterface = document.getElementById('meditation-interface');
        
        // Main interface elements
        this.elements.breathingCircle = document.getElementById('breathing-circle');
        this.elements.sessionProgress = document.getElementById('session-progress');
        this.elements.timerNumber = document.getElementById('timer-number');
        this.elements.phaseText = document.getElementById('phase-text');
        this.elements.cycleDisplay = document.getElementById('cycle-display');
        this.elements.timeRemaining = document.getElementById('time-remaining');
        this.elements.completeBtn = document.getElementById('complete-btn');
        this.elements.pauseBtn = document.getElementById('pause-btn');
        this.elements.stopBtn = document.getElementById('stop-btn');
    }

    bindEvents() {
        if (this.elements.breathDurationSelect) {
            this.elements.breathDurationSelect.addEventListener('change', (e) => {
                this.config.breathDuration = parseInt(e.target.value);
            });
        }

        if (this.elements.sessionDurationSelect) {
            this.elements.sessionDurationSelect.addEventListener('change', (e) => {
                this.config.sessionDuration = parseInt(e.target.value);
            });
        }

        if (this.elements.startBtn) {
            this.elements.startBtn.addEventListener('click', () => this.startSession());
        }

        if (this.elements.completeBtn) {
            this.elements.completeBtn.addEventListener('click', () => this.completeSession());
        }

        if (this.elements.pauseBtn) {
            this.elements.pauseBtn.addEventListener('click', () => this.togglePause());
        }

        if (this.elements.stopBtn) {
            this.elements.stopBtn.addEventListener('click', () => this.stopSession());
        }
    }

    startSession() {
        // Hide settings, show meditation interface
        if (this.elements.settingsPanel) {
            this.elements.settingsPanel.style.display = 'none';
        }
        if (this.elements.meditationInterface) {
            this.elements.meditationInterface.style.display = 'flex';
        }

        // Initialize session state
        this.state.isRunning = true;
        this.state.sessionStartTime = Date.now();
        this.state.sessionTimeElapsed = 0;
        this.state.cyclesCompleted = 1;
        this.state.currentPhase = 0;

        this.startPhase();
        this.startSessionTimer();
    }

    startPhase() {
        if (!this.state.isRunning) return;

        const phaseName = this.config.phases[this.state.currentPhase];
        this.state.phaseTimeRemaining = this.config.breathDuration;

        // Update UI
        if (this.elements.phaseText) {
            this.elements.phaseText.textContent = phaseName === 'Hold Empty' ? 'Hold your breath...' : phaseName + '...';
        }
        if (this.elements.timerNumber) {
            this.elements.timerNumber.textContent = this.state.phaseTimeRemaining;
        }

        // Update breathing circle animation
        this.updateBreathingAnimation(phaseName);

        // Start phase countdown
        this.state.timers.phase = setInterval(() => {
            this.state.phaseTimeRemaining--;
            if (this.elements.timerNumber) {
                this.elements.timerNumber.textContent = this.state.phaseTimeRemaining;
            }

            if (this.state.phaseTimeRemaining <= 0) {
                clearInterval(this.state.timers.phase);
                this.nextPhase();
            }
        }, 1000);
    }

    updateBreathingAnimation(phaseName) {
        if (!this.elements.breathingCircle) return;

        // Remove all classes
        this.elements.breathingCircle.className = 'breathing-circle';

        // Add appropriate class after a small delay
        setTimeout(() => {
            switch(phaseName.toLowerCase()) {
                case 'inhale':
                    this.elements.breathingCircle.classList.add('inhale');
                    break;
                case 'exhale':
                    this.elements.breathingCircle.classList.add('exhale');
                    break;
                case 'hold':
                case 'hold empty':
                    this.elements.breathingCircle.classList.add('hold');
                    break;
            }
        }, 100);
    }

    nextPhase() {
        this.state.currentPhase = (this.state.currentPhase + 1) % 4;

        // Complete cycle when returning to inhale
        if (this.state.currentPhase === 0) {
            this.state.cyclesCompleted++;
            if (this.elements.cycleDisplay) {
                this.elements.cycleDisplay.textContent = `Cycle ${this.state.cyclesCompleted}`;
            }
        }

        this.startPhase();
    }

    startSessionTimer() {
        this.state.timers.session = setInterval(() => {
            this.state.sessionTimeElapsed++;
            this.updateSessionDisplay();

            // Check if session is complete
            const totalSessionTime = this.config.sessionDuration * 60;
            if (this.state.sessionTimeElapsed >= totalSessionTime) {
                this.completeSession();
            }
        }, 1000);
    }

    updateSessionDisplay() {
        if (this.elements.timeRemaining) {
            const totalSessionTime = this.config.sessionDuration * 60;
            const remaining = Math.max(0, totalSessionTime - this.state.sessionTimeElapsed);
            const minutes = Math.floor(remaining / 60);
            const seconds = remaining % 60;
            this.elements.timeRemaining.textContent = `${minutes}:${seconds.toString().padStart(2, '0')} remaining`;
        }

        // Update session progress ring
        if (this.elements.sessionProgress) {
            const totalSessionTime = this.config.sessionDuration * 60;
            const progress = Math.min(1, this.state.sessionTimeElapsed / totalSessionTime);
            const circumference = 2 * Math.PI * 130;
            const offset = circumference - (progress * circumference);
            this.elements.sessionProgress.style.strokeDashoffset = offset;
        }
    }

    togglePause() {
        // Simple implementation - just stop/start
        if (this.state.isRunning) {
            this.stopSession();
        }
    }

    completeSession() {
        this.stopSession();
        
        // Show completion notification
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Meditation Complete! 🧘‍♀️', {
                body: `Great job! You completed your ${this.config.sessionDuration}-minute session.`,
                icon: '/favicon.ico'
            });
        }
    }

    stopSession() {
        this.state.isRunning = false;

        // Clear timers
        Object.values(this.state.timers).forEach(timer => {
            if (timer) clearInterval(timer);
        });
        this.state.timers = { phase: null, session: null };

        // Reset UI
        if (this.elements.settingsPanel) {
            this.elements.settingsPanel.style.display = 'block';
        }
        if (this.elements.meditationInterface) {
            this.elements.meditationInterface.style.display = 'none';
        }

        // Reset breathing circle
        if (this.elements.breathingCircle) {
            this.elements.breathingCircle.className = 'breathing-circle';
        }
    }
}

// Initialize
let meditationApp = null;

function initBoxBreathingMeditation() {
    const meditationSection = document.getElementById('box-meditation');
    if (meditationSection) {
        console.log('Initializing Simple Meditation App...');
        
        setTimeout(() => {
            try {
                meditationApp = new SimpleMeditationApp();
                console.log('Simple Meditation App initialized successfully');
        } catch (error) {
            console.error('Failed to initialize meditation app:', error);
        }
    }, 500);
}
}

// Placeholder for 4-7-8 Meditation (keeping existing functionality)
function init478Meditation() {
    console.log('4-7-8 Meditation initialization skipped - functionality preserved from original');
}