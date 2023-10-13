import query from '../../../database.js';
import fs from 'fs';
import path from 'path';

export function deleteUsersList(req, res) {
    const usersToDelete = Array.isArray(req.body.usersToDelete) ? req.body.usersToDelete : [req.body.usersToDelete];

    if (!usersToDelete.length) {
        return res.redirect("/listUsersRole" /*, { message: "Vous n'avez pas coché de cases" }*/ );
    }

    const incrementation = [];
    for (const user of usersToDelete) {
        incrementation.push('?');
        deleteImage(user)
    }
    deleteUsers(incrementation, usersToDelete, res, req);
}

export function deleteUser(req, res) {
    const login = req.session.login;
    console.log("login = ", login, " alors que ", req.session.login)

    deleteImage(login)
    deleteUsers('?', login, res, req);

}

function deleteUsers(incrementation, usersToDelete, res, req) {
    console.log(usersToDelete)
    console.log(incrementation)
    query(`SELECT role FROM Users WHERE login IN(${incrementation}) LIMIT 1;`, usersToDelete, (error, role) => {
        if (error) {
            console.error(`Erreur lors de la récuperation du role ${error}`);
            console.log('Erreur serveur');
        }
        query(`DELETE FROM Users WHERE login IN(${incrementation});`, usersToDelete, (error) => {
            if (error) {
                console.error(`Erreur lors de la suppression ${error}`);
                console.log('Erreur serveur');
            }
            console.log(role)
            redirection(role, usersToDelete, res, req)
        });

    });
}

function deleteImage(login) {
    query(`SELECT image
            FROM Users
            WHERE image = (
                    SELECT image FROM Users WHERE login = ?);`, [login, login], (error, result) => {
        if (error) {
            console.error(`Erreur lors de la récuperation de l'image ${error}`);
            console.log('Erreur serveur');
        }
        if (result.length === 1) {
            const chemin = path.join('public/images/profil/', result[0].image); // Chemin complet du fichier à supprimer
            console.log(chemin)
            fs.unlink(chemin, (error) => {
                if (error) {
                    console.error(`Erreur lors de la suppression de l'image : ${error}`);
                    // Gérez l'erreur, par exemple, en renvoyant une réponse d'erreur au client.
                }
                else {
                    console.log('Image supprimée avec succès.');
                    // Fournissez une réponse indiquant que l'image a été supprimée avec succès.
                }
            });
            return
        }
        else {
            console.log('Image en double.');
            return
        }
    });
}


function redirection(role, login, res, req) {
    if (login === req.session.login) {
        req.session.destroy(() => {
            res.redirect("/" /*, { message : "Votre compte a été supprimé"}*/ );
        })
    }
    else if (role[0].role !== "utilisateur") {
        res.redirect("/listUsersRole" /*, { message : "Responsable(s) supprimé(s)"} */ );
    }
    else {
        res.redirect("/listUsers" /*, { message : "Utilisateur(s) supprimé(s)"} */ );
    }
}
