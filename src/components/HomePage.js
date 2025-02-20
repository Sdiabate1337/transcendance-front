import { StateService } from '../services/StateService.js';
import { UserService } from '../services/UserService.js';

export class HomePage {

    getCurrentViewFromURL() {
        const path = window.location.pathname;
        if (path === '/home') return 'profile';
        const match = path.match(/\/home\/(\w+)/);
        return match ? match[1] : 'profile';
    }

    constructor(app) {
        this.app = app;
        this.isInitialized = false;
        this.lastRenderedState = null;
        this.userProfile = null;
        this.currentTime = ''; // Add time tracking
        this.userLogin = ''; // Add user login tracking
        
        // Get current view from URL
        this.currentContent = this.getCurrentViewFromURL();
        
        // Start time updates
        this.startTimeUpdates();
        
        // Load user profile immediately
        this.loadUserProfile();
        
        // Initialize page
        this.render();
        this.attachEventListeners();
        
        // Add state change listener with check for actual changes
        this.unsubscribe = this.app.stateService.subscribe(async (state) => {
            // Update time and user info
            this.currentTime = state.ui?.currentTime || '';
            this.userLogin = state.ui?.userLogin || '';
            
            // Update profile if needed
            try {
                const newProfile = await this.app.userService.getUserProfile();
                if (JSON.stringify(newProfile) !== JSON.stringify(this.userProfile)) {
                    this.userProfile = newProfile;
                    this.render();
                }
            } catch (error) {
                console.error('Error updating profile:', error);
            }
        });

        // Listen for popstate events to handle browser back/forward
        this.handlePopState = () => {
            const newView = this.getCurrentViewFromURL();
            if (newView !== this.currentContent) {
                this.currentContent = newView;
                this.render();
            }
        };
        window.addEventListener('popstate', this.handlePopState);
    }


    startTimeUpdates() {
        // Update time every minute
        this.timeInterval = setInterval(() => {
            const now = new Date();
            this.currentTime = now.toISOString()
                .replace('T', ' ')
                .replace(/\.\d+Z$/, '');
            this.render();
        }, 60000);
    }

    async loadUserProfile() {
        try {
            const profile = await this.app.userService.getUserProfile();
            if (JSON.stringify(profile) !== JSON.stringify(this.userProfile)) {
                this.userProfile = profile;
                this.render();
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
            this.showNotification('Failed to load profile', 'error');
        }
    }

    render() {
        console.log('HomePage render called');
        
        const currentState = {
            content: this.currentContent,
            profile: this.userProfile,
            currentTime: this.currentTime,
            userLogin: this.userLogin
        };
        
        // Skip render if state hasn't changed
        if (this.lastRenderedState && 
            JSON.stringify(currentState) === JSON.stringify(this.lastRenderedState)) {
            console.log('Skipping render - no state change');
            return;
        }
        
        this.lastRenderedState = currentState;
        
        const template = `
            <div class="home-container">
                <!-- Sidebar -->
                <aside class="sidebar">
                    <div class="sidebar-top">
                        <!-- Logo -->
                        <div class="logo">
                            <span class="logo-text">FT_PONG</span>
                        </div>

                        <!-- User Info -->
                        <div class="user-info">
                            <span class="user-login">${this.userLogin}</span>
                            <span class="current-time">${this.currentTime}</span>
                        </div>

                        <!-- Navigation -->
                        <nav class="sidebar-nav">
                            <button class="nav-item ${this.currentContent === 'profile' ? 'active' : ''}" data-view="profile">
                                <i class="nav-icon">👤</i>
                                <span>Profile</span>
                            </button>
                            <button class="nav-item ${this.currentContent === 'play' ? 'active' : ''}" data-view="play">
                                <i class="nav-icon">🎮</i>
                                <span>Play</span>
                            </button>
                            <button class="nav-item ${this.currentContent === 'leaderboard' ? 'active' : ''}" data-view="leaderboard">
                                <i class="nav-icon">🏆</i>
                                <span>Leaderboard</span>
                            </button>
                            <button class="nav-item ${this.currentContent === 'chat' ? 'active' : ''}" data-view="chat">
                                <i class="nav-icon">💬</i>
                                <span>Chat</span>
                            </button>
                            <button class="nav-item ${this.currentContent === 'settings' ? 'active' : ''}" data-view="settings">
                                <i class="nav-icon">⚙️</i>
                                <span>Settings</span>
                            </button>
                        </nav>
                    </div>

                    <!-- Logout Button -->
                    <div class="sidebar-bottom">
                        <button class="nav-item" id="logout-btn" type="button">
                            <i class="nav-icon">🚪</i>
                            <span>Logout</span>
                        </button>
                    </div>
                </aside>

                <!-- Main Content -->
                <main class="main-content">
                    <div id="content-area">
                        ${this.getContentTemplate()}
                    </div>
                </main>
            </div>
        `;

        const appElement = document.querySelector('#app');
        if (appElement && appElement.innerHTML !== template) {
            appElement.innerHTML = template;
            this.attachEventListeners();
        }
    }

    removeEventListeners() {
        // Remove navigation listeners
        const navItems = document.querySelectorAll('.nav-item[data-view]');
        navItems.forEach(item => {
            item.replaceWith(item.cloneNode(true));
        });

        // Remove logout listener
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.replaceWith(logoutBtn.cloneNode(true));
        }
    }

