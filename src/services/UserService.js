export class UserService {
    constructor(app) {
        this.app = app;
        this.API_URL = '/api';
        
        // Initialize mock user data if in development mode
        if (this.app.stateService.isDevelopment) {
            this.initializeMockUser();
        }
    }

    async getUserProfile() {
        if (this.app.stateService.isDevelopment) {
            return Promise.resolve(this.getMockUserProfile());
        }
        return this.getRealUserProfile();
    }

    async getRealUserProfile() {
        try {
            const token = this.app.stateService.state.auth.token;
            const response = await fetch(`${this.API_URL}/users/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user profile');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching user profile:', error);
            throw error;
        }
    }

    initializeMockUser() {
        // Only initialize if mock_user doesn't exist
        if (!localStorage.getItem('mock_user')) {
            const initialMockUser = {
                id: "dev123",
                login: "dev_user",
                displayName: "Developer User",
                email: "dev@example.com",
                avatar: "https://avatars.githubusercontent.com/u/mock",
                stats: {
                    wins: 10,
                    losses: 5,
                    rank: 42,
                    level: 21
                },
                achievements: [
                    { id: 1, name: "First Win", description: "Win your first game" }
                ],
                preferences: {
                    theme: "dark",
                    notifications: true
                }
            };
            
            localStorage.setItem('mock_user', JSON.stringify(initialMockUser));
        }
    }

    getMockUserProfile() {
        const mockUser = JSON.parse(localStorage.getItem('mock_user'));
        if (!mockUser) {
            this.initializeMockUser();
            return JSON.parse(localStorage.getItem('mock_user'));
        }
        return mockUser;
    }

    async updateUserProfile(updates) {
        if (this.app.stateService.isDevelopment) {
            const currentUser = this.getMockUserProfile();
            const updatedUser = { ...currentUser, ...updates };
            localStorage.setItem('mock_user', JSON.stringify(updatedUser));
            return Promise.resolve(updatedUser);
        }

        try {
            const token = this.app.stateService.state.auth.token;
            const response = await fetch(`${this.API_URL}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updates)
            });

            if (!response.ok) {
                throw new Error('Failed to update user profile');
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw error;
        }
    }
}
