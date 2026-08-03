document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header Scroll Effect ---
    const header = document.querySelector('.header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 30) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Trigger once on load
    }

    // --- Mobile Menu Toggle ---
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');

    if (hamburgerBtn && mobileNav && mobileNavOverlay) {
        const openNav = () => {
            mobileNav.classList.add('active');
            mobileNavOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeNav = () => {
            mobileNav.classList.remove('active');
            mobileNavOverlay.classList.remove('active');
            document.body.style.overflow = '';
        };

        hamburgerBtn.addEventListener('click', openNav);
        if (mobileNavClose) mobileNavClose.addEventListener('click', closeNav);
        mobileNavOverlay.addEventListener('click', closeNav);
    }

    // --- Search Overlay Toggle ---
    const searchToggleBtn = document.querySelector('.search-toggle-btn');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchOverlayClose = document.querySelector('.search-overlay-close');
    const searchOverlayInput = document.querySelector('.search-overlay-input');

    if (searchToggleBtn && searchOverlay && searchOverlayClose && searchOverlayInput) {
        searchToggleBtn.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            searchOverlayInput.focus();
            document.body.style.overflow = 'hidden';
        });

        const closeSearch = () => {
            searchOverlay.classList.remove('active');
            document.body.style.overflow = '';
        };

        searchOverlayClose.addEventListener('click', closeSearch);

        searchOverlayInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = searchOverlayInput.value.trim();
                if (query) {
                    window.location.href = `search.html?q=${encodeURIComponent(query)}`;
                }
            }
        });
    }

    // --- Hero Slider Carousel ---
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dot');
    const prevBtn = document.querySelector('.slider-arrow-prev');
    const nextBtn = document.querySelector('.slider-arrow-next');

    if (slides.length > 0) {
        let currentSlide = 0;
        let slideInterval;
        const intervalTime = 6000;

        const showSlide = (index) => {
            slides.forEach(s => s.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));

            currentSlide = (index + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
            if (dots[currentSlide]) dots[currentSlide].classList.add('active');
        };

        const nextSlide = () => {
            showSlide(currentSlide + 1);
        };

        const prevSlide = () => {
            showSlide(currentSlide - 1);
        };

        const startAutoplay = () => {
            stopAutoplay();
            slideInterval = setInterval(nextSlide, intervalTime);
        };

        const stopAutoplay = () => {
            if (slideInterval) clearInterval(slideInterval);
        };

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                startAutoplay();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                startAutoplay();
            });
        }

        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-slide'));
                showSlide(index);
                startAutoplay();
            });
        });

        const sliderContainer = document.querySelector('.slider-container');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', stopAutoplay);
            sliderContainer.addEventListener('mouseleave', startAutoplay);
        }

        startAutoplay();
    }

    // --- Data Loading Setup ---
    const dataSources = {
        games: 'data/games.json',
        store: 'data/store.json',
        news: 'data/news.json',
        titles: 'data/games.json',
        articles: 'data/news.json',
        products: 'data/store.json'
    };

    const pageTemplates = {
        games: 'titles.html',
        news: 'articles.html',
        store: 'products.html'
    };

    // Card Builder: Fallback Generic card
    const createItemCard = (item, page) => {
        const card = document.createElement('div');
        card.className = 'item-card';

        if (item.imageUrl && item.imageUrl.trim() !== '') {
            const img = new Image();
            img.src = item.imageUrl;
            img.onload = () => {
                card.style.backgroundImage = `url('${item.imageUrl}')`;
            };
            img.onerror = () => {
                card.classList.add('no-image');
            };
        } else {
            card.classList.add('no-image');
        }
        
        const name = document.createElement('div');
        name.className = 'item-name';
        name.textContent = item.name || item.title;
        card.appendChild(name);

        const templatePage = pageTemplates[page];
        if (templatePage) {
            card.addEventListener('click', () => {
                window.location.href = `${templatePage}?id=${item.id}`;
            });
        }

        return card;
    };

    // Card Builder: News Card (Naughty Dog Style)
    const createNewsCard = (item) => {
        const card = document.createElement('a');
        card.className = 'news-card';
        card.href = `articles.html?id=${item.id}`;

        const imgContainer = document.createElement('div');
        imgContainer.className = 'news-card-img-container';
        
        const img = document.createElement('img');
        img.className = 'news-card-img';
        img.loading = 'lazy';
        if (item.imageUrl && item.imageUrl.trim() !== '') {
            img.src = item.imageUrl;
            img.onerror = () => {
                imgContainer.classList.add('no-image');
                img.style.display = 'none';
            };
        } else {
            imgContainer.classList.add('no-image');
            img.style.display = 'none';
        }
        imgContainer.appendChild(img);
        card.appendChild(imgContainer);

        const content = document.createElement('div');
        content.className = 'news-card-content';

        const tag = document.createElement('div');
        tag.className = 'news-card-tag';
        tag.textContent = (item.tags && item.tags.length > 0) ? item.tags[0] : 'Update';

        const date = document.createElement('div');
        date.className = 'news-card-date';
        date.textContent = item.date || 'Recent';

        const title = document.createElement('h3');
        title.className = 'news-card-title';
        title.textContent = item.title;

        const excerpt = document.createElement('p');
        excerpt.className = 'news-card-excerpt';
        excerpt.textContent = item.content || '';

        const link = document.createElement('div');
        link.className = 'news-card-link';
        link.innerHTML = 'Read Article <span class="material-symbols-outlined">arrow_forward</span>';

        content.appendChild(tag);
        content.appendChild(date);
        content.appendChild(title);
        content.appendChild(excerpt);
        content.appendChild(link);
        card.appendChild(content);

        return card;
    };

    // Card Builder: Game Card (Naughty Dog Style)
    const createGameCard = (item) => {
        const card = document.createElement('a');
        card.className = 'game-card';
        card.href = `titles.html?id=${item.id}`;

        const img = document.createElement('img');
        img.className = 'game-card-img';
        img.loading = 'lazy';
        if (item.imageUrl && item.imageUrl.trim() !== '') {
            img.src = item.imageUrl;
            img.onerror = () => {
                card.classList.add('no-image');
                img.style.display = 'none';
            };
        } else {
            card.classList.add('no-image');
            img.style.display = 'none';
        }
        card.appendChild(img);

        const overlay = document.createElement('div');
        overlay.className = 'game-card-overlay';
        card.appendChild(overlay);

        const info = document.createElement('div');
        info.className = 'game-card-info';

        const title = document.createElement('h3');
        title.className = 'game-card-title';
        title.textContent = item.name;

        const platforms = document.createElement('div');
        platforms.className = 'game-card-platforms';
        platforms.textContent = (item.platforms && item.platforms.length > 0) ? item.platforms.join(' / ') : 'Android';

        const btn = document.createElement('div');
        btn.className = 'game-card-btn';
        btn.textContent = 'View Details';

        info.appendChild(title);
        info.appendChild(platforms);
        info.appendChild(btn);
        card.appendChild(info);

        return card;
    };

    // Load subpage dynamic grid contents
    const loadContent = async (page) => {
        if (!dataSources[page]) return;

        const targetGrid = document.querySelector(`#${page} .content-grid`);
        if (!targetGrid) return;

        targetGrid.innerHTML = '';

        try {
            const response = await fetch(dataSources[page]);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const items = await response.json();
            items.forEach(item => {
                let card;
                if (page === 'games') {
                    card = createGameCard(item);
                } else if (page === 'news') {
                    card = createNewsCard(item);
                } else {
                    card = createItemCard(item, page);
                }
                targetGrid.appendChild(card);
            });
        } catch (error) {
            console.error(`Could not load ${page} data:`, error);
            targetGrid.innerHTML = '<p class="error-message">Could not load content.</p>';
        }
    };

    // Load subpage details contents
    const loadDetails = async (page) => {
        const params = new URLSearchParams(window.location.search);
        const itemId = params.get('id');
        if (!itemId) return;

        try {
            const response = await fetch(dataSources[page]);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const items = await response.json();
            const item = items.find(i => i.id === itemId);

            if (item) {
                const itemName = item.name || item.title;
                document.title = `Mithila Games - ${itemName}`;
                
                const currentPageTitle = document.getElementById('current-page-title');
                if (currentPageTitle) currentPageTitle.textContent = itemName;

                const gameTitleHeader = document.querySelector('.game-title-header');
                if (gameTitleHeader) gameTitleHeader.textContent = itemName;

                const imageElement = document.querySelector('.game-image');
                const coverArtContainer = document.querySelector('.game-cover-art');
                if (imageElement && coverArtContainer) {
                    if (item.imageUrl && item.imageUrl.trim() !== '') {
                        const img = new Image();
                        img.src = item.imageUrl;
                        img.onload = () => {
                            imageElement.src = img.src;
                            imageElement.alt = itemName;
                            imageElement.style.display = 'block';
                        };
                        img.onerror = () => {
                            imageElement.style.display = 'none';
                            coverArtContainer.classList.add('no-image');
                        };
                    } else {
                        imageElement.style.display = 'none';
                        coverArtContainer.classList.add('no-image');
                    }
                }

                const descriptionContainer = document.querySelector('.game-description');
                if (descriptionContainer) {
                    const description = item.description || item.content;
                    descriptionContainer.innerHTML = `<h2>About this ${page === 'titles' ? 'game' : page === 'articles' ? 'article' : 'product'}</h2>`;
                    if (Array.isArray(description)) {
                        description.forEach(para => {
                            const p = document.createElement('p');
                            p.textContent = para;
                            descriptionContainer.appendChild(p);
                        });
                    } else if (description) {
                        const p = document.createElement('p');
                        p.textContent = description;
                        descriptionContainer.appendChild(p);
                    }
                }

                const tagsContainer = document.querySelector('.tags-container');
                if (tagsContainer && item.tags) {
                    tagsContainer.innerHTML = '';
                    item.tags.forEach(tagText => {
                        const tag = document.createElement('div');
                        tag.className = 'tag';
                        tag.textContent = tagText;
                        tagsContainer.appendChild(tag);
                    });
                }

                // Page-specific details
                if (page === 'titles') {
                    const devEl = document.querySelector('#info-developer');
                    const pubEl = document.querySelector('#info-publisher');
                    const relEl = document.querySelector('#info-release-date');
                    const priceEl = document.querySelector('.price-display');
                    
                    if (devEl) devEl.textContent = item.developer || 'N/A';
                    if (pubEl) pubEl.textContent = item.publisher || 'N/A';
                    if (relEl) relEl.textContent = item.releaseDate || 'TBA';
                    if (priceEl) priceEl.textContent = item.price ? `$${item.price}` : 'Free';
                    
                    const getItBtn = document.getElementById('get-it-btn');
                    if (getItBtn && item.defaultLink) {
                        getItBtn.onclick = () => window.open(item.defaultLink, '_blank');
                    } else if (getItBtn) {
                        getItBtn.style.display = 'none';
                    }
                    
                    const sysReq = document.querySelector('.system-requirements');
                    if (sysReq && item.system_requirements) {
                        sysReq.style.display = 'block';
                        document.querySelector('#req-os').textContent = item.system_requirements.os || 'N/A';
                        document.querySelector('#req-processor').textContent = item.system_requirements.processor || 'N/A';
                        document.querySelector('#req-memory').textContent = item.system_requirements.memory || 'N/A';
                        document.querySelector('#req-graphics').textContent = item.system_requirements.graphics || 'N/A';
                        document.querySelector('#req-storage').textContent = item.system_requirements.storage || 'N/A';
                    } else if (sysReq) {
                        sysReq.style.display = 'none';
                    }
                } else if (page === 'articles') {
                    const authorEl = document.querySelector('#info-author');
                    const dateEl = document.querySelector('#info-date');
                    if (authorEl) authorEl.textContent = item.author || 'N/A';
                    if (dateEl) dateEl.textContent = item.date || 'N/A';
                } else if (page === 'products') {
                    const catEl = document.querySelector('#info-category');
                    const priceEl = document.querySelector('.price-display');
                    if (catEl) catEl.textContent = item.category || 'N/A';
                    if (priceEl) priceEl.textContent = item.price ? `$${item.price}` : 'Contact Us';
                    
                    const buyBtn = document.getElementById('buy-now-btn');
                    if (buyBtn && item.purchaseLink) {
                        buyBtn.onclick = () => window.open(item.purchaseLink, '_blank');
                    } else if (buyBtn) {
                        buyBtn.textContent = "Not Available";
                        buyBtn.disabled = true;
                    }
                }

                // Media Viewer Setup
                const mediaItems = [];
                if (item.video) mediaItems.push({ type: 'video', src: item.video, thumbnail: item.videoThumbnail });
                if (item.screenshots) item.screenshots.forEach(src => mediaItems.push({ type: 'image', src }));
                
                const mediaGallery = document.querySelector('.media-gallery');
                if (mediaGallery && mediaItems.length > 0) {
                    mediaGallery.style.display = 'block';
                    const mainMediaDisplay = document.getElementById('main-media-display');
                    const thumbnailContainer = document.getElementById('thumbnail-container');
                    
                    const updateMainMedia = (index) => {
                        mainMediaDisplay.innerHTML = '';
                        const media = mediaItems[index];
                        if (media.type === 'video') {
                            mainMediaDisplay.innerHTML = `<iframe src="${media.src}" frameborder="0" allowfullscreen></iframe>`;
                        } else {
                            const img = document.createElement('img');
                            img.src = media.src;
                            img.alt = `${itemName} screenshot`;
                            img.onerror = () => {
                                mainMediaDisplay.innerHTML = '';
                                mainMediaDisplay.classList.add('no-screenshot');
                            };
                            mainMediaDisplay.appendChild(img);
                            mainMediaDisplay.classList.remove('no-screenshot');
                        }
                        document.querySelectorAll('.thumbnail').forEach((t, i) => {
                            t.classList.toggle('active', i === index);
                        });
                    };

                    thumbnailContainer.innerHTML = '';
                    mediaItems.forEach((media, index) => {
                        const thumbnail = document.createElement('div');
                        thumbnail.className = 'thumbnail';
                        
                        const thumbImg = document.createElement('img');
                        thumbImg.src = media.type === 'image' ? media.src : media.thumbnail;
                        thumbImg.alt = 'Thumbnail';
                        thumbImg.onerror = () => {
                            thumbImg.style.display = 'none';
                            thumbnail.classList.add('no-screenshot');
                        };
                        
                        const playIcon = document.createElement('div');
                        playIcon.className = 'play-icon';
                        playIcon.style.display = media.type === 'video' ? 'flex' : 'none';

                        thumbnail.appendChild(thumbImg);
                        thumbnail.appendChild(playIcon);
                        thumbnail.onclick = () => updateMainMedia(index);
                        thumbnailContainer.appendChild(thumbnail);
                    });

                    updateMainMedia(0);
                } else if (mediaGallery) {
                    mediaGallery.style.display = 'none';
                }

                // Share Functionality
                const shareBtn = document.getElementById('share-btn');
                const shareModal = document.getElementById('share-modal');
                if (shareBtn && shareModal) {
                    const closeShareModal = shareModal.querySelector('.lightbox-close');
                    shareBtn.onclick = () => shareModal.style.display = 'flex';
                    closeShareModal.onclick = () => shareModal.style.display = 'none';
                    
                    shareModal.querySelectorAll('.share-option').forEach(option => {
                        option.onclick = (e) => {
                            e.preventDefault();
                            const platform = option.dataset.platform;
                            const url = window.location.href;
                            const text = `Check out: ${itemName}`;
                            let shareUrl = '';
                            switch (platform) {
                                case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`; break;
                                case 'twitter': shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`; break;
                                case 'whatsapp': shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`; break;
                                case 'telegram': shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`; break;
                                case 'reddit': shareUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`; break;
                                case 'copy-link': navigator.clipboard.writeText(url).then(() => alert('Link copied!')); return;
                            }
                            window.open(shareUrl, '_blank');
                        };
                    });
                }
            }
        } catch (error) {
            console.error(`Could not load ${page} details:`, error);
        }
    };

    // Load home page blog feed (alternating list of posts)
    const loadBlogFeed = async () => {
        const blogContainer = document.getElementById('blog-feed');
        if (!blogContainer) return;

        blogContainer.innerHTML = '';

        try {
            const response = await fetch('data/news.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const newsItems = await response.json();
            
            newsItems.forEach((item, index) => {
                const card = document.createElement('article');
                card.className = 'blog-post-card';

                // Image container
                const imgContainer = document.createElement('div');
                imgContainer.className = 'blog-post-image-container';
                
                const img = document.createElement('img');
                img.className = 'blog-post-image';
                img.src = item.imageUrl;
                img.alt = item.title;
                img.loading = 'lazy';
                imgContainer.appendChild(img);

                // Info container
                const info = document.createElement('div');
                info.className = 'blog-post-info';

                const title = document.createElement('a');
                title.className = 'blog-post-title';
                title.href = `articles.html?id=${item.id}`;
                title.textContent = item.title;

                const date = document.createElement('div');
                date.className = 'blog-post-date';
                date.textContent = item.date;

                const desc = document.createElement('p');
                desc.className = 'blog-post-desc';
                desc.textContent = item.content;

                const readMore = document.createElement('a');
                readMore.className = 'blog-post-readmore';
                readMore.href = `articles.html?id=${item.id}`;
                readMore.innerHTML = `Read More <span class="material-symbols-outlined">arrow_forward</span>`;

                info.appendChild(title);
                info.appendChild(desc);
                info.appendChild(date);
                info.appendChild(readMore);

                card.appendChild(imgContainer);
                card.appendChild(info);

                blogContainer.appendChild(card);
            });
        } catch (error) {
            console.error('Could not load blog feed:', error);
            blogContainer.innerHTML = '<p class="error-message">Could not load articles.</p>';
        }
    };

    // Dynamic active navigation indicator
    const setActiveLink = () => {
        const currentPage = window.location.pathname.split('/').pop();
        const navItems = document.querySelectorAll('.nav-item, .mobile-nav-item');

        navItems.forEach(link => {
            const linkPage = link.getAttribute('href').split('/').pop();
            const isHome = currentPage === 'home.html' || currentPage === 'index.html' || currentPage === '';
            const linkIsHome = linkPage === 'home.html' || linkPage === 'index.html' || linkPage === '';
            
            if ((isHome && linkIsHome) || (linkPage === currentPage && currentPage !== '')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };

    // --- Page Routing / Actions Initialization ---
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    
    if (currentPage === 'home' || currentPage === '') {
        loadBlogFeed();

        // --- Cookie Popup ---
        const cookiePopup = document.getElementById('cookie-popup');
        const acceptBtn = document.getElementById('cookie-accept');
        const rejectBtn = document.getElementById('cookie-reject');
        const learnMoreLink = document.querySelector('#cookie-popup a');

        const setCookie = (name, value, days) => {
            let expires = "";
            if (days) {
                const date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + (value || "") + expires + "; path=/";
        }

        const getCookie = (name) => {
            const nameEQ = name + "=";
            const ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        }

        if (cookiePopup) {
            if (getCookie('cookie_consent')) {
                cookiePopup.classList.add('hidden');
            }

            acceptBtn.addEventListener('click', () => {
                setCookie('cookie_consent', 'true', 365);
                cookiePopup.classList.add('hidden');
            });

            rejectBtn.addEventListener('click', () => {
                window.location.href = 'connect.html';
            });

            if (learnMoreLink) {
                learnMoreLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.location.href = 'about.html';
                });
            }
        }
    } else if (['games', 'store', 'news'].includes(currentPage)) {
        loadContent(currentPage);
    } else if (['titles', 'articles', 'products'].includes(currentPage)) {
        loadDetails(currentPage);
    }

    setActiveLink();

    // --- Contact Form Submission ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const action = 'https://docs.google.com/forms/d/e/1FAIpQLScxfDsAnnoPtq8w5GdNVhzHdrxUqe1Py5c-AyfqCFbnNlOrlA/formResponse';
            
            formStatus.textContent = 'Sending...';

            fetch(action, {
                method: 'POST',
                mode: 'no-cors',
                body: new URLSearchParams(formData)
            }).then(() => {
                formStatus.innerHTML = "<p style='color:green;'>Message sent successfully!</p>";
                contactForm.reset();
                setTimeout(() => {
                    formStatus.textContent = '';
                }, 5000);
            }).catch((error) => {
                console.error('Error:', error);
                formStatus.innerHTML = "<p style='color:red;'>Failed to send. Try again.</p>";
            });
        });
    }

    // --- Back to Top Button ---
    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.style.display = 'flex';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Mobile Screen Layout Helpers ---
    function handlePageTitleText() {
        const pageTitles = document.querySelectorAll(".page-title h2");
        pageTitles.forEach(title => {
            if (window.innerWidth < 350) {
                title.dataset.fulltext = title.dataset.fulltext || title.textContent;
                title.textContent = "MG";
            } else {
                if (title.dataset.fulltext) {
                    title.textContent = title.dataset.fulltext;
                }
            }
        });
    }

    function handleCurrentPageTitleVisibility() {
        const currentPageTitle = document.getElementById("current-page-title");
        if (currentPageTitle) {
            if (window.innerWidth < 350) {
                currentPageTitle.style.display = "none";
            } else {
                currentPageTitle.style.display = "";
            }
        }
    }

    handlePageTitleText();
    handleCurrentPageTitleVisibility();
    window.addEventListener("resize", () => {
        handlePageTitleText();
        handleCurrentPageTitleVisibility();
    });

    // --- Web Audio API SFX Synth ---
    const playSFX = (type) => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            
            if (type === 'hover') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                
                osc.type = 'sine';
                osc.frequency.setValueAtTime(1600, ctx.currentTime);
                gain.gain.setValueAtTime(0.008, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);
                
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.03);
            } else if (type === 'click') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(400, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.06);
                gain.gain.setValueAtTime(0.03, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);
                
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.06);
            }
        } catch (e) {
            // Ignore AudioContext autoplay policy errors silently
        }
    };

    const attachSFX = () => {
        const interactiveSelectors = [
            '.nav-item',
            '.mobile-nav-item',
            '.logo-link',
            '.header-social-icon-link',
            '.footer-social-circle',
            '.footer-nav-row a',
            '.item-card',
            '.blog-post-card',
            '.submit-btn',
            '.pagination-btn',
            '.load-more-btn',
            '.connect-social-badge'
        ];
        
        const attachToElements = () => {
            interactiveSelectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(el => {
                    if (!el.dataset.sfxAttached) {
                        el.dataset.sfxAttached = 'true';
                        el.addEventListener('mouseenter', () => playSFX('hover'));
                        el.addEventListener('click', () => playSFX('click'));
                    }
                });
            });
        };
        
        attachToElements();
        
        // Re-run whenever dynamic items are loaded (e.g. from network)
        const observer = new MutationObserver(attachToElements);
        observer.observe(document.body, { childList: true, subtree: true });
    };

    attachSFX();
});
