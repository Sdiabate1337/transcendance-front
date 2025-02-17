export class GameCanvas {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.setupCanvas();
        this.init();
    }

    setupCanvas() {
        this.canvas.width = 800;
        this.canvas.height = 400;
        this.container.appendChild(this.canvas);

        // Make canvas responsive
        window.addEventListener('resize', () => this.handleResize());
        this.handleResize();
    }

    handleResize() {
        const containerWidth = this.container.clientWidth;
        const scale = containerWidth / 800;
        
        this.canvas.style.width = `${containerWidth}px`;
        this.canvas.style.height = `${400 * scale}px`;
    }

    init() {
        this.gameState = {
            paddle1: { y: 150, score: 0 },
            paddle2: { y: 150, score: 0 },
            ball: { x: 400, y: 200, dx: 5, dy: 5 }
        };

        this.animate();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }

    update() {
        // Update game state
        this.updateBall();
        this.checkCollisions();
    }

    draw() {
        // Draw game elements
        this.drawPaddles();
        this.drawBall();
        this.drawScore();
    }

    // Additional game logic methods...
}