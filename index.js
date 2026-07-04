// I am the storm that is approachingg

const canvas = document.getElementById('chip8-canvas');
const chip8 = new Chip8();
const display = new Display(canvas, 10);
const input = new Input(chip8.keys);

setInterval(() => {
    chip8.updateTimer();
}, 1000 / 60);

function loop() {
    for (let i = 0; i < 10; i++) {
        chip8.emulateCycle();

    }
    display.render(chip8.display);
    requestAnimationFrame(loop);
}

fetch('roms/4-flags.ch8')
    .then(res => res.arrayBuffer())
    .then(Buffer => {
        chip8.loadRom(Buffer);
        requestAnimationFrame(loop);
    });
