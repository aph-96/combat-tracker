// Select elements
const nameInput = document.getElementById("nameInput");
const initiativeInput = document.getElementById("initiativeInput");
const addButton = document.getElementById("addButton");
const initiativeList = document.getElementById("initiativeList");

// Array to hold character data
let characters = [];

// Add character to the list
addButton.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const initiative = parseInt(initiativeInput.value, 10);

  if (!name || isNaN(initiative)) {
    alert("Please provide both a name and an initiative value.");
    return;
  }

  // Check if the character already exists
  const existingCharacter = characters.find((char) => char.name === name);
  if (existingCharacter) {
    // Update initiative for an existing character
    existingCharacter.initiative = initiative;
  } else {
    // Add a new character
    characters.push({ name, initiative });
  }

  // Clear inputs
  nameInput.value = "";
  initiativeInput.value = "";

  // Sort and display characters
  updateInitiativeList();
});

// Update and render the initiative list
function updateInitiativeList() {
  // Sort characters by initiative (descending)
  characters.sort((a, b) => b.initiative - a.initiative);

  // Clear the list
  initiativeList.innerHTML = "";

  // Add sorted characters to the list
  characters.forEach((char, index) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <span>${char.name} (${char.initiative})</span>
      <button onclick="removeCharacter(${index})">Remove</button>
    `;
    initiativeList.appendChild(listItem);
  });
}

// Remove a character from the list
function removeCharacter(index) {
  characters.splice(index, 1);
  updateInitiativeList();
}

// Add a new health point card
document.getElementById("add-hp-card").addEventListener("click", () => {
  const container = document.getElementById("hp-cards");

  const card = document.createElement("div");
  card.className = "card";

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.placeholder = "Player Name";

  const hpInput = document.createElement("input");
  hpInput.type = "number";
  hpInput.placeholder = "Max HP";

  const addButton = document.createElement("button");
  addButton.textContent = "Set HP";
  addButton.addEventListener("click", () => {
    const name = nameInput.value;
    const maxHp = parseInt(hpInput.value, 10);

    if (name && !isNaN(maxHp)) {
      card.innerHTML = ""; // Clear initial inputs
      createHealthCard(card, name, maxHp);
    }
  });

  card.appendChild(nameInput);
  card.appendChild(hpInput);
  card.appendChild(addButton);

  container.appendChild(card);
});

// Updated function: Create a health tracker card with all controls
function createHealthCard(card, name, maxHp) {
  card.dataset.maxHp = maxHp;
  card.dataset.currentHp = maxHp;

  const nameLabel = document.createElement("h4");
  nameLabel.textContent = name;

  const hpLabel = document.createElement("span");
  hpLabel.textContent = `HP: ${maxHp}/${maxHp}`;
  hpLabel.className = "hp-label";

  const adjustContainer = document.createElement("div");
  adjustContainer.style.marginTop = "10px";

  const decrementButton = document.createElement("button");
  decrementButton.textContent = "-";
  decrementButton.className = "damage";
  decrementButton.addEventListener("click", () =>
    updateHP(card, -parseInt(hpInput.value || 1, 10))
  );

  const incrementButton = document.createElement("button");
  incrementButton.textContent = "+";
  incrementButton.className = "heal";
  incrementButton.addEventListener("click", () =>
    updateHP(card, parseInt(hpInput.value || 1, 10))
  );

  const hpInput = document.createElement("input");
  hpInput.type = "number";
  hpInput.value = 1;
  hpInput.min = 1;
  hpInput.style.width = "50px";
  hpInput.style.textAlign = "center";

  adjustContainer.appendChild(decrementButton);
  adjustContainer.appendChild(hpInput);
  adjustContainer.appendChild(incrementButton);

  const extraContainer = document.createElement("div");
  extraContainer.style.marginTop = "10px";

  const maxButton = document.createElement("button");
  maxButton.textContent = "Max";
  maxButton.className = "max-hp";
  maxButton.addEventListener("click", () => updateToMaxHP(card));

  const tempButton = document.createElement("button");
  tempButton.textContent = "Temp";
  tempButton.className = "temp-hp";
  tempButton.addEventListener("click", () =>
    addTempHP(card, parseInt(tempInput.value || 0, 10))
  );

  const tempInput = document.createElement("input");
  tempInput.type = "number";
  tempInput.value = 0;
  tempInput.min = 0;
  tempInput.placeholder = "Temp";
  tempInput.style.width = "50px";
  tempInput.style.textAlign = "center";

  extraContainer.appendChild(maxButton);
  extraContainer.appendChild(tempInput);
  extraContainer.appendChild(tempButton);

  card.appendChild(nameLabel);
  card.appendChild(hpLabel);
  card.appendChild(adjustContainer);
  card.appendChild(extraContainer);
}

// Existing function: Update health points
function updateHP(card, change) {
  const hpLabel = card.querySelector(".hp-label");
  const currentHp = parseInt(card.dataset.currentHp, 10);
  const maxHp = parseInt(card.dataset.maxHp, 10);

  const newHp = Math.max(0, Math.min(currentHp + change, maxHp));
  card.dataset.currentHp = newHp;

  hpLabel.textContent = `HP: ${newHp}/${maxHp}`;
}

// New function: Update current HP to Max HP
function updateToMaxHP(card) {
  const maxHp = parseInt(card.dataset.maxHp, 10);
  card.dataset.currentHp = maxHp;

  const hpLabel = card.querySelector(".hp-label");
  hpLabel.textContent = `HP: ${maxHp}/${maxHp}`;
}

// New function: Add Temporary HP
function addTempHP(card, tempHp) {
  if (!isNaN(tempHp) && tempHp > 0) {
    const currentHp = parseInt(card.dataset.currentHp, 10);
    const maxHp = parseInt(card.dataset.maxHp, 10);

    const newHp = currentHp + tempHp; // Temp HP can exceed maxHp
    card.dataset.currentHp = newHp;

    const hpLabel = card.querySelector(".hp-label");
    hpLabel.textContent = `HP: ${newHp}/${maxHp}`;
  }
}
