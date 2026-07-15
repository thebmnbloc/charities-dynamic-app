const express = require('express');
const router = express.Router();
const pool = require('../../db/connection');

// GET / - List all active pricing plans
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM pricing WHERE is_active = true ORDER BY sort_order ASC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /:id - Get pricing plan by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM pricing WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pricing plan not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST / - Create pricing plan
router.post('/', async (req, res) => {
  try {
    const { name, price, duration, description, features, sort_order, is_active } = req.body;
    const result = await pool.query(
      `INSERT INTO pricing (name, price, duration, description, features, sort_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, price, duration, description, features, sort_order, is_active]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /:id - Update pricing plan
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, duration, description, features, sort_order, is_active } = req.body;
    const result = await pool.query(
      `UPDATE pricing SET name = $1, price = $2, duration = $3, description = $4,
        features = $5, sort_order = $6, is_active = $7 WHERE id = $8 RETURNING *`,
      [name, price, duration, description, features, sort_order, is_active, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pricing plan not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /:id - Delete pricing plan
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM pricing WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pricing plan not found' });
    }
    res.json({ message: 'Pricing plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;