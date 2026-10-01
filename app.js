const PLAY_DURATION = 1.4;
const SUPPORTED_MIN_MIDI = 36;
const SUPPORTED_MAX_MIDI = 95;
const DEFAULT_MIN_MIDI = 60;
const DEFAULT_MAX_MIDI = 71;

const PITCH_NAMES = [
    "C", "C#", "D", "D#", "E", "F",
    "F#", "G", "G#", "A", "A#", "B"
];

const WHITE_PITCH_CLASSES = new Set([0, 2, 4, 5, 7, 9, 11]);

const LETTER_PITCH_CLASSES = {
    C: 0,
    D: 2,
    E: 4,
    F: 5,
    G: 7,
    A: 9,
    B: 11
};

const LETTER_INDICES = {
    C: 0,
    D: 1,
    E: 2,
    F: 3,
    G: 4,
    A: 5,
    B: 6
};

const SOLFEGE_NAMES = {
    C: "Do",
    D: "Re",
    E: "Mi",
    F: "Fa",
    G: "Sol",
    A: "La",
    B: "Si"
};

const SHARP_ORDER = ["F", "C", "G", "D", "A", "E", "B"];
const FLAT_ORDER = ["B", "E", "A", "D", "G", "C", "F"];

const SHARP_SPELLINGS = {
    0: ["C", 0],
    1: ["C", 1],
    2: ["D", 0],
    3: ["D", 1],
    4: ["E", 0],
    5: ["F", 0],
    6: ["F", 1],
    7: ["G", 0],
    8: ["G", 1],
    9: ["A", 0],
    10: ["A", 1],
    11: ["B", 0]
};

const FLAT_SPELLINGS = {
    0: ["C", 0],
    1: ["D", -1],
    2: ["D", 0],
    3: ["E", -1],
    4: ["E", 0],
    5: ["F", 0],
    6: ["G", -1],
    7: ["G", 0],
    8: ["A", -1],
    9: ["A", 0],
    10: ["B", -1],
    11: ["B", 0]
};

const KEY_FIFTHS = {
    "Cb major": -7,
    "Gb major": -6,
    "Db major": -5,
    "Ab major": -4,
    "Eb major": -3,
    "Bb major": -2,
    "F major": -1,
    "C major": 0,
    "G major": 1,
    "D major": 2,
    "A major": 3,
    "E major": 4,
    "B major": 5,
    "F# major": 6,
    "C# major": 7,
    "Ab minor": -7,
    "Eb minor": -6,
    "Bb minor": -5,
    "F minor": -4,
    "C minor": -3,
    "G minor": -2,
    "D minor": -1,
    "A minor": 0,
    "E minor": 1,
    "B minor": 2,
    "F# minor": 3,
    "C# minor": 4,
    "G# minor": 5,
    "D# minor": 6,
    "A# minor": 7
};

const KEY_OPTIONS = [
    "C major",
    "G major",
    "D major",
    "A major",
    "E major",
    "B major",
    "F# major",
    "C# major",
    "F major",
    "Bb major",
    "Eb major",
    "Ab major",
    "Db major",
    "Gb major",
    "Cb major",
    "A minor",
    "E minor",
    "B minor",
    "F# minor",
    "C# minor",
    "G# minor",
    "D# minor",
    "A# minor",
    "D minor",
    "G minor",
    "C minor",
    "F minor",
    "Bb minor",
    "Eb minor",
    "Ab minor"
];

const TREBLE_SHARP_POSITIONS = [
    ["F", 5],
    ["C", 5],
    ["G", 5],
    ["D", 5],
    ["A", 4],
    ["E", 5],
    ["B", 4]
];

const TREBLE_FLAT_POSITIONS = [
    ["B", 4],
    ["E", 5],
    ["A", 4],
    ["D", 5],
    ["G", 4],
    ["C", 5],
    ["F", 4]
];

const BASS_SHARP_POSITIONS = [
    ["F", 3],
    ["C", 3],
    ["G", 3],
    ["D", 3],
    ["A", 2],
    ["E", 3],
    ["B", 2]
];

const BASS_FLAT_POSITIONS = [
    ["B", 2],
    ["E", 3],
    ["A", 2],
    ["D", 3],
    ["G", 2],
    ["C", 3],
    ["F", 2]
];

const WHITE_WIDTH = 52;
const BLACK_WIDTH = 32;
const SVG_NS = "http://www.w3.org/2000/svg";

