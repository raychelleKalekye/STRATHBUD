const express=require('express')
const connection=require('../database')
const router=express.Router()
const multer=require('multer');
const upload=multer({dest:'./public/imgs'});

router.get('/',(req,res)=>{
    var query="SELECT eventNo,eventName,description,eventDate FROM schevents ORDER BY eventDate";
    connection.query(query,function(error,data){
        if(error){
            console.error(error)
        }else{
            res.render('events', { title: 'StrathBud Events', action: 'list', eventsData: data });
        }
    })
    
})
router.get('/:eventNo', (req, res) => {
    const eventNo = req.params.eventNo;
    const query = "SELECT eventNo, eventName,poster, description, eventDate, Location FROM schevents WHERE eventNo = ?";
    connection.query(query, [eventNo], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Server error');
        } else if (results.length === 0) {
            res.status(404).send('Event not found');
        } else {
            const eventData = results[0];
            console.log('Event Data:', eventData);  // Log the event data to verify
            res.render('eventDetails', { eventData });
        }
    });
    
});



module.exports=router;