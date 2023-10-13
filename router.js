import express from "express";
import formidable from 'formidable';
import bcrypt from 'bcrypt';
import xss from 'xss';
import path from 'path';
import fs from 'fs';
import query from './database.js'

const router = express.Router();

//CRUD
import { register, registerRole } from "./controllers/crud/add/addUser.js";
import { deleteUsersList, deleteUser } from "./controllers/crud/delete/deleteUser.js";
import { updateUser } from "./controllers/crud/add/updateUser.js";

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
    next();
});

router.use((req, res, next) => {
    res.locals.role = req.session.role;
    next();
});

router.get('/', Accueil);
router.get('/login', loginForm);
router.post('/login', login);
router.post('/register', register);
router.post('/registerRole', registerRole);
router.get('/profil', checkIsLogged, Profil);
router.get('/listUsersRole', checkAdmin, ListUsersRole);
router.post('/listUsersRole', checkAdmin);
router.get('/listUsers', checkAdmin, ListUsers);
router.post('/deleteUsersList', deleteUsersList);
router.get('/deleteUser', deleteUser);
router.get('/logout', Deconnexion);


router.get('/jeux', Jeux);
/* router.get('/jeux/:id', Jeu); */
router.get('/forum', Forum);
router.get('/forum/:id', Salon);
router.get('/news', News);
/* router.get('/news/:id', Article);  */
router.get('/shop', Shop);
/* router.get('/shop/:id', Produit); */


// Route pour mettre à jour les données du membre
router.post('/updateUser', updateUser);

export default router;
