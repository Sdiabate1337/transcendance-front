import { LoginPage } from './auth/LoginPage.js';
import AboutPage from './AboutPage.js';

export class LandingPage {
    constructor(app) {
        this.app = app;
        this.isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        this.render();
        this.initialize();
        this.loginComponent = new LoginPage();
        window.app.toggleLogin = this.toggleLogin.bind(this);
    }

    toggleLogin() {
        this.setState({ showLogin: !this.state.showLogin });
        document.querySelector('.landing-page').classList.toggle('blurred');
    }

    render() {
        const container = document.createElement('div');
        container.className = 'landing-container';
        container.innerHTML = `
            <div class="grid-overlay"></div>
            <div class="cyber-particles"></div>
            <header class="landing-header">
                <div class="header-logo">FT_TRANSCENDENCE</div>
                <button class="ft-button about-button" id="about-us-btn">
                    <span class="button-icon">ℹ️</span>
                    About Us
                </button>
            </header>
            <div class="landing-content">
                <div class="content-left">
                    <div class="brand-section">
                        <h1 class="brand-name">FT_TRANSCENDENCE</h1>
                        <h2 class="main-heading">WEB-BASED PING-PONG GAME PLATFORM</h2>
                        <p class="secondary-text">Join the ultimate ping-pong gaming community. Play with players from all over the world in real-time.</p>

                        <div class="auth-buttons">
                            <button class="ft-button auth-button" id="login42-btn">
                                <span class="button-icon">🎮</span>
                                Login with 42
                            </button>
                            ${this.isDevelopment ? `
                                <button class="ft-button auth-button dev-login-btn" id="dev-login-btn">
                                    <span class="button-icon">👨‍💻</span>
                                    Dev Login
                                </button>
                            ` : ''}
                        </div>

                        <div class="features-grid">
                            <div class="feature">
                                <span class="feature-icon">⚡</span>
                                <span class="feature-text">Real-time Gameplay</span>
                            </div>
                            <div class="feature">
                                <span class="feature-icon">🏆</span>
                                <span class="feature-text">Competitive Ranking</span>
                            </div>
                            <div class="feature">
                                <span class="feature-icon">💬</span>
                                <span class="feature-text">Live Chat</span>
                            </div>
                            <div class="feature">
                                <span class="feature-icon">🎨</span>
                                <span class="feature-text">Custom Themes</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="right-section">
                    <div class="illustration-container">
                        <div class="ping-pong-table">
                            <div class="table-surface">
                                <div class="net"></div>
                                <div class="ball"></div>
                                <div class="paddle left-paddle"></div>
                                <div class="paddle right-paddle"></div>
                                <div class="glow-line"></div>
                            </div>
                            <div class="reflection"></div>
                        </div>
                        <div class="neon-grid">
                            <div class="grid-line horizontal"></div>
                            <div class="grid-line vertical"></div>
                            <div class="grid-line diagonal"></div>
                        </div>
                        <div class="floating-elements">
                            <div class="cyber-element circle"></div>
                            <div class="cyber-element square"></div>
                            <div class="cyber-element triangle"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.initializeAnimations(container);
        document.querySelector('#app').innerHTML = container.outerHTML;
    }

    initializeAnimations(container) {
        // Ball animation
        const ball = container.querySelector('.ball');
        const leftPaddle = container.querySelector('.left-paddle');
        const rightPaddle = container.querySelector('.right-paddle');
        
        // Animate ball movement
        let ballX = 50;
        let ballY = 50;
        let directionX = 1;
        let directionY = 1;
        
        function animateBall() {
            ballX += directionX;
            ballY += directionY;
            
            if (ballX >= 90 || ballX <= 10) {
                directionX *= -1;
                // Animate paddle
                if (ballX >= 90) {
                    rightPaddle.style.transform = 'translateY(20px)';
                    setTimeout(() => rightPaddle.style.transform = 'translateY(0)', 200);
                } else {
                    leftPaddle.style.transform = 'translateY(20px)';
                    setTimeout(() => leftPaddle.style.transform = 'translateY(0)', 200);
                }
            }
            if (ballY >= 90 || ballY <= 10) directionY *= -1;
            
            ball.style.left = `${ballX}%`;
            ball.style.top = `${ballY}%`;
            
            requestAnimationFrame(animateBall);
        }
        
        animateBall();

        // Animate floating elements
        const elements = container.querySelectorAll('.cyber-element');
        elements.forEach((element, index) => {
            element.style.animation = `float ${3 + index}s ease-in-out infinite alternate`;
        });
    }

    initialize() {
        this.initializeParticles();
        this.attachEventListeners();
        const aboutBtn = document.getElementById('about-us-btn');
        if (aboutBtn) {
            aboutBtn.addEventListener('click', async () => {
                // Create and render the AboutPage
                const aboutPage = new AboutPage();
                document.body.innerHTML = ''; // Clear current content
                const aboutContent = await aboutPage.render();
                document.body.appendChild(aboutContent);
                window.location.hash = '#/about';
            });
        }
    }

    initializeParticles() {
        const particlesContainer = document.querySelector('.cyber-particles');
        if (!particlesContainer) return;

        const createParticle = () => {
            const particle = document.createElement('div');
            particle.className = 'cyber-particle';
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
            particle.style.opacity = Math.random() * 0.5 + 0.5;
            particlesContainer.appendChild(particle);

            particle.addEventListener('animationend', () => {
                particle.remove();
                createParticle();
            });
        };

        // Create initial particles
        for (let i = 0; i < 50; i++) {
            createParticle();
        }
    }

    attachEventListeners() {
        console.log('Attaching event listeners');
        
        // Login with 42
        const login42Btn = document.getElementById('login42-btn');
        if (login42Btn) {
            console.log('Found 42 login button');
            login42Btn.addEventListener('click', () => {
                window.location.href = this.getOAuthURL();
            });
        }

        // Dev Login
        const devLoginBtn = document.getElementById('dev-login-btn');
        if (devLoginBtn) {
            console.log('Found dev login button');
            devLoginBtn.addEventListener('click', async () => {
                console.log('Dev login clicked');
                try {
                    const success = await this.app.stateService.loginWithMockUser();
                    console.log('Login result:', success);
                    if (success) {
                        this.app.routerService.navigateTo('/home');
                    }
                } catch (error) {
                    console.error('Dev login error:', error);
                }
            });
        } else if (this.isDevelopment) {
            console.warn('Dev login button not found even though in development mode');
        }
    }

    getOAuthURL() {
        const clientId = '42-oauth-client-id';
        const redirectUri = encodeURIComponent(window.location.origin + '/auth/42/callback');
        const scope = 'public';
        
        return `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
    }

    destroy() {
        // Cleanup event listeners if needed
        const login42Btn = document.getElementById('login42-btn');
        const devLoginBtn = document.getElementById('dev-login-btn');

        if (login42Btn) {
            login42Btn.replaceWith(login42Btn.cloneNode(true));
        }
        if (devLoginBtn) {
            devLoginBtn.replaceWith(devLoginBtn.cloneNode(true));
        }
    }

    handleDevLogin() {
        const mockUser = {
            id: 1,
            username: 'mock_user',
            email: 'mock@42.fr',
            avatar: 'https://avatars.githubusercontent.com/u/1234567?v=4',
            stats: {
                matches: 10,
                wins: 7,
                rank: 42
            }
        };
        
        if (this.app && this.app.stateService) {
            this.app.stateService.loginWithMockUser(mockUser);
            this.app.routerService.navigateTo('/home');
        }
    }

    handle42Login() {
        const clientId = '42-oauth-client-id'; // Replace with your actual 42 OAuth client ID
        const redirectUri = encodeURIComponent(window.location.origin + '/auth/42/callback');
        const scope = 'public';
        
        const authUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
        
        window.location.href = authUrl;
    }
}