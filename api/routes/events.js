const express = require('express');
const router = express.Router();
const pool = require('../../db/connection');

// GET / - List all active events
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM events WHERE is_active = true ORDER BY sort_order ASC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /:id - Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST / - Create event
router.post('/', async (req, res) => {
  try {
    const { title, description, image, event_date, venue, mission, sort_order, is_active } = req.body;
    const result = await pool.query(
      `INSERT INTO events (title, description, image, event_date, venue, mission, sort_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [title, description, image, event_date, venue, mission, sort_order, is_active]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /:id - Update event
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image, event_date, venue, mission, sort_order, is_active } = req.body;
    const result = await pool.query(
      `UPDATE events SET title = $1, description = $2, image = $3, event_date = $4,
        venue = $5, mission = $6, sort_order = $7, is_active = $8
       WHERE id = $9 RETURNING *`,
      [title, description, image, event_date, venue, mission, sort_order, is_active, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /:id - Delete event
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;