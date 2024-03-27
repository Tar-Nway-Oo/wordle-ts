import targetWords from "./targetWords.json";
import dictionary from "./dictionary.json"

const alertContainer = document.querySelector("[data-alert-container]") as HTMLDivElement;
const tileContainer = document.querySelector("[data-tile-container]") as HTMLDivElement;
const keyboard = document.querySelector("[data-keyboard]") as HTMLDivElement;

const wordLength = 5;
const targetWord = targetWords[Math.floor(Math.random() * targetWords.length)];
console.log(targetWord)
startGame();

function startGame() {
  document.addEventListener("click", handleMouseClick);
  document.addEventListener("keydown", handleKeyPress);
}

function stopGame() {
  document.removeEventListener("click", handleMouseClick);
  document.removeEventListener("keydown", handleKeyPress);
}

function handleMouseClick(e: Event) {
  const target = e.target as HTMLButtonElement;

  if (target.matches("[data-key]")) {
    pressKey(target.dataset.key);
  }

  if (target.matches("[data-enter]")) {
    submitGuess();
  }

  if (target.matches("[data-delete]")) {
    deleteKey();
  }
}

function handleKeyPress(e: KeyboardEvent) {
  const key = e.key;

  if (key.match(/^[a-z]$/)) {
    pressKey(key);
  }

  if (key === "Enter") {
    submitGuess();
  }

  if (key === "Backspace" || key === "Delete") {
    deleteKey();
  }
}

function pressKey(key: string | undefined) {
  if (key == undefined) return;
  const activeTiles = getActiveTiles();
  if (activeTiles.length >= wordLength) return;
  const nextTile = tileContainer.querySelector(":not([data-letter])") as HTMLDivElement;
  nextTile.textContent = key.toUpperCase();
  nextTile.dataset.state = "active";
  nextTile.dataset.letter = key;
}

function submitGuess() {
  const activeTiles = [...getActiveTiles()];
  if (activeTiles.length < wordLength) {
    showAlert("Not Enough Word!", 1000);
    shakeTiles(activeTiles);
    return;
  }
  const guessWord = activeTiles.reduce((word, tile) => {
    return word + tile.dataset.letter
  }, "");
  if (!dictionary.includes(guessWord)) {
    showAlert("Not In Word List!", 1000);
    shakeTiles(activeTiles);
    return;
  }
  stopGame();
  activeTiles.forEach((tile, index, array) => flipTile(tile, index, array, guessWord));
}

function deleteKey() {
  const activeTiles = getActiveTiles();
  const lastTile = activeTiles[activeTiles.length - 1];
  if (lastTile == null) return;
  lastTile.textContent = "";
  delete lastTile.dataset.state;
  delete lastTile.dataset.letter;
}

function flipTile(tile: HTMLDivElement, index: number, array: HTMLDivElement[], guessWord: string) {
  const letter = tile.dataset.letter;
  if (letter == undefined) return;
  const key = keyboard.querySelector(`[data-key="${letter}"i]`) as HTMLButtonElement;
  setTimeout(() => {
    tile.classList.add("flip");
  }, index * 500 / 2);

  tile.addEventListener("transitionend", () => {
    tile.classList.remove("flip");
    if (targetWord[index] === letter) {
      tile.dataset.state = "correct";
      key.classList.add("correct");
    } else if (targetWord.includes(letter)) {
      tile.dataset.state = "wrong-location";
      key.classList.add("wrong-location");
    } else {
      tile.dataset.state = "incorrect";
      key.classList.add("incorrect");
    }

    if (index === array.length - 1) {
      tile.addEventListener("transitionend", () => {
        startGame();
        checkWinOrLose(array, guessWord);
      });
    }
  });

}

function checkWinOrLose(tiles: HTMLDivElement[], guessWord: string) {
  if (guessWord === targetWord) {
    showAlert("You Win!", 5000);
    danceTiles(tiles);
    stopGame();
    return;
  }
  const emptyTiles = tileContainer.querySelectorAll(":not([data-letter])");
  if (emptyTiles.length === 0) {
    showAlert(targetWord.toUpperCase(), 5000);
    stopGame();
  }
}

function getActiveTiles() {
  return tileContainer.querySelectorAll('[data-state="active"]') as NodeListOf<HTMLDivElement>;
}

function showAlert(message: string, duration: number) {
  const alert = document.createElement("div");
  alert.textContent = message;
  alert.classList.add("alert");
  alertContainer.prepend(alert);
  setTimeout(() => {
    alert.classList.add("hide");
    alert.addEventListener("transitionend", () => {
      alert.remove();
    });
  }, duration);
}

function shakeTiles(tiles:  HTMLDivElement[]) {
  if (tiles.length === 0) return;
  tiles.forEach(tile => {
      tile.classList.add("shake");
      tile.addEventListener("animationend", () => {
        tile.classList.remove("shake");
      }, {once: true});
  });
}

function danceTiles(tiles:  HTMLDivElement[]) {
  tiles.forEach((tile, index) => {
     setTimeout(() => {
        tile.classList.add("dance");
        tile.addEventListener("animationend", () => {
          tile.classList.remove("dance");
        }, {once: true});
     }, index * 300 / 2);    
  });
}