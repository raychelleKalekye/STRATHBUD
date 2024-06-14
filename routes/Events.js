const express=require('express')
const connection=require('../database')
const router=express.Router()
const multer=require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
router.get('/newEvent',(req,res)=>{
    res.render('events', { title: 'StrathBud Events', action: 'add'});
})
router.post('/newEvent', upload.single('poster'), (req, res) => {
    console.log('File upload:', req.file); // Log the uploaded file

    var eventNo = req.body.eventNo;
    var eventName = req.body.eventName;
    var description = req.body.description;
    var eventDate = req.body.eventDate;
    var Location = req.body.Location;
    var poster;

    if (req.file) {
        poster = req.file.buffer.toString('base64'); // Convert file buffer to base64
    } else {
        console.error("No image file uploaded");
        res.status(400).send("No image file uploaded");
        return;
    }

    var query = `INSERT INTO schevents(eventNo, eventName, description, eventDate, poster, Location) VALUES(?, ?, ?, ?, ?, ?)`;
    connection.query(query, [eventNo, eventName, description, eventDate, poster, Location], function(error, results) {
        if (error) {
            console.error(error);
            res.status(500).send("Error adding event");
        } else {
            res.send('<p>EVENT ADDED SUCCESSFULLY</p>');
        }
    });
});
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