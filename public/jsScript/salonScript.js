document.addEventListener("DOMContentLoaded", function() {

    const editButtonSalon = document.querySelector('.edit-button-salon');
    const saveButtonSalon = document.querySelector('.save-button-salon');
    
    editButtonSalon.addEventListener('click', () => {
        const contenuMessage = document.querySelector('.message');
        const contenuMessageTextarea = document.createElement('textarea');
        contenuMessageTextarea.type = 'text';
        contenuMessageTextarea.value = contenuMessage.textContent;
        contenuMessage.textContent = '';
        contenuMessage.appendChild(contenuMessageTextarea);

        // Afficher le bouton "Valider" et masquer le bouton "Modifier"
        editButtonSalon.classList.add('display-none');
        editButtonSalon.classList.remove('display-block');
        saveButtonSalon.classList.add('display-block');
        saveButtonSalon.classList.remove('display-none');
    });

    saveButtonSalon.addEventListener('click', () => {

        const contenuMessageResult = document.querySelector('.message textarea');
        // Créer un objet FormData pour envoyer les données
        console.log(contenuMessageResult)
        const formData = new FormData();

        formData.append('id', saveButtonSalon.dataset.id);
        formData.append('message', contenuMessageResult.value);

        // Effectuer une requête fetch pour envoyer les données
        fetch('/updateMessage', {
                method: 'POST',
                body: formData
            })
            .then((response) => {
                console.log(response)
                if (response.redirected === true) {
                    window.location.href = response.url
                }
                else {
                    return response.json()
                        .then((data) => {
                            // Traitez la réponse du serveur (par exemple, affichez un message de succès)
                            console.log("Récupération réussie");
                            window.location.reload()
                        })
                }
            })

            .catch((error) => {
                // Gérez les erreurs (par exemple, affichez un message d'erreur)
                console.error('Erreur lors de la mise à jour :', error);
            });

    });
})
