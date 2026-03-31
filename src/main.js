// Minimal logic for Modal

class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById('bg-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    // スマホ等のため、画面幅に応じて描画数を制限し軽量化
    this.particleCount = window.innerWidth < 768 ? 30 : 70;

    this.resize = this.resize.bind(this);
    this.animate = this.animate.bind(this);

    window.addEventListener('resize', this.resize);
    this.resize();
    this.init();
    
    // requestAnimationFrameによる軽量アニメーション
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 1.5 + 0.5,
        speedY: Math.random() * 0.4 + 0.1,
        speedX: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.4 + 0.1
      });
    }
  }

  animate() {
    // 描画をクリアして更新
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#ffffff';

    this.particles.forEach(p => {
      // 少しずつ上へ浮かび上がる（埃や火の粉のような表現）
      p.y -= p.speedY;
      p.x += p.speedX;

      // 画面上端を超えたら下端へループ
      if (p.y < -p.size) {
        p.y = this.canvas.height + p.size;
        p.x = Math.random() * this.canvas.width;
      }
      
      // 左右の画面外対応
      if (p.x < -p.size) p.x = this.canvas.width + p.size;
      else if (p.x > this.canvas.width + p.size) p.x = -p.size;

      this.ctx.globalAlpha = p.opacity;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    });

    requestAnimationFrame(this.animate);
  }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('video-modal');
  const closeBtn = document.querySelector('.close-btn');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const modalMediaContainer = document.getElementById('modal-media-container');
  const modalCaption = document.getElementById('modal-caption');
  
  const galleryItems = document.querySelectorAll('.gallery-item');
  let currentGallery = [];
  let currentIndex = -1;

  const updateModalContent = () => {
    if (currentIndex >= 0 && currentGallery.length > 0) {
      const item = currentGallery[currentIndex];
      const title = item.getAttribute('data-title');
      const vimeoId = item.getAttribute('data-vimeo-id');
      const category = item.getAttribute('data-category');
      
      modalMediaContainer.innerHTML = '';
      
      if (vimeoId) {
        let vimeoClass = category === 'short' ? 'vimeo-vertical' : 'vimeo-responsive';
        modalMediaContainer.innerHTML = `<iframe class="${vimeoClass}" src="https://player.vimeo.com/video/${vimeoId}?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;autoplay=1" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" title="${title}"></iframe>`;
      } else {
        const img = item.querySelector('img').src;
        modalMediaContainer.innerHTML = `<img src="${img}" alt="${title}" class="modal-img" />`;
      }
      
      modalCaption.textContent = title;
    }
  };

  const showNext = () => {
    if (currentGallery.length > 0) {
      currentIndex = (currentIndex + 1) % currentGallery.length;
      updateModalContent();
    }
  };

  const showPrev = () => {
    if (currentGallery.length > 0) {
      currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
      updateModalContent();
    }
  };

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const group = item.getAttribute('data-group');
      currentGallery = Array.from(document.querySelectorAll(`.gallery-item[data-group="${group}"]:not(.hidden)`));
      currentIndex = currentGallery.indexOf(item);
      
      updateModalContent();
      modal.classList.add('active');
    });

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        item.click();
      }
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    modalMediaContainer.innerHTML = ''; // Stop video playback when closing
  };

  closeBtn.addEventListener('click', closeModal);
  prevBtn.addEventListener('click', showPrev);
  nextBtn.addEventListener('click', showNext);

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('modal-content')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (modal.classList.contains('active')) {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    }
  });

  // Initialize particles
  new ParticleSystem();

  // Hamburger Menu Logic
  const hmBtn = document.querySelector('.hamburger-btn');
  const fsMenu = document.querySelector('.fullscreen-menu');
  const navLinks = document.querySelectorAll('.menu-link');

  const toggleMenu = () => {
    hmBtn.classList.toggle('active');
    fsMenu.classList.toggle('active');
  };

  hmBtn.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hmBtn.classList.remove('active');
      fsMenu.classList.remove('active');
    });
  });

  // Work Filters Logic
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      workItems.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // --- Opening Loader Controller ---
  const openingOverlay = document.getElementById('opening-overlay');
  if (openingOverlay) {
    // 演出時間（2.5s）+ 余裕を持ってフェードアウトを開始
    setTimeout(() => {
      openingOverlay.classList.add('fade-out');
      
      // アニメーション完了後に要素を削除して負荷を減らす
      setTimeout(() => {
        openingOverlay.remove();
      }, 1000); // CSSのtransition時間(1s)に合わせる
    }, 2800);
  }
});
