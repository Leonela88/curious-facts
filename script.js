let currentFact = null;


async function fetchFact() {
    try {
        const response = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching fact:', error);
        return { error: 'No se pudo cargar el hecho. Inténtalo de nuevo más tarde.' };
    }
}


async function displayFact() {
    const factTextElement = document.getElementById('fact-text');
    const statusMessageElement = document.getElementById('status-message');

    statusMessageElement.textContent = '';
    factTextElement.textContent = 'Cargando hecho curioso...';

    const data = await fetchFact();

    if (data && data.text) {
        currentFact = data; 
        factTextElement.textContent = data.text;
    } else {
        statusMessageElement.textContent = data.error || 'error.';
        factTextElement.textContent = ' Intentalo de nuevo';
    }
}


function renderFavorites(favorites) {
    const favoritesListElement = document.getElementById('favorites-list');
    
    const listToRender = favorites || JSON.parse(localStorage.getItem('factsFavorites')) || [];
    
    if (listToRender.length === 0) {
        favoritesListElement.innerHTML = '<h2>Mis Favoritos</h2><p>Aún no tienes favoritos.</p>';
        return;
    }

    const favoritesHTML = listToRender.map(fact => {
        return `<li id="fav-${fact.id}">${fact.text}</li>`;
    }).join(''); 

    favoritesListElement.innerHTML = `<h2>Mis Favoritos</h2><ul>${favoritesHTML}</ul>`;
}


function saveFavoriteFact() {
    if (!currentFact || !currentFact.id) {
        console.warn("No hay un hecho válido para guardar.");
        return; 
    }

    const favoritesString = localStorage.getItem('factsFavorites'); 
    let favoritesList = favoritesString ? JSON.parse(favoritesString) : []; 
    
   
    const isDuplicate = favoritesList.some(fav => fav.id === currentFact.id);

    if (!isDuplicate) {
        favoritesList.push(currentFact);
        localStorage.setItem('factsFavorites', JSON.stringify(favoritesList));
        
        renderFavorites(favoritesList); 
        console.log("¡Hecho guardado!");
    } else {
        console.warn("¡Este hecho ya está guardado!");
    }
}


displayFact();
renderFavorites(); 

const newFactButton = document.getElementById('new-fact-btn');
newFactButton.addEventListener('click', displayFact);

const saveFavButton = document.getElementById('save-fav-btn'); 
saveFavButton.addEventListener('click', saveFavoriteFact);