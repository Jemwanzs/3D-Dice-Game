let player1Score = 0;
let player2Score = 0;
let player1Rolls = [];
let player2Rolls = [];
let currentPlayer = 1;
let rollCount = 0;

function rollDice() {
    const player1Name = document.getElementById("player1Name").value.trim();
    const player2Name = document.getElementById("player2Name").value.trim();

    // Check if both names are entered
    if (!player1Name || !player2Name) {
        document.getElementById("alertMessage").classList.remove("hidden");
        return;
    } else {
        document.getElementById("alertMessage").classList.add("hidden");
    }

    // Set player names in headers if not already set
    document.getElementById("player1Header").textContent = player1Name;
    document.getElementById("player2Header").textContent = player2Name;

    // If maximum rolls reached, show game over message
    if (rollCount >= 10) {
        document.getElementById("turnMessage").classList.add("hidden");
        document.getElementById("finalMessage").textContent = "Game over! Refresh to play again.";
        return;
    }

    // Play roll sound
    const rollSound = document.getElementById("rollSound");
    rollSound.play();

    // Generate a random number between 1 and 6
    const roll = Math.floor(Math.random() * 6) + 1;

    // Update the dice image without removing it from the DOM
    const diceImage = document.getElementById("diceImage");
    diceImage.src = `dice${roll}.png`; // Make sure images dice1.png to dice6.png exist

    if (currentPlayer === 1) {
        player1Rolls.push(roll);
        player1Score += roll;
        addScoreToTable(player1Rolls.length, roll, 1);
    } else {
        player2Rolls.push(roll);
        player2Score += roll;
        addScoreToTable(player2Rolls.length, roll, 2);
    }

    document.getElementById("player1Total").textContent = player1Score;
    document.getElementById("player2Total").textContent = player2Score;

    rollCount++;

    // Check if game is over after this roll
    if (rollCount >= 10) {
        displayFinalMessage();
    } else {
        // Update turn message to show whose turn is next
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        document.getElementById("turnMessage").textContent = `It's ${currentPlayer === 1 ? player1Name : player2Name}'s turn to roll.`;
    }
}

function addScoreToTable(rollNumber, rollScore, player) {
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

function displayFinalMessage() {
    const player1Name = document.getElementById("player1Name").value || "Player 1";
    const player2Name = document.getElementById("player2Name").value || "Player 2";
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
    document.getElementById("turnMessage").classList.add("hidden"); // Hide turn message at game end
}

function resetGame() {
    location.reload();
}