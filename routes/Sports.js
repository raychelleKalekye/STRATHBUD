const express = require('express');
const connection = require('../database');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', (req, res) => {
    var query = "SELECT * FROM sports";
    connection.query(query, function(error, data) {
        if (error) {
            console.error(error);
        } else {
            res.render('Sports', { title: 'StrathBud Sports', action: 'list', sportsData: data });
        }
    });
});

router.get('/newSport', (req, res) => {
    res.render('Sports', { title: 'StrathBud Sports', action: 'add' });
});
router.post('/newSport', (req, res) => {
    var sportsNo = req.body.sportsNo;
    var sportsName = req.body.sportsName;
    var sportsLeader = req.body.sportsLeader;
    var practiceDays = req.body.practiceDays;
    var registrationLink = req.body.Registration_link;
    var Location = req.body.Location;

    var query = `INSERT INTO sports (sportsNo, sportsName, sportsLeader, practiceDays, Registration_link, Location) VALUES (?, ?, ?, ?, ?, ?)`;

    connection.query(query, [sportsNo, sportsName, sportsLeader, practiceDays, registrationLink, Location], function (error, results) {
        if (error) {
            console.error(error);
            return res.status(500).send("Error adding sports");
        } else {
            res.send('<p>SPORT ADDED SUCCESSFULLY</p>');
        }
    });
});







router.get('/:sportsNo', (req, res) => {
    const sportsNo = req.params.sportsNo;
    const query = "SELECT * FROM sports WHERE sportsNo = ?";
    connection.query(query, [sportsNo], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Server error');
        } else if (results.length === 0) {
            res.status(404).send('Sport not found');
        } else {
            const sportsData = results[0];
            console.log('Sports Data:', sportsData);  
            res.render('sportsDetails', { sportsData });
        }
    });
});

module.exports = router;
