import { updateStats, gameOver } from "./script.js";

class Pet {
  constructor(name) {
    this.name = name;
    this.hunger = 7;
    this.maxHunger = 7;
    this.health = 7;
    this.maxHealth = 7;
    this.energy = 5;
    this.maxEnergy = 7;
    this.isSleeping = false;
    this.healthIncreaseInterval = null;
  }
  checkHealth() {
    if (
      this.hunger === 0 ||
      (this.energy === 0 && !this.isSleeping) ||
      this.energy === this.maxEnergy
    ) {
      this.health = Math.max(0, this.health - 1);
      updateStats();
      if (this.health === 0) {
        gameOver();
      }
    }

    if (this.hunger === this.maxHunger && this.energy > 0) {
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

  feed() {
    if (this.isSleeping) {
      return;
    } else {
      this.hunger = Math.min(7, this.hunger + 1);
      updateStats();
    }
  }

  sleep() {
    if (this.isSleeping) {
      this.isSleeping = false;
      clearInterval(this.sleepInterval);
    } else {
      this.isSleeping = true;
      console.log("Pet is sleeping.");
      this.sleepInterval = setInterval(() => {
        if (this.energy < this.maxEnergy) {
          this.energy++;
          updateStats();
        } else {
          clearInterval(this.sleepInterval);
          updateStats();
        }
      }, 1000);
    }
  }

  play() {
    if (this.isSleeping) {
      return;
    } else {
      this.energy = Math.max(0, this.energy - 1);
      updateStats();
    }
  }
}

export { Pet };
