import pool from './src/db.js';

async function migrateReviews() {
    try {
        // Check if reviews table exists
        const checkTable = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'reviews'
            );
        `);

        if (!checkTable.rows[0].exists) {
            console.log('Reviews table does not exist. No migration needed.');
            return;
        }

        const reviews = await pool.query('SELECT * FROM reviews');
        console.log(`Found ${reviews.rows.length} reviews to migrate.`);

        for (const review of reviews.rows) {
            await pool.query(
                'INSERT INTO testimonials (name, email, feedback, rating, approved, created_at) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING',
                [review.name, review.email, review.feedback, review.rating, review.approved, review.created_at]
            );
        }

        if (reviews.rows.length > 0) {
            console.log('Migration successful.');
            // We can drop the table later or just leave it.
        }
    } catch (err) {
        console.error('Migration error:', err.message);
    } finally {
        process.exit();
    }
}

migrateReviews();
