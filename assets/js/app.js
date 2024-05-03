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
        data = await response.json();
        buildPlaylist(data);
        addEventListeners();
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

// Fonction pour mettre à jour la musique en cours de lecture
function updateMusic(music) {
    lecteur.src = `${config.urlSound}${music.sound}`;
    cover.src = `${config.urlCover}${music.cover}`;
    lecteur.play();
    // Retirer la classe 'playing' de tous les éléments de la playlist
    const allLi = document.querySelectorAll("li");
    allLi.forEach(item => item.classList.remove('playing'));
    // Trouver l'élément de la playlist correspondant à la nouvelle musique
    const selectedLi = document.getElementById(music.id);
    // Ajouter la classe 'playing' à l'élément de la playlist
    selectedLi.classList.add('playing');
    // Déplacer l'élément en cours de lecture en haut de la liste
    playlist.prepend(selectedLi);
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

// Fonction pour ajouter les écouteurs d'événements
function addEventListeners() {
    const allLi = document.querySelectorAll("li");
    allLi.forEach((li) => {
        li.addEventListener("click", function (elem) {
            const id = parseInt(li.id);
            const music = data.find((element) => element.id === id);
            updateMusic(music);
        });
    });

    // Gestionnaire d'événement pour le clic sur le bouton de musique aléatoire
    randomButton.addEventListener("click", () => {
        const randomMusic = getRandomMusic(data);
        updateMusic(randomMusic);
    });

    // Écouter les événements de lecture audio pour arrêter ou reprendre la rotation du disque
    lecteur.addEventListener("play", () => {
        disqueRotation.classList.remove("pause");
    });

    lecteur.addEventListener("pause", () => {
        disqueRotation.classList.add("pause");
    });

    lecteur.addEventListener("ended", () => {
        const randomMusic = getRandomMusic(data);
        updateMusic(randomMusic);
    });
}

// Appel initial pour récupérer les données de musique
fetchMusicData();
