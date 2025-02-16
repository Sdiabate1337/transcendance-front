class TestSuite {
    constructor() {
        this.tests = [];
        this.results = {
            passed: 0,
            failed: 0,
            total: 0
        };
    }

    async runTests() {
        // Wait for DOM to be fully loaded and app to initialize
        await this.waitForApp();

        console.group('Running Transcendence Frontend Tests');
        console.time('Total Test Time');

        for (const test of this.tests) {
            try {
                console.group(`Test: ${test.name}`);
                await test.fn();
                console.log('✅ Passed');
                this.results.passed++;
            } catch (error) {
                console.error('❌ Failed:', error);
                console.error('Test details:', test.name);
                this.results.failed++;
            } finally {
                console.groupEnd();
                this.results.total++;
            }
        }

        console.timeEnd('Total Test Time');
        this.displayResults();
        console.groupEnd();
    }

    async waitForApp() {
        return new Promise((resolve) => {
            const check = () => {
                if (
                    document.querySelector('[data-route="/"]') &&
                    document.getElementById('high-contrast') &&
                    document.getElementById('font-size')
                ) {
                    resolve();
                } else {
                    setTimeout(check, 100);
                }
            };
            check();
        });
    }

    addTest(name, fn) {
        this.tests.push({ name, fn });
    }

    displayResults() {
        console.log(`
Results:
✅ Passed: ${this.results.passed}
❌ Failed: ${this.results.failed}
📊 Total: ${this.results.total}
Success Rate: ${((this.results.passed / this.results.total) * 100).toFixed(2)}%
        `);
    }

    async testRouting() {
        const routes = ['/', '/game', '/chat', '/profile'];
        
        for (const route of routes) {
            // Get navigation link
            const link = document.querySelector(`[data-route="${route}"]`);
            if (!link) {
                throw new Error(`Navigation link for ${route} not found. Available routes: ${
                    Array.from(document.querySelectorAll('[data-route]'))
                        .map(el => el.getAttribute('data-route'))
                        .join(', ')
                }`);
            }
            
            // Simulate click
            link.click();
            await new Promise(resolve => setTimeout(resolve, 300));

            // Verify URL
            if (window.location.pathname !== route) {
                throw new Error(`Route not updated. Expected ${route}, got ${window.location.pathname}`);
            }

            // Verify content
            const content = document.getElementById('main-content');
            if (!content || !content.innerHTML.trim()) {
                throw new Error(`Content not loaded for ${route}`);
            }
        }

        // Test browser navigation
        window.history.back();
        await new Promise(resolve => setTimeout(resolve, 300));
        
        window.history.forward();
        await new Promise(resolve => setTimeout(resolve, 300));
    }

    async testThemeSwitch() {
        const themeButton = document.getElementById('high-contrast');
        if (!themeButton) {
            throw new Error('Theme button not found in DOM');
        }

        const initialTheme = document.body.dataset.theme || 'light';
        
        themeButton.click();
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const newTheme = document.body.dataset.theme;
        if (initialTheme === newTheme) {
            throw new Error(`Theme did not change. Initial: ${initialTheme}, Current: ${newTheme}`);
        }
    }

    async testFontSize() {
        const fontButton = document.getElementById('font-size');
        if (!fontButton) {
            throw new Error('Font size button not found in DOM');
        }

        const initialSize = document.body.dataset.fontSize || 'medium';
        
        fontButton.click();
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const newSize = document.body.dataset.fontSize;
        if (initialSize === newSize) {
            throw new Error(`Font size did not change. Initial: ${initialSize}, Current: ${newSize}`);
        }
    }

    updateDebugPanel() {
        const routeEl = document.getElementById('current-route');
        const stateEl = document.getElementById('current-state');
        const wsEl = document.getElementById('websocket-status');

        if (routeEl) routeEl.textContent = `Current Route: ${window.location.pathname}`;
        if (stateEl) stateEl.textContent = `Current State: ${JSON.stringify(window.app?.state || {}, null, 2)}`;
        if (wsEl) wsEl.textContent = `WebSocket: ${window.app?.gameSocket?.isConnected ? 'Connected' : 'Disconnected'}`;
    }
}

// Initialize and run tests
const testSuite = new TestSuite();

// Add tests
testSuite.addTest('Routing System', () => testSuite.testRouting());
testSuite.addTest('Theme Switching', () => testSuite.testThemeSwitch());
testSuite.addTest('Font Size Adjustment', () => testSuite.testFontSize());

// Run tests when page is loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Wait a bit for app to initialize
    await new Promise(resolve => setTimeout(resolve, 1000));
    testSuite.runTests();
});

// Update debug panel periodically
setInterval(() => testSuite.updateDebugPanel(), 1000);