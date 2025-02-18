export class RouterService {
    constructor(app) {
        this.app = app;
        this.routes = {
            '/': () => this.showLandingPage(),
            '/login': () => this.showLoginPage(),
            '/home': () => this.showHomePage(),
            '/about': () => this.showAboutPage()
        };

        this.protectedRoutes = ['/home'];
        this.initializeRouter();
    }

    initializeRouter() {
        window.addEventListener('popstate', () => this.handleRoute());
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-route]')) {
                e.preventDefault();
                this.navigateTo(e.target.getAttribute('data-route'));
            }
        });
    }

    navigateTo(route) {
        window.history.pushState(null, null, route);
        this.handleRoute();
    }

    handleRoute() {
        const path = window.location.pathname;
        
        // Check if route is protected
        if (this.protectedRoutes.includes(path)) {
            if (!this.app.stateService.isAuthenticated()) {
                console.log('Access denied: Authentication required');
                this.navigateTo('/');
                return;
            }
        }

        const route = this.routes[path] || this.routes['/'];
        route();
    }

    showLandingPage() {
        // If user is authenticated, redirect to home
        if (this.app.stateService.isAuthenticated()) {
            this.navigateTo('/home');
            return;
        }
        
        import('../components/LandingPage.js').then(module => {
            const landingPage = new module.LandingPage(this.app);
            this.app.setCurrentPage(landingPage);
            
            // Hide debug panel when showing landing page
            const debugPanel = document.getElementById('debug-panel');
            if (debugPanel) {
                debugPanel.style.display = 'none';
            }
        });
    }

    showLoginPage() {
        // If user is authenticated, redirect to home
        if (this.app.stateService.isAuthenticated()) {
            this.navigateTo('/home');
            return;
        }

        import('../components/LoginPage.js').then(module => {
            const loginPage = new module.LoginPage(this.app);
            this.app.setCurrentPage(loginPage);
        });
    }

    showHomePage() {
        import('../components/HomePage.js').then(module => {
            const homePage = new module.HomePage(this.app);
            this.app.setCurrentPage(homePage);
        });
    }

    showAboutPage() {
        import('../components/AboutPage.js').then(module => {
            const aboutPage = new module.AboutPage(this.app);
            this.app.setCurrentPage(aboutPage);
        });
    }
}