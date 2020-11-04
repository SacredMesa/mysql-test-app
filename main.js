// Libraries
const express = require('express');
const handlebars = require('express-handlebars');
const mysql = require('mysql2/promise'); //MySQL Driver with promise support

// SQL
const SQL_FIND_BY_NAME = 'select * from apps where name like ? limit ?';
const SQL_FIND_BY_APP_ID = 'select * from apps where appid = ?';

const SQL_COUNT_Q = 'select count(*) '

// Configure environment
const PORT = parseInt(process.argv[2] || process.env.APP_PORT) || 3000;

// Database connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    database: process.env.DB_NAME || 'playstore',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 4,
    timezone: '+08:00'
});

// Start connection
const startApp = async (app, pool) => {

    try {
        // get connection from pool
        const conn = await pool.getConnection();

        console.log(`pinging database`);
        await conn.ping();

        // release connection
        conn.release();

        // start server
        app.listen(PORT, () => {
            console.log(`Application started on port ${PORT} at ${new Date}`);
        })
    } catch (e) {
        console.error(`Cannot ping database: `, e);
    }
}

// Instances
const app = express();

// Configure Express
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/static'));

// Configure Handlebars
app.engine('hbs', handlebars({
    defaultLayout: 'default.hbs'
}));
app.set('view engine', 'hbs');

// Application
app.get('/', (req, res) => {
    res.status(200);
    res.type('text/html');
    res.render('index');
})

app.get('/search', async (req, res) => {
    const db_search = req.query['db_search'];

    const conn = await pool.getConnection();

    try {
        // Count the number of results
        let result = await conn.query(SQL_COUNT_Q, [`%${q}`])
        const queryCount = result[0][0].q_count;

        // Perform the query
        result = await conn.query(SQL_FIND_BY_NAME, [`%${db_search}%`, 10]);
        const recs = result[0];
        
        console.log('recs = ', recs);

    } catch (e) {
        console.log(e);
        res.status(500);
        res.type('text/html');
        res.render('<h2>Error</h2>')
    } finally {
        // Release connection
        conn.release();
    }

    res.status(200);
    res.type('text/html');
    res.render('results', {
        result: recs,
        hasResult: recs.length > 0,
        q: q,
        prevOffset: Math.max(0, offset - limit),
        neztOffset: offset + limit
    })

})

app.post('/search', async (req, res) => {

})

startApp(app, pool);

//Start express
// app.listen(PORT, () => {
//     console.log(`Application started on port ${PORT} at ${new Date}`);
// })