// Base Component class that other components can extend
export class Component {
    constructor() {
        this.state = {};
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.render();
    }

    render() {
        // To be implemented by child classes
        throw new Error('Component must implement render method');
    }

    mount(element) {
        if (element) {
            element.innerHTML = this.render();
            this.afterMount();
        }
    }

    afterMount() {
        // Hook for after component is mounted
    }
}