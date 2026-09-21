/**
 * MITHILA GAMES // CORE RUNTIME SYSTEM
 * Clean, lightweight navigation, modal window controllers, and UI utilities
 */

(function () {
  'use strict';

  // --- GLOBAL FULL-SCREEN IMAGE VIEWER SYSTEM ---
  window.imageViewerState = {
    images: [],
    currentIndex: 0,
    title: ''
  };

  window.ensureImageViewer = function () {
    if (document.getElementById('image-viewer-modal')) return;

    const viewerHtml = `
      <div id="image-viewer-modal" class="fixed inset-0 z-[100] bg-void/95 backdrop-blur-xl hidden flex-col justify-between select-none" onclick="closeImageViewer()">
        
        <!-- Top Navigation Header -->
        <div class="px-4 sm:px-6 py-4 border-b border-borderwire bg-surface/90 flex items-center justify-between gap-4 shrink-0" onclick="event.stopPropagation()">
          <div class="flex items-center gap-3 text-xs overflow-hidden">
            <span class="text-xs font-semibold text-ochre">Preview</span>
            <span class="text-borderwire hidden sm:inline">|</span>
            <span id="iv-title" class="text-white truncate font-medium"></span>
          </div>

          <div class="flex items-center gap-3 shrink-0 font-mono text-xs">
            <span id="iv-counter" class="px-2.5 py-1 bg-panel border border-borderwire text-slate-muted text-[11px] tracking-wider font-semibold">
              01 / 01
            </span>
            <button 
              type="button" 
              onclick="closeImageViewer()" 
              class="p-1.5 px-3 bg-panel border border-borderwire hover:border-ochre text-slate-muted hover:text-white transition-colors flex items-center gap-1.5"
              aria-label="Close image viewer"
              title="Close (Esc)"
            >
              <span>✕</span>
              <span class="hidden sm:inline text-[10px] text-ochre font-bold">ESC</span>
            </button>
          </div>
        </div>

        <!-- Center Stage with Main Image & Prev/Next Chevrons -->
        <div class="relative flex-grow flex items-center justify-center p-4 sm:p-8 overflow-hidden" onclick="event.stopPropagation()">
          
          <button 
            type="button" 
            id="iv-prev-btn" 
            onclick="prevImageViewer()" 
            class="absolute left-3 sm:left-6 z-10 w-11 h-11 sm:w-14 sm:h-14 rounded bg-surface/90 border border-borderwire hover:border-ochre text-white hover:text-ochre text-2xl flex items-center justify-center transition-all backdrop-blur-md shadow-xl disabled:opacity-20 disabled:pointer-events-none"
            aria-label="Previous image"
            title="Previous (←)"
          >‹</button>

          <div class="max-w-full max-h-full flex items-center justify-center cursor-zoom-out" onclick="closeImageViewer()">
            <img 
              id="iv-main-img" 
              src="" 
              alt="Expanded Preview" 
              class="max-w-[92vw] max-h-[68vh] sm:max-h-[74vh] w-auto h-auto object-contain border border-borderwire shadow-2xl rounded-sm transition-all duration-200"
              onclick="event.stopPropagation()"
            >
          </div>

          <button 
            type="button" 
            id="iv-next-btn" 
            onclick="nextImageViewer()" 
            class="absolute right-3 sm:right-6 z-10 w-11 h-11 sm:w-14 sm:h-14 rounded bg-surface/90 border border-borderwire hover:border-ochre text-white hover:text-ochre text-2xl flex items-center justify-center transition-all backdrop-blur-md shadow-xl disabled:opacity-20 disabled:pointer-events-none"
            aria-label="Next image"
            title="Next (→)"
          >›</button>

        </div>

        <!-- Bottom Bar: Thumbnails & Keyboard Guide -->
        <div class="px-4 sm:px-6 py-3 border-t border-borderwire bg-surface/90 shrink-0 space-y-2" onclick="event.stopPropagation()">
          <div id="iv-thumbnails" class="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-1"></div>
          <div class="flex justify-between items-center text-[10px] font-mono text-slate-muted">
            <span class="hidden sm:inline">NAVIGATE: [← / →] ARROW KEYS</span>
            <span class="sm:hidden">SWIPE OR USE ARROWS</span>
            <span>CLICK OUTSIDE OR PRESS [ESC] TO DISMISS</span>
          </div>
        </div>

      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', viewerHtml);

    // Keyboard support: Escape, Left Arrow, Right Arrow
    window.addEventListener('keydown', (e) => {
      const modal = document.getElementById('image-viewer-modal');
      if (!modal || modal.classList.contains('hidden')) return;

      if (e.key === 'Escape') {
        window.closeImageViewer();
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        window.prevImageViewer();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        window.nextImageViewer();
      }
    });
  };

  window.openImageViewer = function (images, startIndex = 0, title = '') {
    window.ensureImageViewer();

    let list = [];
    if (Array.isArray(images)) {
      list = images.filter(Boolean);
    } else if (typeof images === 'string' && images) {
      list = [images];
    }
    if (list.length === 0) return;

    window.imageViewerState.images = list;
    window.imageViewerState.currentIndex = Math.max(0, Math.min(startIndex, list.length - 1));
    window.imageViewerState.title = title || 'Media Showcase';

    window.updateImageViewerDOM();
    window.showGameModal('image-viewer-modal');
  };

  window.closeImageViewer = function () {
    window.hideGameModal('image-viewer-modal');
  };

  window.setImageViewerIndex = function (index) {
    const total = window.imageViewerState.images.length;
    if (total === 0) return;
    window.imageViewerState.currentIndex = ((index % total) + total) % total;
    const img = document.getElementById('iv-main-img');
    if (img) {
      if (typeof window.playGameSfx === 'function') window.playGameSfx('hover');
      img.classList.add('modal-image-swap');
      setTimeout(() => {
        window.updateImageViewerDOM();
        img.classList.remove('modal-image-swap');
        img.classList.add('modal-image-ready');
        setTimeout(() => img.classList.remove('modal-image-ready'), 220);
      }, 90);
    } else {
      window.updateImageViewerDOM();
    }
  };

  window.nextImageViewer = function () {
    window.setImageViewerIndex(window.imageViewerState.currentIndex + 1);
  };

  window.prevImageViewer = function () {
    window.setImageViewerIndex(window.imageViewerState.currentIndex - 1);
  };

  window.updateImageViewerDOM = function () {
    const { images, currentIndex, title } = window.imageViewerState;
    if (images.length === 0) return;

    const mainImg = document.getElementById('iv-main-img');
    const titleEl = document.getElementById('iv-title');
    const counterEl = document.getElementById('iv-counter');
    const thumbsContainer = document.getElementById('iv-thumbnails');
    const prevBtn = document.getElementById('iv-prev-btn');
    const nextBtn = document.getElementById('iv-next-btn');

    if (mainImg) {
      mainImg.src = images[currentIndex];
      mainImg.alt = `${title} - Image ${currentIndex + 1}`;
    }
    if (titleEl) {
      titleEl.textContent = title;
    }
    if (counterEl) {
      const padCurr = String(currentIndex + 1).padStart(2, '0');
      const padTotal = String(images.length).padStart(2, '0');
      counterEl.textContent = `${padCurr} / ${padTotal}`;
    }

    if (prevBtn) prevBtn.disabled = images.length <= 1;
    if (nextBtn) nextBtn.disabled = images.length <= 1;

    if (thumbsContainer) {
      if (images.length > 1) {
        thumbsContainer.classList.remove('hidden');
        thumbsContainer.innerHTML = images.map((src, idx) => {
          const isActive = idx === currentIndex;
          return `
            <button 
              type="button" 
              onclick="setImageViewerIndex(${idx})"
              class="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded overflow-hidden border-2 transition-all ${isActive ? 'border-ochre scale-105 opacity-100 shadow-md' : 'border-borderwire opacity-60 hover:opacity-100 hover:border-slate-400'}"
              aria-label="View image ${idx + 1}"
            >
              <img src="${src}" alt="Thumbnail ${idx + 1}" class="w-full h-full object-cover">
            </button>
          `;
        }).join('');
      } else {
        thumbsContainer.classList.add('hidden');
        thumbsContainer.innerHTML = '';
      }
    }
  };

  // --- UNIFIED GAME SUB WINDOW / MODAL TRANSITIONS & SOUND ENGINE ---
  window.showGameModal = function (modalOrId, callback) {
    const modal = typeof modalOrId === 'string' ? document.getElementById(modalOrId) : modalOrId;
    if (!modal) return;

    modal.classList.add('game-modal-backdrop');
    if (modal.id !== 'image-viewer-modal') {
      const dialog = modal.querySelector('.game-modal-dialog') || modal.firstElementChild;
      if (dialog && !dialog.classList.contains('game-modal-dialog')) {
        dialog.classList.add('game-modal-dialog');
      }
    }

    if (modal._closeTimer) {
      clearTimeout(modal._closeTimer);
      modal._closeTimer = null;
    }

    modal.classList.remove('is-closing');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';

    // Force browser reflow so CSS transitions trigger cleanly
    void modal.offsetWidth;

    modal.classList.add('is-open');

    if (typeof window.playGameSfx === 'function') {
      window.playGameSfx('modal-open');
    }

    if (typeof callback === 'function') {
      callback();
    }
  };

  window.hideGameModal = function (modalOrId, callback) {
    const modal = typeof modalOrId === 'string' ? document.getElementById(modalOrId) : modalOrId;
    if (!modal || modal.classList.contains('hidden')) return;

    if (typeof window.playGameSfx === 'function') {
      window.playGameSfx('modal-close');
    }

    modal.classList.remove('is-open');
    modal.classList.add('is-closing');

    if (modal._closeTimer) clearTimeout(modal._closeTimer);

    modal._closeTimer = setTimeout(() => {
      modal.classList.remove('is-closing');
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      modal._closeTimer = null;

      // Only restore scroll if no other modal is currently open
      const otherOpen = document.querySelector('.game-modal-backdrop.is-open:not(.hidden)');
      if (!otherOpen) {
        document.body.style.overflow = '';
      }

      if (typeof callback === 'function') {
        callback();
      }
    }, 220);
  };

  // --- ACTIVE PRODUCT MODAL GALLERY CONTROLLER ---
  window.activeModalItemGallery = {
    images: [],
    currentIndex: 0,
    title: ''
  };

  window.setModalItemImageIndex = function (index) {
    const gallery = window.activeModalItemGallery;
    if (!gallery || gallery.images.length === 0) return;

    gallery.currentIndex = ((index % gallery.images.length) + gallery.images.length) % gallery.images.length;
    const imgEl = document.getElementById('modal-item-img');
    const counterEl = document.getElementById('modal-item-img-counter');
    const galleryContainer = document.getElementById('modal-item-gallery');

    if (imgEl) {
      if (typeof window.playGameSfx === 'function') window.playGameSfx('hover');
      imgEl.classList.add('modal-image-swap');
      setTimeout(() => {
        imgEl.src = gallery.images[gallery.currentIndex];
        imgEl.classList.remove('modal-image-swap');
        imgEl.classList.add('modal-image-ready');
        setTimeout(() => imgEl.classList.remove('modal-image-ready'), 220);
      }, 90);
    }
    if (counterEl) {
      counterEl.textContent = `${gallery.currentIndex + 1} / ${gallery.images.length}`;
    }

    if (galleryContainer) {
      const thumbs = galleryContainer.querySelectorAll('[data-thumb-idx]');
      thumbs.forEach((th, idx) => {
        if (idx === gallery.currentIndex) {
          th.className = 'w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded overflow-hidden border-2 border-ochre scale-105 opacity-100 transition-all shadow-md';
        } else {
          th.className = 'w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded overflow-hidden border-2 border-borderwire opacity-60 hover:opacity-100 transition-all';
        }
      });
    }
  };

  window.stepModalItemImage = function (step) {
    window.setModalItemImageIndex(window.activeModalItemGallery.currentIndex + step);
  };

  window.openActiveItemImageViewer = function () {
    const gallery = window.activeModalItemGallery;
    if (!gallery || gallery.images.length === 0) return;
    window.openImageViewer(gallery.images, gallery.currentIndex, gallery.title);
  };

  // --- PRODUCT / ITEM DETAILS MODAL WITH DEEP-LINKING URL & MULTI-IMAGE SUPPORT ---
  window.openProductModal = function (item, updateUrl = true) {
    let modal = document.getElementById('product-modal');
    if (!modal) return;

    const img = document.getElementById('modal-item-img');
    const title = document.getElementById('modal-item-title');
    const category = document.getElementById('modal-item-category');
    const price = document.getElementById('modal-item-price');
    const desc = document.getElementById('modal-item-desc');
    const specs = document.getElementById('modal-item-specs');
    const downloadBtn = document.getElementById('modal-item-download');

    // Multi-Image Gallery Setup
    let images = [];
    if (item.images && Array.isArray(item.images) && item.images.length > 0) {
      images = item.images.filter(Boolean);
    } else if (item.image) {
      images = [item.image];
    }

    window.activeModalItemGallery = {
      images: images,
      currentIndex: 0,
      title: item.title || 'Product Showcase'
    };

    if (img) {
      img.src = images[0] || '';
      img.alt = item.title || 'Product Image';
    }

    const counterEl = document.getElementById('modal-item-img-counter');
    const prevBtn = document.getElementById('modal-item-prev-btn');
    const nextBtn = document.getElementById('modal-item-next-btn');
    const galleryContainer = document.getElementById('modal-item-gallery');

    if (counterEl) {
      if (images.length > 1) {
        counterEl.classList.remove('hidden');
        counterEl.textContent = `1 / ${images.length}`;
      } else {
        counterEl.classList.add('hidden');
      }
    }

    if (prevBtn && nextBtn) {
      if (images.length > 1) {
        prevBtn.classList.remove('hidden');
        prevBtn.classList.add('flex');
        nextBtn.classList.remove('hidden');
        nextBtn.classList.add('flex');
      } else {
        prevBtn.classList.add('hidden');
        prevBtn.classList.remove('flex');
        nextBtn.classList.add('hidden');
        nextBtn.classList.remove('flex');
      }
    }

    if (galleryContainer) {
      if (images.length > 1) {
        galleryContainer.classList.remove('hidden');
        galleryContainer.innerHTML = images.map((src, idx) => `
          <button 
            type="button" 
            data-thumb-idx="${idx}"
            onclick="setModalItemImageIndex(${idx})"
            onmouseenter="if(window.playGameSfx) window.playGameSfx('hover');"
            class="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded overflow-hidden border-2 transition-all cursor-pointer ${idx === 0 ? 'border-ochre scale-105 opacity-100 shadow-md' : 'border-borderwire opacity-60 hover:opacity-100 hover:border-slate-400'}"
            aria-label="Thumbnail ${idx + 1}"
          >
            <img src="${src}" alt="Gallery ${idx + 1}" class="w-full h-full object-cover">
          </button>
        `).join('');
      } else {
        galleryContainer.classList.add('hidden');
        galleryContainer.innerHTML = '';
      }
    }

    if (title) title.textContent = item.title || '';
    if (category) category.textContent = item.category || item.categoryLabel || 'ASSET';
    if (price) price.textContent = item.price || 'FREE';
    if (desc) desc.textContent = item.fullDesc || item.shortDesc || item.description || '';
    
    if (specs) {
      if (item.specs && item.specs.length > 0) {
        specs.innerHTML = item.specs.map(s => `
          <div class="flex justify-between py-1 border-b border-borderwire/60 text-xs font-mono">
            <span class="text-slate-muted">${s.label}:</span>
            <span class="text-white font-semibold">${s.value}</span>
          </div>
        `).join('');
        specs.classList.remove('hidden');
      } else {
        specs.classList.add('hidden');
      }
    }

    if (downloadBtn) {
      downloadBtn.href = item.downloadUrl || '#';
      downloadBtn.textContent = (item.downloadText || 'DOWNLOAD PRODUCT') + ' →';
      if (item.downloadUrl && item.downloadUrl.startsWith('http')) {
        downloadBtn.target = '_blank';
      } else {
        downloadBtn.removeAttribute('target');
      }
    }

    // Set item's unique URL query parameter
    if (updateUrl && item.id) {
      const url = new URL(window.location);
      url.searchParams.set('item', item.id);
      window.history.pushState({ modalOpen: true, itemId: item.id }, '', url);
    }

    window.showGameModal(modal);
  };

  window.closeProductModal = function (updateUrl = true) {
    window.hideGameModal('product-modal');

    if (updateUrl) {
      const url = new URL(window.location);
      if (url.searchParams.has('item')) {
        url.searchParams.delete('item');
        window.history.pushState({}, '', url.pathname + (url.search ? url.search : ''));
      }
    }
  };

  // Helper function to copy item link
  window.copyItemUrl = function () {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      const btn = document.getElementById('modal-share-btn');
      if (btn) {
        const orig = btn.textContent;
        btn.textContent = 'COPIED!';
        setTimeout(() => { btn.textContent = orig; }, 1500);
      }
    });
  };

  // Automatically check URL on page load for ?item=
  window.checkDeepLinkItem = function () {
    const params = new URLSearchParams(window.location.search);
    const itemId = params.get('item');
    if (!itemId) return;

    let matchedItem = null;
    if (window.GAMES_DATA) {
      matchedItem = window.GAMES_DATA.find(g => g.id === itemId);
    }
    if (!matchedItem && window.SHOP_DATA) {
      matchedItem = window.SHOP_DATA.find(p => p.id === itemId);
    }

    if (matchedItem) {
      setTimeout(() => {
        window.openProductModal(matchedItem, false);
      }, 150);
    }
  };

  // --- GLOBAL UPDATE LETTER & NEWSLETTER MODAL CONTROLLER ---
  window.ensureNewsletterModal = function () {
    if (document.getElementById('newsletter-modal')) return;

    const modalHtml = `
      <div id="newsletter-modal" class="fixed inset-0 bg-void/85 backdrop-blur-md z-50 hidden items-center justify-center p-4 game-modal-backdrop" onclick="closeNewsletterModal()">
        <div class="bg-surface border-2 border-borderwire hover:border-ochre/40 rounded-2xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl space-y-4 bg-halftone-dots game-modal-dialog" onclick="event.stopPropagation()">
          
          <!-- Tactical HUD Corners -->
          <div class="hud-corner hud-corner-tl"></div>
          <div class="hud-corner hud-corner-tr"></div>
          <div class="hud-corner hud-corner-bl"></div>
          <div class="hud-corner hud-corner-br"></div>


          <div class="flex justify-between items-start pb-3 border-b border-borderwire">
            <div>
              <span class="text-xs font-semibold text-ochre uppercase tracking-wider">Mithila Games</span>
              <h2 class="font-syne font-black italic text-xl sm:text-2xl text-white uppercase mt-0.5">Subscribe to Updates</h2>
            </div>
            <button type="button" onclick="closeNewsletterModal()" onmouseenter="if(window.playGameSfx) window.playGameSfx('hover');" class="w-8 h-8 rounded-lg bg-panel border border-borderwire hover:border-ochre flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer font-bold" aria-label="Close modal">✕</button>
          </div>

          <p class="font-sans text-xs text-slate-300 leading-relaxed">
            Stay connected with our studio. Receive updates on new game releases, devlogs, and free open-source tools.
          </p>

          <form id="google-newsletter-form" onsubmit="submitGoogleNewsletter(event)" class="space-y-4 pt-1">
            <div>
              <label for="subscriber-email" class="text-slate-300 block text-xs font-medium mb-1.5">Email Address</label>
              <input 
                type="email" 
                id="subscriber-email" 
                required 
                placeholder="name@domain.com" 
                class="w-full bg-void border border-borderwire rounded-lg px-3.5 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-ochre transition-colors text-sm"
              >
            </div>

            <button 
              type="submit" 
              id="subscriber-submit-btn" 
              class="game-btn game-btn-ochre w-full py-3 text-void font-extrabold rounded-xl tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 text-xs"
            >
              <span>TRANSMIT SUBSCRIPTION →</span>
            </button>

            <div id="subscriber-status" class="hidden p-3 rounded-lg bg-void border border-ochre/40 text-ochre text-xs"></div>
          </form>
        </div>
      </div>
    `;
    const temp = document.createElement('div');
    temp.innerHTML = modalHtml;
    document.body.appendChild(temp.firstElementChild);
  };

  window.openNewsletterModal = function () {
    window.ensureNewsletterModal();
    const input = document.getElementById('subscriber-email');
    const status = document.getElementById('subscriber-status');
    if (status) status.classList.add('hidden');
    window.showGameModal('newsletter-modal', () => {
      if (input) setTimeout(() => input.focus(), 120);
    });
  };

  window.closeNewsletterModal = function () {
    window.hideGameModal('newsletter-modal');
  };

  window.submitGoogleNewsletter = function (e) {
    e.preventDefault();
    const emailInput = document.getElementById('subscriber-email');
    const email = emailInput ? emailInput.value.trim() : '';
    const status = document.getElementById('subscriber-status');
    const btn = document.getElementById('subscriber-submit-btn');

    if (!email) return;

    btn.disabled = true;
    btn.textContent = 'SUBMITTING...';
    if (status) {
      status.classList.remove('hidden');
      status.textContent = 'Subscribing to News & Update Letter...';
    }

    const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLScxfDsAnnoPtq8w5GdNVhzHdrxUqe1Py5c-AyfqCFbnNlOrlA/formResponse';
    
    const payload = new URLSearchParams();
    payload.append('entry.1884408784', 'News & Updates Subscriber');
    payload.append('entry.1819151916', email);
    payload.append('entry.195861844', '[NEWSLETTER] Subscribed to Studio News & Update Letter.');

    let completed = false;
    const finalizeSuccess = () => {
      if (completed) return;
      completed = true;
      if (status) {
        status.classList.remove('hidden');
        status.innerHTML = `<span class="text-emerald-400 font-bold">[SUCCESS]</span> ${email} is now subscribed to News & Updates!`;
      }
      btn.textContent = 'SUBSCRIBED';
      if (emailInput) emailInput.value = '';
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = 'SUBSCRIBE TO UPDATE LETTER';
        window.closeNewsletterModal();
      }, 1000);
    };

    try {
      fetch(formUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload
      }).then(finalizeSuccess).catch(finalizeSuccess);
    } catch (err) {
      finalizeSuccess();
    }

    setTimeout(finalizeSuccess, 1200);
  };

  // --- INITIALIZE NAVIGATION LISTENERS ---
  document.addEventListener('DOMContentLoaded', function () {
    // Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileClose = document.getElementById('mobile-menu-close');

    if (mobileToggle && mobileMenu) {
      mobileToggle.addEventListener('click', () => mobileMenu.classList.remove('hidden'));
    }
    if (mobileClose && mobileMenu) {
      mobileClose.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    }

    // Active Tab Highlighting for Desktop, Ribbon, and Mobile Drawer
    const currentPath = window.location.pathname.split('/').pop() || 'home.html';
    const isHome = currentPath === '' || currentPath === 'index.html' || currentPath === 'home.html';

    // 1. Desktop & Tablet Nav Links (Game HUD styling)
    document.querySelectorAll('nav a[data-nav-link]').forEach((link) => {
      const href = link.getAttribute('href');
      const match = (isHome && (href === 'home.html' || href === 'index.html')) || href === currentPath;
      link.classList.add('nav-game-tab');
      if (match) {
        link.classList.add('active-tab');
        link.classList.remove('text-slate-muted');
      } else {
        link.classList.remove('active-tab');
        link.classList.add('text-slate-muted');
      }
    });

    // 2. Mobile Ribbon Links
    document.querySelectorAll('[data-mobile-ribbon-link]').forEach((link) => {
      const href = link.getAttribute('href');
      const match = (isHome && (href === 'home.html' || href === 'index.html')) || href === currentPath;
      if (match) {
        link.className = 'px-3 py-1 bg-lime-400 text-void font-extrabold whitespace-nowrap text-xs shadow-md rounded-lg transform -rotate-1';
      } else {
        link.className = 'px-3 py-1 bg-surface border border-borderwire text-slate-muted hover:text-white whitespace-nowrap text-xs transition-colors rounded-lg';
      }
    });

    // 3. Mobile Drawer Links
    document.querySelectorAll('[data-mobile-drawer-link]').forEach((link) => {
      const href = link.getAttribute('href');
      const match = (isHome && (href === 'home.html' || href === 'index.html')) || href === currentPath;
      if (match) {
        link.className = 'p-3 bg-lime-400 text-void font-extrabold rounded-xl shadow-md';
      } else {
        link.className = 'p-3 bg-surface border border-borderwire text-slate-muted hover:text-white rounded-xl transition-colors';
      }
    });

    // Handle browser Back / Forward buttons for modal state
    window.addEventListener('popstate', (e) => {
      const params = new URLSearchParams(window.location.search);
      if (params.has('item')) {
        window.checkDeepLinkItem();
      } else {
        window.closeProductModal(false);
      }
    });

    // Pre-cache image viewer and check deep linking on load
    window.ensureImageViewer();
    window.checkDeepLinkItem();

    // Initialize Game UI Engine
    initCardTiltPhysics();
    initGameKeyboardBindings();
    initSfxBindings();
    updateSfxButtonUI();
  });

  // =========================================================================
  // KINETIC GAME UI CONTROLLER (3D TILT PHYSICS, AUDIO SYNTH & HOTKEYS)
  // =========================================================================
  let audioCtx = null;
  let isMuted = false;

  function getAudioContext() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  window.playGameSfx = function (type) {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'hover') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(540, now);
        osc.frequency.exponentialRampToValueAtTime(780, now + 0.04);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'click') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(820, now);
        osc.frequency.exponentialRampToValueAtTime(260, now + 0.06);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
      } else if (type === 'modal-open') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(640, now + 0.08);
        gain.gain.setValueAtTime(0.16, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'modal-close') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(240, now + 0.07);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
        osc.start(now);
        osc.stop(now + 0.07);
      }
    } catch (e) {
      // Audio policy safe
    }
  };

  window.toggleGameSfx = function () {
    isMuted = !isMuted;
    localStorage.setItem('game_sfx_muted', isMuted);
    updateSfxButtonUI();
    if (!isMuted) window.playGameSfx('click');
  };

  function updateSfxButtonUI() {
    const btn = document.getElementById('sfx-toggle-btn');
    if (btn) {
      btn.innerHTML = isMuted 
        ? `<span class="opacity-60 text-xs">🔇 SFX OFF</span>`
        : `<span class="text-lime-400 font-bold text-xs">🔊 SFX ON</span>`;
    }
  }

  function initCardTiltPhysics() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let activeCard = null;
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let targetTranslateY = 0;
    let currentTranslateY = 0;
    let targetScale = 1.0;
    let currentScale = 1.0;
    let isHovered = false;
    let animId = null;

    function updateTilt() {
      if (!activeCard) return;

      // Smooth dampening / spring interpolation (0.10 factor for buttery glide)
      currentRotX += (targetRotX - currentRotX) * 0.10;
      currentRotY += (targetRotY - currentRotY) * 0.10;
      currentTranslateY += (targetTranslateY - currentTranslateY) * 0.10;
      currentScale += (targetScale - currentScale) * 0.10;

      activeCard.style.transform = `perspective(900px) rotateX(${currentRotX.toFixed(3)}deg) rotateY(${currentRotY.toFixed(3)}deg) translateY(${currentTranslateY.toFixed(3)}px) scale(${currentScale.toFixed(4)})`;

      const diffX = Math.abs(targetRotX - currentRotX);
      const diffY = Math.abs(targetRotY - currentRotY);
      const diffYPos = Math.abs(targetTranslateY - currentTranslateY);
      const diffScale = Math.abs(targetScale - currentScale);

      if (isHovered || diffX > 0.01 || diffY > 0.01 || diffYPos > 0.05 || diffScale > 0.001) {
        animId = requestAnimationFrame(updateTilt);
      } else {
        activeCard.style.transform = '';
        activeCard.style.removeProperty('--glare-opacity');
        activeCard = null;
        animId = null;
      }
    }

    document.addEventListener('mousemove', (e) => {
      const card = e.target.closest('.game-tilt-card, .studio-card');
      if (!card) {
        if (activeCard && isHovered) {
          isHovered = false;
          targetRotX = 0;
          targetRotY = 0;
          targetTranslateY = 0;
          targetScale = 1.0;
          activeCard.style.setProperty('--glare-opacity', '0');
        }
        return;
      }

      if (activeCard !== card) {
        if (activeCard) {
          activeCard.style.transform = '';
          activeCard.style.removeProperty('--glare-opacity');
        }
        activeCard = card;
        currentRotX = 0;
        currentRotY = 0;
        currentTranslateY = 0;
        currentScale = 1.0;
      }

      isHovered = true;
      targetTranslateY = -4;
      targetScale = 1.015;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      targetRotX = -(y / (rect.height / 2)) * 6.0;
      targetRotY = (x / (rect.width / 2)) * 6.0;

      // Dynamic holographic specular sheen tracking
      const pctX = Math.round(((e.clientX - rect.left) / rect.width) * 100);
      const pctY = Math.round(((e.clientY - rect.top) / rect.height) * 100);
      card.style.setProperty('--glare-x', `${pctX}%`);
      card.style.setProperty('--glare-y', `${pctY}%`);
      card.style.setProperty('--glare-opacity', '1');

      if (!animId) {
        animId = requestAnimationFrame(updateTilt);
      }
    });

    document.addEventListener('mouseout', (e) => {
      const card = e.target.closest('.game-tilt-card, .studio-card');
      if (card && (!e.relatedTarget || !card.contains(e.relatedTarget))) {
        isHovered = false;
        targetRotX = 0;
        targetRotY = 0;
        targetTranslateY = 0;
        targetScale = 1.0;
        card.style.setProperty('--glare-opacity', '0');
        if (!animId) {
          animId = requestAnimationFrame(updateTilt);
        }
      }
    });
  }

  function initGameKeyboardBindings() {
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (e.key === 'Escape') {
        if (typeof window.closeNewsModal === 'function') window.closeNewsModal();
        if (typeof window.closeNewsletterModal === 'function') window.closeNewsletterModal();
        if (typeof window.closeProductModal === 'function') window.closeProductModal();
        if (typeof window.closeImageViewer === 'function') window.closeImageViewer();
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
        }
      } else if (e.key === 'm' || e.key === 'M') {
        window.toggleGameSfx();
      } else if (e.key === 'ArrowLeft') {
        if (typeof window.stepHeroSlide === 'function') window.stepHeroSlide(-1);
        if (typeof window.stepModalNewsImage === 'function') window.stepModalNewsImage(-1);
        if (typeof window.stepImageViewer === 'function') window.stepImageViewer(-1);
      } else if (e.key === 'ArrowRight') {
        if (typeof window.stepHeroSlide === 'function') window.stepHeroSlide(1);
        if (typeof window.stepModalNewsImage === 'function') window.stepModalNewsImage(1);
        if (typeof window.stepImageViewer === 'function') window.stepImageViewer(1);
      } else if (e.key === '1') {
        window.location.href = 'home.html';
      } else if (e.key === '2') {
        window.location.href = 'games.html';
      } else if (e.key === '3') {
        window.location.href = 'store.html';
      } else if (e.key === '4') {
        window.location.href = 'news.html';
      } else if (e.key === '5') {
        window.location.href = 'about.html';
      } else if (e.key === '6') {
        window.location.href = 'connect.html';
      }
    });
  }

  function initSfxBindings() {
    document.addEventListener('mouseenter', (e) => {
      if (e.target.closest('button, a, .game-btn, .studio-card, .news-filter-pill, .shop-filter-pill')) {
        window.playGameSfx('hover');
      }
    }, true);

    document.addEventListener('click', (e) => {
      if (e.target.closest('button, a, .game-btn, .news-filter-pill, .shop-filter-pill')) {
        window.playGameSfx('click');
      }
    }, true);
  }
})();
