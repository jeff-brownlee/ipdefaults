let currentIndex = 0;

let state = {
    street: "Flop", // Tracks the current street (Flop -> Turn -> River)
    capped: null, // Tracks selection from Card 1 (true = C, false = UC)
    fp: null, // Tracks selection from Card 2 (true = FP, false = Not FP)
    elasticity: null, // Tracks selection from Card 3 (true = Elastic, false = Inelastic)
};

// Ensure the first card is always shown on page load
window.onload = function() {
    let cardWrapper = document.getElementById('cardWrapper');
    cardWrapper.style.transform = 'translateX(0)';
    currentIndex = 0;
    state = { street: "Flop", capped: null, fp: null, elasticity: null };
    updateStateLabel();
    updateStreetLabel();
    updateTrafficLight();
    console.log("Page loaded: Showing Card 1");
};

// Mapping of state combinations to traffic light colors
const lightColorMapping = {
    "Flop-null-null-null": { bluff: "black", value: "black", sdv: "black" },
    "Flop-false-true-null": { bluff: "yellow", value: "yellow", sdv: "yellow" },
    "Flop-false-false-null": { bluff: "green", value: "red", sdv: "green" },
    "Turn-false-true-null": { bluff: "yellow", value: "yellow", sdv: "green" },
    "Turn-false-false-null": { bluff: "green", value: "red", sdv: "green" },
    "Turn-true-null-false": { bluff: "red", value: "red", sdv: "green" },
    "Turn-true-null-true": { bluff: "yellow", value: "yellow", sdv: "green" },
    "River-false-true-null": { bluff: "orange", value: "yellow", sdv: "green" },
    "River-false-false-null": { bluff: "yellow", value: "red", sdv: "green" },
    "River-true-null-false": { bluff: "yellow", value: "red", sdv: "green" },
    "River-true-null-true": { bluff: "red", value: "yellow", sdv: "green" }
};

// Function to update the traffic light colors
function updateTrafficLight() {
    const stateKey = `${state.street}-${state.capped}-${state.fp}-${state.elasticity}`;
    const colors = lightColorMapping[stateKey];

    if (!colors) {
        console.warn("No color mapping found for state:", stateKey);
        return;
    }
    console.log(`Traffic lights will be updated for ${state.street}:`, colors);

    // Apply the colors to the traffic lights
    document.getElementById("bluff").style.backgroundColor = colors.bluff;
    document.getElementById("value").style.backgroundColor = colors.value;
    document.getElementById("sdv").style.backgroundColor = colors.sdv;

    console.log(`Traffic lights updated for ${state.street}:`, colors);
}

// Handles selection on Card 1 and moves accordingly
function selectCapped(isCapped) {
    state.capped = isCapped;
    console.log("Capped selected:", state.capped);

    if (state.capped) {
        console.log("Skipping to Card 3");
        moveToCard(2);
    } else {
        console.log("Moving to Card 2");
        moveToCard(1);
    }
}

// Handles selection on Card 2
function selectFP(isFP) {
    state.fp = isFP;
    console.log("FP selected:", state.fp);
    moveToNextStreet();
}

function moveToNextStreet() {
    console.log("Current street before transition:", state.street);

    // Update the state label and traffic light before changing the street
    updateStateLabel();
    updateTrafficLight();

    if (state.street === "Flop") {
        state.street = "Turn";
        resetToCard1(); // Move back to Card 1
    } else if (state.street === "Turn") {
        state.street = "River";
        resetToCard1(); // Move back to Card 1
    } else {
        console.log("Game completed. Staying on River until manual reset.");
        return; // Stay on the current card when on River
    }

    console.log("Transitioned to:", state.street);

    // Update UI with the new street
    updateStreetLabel();

    // Reset user selections but keep the street state
    state.capped = null;
    state.fp = null;
    state.elasticity = null;
}

// Handles selection on Card 3 and transitions the street
function selectElasticity(isElastic) {
    state.elasticity = isElastic;
    console.log("Elasticity selected:", state.elasticity);
    moveToNextStreet();
}

// Moves between cards
function moveToCard(targetIndex) {
    let cardWrapper = document.getElementById('cardWrapper');
    if (targetIndex < 0 || targetIndex > 2) return;

    currentIndex = targetIndex;
    console.log("Moving to Card:", currentIndex);
    cardWrapper.style.transition = "transform 0.4s ease-in-out";
    cardWrapper.style.transform = `translateX(-${currentIndex * 400}px)`;
}

// Resets inputs and moves back to Card 1
function resetToCard1() {
    let cardWrapper = document.getElementById('cardWrapper');
    currentIndex = 0;
    requestAnimationFrame(() => {
        cardWrapper.style.transform = 'translateX(0)';
    });
}

// Updates the UI label showing the current street
function updateStreetLabel() {
    let streetLabel = document.getElementById('currentStreet');
    if (streetLabel) {
        streetLabel.innerText = `${state.street}`;
    }
}

function updateStateLabel() {
    let stateLabel = document.getElementById('currentState');
    if (!stateLabel) return;

    let street = state.street;
    let selections = [];

    // Add Capped selection
    if (state.capped === true) selections.push("C");
    if (state.capped === false) selections.push("UC");

    // Add FP selection
    if (state.fp === true) selections.push("FP");
    if (state.fp === false) selections.push("Not FP");

    // Add Elasticity selection
    if (state.elasticity === true) selections.push("E");
    if (state.elasticity === false) selections.push("IE");

    // Join selections with ' & '
    let formattedSelections = selections.length > 0 ? selections.join(" & ") : "";

    // Construct the final state label
    let finalLabel = formattedSelections ? `${street} | ${formattedSelections}` : street;

    // Update UI
    stateLabel.innerText = finalLabel;
}

// Resets the game when all streets are completed
function resetGame() {
    console.log("Resetting Game...");
    state = { street: "Flop", capped: null, fp: null, elasticity: null };
    updateStateLabel();
    updateStreetLabel();
    updateTrafficLight();
    resetToCard1();
}

