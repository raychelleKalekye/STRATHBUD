const express=require('express')
const connection=require('../database')
const router=express.Router()
router.get('/',(req,res)=>{
    var query="SELECT * from locations";
    connection.query(query,function(error,data){
        if(error){
            console.error(error)
        }else{
            res.render('Location', { title: 'StrathBud Locations', action: 'list', locsData: data });
        }
    })
})
router.get('/newLocation', (req, res) => {
    res.render('Location', { title: 'StrathBud Locations', action: 'add' });
});

router.post('/newLocation', (req, res) => {
    var location = req.body.Location;
    
    var query = `INSERT INTO locations(Location) VALUES(?)`;
    connection.query(query, [location], function(error, results) {
        if (error) {
            console.error(error);
            
        } else {
            res.send("<p>Location added</p>");
        }
    });
});

module.exports=router;