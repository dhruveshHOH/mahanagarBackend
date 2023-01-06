var express = require('express');
var router = express.Router();
var db = require('../bin/dbconnection')

/* GET home page. */

router.post('/register', (req, res)=>{
  //res.setHeader('Access-Control-Allow-Origin', '*');
  const {LoginId,Password,Email,Contact,IsSuperUser,createdBy} = req.body
  var date = new Date().toJSON().slice(0,10).replace(/-/g,'/');

  //console.log(req.body)
  db.sqls.query(`SELECT LoginId FROM adminuser WHERE LoginId='${LoginId}'`,(err,result)=>{
    if(err) throw err
    if(result.length===0){
      db.sqls.query(`INSERT INTO adminuser(LoginId,Password,Email,Contact,IsSuperAdmin,CreatedBy,CreatedOn) 
      VALUES('${LoginId}', '${Password}', '${Email}','${Contact}','${IsSuperUser}','${createdBy}','${date}')`,(err,info)=>{
        if(err) throw err
        res.json("Successfully Added Data")
      })
    }else{

      res.json("User Already Exist")

    }
  })
});

router.post('/login',(req,res)=>{
  const {loginId,password} = req.body
  
  db.sqls.query(`SELECT * FROM adminuser WHERE LoginId='${loginId}' AND IsLocked !='true' AND Password='${password}'`,(err,result)=>{
      if(err) throw err
      if(result.length === 0){
          res.json("Invalid Crediential")
      }else{

        res.json({FirstName: loginId, Email :result[0].Email, Role:result[0].IsSuperAdmin})
      }
  })
})


module.exports = router;
