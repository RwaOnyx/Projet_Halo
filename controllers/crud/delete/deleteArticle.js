import query from '../../../database.js';
import fs from 'fs';
import path from 'path';

export function deleteArticle(req, res) {
    
    deleteImageNewsArticle( req.body.id, () => {
            query(
        `DELETE FROM News WHERE id = ?;`,
        req.body.id,
        (error, resultSQL) => {
            if (error) {
                console.error(`Erreur lors de l'exécution de la requête ${error}`);
                res.status(500).send('Erreur serveur');
                return;
            }
            res.redirect("/news"/* , { message: "blabla" }*/);
        }
    )
        });
    
    
    
}


function deleteImageNewsArticle(id, callback) {
    query(`SELECT image FROM TexteNews WHERE idNews = ?;`, id , (error, sections) => {
        if (error) {
            console.error(`Erreur lors de la récuperation de l'image ${error}`);
            console.log('Erreur serveur');
        }
        query(`SELECT image FROM News WHERE id = ?;`, id , (error, article) => {
        if (error) {
            console.error(`Erreur lors de la récuperation de l'image ${error}`);
            console.log('Erreur serveur');
        }
        if (sections){
            sections.push(article[0])
        } else {
            sections=article
        }
        
        for (const section of sections){
            const chemin = path.join('public/images/news/', section.image); // Chemin complet du fichier à supprimer
            fs.unlink(chemin, (error) => {
                if (error) {
                    console.error(`Erreur lors de la suppression de l'image : ${error}`);
                    // Gérez l'erreur, par exemple, en renvoyant une réponse d'erreur au client.
                }
                else {
                    console.log('Image supprimée avec succès.');
                    // Fournissez une réponse indiquant que l'image a été supprimée avec succès.
                }

                
            });
        }
        
        
        
        if (callback) {
                    callback();
                }
    });
    });
}

export function deleteSection(req, res) {
    const { id } = req.params;
    deleteImageNews( req.body.id, () => {
            query(
        `DELETE FROM TexteNews WHERE id = ?;`,
        req.body.id,
        (error, resultSQL) => {
            if (error) {
                console.error(`Erreur lors de l'exécution de la requête ${error}`);
                res.status(500).send('Erreur serveur');
                return;
            }
            const redirection="/news/"+id
            res.redirect(redirection/* , { message: "blabla" }*/);
        }
    )
        });
    
    
    
}


function deleteImageNews(id, callback) {
    query(`SELECT image FROM TexteNews WHERE id = ?;`, id , (error, result) => {
        if (error) {
            console.error(`Erreur lors de la récuperation de l'image ${error}`);
            console.log('Erreur serveur');
        }
            const chemin = path.join('public/images/news/', result[0].image); // Chemin complet du fichier à supprimer
            fs.unlink(chemin, (error) => {
                if (error) {
                    console.error(`Erreur lors de la suppression de l'image : ${error}`);
                    // Gérez l'erreur, par exemple, en renvoyant une réponse d'erreur au client.
                }
                else {
                    console.log('Image supprimée avec succès.');
                    // Fournissez une réponse indiquant que l'image a été supprimée avec succès.
                }

                if (callback) {
                    callback();
                }
            });
    });
}