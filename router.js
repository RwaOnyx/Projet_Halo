import express from "express";

const router = express.Router();

//CRUD
import { register, registerRole } from "./controllers/crud/add/addUser.js";
import { deleteUsersList, deleteUser } from "./controllers/crud/delete/deleteUser.js";
import { updateUser } from "./controllers/crud/update/updateUser.js";
import { addSalon } from "./controllers/crud/add/addSalon.js";
import { deleteSalon } from "./controllers/crud/delete/deleteSalon.js";
import { updateSalon } from "./controllers/crud/update/updateSalon.js";
import { addMessage } from "./controllers/crud/add/addMessage.js";
import { deleteMessage } from "./controllers/crud/delete/deleteMessage.js";
import { updateMessage } from "./controllers/crud/update/updateMessage.js";

//Pages
//Accueil
import Accueil from "./controllers/Accueil/index.js";

//Connexion
import { loginForm, login } from "./controllers/Profil/crud/loginPage.js";

//Profil
import Profil from "./controllers/Profil/profil.js";
import ListUsersRole from "./controllers/Profil/listUsersRole.js";
import ListUsers from "./controllers/Profil/listUsers.js";
import Deconnexion from "./controllers/Profil/logout.js";

//Jeux
import Jeux from "./controllers/Jeux/jeux.js";

//Forum
import Forum from "./controllers/Forum/forum.js";
import Salon from "./controllers/Forum/salon.js";

//News
import News from "./controllers/News/news.js";

//Shop
import Shop from "./controllers/Shop/shop.js";

const checkIsLogged = (req, res, next) => {
    if (req.session.isLogged === true) {
        next();
        return;
    }
    res.redirect("/login");
    return;
};

const checkSuperAdmin = (req, res, next) => {
    if (req.session.role === 'superadmin') {
        next();
        return;
    }
    res.redirect("/login");
    return;
};

const checkAdmin = (req, res, next) => {
    if (req.session.role === 'superadmin' || req.session.role === 'admin') {
        next();
        return;
    }
    res.redirect("/login");
    return;
};

router.use((req, res, next) => {
    res.locals.isLogged = req.session.isLogged;
    res.locals.role = req.session.role;
    res.locals.idUser = req.session.idUser;
    res.locals.page = req.session.page;
    next();
});


//CRUD
// Ajout
router.post('/registerRole', checkAdmin, registerRole);
router.post('/register', register);
router.post('/addSalon', addSalon);
router.post('/addMessage/:id', addMessage);

// Connexion
router.post('/login', login);

// Delete
router.post('/deleteUsersList',checkAdmin, deleteUsersList);
router.get('/deleteUser', deleteUser);
router.post('/deleteSalon', deleteSalon);
router.post('/deleteMessage/:id', deleteMessage);

// Update
router.post('/updateUser', checkIsLogged,updateUser);
router.post('/updateSalon', updateSalon);
router.post('/updateMessage', updateMessage);

//PAGES
// Accueil
router.get('/', Accueil);

// Connexion
router.get('/login', loginForm);
router.get('/logout', checkIsLogged, Deconnexion);

// Profil
router.get('/profil', checkIsLogged, Profil);
router.get('/listUsersRole', ListUsersRole);
router.get('/listUsers', checkAdmin, ListUsers);

// Jeux
router.get('/jeux', Jeux);
/* router.get('/jeux/:id', Jeu); */

// Forum
router.get('/forum', Forum);
router.get('/forum/:id', Salon);

// News
router.get('/news', News);
/* router.get('/news/:id', Article);  */

// Shop
router.get('/shop', Shop);
/* router.get('/shop/:id', Produit); */



export default router;
