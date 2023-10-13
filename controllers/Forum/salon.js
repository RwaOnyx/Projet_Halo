import query from '../../database.js';
import { DateTime } from "luxon";

export default (req, res) => {
    const { id } = req.params;
    query(`SELECT fs.intitule AS titreSalon, fm.date AS date, fm.id AS id, fm.message AS message, u.login AS login
        FROM ForumMessage fm
        LEFT JOIN Users u ON u.id = fm.idUtilisateur
        LEFT JOIN ForumSalon fs ON fs.id = fm.idSalon
        WHERE fm.idSalon = ?
        ORDER BY fm.date DESC;`, id, (error, messages) => {
        if (error) {
            console.error(`Erreur lors de l'exécution de la requête ${error}`);
            res.status(500).send('Erreur serveur');
            return;
        }
        for (const message of messages) {
            const dateISO = (message.date).toISOString();
            const dateLuxon = DateTime.fromISO(dateISO);
            message.date = dateLuxon.toFormat('dd/LL/yyyy HH:mm');
        }

        res.render('salon.ejs', { messages });
    });
};
