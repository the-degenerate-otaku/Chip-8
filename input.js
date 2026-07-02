const KEYMAP = {
    '1': 0x1, '2': 0x2, '3': 0x3, '4': 0XC,
    'q': 0x4, 'w': 0x5, 'e': 0x6, 'r': 0xD,
    'a': 0x7, 's': 0x8, 'd': 0x9, 'f': 0XE,  // took way loonger than it shouldve
    'z': 0xA, 'x': 0x0, 'c': 0xB, 'v': 0xF,
};

class Input {
    constructor(keys) {
        this.keys = keys;

        window.addEventListener('keydown', (e) => {
            const key = KEYMAP[e.key.toLowerCase()];
            if (key !== undefined) this.keys[keys] = 1;
        });

        window.addEventListener('keyup', (e) => {
            const key = KEYMAP[e.key.toLowerCase()];
            if (key !== undefined) this.key[keys] = 0;
        });
    }
}