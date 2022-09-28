const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

var app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crud_api',
    multipleStatements: true

});

mysqlConnection.connect((err) => {
    if (err) {
        console.log('Connection Failed');
    } else {
        console.log('Connected Successfully');
    }
});


app.listen('3000', () => {
    console.log('Express Running on Port 3000');
});

app.post('/worker', (req, res) => {
    mysqlConnection.query('INSERT INTO  workers(person, age) VALUES(?,?)', [req.body.person, req.body.age], (err, response) => {
        if (!err) {
            res.send('Worker Entered');

        } else {
            throw err;
        }
    });

});

app.get('/workers', (req, res) => {
    mysqlConnection.query('SELECT * FROM workers', (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            throw err;
        }
    })

})

app.get('/worker/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM workers WHERE id=?', [req.params.id], (err, response) => {
        if (!err) {
            res.send(response);
        } else {
            throw err;
        }
    });

});

app.delete('/worker/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM workers WHERE id=?', [req.params.id], (err, response) => {
        if (!err) {
            res.send(`${req.params.id} Deleted SUccessfully`);
        } else {
            throw err;
        }
    });
});

app.put('/worker/:id', (req, res) => {
    mysqlConnection.query('UPDATE workers SET ? WHERE id=?', [req.body, req.params.id], (err, rows, fields) => {
        if (!err) {
            res.send('Updated Successfully');
        } else {
            throw err;
        }
    })
})