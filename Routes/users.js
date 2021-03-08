const express=require('express')
const router=express.Router()
const bcrypt= require('bcrypt')
const passport=require('passport')

const User=require('../models/users')
require('../config/passport')(passport)

router.get('/login',(req,resp)=>{
    resp.render('login')
})
router.get('/register',(req,resp)=>{
    resp.render('register')
})

router.post('/login',(req,resp,next)=>{
    passport.authenticate('local', {
        successRedirect: '/channels',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, resp, next)
})

router.post('/register',(req,resp)=>{
    let errors=[]
    const {name,email,password,confirm_password}=req.body
    if(!name || !email || !password || !confirm_password){
        errors.push({msg:'Please fill out all the fields'})
    }
    if (password != confirm_password) {
        errors.push({ msg: 'Passwords do not match' });
    }
    if(password.length<6 ){
        errors.push({ msg: 'Password must conatin atleast 6 characters' });
    }
    if(errors.length>0){
        resp.render('register',{
            errors,
            name,
            email,
            password,
            confirm_password
        })
    }
    else{
        const newUser=new User({
            name:name,
            email:email,
            password:password
        })
        bcrypt.hash(password,10,(err,hash)=>{
            newUser.password=hash
            newUser.save()
                .then(result=>{
                    console.log(result)
                    req.flash('success_msg','You have been succesfully registered!')
                    resp.redirect('/users/login')
                })
                .catch(err=>{
                    console.log(err)
                })
        })
    }
})
router.get('/logout',(req,resp)=>{
 req.logout()
 req.flash('success_msg','successfully logged out')
resp.redirect('/users/login')
})




module.exports=router