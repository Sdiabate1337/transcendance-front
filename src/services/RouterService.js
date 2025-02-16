export class RouterService {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            this.handleRoute(window.location.pathname, false);
        });
    }

    addRoute(path, component) {
        this.routes.set(path, component);
    }

    navigateTo(path, pushState = true) {
        if (pushState) {
            // Add to browser history
            window.history.pushState({ path }, '', path);
        }
        this.handleRoute(path);
    }

    handleRoute(path) {
        const component = this.routes.get(path) || this.routes.get('/404');
        const mainContent = document.getElementById('main-content');
        
        // Clear and update content
        mainContent.innerHTML = '';
        component();

        // Update current route
        this.currentRoute = path;

        // Scroll to top
        window.scrollTo(0, 0);
    }
}