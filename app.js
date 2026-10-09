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
let demoRunning = false;
let demoCancelled = false;
let keyboardMinX = 0;
let demoSelectedOctave = null;
let demoOctaveTapTimeout = null;
let currentLanguage = "en";
let statusMessage = { key: "loading", args: {} };
let answerMessage = { key: "free", args: {} };
let freeDisplayTimeout = null;

const keyElements = new Map();
const activePointers = new Map();
const activeVoices = new Map();

const AudioContextClass = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContextClass();
const player = new WebAudioFontPlayer();
const pianoPreset = window._tone_0000_JCLive_sf2_file;

function resolveInitialLanguage() {
    const saved = localStorage.getItem("pitchTrainerLanguage");
    if (saved && TRANSLATIONS[saved]) {
        return saved;
    }
    const detected = navigator.language.toLowerCase();
    if (detected.startsWith("zh")) {
        return "zh-TW";
    }
    const base = detected.split("-")[0];
    return TRANSLATIONS[base] ? base : "en";
}

function t(key, args = {}) {
    let text = TRANSLATIONS[currentLanguage][key] ?? TRANSLATIONS.en[key] ?? key;
    for (const [name, value] of Object.entries(args)) {
        text = text.replaceAll(`{${name}}`, String(value));
    }
    return text;
}

function setStatus(key, args = {}) {
    statusMessage = { key, args };
    elements.status.textContent = key === "raw" ? args.text : t(key, args);
}

function setAnswer(key, args = {}) {
    answerMessage = { key, args };
    elements.answerText.textContent = key === "raw" ? args.text : t(key, args);
}

function setLanguage(language) {
    currentLanguage = TRANSLATIONS[language] ? language : "en";
    localStorage.setItem("pitchTrainerLanguage", currentLanguage);
    document.documentElement.lang = currentLanguage;
    document.getElementById("languageSelect").value = currentLanguage;
    const labels = {
        languageLabel: "language", fromLabel: "from", toLabel: "to",
        keyLabel: "key", clefLabel: "clef", applyButton: "apply",
        playButton: "play", replayButton: "replay", nextButton: "next",
        stopButton: "stop", demoButton: "demo", helpText: "hint"
    };
    for (const [id, key] of Object.entries(labels)) {
        document.getElementById(id).textContent = t(key);
    }
    const keySelect = elements.keySelect;
    for (const option of keySelect.options) {
        const [tonic, mode] = option.value.split(" ");
        option.textContent = `${tonic} ${t(mode)}`;
    }
    const clefSelect = elements.clefSelect;
    for (const option of clefSelect.options) {
        option.textContent = t(option.value.toLowerCase());
    }
    setStatus(statusMessage.key, statusMessage.args);
    setAnswer(answerMessage.key, answerMessage.args);
    if (ready) {
        if (!testActive && activePointers.size > 0) {
            renderHeldNotes();
        } else if (testActive && answered && currentMidi !== null) {
            answerMessage.args.text = `${solfegeName(currentMidi, KEY_FIFTHS[keyName])}    ${spelledNoteName(currentMidi, KEY_FIFTHS[keyName])}`;
        }
    }
    if (typeof drawStaff === "function") {
        if (!testActive && activePointers.size > 0) {
            drawStaff([...new Set(activePointers.values())]);
        } else if (answered && currentMidi !== null) {
            drawStaff(currentMidi);
        } else {
            drawStaff();
        }
    }
}

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

function selectStaffClefs(midis) {
    if (clefMode !== "Auto") {
        return [clefMode];
    }
    if (midis.length === 0) {
        return ["Treble"];
    }
    const needsBass = midis.some((midi) => midi < 60);
    const needsTreble = midis.some((midi) => midi >= 60);
    if (needsBass && needsTreble) {
        return ["Treble", "Bass"];
    }
    return needsTreble ? ["Treble"] : ["Bass"];
}

function keySignatureLabel(name) {
    const [tonic, mode] = name.split(" ");
    return `${tonic} ${t(mode)}`;
}

