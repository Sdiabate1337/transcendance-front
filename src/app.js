import { LoginPage } from './components/auth/LoginPage.js';
import { API_CONFIG } from './config/api.js';
import { RouterService } from './services/RouterService.js';
import { StateService } from './services/StateService.js';
import { LandingPage } from './components/LandingPage.js';
import { HomePage } from './components/HomePage.js';
import AboutPage from './components/AboutPage.js';

export class App {
    constructor() {
        this.stateService = new StateService();
        this.routerService = new RouterService(this);
        this.currentPage = null;
        this.appContainer = document.getElementById('app');
        
        this.initialize();
    }

    async initialize() {
        // Handle 42 OAuth callback
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (code) {
            await this.handle42Callback(code);
        } else {
            this.routerService.handleRoute();
        }

        // Initialize error boundary
        window.onerror = (message, source, lineno, colno, error) => {
            console.error('Global error:', { message, source, lineno, colno, error });
            this.handleError(error);
        };

        // Listen for state changes
        this.stateService.subscribe(() => {
            this.updateUI();
        });
    }

    async handle42Callback(code) {
        try {
            const success = await this.stateService.login42(code);
            if (success) {
                // Clear the URL parameters
                window.history.replaceState({}, document.title, '/');
                this.routerService.navigateTo('/home');
            } else {
                this.routerService.navigateTo('/');
            }
        } catch (error) {
            this.handleError(error);
            this.routerService.navigateTo('/');
        }
    }

    setCurrentPage(page) {
        if (this.currentPage && this.currentPage.destroy) {
            this.currentPage.destroy();
        }

        // Clear the app container
        if (this.appContainer) {
            this.appContainer.innerHTML = '';
        }

        this.currentPage = page;
        
        // Render the new page
        if (this.currentPage && this.currentPage.render) {
            const content = this.currentPage.render();
            if (content && this.appContainer) {
                if (typeof content === 'string') {
                    this.appContainer.innerHTML = content;
                } else if (content instanceof HTMLElement) {
                    this.appContainer.appendChild(content);
                }
            }
        }

        // Initialize the new page
        if (this.currentPage && this.currentPage.initialize) {
            this.currentPage.initialize();
        }

        // Hide debug panel by default
        this.hideDebugPanel();
    }

    handleError(error) {
        console.error('Application error:', error);
        this.showDebugPanel();
    }

    showDebugPanel() {
        const debugPanel = document.getElementById('debug-panel');
        if (debugPanel) {
            const route = document.getElementById('debug-route');
            const state = document.getElementById('debug-state');
            const websocket = document.getElementById('debug-websocket');
            const time = document.getElementById('debug-time');

            route.textContent = window.location.pathname;
            state.textContent = JSON.stringify(this.stateService.getState());
            websocket.textContent = 'Disconnected';
            time.textContent = new Date().toISOString();

            debugPanel.style.display = 'block';
        }
    }

    hideDebugPanel() {
        const debugPanel = document.getElementById('debug-panel');
        if (debugPanel) {
            debugPanel.style.display = 'none';
        }
    }

    updateUI() {
        // Update navigation visibility based on auth state
        const mainNav = document.getElementById('main-nav');
        if (mainNav) {
            mainNav.style.display = this.stateService.isAuthenticated() ? 'block' : 'none';
        }

        // Update current page if needed
        if (this.currentPage && this.currentPage.update) {
            this.currentPage.update(this.stateService.getState());
        }
    }
}

// Initialize the application
window.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});