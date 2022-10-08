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
    database: 'rainbow',
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

app.post('/user', (req, res) => {

    mysqlConnection.query('SELECT username FROM users WHERE username=?', [req.body.username], (err, results) => {
        if (err) {
            console.log(err);
            res.send(err);
        }
        if (results.length > 0) {
            res.send('Username already Exists');
        }
        mysqlConnection.query('INSERT INTO  users(person, username, age, position) VALUES(?,?,?,?)', [req.body.person, req.body.username, req.body.age, req.body.position], (err, response) => {
            if (!err) {
                res.send('User Entered Successfully');

            } else {
                throw err;
            }
        });
    });


});

app.get('/users', (req, res) => {
    mysqlConnection.query('SELECT * FROM users', (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            throw err;
        }
    })

})

app.get('/user/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM users WHERE id=?', [req.params.id], (err, response) => {
        if (!err) {
            res.send(response);
        } else {
            throw err;
        }
    });

});

app.delete('/user/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM users WHERE id=?', [req.params.id], (err, response) => {
        if (!err) {
            res.send(`${req.params.id} Deleted SUccessfully`);
        } else {
            throw err;
        }
    });
});

app.put('/user/:id', (req, res) => {
    mysqlConnection.query('UPDATE users SET ? WHERE id=?', [req.body, req.params.id], (err, rows, fields) => {
        if (!err) {
            res.send('Updated Successfully');
        } else {
            throw err;
        }
    })
})

app.post('/login', (req, res) => {})