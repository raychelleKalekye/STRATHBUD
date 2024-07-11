const express = require('express');
const connection = require('../database');
const router = express.Router();
const multer=require('multer');
const upload=multer({dest:'./public/imgs'});

router.get('/', (req, res) => {
    var query = "SELECT * FROM clubsandsocieties";
    connection.query(query, function(error, data) {
        if (error) {
            console.error(error);
        } else {
            res.render('Clubs', { title: 'StrathBud CLUBS AND SOCIETIES', action: 'list', clubsData: data });
        }
    });
});

router.get('/newClub', (req, res) => {
    res.render('Clubs', { title: 'StrathBud Clubs', action: 'add' });
});
router.post('/newClub', (req, res) => {
    var clubNo = req.body.clubNo;
    var clubName = req.body.clubName;
    var clubLeader = req.body.clubLeader;
    var meetupDays = req.body.meetupDays;
    var description = req.body.description;
    var email=req.body.Email;
    var Location = req.body.Location;

    var query = `INSERT INTO clubsandsocieties (clubNo, clubName, clubLeader, meetupDays, description, Location,email) VALUES (?,?, ?, ?, ?, ?, ?)`;

    connection.query(query, [clubNo, clubName, clubLeader, meetupDays, description, Location,email], function (error, results) {
        if (error) {
            console.error(error);
            return res.status(500).send("Error adding club");
        } else {
            res.send('<p>CLUB ADDED SUCCESSFULLY</p>');
        }
    });
});

router.get('/:clubNo', (req, res) => {
    const clubNo = req.params.clubNo;
    const query = "SELECT * FROM clubsandsocieties WHERE clubNo = ?";
    connection.query(query, [clubNo], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Server error');
        } else if (results.length === 0) {
            res.status(404).send('Club not found');
        } else {
            const clubsData = results[0];
            console.log('Club Data:', clubsData);  
            res.render('clubDetails', { clubsData });
        }
    });
});

module.exports = router;



