import query from '../../database.js';
import { DateTime } from "luxon";

export function news(req, res) {
    query(`SELECT n.id as id, n.titre as titre, n.intro as intro, n.date as date, u.login as login, n.image as image
    FROM News n
    INNER JOIN Users u ON idUtilisateur = u.id
    GROUP BY n.id
    ORDER BY date DESC;`, (error, news) => {
        if (error) {
            console.error(`Erreur lors de l'exécution de la requête ${error}`);
            res.status(500).send('Erreur serveur');
            return;
        }
        for (const article of news) {
            let dateISO = (article.date).toISOString();
            let dateLuxon = DateTime.fromISO(dateISO);
            article.date = dateLuxon.toFormat('dd/LL/yyyy');
        }
        res.render('news.ejs', { news });
    });

};


export function article(req, res) {

    const { id } = req.params;

    query(`SELECT N.id as id, N.date as date, N.image as image, N.titre as titre, N.intro as intro, U.login as createur
FROM News N
LEFT JOIN Users U ON N.idUtilisateur = U.id
WHERE N.id = ?;`, id, (error, news) => {
        if (error) {
            console.error(`Erreur lors de l'exécution de la requête ${error}`);
            res.status(500).send('Erreur serveur');
            return;
        }
        for (const article of news) {
            let dateISO = (article.date).toISOString();
            let dateLuxon = DateTime.fromISO(dateISO);
            article.date = dateLuxon.toFormat('dd/LL/yyyy');
        }
        news = news[0]

        query(`SELECT * FROM TexteNews WHERE idNews = ? ORDER BY ordre;`, id, (error, sections) => {
            if (error) {
                console.error(`Erreur lors de l'exécution de la requête ${error}`);
                res.status(500).send('Erreur serveur');
                return;
            }



            const newsComplet = [news, sections]
            console.log("bla")
            res.render('article.ejs', { newsComplet });
        });
    });
};
