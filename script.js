// ===== CONFIGURATION =====
const API_URL = "https://pokeapi.co/api/v2/pokemon";
const LIMIT = 20;
let currentPage = 1;

// ===== COULEURS PAR TYPE (pour les badges) =====
const typeColors = {
  fire: "#f97316", water: "#3b82f6", grass: "#22c55e",
  poison: "#a855f7", electric: "#eab308", psychic: "#ec4899",
  ice: "#67e8f9", dragon: "#6366f1", dark: "#374151",
  fairy: "#f9a8d4", normal: "#9ca3af", fighting: "#b45309",
  flying: "#7dd3fc", ground: "#d97706", rock: "#78716c",
  bug: "#84cc16", ghost: "#7c3aed", steel: "#94a3b8"
};

// ===== ÉLÉMENTS DU DOM =====
const grid = document.getElementById("pokemon-grid");
const pagination = document.getElementById("pagination");
const searchInput = document.getElementById("search");

// ===== FONCTION PRINCIPALE : charger une page =====
async function loadPokemon(page = 1) {
  const offset = (page - 1) * LIMIT;

  // Affiche un message de chargement
  grid.innerHTML = "<p style='text-align:center; padding:40px; color:#888;'>Chargement...</p>";

  try {
    // Appel 1 : récupère la liste de 20 Pokémon
    const res = await fetch(`${API_URL}?limit=${LIMIT}&offset=${offset}`);
    const data = await res.json();

    // Appel 2 : pour chaque Pokémon, récupère ses détails en parallèle
    const pokemonList = await Promise.all(
      data.results.map(p => fetch(p.url).then(r => r.json()))
    );

    renderGrid(pokemonList);
    renderPagination(page, Math.ceil(data.count / LIMIT));

  } catch (err) {
    grid.innerHTML = "<p style='text-align:center; color:red;'>Erreur de chargement.</p>";
    console.error(err);
  }
}

