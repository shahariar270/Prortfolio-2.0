require('./config/env');
const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('./middlewares/sanitize');
const { default: mongoose } = require('mongoose');
const router = require('./router');
const ApiResponse = require('./utils/api_response');

app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

const parseOrigins = (value) => {
    if (!value || typeof value !== 'string') return [];
    return value
        .split(',')
        .map((s) => s.trim().replace(/\/+$/, ''))
        .filter(Boolean);
};

const explicitOrigins = new Set([
    ...parseOrigins(process.env.FRONTEND_URL),
    ...parseOrigins(process.env.ALLOWED_ORIGINS),
    'https://shahariar.hisabox.pro',
    'https://hisabox.pro',
    'https://prortfolio-2-0.vercel.app',
    'http://localhost:5173',
    'http://localhost:4173',
    'http://localhost:3000',
]);

const isAllowedOrigin = (origin) => {
    if (!origin) return true;

    const cleanOrigin = origin.replace(/\/+$/, '');
    if (explicitOrigins.has(cleanOrigin)) return true;

    try {
        const { hostname, protocol } = new URL(cleanOrigin);
        if (protocol !== 'https:' && protocol !== 'http:') return false;

        // Allow hisabox.pro and all subdomains (e.g. shahariar.hisabox.pro)
        if (hostname === 'hisabox.pro' || hostname.endsWith('.hisabox.pro')) {
            return true;
        }

        // Allow vercel.app and all deployment subdomains
        if (hostname === 'vercel.app' || hostname.endsWith('.vercel.app')) {
            return true;
        }

        // Allow localhost and 127.0.0.1 for local development on any port
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return true;
        }
    } catch {
        return false;
    }

    return false;
};

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
    origin(origin, callback) {
        if (isAllowedOrigin(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
    vary: 'Origin'
}));

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

app.use(mongoSanitize({
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
        console.warn(`Sanitized key "${key}" in request from ${req.ip}`);
    }
}));

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { success: false, message: 'Too many attempts, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});

// scoped to the login route only — /auth/profile is called on every admin
// page load and must not be throttled by brute-force login protection
app.use('/auth/login', authLimiter);

app.use(router);

app.get('/', (req, res) => {
    return ApiResponse.success(res, 'request send successfully');
});

// Centralized error handler — must be last. Without this, an uncaught error
// (e.g. the CORS origin callback rejecting a disallowed origin) falls
// through to Express's default handler, which returns a bare 500 HTML page
// with no CORS headers at all — the browser then reports a confusing
// "CORS Missing Allow Origin" on top of the 500, even though the real cause
// is simply that the request's Origin isn't in allowedOrigins.
app.use((err, req, res, next) => {
    if (err.message === 'Not allowed by CORS') {
        return ApiResponse.error(res, 'This origin is not allowed to access the API', 403);
    }
    console.error('Unhandled error:', err);
    return ApiResponse.error(res, 'Internal server error', 500, err.message);
});

const port = process.env.PORT || 3000;
const db_url = process.env.DB_URL || 'mongodb://127.0.0.1:27017/portfolio';

// Bind the port immediately — hosts like Render only care that *something*
// is listening, and gate deploys on it. Gating app.listen() behind Mongo's
// connect promise meant a slow/misconfigured DB (or a missing DB_URL, which
// silently falls back to a local Mongo that doesn't exist on the host) hung
// forever and never opened the port, so deploys always timed out.
app.listen(port, () => {
    console.log('Server is running on', port);
});

mongoose.connect(db_url, { serverSelectionTimeoutMS: 10_000 })
    .then(() => console.log('Database connected successfully'))
    .catch((err) => {
        console.error('MongoDB connection failed:', err.message);
    });

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message);
});
