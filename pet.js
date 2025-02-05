import { updateStats, gameOver } from "./script.js";

class Pet {
  constructor(name) {
    this.name = name;
    this.hunger = 7;
    this.health = 7;
    this.energy = 5;
    this.isSleeping = false;
    this.healthIncreaseInterval = null;
    this.gameOver = false;

    this.startGameLoop();
  }

  startGameLoop() {
    setInterval(() => {
      this.hunger = Math.max(0, this.hunger - 1);
      updateStats();
    }, 14000);

    setInterval(() => {
      if (!this.isSleeping) {
        this.energy = Math.max(0, this.energy - 1);
        this.checkEnergy();
        updateStats();
      }
    }, 24000);

    setInterval(() => {
      this.checkHealth();
    }, 1000);
  }

  checkHealth() {
    if (
      this.hunger === 0 ||
      (this.energy === 0 && !this.isSleeping) ||
      this.energy === 7
    ) {
      this.health = Math.max(0, this.health - 1);
      updateStats();
      if (this.health === 0) {
        this.gameOver = true;
        clearInterval(this.hungerInterval);
        clearInterval(this.energyInterval);
        clearInterval(this.healthInterval);
        gameOver();
      }
    }

    if (this.hunger === 7 && this.energy > 0) {
      if (!this.healthIncreaseInterval) {
        this.healthIncreaseInterval = setInterval(() => {
          if (this.health < 7) {
            this.health = Math.min(7, this.health + 1);
            updateStats();
          } else {
            clearInterval(this.healthIncreaseInterval);
            this.healthIncreaseInterval = null;
          }
        }, 1000);
      }
    } else {
      if (this.healthIncreaseInterval) {
        clearInterval(this.healthIncreaseInterval);
        this.healthIncreaseInterval = null;
      }
    }
  }

  checkEnergy() {
    if (this.energy === 0) {
      console.log("Pet needs to sleep.");
    } else if (this.energy === 7) {
      console.log("Pet needs to play.");
    }
  }

  feed() {
    if (this.isSleeping) {
      console.log("Pet is sleeping.");
      return;
    } else if (!this.isSleeping) {
      this.hunger = Math.min(7, this.hunger + 1);
      updateStats();
    }
  }

  play() {
    console.log(this.isSleeping);
    if (this.isSleeping) {
      console.log("Pet is sleeping.");
      return;
    } else {
      this.energy = Math.max(0, this.energy - 1);
      updateStats();
    }
  }

  sleep() {
    if (this.isSleeping) {
      this.isSleeping = false;
      clearInterval(this.sleepInterval);
      console.log("Pet has woken up.");
    } else {
      this.isSleeping = true;
      console.log("Pet is sleeping.");
      this.sleepInterval = setInterval(() => {
        if (this.energy < 7) {
          this.energy++;
          this.checkEnergy();
          updateStats();
        } else {
          clearInterval(this.sleepInterval);
          console.log("Pet is fully rested.");
          updateStats();
        }
      }, 1000);
    }
  }
}

export { Pet };
