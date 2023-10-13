import { v4 } from 'uuid';
import formidable from 'formidable';
import bcrypt from 'bcrypt';
import path from 'path';
import fs from 'fs';
import query from '../../database.js';
import xss from 'xss';

export function register(req, res) {
    const formData = formidable({ allowEmptyFiles: true, minFileSize: 0 });
    formData.parse(req, (error, fields, files) => {
        if (error) {
            console.error(`Erreur lors de la récupération de la photo : ${error}`);
            res.status(500).send('Erreur serveur');
            return;
        }
        addUsers(fields, files, true, req, res);
    });
}

export function registerRole(req, res) {
    const formData = formidable({ allowEmptyFiles: true, minFileSize: 0 });
    formData.parse(req, (error, fields, files) => {
        if (error) {
            console.error(`Erreur lors de la récupération de la photo : ${error}`);
            res.status(500).send('Erreur serveur');
            return;
        }
        
        // Ajoutez ici la logique spécifique pour l'ajout d'administrateur (par exemple, gérer le rôle)
        addUsers(fields, files, false, req, res);
    });
}

// Fonction générique pour le traitement commun des données
function addUsers(fields, files, isUser = true, req, res) {
    const id = v4();
    const login = xss(fields.pseudo[0]);
    const email = xss(fields.email[0]);
    const password = fields.password[0];

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error('Erreur de hachage :', err);
        } else {
            console.log('Mot de passe haché :', hash);
        }

        const interrogation = ["?", "?", "?", "?"];
        const colonne = ["id", "login", "email", "password"];
        const value = [id, login, email, hash];
        
        if (!isUser){
            colonne.push("role");
            const role = xss(fields.role[0]);
            value.push(role);
            interrogation.push("?");
        }
        

        if (files.image[0].originalFilename !== false || files.image[0].originalFilename !== '') {
            console.log(files.image[0]);
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

                console.log('Fichier copié avec succès.');
            });
        }

        query(
            `INSERT INTO Users (${colonne}) VALUES (${interrogation});`, value,
            (error, resultSQL) => {
                if (error) {
                    console.error(`Erreur lors de l'exécution de la requête ${error}`);
                    res.status(500).send('Erreur serveur');
                    return;
                }
                // Redirection en fonction du scénario
                if (isUser && req.session.isLogged === true) {
                    res.redirect("/listUsers" /*, { message : "Utilisateur créé"}*/ )
                } else if (!isUser && req.session.isLogged === true){
                    res.redirect("/listUsersRole" /*, { message : "Utilisateur créé"}*/ )
                } else {
                    res.redirect("/login" /*, { message : "Votre compte a été créé"}*/ )
                }
            }
        );
    });
}