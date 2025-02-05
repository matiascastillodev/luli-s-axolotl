import { Pet } from "./pet.js";

let mainImg = document.querySelector(".pet");
let pet;

function nameSet() {
  const modal = document.querySelector("#gameStart");
  modal.style.display = "block";
  const setNameBtn = document.querySelector("#setNameBtn");
  setNameBtn.addEventListener("click", () => {
    const nameInput = document.querySelector("#nameInput").value;
    if (nameInput) {
      document.querySelector("#nameDisplay").textContent = nameInput;
      modal.style.display = "none";
      gameStart(nameInput);
    }
  });
}

nameSet();

function gameStart(petName) {
  pet = new Pet(petName);

  setInterval(() => {
    pet.hunger = Math.max(0, pet.hunger - 1);
    updateStats();
  }, 14000);

  setInterval(() => {
    if (!pet.isSleeping) {
      pet.energy = Math.max(0, pet.energy - 1);
      pet.checkEnergy();
      updateStats();
    }
  }, 24000);

  setInterval(() => {
    pet.checkHealth();
  }, 1000);

  updateStats();
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
  pet.hunger = 7;
  pet.health = 7;
  pet.energy = 5;
  nameSet();
}

function updateStats() {
  document.querySelector("#hungerBar").innerHTML = getStatImages(
    "Hunger.webp",
    pet.hunger
  );
  document.querySelector("#healthBar").innerHTML = getStatImages(
    "Heart.webp",
    pet.health
  );
  document.querySelector("#playBar").innerHTML = getStatImages(
    "Mob_Heart.webp",
    pet.energy
  );
  if (
    (pet.energy === 0 && pet.isSleeping === false) ||
    (pet.energy > 0 && pet.energy < 5 && pet.isSleeping === true)
  ) {
    document.querySelector("#clock").src = "images/Clock_night.png";
  } else {
    document.querySelector("#clock").src = "images/Clock_day.png";
  }
}

function getStatImages(image, count) {
  return Array(count).fill(`<img src="images/${image}" alt="">`).join("");
}

const feedBtn = document.getElementById("feedBtn");
const playBtn = document.getElementById("playBtn");
const sleepBtn = document.getElementById("sleepBtn");

feedBtn.addEventListener("click", () => pet.feed());
playBtn.addEventListener("click", () => pet.play());
sleepBtn.addEventListener("click", () => {
  pet.sleep();
  toggleSleepIcon();
  disableActionsWhenAsleep();
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

function disableActionsWhenAsleep() {
  if (pet.isSleeping) {
    feedBtn.disabled = true;
    playBtn.disabled = true;
  } else {
    feedBtn.disabled = false;
    playBtn.disabled = false;
  }
}

export { updateStats, gameOver };
