import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkAdmin() {
    console.log('Connecting to database...');
    try {
        const result = await pool.query('SELECT id, name, email, role FROM users');
        console.log(`Found ${result.rows.length} users:`);
        if (result.rows.length === 0) {
            console.log('Database returned NO users.');
        } else {
            console.table(result.rows);
        }
    } catch (err) {
        console.error('❌ Error checking users:', err.message);
    } finally {
        await pool.end();
    }
}

checkAdmin();
