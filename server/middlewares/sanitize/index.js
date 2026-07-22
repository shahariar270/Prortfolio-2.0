'use strict';

// Express 5 makes `req.query` a getter with no setter, so the popular
// `express-mongo-sanitize` package crashes ("Cannot set property query ...")
// because it reassigns `req.query`. This middleware sanitizes in place
// instead: it strips keys that start with `$` or contain `.` (the MongoDB
// operator-injection vectors) by mutating the existing objects, so no
// getter-only property is ever reassigned.

const PROHIBITED = /^\$|\./;

function sanitizeInPlace(obj, replaceWith, onSanitize) {
    if (!obj || typeof obj !== 'object') return;

    if (Array.isArray(obj)) {
        obj.forEach((item) => sanitizeInPlace(item, replaceWith, onSanitize));
        return;
    }

    Object.keys(obj).forEach((key) => {
        const value = obj[key];

        if (PROHIBITED.test(key)) {
            delete obj[key];
            if (onSanitize) onSanitize(key);

            if (replaceWith) {
                const safeKey = key.replace(/^\$|\./g, replaceWith);
                if (safeKey !== '__proto__' && safeKey !== 'constructor' && safeKey !== 'prototype') {
                    obj[safeKey] = value;
                    sanitizeInPlace(value, replaceWith, onSanitize);
                }
            }
            return;
        }

        sanitizeInPlace(value, replaceWith, onSanitize);
    });
}

// options: { replaceWith?: string, onSanitize?: ({ req, key }) => void }
const mongoSanitize = (options = {}) => {
    const { replaceWith = null, onSanitize } = options;

    return (req, res, next) => {
        // `req.query` in Express 5 returns a fresh object per access and its
        // keys are already URL-decoded; mutating it in place does not persist,
        // so we sanitize the vectors that actually reach Mongo: body & params.
        ['body', 'params'].forEach((source) => {
            if (req[source]) {
                sanitizeInPlace(
                    req[source],
                    replaceWith,
                    onSanitize ? (key) => onSanitize({ req, key }) : undefined
                );
            }
        });
        next();
    };
};

module.exports = mongoSanitize;
