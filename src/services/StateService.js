export class StateService {
    constructor() {
        this.state = {
            auth: {
                isAuthenticated: false,
                token: null,
                user: null
            },
            ui: {
                theme: 'dark',
                isMenuOpen: false
            }
        };
        
        // Development mode flag
        this.isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        
        this.listeners = new Set();
        this.initialize();
    }

    initialize() {
        // Check for existing auth token
        const token = localStorage.getItem('auth_token');
        if (token) {
            this.state.auth.token = token;
            this.state.auth.isAuthenticated = true;
            this.loadUserData();
        }

        // Load saved UI preferences
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.state.ui.theme = savedTheme;
        }

        // DEV ONLY: Check for mock user
        if (this.isDevelopment) {
            const mockUser = localStorage.getItem('mock_user');
            if (mockUser) {
                this.loginWithMockUser();
            }
        }
    }

    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notify();
    }

    getState() {
        return this.state;
    }

    isAuthenticated() {
        return this.state.auth.isAuthenticated;
    }

    async login42(code) {
        try {
            // In development, use mock data
            if (this.isDevelopment) {
                const mockUser = {
                    id: 1,
                    username: 'mock_user',
                    email: 'mock@42.fr',
                    avatar: 'https://avatars.githubusercontent.com/u/1234567?v=4',
                    stats: {
                        matches: 10,
                        wins: 7,
                        rank: 42
                    }
                };
                return this.loginWithMockUser(mockUser);
            }

            const response = await fetch('/api/auth/42/callback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code })
            });

            if (!response.ok) throw new Error('Login failed');

            const data = await response.json();
            this.setAuthToken(data.token);
            await this.loadUserData();
            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    }

    async loginWithMockUser(mockUser) {
        console.log('Attempting mock login...');
        
        if (!this.isDevelopment) {
            console.error('Mock login is only available in development mode');
            return false;
        }

        try {
            const user = mockUser || {
                id: 'dev123',
                login: 'dev_user',
                displayName: 'Developer User',
                email: 'dev@example.com',
                avatar: 'https://avatars.githubusercontent.com/u/mock',
                stats: {
                    wins: 10,
                    losses: 5,
                    rank: 42,
                    level: 21
                },
                achievements: [
                    { id: 1, name: 'First Win', description: 'Win your first game' },
                    { id: 2, name: 'Pro Player', description: 'Win 10 games' }
                ],
                preferences: {
                    theme: 'dark',
                    notifications: true
                }
            };

            // Store mock user data
            localStorage.setItem('mock_user', JSON.stringify(user));
            localStorage.setItem('auth_token', 'mock_token_123');

            // Update state
            this.setState({
                auth: {
                    isAuthenticated: true,
                    token: 'mock_token_123',
                    user
                }
            });

            console.log('Mock login successful');
            return true;
        } catch (error) {
            console.error('Mock login failed:', error);
            return false;
        }
    }

    setAuthToken(token) {
        localStorage.setItem('auth_token', token);
        this.setState({
            auth: {
                ...this.state.auth,
                token,
                isAuthenticated: true
            }
        });
    }

    async loadUserData() {
        if (!this.state.auth.token) return;

        // In development, use mock data
        if (this.isDevelopment) {
            const mockUser = localStorage.getItem('mock_user');
            if (mockUser) {
                try {
                    this.state.auth.user = JSON.parse(mockUser);
                    this.notify();
                } catch (error) {
                    console.error('Error loading mock user data:', error);
                }
                return;
            }
        }

        try {
            const response = await fetch('/api/user/me', {
                headers: {
                    'Authorization': `Bearer ${this.state.auth.token}`
                }
            });

            if (!response.ok) throw new Error('Failed to load user data');

            const userData = await response.json();
            this.setState({
                auth: {
                    ...this.state.auth,
                    user: userData
                }
            });
        } catch (error) {
            console.error('Error loading user data:', error);
            this.logout();
        }
    }

    async logout() {
        try {
            console.log('Starting logout process');
            
            const token = this.state.auth.token;
            const isAuthenticated = this.state.auth.isAuthenticated;
            
            if (!isAuthenticated) {
                console.log('User already logged out');
                return true;
            }
            
            // Handle mock user logout in development mode
            if (this.isDevelopment) {
                console.log('Development mode: Clearing mock user data');
                localStorage.removeItem('mock_user');
            } 
            // Handle 42 user logout in production
            else if (token) {
                console.log('Production mode: Calling logout API');
                try {
                    const response = await fetch('/api/auth/logout', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    if (!response.ok) {
                        throw new Error(`Logout API failed with status: ${response.status}`);
                    }
                    
                    console.log('Logout API call successful');
                } catch (error) {
                    console.error('Error calling logout API:', error);
                    throw error; // Propagate error to be handled by HomePage
                }
            }

            // Clear authentication state
            this.state.auth = {
                isAuthenticated: false,
                token: null,
                user: null
            };

            // Clear all auth-related localStorage items
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_preferences');
            localStorage.removeItem('game_settings');
            
            // Notify all listeners of state change
            this.notify();
            
            console.log('Logout completed successfully');
            return true;
        } catch (error) {
            console.error('Logout error:', error);
            throw error; // Propagate error to be handled by HomePage
        }
    }

    // UI methods
    toggleMenu() {
        this.setState({
            ui: {
                ...this.state.ui,
                isMenuOpen: !this.state.ui.isMenuOpen
            }
        });
    }

    setTheme(theme) {
        localStorage.setItem('theme', theme);
        this.setState({
            ui: {
                ...this.state.ui,
                theme
            }
        });
    }
}

// Create singleton instance
export const stateService = new StateService();