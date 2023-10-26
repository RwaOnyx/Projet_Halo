import query from '../../../database.js';
import fs from 'fs';
import path from 'path';

export function deleteUsersList(req, res) {
    const usersToDelete = Array.isArray(req.body.usersToDelete) ? req.body.usersToDelete : [req.body.usersToDelete];

    if (!usersToDelete.length) {
        return res.redirect("/listUsersRole" /*, { message: "Vous n'avez pas coché de cases" }*/ );
    }

    const incrementation = [];
    let totalUsers = usersToDelete.length;

    usersToDelete.forEach((user) => {
        incrementation.push('?');
        deleteImage(user, () => {
            // Cette fonction de rappel sera appelée une fois que l'image est supprimée.
            totalUsers--;

            if (totalUsers === 0) {
                // Toutes les images ont été supprimées, on peut maintenant supprimer les utilisateurs.
                deleteUsers(incrementation, usersToDelete, res, req);
            }
        });
    });
}

export function deleteUser(req, res) {
    const id = req.session.idUser;

    deleteImage(id, () => {
        // Cette fonction de rappel sera appelée une fois que l'image est supprimée.
        deleteUsers('?', id, res, req);
    });
}

function deleteUsers(incrementation, usersToDelete, res, req) {
    console.log(usersToDelete)
    console.log(incrementation)
    query(`SELECT role FROM Users WHERE id IN(${incrementation}) LIMIT 1;`, usersToDelete, (error, role) => {
        if (error) {
            console.error(`Erreur lors de la récuperation du rôle ${error}`);
            console.log('Erreur serveur');
        }
        query(`DELETE FROM Users WHERE id IN(${incrementation});`, usersToDelete, (error) => {
            if (error) {
                console.error(`Erreur lors de la suppression ${error}`);
                console.log('Erreur serveur');
            }
            console.log(role)
            redirection(role, usersToDelete, res, req);
        });

    });
}

export function deleteImage(id, callback) {
    query(`SELECT image FROM Users WHERE id = ?;`, [id], (error, result) => {
        if (error) {
            console.error(`Erreur lors de la récuperation de l'image ${error}`);
            console.log('Erreur serveur');
        }
        if (result.length === 1 && result[0].image !== "logo_bleu." && result[0].image !== "logo_rouge.") {
            const chemin = path.join('public/images/profil/', result[0].image); // Chemin complet du fichier à supprimer
            fs.unlink(chemin, (error) => {
                if (error) {
                    console.error(`Erreur lors de la suppression de l'image : ${error}`);
                    // Gérez l'erreur, par exemple, en renvoyant une réponse d'erreur au client.
                }
                else {
                    console.log('Image supprimée avec succès.');
                    // Fournissez une réponse indiquant que l'image a été supprimée avec succès.
                }

                if (callback) {
                    callback();
                }
            });
        }
        else {
            console.log('Image en double.');

            if (callback) {
                callback();
            }
        }
    });
}

function redirection(role, id, res, req) {
    console.log(role)
    if (id === req.session.id) {
        req.session.destroy(() => {
            res.redirect("/" /*, { message : "Votre compte a été supprimé"}*/ );
        });
    }
    else if (role[0].role !== "utilisateur") {
        res.redirect("/listUsersRole" /*, { message : "Responsable(s) supprimé(s)"} */ );
    }
    else {
        res.redirect("/listUsers" /*, { message : "Utilisateur(s) supprimé(s)"} */ );
    }
}
