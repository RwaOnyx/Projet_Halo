import query from '../../database.js'
import { DateTime } from "luxon"; 

export default (req, res) => {
    
    query(`SELECT email, date, role, image FROM Users WHERE login = ?`, req.session.pseudo , (error, profil) => {
    if (error) {
        console.error(`Erreur lors de l'exécution de la requête ${error}`);
        res.status(500).send('Erreur serveur');
        return;
    }
    profil.push(req.session.pseudo)
    const dateISO = (profil[0].date).toISOString();
    const dateLuxon = DateTime.fromISO(dateISO);
    profil[0].date = dateLuxon.toFormat('dd/LL/yyyy');
    
    console.log(profil[1])
    
    res.render('profil.ejs', { profil });
});
}