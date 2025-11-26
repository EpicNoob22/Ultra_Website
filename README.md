# ✨ Ultra Website

> The most beautiful, ultra-cool, self-hosted website you've ever seen!

![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Self-Hosted](https://img.shields.io/badge/Self--Hosted-Yes-purple.svg)

## 🚀 Features

- **🎨 Stunning Design** - Glassmorphism, smooth animations, beautiful gradients
- **🗄️ Database Powered** - SQLite for persistent data storage
- **🏠 Self-Hosted** - Deploy anywhere, your data stays with you
- **📱 Fully Responsive** - Perfect on every device
- **🌙 Dark/Light Mode** - Easy on the eyes, day or night
- **🐳 Docker Ready** - One-command deployment

## 📦 Tech Stack

- **Backend**: Node.js + Express
- **Database**: SQLite (via better-sqlite3)
- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Deployment**: Docker & Docker Compose

## 🛠️ Quick Start

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/ultra-website.git
cd ultra-website

# Start with Docker Compose
docker-compose up -d

# Visit http://localhost:3000
```

### Option 2: Manual Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ultra-website.git
cd ultra-website

# Install dependencies
npm install

# Start the server
npm start

# Visit http://localhost:3000
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `SESSION_SECRET` | Session secret key | `ultra-secret-key-change-in-production` |

### Production Setup

For production, create a `.env` file:

```env
NODE_ENV=production
SESSION_SECRET=your-super-secret-key-here
PORT=3000
```

## 📁 Project Structure

```
ultra-website/
├── src/
│   ├── config/
│   │   └── database.js     # SQLite configuration
│   ├── public/
│   │   ├── css/
│   │   │   └── style.css   # Beautiful styles
│   │   └── js/
│   │       └── app.js      # Frontend logic
│   ├── routes/
│   │   └── api.js          # API endpoints
│   ├── views/
│   │   └── index.html      # Main HTML template
│   └── server.js           # Express server
├── data/                   # SQLite database (auto-created)
├── docker-compose.yml      # Docker configuration
├── Dockerfile              # Docker image definition
├── package.json            # Dependencies
└── README.md               # This file
```

## 🔌 API Endpoints

### Posts

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/posts` | Get all posts |
| `GET` | `/api/posts/:id` | Get single post |
| `POST` | `/api/posts` | Create new post |
| `POST` | `/api/posts/:id/like` | Like a post |
| `DELETE` | `/api/posts/:id` | Delete a post |

### Contact

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/contact` | Send contact message |

### Stats

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/stats` | Get site statistics |

## 🎨 Customization

### Colors

Edit CSS variables in `src/public/css/style.css`:

```css
:root {
  --primary: #8b5cf6;
  --secondary: #06b6d4;
  --accent: #f472b6;
  /* ... more colors */
}
```

### Sample Data

Initial posts are created in `src/config/database.js`. Modify the `initialize()` function to customize starting content.

## 🐳 Docker Commands

```bash
# Build and start
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop
docker-compose down

# Rebuild without cache
docker-compose build --no-cache
```

## 📸 Screenshots

The website features:
- Animated gradient orbs in background
- Glassmorphism cards with blur effects
- Smooth scroll animations
- Interactive post creation
- Like/delete functionality
- Contact form with toast notifications
- Fully responsive design

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 📄 License

MIT License - feel free to use this project for any purpose!

---

Made with 💜 and ✨ Ultra magic