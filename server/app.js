require('./config/env');
const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('./middlewares/sanitize');
const { default: mongoose } = require('mongoose');
const router = require('./router');
const ApiResponse = require('./utils/api_response');

const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:4173',
].filter(Boolean);

app.use(helmet());

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
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
