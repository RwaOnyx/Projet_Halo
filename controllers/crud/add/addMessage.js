import { v4 } from 'uuid';
import query from '../../../database.js';
import xss from 'xss';

export function addMessage(req, res) {
    const { id } = req.params
    const value = [v4(), xss(req.body.message), req.session.idUser,id]
    const redirection = "/forum/" + id
    query(
        `INSERT INTO ForumMessage (id,message,idUtilisateur,idSalon) VALUES (?,?,?,?);`,
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