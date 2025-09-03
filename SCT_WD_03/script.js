let boardState = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameOver = false;
let playAgainstComputer = false;

const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]            // Diagonals
];

const statusDisplay = document.getElementById('status');
const cells = document.querySelectorAll('.cell');
const restartBtn = document.getElementById('restart-btn');
const modeBtn = document.getElementById('mode-btn');

function handleCellClick(e) {
    const cell = e.target;
    const index = parseInt(cell.getAttribute('data-index'));

    if (boardState[index] !== '' || isGameOver) {
        return;
    }

    boardState[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());

    if (checkWinner()) {
        statusDisplay.textContent = `${currentPlayer} wins!`;
        isGameOver = true;
        return;
    }

    if (!boardState.includes('')) {
        statusDisplay.textContent = `It's a draw!`;
        isGameOver = true;
        return;
    }

    switchPlayer();

    if (playAgainstComputer && currentPlayer === 'O' && !isGameOver) {
        computerMove();
    }
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
}

function checkWinner() {
    for (const condition of winConditions) {
        const [a, b, c] = condition;
        if (boardState[a] !== '' && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            return true;
        }
    }
    return false;
}

function restartGame() {
    boardState = ['', '', '', '', '', '', '', '', ''];
    isGameOver = false;
    currentPlayer = 'X';
    statusDisplay.textContent = `Player X's turn`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
}

function toggleMode() {
    playAgainstComputer = !playAgainstComputer;
    modeBtn.textContent = playAgainstComputer ? 'Play against Player' : 'Play against Computer';
    restartGame();
}

function computerMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
        if (boardState[i] === '') {
            boardState[i] = 'O';
            let score = minimax(boardState, 0, false);
            boardState[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    handleComputerMove(move);
}

function minimax(board, depth, isMaximizing) {
    const scores = { 'X': -1, 'O': 1, 'draw': 0 };

    if (checkWinnerState(board, 'O')) { return scores['O']; }
    if (checkWinnerState(board, 'X')) { return scores['X']; }
    if (!board.includes('')) { return scores['draw']; }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                bestScore = Math.max(bestScore, minimax(board, depth + 1, false));
                board[i] = '';
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                bestScore = Math.min(bestScore, minimax(board, depth + 1, true));
                board[i] = '';
            }
        }
        return bestScore;
    }
}

function checkWinnerState(board, player) {
    for (const condition of winConditions) {
        const [a, b, c] = condition;
        if (board[a] === player && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}

function handleComputerMove(index) {
    boardState[index] = 'O';
    const cell = cells[index];
    cell.textContent = 'O';
    cell.classList.add('o');

    if (checkWinner()) {
        statusDisplay.textContent = `O wins!`;
        isGameOver = true;
        return;
    }

    if (!boardState.includes('')) {
        statusDisplay.textContent = `It's a draw!`;
        isGameOver = true;
        return;
    }

    switchPlayer();
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);
modeBtn.addEventListener('click', toggleMode);