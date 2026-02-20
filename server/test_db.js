import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()
console.log('DB URL:', process.env.DATABASE_URL)

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
})

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Connection error', err)
    } else {
        console.log('Connected:', res.rows[0])
    }
    pool.end()
})
