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
const locRouter= require('./routes/Location')
app.use('/StrathBud/Locations',locRouter)

 app.listen(5500)