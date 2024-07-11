const express = require('express');
const connection = require('../database');
const argon2 = require('argon2');
const router = express.Router();
const multer=require('multer');
const upload=multer({dest:'./public/imgs'});

router.get('/',(req,res)=>{

    res.render('index')
})
router.get('/About',(req,res)=>{
    res.render('about')
})
router.get('/Signup',(req,res)=>{
    res.render('Signup')
})

router.post('/Signup', async (req, res) => {
    const { AdmNo, fname, lname, password, confirm_Password } = req.body;
    
   
    if (password !== confirm_Password) {
        return res.status(400).send("<p>Passwords do not match</p>");
    }

    if (password.length < 8) {
        return res.status(400).send("<p>Password must be at least 8 characters long</p>");
    }

    if (!/[A-Z]/.test(password)) {
        return res.status(400).send("<p>Password must contain at least one uppercase letter</p>");
    }

    if (!/[0-9]/.test(password)) {
        return res.status(400).send("<p>Password must contain at least one digit</p>");
    }

    if (!/[!@#$%^&*]/.test(password)) {
        return res.status(400).send("<p>Password must contain at least one special character</p>");
    }

    try {
       
        const hashedPassword = await argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 2 ** 16, 
            timeCost: 5,       
            parallelism: 2,     
        });

        const query = `INSERT INTO students (AdmNo, fname, lname, password) VALUES (?, ?, ?, ?)`;
        connection.query(query, [AdmNo, fname, lname, hashedPassword], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).send("<p>Internal Server Error</p>");
            }
            res.render('Login'); 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("<p>Internal Server Error</p>");
    }
});


router.get('/Login', (req, res) => {
    res.render('Login');
});

router.post('/Login', async (req, res) => {
    console.log(req.sessionID);
    const AdmNo = req.body.AdmNo;
    const password = req.body.password;

    if (AdmNo && password) {
        if (req.session.authenticated) {
            return res.json(req.session);
        }
    }

    const query = `SELECT * FROM students WHERE AdmNo = ?`;
    connection.query(query, [AdmNo], async (error, results) => {
        if (error) {
            console.error(error);
            return res.render('Login', { error: 'An error occurred. Please try again later.' });
        }

        if (results.length === 0) {
            return res.render('Login', { error: 'Invalid admission number' });
        }

        const storedPassword = results[0].password;

        try {
            if (!await argon2.verify(storedPassword, password)) {
                return res.render('Login', { error: 'Incorrect password. Try again' });
            } else {
                req.session.authenticated = true;
                req.session.user = { AdmNo, password };
                res.render('mainMenu');
            }
        } catch (err) {
            console.error(err);
            return res.render('Login', { error: 'An error occurred. Please try again later.' });
        }
    });
});


router.get('/passwordReset',(req,res)=>{
     res.render('pasReset')
})
router.post('/passwordReset',(req,res)=>{
    var AdmNo=req.body.AdmNo;
    var query=`SELECT fname,lname FROM students WHERE AdmNo=? `;
    connection.query(query,[AdmNo],function(error,results){
        if(error){
            console.error(error);


        }else{
            res.render('pasRecovery')
        }
    })
})


router.post('/passwordRecovery', async (req, res) => {
    const { AdmNo, password } = req.body;

    if (password.length < 8) {
        return res.status(400).send("<p>Password too short</p>");
    }

    if (!/[A-Z]/.test(password)) {
        return res.status(400).send("<p>Password must contain at least one uppercase letter</p>");
    }

    if (!/[0-9]/.test(password)) {
        return res.status(400).send("<p>Password must contain at least one digit</p>");
    }

    if (!/[!@#$%^&*]/.test(password)) {
        return res.status(400).send("<p>Password must contain at least one special character</p>");
    }

    try {
      
        const hashedPassword = await argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 2 ** 16, 
            timeCost: 5,       
            parallelism: 2,     
        });

        const query = `UPDATE students SET password = ? WHERE AdmNo = ?`;
        connection.query(query, [hashedPassword, AdmNo], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).send("<p>Internal Server Error</p>");
            }

            if (results.affectedRows === 0) {
                return res.status(404).send("<p>Admission number not found</p>");
            }

            res.redirect('/Strathbud/Login');
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("<p>Internal Server Error</p>");
    }
});


module.exports=router;