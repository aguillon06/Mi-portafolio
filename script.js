// --- 1. CONFIGURACIÓN GLOBAL DEL CANVAS (Solo una vez) ---
const canvas = document.getElementById('particles') || document.getElementById('particleCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;

if (canvas && ctx) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray = [];
    const numberOfParticles = 100;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
            if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
        }
        draw() {
            ctx.fillStyle = '#00f2ff';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particlesArray = [];
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
            
            // Conexiones de líneas entre puntos
            for (let j = i; j < particlesArray.length; j++) {
                const dx = particlesArray[i].x - particlesArray[j].x;
                const dy = particlesArray[i].y - particlesArray[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 242, 255, ${1 - distance/100})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    });
}

// --- 2. EFECTO TYPING ---
const textElement = document.getElementById('typing-text');
if (textElement) {
    const words = ["Desarrollador Web", "Diseñador UI/UX", "Creador Digital"];
    let i = 0, j = 0, isDeleting = false;

    function type() {
        const currentWord = words[i];
        if (isDeleting) {
            textElement.textContent = currentWord.substring(0, j - 1);
            j--;
            if (j == 0) { isDeleting = false; i = (i + 1) % words.length; }
        } else {
            textElement.textContent = currentWord.substring(0, j + 1);
            j++;
            if (j == currentWord.length) { isDeleting = true; setTimeout(type, 2000); return; }
        }
        setTimeout(type, isDeleting ? 100 : 200);
    }
    type();
}

// --- 3. BARRAS DE HABILIDADES ---
const skillBars = document.querySelectorAll('.progress-bar');
if(skillBars.length > 0) {
    setTimeout(() => {
        skillBars.forEach(bar => {
            bar.style.width = bar.getAttribute('data-width');
        });
    }, 500);
}

// --- 4. GESTIÓN DEL FORMULARIO (CON CHISPAS) ---
const contactForm = document.getElementById("contact-form");

function createClickParticles(x, y) {
    const container = document.body;
    for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        p.className = 'click-particle';
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        const destX = (Math.random() - 0.5) * 200;
        const destY = (Math.random() - 0.5) * 200;
        p.style.setProperty('--x', `${destX}px`);
        p.style.setProperty('--y', `${destY}px`);
        container.appendChild(p);
        setTimeout(() => p.remove(), 1000);
    }
}

if (contactForm) {
    contactForm.addEventListener("submit", async function(event) {
        event.preventDefault();
        const rect = event.submitter.getBoundingClientRect();
        createClickParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);

        const status = document.getElementById("form-status");
        const btn = contactForm.querySelector('button');
        const data = new FormData(event.target);

        btn.textContent = "ENVIANDO IDEA...";
        btn.classList.add('loading');

        fetch(event.target.action, {
            method: 'POST',
            body: data,
            headers: { 'Accept': 'application/json' }
        }).then(response => {
            status.style.display = "block";
            if (response.ok) {
                status.textContent = "¡Propuesta enviada! ✨ Revisaré tu idea pronto.";
                status.style.color = "#00f2ff";
                contactForm.reset();
            } else {
                status.textContent = "Hubo un error al enviar.";
                status.style.color = "#ff4d4d";
            }
        }).catch(() => {
            status.textContent = "Error de conexión.";
        }).finally(() => {
            btn.textContent = "ENVIAR MENSAJE";
            btn.classList.remove('loading');
        });
    });
}

// --- 5. MODAL DE PROYECTOS ---
const infoProyectos = {
    "E-Commerce App": { desc: "Tienda virtual completa.", tech: ["React", "Node.js"], link: "#" },
    "Dashboard Admin": { desc: "Panel de control real-time.", tech: ["Firebase", "Vue"], link: "#" }
};

const modal = document.getElementById("project-modal");
const modalBody = document.getElementById("modal-body");

// Solo aplica el modal a enlaces que NO sean botones .btn
document.querySelectorAll('.glass-card a:not(.btn)').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const card = e.target.closest('.glass-card');
        if(!card) return;
        e.preventDefault();
        const titulo = card.querySelector('h3').innerText;
        const info = infoProyectos[titulo];
        if(info) {
            modalBody.innerHTML = `<h2 class="gradient-text">${titulo}</h2><p>${info.desc}</p>`;
            modal.style.display = "block";
        }
    });
});

if(document.querySelector('.close-modal')) {
    document.querySelector('.close-modal').onclick = () => modal.style.display = "none";
}

// --- 6. NAVEGACIÓN Y BRILLO DE TARJETAS ---
document.querySelectorAll('.price-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
});

const currentPath = window.location.pathname.split("/").pop() || 'index.html';
document.querySelectorAll('nav a').forEach(link => {
    if (link.getAttribute('href') === currentPath) link.classList.add('active');
});
















