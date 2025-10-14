// Particle Animation Module
// Creates an animated particle background effect

export class ParticleAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.warn(`Canvas element with id "${canvasId}" not found`);
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        
        this.init();
    }
    
    init() {
        this.resizeCanvas();
        this.initParticles();
        this.animate();
        
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.initParticles();
        });
        
        // Make initParticles available globally for theme changes
        window.initParticles = () => this.initParticles();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    initParticles() {
        this.particles = [];
        const particleCount = (this.canvas.width * this.canvas.height) / 8000;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(this.canvas));
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.update(this.canvas);
            particle.draw(this.ctx);
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

class Particle {
    constructor(canvas) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 4 + 1;
        this.speedX = (Math.random() - 0.5) * 1.5;
        this.speedY = (Math.random() - 0.5) * 1.5;
        this.opacity = Math.random() * 0.5 + 0.2;
        
        // Use theme colors if available
        if (window.particleColors && window.particleColors.length > 0) {
            this.color = window.particleColors[Math.floor(Math.random() * window.particleColors.length)];
        } else {
            this.color = "#FFFFFF";
        }
    }
    
    update(canvas) {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Wrap particles around the canvas
        if (this.x < 0 || this.x > canvas.width) {
            this.x = Math.random() * canvas.width;
        }
        if (this.y < 0 || this.y > canvas.height) {
            this.y = Math.random() * canvas.height;
        }
    }
    
    draw(ctx) {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Auto-initialize if canvas exists
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('particle-canvas')) {
        new ParticleAnimation('particle-canvas');
    }
});
