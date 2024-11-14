// Constants for game settings
const MAX_ROLLS = 10;

let player1Score = 0;
let player2Score = 0;
let player1Rolls = [];
let player2Rolls = [];
let currentPlayer = 1; // 1 for player 1, 2 for player 2 or computer
let rollCount = 0;
let gameMode = ''; // 'multiplayer' or 'computer'

// Function to select the game mode
function selectMode(mode) {
    gameMode = mode;
    document.querySelector(".mode-selection").classList.add("hidden");
    document.querySelector(".input-section").classList.remove("hidden");

    // Show or hide player 2's name input based on game mode
    document.getElementById("player2Name").classList.toggle("hidden", gameMode === 'computer');
}

// Function to start the game after names are entered
function startGame() {
    const player1Name = getPlayerName("player1Name");
    const player2Name = gameMode === 'computer' ? "Computer" : getPlayerName("player2Name");

    if (!player1Name || (gameMode === 'multiplayer' && !player2Name)) {
        showAlert("Please enter valid player names.");
        return;
    }

    setPlayerHeaders(player1Name, player2Name);
    initializeGameUI(player1Name);

    // Show the refresh button once the game starts
    document.getElementById("refreshButton").classList.remove("hidden");

    document.getElementById("turnMessage").textContent = `It's ${player1Name}'s turn to roll.`;
}

// Roll dice functionality for both players and computer
function rollDice() {
    if (rollCount >= MAX_ROLLS) return displayFinalMessage(); // End game if max rolls reached

    const roll = generateRandomRoll();
    updateDiceImage(roll);
    playRollSound();

    currentPlayer === 1 ? handlePlayerRoll(roll) : handleComputerOrPlayer2Roll(roll);
}

// Generate a random roll between 1 and 6
function generateRandomRoll() {
    return Math.floor(Math.random() * 6) + 1;
}

// Function to handle player roll and switch turn
function handlePlayerRoll(roll) {
    player1Rolls.push(roll);
    player1Score += roll;
    updateScoreTable(player1Rolls.length, roll, 1);
    updatePlayerScoreDisplay(1, player1Score);

    currentPlayer = 2;
    rollCount++;

    if (gameMode === 'computer') {
        setTimeout(computerRoll, 1000);
    } else {
        updateTurnMessage("player2Name");
    }
}

// Function for computer's roll (if in computer mode)
function computerRoll() {
    if (rollCount >= MAX_ROLLS) return displayFinalMessage(); // End game if max rolls reached

    const roll = generateRandomRoll();
    handleComputerOrPlayer2Roll(roll);
}

// Common function for handling computer or player 2's roll
function handleComputerOrPlayer2Roll(roll) {
    player2Rolls.push(roll);
    player2Score += roll;
    updateScoreTable(player2Rolls.length, roll, 2);
    updatePlayerScoreDisplay(2, player2Score);

    currentPlayer = 1;
    rollCount++;

    if (rollCount >= MAX_ROLLS) displayFinalMessage();
    else updateTurnMessage("player1Name");
}

// Helper function to add roll scores to the table
function updateScoreTable(rollNumber, rollScore, player) {
    const tableBody = document.getElementById("scoreTableBody");
    let row = tableBody.querySelector(`tr[data-roll='${rollNumber}']`);
    if (!row) {
        row = document.createElement("tr");
        row.setAttribute("data-roll", rollNumber);
        row.innerHTML = `<td>${rollNumber}</td><td></td><td></td>`;
        tableBody.appendChild(row);
    }
    row.children[player].textContent = rollScore;
}

// Display final result when game ends
function displayFinalMessage() {
    const player1Name = getPlayerName("player1Name") || "Player 1";
    const player2Name = gameMode === 'computer' ? "Computer" : getPlayerName("player2Name");

    let message;
    if (player1Score > player2Score) {
        message = `${player1Name} wins!`;
        document.getElementById("player1Total").classList.add("winner");
    } else if (player2Score > player1Score) {
        message = `${player2Name} wins!`;
        document.getElementById("player2Total").classList.add("winner");
    } else {
        message = "It's a tie!";
    }

    document.getElementById("finalMessage").textContent = message;
    document.getElementById("turnMessage").classList.add("hidden");
}

// Function to update player headers
function setPlayerHeaders(player1Name, player2Name) {
    document.getElementById("player1Header").textContent = player1Name;
    document.getElementById("player2Header").textContent = player2Name;
}

// Function to initialize game UI
function initializeGameUI(player1Name) {
    document.querySelector(".input-section").classList.add("hidden");
    document.querySelector(".dice-section").classList.remove("hidden");
    document.querySelector(".score-table").classList.remove("hidden");
    updateTurnMessage("player1Name");
}

// Helper functions
function getPlayerName(id) {
    return document.getElementById(id).value.trim();
}

function updateTurnMessage(playerId) {
    const playerName = document.getElementById(playerId).value.trim();
    document.getElementById("turnMessage").textContent = `It's ${playerName}'s turn to roll.`;
}

function updatePlayerScoreDisplay(player, score) {
    document.getElementById(`player${player}Total`).textContent = score;
}

function updateDiceImage(roll) {
    document.getElementById("diceImage").src = `dice${roll}.png`;
}

function playRollSound() {
    document.getElementById("rollSound").play();
}

// Reset game
function resetGame() {
    location.reload();
}