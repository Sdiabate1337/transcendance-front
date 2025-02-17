import { API_CONFIG } from '../../config/api.js';
import { stateService } from '../../services/StateService.js';

export class LoginPage {
    constructor() {
        this.render();
    }

    render() {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;

        mainContent.innerHTML = `
            <div class="login-page">
                <div class="login-container">
                    <h1>Welcome to Transcendence</h1>
                    <p>Please sign in to continue</p>
                    <button id="login-42" class="login-button">
                        <img src="assets/images/42-logo.svg" alt="42 logo" class="login-icon">
                        Sign in with 42
                    </button>
                    <div id="login-error" class="login-error" style="display: none;"></div>
                    ${API_CONFIG.USE_MOCK ? this.renderDevLogin() : ''}
                </div>
            </div>
        `;

        this.setupEventListeners();
    }

    renderDevLogin() {
        return `
            <div class="dev-login">
                <hr class="divider">
                <h3>Development Login</h3>
                <p class="dev-note">Backend not connected. Using mock data.</p>
                <button id="mock-login" class="login-button mock">
                    Login as Test User
                </button>
            </div>
        `;
    }

    setupEventListeners() {
        const loginButton = document.getElementById('login-42');
        if (loginButton) {
            loginButton.addEventListener('click', async (e) => {
                e.preventDefault();
                if (API_CONFIG.USE_MOCK) {
                    this.showError('Backend not available. Use the test user login below.');
                } else {
                    await this.handleLogin();
                }
            });
        }

        // Development mock login
        const mockLoginButton = document.getElementById('mock-login');
        if (mockLoginButton) {
            mockLoginButton.addEventListener('click', () => this.handleMockLogin());
        }
    }

    async handleLogin() {
        try {
            // Clear any previous errors
            this.hideError();
            
            const csrfToken = this.generateCSRFToken();
            localStorage.setItem('csrf_token', csrfToken);

            // In real implementation, this would redirect to 42's OAuth
            const authUrl = new URL(`${API_CONFIG.BASE_URL}${API_CONFIG.AUTH.LOGIN}`);
            authUrl.searchParams.append('csrf_token', csrfToken);
            window.location.href = authUrl.toString();
        } catch (error) {
            console.error('Login failed:', error);
            this.showError('Authentication service unavailable');
        }
    }

    async handleMockLogin() {
        try {
            // Simulate login delay
            const mockLoginButton = document.getElementById('mock-login');
            mockLoginButton.disabled = true;
            mockLoginButton.textContent = 'Logging in...';

            await new Promise(resolve => setTimeout(resolve, 1000));

            // Set mock auth data
            localStorage.setItem('auth_token', 'mock_token_123');
            stateService.setState('auth', {
                isAuthenticated: true,
                user: API_CONFIG.MOCK_DATA.user,
                loading: false
            });

            // Redirect to home
            window.location.href = '/';
        } catch (error) {
            console.error('Mock login failed:', error);
            this.showError('Failed to login as test user');
        }
    }

    generateCSRFToken() {
        return Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    showError(message) {
        const errorElement = document.getElementById('login-error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    hideError() {
        const errorElement = document.getElementById('login-error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }
}