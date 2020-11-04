// Libraries
const express = require('express');
const handlebars = require('express-handlebars');
const mysql = require('mysql2/promise');

// Configuring environment
const PORT = parseInt(process.argv[2] || process.env.PORT) || 3000;

// Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME || 'playstore',
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 4,
    timezone: '+08:00'
});

// Instances
const app = express();

// Configure express
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/static'));

// Configure Handlebars
app.engine('hbs', handlebars({
    defaultLayout: 'default.hbs'
}));
app.set('view engine', 'hbs');

// Application
app.use('/v1', router);

// Connection pool and server start
pool.getConnection()
    .then(conn => {
        console.log('Pinging database');
        const p0 = Promise.resolve(conn);
        const p1 = conn.ping()
        return Promise.all([p0, p1])
    })
    .then(() => { // this then is now an array of the previous (ie. [p0, p1])
        const conn = results[0] // takes resolved p0 (Promise.resolve())
        // release the connection
        this.release();
        // start the server
        app.listen(PORT, () => {
                console.log(`Application started on port ${PORT} at $new Date()`);
            })
            .catch(e => {
                console.error('');
            })

    })