    getContentTemplate() {
        switch (this.currentContent) {
            case 'profile':
                return this.getProfileTemplate();
            case 'play':
                return this.getPlayTemplate();
            case 'leaderboard':
                return this.getLeaderboardTemplate();
            case 'chat':
                return this.getChatTemplate();
            case 'settings':
                return this.getSettingsTemplate();
            default:
                return this.getProfileTemplate();
        }
    }

    getProfileTemplate() {
        if (!this.userProfile) {
            return `
                <div class="profile-container">
                    <div class="loading-spinner"></div>
                </div>
            `;
        }

        const { displayName, login, avatar, stats, achievements } = this.userProfile;
        
        return `
            <div class="profile-container">
                <!-- Profile Card -->
                <div class="profile-card">
                    <div class="status-indicator">
                        <span class="status-dot"></span>
                        <span>Avalable</span>
                    </div>
                    
                    <div class="profile-info">
                        <img src="${avatar}" alt="Profile Picture" class="profile-avatar" />
                        <div class="profile-name">
                            <h2>${displayName}</h2>
                            <p class="username">@${login}</p>
                        </div>
                    </div>

                    <div class="profile-stats">
                        <div class="stat">
                            <span>Rank ${stats.rank}</span>
                        </div>
                        <div class="stat">
                            <span>Score ${stats.wins * 10 + stats.level * 5}</span>
                        </div>
                    </div>

                    <div class="social-links">
                        <a href="#" class="social-link">
                            <i class="fab fa-github"></i>
                        </a>
                        <a href="#" class="social-link">
                            <i class="fab fa-discord"></i>
                        </a>
                        <a href="#" class="social-link">
                            <i class="fab fa-twitter"></i>
                        </a>
                    </div>
                </div>

                <!-- Win Rate Circle -->
                <div class="win-rate-card">
                    <div class="win-rate-circle">
                        <svg viewBox="0 0 36 36" class="circular-chart">
                            <path d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#eee"
                                stroke-width="3"
                            />
                            <path d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#12664F"
                                stroke-width="3"
                                stroke-dasharray="${(stats.wins / (stats.wins + stats.losses)) * 100}, 100"
                            />
                        </svg>
                        <div class="win-rate-text">
                            <span>Winning rate</span>
                            <strong>${Math.round((stats.wins / (stats.wins + stats.losses)) * 100)}%</strong>
                        </div>
                    </div>
                </div>

                <!-- Match History Graph -->
                <div class="match-history-card">
                    <div class="date-range">01/01/2025 - 27/01/2025</div>
                    <div class="history-grid">
                        ${Array(11).fill(0).map(() => `
                            <div class="history-column">
                                <div class="games-played">30</div>
                                <div class="games-won">26</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Leaderboard -->
                <div class="leaderboard-card">
                    <div class="card-header">
                        <h3>Leaderboard</h3>
                        <a href="#" class="view-all">View all</a>
                    </div>
                    <div class="leaderboard-list">
                        ${[
                            { rank: 1, name: 'pseudo-name', score: 347 },
                            { rank: 2, name: 'pseudo-name', score: 320 },
                            { rank: 3, name: 'pseudo-name', score: 300 },
                            { rank: 4, name: 'pseudo-name', score: 247 }
                        ].map(player => `
                            <div class="leaderboard-item ${player.rank === 1 ? 'top-rank' : ''}">
                                <span class="rank">${player.rank}</span>
                                <span class="name">${player.name}</span>
                                <span class="score">${player.score}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Achievements -->
                <div class="achievements-card">
                    <div class="card-header">
                        <h3>Last achievements</h3>
                    </div>
                    <div class="achievements-list">
                        ${achievements && achievements.length > 0 ? achievements.map(achievement => `
                            <div class="achievement-item">
                                <div class="achievement-icon">🏆</div>
                                <div class="achievement-info">
                                    <h4>${achievement.name}</h4>
                                    <p>${achievement.description}</p>
                                </div>
                            </div>
                        `).join('') : '<p class="no-achievements">No achievements yet</p>'}
                    </div>
                </div>
            </div>
        `;
    }

    getPlayTemplate() {
        return `
            <div class="play-container">
                <h1>Play</h1>
                <div class="game-modes">
                    <button class="game-mode-btn">
                        <span class="mode-icon">🤖</span>
                        <span class="mode-name">Practice Mode</span>
                    </button>
                    <button class="game-mode-btn">
                        <span class="mode-icon">👥</span>
                        <span class="mode-name">Quick Match</span>
                    </button>
                    <button class="game-mode-btn">
                        <span class="mode-icon">🏆</span>
                        <span class="mode-name">Ranked Match</span>
                    </button>
                </div>
            </div>
        `;
    }

    getLeaderboardTemplate() {
        return `
            <div class="leaderboard-container">
                <h1>Leaderboard</h1>
                <div class="leaderboard-content">
                    <div class="leaderboard-header">
                        <span>Rank</span>
                        <span>Player</span>
                        <span>Wins</span>
                        <span>Points</span>
                    </div>
                    <div class="leaderboard-list">
                        <!-- Placeholder for leaderboard data -->
                        <div class="leaderboard-item">
                            <span class="rank">1</span>
                            <span class="player">Player 1</span>
                            <span class="wins">10</span>
                            <span class="points">1000</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getChatTemplate() {
        return `
            <div class="chat-container">
                <h1>Chat</h1>
                <div class="chat-content">
                    <!-- Chat implementation will go here -->
                    <p>Chat feature coming soon...</p>
                </div>
            </div>
        `;
    }

    getSettingsTemplate() {
        return `
            <div class="settings-container">
                <h1>Settings</h1>
                <div class="settings-content">
                    <div class="settings-section">
                        <h2>Game Settings</h2>
                        <div class="setting-item">
                            <label>Game Difficulty</label>
                            <select>
                                <option>Easy</option>
                                <option>Medium</option>
                                <option>Hard</option>
                            </select>
                        </div>
                    </div>
                    <div class="settings-section">
                        <h2>Profile Settings</h2>
                        <div class="setting-item">
                            <label>Username</label>
                            <input type="text" value="${this.app.stateService.state.auth.user?.username || ''}">
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    showLoading() {
        const loading = document.createElement('div');
        loading.className = 'loading-overlay';
        loading.innerHTML = '<div class="loading-spinner"></div>';
        document.body.appendChild(loading);
        return loading;
    }

    hideLoading(loading) {
        if (loading) {
            loading.remove();
        }
    }

    showLogoutConfirmation() {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'modal-overlay';
            modal.innerHTML = `
                <div class="modal-content">
                    <h2 class="modal-title">Confirm Logout</h2>
                    <p class="modal-message">Are you sure you want to logout?</p>
                    <div class="modal-buttons">
                        <button class="modal-button cancel">Cancel</button>
                        <button class="modal-button confirm">Logout</button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            const confirmBtn = modal.querySelector('.confirm');
            const cancelBtn = modal.querySelector('.cancel');

            confirmBtn.addEventListener('click', () => {
                modal.remove();
                resolve(true);
            });

            cancelBtn.addEventListener('click', () => {
                modal.remove();
                resolve(false);
            });
        });
    }

    attachEventListeners() {
        // Only attach if elements don't already have listeners
        const navItems = document.querySelectorAll('.nav-item[data-view]');
        navItems.forEach(item => {
            const view = item.dataset.view;
            if (!item.hasListener) {
                item.hasListener = true;
                const handleClick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (view && view !== this.currentContent) {
                        this.switchContent(view);
                    }
                };
                item.removeEventListener('click', handleClick);
                item.addEventListener('click', handleClick);
            }
        });

        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn && !logoutBtn.hasListener) {
            logoutBtn.hasListener = true;
            const handleLogout = async (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                try {
                    const confirmed = await this.showLogoutConfirmation();
                    if (!confirmed) return;

                    const loading = this.showLoading();
                    try {
                        const success = await this.app.stateService.logout();
                        if (success) {
                            this.showNotification('Logged out successfully', 'success');
                            window.location.href = '/';
                        } else {
                            this.showNotification('Logout failed', 'error');
                        }
                    } finally {
                        this.hideLoading(loading);
 