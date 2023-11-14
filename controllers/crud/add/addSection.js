import { v4 } from 'uuid';
import formidable from 'formidable';
import fs from 'fs';
import query from '../../../database.js';
import xss from 'xss';

export function addSection(req, res) {
    const formData = formidable({ allowEmptyFiles: true, minFileSize: 0 });
    
    formData.parse(req, (error, fields, files) => {
        if (error) {
            console.error(`Erreur lors de la récupération de la photo : ${error}`);
            res.status(500).send('Erreur serveur');
            return;
        }
        const { id } = req.params;
        console.log(fields)
        const colonne = ['id', 'titre', 'texte', 'idNews'];
        const value = [v4(), xss(fields.titre), xss(fields.texte), id];
        console.log(value)
        const interrogation = ['?', '?', '?', '?'];

        if (files.image && files.image[0].originalFilename) {
            value.push(value[0] + '.');
            colonne.push('image');
            interrogation.push('?');
            const chemin = 'public/images/news/' + value[4];
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
            `INSERT INTO TexteNews (${colonne}) VALUES (${interrogation});`, // Utilisation de join pour construire la requête
            value,
            (error, resultSQL) => {
                if (error) {
                    console.error(`Erreur lors de l'exécution de la requête ${error}`);
                    res.status(500).send('Erreur serveur');
                    return;
                }
                // Appel de la fonction de rappel une fois que l'ajout est terminé
                const redirection = "/news/" + id;
                res.redirect(redirection);
            }
        );
    });
}
