document.addEventListener("DOMContentLoaded", () => {
    const GROWTH_FACTOR = 1.07;

    class Game {
        constructor() {
            this.newSaves = {
                clickCost: 1,
                clickLevel: 1,
                points: 0,
                income: 0,
                incomeLevel: 1,
                incomeUpgCost: 250,
                clickUpgCost: 100,
            };

            this.saves = this.loadSaves();
            this.initializeElements();
            this.updateUI();
            this.addEventListeners();
            this.startIncomeInterval();
        }

        initializeElements() {
            this.clicker = document.querySelector("#clicker");

            this.counter = document.querySelector("#counter");
            this.incomeCounter = document.querySelector("#income");

            this.menuOpenBtn = document.querySelector("#menu-open-btn");
            this.menuDialog = document.querySelector(".menu-dialog");

            this.clickUpgCostDiv = document.querySelector("#clickUpgCost");
            this.incomeUpgCostDiv = document.querySelector("#incomeUpgCost");

            this.upgradeClickBtn = document.querySelector("#upgrade-click-btn");
            this.upgradeIncomeBtn = document.querySelector("#upgrade-income-btn");
        }

        loadSaves() {
            let storedSaves = localStorage.getItem("saves");
            if (storedSaves) {
                try {
                    storedSaves = JSON.parse(storedSaves);
                } catch (e) {
                    console.error("Ошибка при парсинге JSON:", e);
                    storedSaves = {};
                }
            } else {
                storedSaves = {};
            }
            return Object.assign({}, this.newSaves, storedSaves);
        }

        saveSaves() {
            localStorage.setItem("saves", JSON.stringify(this.saves));
        }

        pointsMask(val) {
            return val
                .toString()
                .split('')
                .map((num, i, arr) => {
                    return (arr.length - 1 - i) % 3 === 0 && i !== arr.length - 1
                        ? num + ' '
                        : num;
                })
                .join('') + " fr";
        }

        updateUI() {
            this.counter.innerHTML = this.pointsMask(Math.round(this.saves.points));
            this.incomeUpgCostDiv.innerHTML = this.saves.incomeUpgCost;
            this.clickUpgCostDiv.innerHTML = this.saves.clickUpgCost;
            this.incomeCounter.innerHTML = this.saves.income + " fr/s";
        }

        addEventListeners() {
            this.upgradeClickBtn.addEventListener("click", () => this.upgradeClick());
            this.upgradeIncomeBtn.addEventListener("click", () => this.upgradeIncome());
            this.menuOpenBtn.addEventListener("click", () => this.menuDialog.showModal());
            document.addEventListener("keyup", (e) => this.handleKeyUp(e));
            this.clicker.addEventListener("click", (e) => this.handleClick(e));
        }

        handleKeyUp(e) {
            if (e.code === "Space") {
                e.preventDefault();
                this.clicker.classList.toggle("active");
                this.saves.points += this.saves.clickCost;
                setTimeout(() => {
                    this.clicker.classList.toggle("active");
                }, 100);
                this.updateUI();
                this.saveSaves();
            }
        }

        handleClick(e) {
            e.preventDefault();
            this.saves.points += this.saves.clickCost;
            this.updateUI();
            this.saveSaves();
        }

        upgradeClick() {
            if (this.saves.points >= this.saves.clickUpgCost) {
                this.saves.points -= this.saves.clickUpgCost;
                this.saves.clickCost++;
                this.saves.clickLevel++;
                this.saves.clickUpgCost = Math.round(this.saves.clickUpgCost * GROWTH_FACTOR * this.saves.clickLevel);
                this.updateUI();
                this.saveSaves();
            }
        }

        upgradeIncome() {
            if (this.saves.points >= this.saves.incomeUpgCost) {
                this.saves.points -= this.saves.incomeUpgCost;
                this.saves.income = Math.round(5 * this.saves.incomeLevel + this.saves.income * GROWTH_FACTOR);
                this.saves.incomeLevel++;
                this.saves.incomeUpgCost = Math.round(this.saves.incomeUpgCost * Math.pow(GROWTH_FACTOR, Math.round(this.saves.incomeLevel / 2)));
                this.updateUI();
                this.saveSaves();
            }
        }

        startIncomeInterval() {
            setInterval(() => {
                if (this.saves.income > 0) {
                    this.clicker.classList.toggle("active");
                    this.saves.points += this.saves.income;
                    this.updateUI();
                    this.saveSaves();
                    setTimeout(() => {
                        this.clicker.classList.toggle("active");
                    }, 200);
                }
            }, 1000);
        }
    }

    new Game();
});
