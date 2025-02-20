export class RouterService {
    constructor(app) {
        this.app = app;
        this.routes = {
            '/': () => this.showLandingPage(),
            '/login': () => this.showLoginPage(),
            '/home': () => this.showHomePage('profile'), // Default sub-route
            '/home/profile': () => this.showHomePage('profile'),
            '/home/play': () => this.showHomePage('play'),
            '/home/leaderboard': () => this.showHomePage('leaderboard'),
            '/home/chat': () => this.showHomePage('chat'),
            '/home/settings': () => this.showHomePage('settings'),
            '/about': () => this.showAboutPage()
        };

        this.protectedPaths = ['/home', '/home/profile', '/home/play', '/home/leaderboard', '/home/chat', '/home/settings'];
        // Add cache clearing method to window for debug purposes
        window.clearNavigationCache = () => this.clearNavigationCache();
        this.currentPage = null;
        this.initializeRouter();
    }

     // Add this method to clear navigation cache
     clearNavigationCache() {
        if (window.performance && window.performance.navigation) {
            console.log('Clearing navigation cache...');
            
            // Clear application cache
            if (window.applicationCache) {
                window.applicationCache.delete();
            }
            
            // Clear service workers
            if (navigator.serviceWorker) {
                navigator.serviceWorker.getRegistrations().then(registrations => {
                    registrations.forEach(registration => {
                        registration.unregister();
                    });
                });
            }
            
            // Clear browser back/forward cache (bfcache)
            window.onunload = () => {};
            
            // Reload the page without cache
            window.location.reload(true);
        }
    }

    initializeRouter() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => this.handleRoute());

        // Handle clicks on elements with data-route attribute
        document.addEventListener('click', (e) => {
            const routeElement = e.target.closest('[data-route]');
            if (routeElement) {
                e.preventDefault();
                const route = routeElement.getAttribute('data-route');
                this.navigateTo(route);
            }
        });

        // Initial route handling
        this.handleRoute();
    }

    navigateTo(route) {
        window.history.pushState(null, null, route);
        this.handleRoute();
    }

    handleRoute() {
        const path = window.location.pathname;
        
        // Check if the route is protected
        if (this.isProtectedRoute(path)) {
            if (!this.app.stateService.isAuthenticated()) {
