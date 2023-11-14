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
import { addArticle } from "./controllers/crud/add/addArticle.js";
import { addSection } from "./controllers/crud/add/addSection.js";
import { deleteArticle, deleteSection } from "./controllers/crud/delete/deleteArticle.js";

//Pages
//Accueil
import Accueil from "./controllers/Accueil/index.js";

//Connexion
import { loginForm, login } from "./controllers/Profil/crud/loginPage.js";

//Profil
import Profil from "./controllers/Profil/profil.js";
import { listUsers, listUsersRole, searchMember} from "./controllers/Profil/listUsers.js";
import Deconnexion from "./controllers/Profil/logout.js";

//Jeux
import { jeux, halo1, halo2, halo3, halo3ODST, haloReach, halo4, halo5, haloInfinite, haloWars, haloWars2 } from "./controllers/Jeux/jeux.js";

//Forum
import Forum from "./controllers/Forum/forum.js";
import Salon from "./controllers/Forum/salon.js";

//News
import { news, article } from "./controllers/News/news.js";

//Shop
import Shop from "./controllers/Shop/shop.js";

//Recherche
import { search, searchResult }  from "./controllers/Search/search.js";

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
    res.locals.imageProfil = req.session.imageProfil;
    next();
});


//CRUD
// Ajout
router.post('/registerRole', checkAdmin, registerRole);
router.post('/register', register);
router.post('/addSalon', addSalon);
router.post('/addMessage/:id', addMessage);
router.post('/addArticle', addArticle);
router.post('/news/:id/addSection', addSection);


// Connexion
router.post('/login', login);

// Delete
router.post('/deleteUsersList',checkAdmin, deleteUsersList);
router.get('/deleteUser', deleteUser);
router.post('/deleteSalon', deleteSalon);
router.post('/deleteMessage/:id', deleteMessage);
router.post('/deleteArticle', deleteArticle);
router.post('/deleteSection/:id', deleteSection);

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
router.get('/listUsersRole', listUsersRole);
router.get('/listUsers', checkAdmin, listUsers);
router.post('/searchMember', searchMember);


// Jeux
router.get('/jeux', jeux);
router.get('/jeux/halo1', halo1);
router.get('/jeux/halo2', halo2);
router.get('/jeux/halo3', halo3);
router.get('/jeux/halo3ODST', halo3ODST);
router.get('/jeux/haloReach', haloReach);
router.get('/jeux/halo4', halo4);
router.get('/jeux/halo5', halo5);
router.get('/jeux/haloInfinite', haloInfinite);
router.get('/jeux/haloWars', haloWars);
router.get('/jeux/haloWars2', haloWars2);

// Forum
router.get('/forum', Forum);
router.get('/forum/:id', Salon);

// News
router.get('/news', news);
router.get('/news/:id', article); 

// Shop
router.get('/shop', Shop);
/* router.get('/shop/:id', Produit); */

// Recherche
router.get('/search', search);
router.post('/searchResult', searchResult);

export default router;
