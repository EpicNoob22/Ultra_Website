/* ========================================
   ULTRA WEBSITE - JAVASCRIPT
   Bringing the magic to life ✨
   ======================================== */

// DOM Elements
const elements = {
  themeToggle: document.getElementById('themeToggle'),
  mobileMenuBtn: document.getElementById('mobileMenuBtn'),
  navLinks: document.querySelector('.nav-links'),
  createPostToggle: document.getElementById('createPostToggle'),
  createPostForm: document.getElementById('createPostForm'),
  postsGrid: document.getElementById('postsGrid'),
  contactForm: document.getElementById('contactForm'),
  heroStats: document.getElementById('heroStats'),
  toastContainer: document.getElementById('toastContainer')
};

// State
let posts = [];
let likedPosts = new Set(JSON.parse(localStorage.getItem('likedPosts') || '[]'));

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initForms();
  loadPosts();
  loadStats();
  initScrollAnimations();
  initSmoothScroll();
});

// ========================================
// THEME TOGGLE
// ========================================
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    elements.themeToggle.querySelector('.theme-icon').textContent = '☀️';
  }

  elements.themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
  document.body.classList.toggle('light-mode');
  const isLight = document.body.classList.contains('light-mode');
  elements.themeToggle.querySelector('.theme-icon').textContent = isLight ? '☀️' : '🌙';
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

// ========================================
// NAVIGATION
// ========================================
function initNavigation() {
  // Mobile menu toggle
  elements.mobileMenuBtn.addEventListener('click', () => {
    elements.navLinks.classList.toggle('active');
    elements.mobileMenuBtn.classList.toggle('active');
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// ========================================
// SMOOTH SCROLL
// ========================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        elements.navLinks.classList.remove('active');
      }
    });
  });
}

// ========================================
// FORMS
// ========================================
function initForms() {
  // Create post toggle
  elements.createPostToggle.addEventListener('click', () => {
    elements.createPostToggle.classList.toggle('active');
    elements.createPostForm.classList.toggle('active');
  });

  // Create post form
  elements.createPostForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      title: formData.get('title'),
      content: formData.get('content'),
      author: formData.get('author') || 'Anonymous'
    };

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      
      if (result.success) {
        showToast('Post created successfully! ✨', 'success');
        e.target.reset();
        elements.createPostToggle.classList.remove('active');
        elements.createPostForm.classList.remove('active');
        loadPosts();
        loadStats();
      } else {
        showToast(result.error || 'Failed to create post', 'error');
      }
    } catch (error) {
      showToast('An error occurred', 'error');
    }
  });

  // Contact form
  elements.contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message')
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      
      if (result.success) {
        showToast('Message sent successfully! 💌', 'success');
        e.target.reset();
        loadStats();
      } else {
        showToast(result.error || 'Failed to send message', 'error');
      }
    } catch (error) {
      showToast('An error occurred', 'error');
    }
  });
}

// ========================================
// POSTS
// ========================================
async function loadPosts() {
  try {
    const response = await fetch('/api/posts');
    const result = await response.json();
    
    if (result.success) {
      posts = result.data;
      renderPosts();
    }
  } catch (error) {
    elements.postsGrid.innerHTML = '<p class="error-message">Failed to load posts</p>';
  }
}

function renderPosts() {
  if (posts.length === 0) {
    elements.postsGrid.innerHTML = `
      <div class="no-posts">
        <p>No posts yet. Be the first to create one! 🚀</p>
      </div>
    `;
    return;
  }

  elements.postsGrid.innerHTML = posts.map(post => `
    <article class="post-card" data-id="${post.id}">
      <div class="post-header">
        <div class="post-avatar">${getInitials(post.author)}</div>
        <div class="post-meta">
          <span class="post-author">${escapeHtml(post.author)}</span>
          <span class="post-date">${formatDate(post.created_at)}</span>
        </div>
      </div>
      <h3 class="post-title">${escapeHtml(post.title)}</h3>
      <p class="post-content">${escapeHtml(post.content)}</p>
      <div class="post-actions">
        <button class="like-btn ${likedPosts.has(post.id) ? 'liked' : ''}" onclick="likePost(${post.id})">
          <span class="like-icon">${likedPosts.has(post.id) ? '❤️' : '🤍'}</span>
          <span class="like-count">${post.likes}</span>
        </button>
        <button class="delete-btn" onclick="deletePost(${post.id})" title="Delete post">
          🗑️
        </button>
      </div>
    </article>
  `).join('');
}

async function likePost(id) {
  if (likedPosts.has(id)) {
    showToast('You already liked this post! 💜', 'success');
    return;
  }

  try {
    const response = await fetch(`/api/posts/${id}/like`, { method: 'POST' });
    const result = await response.json();
    
    if (result.success) {
      likedPosts.add(id);
      localStorage.setItem('likedPosts', JSON.stringify([...likedPosts]));
      
      // Update UI
      const postCard = document.querySelector(`.post-card[data-id="${id}"]`);
      const likeBtn = postCard.querySelector('.like-btn');
      const likeIcon = postCard.querySelector('.like-icon');
      const likeCount = postCard.querySelector('.like-count');
      
      likeBtn.classList.add('liked');
      likeIcon.textContent = '❤️';
      likeCount.textContent = result.data.likes;
      
      showToast('Post liked! ❤️', 'success');
      loadStats();
    }
  } catch (error) {
    showToast('Failed to like post', 'error');
  }
}

async function deletePost(id) {
  if (!confirm('Are you sure you want to delete this post?')) return;

  try {
    const response = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    const result = await response.json();
    
    if (result.success) {
      showToast('Post deleted! 🗑️', 'success');
      loadPosts();
      loadStats();
    } else {
      showToast(result.error || 'Failed to delete post', 'error');
    }
  } catch (error) {
    showToast('Failed to delete post', 'error');
  }
}

// ========================================
// STATS
// ========================================
async function loadStats() {
  try {
    const response = await fetch('/api/stats');
    const result = await response.json();
    
    if (result.success) {
      animateStats(result.data);
    }
  } catch (error) {
    console.error('Failed to load stats:', error);
  }
}

function animateStats(stats) {
  const statNumbers = elements.heroStats.querySelectorAll('.stat-number');
  const values = [stats.posts, stats.likes, stats.messages];
  
  statNumbers.forEach((el, index) => {
    animateNumber(el, 0, values[index], 1500);
    el.dataset.target = values[index];
  });
}

function animateNumber(element, start, end, duration) {
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(start + (end - start) * easeOutQuart);
    
    element.textContent = current;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

// ========================================
// SCROLL ANIMATIONS
// ========================================
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.feature-card, .post-card, .contact-form').forEach(el => {
    observer.observe(el);
  });
}

// ========================================
// TOAST NOTIFICATIONS
// ========================================
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '✅' : '❌'}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">×</button>
  `;
  
  elements.toastContainer.appendChild(toast);
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ========================================
// UTILITIES
// ========================================
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function getInitials(name) {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}

// Make functions global for onclick handlers
window.likePost = likePost;
window.deletePost = deletePost;
