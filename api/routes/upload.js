const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Upload } = require('@aws-sdk/lib-storage');
const { s3, BUCKET_NAME, S3_BASE_URL } = require('../../config/s3');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|svg|pdf|mp4|webm/;
    const ext = allowed.test(file.originalname.split('.').pop().toLowerCase());
    const mime = allowed.test(file.mimetype.split('/')[1]) || file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf';
    cb(null, ext || mime);
  }
});

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });

    const folder = req.body.folder || 'uploads';
    const ext = req.file.originalname.split('.').pop();
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const upload = new Upload({
      client: s3,
      params: {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        // ACL: "public-read",
      },
    });

    await upload.done();

    const url = `${S3_BASE_URL}/${filename}`;
    res.json({ url, filename });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/multiple', upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || !req.files.length) return res.status(400).json({ error: 'No files provided' });

    const folder = req.body.folder || 'uploads';
    const urls = [];

    for (const file of req.files) {
      const ext = file.originalname.split('.').pop();
      const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const upload = new Upload({
        client: s3,
        params: {
          Bucket: BUCKET_NAME,
          Key: filename,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: 'public-read',
        },
      });

      await upload.done();
      urls.push({ url: `${S3_BASE_URL}/${filename}`, filename, originalName: file.originalname });
    }

    res.json({ files: urls });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
