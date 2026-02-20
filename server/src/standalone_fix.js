import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    connectionString: 'postgresql://postgres:Zahid@123@localhost:5432/appnest'
});

async function run() {
    try {
        console.log('Starting standalone DB fix...');
        await pool.query('ALTER TABLE invoices DROP CONSTRAINT IF EXISTS invoices_status_check');
        await pool.query("ALTER TABLE invoices ADD CONSTRAINT invoices_status_check CHECK (status IN ('pending', 'paid', 'overdue', 'under_review'))");
        console.log('✅ Status constraint updated to allow under_review');

        const res = await pool.query("SELECT conname FROM pg_constraint WHERE conname = 'invoices_status_check'");
        console.log('Verified constraint:', res.rows[0]);
    } catch (err) {
        console.error('❌ DB Fix Error:', err);
    } finally {
        await pool.end();
        process.exit();
    }
}

run();
