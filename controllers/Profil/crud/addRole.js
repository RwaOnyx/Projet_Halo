import query from '../../../database.js';
import bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import xss from 'xss';

export default (req, res) => {
    
    const login = xss(req.body.login)
    const email = xss(req.body.email)
    const role = xss(req.body.role)
    const password = req.body.password
    
    bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
        console.error('Erreur de hachage :', err);
    } else {
        console.log('Mot de passe haché :', hash);
    }
    
    const id=v4()
    
    query(
        `INSERT INTO Users (id, login, email, password, role) VALUES (?, ?, ?, ?, ?);`,
        [ id,login,email,hash,role ],
        (error, result) => {
            if (error) {
                console.error(`Erreur lors de l'exécution de la requête ${error}`);
                res.status(500).send('Erreur serveur');
                return;
            }
            res.redirect("listUsersRole" /*, { message : "Nouveau responsable créer" }*/)  
        })
        
        }
    );
}
