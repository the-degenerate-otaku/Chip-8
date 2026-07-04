const FONTSET = [
    0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
    0x20, 0x60, 0x20, 0x20, 0x70, //1
    0xF0, 0x10, 0xF0, 0x80, 0xF0, //2
    0xF0, 0x10, 0xF0, 0x10, 0xF0, //3
    0x90, 0x90, 0xF0, 0x10, 0x10, //4
    0xF0, 0x80, 0xF0, 0x10, 0xF0, //5
    0xF0, 0x80, 0xF0, 0x90, 0xF0, //6
    0xF0, 0x10, 0x20, 0x40, 0x40, //7
    0xF0, 0x90, 0xF0, 0x90, 0xF0, //8
    0xF0, 0x90, 0xF0, 0x10, 0xF0, //9
    0xF0, 0x90, 0xF0, 0x90, 0x90, //A
    0xE0, 0x90, 0xE0, 0x90, 0xE0, //B
    0xF0, 0x80, 0x80, 0x80, 0xF0, //C
    0xE0, 0x90, 0x90, 0x90, 0xE0, //D
    0xF0, 0x80, 0xF0, 0x80, 0xF0, //E
    0xF0, 0x80, 0xF0, 0x80, 0x80, //F
];

// limiter to make the chip 8 
class Chip8 {
    constructor() {
        this.memory = new Uint8Array(4096);
        this.V = new Uint8Array(16);
        this.I = 0;
        this.pc = 0x200;
        this.stack = new Uint16Array(16);
        this.sp = 0;
        this.display = new Uint8Array(64 * 32);
        this.delaytimer = 0;
        this.soundtimer = 0;
        this.keys = new Uint8Array(16);

        for (let i = 0; i < FONTSET.length; i++) {
            this.memory[0x50 + i] = FONTSET[i];
        }
    }

