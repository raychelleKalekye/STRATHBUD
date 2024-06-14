var mysql=require('mysql2')
var connection=mysql.createConnection({
    host:'localhost',
    database:'strathbud',
    user:'root',
    password:'Lovelorn123'
})
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to database');
    }
});

module.exports = connection;