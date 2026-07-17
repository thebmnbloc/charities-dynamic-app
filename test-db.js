const pool = require('./db/connection');

async function test() {
  try {
    const cols = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'subscribers'");
    console.log('Columns:', JSON.stringify(cols.rows));

    const insert = await pool.query("INSERT INTO subscribers (email) VALUES ($1) RETURNING *", ['test-debug@example.com']);
    console.log('Insert OK:', JSON.stringify(insert.rows[0]));

    const dup = await pool.query("SELECT id FROM subscribers WHERE email = $1", ['test-debug@example.com']);
    console.log('Duplicate check:', dup.rows.length > 0 ? 'found' : 'not found');

    await pool.query("DELETE FROM subscribers WHERE email = $1", ['test-debug@example.com']);
    console.log('Cleanup OK');
  } catch (e) {
    console.error('Error:', e.message);
  }
  process.exit();
}

test();
