import targetWords from "./targetWords.json";
import dictionary from "./dictionary.json"

const alertContainer = document.querySelector("[data-alert-container]") as HTMLDivElement;
const tileContainer = document.querySelector("[data-tile-container]") as HTMLDivElement;
const keyboard = document.querySelector("[data-keyboard]") as HTMLDivElement;

const wordLength = 5;
const targetWord = targetWords[Math.floor(Math.random() * targetWords.length)];
