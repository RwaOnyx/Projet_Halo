import query from '../../database.js';
import { DateTime } from "luxon";

export default (req, res) => {
    query(`SELECT
    fs.id as id,
    fs.intitule as intitule,
    fs.date as date,
    COALESCE(u.login, 'Utilisateur supprimé') as login,
    COALESCE(u.image, "logo_inconnu.") as image,
    CASE WHEN MAX(fm.date) > fs.date THEN MAX(fm.date)
        ELSE fs.date END AS derniereUpdate,
    COUNT(fm.id) as nbMessages
FROM
    ForumSalon fs
LEFT JOIN
    Users u ON fs.idUtilisateur = u.id
LEFT JOIN
    ForumMessage fm ON fs.id = fm.idSalon
GROUP BY
    fs.id, fs.intitule, fs.date, u.image
ORDER BY
    derniereUpdate DESC;
`, (error, forum) => {
        if (error) {
            console.error(`Erreur lors de l'exécution de la requête ${error}`);
            res.status(500).send('Erreur serveur');
            return;
        }
        console.log(forum)
        for (const salon of forum) {
            let dateISO = (salon.date).toISOString();
            let dateLuxon = DateTime.fromISO(dateISO);
            salon.date = dateLuxon.toFormat('dd/LL/yyyy');
            dateISO = (salon.derniereUpdate).toISOString();
            dateLuxon = DateTime.fromISO(dateISO);
            salon.derniereUpdate = dateLuxon.toFormat('dd/LL/yyyy HH:mm');
        }
        console.log(forum)

        res.render('forum.ejs', { forum });
    });
};
