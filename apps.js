// Load Express

const express = require('express');

const router = express.Router();

// SQL Queries
const SQL_GET_APP_CATEGORIES = 'select distinct(categories) from apps';
const SQL_GET_APPS = 'select app_id, name from apps limit ? offset ?';

// Application

const r = function(p) {

  const pool = p;

    router.get('/', async (req, res) => {
        const conn = await pool.getConnection()

        try {
            const results = await conn.query(SQL_GET_APPS, [20, 0]);
            const recs = results[0];

            if (recs.length <= 0) {
                res.status(200);
                res.type('text/html');
                res.render('index', );
            } else {

            }

        } catch (e) {
            res.status(500);
            res.type('text/html');
            res.send(JSON.stringify(e))
        } finally {
            conn.release();
        }
    })

    router.get('/category', async (req, res) => {
        const conn = await pool.getConnection()

        try {
            const results = await conn.query(SQL_GET_APP_CATEGORIES);
            const cats = results[0].map(v => v.category);
            console.log('cats: ', cats);

            res.status(200);
            res.type('text/html');
            res.render('index', {
                category: cats
            });

        } catch (e) {
            res.status(500);
            res.type('text/html');
            res.send(JSON.stringify(e))
        } finally {
            conn.release();
        }
    })
    return (router);
}