    // logic
    emulateCycle() {
        const opcode = (this.memory[this.pc] << 8) | this.memory[this.pc + 1];
        const firstnibble = (opcode & 0xf000) >> 12;
        const x = (opcode & 0x0f00) >> 8;
        const y = (opcode & 0x00f0) >> 4;
        const nn = opcode & 0x00ff;
        const nnn = opcode & 0x0fff;

        switch (firstnibble) {
            case 0x0:
                if (opcode === 0x00E0) {
                    this.display.fill(0);
                } else if (opcode === 0x00EE) {
                    this.sp--;
                    this.pc = this.stack[this.sp];

                }
                break;

            case 0x1:
                this.pc = nnn;
                return;

            case 0x2:
                this.stack[this.sp] = this.pc;
                this.sp++;
                this.pc = nnn;
                return;

            case 0x3:
                if (this.V[x] === nn) this.pc += 2;
                break;

            case 0x4:
                if (this.V[x] !== nn) this.pc += 2;
                break;

            case 0x5:
                if (this.V[x] === this.V[y]) this.pc += 2;
                break;

            case 0x6:
                this.V[x] = nn;
                break;

            case 0x7:
                this.V[x] = (this.V[x] + nn) & 0xff;
                break;

            case 0x8: {
                const lastnibble = opcode & 0x000f;
                switch (lastnibble) {
                    case 0x0:
                        this.V[x] = this.V[y];
                        break;
                    case 0x1:
                        this.V[x] = this.V[x] | this.V[y];
                        break;
                    case 0x2:
                        this.V[x] = this.V[x] & this.V[y];
                        break;
                    case 0x3:
                        this.V[x] = this.V[x] ^ this.V[y];
                        break;
                    case 0x4: {
                        const sum = this.V[x] + this.V[y];
                        const result = sum & 0xff;
                        const flag = sum > 0xff ? 1 : 0;
                        this.V[x] = result;
                        this.V[0xF] = flag;
                        break;
                    }
                    case 0x5: {
                        const result = (this.V[x] - this.V[y]) & 0xff;
                        const flag = this.V[x] >= this.V[y] ? 1 : 0;
                        this.V[x] = result;
                        this.V[0xF] = flag;
                        break;
                    }
                    case 0x6: {
                        const flag = this.V[y] & 0x1;
                        const result = this.V[y] >> 1;
                        this.V[x] = result;
                        this.V[0xF] = flag;
                        break;
                    }
                    case 0x7: {
                        const result = (this.V[y] - this.V[x]) & 0xff;
                        const flag = this.V[y] >= this.V[x] ? 1 : 0;
                        this.V[x] = result;
                        this.V[0xF] = flag;
                        break;
                    }
                    case 0xE: {
                        const flag = (this.V[y] & 0x80) >> 7;
                        const result = (this.V[y] << 1) & 0xff;
                        this.V[x] = result;
                        this.V[0xF] = flag;
                        break;
                    }
                }
                break;
            }
            case 0x9:
                if (this.V[x] !== this.V[y]) this.pc += 2;
                break;

            case 0xA:
                this.I = nnn;
                break;

            case 0xB:
                this.pc = (nnn + this.V[0]) & 0xFFF;
                return;

            case 0xC:
                this.V[x] = Math.floor(Math.random() * 256) & nn;
                break;

            case 0xD:
                this.drawSprite(x, y, opcode & 0x000f);
                break;

            case 0xE:
                if (nn === 0x9E) {
                    if (this.keys[this.V[x]] === 1) this.pc += 2;
                } else if (nn === 0xA1) {
                    if (this.keys[this.V[x]] !== 1) this.pc += 2;
                }
                break;

            case 0xF: {
                switch (nn) {
                    case 0x07:
                        this.V[x] = this.delaytimer;
                        break;

                    case 0x0A: {
                        let keyPressed = false;
                        for (let i = 0; i < 16; i++) {
                            if (this.keys[i] === 1) {
                                this.V[x] = i;
                                keyPressed = true;
                                break;
                            }
                        }
                        if (!keyPressed) return;
                        break;
                    }

                    case 0x15:
                        this.delaytimer = this.V[x];
                        break;;

                    case 0x18:
                        this.soundtimer = this.V[x];
                        break;

                    case 0x1E:
                        this.I = (this.I + this.V[x]) & 0xFFF;
                        break;

                    case 0x29:
                        this.I = 0x50 + (this.V[x] * 5);
                        break;

                    case 0x33: {
                        const value = this.V[x];
                        this.memory[this.I] = Math.floor(value / 100);
                        this.memory[this.I + 1] = Math.floor((value % 100) / 10);
                        this.memory[this.I + 2] = value % 10;
                        break;
                    }

                    case 0x55:
                        for (let i = 0; i <= x; i++) {
                            this.memory[this.I + i] = this.V[i];
                        }
                        break;

                    case 0x65:
                        for (let i = 0; i <= x; i++) {
                            this.V[i] = this.memory[this.I + i];
                        }
                        break;
                }
                break;
            }

            default:
                console.log(`Unknown opcode: ${opcode.toString(16)}`);
        }
        this.pc += 2;
    }

    drawSprite(x, y, height) {
        const vx = this.V[x];
        const vy = this.V[y];
        this.V[0xF] = 0;

        for (let row = 0; row < height; row++) {
            const spriteByte = this.memory[this.I + row];

            for (let col = 0; col < 8; col++) {
                const spritePixel = (spriteByte & (0x80 >> col)) !== 0 ? 1 : 0;

                if (spritePixel === 1) {
                    const px = (vx + col) % 64;
                    const py = (vy + row) % 32;
                    const index = py * 64 + px;

                    if (this.display[index] === 1) {
                        this.V[0xF] = 1;
                    }
                    this.display[index] ^= 1;
                }
            }
        }
    }

    // timer type shi
    updateTimer() {
        if (this.delaytimer > 0) this.delaytimer--;
        if (this.soundtimer > 0) this.soundtimer--;
    }

    // load da ROM
    loadRom(buffer) {
        const data = new Uint8Array(buffer);
        this.memory.fill(0);
        this.pc = 0x200;
        for (let i = 0; i < data.length; i++) {
            this.memory[0x200 + i] = data[i];
        }
    }
}
