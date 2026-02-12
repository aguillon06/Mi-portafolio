// 1. Efecto Typing para el Index
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

// 2. Fondo de Partículas (Canvas)
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
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

function init() {
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        // Conexiones
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
    requestAnimationFrame(animate);
}
init();
animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// 3. Activar Barras de Habilidades
const skillBars = document.querySelectorAll('.progress-bar');
if(skillBars.length > 0) {
    setTimeout(() => {
        skillBars.forEach(bar => {
            bar.style.width = bar.getAttribute('data-width');
        });
    }, 500);
}

const form = document.getElementById("contact-form");

if (form) {
    async function handleSubmit(event) {
        event.preventDefault();
        const status = document.getElementById("form-status");
        const data = new FormData(event.target);
        
        // Efecto visual de "enviando"
        const btn = form.querySelector('button');
        btn.textContent = "ENVIANDO...";
        btn.style.opacity = "0.7";

        fetch(event.target.action, {
            method: form.method,
            body: data,
            headers: { 'Accept': 'application/json' }
        }).then(response => {
            if (response.ok) {
                status.innerHTML = "¡Gracias! Tu idea ha sido enviada con éxito. ✨";
                status.style.color = "var(--primary)";
                status.style.display = "block";
                form.reset();
            } else {
                response.json().then(data => {
                    if (Object.hasOwn(data, 'errors')) {
                        status.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                    } else {
                        status.innerHTML = "Oops! Hubo un problema al enviar.";
                    }
                    status.style.color = "#ff4d4d";
                    status.style.display = "block";
                })
            }
        }).catch(error => {
            status.innerHTML = "Error de conexión. Inténtalo más tarde.";
            status.style.display = "block";
        }).finally(() => {
            btn.textContent = "ENVIAR MENSAJE";
            btn.style.opacity = "1";
        });
    }
    form.addEventListener("submit", handleSubmit);
}
// Función para crear partículas al hacer clic
function createParticles(x, y) {
    const container = document.body;
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'click-particle';
        
        // Posición inicial (donde se hizo clic)
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        // Dirección aleatoria
        const destX = (Math.random() - 0.5) * 200;
        const destY = (Math.random() - 0.5) * 200;
        
        particle.style.setProperty('--x', `${destX}px`);
        particle.style.setProperty('--y', `${destY}px`);
        
        container.appendChild(particle);
        
        // Limpiar la partícula después de la animación
        setTimeout(() => particle.remove(), 1000);
    }
}

// Actualizar el listener del formulario
const contactForm = document.getElementById("contact-form");
if (contactForm) {
    contactForm.addEventListener("submit", async function(event) {
        event.preventDefault();
        
        // Lanzar partículas en la posición del botón
        const rect = event.submitter.getBoundingClientRect();
        createParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);

        const status = document.getElementById("form-status");
        const btn = document.getElementById("submit-btn");
        const data = new FormData(event.target);

        btn.textContent = "ENVIANDO IDEA...";
        btn.classList.add('loading'); // Clase para animar el botón

        fetch(event.target.action, {
            method: 'POST',
            body: data,
            headers: { 'Accept': 'application/json' }
        }).then(response => {
            status.style.display = "block";
            status.classList.add('show-message'); // Animación de entrada
            if (response.ok) {
                status.textContent = "¡Propuesta enviada! ✨ Revisaré tu idea pronto.";
                status.style.color = "#00f2ff";
                contactForm.reset();
            } else {
                status.textContent = "Hubo un error. ¿Podrías intentar de nuevo?";
                status.style.color = "#ff4d4d";
            }
        }).catch(() => {
            status.style.display = "block";
            status.textContent = "Error de conexión. Revisa tu internet.";
        }).finally(() => {
            btn.textContent = "ENVIAR MENSAJE";
            btn.classList.remove('loading');
        });
    });
}

// Base de datos de tus proyectos
const infoProyectos = {
    "E-Commerce App": {
        desc: "Una tienda virtual completa con pasarela de pagos integrada.",
        tech: ["React", "Node.js", "MongoDB"],
        link: "https://www.tiendanube.com/co/tienda-en-linea?utm_source=google&utm_medium=cpc&utm_campaign=co-web-search-nobrand-low-region_all-device_c-id_791201217108&utm_content=ecommerce-exact&gad_source=1&gad_campaignid=20421834623&gbraid=0AAAAApO5gLty7I-JlbGyQ3R_04GYk5q0g&gclid=CjwKCAiAkbbMBhB2EiwANbxtbT0327LIZEII818PwOPhc_w3KKlKfXKgF6ZCb9-rLjYWPHYWkjKHWxoC0JUQAvD_BwE"
    },
    "Dashboard Admin": {
        desc: "Panel de control con gráficas en tiempo real para empresas.",
        tech: ["Chart.js", "Firebase", "Vue"],
        link: "https://github.com"
    }
};

const modal = document.getElementById("project-modal");
const modalBody = document.getElementById("modal-body");

document.querySelectorAll('.glass-card a').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        // Buscamos el título de la tarjeta más cercana
        const titulo = e.target.closest('.glass-card').querySelector('h3').innerText;
        const info = infoProyectos[titulo];

        if(info) {
            modalBody.innerHTML = `
                <h2 class="gradient-text">${titulo}</h2>
                <p style="margin: 1rem 0;">${info.desc}</p>
                <div style="margin-bottom: 1.5rem;">
                    ${info.tech.map(t => `<span class="badge">${t}</span>`).join(' ')}
                </div>
                <a href="${info.link}" target="_blank" class="btn">Ir al Sitio Oficial</a>
            `;
            modal.style.display = "block";
        }
    });
});

// Cerrar modal al darle a la X o fuera de la caja
document.querySelector('.close-modal').onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; }