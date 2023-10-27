document.addEventListener("DOMContentLoaded", function() {

    const editButtonsListUser = document.querySelectorAll('.edit-button-listUser');
    const saveButtonsListUser = document.querySelectorAll('.save-button-listUser');

    editButtonsListUser.forEach((editButtonListUser) => {
        editButtonListUser.addEventListener('click', () => {
            const row = editButtonListUser.closest('tr');
            const login = row.querySelector('.user-login');
            const email = row.querySelector('.user-email');
            const date = row.querySelector('.user-date');
            const image = row.querySelector('.user-image');
            const imageUpdate = row.querySelector('.user-image-update');
            const role = row.querySelector('.user-role'); // Sélectionnez le champ de rôle actuel
            const roleValue = role.textContent; // Récupérez la valeur actuelle du rôle
            const passwordSpan = row.querySelector('.user-password .password-masked');
            const password = row.querySelector('.user-password .password-input');

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

            // Désactivez le champ de date
            const dateInput = row.querySelector('.user-date');
            dateInput.setAttribute('readonly', true);

            // Rendre le champ d'image visible
            const imageInput = row.querySelector('.user-image input');
            imageInput.classList.add('display-block');
            imageInput.classList.remove('display-none');
            imageUpdate.classList.add('display-none');
            imageUpdate.classList.remove('display-block');

            role.innerHTML = `<select name="role">
                    <option value="moderateur">Modérateur</option>
                    <option value="admin">Administrateur</option>
                    <%  if (locals.role === 'superadmin' ){ %>
                            <option value="superadmin">SuperAdmin</option>
                    <% } %>
                    <option value="productmanager">Product Manager</option>
                    <option value="redacteur">Rédacteur</option>
                    <option value="utilisateur">Utilisateur</option>
                </select>`;
            role.querySelector('select').value = roleValue;

            // Afficher le champ de mot de passe en mode édition
            passwordSpan.classList.add('display-none');
            passwordSpan.classList.remove('display-block');
            password.classList.add('display-block');
            password.classList.remove('display-none');

            editButtonListUser.classList.add('display-none');
            editButtonListUser.classList.remove('display-block');
            row.querySelector('.save-button').classList.add('display-block');
            row.querySelector('.save-button').classList.remove('display-none');
        });
    });

    saveButtonsListUser.forEach((saveButtonListUser) => {
        saveButtonListUser.addEventListener('click', () => {
            // Récupérez les données modifiées depuis les champs de texte
            const row = saveButtonListUser.closest('tr');
            const id = row.getAttribute('data-id');
            const loginInput = row.querySelector('.user-login input');
            const emailInput = row.querySelector('.user-email input');
            const imageInput = row.querySelector('.user-image input');
            const roleSelect = row.querySelector('.user-role select'); // Sélectionnez le menu déroulant de rôle
            const passwordInput = row.querySelector('.user-password .password-input');

            const formData = new FormData();

            formData.append('image', imageInput.files[0]);
            formData.append('id', id);
            formData.append('login', loginInput.value);
            formData.append('email', emailInput.value);
            formData.append('role', roleSelect.value);
            formData.append('password', passwordInput.value);

            fetch('/updateUser', {
                    method: 'POST',
                    body: formData,
                })
                .then((response) => response.json())
                .then((data) => {
                    // Traitez la réponse du serveur (par exemple, affichez un message de succès)
                    console.log("Récupération réussie");
                    window.location.reload()
                })
                .catch((error) => {
                    // Gérez les erreurs (par exemple, affichez un message d'erreur)
                    console.error('Erreur lors de la mise à jour :', error);
                });
        });
    });
})
