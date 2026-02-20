import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    connectionString: 'postgresql://appnest_db_user:EGrguQETindd2BYFQ8DoSv0PSm8PqjHM@dpg-d6c0fqi4d50c73d14b4g-a.oregon-postgres.render.com:5432/appnest_db',
    ssl: { rejectUnauthorized: false }
});

async function test() {
    try {
        const res = await pool.query('SELECT name, email, role FROM users');
        console.log('USERS_FOUND:' + JSON.stringify(res.rows));
    } catch (err) {
        console.error('ERROR:' + err.message);
    } finally {
        await pool.end();
    }
}

test();
