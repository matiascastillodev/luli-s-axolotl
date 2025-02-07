import { Pet } from "./pet.js";

let pet;
let startTime;
let timerInterval;

function nameSet() {
  const modal = document.querySelector("#gameStart");
  const petState = JSON.parse(localStorage.getItem("petState"));

  if (petState) {
    document.querySelector("#nameDisplay").textContent = petState.name;
    gameStart(petState.name);
  } else {
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
}

nameSet();

function gameStart(petName) {
  pet = new Pet(petName);
  loadState(); //

  setInterval(() => {
    pet.hunger = Math.max(0, pet.hunger - 1);
    saveState(); //
    updateStats();
  }, 14000);

  setInterval(() => {
    if (!pet.isSleeping) {
      energy = Math.max(0, pet.energy - 1);
      saveState(); //
      updateStats();
    }
  }, 24000);

  setInterval(() => {
    checkHealth();
    saveState(); //
  }, 1000);

  updateStats();
  startTimer();
}

function startTimer() {
  if (!timerInterval) {
    startTime = pet.startTime || Date.now();
    pet.startTime = startTime;
    saveState();
    timerInterval = setInterval(updateTimer, 1000);
  }
}

function updateTimer() {
  let elapsedTime = Date.now() - startTime;

  let seconds = Math.floor((elapsedTime / 1000) % 60);
  let minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
  let hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);
  let days = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));

  document.getElementById(
    "timer"
  ).innerText = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function gameOver() {
  const modal = document.getElementById("gameOver");
  modal.style.display = "block";
  const restartBtn = document.getElementById("restartBtn");
  pet.health = 7;
  pet.hunger = 7;
  pet.energy = 5;
  restartBtn.addEventListener("click", () => {
    modal.style.display = "none";
    localStorage.removeItem("petState");
    localStorage.clear();
    window.location.reload();
    nameSet();
  });
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

let petAnimation = document.querySelector("#petAnimation");
let normalState = "images/Axolotl_Walk_Floor_Underwater.webp";
petAnimation.style.backgroundImage = `url("${normalState}")`;

let tapAudio = document.querySelector("#tapAudio");
let feedAudio = document.querySelector("#feedAudio");
let playAudio = document.querySelector("#playAudio");
let sleepAudio = document.querySelector("#sleepAudio");
let hurtAudio = document.querySelector("#hurtAudio");
let dieAudio = document.querySelector("#dieAudio");

sleepAudio.loop = true;

petAnimation.addEventListener("click", () => {
  tapAudio.addEventListener("play", () => {
    petAnimation.style.backgroundImage =
      "url('images/Axolotl_Walk_Floor.webp')";
  });
  tapAudio.addEventListener("ended", () => {
    petAnimation.style.backgroundImage = `url("${normalState}")`;
  });
  tapAudio.play();
});

feedBtn.addEventListener("click", () => {
  if (pet.hunger < pet.maxHunger && pet.hunger > 0) {
    feedAudio.addEventListener("play", () => {
      petAnimation.style.backgroundImage =
        "url('images/Axolotl_Idle_Floor.webp')";
    });
    feedAudio.addEventListener("ended", () => {
      petAnimation.style.backgroundImage = `url("${normalState}")`;
    });
    feedAudio.play();
  }
  pet.feed();
});

playBtn.addEventListener("click", () => {
  if (pet.energy > 0) {
    playAudio.addEventListener("play", () => {
      petAnimation.style.backgroundImage = "url('images/Axolotl_Swim.webp')";
    });
    playAudio.addEventListener("ended", () => {
      petAnimation.style.backgroundImage = `url("${normalState}")`;
    });
    playAudio.play();
  }
  pet.play();
});

sleepBtn.addEventListener("click", () => {
  pet.sleep();

  if (pet.isSleeping) {
    petAnimation.style.backgroundImage =
      "url('images/Axolotl_Idle_Underwater.webp')";
    sleepAudio.play();
  } else {
    sleepAudio.pause();
    sleepAudio.currentTime = 0;
    petAnimation.style.backgroundImage = `url("${normalState}")`;
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
      petAnimation.style.backgroundImage =
        "url('images/Axolotl_Walk_Floor.webp')";
    });
    hurtAudio.addEventListener("ended", () => {
      petAnimation.src = `url("${normalState}")`;
    });
    hurtAudio.play();

    updateStats();

    if (pet.health === 0) {
      dieAudio.play();
      gameOver();
      updateStats();
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

function saveState() {
  const petState = {
    name: pet.name,
    hunger: pet.hunger,
    health: pet.health,
    energy: pet.energy,
    isSleeping: pet.isSleeping,
    startTime: pet.startTime,
  };
  localStorage.setItem("petState", JSON.stringify(petState));
}

function loadState() {
  const petState = JSON.parse(localStorage.getItem("petState"));
  if (petState) {
    pet.name = petState.name;
    pet.hunger = petState.hunger;
    pet.health = petState.health;
    pet.energy = petState.energy;
    pet.isSleeping = petState.isSleeping;
    pet.startTime = petState.startTime || Date.now();
  } else {
    pet.startTime = Date.now();
  }
}

checkHealth();

export { updateStats };
