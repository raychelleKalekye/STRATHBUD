const express=require('express')
const connection=require('../database')
const router=express.Router()
const multer=require('multer')
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/',(req,res)=>{
    var query="SELECT sportsNo,sportsName,practiceDays,Location FROM sports";
    connection.query(query,function(error,data){
        if(error){
            console.error(error)
        }else{
            res.render('Sports', { title: 'StrathBud Sports', action: 'list', sportsData: data });
        }
    })
    
})