const express = require('express');
const router = express.Router();
const pool = require('../../db/connection');

// GET / - List all active testimonials
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM testimonials WHERE is_active = true ORDER BY sort_order ASC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /:id - Get testimonial by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM testimonials WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST / - Create testimonial
router.post('/', async (req, res) => {
  try {
    const { reviewer_name, reviewer_role, reviewer_image, review_text, rating, sort_order, is_active } = req.body;
    const result = await pool.query(
      `INSERT INTO testimonials (reviewer_name, reviewer_role, reviewer_image, review_text, rating, sort_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [reviewer_name, reviewer_role, reviewer_image, review_text, rating, sort_order, is_active]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /:id - Update testimonial
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewer_name, reviewer_role, reviewer_image, review_text, rating, sort_order, is_active } = req.body;
    const result = await pool.query(
      `UPDATE testimonials SET reviewer_name = $1, reviewer_role = $2, reviewer_image = $3,
        review_text = $4, rating = $5, sort_order = $6, is_active = $7
       WHERE id = $8 RETURNING *`,
      [reviewer_name, reviewer_role, reviewer_image, review_text, rating, sort_order, is_active, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /:id - Delete testimonial
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM testimonials WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;