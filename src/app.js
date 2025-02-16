import { API_CONFIG } from './config/api.js';
import { WebSocketService } from './services/WebSocketService.js';
import { stateService } from './services/StateService.js';
import { RouterService } from './services/RouterService.js';

class App {
    constructor() {
        this.router = new RouterService();
        this.initializeRouter();
        this.initializeServices();
        this.setupEventListeners();
    }

    initializeRouter() {
        // Define routes
        this.router.addRoute('/', () => this.loadHomePage());
        this.router.addRoute('/game', () => this.loadGamePage());
        this.router.addRoute('/chat', () => this.loadChatPage());
        this.router.addRoute('/profile', () => this.loadProfilePage());
        this.router.addRoute('/404', () => this.load404Page());

        // Handle initial route
        this.router.handleRoute(window.location.pathname);
    }

    initializeServices() {
        // Initialize WebSocket connections
        this.gameSocket = new WebSocketService(API_CONFIG.WEBSOCKET_GAME);
        this.chatSocket = new WebSocketService(API_CONFIG.WEBSOCKET_CHAT);
        
        this.gameSocket.connect();
        this.chatSocket.connect();

        // Initialize state
        this.initializeState();
    }

    initializeState() {
        stateService.setState('ui', {
            theme: localStorage.getItem('theme') || 'light',
            language: localStorage.getItem('language') || 'en',
            fontSize: localStorage.getItem('fontSize') || 'medium'
        });

        stateService.subscribe('ui', (uiState) => {
            this.handleUiStateChange(uiState);
        });
    }

    setupEventListeners() {
        // Handle navigation clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('[data-route]');
            if (link) {
                e.preventDefault();
                const route = link.dataset.route;
                this.router.navigateTo(route);
            }
        });

        // Handle theme toggle
        document.getElementById('high-contrast').addEventListener('click', () => {
            const currentTheme = stateService.getState('ui').theme;
            const newTheme = currentTheme === 'light' ? 'high-contrast' : 'light';
            stateService.setState('ui', { 
                ...stateService.getState('ui'), 
                theme: newTheme 
            });
        });

        // Handle font size changes
        document.getElementById('font-size').addEventListener('click', () => {
            const sizes = ['small', 'medium', 'large'];
            const currentSize = stateService.getState('ui').fontSize;
            const currentIndex = sizes.indexOf(currentSize);
            const newSize = sizes[(currentIndex + 1) % sizes.length];
            stateService.setState('ui', { 
                ...stateService.getState('ui'), 
                fontSize: newSize 
            });
        });
    }

    handleUiStateChange(uiState) {
        document.body.dataset.theme = uiState.theme;
        document.body.dataset.fontSize = uiState.fontSize;
        document.documentElement.lang = uiState.language;
        
        // Persist UI preferences
        localStorage.setItem('theme', uiState.theme);
        localStorage.setItem('fontSize', uiState.fontSize);
        localStorage.setItem('language', uiState.language);
    }

    loadHomePage() {
        return `
            <div class="home-page">
                <h1>Welcome to Transcendence</h1>
                <div class="menu-options">
                    <a href="/game" data-route="/game" class="menu-button">Play Game</a>
                    <a href="/chat" data-route="/chat" class="menu-button">Chat</a>
                    <a href="/profile" data-route="/profile" class="menu-button">Profile</a>
                </div>
            </div>
        `;
    }

    loadGamePage() {
        return `
            <div id="game-container" class="page-container">
                <h2>Game</h2>
                <div class="game-area">
                    <!-- Game canvas will be inserted here -->
                </div>
                <div class="game-controls">
                    <button id="start-game">Start Game</button>
                    <button id="pause-game">Pause</button>
                </div>
            </div>
        `;
    }

    loadChatPage() {
        return `
            <div id="chat-container" class="page-container">
                <h2>Chat</h2>
                <div class="chat-area">
                    <div class="chat-channels">
                        <!-- Channels list -->
                    </div>
                    <div class="chat-messages">
                        <!-- Messages area -->
                    </div>
                </div>
            </div>
        `;
    }

    loadProfilePage() {
        return `
            <div id="profile-container" class="page-container">
                <h2>Profile</h2>
                <div class="profile-content">
                    <!-- Profile content -->
                </div>
            </div>
        `;
    }

    load404Page() {
        return `
            <div class="error-page">
                <h1>404 - Page Not Found</h1>
                <a href="/" data-route="/" class="menu-button">Return Home</a>
            </div>
        `;
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new App();
});