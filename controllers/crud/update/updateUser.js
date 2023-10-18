import query from '../../../database.js';
import bcrypt from 'bcrypt';
import xss from 'xss';
import { deleteImage } from '../delete/deleteUser.js'

export function updateUser(req, res) {
    let data = {
        id: req.body.id,
        login: xss(req.body.login),
        email: xss(req.body.email),
        role: xss(req.body.role)
    }

    console.log(req.body);

    // Gestion du mot de passe
    checkPassword(req.body.password, data, (dataWithPassword) => {
        // Gestion de l'image
        checkImage(req.files, req.body.lastLogin, dataWithPassword, (dataWithImage) => {

            // Exécution de la requête SQL
            requeteSQL(dataWithImage, () => {
                res.json({ message: "Mise à jour réussie" });
            });
        });
    });
}

function checkPassword(password, data, callback) {
    if (password !== undefined && password !== "") {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                console.error('Erreur de hachage :', err);
            } else {
                console.log('Mot de passe haché :', hash);
                data.password = hash;
            }
            callback(data);
        });
    } else {
        callback(data);
    }
}

function checkImage(image, lastLogin, data, callback) {
    if (image) {
        console.log("passage id : " + data.id);
        deleteImage(lastLogin);
        console.log("id : " + data.id);
        const chemin = 'public/images/profil/' + data.id + ".";
        console.log(chemin);
        image.image.mv(chemin, (err) => {
            if (err) {
                console.log('Erreur' + err);
            } else {
                console.log("test : " + data);
                data.image = data.id + ".";
                console.log('Fichier téléchargé et valeurs mises à jour !');
                console.log(data);
            }
            callback(data);
        });
    } else {
        callback(data);
    }
}

function requeteSQL(data, callback) {
    query(`UPDATE Users SET ? WHERE id = ?;`, [data, data.id], (error) => {
        if (error) {
            console.error(`Erreur lors de la modification ${error}`);
            console.log('Erreur serveur');
        }
        callback();
    });
}
