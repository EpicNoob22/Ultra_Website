const express = require('express');
const router = express.Router();
const { getDb } = require('../config/database');

// Get all posts
router.get('/posts', (req, res) => {
  try {
    const db = getDb();
    const posts = db.prepare('SELECT * FROM posts ORDER BY created_at DESC').all();
    res.json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single post
router.get('/posts/:id', (req, res) => {
  try {
    const db = getDb();
    const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
    if (post) {
      res.json({ success: true, data: post });
    } else {
      res.status(404).json({ success: false, error: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new post
router.post('/posts', (req, res) => {
  try {
    const { title, content, author } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, error: 'Title and content are required' });
    }
    
    const db = getDb();
    const result = db.prepare(`
      INSERT INTO posts (title, content, author) VALUES (?, ?, ?)
    `).run(title, content, author || 'Anonymous');
    
    const newPost = db.prepare('SELECT * FROM posts WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Like a post
router.post('/posts/:id/like', (req, res) => {
  try {
    const db = getDb();
    db.prepare('UPDATE posts SET likes = likes + 1 WHERE id = ?').run(req.params.id);
    const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
    if (post) {
      res.json({ success: true, data: post });
    } else {
      res.status(404).json({ success: false, error: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete a post
router.delete('/posts/:id', (req, res) => {
  try {
    const db = getDb();
    const result = db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);
    if (result.changes > 0) {
      res.json({ success: true, message: 'Post deleted successfully' });
    } else {
      res.status(404).json({ success: false, error: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Submit contact message
router.post('/contact', (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }
    
    const db = getDb();
    db.prepare(`
      INSERT INTO messages (name, email, message) VALUES (?, ?, ?)
    `).run(name, email, message);
    
    res.status(201).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get visitor stats
router.get('/stats', (req, res) => {
  try {
    const db = getDb();
    const totalPosts = db.prepare('SELECT COUNT(*) as count FROM posts').get();
    const totalLikes = db.prepare('SELECT SUM(likes) as total FROM posts').get();
    const totalMessages = db.prepare('SELECT COUNT(*) as count FROM messages').get();
    
    res.json({
      success: true,
      data: {
        posts: totalPosts.count,
        likes: totalLikes.total || 0,
        messages: totalMessages.count
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
