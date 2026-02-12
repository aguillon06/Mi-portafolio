// --- 1. FONDO DE PARTÍCULAS (EFECTO CONEXIÓN) ---
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particlesArray;

function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', initCanvas);
initCanvas();

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = '#00f2ff';
        ctx.fill();
    }
    update() {
        if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = Math.random() * 2 + 1;
        let x = Math.random() * (innerWidth - size * 2);
        let y = Math.random() * (innerHeight - size * 2);
        let directionX = (Math.random() * 1) - 0.5;
        let directionY = (Math.random() * 1) - 0.5;
        particlesArray.push(new Particle(x, y, directionX, directionY, size));
    }
}

function animate() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    particlesArray.forEach(p => p.update());
    connect();
    requestAnimationFrame(animate);
}

function connect() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) ** 2) + ((particlesArray[a].y - particlesArray[b].y) ** 2);
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                ctx.strokeStyle = `rgba(0, 242, 255, ${1 - distance/20000})`;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}
init();
animate();

// --- 2. EFECTO DE ESCRITURA (MÁQUINA DE ESCRIBIR) ---
const textElement = document.querySelector('.typing-text');
if (textElement) {
    const words = ["Desarrollador Web", "Diseñador UI/UX", "Freelancer"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentWord = words[wordIndex];
        if (isDeleting) {
            textElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            textElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 100 : 200;
        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pausa al final de la palabra
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }
        setTimeout(type, typeSpeed);
    }
    type();
}

// --- 3. CHISPAS AL HACER CLIC ---
window.addEventListener('click', (e) => {
    for (let i = 0; i < 8; i++) {
        const p = document.createElement('div');
        p.className = 'click-particle';
        p.style.left = e.clientX + 'px';
        p.style.top = e.clientY + 'px';
        p.style.setProperty('--x', (Math.random() * 100 - 50) + 'px');
        p.style.setProperty('--y', (Math.random() * 100 - 50) + 'px');
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 800);
    }
});

// --- 4. NAVEGACIÓN ACTIVA ---
const currentPath = window.location.pathname.split("/").pop() || 'index.html';
document.querySelectorAll('nav a').forEach(link => {
    if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
    }
});
