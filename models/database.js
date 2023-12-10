const mysql2 = require('mysql2/promise')

let pool = mysql2.createPool({
    connectionLimit: 10000,
    host: "localhost",// on rentre l'hôte, l'adresse url où se trouve la bdd
    port: 3001 ,//  port sur le quel est la bddd
    user: "root", // identifiant BDD
    password: "l4lc00lc2l34u", // le password
    database: "crazy_poppies_shop", // nom de la base de donnée
});

module.exports = pool