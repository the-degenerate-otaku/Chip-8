# CHIP-8 (JavaScript)
Chip-8 is a Interpreted programming language made by Joseph Weisbecker (1977) made to write video games on old 8-bit computers easier 
This version of Chip-8 is written JS as it way easier than to write it in C or Python 

## Status
- Currently in Devlopment : Core structure is ready including CPU, Rendering and Input, passed IBM logo test

## How Does it Work?
> ```text
> ├── index.html    # Entry point, canvas element, script loading
> ├── cpu.js        # Chip8 class: memory, registers, fetch-decode-execute
> loop
> ├── display.js    # Display class: Canvas 2D rendering
> ├── input.js      # Input class: keyboard → CHIP-8 hex keypad mapping
> ├── index.js      # Wires everything together, requestAnimationFrame loop
> └── roms/
>     └── ibm-logo.ch8  # Test ROM
> ```

> ```text
> ├── cpu.js        # Brain: Owns CHIP-8 machine state: 4KB RAM, 64x2 buffer, keys array (The intelligence of the Chip-8)
> ├── display.js    # renderer: Takes display buffer and draws to HTML5 via 2D context (Creates the Output)
> ├── input.js      # Keypad mapper: Maps QWERTY to CHIP-8 hex keypad, updates cpu.js keys array ( Takes input (not used yet))
> └── index.js      # Main entry: instantiates components, fetches ROM, runs requestAnimationFrame loop ( The scheduler )
> ```



![IBM logo test ROM rendering](screenshots/ibm-logo.png)

## What has been done so far?

- Core Hardware (CPU, Memory, Registers etc) 
- ROM loading 
- 15 Opcodes Implemented
- drawsprite() - Sprite reading from memory
- Canvas Redering pipeline ( testeed against the IBM logo test)
- Keyboard input ( not being used currently but exsists )

## Future Updates

- Font set ( Hex digit sprites 0-F) loaded in memory at 0x50 
- 60Hz delays/sound timers ( Not CPU cycle )
- Remaining Opcodes
- Tests against real games

## BugFixes

- Fixed LoadROM and drawSprite defined outside class body causing ';' expected error
- Reference Error caused by 'A' in Unit8Array to be replaced by 'a' 
- Wrong bit shifter for x- (opcode && 0x0f00) >> 12 shouldve been >> 8 causing wrong reading of register
- Reused undefined variable (sum) across switch cases - copy-paste from the 8XY4 case left reference to sum in the 8XY5 case which didnt exsist
- Removed this.pc +=2 from default ehich cause only unknown opcodes advanced the program counter, while every real opcode either returned early or silently failed to advance.
- Bug i hate personally - fillstyle vs fillStyle: Canvas API's real property is fillStyle (capital S); the lowercase version silently creates an unused property instead of throwing an error, so every fillRect() call quietly drew in the default black instead of green, with zero console errors to point at the cause. Found via manually wrapping fillRect to log its real arguments and diffing against a known-working manual test. (only took me an entire hour of brain scratching)

# Tech Stack 
- Html
- JavaScript

## How to run?

### Option 1 
- Click this link to get to the page directly https://the-degenerate-otaku.github.io/Chip-8/
### Option 2
- Download cpu.js, display.js, index.js and index.html (no need for input.js as it not used yet) load them in a folder and open in a live server, trying to load directly to browser using the file will not work as inteded 

# Tech Stack 
- Html
- JavaScript

# Ai Use 
- AI(Co-Pilot) was only used to Debug the code and none was used to write it 
