require('../config/env');
const bcrypt = require('bcrypt');
const { default: mongoose } = require('mongoose');
const User = require('../model/auth');

// Creates (or resets the password of) the single admin account from
// ADMIN_NAME / ADMIN_EMAIL / ADMIN_PASSWORD env vars: npm run seed:admin

const seed = async () => {
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
        console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set');
        process.exit(1);
    }
    if (ADMIN_PASSWORD.length < 6) {
        console.error('ADMIN_PASSWORD must be at least 6 characters');
        process.exit(1);
    }

    const db_url = process.env.DB_URL || 'mongodb://127.0.0.1:27017/portfolio';
    await mongoose.connect(db_url);

    const hashedPass = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const admin = await User.findOneAndUpdate(
        { email: ADMIN_EMAIL.toLowerCase() },
        {
            user_name: ADMIN_NAME || 'Admin',
            email: ADMIN_EMAIL.toLowerCase(),
            password: hashedPass,
            user_role: 'admin',
            is_active: true,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`Admin account ready: ${admin.email}`);
    await mongoose.disconnect();
};

seed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
