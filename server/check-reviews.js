import pool from './src/db.js';

async function checkReviews() {
    try {
        const reviews = await pool.query('SELECT * FROM reviews');
        console.log(`Found ${reviews.rows.length} reviews.`);
        if (reviews.rows.length > 0) {
            console.log('Migration might be needed.');
            console.log(JSON.stringify(reviews.rows, null, 2));
        }
    } catch (err) {
        console.error('Error checking reviews table (it might not exist or be empty):', err.message);
    } finally {
        process.exit();
    }
}

checkReviews();