// ===== AFFICHER LA GRILLE DE CARDS =====
function renderGrid(pokemonList) {
  grid.innerHTML = "";

  pokemonList.forEach(pokemon => {
    const id = String(pokemon.id).padStart(3, "0");
    const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    const sprite = pokemon.sprites.front_default;
    const types = pokemon.types.map(t => t.type.name);

    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${sprite}" alt="${name}">
      <h3>#${id} ${name}</h3>
      <div class="badges">
        ${types.map(t => `
          <span class="badge" style="background:${typeColors[t] || '#999'}">
            ${t.charAt(0).toUpperCase() + t.slice(1)}
          </span>
        `).join("")}
      </div>
    `;

    // Clic sur la card → vue détail
    card.addEventListener("click", () => showDetail(pokemon.name));
    grid.appendChild(card);
  });
}

// ===== AFFICHER LA PAGINATION =====
function renderPagination(currentPage, totalPages) {
  pagination.innerHTML = "";

  // Bouton Précédent
  const prevBtn = document.createElement("button");
  prevBtn.textContent = "← Précédent";
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener("click", () => {
    loadPokemon(currentPage - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  pagination.appendChild(prevBtn);

  // Pages numérotées (on affiche 5 pages autour de la page actuelle)
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);

  for (let i = start; i <= end; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.classList.add("active");
    btn.addEventListener("click", () => {
      loadPokemon(i);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    pagination.appendChild(btn);
  }

  // Bouton Suivant
  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Suivant →";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener("click", () => {
    loadPokemon(currentPage + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  pagination.appendChild(nextBtn);
}

// ===== LANCEMENT AU DÉMARRAGE =====
loadPokemon(1);

// ===== ÉLÉMENTS VUE DÉTAIL =====
const mainView = document.getElementById("main-view");
const detailView = document.getElementById("detail-view");

// ===== AFFICHER LE DÉTAIL =====
async function showDetail(name) {
  // Bascule les vues: ne pas cacher `main-view` (contient `detail-view`),
  // masquer plutôt la grille et la pagination pour afficher la vue détail.
  grid.classList.add("hidden");
  pagination.classList.add("hidden");
  detailView.classList.remove("hidden");
  detailView.innerHTML = "<p style='text-align:center; padding:40px; color:#888;'>Chargement...</p>";

  try {
    // Appel 1 : données du Pokémon
    const resPokemon = await fetch(`${API_URL}/${name}`);
    const pokemon = await resPokemon.json();

    // Appel 2 : données de l'espèce (pour la chaîne d'évolution)
    const resSpecies = await fetch(pokemon.species.url);
    const species = await resSpecies.json();

    // Appel 3 : chaîne d'évolution
    const resEvo = await fetch(species.evolution_chain.url);
    const evoData = await resEvo.json();
    const evoChain = parseEvoChain(evoData.chain);

    renderDetail(pokemon, evoChain);

  } catch (err) {
    detailView.innerHTML = "<p style='text-align:center; color:red;'>Erreur de chargement.</p>";
    console.error(err);
  }
}

// ===== PARSER LA CHAÎNE D'ÉVOLUTION =====
function parseEvoChain(chain) {
  const result = [];
  let current = chain;

  while (current) {
    result.push(current.species.name);
    current = current.evolves_to[0]; // on prend la première évolution
  }

  return result;
}

// ===== AFFICHER LE DÉTAIL =====
function renderDetail(pokemon, evoChain) {
  const id = String(pokemon.id).padStart(3, "0");
  const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  const types = pokemon.types.map(t => t.type.name);
  const weight = (pokemon.weight / 10).toFixed(1);
  const height = (pokemon.height / 10).toFixed(1);

  const stats = [
    { name: "HP",              value: pokemon.stats[0].base_stat },
    { name: "Attaque",         value: pokemon.stats[1].base_stat },
    { name: "Défense",         value: pokemon.stats[2].base_stat },
    { name: "Special-Attaque", value: pokemon.stats[3].base_stat },
    { name: "Special-Défense", value: pokemon.stats[4].base_stat },
    { name: "Vitesse",         value: pokemon.stats[5].base_stat },
  ];

  const abilities = pokemon.abilities.map(a => ({
    name: a.ability.name.charAt(0).toUpperCase() + a.ability.name.slice(1),
    hidden: a.is_hidden
  }));

  detailView.innerHTML = `
    <!-- Bouton retour -->
    <button id="back-btn" onclick="goBack()">← Retour à la liste</button>

    <div class="detail-card">

      <!-- Titre -->
      <h2>#${id} ${name}</h2>

      <!-- Sprites face + dos -->
      <div class="sprites">
        <div>
          <img src="${pokemon.sprites.front_default}" alt="${name} face">
          <p>Face</p>
        </div>
        <div>
          <img src="${pokemon.sprites.back_default}" alt="${name} dos">
          <p>Dos</p>
        </div>
      </div>

      <!-- Badges de type -->
      <div class="badges" style="justify-content:center; margin-bottom:20px;">
        ${types.map(t => `
          <span class="badge" style="background:${typeColors[t] || '#999'}">
            ${t.charAt(0).toUpperCase() + t.slice(1)}
          </span>
        `).join("")}
      </div>

      <!-- Informations physiques -->
      <div class="physical">
        <div>
          <span class="label">⚖️ Poids</span>
          <span class="value">${weight} kg</span>
        </div>
        <div>
          <span class="label">📏 Taille</span>
          <span class="value">${height} m</span>
        </div>
      </div>

      <!-- Statistiques -->
      <div class="stats">
        <h3>Statistiques</h3>
        ${stats.map(s => `
          <div class="stat-row">
            <span class="stat-name">${s.name}</span>
            <div class="stat-bar-bg">
              <div class="stat-bar" style="width:${Math.min((s.value / 255) * 100, 100)}%"></div>
            </div>
            <span class="stat-value">${s.value}</span>
          </div>
        `).join("")}
      </div>

      <!-- Capacités -->
      <div class="abilities-section">
        <h3>Capacités</h3>
        ${abilities.map(a => `
          <span class="ability-badge ${a.hidden ? 'hidden' : ''}">
            ${a.name} ${a.hidden ? '<em>(Cachée)</em>' : ''}
          </span>
        `).join("")}
      </div>

      <!-- Chaîne d'évolution -->
      <div class="evolution">
        <h3>Chaîne d'évolution</h3>
        <div class="evo-chain">
          ${evoChain.map((evo, i) => `
            ${i > 0 ? '<span class="evo-arrow">→</span>' : ''}
            <span 
              class="evo-name ${evo === pokemon.name ? 'current' : ''}"
              onclick="showDetail('${evo}')"
              style="cursor:pointer;"
            >
              ${evo.charAt(0).toUpperCase() + evo.slice(1)}
            </span>
          `).join("")}
        </div>
      </div>

    </div>
  `;
}

// ===== RETOUR À LA LISTE =====
function goBack() {
  // Restaurer l'affichage de la grille et de la pagination
  detailView.classList.add("hidden");
  grid.classList.remove("hidden");
  pagination.classList.remove("hidden");
}