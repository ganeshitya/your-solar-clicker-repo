// --- Game State Variables ---
let energy = 0;
let energyPerClick = 1;
let energyPerSecond = 0;

// Upgrade costs and effects
const upgrades = {
    smallPanel: {
        cost: 10,
        eps: 1,
        owned: 0
    },
    battery: {
        cost: 100,
        eps: 5,
        owned: 0
    }
};

// --- DOM Elements ---
const energyDisplay = document.getElementById('energy-display');
const epsDisplay = document.getElementById('eps-display');
const mainPanelButton = document.getElementById('main-panel-button');

const buySmallPanelBtn = document.getElementById('buy-small-panel');
const smallPanelCostDisplay = document.getElementById('small-panel-cost');

const buyBatteryBtn = document.getElementById('buy-battery');
const batteryCostDisplay = document.getElementById('battery-cost');

// --- Game Functions ---

// Function to update the display
function updateDisplay() {
    energyDisplay.textContent = Math.floor(energy);
    epsDisplay.textContent = energyPerSecond;
}

// Function to handle the main click
function generateEnergy() {
    energy += energyPerClick;
    updateDisplay();
}

// Function to buy an upgrade
function buyUpgrade(upgrade) {
    if (energy >= upgrade.cost) {
        energy -= upgrade.cost;
        energyPerSecond += upgrade.eps;
        upgrade.owned++;
        upgrade.cost = Math.floor(upgrade.cost * 1.5); // Increase cost
        
        updateDisplay();
        updateUpgradeButtons();
    }
}

// Function to check if upgrades can be afforded
function updateUpgradeButtons() {
    // Check Small Panel button
    if (energy >= upgrades.smallPanel.cost) {
        buySmallPanelBtn.disabled = false;
        smallPanelCostDisplay.textContent = upgrades.smallPanel.cost;
    } else {
        buySmallPanelBtn.disabled = true;
    }

    // Check Battery button
    if (energy >= upgrades.battery.cost) {
        buyBatteryBtn.disabled = false;
        batteryCostDisplay.textContent = upgrades.battery.cost;
    } else {
        buyBatteryBtn.disabled = true;
    }
}

// Automatic energy generation every second
function autoGenerateEnergy() {
    energy += energyPerSecond;
    updateDisplay();
    updateUpgradeButtons(); // Continuously check button availability
}

// --- Event Listeners ---
mainPanelButton.addEventListener('click', generateEnergy);
buySmallPanelBtn.addEventListener('click', () => buyUpgrade(upgrades.smallPanel));
buyBatteryBtn.addEventListener('click', () => buyUpgrade(upgrades.battery));

// --- Game Initialization ---
// Start the automatic energy generation loop
setInterval(autoGenerateEnergy, 1000); 

// Initial update of the UI
updateDisplay();
updateUpgradeButtons();
