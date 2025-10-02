document.addEventListener('DOMContentLoaded', () => {
    const setupSidebarToggle = () => {
        const sidebar = document.querySelector('.sidebar');
        const sidebarToggle = document.querySelector('.sidebar-toggle');

        if (sidebarToggle && sidebar) {
            sidebarToggle.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevents the document click listener from firing immediately
                sidebar.classList.toggle('active');
            });

            // Close sidebar if user clicks outside of it on smaller screens
            document.addEventListener('click', (e) => {
                if (window.innerWidth < 1260) {
                    if (sidebar.classList.contains('active') && !sidebar.contains(e.target)) {
                        sidebar.classList.remove('active');
                    }
                }
            });
        }
    };

    const searchInput = document.querySelector('.search-container input');

    const performSearch = () => {
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = `search.html?q=${encodeURIComponent(query)}`;
        }
    };

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
    }


    // --- Data Loading ---
    const dataSources = {
        games: 'data/games.json',
        store: 'data/store.json',
        news: 'data/news.json',
        titles: 'data/games.json', // Map titles page to games.json
        articles: 'data/news.json', // Map articles page to news.json
        products: 'data/store.json'  // Map products page to store.json
    };

    const pageTemplates = {
        games: 'titles.html',
        news: 'articles.html',
        store: 'products.html'
    };

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

    const loadContent = async (page) => {
        if (!dataSources[page]) return;

        const targetGrid = document.querySelector(`#${page} .content-grid`);
        if (!targetGrid) return;

        targetGrid.innerHTML = '';

        try {
            const response = await fetch(dataSources[page]);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const items = await response.json();
            items.forEach(item => {
                const card = createItemCard(item, page);
                targetGrid.appendChild(card);
            });
        } catch (error) {
            console.error(`Could not load ${page} data:`, error);
            targetGrid.innerHTML = '<p class="error-message">Could not load content.</p>';
        }
    };

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
    
                    document.querySelector('.game-title-header').textContent = itemName;
    
                    const imageElement = document.querySelector('.game-image');
                    const coverArtContainer = imageElement.closest('.game-cover-art');
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
                        descriptionContainer.innerHTML = `<h2>About this ${page.slice(0, -1)}</h2>`;
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
                        document.querySelector('#info-developer').textContent = item.developer || 'N/A';
                        document.querySelector('#info-publisher').textContent = item.publisher || 'N/A';
                        document.querySelector('#info-release-date').textContent = item.releaseDate || 'TBA';
                        document.querySelector('.price-display').textContent = item.price ? `$${item.price}` : 'Free';
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
                        document.querySelector('#info-author').textContent = item.author || 'N/A';
                        document.querySelector('#info-date').textContent = item.date || 'N/A';
                    } else if (page === 'products') {
                        document.querySelector('#info-category').textContent = item.category || 'N/A';
                        document.querySelector('.price-display').textContent = item.price ? `$${item.price}` : 'Contact Us';
                        const buyBtn = document.getElementById('buy-now-btn');
                        if (buyBtn && item.purchaseLink) {
                            buyBtn.onclick = () => window.open(item.purchaseLink, '_blank');
                        } else if(buyBtn) {
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
                            mainMediaDisplay.innerHTML = ''; // Clear previous content
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

    const loadHeroContent = async () => {
        const heroCategories = {
            'hero-games': { page: 'games', source: dataSources.games },
            'hero-news': { page: 'news', source: dataSources.news }
        };

        for (const [id, { page, source }] of Object.entries(heroCategories)) {
            const container = document.getElementById(id);
            if (!container) continue;

            const targetGrid = container.querySelector('.content-grid');
            if (!targetGrid) continue;

            try {
                const response = await fetch(source);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                
                const items = await response.json();
                targetGrid.innerHTML = '';
                
                items.slice(0, 4).forEach(item => {
                    const card = createItemCard(item, page);
                    targetGrid.appendChild(card);
                });
            } catch (error) {
                console.error(`Could not load hero content for ${page}:`, error);
                targetGrid.innerHTML = '<p class="error-message">Could not load content.</p>';
            }
        }
    };

    const setActiveLink = () => {
        const currentPage = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href').split('/').pop();
            if (linkPage === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };

    // --- Initial Content Load ---
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    if (currentPage === 'home' || currentPage === '') {
        loadHeroContent();

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
    setupSidebarToggle();

    // --- Sidebar Toggle for smaller screens ---
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Close sidebar if user clicks outside of it on smaller screens
    document.addEventListener('click', (e) => {
        if (window.innerWidth < 1260) {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });

    // --- Contact Form Submission ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const action = 'https://docs.google.com/forms/d/e/1FAIpQLScxfDsAnnoPtq8w5GdNVhzHdrxUqe1Py5c-AyfqCFbnNlOrlA/formResponse';
            
            formStatus.textContent = 'Sending...';

            fetch(action, {
                method: 'POST',
                mode: 'no-cors', // Important: Google Forms blocks CORS, so we can't see the response
                body: new URLSearchParams(formData)
            }).then(() => {
                formStatus.textContent = 'Message sent successfully!';
                formStatus.style.color = '#4CAF50';
                contactForm.reset();
                setTimeout(() => {
                    formStatus.textContent = '';
                }, 5000);
            }).catch((error) => {
                console.error('Error:', error);
                formStatus.textContent = 'An error occurred. Please try again.';
                formStatus.style.color = '#f44336';
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
});






document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contact-form");
    const status = document.getElementById("form-status");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        fetch(form.action, {
            method: "POST",
            body: new FormData(form),
            mode: "no-cors"
        })
        .then(() => {
            status.innerHTML = "<p style='color:green;'>✅ Message sent successfully!</p>";
            form.reset();
        })
        .catch(() => {
            status.innerHTML = "<p style='color:red;'>❌ Failed to send. Try again.</p>";
        });
    });
});



function handlePageTitleText() {
    const pageTitles = document.querySelectorAll(".page-title h2");

    pageTitles.forEach(title => {
        if (window.innerWidth < 350) {
            title.dataset.fulltext = title.dataset.fulltext || title.textContent; // store original text
            title.textContent = "MG";
        } else {
            if (title.dataset.fulltext) {
                title.textContent = title.dataset.fulltext;
            }
        }
    });
}

// Run once on load
handlePageTitleText();

// Run whenever window is resized
window.addEventListener("resize", handlePageTitleText);

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

// Run once on load
handleCurrentPageTitleVisibility();

// Run on window resize
window.addEventListener("resize", handleCurrentPageTitleVisibility);


