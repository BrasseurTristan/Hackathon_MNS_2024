const form = document.querySelector('.form-container');
const errorMessage = document.querySelector('#error-message');

form.addEventListener('submit', (e) => {
  e.preventDefault(); // Empêche l'action par défaut

  const email = document.getElementById('email').value;
  const password = document.getElementById('mdp').value;

  const dataForm = {
    email: email,
    password: password
  };


  // Envoyer la demande de connexion au serveur avec les données du formulaire
  fetch('http://localhost:5678/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataForm) //Récupère les données du formulaire sous forme de chaîne JSON
  })
    .then(response => response.json())
    .then(data => {
       //vérifie si Token dans réponse
       if (data.token) {
          /* Si le token est présent dans la réponse, 
          stocker le token dans le sessionStorage*/
          sessionStorage.setItem('token', data.token);
          // Rediriger vers la page d'accueil
          window.location.href = 'index.html';
        } else {
          errorMessage.style.display = 'block'
        };
    })
    .catch(error => {
        console.error(error);
        // Afficher un message d'erreur générique
        });
});