import { Component } from './Component.js';
import { stateService } from '../services/StateService.js';

export class HomePage extends Component {
    constructor() {
        super();
        this.state = {
            isAuthenticated: stateService.getState('auth')?.isAuthenticated || false
        };
        this.mount(document.getElementById('main-content'));
    }

    render() {
        return `
            <div class="home-page">
                <div class="cyber-grid"></div>
                
                <!-- Hero Section -->
                <section class="hero-section">
                    <h1 class="hero-title">
                        <span class="glitch-text">FT_</span>
                        <span class="cyber-text">TRANSCENDENCE</span>
                    </h1>
                    
                    <div class="hero-description">
                        <p class="primo-text">Master the Art of Digital Pong</p>
                        <p class="secondo-text">Experience real-time multiplayer battles in a reimagined classic</p>
                    </div>

                    <div class="cta-container">
                        ${!this.state.isAuthenticated ? `
                            <a href="/login" data-route="/login" class="cta-button primary">
                                <span class="button-text">Get Started</span>
                                <span class="button-glow"></span>
                            </a>
                        ` : `
                            <a href="/game" data-route="/game" class="cta-button primary">
                                <span class="button-text">Play Now</span>
                                <span class="button-glow"></span>
                            </a>
                        `}
                    </div>
                </section>

                <!-- Game Preview -->
                <section class="game-preview">
                    <div class="preview-content">
                        <div class="game-stats">
                            <div class="stat-item">
                                <span class="stat-value">1000+</span>
                                <span class="stat-label">Active Players</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-value">10K+</span>
                                <span class="stat-label">Matches Played</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-value">24/7</span>
                                <span class="stat-label">Live Games</span>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        `;
    }
}