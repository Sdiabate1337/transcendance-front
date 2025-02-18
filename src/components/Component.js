export class Component {
    constructor() {
        this.state = {};
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.mount(this.element);
    }

    mount(element) {
        this.element = element;
        if (element) {
            element.innerHTML = this.render();
        }
    }

    render() {
        return '';
    }
}