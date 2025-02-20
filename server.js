const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to handle MIME types and compression
app.use((req, res, next) => {
    // Set proper MIME types
    if (req.url.endsWith('.js')) {
        res.type('application/javascript');
    } else if (req.url.endsWith('.css')) {
        res.type('text/css');
    }
    
    // Enable CORS for development
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    
    // Disable caching for development
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');
    
    next();
});

// Serve static files with proper options
app.use(express.static(path.join(__dirname), {
    etag: false,
    lastModified: false,
    maxAge: 0,
    index: false
}));

// Additional static directories with specific paths
app.use('/src', express.static(path.join(__dirname, 'src'), {
    etag: false,
    lastModified: false,
    maxAge: 0
}));

app.use('/assets', expre