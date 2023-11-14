import query from '../../database.js';
import { DateTime } from "luxon";

export default (req, res) => {
    query(
        `SELECT
    fs.id AS id,
    fs.intitule AS intitule,
    fs.date AS date,
    u.login AS login,
    u.image AS image,
    CASE
        WHEN MAX(fm.date) > fs.date THEN MAX(fm.date)
        ELSE fs.date
    END AS derniereUpdate,
    COUNT(fm.id) AS nbMessages
FROM ForumSalon fs
INNER JOIN Users u ON fs.idUtilisateur = u.id
LEFT JOIN ForumMessage fm ON fs.id = fm.idSalon
GROUP BY fs.id, fs.intitule, fs.date, u.login
ORDER BY derniereUpdate DESC;`,
        (error, salonJour) => {
            if (error) {
                console.error(`Erreur lors de l'exécution de la requête ${error}`);
                res.status(500).send('Erreur serveur');
                return;
            }

            console.log(salonJour)
            for (let i = 0; i < salonJour.length - 1; i++) {
                if (salonJour[i].nbMessages === 0) {
                    const temp = salonJour[i];
                    salonJour[i] = salonJour[i + 1];
                    salonJour[i + 1] = temp;
                }
            }

            salonJour = salonJour[0]
            let dateISO = (salonJour.date).toISOString();
            let dateLuxon = DateTime.fromISO(dateISO);
            salonJour.date = dateLuxon.toFormat('dd/LL/yyyy HH:mm');

            query(
                `SELECT message
                FROM ForumMessage
                WHERE idSalon=?
                ORDER BY date
                LIMIT 1;`, salonJour.id,
                (error, messageSalonJour) => {
                    if (error) {
                        console.error(`Erreur lors de l'exécution de la requête ${error}`);
                        res.status(500).send('Erreur serveur');
                        return;
                    }
                    salonJour.premierMessage = messageSalonJour[0].message

                    query(
                        `SELECT *
                        FROM News
                        ORDER BY date DESC
                        LIMIT 1;`,
                        (error, newsMoment) => {
                            if (error) {
                                console.error(`Erreur lors de l'exécution de la requête ${error}`);
                                res.status(500).send('Erreur serveur');
                                return;
                            }
                            newsMoment = newsMoment[0]
                            let dateISO = (newsMoment.date).toISOString();
                            let dateLuxon = DateTime.fromISO(dateISO);
                            newsMoment.date = dateLuxon.toFormat('dd/LL/yyyy');
                            
                            const results = [salonJour,newsMoment]
                            res.render('index.ejs', { results });
                        }
                    )


                })


        })



};
