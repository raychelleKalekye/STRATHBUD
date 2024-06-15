const express = require('express')

const app= express()


app.set('view engine','ejs')
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.get("/",(req,res)=>{
    console.log('Here')
    res.send("Hi")
})
const indexRouter= require('./routes/index')
app.use('/StrathBud',indexRouter)
const menuRouter= require('./routes/mainMenu')
app.use('/StrathBud/mainMenu',menuRouter)
const eventsRouter= require('./routes/Events')
app.use('/StrathBud/Events',eventsRouter)
const sportsRouter= require('./routes/Sports')
app.use('/StrathBud/Sports',sportsRouter)
const locRouter= require('./routes/Location')
app.use('/StrathBud/Locations',locRouter)
const clubRouter= require('./routes/Clubs')
app.use('/StrathBud/ClubsandSocieties',clubRouter)
const amenitiesRouter= require('./routes/amenities')
app.use('/StrathBud/SocialAmenities',amenitiesRouter)
 app.listen(5500)