export class StateService {
    constructor() {
        this.state = {
            auth: {
                isAuthenticated: false,
                user: null,
                loading: false
            }
        };
        this.subscribers = new Map();
        
        // Check for existing session
        this.initializeAuthState();
    }

    initializeAuthState() {
        const token = localStorage.getItem('auth_token');
        if (token) {
            // In development mode, assume token is valid
            const mockUser = JSON.parse(localStorage.getItem('mock_user') || 'null');
            if (mockUser) {
                this.setState('auth', {
                    isAuthenticated: true,
                    user: mockUser,
                    loading: false
                });
            }
        }
    }

    setState(key, newState) {
        this.state[key] = { ...this.state[key], ...newState };
        this.notifySubscribers(key);
        
        // Update debug panel if it exists
        this.updateDebugPanel();
    }

    getState(key) {
        return this.state[key];
    }

    subscribe(key, callback) {
        if (!this.subscribers.has(key)) {
            this.subscribers.set(key, new Set());
        }
        this.subscribers.get(key).add(callback);
        
        // Return unsubscribe function
        return () => {
            const subs = this.subscribers.get(key);
            if (subs) {
                subs.delete(callback);
            }
        };
    }

    notifySubscribers(key) {
        const subs = this.subscribers.get(key);
        if (subs) {
            subs.forEach(callback => callback(this.state[key]));
        }
    }

    updateDebugPanel() {
        const debugState = document.getElementById('current-state');
        if (debugState) {
            debugState.textContent = `State: ${JSON.stringify(this.state, null, 2)}`;
        }
    }
}

// Create singleton instance
export const stateService = new StateService();