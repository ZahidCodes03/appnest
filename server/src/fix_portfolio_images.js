import pool from './db.js';

async function fixPortfolioImages() {
    try {
        console.log('🔍 Checking for localhost URLs in portfolio...');
        const { rows } = await pool.query("SELECT id, screenshot_url FROM portfolio WHERE screenshot_url LIKE '%localhost%'");

        console.log(`Found ${rows.length} items to fix.`);

        for (const row of rows) {
            const relativeUrl = row.screenshot_url.split('/uploads/')[1];
            if (relativeUrl) {
                const newUrl = `/uploads/${relativeUrl}`;
                await pool.query('UPDATE portfolio SET screenshot_url = $1 WHERE id = $2', [newUrl, row.id]);
                console.log(`Updated ID ${row.id}: ${newUrl}`);
            }
        }

        console.log('✅ Portfolio images fixed.');
    } catch (err) {
        console.error('❌ Error fixing portfolio images:', err);
    } finally {
        process.exit();
    }
}

fixPortfolioImages();
