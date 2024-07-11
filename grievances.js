const express = require('express');
const connection = require('../database');
const router = express.Router();
const multer=require('multer');
const upload=multer({dest:'./public/imgs'});

router.get('/', (req, res) => {
    res.render('Grievances', { title: 'Students Grievances', action: 'add' });
});

router.post('/', (req, res) => {
    var grievanceNo=req.body.grievanceNo;
    var studentCouncilSector=req.body.studentCouncilSector;
    var grievance=req.body.Grievance;
    var admNo=req.body.admNo;

    var query = `INSERT INTO grievances (grievanceNo, studentCouncilSector, Grievance,admNo) VALUES (?, ?, ?, ?)`;

    connection.query(query, [grievanceNo, studentCouncilSector, grievance, admNo], function (error, results) {
        if (error) {
            console.error(error);
            return res.status(500).send("Error adding grievance");
        } else {
            res.send('<p>GRIEVANCE ADDED SUCCESSFULLY</p>');
        }
    });
});
router.get('/otherGrievances', (req, res) => {
    var query = "SELECT * FROM grievances";
    connection.query(query, function(error, data) {
        if (error) {
            console.error(error);
        } else {
            res.render('Grievances', { title: 'student Grievances', action: 'list', grievanceData: data });
        }
    });
});
router.get('/:grievanceNo', (req, res) => {
    const grievanceNo = req.params.grievanceNo;
    const query = "SELECT * FROM grievances WHERE grievanceNo = ?";
    connection.query(query, [grievanceNo], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Server error');
        } else if (results.length === 0) {
            res.status(404).send('Grievance not found');
        } else {
            const grievanceData = results[0];  
            console.log('Grievance Data:', grievanceData);  
            res.render('grievanceDetails', { grievanceData });
        }
    });
});

router.post('/:postId/like', (req, res) => {
    const postId = req.params.postId;
    const query = `UPDATE grievances SET likes = likes + 1 WHERE grievanceNo = ?`;

    connection.query(query, [postId], function (error, results) {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error updating likes' });
        } else {
            res.json({ success: true });
        }
    });
});

router.post('/:postId/dislike', (req, res) => {
    const postId = req.params.postId;
    const query = `UPDATE grievances SET dislikes = dislikes + 1 WHERE grievanceNo = ?`;

    connection.query(query, [postId], function (error, results) {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error updating dislikes' });
        } else {
            res.json({ success: true });
        }
    });
});

module.exports=router;