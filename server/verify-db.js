
import pool, { initDb } from './src/db.js';

async function test() {
    console.log('Initializing DB...');
    await initDb();
    try {
        console.log('Checking ticket_replies...');
        await pool.query('SELECT * FROM ticket_replies');
        console.log('✅ ticket_replies table exists');
    } catch (e) {
        console.error('❌ ticket_replies table missing:', e.message);
    }
    process.exit();
}
test();
