import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
});

async function debug() {
    try {
        console.log('Checking database connection...');
        const res = await pool.query('SELECT current_database()');
        console.log('Connected to:', res.rows[0].current_database);

        console.log('\nChecking invoices table schema...');
        const schema = await pool.query(`
            SELECT column_name, data_type, character_maximum_length 
            FROM information_schema.columns 
            WHERE table_name = 'invoices' AND column_name = 'status'
        `);
        if (schema.rows.length > 0) {
            console.log('Status column:', schema.rows[0]);
        } else {
            console.log('Status column NOT FOUND in invoices table!');
        }

        console.log('\nChecking for CHECK constraints on invoices...');
        try {
            const constraints = await pool.query(`
                SELECT conname, pg_get_constraintdef(oid) 
                FROM pg_constraint 
                WHERE conrelid = 'invoices'::regclass AND contype = 'c'
            `);
            console.log('Constraints:', constraints.rows);
        } catch (e) {
            console.log('Could not fetch constraints:', e.message);
        }

        console.log('\nFetching current invoices statuses...');
        const invoices = await pool.query('SELECT id, invoice_number, status FROM invoices LIMIT 10');
        console.log('Invoices (first 10):', invoices.rows);

        await pool.end();
    } catch (err) {
        console.error('Debug failed:', err);
        process.exit(1);
    }
}

debug();
