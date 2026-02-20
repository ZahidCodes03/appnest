import fs from 'fs'
import path from 'path'
import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
})

async function migrate() {
    fs.appendFileSync('migration.log', '🔄 Running migration...\n')
    try {
        const sql = fs.readFileSync(path.join(process.cwd(), 'schema.sql'), 'utf8')
        await pool.query(sql)
        fs.appendFileSync('migration.log', '✅ Migration complete!\n')
        process.exit(0)
    } catch (err) {
        fs.appendFileSync('migration.log', `❌ Migration failed: ${err}\n`)
        process.exit(1)
    }
}

migrate()
