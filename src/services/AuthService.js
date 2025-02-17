import { API_CONFIG } from '../config/api.js';
import { stateService } from './StateService.js';

export class AuthService {
    constructor() {
        this.init();
    }

    init() {
        // Check for existing session
        this.checkAuthState();
        
        // Listen for auth state changes
        stateService.subscribe('auth', (authState) => {
            this.handleAuthStateChange(authState);
        });
    }

    async checkAuthState() {
        try {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                this.setAuthState(false, null);
                return;
            }

            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.AUTH.CHECK}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.setAuthState(true, data.user);
            } else {
                this.logout();
            }
        } catch (error) {
            console.error('Auth state check failed:', error);
            this.logout();
        }
    }

    setAuthState(isAuthenticated, user) {
        stateService.setState('auth', {
            isAuthenticated,
            user,
            loading: false
        });
    }

    handleAuthStateChange(authState) {
        // Update UI based on auth state
        document.body.classList.toggle('authenticated', authState.isAuthenticated);
        
        // Update navigation
        this.updateNavigation(authState.isAuthenticated);
    }

    updateNavigation(isAuthenticated) {
        const authNav = document.getElementById('auth-nav');
        if (authNav) {
            authNav.innerHTML = isAuthenticated ? this.getAuthenticatedNav() : this.getUnauthenticatedNav();
        }
    }

    getAuthenticatedNav() {
        const user = stateService.getState('auth').user;
        return `
            <div class="user-menu">
                <img src="${user.avatar}" alt="${user.username}" class="avatar">
                <div class="dropdown">
                    <button class="dropdown-toggle">${user.username}</button>
                    <div class="dropdown-menu">
                        <a href="/profile" data-route="/profile">Profile</a>
                        <a href="/settings" data-route="/settings">Settings</a>
                        <button onclick="window.authService.logout()">Logout</button>
                    </div>
                </div>
            </div>
        `;
    }

    getUnauthenticatedNav() {
        return `
            <button onclick="window.authService.login42()" class="login-button">
                Login with 42
            </button>
        `;
    }

    async login42() {
        try {
            // Store current URL for redirect after auth
            localStorage.setItem('auth_redirect', window.location.pathname);
            
            // Generate and store CSRF token
            const csrf_token = this.generateCSRFToken();
            localStorage.setItem('csrf_token', csrf_token);

            // Redirect to 42 OAuth
            const authUrl = new URL(`${API_CONFIG.BASE_URL}${API_CONFIG.AUTH.LOGIN}`);
            authUrl.searchParams.append('csrf_token', csrf_token);
            window.location.href = authUrl.toString();
        } catch (error) {
            console.error('Login failed:', error);
            this.handleAuthError(error);
        }
    }

    async handle42Callback(code, state) {
        try {
            // Verify CSRF token
            const stored_token = localStorage.getItem('csrf_token');
            if (state !== stored_token) {
                throw new Error('Invalid CSRF token');
            }

            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.AUTH.CALLBACK}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code })
            });

            const data = await response.json();

            if (data.requires2FA) {
                // Show 2FA prompt
                this.show2FAPrompt();
            } else {
                // Complete authentication
                this.completeAuthentication(data);
            }
        } catch (error) {
            console.error('Auth callback failed:', error);
            this.handleAuthError(error);
        } finally {
            // Clean up CSRF token
            localStorage.removeItem('csrf_token');
        }
    }

    show2FAPrompt() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Two-Factor Authentication</h2>
                <p>Please enter the code from your authenticator app</p>
                <input type="text" id="2fa-code" maxlength="6" pattern="[0-9]*">
                <button onclick="window.authService.verify2FA()">Verify</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    async verify2FA() {
        try {
            const code = document.getElementById('2fa-code').value;
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.AUTH.TWO_FACTOR}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code })
            });

            const data = await response.json();
            if (response.ok) {
                this.completeAuthentication(data);
            } else {
                throw new Error(data.message || 'Invalid 2FA code');
            }
        } catch (error) {
            console.error('2FA verification failed:', error);
            this.handleAuthError(error);
        }
    }

    completeAuthentication(data) {
        // Store auth token
        localStorage.setItem('auth_token', data.token);
        
        // Update auth state
        this.setAuthState(true, data.user);

        // Redirect to original destination
        const redirect = localStorage.getItem('auth_redirect') || '/';
        localStorage.removeItem('auth_redirect');
        window.location.href = redirect;
    }

    logout() {
        localStorage.removeItem('auth_token');
        this.setAuthState(false, null);
        window.location.href = '/';
    }

    handleAuthError(error) {
        // Show error notification
        const notification = document.createElement('div');
        notification.className = 'notification error';
        notification.textContent = error.message || 'Authentication failed';
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => notification.remove(), 5000);
    }

    generateCSRFToken() {
        return Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }
}

// Initialize auth service globally
window.authService = new AuthService();