// GAME VARIABLES
let health = 1_000_000_000_000;
let points = 0;
let totalTaps = 0;

let tapPower = 1;
let skillMultiplier = 1;
let baseDamage = 1;

// UPGRADE MULTIPLIER LEVELS
const multiplierLevels = [
    2, 5, 10, 20, 50, 100,
    200, 500, 1000, 2000, 5000, 10000
];

// UPGRADE COSTS
const upgradeCosts = [
    10, 25, 60, 150, 350, 800,
    1800, 4000, 9000, 20000, 45000, 100000
];

// UPGRADE LEVEL INDEX
let skillLevel = -1;
let damageLevel = -1;
let baseDamageLevel = -1;

// GET HTML ELEMENTS
const tapButton = document.getElementById("tapButton");

const healthDisplay = document.getElementById("health");
const pointsDisplay = document.getElementById("points");
const baseDamageDisplay = document.getElementById("baseDamage");
const totalTapsDisplay = document.getElementById("totalTaps");
const tapPowerDisplay = document.getElementById("tapPower");
const skillMultiplierDisplay = document.getElementById("skillMultiplier");
// AUDIO ELEMENTS
const bgm = document.getElementById("bgm");
const tapSound = document.getElementById("tapSound");
const upgradeSound = document.getElementById("upgradeSound");
const soundToggle = document.getElementById("soundToggle");

let soundEnabled = true;

bgm.volume = 0.25;
tapSound.volume = 0.5;
upgradeSound.volume = 0.6;

// START BACKGROUND MUSIC
function startMusic() {
    if (soundEnabled && bgm.paused) {
        bgm.play().catch(() => {});
    }
}

// PLAY SOUND EFFECT
function playSFX(audio) {
    if (!soundEnabled) return;

    audio.currentTime = 0;
    audio.play().catch(() => {});
}

// SOUND TOGGLE
soundToggle.addEventListener("click", function() {

    soundEnabled = !soundEnabled;

    if (soundEnabled) {
        soundToggle.textContent = "🔊 SOUND ON";
        startMusic();
    } else {
        soundToggle.textContent = "🔇 SOUND OFF";
        bgm.pause();
    }
});
const skillUpgradeButton = document.getElementById("skillUpgradeButton");
const damageUpgradeButton = document.getElementById("damageUpgradeButton");
const baseDamageUpgradeButton = document.getElementById("baseDamageUpgradeButton");

const skillUpgradeLevel = document.getElementById("skillUpgradeLevel");
const damageUpgradeLevel = document.getElementById("damageUpgradeLevel");
const baseDamageUpgradeLevel = document.getElementById("baseDamageUpgradeLevel");

const skillUpgradeCost = document.getElementById("skillUpgradeCost");
const damageUpgradeCost = document.getElementById("damageUpgradeCost");
const baseDamageUpgradeCost = document.getElementById("baseDamageUpgradeCost");

// AUTO SAVE SYSTEM

function saveGame() {

    const saveData = {
        health: health,
        points: points,
        totalTaps: totalTaps,
        tapPower: tapPower,
        skillMultiplier: skillMultiplier,
        skillLevel: skillLevel,
        damageLevel: damageLevel,
        baseDamage: baseDamage,
        baseDamageLevel: baseDamageLevel,
    };

    localStorage.setItem("trillionTapSave", JSON.stringify(saveData));
}

function loadGame() {

    const savedData = localStorage.getItem("trillionTapSave");

    if (!savedData) return;

    try {
        const data = JSON.parse(savedData);

        health = data.health;
        points = data.points;
        totalTaps = data.totalTaps;
        tapPower = data.tapPower;
        skillMultiplier = data.skillMultiplier;
        skillLevel = data.skillLevel;
        damageLevel = data.damageLevel;
        baseDamage = data.baseDamage ?? 1;
        baseDamageLevel = data.baseDamageLevel ?? -1;

    } catch (error) {
        console.log("Save data could not be loaded.");
    }
}

