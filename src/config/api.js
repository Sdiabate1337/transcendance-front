// API Configuration
export const API_CONFIG = {
    // Base URLs
    BASE_URL: 'http://localhost:3000',
    
    // WebSocket endpoints (these match the ones used in your App.js)
    WEBSOCKET_GAME: 'ws://localhost:3000/game',
    WEBSOCKET_CHAT: 'ws://localhost:3000/chat',
    
    // Authentication endpoints
    AUTH: {
        LOGIN: '/api/auth/42/login',
        CALLBACK: '/api/auth/42/callback',
        LOGOUT: '/api/auth/logout',
        TWO_FACTOR: '/api/auth/2fa'
    },
    
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
};