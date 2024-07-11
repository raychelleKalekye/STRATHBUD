const express = require('express');
const connection = require('../database');

const router = express.Router();

const argon2 = require('argon2');
const multer=require('multer');
const upload=multer({dest:'./public/imgs'});


router.get('/', (req, res) => {
    res.render('admLogin');
});

router.post('/', async (req, res) => {
    console.log(req.sessionID);
    const AdmID = req.body.AdmID;
    const password = req.body.password;

    if (AdmID && password) {
        if (req.session.authenticated) {
            return res.json(req.session);
        }
    }

    const query = `SELECT * FROM admin WHERE AdmID = ?`;
    connection.query(query, [AdmID], async (error, results) => {
        if (error) {
            console.error(error);
            return res.render('admLogin', { error: 'An error occurred. Please try again later.' });
        }

        if (results.length === 0) {
            return res.render('admLogin', { error: 'Invalid admission number' });
        }

        const storedPassword = results[0].password;

        try {
            if (!await argon2.verify(storedPassword, password)) {
                return res.render('admLogin', { error: 'Incorrect password. Try again' });
            } else {
                req.session.authenticated = true;
                req.session.user = { AdmID, password };
                res.render('admmainMenu');
            }
        } catch (err) {
            console.error(err);
            return res.render('admLogin', { error: 'An error occurred. Please try again later.' });
        }
    });
});

router.get('/Signup',(req,res)=>{
    res.render('admSignup')
})

router.post('/Signup', async (req, res) => {
    const { AdmID, password, confirm_Password } = req.body;
    
   
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

        const query = `INSERT INTO admin (AdmID, password) VALUES ( ?, ?)`;
        connection.query(query, [AdmID, hashedPassword], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).send("<p>Internal Server Error</p>");
            }
            res.render('admLogin'); 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("<p>Internal Server Error</p>");
    }
});

router.get('/passwordReset',(req,res)=>{
    res.render('admpasReset')
})
router.post('/passwordReset',(req,res)=>{
   var AdmID=req.body.AdmID;
   var query=`SELECT AdmID FROM admin WHERE AdmID=? `;
   connection.query(query,[AdmID],function(error,results){
       if(error){
           console.error(error);


       }else{
           res.render('admpasRecovery')
       }
   })
})


router.post('/passwordRecovery', async (req, res) => {
   const { AdmID, password } = req.body;

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

       const query = `UPDATE admin SET password = ? WHERE AdmID = ?`;
       connection.query(query, [hashedPassword, AdmID], (error, results) => {
           if (error) {
               console.error(error);
               return res.status(500).send("<p>Internal Server Error</p>");
           }

           if (results.affectedRows === 0) {
               return res.status(404).send("<p>Admin ID not found</p>");
           }

           res.redirect('/Strathbud/admLogin');
       });
   } catch (error) {
       console.error(error);
       res.status(500).send("<p>Internal Server Error</p>");
   }
});

router.get('/mainMenu',(req,res)=>{
 
    res.render('admmainMenu');
})


router.get('/admEvents',(req,res)=>{
    var query="SELECT eventNo,eventName,description,eventDate FROM schevents ORDER BY eventDate";
    connection.query(query,function(error,data){
        if(error){
            console.error(error)
        }else{
            res.render('Admevents', { title: 'StrathBud Events', action: 'list', eventsData: data });
        }
    })
    
})
router.get('/admEvents/newEvent',(req,res)=>{
    res.render('Admevents', { title: 'StrathBud Events', action: 'add'});
})
router.post('/admEvents/newEvent', upload.single('poster'), (req, res) => {
    console.log('File upload:', req.file); 

    var eventNo = req.body.eventNo;
    var eventName = req.body.eventName;
    var description = req.body.description;
    var eventDate = req.body.eventDate;
    var Location = req.body.Location;
    var poster;

    if (req.file) {
        poster = req.file.buffer.toString('base64'); 
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
router.get('/admEvents/:eventNo', (req, res) => {
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
            console.log('Event Data:', eventData);  
            res.render('admEventDetails', { eventData });
        }
    });
    
})
router.get('/admEvents/editEvent/:eventNo', (req, res) => {
    const eventNo = req.params.eventNo;
    const query = "SELECT * FROM schevents WHERE eventNo = ?";
    
    connection.query(query, [eventNo], (error, data) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error fetching event details');
        } else {
            if (data.length > 0) {
                const event = data[0]; 
                res.render('Admevents', { title: 'StrathBud Events', action: 'edit', eventsData: event });
            } else {
                res.status(404).send('Event not found');
            }
        }
    });
});

