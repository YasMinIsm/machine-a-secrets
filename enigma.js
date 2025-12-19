// Rotor wiring data and notches (M3 historical models)
const ROTOR_DEFS = {
    'I':   { wiring: "EKMFLGDQVZNTOWYHXUSPAIBRCJ", notch: 'Q' },
    'II':  { wiring: "AJDKSIRUXBLHWTMCQGZNPYFVOE", notch: 'E' },
    'III': { wiring: "BDFHJLCPRTXVZNYEIWGAKMUSQO", notch: 'V' },
    'IV':  { wiring: "ESOVPZJAYQUIRHXLNFTGKDCMWB", notch: 'J' },
    'V':   { wiring: "VZBRGITYUPSDNHLXAWMJQOFECK", notch: 'Z' }
};
const REFLECTOR_B = "YRUHQSLDPXNGOKMIEBFZCWVJAT";
const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

let activeRotors = [];
let plugs = {};

// Initialise the mechanical state
function boot() {
    activeRotors = [];
    for (let i = 0; i < 3; i++) {
        const type = document.querySelectorAll('.rotor-type')[i].value;
        const start = document.getElementById(`start-${i}`).value.toUpperCase();
        const ring = parseInt(document.getElementById(`ring-${i}`).value) - 1;

        activeRotors.push({
            map: ROTOR_DEFS[type].wiring,
            notch: CHARSET.indexOf(ROTOR_DEFS[type].notch),
            pos: CHARSET.indexOf(start),
            ring: ring
        });
    }

    // Build plugboard map
    plugs = {};
    let rawPlugs = document.getElementById('plug-settings').value.toUpperCase().split(/\s+/);
    rawPlugs.forEach(pair => {
        if (pair.length === 2) {
            plugs[pair[0]] = pair[1];
            plugs[pair[1]] = pair[0];
        }
    });
}

// Handle physical movement of the gears
function advance() {
    let stepLeft = false;
    let stepMiddle = false;

    // Double-stepping anomaly logic
    if (activeRotors[1].pos === activeRotors[1].notch) {
        stepLeft = true;
        stepMiddle = true;
    } else if (activeRotors[2].pos === activeRotors[2].notch) {
        stepMiddle = true;
    }

    if (stepLeft) activeRotors[0].pos = (activeRotors[0].pos + 1) % 26;
    if (stepMiddle) activeRotors[1].pos = (activeRotors[1].pos + 1) % 26;
    activeRotors[2].pos = (activeRotors[2].pos + 1) % 26; // Fast rotor always moves

    // Update the visual 
    document.getElementById('rotor-L').innerText = CHARSET[activeRotors[0].pos];
    document.getElementById('rotor-M').innerText = CHARSET[activeRotors[1].pos];
    document.getElementById('rotor-R').innerText = CHARSET[activeRotors[2].pos];
}

// Electrical signal path through a rotor disc
function signalPath(idx, rotor, isReverse) {
    let shift = (rotor.pos - rotor.ring + 26) % 26;
    let entry = (idx + shift) % 26;
    let exit;

    if (!isReverse) {
        let charOut = rotor.map[entry];
        exit = (CHARSET.indexOf(charOut) - shift + 26) % 26;
    } else {
        let charIn = CHARSET[entry];
        exit = (rotor.map.indexOf(charIn) - shift + 26) % 26;
    }
    return exit;
}

// Main processing logic
function crypt(char) {
    let inputChar = char.toUpperCase();
    if (!CHARSET.includes(inputChar)) return char;

    advance();

    // 1. Initial Plugboard swap
    inputChar = plugs[inputChar] || inputChar;
    let idx = CHARSET.indexOf(inputChar);

    // 2. Forward pass (Right to Left)
    for (let i = 2; i >= 0; i--) idx = signalPath(idx, activeRotors[i], false);

    // 3. Reflection
    let reflectedChar = REFLECTOR_B[idx];
    idx = CHARSET.indexOf(reflectedChar);

    // 4. Reverse pass (Left to Right)
    for (let i = 0; i < 3; i++) idx = signalPath(idx, activeRotors[i], true);

    // 5. Final Plugboard swap
    let finalChar = CHARSET[idx];
    return plugs[finalChar] || finalChar;
}

// Listen for keyboard input
document.getElementById('raw-input').addEventListener('input', (e) => {
    boot(); 
    let text = e.target.value;
    let encodedText = "";
    for (let l of text) encodedText += crypt(l);
    document.getElementById('cipher-output').innerText = encodedText;
});

function resetAll() {
    document.getElementById('raw-input').value = "";
    document.getElementById('cipher-output').innerText = "";
    boot();
    // Manual sync for visual drums
    document.getElementById('rotor-L').innerText = CHARSET[activeRotors[0].pos];
    document.getElementById('rotor-M').innerText = CHARSET[activeRotors[1].pos];
    document.getElementById('rotor-R').innerText = CHARSET[activeRotors[2].pos];
}

window.onload = boot;