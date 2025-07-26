const BOARD_SIZE = 10;
const SHADOWS_COUNT = 15;
const NIGHT_TIME = 60; // seconds

// --- Game State Variables ---
let board = [];
let gameOver = false;
let timer = 0;
let panelsFound = 0;
let gameInterval;
let nightInterval;

// --- DOM Elements ---
const gameBoard = document.getElementById('game-board');
const panelsFoundDisplay = document.getElementById('panels-found');
const timerDisplay = document.getElementById('timer');
const resetButton = document.getElementById('reset-button');
const modal = document.getElementById('game-over-modal');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const modalCloseButton = document.getElementById('modal-close-button');

// --- Game Functions ---

function createBoard() {
    gameBoard.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 1fr)`;
    board = [];
    panelsFound = 0;
    panelsFoundDisplay.textContent = panelsFound;

    for (let i = 0; i < BOARD_SIZE; i++) {
        board[i] = [];
        for (let j = 0; j < BOARD_SIZE; j++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.dataset.row = i;
            tile.dataset.col = j;
            tile.addEventListener('click', handleTileClick);
            gameBoard.appendChild(tile);
            board[i][j] = {
                element: tile,
                isShadow: false,
                isRevealed: false,
                neighboringShadows: 0,
                row: i,
                col: j
            };
        }
    }
    placeShadows();
    calculateNeighboringShadows();
}

function placeShadows() {
    let shadowsPlaced = 0;
    while (shadowsPlaced < SHADOWS_COUNT) {
        const row = Math.floor(Math.random() * BOARD_SIZE);
        const col = Math.floor(Math.random() * BOARD_SIZE);
        if (!board[row][col].isShadow) {
            board[row][col].isShadow = true;
            shadowsPlaced++;
        }
    }
}

function calculateNeighboringShadows() {
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (!board[i][j].isShadow) {
                let count = 0;
                for (let x = -1; x <= 1; x++) {
                    for (let y = -1; y <= 1; y++) {
                        if (x === 0 && y === 0) continue;
                        const newRow = i + x;
                        const newCol = j + y;
                        if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE && board[newRow][newCol].isShadow) {
                            count++;
                        }
                    }
                }
                board[i][j].neighboringShadows = count;
            }
        }
    }
}

function handleTileClick(event) {
    if (gameOver) return;

    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    const tile = board[row][col];

    if (tile.isRevealed) return;

    tile.isRevealed = true;
    tile.element.classList.add('revealed');

    if (tile.isShadow) {
        tile.element.classList.add('shadow');
        endGame(false);
    } else {
        panelsFound++;
        panelsFoundDisplay.textContent = panelsFound;
        if (tile.neighboringShadows > 0) {
            tile.element.textContent = tile.neighboringShadows;
            tile.element.dataset.count = tile.neighboringShadows;
        } else {
            // Recursively reveal adjacent tiles
            revealAdjacentTiles(row, col);
        }

        if (panelsFound === (BOARD_SIZE * BOARD_SIZE) - SHADOWS_COUNT) {
            endGame(true);
        }
    }
}

function revealAdjacentTiles(row, col) {
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            const newRow = row + x;
            const newCol = col + y;
            if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE && !board[newRow][newCol].isRevealed) {
                handleTileClick({ target: board[newRow][newCol].element });
            }
        }
    }
}

function endGame(win) {
    gameOver = true;
    clearInterval(gameInterval);
    clearInterval(nightInterval);
    showModal(win);
}

function showModal(win) {
    if (win) {
        modalTitle.textContent = "You Win!";
        modalMessage.textContent = `You found all ${panelsFound} solar panels in ${timer} seconds!`;
    } else {
        modalTitle.textContent = "Game Over!";
        modalMessage.textContent = `A shadow covered your panels. You found ${panelsFound} panels.`;
        // Reveal all shadows on loss
        board.flat().forEach(tile => {
            if (tile.isShadow && !tile.isRevealed) {
                tile.element.classList.add('revealed', 'shadow');
            }
        });
    }
    modal.style.display = 'block';
}

function resetGame() {
    clearInterval(gameInterval);
    clearInterval(nightInterval);
    gameOver = false;
    timer = 0;
    timerDisplay.textContent = timer;
    gameBoard.innerHTML = '';
    createBoard();
    startGameTimer();
}

function startGameTimer() {
    gameInterval = setInterval(() => {
        timer++;
        timerDisplay.textContent = timer;
    }, 1000);
}

// --- Event Listeners ---
resetButton.addEventListener('click', resetGame);
modalCloseButton.addEventListener('click', () => modal.style.display = 'none');

// --- Initial Game Setup ---
createBoard();
startGameTimer();
