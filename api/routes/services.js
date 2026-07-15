const express = require('express');
const router = express.Router();
const pool = require('../../db/connection');

// GET / - List all active services
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM services WHERE is_active = true ORDER BY sort_order ASC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /:id - Get service by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM services WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST / - Create service
router.post('/', async (req, res) => {
  try {
    const { title, description, image, details, sort_order, is_active } = req.body;
    const result = await pool.query(
      `INSERT INTO services (title, description, image, details, sort_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, description, image, details, sort_order, is_active]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /:id - Update service
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image, details, sort_order, is_active } = req.body;
    const result = await pool.query(
      `UPDATE services SET title = $1, description = $2, image = $3, details = $4,
        sort_order = $5, is_active = $6 WHERE id = $7 RETURNING *`,
      [title, description, image, details, sort_order, is_active, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /:id - Delete service
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM services WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;