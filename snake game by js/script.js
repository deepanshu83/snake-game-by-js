// Game constants and variables
let inputDir = { x: 0, y: 0 };
const foodsound = new Audio('food.mp3');
const movesound = new Audio('move.mp3');
const gameoversound = new Audio('over.mp3');
const musicsound = new Audio('bgsound.mp3');
let speed = 10;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };

// Define the board (assuming it's a div in the HTML)
const board = document.querySelector('#board');
const scoreDisplay = document.querySelector('#score-display');
const gameOverScreen = document.querySelector('#game-over');

// Game functions
function main(ctime) {
    window.requestAnimationFrame(main);
    
    // Frame rate control: update only if time difference is enough
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(sarr) {
    // Check for collision with the walls
    if (sarr[0].x <= 0 || sarr[0].x >= 18 || sarr[0].y <= 0 || sarr[0].y >= 18) {
        return true;  // Wall collision
    }

    // Check if the snake runs into itself
    for (let i = 1; i < sarr.length; i++) {
        if (sarr[i].x === sarr[0].x && sarr[i].y === sarr[0].y) {
            return true;  // Self-collision
        }
    }
    return false;
}

function gameEngine() {
    // Part 1: Updating the snake array and food

    if (isCollide(snakeArr)) {
        gameoversound.play();
        musicsound.pause();
        inputDir = { x: 0, y: 0 };
        gameOverScreen.style.display = "block"; // Show Game Over screen
        score = 0;
        scoreDisplay.innerText = `Score: ${score}`;
        return;
    }

    // If you have eaten the food, increment the score and regenerate the food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        foodsound.play();
        score++;
        scoreDisplay.innerText = `Score: ${score}`;

        // Generate new food
        let a = 2;
        let b = 16;
        food = {
            x: Math.round(a + (b - a) * Math.random()),
            y: Math.round(a + (b - a) * Math.random())
        };
    }

    // Moving the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] }; // Shift each part of the snake forward
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Part 2: Display the snake and food
    board.innerHTML = ""; // Clear the board for the new frame

    // Display the snake
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (index === 0) {
            snakeElement.classList.add('head');  // Add class 'head' for the snake head
        } else {
            snakeElement.classList.add('snake'); // Add class 'snake' for the body
        }
        board.appendChild(snakeElement);
    });

    // Display the food
    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');  // Corrected the class name (classList)
    board.appendChild(foodElement);
}

// Main logic starts here
window.requestAnimationFrame(main);

// Event listener to control the snake's direction
window.addEventListener('keydown', e => {
    if (!inputDir.x && !inputDir.y) {
        inputDir = { x: 0, y: 1 };  // Start the game in the downward direction (default)
        movesound.play();
    }

    switch (e.key) {
        case "ArrowUp":
            console.log("ArrowUp");
            inputDir.x = 0;
            inputDir.y = -1;
            break;
        case "ArrowDown":
            console.log("ArrowDown");
            inputDir.x = 0;
            inputDir.y = 1;
            break;
        case "ArrowLeft":
            console.log("ArrowLeft");
            inputDir.x = -1;
            inputDir.y = 0;
            break;
        case "ArrowRight":
            console.log("ArrowRight");
            inputDir.x = 1;
            inputDir.y = 0;
            break;
    }
});

// Function to restart the game
function startNewGame() {
    gameOverScreen.style.display = "none"; // Hide game over screen
    snakeArr = [{ x: 13, y: 15 }];
    inputDir = { x: 0, y: 0 };
    score = 0;
    scoreDisplay.innerText = `Score: ${score}`;
    musicsound.play();
    window.requestAnimationFrame(main); // Restart the game loop
}