function drawStaff(midi = null) {
    const midis = midi === null ? [] : (Array.isArray(midi) ? [...new Set(midi)].sort((a, b) => a - b) : [midi]);
    // The recorded demo is intentionally a single-staff treble arrangement.
    // Normal free play still uses its selected clef(s) without restrictions.
    const clefs = demoRunning ? ["Treble"] : selectStaffClefs(midis);
    const fifths = KEY_FIFTHS[keyName];
    const mixed = clefs.length === 2;
    const gap = mixed ? 160 : 0;
    const noteRecords = [];
    const allPositions = [];
    const baselines = clefs.map((clef, index) => ({
        clef,
        bottomY: 125 + gap * index,
        index,
        signatureEnd: 0
    }));

    for (const staff of baselines) {
        allPositions.push(staff.bottomY - 4 * 18, staff.bottomY);
    }

    for (const pitch of midis) {
        const clef = clefs.length === 2 ? (pitch < 60 ? "Bass" : "Treble") : clefs[0];
        const staff = baselines.find((item) => item.clef === clef);
        const note = spelledNote(pitch, fifths);
        const geometry = staffGeometry(clef);
        const noteIndex = diatonicIndex(note.letter, note.octave);
        const y = staff.bottomY - (noteIndex - geometry.bottomIndex) * geometry.halfStep;
        noteRecords.push({ pitch, clef, staff, note, noteIndex, y, geometry });
        allPositions.push(y);
    }

    const top = Math.min(...allPositions, 45) - 35;
    const bottom = Math.max(...allPositions, 130) + 58;
    // The demo keeps one fixed-height treble staff even for simultaneous notes.
    elements.staff.setAttribute("viewBox", demoRunning
        ? "0 -8 800 214"
        : `0 ${top} 800 ${bottom - top}`);
    elements.staff.replaceChildren();

    for (const staff of baselines) {
        for (let line = 0; line < 5; line += 1) {
            const y = staff.bottomY - line * 18;
            elements.staff.appendChild(svgElement("line", {
                x1: 35, y1: y, x2: 765, y2: y,
                stroke: "#111827", "stroke-width": 2
            }));
        }
        const clefX = 70;
        addSvgText(clefX, staff.bottomY - 4 * 18 - 10,
            t(staff.clef === "Treble" ? "treble" : "bass"), 12, 800);

        staff.signatureEnd = drawKeySignatureAt(staff.clef, fifths, staff.bottomY);
    }

    addSvgText(710, Math.min(...allPositions, 45) - 16, keySignatureLabel(keyName), 12, 800);

    if (midis.length === 0) {
        addSvgText(400, baselines.at(-1).bottomY + 31, t("staffHidden"), 12, 500);
        return;
    }

    const baseX = Math.max(380, ...baselines.map((item) => item.signatureEnd + 80));
    const accidentalItems = [];

    for (const staff of baselines) {
        const group = noteRecords.filter((item) => item.staff === staff);
        let previousIndex = null;
        let shifted = false;

        for (const item of group) {
            if (previousIndex !== null && item.noteIndex - previousIndex <= 1) {
                shifted = !shifted;
            } else {
                shifted = false;
            }
            item.x = baseX + (shifted ? 19 : 0);
            previousIndex = item.noteIndex;
        }

        for (const item of group) {
            drawLedgerLinesAt(item.noteIndex, item.x, item.geometry.bottomIndex,
                item.geometry.halfStep, item.staff.bottomY);
        }

        for (const item of group) {
            const keyAccidental = keySignature(fifths)[item.note.letter];
            if (keyAccidental !== item.note.accidental) {
                const accidental = item.note.accidental === 1 ? "#" : item.note.accidental === -1 ? "b" : "n";
                accidentalItems.push({ y: item.y, text: accidental, staff });
            }
        }
    }

    accidentalItems.sort((a, b) => a.y - b.y);
    const occupiedColumns = [];
    for (const item of accidentalItems) {
        let column = 0;
        while (occupiedColumns[column] !== undefined && Math.abs(item.y - occupiedColumns[column]) < 25) {
            column += 1;
        }
        occupiedColumns[column] = item.y;
        addSvgText(baseX - 29 - column * 23, item.y + 6, item.text, 20, 800);
    }

    for (const item of noteRecords) {
        elements.staff.appendChild(svgElement("ellipse", {
            cx: item.x, cy: item.y, rx: 10, ry: 6, fill: "#111827"
        }));
    }

    for (const staff of baselines) {
        const group = noteRecords.filter((item) => item.staff === staff);
        if (group.length === 0) {
            continue;
        }
        const lowest = group[0];
        const highest = group.at(-1);
        const middleIndex = lowest.geometry.bottomIndex + 4;
        if (highest.noteIndex < middleIndex) {
            const from = group.reduce((a, b) => a.x > b.x ? a : b);
            elements.staff.appendChild(svgElement("line", {
                x1: from.x + 10, y1: from.y,
                x2: from.x + 10, y2: from.y - 48,
                stroke: "#111827", "stroke-width": 2
            }));
        } else {
            const from = group.reduce((a, b) => a.x < b.x ? a : b);
            elements.staff.appendChild(svgElement("line", {
                x1: from.x - 10, y1: from.y,
                x2: from.x - 10, y2: from.y + 48,
                stroke: "#111827", "stroke-width": 2
            }));
        }
    }

    const names = midis.map((pitch) => spelledNoteName(pitch, fifths)).join("  ");
    addSvgText(400, demoRunning ? 191 : bottom - 12, names, 13, 800);
}

