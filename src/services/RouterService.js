export class RouterService {


    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            this.handleRoute(window.location.pathname, false);
        });

        // Handle OAuth callback
        if (window.location.pathname.startsWith('/auth/callback')) {
            this.handleAuthCallback();
        }
    }

    navigateTo(path, pushState = true) {
        if (pushState) {
            // Add to browser history
            window.history.pushState({ path }, '', path);
        }
        this.handleRoute(path);
    }

    handleRoute(path) {
        const route = this.routes.get(path) || this.routes.get('/404');
        if (!route) {
            this.navigateTo('/404');
            return;
        }

        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;

        // Clear and update content
        mainContent.innerHTML = '';
        
        try {
            // Execute component function and get content
            const content = route.component();
            
            // Only update if we got content back
            // (protected routes might return empty and handle redirect themselves)
            if (content) {
                mainContent.innerHTML = content;
            }

            // Update current route
            this.currentRoute = path;

            // Scroll to top
            window.scrollTo(0, 0);
        } catch (error) {
            console.error('Error rendering route:', error);
            this.navigateTo('/404');
        }
    }



    addRoute(path, component, requiresAuth = false) {
        if (requiresAuth) {
            this.routes.set(path, ProtectedRoute.guard(component));
        } else {
            this.routes.set(path, component);
        }
    }

    async handleAuthCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');

        if (!code || !state) {
            this.navigateTo('/login');
            return;
        }

        try {
            // Show loading state
            this.showAuthLoading();

            // Verify CSRF token
            const storedState = localStorage.getItem('csrf_token');
            if (state !== storedState) {
                throw new Error('Invalid state token');
            }

            // Handle OAuth callback
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.AUTH.CALLBACK}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code })
            });

            const data = await response.json();

            if (data.requires2FA) {
                this.navigateTo('/2fa');
            } else {
                // Complete auth
                localStorage.setItem('auth_token', data.token);
                const redirect = localStorage.getItem('auth_redirect') || '/';
                localStorage.removeItem('auth_redirect');
                this.navigateTo(redirect);
            }
        } catch (error) {
            console.error('Auth callback failed:', error);
            this.navigateTo('/login');
        } finally {
            this.hideAuthLoading();
            localStorage.removeItem('csrf_token');
        }
    }

    showAuthLoading() {
        const loading = document.createElement('div');
        loading.className = 'auth-loading';
        loading.innerHTML = `
            <div class="auth-loading__content">
                <div class="auth-loading__spinner"></div>
                <p>Authenticating...</p>
            </div>
        `;
        document.body.appendChild(loading);
    }

    hideAuthLoading() {
        const loading = document.querySelector('.auth-loading');
        if (loading) {
            loading.remove();
        }
    }
}