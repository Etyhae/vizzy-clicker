document.addEventListener("DOMContentLoaded", () => {
    const clicker = document.querySelector("#clicker");
    const counter = document.querySelector("#counter")
    const incomeCounter = document.querySelector("#income")
    const menuOpenBtn = document.querySelector("#menu-open-btn");
    const menuDialog = document.querySelector(".menu-dialog");

    const clickUpgCostDiv = document.querySelector("#clickUpgCost");
    const incomeUpgCostDiv = document.querySelector("#incomeUpgCost");

    const upgradeClickBtn = document.querySelector("#upgrade-click-btn");
    const upgradeIncomeBtn = document.querySelector("#upgrade-income-btn");

    const GROWTH_FACTOR = 1.07;

    const pointsMask = (val) => {
        return val
            .toString()
            .split('')
            .map((num, i, arr) => {
                return (arr.length - 1 - i) % 3 === 0 && i !== arr.length - 1
                    ? num + ' '
                    : num
            })
            .join('') + " fr"
    }

    // Инициализация saves с новыми значениями
    let newSaves = {
        clickCost: 1,
        clickLevel: 1,
        points: 0,
        income: 0,
        incomeLevel: 1,
        incomeUpgCost: 250,
        clickUpgCost: 100,
    };

    // Загрузка сохраненных данных из localStorage
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

    // Объединение новых и сохраненных данных
    let saves = Object.assign({}, newSaves, storedSaves);

    counter.innerHTML = pointsMask(Math.round(saves.points));
    incomeUpgCostDiv.innerHTML = saves.incomeUpgCost;
    clickUpgCostDiv.innerHTML = saves.clickUpgCost;
    incomeCounter.innerHTML = saves.income + " fr/s";

    // Сохранение объединенных данных обратно в localStorage
    localStorage.setItem("saves", JSON.stringify(saves));


    upgradeClickBtn.addEventListener("click", () => {
        if (saves.points >= saves.clickUpgCost) {
            saves.points -= saves.clickUpgCost;
            saves.clickCost++;
            saves.clickLevel++;
            counter.innerHTML = pointsMask(Math.round(saves.points));
            saves.clickUpgCost = Math.round(saves.clickUpgCost * Math.pow(GROWTH_FACTOR, saves.clickLevel));
            clickUpgCostDiv.innerHTML = saves.clickUpgCost;
            localStorage.setItem("saves", JSON.stringify(saves));
        }
    })
    upgradeIncomeBtn.addEventListener("click", () => {
        if (saves.points >= saves.incomeUpgCost) {
            saves.points -= saves.incomeUpgCost;
            saves.income = Math.round(5 + saves.income * GROWTH_FACTOR);
            saves.incomeLevel++;
            counter.innerHTML = pointsMask(Math.round(saves.points));
            incomeCounter.innerHTML = saves.income + " fr/s";
            saves.incomeUpgCost = Math.round(saves.incomeUpgCost * Math.pow(GROWTH_FACTOR, saves.incomeLevel));
            incomeUpgCostDiv.innerHTML = saves.incomeUpgCost;
            localStorage.setItem("saves", JSON.stringify(saves));
        }
    })

    menuOpenBtn.addEventListener("click", (e) => {
        menuDialog.showModal();
    })

    document.addEventListener("keyup", (e) => {
        if (e.code === "Space") {
            e.preventDefault();
            saves.points += saves.clickCost;
            counter.innerHTML = pointsMask(Math.round(saves.points));
            localStorage.setItem("saves", JSON.stringify(saves));
        }
    });

    clicker.addEventListener("click", (e) => {
        e.preventDefault();
        saves.points += saves.clickCost;
        counter.innerHTML = pointsMask(Math.round(saves.points));
        localStorage.setItem("saves", JSON.stringify(saves));
    })

    setInterval(() => {
        if (saves.income > 0) {
            clicker.classList.toggle("active");
            saves.points += saves.income;
            counter.innerHTML = pointsMask(Math.round(saves.points));
            localStorage.setItem("saves", JSON.stringify(saves));
            setTimeout(() => {
                clicker.classList.toggle("active");
            }, 200)
        }
    }, 1000)
})