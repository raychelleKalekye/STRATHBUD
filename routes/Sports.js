const express = require('express');
const connection = require('../database');
const router = express.Router();
const multer=require('multer');
const upload=multer({dest:'./public/imgs'});

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
