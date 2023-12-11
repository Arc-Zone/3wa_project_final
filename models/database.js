const mysql2 = require('mysql2/promise')

let pool = mysql2.createPool({
    connectionLimit: 10000,
    host: "localhost",
    port: 3001 ,
    user: "root", 
    password: "", 
    database: "", 
});

module.exports = pool