const elements = {
    status: document.getElementById("status"),
    answerText: document.getElementById("answerText"),
    startNote: document.getElementById("startNote"),
    endNote: document.getElementById("endNote"),
    keySelect: document.getElementById("keySelect"),
    clefSelect: document.getElementById("clefSelect"),
    applyButton: document.getElementById("applyButton"),
    playButton: document.getElementById("playButton"),
    replayButton: document.getElementById("replayButton"),
    nextButton: document.getElementById("nextButton"),
    stopButton: document.getElementById("stopButton"),
    staff: document.getElementById("staff"),
    keyboard: document.getElementById("keyboard"),
    keyboardScroller: document.getElementById("keyboardScroller")
};

let minMidi = DEFAULT_MIN_MIDI;
let maxMidi = DEFAULT_MAX_MIDI;
let keyName = "C major";
let clefMode = "Treble";
let currentMidi = null;
let answered = false;
let testActive = false;
let ready = false;

const keyElements = new Map();

const AudioContextClass = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContextClass();
const player = new WebAudioFontPlayer();
const pianoPreset = window._tone_0000_JCLive_sf2_file;

function noteName(midi) {
    const octave = Math.floor(midi / 12) - 1;
    return `${PITCH_NAMES[midi % 12]}${octave}`;
}

function isWhiteKey(midi) {
    return WHITE_PITCH_CLASSES.has(midi % 12);
}

function keySignature(fifths) {
    const accidentals = {
        C: 0,
        D: 0,
        E: 0,
        F: 0,
        G: 0,
        A: 0,
        B: 0
    };

    if (fifths > 0) {
        SHARP_ORDER.slice(0, fifths).forEach((letter) => {
            accidentals[letter] = 1;
        });
    } else if (fifths < 0) {
        FLAT_ORDER.slice(0, -fifths).forEach((letter) => {
            accidentals[letter] = -1;
        });
    }

    return accidentals;
}

function spelledNote(midi, fifths) {
    const pitchClass = midi % 12;
    const signature = keySignature(fifths);

    let letter = null;
    let accidental = null;

    for (const candidate of Object.keys(LETTER_PITCH_CLASSES)) {
        const candidatePitch = (
            LETTER_PITCH_CLASSES[candidate] + signature[candidate] + 12
        ) % 12;

        if (candidatePitch === pitchClass) {
            letter = candidate;
            accidental = signature[candidate];
            break;
        }
    }

    if (letter === null) {
        const spelling = fifths >= 0
            ? SHARP_SPELLINGS[pitchClass]
            : FLAT_SPELLINGS[pitchClass];

        [letter, accidental] = spelling;
    }

    for (let octave = -1; octave <= 9; octave += 1) {
        const naturalMidi = (
            12 * (octave + 1) + LETTER_PITCH_CLASSES[letter]
        );

        if (naturalMidi + accidental === midi) {
            return { letter, accidental, octave };
        }
    }

    throw new Error("Unable to spell MIDI note.");
}

function accidentalText(accidental) {
    if (accidental === 1) {
        return "#";
    }

    if (accidental === -1) {
        return "b";
    }

    return "";
}

function spelledNoteName(midi, fifths) {
    const note = spelledNote(midi, fifths);
    return `${note.letter}${accidentalText(note.accidental)}${note.octave}`;
}

function solfegeName(midi, fifths) {
    const note = spelledNote(midi, fifths);
    return `${SOLFEGE_NAMES[note.letter]}${accidentalText(note.accidental)}${note.octave}`;
}

function diatonicIndex(letter, octave) {
    return octave * 7 + LETTER_INDICES[letter];
}

function resolveClef(midi) {
    if (clefMode !== "Auto") {
        return clefMode;
    }

    return midi >= 60 ? "Treble" : "Bass";
}

function staffGeometry(clef) {
    const lineSpacing = 18;
    const bottomY = 125;
    const halfStep = lineSpacing / 2;
    const bottomIndex = clef === "Treble"
        ? diatonicIndex("E", 4)
        : diatonicIndex("G", 2);

    return {
        lineSpacing,
        bottomY,
        halfStep,
        bottomIndex
    };
}

function staffY(letter, octave, clef) {
    const geometry = staffGeometry(clef);
    const noteIndex = diatonicIndex(letter, octave);

    return geometry.bottomY
        - (noteIndex - geometry.bottomIndex) * geometry.halfStep;
}

function svgElement(name, attributes = {}) {
    const element = document.createElementNS(SVG_NS, name);

    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
    });

    return element;
}

