const express = require('express');
const router = express.Router();
const pool = require('../../db/connection');

// GET / - List all active FAQs
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM faqs WHERE is_active = true ORDER BY sort_order ASC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /:id - Get FAQ by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM faqs WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'FAQ not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST / - Create FAQ
router.post('/', async (req, res) => {
  try {
    const { question, answer, sort_order, is_active } = req.body;
    const result = await pool.query(
      `INSERT INTO faqs (question, answer, sort_order, is_active)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [question, answer, sort_order, is_active]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /:id - Update FAQ
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, sort_order, is_active } = req.body;
    const result = await pool.query(
      `UPDATE faqs SET question = $1, answer = $2, sort_order = $3, is_active = $4
       WHERE id = $5 RETURNING *`,
      [question, answer, sort_order, is_active, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'FAQ not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /:id - Delete FAQ
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM faqs WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'FAQ not found' });
    }
    res.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;