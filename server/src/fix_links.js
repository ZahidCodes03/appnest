import pool from './db.js';

async function fixLinks() {
    try {
        const res = await pool.query("UPDATE notifications SET link = '/portal/invoices' WHERE link = '/client/invoices'");
        console.log(`✅ Fixed ${res.rowCount} notification links`);
    } catch (err) {
        console.error('❌ Error fixing links:', err);
    } finally {
        process.exit();
    }
}

fixLinks();
