const express = require('express');
const router = express.Router();
const pool = require('../../db/connection');

// GET / - List all subscribers
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM subscribers ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST / - Subscribe (public)
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const existing = await pool.query('SELECT id FROM subscribers WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'already_subscribed' });
    }

    const result = await pool.query(
      `INSERT INTO subscribers (email) VALUES ($1) RETURNING *`,
      [email]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /:id - Delete subscriber
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM subscribers WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subscriber not found' });
    }
    res.json({ message: 'Subscriber deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;