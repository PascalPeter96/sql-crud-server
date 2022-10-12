const express = require('express');
const bcrypt = require('bcryptjs');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

var app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rainbow',
    multipleStatements: true

});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/JPG') {
        cb(null, true);
    } else {
        cb(Error('Unsupported File'), false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 20,
    },
    // fileFilter: fileFilter,
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

app.post('/register', upload.single('avatar'), (req, res) => {
    console.log(req.body);
    let person = req.body.person;
    let avatar = req.file;
    let username = req.body.username;

    let password = req.body.password;
    let age = req.body.age;
    let position = req.body.position;

    if (person && avatar && username && password && age && position) {
        mysqlConnection.query('SELECT username FROM users WHERE username=?', [req.body.username], (err, results) => {
            if (err) {
                throw err;
            }
            if (results.length > 0) {
                res.send('Username already Exists');
            } else {
                // var imgSrc = 'http://172.17.0.1:3000/uploads/' + req.file.filename;
                // console.log(imgSrc);
                // const salt = await bcrypt.genSalt(10);
                // var hashedPassword = await bcrypt.hash(req.body.password, 8);
                mysqlConnection.query('INSERT INTO  users(person, avatar, username, password, age, position) VALUES(?,?,?,?,?,?)', [req.body.person, req.file.filename, req.body.username, req.body.password, req.body.age, req.body.position], (error, response) => {
                    if (!error) {
                        res.send('User Entered Successfully');
                        console.log(response.body);
                    } else {
                        throw error;
                    }
                });
            }


        });
    } else {
        res.send('Please enter all details');
        res.end();
    }


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

app.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    // if (username && password) {
    //     console.log(username);
    //     console.log(password);
    // } else {
    //     console.log('No Logins');
    // }

    if (username && password) {
        // Execute SQL query that'll select the account from the database based on the specified username and password
        mysqlConnection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (error, results, fields) => {

            // If there is an issue with the query, output the error
            if (error) throw error;
            // If the account exists
            if (results.length > 0) {
                console.log(results);
                return res.status(200).json(results);

                // return results;

            } else {
                res.send('Incorrect Username and/or Password!');
            }
            // return results;
            res.end();
        });
    } else {
        res.send('Please enter Username and Password!');
        res.end();
    }

})

// app.post('/login', (req, res) => {
//     try {
//         const { username, password } = req.body;
//         if (!username || !password) {
//             res.send('Check username or password input');
//         } else {
//             mysqlConnection.query('SELECT * FROM users WHERE username=?', [username], (err, results) => {
//                 if (!results || !(results[0].password)) {
//                     res.send('Wrong credentials');
//                 } else {
//                     res.send('Logged In Successfully');
//                 }
//             });
//         }

//     } catch (error) {
//         console.log(error);
//         res.send(error);
//     }
// })