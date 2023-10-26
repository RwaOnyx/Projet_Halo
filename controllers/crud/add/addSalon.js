import { v4 } from 'uuid';
import query from '../../../database.js';
import xss from 'xss';

export function addSalon(req, res) {
    const value = [v4(), xss(req.body.intitule), req.session.idUser]
    const redirection = "/forum/" + value[0]
    console.log(value)
    query(
        `INSERT INTO ForumSalon (id,intitule,idUtilisateur) VALUES (?,?,?);`,
        value,
        (error, resultSQL) => {
            if (error) {
                console.error(`Erreur lors de l'exécution de la requête ${error}`);
                res.status(500).send('Erreur serveur');
                return;
            }
            res.redirect(redirection/*, { message: "blabla" }*/);
        }
    )
}