function addSvgText(x, y, text, size = 16, weight = 600, anchor = "middle") {
    const element = svgElement("text", {
        x,
        y,
        "font-size": size,
        "font-family": "Arial, sans-serif",
        "font-weight": weight,
        "text-anchor": anchor,
        fill: "#111827"
    });

    element.textContent = text;
    elements.staff.appendChild(element);
    return element;
}

function drawKeySignature(clef, fifths) {
    if (fifths === 0) {
        return 135;
    }

    let positions;
    let symbol;

    if (fifths > 0) {
        symbol = "#";
        positions = clef === "Treble"
            ? TREBLE_SHARP_POSITIONS.slice(0, fifths)
            : BASS_SHARP_POSITIONS.slice(0, fifths);
    } else {
        symbol = "b";
        positions = clef === "Treble"
            ? TREBLE_FLAT_POSITIONS.slice(0, -fifths)
            : BASS_FLAT_POSITIONS.slice(0, -fifths);
    }

    let x = 115;

    positions.forEach(([letter, octave]) => {
        addSvgText(
            x,
            staffY(letter, octave, clef) + 6,
            symbol,
            20,
            800
        );
        x += 22;
    });

    return x + 12;
}

function drawLedgerLines(noteIndex, noteX, bottomIndex, halfStep, bottomY) {
    const topIndex = bottomIndex + 8;

    if (noteIndex < bottomIndex) {
        for (
            let lineIndex = bottomIndex - 2;
            lineIndex >= noteIndex;
            lineIndex -= 2
        ) {
            const y = bottomY - (lineIndex - bottomIndex) * halfStep;

            elements.staff.appendChild(svgElement("line", {
                x1: noteX - 18,
                y1: y,
                x2: noteX + 18,
                y2: y,
                stroke: "#111827",
                "stroke-width": 2
            }));
        }
    } else if (noteIndex > topIndex) {
        for (
            let lineIndex = topIndex + 2;
            lineIndex <= noteIndex;
            lineIndex += 2
        ) {
            const y = bottomY - (lineIndex - bottomIndex) * halfStep;

            elements.staff.appendChild(svgElement("line", {
                x1: noteX - 18,
                y1: y,
                x2: noteX + 18,
                y2: y,
                stroke: "#111827",
                "stroke-width": 2
            }));
        }
    }
}

function drawStaff(midi = null) {
    elements.staff.replaceChildren();

    const clef = midi === null
        ? (clefMode === "Auto" ? "Treble" : clefMode)
        : resolveClef(midi);

    const fifths = KEY_FIFTHS[keyName];
    const geometry = staffGeometry(clef);
    const left = 35;
    const right = 765;

    for (let line = 0; line < 5; line += 1) {
        const y = geometry.bottomY - line * geometry.lineSpacing;

        elements.staff.appendChild(svgElement("line", {
            x1: left,
            y1: y,
            x2: right,
            y2: y,
            stroke: "#111827",
            "stroke-width": 2
        }));
    }

    addSvgText(70, 24, clef.toUpperCase(), 12, 800);
    addSvgText(710, 24, keyName, 12, 800);

    const signatureEnd = drawKeySignature(clef, fifths);
    const noteX = Math.max(380, signatureEnd + 80);

    if (midi === null) {
        addSvgText(
            400,
            158,
            "The staff note appears after you answer.",
            12,
            500
        );
        return;
    }

    const note = spelledNote(midi, fifths);
    const noteIndex = diatonicIndex(note.letter, note.octave);
    const noteY = staffY(note.letter, note.octave, clef);

    drawLedgerLines(
        noteIndex,
        noteX,
        geometry.bottomIndex,
        geometry.halfStep,
        geometry.bottomY
    );

    const signature = keySignature(fifths);
    const signatureAccidental = signature[note.letter];

    if (note.accidental !== signatureAccidental) {
        let accidental = "n";

        if (note.accidental === 1) {
            accidental = "#";
        } else if (note.accidental === -1) {
            accidental = "b";
        }

        addSvgText(noteX - 30, noteY + 6, accidental, 20, 800);
    }

    elements.staff.appendChild(svgElement("ellipse", {
        cx: noteX,
        cy: noteY,
        rx: 10,
        ry: 6,
        fill: "#111827"
    }));

    const middleIndex = geometry.bottomIndex + 4;

    if (noteIndex < middleIndex) {
        elements.staff.appendChild(svgElement("line", {
            x1: noteX + 9,
            y1: noteY,
            x2: noteX + 9,
            y2: noteY - 48,
            stroke: "#111827",
            "stroke-width": 2
        }));
    } else {
        elements.staff.appendChild(svgElement("line", {
            x1: noteX - 9,
            y1: noteY,
            x2: noteX - 9,
            y2: noteY + 48,
            stroke: "#111827",
            "stroke-width": 2
        }));
    }

    addSvgText(
        400,
        158,
        `${spelledNoteName(midi, fifths)}    ${clef} clef`,
        13,
        800
    );
}

