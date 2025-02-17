import { LoginPage } from './components/auth/LoginPage.js';
import { API_CONFIG } from './config/api.js';
import { RouterService } from './services/RouterService.js';
import { stateService } from './services/StateService.js';
import { LandingPage } from './components/LandingPage.js';

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
            // Hide navigation for non-authenticated users
            this.toggleNavigation(false);
        }
    }


    initializeRouter() {
        // Update routes to handle landing page
        this.router.addRoute('/', () => {
            const authState = stateService.getState('auth');
            if (!authState.isAuthenticated) {
                return new LandingPage();
            }
            return this.loadHomePage();
        });
        
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
                // Show navigation for authenticated users
                this.toggleNavigation(true);
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
        this.toggleNavigation(false);
        this.router.navigateTo('/');
    }

    toggleNavigation(show) {
        const nav = document.getElementById('main-nav');
        if (nav) {
            nav.style.display = show ? 'block' : 'none';
        }
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

    loadHomePage() {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;

        const authState = stateService.getState('auth');
        const user = authState.user || { login: 'Sdiabate1337' };

        mainContent.innerHTML = `
            <div class="home-page authenticated">
                <aside class="sidebar">
                    <div class="user-profile">
                        <div class="user-avatar">
                            <img src="${user.avatar || 'assets/images/default-avatar.png'}" alt="Profile">
                        </div>
                        <h3 class="user-name">${user.login}</h3>
                    </div>
                    <nav class="sidebar-nav">
                        <a href="/profile" data-route="/profile" class="nav-item">
                            <span class="nav-icon">👤</span>
                            Profile
                        </a>
                        <a href="/game" data-route="/game" class="nav-item">
                            <span class="nav-icon">🎮</span>
                            Game
                        </a>
                        <a href="/chat" data-route="/chat" class="nav-item">
                            <span class="nav-icon">💬</span>
                            Chat
                        </a>
                        <a href="/settings" data-route="/settings" class="nav-item">
                            <span class="nav-icon">⚙️</span>
                            Settings
                        </a>
                    </nav>
                </aside>
                <main class="main-content">
                    <h1>Welcome back, ${user.login}!</h1>
                    <div class="quick-stats">
                        <!-- Add your stats here -->
                    </div>
                </main>
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