function drawKeySignatureAt(clef, fifths, bottomY) {
    if (fifths === 0) {
        return 135;
    }
    const sharp = fifths > 0;
    const positions = sharp
        ? (clef === "Treble" ? TREBLE_SHARP_POSITIONS : BASS_SHARP_POSITIONS).slice(0, fifths)
        : (clef === "Treble" ? TREBLE_FLAT_POSITIONS : BASS_FLAT_POSITIONS).slice(0, -fifths);
    const geometry = staffGeometry(clef);
    let x = 115;
    positions.forEach(([letter, octave]) => {
        const y = bottomY - (diatonicIndex(letter, octave) - geometry.bottomIndex) * geometry.halfStep;
        addSvgText(x, y + 6, sharp ? "#" : "b", 20, 800);
        x += 22;
    });
    return x + 12;
}

function drawLedgerLinesAt(noteIndex, x, bottomIndex, halfStep, bottomY) {
    const topIndex = bottomIndex + 8;
    if (noteIndex < bottomIndex) {
        for (let lineIndex = bottomIndex - 2; lineIndex >= noteIndex; lineIndex -= 2) {
            const y = bottomY - (lineIndex - bottomIndex) * halfStep;
            elements.staff.appendChild(svgElement("line", {
                x1: x - 18, y1: y, x2: x + 18, y2: y,
                stroke: "#111827", "stroke-width": 2
            }));
        }
    } else if (noteIndex > topIndex) {
        for (let lineIndex = topIndex + 2; lineIndex <= noteIndex; lineIndex += 2) {
            const y = bottomY - (lineIndex - bottomIndex) * halfStep;
            elements.staff.appendChild(svgElement("line", {
                x1: x - 18, y1: y, x2: x + 18, y2: y,
                stroke: "#111827", "stroke-width": 2
            }));
        }
    }
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

function octaveGroups() {
    const groups = [];
    const first = Math.floor(minMidi / 12) * 12;

    for (let base = first; base <= maxMidi; base += 12) {
        const firstNote = Math.max(base, minMidi);
        if (firstNote > maxMidi) continue;
        groups.push({
            midi: firstNote,
            label: noteName(firstNote)
        });
    }

    return groups;
}

function showOctave(midi, behavior = "smooth") {
    const bounds = keyBounds(midi);
    const left = Math.max(0, bounds.left - keyboardMinX);
    elements.keyboardScroller.scrollTo({ left, behavior });
}

function highlightOctave(midi) {
    document.querySelectorAll(".octave-jump").forEach((button) => {
        button.classList.toggle("current", Number(button.dataset.midi) === midi);
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
    // Leave enough horizontal content for every octave jump to align its
    // starting key at the same left-side position in the fixed viewport.
    const finalOctaveStart = keyBounds(
        Math.floor(maxMidi / 12) * 12
    ).left - minX;
    const viewWidth = elements.keyboardScroller.clientWidth;
    const width = Math.max(maxX - minX, finalOctaveStart + viewWidth, 100);

    keyboardMinX = minX;
    elements.keyboard.style.width = `${width}px`;

    const nav = document.getElementById("octaveNav");
    nav.replaceChildren();
    const groups = octaveGroups();
    nav.hidden = groups.length <= 1;
    nav.setAttribute("aria-label", t("octaveNavigation"));
    const navButtons = [];

    groups.forEach((group) => {
        const button = document.createElement("button");
        button.className = "octave-jump";
        button.type = "button";
        button.textContent = group.label;
        button.dataset.midi = String(group.midi);
        button.setAttribute("aria-label", t("jumpToOctave", { note: group.label }));
        button.addEventListener("click", () => {
            if (!demoRunning) showOctave(group.midi);
        });
        nav.appendChild(button);
        navButtons.push({ button, midi: group.midi });

        const marker = document.createElement("span");
        marker.className = "octave-mark";
        marker.textContent = group.label;
        marker.style.left = `${Math.max(0, keyBounds(group.midi).left - minX)}px`;
        elements.keyboard.appendChild(marker);
    });

    const markCurrentOctave = () => {
        if (demoRunning && demoSelectedOctave !== null) {
            highlightOctave(demoSelectedOctave);
            return;
        }
        const offset = elements.keyboardScroller.scrollLeft;
        let selected = 0;
        for (let i = 0; i < navButtons.length; i += 1) {
            const groupX = keyBounds(navButtons[i].midi).left - minX;
            if (groupX <= offset + 14) selected = i;
        }
        navButtons.forEach(({ button }, i) => button.classList.toggle("current", i === selected));
    };
    elements.keyboardScroller.onscroll = markCurrentOctave;
    markCurrentOctave();

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
            if (demoRunning) {
                return;
            }
            event.preventDefault();
            key.setPointerCapture(event.pointerId);
            pressKey(midi, event.pointerId);
        });
        key.addEventListener("pointerup", (event) => releasePointer(event.pointerId));
        key.addEventListener("pointercancel", (event) => releasePointer(event.pointerId));
        key.addEventListener("lostpointercapture", (event) => releasePointer(event.pointerId));

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

function releaseAllKeys() {
    for (const pointerId of [...activePointers.keys()]) {
        releasePointer(pointerId);
    }
}

function playFreeVoice(midi) {
    const now = audioContext.currentTime;
    const gain = audioContext.createGain();
    gain.gain.value = 1;
    gain.connect(audioContext.destination);
    player.queueWaveTable(audioContext, gain, pianoPreset, 0, midi, 8, 0.76);
    activeVoices.set(midi, { gain, startedAt: now });
}

function releaseVoice(midi) {
    const voice = activeVoices.get(midi);
    if (!voice) {
        return;
    }
    const { gain, startedAt } = voice;
    const now = audioContext.currentTime;
    const end = Math.max(now, startedAt + 1.20);
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.setValueAtTime(gain.gain.value, end);
    gain.gain.linearRampToValueAtTime(0, end + 0.12);
    window.setTimeout(() => gain.disconnect(), Math.max(0, (end - now) * 1000) + 250);
    activeVoices.delete(midi);
}

function releasePointer(pointerId) {
    if (!activePointers.has(pointerId)) {
        return;
    }
    const midi = activePointers.get(pointerId);
    activePointers.delete(pointerId);
    if (![...activePointers.values()].includes(midi)) {
        releaseVoice(midi);
    }
    if (!testActive && !demoRunning) {
        renderHeldNotes();
    }
}

function renderHeldNotes() {
    window.clearTimeout(freeDisplayTimeout);
    resetKeyboardColors();
    const midis = [...new Set(activePointers.values())].sort((a, b) => a - b);
    midis.forEach((midi) => keyElements.get(midi)?.classList.add("active"));
    if (midis.length === 0) {
        freeDisplayTimeout = window.setTimeout(() => {
            if (!testActive && !demoRunning && activePointers.size === 0) {
                setStatus("free");
                setAnswer("free");
                drawStaff();
            }
        }, 1100);
        return;
    }
    const fifths = KEY_FIFTHS[keyName];
    setStatus("held", { count: midis.length });
    const labels = midis.map((midi) => `${solfegeName(midi, fifths)} / ${spelledNoteName(midi, fifths)}`);
    setAnswer("raw", { text: labels.join("   ") });
    drawStaff(midis);
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
    releaseAllKeys();
    window.clearTimeout(freeDisplayTimeout);
    resetKeyboardColors();
    drawStaff();

    testActive = true;
    currentMidi = Math.floor(
        Math.random() * (maxMidi - minMidi + 1)
    ) + minMidi;
    answered = false;

    setStatus("listen");
    setAnswer("choose");
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
    releaseAllKeys();
    testActive = false;
    currentMidi = null;
    answered = false;

    resetKeyboardColors();
    drawStaff();

    setStatus("stopped");
    setAnswer("free");
}

function freePlay(midi, pointerId) {
    activePointers.set(pointerId, midi);
    if (![...activePointers.entries()].some(([id, note]) => id !== pointerId && note === midi)) {
        ensureAudio().then(() => {
            if ([...activePointers.values()].includes(midi)) {
                playFreeVoice(midi);
            }
        });
    }
    renderHeldNotes();
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
        setStatus("correct", { note: targetName });
    } else {
        keyElements.get(selectedMidi).classList.add("wrong");
        keyElements.get(currentMidi).classList.add("correct");
        setStatus("wrong", { note: targetName });
    }

    setAnswer("raw", { text: `${targetSolfege}    ${targetName}` });
    drawStaff(currentMidi);
    playTone(currentMidi);
}

function pressKey(midi, pointerId) {
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

    freePlay(midi, pointerId);
}

function applySettings() {
    const startMidi = Number(elements.startNote.value);
    const endMidi = Number(elements.endNote.value);

    if (startMidi > endMidi) {
        setStatus("invalidRange");
        return;
    }

    minMidi = startMidi;
    maxMidi = endMidi;
    keyName = elements.keySelect.value;
    clefMode = elements.clefSelect.value;

    releaseAllKeys();
    window.clearTimeout(freeDisplayTimeout);
    currentMidi = null;
    answered = false;
    testActive = false;

    resetKeyboardColors();
    drawKeyboard();
    drawStaff();

    setStatus("range", {
        from: noteName(minMidi), to: noteName(maxMidi),
        key: keySignatureLabel(keyName), clef: t(clefMode.toLowerCase())
    });
    setAnswer("free");
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
    setStatus("loading");
    setControlsEnabled(false);

    player.loader.decodeAfterLoading(
        audioContext,
        "_tone_0000_JCLive_sf2_file"
    );

    player.loader.waitLoad(() => {
        ready = true;
        setControlsEnabled(true);
        setStatus("ready");
        setAnswer("free");
        document.getElementById("demoButton").disabled = false;
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
document.getElementById("languageSelect").addEventListener("change", (event) => setLanguage(event.target.value));
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        releaseAllKeys();
        if (demoRunning) {
            demoCancelled = true;
            player.cancelQueue(audioContext);
        }
    }
});
window.addEventListener("blur", releaseAllKeys);

populateSelectors();
setLanguage(resolveInitialLanguage());
drawKeyboard();
drawStaff();
initializeAudio();
registerServiceWorker();


function midiFromName(name) {
    const match = name.match(/^([A-G])(#|b)?(-?\d+)$/);

    if (!match) {
        throw new Error(`Invalid note name: ${name}`);
    }

    const pitchClasses = {
        C: 0,
        D: 2,
        E: 4,
        F: 5,
        G: 7,
        A: 9,
        B: 11
    };

    let pitchClass = pitchClasses[match[1]];

    if (match[2] === "#") {
        pitchClass += 1;
    } else if (match[2] === "b") {
        pitchClass -= 1;
    }

    const octave = Number(match[3]);

    return 12 * (octave + 1) + pitchClass;
}

function sleep(ms) {
    return new Promise((resolve) => {
        window.setTimeout(resolve, ms);
    });
}

function createDemoInterface() {
    const button = document.getElementById("demoButton");
    button.addEventListener("click", () => {
        if (demoRunning) {
            demoCancelled = true;
            player.cancelQueue(audioContext);
        } else {
            runDemo();
        }
    });
    const pointer = document.createElement("div");
    pointer.id = "demoPointer";
    document.body.appendChild(pointer);
}

function demoPointer() {
    return document.getElementById("demoPointer");
}

async function pointToElement(element, tap = true) {
    const pointer = demoPointer();
    const rect = element.getBoundingClientRect();

    pointer.style.left = `${rect.left + rect.width / 2}px`;
    pointer.style.top = `${rect.top + rect.height / 2}px`;
    pointer.classList.add("visible");

    await sleep(330);

    if (tap) {
        pointer.classList.add("tap");
        await sleep(150);
        pointer.classList.remove("tap");
    }
}

function hideDemoPointer() {
    const pointer = demoPointer();
    pointer.classList.remove("visible", "tap");
}

function setDemoControlsLocked(locked) {
    document.querySelectorAll("button, select").forEach((element) => {
        element.disabled = locked;
    });

    const demoButton = document.getElementById("demoButton");

    demoButton.disabled = !ready;
    demoButton.textContent = locked ? t("stopDemo") : t("demo");
}

function startDemoQuestion(midi) {
    resetKeyboardColors();
    drawStaff();

    testActive = true;
    currentMidi = midi;
    answered = false;

    setStatus("listen");
    setAnswer("choose");
    playTone(currentMidi);
}

async function demoAnswer(selectedMidi) {
    const key = keyElements.get(selectedMidi);

    await pointToElement(key);
    answer(selectedMidi);
}

// An eight-bar C-major piano demonstration of Beethoven's Ode to Joy theme.
// The melody follows the familiar tune, transposed up an octave so melody
// and supporting two-handed chords fit on a single treble staff.
const DEMO_BARS = [
    "E5:1 E5:1 F5:1 G5:1",
    "G5:1 F5:1 E5:1 D5:1",
    "C5:1 C5:1 D5:1 E5:1",
    "E5:1 D5:1 D5:2",
    "E5:1 E5:1 F5:1 G5:1",
    "G5:1 F5:1 E5:1 D5:1",
    "C5:1 C5:1 D5:1 E5:1",
    "D5:1 C5:1 C5:2"
];

const DEMO_CHORDS = {
    C: ["C4", "E4", "G4"],
    G: ["G4", "B4", "D5"],
    F: ["F4", "A4", "C5"],
    Am: ["A4", "C5", "E5"]
};

const DEMO_HARMONIES = [
    "C", "G", "C", "G", "C", "G", "F", "C"
];

function buildDemoScore() {
    if (DEMO_BARS.length !== DEMO_HARMONIES.length) {
        throw new Error("Demo melody and accompaniment counts differ.");
    }

    const events = [];
    const add = (name, start, beats, volume, part) => {
        events.push({
            midi: midiFromName(name),
            start,
            end: start + beats,
            beats,
            volume,
            part
        });
    };

    DEMO_BARS.forEach((bar, index) => {
        let beatPosition = 0;
        const start = index * 4;
        bar.split(" ").forEach((token) => {
            const [name, length] = token.split(":");
            const beats = Number(length);
            add(name, start + beatPosition, beats * 0.91, 0.82, "melody");
            beatPosition += beats;
        });

        if (Math.abs(beatPosition - 4) > 0.00001) {
            throw new Error(`Demo bar ${index + 1} is not four beats.`);
        }

        const chord = DEMO_CHORDS[DEMO_HARMONIES[index]];
        if (!chord) throw new Error(`Missing harmony in bar ${index + 1}.`);

        if (index === DEMO_BARS.length - 1) {
            // Wait until the last C5 melody note for a real final tonic cadence.
            chord.forEach((note, voice) => {
                add(note, start + 2, 1.85, voice === 0 ? 0.24 : 0.14, "harmony");
            });
        } else {
            // Short, light accompaniment: lower chord tone with soft two-note answers.
            add(chord[0], start, 0.85, 0.22, "bass");
            add(chord[1], start + 1, 0.55, 0.12, "harmony");
            add(chord[2], start + 1, 0.55, 0.12, "harmony");
            add(chord[0], start + 2, 0.75, 0.17, "bass");
            add(chord[1], start + 3, 0.55, 0.10, "harmony");
            add(chord[2], start + 3, 0.55, 0.10, "harmony");
        }
    });

    events.sort((a, b) => a.start - b.start || a.midi - b.midi);
    return { events, totalBeats: DEMO_BARS.length * 4 };
}

const DEMO_SCORE = buildDemoScore();

// Existing octave buttons control only horizontal scrolling, not timing.
const DEMO_OCTAVE_CUES = [
    [0, 72], [12, 60], [16, 72], [28, 60]
];

function demoOctaveForBeat(beatIndex) {
    let octaveMidi = DEMO_OCTAVE_CUES[0][1];
    for (const [startBeat, midi] of DEMO_OCTAVE_CUES) {
        if (beatIndex >= startBeat) octaveMidi = midi;
        else break;
    }
    return octaveMidi;
}

function demoJumpOctave(midi) {
    if (midi === null || midi === demoSelectedOctave) return;

    const button = [...document.querySelectorAll(".octave-jump")].find((item) => {
        return Number(item.dataset.midi) === midi;
    });
    if (!button) return;

    demoSelectedOctave = midi;
    showOctave(midi, "auto");
    highlightOctave(midi);

    // Visualize the existing quick-key selection without delaying playback.
    const pointer = demoPointer();
    const rect = button.getBoundingClientRect();
    pointer.style.left = `${rect.left + rect.width / 2}px`;
    pointer.style.top = `${rect.top + rect.height / 2}px`;
    pointer.classList.add("visible", "tap");
    window.clearTimeout(demoOctaveTapTimeout);
    demoOctaveTapTimeout = window.setTimeout(() => {
        pointer.classList.remove("visible", "tap");
    }, 160);
}

function renderDemoChord(notes, beat) {
    const midis = [...new Set(notes.map((event) => event.midi))].sort((a, b) => a - b);
    resetKeyboardColors();
    midis.forEach((midi) => keyElements.get(midi)?.classList.add("active"));
    drawStaff(midis);

    const view = elements.keyboardScroller.getBoundingClientRect();
    const visible = midis.map((midi) => {
        return keyElements.get(midi)?.getBoundingClientRect();
    }).filter((rect) => {
        return rect && rect.right > view.left + 6 && rect.left < view.right - 6;
    });
    const pointers = [...document.querySelectorAll(".demo-music-pointer")];
    for (let i = 0; i < pointers.length; i += 1) {
        const pointer = pointers[i];
        const rect = visible[i];
        if (!rect) {
            pointer.classList.remove("visible");
            continue;
        }
        const left = Math.max(rect.left, view.left);
        const right = Math.min(rect.right, view.right);
        pointer.style.left = `${(left + right) / 2}px`;
        pointer.style.top = `${rect.top + Math.min(rect.height * 0.7, 150)}px`;
        pointer.classList.add("visible");
    }

    const fifths = KEY_FIFTHS[keyName];
    const displayed = midis.map((midi) => spelledNoteName(midi, fifths)).join("  ");
    setStatus("raw", {
        text: `Beethoven · Ode to Joy · ${Math.min(DEMO_BARS.length, Math.floor(beat / 4) + 1)}/${DEMO_BARS.length}`
    });
    setAnswer("raw", { text: displayed || "Ode to Joy" });
}

function buildDemoMusicPointers() {
    if (document.querySelector(".demo-music-pointer")) return;
    for (let i = 0; i < 5; i += 1) {
        const pointer = document.createElement("div");
        pointer.className = "demo-music-pointer";
        pointer.style.setProperty("--pointer-index", String(i));
        document.body.appendChild(pointer);
    }
}

function hideDemoMusicPointers() {
    document.querySelectorAll(".demo-music-pointer").forEach((pointer) => {
        pointer.classList.remove("visible");
    });
}

async function playOdeToJoyDemo() {
    await ensureAudio();
    player.cancelQueue(audioContext);
    buildDemoMusicPointers();

    const secondsPerBeat = 60 / 132;
    const startTime = audioContext.currentTime + 0.22;
    const { events, totalBeats } = DEMO_SCORE;
    let next = 0;
    let previousSignature = "";
    let previousBar = -1;
    let previousOctaveBeat = -1;

    await new Promise((resolve) => {
        const timer = window.setInterval(() => {
            if (demoCancelled || document.hidden) {
                window.clearInterval(timer);
                player.cancelQueue(audioContext);
                resolve();
                return;
            }

            const now = audioContext.currentTime;
            const beat = Math.max(0, (now - startTime) / secondsPerBeat);
            const schedulingHorizon = now + 0.24;

            while (
                next < events.length &&
                startTime + events[next].start * secondsPerBeat < schedulingHorizon
            ) {
                const event = events[next++];
                const scheduledStart = startTime + event.start * secondsPerBeat;
                player.queueWaveTable(
                    audioContext,
                    audioContext.destination,
                    pianoPreset,
                    scheduledStart,
                    event.midi,
                    event.beats * secondsPerBeat,
                    event.volume
                );
            }

            const current = events.filter((event) => {
                return event.start <= beat && beat < event.end;
            });
            const octaveBeat = Math.floor(beat);
            if (octaveBeat !== previousOctaveBeat && octaveBeat < totalBeats) {
                demoJumpOctave(demoOctaveForBeat(octaveBeat));
                previousOctaveBeat = octaveBeat;
            }
            const signature = current.map((event) => event.midi).sort((a, b) => a - b).join(",");
            const bar = Math.floor(beat / 4);
            if (signature !== previousSignature || bar !== previousBar) {
                renderDemoChord(current, beat);
                previousSignature = signature;
                previousBar = bar;
            }

            if (beat >= totalBeats + 0.65) {
                window.clearInterval(timer);
                resolve();
            }
        }, 30);
    });

    hideDemoMusicPointers();
    resetKeyboardColors();

    if (!demoCancelled) {
        setStatus("demoEnd");
        setAnswer("title");
        drawStaff();
        await sleep(880);
    }
}

async function runDemo() {
    if (!ready || demoRunning) {
        return;
    }

    demoRunning = true;
    demoCancelled = false;
    document.querySelector(".app-shell").classList.add("demo-running");
    setDemoControlsLocked(true);

    try {
        await ensureAudio();
        player.cancelQueue(audioContext);

        elements.startNote.value = String(midiFromName("C4"));
        elements.endNote.value = String(midiFromName("B4"));
        elements.keySelect.value = "C major";
        elements.clefSelect.value = "Treble";

        await pointToElement(elements.applyButton);
        if (demoCancelled) return;
        applySettings();
        await sleep(470);

        if (demoCancelled) return;
        await pointToElement(elements.playButton);
        if (demoCancelled) return;
        startDemoQuestion(midiFromName("F#4"));
        await sleep(920);

        if (demoCancelled) return;
        await demoAnswer(midiFromName("G4"));
        await sleep(850);

        if (demoCancelled) return;
        await pointToElement(elements.nextButton);
        if (demoCancelled) return;
        startDemoQuestion(midiFromName("A4"));
        await sleep(880);

        if (demoCancelled) return;
        await demoAnswer(midiFromName("A4"));
        await sleep(850);

        if (demoCancelled) return;
        await pointToElement(elements.stopButton);
        if (demoCancelled) return;
        stopTest();
        await sleep(520);

        if (demoCancelled) return;
        elements.startNote.value = String(midiFromName("C4"));
        elements.endNote.value = String(midiFromName("B5"));
        elements.clefSelect.value = "Treble";

        await pointToElement(elements.applyButton);
        if (demoCancelled) return;
        applySettings();
        await sleep(450);

        hideDemoPointer();
        setStatus("demoFree");
        setAnswer("raw", { text: "Ode to Joy · Piano" });
        await sleep(380);
        if (demoCancelled) return;

        document.querySelector(".app-shell").classList.add("demo-music");
        await playOdeToJoyDemo();
    } finally {
        const wasCancelled = demoCancelled;
        hideDemoPointer();
        hideDemoMusicPointers();
        window.clearTimeout(demoOctaveTapTimeout);
        player.cancelQueue(audioContext);
        demoSelectedOctave = null;
        demoRunning = false;
        demoCancelled = false;
        document.querySelector(".app-shell").classList.remove("demo-running", "demo-music");
        testActive = false;
        currentMidi = null;
        answered = false;
        releaseAllKeys();
        resetKeyboardColors();
        drawStaff();
        setDemoControlsLocked(false);
        setStatus(wasCancelled ? "stopped" : "demoEnd");
        setAnswer("free");
    }
}

createDemoInterface();
