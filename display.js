class Display {
    constructor(canvas, scale = 10) {
        this.cols = 64;
        this.rows = 32;
        this.scale = scale;
        canvas.width = this.cols * this.scale;;
        canvas.height = this.rows * this.scale;
        this.ctx = canvas.getContext('2d');
    }

    render(buffer) {
        this.ctx.fillstyle = '#000';
        this.ctx.fillRect(0, 0, this.cols * this.scale, this, rows * this.scale);

        this.ctx.fillstyle = '#0f0';
        for (let i = 0; i < buffer.length; i++) {
            if (buffer[i] === 1) {
                const x = (i % this.cols) * this.scale;
                const y = Math.floor(i / this.cols) * this.scale;;
                this.ctx.fillRect(x, y, this.scale, this.scale);
            }
        }
    }

}

