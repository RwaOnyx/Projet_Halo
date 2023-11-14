import query from '../../database.js'
import { DateTime } from "luxon"; 
import xss from 'xss';

export function listUsers (req, res){
    
    query(`SELECT id, login, email, date, role, image FROM Users WHERE role = ?`, "utilisateur" , (error, listUsers) => {
    if (error) {
        console.error(`Erreur lors de l'exécution de la requête ${error}`);
        res.status(500).send('Erreur serveur');
        return;
    }
    for (const user of listUsers){
        const dateISO = (user.date).toISOString();
        const dateLuxon = DateTime.fromISO(dateISO);
        user.date = dateLuxon.toFormat('dd/LL/yyyy');
    }
    
    const rolebool=false
    
    res.render('listUsers.ejs', { listUsers , rolebool });
});
}

export function listUsersRole (req, res){
    
    query(`SELECT id, login, email, date, role, image FROM Users WHERE role <> ?`, "utilisateur" , (error, listUsers) => {
    if (error) {
        console.error(`Erreur lors de l'exécution de la requête ${error}`);
        res.status(500).send('Erreur serveur');
        return;
    }
    
    for (const user of listUsers){
        const dateISO = (user.date).toISOString();
        const dateLuxon = DateTime.fromISO(dateISO);
        user.date = dateLuxon.toFormat('dd/LL/yyyy');
    }
    
    const rolebool=true
    res.render('listUsers.ejs', { listUsers,rolebool });
});
}

export function searchMember (req, res){
    let search = xss(req.body.searchMember);
    search = "%" + search + "%";
    console.log('recherche :' ,search)
    query(`SELECT id, login, email, date, role, image FROM Users WHERE login LIKE ? OR email LIKE ?`, [search,search] , (error, listUsers) => {
    if (error) {
        console.error(`Erreur lors de l'exécution de la requête ${error}`);
        res.status(500).send('Erreur serveur');
        return;
    }
    
    for (const user of listUsers){
        const dateISO = (user.date).toISOString();
        const dateLuxon = DateTime.fromISO(dateISO);
        user.date = dateLuxon.toFormat('dd/LL/yyyy');
    }
    
    console.log('resultat :' ,listUsers)
    
    const rolebool=true
    res.render('listUsers.ejs', { listUsers,rolebool });
});
}