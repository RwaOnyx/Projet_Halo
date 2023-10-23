import { v4 } from 'uuid';
import formidable from 'formidable';
import bcrypt from 'bcrypt';
import path from 'path';
import fs from 'fs';
import query from '../../../database.js';
import xss from 'xss';

export function register(req, res) {
    processForm(req, res, false, "/listUsers");
}

export function registerRole(req, res) {
    processForm(req, res, true, "/listUsersRole");
}

function processForm(req, res, role, redirectPath) {
    const formData = formidable({ allowEmptyFiles: true, minFileSize: 0 });
    formData.parse(req, (error, fields, files) => {
        if (error) {
            console.error(`Erreur lors de la récupération de la photo : ${error}`);
            res.status(500).send('Erreur serveur');
            return;
        }

        addUsers(fields, files, role, res, () => {
            res.redirect(redirectPath);
        });
    });
}

// Fonction générique pour le traitement commun des données
function addUsers(fields, files, role, res, callback) {
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

        const interrogation = ["?", "?", "?", "?", "?"];
        const colonne = ["id", "login", "email", "password", "image"];
        const value = [id, login, email, hash];

        if (files.image && files.image[0].originalFilename) {
            const chemin = 'public/images/profil/' + id + ".";
            value.push(id + ".");

            fs.copyFile(files.image[0]._writeStream.path, chemin, (error) => {
                if (error) {
                    console.error(`Erreur lors de la copie du fichier : ${error}`);
                    res.status(500).send('Erreur serveur');
                    return;
                }

                console.log('Fichier copié avec succès.');
            });
        } else {
            const imageRandom = Math.floor(Math.random() * 2);
            value.push(imageRandom + ".");
        }
        
        if (role) {
            colonne.push("role");
            console.log(fields)
            value.push(xss(fields.role[0]));
            interrogation.push("?");
        }
        
        console.log(colonne, interrogation, value);
        
        query(
            `INSERT INTO Users (${colonne}) VALUES (${interrogation});`,
            value,
            (error, resultSQL) => {
                if (error) {
                    console.error(`Erreur lors de l'exécution de la requête ${error}`);
                    res.status(500).send('Erreur serveur');
                    return;
                }
                // Appel de la fonction de rappel une fois que l'ajout est terminé
                callback();
            }
        );
    })
}