import query from '../../database.js'
import { DateTime } from "luxon"; 

export default (req, res) => {
    
    query(`SELECT login, email, date, role, image FROM Users WHERE role <> ?`, "utilisateur" , (error, listUsersRole) => {
    if (error) {
        console.error(`Erreur lors de l'exécution de la requête ${error}`);
        res.status(500).send('Erreur serveur');
        return;
    }
    
    for (const user of listUsersRole){
        const dateISO = (user.date).toISOString();
        const dateLuxon = DateTime.fromISO(dateISO);
        user.date = dateLuxon.toFormat('dd/LL/yyyy');
    }
    req.session.page="role"
    res.render('listUsersRole.ejs', { listUsersRole });
});
}