import { Component } from './Component.js';
import { LoginPage } from './auth/LoginPage.js';

export class LandingPage extends Component {
    constructor() {
        super();
        this.state = {
            loading: false
        };
        
        this.loginComponent = new LoginPage();
        this.mount(document.getElementById('main-content'));
        
        // Hide navigation for non-authenticated users
        document.getElementById('main-nav').style.display = 'none';
    }

    render() {
        return `
            <div class="landing-page">
                <!-- Left Side: Game Presentation -->
                <div class="game-presentation">
                    <div class="cyber-grid"></div>
                    
                    <div class="hero-content">
                        <h1 class="hero-title">
                            <span class="glitch-text">FT_</span>
                            <span class="cyber-text">TRANSCENDENCE</span>
                        </h1>
                        
                        <div class="hero-description">
                            <p class="primo-text">The Ultimate Pong Experience</p>
                            <p class="secondo-text">Challenge players worldwide in real-time matches</p>
                        </div>

                        <div class="features-list">
                            <div class="feature-item">
                                <span class="feature-icon">🏆</span>
                                <span class="feature-text">Competitive Ranking System</span>
                            </div>
                            <div class="feature-item">
                                <span class="feature-icon">💬</span>
                                <span class="feature-text">Real-time Chat & Matchmaking</span>
                            </div>
                            <div class="feature-item">
                                <span class="feature-icon">🎮</span>
                                <span class="feature-text">Custom Game Modes</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Side: Login Form -->
                <div class="auth-section">
                    ${this.loginComponent.render()}
                </div>
            </div>
        `;
    }

    destroy() {
        this.loginComponent.destroy();
    }
}