const path = require('path');
const dotenv = require('dotenv');

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local';

// Prefer .env.local / .env.production; the legacy server/.env still loads as a
// fallback (dotenv never overrides variables that are already set).
dotenv.config({ path: path.resolve(__dirname, '..', envFile) });
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

module.exports = {
    envFile,
};
