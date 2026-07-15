const express = require('express');
const router = express.Router();
const pool = require('../../db/connection');

// GET / - Get all settings as object
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM settings');
    const settings = {};
    result.rows.forEach(row => {
      settings[row.setting_key] = row.setting_value;
    });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /:key - Get single setting
router.get('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const result = await pool.query(
      'SELECT * FROM settings WHERE setting_key = $1',
      [key]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT / - Update multiple settings
router.put('/', async (req, res) => {
  try {
    const settings = req.body;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const [key, value] of Object.entries(settings)) {
        await client.query(
          `INSERT INTO settings (setting_key, setting_value, updated_at)
           VALUES ($1, $2, NOW())
           ON CONFLICT (setting_key)
           DO UPDATE SET setting_value = $2, updated_at = NOW()`,
          [key, value]
        );
      }
      await client.query('COMMIT');
      const result = await pool.query('SELECT * FROM settings');
      const updatedSettings = {};
      result.rows.forEach(row => {
        updatedSettings[row.setting_key] = row.setting_value;
      });
      res.json(updatedSettings);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;