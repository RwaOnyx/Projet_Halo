import query from '../../../database.js';
import bcrypt from 'bcrypt';
import xss from 'xss';
import formidable from 'formidable';
import fs from 'fs';
import { deleteImage } from '../delete/deleteUser.js';

export function updateUser(req, res) {
    const formData = formidable({ allowEmptyFiles: true, minFileSize: 0 });

    formData.parse(req, (err, fields, files) => {
        if (err) {
            console.error('Error parsing form data:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        const data = {
            id: fields.id[0],
            login: xss(fields.login),
            email: xss(fields.email),
        };
        
        if (fields.role){
            data.role = xss(fields.role)
        }

        // Handle password
        console.log(fields.password)
        if (fields.password && fields.password[0] !== '') {
            bcrypt.hash(fields.password[0], 10, (hashErr, hash) => {
                if (hashErr) {
                    console.error('Hashing error:', hashErr);
                }
                else {
                    console.log('Password hashed:', hash);
                    data.password = hash;
                }

                // Handle image after password is hashed
                gestionImage(files.image, fields.id[0], data, res);
            });
        }
        else {
            // Handle image without password change
            gestionImage(files.image, fields.id[0], data, res);
        }
    });
}

function gestionImage(image, id, data, res) {
    if (image) {
        deleteImage(id, () => {

            const chemin = 'public/images/profil/' + data.id + '.';

            fs.copyFile(image[0].filepath, chemin, (error) => {

                if (error) {
                    console.error(`Erreur lors de la copie du fichier : ${error}`);
                    res.status(500).send('Erreur serveur');
                    return;
                }

                // Update data with the image file name
                data.image = data.id + '.';
                // Perform the SQL query
                requeteSQL(data, () => {
                    res.json({ message: 'Mise à jour réussie' });
                });
            });
        });


    }
    else {
        // No image provided, just update data and perform the SQL query
        requeteSQL(data, () => {
            res.json({ message: 'Mise à jour réussie' });
        });
    }
}

function requeteSQL(data, callback) {
    query(`UPDATE Users SET ? WHERE id = ?;`, [data, data.id], (error) => {
        if (error) {
            console.error(`Erreur lors de la modification ${error}`);
            console.log('Erreur serveur');
            return;
        }
        callback();
    });
}
