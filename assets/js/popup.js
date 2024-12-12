        // Sélection des éléments
        const hintTrigger = document.getElementById('hintTrigger');
        const hintPopup = document.getElementById('hintPopup');
        const closePopup = document.getElementById('closePopup');
        const closeHintBtn = document.getElementById('closeHintBtn');

        // Fonction pour ouvrir la popup
        function openHintPopup(event) {
            event.preventDefault();
            hintPopup.style.display = 'flex';
        }

        // Fonction pour fermer la popup
        function closeHintPopup() {
            hintPopup.style.display = 'none';
        }

        // Écouteurs d'événements
        hintTrigger.addEventListener('click', openHintPopup);
        closePopup.addEventListener('click', closeHintPopup);
        closeHintBtn.addEventListener('click', closeHintPopup);

        // Fermer la popup en cliquant en dehors
        hintPopup.addEventListener('click', function(event) {
            if (event.target === hintPopup) {
                closeHintPopup();
            }
        });