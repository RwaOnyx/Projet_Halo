import query from '../../../database.js';

export function deleteSalon(req, res) {
    console.log("passage")
    query(
        `DELETE FROM ForumSalon WHERE id = ?;`,
        req.body.id,
        (error, resultSQL) => {
            if (error) {
                console.error(`Erreur lors de l'exécution de la requête ${error}`);
                res.status(500).send('Erreur serveur');
                return;
            }
            res.redirect("/forum"/* , { message: "blabla" }*/);
        }
    )
}