function whiteGlobalIndex(midi) {
    const octave = Math.floor(midi / 12);
    const pitchClass = midi % 12;
    const offsets = {
        0: 0,
        2: 1,
        4: 2,
        5: 3,
        7: 4,
        9: 5,
        11: 6
    };

    return octave * 7 + offsets[pitchClass];
}

function keyBounds(midi) {
    if (isWhiteKey(midi)) {
        const left = whiteGlobalIndex(midi) * WHITE_WIDTH;

        return {
            left,
            right: left + WHITE_WIDTH,
            black: false
        };
    }

    const pitchClass = midi % 12;
    const octave = Math.floor(midi / 12);
    const leftWhiteOffset = {
        1: 0,
        3: 1,
        6: 3,
        8: 4,
        10: 5
    }[pitchClass];

    const boundary = (octave * 7 + leftWhiteOffset + 1) * WHITE_WIDTH;

    return {
        left: boundary - BLACK_WIDTH / 2,
        right: boundary + BLACK_WIDTH / 2,
        black: true
    };
}

function resetKeyboardColors() {
    keyElements.forEach((element) => {
        element.classList.remove("correct", "wrong", "active");
    });
}

function drawKeyboard() {
    elements.keyboard.replaceChildren();
    keyElements.clear();

    const midis = [];

    for (let midi = minMidi; midi <= maxMidi; midi += 1) {
        midis.push(midi);
    }

    const bounds = midis.map((midi) => keyBounds(midi));
    const minX = Math.min(...bounds.map((item) => item.left));
    const maxX = Math.max(...bounds.map((item) => item.right));
    const width = Math.max(maxX - minX, 100);

    elements.keyboard.style.width = `${width}px`;

    const ordered = [
        ...midis.filter((midi) => isWhiteKey(midi)),
        ...midis.filter((midi) => !isWhiteKey(midi))
    ];

    ordered.forEach((midi) => {
        const boundsForKey = keyBounds(midi);
        const key = document.createElement("button");

        key.type = "button";
        key.className = `piano-key ${boundsForKey.black ? "black-key" : "white-key"}`;
        key.style.left = `${boundsForKey.left - minX}px`;
        key.dataset.midi = String(midi);
        key.setAttribute("aria-label", noteName(midi));

        key.addEventListener("pointerdown", (event) => {
            event.preventDefault();
            pressKey(midi);
        });

        elements.keyboard.appendChild(key);
        keyElements.set(midi, key);
    });

    window.setTimeout(() => {
        elements.keyboardScroller.scrollLeft = 0;
    }, 0);
}

function setControlsEnabled(enabled) {
    elements.applyButton.disabled = !enabled;
    elements.playButton.disabled = !enabled;
    elements.replayButton.disabled = !enabled;
    elements.nextButton.disabled = !enabled;
    elements.stopButton.disabled = !enabled;
    elements.startNote.disabled = !enabled;
    elements.endNote.disabled = !enabled;
    elements.keySelect.disabled = !enabled;
    elements.clefSelect.disabled = !enabled;
}

async function ensureAudio() {
    if (audioContext.state === "suspended") {
        await audioContext.resume();
    }
}

async function playTone(midi) {
    if (!ready) {
        return;
    }

    await ensureAudio();
    player.cancelQueue(audioContext);

    player.queueWaveTable(
        audioContext,
        audioContext.destination,
        pianoPreset,
        0,
        midi,
        PLAY_DURATION,
        0.75
    );
}

function newQuestion() {
    if (!ready) {
        return;
    }

    resetKeyboardColors();
    drawStaff();

    testActive = true;
    currentMidi = Math.floor(
        Math.random() * (maxMidi - minMidi + 1)
    ) + minMidi;
    answered = false;

    elements.status.textContent = "Listen...";
    elements.answerText.textContent = "Choose the correct piano key.";
    playTone(currentMidi);
}

