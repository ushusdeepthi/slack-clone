const express=require('express')
const router=express.Router()
const User=require('../models/users')
const path=require('path')
const { ensureAuthenticated}= require('../config/auth')
const multer=require('multer');
const fs=require('fs')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
 
const upload = multer({ storage: storage });


//for profile page
router.get('/:id',ensureAuthenticated,(req,resp)=>{
    
    id=req.params.id;
    console.log(id)
    console.log(id)
    User.findById(id,(err,user)=>{
        if(err) {
            console.log(err)
            resp.status(500).send('error occured')
        }
        else{
            console.log(user)
             resp.render('profile',{user})
        }
    })   
})
router.post('/:id',ensureAuthenticated,upload.single('img'),(req,resp)=>{
    id=req.user._id
  try {
        // const profile_pic = uploadPath + req.file.filename

        if (req.file.filename) {
            User.findByIdAndUpdate(id,{$set:{img:{
                data:fs.readFileSync(process.cwd() + "/public/uploads/" + req.file.filename),
                contentType: 'image/png' }}}, 
                (error, docs) => {
                if(error){
                    return console.log(error)
                } else {
                    resp.redirect(`/profile/${id}`)
                }
            })
        }
        else {
            resp.end()
        }
    } catch (error) {
        console.log(error)
    }
})

module.exports=router