const express = require('express');
const router = express.Router();
const pool = require('../../db/connection');

// GET / - List all active donations
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM donations WHERE is_active = true ORDER BY sort_order ASC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /:id - Get donation by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM donations WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Donation not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST / - Create donation
router.post('/', async (req, res) => {
  try {
    const { title, description, image, tag, raised, goal, summary, sort_order, is_active } = req.body;
    const result = await pool.query(
      `INSERT INTO donations (title, description, image, tag, raised, goal, summary, sort_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [title, description, image, tag, raised, goal, summary, sort_order, is_active]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /:id - Update donation
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image, tag, raised, goal, summary, sort_order, is_active } = req.body;
    const result = await pool.query(
      `UPDATE donations SET title = $1, description = $2, image = $3, tag = $4,
        raised = $5, goal = $6, summary = $7, sort_order = $8, is_active = $9
       WHERE id = $10 RETURNING *`,
      [title, description, image, tag, raised, goal, summary, sort_order, is_active, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Donation not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /:id - Delete donation
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM donations WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Donation not found' });
    }
    res.json({ message: 'Donation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;