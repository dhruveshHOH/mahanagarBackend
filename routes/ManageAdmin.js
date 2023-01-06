var express = require('express');
var router = express.Router();
var db = require('../bin/dbconnection')


router.get('/getAllManageUser',(req,res)=>{

    db.sqls.query(`SELECT * FROM adminuser`,(err,response)=>{
      if(err) throw err
      res.json(response)
    })
})


router.post('/blockAdminUser',(req,res)=>{
    db.sqls.query(`UPDATE adminuser SET IsLocked='true' WHERE AdminUserId=${req.body.id}`,(err,response)=>{
        if(err) throw err

        res.json('Successfully Blocked')
    })
})

router.post('/changePassword',(req,res)=>{
    const {confPass,AdminId,Admin} = req.body

    var date = new Date().toJSON().slice(0,10).replace(/-/g,'/');

    db.sqls.query(`UPDATE adminuser SET Password='${confPass}',ModifiedBy='${Admin}',ModifiedOn='${date}' WHERE AdminUserId=${AdminId}`,(err,response)=>{
        if(err) throw err

        res.json('Successfully Changed Password')
    })
})

router.post('/deleteUser',(req,res)=>{
    const {id,Admin} = req.body
    var date = new Date().toJSON().slice(0,10).replace(/-/g,'/');
    //console.log(req.body)
    db.sqls.query(`UPDATE adminuser SET IsDeleted='true',ModifiedBy='${Admin}',ModifiedOn='${date}' WHERE AdminUserId=${id}`,(err,response)=>{
        if(err) throw err

        res.json('Successfully Deleted')
    })
})
  
module.exports = router;