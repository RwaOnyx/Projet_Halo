import xss from 'xss';
import query from '../../database.js';

export function search(req, res) {
    res.render('search.ejs');
}

export function searchResult(req, res) {
    const search = xss(req.body.search);
    const searchLower = search.toLowerCase();
    const tableauDeMots = search.split(/[ ,:;-]/);
    let results = [[], [], []];
    const listMotsClesJeux = [
        ["halo 1", "combat evolved", "anniversary", "premier", "bungie", "1"],
        ["halo 2", "anniversary", "deuxieme", "bungie", "2"],
        ["halo 3", "troisieme", "bungie", "3"],
        ["halo 3", "odst", "bungie", "3"],
        ["reach", "bungie", "noble"],
        ["halo 4", "quatrieme", "343", "4"],
        ["halo 5", "cinquieme", "343", "guardians", "5"],
        ["halo 6", "sixieme", "infinite", "343", "6"],
        ["halo wars","wars", "ensemble studios", "1"],
        ["halo wars 2","wars", "creative assembly", "2"],
        ["halo", "master chief", "arbiter", "cortana", "histoire", "unsc", "jeu"]
    ];

    const promises = [];

    for (let mot of tableauDeMots) {
        mot = "%" + mot + "%";
        const promise = new Promise((resolve, reject) => {
            query(
                `SELECT n.id AS id, n.titre AS titre, n.intro AS intro
                FROM News n
                LEFT JOIN TexteNews tn ON n.id = tn.idNews
                WHERE n.titre LIKE ? OR n.intro LIKE ? OR tn.titre LIKE ? OR tn.texte LIKE ?
                GROUP BY n.id;`,
                [mot, mot, mot, mot],
                (error, resultSQL) => {
                    if (error) {
                        console.error(`Erreur lors de l'exécution de la requête ${error}`);
                        reject(error);
                    } else {
                        if (resultSQL.length) {
                            for (const ligne of resultSQL) {
                                results[0].push({ titre: ligne.titre, texte: ligne.intro, lien: '/news/' + ligne.id });
                            }
                        }
                        resolve();
                    }
                }
            );
        });

        promises.push(promise);
    }

    for (let mot of tableauDeMots) {
        mot = "%" + mot + "%";
        const promise = new Promise((resolve, reject) => {
            query(
                `SELECT
                    fs.id AS id,
                    fs.intitule AS intitule,
                    fs.date AS date,
                    u.login AS login,
                    u.image AS image,
                    (SELECT fm.message
                        FROM ForumMessage fm
                        WHERE fs.id = fm.idSalon
                        ORDER BY fm.date ASC
                        LIMIT 1
                    ) AS message
                FROM ForumSalon fs
                INNER JOIN Users u ON fs.idUtilisateur = u.id
                WHERE fs.intitule LIKE ? OR
                    (SELECT fm.message
                        FROM ForumMessage fm
                        WHERE fs.id = fm.idSalon
                        ORDER BY fm.date ASC
                        LIMIT 1
                    ) LIKE ?
                GROUP BY fs.id, fs.intitule, fs.date, u.login`,
                [mot, mot],
                (error, resultSQL) => {
                    if (error) {
                        console.error(`Erreur lors de l'exécution de la requête ${error}`);
                        reject(error);
                    } else {
                        if (resultSQL.length) {
                            for (const ligne of resultSQL) {
                                results[1].push({ titre: ligne.intitule, texte: ligne.message, lien: '/forum/' + ligne.id });
                            }
                        }
                        resolve();
                    }
                }
            );
        });

        promises.push(promise);
    }

    const valeur = [false, false, false, false, false, false, false, false, false, false, false];
    let i = 0;

    for (const motsClesJeux of listMotsClesJeux) {
        for (const motsClesJeu of motsClesJeux) {
            
            if (searchLower.includes(motsClesJeu)) {
                if (i === 0 && valeur[i] === false) {
                    valeur[i] = true;
                    results[2].push({ titre: 'Halo 1 : Combat Evolved', texte: 'A faire', lien: '/jeux/halo1' });
                }
                if (i === 1 && valeur[i] === false) {
                    valeur[i] = true;
                    results[2].push({ titre: 'Halo 2', texte: 'A faire', lien: '/jeux/halo2' });
                }
                if (i === 2 && valeur[i] === false) {
                    valeur[i] = true;
                    results[2].push({ titre: 'Halo 3', texte: 'A faire', lien: '/jeux/halo3' });
                }
                if (i === 3 && valeur[i] === false) {
                    valeur[i] = true;
                    results[2].push({ titre: 'Halo 3 : ODST', texte: 'A faire', lien: '/jeux/halo3ODST' });
                }
                if (i === 4 && valeur[i] === false) {
                    valeur[i] = true;
                    results[2].push({ titre: 'Halo Reach', texte: 'A faire', lien: '/jeux/haloReach' });
                }
                if (i === 5 && valeur[i] === false) {
                    valeur[i] = true;
                    results[2].push({ titre: 'Halo 4', texte: 'A faire', lien: '/jeux/halo4' });
                }
                if (i === 6 && valeur[i] === false) {
                    valeur[i] = true;
                    results[2].push({ titre: 'Halo 5 : Guardians', texte: 'A faire', lien: '/jeux/halo5' });
                }
                if (i === 7 && valeur[i] === false) {
                    valeur[i] = true;
                    results[2].push({ titre: 'Halo Infinite', texte: 'A faire', lien: '/jeux/haloInfinite' });
                }
                if (i === 8 && valeur[i] === false) {
                    valeur[i] = true;
                    results[2].push({ titre: 'Halo Wars', texte: 'A faire', lien: '/jeux/haloWars' });
                }
                if (i === 9 && valeur[i] === false) {
                    valeur[i] = true;
                    results[2].push({ titre: 'Halo Wars 2', texte: 'A faire', lien: '/jeux/haloWars2' });
                }
                if (i === 10 && valeur[i] === false) {
                    valeur[i] = true;
                    results[2].push({ titre: 'Histoires des jeux', texte: 'A faire', lien: '/jeux' });
                }
            }
        }
        i++;
    }

    Promise.all(promises)
        .then(() => {
            results = deleteDuplicate(results);
            res.render('search.ejs', { results });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Erreur serveur');
        });
}

function deleteDuplicate(tableau) {
    const nouveauTableau = [];
    let elementsUniques = new Set();

    for (var i = 0; i < tableau.length; i++) {
        var sousTableau = tableau[i];
        var sousTableauSansDoublons = [];

        for (var j = 0; j < sousTableau.length; j++) {
            var element = sousTableau[j];
            var elementStr = JSON.stringify(element);

            if (!elementsUniques.has(elementStr)) {
                elementsUniques.add(elementStr);
                sousTableauSansDoublons.push(element);
            }
        }

        nouveauTableau.push(sousTableauSansDoublons);
    }

    return nouveauTableau;
}
