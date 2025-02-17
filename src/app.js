import { LoginPage } from './components/auth/LoginPage.js';
import { API_CONFIG } from './config/api.js';
import { RouterService } from './services/RouterService.js';
import { stateService } from './services/StateService.js';

console.log('App.js loaded');


class App {

    
    constructor() {
        console.log('App initializing...');
        try {
            this.initializeAuthState();
            this.router = new RouterService();
            this.initializeRouter();
            this.setupEventListeners();
            console.log('App initialized successfully');
        } catch (error) {
            console.error('App initialization failed:', error);
        }
    }

    initializeAuthState() {
        stateService.setState('auth', {
            isAuthenticated: false,
            user: null,
            loading: true
        });

        // Check for stored auth token
        const token = localStorage.getItem('auth_token');
        if (token) {
            this.checkAuthStatus(token);
        } else {
            stateService.setState('auth', {
                isAuthenticated: false,
                user: null,
                loading: false
            });
        }
    }

    initializeRouter() {
        // Add routes
        this.router.addRoute('/', () => this.loadHomePage());
        this.router.addRoute('/login', () => new LoginPage());
        this.router.addRoute('/game', () => this.loadGamePage(), true);
        this.router.addRoute('/chat', () => this.loadChatPage(), true);
        this.router.addRoute('/profile', () => this.loadProfilePage(), true);
        this.router.addRoute('/404', () => this.load404Page());

        // Handle initial route
        const path = window.location.pathname;
        this.router.navigateTo(path, false);
    }

    async checkAuthStatus(token) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.AUTH.CHECK}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                stateService.setState('auth', {
                    isAuthenticated: true,
                    user: data.user,
                    loading: false
                });
            } else {
                this.handleLogout();
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            this.handleLogout();
        }
    }

    handleLogout() {
        localStorage.removeItem('auth_token');
        stateService.setState('auth', {
            isAuthenticated: false,
            user: null,
            loading: false
        });
        this.router.navigateTo('/login');
    }

    setupEventListeners() {
        // Handle theme toggle
        const themeButton = document.getElementById('high-contrast');
        if (themeButton) {
            themeButton.addEventListener('click', () => {
                document.body.classList.toggle('high-contrast');
            });
        }

        // Handle font size changes
        const fontButton = document.getElementById('font-size');
        if (fontButton) {
            fontButton.addEventListener('click', () => {
                const sizes = ['small', 'medium', 'large'];
                const currentSize = document.body.dataset.fontSize || 'medium';
                const currentIndex = sizes.indexOf(currentSize);
                const newSize = sizes[(currentIndex + 1) % sizes.length];
                document.body.dataset.fontSize = newSize;
            });
        }
    }

    // Page rendering methods
    loadHomePage() {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;

        mainContent.innerHTML = `
            <div class="home-page">
                <h1>Welcome to Transcendence</h1>
                <div class="menu-options">
                    <a href="/game" data-route="/game" class="menu-button">Play Game</a>
                    <a href="/chat" data-route="/chat" class="menu-button">Chat</a>
                </div>
            </div>
        `;
    }

    // ... (rest of your page loading methods)
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});

export default App;