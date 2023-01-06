var express = require('express');
var router = express.Router();
var db = require('../bin/dbconnection')
var multer  = require('multer')
var date = new Date().toJSON().slice(0,10).replace(/-/g,'/');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './img')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage,
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
//       cb(null, true);
//     } else {
//       cb(null, false);
//       return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
//     }
//   },
  limits: { fileSize: 1000000 }
  

})


//var upload = upload.any()


router.post('/RegAlbum',(req,res)=>{
    const {AlbumName,Admin} = req.body
    var date = new Date().toJSON().slice(0,10).replace(/-/g,'/');
    db.sqls.query(`INSERT INTO managealbummaster (Album,CreatedBy,CreatedOn) VALUES('${AlbumName}','${Admin}','${date}')`,(err,response)=>{
        if(err) throw err

        res.json('Sucessfully Added Album : '+AlbumName)
    })

})

router.post('/editAlbum',(req,res)=>{
    const {AlbumName,Admin,AlbumId} = req.body

    db.sqls.query(`UPDATE managealbummaster SET Album='${AlbumName}', ModifiedBy='${Admin}', ModifiedOn='${date}' WHERE AlbumId=${AlbumId}`,(err,response)=>{
        if(err) throw err
        res.json('Sucessfully Updated')
    })

})

router.post('/deleteAlbum',(req,res)=>{
    const {AlbumName,Admin,AlbumId} = req.body

    db.sqls.query(`UPDATE managealbummaster SET IsDeleted='true', ModifiedBy='${Admin}', ModifiedOn='${date}' WHERE AlbumId=${AlbumId}`,(err,response)=>{
        if(err) throw err
        res.json('Sucessfully Deleted')
    })

})



router.get('/getAllAlbum',(req,res)=>{

    db.sqls.query(`SELECT * FROM managealbummaster WHERE IsDeleted !='true'`,(err,response)=>{
      if(err) throw err
      res.json(response)
    })
})

router.post('/addPhoto',upload.any(),(req,res)=>{
    //console.log(req.files)

    const {AlbumId,Title,Admin} = req.body
    
    db.sqls.query(`INSERT INTO albumphotomaster (AlbumID,Title,ImageName,ThumbImageName,CreatedBy,CreatedOn,IsAlbumImage)
    VALUES(${AlbumId}, '${Title}', '${req.files[0].originalname}', '${req.files[1].originalname}', '${Admin}', '${date}', 'true')`,(err,response)=>{
        if(err) throw err

        res.json("Successfully Added Photo")
    })
})

router.get('/getPhoto',(req,res)=>{
    
    db.sqls.query(`SELECT * FROM albumphotomaster`,(err,response)=>{
        if(err) throw err
        res.json(response)
    })

})

router.post('/editPhoto',(req,res)=>{
    const {AlbumId,Title,Admin,PhotoId} = req.body
    console.log(req.body)
    db.sqls.query(`UPDATE albumphotomaster SET AlbumID=${AlbumId},Title='${Title}',ModifiedBy='${Admin}',ModifiedOn='${date}' WHERE PhotoId=${PhotoId}`,(err,response)=>{
        if(err) throw err
        res.json('Successfully Edited')
    })
})

router.post('/editPhotoWithImage',upload.any(),(req,res)=>{
    const {AlbumId,Title,Admin,PhotoId} = req.body
    console.log(req.body)
    db.sqls.query(`UPDATE albumphotomaster SET AlbumID=${AlbumId},ImageName='${req.files[0].originalname}', ThumbImageName='${req.files[1].originalname}',Title='${Title}',ModifiedBy='${Admin}',ModifiedOn='${date}' WHERE PhotoId=${PhotoId}`,(err,response)=>{
        if(err) throw err
        res.json('Successfully Edited')
    })
})

router.post('/deletePhoto',(req,res)=>{
    const {AlbumName,Admin,AlbumId} = req.body
    console.log(req.body)
    db.sqls.query(`UPDATE albumphotomaster SET DeletedBy='${Admin}', IsDeleted='true', ModifiedBy='${Admin}', ModifiedOn='${date}' WHERE PhotoId=${AlbumId}`,(err,response)=>{
        if(err) throw err
        res.json('Sucessfully Deleted '+ AlbumId)
    })

})

router.post('/addVideo',upload.any(),(req,res)=>{
    //console.log(req.files)
    console.log(req.body)
    const {AlbumId,Title,Admin} = req.body
    
    db.sqls.query(`INSERT INTO albumvideomaster (AlbumID,Title,URL,CreatedBy,CreatedOn)
    VALUES(${AlbumId}, '${Title}', '${req.files[0].originalname}', '${Admin}', '${date}')`,(err,response)=>{
        if(err) throw err

        res.json("Successfully Added Video")
    })
})



router.get('/getVideo',(req,res)=>{
    console.log('running')
    db.sqls.query(`SELECT * FROM albumvideomaster`,(err,response)=>{
        if(err) throw err
        res.json(response)
    })

})




module.exports=router