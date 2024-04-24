const playlist = document.getElementById("playlist");
const lecteur = document.querySelector("#lecteur");
const cover = document.getElementById("cover");
const disque = document.getElementById("disque");
const randomButton = document.getElementById("randomButton");

const config = {
    urlCover: "uploads/covers/",
    urlSound: "uploads/musics/",
}

const disqueRotation = document.querySelector(".disque");
let data; // Déclaration de la variable data ici
let lastPlayed = null; // Ajoutez cette ligne

// Fonction pour récupérer les données à partir du fichier JSON
fetch('/assets/json/music_data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(responseData => {
        // Une fois les données récupérées, les utiliser pour construire la playlist
        data = responseData; // Affectation des données à la variable data
        data.forEach((music) => {
            playlist.innerHTML += `<li id="${music.id}"><h2>${music.title}</h2><div><small>${music.category}</small></div></li>`;
        });

        // Maintenant que la playlist est construite, ajouter les événements de clic aux éléments li
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
        });

        lecteur.addEventListener("pause", () => {
            disqueRotation.classList.add("pause");
        });

        lecteur.addEventListener("ended", () => {
            disqueRotation.classList.add("pause");
        });

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

        // Écouter le clic sur le bouton de musique aléatoire
        randomButton.addEventListener("click", () => {
            lecteur.pause(); // Pausez la musique en cours de lecture
            const randomMusic = getRandomMusic(data);
            lecteur.src = `${config.urlSound}${randomMusic.sound}`;
            cover.src = `${config.urlCover}${randomMusic.cover}`; // Mettre à jour la couverture
            lecteur.play(); // Lancez la nouvelle musique sélectionnée aléatoirement

            // Retirer la classe 'playing' de tous les éléments de la playlist
            allLi.forEach(item => item.classList.remove('playing'));
            
            // Trouver l'élément de la playlist correspondant à la nouvelle musique aléatoire
            const selectedLi = document.getElementById(randomMusic.id);
            // Ajouter la classe 'playing' à l'élément de la playlist correspondant
            selectedLi.classList.add('playing');

            // Retirer la classe 'random' de tous les éléments de la playlist
            allLi.forEach(item => item.classList.remove('random'));
            
            // Ajouter la classe 'random' à l'élément de la playlist correspondant à la nouvelle musique aléatoire
            selectedLi.classList.add('random');
        });
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
