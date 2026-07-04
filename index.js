// I am the storm that is approachingg

const canvas = document.getElementById('chip8-canvas');
const chip8 = new Chip8();
const display = new Display(canvas, 20);
const input = new Input(chip8.keys);
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let oscillator = null;

function startBeep() {
    if (oscillator) return;
    oscillator = audioCtx.createOscillator()
    oscillator.type = 'square'
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
    oscillator.connect(audioCtx.destination);
    oscillator.start();
}

function stopBeep() {
    if (!oscillator) return;
    oscillator.stop();
    oscillator.disconnect();
    oscillator = null;
}

setInterval(() => {
    chip8.updateTimer();
    if (chip8.soundtimer > 0) {
        startBeep();
    } else {
        stopBeep();
    }
}, 1000 / 60);

function loop() {
    for (let i = 0; i < 10; i++) {
        chip8.emulateCycle();
    }
    display.render(chip8.display);
    animationFrameId = requestAnimationFrame(loop);
}

const romPicker = document.getElementById('rom-picker');
let animationFrameId = null;
function startGame(buffer) {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    chip8.reset()
    chip8.loadRom(buffer);
    stopBeep();
    animationFrameId = requestAnimationFrame(loop);
}
romPicker.addEventListener('change', (e) => {
    const file = e.target.files[0]
    if (!file) return;
    const reader = new FileReader
    reader.onload = (event) => {
        startGame(event.target.result);
    };
    reader.readAsArrayBuffer(file);
});

fetch('roms/Pong.ch8')
    .then(res => res.arrayBuffer())
    .then(buffer => {
        startGame(buffer);
    });
