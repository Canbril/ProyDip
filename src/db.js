const {Pool} = require('pg')

const pool = new Pool({
    user: 'canbril',
    password: 'diplomado',
    host: 'localhost',
    port: '5432',
    database: 'dbdiplomado'
});

module.exports = pool;