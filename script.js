let selections = {
    section1: "F",
    section2: { UC: true, FP: true, IE: false }
};

document.querySelectorAll(".option-btn").forEach(button => {
    button.addEventListener("click", function() {
        let section = this.getAttribute("data-section");
        let value = this.getAttribute("data-value");

        if (section === "1") {
            selections.section1 = value;
            resetSection2();
        } else if (section === "2") {
            if (value === "UC") {
                selections.section2.UC = !selections.section2.UC;
                selections.section2.IE = !selections.section2.UC;
            } else if (value === "FP" && selections.section2.UC) {
                selections.section2.FP = !selections.section2.FP;
            } else if (value === "IE" && !selections.section2.UC) {
                selections.section2.IE = !selections.section2.IE;
            }
        }

        updateTrafficLight();
    });
});

function resetSection2() {
    if (selections.section1 === "F") {
        selections.section2 = { UC: true, FP: true, IE: false };
    } else if (selections.section1 === "T") {
        selections.section2 = { UC: false, FP: false, IE: true };
    } else if (selections.section1 === "R") {
        selections.section2 = { UC: false, FP: false, IE: false };
    }
}

function updateTrafficLight() {
    let bulb1 = document.getElementById("bulb1");
    let bulb2 = document.getElementById("bulb2");
    let bulb3 = document.getElementById("bulb3");

    if (selections.section1 === "F") {
        if (selections.section2.FP) {
            setBulbColors("yellow", "yellow", "yellow");
        } else {
            setBulbColors("green", "red", "green");
        }
    } else if (selections.section1 === "T") {
        if (selections.section2.UC && selections.section2.FP) {
            setBulbColors("yellow", "yellow", "green");
        } else if (selections.section2.UC) {
            setBulbColors("green", "red", "green");
        } else if (selections.section2.IE) {
            setBulbColors("red", "red", "green");
        } else {
            setBulbColors("yellow", "yellow", "green");
        }
    } else if (selections.section1 === "R") {
        if (selections.section2.UC && selections.section2.FP) {
            setBulbColors("orange", "yellow", "green");
        } else if (selections.section2.UC) {
            setBulbColors("yellow", "red", "green");
        } else if (selections.section2.IE) {
            setBulbColors("yellow", "red", "green");
        } else {
            setBulbColors("red", "yellow", "green");
        }
    }
}

function setBulbColors(top, middle, bottom) {
    document.getElementById("bulb1").className = "bulb " + top;
    document.getElementById("bulb2").className = "bulb " + middle;
    document.getElementById("bulb3").className = "bulb " + bottom;
}

document.getElementById("resetBtn").addEventListener("click", function() {
    selections.section1 = "F";
    resetSection2();
    updateTrafficLight();
});