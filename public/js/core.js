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
          <div class="flex items-center gap-3 font-mono text-xs overflow-hidden">
            <div class="flex items-center gap-2 text-ochre font-bold shrink-0">
              <span class="w-2 h-2 rounded-full bg-ochre status-dot-pulse"></span>
              <span class="uppercase tracking-wider">IMAGE VIEWER</span>
            </div>
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

    const modal = document.getElementById('image-viewer-modal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeImageViewer = function () {
    const modal = document.getElementById('image-viewer-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      // Only restore scroll if other modals are not open
      const prodModal = document.getElementById('product-modal');
      const newsModal = document.getElementById('news-modal');
      const subModal = document.getElementById('newsletter-modal');
      const isAnyModalOpen = (prodModal && !prodModal.classList.contains('hidden')) ||
                             (newsModal && !newsModal.classList.contains('hidden')) ||
                             (subModal && !subModal.classList.contains('hidden'));
      if (!isAnyModalOpen) {
        document.body.style.overflow = '';
      }
    }
  };

  window.setImageViewerIndex = function (index) {
    const total = window.imageViewerState.images.length;
    if (total === 0) return;
    window.imageViewerState.currentIndex = ((index % total) + total) % total;
    window.updateImageViewerDOM();
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
      imgEl.src = gallery.images[gallery.currentIndex];
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
            class="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded overflow-hidden border-2 transition-all ${idx === 0 ? 'border-ochre scale-105 opacity-100 shadow-md' : 'border-borderwire opacity-60 hover:opacity-100'}"
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
      downloadBtn.textContent = item.downloadText || 'DOWNLOAD PRODUCT';
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

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  };

  window.closeProductModal = function (updateUrl = true) {
    const modal = document.getElementById('product-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = '';
    }

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
      <div id="newsletter-modal" class="fixed inset-0 bg-void/90 backdrop-blur-md z-50 hidden items-center justify-center p-4" onclick="closeNewsletterModal()">
        <div class="bg-surface border border-ochre max-w-md w-full p-6 sm:p-7 relative corner-brackets shadow-2xl space-y-4" onclick="event.stopPropagation()">
          
          <div class="flex justify-between items-start pb-3 border-b border-borderwire">
            <div>
              <div class="flex items-center gap-2 font-mono text-[10px] text-ochre uppercase font-bold tracking-wider">
                <span class="w-2 h-2 rounded-full bg-ochre status-dot-pulse"></span>
                <span>MITHILA GAMES // UPDATE LETTER</span>
              </div>
              <h2 class="font-syne font-bold text-xl sm:text-2xl text-white mt-1">Subscribe to News &amp; Updates</h2>
            </div>
            <button type="button" onclick="closeNewsletterModal()" class="p-1 text-slate-muted hover:text-white text-lg" aria-label="Close modal">✕</button>
          </div>

          <p class="font-sans text-xs text-slate-300 leading-relaxed">
            Stay connected with our studio. Receive our periodic update letters covering new game releases, devlogs, playtests, and open-source tools.
          </p>

          <div class="p-3 bg-panel border border-borderwire space-y-2 text-xs font-mono text-slate-300">
            <div class="flex items-center gap-2.5">
              <span class="text-ochre font-bold">✓</span>
              <span>Studio news &amp; game launch announcements</span>
            </div>
            <div class="flex items-center gap-2.5">
              <span class="text-ochre font-bold">✓</span>
              <span>Technical devlogs &amp; Godot engine tutorials</span>
            </div>
            <div class="flex items-center gap-2.5">
              <span class="text-ochre font-bold">✓</span>
              <span>Early playtest keys &amp; free CC0 tool releases</span>
            </div>
          </div>

          <form id="google-newsletter-form" onsubmit="submitGoogleNewsletter(event)" class="space-y-3 font-mono text-xs">
            <div class="space-y-1">
              <label for="subscriber-email" class="text-slate-muted block text-[11px] font-semibold uppercase">YOUR EMAIL ADDRESS *</label>
              <input 
                type="email" 
                id="subscriber-email" 
                required 
                placeholder="your.email@domain.com" 
                class="w-full bg-void border border-borderwire px-3.5 py-2.5 text-white placeholder:text-slate-muted/40 focus:outline-none focus:border-ochre"
              >
            </div>

            <button 
              type="submit" 
              id="subscriber-submit-btn" 
              class="w-full py-3.5 bg-ochre hover:bg-[#f2b545] text-void uppercase font-bold tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              <span>SUBSCRIBE TO UPDATE LETTER</span>
              <span>→</span>
            </button>

            <div id="subscriber-status" class="hidden p-3 bg-void border border-ochre/40 text-ochre text-xs"></div>
          </form>

          <div class="text-[10px] font-mono text-slate-muted flex justify-between items-center pt-2 border-t border-borderwire/50">
            <span>📬 ZERO SPAM // BI-WEEKLY DISPATCH</span>
            <button type="button" onclick="closeNewsletterModal()" class="hover:text-white underline">CANCEL</button>
          </div>

        </div>
      </div>
    `;
    const temp = document.createElement('div');
    temp.innerHTML = modalHtml;
    document.body.appendChild(temp.firstElementChild);
  };

  window.openNewsletterModal = function () {
    window.ensureNewsletterModal();
    const modal = document.getElementById('newsletter-modal');
    const input = document.getElementById('subscriber-email');
    const status = document.getElementById('subscriber-status');
    if (status) status.classList.add('hidden');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden';
    }
    if (input) setTimeout(() => input.focus(), 100);
  };

  window.closeNewsletterModal = function () {
    const modal = document.getElementById('newsletter-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = '';
    }
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

    // 1. Desktop Tabs
    document.querySelectorAll('[data-nav-link]').forEach((link) => {
      const href = link.getAttribute('href');
      const match = (isHome && (href === 'home.html' || href === 'index.html')) || href === currentPath;
      if (match) {
        link.classList.add('text-ochre', 'border-ochre', 'font-bold');
        link.classList.remove('text-slate-muted', 'border-transparent');
      } else {
        link.classList.remove('text-ochre', 'border-ochre', 'font-bold');
        link.classList.add('text-slate-muted', 'border-transparent');
      }
    });

    // 2. Mobile Ribbon Links
    document.querySelectorAll('[data-mobile-ribbon-link]').forEach((link) => {
      const href = link.getAttribute('href');
      const match = (isHome && (href === 'home.html' || href === 'index.html')) || href === currentPath;
      if (match) {
        link.className = 'px-3 py-1 bg-ochre/15 border border-ochre text-ochre font-bold whitespace-nowrap text-xs transition-colors';
      } else {
        link.className = 'px-3 py-1 bg-surface border border-borderwire text-slate-muted hover:text-white whitespace-nowrap text-xs transition-colors';
      }
    });

    // 3. Mobile Drawer Links
    document.querySelectorAll('[data-mobile-drawer-link]').forEach((link) => {
      const href = link.getAttribute('href');
      const match = (isHome && (href === 'home.html' || href === 'index.html')) || href === currentPath;
      if (match) {
        link.className = 'p-3 bg-surface border border-ochre text-ochre font-bold transition-colors';
      } else {
        link.className = 'p-3 bg-surface border border-borderwire text-slate-muted hover:text-white transition-colors';
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
  });
})();
