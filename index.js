document.addEventListener('DOMContentLoaded', function () {
    var coursInfos;

    fetch('https://raw.githubusercontent.com/Lucbarika100B/IFT215-Projet-Session/main/model.json')
        .then(response => response.json())
        .then(data => {
            // Manipulez les données ici
            coursInfos = data.map(cours => ({
                title: cours.titre,
                start: cours.date_fin,
                etat: cours.etat,

                description: `État: ${cours.etat}<br>Date de fin: ${cours.date_fin}<br>Temps restant: ${calculerJoursRestants(cours.date_fin)} jours`
            }));

            // Initialisation de FullCalendar
            var calendarEl = document.getElementById('calendar');
            var calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                events: coursInfos,
                eventClick: function (info) {
                    // Afficher les informations de l'événement dans une boîte de dialogue
                    const message = info.event.title
                        + '\n' + info.event.extendedProps.etat
                        + '\n' + info.event.startStr;
                    //console.log(message);
                    alert(message);
                }
            });
            calendar.render();

            // Initialisation de la grille

            // Suppose que coursInfos est votre tableau d'objets JSON transformé
            function comparerTempsRestant(a, b) {
                const tempsRestantA = calculerJoursRestants(a.start);
                const tempsRestantB = calculerJoursRestants(b.start);

                return tempsRestantA - tempsRestantB;
            }

            coursInfos.sort(comparerTempsRestant);

            const gridCours = document.getElementById("gridCours");

            coursInfos.forEach(cours => {
                // Créer la boite de cours
                const coursBox = document.createElement("div");
                coursBox.classList.add("cours-box");

                // Créer le titre (h2)
                const title = document.createElement("h2");
                title.textContent = cours.title;
                coursBox.appendChild(title);

                // Créez un paragraphe pour l'état
                const etatElem = document.createElement("p");
                etatElem.innerHTML = `État: ${cours.etat}`;
                coursBox.appendChild(etatElem);

                // Créez un paragraphe pour la date de fin
                const dateFinElem = document.createElement("p");
                dateFinElem.innerHTML = `Date de fin: <span class="date-fin">${cours.start}</span>`;
                coursBox.appendChild(dateFinElem);

                // Créez un paragraphe pour le temps restant
                const tempsRestantElem = document.createElement("p");
                tempsRestantElem.innerHTML = `Temps restant: <span class="temps-restant">${calculerJoursRestants(cours.start)} jours</span>`;
                coursBox.appendChild(tempsRestantElem);

                // Créer le bouton
                const button = document.createElement("button");
                button.textContent = "Soumission";
                button.addEventListener('click', function () {
                    afficherPageDevoir(cours);
                });
                coursBox.appendChild(button);

                // Ajouter la boite de cours à la grille
                gridCours.appendChild(coursBox);
            });

        })
        .catch(error => console.error('Erreur lors du chargement du fichier JSON :', error));
});

function afficherPageDevoir(infoDevoir) {

    // Assurez-vous que l'objet JSON est valide
    if (!infoDevoir || typeof infoDevoir !== 'object') {
        console.error("L'objet JSON n'est pas valide.");
        return;
    }
    console.log(infoDevoir);
    // Extraire les informations du devoir
    const { title, start, etat } = infoDevoir;

    // Vérifier si toutes les informations nécessaires sont présentes
    if (!title || !start || !etat) {
        console.error('Les informations du devoir sont incomplètes.');
        return;
    }

    // Construire l'URL de la nouvelle page de soumission du devoir
    const urlNouvellePage = `soumission-devoir.html?titre=${encodeURIComponent(
        title
    )}&dateRemise=${encodeURIComponent(start)}&sigleCours=${encodeURIComponent(etat)}`;

    console.log(urlNouvellePage);

    // Rediriger vers la nouvelle page de soumission du devoir
    window.location.href = urlNouvellePage;
}

function calculerJoursRestants(dateFin) {
    const dateRemise = new Date(dateFin);
    const aujourdhui = new Date();

    // Calcule la différence en millisecondes
    const difference = dateRemise - aujourdhui;

    // Convertit la différence en jours
    const joursRestants = Math.ceil(difference / (1000 * 60 * 60 * 24));

    return joursRestants;
}