// UPDATE DISPLAY
function updateDisplay() {

    healthDisplay.textContent = health.toLocaleString("en-US");
    pointsDisplay.textContent = points.toFixed(1);
    totalTapsDisplay.textContent = totalTaps.toLocaleString("en-US");

    tapPowerDisplay.textContent = "x" + tapPower.toLocaleString("en-US");
    skillMultiplierDisplay.textContent = "x" + skillMultiplier.toLocaleString("en-US");

    // SKILL MULTIPLY DISPLAY
    if (skillLevel < multiplierLevels.length - 1) {
        skillUpgradeLevel.textContent =
            "x" + skillMultiplier + " → x" +
            multiplierLevels[skillLevel + 1].toLocaleString("en-US");

        skillUpgradeCost.textContent =
            "Cost: " + upgradeCosts[skillLevel + 1].toLocaleString("en-US") + " Points";

        skillUpgradeButton.disabled =
            points < upgradeCosts[skillLevel + 1];

    } else {
        skillUpgradeLevel.textContent = "MAX LEVEL";
        skillUpgradeCost.textContent = "Maximum reached!";
        skillUpgradeButton.disabled = true;
    }

    // TAPS DAMAGE DISPLAY
    if (damageLevel < multiplierLevels.length - 1) {
        damageUpgradeLevel.textContent =
            "x" + tapPower + " → x" +
            multiplierLevels[damageLevel + 1].toLocaleString("en-US");

        damageUpgradeCost.textContent =
            "Cost: " + upgradeCosts[damageLevel + 1].toLocaleString("en-US") + " Points";

        damageUpgradeButton.disabled =
            points < upgradeCosts[damageLevel + 1];

    } else {
        damageUpgradeLevel.textContent = "MAX LEVEL";
        damageUpgradeCost.textContent = "Maximum reached!";
        damageUpgradeButton.disabled = true;
    }
    
    baseDamageDisplay.textContent = baseDamage.toLocaleString();

    // BASE DAMAGE UPGRADE DISPLAY

const nextBaseCost = upgradeCosts[baseDamageLevel + 1];

baseDamageUpgradeLevel.textContent = baseDamageLevel + 1;

if (nextBaseCost === undefined) {
    baseDamageUpgradeCost.textContent = "MAX";
    baseDamageUpgradeButton.disabled = true;
} else {
    baseDamageUpgradeCost.textContent = nextBaseCost.toLocaleString();
    baseDamageUpgradeButton.disabled = points < nextBaseCost;
}
}

// TAP FUNCTION
tapButton.addEventListener("click", function() {

    if (health <= 0) return;

    health -= baseDamage * tapPower;
    
    startMusic();
playSFX(tapSound);
    points += 0.1 * skillMultiplier;
    totalTaps++;

    if (health < 0) {
        health = 0;
    }

    updateDisplay();
saveGame();
});

// SKILL MULTIPLY UPGRADE
skillUpgradeButton.addEventListener("click", function() {

    if (skillLevel >= multiplierLevels.length - 1) return;

    const cost = upgradeCosts[skillLevel + 1];

    if (points >= cost) {

        points -= cost;
        skillLevel++;

        skillMultiplier = multiplierLevels[skillLevel];

        playSFX(upgradeSound);
        startMusic();

        updateDisplay();
saveGame();
    }
});

// TAPS DAMAGE UPGRADE
damageUpgradeButton.addEventListener("click", function() {

    if (damageLevel >= multiplierLevels.length - 1) return;

    const cost = upgradeCosts[damageLevel + 1];

    if (points >= cost) {

points -= cost;
damageLevel++;

tapPower = multiplierLevels[damageLevel];

playSFX(upgradeSound);
startMusic();

updateDisplay();
saveGame();
    }
});
// BASE DAMAGE UPGRADE
baseDamageUpgradeButton.addEventListener("click", function() {

    if (baseDamageLevel >= multiplierLevels.length - 1) return;

    const cost = upgradeCosts[baseDamageLevel + 1];

    if (points >= cost) {

        points -= cost;

        baseDamageLevel++;

        baseDamage = multiplierLevels[baseDamageLevel];

        playSFX(upgradeSound);
        startMusic();

        updateDisplay();
        saveGame();
    }

});

// INITIAL LOAD
loadGame();
updateDisplay();

// AUTO SAVE EVERY 5 SECONDS
setInterval(saveGame, 5000);

// SAVE WHEN LEAVING THE PAGE
window.addEventListener("beforeunload", saveGame);