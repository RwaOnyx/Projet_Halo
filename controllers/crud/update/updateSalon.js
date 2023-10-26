import query from '../../../database.js';
import xss from 'xss';
import formidable from 'formidable';

export function updateSalon(req, res) {
    const formData = formidable({ allowEmptyFiles: true, minFileSize: 0 });
    formData.parse(req, (err, fields, files) => {
        if (err) {
            console.error('Error parsing form data:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        query(`UPDATE ForumSalon SET intitule=? WHERE id = ?;`, [xss(fields.intitule), fields.id], (error) => {
            if (error) {
                console.error(`Erreur lors de la modification ${error}`);
                console.log('Erreur serveur');
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            res.status(200).json({ message: 'Mise à jour réussie' });
        });
    });
}
