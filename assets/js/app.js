// Constantes pour les éléments du lecteur
const playlist = document.getElementById("playlist");
const lecteur = document.querySelector("#lecteur");
const cover = document.getElementById("cover");
const disque = document.getElementById("disque");
const randomButton = document.getElementById("randomButton");
const disqueRotation = document.querySelector(".disque");

// Configuration des URLs pour les covers et les musiques
const config = {
    urlCover: "uploads/covers/",
    urlSound: "uploads/musics/",
}

// Variables
let data;
let lastPlayed = null;

// Fonction pour récupérer les données à partir du fichier JSON
async function fetchMusicData() {
    try {
        const response = await fetch('/assets/json/music_data.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

// Fonction pour construire la playlist
function buildPlaylist(data) {
    data.forEach((music) => {
        playlist.innerHTML += `<li id="${music.id}"><h2>${music.title}</h2><div><small>${music.category}</small></div></li>`;
    });
}

// Fonction pour ajouter les écouteurs d'événements
function addEventListeners() {
    const allLi = document.querySelectorAll("li");
    allLi.forEach((li) => {
        li.addEventListener("click", function (elem) {
            // Retirer la classe 'playing' de tous les éléments de la playlist
            allLi.forEach(item => item.classList.remove('playing'));

            const id = parseInt(li.id);
            const searchById = data.find((element) => element.id === id);
            lecteur.src = `${config.urlSound}${searchById.sound}`;
            lecteur.play();
            cover.src = `${config.urlCover}${searchById.cover}`;
            if (disque.classList.contains("pause")) {
                disque.classList.remove("pause");
            }
            // Ajouter la classe 'playing' à l'élément cliqué
            li.classList.add('playing');
        });
    });

    // Écouter les événements de lecture audio pour arrêter ou reprendre la rotation du disque
    lecteur.addEventListener("play", () => {
        disqueRotation.classList.remove("pause");
        // Déplacer l'élément en cours de lecture en haut de la liste
        moveSelectedToTop();
    });

    lecteur.addEventListener("pause", () => {
        disqueRotation.classList.add("pause");
    });

    lecteur.addEventListener("ended", () => {
        disqueRotation.classList.add("pause");
    });
}

// Fonction pour déplacer l'élément sélectionné en haut de la liste
function moveSelectedToTop() {
    const selectedLi = document.querySelector("li.playing");
    if (selectedLi) {
        playlist.prepend(selectedLi); // Déplace l'élément en haut de la liste
    }
}

// Fonction pour sélectionner une musique aléatoire
function getRandomMusic(musicData) {
    let randomMusic;
    do {
        const randomIndex = Math.floor(Math.random() * musicData.length);
        randomMusic = musicData[randomIndex];
    } while (randomMusic === lastPlayed && musicData.length > 1);
    lastPlayed = randomMusic;
    return randomMusic;
}

// Fonction pour mettre à jour la musique aléatoire
function updateRandomMusic(data) {
    const randomMusic = getRandomMusic(data);
    lecteur.src = `${config.urlSound}${randomMusic.sound}`;
    cover.src = `${config.urlCover}${randomMusic.cover}`;
    lecteur.play();

    // Retirer la classe 'playing' de tous les éléments de la playlist
    const allLi = document.querySelectorAll("li");
    allLi.forEach(item => item.classList.remove('playing'));
    
    // Trouver l'élément de la playlist correspondant à la nouvelle musique aléatoire
    const selectedLi = document.getElementById(randomMusic.id);
    // Ajouter la classe 'playing' à l'élément de la playlist correspondant
    selectedLi.classList.add('playing');

    // Retirer la classe 'random' de tous les éléments de la playlist
    allLi.forEach(item => item.classList.remove('random'));
    
    // Ajouter la classe 'random' à l'élément de la playlist correspondant à la nouvelle musique aléatoire
    selectedLi.classList.add('random');

    // Déplacer l'élément en cours de lecture en haut de la liste
    moveSelectedToTop();
}

// Gestionnaire d'événement pour le clic sur le bouton de musique aléatoire
randomButton.addEventListener("click", () => {
    lecteur.pause(); // Pausez la musique en cours de lecture
    updateRandomMusic(data);
});

// Point d'entrée
(async () => {
    // Récupérer les données
    data = await fetchMusicData();

    // Construire la playlist
    buildPlaylist(data);

    // Ajouter les écouteurs d'événements
    addEventListeners();
})();
// Ajouter un gestionnaire d'événement pour la fin de la musique
lecteur.addEventListener("ended", () => {
    // Vérifier si la lecture aléatoire est activée
    const isRandom = document.querySelector("li.random.playing");
    if (isRandom) {
        // Si la lecture aléatoire est activée, jouer une nouvelle musique aléatoire
        updateRandomMusic(data);
    } else {
        // Sinon, jouer la chanson suivante dans la playlist
        playNextSong();
    }
});

// Fonction pour jouer la chanson suivante dans la playlist
function playNextSong() {
    const currentPlaying = document.querySelector("li.playing");
    if (currentPlaying) {
        const nextSong = currentPlaying.nextElementSibling;
        if (nextSong) {
            nextSong.click(); // Déclencher un clic sur l'élément suivant pour démarrer la lecture
        } else {
            // Si nous sommes à la fin de la playlist, arrêter la lecture
            lecteur.pause();
        }
    }
}
