
const express = require('express');
const session = require('express-session');
const store = new session.MemoryStore();
const app = express();

app.use(session({
    secret: 'some secret',
    cookie: { maxAge: 30000 },
    saveUninitialized: true,
    store,
    resave: false
}));

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(store);
    next();
});

app.get("/", (req, res) => {
    console.log('Here');
    res.send("Hi");
});
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
const grievanceRouter=require('./routes/grievances')
app.use('/Strathbud/Grievances',grievanceRouter)
const adminRouter=require('./routes/admin')
app.use('/Strathbud/Admin',adminRouter)
app.listen(5500)