router.post('/admEvents/editEvent', upload.single('poster'), (req, res) => {
    const eventNo = req.body.eventNo;
    const eventName = req.body.eventName;
    const description = req.body.description;
    const eventDate = req.body.eventDate;
    const Location = req.body.Location;
    const poster = req.file ? req.file.buffer.toString('base64') : null;

    const query = "UPDATE schevents SET eventName = ?, description = ?, eventDate = ?, Location = ?, poster = ? WHERE eventNo = ?";

    connection.query(query, [eventName, description, eventDate, Location, poster, eventNo], (error, results) => {
        if (error) {
            console.error('Error updating event:', error);
            res.status(500).send('Error updating event');
        } else if (results.affectedRows === 0) {
            console.warn('No rows were updated:', results);
            res.status(404).send('No event found with the specified eventNo');
        } else {
            console.log("Event updated successfully:", results);
            res.redirect('/Strathbud/Admin/admEvents'); 
        }
    });
});

router.delete('/admEvents/deleteEvent/:eventNo', (req, res) => {
    const eventNo = req.params.eventNo;
    const query = "DELETE FROM schevents WHERE eventNo = ?";

    connection.query(query, [eventNo], (error, results) => {
        if (error) {
            console.error('Error deleting event:', error);
            res.status(500).send('Error deleting event');
        } else {
            console.log("Event deleted successfully");
            res.status(200).send('Event deleted successfully');
        }
    });
});
router.get('/admSports', (req, res) => {
    var query = "SELECT * FROM sports";
    connection.query(query, function(error, data) {
        if (error) {
            console.error(error);
        } else {
            res.render('admSports', { title: 'StrathBud Sports', action: 'list', sportsData: data });
        }
    });
});

router.get('/admSports/newSport', (req, res) => {
    res.render('Sports', { title: 'StrathBud Sports', action: 'add' });
});
router.post('/admSports/newSport', (req, res) => {
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


router.get('/admSports/:sportsNo', (req, res) => {
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
            res.render('AdmsportsDetails', { sportsData });
        }
    });
});

router.get('/admSports/editSport/:sportNo', (req, res) => {
    const sportsNo = req.params.sportsNo;
    const query = "SELECT * FROM sports WHERE sportsNo = ?";
    
    connection.query(query, [sportsNo], (error, data) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error fetching sports details');
        } else {
            if (data.length > 0) {
                const sport = data[0]; 
                res.render('admSports', { title: 'StrathBud Sports', action: 'edit', sportsData:sports });
            } else {
                res.status(404).send('Sport not found');
            }
        }
    });
});

router.post('/admSports/editSport', (req, res) => {
    var sportsNo = req.body.sportsNo;
    var sportsName = req.body.sportsName;
    var sportsLeader = req.body.sportsLeader;
    var practiceDays = req.body.practiceDays;
    var registrationLink = req.body.Registration_link;
    var Location = req.body.Location;

    const query = "UPDATE sports SET sportsName = ?,sportsLeader=?, practiceDays = ?, Registration_link = ?, Location = ? WHERE eventNo = ?";

    connection.query(query, [sportsName, sportsLeader, practiceDays, Location,sportsNo], (error, results) => {
        if (error) {
            console.error('Error updating sport:', error);
            res.status(500).send('Error updating sport');
        } else if (results.affectedRows === 0) {
            console.warn('No rows were updated:', results);
            res.status(404).send('No sport found with the specified sportsNo');
        } else {
            console.log("Sport updated successfully:", results);
            res.redirect('/Strathbud/Admin/admSport'); 
        }
    });
});

router.delete('/admSports/deleteSport/:sportsNo', (req, res) => {
    const sportsNo = req.params.sportsNo;
    const query = "DELETE FROM sports WHERE sportsNo = ?";

    connection.query(query, [sportsNoNo], (error, results) => {
        if (error) {
            console.error('Error deleting sport:', error);
            res.status(500).send('Error deleting sport');
        } else {
            console.log("Sport deleted successfully");
            res.status(200).send('Sport deleted successfully');
        }
    });})
module.exports = router;







