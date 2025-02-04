import { Pet } from "./pet.js";

let pet;
let mainImg = document.querySelector(".pet");

const feedBtn = document.getElementById("feedBtn");
const playBtn = document.getElementById("playBtn");
const sleepBtn = document.getElementById("sleepBtn");

feedBtn.addEventListener("click", () => pet.feed());
playBtn.addEventListener("click", () => pet.play());
sleepBtn.addEventListener("click", () => {
  pet.sleep();
  toggleSleepIcon();
  updateButtonsState();
});

function toggleSleepIcon() {
  let sleepIcon = document.getElementById("sleepIcon");
  let statusText = document.getElementById("statusText");
  let currentSrc = sleepIcon.src;

  let image1 = "images/Bucket_of_Axolotl_JE1_BE1.webp";
  let image2 = "images/Water_Bucket_JE2_BE2.webp";

  if (currentSrc.includes(image1)) {
    sleepIcon.src = image2;
    statusText.textContent = "SLEEP";
    mainImg.src = "images/Axolotl_Walk_Floor_Underwater.webp";
  } else {
    sleepIcon.src = image1;
    statusText.textContent = "WAKE";
    mainImg.src = "images/Axolotl_Idle_Floor_Underwater.webp";
  }
}

function updateStats() {
  document.getElementById("hungerBar").innerHTML = getStatImages(
    "Hunger.webp",
    pet.hunger
  );
  document.getElementById("healthBar").innerHTML = getStatImages(
    "Heart.webp",
    pet.health
  );
  document.getElementById("playBar").innerHTML = getStatImages(
    "Mob_Heart.webp",
    pet.energy
  );
}

function getStatImages(image, count) {
  return Array(count).fill(`<img src="images/${image}" alt="">`).join("");
}

function updateButtonsState() {
  if (pet.isSleeping) {
    feedBtn.disabled = true;
    playBtn.disabled = true;
  } else {
    feedBtn.disabled = false;
    playBtn.disabled = false;
  }
}

function gameOver() {
  const modal = document.getElementById("gameOver");
  modal.style.display = "block";

  const restartBtn = document.getElementById("restartBtn");
  restartBtn.onclick = function () {
    modal.style.display = "none";
    resetGame();
  };
}

function resetGame() {
  pet.hunger = 5;
  pet.health = 7;
  pet.energy = 5;
  pet.isSleeping = false;
  pet.healthIncreaseInterval = null;
  pet.gameOver = false;
  gameStart();
}

function gameStart() {
  const modal = document.getElementById("gameStart");
  modal.style.display = "block";

  const setNameBtn = document.getElementById("setNameBtn");
  setNameBtn.onclick = function () {
    const petNameInput = document.getElementById("petNameInput").value;
    if (petNameInput) {
      document.getElementById("petName").textContent = petNameInput;
      modal.style.display = "none";
      startGame(petNameInput);
    }
  };
}

function startGame(petName) {
  pet = new Pet(petName);
  updateStats();
}

gameStart();

export { updateStats, gameOver };
