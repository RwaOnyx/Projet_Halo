import dotenv from 'dotenv';
dotenv.config();
import mysql from 'mysql';

// Création du pool de connexion
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

/**
 * @param queryString Requête (Ex : INSERT INTO ...)
 * @param params      Paramètres de la requête (Ex: [1, 'toto', ...])
 * @param  callback    Fonction de retour appelée avec (error, result)
 */
 
export default (queryString, params, callback) => {
    // Récupération d'une connexion depuis le pool
    pool.getConnection((error, connection) => {
        if (error) {
            console.error(`Erreur de connexion à la base de données ${error}`);
            callback(error);
            return;
        }
        console.log('Connection réussie à la base de données');

        // Envoi de la requête à la BDD
        connection.query(
            queryString,
            params,
            (error, result) => {
                // Remise de la connexion dans le pool
                connection.release();
                callback(error, result);
            }
        );
    });
}
