document.addEventListener("DOMContentLoaded", function() {

    const editButtonProfil = document.querySelector('.edit-button-profil');
    const saveButtonProfil = document.querySelector('.save-button-profil');

    editButtonProfil.addEventListener('click', () => {
        const email = document.querySelector('.email');
        const image = document.querySelector('.image');
        const imageInput = document.querySelector('.inputImage');
        const login = document.querySelector('.login');

        const loginInput = document.createElement('input');
        loginInput.type = 'text';
        loginInput.value = login.textContent;
        login.textContent = '';
        login.appendChild(loginInput);

        const emailInput = document.createElement('input');
        emailInput.type = 'email';
        emailInput.value = email.textContent;
        email.textContent = '';
        email.appendChild(emailInput);

        // Note: 'row' is not defined. You might need to select the appropriate element.
        imageInput.classList.add('display-block');
        imageInput.classList.remove('display-none');
        image.classList.add('display-none');
        image.classList.remove('display-block');

        // Afficher le bouton "Valider" et masquer le bouton "Modifier"
        editButtonProfil.classList.add('display-none');
        editButtonProfil.classList.remove('display-block');
        saveButtonProfil.classList.add('display-block');
        saveButtonProfil.classList.remove('display-none');
    });

    saveButtonProfil.addEventListener('click', () => {
        const loginInput = document.querySelector('.login input');
        const emailInput = document.querySelector('.email input');
        const role = document.querySelector('.role');
        const imageInput = document.querySelector('.inputImage');

        // Créer un objet FormData pour envoyer les données
        const formData = new FormData();

        formData.append('id', saveButtonProfil.dataset.id);
        formData.append('email', emailInput.value);
        formData.append('login', loginInput.value);
        formData.append('role', role.dataset.role);
        formData.append('image', imageInput.files[0]);

        // Effectuer une requête fetch pour envoyer les données
        fetch('/updateUser', {
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