function replay() {
    if (ready && currentMidi !== null) {
        playTone(currentMidi);
    }
}

function stopTest() {
    if (!ready) {
        return;
    }

    player.cancelQueue(audioContext);
    testActive = false;
    currentMidi = null;
    answered = false;

    resetKeyboardColors();
    drawStaff();

    elements.status.textContent = "Test stopped.";
    elements.answerText.textContent = "Free play mode";
}

function freePlay(midi) {
    resetKeyboardColors();

    const element = keyElements.get(midi);
    element.classList.add("active");

    const fifths = KEY_FIFTHS[keyName];
    const note = spelledNoteName(midi, fifths);
    const solfege = solfegeName(midi, fifths);

    elements.status.textContent = `Solfege: ${solfege}    Note: ${note}`;
    elements.answerText.textContent = `${solfege}    ${note}`;

    drawStaff(midi);
    playTone(midi);
}

function answer(selectedMidi) {
    answered = true;

    const correctAnswer = selectedMidi === currentMidi;
    const fifths = KEY_FIFTHS[keyName];
    const targetName = spelledNoteName(currentMidi, fifths);
    const targetSolfege = solfegeName(currentMidi, fifths);

    resetKeyboardColors();

    if (correctAnswer) {
        keyElements.get(selectedMidi).classList.add("correct");
        elements.status.textContent = `Correct: ${targetName}`;
    } else {
        keyElements.get(selectedMidi).classList.add("wrong");
        keyElements.get(currentMidi).classList.add("correct");
        elements.status.textContent = `Wrong. Answer: ${targetName}`;
    }

    elements.answerText.textContent = `${targetSolfege}    ${targetName}`;
    drawStaff(currentMidi);
    playTone(currentMidi);
}

function pressKey(midi) {
    if (!ready) {
        return;
    }

    if (testActive && currentMidi !== null && !answered) {
        answer(midi);
        return;
    }

    if (testActive) {
        playTone(midi);
        return;
    }

    freePlay(midi);
}

function applySettings() {
    const startMidi = Number(elements.startNote.value);
    const endMidi = Number(elements.endNote.value);

    if (startMidi > endMidi) {
        elements.status.textContent = "Start note must not be higher than end note.";
        return;
    }

    minMidi = startMidi;
    maxMidi = endMidi;
    keyName = elements.keySelect.value;
    clefMode = elements.clefSelect.value;

    currentMidi = null;
    answered = false;
    testActive = false;

    resetKeyboardColors();
    drawKeyboard();
    drawStaff();

    elements.status.textContent = (
        `Range: ${noteName(minMidi)} to ${noteName(maxMidi)}. `
        + `Key: ${keyName}. Clef: ${clefMode}.`
    );
    elements.answerText.textContent = "Free play mode";
}

function populateSelectors() {
    for (
        let midi = SUPPORTED_MIN_MIDI;
        midi <= SUPPORTED_MAX_MIDI;
        midi += 1
    ) {
        const startOption = document.createElement("option");
        startOption.value = String(midi);
        startOption.textContent = noteName(midi);
        elements.startNote.appendChild(startOption);

        const endOption = document.createElement("option");
        endOption.value = String(midi);
        endOption.textContent = noteName(midi);
        elements.endNote.appendChild(endOption);
    }

    KEY_OPTIONS.forEach((key) => {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = key;
        elements.keySelect.appendChild(option);
    });

    elements.startNote.value = String(DEFAULT_MIN_MIDI);
    elements.endNote.value = String(DEFAULT_MAX_MIDI);
    elements.keySelect.value = "C major";
    elements.clefSelect.value = "Treble";
}

function initializeAudio() {
    elements.status.textContent = "Loading piano samples...";
    setControlsEnabled(false);

    player.loader.decodeAfterLoading(
        audioContext,
        "_tone_0000_JCLive_sf2_file"
    );

    player.loader.waitLoad(() => {
        ready = true;
        setControlsEnabled(true);
        elements.status.textContent = "Piano samples are ready.";
        elements.answerText.textContent = "Free play mode";
    });
}

function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./service-worker.js");
    }
}

elements.applyButton.addEventListener("click", applySettings);
elements.playButton.addEventListener("click", newQuestion);
elements.replayButton.addEventListener("click", replay);
elements.nextButton.addEventListener("click", newQuestion);
elements.stopButton.addEventListener("click", stopTest);

populateSelectors();
drawKeyboard();
drawStaff();
initializeAudio();
registerServiceWorker();
