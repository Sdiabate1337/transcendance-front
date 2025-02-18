import { Component } from '../Component.js';

export class LoginPage extends Component {
    constructor() {
        super();
        this.state = {
            loading: false
        };
    }

    render() {
        return `
            <div class="login-page">
                <div class="login-container">
                    <h1 class="login-title">Login</h1>
                    <form class="login-form" onsubmit="window.app.handleLogin(event)">
                        <div class="form-group">
                            <label for="username">Username</label>
                            <input type="text" id="username" name="username" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" id="password" name="password" required>
                        </div>
                        <button type="submit" class="login-button">Login</button>
                    </form>
                </div>
            </div>
        `;
    }
}