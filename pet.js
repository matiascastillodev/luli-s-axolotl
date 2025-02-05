import { updateStats } from "./script.js";

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
