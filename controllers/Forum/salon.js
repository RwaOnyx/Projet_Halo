import query from '../../database.js';
import { DateTime } from "luxon";

export default (req, res) => {
    const { id } = req.params;
    query(`SELECT fm.date AS date, fm.id AS id, fm.message AS message, u.login AS login, u.role AS role, u.image AS image
        FROM ForumMessage fm
        LEFT JOIN Users u ON u.id = fm.idUtilisateur
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

        query(`SELECT intitule, id
        FROM ForumSalon 
        WHERE id = ?;`, id, (error, salon) => {
            if (error) {
                console.error(`Erreur lors de l'exécution de la requête ${error}`);
                res.status(500).send('Erreur serveur');
                return;
            }
            
            salon=salon[0]
            res.render('salon.ejs', { messages, salon });
        });
    })
};
