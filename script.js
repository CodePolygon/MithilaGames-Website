document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("data.json");
    const data = await response.json();

    // --- Render Hero ---
    const hero = data.hero;
    if (hero) {
      document.getElementById("hero-bg").style.backgroundImage = `url('${hero.backgroundImage}')`;
      document.getElementById("hero-title").textContent = hero.title;
      document.getElementById("hero-tagline").textContent = hero.tagline;
      const btn = document.getElementById("hero-button");
      btn.textContent = hero.buttonText;
      btn.href = hero.buttonLink;
    }

    // --- Render Games ---
    const gamesContainer = document.getElementById("games-container");
    gamesContainer.innerHTML = "";
    data.games.forEach(game => {
      gamesContainer.insertAdjacentHTML("beforeend", `
        <div class="rounded-xl overflow-hidden shadow-2xl border border-gray-700">
          <div class="h-64 bg-center bg-cover relative" style="background-image:url('${game.image}')">
            <div class="absolute inset-0 bg-black/40"></div>
            <div class="absolute bottom-0 left-0 p-6">
              <span class="text-sm font-semibold text-red-400">${game.tag}</span>
              <h3 class="text-3xl font-bold mt-1">${game.title}</h3>
            </div>
          </div>
          <div class="p-6 bg-gray-900/80">
            <p class="text-gray-300 mb-4 text-sm">${game.description}</p>
            <a href="${game.link}" class="text-red-500 hover:text-red-400 font-semibold flex items-center">
              ${game.actionText}
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </a>
          </div>
        </div>
      `);
    });

    // --- Render News ---
    const newsContainer = document.getElementById("news-container");
    newsContainer.innerHTML = "";
    data.news.forEach(item => {
      newsContainer.insertAdjacentHTML("beforeend", `
        <a href="${item.link}" target="_blank" 
           class="block bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-red-600/30 transition duration-300">
          <div class="flex items-start">
            <img src="${item.image}" alt="${item.title}" 
                 class="w-32 h-20 object-cover rounded-lg mr-6 hidden sm:block">
            <div>
              <p class="text-sm text-red-500 font-semibold mb-1">${item.date}</p>
              <h3 class="text-xl font-bold mb-2">${item.title}</h3>
              <p class="text-gray-400 text-base">${item.summary}</p>
            </div>
          </div>
        </a>
      `);
    });

    // --- Render About ---
    const about = data.about;
    if (about) {
      document.getElementById("about-title").textContent = about.title;
      document.getElementById("about-description").textContent = about.description;

      const teamContainer = document.getElementById("about-team");
      teamContainer.innerHTML = "";
      about.team.forEach(member => {
        teamContainer.insertAdjacentHTML("beforeend", `
          <div class="bg-gray-900 rounded-xl p-6 text-center shadow-lg hover:shadow-red-600/30 transition">
            <img src="${member.image}" alt="${member.name}" 
                 class="w-32 h-32 object-cover rounded-full mx-auto mb-4 border-4 border-gray-700">
            <h3 class="text-xl font-semibold text-white">${member.name}</h3>
            <p class="text-red-400 text-sm font-medium">${member.role}</p>
          </div>
        `);
      });
    }

  } catch (err) {
    console.error("Error loading data:", err);
    document.getElementById("hero-title").textContent = "Failed to load content";
  }

  // --- Mobile Menu Toggle ---
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }
});
