import { v4 } from 'uuid';
import formidable from 'formidable';
import fs from 'fs';
import query from '../../../database.js';
import xss from 'xss';

export function addArticle(req, res) {
    const formData = formidable({ allowEmptyFiles: true, minFileSize: 0 });
    formData.parse(req, (error, fields, files) => {
        if (error) {
            console.error(`Erreur lors de la récupération de la photo : ${error}`);
            res.status(500).send('Erreur serveur');
            return;
        }

        const value = [v4(), xss(fields.titre), req.session.idUser, xss(fields.intro) ]; // Utilisez fields.titre directement
        const chemin = 'public/images/news/' + value[0] + '.'; // Spécifiez l'extension du fichier
        fs.copyFile(files.image[0]._writeStream.path, chemin, (error) => {
                if (error) {
                    console.error(`Erreur lors de la copie du fichier : ${error}`);
                    res.status(500).send('Erreur serveur');
                    return;
                }
            value.push(value[0]+".")
            console.log('Fichier copié avec succès.');

            query(
                `INSERT INTO News (id, titre, idUtilisateur, intro, image) VALUES (?, ?, ?, ?, ?);`,
                value,
                (error, resultSQL) => {
                    if (error) {
                        console.error(`Erreur lors de l'exécution de la requête ${error}`);
                        res.status(500).send('Erreur serveur');
                        return;
                    }
                    // Appel de la fonction de rappel une fois que l'ajout est terminé
                    const redirection = "/news/" + value[0];
                    res.redirect(redirection);
                }
            );
        });
    });
}
