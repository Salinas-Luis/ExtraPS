const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'luis2008', 
    database: 'brillo'
});

module.exports = pool;