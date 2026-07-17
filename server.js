const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'charities-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// Static files
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// API routes
app.use('/api/auth', require('./api/routes/auth'));
app.use('/api/team', require('./api/routes/team'));
app.use('/api/services', require('./api/routes/services'));
app.use('/api/projects', require('./api/routes/projects'));
app.use('/api/donations', require('./api/routes/donations'));
app.use('/api/events', require('./api/routes/events'));
app.use('/api/blogs', require('./api/routes/blogs'));
app.use('/api/pricing', require('./api/routes/pricing'));
app.use('/api/faqs', require('./api/routes/faqs'));
app.use('/api/testimonials', require('./api/routes/testimonials'));
app.use('/api/contact', require('./api/routes/contact'));
app.use('/api/subscribers', require('./api/routes/subscribers'));
app.use('/api/settings', require('./api/routes/settings'));
app.use('/api/upload', require('./api/routes/upload'));

// Serve public HTML pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, 'public/about.html')));
app.get('/services', (req, res) => res.sendFile(path.join(__dirname, 'public/services.html')));
app.get('/service', (req, res) => res.sendFile(path.join(__dirname, 'public/service-details.html')));
app.get('/service/:id', (req, res) => res.sendFile(path.join(__dirname, 'public/service-details.html')));
app.get('/projects', (req, res) => res.sendFile(path.join(__dirname, 'public/projects.html')));
app.get('/project', (req, res) => res.sendFile(path.join(__dirname, 'public/project-details.html')));
app.get('/project/:id', (req, res) => res.sendFile(path.join(__dirname, 'public/project-details.html')));
app.get('/team', (req, res) => {
  if (req.query.id) return res.sendFile(path.join(__dirname, 'public/team-details.html'));
  res.sendFile(path.join(__dirname, 'public/team.html'));
});
app.get('/team/:id', (req, res) => res.sendFile(path.join(__dirname, 'public/team-details.html')));
app.get('/pricing', (req, res) => res.sendFile(path.join(__dirname, 'public/pricing.html')));
app.get('/faq', (req, res) => res.sendFile(path.join(__dirname, 'public/faq.html')));
app.get('/donations', (req, res) => res.sendFile(path.join(__dirname, 'public/donations.html')));
app.get('/donation', (req, res) => res.sendFile(path.join(__dirname, 'public/donation-details.html')));
app.get('/donation/:id', (req, res) => res.sendFile(path.join(__dirname, 'public/donation-details.html')));
app.get('/events', (req, res) => res.sendFile(path.join(__dirname, 'public/events.html')));
app.get('/event', (req, res) => res.sendFile(path.join(__dirname, 'public/event-details.html')));
app.get('/event/:id', (req, res) => res.sendFile(path.join(__dirname, 'public/event-details.html')));
app.get('/blog', (req, res) => {
  if (req.query.id) return res.sendFile(path.join(__dirname, 'public/blog-details.html'));
  res.sendFile(path.join(__dirname, 'public/blog.html'));
});
app.get('/blog/:id', (req, res) => res.sendFile(path.join(__dirname, 'public/blog-details.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'public/contact.html')));

// Admin panel
app.get('/admin-panel', (req, res) => res.sendFile(path.join(__dirname, 'admin/index.html')));

// 404
app.use((req, res) => res.sendFile(path.join(__dirname, 'public/404.html')));

app.listen(PORT, () => {
  console.log(`Charitics server running on http://localhost:${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin-panel`);
});
