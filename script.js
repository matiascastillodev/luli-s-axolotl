import { Pet } from "./pet.js";

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
      updateStats();
    }
  }, 24000);

  setInterval(() => {
    checkHealth();
  }, 1000);

  updateStats();
  startTimer();
}

function gameOver() {
  const modal = document.getElementById("gameOver");
  modal.style.display = "block";
  pet.hunger = 7;
  pet.health = 7;
  pet.energy = 5;
  const restartBtn = document.getElementById("restartBtn");
  restartBtn.addEventListener("click", () => {
    modal.style.display = "none";
    nameSet();
  });
}

// ----- GUI ----- //

// let startTime;
// let timerInterval;

// function startTimer() {
//   if (!timerInterval) {
//     startTime = Date.now();
//     timerInterval = setInterval(updateTimer, 1000);
//   }
// }

// function updateTimer() {
//   let elapsedTime = Date.now() - startTime;

//   let seconds = Math.floor((elapsedTime / 1000) % 60);
//   let minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
//   let hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);
//   let days = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));

//   document.getElementById(
//     "timer"
//   ).innerText = `${days}d ${hours}h ${minutes}m ${seconds}s`;
// }

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

let petAnimation = document.querySelector(".petAnimation");
let normalState = "images/Axolotl_Walk_Floor_Underwater.webp";
petAnimation.src = normalState;

let tapAudio = new Audio("audios/Axolotl_idle_air1.ogg");
let feedAudio = new Audio("audios/Axolotl_attack1.ogg");
let playAudio = new Audio("audios/Dolphin_swim1.ogg");
let sleepAudio = new Audio("audios/Axolotl_idle1.ogg");
let hurtAudio = new Audio("audios/Axolotl_hurt1.ogg");
let dieAudio = new Audio("audios/Axolotl_death1.ogg");
sleepAudio.loop = true;

petAnimation.addEventListener("click", () => {
  tapAudio.addEventListener("play", () => {
    petAnimation.src = "images/Axolotl_Walk_Floor.webp";
  });
  tapAudio.addEventListener("ended", () => {
    petAnimation.src = normalState;
  });
  tapAudio.play();
});

feedBtn.addEventListener("click", () => {
  if (pet.hunger < pet.maxHunger && pet.hunger > 0) {
    feedAudio.addEventListener("play", () => {
      petAnimation.src = "images/Axolotl_Idle_Floor.webp";
    });
    feedAudio.addEventListener("ended", () => {
      petAnimation.src = normalState;
    });
    feedAudio.play();
  }
  pet.feed();
});

playBtn.addEventListener("click", () => {
  if (pet.energy > 0) {
    playAudio.addEventListener("play", () => {
      petAnimation.src = "images/Axolotl_Swim.webp";
    });
    playAudio.addEventListener("ended", () => {
      petAnimation.src = normalState;
    });
    playAudio.play();
  }
  pet.play();
});

sleepBtn.addEventListener("click", () => {
  pet.sleep();

  if (pet.isSleeping) {
    petAnimation.src = "images/Axolotl_Idle_Underwater.webp";
    sleepAudio.play();
  } else {
    sleepAudio.pause();
    sleepAudio.currentTime = 0;
    petAnimation.src = normalState;
  }
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
  } else {
    sleepIcon.src = image1;
    statusText.textContent = "WAKE";
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

function checkHealth() {
  if (
    pet.hunger === 0 ||
    (pet.energy === 0 && !pet.isSleeping) ||
    pet.energy === pet.maxEnergy
  ) {
    pet.health = Math.max(0, pet.health - 1);

    hurtAudio.addEventListener("play", () => {
      petAnimation.src = "images/Axolotl_Walk_Floor.webp";
    });
    hurtAudio.addEventListener("ended", () => {
      petAnimation.src = normalState;
    });
    hurtAudio.play();

    updateStats();
    if (pet.health === 0) {
      dieAudio.play();
      gameOver();
    }
  }

  if (pet.hunger === pet.maxHunger && pet.energy > 0) {
    if (!pet.healthIncreaseInterval) {
      pet.healthIncreaseInterval = setInterval(() => {
        if (pet.health < 7) {
          pet.health = Math.min(7, pet.health + 1);
          updateStats();
        } else {
          clearInterval(pet.healthIncreaseInterval);
          pet.healthIncreaseInterval = null;
        }
      }, 1000);
    }
  } else {
    if (pet.healthIncreaseInterval) {
      clearInterval(pet.healthIncreaseInterval);
      pet.healthIncreaseInterval = null;
    }
  }
}

checkHealth();

export { updateStats };
