const express=require('express')
const connection=require('../database')
const router=express.Router()
router.get('/',(req,res)=>{

    res.render('mainMenu')
})

module.exports=router;
