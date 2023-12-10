import query from '../../../database.js';
import bcrypt from 'bcrypt';
import xss from 'xss';

/* ================= Redirection vers formulaire ================= */

export function loginForm(req, res) {
    res.render('login.ejs');
};

/* ================= Gestion de la connexion ================= */

export function login(req, res) {
    const identifiant = xss(req.body.identifiant);
    const password = req.body.password;


    query(
        `SELECT id,login,password,role,image FROM Users WHERE login = ? OR email = ?;`, [identifiant, identifiant],
        (error, resultSQL) => {
            if (error) {
                console.error(`Erreur lors de l'exécution de la requête ${error}`);
                res.status(500).send('Erreur serveur');
                return;
            }

            if (!resultSQL.length) {
                res.render(
                    'login.ejs', { message: 'Identifiant ou mot de passe incorrect' }
                );
                return;
            }

            bcrypt.compare(password, resultSQL[0].password, (error, resultPassword) => {
                console.log("passage mdp !")
                if (resultPassword === false) {
                    console.log("passage mdp !")
                    res.render(
                        'login.ejs', { message: 'Identifiant ou mot de passe incorrect' }
                    );
                    return;
                }

                req.session.login = resultSQL[0].login;
                req.session.idUser = resultSQL[0].id;
                req.session.isLogged = true;
                req.session.imageProfil = resultSQL[0].image;
                switch (resultSQL[0].role) {
                    case 'superadmin':
                        req.session.role = "superadmin";
                        req.session.grade = 'Bienvenue Major !'
                        break;
                    case 'admin':
                        req.session.role = "admin";
                        req.session.grade = 'Bienvenue Capitaine ' + resultSQL[0].login + ' !'
                        break;
                     case 'moderateur':
                        req.session.role = "moderateur";
                        req.session.grade = 'Bienvenue ODST ' + resultSQL[0].login + ' !'
                        break;
                    case 'productmanager':
                        req.session.role = "productmanager";
                        req.session.grade = 'Bienvenue Sergent ' + resultSQL[0].login + ' !'
                        break;
                    case 'redacteur':
                        req.session.role = "redacteur";
                        req.session.grade = 'Bienvenue Lieutenant ' + resultSQL[0].login + ' !'
                        break;
                    default:
                        req.session.role = "user";
                        req.session.grade = 'Bienvenue marine ' + resultSQL[0].login + ' !'
                        break;
                }
                res.redirect('/')
            })

        }
    );
}