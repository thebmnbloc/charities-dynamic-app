const express = require('express');
const router = express.Router();
const pool = require('../../db/connection');

// GET / - List all active team members
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM team WHERE is_active = true ORDER BY sort_order ASC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /:id - Get team member by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM team WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team member not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST / - Create team member
router.post('/', async (req, res) => {
  try {
    const {
      name, role, image, bio, phone, email, facebook, twitter, linkedin,
      instagram, experience, sort_order, is_active
    } = req.body;
    const result = await pool.query(
      `INSERT INTO team (name, role, image, bio, phone, email, facebook, twitter,
        linkedin, instagram, experience, sort_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
      [name, role, image, bio, phone, email, facebook, twitter, linkedin,
       instagram, experience, sort_order, is_active]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /:id - Update team member
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, role, image, bio, phone, email, facebook, twitter, linkedin,
      instagram, experience, sort_order, is_active
    } = req.body;
    const result = await pool.query(
      `UPDATE team SET name = $1, role = $2, image = $3, bio = $4, phone = $5,
        email = $6, facebook = $7, twitter = $8, linkedin = $9, instagram = $10,
        experience = $11, sort_order = $12, is_active = $13
       WHERE id = $14 RETURNING *`,
      [name, role, image, bio, phone, email, facebook, twitter, linkedin,
       instagram, experience, sort_order, is_active, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team member not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /:id - Delete team member
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM team WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team member not found' });
    }
    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;