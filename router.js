import express from "express";

const router = express.Router();

//CRUD
import { register,registerUsers, registerRole } from "./controllers/crud/add/addUser.js";
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

//Infos légales
import { infos, mentionsLegales, conditionsUtilisation, politiqueConfidentialite, FAQ }  from "./controllers/infosLegales.js";

const checkIsLogged = (req, res, next) => {
    if (req.session.isLogged === true) {
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

const checkModerateur = (req, res, next) => {
    if (req.session.role === 'superadmin' || req.session.role === 'admin' || req.session.role === 'moderateur') {
        next();
        return;
    }
    res.redirect("/forum");
    return;
};

const checkRedacteur = (req, res, next) => {
    if (req.session.role === 'superadmin' || req.session.role === 'admin' || req.session.role === 'redacteur') {
        next();
        return;
    }
    res.redirect("/news");
    return;
};

router.use((req, res, next) => {
    res.locals.isLogged = req.session.isLogged;
    res.locals.role = req.session.role;
    res.locals.idUser = req.session.idUser;
    res.locals.imageProfil = req.session.imageProfil;
    res.locals.grade = req.session.grade
    res.locals.message1 = req.session.message1
    res.locals.message2 = req.session.message2
    next();
});


//CRUD
// Ajout
router.post('/registerRole', checkAdmin, registerRole);
router.post('/registerUsers', checkAdmin, registerUsers);
router.post('/register', register);
router.post('/addSalon', checkIsLogged, addSalon);
router.post('/addMessage/:id', checkIsLogged, addMessage);
router.post('/addArticle', checkRedacteur, addArticle);
router.post('/news/:id/addSection', checkRedacteur, addSection);


// Connexion
router.post('/login', login);

// Delete
router.post('/deleteUsersList',checkAdmin, deleteUsersList);
router.get('/deleteUser', deleteUser);
router.post('/deleteSalon',checkModerateur, deleteSalon);
router.post('/deleteMessage/:id',checkModerateur, deleteMessage);
router.post('/deleteArticle',checkRedacteur, deleteArticle);
router.post('/deleteSection/:id',checkRedacteur, deleteSection);

// Update
router.post('/updateUser', checkIsLogged,updateUser);
router.post('/updateSalon',checkModerateur, updateSalon);
router.post('/updateMessage',checkModerateur, updateMessage);

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
router.post('/searchMember',checkAdmin, searchMember);


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

// Infos Légales
router.get('/infos', infos);
router.get('/infos/mentionsLegales', mentionsLegales);
router.get('/infos/conditionsUtilisation', conditionsUtilisation);
router.get('/infos/politiqueConfidentialite', politiqueConfidentialite);
router.get('/infos/FAQ', FAQ);

export default router;
