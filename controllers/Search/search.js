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
                    results[2].push({ titre: 'Halo 1 : Combat Evolved', texte: "Le jeux qui a révolutionné le monde du jeu vidéo en 2001 en introduisant les joueurs dans l'univers épique du Master Chief, un super-soldat Spartan, luttant contre les redoutables Covenants. Avec une histoire captivante, des graphismes novateurs et un mode multijoueur révolutionnaire, Halo 1 a établi les normes pour les jeux de tir à la première personne.", lien: '/jeux/halo1' });
                }
                if (i === 1 && valeur[i] === false) {
                    valeur[i] = true;
                    results[2].push({ titre: 'Halo 2', texte: "La poursuite de l'épopée du Master Chief en 2004, introduisant des éléments de gameplay améliorés, des graphismes impressionnants, et une narration immersive. Le jeu a également marqué l'histoire du multijoueur en ligne avec son système Xbox Live novateur, offrant aux joueurs une expérience compétitive sans précédent.", lien: '/jeux/halo2' });
                }
                if (i === 2 && valeur[i] === false) {
                    valeur[i] = true;
                    results[2].push({ titre: 'Halo 3', texte: "La conclusion de la trilogie en 2007 avec une campagne épique, résolvant les mystères entourant les Covenants et les Anneaux Halo. Le multijoueur a atteint de nouveaux sommets avec des cartes emblématiques et des modes de jeu variés, laissant une marque indélébile dans l'histoire des jeux en ligne.", lien: '/jeux/halo3' });
                }
                if (i === 3 && valeur[i] === false) {
                    valeur[i] = true;
                    results[2].push({ titre: 'Halo 3 : ODST', texte: "Ce jeu apporte une perspective différente à l'univers de Halo en 2009, mettant en scène des soldats d'élite de l'ODST luttant pour survivre dans une Nouvelle Mombasa dévastée. Le jeu a été salué pour son ambiance immersive et son récit émotionnellement puissant.", lien: '/jeux/halo3ODST' });
                }
                if (i === 4 && valeur[i] === false) {
                    valeur[i] = true;
                    results[2].push({ titre: 'Halo Reach', texte: "Ce jeu plonge les joueurs dans le passé de l'univers de Halo en 2010, racontant le tragique récit des Spartans de Noble Team défendant la planète Reach contre l'invasion Covenante. Avec des graphismes améliorés et un mode Forge étendu, Reach a consolidé sa place en tant que l'un des épisodes les plus appréciés.", lien: '/jeux/haloReach' });
                }
                if (i === 5 && valeur[i] === false) {
                    valeur[i] = true;
                    results[2].push({ titre: 'Halo 4', texte: "Il marque le début d'une nouvelle trilogie en 2012, introduisant des ennemis redoutables et approfondissant l'histoire du Master Chief. Avec des graphismes époustouflants et une narration émotionnelle, le jeu a élargi l'univers de Halo tout en préservant l'essence qui a fait la renommée de la série.", lien: '/jeux/halo4' });
                }
                if (i === 6 && valeur[i] === false) {
                    valeur[i] = true;
                    results[2].push({ titre: 'Halo 5 : Guardians', texte: "Ce jeu a pris une direction audacieuse en 2015, mettant en scène une chasse intense du Master Chief par un nouvel escadron Spartan. Avec un gameplay innovant et des graphismes de pointe, le jeu a suscité des débats parmi les fans, mais a néanmoins ajouté de nouvelles dimensions à l'histoire de Halo.", lien: '/jeux/halo5' });
                }
                if (i === 7 && valeur[i] === false) {
                    valeur[i] = true;
                    results[2].push({ titre: 'Halo Infinite', texte: "Sorti en 2021, il ramene le Master Chief sur le devant de la scène avec un monde ouvert épique et une histoire captivante. Les améliorations visuelles, le retour du grappin, et le mode multijoueur gratuit ont réjoui les fans, marquant le début d'une nouvelle ère pour la franchise.", lien: '/jeux/haloInfinite' });
                }
                if (i === 8 && valeur[i] === false) {
                    valeur[i] = true;
                    results[2].push({ titre: 'Halo Wars', texte: "Lancé en 2009, le jeu a marqué l'entrée de la franchise Halo dans le genre de la stratégie en temps réel. Développé par Ensemble Studios, il a offert une expérience captivante avec des graphismes époustouflants, une narration immersive et un gameplay adapté aux consoles.", lien: '/jeux/haloWars' });
                }
                if (i === 9 && valeur[i] === false) {
                    valeur[i] = true;
                    results[2].push({ titre: 'Halo Wars 2', texte: "Sorti en 2017, il étend l'univers de Halo dans le genre de la stratégie en temps réel. Développé par 343 Industries et Creative Assembly, le jeu offre des graphismes améliorés, une intrigue captivante, et une expérience de stratégie innovante sur console. Avec son mode multijoueur, il diversifie la franchise au-delà des jeux de tir à la première personne.", lien: '/jeux/haloWars2' });
                }
                if (i === 10 && valeur[i] === false) {
                    valeur[i] = true;
                    results[2].push({ titre: 'Histoires des jeux', texte: "La saga Halo narre l'épopée du Master Chief et des Spartans dans une guerre interstellaire contre les Covenants et les Anneaux Halo. Lancée en 2001, elle évolue à travers plusieurs titres, explorant un univers vaste et épique. Chaque jeu ajoute sa propre dimension à cette histoire légendaire, alliant science-fiction, action, et une narration immersive.", lien: '/jeux' });
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
