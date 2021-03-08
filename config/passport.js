const LocalStrategy=require('passport-local')
const bcrypt= require('bcrypt')
const User=require('../models/users')

const passport_function= function(passport){
    passport.use(
        new LocalStrategy({usernameField:'email'},(email,password,done)=>{
            // Match a user
            User.findOne({email:email})
                .then(user=>{ 
                    //this gives us either user or null so we have give a consition if it is not user
                    if(!user){
                    return done(null,false,{message:'The email is not registered'})
                    //the above return statement done takes 3 parameters
                    //1- null which represents the error
                    //2- false which represents user
                    //3- and an option where we give the message
                }
                //so herer there is a use so -Match password 
                bcrypt.compare(password,user.password,(err,isMatch)=>{
                    if(err){
                        throw err
                    }
                    if(isMatch){
                        return done(null,user)
                    }
                    else{
                        return done(null,false,{message:'Password incorrect'})
                    }
                })

            })
            .catch(err=>console.log(err))
        }))
        passport.serializeUser(function(user, done) {
            done(null, user.id);
        });

        passport.deserializeUser(function(id, done) {
            User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}
module.exports=passport_function