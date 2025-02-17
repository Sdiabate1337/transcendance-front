import { stateService } from '../services/StateService.js';

export class ProtectedRoute {
    static checkAuth() {
        const authState = stateService.getState('auth');
        return authState?.isAuthenticated || false;
    }

    static guard(component) {
        return () => {
            if (!this.checkAuth()) {
                // Store intended destination
                localStorage.setItem('auth_redirect', window.location.pathname);
                
                // Redirect to login page
                window.location.href = '/login';
                return '';
            }
            
            return component();
        };
    }
}