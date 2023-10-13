import query from '../../../database.js';

export function deleteUsersList(req, res) {
    const usersToDelete = Array.isArray(req.body.usersToDelete) ? req.body.usersToDelete : [req.body.usersToDelete];

    if (!usersToDelete.length) {
        return res.redirect("/listUsersRole", { message: "Vous n'avez pas coché de cases" });
    }

    const incrementation = [];
    for (const user of usersToDelete) {
        incrementation.push('?');
    }

    if (usersToDelete[0].role !== "utilisateur") {
        res.redirect("/listUsersRole" /*, { message : "Responsable(s) supprimé(s)"}*/ );
    }
    else {
        res.redirect("/listUsers" /*, { message : "Utilisateur(s) supprimé(s)"}*/ );
    }

    deleteUsers(incrementation, usersToDelete);
}

export function deleteUser(req, res) {
    const login = req.session.login;

    deleteUsers('?', [login]);
    req.session.destroy(() => {
    	res.redirect("/" /*, { message : "Votre compte a été supprimé"}*/ );
    })
    
}

function deleteUsers(incrementation, usersToDelete) {
    query(`DELETE FROM Users WHERE login IN(${incrementation});`, usersToDelete, (error) => {
        if (error) {
            console.error(`Erreur lors de l'exécution de la requête ${error}`);
            console.log('Erreur serveur');
        }
    });
}
