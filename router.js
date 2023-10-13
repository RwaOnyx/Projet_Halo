import express from "express";
import formidable from 'formidable';
import bcrypt from 'bcrypt';
import xss from 'xss';
import path from 'path';
import fs from 'fs';
import query from './database.js'

const router = express.Router();

import Accueil from "./controllers/Accueil/index.js";
import { loginForm, login } from "./controllers/Profil/crud/loginPage.js";
import Profil from "./controllers/Profil/profil.js";
import ListUsersRole from "./controllers/Profil/listUsersRole.js";
import ListUsers from "./controllers/Profil/listUsers.js";
import AddRole from "./controllers/Profil/crud/addRole.js";
import { deleteUsersList, deleteUser } from "./controllers/Profil/crud/deleteUser.js";
import Deconnexion from "./controllers/Profil/logout.js";
import { register, registerRole } from "./controllers/add/addUser.js";

import Jeux from "./controllers/Jeux/jeux.js";
import Forum from "./controllers/Forum/forum.js";
import Salon from "./controllers/Forum/salon.js";
import News from "./controllers/News/news.js";
import Shop from "./controllers/Shop/shop.js";

const checkIsLogged = (req, res, next) => {
    if (req.session.isLogged === true) {
        next();
        return;
    }
    res.redirect("/login");
    return;
};

const checkSuperAdmin = (req, res, next) => {
    if (req.session.role === 'superadmin') {
        next();
        return;
    }
    res.redirect("/login");
    return;
};

const checkAdmin = (req, res, next) => {
    if (req.session.role === 'superadmin' || req.session.role === 'admin') {
        next();
        return;
    }
    res.redirect("/login");
    return;
};

router.use((req, res, next) => {
    res.locals.isLogged = req.session.isLogged;
    next();
});

router.use((req, res, next) => {
    res.locals.role = req.session.role;
    next();
});

router.get('/', Accueil);
router.get('/login', loginForm);
router.post('/login', login);
router.post('/register', register);
router.post('/registerRole', registerRole);
router.get('/profil', checkIsLogged, Profil);
router.get('/listUsersRole', checkAdmin, ListUsersRole);
router.post('/listUsersRole', checkAdmin);
router.get('/listUsers', checkAdmin, ListUsers);
router.post('/addRole', AddRole);
router.post('/deleteUsersList', deleteUsersList);
router.get('/deleteUser', deleteUser);
router.get('/logout', Deconnexion);


router.get('/jeux', Jeux);
/* router.get('/jeux/:id', Jeu); */
router.get('/forum', Forum);
router.get('/forum/:id', Salon);
router.get('/news', News);
/* router.get('/news/:id', Article);  */
router.get('/shop', Shop);
/* router.get('/shop/:id', Produit); */


// Route pour mettre à jour les données du membre
router.post('/updateUser', (req, res) => {
    const formData = formidable({ allowEmptyFiles: true, minFileSize: 0 });
    formData.parse(req, (error, fields, files) => {
        if (error) {
            console.error(`Erreur lors de la récupération de la photo : ${error}`);
            res.status(500).send('Erreur serveur');
            return;
        }
        const id = xss(fields.id[0]);
        bcrypt.hash(fields.password[0], 10, (err, hash) => {
            if (err) {
                console.error('Erreur de hachage :', err);
            } else {
                console.log('Mot de passe haché :', hash);
            }

            let interrogation = ["?", "?", "?", "?"];
            let colonne = ["login", "email", "password"];
            let value = [xss(fields.pseudo[0]), xss(fields.email[0]), hash];

            if (files.image[0].originalFilename === false || files.image[0].originalFilename === '') {
                console.log('Aucune image téléchargée');
            } else {
                const extension = path.extname(files.image[0]._writeStream.path);
                const nomComplet = id + "." + extension;
                const chemin = 'public/images/profil/' + nomComplet;
                colonne.push("image");
                value.push(nomComplet);
                interrogation.push("?");

                fs.copyFile(files.image[0]._writeStream.path, chemin, (error) => {
                    if (error) {
                        console.error(`Erreur lors de la copie du fichier : ${error}`);
                        res.status(500).send('Erreur serveur');
                        return;
                    }

                    // Le fichier a été copié avec succès, vous pouvez maintenant le renommer s'il est nécessaire
                    console.log('Fichier copié avec succès.');

                    // Supprimer le fichier temporaire
                    fs.unlink(files.image[0]._writeStream.path, (error) => {
                        if (error) {
                            console.error(`Erreur lors de la suppression du fichier temporaire : ${error}`);
                            // Notez que la suppression du fichier temporaire a échoué, mais la copie a réussi.
                            // Vous pouvez décider de gérer cela en conséquence.
                        }
                        value.push(id);
                        query(
                            `UPDATE Users SET ${colonne[0]} = ?, ${colonne[1]} = ?, ${colonne[2]} = ? WHERE id = ?;`,
                            value,
                            (error, resultSQL) => {
                                if (error) {
                                    console.error(`Erreur lors de l'exécution de la requête ${error}`);
                                    res.status(500).send('Erreur serveur');
                                    return;
                                }
                                if (req.session.isLogged === true) {
                                    res.redirect("/"); /*, { message : "Utilisateur modifié"} */
                                } else {
                                    res.redirect("/"); /*, { message : "Utilisateur modifié"} */
                                }
                            }
                        );
                    });
                });
            }
        });
    });
});

export default router;
