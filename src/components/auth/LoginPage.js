import { Component } from '../Component.js';
import { API_CONFIG } from '../../config/api.js';
import { stateService } from '../../services/StateService.js';

export class LoginPage extends Component {

    constructor() {
        super();
        this.state = {
            loading: false,
            error: null,
            currentTime: this.getCurrentTime(),
            particles: this.generateParticles(20)
        };
        
        // Check if already authenticated
        const authState = stateService.getState('auth');
        if (authState?.isAuthenticated) {
            window.app.router.navigateTo('/');
            return;
        }
        
        this.mount(document.getElementById('main-content'));
        this.startTimeUpdate();
    }

    getCurrentTime() {
        return new Date().toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    startTimeUpdate() {
        this.timeInterval = setInterval(() => {
            this.setState({ currentTime: this.getCurrentTime() });
        }, 1000);
    }

    generateParticles(count) {
        return Array(count).fill(null).map(() => ({
            top: Math.random() * 100,
            left: Math.random() * 100,
            delay: Math.random() * 20,
            size: Math.random() * 3 + 1
        }));
    }

    getCurrentTime() {
        const now = new Date();
        return {
            date: now.toISOString().split('T')[0],
            time: now.toTimeString().slice(0, 8), // HH:MM:SS format
            utc: true
        };
    }

    render() {
        const year = new Date().getFullYear();
        const now = new Date();
        const dateFormatted = now.toISOString().split('T')[0];
        const timeFormatted = now.toTimeString().split(' ')[0];
        
        return `
                <div class="login-page">
                <div class="cyber-grid"></div>
                ${this.renderParticles()}
                
                <!-- Enhanced Time Display -->
                <div class="time-display">
                    <div class="time-date">${this.state.currentTime.date}</div>
                    <div class="time-clock">
                        ${this.state.currentTime.time}
                        <span class="time-utc">UTC</span>
                    </div>
                    <div class="time-user">@Sdiabate1337</div>
                </div>
                
                <div class="login-container">
                    <div class="login-header">
                        <div class="logo-container">
                            <div class="logo-ping">PING</div>
                            <div class="logo-pong">PONG</div>
                            <div class="logo-year">${year}</div>
                        </div>
                        <p class="login-subtitle">The Future of Table Tennis</p>
                    </div>

                    <div class="login-body">
                        ${this.state.error ? `
                            <div class="login-error" role="alert">
                                <svg class="error-icon" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                                </svg>
                                <span>${this.state.error}</span>
                            </div>
                        ` : ''}

                        <button id="login-42" class="login-button primary-button" 
                                ${this.state.loading ? 'disabled' : ''}>
                            ${this.state.loading ? this.renderLoadingSpinner() : this.render42LoginButton()}
                        </button>

                        <div class="dev-login">
                            <div class="divider">
                                <span>Quick Access</span>
                            </div>
                            <button id="mock-login" class="login-button mock-button"
                                    ${this.state.loading ? 'disabled' : ''}>
                                <span class="button-content">
                                    <svg class="dev-icon" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5zm4 4h-2v-2h2v2zm0-4h-2V7h2v5z"/>
                                    </svg>
                                    <span>Development Mode</span>
                                </span>
                            </button>
                        </div>
                    </div>

                    <div class="login-footer">
                        <p class="version-info">v2.5.0</p>
                        <p class="copyright">© ${year} Transcendence. All rights reserved.</p>
                    </div>
                </div>
            </div>
        `;
    }

    renderParticles() {
        return `
            <div class="particles">
                ${this.state.particles.map(p => `
                    <div class="particle" 
                         style="top: ${p.top}%; 
                                left: ${p.left}%; 
                                animation-delay: ${p.delay}s;
                                width: ${p.size}px;
                                height: ${p.size}px;">
                    </div>
                `).join('')}
            </div>
        `;
    }

    render42LoginButton() {
        return `
            <span class="button-content">
                <svg class="ft-icon" viewBox="0 0 24 24">
                    <path d="M12 2L2 19h20L12 2zm0 3l7.5 13h-15L12 5z"/>
                </svg>
                <span>Connect with 42</span>
            </span>
        `;
    }

    renderLoadingSpinner() {
        return `
            <div class="spinner">
                <div class="spinner-inner"></div>
            </div>
        `;
    }

    afterMount() {
        const mockLoginBtn = document.getElementById('mock-login');
        if (mockLoginBtn) {
            mockLoginBtn.addEventListener('click', () => this.handleMockLogin());
        }

        const loginBtn = document.getElementById('login-42');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.handle42Login());
        }

        // Add hover effects
        this.addButtonHoverEffects();
    }

    addButtonHoverEffects() {
        const buttons = document.querySelectorAll('.login-button');
        buttons.forEach(button => {
            button.addEventListener('mouseover', this.createButtonHoverEffect);
            button.addEventListener('mouseleave', this.removeButtonHoverEffect);
        });
    }

    createButtonHoverEffect(e) {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        button.style.setProperty('--x', `${x}px`);
        button.style.setProperty('--y', `${y}px`);
        button.classList.add('button-hover');
    }

    removeButtonHoverEffect(e) {
        e.currentTarget.classList.remove('button-hover');
    }

    async handleMockLogin() {
        try {
            this.setState({ loading: true, error: null });

            await new Promise(resolve => setTimeout(resolve, 1500));

            const mockUser = {
                id: `dev_${Date.now()}`,
                login: 'Sdiabate1337',
                displayName: 'Development Champion',
                avatar: 'https://cdn.intra.42.fr/users/default.png',
                email: 'dev@42.fr',
                status: 'online',
                wins: Math.floor(Math.random() * 50),
                losses: Math.floor(Math.random() * 20),
                rank: 'Pro Player'
            };

            localStorage.setItem('auth_token', `mock_${Date.now()}`);
            localStorage.setItem('mock_user', JSON.stringify(mockUser));

            stateService.setState('auth', {
                isAuthenticated: true,
                user: mockUser,
                loading: false
            });

            window.app.router.navigateTo('/');

        } catch (error) {
            console.error('Mock login failed:', error);
            this.setState({ 
                error: 'Authentication failed. Please try again.',
                loading: false 
            });
        }
    }

    handle42Login() {
        const clientId = API_CONFIG.OAUTH?.CLIENT_ID;
        if (!clientId) {
            this.setState({ 
                error: '42 OAuth configuration is missing. Please check your setup.' 
            });
            return;
        }

        const redirectUri = `${window.location.origin}/auth/callback`;
        const state = this.generateState();
        
        localStorage.setItem('oauth_state', state);
        
        const authUrl = new URL('https://api.intra.42.fr/oauth/authorize');
        authUrl.searchParams.append('client_id', clientId);
        authUrl.searchParams.append('redirect_uri', redirectUri);
        authUrl.searchParams.append('response_type', 'code');
        authUrl.searchParams.append('state', state);
        authUrl.searchParams.append('scope', 'public');

        window.location.href = authUrl.toString();
    }

    generateState() {
        return Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    destroy() {
        clearInterval(this.timeInterval);
        super.destroy?.();
    }
}