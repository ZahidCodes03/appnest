
import fs from 'fs';
import pool from './src/db.js';
import bcrypt from 'bcryptjs';

const logFile = 'test-output.txt';
function log(msg) {
    console.log(msg);
    fs.appendFileSync(logFile, msg + '\n');
}

async function testAdmin() {
    try {
        fs.writeFileSync(logFile, 'Starting test...\n');
        log('Testing admin user...');
        const res = await pool.query('SELECT * FROM users WHERE email = $1', ['admin@appnest.in']);
        if (res.rows.length === 0) {
            log('❌ Admin user not found');
        } else {
            log('✅ Admin user found');
            const user = res.rows[0];
            log(`Current hash: ${user.password}`);
            const match = await bcrypt.compare('Admin@123', user.password);
            if (match) {
                log('✅ Password matches Admin@123');
            } else {
                log('❌ Password does NOT match Admin@123');
                // Updated hash
                const newHash = await bcrypt.hash('Admin@123', 10);
                await pool.query('UPDATE users SET password = $1 WHERE email = $2', [newHash, 'admin@appnest.in']);
                log('✅ Password updated to Admin@123');
                log(`New hash: ${newHash}`);
            }
        }
    } catch (err) {
        log('❌ Error: ' + err.message);
    } finally {
        process.exit();
    }
}

testAdmin();
