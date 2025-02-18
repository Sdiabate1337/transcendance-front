export default class AboutPage {
    constructor() {
        this.particles = [];
        this.mouseTrail = [];
        this.lastMousePos = { x: 0, y: 0 };
    }

    async render() {
        const container = document.createElement('div');
        container.className = 'about-container';
        container.innerHTML = `
            <button class="back-button" id="back-to-landing">
                <span class="back-icon">←</span>
                Back to Home
            </button>
            <div class="particles-container"></div>
            <h1 class="glitch-text section-title">About Transcendance</h1>
            <div class="team-section">
                <h2 class="section-title">Our Team</h2>
                <div class="team-grid">
                    ${this.renderTeamMembers()}
                </div>
            </div>
            <div class="tech-stack-section">
                <h2 class="section-title">Tech Stack</h2>
                <div class="tech-stack-container">
                    ${this.renderTechStack()}
                </div>
            </div>
            <div class="interactive-badge">
                <span class="badge-text">Cyberpunk Pong</span>
                <div class="badge-glow"></div>
            </div>
        `;

        this.initializeParticles(container);
        this.initializeMouseTrail(container);
        this.initializeCardFlip(container);
        this.initializeBackButton(container);
        return container;
    }

    renderTeamMembers() {
        const members = [
            {
                name: 'Souleymane Diabate',
                role: 'Lead Developer',
                expertise: ['Frontend Architecture', 'Game Development', 'UI/UX Design'],
                quote: 'Building the future of gaming, one pixel at a time.',
                github: 'https://github.com/Sdiabate1337'
            },
            {
                name: 'Souleymane Diabate',
                role: 'Lead Developer',
                expertise: ['Frontend Architecture', 'Game Development', 'UI/UX Design'],
                quote: 'Building the future of gaming, one pixel at a time.',
                github: 'https://github.com/Sdiabate1337'
            },
            {
                name: 'Souleymane Diabate',
                role: 'Lead Developer',
                expertise: ['Frontend Architecture', 'Game Development', 'UI/UX Design'],
                quote: 'Building the future of gaming, one pixel at a time.',
                github: 'https://github.com/Sdiabate1337'
            },
            {
                name: 'Souleymane Diabate',
                role: 'Lead Developer',
                expertise: ['Frontend Architecture', 'Game Development', 'UI/UX Design'],
                quote: 'Building the future of gaming, one pixel at a time.',
                github: 'https://github.com/Sdiabate1337'
            },
            {
                name: 'Souleymane Diabate',
                role: 'Lead Developer',
                expertise: ['Frontend Architecture', 'Game Development', 'UI/UX Design'],
                quote: 'Building the future of gaming, one pixel at a time.',
                github: 'https://github.com/Sdiabate1337'
            },
            // Add more team members as needed
        ];

        return members.map(member => `
            <div class="member-card">
                <div class="card-front">
                    <div class="member-avatar">
                        <div class="avatar-glow"></div>
                        <img src="/assets/images/team/${member.name.toLowerCase().replace(' ', '-')}.jpg" 
                             alt="${member.name}" 
                             onerror="this.src='/assets/images/team/default-avatar.jpg'">
                    </div>
                    <h3 class="member-name">${member.name}</h3>
                    <p class="member-role">${member.role}</p>
                    <div class="card-effects"></div>
                </div>
                <div class="card-back">
                    <ul class="expertise-list">
                        ${member.expertise.map(exp => `<li>${exp}</li>`).join('')}
                    </ul>
                    <p class="member-quote">${member.quote}</p>
                    <a href="${member.github}" class="github-link" target="_blank" rel="noopener noreferrer">
                        <i class="fab fa-github"></i>
                        GitHub Profile
                    </a>
                </div>
            </div>
        `).join('');
    }

    renderTechStack() {
        const technologies = [
            { name: 'JavaScript', icon: 'fab fa-js' },
            { name: 'WebSocket', icon: 'fas fa-plug' },
            { name: 'Node.js', icon: 'fab fa-node-js' },
            { name: 'PostgreSQL', icon: 'fas fa-database' },
            { name: 'Redis', icon: 'fas fa-server' },
            { name: 'OAuth', icon: 'fas fa-key' }
        ];

        return technologies.map(tech => `
            <div class="tech-item" data-tech="${tech.name}">
                <i class="${tech.icon}"></i>
                <span>${tech.name}</span>
            </div>
        `).join('');
    }

    initializeParticles(container) {
        const particlesContainer = container.querySelector('.particles-container');
        const createParticle = () => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.width = particle.style.height = Math.random() * 3 + 1 + 'px';
            particle.style.setProperty('--speed', Math.random() * 10 + 5 + 's');
            particlesContainer.appendChild(particle);

            particle.addEventListener('animationend', () => {
                particle.remove();
                createParticle();
            });
        };

        for (let i = 0; i < 50; i++) {
            createParticle();
        }
    }

    initializeMouseTrail(container) {
        const createTrailPoint = (x, y) => {
            const point = document.createElement('div');
            point.className = 'trail-point';
            point.style.left = x + 'px';
            point.style.top = y + 'px';
            container.appendChild(point);
            return point;
        };

        container.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const rect = container.getBoundingClientRect();
            const x = clientX - rect.left;
            const y = clientY - rect.top;

            if (Math.hypot(x - this.lastMousePos.x, y - this.lastMousePos.y) > 5) {
                const point = createTrailPoint(x, y);
                this.mouseTrail.push(point);
                this.lastMousePos = { x, y };

                if (this.mouseTrail.length > 20) {
                    const oldPoint = this.mouseTrail.shift();
                    oldPoint.remove();
                }

                setTimeout(() => {
                    const index = this.mouseTrail.indexOf(point);
                    if (index > -1) {
                        this.mouseTrail.splice(index, 1);
                        point.remove();
                    }
                }, 1000);
            }
        });
    }

    initializeCardFlip(container) {
        const cards = container.querySelectorAll('.member-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                card.classList.toggle('flipped');
            });

            // Add keyboard accessibility
            card.setAttribute('tabindex', '0');
            card.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.classList.toggle('flipped');
                }
            });
        });
    }

    initializeBackButton(container) {
        const backButton = container.querySelector('#back-to-landing');
        if (backButton) {
            backButton.addEventListener('click', () => {
                // Create and render the LandingPage
                const landingPage = new (window.app.LandingPage)(window.app);
                document.body.innerHTML = ''; // Clear current content
                landingPage.render();
                window.location.hash = '#/';
            });
        }
    }

    destroy() {
        // Clean up any event listeners or animations
        this.particles = [];
        this.mouseTrail.forEach(point => point.remove());
        this.mouseTrail = [];
    }
}