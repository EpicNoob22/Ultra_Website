const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', '..', 'data', 'ultra.db');

let db;

function initialize() {
  const fs = require('fs');
  const dataDir = path.join(__dirname, '..', '..', 'data');
  
  // Create data directory if it doesn't exist
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  db = new Database(dbPath);
  
  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      author TEXT DEFAULT 'Anonymous',
      likes INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS visitors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip TEXT,
      user_agent TEXT,
      page TEXT,
      visited_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Insert sample data if posts table is empty
  const count = db.prepare('SELECT COUNT(*) as count FROM posts').get();
  if (count.count === 0) {
    const insertPost = db.prepare(`
      INSERT INTO posts (title, content, author, likes) VALUES (?, ?, ?, ?)
    `);
    
    insertPost.run(
      'Welcome to Ultra Website! 🚀',
      'This is the most beautiful, ultra-cool website you\'ve ever seen. Built with love, passion, and cutting-edge technology. Explore the stunning animations, the smooth interactions, and the gorgeous design.',
      'Ultra Team',
      42
    );
    
    insertPost.run(
      'Features That Make Us Ultra ✨',
      'Self-hosted architecture, SQLite database, beautiful glassmorphism design, smooth animations, dark mode support, and fully responsive layout. Everything you need for an amazing web experience!',
      'Ultra Team',
      38
    );
    
    insertPost.run(
      'Join the Ultra Community 💫',
      'We believe in creating experiences that inspire and delight. Every pixel, every animation, every interaction has been carefully crafted to bring joy to your browsing experience.',
      'Ultra Team',
      25
    );
  }

  console.log('✅ Database initialized successfully');
  return db;
}

function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initialize() first.');
  }
  return db;
}

module.exports = {
  initialize,
  getDb
};
