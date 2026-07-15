const express = require('express');
const router = express.Router();
const pool = require('../../db/connection');

// GET / - List all active projects
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM projects WHERE is_active = true ORDER BY sort_order ASC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /:id - Get project by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST / - Create project
router.post('/', async (req, res) => {
  try {
    const {
      title, description, image, gallery, category, author, tags,
      cost, status, sort_order, is_active
    } = req.body;
    const result = await pool.query(
      `INSERT INTO projects (title, description, image, gallery, category, author,
        tags, cost, status, sort_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [title, description, image, gallery, category, author, tags,
       cost, status, sort_order, is_active]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /:id - Update project
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, description, image, gallery, category, author, tags,
      cost, status, sort_order, is_active
    } = req.body;
    const result = await pool.query(
      `UPDATE projects SET title = $1, description = $2, image = $3, gallery = $4,
        category = $5, author = $6, tags = $7, cost = $8, status = $9,
        sort_order = $10, is_active = $11 WHERE id = $12 RETURNING *`,
      [title, description, image, gallery, category, author, tags,
       cost, status, sort_order, is_active, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /:id - Delete project
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;