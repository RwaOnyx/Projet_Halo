import query from '../../database.js'
import { DateTime } from "luxon";

export default (req, res) => {

    query(`SELECT id, login, email, date, role, image FROM Users WHERE id = ?`,
        req.session.idUser,
        (error, result) => {
            if (error) {
                console.error(`Erreur lors de l'exécution de la requête ${error}`);
                res.status(500).send('Erreur serveur');
                return;
            }
            let profil=result[0]
            console.log(profil)
            const dateISO = (profil.date).toISOString();
            const dateLuxon = DateTime.fromISO(dateISO);
            profil.date = dateLuxon.toFormat('dd/LL/yyyy');


            res.render('profil.ejs', { profil });
        });
}
