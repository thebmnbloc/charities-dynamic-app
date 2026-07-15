const express = require('express');
const router = express.Router();
const pool = require('../../db/connection');

// GET / - List all published blogs
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM blogs WHERE is_published = true AND is_active = true ORDER BY sort_order ASC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /:id - Get blog by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM blogs WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /:id/comments - Get blog comments
router.get('/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM blog_comments WHERE blog_id = $1 ORDER BY created_at DESC',
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST / - Create blog
router.post('/', async (req, res) => {
  try {
    const { title, excerpt, content, image, author, category, tags, is_published, sort_order, is_active } = req.body;
    const result = await pool.query(
      `INSERT INTO blogs (title, excerpt, content, image, author, category, tags, is_published, sort_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [title, excerpt, content, image, author, category, tags, is_published, sort_order, is_active]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /:id - Update blog
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, excerpt, content, image, author, category, tags, is_published, sort_order, is_active } = req.body;
    const result = await pool.query(
      `UPDATE blogs SET title = $1, excerpt = $2, content = $3, image = $4,
        author = $5, category = $6, tags = $7, is_published = $8, sort_order = $9,
        is_active = $10 WHERE id = $11 RETURNING *`,
      [title, excerpt, content, image, author, category, tags, is_published, sort_order, is_active, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /:id - Delete blog
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM blogs WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;