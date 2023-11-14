document.addEventListener("DOMContentLoaded", function() {
    
    const editButtonForum = document.querySelector('.edit-button-forum');
    const saveButtonForum = document.querySelector('.save-button-forum');
    const showAddForumForm = document.querySelector(".showAddForumForm");
    const salonForm = document.querySelector(".salonForm");
    const addForum = document.querySelector(".addForum");

    showAddForumForm.addEventListener("click", function() {
        salonForm.classList.add('display-block');
        salonForm.classList.remove('display-none');
        addForum.classList.add('display-none');
        addForum.classList.remove('display-block');
    });
    
    editButtonForum.addEventListener('click', () => {
        event.preventDefault();
        const intituleSalon = document.querySelector('.nomSalon');
        const intituleSalonInput = document.createElement('input');
        intituleSalonInput.type = 'text';
        intituleSalonInput.value = intituleSalon.textContent;
        intituleSalon.textContent = '';
        intituleSalonInput.classList.add("forum-modif-input");
        intituleSalon.appendChild(intituleSalonInput);

        // Afficher le bouton "Valider" et masquer le bouton "Modifier"
        editButtonForum.classList.add('display-none');
        editButtonForum.classList.remove('display-block');
        saveButtonForum.classList.add('display-block');
        saveButtonForum.classList.remove('display-none');


        const ahref = document.querySelector('.salonForum');
        ahref.classList.add('display-none');
        ahref.classList.remove('display-block');

        ahref.onclick = function(event) {
            event.preventDefault(); // Empêche le lien de s'ouvrir
        };
    });

    saveButtonForum.addEventListener('click', () => {
        const intituleSalonResult = document.querySelector('.nomSalon input');
        // Créer un objet FormData pour envoyer les données
        const formData = new FormData();

        formData.append('id', saveButtonForum.dataset.id);
        formData.append('intitule', intituleSalonResult.value);

        // Effectuer une requête fetch pour envoyer les données
        fetch('/updateSalon', {
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
