let secretWord = words[Math.floor(Math.random() * words.length)];
let attempts = 0;

const input = document.getElementById("guess-input");
const button = document.getElementById("submit-button");
const board = document.getElementById("board");
const message = document.getElementById("message");

for (let i = 0; i < 30; i++) {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  board.appendChild(cell);
}

button.addEventListener("click", function () {
  const guess = input.value.toLowerCase();

  if (guess.length != 5) {
    message.textContent = "Please enter a 5-letter word.";
    return;
  }
  message.textContent = "";

  const cells = document.querySelectorAll(".cell");
  for (let i = 0; i < 5; i++) {
    const cell = cells[attempts * 5 + i];
    cell.textContent = guess[i];

    if (guess[i] == secretWord[i]) {
      cell.classList.add("correct");
    } else if (secretWord.includes(guess[i])) {
      cell.classList.add("present");
    } else {
      cell.classList.add("absent");
    }
  }

  attempts = attempts + 1;
  input.value = "";

  if (guess == secretWord) {
    message.textContent = "Congratulations! You guessed the word!";
    input.disabled = true;
    button.disabled = true;
  } else if (attempts == 6) {
    message.textContent = 'Game over, the word was "' + secretWord + '"';
    input.disabled = true;
    button.disabled = true;
  }
});
