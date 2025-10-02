
document.addEventListener('DOMContentLoaded', () => {
    const resultsContainer = document.getElementById('results-container');
    const searchQuerySpan = document.getElementById('search-query');
    const mainSearchInput = document.getElementById('main-search-input');
    const sidebarSearchInput = document.getElementById('search-input-sidebar');


    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');

    if (searchQuerySpan) {
        searchQuerySpan.textContent = query;
    }
    if (mainSearchInput) {
        mainSearchInput.value = query;
    }
    if (sidebarSearchInput) {
        sidebarSearchInput.value = query;
    }

    const performSearch = () => {
        const newQuery = mainSearchInput.value.trim();
        if (newQuery) {
            window.location.href = `search.html?q=${encodeURIComponent(newQuery)}`;
        }
    };



    if (mainSearchInput) {
        mainSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
    }

    if (query && resultsContainer) {
        fetchAllDataAndSearch(query);
    }

    async function fetchAllDataAndSearch(query) {
        try {
            const [games, store, news] = await Promise.all([
                fetch('data/games.json').then(res => res.json()),
                fetch('data/store.json').then(res => res.json()),
                fetch('data/news.json').then(res => res.json())
            ]);

            const allData = [
                ...games.map(item => ({ ...item, type: 'game' })),
                ...store.map(item => ({ ...item, type: 'store' })),
                ...news.map(item => ({ ...item, type: 'news' }))
            ];

            const options = {
                includeScore: true,
                keys: ['name', 'title', 'description', 'tags']
            };

            const fuse = new Fuse(allData, options);
            const results = fuse.search(query);

            displayResults(results);

        } catch (error) {
            console.error("Error fetching or searching data:", error);
            resultsContainer.innerHTML = '<p>Error loading search results. Please try again later.</p>';
        }
    }

    function displayResults(results) {
        resultsContainer.innerHTML = '';

        if (results.length === 0) {
            resultsContainer.innerHTML = '<p>No results found.</p>';
            return;
        }

        results.forEach(result => {
            const item = result.item;
            const itemCard = document.createElement('a');
            itemCard.classList.add('item-card');
            
            let href = '#';
            let name = '';
            let image = '';

            switch (item.type) {
                case 'game':
                    href = `games.html#${item.id}`;
                    name = item.name;
                    image = item.image;
                    break;
                case 'store':
                    href = `store.html#${item.id}`;
                    name = item.name;
                    image = item.image;
                    break;
                case 'news':
                    href = `news.html#${item.id}`;
                    name = item.title;
                    image = item.image;
                    break;
            }

            itemCard.href = href;
            itemCard.style.backgroundImage = `url(${image})`;

            const itemName = document.createElement('div');
            itemName.classList.add('item-name');
            itemName.textContent = name;

            itemCard.appendChild(itemName);
            resultsContainer.appendChild(itemCard);
        });
    }
});
