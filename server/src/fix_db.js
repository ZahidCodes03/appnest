import pool from './db.js';

async function fix() {
    try {
        console.log('Checking/Fixing constraints...');
        await pool.query(`
            ALTER TABLE invoices DROP CONSTRAINT IF EXISTS invoices_status_check;
            ALTER TABLE invoices ADD CONSTRAINT invoices_status_check CHECK (status IN ('pending', 'paid', 'overdue', 'under_review'));
        `);
        console.log('✅ Constraint fixed successfully');

        const res = await pool.query(`
            SELECT conname, pg_get_constraintdef(c.oid) 
            FROM pg_constraint c 
            JOIN pg_class t ON c.conrelid = t.oid 
            WHERE t.relname = 'invoices';
        `);
        console.log('Current constraints on invoices:', res.rows);
    } catch (err) {
        console.error('❌ Error fixing constraint:', err);
    } finally {
        process.exit();
    }
}

fix();
