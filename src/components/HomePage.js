import { stateService } from '../services/StateService.js';

export class HomePage {
    constructor(app) {
        this.app = app;
        this.currentContent = 'profile'; // Default view
        console.log('HomePage constructor called');
        this.render();
        
        // Ensure event listeners are attached after a small delay
        setTimeout(() => {
            this.attachEventListeners();
        }, 0);
        
        // Add state change listener
        this.app.stateService.subscribe(() => {
            this.render();
            this.attachEventListeners();
        });
    }

    render() {
        console.log('HomePage render called');
        // First, remove old event listeners if elements exist
        this.removeEventListeners();
        
        const template = `
            <div class="home-container">
                <!-- Sidebar -->
                <aside class="sidebar">
                    <div class="sidebar-top">
                        <!-- Logo -->
                        <div class="logo">
                            <span class="logo-text">FT_PONG</span>
                        </div>

                        <!-- Navigation -->
                        <nav class="sidebar-nav">
                            <button class="nav-item active" data-view="profile">
                                <i class="nav-icon">👤</i>
                                <span>Profile</span>
                            </button>
                            <button class="nav-item" data-view="play">
                                <i class="nav-icon">🎮</i>
                                <span>Play</span>
                            </button>
                            <button class="nav-item" data-view="leaderboard">
                                <i class="nav-icon">🏆</i>
                                <span>Leaderboard</span>
                            </button>
                            <button class="nav-item" data-view="chat">
                                <i class="nav-icon">💬</i>
                                <span>Chat</span>
                            </button>
                            <button class="nav-item" data-view="settings">
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

        document.querySelector('#app').innerHTML = template;
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
        const user = this.app.stateService.state.auth.user;
        return `
            <div class="profile-container">
                <h1>Profile</h1>
                <div class="profile-content">
                    <div class="profile-header">
                        <div class="profile-avatar">
                            <img src="${user?.avatar || 'assets/images/default-avatar.png'}" alt="Profile">
                        </div>
                        <div class="profile-info">
                            <h2>${user?.username || 'User'}</h2>
                            <p class="status">Online</p>
                        </div>
                    </div>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <span class="stat-value">0</span>
                            <span class="stat-label">Matches</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-value">0</span>
                            <span class="stat-label">Wins</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-value">0</span>
                            <span class="stat-label">Rank</span>
                        </div>
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
        console.log('Attaching event listeners');
        
        // Navigation
        const navItems = document.querySelectorAll('.nav-item[data-view]');
        console.log('Found nav items:', navItems.length);
        
        navItems.forEach(item => {
            const handleClick = (e) => {
                console.log('Nav item clicked:', e.currentTarget.dataset.view);
                const view = e.currentTarget.dataset.view;
                if (view) {
                    this.switchContent(view);
                }
            };
            
            item.removeEventListener('click', handleClick);
            item.addEventListener('click', handleClick);
        });

        // Logout
        const logoutBtn = document.getElementById('logout-btn');
        console.log('Logout button found:', logoutBtn);
        
        if (logoutBtn) {
            console.log('Adding click listener to logout button');
            const handleLogout = async (e) => {
                e.preventDefault();
                e.stopPropagation();

                // Show confirmation modal
                const confirmed = await this.showLogoutConfirmation();
                if (!confirmed) return;

                // Show loading
                const loading = this.showLoading();
                
                try {
                    console.log('Logout button clicked');
                    const success = await this.app.stateService.logout();
                    
                    if (success) {
                        this.showNotification('Logged out successfully', 'success');
                        window.location.href = '/';
                    } else {
                        this.showNotification('Logout failed', 'error');
                    }
                } catch (error) {
                    console.error('Logout error:', error);
                    this.showNotification('An error occurred during logout', 'error');
                } finally {
                    this.hideLoading(loading);
                }
            };
            
            logoutBtn.removeEventListener('click', handleLogout);
            logoutBtn.addEventListener('click', handleLogout);
        } else {
            console.error('Logout button not found in DOM');
        }
    }

    switchContent(view) {
        // Update active state
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.view === view) {
                item.classList.add('active');
            }
        });

        // Update content
        this.currentContent = view;
        const contentArea = document.getElementById('content-area');
        if (contentArea) {
            contentArea.innerHTML = this.getContentTemplate();
        }
    }

    destroy() {
        // Cleanup if needed
    }
}