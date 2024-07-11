const express = require('express');
const connection = require('../database');
const router = express.Router();
const multer=require('multer');
const upload=multer({dest:'./public/imgs'});
router.get('',(req,res)=>{
    res.render('amenitiesMenu')
})
router.get('/Shops',(req,res)=>{
    var query = "SELECT * FROM shops";
    connection.query(query, function(error, data) {
        if (error) {
            console.error(error);
        } else {
            res.render('Shops', { title: 'StrathBud Shops', action: 'list', shopsData: data });
        }
    });
})

router.get('/Shops/newShop', (req, res) => {
    res.render('Shops', { title: 'StrathBud Shops', action: 'add' });
});
router.post('/Shops/newShop', (req, res) => {
    var shopNo = req.body.shopNo;
    var shopName = req.body.shopName;
    var servicesOffered = req.body.servicesOffered;
    var Location = req.body.Location;

    var query = `INSERT INTO shops (shopNo, shopName,servicesOffered, Location) VALUES (?, ?, ?, ?)`;

    connection.query(query, [shopNo, shopName,servicesOffered, Location], function (error, results) {
        if (error) {
            console.error(error);
            return res.status(500).send("Error adding shop");
        } else {
            res.send('<p>SHOP ADDED SUCCESSFULLY</p>');
        }
    });
});

router.get('/Shops/:shopNo', (req, res) => {
    const shopNo = req.params.shopNo;
    const query = "SELECT * FROM shops WHERE shopNo = ?";
    connection.query(query, [shopNo], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Server error');
        } else if (results.length === 0) {
            res.status(404).send('Shop not found');
        } else {
            const shopsData = results[0];
            console.log('Shop Data:', shopsData);  
            res.render('shopDetails', { shopsData });
        }
    });
});
router.get('/Restaurants',(req,res)=>{
    var query = "SELECT * FROM restaurants";
    connection.query(query, function(error, data) {
        if (error) {
            console.error(error);
        } else {
            res.render('Restaurants', { title: 'StrathBud Restaurants', action: 'list', restaurantData: data });
        }
    });
})


router.get('/Restaurant/newRestaurant',(req,res)=>{
    res.render('Restaurants', { title: 'StrathBud Restaurants', action: 'add'});
})
router.post('/Restaurant/newRestaurant', upload.single('menu'), (req, res) => {
    console.log('File upload:', req.file); 

    var restaurantNo = req.body.restaurantNo;
    var restaurantName = req.body.restName;
    var offers = req.body.offers;
    var Location = req.body.Location;
    var menu;

    if (req.file) {
        menu = req.file.buffer.toString('base64'); 
    } else {
        console.error("No image file uploaded");
        res.status(400).send("No image file uploaded");
        return;
    }

    var query = `INSERT INTO restaurants/ (restaurantNo, restName,offers, Location,menu) VALUES (?, ?, ?, ?, ?, ?)`;
    connection.query(query, [restaurantNo, restaurantName, offers, Location,menu], function(error, results) {
        if (error) {
            console.error(error);
            res.status(500).send("Error adding Restaurant");
        } else {
            res.send('<p>RESTAURANT ADDED SUCCESSFULLY</p>');
        }
    });
});

router.get('/:restauranttNo', (req, res) => {
    const restaurantNo = req.params.restaurantNo;
    const query = "SELECT * FROM restaurants WHERE restaurantNo = ?";
    connection.query(query, [restaurantNo], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Server error');
        } else if (results.length === 0) {
            res.status(404).send('Event not found');
        } else {
            const restaurantData = results[0];
            console.log('Restaurant Data:', restaurantData); 
            res.render('restaurantDetails', { restaurantData });
        }
    });
    
});

module.exports=router;