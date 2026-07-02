// Hardware limiter
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

    }

    // Logic
    emulatecycle() {
        const opcode = (this.memory[this.pc] << 8 | this.memory[this.pc + 1]);
        const firstnibble = (opcode & 0xf000) >> 12;
        const x = (opcode & 0x0f00) >> 12;
        const y = (opcode & 0x00f0) >> 4;
        const nn = opcode & 0x00ff;
        const nnn = opcode & 0x0fff;

        switch (firstnibble) {
            case 0x0:
                if (opcode === 0x00E00) {
                    this.display.fill(0);
                } else if (opcode === 0x00EE) {
                    this.sp--;
                    this.pc = this.stack[this.sp];
                    return;

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

                if (this.V[x] !== nn) this.pc += 2;
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
                    case 0x0: this.V[x] = this.V[y]; break;
                    case 0x1: this.V[x] |= this.V[y]; break;
                    case 0x2: this.V[x] &= this.V[y]; break;
                    case 0x3: this.V[x] ^= this.V[y]; break;
                    case 0x4: {
                        const sum = this.V[x] + this.V[y];
                        this.V[x] = sum & 0xff;
                        this.V[0xf] = sum > 0xff ? 1 : 0;
                        break;
                    }
                    case 0x5: {
                        this.V[0xF] = this.V[x] > this.V[y] ? 1 : 0;;
                        this.V[x] = sum & 0xff;
                        break;
                    }
                    case 0x6: {
                        this.V[0xF] = this.V[x] & 0x1;
                        this.V[x] = this.V[x] >> 1;
                        break;
                    }
                    case 0x7: {
                        this.V[0xF] = thisV[y] > this.V[x] ? 1 : 0;
                        this.V[x] = (this.V[y] - this.V[x]) & 0xff;
                        break;

                    }

                }
                break;
            }

            case 0x9:

                if (this.V[x] !== this.v[y]) this.pc += 2;
                break;

            case 0xA:

                this.I = nnn;
                break;

            case 0xD:

                this.drawSprite(x, y, opcode & 0x000f);
                break;

            default:

                console.log('Unknown opcode: ${opcode.toString(16)}}');
        }
        this.pc += 2;
    }

    // load da ROM
    loadRom(buffer) {
        const data = new Uint8array(buffer);
        this.memory.fill(0);
        this.pc = 0x200;
        for (let i = 0; i < data.length; i++) {
            this.memory[0x200 + i] = data[i];
        }
    }

}

