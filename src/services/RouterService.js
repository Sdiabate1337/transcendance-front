export class RouterService {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        
        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            this.handleRoute(window.location.pathname, false);
        });
    }

    addRoute(path, component, requiresAuth = false) {
        this.routes.set(path, { component, requiresAuth });
    }

    navigateTo(path, addToHistory = true) {
        if (addToHistory) {
            window.history.pushState({ path }, '', path);
        }
        this.handleRoute(path);
    }

    handleRoute(path) {
        // Update debug panel
        const debugRoute = document.getElementById('current-route');
        if (debugRoute) {
            debugRoute.textContent = `Current Route: ${path}`;
        }

        // Get route configuration
        const route = this.routes.get(path) || this.routes.get('/404');
        if (!route) {
            this.navigateTo('/404');
            return;
        }

        // Check auth for protected routes
        if (route.requiresAuth) {
            const authState = window.app.getAuthState();
            if (!authState.isAuthenticated) {
                // Store attempted path
                localStorage.setItem('auth_redirect', path);
                this.navigateTo('/login');
                return;
            }
        }

        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;

        try {
            // Show loading state
            this.showLoading();

            // Execute component
            if (typeof route.component === 'function') {
                route.component();
            }

            // Update current route
            this.currentRoute = path;

            // Scroll to top
            window.scrollTo(0, 0);
        } catch (error) {
            console.error('Error rendering route:', error);
            this.showError('Failed to load page');
            this.navigateTo('/404');
        } finally {
            // Hide loading state
            this.hideLoading();
        }
    }

    showLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.display = 'flex';
        }
    }

    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    showError(message) {
        const errorBoundary = document.getElementById('error-boundary');
        const errorMessage = document.getElementById('error-message');
        if (errorBoundary && errorMessage) {
            errorMessage.textContent = message;
            errorBoundary.style.display = 'flex';
        }
    }

    getCurrentRoute() {
        return this.currentRoute;
    }
}