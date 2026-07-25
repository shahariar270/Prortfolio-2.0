require('../config/env');
const { default: mongoose } = require('mongoose');

// One-off: Post.content moved from [String] (array of plain paragraphs) to
// String (rich-text HTML from the admin's new Quill editor). Existing docs
// still hold the old array shape in Mongo — wrap each paragraph in <p> and
// join, so they render correctly under the new schema. Safe to run more
// than once: already-migrated (string) documents are skipped.
const migrate = async () => {
    const db_url = process.env.DB_URL || 'mongodb://127.0.0.1:27017/portfolio';
    await mongoose.connect(db_url);

    const db = mongoose.connection.db;
    const posts = await db.collection('posts').find({}).toArray();

    let migrated = 0;
    for (const post of posts) {
        if (!Array.isArray(post.content)) continue;
        const html = post.content.map((paragraph) => `<p>${paragraph}</p>`).join('');
        await db.collection('posts').updateOne({ _id: post._id }, { $set: { content: html } });
        migrated += 1;
    }

    console.log(`Migrated ${migrated} post(s), ${posts.length - migrated} already up to date`);
    await mongoose.disconnect();
};

migrate().catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
});
