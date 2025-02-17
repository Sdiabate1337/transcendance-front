// API Configuration
export const API_CONFIG = {
    // We'll add a flag to indicate if we're using mock data
    USE_MOCK: true,
    
    // This will be changed when backend is ready
    BASE_URL: 'http://localhost:3000',
    
    AUTH: {
        LOGIN: '/api/auth/42/login',
        CALLBACK: '/api/auth/42/callback',
        CHECK: '/api/auth/check',
        LOGOUT: '/api/auth/logout'
    },

    // Mock data for development
    MOCK_DATA: {
        user: {
            id: 1,
            username: 'testUser42',
            avatar: 'https://cdn.intra.42.fr/users/default.png',
            status: 'online'
        }
    },
    // WebSocket endpoints (these match the ones used in your App.js)
    WEBSOCKET_GAME: 'ws://localhost:3000/game',
    WEBSOCKET_CHAT: 'ws://localhost:3000/chat',
    
    
    // Game endpoints
    GAME: {
        CREATE: '/api/game/create',
        JOIN: '/api/game/join',
        STATS: '/api/game/stats',
        MATCHMAKING: '/api/game/matchmaking'
    },
    
    // Chat endpoints
    CHAT: {
        CHANNELS: '/api/chat/channels',
        MESSAGES: '/api/chat/messages',
        DIRECT: '/api/chat/direct'
    },
    
    // User endpoints
    USER: {
        PROFILE: '/api/user/profile',
        FRIENDS: '/api/user/friends',
        SETTINGS: '/api/user/settings',
        AVATAR: '/api/user/avatar'
    }
};

// You could also export other configurations if needed
export const APP_SETTINGS = {
    DEFAULT_LANGUAGE: 'en',
    SUPPORTED_LANGUAGES: ['en', 'fr', 'es'],
    DEFAULT_THEME: 'light',
    THEMES: {
        LIGHT: 'light',
        HIGH_CONTRAST: 'high-contrast'
    }
};s