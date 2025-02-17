class StateService {
    constructor() {
        this.state = {
            auth: {
                isAuthenticated: false,
                user: null,
                loading: false
            }
        };
    }

    setState(key, value) {
        this.state[key] = value;
        this.updateDebugPanel();
    }

    getState(key) {
        return this.state[key];
    }

    updateDebugPanel() {
        const debugState = document.getElementById('current-state');
        if (debugState) {
            debugState.textContent = `Current State: ${JSON.stringify(this.state, null, 2)}`;
        }
    }
}

export const stateService = new StateService();