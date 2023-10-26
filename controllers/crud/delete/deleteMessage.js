import query from '../../../database.js';

export function deleteMessage(req, res) {
    const { id } = req.params
    const redirection="/forum/"+id
    query(
        `DELETE FROM ForumMessage WHERE id = ?;`,
        req.body.id,
        (error, resultSQL) => {
            if (error) {
                console.error(`Erreur lors de l'exécution de la requête ${error}`);
                res.status(500).send('Erreur serveur');
                return;
            }
            res.redirect(redirection /* , { message: "blabla" }*/);
        }
    )
}