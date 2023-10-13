import query from '../../database.js';
import { DateTime } from "luxon"; 

export default (req, res) => {
    query(`SELECT fs.id as id, fs.intitule as intitule, fs.date as date, u.login as login,
    CASE WHEN MAX(fm.date) > fs.date THEN MAX(fm.date)
    ELSE fs.date END AS lastRefresh
    FROM ForumSalon fs
    INNER JOIN Users u ON fs.idUtilisateur = u.id
    LEFT JOIN ForumMessage fm ON fs.id = fm.idSalon
    GROUP BY fs.id, fs.intitule, fs.date, u.login
    ORDER BY lastRefresh DESC;`, (error,forum) => {
            if (error) {
                console.error(`Erreur lors de l'exécution de la requête ${error}`);
                res.status(500).send('Erreur serveur');
                return;
            }
        for (const salon of forum){
            let dateISO = (salon.date).toISOString();
            let dateLuxon = DateTime.fromISO(dateISO);
            salon.date = dateLuxon.toFormat('dd/LL/yyyy HH:mm');
            dateISO = (salon.lastRefresh).toISOString();
            dateLuxon = DateTime.fromISO(dateISO);
            salon.lastRefresh = dateLuxon.toFormat('dd/LL/yyyy HH:mm');
        }
        
    res.render('forum.ejs', { forum });
    });
};