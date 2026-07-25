require('../config/env');
const { default: mongoose } = require('mongoose');

// One-off: Project gained a required, unique `slug` field for its new case
// study detail page. Existing docs predate that field — backfill one from
// each project's label. Safe to run more than once: already-slugged
// documents are skipped.

const make_slug = (label) =>
    label
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

const migrate = async () => {
    const db_url = process.env.DB_URL || 'mongodb://127.0.0.1:27017/portfolio';
    await mongoose.connect(db_url);

    const db = mongoose.connection.db;
    const projects = await db.collection('projects').find({}).toArray();

    let migrated = 0;
    for (const project of projects) {
        if (project.slug) continue;

        const base = make_slug(project.label) || 'project';
        let slug = base;
        let n = 2;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const exists = await db.collection('projects').findOne({ slug, _id: { $ne: project._id } });
            if (!exists) break;
            slug = `${base}-${n++}`;
        }

        await db.collection('projects').updateOne({ _id: project._id }, { $set: { slug } });
        migrated += 1;
    }

    console.log(`Migrated ${migrated} project(s), ${projects.length - migrated} already up to date`);
    await mongoose.disconnect();
};

migrate().catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
});
